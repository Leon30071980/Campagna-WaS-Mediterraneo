// Campagna W@S Mediterraneo v1.2 — regole comuni per porto e motore.
export const CAMPAIGN_YEARS = Object.freeze([1940,1940,1941,1941,1941,1942,1942,1942,1943,1943]);
export function shipBase(name) {
  return String(name || '').replace(/\s*\((I|II|III)\)$/,'');
}
// v1.36 — identità dello scafo indipendente dalla configurazione.
export function hullVersionNumber(name){
 const m=String(name||'').match(/\s*\((I|II|III)\)$/);
 return m?({I:1,II:2,III:3}[m[1]]):1;
}
const versionCompare=(a,b)=>Number(a.anno)-Number(b.anno)||hullVersionNumber(a.nome)-hullVersionNumber(b.nome)||String(a.nome).localeCompare(String(b.nome),'it');
export function hullGroups(units){
 const groups=new Map();
 for(const u of units||[]){const key=shipBase(u.nome);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(u);}
 for(const v of groups.values())v.sort(versionCompare);
 return groups;
}
export function enteredVersion(versions,year){return [...versions].reverse().find(u=>Number(u.anno)<=year)||null;}
export function currentHullVersion(versions,turnIndex){
 const year=CAMPAIGN_YEARS[Number(turnIndex)],u=enteredVersion(versions,year);
 return u&&!(u.ritirato&&year>=Number(u.ritirato))?u:null;
}
export function visibleHullVersion(versions,losses,turnIndex){
 const base=shipBase(versions[0]?.nome);
 const turns=Object.entries(losses||{}).filter(([name,loss])=>shipBase(name)===base&&loss?.stato==='affondata').map(([,loss])=>Number(loss.turno)).filter(t=>Number.isInteger(t)&&t>=0&&t<CAMPAIGN_YEARS.length);
 const year=CAMPAIGN_YEARS[turns.length?Math.min(...turns):Number(turnIndex)];
 return enteredVersion(versions,year)||versions[0];
}
export function pendingPortModernizations(state,turnIndex){
 const groups=hullGroups(state?.navi),pending=[];
 for(const [id,slots] of Object.entries(state?.porto||{}))for(const [index,name] of (slots||[]).entries()){
  const versions=groups.get(shipBase(name));if(!versions||versions.length<2)continue;
  const old=versions.find(u=>u.nome===name),next=currentHullVersion(versions,turnIndex);
  if(old&&next&&old.nome!==next.nome&&versions.indexOf(next)>versions.indexOf(old)&&Number(old.anno)<=CAMPAIGN_YEARS[Number(turnIndex)]&&shipStatus(name,state?.perdite,turnIndex)==='attiva')pending.push({id,index,oldName:name,next});
 }
 return pending;
}
export function validateHullSchedule(versions){
 const sorted=[...versions].sort(versionCompare);
 for(let i=0;i<sorted.length;i++){
  const u=sorted[i],year=Number(u.anno),retired=u.ritirato?Number(u.ritirato):null;
  if(!Number.isInteger(year)||retired!==null&&(!Number.isInteger(retired)||retired<=year))return 'Il ritiro deve seguire l’entrata in servizio.';
  if(i&&(hullVersionNumber(u.nome)<=hullVersionNumber(sorted[i-1].nome)||Number(sorted[i-1].anno)>=year))return 'Le versioni devono essere numerate in ordine cronologico e avere anni diversi.';
  if(i&&(!sorted[i-1].ritirato||Number(sorted[i-1].ritirato)>year))return 'Le date delle versioni dello stesso scafo non possono sovrapporsi.';
 }
 return '';
}
export function shipStatus(name, losses, turnIndex) {
  let repairing = false;
  const base = shipBase(name);
  for (const [key, loss] of Object.entries(losses || {})) {
    if (shipBase(key) !== base) continue;
    if (loss?.stato === 'affondata') return 'affondata';
    if (loss?.stato === 'danneggiata' && turnIndex <= Number(loss.turno) + 1) repairing = true;
  }
  return repairing ? 'riparazione' : 'attiva';
}
export function isAvailable(unit, state, turnIndex) {
  const year = CAMPAIGN_YEARS[Number(turnIndex)];
  if (!unit || year === undefined || !Number.isFinite(Number(unit.anno)) || Number(unit.anno) > year) return false;
  if (unit.ritirato && year >= Number(unit.ritirato)) return false;
  const ship = unit.kind ? unit.kind === 'nave' : Object.hasOwn(unit, 'cls');
  if(!ship)return true;
  if(shipStatus(unit.nome,state?.perdite,turnIndex)!=='attiva')return false;
  const versions=(state?.navi||[]).filter(u=>shipBase(u.nome)===shipBase(unit.nome)).sort(versionCompare);
  return !versions.length||currentHullVersion(versions,turnIndex)?.nome===unit.nome;
}
// Esclude ESCLUSIVAMENTE la casella in modifica, non tutte le omonime.
export function assignedHullBases(state, excludeSquad = null, excludeIndex = -1) {
  const names = new Set((state?.navi || []).map(u => u.nome));
  const used = new Set();
  for (const [id, entries] of Object.entries(state?.porto || {})) {
    for (const [index, name] of (entries || []).entries()) {
      if (id === excludeSquad && index === excludeIndex) continue;
      if (names.has(name)) used.add(shipBase(name));
    }
  }
  return used;
}
export function duplicateHull(state) {
  const names = new Set((state?.navi || []).map(u => u.nome));
  const used = new Set();
  for (const entries of Object.values(state?.porto || {})) for (const name of entries || []) {
    if (!names.has(name)) continue;
    const base = shipBase(name);
    if (used.has(base)) return base;
    used.add(base);
  }
  return null;
}

