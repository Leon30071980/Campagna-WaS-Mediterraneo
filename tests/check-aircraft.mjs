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
