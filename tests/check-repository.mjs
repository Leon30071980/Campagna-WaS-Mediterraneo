// Node 18+: node tests/check-repository.mjs
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {LOCAL_CLASSES} from '../js/axis/ship-profiles.js';
import {ALLIED_PROFILES,ALLIED_NAMED} from '../js/allies/ship-profiles.js';
import {localShipProfile} from '../js/common/local-ship-profiles.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
let refs=0,profiles=0;
for(const p of [join(root,'index.html'),...walk(join(root,'js')),...walk(join(root,'css'))]){
 const s=readFileSync(p,'utf8');assert(!s.includes('assets/naval/'),p);
 for(const m of s.matchAll(/(?:from\s*['"]|url\(['"]?|(?:src|href)=\\?["'])(\.{1,2}\/[^"'\\\s)]+?\.(?:js|css|webp|png|svg|jpg)(?:\?v=\d+\.\d+)?)(?=["'\\\s)])/g)){
 const u=m[1].split('?')[0],target=resolve(p.endsWith('.css')||u.endsWith('.js')?dirname(p):root,u);
 assert(existsSync(target),p+' -> '+u);refs++;
 }
}
for(const k of [...Object.keys(LOCAL_CLASSES),...Object.keys(ALLIED_PROFILES)]){const [tipo,cls]=k.split('|'),p=localShipProfile({tipo,nome:'TEST'},cls);assert(p&&existsSync(resolve(root,p.image.split('?')[0])),k);profiles++;}
for(const k of Object.keys(ALLIED_NAMED)){const [tipo,nome]=k.split('|'),p=localShipProfile({tipo,nome},'Test');assert(p&&existsSync(resolve(root,p.image.split('?')[0])),k);profiles++;}
for(const path of ['assets/common/status/operational.png','assets/common/status/repair.png','assets/common/status/sunk.webp','assets/common/status/construction.svg','assets/common/icons/favicon.png','assets/axis/icons/favicon.png','assets/allies/icons/favicon.png','assets/allies/flags/white-ensign.webp','assets/allies/flags/us-flag.webp','assets/allies/flags/free-france.webp'])assert(existsSync(resolve(root,path)),path);
console.log(refs+' riferimenti statici e '+profiles+' associazioni profilo verificati.');

// Verifica anche il registro delle miniature aeree.
import '../tests/check-aircraft.mjs';
import '../tests/check-port-visual.mjs';

// v1.54: un solo comando manuale per fazione e aggiornamento automatico preservato.
const mainSource=readFileSync(join(root,'js/common/main.js'),'utf8');
assert(!mainSource.includes("appendAction(toolbar,'Aggiorna dati'"),'Pulsante duplicato in Battaglia');
assert(mainSource.includes("Rapporto in elaborazione: il controllo degli aggiornamenti è automatico."),'Avviso di sincronizzazione automatica mancante');
assert(mainSource.includes("watchCampaign({"),'Sottoscrizione Nhost mancante');
for (const header of ['js/axis/header.js','js/allies/header.js']) {
 const source=readFileSync(join(root,header),'utf8');
 assert.equal((source.match(/>Ricarica<\/button>/g)||[]).length,1,header+' deve avere un solo pulsante Ricarica');
 assert(!source.includes('>Aggiorna dati</button>'),header+' mantiene la vecchia etichetta');
}

// v1.55: regressione login: verifica la sintassi dei moduli che avviano la UI.
import {execFileSync} from 'node:child_process';
for(const modulePath of ['js/common/main.js','js/common/api.js','js/axis/header.js','js/allies/header.js']) {
 execFileSync(process.execPath,['--check',join(root,modulePath)],{stdio:'pipe'});
}


// v1.57: i parametri query fanno parte dell'identità dei moduli ES nel browser.
const apiSource=readFileSync(join(root,'js/common/api.js'),'utf8');
const authSource=readFileSync(join(root,'js/common/auth.js'),'utf8');
const authImport=s=>s.match(/from\s+['"](\.\/auth\.js[^'"]*)['"]/)?.[1];
const configImport=s=>s.match(/from\s+['"](\.\/config\.js[^'"]*)['"]/)?.[1];
assert(authImport(mainSource),'import autenticazione UI mancante');
assert.equal(authImport(mainSource),authImport(apiSource),'UI e API devono condividere la stessa istanza auth, inclusa la query string');
assert.equal(configImport(authSource),configImport(apiSource),'configurazione Nhost coerente');
assert.equal(configImport(mainSource),configImport(apiSource),'configurazione UI/API coerente');
for(const p of ['js/common/auth.js','js/common/config.js','js/common/port-visual.js'])execFileSync(process.execPath,['--check',join(root,p)],{stdio:'pipe'});


// v1.58: il dettaglio per tipo deve riconciliare esattamente i totali per scafo.
import {fleetTypeBreakdown,SHIP_TYPES} from '../js/common/catalog-display.js';
import {fleetStatusTotals} from '../js/common/fleet-rules.js';
const testFleet=[
 {nome:'A (I)',tipo:'BB',anno:1940,ritirato:1942},
 {nome:'A (II)',tipo:'BB',anno:1942},
 {nome:'B',tipo:'BC',anno:1940},
 {nome:'C',tipo:'DD',anno:1940},
 {nome:'D',tipo:'CV',anno:1943},
 {nome:'E',tipo:'SUB',anno:1940},
 {nome:'F',tipo:'X',anno:1940},
 {nome:'G',tipo:'',anno:1940}
];
const classified=fleetStatusTotals(testFleet,{B:{stato:'danneggiata',turno:0},C:{stato:'affondata',turno:0}},0);
const breakdown=fleetTypeBreakdown(classified);
assert.equal(classified.attiva.length,4,'ammodernamento futuro non conta come scafo aggiuntivo');
for(const [status,units] of Object.entries(classified)){
 assert.equal(breakdown[status].reduce((sum,row)=>sum+row.count,0),units.length,'dettaglio e totale '+status);
 assert.deepEqual(breakdown[status].slice(0,SHIP_TYPES.length).map(row=>row.type),SHIP_TYPES);
}
assert.equal(breakdown.attiva.find(row=>row.type==='BB').count,1);
assert.equal(breakdown.riparazione.find(row=>row.type==='BC').count,1);
assert.equal(breakdown.affondata.find(row=>row.type==='DD').count,1);
assert.equal(breakdown.costruzione.find(row=>row.type==='CV').count,1);
assert.equal(breakdown.attiva.find(row=>row.type==='X').count,1);
assert.equal(breakdown.attiva.find(row=>row.type==='ALTRO').count,1);
assert(mainSource.includes('appendFleetTypeBreakdown(d,typeBreakdown[key])'),'dettaglio visibile sotto ogni stato');

// v1.59: riepilogo lineare senza icone ripetute, totali invariati.
assert(mainSource.includes("'fleet-type-entry'"),'voci lineari del riepilogo');
assert(!mainSource.includes('fleet-type-icon'),'nessuna miniatura per tipo nella testata');
assert(mainSource.includes("text(top,'span',fleets[key].length,'v num')"),'totale originale conservato');
const fleetCss=readFileSync(join(root,'css/common/responsive.css'),'utf8');
assert(fleetCss.includes('/* v1.59 — proposta 3')&&!fleetCss.includes('--fleet-type-image'),'stile lineare senza vecchie sagome');

// v1.66 — stessa geometria Axis, unico riquadro con cornice e targa originali.
const royalHeaderSource=readFileSync(join(root,'js/allies/header.js'),'utf8');
const royalMarkup=JSON.parse(royalHeaderSource.slice(royalHeaderSource.indexOf('= ')+2).trim().replace(/;$/,''));
assert(royalMarkup.includes('assets/allies/header/banner-v167.webp?v=1.69'),'fondale ridimensionato');
assert(royalMarkup.includes('viewBox="0 0 1916 821"'),'stesse dimensioni Axis');
assert(royalMarkup.includes('clip-path="url(#royal-frame-clip)"')&&royalMarkup.includes('clip-path="url(#royal-plaque-clip)"'),'cornice e targa condivise');
assert(royalMarkup.includes('clip-path="url(#royal-clean-frame-top)"'),'rimozione residui corona Axis');
assert(royalMarkup.includes('clip-path="url(#royal-knot-clip)"'),'nodo originale');
assert(royalMarkup.includes('x="958" y="710"'),'posizione titolo originale');
assert(!royalMarkup.includes('royal-title-strip')&&!royalMarkup.includes('royal-complete-banner')&&!royalMarkup.includes('/crest.webp'),'nessuna fascia separata o duplicazione stemma');
for(const p of ['banner.webp','banner-panorama.webp','banner-v163.webp','banner-v164.webp','banner-v167.webp','old-banner/banner.png','old-banner/swordfish-torpedoes.webp'])assert(existsSync(join(root,'assets/allies/header',p)),p);
const royalLayoutCss=readFileSync(join(root,'css/allies/command.css'),'utf8');
assert(royalLayoutCss.includes('.royal-banner.royal-banner-v167{aspect-ratio:1916/821;}'),'rapporto Axis');
assert(!royalLayoutCss.includes('royal-title-strip')&&!royalLayoutCss.includes('royal-complete-banner'),'rimossi layout separati');

assert(royalMarkup.includes('x="888" y="0" width="140" height="25"'),'ritaglio cornice originale senza residui');

 // v1.68 — basi aeree e compatibilità delle caselle
 import {AIR_BASE_OPTIONS,aircraftBase,aircraftBaseLabel,setAircraftBase,canUseShore,canUseCarrier,selectedCarrier,aircraftAllowedInSlot} from '../js/common/aircraft-bases.js';
 import {generateBattle as generateAircraftTestBattle} from '../js/common/battle-engine.js';
 assert.equal(AIR_BASE_OPTIONS.length,4);
 const land={nome:'LAND TEST',base:'LAND BASED',tipo:'TB',anno:1940,pt:20};
 const dual={nome:'DUAL TEST',base:'IMBARCABILE',tipo:'DB',anno:1940,pt:20};
 const embarked=setAircraftBase({nome:'SEA TEST',tipo:'TB',anno:1940,pt:20},'IMBARCATO');
 const floatplane={nome:'FLOAT TEST',base:'IDRO',tipo:'PB',anno:1940,pt:20};
 const cv={nome:'CV TEST',cls:'CV',tipo:'CV',anno:1940,pt:170,hangar:2};
 assert.equal(aircraftBaseLabel(land),'Terrestre');
 assert.equal(aircraftBaseLabel(dual),'Imbarcabile');
 assert.equal(aircraftBaseLabel(embarked),'Imbarcato');
 assert.equal(embarked.base,'IMBARCABILE');assert.equal(embarked.carrierOnly,true);
 assert.equal(aircraftBase(JSON.parse(JSON.stringify(embarked))),'IMBARCATO');
 assert.equal(aircraftBase(setAircraftBase({...embarked},'IMBARCABILE')),'IMBARCABILE');
 assert.equal(canUseShore(land),true);assert.equal(canUseCarrier(land),false);
 assert.equal(canUseShore(dual),true);assert.equal(canUseCarrier(dual),true);
 assert.equal(canUseShore(embarked),false);assert.equal(canUseCarrier(embarked),true);
 assert.equal(canUseShore(floatplane),true);assert.equal(canUseCarrier(floatplane),false);
 for(const [u,shore,sea] of [[land,true,false],[dual,true,true],[embarked,false,true],[floatplane,true,false]]){
  assert.equal(aircraftAllowedInSlot(u,'AIR',0,true,cv),shore);
  assert.equal(aircraftAllowedInSlot(u,'CV1',1,true,cv),sea);
  assert.equal(aircraftAllowedInSlot(u,'CV1',1,true,null),false);
  assert.equal(aircraftAllowedInSlot(u,'CV1',3,true,cv),false);
 }
 assert.equal(aircraftAllowedInSlot(embarked,'CV1',0,false,null),false);
 assert.equal(aircraftAllowedInSlot(land,'CV1',0,false,null),true);
 assert.equal(aircraftAllowedInSlot(dual,'CV1',1,false,null),true);
 assert.equal(selectedCarrier({navi:[cv],porto:{CV1:[cv.nome]}},()=>true),cv);
 assert.equal(selectedCarrier({navi:[cv],porto:{CV1:[cv.nome]}},()=>false),null);
 const aircraftSquads=['BB1','BB2','BB3','CA1','CL1','SUB','CV1','AIR','CA2','CA3','CL2','CL3','CL4'].map(id=>({id,nome:id,forma:id==='AIR'?'riserva':id==='CV1'?'portaerei':'mista',nucleo:{n:id==='AIR'?3:id==='CV1'?1:0,cls:[]},scorta:{n:id==='CV1'?2:0,cls:[]}}));
 const airFixture={navi:[cv],aerei:[land,dual,embarked],perdite:{},ui_squadre:aircraftSquads,porto:{CV1:[cv.nome,embarked.nome,land.nome],AIR:[embarked.nome,land.nome,dual.nome]}};
 const aircraftBattle=generateAircraftTestBattle(airFixture,0,42);
 const cvGroup=aircraftBattle.gruppi.find(g=>g.id==='CV1'||g.id==='IFCV1');
 assert(cvGroup&&cvGroup.unita.some(u=>u.nome===embarked.nome),'imbarcato estratto insieme a CV');
 assert(!cvGroup.unita.some(u=>u.nome===land.nome),'terrestre escluso dalla CV');
 for(const g of aircraftBattle.gruppi.filter(g=>g.id==='AIR'||g.id==='IFAIR'))assert(!g.unita.some(u=>u.nome===embarked.nome),'imbarcato escluso da AIR');
 const noCV={...airFixture,navi:[],porto:{CV1:[embarked.nome,dual.nome],AIR:[embarked.nome,land.nome,dual.nome]}};
 const noCVBattle=generateAircraftTestBattle(noCV,0,42);
 assert(!noCVBattle.gruppi.flatMap(g=>g.unita).some(u=>u.nome===embarked.nome),'imbarcato escluso senza CV');
 const unassigned={...airFixture,porto:{CV1:['',embarked.nome,dual.nome],AIR:[embarked.nome,land.nome,dual.nome]}};
 assert(!generateAircraftTestBattle(unassigned,0,42).gruppi.flatMap(g=>g.unita).some(u=>u.nome===embarked.nome),'imbarcato escluso senza CV assegnata');

// v1.69 — presenza isolata, condivisa fra entrambe le interfacce.
import {presenceStatus,PRESENCE_INTERVAL_MS,PRESENCE_EXPIRY_MS} from '../js/common/presence.js';
assert.equal(PRESENCE_INTERVAL_MS,15000);assert.equal(PRESENCE_EXPIRY_MS,45000);
assert.deepEqual(presenceStatus({side:'allies',online:true,last_seen:'2026-11-24T12:00:00Z'},'axis'),{state:'online',lastSeen:'2026-11-24T12:00:00Z'});
assert.equal(presenceStatus({side:'axis',online:false,last_seen:null},'allies').state,'offline');
assert.equal(presenceStatus({side:'axis',online:true},'axis').state,'unknown');
assert.equal(presenceStatus(null,'axis').state,'unknown');
for(const p of ['js/axis/header.js','js/allies/header.js'])assert(readFileSync(join(root,p),'utf8').includes('opponent-presence'));
assert(mainSource.includes('presence.start(model.side)')&&mainSource.includes('presence.stop({notify:true})'));
assert(apiSource.includes('campaign_presence_ping')&&apiSource.includes('graphPost(token,body,true,4000)'));
