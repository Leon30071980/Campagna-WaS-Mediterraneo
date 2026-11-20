# Organizzazione repository — v1.41

- `index.html`: accesso e shell GitHub Pages, nessuna build.
- `assets/common/`: cornice (dipinto Axis usato anche nei ritagli SVG Allies), icone neutre, stati, menu e profili francesi condivisi. Non duplicare la cornice.
- `assets/axis/`: bandiera, favicon, profili Axis.
- `assets/allies/`: fondale, stemma, siluri, bandiere, favicon, profili Allies.
- `js/common/`: UI, motore, regole, Nhost, repertori pubblici, risoluzione immagini. Nessuna anagrafica privata.
- `js/axis/`, `js/allies/`: testate e registri locali delle sagome.
- `css/common/`: base, connessione, catalogo, profili/stati e responsive.
- `css/axis/`, `css/allies/`: presentazione specifica. Alcuni override comuni conservano selettori storici di fazione per preservare la cascata.

## Ordine CSS (non invertire)
1. `css/common/base.css`
2. `css/common/nhost.css`
3. `css/axis/base.css`
4. `css/common/catalog.css`
5. `css/axis/command.css`
6. `css/common/profiles-status.css`
7. `css/axis/navigation.css`
8. `css/allies/command.css`
9. `css/common/responsive.css`

## Asset rimossi o sostituiti
Riferimento di partenza: `bd3902840662e10545250d5525f5936bd1a951f3`. Gli originali rimangono nella cronologia Git. Le tre nuove icone 64×64 sono estratte esattamente dai data URI usati nella versione precedente.

- `assets/favicon/favicon-allies.png`
- `assets/favicon/favicon-axis.png`
- `assets/naval/admiralty-flags-v16.webp`
- `assets/naval/ae1-v111.webp`
- `assets/naval/aircraft-v110.svg`
- `assets/naval/allies/background.webp`
- `assets/naval/allies/banner-v126.webp`
- `assets/naval/allies/white-ensign-waving-v131.svg`
- `assets/naval/header.jpg`
- `assets/naval/mediterraneo-map.svg`
- `assets/naval/mediterraneo-v17.svg`
- `assets/naval/profiles/bb_cavour.svg`
- `assets/naval/profiles/bb_duilio.svg`
- `assets/naval/profiles/bb_littorio.svg`
- `assets/naval/profiles/ca_bolzano.svg`
- `assets/naval/profiles/ca_suffren.svg`
- `assets/naval/profiles/ca_trento.svg`
- `assets/naval/profiles/ca_zara.svg`
- `assets/naval/profiles/cl_cadorna.svg`
- `assets/naval/profiles/cl_capitani_romani.svg`
- `assets/naval/profiles/cl_duca_daosta.svg`
- `assets/naval/profiles/cl_duca_degli_abruzzi.svg`
- `assets/naval/profiles/cl_giussano.svg`
- `assets/naval/profiles/cl_la_galissonniere.svg`
- `assets/naval/profiles/cl_montecuccoli.svg`
- `assets/naval/profiles/cv_aquila.svg`
- `assets/naval/profiles/cv_sparviero.svg`
- `assets/naval/profiles/dd_dardo.svg`
- `assets/naval/profiles/dd_dubrovnik.svg`
- `assets/naval/profiles/dd_folgore.svg`
- `assets/naval/profiles/dd_leone.svg`
- `assets/naval/profiles/dd_maestrale.svg`
- `assets/naval/profiles/dd_navigatori.svg`
- `assets/naval/profiles/dd_oriani.svg`
- `assets/naval/profiles/dd_pegaso.svg`
- `assets/naval/profiles/dd_sauro.svg`
- `assets/naval/profiles/dd_soldati_1.svg`
- `assets/naval/profiles/dd_soldati_2.svg`
- `assets/naval/profiles/dd_spica.svg`
- `assets/naval/profiles/dd_turbine.svg`
- `assets/naval/profiles/sub_acciaio.svg`
- `assets/naval/profiles/sub_adua.svg`
- `assets/naval/profiles/sub_argonauta.svg`
- `assets/naval/profiles/sub_liuzzi.svg`
- `assets/naval/profiles/sub_marconi.svg`
- `assets/naval/profiles/sub_perla.svg`
- `assets/naval/profiles/sub_sirena.svg`
- `assets/naval/profiles/sub_viib.svg`
- `assets/naval/profiles/sub_viic.svg`
- `assets/naval/savoy-flag-v17.svg`
- `assets/naval/sunk-v110.svg`
- `assets/naval/sunk.png`
- `assets/naval/vittorio-veneto.png`

