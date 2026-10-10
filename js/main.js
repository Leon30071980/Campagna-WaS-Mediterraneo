import { signIn, signOut, resumeSession } from './auth.js';
import { loadCampaign, saveLogistics } from './api.js';
import { SEASONS } from './config.js';

// Fedeltà visiva: fogli CSS e testate sono estratti senza modifiche dagli HTML originali.
// Sicurezza: nessun dato di flotta o nome di squadra avversario è presente nei file pubblici.
// Questa versione è in SOLA LETTURA finché non saranno implementate le funzioni Nhost protette.
const $ = id => document.getElementById(id);
const TABS = [['porto','Porto'],['battaglia','Battaglia'],['storico','Storico'],['navi','Naviglio'],['aerei','Aerei'],['regole','Regole']];
const ORDER = ['BB1','BB2','BB3','AIR','CA1','CA2','CA3','CL1','CL2','CL3','CL4','CV1','SUB'];
const COLORS = Object.freeze({BB:'#B33939',BC:'#E08283',CA:'#1B4F72',CL:'#7FB3D5',DD:'#2E8B57',CV:'#17A398',SUB:'#6C3483',B:'#6B4A32',DB:'#8B6F47',F:'#7E7E7E',FB:'#54585B',HB:'#4A3728',PB:'#6E6259',TB:'#5C6670'});
let model = null, activeTab = 'porto', term = '', catalogFilter = '', theme = '', saving = false;

