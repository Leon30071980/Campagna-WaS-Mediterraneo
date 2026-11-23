// Modelli storici aggiunti soltanto allo stato privato Allies tramite Nhost.
// Ritiro 1944: oltre l'ultimo anno giocabile (1943).
export const SEA_AIRCRAFT = Object.freeze([
 Object.freeze({nome:'SEA HURRICANE MK.IB',tipo:'F',anno:1941,ritirato:1944,base:'IMBARCABILE',pt:6,reference:'HURRICANE MK. IIB'}),
 Object.freeze({nome:'SEAFIRE MK.IB',tipo:'F',anno:1942,ritirato:1944,base:'IMBARCABILE',pt:6,reference:'SPITFIRE MK. V'})
]);
const normalize=name=>String(name||'').trim().replace(/\s+/g,' ').toLocaleUpperCase('it-IT');
export function missingSeaAircraft(state){
 if(!Array.isArray(state?.aerei)||!Array.isArray(state?.navi))return [];
 const used=new Set([...state.aerei,...state.navi].map(u=>normalize(u?.nome)));
 return SEA_AIRCRAFT.filter(u=>!used.has(normalize(u.nome))).map(u=>{
  const {reference,...template}=u,parent=state.aerei.find(a=>normalize(a.nome)===normalize(reference));
  const score=Number(parent?.pt);
  return {...template,pt:Number.isFinite(score)&&score>=0&&score<=1000?score:template.pt};
 });
}
