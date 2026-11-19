// v1.28 — profili dettagliati delle tavole fornite, scala comune Axis e Allies.
const LOCAL_CLASSES=Object.freeze({
  "BB|Littorio": "bb_littorio",
  "BB|Conte di Cavour": "bb_cavour",
  "BB|Andrea Doria": "bb_duilio",
  "CV|Aquila": "cv_aquila",
  "CV|Sparviero": "cv_sparviero",
  "CA|Trento": "ca_trento",
  "CA|Zara": "ca_zara",
  "CA|Bolzano": "ca_bolzano",
  "CA|Suffren": "ca_suffren",
  "CL|Alberto di Giussano": "cl_giussano",
  "CL|Luigi Cadorna": "cl_cadorna",
  "CL|Raimondo Montecuccoli": "cl_montecuccoli",
  "CL|Duca d’Aosta": "cl_duca_daosta",
  "CL|Duca degli Abruzzi": "cl_duca_degli_abruzzi",
  "CL|Capitani Romani": "cl_capitani_romani",
  "CL|La Galissonnière": "cl_la_galissonniere",
  "DD|Leone": "dd_leone",
  "DD|Turbine": "dd_turbine",
  "DD|Nazario Sauro": "dd_sauro",
  "DD|Spica": "dd_spica",
  "DD|Orsa (Pegaso)": "dd_pegaso",
  "DD|Dubrovnik": "dd_dubrovnik",
  "DD|Folgore": "dd_folgore",
  "DD|Dardo": "dd_dardo",
  "DD|Soldati I": "dd_soldati_1",
  "DD|Soldati II": "dd_soldati_2",
  "DD|Oriani": "dd_oriani",
  "DD|Navigatori": "dd_navigatori",
  "DD|Maestrale": "dd_maestrale",
  "SUB|Acciaio": "sub_acciaio",
  "SUB|Argonauta": "sub_argonauta",
  "SUB|Perla": "sub_perla",
  "SUB|Adua": "sub_adua",
  "SUB|Sirena": "sub_sirena",
  "SUB|Marconi": "sub_marconi",
  "SUB|Liuzzi": "sub_liuzzi",
  "SUB|Tipo VIIB": "sub_viib",
  "SUB|Tipo VIIC": "sub_viic"
});
const LENGTHS=Object.freeze({
  "bb_littorio": 237.8,
  "bb_cavour": 186.4,
  "bb_duilio": 186.9,
  "cv_aquila": 235.5,
  "cv_sparviero": 202.4,
  "ca_trento": 196.9,
  "ca_zara": 182.8,
  "ca_bolzano": 196.9,
  "ca_suffren": 194,
  "cl_giussano": 169,
  "cl_cadorna": 169.3,
  "cl_montecuccoli": 182.2,
  "cl_duca_daosta": 186.9,
  "cl_duca_degli_abruzzi": 187,
  "cl_capitani_romani": 142.9,
  "cl_la_galissonniere": 179.5,
  "dd_leone": 113.4,
  "dd_turbine": 93.2,
  "dd_sauro": 90.2,
  "dd_spica": 81.4,
  "dd_pegaso": 89.3,
  "dd_dubrovnik": 113.2,
  "dd_folgore": 96.1,
  "dd_dardo": 96.2,
  "dd_soldati_1": 106.7,
  "dd_soldati_2": 106.7,
  "dd_oriani": 106.7,
  "dd_navigatori": 107,
  "dd_maestrale": 106.7,
  "sub_acciaio": 60.2,
  "sub_argonauta": 61.5,
  "sub_perla": 60.2,
  "sub_adua": 60.2,
  "sub_sirena": 60.2,
  "sub_marconi": 76.5,
  "sub_liuzzi": 76.1,
  "sub_viib": 66.5,
  "sub_viic": 67.1
});
// Profili britannici/Commonwealth dalle 27 tavole GIF del giocatore.
// Canvas originale normalizzato: 528 × 152, 2 pixel per metro; stessa scala relativa degli SVG Axis,
// con correzione della larghezza di visualizzazione descritta nel CSS.
const ALLIED_PROFILES=Object.freeze({
  "BB|King George V": {
    "file": "bb_king_george",
    "length": 227.1
  },
  "BB|Nelson": {
    "file": "bb_nelson",
    "length": 216.4
  },
  "BB|Revenge": {
    "file": "bb_revenge",
    "length": 189.2
  },
  "BC|Admiral": {
    "file": "bc_admiral",
    "length": 262.3
  },
  "BC|Renown": {
    "file": "bc_renown",
    "length": 242.2
  },
  "CA|County (Kent)": {
    "file": "ca_county",
    "length": 192
  },
  "CA|York": {
    "file": "ca_york",
    "length": 175.3
  },
  "CL|Arethusa": {
    "file": "cl_arethusa",
    "length": 154.2
  },
  "CL|C (Carlisle)": {
    "file": "cl_carlisle",
    "length": 137.6
  },
  "CL|C (Ceres)": {
    "file": "cl_ceres",
    "length": 137.2
  },
  "CL|Crown Colony (Fiji)": {
    "file": "cl_crown_colony",
    "length": 169.3
  },
  "CL|Dido": {
    "file": "cl_dido",
    "length": 156.1
  },
  "CL|Town (Edinburgh)": {
    "file": "cl_edinburgh",
    "length": 187
  },
  "CL|Town (Gloucester)": {
    "file": "cl_gloucester",
    "length": 180.3
  },
  "CL|Leander": {
    "file": "cl_leander",
    "length": 169.1
  },
  "CL|Town (Southampton)": {
    "file": "cl_southampton",
    "length": 180.3
  },
  "CL|Leander (Perth)": {
    "file": "cl_sydney",
    "length": 171.4
  },
  "CV|Ark Royal": {
    "file": "cv_ark_royal",
    "length": 240
  },
  "CV|Eagle": {
    "file": "cv_eagle",
    "length": 203.5
  },
  "CV|Illustrious": {
    "file": "cv_illustrious",
    "length": 225.6
  },
  "DD|I": {
    "file": "dd_i",
    "length": 98.5
  },
  "DD|J": {
    "file": "dd_j",
    "length": 108.7
  },
  "DD|K": {
    "file": "dd_k",
    "length": 108.7
  },
  "DD|L": {
    "file": "dd_l",
    "length": 110.5
  },
  "DD|N": {
    "file": "dd_n",
    "length": 108.7
  },
  "DD|P": {
    "file": "dd_p",
    "length": 105.2
  },
  "DD|Tribal": {
    "file": "dd_tribal",
    "length": 115
  },
  "DD|D": {
    "file": "dd_d",
    "length": 100.3
  },
  "DD|E": {
    "file": "dd_e",
    "length": 100.3
  },
  "DD|F": {
    "file": "dd_f",
    "length": 100.3
  },
  "DD|G": {
    "file": "dd_g",
    "length": 98.5
  },
  "DD|H": {
    "file": "dd_h",
    "length": 98.5
  },
  "DD|V e W": {
    "file": "dd_vw",
    "length": 95.1
  },
  "DD|V": {
    "file": "dd_vw",
    "length": 95.1
  },
  "DD|W": {
    "file": "dd_w",
    "length": 95.1
  },
  "DD|Le Fantasque": {
    "file": "dd_le_fantasque",
    "length": 132.4
  },
  "DD|Vasilefs Georgios": {
    "file": "dd_vasilefs_georgios",
    "length": 98.5
  },
  "SUB|Glafkos": {
    "file": "sub_glafkos",
    "length": 68.6
  },
  "SUB|U": {
    "file": "sub_u",
    "length": 58.2
  },
  "SUB|T": {
    "file": "sub_t",
    "length": 83.8
  }
});
// v1.35 — la variante per singolo scafo ha precedenza sul profilo di classe.
const ALLIED_NAMED=Object.freeze({
  "BB|QUEEN ELIZABETH": {
    "file": "bb_queen_elizabeth",
    "length": 196.8,
    "variant": "Queen Elizabeth"
  },
  "BB|VALIANT": {
    "file": "bb_queen_elizabeth",
    "length": 196.8,
    "variant": "Queen Elizabeth"
  },
  "BB|WARSPITE": {
    "file": "bb_warspite",
    "length": 196.8,
    "variant": "Warspite"
  },
  "BB|MALAYA": {
    "file": "bb_malaya",
    "length": 196.8,
    "variant": "Malaya"
  },
  "BB|BARHAM": {
    "file": "bb_barham",
    "length": 196.8,
    "variant": "Barham"
  },
  "DD|WATERHEN": {
    "file": "dd_w",
    "length": 95.1,
    "variant": "W"
  },
  "DD|WRESTLER": {
    "file": "dd_w",
    "length": 95.1,
    "variant": "W"
  },
  "DD|WRYNECK": {
    "file": "dd_w",
    "length": 95.1,
    "variant": "W"
  },
  "DD|WOLVERINE": {
    "file": "dd_w",
    "length": 95.1,
    "variant": "W"
  }
});
function alliedHullName(unit){return String(unit?.nome||'').trim().toUpperCase().replace(/^HMS\s+/, '').replace(/(?:\s*\((?:I|II|III|AA)\))+$/, '').trim();}
// Tavole per specifica configurazione: chiave tipo|nome con suffisso (II)/(III).
// Inserire esclusivamente profili realmente acquisiti; precedenza sul fallback.
const VERSION_PROFILES=Object.freeze({});
export function localShipProfile(unit,className){
 const exact=VERSION_PROFILES[String(unit?.tipo||'').trim().toUpperCase()+'|'+String(unit?.nome||'').trim().toUpperCase()];
 if(exact)return {image:'./assets/naval/profiles/'+exact.folder+'/'+exact.file+'.webp?v=1.36',caption:className+' · '+exact.caption+' · '+exact.length.toLocaleString('it-IT')+' m',className,local:true,scaled:true,page:null,length:exact.length};
 const type=String(unit?.tipo||'').trim().toUpperCase();
 const key=type+'|'+className;
 const allied=ALLIED_NAMED[type+'|'+alliedHullName(unit)]||ALLIED_PROFILES[key];
 if(allied)return {image:'./assets/naval/profiles/royal/'+allied.file+'.webp?v=1.36',caption:className+(allied.variant?' · profilo '+allied.variant:'')+' · '+allied.length.toLocaleString('it-IT')+' m',className,local:true,scaled:true,page:null,length:allied.length};
 if(!Object.hasOwn(LOCAL_CLASSES,key))return null;
 const file=LOCAL_CLASSES[key];
 const length=LENGTHS[file];
 return {image:'./assets/naval/profiles/axis/'+file+'.webp?v=1.36',caption:className+' · '+length.toLocaleString('it-IT')+' m',className,local:true,scaled:true,page:null,length};
}
