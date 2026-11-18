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
 if(ships){
  if(side==='axis')return /^U[\s-]*\d+$/.test(n)?'de-navy':'it';
  if(side!=='allies')return '';
  if(/^(SUFFREN|LE FANTASQUE|LE MALIN|LE TERRIBLE)$/.test(n))return 'fr';
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
