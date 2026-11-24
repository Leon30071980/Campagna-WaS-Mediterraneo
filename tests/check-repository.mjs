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

// v1.64 — artwork approvato integrale, senza rielaborazioni o sovrapposizioni.
const royalHeaderSource=readFileSync(join(root,'js/allies/header.js'),'utf8');
const royalMarkup=JSON.parse(royalHeaderSource.slice(royalHeaderSource.indexOf('= ')+2).trim().replace(/;$/,''));
assert(royalMarkup.includes('assets/allies/header/banner-v164.webp?v=1.64'),'banner approvato integrale');
assert(royalMarkup.includes('width="1915" height="821"'),'dimensioni native artwork');
assert(royalMarkup.includes('royal-banner-v164'),'layout proporzionale');
assert(royalMarkup.includes('</div>\n    <div class="royal-title-strip">'),'targa separata dal disegno');
assert(!royalMarkup.includes('/crest.webp')&&!royalMarkup.includes('royal-frame-clip')&&!royalMarkup.includes('royal-clean-frame-top'),'nessuna sovrapposizione sul banner');
for(const p of ['banner.webp','banner-panorama.webp','banner-v163.webp','banner-v164.webp','old-banner/banner.png','old-banner/swordfish-torpedoes.webp'])assert(existsSync(join(root,'assets/allies/header',p)),p);
