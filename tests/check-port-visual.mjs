import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {portUnitImage} from '../js/common/port-visual.js';
const ships=[
 portUnitImage({nome:'GIULIO CESARE',tipo:'BB',cls:'BB'},'axis'),
 portUnitImage({nome:'WARSPITE',tipo:'BB',cls:'BB'},'allies')
];
assert(ships.every(x=>x?.kind==='ship'&&x.src),'sagome navali');
assert(portUnitImage({nome:'CANT Z.506 "AIRONE"',tipo:'B'},'axis')?.src.includes('assets/axis/aircraft/z506.webp?v=1.51'),'aereo Axis');
assert(portUnitImage({nome:'SWORDFISH MK.I',tipo:'B'},'allies')?.src.includes('assets/allies/aircraft/'),'aereo Allies');
assert.equal(portUnitImage({nome:'SWORDFISH MK.I',tipo:'B'},'axis'),null,'nessuna contaminazione fazioni');
assert.equal(portUnitImage({nome:'UNITÀ NON NOTA',tipo:'F'},'allies'),null,'nessuna illustrazione di fantasia');
assert.equal(portUnitImage({nome:'NAVE NON NOTA',cls:'BB',tipo:'BB'},'axis'),null,'nave senza profilo');
assert.equal(portUnitImage(null,'axis'),null,'casella vuota');
assert.equal(portUnitImage({nome:'WARSPITE',tipo:'BB',cls:'BB'},'unknown'),null,'fazione sconosciuta');
const css=readFileSync(new URL('../css/common/responsive.css',import.meta.url),'utf8');
const tail=css.slice(css.indexOf('/* v1.51 — decorazione'));
assert(tail.includes('position:absolute')&&tail.includes('pointer-events:none'),'elemento fuori dal flusso e non interattivo');
assert(!/\b(?:padding|margin|gap|grid-template-columns|min-height)\s*:/.test(tail),'spaziatura e dimensioni non toccate');
const main=readFileSync(new URL('../js/common/main.js',import.meta.url),'utf8');
assert(main.includes('appendPortSlotVisual(r,name?u:null)'),'solo caselle occupate');
assert(main.includes('try{await persistDraft(draft);}catch{render();}'),'selezione e salvataggio invariati');
console.log('13 controlli Porto superati.');
