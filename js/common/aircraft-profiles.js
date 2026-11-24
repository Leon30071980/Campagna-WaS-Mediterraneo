import {AXIS_AIRCRAFT,AXIS_AIRCRAFT_ASSETS} from '../axis/aircraft-profiles.js?v=1.53';
import {ALLIES_AIRCRAFT,ALLIES_AIRCRAFT_ASSETS} from '../allies/aircraft-profiles.js?v=1.53';
const REFERENCES={axis:AXIS_AIRCRAFT,allies:ALLIES_AIRCRAFT};
const ASSETS={axis:AXIS_AIRCRAFT_ASSETS,allies:ALLIES_AIRCRAFT_ASSETS};
export function normalizeAircraftText(value){
 return String(value||'').toUpperCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/["“][^"”]*["”]/g,'')
  .replace(/[^A-Z0-9]/g,'');
}
const ALIASES=Object.freeze({
 SEAGLADIATOR:'SEAGLADIATORMKII',SEAGLADIATORMK2:'SEAGLADIATORMKII',GLOSTERSEAGLADIATOR:'SEAGLADIATORMKII',
 GLOSTERSEAGLADIATORMKII:'SEAGLADIATORMKII',GLADIATORSEA:'SEAGLADIATORMKII',
 GLADIATORMK2:'GLADIATORMKII',GLOSTERGLADIATORMKII:'GLADIATORMKII',GLADIATOR:'GLADIATORMKII',
 BLACKBURNSKUA:'SKUA',BLACKBURNSKUAMKII:'SKUA',SKUAMKII:'SKUA',SKUAMK2:'SKUA',
 FAIREYBARRACUDA:'BARRACUDA',FAIREYBARRACUDAMKII:'BARRACUDA',BARRACUDAMKII:'BARRACUDA',BARRACUDAMK2:'BARRACUDA',
 MARTLETMKII:'MARTLETTMKII',MARTLETII:'MARTLETTMKII',MARTLETIV:'MARTLETTMKII',F4F4MARTLETMKIV:'MARTLETTMKII',GRUMMANMARTLETMKII:'MARTLETTMKII',
 SEAHURRICANEIB:'SEAHURRICANEMKIB',SEAHURRICANEMK1B:'SEAHURRICANEMKIB',
 SEAHURRICANEMKIB:'SEAHURRICANEMKIB',SEAHURRICANE1B:'SEAHURRICANEMKIB',
 SEAFIREIB:'SEAFIREMKIB',SEAFIREMK1B:'SEAFIREMKIB',SEAFIRE1B:'SEAFIREMKIB',
 SEAFIREIII:'SEAFIREMKIII',SEAFIREMK3:'SEAFIREMKIII',SEAFIRE3:'SEAFIREMKIII',
 SEASPITFIRE:'SEAFIREMKIB',SEASPITFIREMK3:'SEAFIREMKIII',
 HURRICANEMK2B:'HURRICANEMKIIB',HURRICANEMKIIBTROP:'HURRICANEMKIIB',
 SPITFIREMK5:'SPITFIREMKV',SPITFIREMKVB:'SPITFIREMKV',SPITFIREMK5B:'SPITFIREMKV',
 SPITFIREMK9:'SPITFIREMKIX',SPITFIREMK9B:'SPITFIREMKIX',
 C202:'MC202',MACCHIC202:'MC202',MC202FOLGORE:'MC202',
 C205:'MC205',MACCHIC205:'MC205',
 BF109G14AS:'BF109G14AS',ME109G:'BF109G',BF109GUSTAV:'BF109G',
 RE2001:'RE2001CB',RE2001FALCOII:'RE2001CB',
 CANTZ506:'Z506',CANTZ506B:'Z506',CANTZ506AIRONE:'Z506',CANTZ506BAIRONE:'Z506',
 Z506AIRONE:'Z506',Z506B:'Z506',Z506BAIRONE:'Z506',CRDACANTZ506:'Z506',CRDACANTZ506B:'Z506',AIRONE:'Z506',
 SM79SPARVIERO:'SM79',SAVOIAMARCHETTISM79:'SM79',
 PBY5:'PBY5CATALINA',PBY5CATALINA:'PBY5CATALINA',
 B25J:'B25JMITCHELL',B25MITCHELL:'B25JMITCHELL',
 B24:'B24LIBERATOR',LIBERATOR:'B24LIBERATOR'
});
// Non usare punteggi di similarità generici: una variante storicamente diversa
// non deve mai essere associata a una miniatura senza una regola esplicita.
const FAMILY_MATCHES=Object.freeze([
 [/^(?:GLOSTER)?SEAGLADIATOR/,'SEAGLADIATORMKII'],
 [/^(?:GLOSTER)?GLADIATORSEA/,'SEAGLADIATORMKII'],
 [/^(?:GLOSTER)?GLADIATOR/,'GLADIATORMKII'],
 [/^(?:BLACKBURN)?SKUA/,'SKUA'],
 [/^(?:FAIREY)?BARRACUDA/,'BARRACUDA'],
 [/^(?:HANDLEYPAGE|HP(?:57|59)?)?HALIFAX/,'HALIFAX'],
 [/^(?:BRISTOL(?:TYPE152)?)?BEAUFORT/,'BEAUFORT'],
 [/^(?:BRISTOL)?BEAUFIGHTER/,'BEAUFIGHTERTFMKX'],
 [/^SEAHURRICANE/, 'SEAHURRICANEMKIB'],
 [/^(?:SEAFIRE|SEASPITFIRE).*(?:MK)?(?:III|3)(?:[^IVX]|$)/,'SEAFIREMKIII'],
 [/^(?:SEAFIRE|SEASPITFIRE)/,'SEAFIREMKIB'],
 [/^(?:BF109|ME109).*14AS/,'BF109G14AS'],
 [/^(?:BF109|ME109)G/,'BF109G'],
 [/^RE2001.*OR/,'RE2001OR'],
 [/^RE2001.*CB/,'RE2001CB'],
 [/^RE2001/,'RE2001CB'],
 [/^(?:MARTLET|WILDCAT)/,'MARTLETTMKII'],
 [/^SPITFIRE.*(?:IX|MK9|MARK9)/,'SPITFIREMKIX'],
 [/^SPITFIRE.*(?:MKV|MK5|V[B-C]?)/,'SPITFIREMKV'],
 [/^HURRICANE/,'HURRICANEMKIIB'],
 [/^(?:MC|MACCHIC?)202/,'MC202'],
 [/^(?:MC|MACCHIC?)205/,'MC205'],
 [/^JU87R/,'JU87R2'],
 [/^JU88A/,'JU88A4'],
 [/^(?:PBY|CATALINA)/,'PBY5CATALINA'],
 [/^(?:B25|MITCHELL)/,'B25JMITCHELL'],
 [/^(?:B24|LIBERATOR)/,'B24LIBERATOR'],
 [/^BEAUFIGHTER/,'BEAUFIGHTERTFMKX'],
 [/^MOSQUITO/,'MOSQUITOMKVI'],
 [/^SUNDERLAND/,'SUNDERLAND'],
 [/^SWORD[F]?ISH/,'SWORDFISHMKI'],
 [/^FW190A/,'FW190A6'],
 [/^SM79/,'SM79'],
 [/^BA65/,'BA65M'],
 [/^BR20/,'BR20'],
 [/^(?:CRDA)?CANTZ506/,'Z506'],
 [/^Z506/,'Z506'],
 [/^Z1007/,'Z1007']
]);
function resolveName(text,side){
 const key=normalizeAircraftText(text),table=REFERENCES[side];
 if(!key||!table)return null;
 if(Object.hasOwn(table,key))return key;
 const alias=ALIASES[key];
 if(alias&&Object.hasOwn(table,alias))return alias;
 for(const [pattern,candidate] of FAMILY_MATCHES)
  if(pattern.test(key)&&Object.hasOwn(table,candidate))return candidate;
 return null;
}
export function aircraftKey(unit,side){
 if(!side){
  // Contratto precedente: il chiamante può richiedere la sola normalizzazione.
  const normalized=normalizeAircraftText(unit?.profileKey||unit?.imageKey||unit?.nome);
  return ALIASES[normalized]||normalized;
 }
 if(!Object.hasOwn(REFERENCES,side))return null;
 const explicit=resolveName(unit?.profileKey||unit?.imageKey,side);
 return explicit||resolveName(unit?.nome,side);
}
export function aircraftChoices(side){
 if(!Object.hasOwn(REFERENCES,side))return [];
 return Object.entries(REFERENCES[side]).map(([key,v])=>({key,label:v.label}));
}
export function aircraftProfile(unit,side){
 if(!Object.hasOwn(REFERENCES,side))return null;
 const key=aircraftKey(unit,side),table=REFERENCES[side];
 if(!key)return null;
 const ref=table[key],assets=ASSETS[side],asset=Object.hasOwn(assets,ref.slug)?assets[ref.slug]:null;
 const valid=asset&&typeof asset.file==='string'&&/^[a-z0-9_-]+\.(?:webp|png)$/i.test(asset.file)&&asset.credit&&asset.license&&asset.source;
 return {key,label:ref.label,match:ref.match,page:ref.id?'https://wiki.warthunder.com/unit/'+ref.id:null,
 image:valid?'./assets/'+side+'/aircraft/'+asset.file+'?v=1.53':null,
 credit:valid?String(asset.credit):null,license:valid?String(asset.license):null,source:valid?String(asset.source):null};
}
