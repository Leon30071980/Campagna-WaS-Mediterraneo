import { aircraftProfile, aircraftKey, aircraftChoices } from './aircraft-profiles.js?v=1.54';
import { portUnitImage } from './port-visual.js?v=1.54';
import { HEADER_AXIS } from '../axis/header.js?v=1.54';
import { HEADER_ALLIES } from '../allies/header.js?v=1.54';
import { missingSeaAircraft } from '../allies/sea-aircraft.js?v=1.54';
import { localShipProfile } from './local-ship-profiles.js?v=1.54';
import { shipProfile } from './ship-profiles.js?v=1.54';
import { SHIP_TYPES, fleetOrder, unitNation } from './catalog-display.js?v=1.54';
import { historicalClass } from './historical-classes.js?v=1.54';
import { signIn, signOut, resumeSession } from './auth.js?v=1.54';
import { loadCampaign, saveLogistics, saveBattle, concludeBattle, markReady, watchCampaign, createCampaignSave, renameCampaignSave, deleteCampaignSave, requestCampaignLoad, requestCampaignReset, setScenarioScore, resolveCampaignRequest } from './api.js?v=1.54';
import { generateBattle } from './battle-engine.js?v=1.54';
import { SEASONS } from './config.js?v=1.54';
import { CAMPAIGN_YEARS, shipBase, isAvailable, assignedHullBases, duplicateHull, catalogShipStatus, fleetStatusTotals, catalogAircraftStatus, hullGroups, hullVersionNumber, visibleHullVersion, currentHullVersion, pendingPortModernizations, shipStatus, validateHullSchedule, planCancelModernization, hullDisplayName } from './fleet-rules.js?v=1.54';

