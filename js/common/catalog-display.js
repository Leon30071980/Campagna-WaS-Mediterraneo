// Campagna W@S Mediterraneo v1.3 — ordinamento e insegne, solo presentazione.
export const SHIP_TYPES = Object.freeze(["BB","BC","CV","CA","CL","DD","SUB"]);
function typeCode(u){return String(u?.tipo||'').trim().toUpperCase();}

export function fleetOrder(source,classOf){
 const key=u=>{const c=String(classOf(u)||'').trim();return typeCode(u)+'\u0000'+(c?'class:'+c.toLocaleLowerCase('it'):'unit:'+String(u.nome||'').toLocaleLowerCase('it'));};
 const points=u=>Number.isFinite(Number(u.pt))?Number(u.pt):0;
 const costs=new Map();
 for(const u of source){const k=key(u);costs.set(k,Math.max(costs.get(k)??-Infinity,points(u)));}
 const rank=u=>{const i=SHIP_TYPES.indexOf(typeCode(u));return i<0?SHIP_TYPES.length:i;};
 const cmp=(a,b)=>String(a).localeCompare(String(b),'it',{numeric:true,sensitivity:'base'});
 return (a,b)=>rank(a)-rank(b)||cmp(typeCode(a),typeCode(b))||costs.get(key(b))-costs.get(key(a))||cmp(key(a),key(b))||points(b)-points(a)||cmp(a.nome,b.nome);
}

function normalizedName(u){return String(u?.nome||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s*\((?:I|II|III|AA)\)$/,'');}

export function unitNation(u,side,ships){
 const n=normalizedName(u);
 if(side==='allies'){
  // Il paese indica il servizio militare, non il costruttore del velivolo.
  const country=String(u?.nazione||u?.nazionalita||u?.nation||u?.country||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(/^(US|USA|U\.S\.A\.|UNITED STATES|UNITED STATES OF AMERICA|STATI UNITI|STATI UNITI D'AMERICA|AMERICA|USAAC|USAAF|USAF|USN|USMC)$/.test(country)||/^(USS|USAAF|USAAC|USN|USMC)\b/.test(n)||/\((?:US|USA|USAAF|USN)\)$/.test(n))return 'us';
  if(/^(GB|UK|GBR|UNITED KINGDOM|GREAT BRITAIN|REGNO UNITO|INGHILTERRA|ROYAL NAVY|RAF|RN|FAA|FLEET AIR ARM)$/.test(country)||/^(?:HMS|RAF|FAA)\b/.test(n))return ships?'gb-navy':'gb-air';
  if(/^(FR|FRA|FRANCE|FRANCIA|FREE FRANCE|FRANCE LIBRE|FRANCIA LIBERA|FAFL|FNFL)$/.test(country)||/^(FAFL|FNFL|FREE FRANCE|FRANCE LIBRE|FRANCIA LIBERA)\b/.test(n)||/\((?:FR|FRA|FAFL|FNFL)\)$/.test(n))return 'fr';
  if(/^(CA|CAN|CANADA|RCN|RCAF)$/.test(country)||/^HMCS\b/.test(n))return 'ca';
  if(/^(AU|AUS|AUSTRALIA|RAN|RAAF)$/.test(country)||/^HMAS\b/.test(n))return 'au';
  if(/^(NZ|NZL|NEW ZEALAND|NUOVA ZELANDA|RNZN|RNZAF)$/.test(country)||/^HMNZS\b/.test(n))return 'nz';
  if(!ships&&/^(?:B[ .-]?(?:17|24|25|26)|PBY[ .-]?5|P[ .-]?(?:38|39|40|47|51)|F[ .-]?(?:4F|4U|6F)|SBD|TBF|TBM|A[ .-]?(?:20|26))(?:[A-Z0-9]*)(?:\b|$)/.test(n))return 'us';
  if(!ships&&/^(?:MARTIN\s*167\s*F|D[.\s-]*520|MS[.\s-]*406|MB[.\s-]*15[12]|POTEZ\s*63\d|LEO\s*45[1-9]|BREGUET\s*69[1-5])(?:\b|$)/.test(n))return 'fr';
 }
 if(ships){
  if(side==='axis')return /^U[\s-]*\d+$/.test(n)?'de-navy':'it';
  if(side!=='allies')return '';
  if(/^(SUFFREN|LE FANTASQUE|LE MALIN|LE TERRIBLE|LA GALISSONNIERE|MONTCALM|GEORGES LEYGUES|GLOIRE)$/.test(n.replace(/^(?:FNFL|FS|FFNS)\s+/,'')))return 'fr';
  if(/^(HOBART|PERTH|SYDNEY|NAPIER|NESTOR|NIZAM|VAMPIRE|VENDETTA|VOYAGER|WATERHEN)$/.test(n))return 'au';
  if(/^LEANDER$/.test(n))return 'nz';
  if(/^WASP$/.test(n))return 'us';
  if(/^(VASILISSA OLGA|GLAFKOS|NIREFS|PROTEFS|TRITON \(GRE\))$/.test(n))return 'gr';
  return 'gb-navy';
 }
 if(side==='allies')return 'gb-air';
 if(side!=='axis')return '';
 const compact=n.replace(/[^A-Z0-9]/g,'');
 if(/^(BF109G14|BF110|FW190|FW200|HE111)/.test(compact))return 'de-air';
 if(/^(JU87R2|BF109G|JU88A4)/.test(compact))return 'it';
 if(/^(BA65|CR42|MC202|MC205|RE2000|RE2001|P108|BR20|Z506|Z1007|SM79)/.test(compact))return 'it';
 if(/^(JU|BF|FW|HE|DO|ME|HS|AR)\d/.test(compact))return 'de-air';
 return '';
}

// v1.58 — dettaglio per tipo degli scafi già classificati per stato.
// Le categorie fuori catalogo restano visibili, così la somma coincide sempre col totale.
export function fleetTypeBreakdown(fleets){
 const types=new Set(SHIP_TYPES);
 const typeOf=u=>typeCode(u)||'ALTRO';
 for(const units of Object.values(fleets))for(const u of units)types.add(typeOf(u));
 const order=[...SHIP_TYPES,...[...types].filter(t=>!SHIP_TYPES.includes(t)).sort((a,b)=>a.localeCompare(b,'it'))];
 return Object.fromEntries(Object.entries(fleets).map(([status,units])=>{
  const counts=new Map(order.map(t=>[t,0]));
  for(const u of units){const type=typeOf(u);counts.set(type,counts.get(type)+1);}
  return [status,order.map(type=>({type,count:counts.get(type)}))];
 }));
}
