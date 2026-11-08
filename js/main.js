import { signIn, signOut, resumeSession } from './auth.js';
import { loadCampaign, saveLogistics, saveBattle, concludeBattle, markReady, watchCampaign, createCampaignSave, renameCampaignSave, deleteCampaignSave, requestCampaignLoad, requestCampaignReset, setScenarioScore, resolveCampaignRequest } from './api.js';
import { generateBattle } from './battle-engine.js';
import { SEASONS } from './config.js';

// Fedeltà visiva: fogli CSS e testate sono estratti senza modifiche dagli HTML originali.
// Sicurezza: nessun dato di flotta o nome di squadra avversario è presente nei file pubblici.
// I cataloghi e il porto restano privati e sono salvati con mutazioni protette Nhost.
const $ = id => document.getElementById(id);
// v0.7.4 — Favicon incorporati: nessuna dipendenza da percorsi di file PNG su GitHub.
// Immagini 64x64 ottimizzate; il lato e' preso solo dalla sessione Nhost autenticata.
const APP_FAVICON_DATA = Object.freeze({
  axis: 'data:image/png;base64,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',
  allies: 'data:image/png;base64,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',
  default: 'data:image/png;base64,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'
});
function setAppFavicon(side) {
  let favicon = $('app-favicon');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.id = 'app-favicon';
    favicon.rel = 'icon';
  }
  favicon.type = 'image/png';
  favicon.sizes = '64x64';
  favicon.href = APP_FAVICON_DATA[side] || APP_FAVICON_DATA.default;
  // Assicura che il favicon dinamico prevalga su eventuali icone preesistenti.
  document.head.append(favicon);
}

const TABS = [['porto','Porto'],['battaglia','Battaglia'],['storico','Storico'],['navi','Naviglio'],['aerei','Aerei'],['gestione','Gestione campagna'],['regole','Regole']];
const ORDER = ['BB1','BB2','BB3','AIR','CA1','CA2','CA3','CL1','CL2','CL3','CL4','CV1','SUB'];
const COLORS = Object.freeze({BB:'#B33939',BC:'#E08283',CA:'#1B4F72',CL:'#7FB3D5',DD:'#2E8B57',CV:'#17A398',SUB:'#6C3483',B:'#6B4A32',DB:'#8B6F47',F:'#7E7E7E',FB:'#54585B',HB:'#4A3728',PB:'#6E6259',TB:'#5C6670'});
let model = null, activeTab = 'porto', term = '', catalogFilter = '', theme = '', saving = false;
const catalogSort = {navi:{key:'nome',direction:1},aerei:{key:'nome',direction:1}};
let stopWatching = null, syncPending = false, syncWorking = false, syncTimer = null;
let syncRetryDelay = 500, sessionEpoch = 0;
let syncMode = 'automatico';
let lastTypingAt = 0;
document.addEventListener('input', () => { lastTypingAt = Date.now(); }, true);

