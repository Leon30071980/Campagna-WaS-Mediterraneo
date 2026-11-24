import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {portUnitImage,battleUnitImage} from '../js/common/port-visual.js';
const ships=[
 portUnitImage({nome:'GIULIO CESARE',tipo:'BB',cls:'BB'},'axis'),
 portUnitImage({nome:'WARSPITE',tipo:'BB',cls:'BB'},'allies')
];
assert(ships.every(x=>x?.kind==='ship'&&x.src),'sagome navali');
assert(portUnitImage({nome:'CANT Z.506 "AIRONE"',tipo:'B'},'axis')?.src.includes('assets/axis/aircraft/z506.webp?v=1.53'),'aereo Axis');
assert(portUnitImage({nome:'SWORDFISH MK.I',tipo:'B'},'allies')?.src.includes('assets/allies/aircraft/'),'aereo Allies');
assert.equal(portUnitImage({nome:'SWORDFISH MK.I',tipo:'B'},'axis'),null,'isolamento fazioni');
assert.equal(portUnitImage({nome:'UNITÀ NON NOTA',tipo:'F'},'allies'),null,'nessuna sagoma generica');
assert.equal(portUnitImage({nome:'NAVE NON NOTA',cls:'BB',tipo:'BB'},'axis'),null,'nave senza profilo');
assert.equal(portUnitImage(null,'axis'),null,'casella vuota');
assert.equal(portUnitImage({nome:'WARSPITE',tipo:'BB',cls:'BB'},'unknown'),null,'fazione sconosciuta');
const css=readFileSync(new URL('../css/common/responsive.css',import.meta.url),'utf8');
const visuals=css.slice(css.indexOf('/* v1.53 — profili navali'),css.indexOf('/* v1.56 — miniature delle unità estratte'));
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


// v1.56: l'estrazione conserva cls anche sugli aerei; il visualizzatore la normalizza.
const planeSnapshot={nome:'CANT Z.506 "AIRONE"',tipo:'B',cls:'AEREO_TERRA',kind:'aereo'};
const axisPlane=battleUnitImage(planeSnapshot,'axis','axis',{navi:[],aerei:[]});
assert(axisPlane?.kind==='aircraft'&&axisPlane.src.includes('/axis/aircraft/'),'aereo estratto distinto da nave');
const ownShip=battleUnitImage({nome:'GIULIO CESARE',tipo:'BB',cls:'BB'},'axis','axis',{
 navi:[{nome:'GIULIO CESARE',tipo:'BB',cls:'BB'}],aerei:[]
});
assert(ownShip?.kind==='ship'&&ownShip.src,'nave estratta con profilo del catalogo');
const opponentPlane=battleUnitImage({nome:'SWORDFISH MK.I',tipo:'B',cls:'AEREO_IMB',kind:'aereo'},
 'allies','axis',{navi:[],aerei:[{nome:'SWORDFISH MK.I',tipo:'B',profileKey:'Z506'}]});
assert(opponentPlane?.kind==='aircraft'&&opponentPlane.src.includes('/allies/aircraft/'),
 'rapporto avversario risolto dal solo nome pubblicato e dalla sua fazione');
assert.equal(battleUnitImage({nome:'AEREO SCONOSCIUTO',tipo:'B',cls:'AEREO_TERRA'},'axis','axis',null),null,
 'nessuna miniatura inventata');
assert(main.includes('appendBattleUnitVisual(row,u,model.side)'),'miniature formazione estratta');
assert(main.includes('appendBattleUnitVisual(line,unit,fleet.side)'),'miniature rapporti post-battaglia');
assert(css.includes('/* v1.56 — miniature delle unità estratte')&&css.includes('.battle-unit-enlarged'),
 'anteprima zoom e stile condivisi');
console.log('7 controlli Battaglia: miniature, tipo aereo/nave, fazioni, rapporti e zoom.');
