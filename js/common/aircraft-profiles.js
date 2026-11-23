import {AXIS_AIRCRAFT,AXIS_AIRCRAFT_ASSETS} from '../axis/aircraft-profiles.js?v=1.45';
import {ALLIES_AIRCRAFT,ALLIES_AIRCRAFT_ASSETS} from '../allies/aircraft-profiles.js?v=1.45';
const REFERENCES={axis:AXIS_AIRCRAFT,allies:ALLIES_AIRCRAFT};
const ASSETS={axis:AXIS_AIRCRAFT_ASSETS,allies:ALLIES_AIRCRAFT_ASSETS};
export function aircraftKey(unit){
 const raw=String(unit?.nome??'').replace(/["“][^"”]*["”]/g,'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'');
 return raw==='MARTLETMKII'?'MARTLETTMKII':raw;
}
export function aircraftProfile(unit,side){
 if(!Object.hasOwn(REFERENCES,side))return null;
 const key=aircraftKey(unit),table=REFERENCES[side];
 if(!Object.hasOwn(table,key))return null;
 const ref=table[key],assets=ASSETS[side],asset=Object.hasOwn(assets,ref.slug)?assets[ref.slug]:null;
 const valid=asset&&typeof asset.file==='string'&&/^[a-z0-9_-]+\.(?:webp|png)$/i.test(asset.file)&&asset.credit&&asset.license&&asset.source;
 return {label:ref.label,match:ref.match,page:ref.id?'https://wiki.warthunder.com/unit/'+ref.id:null,
 image:valid?'./assets/'+side+'/aircraft/'+asset.file+'?v=1.45':null,
 credit:valid?String(asset.credit):null,license:valid?String(asset.license):null,source:valid?String(asset.source):null};
}
