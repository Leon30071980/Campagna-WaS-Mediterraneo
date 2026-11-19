// Campagna W@S Mediterraneo v1.13 — solo profili originali Navypedia, nessuna ricostruzione.
// I percorsi sono estratti dagli hyperlink delle sezioni Standard scale images delle schede indicate.
// Le immagini NON sono state scaricate/verificate nel browser autenticato: il caricamento avviene dal sito sorgente.
// Classe o variante e anno del disegno sono sempre dichiarati. Nessuna sagoma sostitutiva.
const BASE='https://www.navypedia.org';
const ROWS=[
  [
    "italy",
    "BB",
    "Littorio",
    "it_bb_vittorio_veneto",
    "it_bb_24.gif",
    "Littorio 1940"
  ],
  [
    "italy",
    "BB",
    "Conte di Cavour",
    "it_bb_giulio_cesare",
    "it_bb_26.gif",
    "Giulio Cesare 1940"
  ],
  [
    "italy",
    "BB",
    "Andrea Doria",
    "it_bb_duilio",
    "it_bb_75.jpg",
    "Andrea Doria 1942"
  ],
  [
    "italy",
    "BB",
    "Andrea Doria",
    "it_bb_duilio",
    "it_bb_76.jpg",
    "Caio Duilio 1942",
    [
      "CAIO DUILIO"
    ]
  ],
  [
    "italy",
    "CV",
    "Aquila",
    "it_cv_aquila",
    "it_cv_27.gif",
    "Aquila (progetto)"
  ],
  [
    "italy",
    "CA",
    "Trento",
    "it_cr_trento",
    "it_cr_55.gif",
    "Trieste 1941"
  ],
  [
    "italy",
    "CA",
    "Zara",
    "it_cr_zara",
    "it_cr_54.gif",
    "Zara 1940"
  ],
  [
    "italy",
    "CA",
    "Bolzano",
    "it_cr_bolzano",
    "it_cr_53.gif",
    "Bolzano 1940"
  ],
  [
    "italy",
    "CL",
    "Alberto di Giussano",
    "it_cr_giussano",
    "it_cr_62.gif",
    "Alberto di Giussano 1941"
  ],
  [
    "italy",
    "CL",
    "Luigi Cadorna",
    "it_cr_cadorna",
    "it_cr_61.gif",
    "Luigi Cadorna 1941"
  ],
  [
    "italy",
    "CL",
    "Raimondo Montecuccoli",
    "it_cr_montecuccoli",
    "it_cr_60.gif",
    "Raimondo Montecuccoli 1940"
  ],
  [
    "italy",
    "CL",
    "Duca d’Aosta",
    "it_cr_duca_daosta",
    "it_cr_78.jpg",
    "Emanuele Filiberto Duca d’Aosta 1942"
  ],
  [
    "italy",
    "CL",
    "Duca degli Abruzzi",
    "it_cr_abruzzi",
    "it_cr_58.gif",
    "Giuseppe Garibaldi 1940"
  ],
  [
    "italy",
    "CL",
    "Capitani Romani",
    "it_cr_regolo",
    "it_cr_73.jpg",
    "Attilio Regolo 1942"
  ],
  [
    "italy",
    "CL",
    "Capitani Romani",
    "it_cr_regolo",
    "it_cr_57.gif",
    "Scipione Africano 1943",
    [
      "SCIPIONE AFRICANO"
    ]
  ],
  [
    "italy",
    "DD",
    "Leone",
    "it_dd_leone",
    "it_dd_20.gif",
    "Tigre 1940"
  ],
  [
    "italy",
    "DD",
    "Turbine",
    "it_dd_turbine",
    "it_dd_111.gif",
    "Espero 1940"
  ],
  [
    "italy",
    "DD",
    "Navigatori",
    "it_dd_navigatori",
    "it_dd_108.gif",
    "Luca Tarigo 1940"
  ],
  [
    "italy",
    "DD",
    "Dardo",
    "it_dd_freccia",
    "it_dd_107.gif",
    "Dardo 1940"
  ],
  [
    "italy",
    "DD",
    "Soldati",
    "it_dd_soldati",
    "it_dd_81.gif",
    "Camicia Nera 1940"
  ],
  [
    "italy",
    "DD",
    "Spica",
    "it_dd_spica",
    "it_dd_115.gif",
    "Canopo 1940"
  ],
  [
    "italy",
    "SUB",
    "Sirena",
    "it_ss_sirena",
    "it_ss_62.gif",
    "Ametista 1940"
  ],
  [
    "italy",
    "SUB",
    "Liuzzi",
    "it_ss_liuzzi",
    "it_ss_36.gif",
    "Console Generale Liuzzi 1940"
  ],
  [
    "italy",
    "SUB",
    "Marconi",
    "it_ss_marconi",
    "it_ss_38.gif",
    "Guglielmo Marconi 1940"
  ],
  [
    "italy",
    "SUB",
    "Acciaio",
    "it_ss_acciaio",
    "it_ss_71.gif",
    "Acciaio 1942"
  ],
  [
    "uk",
    "BB",
    "King George V",
    "brit_bb1_king_george_v",
    "brit_b3.gif",
    "King George V 1940"
  ],
  [
    "uk",
    "BB",
    "Nelson",
    "brit_bb1_nelson",
    "brit_b4.gif",
    "Rodney 1939"
  ],
  [
    "uk",
    "BB",
    "Queen Elizabeth",
    "brit_bb1_queen_elizabeth",
    "brit_b224.gif",
    "Queen Elizabeth 1941",
    [
      "QUEEN ELIZABETH",
      "VALIANT"
    ]
  ],
  [
    "uk",
    "BB",
    "Queen Elizabeth",
    "brit_bb1_queen_elizabeth",
    "brit_b17.gif",
    "Barham 1941",
    [
      "BARHAM"
    ]
  ],
  [
    "uk",
    "BB",
    "Queen Elizabeth",
    "brit_bb1_queen_elizabeth",
    "brit_b45.jpg",
    "Warspite 1942",
    [
      "WARSPITE"
    ]
  ],
  [
    "uk",
    "BB",
    "Queen Elizabeth",
    "brit_bb1_queen_elizabeth",
    "brit_b67.gif",
    "Malaya 1937 (anteguerra)",
    [
      "MALAYA"
    ]
  ],
  [
    "uk",
    "BB",
    "Revenge",
    "brit_bb1_royal_sovereign",
    "brit_b19.gif",
    "Royal Oak 1939"
  ],
  [
    "uk",
    "BC",
    "Admiral",
    "brit_bb1_hood",
    "brit_b5.gif",
    "Hood 1940"
  ],
  [
    "uk",
    "CV",
    "Eagle",
    "brit_cv1_eagle",
    "brit_c15.gif",
    "Eagle 1939"
  ],
  [
    "uk",
    "CV",
    "Ark Royal",
    "brit_cv1_ark_royal",
    "brit_c11.gif",
    "Ark Royal 1939"
  ],
  [
    "uk",
    "CV",
    "Illustrious",
    "brit_cv1_illustrious",
    "brit_c10.gif",
    "Victorious 1941"
  ],
  [
    "uk",
    "CV",
    "Illustrious",
    "brit_cv1_indomitable",
    "brit_c178.gif",
    "Indomitable 1943",
    [
      "INDOMITABLE"
    ]
  ],
  [
    "uk",
    "CA",
    "County (Kent)",
    "brit_cr_kent",
    "brit_c12.gif",
    "Canberra 1940"
  ],
  [
    "uk",
    "CA",
    "York",
    "brit_cr_york",
    "brit_c47.jpg",
    "York 1941",
    [
      "YORK"
    ]
  ],
  [
    "uk",
    "CA",
    "York",
    "brit_cr_exeter",
    "brit_c6.gif",
    "Exeter 1941",
    [
      "EXETER"
    ]
  ],
  [
    "uk",
    "CL",
    "C (Ceres)",
    "brit_cr_ceres",
    "brit_c44.gif",
    "Coventry 1940",
    [
      "COVENTRY",
      "CURLEW"
    ]
  ],
  [
    "uk",
    "CL",
    "C (Ceres)",
    "brit_cr_ceres",
    "brit_c99.gif",
    "Curacoa 1941",
    [
      "CURACAO",
      "CURACOA"
    ]
  ],
  [
    "uk",
    "CL",
    "Leander",
    "brit_cr_leander",
    "brit_c17.jpg",
    "Ajax 1943"
  ],
  [
    "uk",
    "CL",
    "Arethusa",
    "brit_cr_arethusa",
    "brit_c10.jpg",
    "Arethusa 1942"
  ],
  [
    "uk",
    "CL",
    "Arethusa",
    "brit_cr_arethusa",
    "brit_c8.jpg",
    "Penelope 1940",
    [
      "PENELOPE"
    ]
  ],
  [
    "uk",
    "CL",
    "Town (Southampton)",
    "brit_cr_southampton",
    "brit_c46.jpg",
    "Southampton 1940"
  ],
  [
    "uk",
    "CL",
    "Town (Southampton)",
    "brit_cr_southampton",
    "brit_c103.gif",
    "Sheffield 1943",
    [
      "SHEFFIELD"
    ]
  ],
  [
    "uk",
    "CL",
    "Town (Edinburgh)",
    "brit_cr_edinburgh",
    "brit_c12.jpg",
    "Edinburgh 1941"
  ],
  [
    "uk",
    "CL",
    "Town (Edinburgh)",
    "brit_cr_edinburgh",
    "brit_c13.jpg",
    "Belfast 1943",
    [
      "BELFAST"
    ]
  ],
  [
    "uk",
    "CL",
    "Dido",
    "brit_cr_dido",
    "brit_c48.gif",
    "Scylla 1942 (variante 114 mm)",
    [
      "SCYLLA",
      "CHARYBDIS"
    ]
  ],
  [
    "uk",
    "CL",
    "Crown Colony (Fiji)",
    "brit_cr_fiji",
    "brit_c36.gif",
    "Gambia 1943"
  ],
  [
    "uk",
    "DD",
    "E",
    "brit_dd_e_f",
    "brit_d107.gif",
    "Eclipse 1939"
  ],
  [
    "uk",
    "DD",
    "F",
    "brit_dd_e_f",
    "brit_d52.gif",
    "Qu’Appelle (ex Foxhound) 1943"
  ],
  [
    "uk",
    "DD",
    "G",
    "brit_dd_g_h_i",
    "brit_d48.gif",
    "Greyhound 1939"
  ],
  [
    "uk",
    "DD",
    "I",
    "brit_dd_g_h_i",
    "brit_d21.gif",
    "Icarus 1942",
    [
      "ICARUS"
    ]
  ],
  [
    "uk",
    "DD",
    "I",
    "brit_dd_g_h_i",
    "brit_d21.gif",
    "Icarus 1942"
  ],
  [
    "uk",
    "DD",
    "Tribal",
    "brit_dd_tribal",
    "brit_d19.jpg",
    "Zulu 1941"
  ],
  [
    "uk",
    "DD",
    "Tribal",
    "brit_dd_tribal",
    "brit_d21.jpg",
    "Sikh 1942",
    [
      "SIKH"
    ]
  ],
  [
    "uk",
    "DD",
    "J",
    "brit_dd_j_k_n",
    "brit_d42.gif",
    "Jupiter 1940"
  ],
  [
    "uk",
    "DD",
    "J",
    "brit_dd_j_k_n",
    "brit_d51.jpg",
    "Janus 1940",
    [
      "JANUS"
    ]
  ],
  [
    "uk",
    "DD",
    "K",
    "brit_dd_j_k_n",
    "brit_d42.gif",
    "Jupiter 1940 (gruppo J/K)"
  ],
  [
    "uk",
    "DD",
    "N",
    "brit_dd_j_k_n",
    "brit_d267.gif",
    "Napier 1942"
  ],
  [
    "uk",
    "DD",
    "L",
    "brit_dd_l_m",
    "brit_d40.gif",
    "Lance 1942 (variante 102 mm)",
    [
      "GURKHA",
      "LANCE",
      "LIVELY",
      "LEGION"
    ]
  ],
  [
    "uk",
    "DD",
    "P",
    "brit_dd_o_p",
    "brit_d39.gif",
    "Pakenham 1943"
  ],
  [
    "uk",
    "SUB",
    "T",
    "brit_ss_t_prewar",
    "brit_s84.gif",
    "Triton 1940 (gruppo prebellico)",
    [
      "TRITON",
      "TALISMAN",
      "TAKU",
      "TETRARCH",
      "TORBAY",
      "TRIUMPH",
      "TRUANT",
      "TRIDENT",
      "THISTLE",
      "THETIS",
      "THUNDERBOLT",
      "TRIBUNE",
      "TRITON",
      "TRIUMPH",
      "TUNA",
      "TIGRIS"
    ]
  ]
];
const PENDING=[
  [
    "italy",
    "CV",
    "Sparviero",
    "it_cv_sparviero"
  ],
  [
    "italy",
    "DD",
    "Nazario Sauro",
    "it_dd_sauro"
  ],
  [
    "italy",
    "DD",
    "Folgore",
    "it_dd_folgore"
  ],
  [
    "italy",
    "DD",
    "Maestrale",
    "it_dd_maestrale"
  ],
  [
    "italy",
    "DD",
    "Oriani",
    "it_dd_oriani"
  ],
  [
    "italy",
    "DD",
    "Dubrovnik",
    "it_dd_premuda2"
  ],
  [
    "italy",
    "DD",
    "Orsa (Pegaso)",
    "it_dd_pegaso"
  ],
  [
    "italy",
    "DD",
    "Ciclone",
    "it_dd_ciclone"
  ],
  [
    "italy",
    "SUB",
    "Argonauta",
    "it_ss_argonauta2"
  ],
  [
    "italy",
    "SUB",
    "Perla",
    "it_ss_perla"
  ],
  [
    "italy",
    "SUB",
    "Adua",
    "it_ss_adua"
  ],
  [
    "uk",
    "BC",
    "Renown",
    "brit_bb1_renown16"
  ],
  [
    "uk",
    "CL",
    "C (Carlisle)",
    "brit_cr_carlisle"
  ],
  [
    "uk",
    "CL",
    "Leander (Perth)",
    "brit_cr_perth"
  ],
  [
    "uk",
    "CL",
    "Town (Gloucester)",
    "brit_cr_gloucester"
  ],
  [
    "uk",
    "CL",
    "Crown Colony (Ceylon)",
    "brit_cr_fiji"
  ],
  [
    "uk",
    "DD",
    "D",
    "brit_dd_c_d"
  ],
  [
    "uk",
    "DD",
    "H",
    "brit_dd_g_h_i"
  ],
  [
    "uk",
    "SUB",
    "U",
    "brit_ss_u_war_1940_1941"
  ],
  [
    "uk",
    "SUB",
    "T",
    "brit_ss_t_war_1940"
  ],
  [
    "usa",
    "CV",
    "Wasp",
    "us_cv_wasp"
  ]
];
function nameOf(unit){return String(unit?.nome||'').trim().toUpperCase().replace(/\s*\((?:I|II|III|AA)\)$/,'');}
function pageOf(r){return BASE+'/ships/'+r[0]+'/'+r[3]+'.htm';}
export function shipProfile(unit,className){
 const name=nameOf(unit),type=String(unit?.tipo||'').trim().toUpperCase();
 const list=ROWS.filter(r=>r[1]===type&&r[2]===className);
 const row=list.find(r=>r[6]?.includes(name))||list.find(r=>!r[6]);
 if(row)return {image:BASE+'/storage/images/ships/'+row[0]+'/'+row[4],caption:row[5],page:pageOf(row),className};
 const record=PENDING.find(r=>r[1]===type&&r[2]===className)||list[0];
 if(record)return {image:null,caption:className,page:pageOf(record),className};
 return null;
}