function make(tag, className = '', content) { const x=document.createElement(tag); if(className)x.className=className; if(content!==undefined && content!==null)x.textContent=String(content); return x; }
function text(parent,tag,value,cls='') {const e=make(tag,cls,value);parent.append(e);return e;}
function toast(message,isError=false){ const x=$('toast');x.textContent=message;x.style.color=isError?'var(--sunk)':'';x.classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove('on'),3800); }
function themeApply(){if(theme)document.documentElement.setAttribute('data-theme',theme);else document.documentElement.removeAttribute('data-theme');}
function showLogin(){ sessionEpoch++;stopLiveSync();model=null;$('command-root').replaceChildren();$('app-page').hidden=true;$('login-page').hidden=false;$('password').value='';document.title='Campagna Mediterraneo — Accesso';setAppFavicon(null); }
// Stessa tabella stagioni utilizzata dalla validazione SQL di Nhost.
function campaignYear(){return [1940,1940,1941,1941,1941,1942,1942,1942,1943,1943][Number(model.campaign.turn_index)] ?? 1940;}
function shipBase(name){return String(name||'').replace(/\s*\((I|II|III)\)$/,'');}
// Valutare TUTTE le versioni dello stesso scafo, esattamente come Nhost.
// Una vecchia versione con danni o affondamento blocca anche l'omonima.
function lossStatus(name, state = model.state) {
 const losses=state.perdite||{};
 let repairing=false;
 for(const [key,loss] of Object.entries(losses)) {
  if(shipBase(key)!==shipBase(name))continue;
  if(loss?.stato==='affondata')return 'affondata';
  if(model.campaign.turn_index<=Number(loss?.turno)+1)repairing=true;
 }
 return repairing?'riparazione':'attiva';
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
 setAppFavicon(model.side);
 $('side-css').href=model.side==='axis'?'./css/regia.css':'./css/royal.css';
 const root=$('command-root');root.replaceChildren();
 root.append($('header-'+model.side).content.cloneNode(true));
 const status=make('div','nhost-statusbar');status.id='nhost-statusbar';status.textContent=statusText();
 root.append(status);
 const wrap=make('div','wrap');
 const warning=make('div','nhost-status nhost-synced','Dati privati Nhost · Le formazioni avversarie diventano consultabili soltanto nei rapporti delle battaglie concluse. Le due fazioni avanzano insieme.');wrap.append(warning);
 for(const [id] of TABS){const p=make('section','panel');p.id='p-'+id;wrap.append(p);}
 root.append(wrap);
 $('btn-refresh').addEventListener('click',async()=>{try{await refresh();toast('Dati aggiornati da Nhost.');}catch(e){toast(e.message,true);}});
 $('btn-logout').addEventListener('click',async()=>{sessionEpoch++;stopLiveSync();await signOut();showLogin();toast('Disconnessione eseguita.');});
 $('btn-tema').addEventListener('click',()=>{theme=theme==='dark'?'light':theme==='light'?'':'dark';themeApply();localStorage.setItem('campagna-v02-theme',theme);});
 document.title=(model.side==='axis'?'Regia Marina':'Royal Navy')+' — Mediterraneo 1940–43';
 render();
 startLiveSync();
}
function render(){if(!model)return;renderTabs();renderPennant();const p=$('p-'+activeTab);if(!p)return;p.replaceChildren();
 if(activeTab==='porto')renderPort(p);else if(activeTab==='battaglia')renderBattle(p);else if(activeTab==='storico')renderHistory(p);
 else if(activeTab==='navi'||activeTab==='aerei')renderCatalog(p,activeTab);else if(activeTab==='gestione')renderManagement(p);else renderRules(p);
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
function available(unit, state=model.state){if(!unit)return false;const yr=campaignYear();return Number(unit.anno)<=yr && (!unit.ritirato || yr<Number(unit.ritirato)) && (!isShip(unit)||lossStatus(unit.nome,state)==='attiva');}
function matchClass(unit,cls){return unit && (cls||[]).some(x=>x===unit.cls||x===unit.tipo);}
function baseName(name){return String(name).replace(/\s*\((I|II|III)\)$/,'');}
function assignedShips(state){const all=new Set();for(const entries of Object.values(state.porto||{}))for(const name of entries||[])if(name&&state.navi.some(x=>x.nome===name))all.add(name);return all;}
function hasCarrier(state=model.state){return(state.navi||[]).some(x=>x.cls==='CV'&&available(x,state));}
function optionPool(squad,index,current,state=model.state){
  const cat=[...(state.navi||[]),...(state.aerei||[])];
  const nN=Number(squad.nucleo?.n)||0;
  const nucleus=squad.nucleo||{},escort=squad.scorta||{};
  const slotClass=Array.isArray(nucleus.clsPerSlot)?nucleus.clsPerSlot[index]:undefined;
  let accepted,allowed;
  if(squad.id==='AIR'){
    accepted=cat.filter(u=>!isShip(u));
    // Il database controlla il TIPO esatto per ogni slot AIR.
    allowed=slotClass?[slotClass]:[];
  }else if(squad.id==='CV1'){
    if(!hasCarrier(state)){
      accepted=cat.filter(u=>!isShip(u));
      allowed=[index===0?'TB':'DB'];
    }else if(index===0){
      accepted=cat.filter(isShip);allowed=['CV'];
    }else{
      accepted=cat.filter(u=>!isShip(u)&&u.base==='IMBARCABILE');
      allowed=['AEREO_IMB'];
    }
  }else{
    accepted=cat.filter(isShip);
    allowed=index<nN?(slotClass!==undefined?[slotClass]:nucleus.cls||[]):escort.cls||[];
  }
  const used=assignedShips(state);
  const list=accepted.filter(u=>{
    if(!available(u,state))return false;
    if(isShip(u)&&used.has(u.nome)&&u.nome!==current)return false;
    if(squad.id==='AIR')return !allowed.length||allowed.includes(u.tipo);
    if(squad.id==='CV1'&&allowed.includes('AEREO_IMB'))return u.base==='IMBARCABILE';
    return matchClass(u,allowed);
  });
  // NON reinserire versioni ritirate tra le opzioni selezionabili.
  // Eventuali vecchie assegnazioni sono mostrate separatamente, disabilitate.
  return list.sort((a,b)=>a.nome.localeCompare(b.nome,'it',{numeric:true}));
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
function squadSlots(s,names,state=model.state){let nN=Number(s.nucleo?.n)||0,nS=Number(s.scorta?.n)||0;
  if(s.id==='CV1'){
    if(!hasCarrier(state))return{nN:0,nS:2,len:2};
    const map=catalogMap(state);const cv=map.get(names[0]);nS=cv?.cls==='CV'?Number(cv.hangar??3):3;
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
    const candidates=optionPool(s,i,name);
     for(const entry of candidates){const o=make('option','',entry.nome);o.value=entry.nome;sel.append(o);}
     if(!candidates.length&&!name){const o=make('option','','Nessuna unità disponibile per questa casella');o.disabled=true;sel.append(o);}
    if(name&&!Array.from(sel.options).some(o=>o.value===name)){const o=make('option','',name+' (non disponibile: liberare la casella)');o.value=name;o.disabled=true;sel.append(o);sel.title='Questa versione non è più utilizzabile nel turno corrente.';}
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
    const draft=cloneState();
    const squads=sortedSquads();
    for(const s of squads){
      const arr=Array.isArray(draft.porto[s.id])?[...draft.porto[s.id]]:[];
      // Le disponibilita' e le navi gia' assegnate vanno lette dal DRAFT,
      // non dal porto precedentemente salvato. CV1 ha capacita' dinamica.
      for(let i=0;i<squadSlots(s,arr,draft).len;i++){
        if(arr[i])continue;
        const pool=optionPool(s,i,'',draft).filter(u=>
          (!isShip(u)||!assignedShips(draft).has(u.nome))&&
          (s.id!=='CV1'||i!==0||u.cls!=='CV'||
           !arr.slice(1+Number(u.hangar??3)).some(Boolean))
        );
        if(pool.length)arr[i]=pool[Math.floor(Math.random()*pool.length)].nome;
        draft.porto[s.id]=arr;
      }
      const capacity=squadSlots(s,arr,draft).len;
      if(arr.slice(capacity).some(Boolean)){
        toast('Squadra '+s.id+': unita oltre la capacita consentita. Correggere le assegnazioni esistenti.',true);
        return;
      }
      if(arr.length>capacity)arr.length=capacity;
      draft.porto[s.id]=arr;
    }
    try{
      await persistDraft(draft);
      return;
    }catch(error){
      if(!/database query error/i.test(error.message||''))return;
    }

    // Se il database rifiuta ancora un unico grande aggiornamento,
    // identificare la squadra incriminata salvando SOLO cambiamenti gia'
    // convalidati da Nhost, una squadra per volta. Mai svuotare il porto.
    let completed=0;
    const failed=[];
    saving=true;
    try{
      for(const squad of squads){
        const id=squad.id;
        const current=Array.isArray(model.state.porto[id])?model.state.porto[id]:[];
        const expected=Array.isArray(draft.porto[id])?draft.porto[id]:[];
        if(JSON.stringify(current)===JSON.stringify(expected))continue;
        const part=cloneState();
        part.porto[id]=[...expected];
        try{
          const saved=await saveLogistics(part,model.stateRevision);
          model.state=saved.state;
          model.stateRevision=saved.revision;
          model.updatedAt=saved.updatedAt;
          completed++;
        }catch(e){
          failed.push(squad.id+' ('+squad.nome+'): '+(e.message||'errore sconosciuto'));
        }
      }
    }finally{
      saving=false;
      render();renderPennant();
    }
    if(failed.length){
      const message='Compilazione: '+completed+' squadre salvate, '+failed.length+
        ' rifiutate da Nhost.\n\n'+failed.join('\n')+
        '\n\nComunichi il nome della squadra indicata per completare la diagnosi.';
      console.warn('Compilazione automatica Royal Navy',message);
      alert(message);
      toast('Compilazione parziale. Legga la diagnostica mostrata.',true);
    }else{
      toast('Porto compilato e salvato su Nhost, una squadra per volta.');
    }
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
// Ordinamento locale e stabile. Non modifica il catalogo salvato su Nhost.
function compareCatalogUnits(a,b,key,direction){
 const get=u=>key==='stato'?lossStatus(u.nome):u[key];
 const av=get(a),bv=get(b),aEmpty=av===null||av===undefined||av==='',bEmpty=bv===null||bv===undefined||bv==='';
 if(aEmpty||bEmpty){if(aEmpty&&bEmpty)return 0;return aEmpty?1:-1;}
 if(['pt','anno','ritirato'].includes(key))return (Number(av)-Number(bv))*direction;
 return String(av).localeCompare(String(bv),'it',{numeric:true,sensitivity:'base'})*direction;
}
function renderCatalog(p,tab){
 const ships=tab==='navi',source=(ships?model.state.navi:model.state.aerei)||[];
 const add=card(ships?'Aggiungi nave':'Aggiungi aereo');const body=make('div','nhost-card-body');const bt=make('button','btn primary',ships?'Aggiungi nave':'Aggiungi aereo');bt.disabled=!canEdit();bt.onclick=()=>dialogUnit(tab);body.append(bt);
 text(body,'div',canEdit()?'Può modificare le anagrafiche; ogni salvataggio è immediato sul database.':'Modifiche bloccate finché è in corso una battaglia.','nhost-notification');add.append(body);p.append(add);
 const bar=make('div','nhost-actions');bar.style.marginTop='12px';const sel=make('select','btn sm');
 const opts=ships?[['','Tutte le classi'],['BB','Corazzate'],['C','Incrociatori'],['DD','Cacciatorpediniere'],['CV','Portaerei'],['SUB','Sommergibili']]:[['','Tutte le basi'],['LAND BASED','Terrestri'],['IDRO','Idrovolanti'],['IMBARCABILE','Imbarcati']];
 for(const [value,label] of opts){const o=make('option','',label);o.value=value;sel.append(o);}sel.value=catalogFilter;
 const search=make('input','btn sm nhost-search');search.type='search';search.placeholder='Cerca un nome';search.value=term;search.setAttribute('aria-label','Cerca unità');
 bar.append(sel,search);text(bar,'span',`Catalogo privato: ${source.length} voci · Clicchi sulle intestazioni per ordinare`,'note');p.append(bar);
 const wrap=make('div','card scroll-x');p.append(wrap);
 const fields=ships?[['Nome','nome'],['Tipo','tipo'],['Punti','pt'],['Anno','anno'],['Ritiro','ritirato'],['Stato','stato'],['Azioni',null]]:
  [['Nome','nome'],['Tipo','tipo'],['Punti','pt'],['Anno','anno'],['Base','base'],['Azioni',null]];
 const update=()=>{
  const filtered=source.filter(x=>{const c=!catalogFilter||(ships?x.cls===catalogFilter:x.base===catalogFilter);return c&&(String(x.nome||'')+' '+String(x.tipo||'')).toLocaleLowerCase('it').includes(term.toLocaleLowerCase('it'));});
  const order=catalogSort[tab];
  const sorted=filtered.map((unit,index)=>({unit,index})).sort((a,b)=>
   compareCatalogUnits(a.unit,b.unit,order.key,order.direction)||a.index-b.index).map(x=>x.unit);
  wrap.replaceChildren();const tbl=make('table');const thead=make('thead');const header=make('tr');
  for(const [label,key] of fields){
   const th=make('th');if(key==='pt')th.style.textAlign='center';
   if(!key)text(th,'span',label);
   else {
    const selected=order.key===key;
    th.setAttribute('aria-sort',selected?(order.direction===1?'ascending':'descending'):'none');
    const control=make('button','',label+(selected?(order.direction===1?' ▲':' ▼'):' ⇅'));
    control.type='button';control.title='Ordina per '+label;
    control.style.cssText='background:transparent;border:0;color:inherit;font:inherit;font-weight:inherit;cursor:pointer;padding:0;text-align:inherit;white-space:nowrap;';
    control.onclick=()=>{if(order.key===key)order.direction*=-1;else{order.key=key;order.direction=1;}update();};
    th.append(control);
   }
   header.append(th);
  }
  thead.append(header);tbl.append(thead);const tbody=make('tbody');
  for(const u of sorted){
   const row=make('tr');const values=ships?[u.nome,u.tipo,u.pt,u.anno,u.ritirato??'—',lossStatus(u.nome)]:[u.nome,u.tipo,u.pt,u.anno,u.base||'—'];
   values.forEach((v,i)=>{const td=make('td',i===2?'num':'',v??'—');if(i===2)td.style.textAlign='center';if(i===1&&COLORS[u.tipo])td.style.color=COLORS[u.tipo];row.append(td);});
   const action=make('td','nhost-catalog-actions');const edit=make('button','btn sm','Modifica');edit.disabled=!canEdit();edit.onclick=()=>dialogUnit(tab,u);
   const del=make('button','btn sm danger','Rimuovi');del.disabled=!canEdit();del.onclick=()=>removeUnit(tab,u);action.append(edit,del);row.append(action);tbody.append(row);
  }
  tbl.append(tbody);wrap.append(tbl);if(!filtered.length)text(wrap,'div','Nessuna unità trovata.','nhost-card-body note');
 };
 sel.onchange=()=>{catalogFilter=sel.value;update();};search.oninput=()=>{term=search.value;update();};update();
}
// Solo la fazione proprietaria puo modificare la propria battaglia prima di concluderla.
function canEditBattle(){return model&&!saving&&model.campaign.phase==='battle'&&!model.campaign[model.side+'_concluded'];}
function damageFromBattle(b){return (b?.gruppi||[]).flatMap(g=>g.unita||[]).reduce((s,u)=>
 s+(u.esito==='affondata'?Number(u.pt):u.esito==='danneggiata'?Number(u.pt)/2:0),0);}
function appendAction(parent,label,handler,disabled=false,klass='btn sm'){
 const b=make('button',klass,label);b.type='button';b.disabled=disabled;
 b.onclick=handler;parent.append(b);return b;
}
async function storeBattle(battle){
 if(!canEditBattle())return;
 saving=true;
 try{
  const result=await saveBattle(battle,model.stateRevision);
  model.state=result.state;model.stateRevision=result.revision;
  toast('Battaglia salvata su Nhost.');
 }catch(e){toast(e.message,true);throw e;}
 finally{saving=false;await refresh();}
}
function battleRolls(container,b){
 const c=card('Log estrazione','Seme '+String(b.seed));
 const body=make('div','log');
 for(const r of b.log||[]){const line=make('div',r.unita?.length?'y':'n',
   (r.id||'')+' · tiro '+r.tiro+' · '+(r.esito||'')+(r.unita?.length?' · '+r.unita.join(', '):''));
  body.append(line);
 }
 c.append(body);container.append(c);
}
function battleGroups(container,b,reinforcement){
 const groups=(b.gruppi||[]).filter(g=>!!g.rinforzo===reinforcement);
 const wave=make('div','battle-wave '+(reinforcement?'support':'primary'));
 const header=make('div','battle-wave-head');
 text(header,'strong',reinforcement?'Forze di supporto':'Prima ondata');
 text(header,'small',reinforcement?'Rinforzi arrivati dopo la prima ondata':'Forza iniziale in mare');
 text(header,'span',groups.length+' squadre · '+groups.reduce((a,g)=>a+Number(g.pt||0),0)+' pt','tag');
 wave.append(header);
 if(!groups.length)text(wave,'div','Nessuna unità disponibile.','note');
 for(const g of groups){
  const block=make('div','force-sq');const h=make('div','hd');
  text(h,'span',g.squadra,'nm');text(h,'span',g.modo==='completa'?'al completo':g.modo,'md');
  text(h,'span',String(g.pt)+' pt','tot num');block.append(h);
  for(const u of g.unita){
   const row=make('div','unit'+(u.esito==='affondata'?' is-sunk':u.esito==='danneggiata'?' is-hurt':''));
   const type=make('span','type-badge',u.tipo);type.style.background=COLORS[u.tipo]||'#555';row.append(type);
   text(row,'span',u.nome,'nm');text(row,'span',u.pt,'pt num');
   const seg=make('div','seg');
   const isPlane=(model.state.aerei||[]).some(a=>a.nome===u.nome);
   for(const [value,label,css] of (isPlane?
     [['illesa','illeso',''],['affondata','distrutto','b-sunk']]:
     [['illesa','illesa',''],['danneggiata','danni','b-hurt'],['affondata','affondata','b-sunk']])){
    const button=make('button',css,label);button.type='button';button.disabled=!canEditBattle();
    button.setAttribute('aria-pressed',String(u.esito===value));
    button.onclick=async()=>{
      if(u.esito===value)return;
      const next=structuredClone(model.state.battaglia);
      const target=next.gruppi.find(x=>x.id===g.id)?.unita.find(x=>x.nome===u.nome);
      if(!target)return;
      target.esito=value;
      try{await storeBattle(next);}catch{}
    };
    seg.append(button);
   }
   row.append(seg);block.append(row);
  }
  wave.append(block);
 }
 container.append(wave);
}
// Rapporto post-battaglia: la formazione avversaria diventa visibile soltanto
// quando il SERVER ha ricevuto entrambe le conclusioni e ha salvato un rapporto.
function reportNumber(value,decimals=0){return Number(value||0).toLocaleString('it-IT',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});}
function reportOutcome(unit){
 if(unit.esito==='affondata')return unit.kind==='aereo'?'Distrutto':'Affondata';
 if(unit.esito==='danneggiata')return 'Danneggiata';
 return 'Illesa';
}
function reportSideTitle(side){return side==='axis'?'Axis · Regia Marina':'Allies · Royal Navy';}
function reportCounts(groups){
 const units=(groups||[]).flatMap(g=>g.unita||[]);
 return {
  illese:units.filter(u=>u.esito==='illesa').length,
  danneggiate:units.filter(u=>u.esito==='danneggiata').length,
  perse:units.filter(u=>u.esito==='affondata').length,
  naviPerse:units.filter(u=>u.esito==='affondata'&&u.kind!=='aereo').length,
  aereiDistrutti:units.filter(u=>u.esito==='affondata'&&u.kind==='aereo').length
 };
}
function reportFleetPanel(fleet){
 const panel=card(reportSideTitle(fleet.side)+(fleet.side===model.side?' · Propria flotta':' · Flotta avversaria'));panel.style.flex='1 1 450px';panel.style.minWidth='min(100%,330px)';
 const body=make('div','nhost-card-body');
 summary(body,[
  ['Punti iniziali (prima ondata)',reportNumber(fleet.prima_ondata)],
  ['Punti di supporto',reportNumber(fleet.supporto)],
  ['Punti totali',reportNumber(fleet.punti_totali)],
  ['Danni subiti',reportNumber(fleet.danni_subiti,1)],
  ['Danni inflitti',reportNumber(fleet.danni_inflitti,1)],
  ['Coefficiente',reportNumber(fleet.coefficiente,2)],
  ['Punteggio battaglia',reportNumber(fleet.punteggio,2)]
 ]);
 const counts=reportCounts(fleet.gruppi);
 const countline=make('div','note',`Unità: ${counts.illese} illese · ${counts.danneggiate} danneggiate · ${counts.perse} perse/distrutte (${counts.naviPerse} navi, ${counts.aereiDistrutti} aerei)`);
 countline.style.margin='12px 0';body.append(countline);
 for(const [reinforcement,title] of [[false,'Prima ondata'],[true,'Forze di supporto']]){
  const groups=(fleet.gruppi||[]).filter(g=>!!g.rinforzo===reinforcement);
  const wave=make('div','battle-wave '+(reinforcement?'support':'primary'));
  const header=make('div','battle-wave-head');
  text(header,'strong',title);
  text(header,'span',groups.length+' squadre · '+reportNumber(groups.reduce((n,g)=>n+Number(g.pt||0),0))+' pt','tag');
  wave.append(header);
  if(!groups.length)text(wave,'div','Nessuna unità.','note');
  for(const group of groups){
   const sq=make('div','force-sq');const head=make('div','hd');
   text(head,'span',group.squadra||'Gruppo','nm');
   text(head,'span',reportNumber(group.pt)+' pt','tot num');sq.append(head);
   for(const unit of group.unita||[]){
    const line=make('div','unit'+(unit.esito==='affondata'?' is-sunk':unit.esito==='danneggiata'?' is-hurt':''));
    const type=make('span','type-badge',unit.tipo||'');type.style.background=COLORS[unit.tipo]||'#555';line.append(type);
    text(line,'span',unit.nome||'—','nm');text(line,'span',reportNumber(unit.pt)+' pt','pt num');
    const outcome=text(line,'span',reportOutcome(unit),'st');outcome.style.marginLeft='auto';outcome.style.minWidth='90px';outcome.style.justifyContent='flex-end';
    if(unit.esito==='affondata')outcome.style.color='var(--sunk)';
    else if(unit.esito==='danneggiata')outcome.style.color='var(--hurt)';
    sq.append(line);
   }
   wave.append(sq);
  }
  body.append(wave);
 }
 panel.append(body);return panel;
}
function renderBattleReport(parent,data){
 if(!data?.own||!data?.opponent)return;
 const outer=card('Rapporto completo post-battaglia',SEASONS[data.turn_index]||'Turno '+(Number(data.turn_index)+1));
 const content=make('div','nhost-card-body');
 note(content,'Rapporto definitivo: le formazioni sono state rese visibili soltanto dopo la conclusione di entrambe le fazioni.');
 const totals=make('div','row');totals.style.cssText='display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;';
 totals.append(reportFleetPanel(data.own),reportFleetPanel(data.opponent));
 content.append(totals);outer.append(content);parent.append(outer);
}
function renderBattle(p){
 const b=model.state.battaglia;
 const phase=model.campaign.phase;
 const mineConcluded=!!model.campaign[model.side+'_concluded'];
 const otherConcluded=!!model.campaign[(model.side==='axis'?'allies':'axis')+'_concluded'];
 const mineReady=!!model.campaign[model.side+'_ready'];
 const toolbar=make('div','row');toolbar.style.marginBottom='14px';
 if(phase==='battle'&&!mineConcluded){
  appendAction(toolbar,b?'Estrai un’altra formazione':'Genera formazione',async()=>{
   if(b&&!confirm('Sostituire la formazione? Tutti gli esiti segnati verranno cancellati.'))return;
   const seed=new Uint32Array(1);crypto.getRandomValues(seed);
   try{await storeBattle(generateBattle(model.state,model.campaign.turn_index,seed[0]));}
   catch(e){if(!/Nhost|revisione|errore|scadut/i.test(e.message))toast(e.message,true);}
  },saving,'btn primary');
  const seedInput=make('input','btn sm num');seedInput.type='number';seedInput.min='0';seedInput.max='4294967295';seedInput.placeholder='Seme';seedInput.style.width='110px';
  if(b)seedInput.value=b.seed;toolbar.append(seedInput);
  appendAction(toolbar,'Carica seme',async()=>{
   const seed=Number(seedInput.value);
   if(!seedInput.value||!Number.isInteger(seed)||seed<0||seed>4294967295){toast('Seme non valido.',true);return;}
   if(b&&!confirm('Caricare un altro seme? Si perderanno gli esiti registrati.'))return;
   try{await storeBattle(generateBattle(model.state,model.campaign.turn_index,seed));}
   catch(e){toast(e.message,true);}
  },saving);
  if(b)appendAction(toolbar,'Scarta formazione',async()=>{
   if(!confirm('Scartare la formazione attuale?'))return;
   try{await storeBattle(null);}catch{}
  },saving,'btn sm danger');
 }
 appendAction(toolbar,'Aggiorna dati',async()=>{try{await refresh();toast('Dati aggiornati.');}catch(e){toast(e.message,true);}},saving);
 p.append(toolbar);
 if(b){
  const force=card('Forza in mare',b.totale+' pt · seme '+b.seed+' · '+b.tentativi+' estrazioni');
  const box=make('div','nhost-card-body');
  battleGroups(box,b,false);battleGroups(box,b,true);
  force.append(box);p.append(force);
  const results=card('Riepilogo danni');const detail=make('div','nhost-card-body');
  summary(detail,[['Totale in mare',b.totale],['Prima ondata',b.primaOndata],['Danni subiti',damageFromBattle(b)]]);
  if(b.fuoriRange)note(detail,'Attenzione: impossibile rispettare il limite 150–280 pt dopo 500 tentativi, come previsto dal motore originale.');
  results.append(detail);p.append(results);
  battleRolls(p,b);
 }else if(phase==='battle'&&!mineConcluded){
  const empty=make('div','empty','Nessuna formazione in mare per '+(SEASONS[model.campaign.turn_index]||'questo turno')+'.');p.append(empty);
 }
 if(phase==='results'){
  const detailed=(model.reports||[]).find(r=>Number(r.turn_index)===Number(model.campaign.turn_index));
  if(detailed)renderBattleReport(p,detailed.report);
  else note(p,'Rapporto in elaborazione: prema «Aggiorna dati» fra qualche istante.');
 }
 const control=card('Conclusione della battaglia');const inner=make('div','nhost-card-body');
 summary(inner,[['Axis conclusa',model.campaign.axis_concluded?'Sì':'No'],
  ['Allies conclusa',model.campaign.allies_concluded?'Sì':'No'],
  ['Axis pronto',model.campaign.axis_ready?'Sì':'No'],['Allies pronto',model.campaign.allies_ready?'Sì':'No']]);
 if(phase==='battle'){
  if(mineConcluded){
   note(inner,'Battaglia conclusa. I Suoi dati sono bloccati. In attesa della conclusione dell’avversario.');
  }else{
   note(inner,'I valori avversari saranno calcolati automaticamente SOLTANTO dopo entrambe le conclusioni. Nessuna formazione viene comunicata all’avversario.');
   appendAction(inner,'Concludi battaglia',async()=>{
    if(!confirm('Concludere definitivamente questa battaglia? Dopo la conferma non potrà più modificare gli esiti.'))return;
    saving=true;
    try{await concludeBattle(model.stateRevision);toast('Battaglia conclusa.');}
    catch(e){toast(e.message,true);}
    finally{saving=false;await refresh();}
   },!b||saving,'btn primary');
  }
 }else if(phase==='results'){
  const ownResult=model.results.find(r=>Number(r.turn_index)===Number(model.campaign.turn_index));
  if(ownResult){
   summary(inner,[['Punteggio proprio',Number(ownResult.own_score).toFixed(1)],
     ['Punteggio nemico',Number(ownResult.opponent_score).toFixed(1)],
     ['Danni inflitti',Number(ownResult.damage_inflicted).toFixed(1)],
     ['Danni subiti',Number(ownResult.damage_suffered).toFixed(1)]]);
  }
  if(mineReady)note(inner,'Pronto confermato. Attendere la conferma dell’altra fazione.');
  else appendAction(inner,model.campaign.turn_index===9?'Pronto per chiudere la campagna':'Pronto per il prossimo turno',async()=>{
    if(!confirm('Confermare che ha consultato il risultato ed è pronto a procedere?'))return;
    saving=true;
    try{await markReady(model.campaign.revision);toast('Conferma registrata.');}
    catch(e){toast(e.message,true);}
    finally{saving=false;await refresh();}
  },saving,'btn primary');
 }else note(inner,'Campagna conclusa. Tutti i risultati sono disponibili nello Storico.');
 control.append(inner);p.append(control);
}

function renderHistory(p){
 const rows=Array.isArray(model.state.storico)?model.state.storico:[];
 const results=model.results||[],reports=model.reports||[];
 if(!rows.length&&!results.length){
  p.append(make('div','empty','Nessuna battaglia registrata. Lo storico sarà compilato dopo le due conclusioni.'));return;
 }
 const c=card('Andamento della campagna');const table=make('table');const head=make('thead');const tr=make('tr');
 for(const x of ['Stagione','Punti propri','Punti nemici','Danni subiti','Navi perse'])text(tr,'th',x);
 head.append(tr);table.append(head);const tbody=make('tbody');
 if(!rows.length&&results.length){
  for(const r of results){const line=make('tr');
   for(const x of [SEASONS[r.turn_index]||r.turn_index,reportNumber(r.own_score,1),reportNumber(r.opponent_score,1),reportNumber(r.damage_suffered,1),'—'])text(line,'td',x);
   tbody.append(line);
  }
 }else for(const r of rows){const line=make('tr');
  for(const x of [r.turno,reportNumber(r.pAll,1),reportNumber(r.pAsse,1),reportNumber(r.danniSubiti,1),r.navi?.perse?.length??'—'])text(line,'td',x);
  tbody.append(line);
 }
 table.append(tbody);const wrapper=make('div','scroll-x');wrapper.append(table);c.append(wrapper);p.append(c);
 // Rapporto dettagliato persistente e recuperabile anche nei turni successivi.
 for(const [index,entry] of reports.entries()){
  const doc=entry.report;
  const details=make('details','card battle-history');details.style.marginTop='14px';
  details.open=index===0;
  const header=make('summary','battle-history-summary');
  text(header,'span','Rapporto completo · '+(SEASONS[entry.turn_index]||'Turno '+(entry.turn_index+1)),'summary-title');
  text(header,'span','Proprio '+reportNumber(doc.own?.punteggio,1)+' · Avversario '+reportNumber(doc.opponent?.punteggio,1),'summary-stats');
  details.append(header);renderBattleReport(details,doc);p.append(details);
 }
 if(!reports.length)note(p,'I rapporti con la composizione delle due flotte compariranno qui dopo entrambe le conclusioni.');
}
// v0.7: catalogo pubblico dei soli NOMI. Gli snapshot veri rimangono privati.
function renderManagement(p) {
  const pending=model.pendingRequest;
  const intro=card('Gestione campagna');
  const ib=make('div','nhost-card-body');
  note(ib,'I salvataggi comprendono entrambe le flotte, porti, perdite, battaglie, punteggi e rapporti. Il caricamento e il reset richiedono la conferma di Axis e Allies.');
  summary(ib,[['Campagna',model.campaign.name],['Stagione attuale',SEASONS[model.campaign.turn_index]||'—'],['Salvataggi',model.saves.length]]);
  intro.append(ib);p.append(intro);

  if(pending){
    const save=model.saves.find(x=>x.snapshot_id===pending.snapshot_id);
    const box=card('Richiesta in attesa della seconda fazione','Conferma obbligatoria');
    const body=make('div','nhost-card-body');
    note(body,'Operazione proposta da '+(pending.requested_by==='axis'?'Regia Marina':'Royal Navy')+': '+(save?.label||'Salvataggio')+'.');
    summary(body,[['Regia Marina',pending.axis_approved?'Ha confermato':'In attesa'],['Royal Navy',pending.allies_approved?'Ha confermato':'In attesa']]);
    const buttons=make('div','nhost-actions');
    const ownApproved=model.side==='axis'?pending.axis_approved:pending.allies_approved;
    if(!ownApproved){
      appendAction(buttons,'Approva ripristino / reset',async()=>{
        if(!confirm('Confermare il caricamento? Tutti i dati della campagna corrente saranno sostituiti. Verrà prima creato un backup automatico.'))return;
        saving=true;try{await resolveCampaignRequest(pending.id,true);toast('Conferma registrata.');await refresh();}
        catch(e){toast(e.message,true);await refresh();}finally{saving=false;}
      },saving,'btn primary');
    }else note(body,'Ha già confermato. Attendere l’altra fazione.');
    appendAction(buttons,'Rifiuta richiesta',async()=>{
      if(!confirm('Rifiutare la richiesta senza modificare la campagna?'))return;
      saving=true;try{await resolveCampaignRequest(pending.id,false);await refresh();toast('Richiesta rifiutata.');}
      catch(e){toast(e.message,true);}finally{saving=false;}
    },saving,'btn sm danger');
    body.append(buttons);box.append(body);p.append(box);
  }

  const sav=card('Salvataggi della campagna');const sb=make('div','nhost-card-body');
  const newRow=make('div','nhost-actions');const name=make('input','btn sm');
  name.type='text';name.maxLength=80;name.placeholder='Nome del nuovo salvataggio';name.style.minWidth='min(100%,260px)';
  newRow.append(name);
  appendAction(newRow,'Salva campagna',async()=>{
    const label=name.value.trim();if(!label){toast('Inserire un nome per il salvataggio.',true);return;}
    saving=true;try{await createCampaignSave(label);await refresh();toast('Salvataggio creato.');}
    catch(e){toast(e.message,true);}finally{saving=false;}
  },saving||!!pending,'btn primary');sb.append(newRow);
  if(!model.saves.length)note(sb,'Nessun salvataggio disponibile.');
  for(const save of model.saves){
    const r=make('div','nhost-actions');r.style.cssText='border-top:1px solid var(--line,#46515a);padding:10px 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
    const label=make('span','',save.label);label.style.flex='1 1 220px';r.append(label);
    const season=make('span','note',SEASONS[save.turn_index]||'Turno '+(save.turn_index+1));r.append(season);
    appendAction(r,'Rinomina',async()=>{
      const renamed=prompt('Nuovo nome del salvataggio:',save.label);
      if(renamed===null)return;
      saving=true;try{await renameCampaignSave(save.snapshot_id,renamed.trim());await refresh();toast('Nome aggiornato.');}
      catch(e){toast(e.message,true);}finally{saving=false;}
    },saving||!!pending);
    appendAction(r,'Carica',async()=>{
      if(!confirm('Richiedere il caricamento di «'+save.label+'»? Anche l’altra fazione dovrà approvare.'))return;
      saving=true;try{await requestCampaignLoad(save.snapshot_id);await refresh();toast('Richiesta di caricamento inviata.');}
      catch(e){toast(e.message,true);}finally{saving=false;}
    },saving||!!pending,'btn sm');
    appendAction(r,'Elimina',async()=>{
      if(!confirm('Eliminare definitivamente il salvataggio «'+save.label+'»?\nLa campagna attiva non verrà modificata. Questa operazione non è reversibile.'))return;
      saving=true;
      try{await deleteCampaignSave(save.snapshot_id);await refresh();toast('Salvataggio eliminato.');}
      catch(e){toast(e.message,true);alert('Impossibile eliminare: '+e.message);}
      finally{saving=false;}
    },saving||!!pending,'btn sm danger');
    sb.append(r);
  }
  sav.append(sb);p.append(sav);

  // Punteggi di partenza: soltanto dopo un reset da stagione successiva
  // al primo turno, e prima che una delle fazioni generi una battaglia.
  const scenarioOpen=Number(model.campaign.turn_index)>0 &&
    Number(model.state.scenario_start_turn)===Number(model.campaign.turn_index) &&
    Object.hasOwn(model.state,'scenario_start_turn') &&
    model.campaign.phase==='battle' &&
    !model.campaign.axis_concluded && !model.campaign.allies_concluded &&
    !model.state.battaglia;
  if(scenarioOpen){
    const setup=card('Punteggio iniziale dello scenario');
    const setupBody=make('div','nhost-card-body');
    note(setupBody,'Prima di generare la prima battaglia, ciascuna fazione può impostare il proprio punteggio di partenza. Non è possibile modificare quello avversario. Il salvataggio aggiorna automaticamente entrambe le visualizzazioni.');
    const line=make('div','nhost-actions');
    const label=make('label','',model.side==='axis'?'Punti iniziali Regia Marina':'Punti iniziali Royal Navy');
    const points=make('input','btn sm num');
    points.type='number';points.min='0';points.max='1000000';points.step='0.01';
    points.value=String(Number(model.state.punteggioBaseAll)||0);
    points.setAttribute('aria-label','Punteggio iniziale della propria fazione');
    line.append(label,points);
    appendAction(line,'Salva punteggio iniziale',async()=>{
      const value=Number(points.value);
      if(points.value.trim()===''||!Number.isFinite(value)||value<0||value>1000000||Math.round(value*100)!==value*100){
        toast('Inserire un punteggio valido, massimo due decimali.',true);return;
      }
      saving=true;
      try{await setScenarioScore(value);await refresh();toast('Punteggio iniziale salvato.');}
      catch(e){toast(e.message,true);await refresh();}
      finally{saving=false;}
    },saving||!!pending,'btn primary');
    setupBody.append(line);setup.append(setupBody);p.append(setup);
  }

  const reset=card('Reset / nuova campagna');const rb=make('div','nhost-card-body');
  note(rb,'Il reset azzera porto, perdite, storico, battaglie e punteggi, mantenendo cataloghi e squadre. Selezioni la stagione: dopo il reset, se parte da un turno successivo al primo, ciascuna fazione potrà impostare il proprio punteggio iniziale prima della battaglia.');
  const controls=make('div','nhost-actions');const start=make('select','btn sm');
  SEASONS.forEach((season,index)=>{const o=make('option','',season);o.value=String(index);start.append(o);});
  start.value='0';controls.append(start);
  appendAction(controls,'Richiedi reset della campagna',async()=>{
    if(!confirm('Richiedere una NUOVA campagna da '+SEASONS[Number(start.value)]+'? Occorre anche la conferma avversaria.'))return;
    saving=true;try{await requestCampaignReset(Number(start.value));await refresh();toast('Richiesta di reset inviata.');}
    catch(e){toast(e.message,true);}finally{saving=false;}
  },saving||!!pending,'btn sm danger');rb.append(controls);reset.append(rb);p.append(reset);
}

function renderRules(p){const row=make('div','row');
 for(const [title,entries]of [['Regole della campagna',['Un’unica campagna e un unico turno condivisi fra Axis e Allies.','I cataloghi, i porti e le formazioni in corso restano privati; dopo entrambe le conclusioni il rapporto mostra le unità impegnate da entrambe le fazioni.','Navi affondate: perdita definitiva. Navi danneggiate: riparazione secondo le regole originali.','Aerei distrutti: contano come danno nella battaglia ma non vengono radiati permanentemente.']],['Chiusura e sincronizzazione',['Ogni giocatore registra esclusivamente i danni subiti dalla propria flotta.','«Concludi battaglia» congela la formazione e i danni del giocatore.','Dopo entrambe le conclusioni il server calcola automaticamente i tre valori del nemico e i punteggi.','Il turno avanza soltanto quando entrambi premono «Pronto per il prossimo turno».']]]){
  const c=card(title);c.style.flex='1 1 420px';const content=make('div','nhost-card-body');const ol=make('ol');for(const entry of entries)text(ol,'li',entry);content.append(ol);c.append(content);row.append(c);
 }
 p.append(row);note(p,'L’ordine di estrazione, i criteri dei rinforzi e gli altri dettagli delle Regole originali saranno integrati nel motore di gioco condiviso, senza alterare il comportamento delle due versioni HTML.');
}
// Sincronizzazione v0.6. Aggiorna l'interfaccia solo quando Nhost segnala
// una variazione effettiva; non sovrascrive campi che il giocatore sta scrivendo.
function statusText() {
 return `Nhost connesso · ${model?.side==='axis'?'Axis':'Allies'} · Salvataggio protetto · Revisione ${model?.stateRevision??'—'} · Sync ${syncMode}`;
}
function setSyncMode(live) {
 syncMode=live?'in tempo reale':'automatico (5 s)';
 const status=$('nhost-statusbar');if(status&&model)status.textContent=statusText();
}
function stopLiveSync() {
 if(stopWatching){stopWatching();stopWatching=null;}
 if(syncTimer!==null){clearTimeout(syncTimer);syncTimer=null;}
 syncPending=false;
}
function startLiveSync() {
 stopLiveSync();
 if(!model)return;
 stopWatching=watchCampaign({
  campaign:model.campaign,
  onChange:()=>queueLiveRefresh(),
  onStatus:setSyncMode
 });
}
function queueLiveRefresh() {
 if(!model)return;
 syncPending=true;
 if(syncTimer===null)syncTimer=setTimeout(runLiveRefresh,200);
}
async function runLiveRefresh() {
 syncTimer=null;
 if(!model||!syncPending)return;
 const target=document.activeElement;
 const userIsTyping=target&&['INPUT','TEXTAREA','SELECT'].includes(target.tagName)
  && Date.now()-lastTypingAt<2500;
 if(syncWorking||saving||document.querySelector('dialog[open]')||userIsTyping){
  syncTimer=setTimeout(runLiveRefresh,900);return;
 }
 syncPending=false;syncWorking=true;
 const before={...model.campaign},side=model.side;
 try{
  await refresh();
  syncRetryDelay=500;
  if(!model||model.side!==side)return;
  const after=model.campaign,enemy=side==='axis'?'allies':'axis';
  if(Number(after.turn_index)>Number(before.turn_index))
   toast('Nuovo turno disponibile: '+(SEASONS[after.turn_index]||'campagna conclusa')+'.');
  else if(before.phase==='battle'&&after.phase==='results')
   toast('Entrambe le fazioni hanno concluso: rapporto post-battaglia disponibile.');
  else if(!before[enemy+'_concluded']&&after[enemy+'_concluded'])
   toast('L’avversario ha concluso la battaglia.');
  else if(!before[enemy+'_ready']&&after[enemy+'_ready'])
   toast('L’avversario è pronto per il prossimo turno.');
 }catch(e){
  console.warn('Aggiornamento automatico:',e.message);
  syncPending=true;
  syncRetryDelay=Math.min(syncRetryDelay*2,15000);
 }
 finally{
  syncWorking=false;
  if(syncPending&&syncTimer===null)syncTimer=setTimeout(runLiveRefresh,syncRetryDelay);
 }
}

async function refresh(){const epoch=sessionEpoch;const m=await loadCampaign();
 if(epoch!==sessionEpoch)return; // Se e' avvenuto logout, ignora una vecchia richiesta.
 if(!['axis','allies'].includes(m.side))throw new Error('Fazione non valida.');
 if(!Array.isArray(m.state.navi)||!Array.isArray(m.state.aerei)||!m.state.porto)throw new Error('Catalogo Nhost incompleto: verificare importazione 005.');
 const oldSide=model?.side;model=m;setAppFavicon(m.side);
 if(oldSide!==m.side || !$('p-porto'))showApp();else{const status=$('nhost-statusbar');if(status)status.textContent=statusText();render();}
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