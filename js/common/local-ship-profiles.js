import { LOCAL_CLASSES, LENGTHS } from '../axis/ship-profiles.js?v=1.50';
import { ALLIED_PROFILES, ALLIED_NAMED } from '../allies/ship-profiles.js?v=1.50';
function alliedHullName(unit){return String(unit?.nome||'').trim().toUpperCase().replace(/^HMS\s+/, '').replace(/(?:\s*\((?:I|II|III|AA)\))+$/, '').trim();}
// Tavole per specifica configurazione: chiave tipo|nome con suffisso (II)/(III).
// Inserire esclusivamente profili realmente acquisiti; precedenza sul fallback.
const VERSION_PROFILES=Object.freeze({});
export function localShipProfile(unit,className){
 const exact=VERSION_PROFILES[String(unit?.tipo||'').trim().toUpperCase()+'|'+String(unit?.nome||'').trim().toUpperCase()];
 if(exact)return {image:'./assets/'+(exact.folder==='royal'?'allies':exact.folder)+'/profiles/'+exact.file+'.webp?v=1.50',caption:className+' · '+exact.caption+' · '+exact.length.toLocaleString('it-IT')+' m',className,local:true,scaled:true,page:null,length:exact.length};
 const type=String(unit?.tipo||'').trim().toUpperCase();
 const key=type+'|'+className;
 const allied=ALLIED_NAMED[type+'|'+alliedHullName(unit)]||ALLIED_PROFILES[key];
 if(allied)return {image:'./assets/allies/profiles/'+allied.file+'.webp?v=1.50',caption:className+(allied.variant?' · profilo '+allied.variant:'')+' · '+allied.length.toLocaleString('it-IT')+' m',className,local:true,scaled:true,page:null,length:allied.length};
 if(!Object.hasOwn(LOCAL_CLASSES,key))return null;
 const file=LOCAL_CLASSES[key];
 const length=LENGTHS[file];
 return {image:'./assets/'+(['ca_suffren','cl_la_galissonniere'].includes(file)?'common':'axis')+'/profiles/'+file+'.webp?v=1.50',caption:className+' · '+length.toLocaleString('it-IT')+' m',className,local:true,scaled:true,page:null,length};
}
