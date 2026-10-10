// Motore di estrazione della campagna, derivato dal codice originale Regia Marina 27 / Royal Navy 28.
// Il catalogo e i nomi delle squadre arrivano dallo stato privato Nhost: non sono inclusi qui.
export function generateBattle(state, turnIndex, seed) {
  if(!Number.isInteger(turnIndex)||turnIndex<0||turnIndex>9)throw Error('Turno non valido.');
  if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Seme non valido.');
  const S=state;
  const CATALOGO=new Map();
  for(const n of S.navi||[])CATALOGO.set(n.nome,{...n,kind:'nave'});
  for(const a of S.aerei||[])if(!CATALOGO.has(a.nome))CATALOGO.set(a.nome,{...a,kind:'aereo',cls:a.base==='IMBARCABILE'?'AEREO_IMB':'AEREO_TERRA'});
  const SQ=Object.fromEntries((S.ui_squadre||[]).map(s=>[s.id,s]));
  const required=['BB1','BB2','BB3','CA1','CL1','SUB','CV1','AIR','CA2','CA3','CL2','CL3','CL4'];
  if(!required.every(id=>SQ[id]))throw Error('Configurazione squadre Nhost incompleta.');
  const TETTO=280,MIN_FLOTTA=150,MAX_FLOTTA=280;

const YEAR = [1940,1940,1941,1941,1941,1942,1942,1942,1943,1943];
function nomeBase(nome) { return nome.replace(/\s*\((I|II|III)\)$/, ''); }
function info(nome) { return CATALOGO.get(nome) || null; }
function punti(nome) { const c=info(nome); return c?c.pt:0; }
function statoNave(nome) {
  const c=info(nome);
  if (c && c.kind==='aereo') return 'attiva';
  let p=S.perdite?.[nome];
  if(!p)for(const [k,v] of Object.entries(S.perdite||{})){
    if(nomeBase(k)===nomeBase(nome)){p=v;if(v.stato==='affondata')break;}
  }
  if(!p)return 'attiva';
  if(p.stato==='affondata')return 'affondata';
  return turnIndex<=Number(p.turno)+1?'riparazione':'attiva';
}
function disponibile(nome) {
  const c=info(nome); if(!c)return false;
  if(Number(c.anno)>YEAR[turnIndex])return false;
  if(c.ritirato && YEAR[turnIndex]>=Number(c.ritirato))return false;
  return c.kind==='aereo' || statoNave(nome)==='attiva';
}
function getHangar(nome) {const c=info(nome);return c?.hangar!==undefined ? parseInt(c.hangar,10):3;}

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
function caselle(sid) {
  const s=SQ[sid], arr=S.porto[sid]||[], nN=s.nucleo.n;
  let nS=s.scorta?s.scorta.n:0;
  if(sid==='CV1'){
    if(!portaereiDisponibili())return {nucleo:[],scorta:arr.slice(0,2).filter(Boolean)};
    const cv=arr[0];nS=cv&&info(cv)?.cls==='CV'?getHangar(cv):3;
  }
  return {nucleo:arr.slice(0,nN).filter(Boolean),scorta:arr.slice(nN,nN+nS).filter(Boolean)};
}

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
          return { nucleo: [], scorta: arr.slice(0, 2).filter(Boolean) };
      }
      let cvName = arr[0];
      const isCv = cvName && info(cvName) && info(cvName).cls === "CV";
      nS = isCv ? getHangar(cvName) : 3;
  }
  return { nucleo: arr.slice(0, nN).filter(Boolean), scorta: arr.slice(nN, nN + nS).filter(Boolean) };
}

function estrai() {
  const seed = (Math.random() * 4294967296) >>> 0;
  return estraiConSeed(seed);
}
function estraiConSeed(seed) {
  for (let tentativo = 1; tentativo <= 500; tentativo++) {
    rng = mulberry32((seed + tentativo * 7919) >>> 0);
    const r = unPassaggio();
    if (r.totale >= MIN_FLOTTA && r.totale <= MAX_FLOTTA) {
      r.seed = seed; r.tentativi = tentativo;
      return r;
    }
  }
  rng = mulberry32(seed);
  const r = unPassaggio();
  r.seed = seed; r.tentativi = 500; r.fuoriRange = true;
  return r;
}

function unPassaggio() {
  const tiri = {}, gruppi = [], log = [];
  let totale = 0, primaOndata = 0;
  const usate = new Set();

  ORDINE.forEach((step, idx) => {
    if (idx === 8) primaOndata = totale;
    const s = SQ[step.su];
    const v = step.tiro(tiri, totale);
    tiri[step.id] = v;
    const esito = leggiTiro(s.forma, v);
    const nomeSq = nomeSquadra(step.su);
    const riga = { id:step.id, squadra:nomeSq, tiro:v, esito:esito.et, unita:[] };

    if (esito.modo === "assente" || esito.modo === "regola" || usate.has(step.su)) {
      if (usate.has(step.su) && esito.modo !== "assente" && esito.modo !== "regola")
        riga.esito = "già in mare";
      log.push(riga);
      return;
    }

    const c = caselle(step.su);
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
    const unita = scelte.map(n => ({ nome:n, cls:info(n).cls, tipo:info(n).tipo, pt:punti(n), esito:"illesa" }));
    const pt = unita.reduce((a, u) => a + u.pt, 0);
    totale += pt;
    riga.unita = unita.map(u => u.nome);
    gruppi.push({ id:step.id, squadra:nomeSq, modo:esito.modo, rinforzo:!!step.rinforzo, unita, pt });
    log.push(riga);
  });

  return { gruppi, log, tiri, totale, primaOndata: primaOndata || totale };
}


  return estraiConSeed(seed);
}
