import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {portUnitImage} from '../js/common/port-visual.js';
const ships=[
 portUnitImage({nome:'GIULIO CESARE',tipo:'BB',cls:'BB'},'axis'),
 portUnitImage({nome:'WARSPITE',tipo:'BB',cls:'BB'},'allies')
];
assert(ships.every(x=>x?.kind==='ship'&&x.src),'sagome navali');
assert(portUnitImage({nome:'CANT Z.506 "AIRONE"',tipo:'B'},'axis')?.src.includes('assets/axis/aircraft/z506.webp?v=1.52'),'aereo Axis');
assert(portUnitImage({nome:'SWORDFISH MK.I',tipo:'B'},'allies')?.src.includes('assets/allies/aircraft/'),'aereo Allies');
assert.equal(portUnitImage({nome:'SWORDFISH MK.I',tipo:'B'},'axis'),null,'isolamento fazioni');
assert.equal(portUnitImage({nome:'UNITÀ NON NOTA',tipo:'F'},'allies'),null,'nessuna sagoma generica');
assert.equal(portUnitImage({nome:'NAVE NON NOTA',cls:'BB',tipo:'BB'},'axis'),null,'nave senza profilo');
assert.equal(portUnitImage(null,'axis'),null,'casella vuota');
assert.equal(portUnitImage({nome:'WARSPITE',tipo:'BB',cls:'BB'},'unknown'),null,'fazione sconosciuta');
const css=readFileSync(new URL('../css/common/responsive.css',import.meta.url),'utf8');
const visuals=css.slice(css.indexOf('/* v1.53 — profili navali'));
assert(visuals.includes('port-preview-thumb')&&visuals.includes('opacity:1'),'immagini opache');
assert(visuals.includes('background:#0d2432')&&visuals.includes('port-preview-trigger--ship'),'sagome bianche su sfondo scuro');
assert(visuals.includes('width:64px')&&visuals.includes('width:min(360px,88vw)'),'miniatura e anteprima più ampie');
assert(visuals.includes('height:23px'),'altezza del pulsante invariata');
assert(visuals.includes('position:absolute')&&visuals.includes('pointer-events:none'),'ingrandimento fuori dal flusso');
assert(!/\b(?:margin|grid-template-columns|row-gap|column-gap)\s*:/.test(visuals),'spaziatura principale immutata');
const main=readFileSync(new URL('../js/common/main.js',import.meta.url),'utf8');
assert(main.includes("appendPortSlotVisual(r,name?u:null,id+'-'+i)"),'solo unità assegnate');
assert(main.includes('closePortPreviews()')&&main.includes("event.key==='Escape'"),'chiusura anteprima');
assert(main.includes("try{await persistDraft(draft);}catch{render();}"),'salvataggio invariato');
console.log('18 controlli Porto: miniature nitide, zoom, isolamento fazioni, stato invariato.');
