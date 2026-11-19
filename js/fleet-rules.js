// Campagna W@S Mediterraneo v1.2 — regole comuni per porto e motore.
export const CAMPAIGN_YEARS = Object.freeze([1940,1940,1941,1941,1941,1942,1942,1942,1943,1943]);
export function shipBase(name) {
  return String(name || '').replace(/\s*\((I|II|III)\)$/,'');
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
  return !ship || shipStatus(unit.nome, state?.perdite, turnIndex) === 'attiva';
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
 const year=CAMPAIGN_YEARS[Number(turnIndex)];
 const groups=new Map(),lists={attiva:[],riparazione:[],affondata:[],costruzione:[]};
 for(const unit of units||[]){const key=shipBase(unit.nome);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(unit);}
 for(const versions of groups.values()){
  const eligible=versions.find(u=>Number(u.anno)<=year&&!(u.ritirato&&year>=Number(u.ritirato)));
  const loss=shipStatus(versions[0].nome,losses,turnIndex);
  if(loss==='affondata'||loss==='riparazione'){lists[loss].push(eligible||versions[0]);continue;}
  if(eligible){lists.attiva.push(eligible);continue;}
  if(versions.every(u=>Number(u.anno)>year)){
   const first=versions.reduce((a,b)=>Number(a.anno)<=Number(b.anno)?a:b);
   lists.costruzione.push(first);
  }
 }
 return lists;
}
