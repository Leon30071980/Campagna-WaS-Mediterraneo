// v1.51 — riferimenti di sola lettura; il database non viene modificato.
import { historicalClass } from './historical-classes.js?v=1.53';
import { localShipProfile } from './local-ship-profiles.js?v=1.53';
import { shipProfile } from './ship-profiles.js?v=1.53';
import { aircraftProfile } from './aircraft-profiles.js?v=1.53';

// Profili già associati al catalogo; nessuna sagoma generica per gli assenti.
export function portUnitImage(unit,side){
 if(!unit?.nome||!['axis','allies'].includes(side))return null;
 if(Object.hasOwn(unit,'cls')){
  const cls=historicalClass(unit),local=localShipProfile(unit,cls);
  const profile=local||shipProfile(unit,cls);
  if(!profile?.image)return null;
  return {src:profile.image,kind:'ship',local:!!local,title:profile.caption||cls||unit.nome};
 }
 const profile=aircraftProfile(unit,side);
 if(!profile?.image)return null;
 return {src:profile.image,kind:'aircraft',local:true,title:profile.label||unit.nome};
}
