import { canUseCarrier, aircraftAllowedInSlot, selectedCarrier } from './aircraft-bases.js?v=1.71';
import { isAvailable, duplicateHull, pendingPortModernizations } from './fleet-rules.js?v=1.71';
// v1.71 — regolamento C: tiri effettivi, scorte indirette e rinforzi progressivi.
export const BATTLE_LIMITS=Object.freeze({min:150,max:280,attempts:500});
export const REINFORCEMENT_BANDS=Object.freeze([[0,149,100],[150,199,85],[200,239,65],[240,259,40],[260,279,20],[280,Infinity,0]].map(Object.freeze));
export function reinforcementFactor(points){
 return REINFORCEMENT_BANDS.find(([,max])=>points<max+1)?.[2]/100||0;
}
// Con prima ondata senza unità maggiori: si mantiene il 35% della probabilità dei rinforzi BB/CV.
export const LIGHT_WAVE_HEAVY_FACTOR=.35;
export const SQUAD_ROLES=Object.freeze({
 BB1:'Corazzate · Primaria',BB2:'Corazzate · Secondaria',BB3:'Corazzate · Riserva',
 CA1:'Incrociatori · Scorta primaria',CL1:'Incrociatori · Scorta secondaria',
 SUB:'Supporto sommergibili',CV1:'Gruppo portaerei / supporto extra',AIR:'Supporto aereo',
 CA2:'Incrociatori · Rinforzo prioritario',CA3:'Incrociatori · Rinforzo',
 CL2:'Incrociatori · Rinforzo I',CL3:'Incrociatori · Rinforzo II',CL4:'Incrociatori · Rinforzo III'
});
export function hasRequiredEscort(groups){
 const units=groups.flatMap(g=>g.unita||[]);
 return !units.some(u=>['BB','BC','CV'].includes(u.tipo))||units.some(u=>u.tipo==='DD');
}
// Motore di estrazione della campagna, derivato dal codice originale Regia Marina 27 / Royal Navy 28.
// Il catalogo e i nomi delle squadre arrivano dallo stato privato Nhost: non sono inclusi qui.
export function generateBattle(state, turnIndex, seed) {
  if(!Number.isInteger(turnIndex)||turnIndex<0||turnIndex>9)throw Error('Turno non valido.');
  if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Seme non valido.');
  const S=state;
  if(pendingPortModernizations(S,turnIndex).length)throw Error('Ammodernamenti nel Porto da sincronizzare prima della battaglia.');
  const duplicate=duplicateHull(S);
  if(duplicate)throw Error('Scafo assegnato piu volte: '+duplicate+'. Correggere il porto prima della battaglia.');
  const CATALOGO=new Map();
  for(const n of S.navi||[])CATALOGO.set(n.nome,{...n,kind:'nave'});
  for(const a of S.aerei||[])if(!CATALOGO.has(a.nome))CATALOGO.set(a.nome,{...a,kind:'aereo',cls:canUseCarrier(a)?'AEREO_IMB':'AEREO_TERRA'});
  const SQ=Object.fromEntries((S.ui_squadre||[]).map(s=>[s.id,s]));
  const required=['BB1','BB2','BB3','CA1','CL1','SUB','CV1','AIR','CA2','CA3','CL2','CL3','CL4'];
  if(!required.every(id=>SQ[id]))throw Error('Configurazione squadre Nhost incompleta.');
  const {min:MIN_FLOTTA,max:MAX_FLOTTA,attempts:MAX_TENTATIVI}=BATTLE_LIMITS,TETTO=MAX_FLOTTA;

function info(nome) { return CATALOGO.get(nome) || null; }
function punti(nome) { const c=info(nome); return c?Number(c.pt):0; }
const disponibilita=new Map();
function disponibile(nome) {if(!disponibilita.has(nome))disponibilita.set(nome,isAvailable(info(nome),S,turnIndex));return disponibilita.get(nome);}
function getHangar(nome) {return Number(info(nome)?.hangar ?? 3);}

const ORDINE = [
  { id:"BB1",   su:"BB1", tiro:()        => rb(3,8) },
  { id:"BB2",   su:"BB2", tiro:t         => t.BB1 < 6 ? rb(2,8) : (t.BB1 < 8 ? rb(1,7) : -1) },
  { id:"BB3",   su:"BB3", tiro:t         => {
      if (t.BB1 === 8 || t.BB2 === 8) return -1;
      if (t.BB1 < 6 && t.BB2 < 6) return rb(1,8);
      if (t.BB1 < 6 || t.BB2 < 6) return rb(0,7);
      return -1; } },
  { id:"CA1",   su:"CA1", tiro:t         => (t.BB1<6 && t.BB2<6 && t.BB3<6) ? rb(3,8) : rb(6,8) },
  { id:"CL1",   su:"CL1", tiro:t         => (t.BB1<6 && t.BB2<6 && t.BB3<6 && t.CA1<6) ? rb(6,8) : rb(3,8) },
  { id:"SUB",   su:"SUB", tiro:()        => rb(1,8) },
  { id:"CV1",   su:"CV1", tiro:()        => rb(1,8) },
  { id:"AIR",   su:"AIR", tiro:t         => t.CV1 === 8 ? -1 : rb(0,9) },
  { id:"IFBB1", su:"BB1", rinforzo:true, tiro:(t,tot) =>
      (tot < TETTO && t.BB1 < 6 && t.BB2 < 8 && !(t.BB2 > 5 && t.BB3 > 5)) ? rb(0,8) : -1 },
  { id:"IFBB2", su:"BB2", rinforzo:true, tiro:(t,tot) =>
      (tot < TETTO && t.BB2 < 6 && t.BB1 < 8 && t.BB3 < 8 && !(t.BB1 > 5 && t.BB3 > 5)) ? rb(0,8) : -1 },
  { id:"IFBB3", su:"BB3", rinforzo:true, tiro:(t,tot) =>
      (tot < TETTO && t.BB3 < 6 && t.BB1 < 6 && t.BB2 < 6 && t.IFBB1 < 6 && t.IFBB2 < 6) ? rb(0,8) : -1 },
  { id:"IFCA1", su:"CA1", rinforzo:true, tiro:(t,tot) => (tot < TETTO && t.CA1 < 6) ? rb(0,8) : -1 },
  { id:"IFCL1", su:"CL1", rinforzo:true, tiro:(t,tot) => (tot < TETTO && t.CL1 < 6) ? rb(0,8) : -1 },
  { id:"IFCV1", su:"CV1", rinforzo:true, tiro:(t,tot) => (tot < TETTO && t.CV1 < 6) ? rb(0,8) : -1 },
  { id:"IFAIR", su:"AIR", rinforzo:true, tiro:(t,tot) => tot < TETTO ? rb(0,9) : -1 },
  { id:"CA2",   su:"CA2", rinforzo:true, tiro:(t,tot) => tot >= TETTO ? -1
      : ((t.IFBB1 < 6 && t.IFBB2 < 6 && t.IFBB3 < 6) ? rb(0,8) : rb(6,8)) },
  { id:"CA3",   su:"CA3", rinforzo:true, tiro:(t,tot) => tot < TETTO ? rb(0,8) : -1 },
  { id:"CL2",   su:"CL2", rinforzo:true, tiro:(t,tot) => tot < TETTO ? rb(0,8) : -1 },
  { id:"CL3",   su:"CL3", rinforzo:true, tiro:(t,tot) => tot < TETTO ? rb(0,8) : -1 },
  { id:"CL4",   su:"CL4", rinforzo:true, tiro:(t,tot) => tot < TETTO ? rb(0,8) : -1 }
];



function portaereiDisponibili() {for(const c of CATALOGO.values())if(c.cls==='CV'&&disponibile(c.nome))return true;return false;}
function nomeSquadra(sid) {return sid==='CV1'&&!portaereiDisponibili()?'Supporto Extra No CV':(SQ[sid]?.nome||sid);}
function leggiTiro(forma, v) {
  if (v < 0) return { modo:"regola", et:"esclusa da regola" };
  switch (forma) {
    case "corazzate":
      if (v < 6) return { modo:"assente", et:"resta in porto" };
      if (v < 8) return { modo:"parziale", nucleo:1, et:"una sola nave" };
      return { modo:"completa", et:"squadra al completo" };
    case "mista":
      if (v < 6) return { modo:"assente", et:"resta in porto" };
      if (v < 8) return { modo:"parziale", nucleo:1, scorta:2, et:"nucleo ridotto + 2 di scorta" };
      return { modo:"completa", et:"squadra al completo" };
    case "portaerei":
      if (v < 6) return { modo:"assente", et:"resta in porto" };
      return { modo:"completa", et:"gruppo al completo" };
    case "riserva":
      if (v < 4) return { modo:"assente", et:"nessuna unità" };
      if (v < 7) return { modo:"parziale", pesca:1, et:"1 unità" };
      if (v < 9) return { modo:"parziale", pesca:2, et:"2 unità" };
      return { modo:"parziale", pesca:3, et:"3 unità" };
  }
}


let rng = Math.random;
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function rb(a, b) { return Math.floor(rng() * (b - a + 1)) + a; }
function pescaUno(arr) { return arr.length ? arr[Math.floor(rng() * arr.length)] : null; }
function pescaN(arr, n) {
  const c = arr.slice(), out = [];
  while (out.length < n && c.length) out.push(c.splice(Math.floor(rng() * c.length), 1)[0]);
  return out;
}

function caselle(sid) {
  const s = SQ[sid], arr = S.porto[sid] || [];
  const nN = s.nucleo.n;
  let nS = s.scorta ? s.scorta.n : 0;

  if (sid === "CV1") {
      if (!portaereiDisponibili()) {
          return { nucleo: [], scorta: arr.slice(0,2).filter((n,i)=>info(n)?.kind==='aereo'&&aircraftAllowedInSlot(info(n),sid,i,false,null)) };
      }
      const cv=selectedCarrier(S,u=>disponibile(u.nome));
      if(!cv)return {nucleo:[],scorta:[]};
      nS=getHangar(cv.nome);
      return {nucleo:[cv.nome],scorta:arr.slice(1,1+nS).filter((n,i)=>info(n)?.kind==='aereo'&&aircraftAllowedInSlot(info(n),sid,i+1,true,cv))};
  }
  if(sid==='AIR')return {nucleo:arr.slice(0,nN).filter((n,i)=>info(n)?.kind==='aereo'&&aircraftAllowedInSlot(info(n),sid,i,false,null)),scorta:[]};
  return { nucleo: arr.slice(0, nN).filter(Boolean), scorta: arr.slice(nN, nN + nS).filter(Boolean) };
}

function estraiConSeed(seed) {

  let best=null,distance=Infinity;
  for (let tentativo=1;tentativo<=MAX_TENTATIVI;tentativo++){
    rng=mulberry32((seed+tentativo*7919)>>>0);
    const r=unPassaggio();
    // Nessuna BB/BC/CV senza DD, né nella prima ondata né nella forza finale.
    if(!r.gruppi.length||!hasRequiredEscort(r.gruppi)||!hasRequiredEscort(r.gruppi.filter(g=>!g.rinforzo)))continue;
    const d=Math.max(MIN_FLOTTA-r.totale,r.totale-MAX_FLOTTA,0);
    r.seed=seed;r.tentativi=tentativo;
    if(d===0)return r;
    if(d<distance){best=r;distance=d;}
  }
  if(!best)throw Error('Nessuna formazione valida: verificare le unità operative e la scorta DD nelle squadre di incrociatori.');
  best.tentativi=MAX_TENTATIVI;best.fuoriRange=true;return best;
}

function unPassaggio() {
  const tiri = {}, effettivi = {}, gruppi = [], log = [];
  let totale = 0, primaOndata = 0;
  const usate = new Set();

  ORDINE.forEach((step, idx) => {
    if (idx === 8) primaOndata = totale;
    const s = SQ[step.su];

    const c=caselle(step.su);
    const mista=s.forma==='mista'&&step.su!=='CV1';
    const needsEscort=!hasRequiredEscort(gruppi);
    const hasAvailableDD=[...c.nucleo,...c.scorta].some(n=>info(n)?.tipo==='DD'&&disponibile(n));
    const forcedCA2=step.id==='CA2'&&['IFBB1','IFBB2','IFBB3'].some(k=>effettivi[k]>=6);
    // CL1 deve poter supplire a CA1 se la scorta non è realmente uscita.
    const forcedCL1=step.id==='CL1'&&!gruppi.some(g=>g.unita.some(u=>u.tipo==='DD'));
    const urgent=!!step.rinforzo&&totale<TETTO&&!usate.has(step.su)&&mista&&needsEscort&&hasAvailableDD;
    const v=(forcedCL1||urgent)?rb(6,8):step.tiro(effettivi,totale);
    tiri[step.id]=v;effettivi[step.id]=-1;
    const esito=leggiTiro(s.forma,v);
    const nomeSq=nomeSquadra(step.su);
    const riga={id:step.id,squadra:nomeSq,tiro:v,esito:esito.et,unita:[]};

    if (esito.modo === "assente" || esito.modo === "regola" || usate.has(step.su)) {
      if (usate.has(step.su) && esito.modo !== "assente" && esito.modo !== "regola")
        riga.esito = "già in mare";
      log.push(riga);
      return;
    }

    const heavyReinforcement=step.rinforzo&&(s.forma==='corazzate'||step.su==='CV1'&&portaereiDisponibili());
    const lightFirst=!gruppi.some(g=>!g.rinforzo&&g.unita.some(u=>['BB','BC','CV'].includes(u.tipo)));
    const factor=step.rinforzo&&!urgent&&!forcedCA2?reinforcementFactor(totale)*(heavyReinforcement&&lightFirst?LIGHT_WAVE_HEAVY_FACTOR:1):1;
    if(factor<1&&rng()>=factor){
      riga.esito='rinforzo non disponibile (fattore '+Math.round(factor*100)+'%)';log.push(riga);return;
    }
    const attive = x => x.filter(n => disponibile(n));
    let scelte = [];

    if (s.forma === "riserva") {
      scelte = pescaN(attive(c.nucleo), esito.pesca || 1);
    } else if (esito.modo === "completa") {
      scelte = attive(c.nucleo).concat(attive(c.scorta || []));
    } else {
      const uno = pescaUno(attive(c.nucleo));
      if (uno) scelte.push(uno);
      if (esito.scorta) scelte = scelte.concat(pescaN(attive(c.scorta || []), esito.scorta));
    }
    if (!scelte.length) { riga.esito = "nessuna unità disponibile"; log.push(riga); return; }

    usate.add(step.su);
    // Il tiro originale resta nel registro. Per le dipendenze vale il risultato reale.
    if(s.forma==='corazzate'){
      const n=scelte.filter(x=>['BB','BC'].includes(info(x)?.tipo)).length;
      effettivi[step.id]=n>=2?8:n===1?6:-1;
    }else{
      effettivi[step.id]=v;
    }
    const unita = scelte.map(n => ({ nome:n, cls:info(n).cls, tipo:info(n).tipo, pt:punti(n), esito:"illesa" }));
    const pt = unita.reduce((a, u) => a + u.pt, 0);
    totale += pt;
    riga.unita = unita.map(u => u.nome);
    gruppi.push({ id:step.id, squadra:nomeSq, modo:esito.modo, rinforzo:!!step.rinforzo, unita, pt });
    log.push(riga);
  });

  return { gruppi, log, tiri, totale, primaOndata: primaOndata || totale, engineVersion:'1.71' };
}


  return estraiConSeed(seed);
}