// v1.4: proposta grafica A (Ammiragliato italiano); logica e dati privati invariati.
// Sicurezza: repertorio storico pubblico separato dai cataloghi e dallo stato della partita, che restano privati.
// I cataloghi e il porto restano privati e sono salvati con mutazioni protette Nhost.
const $ = id => document.getElementById(id);
// Icone originali 64×64 separate per fazione; il lato proviene dalla sessione Nhost.
const APP_FAVICON_PATHS = Object.freeze({
  "axis": "./assets/axis/icons/favicon.png?v=1.54",
  "allies": "./assets/allies/icons/favicon.png?v=1.54",
  "default": "./assets/common/icons/favicon.png?v=1.54"
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
  favicon.href = APP_FAVICON_PATHS[side] || APP_FAVICON_PATHS.default;
  // Assicura che il favicon dinamico prevalga su eventuali icone preesistenti.
  document.head.append(favicon);
}

const TABS = [['porto','Porto'],['battaglia','Battaglia'],['navi','Naviglio'],['aerei','Aerei'],['storico','Storico'],['gestione','Gestione campagna'],['regole','Regole']];
const ORDER = ['BB1','BB2','BB3','AIR','CA1','CA2','CA3','CL1','CL2','CL3','CL4','CV1','SUB'];
const COLORS = Object.freeze({BB:'#B33939',BC:'#E08283',CA:'#1B4F72',CL:'#7FB3D5',DD:'#2E8B57',CV:'#17A398',SUB:'#6C3483',B:'#6B4A32',DB:'#8B6F47',F:'#7E7E7E',FB:'#54585B',HB:'#4A3728',PB:'#6E6259',TB:'#5C6670'});
let model = null, activeTab = 'porto', term = '', catalogFilter = '', catalogStatusFilter = '', theme = '', saving = false;
const catalogSort = {navi:{key:'fleetDefault',direction:1},aerei:{key:'nome',direction:1}};
let stopWatching = null, syncPending = false, syncWorking = false, syncTimer = null;
let syncRetryDelay = 500, sessionEpoch = 0;
let syncMode = 'automatico';
let refreshSerial = 0;
const expandedHulls=new Set();
let lastSeaAircraftAttempt='',seaAircraftNotice='';

function make(tag, className = '', content) { const x=document.createElement(tag); if(className)x.className=className; if(content!==undefined && content!==null)x.textContent=String(content); return x; }
function text(parent,tag,value,cls='') {const e=make(tag,cls,value);parent.append(e);return e;}
function toast(message,isError=false){ const x=$('toast');x.textContent=message;x.style.color=isError?'var(--sunk)':'';x.classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove('on'),3800); }
function themeApply(){if(theme)document.documentElement.setAttribute('data-theme',theme);else document.documentElement.removeAttribute('data-theme');}
function showLogin(){ sessionEpoch++;refreshSerial++;stopLiveSync();saving=false;model=null;catalogStatusFilter='';expandedHulls.clear();lastSeaAircraftAttempt='';seaAircraftNotice='';delete document.body.dataset.side;$('command-root').replaceChildren();$('app-page').hidden=true;$('login-page').hidden=false;$('password').value='';document.title='Campagna Mediterraneo — Accesso';setAppFavicon(null); }
// Stessa tabella stagioni utilizzata dalla validazione SQL di Nhost.
function campaignYear(){return CAMPAIGN_YEARS[Number(model.campaign.turn_index)] ?? 1940;}
function catalogStatus(unit,ships=true){return ships?catalogShipStatus(unit,model.state.perdite,model.campaign.turn_index):catalogAircraftStatus(unit,model.campaign.turn_index);}
function fleetTotals(){return fleetStatusTotals(model.state.navi,model.state.perdite,model.campaign.turn_index);}
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
 // v1.30: una sola base CSS; le testate e le insegne restano specifiche della fazione.
 const root=$('command-root');root.replaceChildren();
 const header=document.createElement('template');header.innerHTML=model.side==='axis'?HEADER_AXIS:HEADER_ALLIES;
 root.append(header.content.cloneNode(true));
 const wrap=make('div','wrap');
 for(const [id] of TABS){const p=make('section','panel');p.id='p-'+id;wrap.append(p);}
 root.append(wrap);
 $('btn-refresh').addEventListener('click',async()=>{if(saving)return;try{if(await refresh())toast('Dati ricaricati da Nhost.');}catch(e){toast(e.message,true);}});
 $('btn-logout').addEventListener('click',async()=>{if(saving){toast('Attendere la fine del salvataggio.',true);return;}const done=signOut();showLogin();await done;toast('Disconnessione eseguita.');});
 $('btn-tema').addEventListener('click',()=>{theme=theme==='dark'?'light':theme==='light'?'':'dark';themeApply();localStorage.setItem('campagna-v02-theme',theme);});
 document.title=(model.side==='axis'?'Regia Marina':'Royal Navy')+' — Mediterraneo 1940–43';
 render();
 startLiveSync();
}
function render(){if(!model)return;renderTabs();renderPennant();const p=$('p-'+activeTab);if(!p)return;p.replaceChildren();
 if(activeTab==='porto')renderPort(p);else if(activeTab==='battaglia')renderBattle(p);else if(activeTab==='storico')renderHistory(p);
 else if(activeTab==='navi'||activeTab==='aerei')renderCatalog(p,activeTab);else if(activeTab==='gestione')renderManagement(p);else renderRules(p);
}
// v1.24 — sagome ritagliate dall'immagine B approvata, non ridisegnate.
const TAB_ICONS=Object.freeze({"porto":[46,48],"battaglia":[44,42],"navi":[77,26],"aerei":[66,48],"storico":[50,39],"gestione":[47,47],"regole":[42,47]});
function tabIcon(id){
 if(!Object.hasOwn(TAB_ICONS,id))return null;
 const ico=make('span','command-tab-icon command-tab-icon-'+id);
 ico.setAttribute('aria-hidden','true');
 return ico;
}
const NAVAL_STATUS=Object.freeze({attiva:['Operativa','operational','ok'],riparazione:['In riparazione','repair','ripara'],affondata:['Persa','sunk','sunk'],costruzione:['In costruzione','construction','building'],ritirata:['Ritirata',null,'retired']});
const AIR_STATUS=Object.freeze({attiva:['Operativo','ok'],obsoleto:['Obsoleto','obsolete'],costruzione:['In costruzione','building']});
function aircraftStatusBadge(status){const [label,cls]=AIR_STATUS[status];const node=make('span','air-status '+cls);text(node,'span',label);return node;}
function navalIcon(file){const img=make('img','naval-icon');const assets={operational:'operational.png',repair:'repair.png',sunk:'sunk.webp',construction:'construction.svg'};img.src='./assets/common/status/'+assets[file]+'?v=1.54';if(file==='sunk')img.classList.add('naval-sunk-icon');if(file==='construction')img.classList.add('naval-construction-icon');img.alt='';img.setAttribute('aria-hidden','true');return img;}
function navalStatusBadge(status){const [label,file,cls]=NAVAL_STATUS[status]||NAVAL_STATUS.attiva;const node=make('span','naval-state '+cls);if(file)node.append(navalIcon(file));text(node,'span',label);return node;}
function appendHistoricalProfile(td,u){
 const cls=historicalClass(u);const local=localShipProfile(u,cls);const remote=shipProfile(u,cls);const profile=local?{...local,page:remote?.page||null}:remote;if(!profile)return;
 const wrap=make('span','historical-profile navypedia-profile'+(profile.local?' local-profile':'')+(profile.scaled?' scaled-local-profile':''));
 const source=make(profile.page?'a':'span','profile-source',profile.image?profile.caption+(profile.local?'':' · non in scala'):'Scheda Navypedia · profilo non disponibile');
 if(profile.page){source.href=profile.page;source.target='_blank';source.rel='noopener noreferrer';source.referrerPolicy='no-referrer';}source.title=(profile.local?'Tavola del giocatore · scala indicativa · ':'Navypedia · non in scala · ')+profile.caption;
 if(profile.image){
  const img=make('img');img.alt=profile.caption;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
  // Non mostrare un'icona rotta né usare una sagoma generica se l'host rifiuta la richiesta.
  img.addEventListener('error',()=>{img.remove();source.textContent=profile.page?'Navypedia · apri scheda':'Profilo non disponibile';},{once:true});
  img.src=profile.image;wrap.append(img);
 }
 wrap.append(source);td.append(wrap);
}
// Le miniature approvate sono servite solo dal repository della fazione.
// Se non esiste ancora il file, lasciare una nota compatta e il riferimento storico.
function appendAircraftProfile(td,u){
 const profile=aircraftProfile(u,model.side);
 const layout=make('span','aircraft-name-layout'),info=make('span','aircraft-name-info');
 if(profile?.image){
  const img=make('img','aircraft-thumbnail');img.alt=profile.label;img.width=160;img.height=80;img.loading='lazy';img.decoding='async';
  img.title=profile.credit+' · '+profile.license;
  img.addEventListener('error',()=>{img.remove();layout.classList.remove('has-aircraft-image');text(info,'span','Miniatura locale non disponibile','aircraft-profile-note');},{once:true});
  layout.classList.add('has-aircraft-image');img.src=profile.image;layout.append(img);
 }
 const name=make('span','aircraft-name-title');appendUnitFlag(name,u,false);text(name,'span',u.nome??'—','unit-name');info.append(name);
 if(profile?.page){
  const link=make('a','aircraft-profile-source',profile.image?'Scheda War Thunder':'Scheda War Thunder · profilo da importare');link.href=profile.page;link.target='_blank';link.rel='noopener noreferrer';link.referrerPolicy='no-referrer';info.append(link);
  if(profile.match==='variant'||profile.match==='family')text(info,'span',(profile.match==='variant'?'Variante diversa: ':'Variante di riferimento: ')+profile.label,'aircraft-profile-note');
 }else if(!profile?.image)text(info,'span','Profilo da reperire','aircraft-profile-note');
 layout.append(info);td.append(layout);
}
function renderTabs(){const nav=$('tabs');nav.replaceChildren();for(const [id,label]of TABS){
 const b=make('button','');{const ico=tabIcon(id);if(ico)b.append(ico);}text(b,'span',label);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(id===activeTab));b.onclick=()=>{if(activeTab!==id){activeTab=id;term='';catalogFilter='';catalogStatusFilter='';if(id==='navi')Object.assign(catalogSort.navi,{key:'fleetDefault',direction:1});}render();};nav.append(b);
 $('p-'+id).classList.toggle('on',id===activeTab);
}}
function renderPennant(){const p=$('pennant');p.replaceChildren();const fleets=fleetTotals();const pts=scores();
 const cells=[['Turno',String(Number(model.campaign.turn_index)+1)+' di '+SEASONS.length],['Stagione',SEASONS[model.campaign.turn_index]||'—']];
 for(const [key,value] of cells){const c=make('div','cell');text(c,'div',key,'k');text(c,'div',value,'v');p.append(c);}
 const cell=make('div','cell fleet-summary-cell axis-fleet-cell');text(cell,'div','Stato del naviglio','k');const state=make('div','nhost-summary naval-four-states');
 for(const [key,label,cls]of [['attiva','Operative','ok'],['riparazione','In riparazione','ripara'],['affondata','Perse','sunk'],['costruzione','In costruzione','building']]){
  const d=make('div','naval-total '+cls);const top=make('div','naval-total-top');top.append(navalIcon(NAVAL_STATUS[key][1]));text(top,'span',fleets[key].length,'v num');d.append(top);text(d,'span',label,'naval-total-label');state.append(d);
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
function available(unit, state=model.state){return isAvailable(unit,state,model.campaign.turn_index);}
function matchClass(unit,cls){return unit && (cls||[]).some(x=>x===unit.cls||x===unit.tipo);}
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
  const used=assignedHullBases(state,squad.id,index);
  const list=accepted.filter(u=>{
    if(!available(u,state))return false;
    if(isShip(u)&&used.has(shipBase(u.nome)))return false;
    if(squad.id==='AIR')return !allowed.length||allowed.includes(u.tipo);
    if(squad.id==='CV1'&&allowed.includes('AEREO_IMB'))return u.base==='IMBARCABILE';
    return matchClass(u,allowed);
  });
  // NON reinserire versioni ritirate tra le opzioni selezionabili.
  // Eventuali vecchie assegnazioni sono mostrate separatamente, disabilitate.
  return list.sort((a,b)=>a.nome.localeCompare(b.nome,'it',{numeric:true}));
}
// Cambia solo assegnazioni esistenti, compatibili e operative.
let lastUpgradeAttempt='',upgradeNotice='';
function planPortUpgrade(draft,turnIndex=model.campaign.turn_index){
 const pending=pendingPortModernizations(draft,turnIndex),applied=[],blocked=[];
 if(duplicateHull(draft))return {applied,blocked:pending};
 const squads=new Map(sortedSquads().map(s=>[s.id,s]));
 for(const p of pending){
  const squad=squads.get(p.id),slots=draft.porto[p.id];
  if(!squad||p.index>=squadSlots(squad,slots,draft).len||!optionPool(squad,p.index,p.oldName,draft).some(u=>u.nome===p.next.nome)||
    (p.id==='CV1'&&p.index===0&&slots.slice(1+Number(p.next.hangar??3)).some(Boolean))){
   blocked.push(p);continue;
  }
  slots[p.index]=p.next.nome;applied.push(p);
 }
 return {applied,blocked};
}
function portUpgradeWarning(p){
 const pending=pendingPortModernizations(model.state,model.campaign.turn_index);
 if(!pending.length)return;
 note(p,'Ammodernamenti nel Porto da sincronizzare: '+pending.map(x=>x.oldName+' → '+x.next.nome+' ('+x.id+')').join('; ')+'. '+(upgradeNotice||'Verificare prima della battaglia.'));
 if(canEdit())appendAction(p,'Sincronizza ammodernamenti',async()=>{try{await refresh();}catch(e){toast(e.message,true);}},false,'btn primary');
}
async function syncPortUpgrades(m,epoch,serial,live){
 if(!canEdit())return;
 const key=[m.campaign.id,m.side,m.campaign.turn_index,m.stateRevision].join('|');
 if(live&&lastUpgradeAttempt===key)return;
 lastUpgradeAttempt=key;upgradeNotice='';
 const draft=structuredClone(m.state),plan=planPortUpgrade(draft,m.campaign.turn_index);
 if(!plan.applied.length){if(plan.blocked.length)upgradeNotice='Sostituzione incompatibile con casella o capacità della squadra. Correggerla manualmente.';return;}
 saving=true;
 try{
  const saved=await saveLogistics(draft,m.stateRevision);
  if(epoch!==sessionEpoch||serial!==refreshSerial||model!==m)return;
  m.state=saved.state;m.stateRevision=saved.revision;m.updatedAt=saved.updatedAt;
  if(plan.blocked.length)upgradeNotice='Alcune sostituzioni richiedono correzione manuale.';
  toast(plan.applied.length+' ammodernamenti sincronizzati nel Porto.');
 }catch(e){
  if(epoch===sessionEpoch&&model===m)upgradeNotice='Nhost non ha accettato la sincronizzazione automatica: '+e.message+'. Nessuna modifica forzata.';
 }finally{if(epoch===sessionEpoch)saving=false;}
}
// Importazione richiesta dal proprietario della campagna: sicura, limitata alla
// propria fazione, senza duplicati e protetta dalla revisione Nhost.
async function syncAlliesSeaAircraft(m,epoch,serial){
 if(m.side!=='allies')return;
 const missing=missingSeaAircraft(m.state);
 if(!missing.length){seaAircraftNotice='';return;}
 if(!canEdit()){
  seaAircraftNotice='Sea Hurricane, Sea Gladiator e Seafire in attesa: la campagna non permette modifiche durante una battaglia.';
  return;
 }
 const key=[m.campaign.id,m.side,m.stateRevision].join('|');
 if(lastSeaAircraftAttempt===key)return;
 lastSeaAircraftAttempt=key;
 const draft=structuredClone(m.state);
 draft.aerei.push(...missing);
 saving=true;
 try{
  const saved=await saveLogistics(draft,m.stateRevision);
  if(epoch!==sessionEpoch||serial!==refreshSerial||model!==m)return;
  m.state=saved.state;m.stateRevision=saved.revision;m.updatedAt=saved.updatedAt;
  seaAircraftNotice='';
  toast('Aerei navali Allies aggiunti: '+missing.map(u=>u.nome).join(' e ')+'.');
 }catch(e){
  if(epoch===sessionEpoch&&model===m)
   seaAircraftNotice='Inserimento non confermato da Nhost: '+e.message+'. Nessuna modifica forzata.';
 }finally{if(epoch===sessionEpoch)saving=false;}
}
async function persistDraft(draft){
  if(!canEdit())throw new Error('Le modifiche sono bloccate durante una battaglia.');
  saving=true;
  try{
    const saved=await saveLogistics(draft,model.stateRevision);
    model.state=saved.state;model.stateRevision=saved.revision;model.updatedAt=saved.updatedAt;
    saving=false;render();toast('Modifica salvata su Nhost.');
  }catch(error){
    toast(error.message,true);
    if(/revisione|concorren|scadut/i.test(error.message)){
      saving=false;try{await refresh();}catch{}
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
// v1.52 — un'anteprima nitida sostituisce l'immagine sbiadita dietro al testo.
let portPreviewDismissBound=false;
function closePortPreviews(){
 for(const row of document.querySelectorAll('#p-porto .port-preview-open')){
  row.classList.remove('port-preview-open');
  row.querySelector('.port-preview-trigger')?.setAttribute('aria-expanded','false');
 }
}
function bindPortPreviewDismiss(){
 if(portPreviewDismissBound)return;
 portPreviewDismissBound=true;
 document.addEventListener('pointerdown',event=>{
  if(!event.target?.closest?.('.port-preview-trigger'))closePortPreviews();
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closePortPreviews();});
}
function appendPortSlotVisual(row,unit,slotId){
 const profile=portUnitImage(unit,model.side);
 if(!profile)return;
 bindPortPreviewDismiss();
 const button=make('button','port-preview-trigger port-preview-trigger--'+profile.kind);
 button.type='button';
 button.title='Ingrandisci: '+unit.nome;
 button.setAttribute('aria-label','Ingrandisci il profilo di '+unit.nome);
 button.setAttribute('aria-expanded','false');
 const previewId='port-preview-'+slotId;
 button.setAttribute('aria-controls',previewId);
 const thumb=make('img','port-preview-thumb');
 thumb.alt='';thumb.loading='lazy';thumb.decoding='async';thumb.referrerPolicy='no-referrer';
 thumb.draggable=false;thumb.setAttribute('aria-hidden','true');
 const preview=make('div','port-preview-panel');
 preview.id=previewId;preview.setAttribute('role','tooltip');
 const full=make('img','port-preview-full');
 full.alt='';full.loading='lazy';full.decoding='async';full.referrerPolicy='no-referrer';
 full.draggable=false;full.setAttribute('aria-hidden','true');
 const caption=make('span','port-preview-caption',unit.nome);
 preview.append(full,caption);
 const removePreview=()=>{
  button.remove();preview.remove();row.classList.remove('has-port-preview');
 };
 thumb.addEventListener('error',removePreview,{once:true});
 full.addEventListener('error',removePreview,{once:true});
 button.append(thumb);
 thumb.src=profile.src;full.src=profile.src;
 button.onclick=()=>{
  const next=!row.classList.contains('port-preview-open');
  closePortPreviews();
  if(next){row.classList.add('port-preview-open');button.setAttribute('aria-expanded','true');}
 };
 row.classList.add('has-port-preview');row.append(button,preview);
}
function slotCard(container,s,names){
  const id=s.id, cat=catalogMap(),groups=hullGroups(model.state.navi),pts=names.reduce((acc,n)=>acc+Number(cat.get(n)?.pt||0),0);
  const sq=card(s.nome,`${id} · ${pts} pt`);sq.dataset.id=id;sq.classList.add('nhost-squadcard');
  const {nN,len}=squadSlots(s,names);
  for(let i=0;i<len;i++){
    const name=names[i]||'',u=cat.get(name)||{},type=u.tipo||'';
    const role=id==='AIR'?(s.nucleo?.clsPerSlot?.[i]||'·'):(i<nN?'·':'›');
    const r=make('div','slot nhost-slot-readonly');r.style.background=name?(COLORS[type]||'#555'):'#485764';r.style.opacity=name?'1':'.62';
    text(r,'span',role,'role');text(r,'span',type,'sigla');
    appendPortSlotVisual(r,name?u:null,id+'-'+i);
    const sel=make('select','nhost-slot-select');sel.disabled=!canEdit();sel.setAttribute('aria-label',`${s.nome}, casella ${i+1}`);
    const blank=make('option','','— libera —');blank.value='';sel.append(blank);
    const candidates=optionPool(s,i,name);
     for(const entry of candidates){const o=make('option','',isShip(entry)?hullDisplayName(entry,groups.get(shipBase(entry.nome))):entry.nome);o.value=entry.nome;sel.append(o);}
     if(!candidates.length&&!name){const o=make('option','','Nessuna unità disponibile per questa casella');o.disabled=true;sel.append(o);}
    if(name&&!Array.from(sel.options).some(o=>o.value===name)){const o=make('option','',(isShip(u)?hullDisplayName(u,groups.get(shipBase(name))):name)+' (non disponibile: liberare la casella)');o.value=name;o.disabled=true;sel.append(o);sel.title='Questa versione non è più utilizzabile nel turno corrente.';}
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
 portUpgradeWarning(p);
  const info=make('div','row');info.style.marginBottom='14px';
  const duplicate=duplicateHull(model.state);if(duplicate)note(p,'Attenzione: scafo duplicato nel porto ('+duplicate+'). Liberare le caselle duplicate prima di generare una battaglia.');
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
  if(isNave&&original&&(hullGroups(model.state.navi).get(shipBase(original.nome))||[]).length>1)name.readOnly=true;
  const cls=isNave?controlField(form,'Classe',original?.cls||'C','select', [['BB','Corazzata'],['C','Incrociatore'],['DD','Cacciatorpediniere'],['CV','Portaerei'],['SUB','Sommergibile']]):null;
  const tipo=controlField(form,'Tipo',original?.tipo|| (isNave?'CA':'F'),'text');tipo.maxLength=12;
  const anno=controlField(form,'Anno entrata in servizio',original?.anno??campaignYear(),'number');
  const ritirato=controlField(form,'Anno ritiro (vuoto = nessuno)',original?.ritirato||'','number');
  const points=controlField(form,'Punti',original?.pt??0,'number');
  const extra=isNave?controlField(form,'Hangar (solo portaerei)',original?.hangar??'','number'):controlField(form,'Base',original?.base||'LAND BASED','select',[['LAND BASED','Terrestre'],['IDRO','Idrovolante'],['IMBARCABILE','Imbarcabile']]);
   const profileChoice=isNave?null:controlField(form,'Profilo immagine',original?.profileKey||'','select',
    [['','Automatico (nome e variante)'],...aircraftChoices(model.side).map(x=>[x.key,x.label+' · '+x.key])]);
   if(profileChoice)note(form,'Automatico riconosce nomi e varianti più comuni. Per un nome personalizzato selezioni un profilo esplicito: rimarrà associato anche dopo una rinomina.');
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
    else {
      value.base=extra.value;
      const choice=profileChoice?.value||'';
      if(choice)value.profileKey=choice;
      else {
       // Se il nome nuovo è riconosciuto, il profilo segue la nuova variante.
       // Se il nome è personalizzato, conserviamo l'identità precedente.
       const resolved=aircraftKey({nome:newName},model.side);
       const previous=original?aircraftKey(original,model.side):null;
       if(resolved)delete value.profileKey;
       else if(previous)value.profileKey=previous;
       else delete value.profileKey;
      }
     }
    if(original){const idx=items.findIndex(u=>u.nome===prevName);if(idx<0){toast('Unità non più presente.',true);return;}items[idx]=value;}
    else items.push(value);
    if(isNave){
     const versions=hullGroups(items).get(shipBase(newName))||[];
     if(versions.length>1&&(!original||shipBase(prevName)!==shipBase(newName))){toast('Usare Ammodernamento dalla nave esistente.',true);return;}
     const problem=validateHullSchedule(versions);if(problem){toast(problem,true);return;}
    }
    if(prevName&&prevName!==newName)for(const slots of Object.values(draft.porto||{}))for(let i=0;i<slots.length;i++)if(slots[i]===prevName)slots[i]=newName;
    save.disabled=true;
    try{await persistDraft(draft);dialog.close();}catch{save.disabled=false;}
  };
  dialog.showModal();
}
function dialogUpgrade(base){
 if(!canEdit())return;
 const versions=hullGroups(model.state.navi).get(base)||[],last=versions.at(-1);
 if(!last||shipStatus(base,model.state.perdite,model.campaign.turn_index)==='affondata'||hullVersionNumber(last.nome)>=3)return;
 const nextName=base+' ('+({2:'II',3:'III'}[hullVersionNumber(last.nome)+1])+')';
 const dialog=make('dialog','nhost-edit-dialog'),form=make('form','nhost-edit-form');form.method='dialog';
 text(form,'h3','Ammodernamento '+base);
 note(form,'Nuova configurazione '+nextName+'. Stesso scafo, rapporti passati invariati.');
 const minYear=Math.max(campaignYear()+1,Number(last.anno)+1);
 const year=controlField(form,'Anno di aggiornamento',minYear,'number');year.min=String(minYear);year.max='1943';year.required=true;
 const points=controlField(form,'Nuovi punti',last.pt,'number');points.step='any';points.max='1000';points.required=true;
 const hangar=last.cls==='CV'?controlField(form,'Hangar',last.hangar??3,'number'):null;if(hangar){hangar.max='20';hangar.required=true;}
 const actions=make('div','nhost-form-buttons'),cancel=make('button','btn','Annulla'),save=make('button','btn primary','Programma aggiornamento');cancel.type='button';save.type='submit';cancel.onclick=()=>dialog.close();actions.append(cancel,save);form.append(actions);dialog.append(form);document.body.append(dialog);
 dialog.addEventListener('close',()=>dialog.remove());
 form.onsubmit=async e=>{
  e.preventDefault();if(!canEdit())return;
  const y=Number(year.value),pt=Number(points.value),capacity=hangar?Number(hangar.value):null;
  if(!year.value||!points.value||!Number.isInteger(y)||y<Math.max(campaignYear()+1,Number(last.anno)+1)||y>1943||!Number.isFinite(pt)||pt<0||pt>1000||(hangar&&(!hangar.value||!Number.isInteger(capacity)||capacity<0||capacity>20))){toast('Verificare anno, punti e hangar.',true);return;}
  const draft=cloneState(),group=hullGroups(draft.navi).get(base)||[],prev=group.at(-1);
  if(!prev||prev.nome!==last.nome||shipStatus(base,draft.perdite,model.campaign.turn_index)==='affondata'){toast('Scafo non più aggiornabile.',true);return;}
  if(prev.ritirato&&Number(prev.ritirato)<=y){toast('Nave già prevista in ritiro entro l’anno scelto.',true);return;}
  if([...draft.navi,...draft.aerei].some(u=>u.nome===nextName)){toast('Versione già presente.',true);return;}
  const next={...prev,nome:nextName,anno:y,pt,ritirato:prev.ritirato??null};if(hangar)next.hangar=capacity;
  prev.ritirato=y;draft.navi.push(next);
  const problem=validateHullSchedule([...group,next]);if(problem){toast(problem,true);return;}
  save.disabled=true;try{await persistDraft(draft);dialog.close();}catch{save.disabled=false;}
 };
 dialog.showModal();
}
async function cancelModernization(name){
 if(!canEdit())return;
 const draft=cloneState(),plan=planCancelModernization(draft,name,model.campaign.turn_index);
 if(plan.reason){toast(plan.reason,true);return;}
 const retirement=plan.previous.ritirato==null?'nessun ritiro programmato':'ritiro '+plan.previous.ritirato;
 const description=plan.restore?' La configurazione '+plan.previous.nome+' recupererà la propria scadenza ('+retirement+').':' La data di ritiro precedente resterà invariata.';
 if(!confirm('Rimuovere soltanto l’ammodernamento '+name+'?'+description+' La nave e lo storico resteranno invariati.'))return;
 draft.navi=draft.navi.filter(u=>u.nome!==name).map(u=>u.nome===plan.previous.nome?plan.previous:u);
 try{await persistDraft(draft);if((hullGroups(model.state.navi).get(shipBase(name))||[]).length<2)expandedHulls.delete(shipBase(name));}catch{}
}
async function removeUnit(kind,item){
 if(!canEdit())return;const oldName=item.nome;
 if(kind==='navi'&&(hullGroups(model.state.navi).get(shipBase(oldName))||[]).length>1){toast('La catena delle versioni è protetta.',true);return;}
 if(kind==='navi'){
  const label=hullDisplayName(item,hullGroups(model.state.navi).get(shipBase(oldName)));
  const typed=prompt('ATTENZIONE: questa operazione elimina l’intera nave '+label+' dal catalogo, non un ammodernamento. Le caselle occupate saranno liberate. Per confermare digitare esattamente: '+label,'');
  if(typed===null||typed.trim().toLocaleUpperCase('it')!==label.toLocaleUpperCase('it'))return;
 }else if(!confirm('Rimuovere '+oldName+' dal catalogo? Le eventuali caselle occupate saranno liberate.'))return;
 const draft=cloneState();draft[kind]=draft[kind].filter(u=>u.nome!==oldName);
 for(const arr of Object.values(draft.porto||{}))for(let i=0;i<arr.length;i++)if(arr[i]===oldName)arr[i]='';
 try{await persistDraft(draft);}catch{}
}
// Ordinamento locale e stabile. Non modifica il catalogo salvato su Nhost.
function compareCatalogUnits(a,b,key,direction,ships=true){
 const get=u=>key==='stato'?(ships?NAVAL_STATUS:AIR_STATUS)[catalogStatus(u,ships)][0]:key==='historicalClass'?historicalClass(u):u[key];
 const av=get(a),bv=get(b),aEmpty=av===null||av===undefined||av==='',bEmpty=bv===null||bv===undefined||bv==='';
 if(aEmpty||bEmpty){if(aEmpty&&bEmpty)return 0;return aEmpty?1:-1;}
 if(['pt','anno','ritirato'].includes(key))return (Number(av)-Number(bv))*direction;
 return String(av).localeCompare(String(bv),'it',{numeric:true,sensitivity:'base'})*direction;
}
const NATION_LABELS=Object.freeze({it:'Italia (Regno d’Italia)', 'de-air':'Luftwaffe (Germania)', 'de-navy':'Kriegsmarine (Germania)', 'gb-navy':'Royal Navy (Regno Unito)', 'gb-air':'Aviazione britannica (RAF / Fleet Air Arm)', fr:'Francia Libera', au:'Australia', nz:'Nuova Zelanda', ca:'Canada', us:'Stati Uniti', gr:'Grecia'});
// Immagini storiche corrispondenti ai nomi dei file forniti. Il badge CSS sottostante è il fallback.
const HISTORICAL_FLAG_URLS=Object.freeze({it:'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Italy_%281861-1946%29_crowned.svg','de-air':'https://upload.wikimedia.org/wikipedia/commons/1/11/War_ensign_of_Germany_%281938%E2%80%931945%29.svg','de-navy':'https://upload.wikimedia.org/wikipedia/commons/1/11/War_ensign_of_Germany_%281938%E2%80%931945%29.svg'});
function appendUnitFlag(parent,unit,ships){
 const nation=unitNation(unit,model.side,ships);
 if(!nation)return;
 const flag=make('span','unit-flag');flag.dataset.nation=nation;
 flag.title=NATION_LABELS[nation];flag.setAttribute('role','img');flag.setAttribute('aria-label',flag.title);
 const url=(model.side==='allies'&&['gb-navy','gb-air','au','nz','ca','fr','us'].includes(nation))?'./assets/allies/flags/'+(nation==='us'?'us-flag.webp':nation==='fr'?'free-france.webp':'white-ensign.webp')+'?v=1.54':HISTORICAL_FLAG_URLS[nation];
 if(url){
  const img=make('img','historical-unit-flag');img.alt='';img.setAttribute('aria-hidden','true');img.referrerPolicy='no-referrer';img.hidden=true;
  img.addEventListener('load',()=>{img.hidden=false;flag.classList.add('historical-flag-loaded');},{once:true});
  img.addEventListener('error',()=>img.remove(),{once:true});
  img.src=url;flag.append(img);
 }
 parent.append(flag);
}
function renderCatalog(p,tab){
 const ships=tab==='navi',all=(ships?model.state.navi:model.state.aerei)||[];
 const groups=ships?hullGroups(all):new Map();
 if(ships)for(const base of expandedHulls)if((groups.get(base)||[]).length<2)expandedHulls.delete(base);
 const source=ships?[...groups.values()].map(v=>visibleHullVersion(v,model.state.perdite,model.campaign.turn_index)):all;
 const add=card(ships?'Aggiungi nave':'Aggiungi aereo');add.classList.add('axis-catalog-add');const body=make('div','nhost-card-body');const bt=make('button','btn primary',ships?'Aggiungi nave':'Aggiungi aereo');bt.disabled=!canEdit();bt.onclick=()=>dialogUnit(tab);body.append(bt);
 text(body,'div',canEdit()?'Può modificare le anagrafiche; ogni salvataggio è immediato sul database.':'Modifiche bloccate finché è in corso una battaglia.','nhost-notification');add.append(body);add.classList.add('catalog-add-bottom');
 const bar=make('div','nhost-actions catalog-filter-bar');const sel=make('select','btn sm');
 const typeCodes=SHIP_TYPES;
 const types=[...new Set([...typeCodes,...source.map(u=>String(u.tipo||'').trim().toUpperCase()).filter(Boolean)])];
 const opts=ships?[['','Tipo Nave'],...types.map(code=>[code,code])]:[['','Tutte le basi'],['LAND BASED','Terrestri'],['IDRO','Idrovolanti'],['IMBARCABILE','Imbarcati']];
 for(const [value,label] of opts){const o=make('option','',label);o.value=value;sel.append(o);}sel.value=catalogFilter;
 const search=make('input','btn sm nhost-search');search.type='search';search.placeholder=ships?'Cerca nome o classe':'Cerca un nome';search.value=term;search.setAttribute('aria-label','Cerca unità');
 sel.setAttribute('aria-label',ships?'Tipo Nave':'Base aereo');bar.append(sel);let stateSel=null;{stateSel=make('select','btn sm');stateSel.setAttribute('aria-label',ships?'Stato nave':'Stato aereo');const stateOpts=ships?[['','Tutti gli stati'],['attiva','Operative'],['riparazione','In riparazione'],['affondata','Perse'],['costruzione','In costruzione'],['ritirata','Ritirate']]:[['','Tutti gli stati'],['attiva','Operativi'],['obsoleto','Obsoleti'],['costruzione','In costruzione']];for(const [val,label] of stateOpts){const o=make('option','',label);o.value=val;stateSel.append(o);}stateSel.value=catalogStatusFilter;bar.append(stateSel);}bar.append(search);if(ships){const reset=make('button','btn sm','Ordine predefinito');reset.type='button';reset.title='Tipo, classe più costosa, punti';reset.onclick=()=>{Object.assign(catalogSort.navi,{key:'fleetDefault',direction:1});update();};bar.append(reset);}const count=make('span','catalog-visible-count');count.setAttribute('role','status');count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');bar.append(count);p.append(bar);
 if(ships)text(p,'div','Una riga per scafo. Espandere il numero di configurazioni per consultare le versioni passate e future.','note');
 if(!ships&&model.side==='allies'&&missingSeaAircraft(model.state).length){
  note(p,seaAircraftNotice||'Le versioni navali Sea mancanti saranno inserite automaticamente quando il catalogo Allies sarà modificabile.');
  if(canEdit())appendAction(p,'Riprova inserimento Sea',async()=>{lastSeaAircraftAttempt='';try{await refresh();}catch(e){toast(e.message,true);}},false,'btn sm');
 }
 const wrap=make('div','card scroll-x catalog-table');if(ships)wrap.classList.add('axis-catalog-table');if(!ships)wrap.classList.add('air-catalog-table');p.append(wrap);
 const fields=ships?[['Nome','nome'],['Classe','historicalClass'],['Tipo','tipo'],['Punti','pt'],['Anno','anno'],['Ritiro','ritirato'],['Stato','stato'],['Azioni',null]]:
  [['Nome','nome'],['Tipo','tipo'],['Punti','pt'],['Anno','anno'],['Ritiro','ritirato'],['Base','base'],['Stato','stato'],['Azioni',null]];
 const update=()=>{
  const filtered=source.filter(x=>{const c=!catalogFilter||(ships?String(x.tipo||'').trim().toUpperCase()===catalogFilter:x.base===catalogFilter);return c&&(!catalogStatusFilter||catalogStatus(x,ships)===catalogStatusFilter)&&(String(x.nome||'')+' '+String(x.tipo||'')+(ships?' '+historicalClass(x)+' '+(groups.get(shipBase(x.nome))||[]).map(u=>u.nome).join(' '):'')).toLocaleLowerCase('it').includes(term.toLocaleLowerCase('it'));});
  count.textContent=filtered.length+' di '+source.length+(ships?' scafi visibili':' aerei visibili');
  const order=catalogSort[tab];
  const defaultCompare=ships&&order.key==='fleetDefault'?fleetOrder(source,historicalClass):null;
  const sorted=filtered.map((unit,index)=>({unit,index})).sort((a,b)=>
   (defaultCompare?defaultCompare(a.unit,b.unit):compareCatalogUnits(a.unit,b.unit,order.key,order.direction,ships))||a.index-b.index).map(x=>x.unit);
  wrap.replaceChildren();text(wrap,'div','Ordina per:','note catalog-sort-hint');const tbl=make('table');tbl.setAttribute('role','table');tbl.setAttribute('aria-label',ships?'Catalogo naviglio':'Catalogo aerei');const thead=make('thead');thead.setAttribute('role','rowgroup');const header=make('tr');header.setAttribute('role','row');
  for(const [label,key] of fields){
   const th=make('th');th.scope='col';th.setAttribute('role','columnheader');if(key==='pt')th.style.textAlign='center';
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
  thead.append(header);tbl.append(thead);const tbody=make('tbody');tbody.setAttribute('role','rowgroup');
  function versionLabel(u,versions){
   const base=shipBase(u.nome),lost=shipStatus(base,model.state.perdite,model.campaign.turn_index)==='affondata';
   const representative=visibleHullVersion(versions,model.state.perdite,model.campaign.turn_index);
   if(lost)return u===representative?'Ultima configurazione · persa':versions.indexOf(u)>versions.indexOf(representative)?'Annullata':'Superata';
   if(Number(u.anno)>campaignYear())return 'Prevista';
   if(u===representative)return currentHullVersion(versions,model.campaign.turn_index)?'Attuale':'Ritirata';
   return 'Superata';
  }
  function renderRow(u,child=false){
   const base=shipBase(u.nome),versions=ships?(groups.get(base)||[u]):[u];
   const row=make('tr',child?'hull-version-row':'');row.setAttribute('role','row');const values=ships?[u.nome,historicalClass(u)||'—',u.tipo,u.pt,u.anno,u.ritirato??'—',catalogStatus(u)]:[u.nome,u.tipo,u.pt,u.anno,u.ritirato??'—',u.base||'—',catalogStatus(u,false)];
   values.forEach((v,i)=>{const key=fields[i][1];const td=make('td',key==='pt'?'num':'');td.setAttribute('role','cell');td.dataset.label=fields[i][0];if(key==='historicalClass'){td.classList.add('ship-historical-class');td.textContent=v;}else if(key==='nome'){td.classList.add('unit-name-cell');if(ships)td.classList.add('axis-ship-name');if(ships&&!child&&versions.length>1){const button=make('button','btn sm hull-toggle',(expandedHulls.has(base)?'▾':'▸')+' '+versions.length);button.type='button';button.setAttribute('aria-expanded',String(expandedHulls.has(base)));button.setAttribute('aria-label','Versioni di '+base);button.onclick=()=>{if(expandedHulls.has(base))expandedHulls.delete(base);else expandedHulls.add(base);update();};td.append(button);}if(ships){appendUnitFlag(td,u,true);const shown=hullDisplayName(u,versions);text(td,'span',shown??'—','axis-name');if(child)text(td,'span','↳ Configurazione '+(['','I','II','III'][hullVersionNumber(u.nome)]||''),'hull-version-tag');appendHistoricalProfile(td,u);}else appendAircraftProfile(td,u);}else if(key==='tipo'){const t=make('span','catalog-type'+(ships?' axis-type':''),v??'—');t.dataset.type=String(u.tipo||'').trim().toUpperCase();td.append(t);}else if(key==='stato'){if(!ships)td.append(aircraftStatusBadge(v));else if(child)text(td,'span',versionLabel(u,versions),'hull-version-tag');else td.append(navalStatusBadge(v));}else{td.textContent=v??'—';if(key==='tipo'&&COLORS[u.tipo])td.style.color=COLORS[u.tipo];}if(key==='pt')td.style.textAlign='center';row.append(td);});
   const action=make('td','nhost-catalog-actions');action.setAttribute('role','cell');const edit=make('button','btn sm','Modifica');edit.disabled=!canEdit();edit.onclick=()=>dialogUnit(tab,u);
   action.append(edit);
   if(!child&&ships){
    const last=versions.at(-1);
    const upgrade=make('button','btn sm hull-upgrade','Ammodernamento');upgrade.disabled=!canEdit()||!last||hullVersionNumber(last.nome)>=3||Math.max(Number(last.anno),campaignYear())>=1943||shipStatus(base,model.state.perdite,model.campaign.turn_index)==='affondata'||(last.ritirato&&Number(last.ritirato)<=Math.max(Number(last.anno),campaignYear())+1);
    upgrade.onclick=()=>dialogUpgrade(base);action.append(upgrade);
   }
   if(ships&&child&&u!==versions[0]&&Number(u.anno)>campaignYear()){
    const cancellation=planCancelModernization(model.state,u.nome,model.campaign.turn_index,versions);
    const del=make('button','btn sm danger','Rimuovi');del.type='button';del.disabled=!canEdit()||!!cancellation.reason;
    del.title=cancellation.reason||(!canEdit()?'Modifiche bloccate durante una battaglia.':'Annulla soltanto questo ammodernamento');
    del.onclick=()=>cancelModernization(u.nome);action.append(del);
    if(cancellation.reason)text(action,'span',cancellation.reason,'hull-version-tag');
   }
   if(!child&&(!ships||versions.length===1)){const del=make('button','btn sm danger',ships?'Elimina nave':'Rimuovi');del.disabled=!canEdit();del.title=ships?'Elimina definitivamente lo scafo dal catalogo (non un ammodernamento)':'Rimuovi aereo';del.onclick=()=>removeUnit(tab,u);action.append(del);}
   row.append(action);tbody.append(row);
  }
  for(const u of sorted){
   renderRow(u);
   const versions=ships?(groups.get(shipBase(u.nome))||[]):[];
   if(versions.length>1&&expandedHulls.has(shipBase(u.nome)))for(const v of versions)renderRow(v,true);
  }
  tbl.append(tbody);wrap.append(tbl);if(!filtered.length)text(wrap,'div','Nessuna unità trovata.','nhost-card-body note');
 };
 if(ships)text(p,'div','Ordine predefinito: tipo BB → BC → CV → CA → CL → DD → SUB; classi raggruppate per valore massimo, punti decrescenti.','note');
 if(ships)text(p,'div','Silhouette chiare V2 dalle tavole originali · stessa scala grafica fra i profili locali (lunghezze fuori tutto indicative). Le altre classi conservano i disegni Navypedia, non in scala.','note axis-profile-note');
 p.append(add);
 sel.onchange=()=>{catalogFilter=sel.value;update();};if(stateSel)stateSel.onchange=()=>{catalogStatusFilter=stateSel.value;update();};search.oninput=()=>{term=search.value;update();};update();
}
// Solo la fazione proprietaria puo modificare la propria battaglia prima di concluderla.
function canEditBattle(){return model&&!saving&&model.campaign.phase==='battle'&&!model.campaign[model.side+'_concluded'];}
function damageFromBattle(b){return (b?.gruppi||[]).flatMap(g=>g.unita||[]).reduce((s,u)=>
 s+(u.esito==='affondata'?Number(u.pt):u.esito==='danneggiata'?Number(u.pt)/2:0),0);}
function appendAction(parent,label,handler,disabled=false,klass='btn sm'){
 const b=make('button',klass,label);b.type='button';b.disabled=disabled;
 b.onclick=()=>{if(!saving)return handler();};parent.append(b);return b;
}
async function storeBattle(battle){
 if(!canEditBattle())return;
 saving=true;
 try{
  const result=await saveBattle(battle,model.stateRevision);
  model.state=result.state;model.stateRevision=result.revision;model.updatedAt=result.updatedAt??model.updatedAt;
  toast('Battaglia salvata su Nhost.');
 }catch(e){toast(e.message,true);throw e;}
 finally{saving=false;try{await refresh();}catch(e){toast(e.message,true);}}
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
 const panel=card(reportSideTitle(fleet.side)+(fleet.side===model.side?' · Propria flotta':' · Flotta avversaria'));panel.classList.add('battle-report-fleet');
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
    const outcome=text(line,'span',reportOutcome(unit),'st');outcome.classList.add('report-outcome');
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
 const totals=make('div','battle-report-grid');
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
 const pendingUpgrade=!b&&phase==='battle'&&!mineConcluded&&pendingPortModernizations(model.state,model.campaign.turn_index).length>0;
 if(pendingUpgrade)portUpgradeWarning(p);
 if(phase==='battle'&&!mineConcluded){
  appendAction(toolbar,b?'Estrai un’altra formazione':'Genera formazione',async()=>{
   if(b&&!confirm('Sostituire la formazione? Tutti gli esiti segnati verranno cancellati.'))return;
   const seed=new Uint32Array(1);crypto.getRandomValues(seed);
   try{await storeBattle(generateBattle(model.state,model.campaign.turn_index,seed[0]));}
   catch(e){if(!/Nhost|revisione|errore|scadut/i.test(e.message))toast(e.message,true);}
  },saving||pendingUpgrade,'btn primary');
  const seedInput=make('input','btn sm num');seedInput.type='number';seedInput.min='0';seedInput.max='4294967295';seedInput.placeholder='Seme';seedInput.style.width='110px';
  if(b)seedInput.value=b.seed;toolbar.append(seedInput);
  appendAction(toolbar,'Carica seme',async()=>{
   const seed=Number(seedInput.value);
   if(!seedInput.value||!Number.isInteger(seed)||seed<0||seed>4294967295){toast('Seme non valido.',true);return;}
   if(b&&!confirm('Caricare un altro seme? Si perderanno gli esiti registrati.'))return;
   try{await storeBattle(generateBattle(model.state,model.campaign.turn_index,seed));}
   catch(e){toast(e.message,true);}
  },saving||pendingUpgrade);
  if(b)appendAction(toolbar,'Scarta formazione',async()=>{
   if(!confirm('Scartare la formazione attuale?'))return;
   try{await storeBattle(null);}catch{}
  },saving,'btn sm danger');
 }
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
  else note(p,'Rapporto in elaborazione: l'app controlla automaticamente gli aggiornamenti.');
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
    finally{saving=false;try{await refresh();}catch(e){toast(e.message,true);}}
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
    finally{saving=false;try{await refresh();}catch(e){toast(e.message,true);}}
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
 table.append(tbody);const wrapper=make('div','scroll-x');wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Tabella andamento della campagna, scorrimento orizzontale');wrapper.append(table);c.append(wrapper);p.append(c);
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
// v1.39 — il catalogo non espone l'origine degli snapshot. Non attribuire
// un'origine certa ai vecchi archivi: il prefisso Manuale è riservato alla UI.
const MANUAL_PREFIX='[Manuale] ';
const SNAPSHOT_LABEL_MAX=80;
function snapshotKind(save){
 const label=String(save?.label||'').trim();
 if(label.startsWith(MANUAL_PREFIX))return 'manual';
 if(/^(?:\[auto(?:matico)?\]|auto(?:matico)?\s*[:·—-]|backup\s+automatico\b|salvataggio\s+automatico\b|backup\s+pre[-\s]?(?:reset|ripristino|restore|load)\b|auto[-\s]?save\b)/i.test(label))return 'automatic';
 return 'legacy';
}
function snapshotDisplayLabel(save){
 const label=String(save?.label||'');
 return snapshotKind(save)==='manual'?label.trim().slice(MANUAL_PREFIX.length):label;
}
function manualSnapshotLabel(name){
 const label=String(name||'').trim();
 if(!label||label.length>SNAPSHOT_LABEL_MAX-MANUAL_PREFIX.length)return null;
 return MANUAL_PREFIX+label;
}
function snapshotTimestamp(value){
 if(!value)return 'Non disponibile';
 const date=new Date(value);
 if(!Number.isFinite(date.getTime()))return 'Non disponibile';
 return new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(date);
}
function groupSnapshots(saves){
 const groups={manual:[],automatic:[],legacy:[]};
 for(const save of saves||[])groups[snapshotKind(save)].push(save);
 return groups;
}

function renderManagement(p) {
  const connection=card('Connessione Nhost');
  const cb=make('div','nhost-card-body');
  const status=make('div','nhost-statusbar');status.id='nhost-statusbar';status.textContent=statusText();cb.append(status);
  const warning=make('div','nhost-status nhost-synced','Dati privati Nhost · Le formazioni avversarie diventano consultabili soltanto nei rapporti delle battaglie concluse. Le due fazioni avanzano insieme.');cb.append(warning);
  connection.append(cb);p.append(connection);
  const pending=model.pendingRequest;
  const intro=card('Campagna attiva','Salvataggio automatico');
  const ib=make('div','nhost-card-body');
  const groups=groupSnapshots(model.saves);
  note(ib,'La campagna attiva è salvata su Nhost a ogni modifica confermata. Non occorre creare un punto di ripristino per uscire o riprendere la partita.');
  summary(ib,[['Campagna',model.campaign.name],['Stagione attuale',SEASONS[model.campaign.turn_index]||'—'],['Punti di ripristino',model.saves.length]]);
  const last=make('div','active-save-status');
  text(last,'span','Ultima modifica registrata da Nhost · '+(model.side==='axis'?'Regia Marina':'Royal Navy'),'k');
  text(last,'strong',snapshotTimestamp(model.updatedAt),'num');
  text(last,'span','Ora del dispositivo · revisione '+String(model.stateRevision??'—'),'note');
  ib.append(last);
  note(ib,'Il timestamp riguarda i dati della propria fazione, non quelli privati dell’avversario.');
  intro.append(ib);p.append(intro);

  if(pending){
    const save=model.saves.find(x=>x.snapshot_id===pending.snapshot_id);
    const box=card('Richiesta in attesa della seconda fazione','Conferma obbligatoria');
    const body=make('div','nhost-card-body');
    note(body,'Operazione proposta da '+(pending.requested_by==='axis'?'Regia Marina':'Royal Navy')+': '+(save?snapshotDisplayLabel(save):'Punto di ripristino')+'.');
    summary(body,[['Regia Marina',pending.axis_approved?'Ha confermato':'In attesa'],['Royal Navy',pending.allies_approved?'Ha confermato':'In attesa']]);
    const buttons=make('div','nhost-actions');
    const ownApproved=model.side==='axis'?pending.axis_approved:pending.allies_approved;
    if(!ownApproved){
      appendAction(buttons,'Approva ripristino / reset',async()=>{
        if(!confirm('Confermare il caricamento? Tutti i dati della campagna corrente saranno sostituiti. Verrà prima creato un backup automatico.'))return;
        saving=true;try{await resolveCampaignRequest(pending.id,true);toast('Conferma registrata.');await refresh();}
        catch(e){toast(e.message,true);try{await refresh();}catch(err){toast(err.message,true);}}finally{saving=false;if(model)render();}
      },saving,'btn primary');
    }else note(body,'Ha già confermato. Attendere l’altra fazione.');
    appendAction(buttons,'Rifiuta richiesta',async()=>{
      if(!confirm('Rifiutare la richiesta senza modificare la campagna?'))return;
      saving=true;try{await resolveCampaignRequest(pending.id,false);await refresh();toast('Richiesta rifiutata.');}
      catch(e){toast(e.message,true);}finally{saving=false;if(model)render();}
    },saving,'btn sm danger');
    body.append(buttons);box.append(body);p.append(box);
  }

  const create=card('Crea punto di ripristino');const createBody=make('div','nhost-card-body');
  note(createBody,'Copia congelata dell’intera campagna: entrambe le flotte, porti, perdite, battaglie, punteggi e rapporti. Le modifiche successive non aggiornano questa copia.');
  const newRow=make('div','nhost-actions');const name=make('input','btn sm');
  name.type='text';name.maxLength=SNAPSHOT_LABEL_MAX-MANUAL_PREFIX.length;name.placeholder='Nome del punto di ripristino';name.style.minWidth='min(100%,260px)';name.setAttribute('aria-label','Nome del punto di ripristino');newRow.append(name);
  appendAction(newRow,'Crea punto di ripristino',async()=>{
    const label=manualSnapshotLabel(name.value);if(!label){toast('Inserire un nome valido, massimo '+(SNAPSHOT_LABEL_MAX-MANUAL_PREFIX.length)+' caratteri.',true);return;}
    saving=true;try{await createCampaignSave(label);await refresh();toast('Punto di ripristino creato.');}
    catch(e){toast(e.message,true);}finally{saving=false;if(model)render();}
  },saving||!!pending,'btn primary');createBody.append(newRow);create.append(createBody);p.append(create);

  const archive=card('Archivio punti di ripristino',String(model.saves.length));const archiveBody=make('div','nhost-card-body');
  note(archiveBody,'Il ripristino sostituisce la campagna attiva con la copia selezionata e richiede l’approvazione di entrambe le fazioni. Eliminare una copia non elimina la campagna attiva.');
  if(!model.snapshotStatusSupported)note(archiveBody,'Stato di compatibilità degli archivi non disponibile: completare la migrazione Nhost v1.0.');
  if(model.saves.some(s=>s.restorable===false))note(archiveBody,'I vecchi archivi incompleti sono conservati ma non possono essere caricati in sicurezza.');
  function appendSnapshotRows(body,saves,kind){
   for(const save of saves){
    const row=make('div','snapshot-row nhost-actions');
    const unavailable=save.restorable===false;
    const displayed=snapshotDisplayLabel(save);
    const info=make('div','snapshot-info');text(info,'strong',displayed);
    text(info,'span',SEASONS[save.turn_index]||'Turno '+(Number(save.turn_index)+1),'snapshot-season');
    text(info,'span','Creato: '+snapshotTimestamp(save.created_at),'note');
    if(unavailable)text(info,'span','Archivio storico non ripristinabile','note');
    row.append(info);
    const buttons=make('div','snapshot-actions nhost-actions');
    // Non alterare le etichette dei backup riconosciuti, utili per classificarli.
    if(kind!=='automatic')appendAction(buttons,'Rinomina',async()=>{
      const renamed=prompt('Nuovo nome del punto di ripristino:',displayed);
      if(renamed===null)return;
      const proposed=renamed.trim();
      const label=kind==='manual'?manualSnapshotLabel(proposed):proposed;
      if(!label||label.length>SNAPSHOT_LABEL_MAX||(kind==='legacy'&&snapshotKind({label})!=='legacy')){toast('Nome non valido o prefisso riservato.',true);return;}
      saving=true;try{await renameCampaignSave(save.snapshot_id,label);await refresh();toast('Nome aggiornato.');}
      catch(e){toast(e.message,true);}finally{saving=false;if(model)render();}
    },saving||!!pending);
    appendAction(buttons,'Carica',async()=>{
      if(!confirm('Richiedere il ripristino di «'+displayed+'»? La campagna attiva verrà sostituita solo dopo l’approvazione dell’altra fazione.'))return;
      saving=true;try{await requestCampaignLoad(save.snapshot_id);await refresh();toast('Richiesta di ripristino inviata.');}
      catch(e){toast(e.message,true);}finally{saving=false;if(model)render();}
    },saving||!!pending||unavailable,'btn sm');
    appendAction(buttons,'Elimina',async()=>{
      if(!confirm('Eliminare definitivamente il punto di ripristino «'+displayed+'»?\\nLa campagna attiva non verrà modificata. L’operazione non è reversibile.'))return;
      saving=true;try{await deleteCampaignSave(save.snapshot_id);await refresh();toast('Punto di ripristino eliminato.');}
      catch(e){toast(e.message,true);alert('Impossibile eliminare: '+e.message);}
      finally{saving=false;if(model)render();}
    },saving||!!pending,'btn sm danger');
    row.append(buttons);body.append(row);
   }
  }
  text(archiveBody,'h4','Punti manuali · '+groups.manual.length,'snapshot-section-title');
  if(!groups.manual.length)note(archiveBody,'Nessun nuovo punto manuale presente.');
  appendSnapshotRows(archiveBody,groups.manual,'manual');
  if(groups.legacy.length){
    text(archiveBody,'h4','Archivi precedenti · '+groups.legacy.length,'snapshot-section-title');
    note(archiveBody,'Origine non identificabile dai dati esposti da Nhost. Questi archivi restano disponibili con le normali azioni.');
    appendSnapshotRows(archiveBody,groups.legacy,'legacy');
  }
  archive.append(archiveBody);p.append(archive);

  const backups=card('Backup automatici',''+groups.automatic.length);const backupsBody=make('div','nhost-card-body');
  note(backupsBody,'Sono mostrati separatamente i backup riconoscibili dalla denominazione. La creazione automatica e il backup preventivo di reset/ripristino sono gestiti dal server; il frontend non genera copie duplicate. La frequenza effettiva dipende dalle funzioni Nhost installate.');
  if(!groups.automatic.length)note(backupsBody,'Nessun backup riconoscibile nell’archivio corrente.');
  appendSnapshotRows(backupsBody,groups.automatic,'automatic');backups.append(backupsBody);p.append(backups);

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
      if(points.value.trim()===''||!Number.isFinite(value)||value<0||value>1000000||Math.abs(Math.round(value*100)-value*100)>1e-7){
        toast('Inserire un punteggio valido, massimo due decimali.',true);return;
      }
      saving=true;
      try{await setScenarioScore(value);await refresh();toast('Punteggio iniziale salvato.');}
      catch(e){toast(e.message,true);try{await refresh();}catch(err){toast(err.message,true);}}
      finally{saving=false;if(model)render();}
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
    catch(e){toast(e.message,true);}finally{saving=false;if(model)render();}
  },saving||!!pending,'btn sm danger');rb.append(controls);reset.append(rb);p.append(reset);
}

function renderRules(p){const row=make('div','row');
 for(const [title,entries]of [['Regole della campagna',['Un’unica campagna e un unico turno condivisi fra Axis e Allies.','I cataloghi, i porti e le formazioni in corso restano privati; dopo entrambe le conclusioni il rapporto mostra le unità impegnate da entrambe le fazioni.','Navi affondate: perdita definitiva. Navi danneggiate: riparazione secondo le regole originali.','Aerei distrutti: contano come danno nella battaglia ma non vengono radiati permanentemente.']],['Chiusura e sincronizzazione',['Ogni giocatore registra esclusivamente i danni subiti dalla propria flotta.','«Concludi battaglia» congela la formazione e i danni del giocatore.','Dopo entrambe le conclusioni il server calcola automaticamente i tre valori del nemico e i punteggi.','Il turno avanza soltanto quando entrambi premono «Pronto per il prossimo turno».']]]){
  const c=card(title);c.style.flex='1 1 420px';const content=make('div','nhost-card-body');const ol=make('ol');for(const entry of entries)text(ol,'li',entry);content.append(ol);c.append(content);row.append(c);
 }
 p.append(row);note(p,'Il motore condiviso applica le regole di estrazione e rinforzo delle versioni HTML originali. La v1.0 uniforma i controlli di disponibilità degli scafi.');
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
  campaign:model.campaign,ownRevision:model.stateRevision,
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
 if(syncWorking||saving||editingPanel()){
  syncTimer=setTimeout(runLiveRefresh,900);return;
 }
 syncPending=false;syncWorking=true;
 const before={...model.campaign},side=model.side;
 try{
  const applied=await refresh({live:true});
  if(!applied){if(model)syncPending=true;return;}
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

function editingPanel(){
 const target=document.activeElement;
 return !!document.querySelector('dialog[open]') || !!(target && ['INPUT','TEXTAREA','SELECT'].includes(target.tagName) && $('command-root').contains(target));
}
async function refresh({live=false}={}){
 const epoch=sessionEpoch,serial=++refreshSerial;
 const m=await loadCampaign();
 if(epoch!==sessionEpoch||serial!==refreshSerial)return false;
 if(live&&(saving||editingPanel()))return false;
 if(!['axis','allies'].includes(m.side))throw new Error('Fazione non valida.');
 if(!Array.isArray(m.state.navi)||!Array.isArray(m.state.aerei)||!m.state.porto)throw new Error('Catalogo Nhost incompleto: verificare importazione 005.');
 const old=model;
 if(old&&old.side===m.side&&old.campaign.id===m.campaign.id&&(
    Number(m.stateRevision)<Number(old.stateRevision)||Number(m.campaign.revision)<Number(old.campaign.revision))) {
   queueLiveRefresh();return false;
 }
 const newSession=!old||old.side!==m.side||!$('p-porto');
 const changed=newSession||String(old.campaign.id)!==String(m.campaign.id)||String(old.campaign.revision)!==String(m.campaign.revision)||String(old.stateRevision)!==String(m.stateRevision);
 model=m;
 if(newSession){expandedHulls.clear();lastUpgradeAttempt='';upgradeNotice='';lastSeaAircraftAttempt='';seaAircraftNotice='';}
 await syncPortUpgrades(m,epoch,serial,live);
 if(epoch!==sessionEpoch||serial!==refreshSerial||model!==m)return false;
 await syncAlliesSeaAircraft(m,epoch,serial);
 if(epoch!==sessionEpoch||serial!==refreshSerial||model!==m)return false;
 if(newSession){showApp();}
 else {
  const status=$('nhost-statusbar');if(status)status.textContent=statusText();
  // Nessun ridisegno su notifiche equivalenti; i campi attivi sono protetti prima e dopo la richiesta.
  if(!live||changed||Number(m.stateRevision)!==Number(old.stateRevision))render();
 }
 return true;
}
$('login-form').addEventListener('submit',async ev=>{ev.preventDefault();const b=$('login-submit');b.disabled=true;b.textContent='Accesso…';$('login-error').hidden=true;
 try{await signIn($('email').value.trim(),$('password').value,$('remember').checked);await refresh();toast('Accesso riuscito: Quadro Comando caricato.');}
 catch(e){$('login-error').hidden=false;$('login-error').textContent=e.message;await signOut();showLogin();$('login-error').hidden=false;$('login-error').textContent=e.message;}
 finally{b.disabled=false;b.textContent='Accedi';}
});
$('show-password').addEventListener('click',()=>{const x=$('password');x.type=x.type==='password'?'text':'password';$('show-password').textContent=x.type==='password'?'Mostra password':'Nascondi password';});
try{theme=localStorage.getItem('campagna-v02-theme')||'';themeApply();}catch{}
$('dlg-ok').addEventListener('click',()=>$('dlg').close());
(async()=>{const b=$('login-submit');b.disabled=true;try{if(await resumeSession())await refresh();else showLogin();}catch(e){showLogin();$('login-error').hidden=false;$('login-error').textContent=e.message;}finally{b.disabled=false;}})();