// Repertorio pubblico di riferimenti storici, non anagrafica della partita.
// [chiave normalizzata, nome file futuro, ID scheda WT, variante, corrispondenza].
export const ALLIES_AIRCRAFT = Object.freeze({
  "B25JMITCHELL": {
    "slug": "b25j",
    "id": "b_25j_1",
    "label": "B-25J-1",
    "match": "family"
  },
  "BLENHEIMMKIV": {
    "slug": "blenheim-mkiv",
    "id": "blenheim_mkiv",
    "label": "Blenheim Mk IV",
    "match": "exact"
  },
  "CHESAPEAKEMKI": {
    "slug": "chesapeake-mki",
    "id": "v_156_b1",
    "label": "Chesapeake Mk I",
    "match": "exact"
  },
  "SKUA": {
    "slug": "skua",
    "id": null,
    "label": "Blackburn Skua",
    "match": "missing"
  },
  "BARRACUDA": {
    "slug": "barracuda",
    "id": null,
    "label": "Fairey Barracuda",
    "match": "missing"
  },
  "GLADIATORMKII": {
    "slug": "gladiator-mkii",
    "id": "gladiator_mk2_navy",
    "label": "Gladiator Mk II navale",
    "match": "exact"
  },
  "MARTLETTMKII": {
    "slug": "martlet-mkii",
    "id": "f4f-4_martlet_mk4",
    "label": "Martlet Mk IV",
    "match": "variant"
  },
  "SPITFIREMKV": {
    "slug": "spitfire-mkv",
    "id": "spitfire_mk5b_notrop",
    "label": "Spitfire Mk Vb",
    "match": "family"
  },
  "SPITFIREMKIX": {
    "slug": "spitfire-mkix",
    "id": "spitfire_ix_early",
    "label": "Spitfire F Mk IX",
    "match": "family"
  },
  "BEAUFIGHTERTFMKX": {
    "slug": "beaufighter-mkx",
    "id": "beaufighter_mkx",
    "label": "Beaufighter Mk X",
    "match": "exact"
  },
  "MOSQUITOMKVI": {
    "slug": "mosquito-mkvi",
    "id": "mosquito_fb_mk6",
    "label": "Mosquito FB Mk VI",
    "match": "family"
  },
  "FULMARMKII": {
    "slug": "fulmar-mkii",
    "id": "fulmar_mk2",
    "label": "Fulmar Mk II",
    "match": "exact"
  },
  "SEAHURRICANEMKIB": {
    "slug": "hurricane-mkiib",
    "id": "hurricanemkii",
    "label": "Hurricane Mk IIB (immagine non navale)",
    "match": "variant"
  },
  "SEAFIREMKIB": {
    "slug": "spitfire-mkv",
    "id": "spitfire_mk5b_notrop",
    "label": "Spitfire Mk Vb (immagine non navale)",
    "match": "variant"
  },
  "HURRICANEMKIIB": {
    "slug": "hurricane-mkiib",
    "id": "hurricanemkii",
    "label": "Hurricane Mk IIB/Trop",
    "match": "family"
  },
  "B24LIBERATOR": {
    "slug": "b24",
    "id": "b_24d",
    "label": "B-24D-25-CO",
    "match": "family"
  },
  "HALIFAX": {
    "slug": "halifax",
    "id": "halifax_mk3",
    "label": "Halifax B Mk IIIa",
    "match": "family"
  },
  "SUNDERLAND": {
    "slug": "sunderland",
    "id": "sunderland_mk5",
    "label": "Sunderland Mk V",
    "match": "variant"
  },
  "PBY5CATALINA": {
    "slug": "pby5",
    "id": "pby-5",
    "label": "PBY-5 Catalina",
    "match": "exact"
  },
  "BEAUFORT": {
    "slug": "beaufort",
    "id": "beaufort_mkviii",
    "label": "Beaufort Mk VIII",
    "match": "family"
  },
  "SWORDFISHMKI": {
    "slug": "swordfish-mki",
    "id": "swordfish_mk1",
    "label": "Swordfish Mk I",
    "match": "exact"
  }
});
// Aggiungere soltanto file locali verificati e autorizzati, con provenienza e licenza.
// Esempio di struttura della voce: slug: {file:'slug.webp',credit:'Autore',license:'Licenza o permesso',source:'URL della fonte'}.
export const ALLIES_AIRCRAFT_ASSETS = Object.freeze({
  "b25j": {
    "file": "b25j.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/b_25j_1",
    "original_filename": "b_25j_1.png"
  },
  "blenheim-mkiv": {
    "file": "blenheim-mkiv.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/blenheim_mkiv",
    "original_filename": "blenheim_mkiv.png"
  },
  "chesapeake-mki": {
    "file": "chesapeake-mki.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/v_156_b1",
    "original_filename": "v_156_b1.png"
  },
  "gladiator-mkii": {
    "file": "gladiator-mkii.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/gladiator_mk2_navy",
    "original_filename": "gladiator_mk2_navy.png"
  },
  "spitfire-mkv": {
    "file": "spitfire-mkv.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/spitfire_mk5b_notrop",
    "original_filename": "spitfire_mk5b_notrop.png"
  },
  "spitfire-mkix": {
    "file": "spitfire-mkix.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/spitfire_ix_early",
    "original_filename": "spitfire_ix_early.png"
  },
  "beaufighter-mkx": {
    "file": "beaufighter-mkx.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/beaufighter_mkx",
    "original_filename": "beaufighter_mkx.png"
  },
  "mosquito-mkvi": {
    "file": "mosquito-mkvi.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/mosquito_fb_mk6",
    "original_filename": "mosquito_fb_mk6.png"
  },
  "fulmar-mkii": {
    "file": "fulmar-mkii.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/fulmar_mk2",
    "original_filename": "fulmar_mk2.png"
  },
  "hurricane-mkiib": {
    "file": "hurricane-mkiib.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/hurricanemkii",
    "original_filename": "hurricanemkii.png"
  },
  "b24": {
    "file": "b24.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/b_24d",
    "original_filename": "b_24d.png"
  },
  "halifax": {
    "file": "halifax.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/halifax_mk3",
    "original_filename": "halifax_mk3.png"
  },
  "sunderland": {
    "file": "sunderland.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/sunderland_mk5",
    "original_filename": "sunderland_mk5.png"
  },
  "pby5": {
    "file": "pby5.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/pby-5",
    "original_filename": "pby-5.png"
  },
  "beaufort": {
    "file": "beaufort.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/beaufort_mkviii",
    "original_filename": "beaufort_mkviii.png"
  },
  "swordfish-mki": {
    "file": "swordfish-mki.webp",
    "credit": "War Thunder / Gaijin — miniatura fornita dall'utente",
    "license": "Diritti di ripubblicazione non verificati indipendentemente",
    "source": "https://wiki.warthunder.com/unit/swordfish_mk1",
    "original_filename": "swordfish_mk1.png"
  }
});
