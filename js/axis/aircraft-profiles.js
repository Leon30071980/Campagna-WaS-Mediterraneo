// Repertorio pubblico di riferimenti storici, non anagrafica della partita.
// [chiave normalizzata, nome file futuro, ID scheda WT, variante, corrispondenza].
export const AXIS_AIRCRAFT = Object.freeze({
  "BA65M": {
    "slug": "ba65m",
    "id": "ba_65_k14_l",
    "label": "Ba.65 (K.14) L",
    "match": "variant"
  },
  "JU87R2": {
    "slug": "ju87r2",
    "id": "ju-87r-2_italy",
    "label": "Ju 87 R-2 italiano",
    "match": "exact"
  },
  "BF109G": {
    "slug": "bf109g14as",
    "id": "bf-109g-14as",
    "label": "Bf 109 G-14/AS",
    "match": "variant"
  },
  "CR42": {
    "slug": "cr42",
    "id": "fiat_cr42_italy",
    "label": "CR.42",
    "match": "exact"
  },
  "MC202": {
    "slug": "mc202",
    "id": "mc-202_italy",
    "label": "C.202",
    "match": "exact"
  },
  "MC205": {
    "slug": "mc205",
    "id": "mc-205_serie1",
    "label": "C.205 serie 1",
    "match": "family"
  },
  "BF109G14AS": {
    "slug": "bf109g14as",
    "id": "bf-109g-14as",
    "label": "Bf 109 G-14/AS",
    "match": "exact"
  },
  "BF110E": {
    "slug": "bf110e",
    "id": "bf-110f-2",
    "label": "Bf 110 F-2",
    "match": "variant"
  },
  "FW190A6": {
    "slug": "fw190a6",
    "id": "fw-190a-5_cannons",
    "label": "Fw 190 A-5",
    "match": "variant"
  },
  "RE2000": {
    "slug": "re2000",
    "id": "re_2000_int",
    "label": "Re.2000 serie 1",
    "match": "family"
  },
  "RE2001CB": {
    "slug": "re2001cb",
    "id": "re_2001_cb",
    "label": "Re.2001 CB",
    "match": "exact"
  },
  "RE2001OR": {
    "slug": "re2001cb",
    "id": "re_2001_cb",
    "label": "Re.2001 CB",
    "match": "variant"
  },
  "FW200": {
    "slug": "fw200",
    "id": "fw_200c_1",
    "label": "Fw 200 C-1",
    "match": "family"
  },
  "P108B": {
    "slug": "p108b",
    "id": "p_108b_serie1",
    "label": "P.108B serie 1",
    "match": "family"
  },
  "BR20": {
    "slug": "br20",
    "id": "br_20m_m1",
    "label": "B.R.20M M1",
    "match": "family"
  },
  "HE111H6": {
    "slug": "he111h6",
    "id": "he-111h-6",
    "label": "He 111 H-6",
    "match": "exact"
  },
  "JU88A4": {
    "slug": "ju88a4",
    "id": "ju-88a-4",
    "label": "Ju 88 A-4",
    "match": "exact"
  },
  "Z506": {
    "slug": "z506",
    "id": null,
    "label": "CANT Z.506",
    "match": "missing"
  },
  "Z1007": {
    "slug": "z1007",
    "id": "z_1007_bis_serie3",
    "label": "Z.1007 bis serie 3",
    "match": "family"
  },
  "SM79": {
    "slug": "sm79",
    "id": "sm_79_1941_italy",
    "label": "S.M.79 AS",
    "match": "family"
  }
});
// Aggiungere soltanto file locali verificati e autorizzati, con provenienza e licenza.
// Esempio di struttura della voce: slug: {file:'slug.webp',credit:'Autore',license:'Licenza o permesso',source:'URL della fonte'}.
export const AXIS_AIRCRAFT_ASSETS = Object.freeze({
  "ba65m": {"file":"ba65m.webp","credit":"War Thunder / Gaijin — miniatura Ba.65 fornita dall'utente","license":"Diritti di ripubblicazione non verificati indipendentemente","source":"https://wiki.warthunder.com/unit/ba_65_k14_l","original_filename":"ba_65_k14_l.png"},
  "ju87r2": {
    "file": "ju87r2.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/ju-87r-2_italy"
  },
  "cr42": {
    "file": "cr42.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/fiat_cr42_italy"
  },
  "mc202": {
    "file": "mc202.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/mc-202_italy"
  },
  "mc205": {
    "file": "mc205.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/mc-205_serie1"
  },
  "bf109g14as": {
    "file": "bf109g14as.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/bf-109g-14as"
  },
  "bf110e": {
    "file": "bf110e.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/bf-110f-2"
  },
  "fw190a6": {
    "file": "fw190a6.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/fw-190a-5_cannons"
  },
  "re2000": {
    "file": "re2000.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/re_2000_int"
  },
  "re2001cb": {
    "file": "re2001cb.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/re_2001_cb"
  },
  "fw200": {
    "file": "fw200.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/fw_200c_1"
  },
  "p108b": {
    "file": "p108b.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/p_108b_serie1"
  },
  "br20": {
    "file": "br20.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/br_20m_m1"
  },
  "he111h6": {
    "file": "he111h6.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/he-111h-6"
  },
  "ju88a4": {
    "file": "ju88a4.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/ju-88a-4"
  },
  "z1007": {
    "file": "z1007.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/z_1007_bis_serie3"
  },
  "sm79": {
    "file": "sm79.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dal giocatore",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/sm_79_1941_italy"
  }
});