Codice dismesso: `css/royal.css`, `js/admiralty-gallery.js`.

## Mappa dei percorsi attivi
- `assets/apple-touch-icon.png` → `assets/common/icons/apple-touch-icon.png`
- `assets/naval/admiralty-hero-v18.webp` → `assets/common/header/regia-marina-frame-source.webp`
- `assets/naval/admiralty-flag-v19.webp` → `assets/axis/header/flag.webp`
- `assets/naval/allies/banner-v132.png` → `assets/allies/header/banner.png`
- `assets/naval/allies/crest.webp` → `assets/allies/header/crest.webp`
- `assets/naval/allies/swordfish-torpedoes-v133.webp` → `assets/allies/header/swordfish-torpedoes.webp`
- `assets/naval/allies/white-ensign-painted-v134.webp` → `assets/allies/header/flag.webp`
- `assets/naval/allies/free-france.webp` → `assets/allies/flags/free-france.webp`
- `assets/naval/allies/us-flag.webp` → `assets/allies/flags/us-flag.webp`
- `assets/naval/allies/white-ensign.webp` → `assets/allies/flags/white-ensign.webp`
- `assets/naval/operational.png` → `assets/common/status/operational.png`
- `assets/naval/repair.png` → `assets/common/status/repair.png`
- `assets/naval/np5-v111.webp` → `assets/common/status/sunk.webp`
- `assets/naval/construction-v120.svg` → `assets/common/status/construction.svg`
- `assets/naval/menu-b/aerei.png` → `assets/common/menu/aerei.png`
- `assets/naval/menu-b/battaglia.png` → `assets/common/menu/battaglia.png`
- `assets/naval/menu-b/gestione.png` → `assets/common/menu/gestione.png`
- `assets/naval/menu-b/navi.png` → `assets/common/menu/navi.png`
- `assets/naval/menu-b/porto.png` → `assets/common/menu/porto.png`
- `assets/naval/menu-b/regole.png` → `assets/common/menu/regole.png`
- `assets/naval/menu-b/storico.png` → `assets/common/menu/storico.png`
- `assets/naval/profiles/axis/bb_cavour.webp` → `assets/axis/profiles/bb_cavour.webp`
- `assets/naval/profiles/axis/bb_duilio.webp` → `assets/axis/profiles/bb_duilio.webp`
- `assets/naval/profiles/axis/bb_littorio.webp` → `assets/axis/profiles/bb_littorio.webp`
- `assets/naval/profiles/axis/ca_bolzano.webp` → `assets/axis/profiles/ca_bolzano.webp`
- `assets/naval/profiles/axis/ca_suffren.webp` → `assets/common/profiles/ca_suffren.webp`
- `assets/naval/profiles/axis/ca_trento.webp` → `assets/axis/profiles/ca_trento.webp`
- `assets/naval/profiles/axis/ca_zara.webp` → `assets/axis/profiles/ca_zara.webp`
- `assets/naval/profiles/axis/cl_cadorna.webp` → `assets/axis/profiles/cl_cadorna.webp`
- `assets/naval/profiles/axis/cl_capitani_romani.webp` → `assets/axis/profiles/cl_capitani_romani.webp`
- `assets/naval/profiles/axis/cl_duca_daosta.webp` → `assets/axis/profiles/cl_duca_daosta.webp`
- `assets/naval/profiles/axis/cl_duca_degli_abruzzi.webp` → `assets/axis/profiles/cl_duca_degli_abruzzi.webp`
- `assets/naval/profiles/axis/cl_giussano.webp` → `assets/axis/profiles/cl_giussano.webp`
- `assets/naval/profiles/axis/cl_la_galissonniere.webp` → `assets/common/profiles/cl_la_galissonniere.webp`
- `assets/naval/profiles/axis/cl_montecuccoli.webp` → `assets/axis/profiles/cl_montecuccoli.webp`
- `assets/naval/profiles/axis/cv_aquila.webp` → `assets/axis/profiles/cv_aquila.webp`
- `assets/naval/profiles/axis/cv_sparviero.webp` → `assets/axis/profiles/cv_sparviero.webp`
- `assets/naval/profiles/axis/dd_dardo.webp` → `assets/axis/profiles/dd_dardo.webp`
- `assets/naval/profiles/axis/dd_dubrovnik.webp` → `assets/axis/profiles/dd_dubrovnik.webp`
- `assets/naval/profiles/axis/dd_folgore.webp` → `assets/axis/profiles/dd_folgore.webp`
- `assets/naval/profiles/axis/dd_leone.webp` → `assets/axis/profiles/dd_leone.webp`
- `assets/naval/profiles/axis/dd_maestrale.webp` → `assets/axis/profiles/dd_maestrale.webp`
- `assets/naval/profiles/axis/dd_navigatori.webp` → `assets/axis/profiles/dd_navigatori.webp`
- `assets/naval/profiles/axis/dd_oriani.webp` → `assets/axis/profiles/dd_oriani.webp`
- `assets/naval/profiles/axis/dd_pegaso.webp` → `assets/axis/profiles/dd_pegaso.webp`
- `assets/naval/profiles/axis/dd_sauro.webp` → `assets/axis/profiles/dd_sauro.webp`
- `assets/naval/profiles/axis/dd_soldati_1.webp` → `assets/axis/profiles/dd_soldati_1.webp`
- `assets/naval/profiles/axis/dd_soldati_2.webp` → `assets/axis/profiles/dd_soldati_2.webp`
- `assets/naval/profiles/axis/dd_spica.webp` → `assets/axis/profiles/dd_spica.webp`
- `assets/naval/profiles/axis/dd_turbine.webp` → `assets/axis/profiles/dd_turbine.webp`
- `assets/naval/profiles/axis/sub_acciaio.webp` → `assets/axis/profiles/sub_acciaio.webp`
- `assets/naval/profiles/axis/sub_adua.webp` → `assets/axis/profiles/sub_adua.webp`
- `assets/naval/profiles/axis/sub_argonauta.webp` → `assets/axis/profiles/sub_argonauta.webp`
- `assets/naval/profiles/axis/sub_liuzzi.webp` → `assets/axis/profiles/sub_liuzzi.webp`
- `assets/naval/profiles/axis/sub_marconi.webp` → `assets/axis/profiles/sub_marconi.webp`
- `assets/naval/profiles/axis/sub_perla.webp` → `assets/axis/profiles/sub_perla.webp`
- `assets/naval/profiles/axis/sub_sirena.webp` → `assets/axis/profiles/sub_sirena.webp`
- `assets/naval/profiles/axis/sub_viib.webp` → `assets/axis/profiles/sub_viib.webp`
- `assets/naval/profiles/axis/sub_viic.webp` → `assets/axis/profiles/sub_viic.webp`
- `assets/naval/profiles/royal/bb_barham.webp` → `assets/allies/profiles/bb_barham.webp`
- `assets/naval/profiles/royal/bb_king_george.webp` → `assets/allies/profiles/bb_king_george.webp`
- `assets/naval/profiles/royal/bb_malaya.webp` → `assets/allies/profiles/bb_malaya.webp`
- `assets/naval/profiles/royal/bb_nelson.webp` → `assets/allies/profiles/bb_nelson.webp`
- `assets/naval/profiles/royal/bb_queen_elizabeth.webp` → `assets/allies/profiles/bb_queen_elizabeth.webp`
- `assets/naval/profiles/royal/bb_revenge.webp` → `assets/allies/profiles/bb_revenge.webp`
- `assets/naval/profiles/royal/bb_warspite.webp` → `assets/allies/profiles/bb_warspite.webp`
- `assets/naval/profiles/royal/bc_admiral.webp` → `assets/allies/profiles/bc_admiral.webp`
- `assets/naval/profiles/royal/bc_renown.webp` → `assets/allies/profiles/bc_renown.webp`
- `assets/naval/profiles/royal/ca_county.webp` → `assets/allies/profiles/ca_county.webp`
- `assets/naval/profiles/royal/ca_york.webp` → `assets/allies/profiles/ca_york.webp`
- `assets/naval/profiles/royal/cl_arethusa.webp` → `assets/allies/profiles/cl_arethusa.webp`
- `assets/naval/profiles/royal/cl_carlisle.webp` → `assets/allies/profiles/cl_carlisle.webp`
- `assets/naval/profiles/royal/cl_ceres.webp` → `assets/allies/profiles/cl_ceres.webp`
- `assets/naval/profiles/royal/cl_crown_colony.webp` → `assets/allies/profiles/cl_crown_colony.webp`
- `assets/naval/profiles/royal/cl_dido.webp` → `assets/allies/profiles/cl_dido.webp`
- `assets/naval/profiles/royal/cl_edinburgh.webp` → `assets/allies/profiles/cl_edinburgh.webp`
- `assets/naval/profiles/royal/cl_gloucester.webp` → `assets/allies/profiles/cl_gloucester.webp`
- `assets/naval/profiles/royal/cl_leander.webp` → `assets/allies/profiles/cl_leander.webp`
- `assets/naval/profiles/royal/cl_southampton.webp` → `assets/allies/profiles/cl_southampton.webp`
- `assets/naval/profiles/royal/cl_sydney.webp` → `assets/allies/profiles/cl_sydney.webp`
- `assets/naval/profiles/royal/cv_ark_royal.webp` → `assets/allies/profiles/cv_ark_royal.webp`
- `assets/naval/profiles/royal/cv_eagle.webp` → `assets/allies/profiles/cv_eagle.webp`
- `assets/naval/profiles/royal/cv_illustrious.webp` → `assets/allies/profiles/cv_illustrious.webp`
- `assets/naval/profiles/royal/cv_wasp.webp` → `assets/allies/profiles/cv_wasp.webp`
- `assets/naval/profiles/royal/dd_d.webp` → `assets/allies/profiles/dd_d.webp`
- `assets/naval/profiles/royal/dd_e.webp` → `assets/allies/profiles/dd_e.webp`
- `assets/naval/profiles/royal/dd_f.webp` → `assets/allies/profiles/dd_f.webp`
- `assets/naval/profiles/royal/dd_g.webp` → `assets/allies/profiles/dd_g.webp`
- `assets/naval/profiles/royal/dd_h.webp` → `assets/allies/profiles/dd_h.webp`
- `assets/naval/profiles/royal/dd_i.webp` → `assets/allies/profiles/dd_i.webp`
- `assets/naval/profiles/royal/dd_j.webp` → `assets/allies/profiles/dd_j.webp`
- `assets/naval/profiles/royal/dd_k.webp` → `assets/allies/profiles/dd_k.webp`
- `assets/naval/profiles/royal/dd_l.webp` → `assets/allies/profiles/dd_l.webp`
- `assets/naval/profiles/royal/dd_le_fantasque.webp` → `assets/allies/profiles/dd_le_fantasque.webp`
- `assets/naval/profiles/royal/dd_n.webp` → `assets/allies/profiles/dd_n.webp`
- `assets/naval/profiles/royal/dd_p.webp` → `assets/allies/profiles/dd_p.webp`
- `assets/naval/profiles/royal/dd_tribal.webp` → `assets/allies/profiles/dd_tribal.webp`
- `assets/naval/profiles/royal/dd_vasilefs_georgios.webp` → `assets/allies/profiles/dd_vasilefs_georgios.webp`
- `assets/naval/profiles/royal/dd_vw.webp` → `assets/allies/profiles/dd_vw.webp`
- `assets/naval/profiles/royal/dd_w.webp` → `assets/allies/profiles/dd_w.webp`
- `assets/naval/profiles/royal/sub_glafkos.webp` → `assets/allies/profiles/sub_glafkos.webp`
- `assets/naval/profiles/royal/sub_t.webp` → `assets/allies/profiles/sub_t.webp`
- `assets/naval/profiles/royal/sub_u.webp` → `assets/allies/profiles/sub_u.webp`
- `js/catalog-display.js` → `js/common/catalog-display.js`
- `js/fleet-rules.js` → `js/common/fleet-rules.js`
- `js/historical-classes.js` → `js/common/historical-classes.js`
- `js/ship-profiles.js` → `js/common/ship-profiles.js`
- `css/regia.css` → `css/common/base.css`
- `css/nhost.css` → `css/common/nhost.css`

## Verifiche
- 103 asset spostati con SHA Git identico, 3 favicon estratti dai data URI.
- 38 SVG precedenti sostituiti dai WebP.
- 90 associazioni profilo verificate rispetto al codice precedente (immagine, lunghezza e didascalia).
- Ordine CSS invariato salvo blocco della galleria fotografica non più attiva.
- Test locale: `node tests/check-repository.mjs`. Il collaudo su browser autenticato e dispositivi fisici resta distinto.