function make(tag, className = '', content) { const x=document.createElement(tag); if(className)x.className=className; if(content!==undefined && content!==null)x.textContent=String(content); return x; }
function text(parent,tag,value,cls='') {const e=make(tag,cls,value);parent.append(e);return e;}
function toast(message,isError=false){ const x=$('toast');x.textContent=message;x.style.color=isError?'var(--sunk)':'';x.classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove('on'),3800); }
function themeApply(){if(theme)document.documentElement.setAttribute('data-theme',theme);else document.documentElement.removeAttribute('data-theme');}
function showLogin(){ model=null;$('command-root').replaceChildren();$('app-page').hidden=true;$('login-page').hidden=false;$('password').value='';document.title='Campagna Mediterraneo — Accesso'; }
function campaignYear(){return Number((SEASONS[model.campaign.turn_index]||'1940').match(/20\d\d/)?.[0]||1940);}
function shipBase(name){return String(name||'').replace(/\s*\((I|II|III)\)$/,'');}
function lossStatus(name) {
 const loss=model.state.perdite||{};let r=loss[name];
 if(!r){for(const [k,v] of Object.entries(loss))if(shipBase(k)===shipBase(name)){r=v;if(v.stato==='affondata')break;}}
 if(!r)return 'attiva';
 if(r.stato==='affondata')return 'affondata';
 return model.campaign.turn_index <= Number(r.turno)+1?'riparazione':'attiva';
}
function fleetTotals(){
 const year=campaignYear(), seen=new Set();const lists={attiva:[],riparazione:[],affondata:[]};
 const sorted=[...(model.state.navi||[])].sort((a,b)=>{
  const ok=n=>Number(n.anno)<=year && !(n.ritirato && year>=Number(n.ritirato));return Number(ok(b))-Number(ok(a));
 });
 for(const n of sorted){const base=shipBase(n.nome);if(seen.has(base))continue;const status=lossStatus(n.nome);
  if(status==='affondata'||status==='riparazione'){lists[status].push(n);seen.add(base);}
  else if(Number(n.anno)<=year&&!(n.ritirato&&year>=Number(n.ritirato))){lists.attiva.push(n);seen.add(base);}
 }
 return lists;
}
function scores(){
 const history=Array.isArray(model.state.storico)?model.state.storico:[];
 // In entrambe le versioni HTML originali pAll=proprio, pAsse=nemico.
 let own=Number(model.state.punteggioBaseAll)||0,other=Number(model.state.punteggioBaseAsse)||0;
 for(const row of history){own+=Number(row.pAll)||0;other+=Number(row.pAsse)||0;}
 if(model.results.length && !history.length){ // risultati Nhost consolidati, per gli storici futuri
  own+=model.results.reduce((s,r)=>s+Number(r.own_score||0),0);
  other+=model.results.reduce((s,r)=>s+Number(r.opponent_score||0),0);
 }
 return {own,other};
}
function showApp(){
 $('login-page').hidden=true;$('app-page').hidden=false;
 document.body.dataset.side=model.side;
 $('side-css').href=model.side==='axis'?'./css/regia.css':'./css/royal.css';
 const root=$('command-root');root.replaceChildren();
 root.append($('header-'+model.side).content.cloneNode(true));
 const status=make('div','nhost-statusbar');status.id='nhost-statusbar';status.textContent='Nhost connesso · '+(model.side==='axis'?'Axis':'Allies')+' · Salvataggio protetto · Revisione '+model.stateRevision;
 root.append(status);
 const wrap=make('div','wrap');
 const warning=make('div','nhost-status nhost-synced','Dati privati Nhost · Porto e cataloghi modificabili quando non è stata generata una battaglia. Le estrazioni e la conclusione rimangono in preparazione.');wrap.append(warning);
 for(const [id] of TABS){const p=make('section','panel');p.id='p-'+id;wrap.append(p);}
 root.append(wrap);
 $('btn-refresh').addEventListener('click',async()=>{try{await refresh();toast('Dati aggiornati da Nhost.');}catch(e){toast(e.message,true);}});
 $('btn-logout').addEventListener('click',async()=>{await signOut();showLogin();toast('Disconnessione eseguita.');});
 $('btn-tema').addEventListener('click',()=>{theme=theme==='dark'?'light':theme==='light'?'':'dark';themeApply();localStorage.setItem('campagna-v02-theme',theme);});
 document.title=(model.side==='axis'?'Regia Marina':'Royal Navy')+' — Mediterraneo 1940–43';
 render();
}
function render(){if(!model)return;renderTabs();renderPennant();const p=$('p-'+activeTab);if(!p)return;p.replaceChildren();
 if(activeTab==='porto')renderPort(p);else if(activeTab==='battaglia')renderBattle(p);else if(activeTab==='storico')renderHistory(p);
 else if(activeTab==='navi'||activeTab==='aerei')renderCatalog(p,activeTab);else renderRules(p);
}
function renderTabs(){const nav=$('tabs');nav.replaceChildren();for(const [id,label]of TABS){
 const b=make('button','',label);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(id===activeTab));b.onclick=()=>{if(activeTab!==id){activeTab=id;term='';catalogFilter='';}render();};nav.append(b);
 $('p-'+id).classList.toggle('on',id===activeTab);
}}
function renderPennant(){const p=$('pennant');p.replaceChildren();const fleets=fleetTotals();const pts=scores();
 const cells=[['Seleziona Turno',String(model.campaign.turn_index+1)+' ('+(SEASONS[model.campaign.turn_index]||'—')+')'],['Stagione',SEASONS[model.campaign.turn_index]||'—']];
 for(const [key,value] of cells){const c=make('div','cell');text(c,'div',key,'k');text(c,'div',value,'v');p.append(c);}
 const cell=make('div','cell');text(cell,'div','Stato del naviglio','k');const state=make('div','nhost-summary');
 for(const [key,label,cls]of [['attiva','Operative','ok'],['riparazione','In riparazione','ripara'],['affondata','Perse','sunk']]){
  const d=make('div');text(d,'div',label,'k '+cls);text(d,'div',fleets[key].length,'v num '+cls);state.append(d);
 }
 cell.append(state);p.append(cell);
 for(const [k,v]of [['Punteggio proprio',pts.own],['Punteggio nemico',pts.other]]){const c=make('div','cell');text(c,'div',k,'k');text(c,'div',v.toFixed(1),'v num');p.append(c);}
}
function card(title,tag=''){const c=make('div','card');const hd=make('h3');text(hd,'span',title);if(tag)text(hd,'span',tag,'tag');c.append(hd);return c;}
function note(p,message){text(p,'div',message,'nhost-info');}
function summary(p,pairs){const grid=make('div','nhost-summary');for(const [l,val]of pairs){const box=make('div');text(box,'div',l,'k');text(box,'div',val,'v num');grid.append(box);}p.append(grid);}
function sortedSquads(){const x=model.state.ui_squadre;const list=Array.isArray(x)?x:[];const fromDb=new Map(list.map(s=>[s.id,s]));const keys=new Set([...ORDER,...Object.keys(model.state.porto||{})]);return [...keys].map(id=>fromDb.get(id)||{id,nome:id,forma:'mista',nucleo:{n:2,cls:[]},scorta:{n:0,cls:[]}});}
function canEdit(){return model && !saving && model.campaign.phase==='battle' && !model.campaign[model.side+'_concluded'] && !model.state.battaglia;}
function cloneState(){return structuredClone(model.state);}
function catalogMap(state=model.state){return new Map([...(state.navi||[]),...(state.aerei||[])].map(u=>[u.nome,u]));}
function isShip(unit){return unit && Object.hasOwn(unit,'cls');}
function available(unit){if(!unit)return false;const yr=campaignYear();return Number(unit.anno)<=yr && (!unit.ritirato || yr<Number(unit.ritirato)) && (!isShip(unit)||lossStatus(unit.nome)==='attiva');}
function matchClass(unit,cls){return unit && (cls||[]).some(x=>x===unit.cls||x===unit.tipo);}
function baseName(name){return String(name).replace(/\s*\((I|II|III)\)$/,'');}
function assignedShips(state){const all=new Set();for(const entries of Object.values(state.porto||{}))for(const name of entries||[])if(name&&state.navi.some(x=>x.nome===name))all.add(name);return all;}
function hasCarrier(){return(model.state.navi||[]).some(x=>x.cls==='CV'&&available(x));}
function optionPool(squad,index,current){
  const cat=[...(model.state.navi||[]),...(model.state.aerei||[])];let accepted=[],classList=[];
  const nN=Number(squad.nucleo?.n)||0;
  if(squad.id==='AIR'){
    const t=squad.nucleo?.clsPerSlot?.[index];classList=t?[t]:squad.nucleo?.cls||[];
    accepted=cat.filter(u=>!isShip(u));
  }else if(squad.id==='CV1'){
    if(!hasCarrier()){
      classList=[index===0?'TB':'DB'];accepted=cat.filter(u=>!isShip(u));
    }else if(index===0){classList=['CV'];accepted=cat.filter(isShip);}
    else{classList=['AEREO_IMB'];accepted=cat.filter(u=>!isShip(u)&&u.base==='IMBARCABILE');}
  }else{
    classList=index<nN?(squad.nucleo?.clsPerSlot?.[index]?[squad.nucleo.clsPerSlot[index]]:squad.nucleo?.cls||[]):squad.scorta?.cls||[];
    accepted=cat.filter(isShip);
  }
  const used=assignedShips(model.state);const list=accepted.filter(u=>available(u)&&(
    (classList.includes('AEREO_IMB')&&u.base==='IMBARCABILE')||matchClass(u,classList)
  )&&(!isShip(u)||!used.has(u.nome)||u.nome===current));
  if(current&&!list.some(x=>x.nome===current)){const existing=cat.find(x=>x.nome===current);if(existing)list.unshift(existing);}
  return list.sort((a,b)=>a.nome.localeCompare(b.nome,'it'));
}
async function persistDraft(draft){
  if(!canEdit())throw new Error('Le modifiche sono bloccate durante una battaglia.');
  saving=true;
  try{
    const saved=await saveLogistics(draft,model.stateRevision);
    model.state=saved.state;model.stateRevision=saved.revision;model.updatedAt=saved.updatedAt;
    saving=false;render();renderPennant();toast('Modifica salvata su Nhost.');
  }catch(error){
    toast(error.message,true);
    if(/revisione|concorren|scadut/i.test(error.message)){
      try{await refresh();}catch{}
    }
    throw error;
  }finally{saving=false;}
}
function squadSlots(s,names){let nN=Number(s.nucleo?.n)||0,nS=Number(s.scorta?.n)||0;
  if(s.id==='CV1'){
    if(!hasCarrier())return{nN:0,nS:2,len:2};
    const map=catalogMap();const cv=map.get(names[0]);nS=cv?.cls==='CV'?Number(cv.hangar??3):3;
  }
  return {nN,nS,len:nN+nS};
}
function slotCard(container,s,names){
  const id=s.id, cat=catalogMap(),pts=names.reduce((acc,n)=>acc+Number(cat.get(n)?.pt||0),0);
  const sq=card(s.nome,`${id} · ${pts} pt`);sq.dataset.id=id;sq.classList.add('nhost-squadcard');
  const {nN,len}=squadSlots(s,names);
  for(let i=0;i<len;i++){
    const name=names[i]||'',u=cat.get(name)||{},type=u.tipo||'';
    const role=id==='AIR'?(s.nucleo?.clsPerSlot?.[i]||'·'):(i<nN?'·':'›');
    const r=make('div','slot nhost-slot-readonly');r.style.background=name?(COLORS[type]||'#555'):'#485764';r.style.opacity=name?'1':'.62';
    text(r,'span',role,'role');text(r,'span',type,'sigla');
    const sel=make('select','nhost-slot-select');sel.disabled=!canEdit();sel.setAttribute('aria-label',`${s.nome}, casella ${i+1}`);
    const blank=make('option','','— libera —');blank.value='';sel.append(blank);
    for(const entry of optionPool(s,i,name)){const o=make('option','',entry.nome);o.value=entry.nome;sel.append(o);}
    if(name&&!Array.from(sel.options).some(o=>o.value===name)){const o=make('option','',name+' (non disponibile)');o.value=name;sel.append(o);}
    sel.value=name;
    sel.onchange=async()=>{
      const draft=cloneState();const arr=Array.isArray(draft.porto[id])?[...draft.porto[id]]:[];
      arr[i]=sel.value;
      if(id==='CV1'&&i===0){const c=catalogMap(draft).get(sel.value);const capacity=c?.cls==='CV'?Number(c.hangar??3):3;arr.length=Math.min(arr.length,1+capacity);}
      draft.porto[id]=arr;
      try{await persistDraft(draft);}catch{render();}
    };
    r.append(sel);text(r,'span',name?String(u.pt??''):'','pt num');sq.append(r);
  }
  if(!len)text(sq,'div','Nessuna casella configurata.','nhost-card-body nhost-muted');
  container.append(sq);
}
function renderPort(p){
  const info=make('div','row');info.style.marginBottom='14px';
  const intro=make('div','note',canEdit()?'Assegna le unità alle squadre. Sono selezionabili solo quelle disponibili; ogni modifica viene salvata su Nhost.':'Porto in sola lettura: modifiche bloccate durante o dopo una battaglia.');intro.style.flex='1';info.append(intro);
  const rand=make('button','btn sm','Compila a caso le caselle vuote');rand.disabled=!canEdit();
  rand.onclick=async()=>{
    const draft=cloneState();for(const s of sortedSquads()){
      const arr=Array.isArray(draft.porto[s.id])?[...draft.porto[s.id]]:[];
      const {len}=squadSlots(s,arr);
      for(let i=0;i<len;i++){
        if(arr[i])continue;
        // Il pool rispetta le stesse condizioni visibili al giocatore.
        const pool=optionPool(s,i,'').filter(u=>!isShip(u)||!assignedShips(draft).has(u.nome));
        if(pool.length)arr[i]=pool[Math.floor(Math.random()*pool.length)].nome;
        draft.porto[s.id]=arr;
      }
    }
    try{await persistDraft(draft);}catch{}
  };info.append(rand);
  const clear=make('button','btn sm','Svuota tutte le squadre');clear.disabled=!canEdit();clear.onclick=async()=>{
    if(!confirm('Svuotare il porto? Lo storico e le perdite resteranno invariati.'))return;
    const draft=cloneState();draft.porto={};try{await persistDraft(draft);}catch{}
  };info.append(clear);p.append(info);
  const container=make('div','port-container');for(const s of sortedSquads())slotCard(container,s,Array.isArray(model.state.porto?.[s.id])?model.state.porto[s.id]:[]);
  p.append(container);
}
function controlField(form,label,value,kind,values){
  const wrapper=make('label','nhost-form-field');text(wrapper,'span',label);
  const field=values?make('select','btn sm'):make('input','btn sm');
  if(values)for(const v of values){const opt=make('option','',v[1]||v[0]);opt.value=v[0];field.append(opt);}
  else field.type=kind==='number'?'number':'text';
  if(kind==='number'){field.step='1';field.min='0';}
  field.value=value==null?'':String(value);wrapper.append(field);form.append(wrapper);return field;
}
function dialogUnit(kind,source){
  if(!canEdit())return;
  const isNave=kind==='navi',original=source||null;
  const dialog=make('dialog','nhost-edit-dialog');const form=make('form','nhost-edit-form');form.method='dialog';
  text(form,'h3',original?'Modifica '+original.nome:(isNave?'Aggiungi nave':'Aggiungi aereo'));
  const name=controlField(form,'Nome',original?.nome||'','text');name.maxLength=120;
  const cls=isNave?controlField(form,'Classe',original?.cls||'C','select', [['BB','Corazzata'],['C','Incrociatore'],['DD','Cacciatorpediniere'],['CV','Portaerei'],['SUB','Sommergibile']]):null;
  const tipo=controlField(form,'Tipo',original?.tipo|| (isNave?'CA':'F'),'text');tipo.maxLength=12;
  const anno=controlField(form,'Anno entrata in servizio',original?.anno??campaignYear(),'number');
  const ritirato=controlField(form,'Anno ritiro (vuoto = nessuno)',original?.ritirato||'','number');
  const points=controlField(form,'Punti',original?.pt??0,'number');
  const extra=isNave?controlField(form,'Hangar (solo portaerei)',original?.hangar??'','number'):controlField(form,'Base',original?.base||'LAND BASED','select',[['LAND BASED','Terrestre'],['IDRO','Idrovolante'],['IMBARCABILE','Imbarcabile']]);
  const buttons=make('div','nhost-form-buttons');const cancel=make('button','btn','Annulla');cancel.type='button';cancel.onclick=()=>dialog.close();const save=make('button','btn primary','Salva su Nhost');save.type='submit';buttons.append(cancel,save);form.append(buttons);dialog.append(form);document.body.append(dialog);
  dialog.addEventListener('close',()=>dialog.remove());
  form.onsubmit=async e=>{
    e.preventDefault();if(!canEdit())return;
    const newName=name.value.trim();const year=Number(anno.value),score=Number(points.value),retired=ritirato.value.trim()?Number(ritirato.value):null;
    if(!newName||!tipo.value.trim()||!Number.isInteger(year)||year<1900||year>2050||!Number.isFinite(score)||score<0||score>1000|| (retired!==null&&(!Number.isInteger(retired)||retired<1900||retired>2050))){toast('Verificare nome, anno e punti.',true);return;}
    const draft=cloneState(),items=draft[kind],other=draft[isNave?'aerei':'navi'];
    if([...items,...other].some(u=>u.nome===newName&&u.nome!==original?.nome)){toast('Nome già presente nel catalogo.',true);return;}
    const value=original?{...original}:{},prevName=original?.nome;
    Object.assign(value,{nome:newName,tipo:tipo.value.trim(),anno:year,pt:score,ritirato:retired});
    if(isNave){value.cls=cls.value;value.stato=value.stato||'';if(cls.value==='CV')value.hangar=extra.value===''?3:Number(extra.value);else delete value.hangar;}
    else value.base=extra.value;
    if(original){const idx=items.findIndex(u=>u.nome===prevName);if(idx<0){toast('Unità non più presente.',true);return;}items[idx]=value;}
    else items.push(value);
    if(prevName&&prevName!==newName)for(const slots of Object.values(draft.porto||{}))for(let i=0;i<slots.length;i++)if(slots[i]===prevName)slots[i]=newName;
    save.disabled=true;
    try{await persistDraft(draft);dialog.close();}catch{save.disabled=false;}
  };
  dialog.showModal();
}
async function removeUnit(kind,item){
 if(!canEdit())return;const oldName=item.nome;
 const msg='Rimuovere '+oldName+' dal catalogo? Le eventuali caselle occupate saranno liberate. Unità presenti nello storico o fra le perdite non possono essere rimosse.';
 if(!confirm(msg))return;
 const draft=cloneState();draft[kind]=draft[kind].filter(u=>u.nome!==oldName);
 for(const arr of Object.values(draft.porto||{}))for(let i=0;i<arr.length;i++)if(arr[i]===oldName)arr[i]='';
 try{await persistDraft(draft);}catch{}
}
function renderCatalog(p,tab){
 const ships=tab==='navi',source=(ships?model.state.navi:model.state.aerei)||[];
 const add=card(ships?'Aggiungi nave':'Aggiungi aereo');const body=make('div','nhost-card-body');const bt=make('button','btn primary',ships?'Aggiungi nave':'Aggiungi aereo');bt.disabled=!canEdit();bt.onclick=()=>dialogUnit(tab);body.append(bt);
 text(body,'div',canEdit()?'Può modificare le anagrafiche; ogni salvataggio è immediato sul database.':'Modifiche bloccate finché è in corso una battaglia.','nhost-notification');add.append(body);p.append(add);
 const bar=make('div','nhost-actions');bar.style.marginTop='12px';const sel=make('select','btn sm');
 const opts=ships?[['','Tutte le classi'],['BB','Corazzate'],['C','Incrociatori'],['DD','Cacciatorpediniere'],['CV','Portaerei'],['SUB','Sommergibili']]:[['','Tutte le basi'],['LAND BASED','Terrestri'],['IDRO','Idrovolanti'],['IMBARCABILE','Imbarcati']];
 for(const [value,label] of opts){const o=make('option','',label);o.value=value;sel.append(o);}sel.value=catalogFilter;
 const search=make('input','btn sm nhost-search');search.type='search';search.placeholder='Cerca un nome';search.value=term;search.setAttribute('aria-label','Cerca unità');
 bar.append(sel,search);text(bar,'span',`Catalogo privato: ${source.length} voci`,'note');p.append(bar);
 const wrap=make('div','card scroll-x');p.append(wrap);
 const update=()=>{
  const filtered=source.filter(x=>{const c=!catalogFilter||(ships?x.cls===catalogFilter:x.base===catalogFilter);return c&&(String(x.nome||'')+' '+String(x.tipo||'')).toLocaleLowerCase('it').includes(term.toLocaleLowerCase('it'));});
  wrap.replaceChildren();const tbl=make('table');const thead=make('thead');const header=make('tr');const fields=ships?['Nome','Tipo','Punti','Anno','Ritiro','Stato','Azioni']:['Nome','Tipo','Punti','Anno','Base','Azioni'];
  for(const col of fields)text(header,'th',col);thead.append(header);tbl.append(thead);const tbody=make('tbody');
  for(const u of filtered){const row=make('tr');const values=ships?[u.nome,u.tipo,u.pt,u.anno,u.ritirato||'—',lossStatus(u.nome)]:[u.nome,u.tipo,u.pt,u.anno,u.base||'—'];
   values.forEach((v,i)=>{const td=make('td',i===2?'r num':'',v??'—');if(i===1&&COLORS[u.tipo])td.style.color=COLORS[u.tipo];row.append(td);});
   const action=make('td','nhost-catalog-actions');const edit=make('button','btn sm','Modifica');edit.disabled=!canEdit();edit.onclick=()=>dialogUnit(tab,u);
   const del=make('button','btn sm danger','Rimuovi');del.disabled=!canEdit();del.onclick=()=>removeUnit(tab,u);action.append(edit,del);row.append(action);tbody.append(row);
  }
  tbl.append(tbody);wrap.append(tbl);if(!filtered.length)text(wrap,'div','Nessuna unità trovata.','nhost-card-body note');
 };
 sel.onchange=()=>{catalogFilter=sel.value;update();};search.oninput=()=>{term=search.value;update();};update();
}
function renderBattle(p){const battle=model.state.battaglia;
 if(!battle){const empty=make('div','empty');text(empty,'div',`Nessuna formazione in mare per ${SEASONS[model.campaign.turn_index]||'questa stagione'}.`);const b=make('button','btn primary','Genera formazione');b.style.marginTop='10px';b.disabled=true;empty.append(b);p.append(empty);}
 else {const c=card('Forza in mare',`${battle.totale||0} pt · seme ${battle.seed??'—'}`);const body=make('div','nhost-card-body');for(const g of battle.gruppi||[]){const sq=card(g.squadra,`${g.pt||0} pt`);const rows=make('div','nhost-card-body');for(const unit of g.unita||[]){const row=make('div','nhost-row');text(row,'span',unit.nome);text(row,'span',`${unit.pt} pt · ${unit.esito}`,'num');rows.append(row);}sq.append(rows);body.append(sq);}c.append(body);p.append(c);}
 const box=card('Conclusione battaglia');const inner=make('div','nhost-card-body');note(inner,'I tre dati dell’avversario vengono calcolati automaticamente, ma soltanto dopo le conferme finali di Axis e Allies. Le formazioni avversarie non diventano pubbliche.');
 summary(inner,[['Axis conclusa',model.campaign.axis_concluded?'Sì':'No'],['Allies conclusa',model.campaign.allies_concluded?'Sì':'No'],['Axis pronto',model.campaign.axis_ready?'Sì':'No'],['Allies pronto',model.campaign.allies_ready?'Sì':'No']]);
 const b=make('button','btn primary','Concludi battaglia');b.style.marginTop='14px';b.disabled=true;inner.append(b);text(inner,'div','Funzione non ancora attiva. Nessun risultato può essere inviato finché non saranno installati i controlli server.','nhost-notification');box.append(inner);p.append(box);
}
function renderHistory(p){const rows=Array.isArray(model.state.storico)?model.state.storico:[];const results=model.results||[];
 if(!rows.length&&!results.length){const blank=make('div','empty','Nessuna battaglia registrata. Lo storico sarà compilato dopo le due conclusioni.');p.append(blank);return;}
 const c=card('Andamento della campagna');const table=make('table');const head=make('thead');const tr=make('tr');for(const x of ['Stagione','Punti propri','Punti nemici','Danni subiti','Navi perse'])text(tr,'th',x);head.append(tr);table.append(head);const tbody=make('tbody');
 if(results.length){for(const r of results){const line=make('tr');for(const x of [SEASONS[r.turn_index]||r.turn_index,Number(r.own_score).toFixed(1),Number(r.opponent_score).toFixed(1),Number(r.damage_suffered).toFixed(1),'—'])text(line,'td',x);tbody.append(line);}}
 else for(const r of rows){const line=make('tr');for(const x of [r.turno,Number(r.pAll||0).toFixed(1),Number(r.pAsse||0).toFixed(1),Number(r.danniSubiti||0).toFixed(1),r.navi?.perse?.length??'—'])text(line,'td',x);tbody.append(line);}
 table.append(tbody);const wrapper=make('div','scroll-x');wrapper.append(table);c.append(wrapper);p.append(c);
}
function renderRules(p){const row=make('div','row');
 for(const [title,entries]of [['Regole della campagna',['Un’unica campagna e un unico turno condivisi fra Axis e Allies.','Ogni fazione vede solo i propri cataloghi, porti e formazioni.','Navi affondate: perdita definitiva. Navi danneggiate: riparazione secondo le regole originali.','Aerei distrutti: contano come danno nella battaglia ma non vengono radiati permanentemente.']],['Chiusura e sincronizzazione',['Ogni giocatore registra esclusivamente i danni subiti dalla propria flotta.','«Concludi battaglia» congela la formazione e i danni del giocatore.','Dopo entrambe le conclusioni il server calcola automaticamente i tre valori del nemico e i punteggi.','Il turno avanza soltanto quando entrambi premono «Pronto per il prossimo turno».']]]){
  const c=card(title);c.style.flex='1 1 420px';const content=make('div','nhost-card-body');const ol=make('ol');for(const entry of entries)text(ol,'li',entry);content.append(ol);c.append(content);row.append(c);
 }
 p.append(row);note(p,'L’ordine di estrazione, i criteri dei rinforzi e gli altri dettagli delle Regole originali saranno integrati nel motore di gioco condiviso, senza alterare il comportamento delle due versioni HTML.');
}
async function refresh(){const m=await loadCampaign();if(!['axis','allies'].includes(m.side))throw new Error('Fazione non valida.');
 if(!Array.isArray(m.state.navi)||!Array.isArray(m.state.aerei)||!m.state.porto)throw new Error('Catalogo Nhost incompleto: verificare importazione 005.');
 const oldSide=model?.side;model=m;
 if(oldSide!==m.side || !$('p-porto'))showApp();else{const status=$('nhost-statusbar');if(status)status.textContent=`Nhost connesso · ${m.side} · Salvataggio protetto · Revisione ${m.stateRevision}`;render();}
}
$('login-form').addEventListener('submit',async ev=>{ev.preventDefault();const b=$('login-submit');b.disabled=true;b.textContent='Accesso…';$('login-error').hidden=true;
 try{await signIn($('email').value.trim(),$('password').value,$('remember').checked);await refresh();toast('Accesso riuscito: Quadro Comando caricato.');}
 catch(e){$('login-error').hidden=false;$('login-error').textContent=e.message;await signOut();showLogin();$('login-error').hidden=false;$('login-error').textContent=e.message;}
 finally{b.disabled=false;b.textContent='Accedi';}
});
$('show-password').addEventListener('click',()=>{const x=$('password');x.type=x.type==='password'?'text':'password';$('show-password').textContent=x.type==='password'?'Mostra password':'Nascondi password';});
try{theme=localStorage.getItem('campagna-v02-theme')||'';themeApply();}catch{}
$('dlg-ok').addEventListener('click',()=>$('dlg').close());
(async()=>{try{if(await resumeSession())await refresh();else showLogin();}catch(e){await signOut();showLogin();toast('Sessione non valida: acceda nuovamente.',true);}})();
