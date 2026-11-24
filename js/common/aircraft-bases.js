// v1.68 — classificazione operativa degli aerei, compatibile con i cataloghi Nhost esistenti.
// Il codice base IMBARCABILE resta valido per il server; carrierOnly distingue la categoria esclusiva.
export const AIR_BASE_OPTIONS=Object.freeze([['LAND BASED','Terrestre'],['IDRO','Idrovolante'],['IMBARCABILE','Imbarcabile'],['IMBARCATO','Imbarcato']]);
export function aircraftBase(unit){
 const base=String(unit?.base||'').trim().toUpperCase();
 if(base==='IMBARCATO'||(base==='IMBARCABILE'&&unit?.carrierOnly===true))return 'IMBARCATO';
 if(base==='TERRESTRE')return 'LAND BASED';
 return base;
}
export function aircraftBaseLabel(unit){const code=aircraftBase(unit);return AIR_BASE_OPTIONS.find(([value])=>value===code)?.[1]||code||'—';}
export function setAircraftBase(unit,code){
 if(!AIR_BASE_OPTIONS.some(([value])=>value===code))throw Error('Base aereo non valida.');
 unit.base=code==='IMBARCATO'?'IMBARCABILE':code;
 if(code==='IMBARCATO')unit.carrierOnly=true;else delete unit.carrierOnly;
 return unit;
}
export function canUseShore(unit){return ['LAND BASED','IMBARCABILE','IDRO'].includes(aircraftBase(unit));}
export function canUseCarrier(unit){return ['IMBARCABILE','IMBARCATO'].includes(aircraftBase(unit));}
export function selectedCarrier(state,isAvailable){
 const name=state?.porto?.CV1?.[0];
 return (state?.navi||[]).find(n=>n.nome===name&&n.cls==='CV'&&isAvailable(n))||null;
}
// Idrovolanti: conservata la precedente ammissibilità negli slot non imbarcati.
export function aircraftAllowedInSlot(unit,squadId,index,hasCarrier,carrier){
 if(squadId==='AIR')return canUseShore(unit);
 if(squadId!=='CV1')return false;
 if(!hasCarrier)return index<2&&canUseShore(unit)&&unit.tipo===(index===0?'TB':'DB');
 return index>0&&!!carrier&&index<=Number(carrier.hangar??3)&&canUseCarrier(unit);
}
