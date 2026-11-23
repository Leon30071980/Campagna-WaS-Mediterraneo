import { aircraftKey } from '../common/aircraft-profiles.js?v=1.49';
// Modelli storici aggiunti soltanto allo stato privato Allies tramite Nhost.
// Ritiro 1944: oltre l'ultimo anno giocabile (1943).
export const SEA_AIRCRAFT = Object.freeze([
 Object.freeze({nome:'SEA HURRICANE MK.IB',tipo:'F',anno:1941,ritirato:1944,base:'IMBARCABILE',pt:6,profileKey:'SEAHURRICANEMKIB',reference:'HURRICANE MK. IIB'}),
 Object.freeze({nome:'SEA GLADIATOR MK.II',tipo:'F',anno:1939,ritirato:1944,base:'IMBARCABILE',pt:6,profileKey:'SEAGLADIATORMKII',reference:'GLADIATOR MK.II'}),
 Object.freeze({nome:'SEAFIRE MK.IB',tipo:'F',anno:1942,ritirato:1944,base:'IMBARCABILE',pt:6,profileKey:'SEAFIREMKIB',reference:'SPITFIRE MK. V'})
]);
const normalize=name=>String(name||'').trim().replace(/\s+/g,' ').toLocaleUpperCase('it-IT');
export function missingSeaAircraft(state){
 if(!Array.isArray(state?.aerei)||!Array.isArray(state?.navi))return [];
 const used=new Set([...state.aerei,...state.navi].map(u=>normalize(u?.nome)));
 const keys=new Set(state.aerei.map(u=>aircraftKey(u,'allies')).filter(Boolean));
 return SEA_AIRCRAFT.filter(u=>{
  const key=aircraftKey(u,'allies');
  // Un Seafire rinominato Mk.III non deve causare un secondo Seafire Mk.IB
  // creato automaticamente. Lo stesso vale per "Sea Hurricane" senza puntini.
  return !used.has(normalize(u.nome))&&!keys.has(key)&&!(key==='SEAFIREMKIB'&&keys.has('SEAFIREMKIII'));
 }).map(u=>{
  const {reference,...template}=u;
  const parentKey=aircraftKey({nome:reference},'allies');
  const parent=state.aerei.find(a=>normalize(a.nome)===normalize(reference))
    ||state.aerei.find(a=>aircraftKey(a,'allies')===parentKey);
  const score=Number(parent?.pt);
  return {...template,pt:Number.isFinite(score)&&score>=0&&score<=1000?score:template.pt};
 });
}
