import { signIn, signOut, resumeSession } from './auth.js';
import { loadCampaign } from './api.js';
import { SEASONS } from './config.js';

// Fedeltà visiva: fogli CSS e testate sono estratti senza modifiche dagli HTML originali.
// Sicurezza: nessun dato di flotta o nome di squadra avversario è presente nei file pubblici.
// Questa versione è in SOLA LETTURA finché non saranno implementate le funzioni Nhost protette.
const $ = id => document.getElementById(id);
const TABS = [['porto','Porto'],['battaglia','Battaglia'],['storico','Storico'],['navi','Naviglio'],['aerei','Aerei'],['regole','Regole']];
const ORDER = ['BB1','BB2','BB3','AIR','CA1','CA2','CA3','CL1','CL2','CL3','CL4','CV1','SUB'];
const COLORS = Object.freeze({BB:'#B33939',BC:'#E08283',CA:'#1B4F72',CL:'#7FB3D5',DD:'#2E8B57',CV:'#17A398',SUB:'#6C3483',B:'#6B4A32',DB:'#8B6F47',F:'#7E7E7E',FB:'#54585B',HB:'#4A3728',PB:'#6E6259',TB:'#5C6670'});
let model = null, activeTab = 'porto', term = '', catalogFilter = '', theme = '';

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
 const status=make('div','nhost-statusbar');status.id='nhost-statusbar';status.textContent='Nhost connesso · '+(model.side==='axis'?'Axis':'Allies')+' · Stato privato in sola lettura · Revisione '+model.stateRevision;
 root.append(status);
 const wrap=make('div','wrap');
 const warning=make('div','nhost-status nhost-synced','Database collegato · Grafica originale ripristinata. Modifica porto, cataloghi, estrazioni e conclusione battaglia non ancora abilitate finché non saranno installate le scritture protette.');wrap.append(warning);
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
function slotCard(container,id,label,names,metadata){
 const catalog=new Map([...(model.state.navi||[]),...(model.state.aerei||[])].map(n=>[n.nome,n]));
 const sq=card(label,`${id} · ${names.reduce((s,n)=>s+(catalog.get(n)?.pt||0),0)} pt`);sq.dataset.id=id;sq.classList.add('nhost-squadcard');
 const isAir=id==='AIR';let nN=Number(metadata.nucleo?.n)||0,nS=Number(metadata.scorta?.n)||0;
 if(id==='CV1'){
  const carriers=(model.state.navi||[]).filter(n=>n.cls==='CV'&&Number(n.anno)<=campaignYear()&&lossStatus(n.nome)==='attiva');
  if(!carriers.length){nN=0;nS=2;}else if(names[0]&&catalog.get(names[0])?.hangar!=null)nS=Number(catalog.get(names[0]).hangar)||nS;
 }
 const len=isAir?Math.max(nN,names.length):Math.max(nN+nS,names.length);
 for(let i=0;i<len;i++){
  const name=names[i]||'',u=catalog.get(name)||{},type=u.tipo||'';
  if(isAir&&!name){const typeAt=metadata.nucleo?.clsPerSlot?.[i];if(typeAt&&!model.state.aerei.some(a=>a.tipo===typeAt))continue;}
  const row=make('div','slot nhost-slot-readonly');row.style.background=name?(COLORS[type]||'#555'):'#485764';row.style.opacity=name?'1':'.62';
  text(row,'span',isAir?(metadata.nucleo?.clsPerSlot?.[i]||'·'):(i<nN?'·':'›'),'role');
  text(row,'span',type,'sigla');
  text(row,'span',name||'— libera —','nhost-slot-name'+(name?'':' missing'));
  text(row,'span',name?(u.pt??''):'','pt num');
  sq.append(row);
 }
 if(len===0)text(sq,'div','Nessuna casella configurata.','nhost-card-body nhost-muted');
 container.append(sq);
}
function renderPort(p){
 const info=make('div','row');info.style.marginBottom='14px';const intro=make('div','note','Assegna le unità alle squadre. I menu mostreranno solo le unità disponibili nella stagione corrente; la configurazione sarà abilitata dopo il completamento del salvataggio protetto.');intro.style.flex='1';info.append(intro);
 for(const label of ['Compila a caso le caselle vuote','Svuota tutte le squadre']){const b=make('button','btn sm',label);b.disabled=true;b.title='Disponibile nella prossima fase: salvataggio protetto';info.append(b);}
 p.append(info);
 const container=make('div','port-container');const port=model.state.porto||{};
 for(const s of sortedSquads()){slotCard(container,s.id,s.nome,Array.isArray(port[s.id])?port[s.id]:[],s);}
 p.append(container);
}
function renderCatalog(p,tab){const ships=tab==='navi';const source=(ships?model.state.navi:model.state.aerei)||[];
 const add=card(ships?'Aggiungi nave':'Aggiungi aereo');const body=make('div','nhost-card-body');const bt=make('button','btn primary',ships?'Aggiungi nave':'Aggiungi aereo');bt.disabled=true;body.append(bt);text(body,'div','La modifica del catalogo sarà attiva dopo l’installazione delle funzioni di scrittura autorizzate.','nhost-notification');add.append(body);p.append(add);
 const bar=make('div','nhost-actions');bar.style.marginTop='12px';const sel=make('select','btn sm');
 const opts=ships?[['','Tutte le classi'],['BB','Corazzate'],['C','Incrociatori'],['DD','Cacciatorpediniere'],['CV','Portaerei'],['SUB','Sommergibili']]:[['','Tutte le basi'],['LAND BASED','Terrestri'],['IDRO','Idrovolanti'],['IMBARCABILE','Imbarcati']];
 for(const [value,label] of opts){const o=make('option','',label);o.value=value;sel.append(o);}sel.value=catalogFilter;
 const search=make('input','btn sm nhost-search');search.type='search';search.placeholder='Cerca un nome';search.value=term;search.setAttribute('aria-label','Cerca unità');
 bar.append(sel,search);text(bar,'span',`Catalogo privato: ${source.length} voci · Solo lettura`,'note');p.append(bar);
 const wrap=make('div','card scroll-x');p.append(wrap);
 const update=()=>{
  const filtered=source.filter(x=>{
   const classMatch=!catalogFilter||(ships?(catalogFilter==='C'?x.cls==='C':x.cls===catalogFilter):x.base===catalogFilter);
   return classMatch&&(String(x.nome||'')+' '+String(x.tipo||'')).toLocaleLowerCase('it').includes(term.toLocaleLowerCase('it'));
  });
  wrap.replaceChildren();const tbl=make('table');const thead=make('thead');const header=make('tr');const fields=ships?['Nome','Tipo','Punti','Anno','Ritiro','Stato']:['Nome','Tipo','Punti','Anno','Base'];
  for(const col of fields)text(header,'th',col);thead.append(header);tbl.append(thead);const tbody=make('tbody');
  for(const u of filtered){const row=make('tr');const values=ships?[u.nome,u.tipo,u.pt,u.anno,u.ritirato||'—',lossStatus(u.nome)]:[u.nome,u.tipo,u.pt,u.anno,u.base||'—'];
   values.forEach((v,i)=>{const td=make('td',i===2?'r num':'',v??'—');if(i===1&&COLORS[u.tipo])td.style.color=COLORS[u.tipo];row.append(td);});tbody.append(row);}
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
 if(oldSide!==m.side || !$('p-porto'))showApp();else{const status=$('nhost-statusbar');if(status)status.textContent=`Nhost connesso · ${m.side} · Stato privato in sola lettura · Revisione ${m.stateRevision}`;render();}
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
