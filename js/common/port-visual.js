// v1.51 — riferimenti di sola lettura; il database non viene modificato.
import { historicalClass } from './historical-classes.js?v=1.56';
import { localShipProfile } from './local-ship-profiles.js?v=1.56';
import { shipProfile } from './ship-profiles.js?v=1.56';
import { aircraftProfile } from './aircraft-profiles.js?v=1.56';

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

/**
 * Resolve a snapshot from Battle without changing the saved formation.
 * Battle snapshots include `cls` even for airplanes, unlike catalogue entries;
 * pass aircraft without that property to the existing Porto resolver.
 * Only the own side may consult the private catalogues; opponent images in a
 * finalized report are resolved strictly from the published unit snapshot.
 */
export function battleUnitImage(unit,side,ownSide,state){
 if(!unit?.nome||!['axis','allies'].includes(side))return null;
 const owned=side===ownSide?state:null;
 const aircraft=owned?.aerei?.find(a=>a.nome===unit.nome);
 const ship=owned?.navi?.find(n=>n.nome===unit.nome);
 const plane=unit.kind==='aereo'||unit.cls==='AEREO_IMB'||unit.cls==='AEREO_TERRA'||['B','DB','F','FB','HB','PB','TB'].includes(unit.tipo)||(!ship&&!!aircraft);
 if(plane){
  const {cls,...source}=aircraft||unit;
  return portUnitImage({...source,nome:unit.nome},side);
 }
 const source=ship||unit;
 return portUnitImage({...source,nome:unit.nome,cls:source.cls??unit.cls??''},side);
}