// v1.20 — stati di presentazione. Non alterano isAvailable né le regole di combattimento.
export function catalogShipStatus(unit,losses,turnIndex){
 const year=CAMPAIGN_YEARS[Number(turnIndex)];
 const loss=shipStatus(unit.nome,losses,turnIndex);
 if(loss==='affondata')return loss;
 if(Number(unit.anno)>year)return 'costruzione';
 if(loss==='riparazione')return loss;
 if(unit.ritirato&&year>=Number(unit.ritirato))return 'ritirata';
 return 'attiva';
}

export function fleetStatusTotals(units,losses,turnIndex){
 const year=CAMPAIGN_YEARS[Number(turnIndex)],lists={attiva:[],riparazione:[],affondata:[],costruzione:[]};
 for(const versions of hullGroups(units).values()){
  const representative=visibleHullVersion(versions,losses,turnIndex),loss=shipStatus(representative.nome,losses,turnIndex);
  if(loss==='affondata'||loss==='riparazione'){lists[loss].push(representative);continue;}
  const active=currentHullVersion(versions,turnIndex);
  if(active){lists.attiva.push(active);continue;}
  if(versions.every(u=>Number(u.anno)>year))lists.costruzione.push(versions[0]);
 }
 return lists;
}

// v1.21 — stato aereo, stessa finestra temporale di isAvailable.
export function catalogAircraftStatus(unit,turnIndex){
 const year=CAMPAIGN_YEARS[Number(turnIndex)];
 if(Number(unit.anno)>year)return 'costruzione';
 if(unit.ritirato&&year>=Number(unit.ritirato))return 'obsoleto';
 return 'attiva';
}

// v1.37 — annullamento sicuro di una configurazione non ancora entrata in servizio.
function containsExactReference(node,name){
 if(node===name)return true;
 if(!node||typeof node!=='object')return false;
 return Object.entries(node).some(([key,value])=>key===name||containsExactReference(value,name));
}
export function planCancelModernization(state,name,turnIndex,group){
 const versions=group||hullGroups(state?.navi).get(shipBase(name))||[];
 const current=versions.find(u=>u.nome===name),year=CAMPAIGN_YEARS[Number(turnIndex)];
 if(!current||versions.length<2||versions[0]===current)return {reason:'La configurazione iniziale non può essere rimossa.'};
 if(!Number.isFinite(Number(current.anno))||year===undefined||Number(current.anno)<=year)return {reason:'Configurazione già entrata in servizio: deve essere conservata.'};
 if(versions.at(-1)!==current)return {reason:'Rimuovere prima l’ammodernamento successivo.'};
 if(['porto','perdite','storico','battaglia'].some(key=>containsExactReference(state?.[key],name)))return {reason:'Configurazione già referenziata nel Porto, nelle perdite o nello storico.'};
 const prev=versions.at(-2);
 // Un ritiro coincidente con l'entrata della versione rimossa è la fine della
 // configurazione precedente; ripristinare la data finale ereditata.
 // Un ritiro antecedente è invece conservato (possibile intervallo storico).
 const restore=Number(prev.ritirato)===Number(current.anno);
 const previous={...prev,ritirato:restore?(current.ritirato??null):(prev.ritirato??null)};
 const reason=validateHullSchedule([...versions.slice(0,-2),previous]);
 return reason?{reason}:{previous,restore,remove:name};
}
