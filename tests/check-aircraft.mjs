import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {AXIS_AIRCRAFT, AXIS_AIRCRAFT_ASSETS} from '../js/axis/aircraft-profiles.js';
import {ALLIES_AIRCRAFT, ALLIES_AIRCRAFT_ASSETS} from '../js/allies/aircraft-profiles.js';
import {aircraftProfile, aircraftKey} from '../js/common/aircraft-profiles.js';
const root=fileURLToPath(new URL('../',import.meta.url));
let checked=0;
for(const [side,refs,assets] of [['axis',AXIS_AIRCRAFT,AXIS_AIRCRAFT_ASSETS],['allies',ALLIES_AIRCRAFT,ALLIES_AIRCRAFT_ASSETS]]){
 const slugs=new Set(Object.values(refs).map(x=>x.slug));
 for(const [key,ref] of Object.entries(refs)){
  const p=aircraftProfile({nome:key},side);
  assert(p&&p.label===ref.label,key);
  assert(!p.page||p.page.startsWith('https://wiki.warthunder.com/unit/'),key);
  if(p.image){assert(p.image.startsWith('./assets/'+side+'/aircraft/'),key);assert(existsSync(resolve(root,p.image.split('?')[0])),key);}
  if(!Object.hasOwn(assets,ref.slug))assert.equal(p.image,null,key);
  checked++;
 }
 for(const [slug,a] of Object.entries(assets)){assert(slugs.has(slug),slug);assert(a.credit&&a.license&&a.source,slug);assert(/^[a-z0-9_-]+\.(?:webp|png)$/i.test(a.file),slug);assert(existsSync(resolve(root,'assets',side,'aircraft',a.file)),slug);}
}
assert.equal(aircraftKey({nome:'M.C. 202 "FOLGORE"'}),'MC202');
assert.equal(aircraftKey({nome:'JU 87 R2 "PICCHIATELLO"'}),'JU87R2');
assert.equal(aircraftKey({nome:'MARTLET MK. II'}),'MARTLETTMKII');
assert.equal(aircraftProfile({nome:'SWORDFISH MK.I'},'axis'),null);
assert.equal(aircraftProfile({nome:'MC202'},'allies'),null);
assert.equal(aircraftProfile({nome:'MC202'},'unknown'),null);
console.log(checked+' associazioni aerei controllate.');

// Le due varianti approvate condividono il file, non duplicano gli asset.
for(const [alias,original] of [['BF109G','BF109G14AS'],['RE2001OR','RE2001CB']]){
 const p=aircraftProfile({nome:alias},'axis'),q=aircraftProfile({nome:original},'axis');
 assert(p.image && p.image===q.image,alias);
 assert.equal(p.match,'variant',alias);
}

const axisCovered=Object.keys(AXIS_AIRCRAFT).filter(k=>aircraftProfile({nome:k},'axis').image).length;
const alliesCovered=Object.keys(ALLIES_AIRCRAFT).filter(k=>aircraftProfile({nome:k},'allies').image).length;
assert.equal(axisCovered,19);assert.equal(alliesCovered,19);
for(const k of ['SKUA','BARRACUDA','MARTLETTMKII'])assert.equal(aircraftProfile({nome:k},'allies').image,null);
assert(aircraftProfile({nome:'BA.65 M "NIBBIO"'},'axis').image.endsWith('ba65m.webp?v=1.47'));
assert.equal(aircraftProfile({nome:'SUNDERLAND'},'allies').label,'Sunderland Mk V');
assert.equal(aircraftProfile({nome:'SPITFIRE MK. V'},'allies').label,'Spitfire Mk Vb');
assert.equal(Object.keys(ALLIES_AIRCRAFT_ASSETS).length,18);
assert.equal(Object.keys(AXIS_AIRCRAFT_ASSETS).length,17);

import {SEA_AIRCRAFT,missingSeaAircraft} from '../js/allies/sea-aircraft.js';
assert.equal(SEA_AIRCRAFT.length,2);
const base={navi:[],aerei:[{nome:'HURRICANE MK. IIB',pt:6},{nome:'SPITFIRE MK. V',pt:6}]};
const newSea=missingSeaAircraft(base);
assert.deepEqual(newSea.map(u=>[u.nome,u.anno,u.ritirato,u.base,u.tipo,u.pt]),[
 ['SEA HURRICANE MK.IB',1941,1944,'IMBARCABILE','F',6],
 ['SEAFIRE MK.IB',1942,1944,'IMBARCABILE','F',6]
]);
assert.equal(missingSeaAircraft({...base,aerei:[...base.aerei,...newSea]}).length,0);
assert.equal(missingSeaAircraft({...base,aerei:[...base.aerei,{nome:' sea hurricane mk.ib '}]}).length,1);
assert.equal(base.aerei.length,2);
for(const k of ['SEAHURRICANEMKIB','SEAFIREMKIB']){
 const p=aircraftProfile({nome:k},'allies');
 assert(p?.image&&p.match===(k==='SEAHURRICANEMKIB'?'exact':'variant'),k);
 assert.equal(aircraftProfile({nome:k},'axis'),null,k);
}

import {aircraftChoices} from '../js/common/aircraft-profiles.js';
assert(aircraftProfile({nome:'Sea Hurricane Mk.1b'},'allies').image.endsWith('sea-hurricane-mkib.webp?v=1.47'));
assert(aircraftProfile({nome:'Sea Hurricane MK.IB "Naval"'},'allies').image.endsWith('sea-hurricane-mkib.webp?v=1.47'));
assert(aircraftProfile({nome:'Seafire Mk.III'},'allies').image.endsWith('seafire-mkiii.webp?v=1.47'));
assert.equal(aircraftProfile({nome:'Seafire Mk.IB'},'allies').match,'variant');
assert.equal(aircraftProfile({nome:'Seafire Mk.III'},'allies').match,'exact');
assert(aircraftProfile({nome:'Mio velivolo',profileKey:'SEAHURRICANEMKIB'},'allies').image.endsWith('sea-hurricane-mkib.webp?v=1.47'));
assert.equal(aircraftProfile({nome:'Mio velivolo'},'allies'),null);
assert(aircraftProfile({nome:'Spitfire Mk.Vb'},'allies').image.includes('spitfire-mkv.webp'));
assert(aircraftProfile({nome:'Bf 109 G-14 AS'},'axis').image.includes('bf109g14as.webp'));
assert(aircraftProfile({nome:'Ba.65 M Nibbio'},'axis').image.includes('ba65m.webp'));
assert(aircraftChoices('allies').some(x=>x.key==='SEAFIREMKIII'));
assert(aircraftChoices('axis').every(x=>x.key!=='SEAFIREMKIII'));
assert.equal(missingSeaAircraft({navi:[],aerei:[{nome:'Seafire Mk.III'},{nome:'Sea Hurricane Mk.1b'}]}).length,0,'no duplicate after name edit');
