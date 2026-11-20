# Profili aerei — v1.44

I registri pubblici indicizzano modelli storici, non assegnazioni, quantità, perdite o punti della partita. Il resolver usa la fazione autenticata e le chiavi normalizzate.

Sono state importate 16 miniature Axis (PNG forniti dal giocatore, convertiti in WebP a 512 × 256 pixel). Gli altri modelli mantengono i riferimenti alle schede: l’app non scarica immagini da host esterni. Fonte: War Thunder / Gaijin; diritto di ripubblicazione non verificato indipendentemente. Consultare le [condizioni Gaijin](https://legal.gaijin.net/contentrules).

## Percorsi
- `assets/axis/aircraft/`: immagini Axis.
- `assets/allies/aircraft/`: immagini Allies.
- `js/axis/aircraft-profiles.js` e `js/allies/aircraft-profiles.js`: registri.
- `js/common/aircraft-profiles.js`: risoluzione per nome e fazione.

Dimensioni visuali: 160 × 80 desktop, 124 × 64 tablet/mobile, con object-fit contain. Usare immagini uniformi, senza deformare o capovolgere i contrassegni. Per associare un file autorizzato, aggiungere la voce al registro ASSETS usando lo slug indicato e i campi file, credit, license, source. Se assente o corrotto, il catalogo non mostra icone rotte.

## Stato importazione
Axis: 18/20 modelli coperti da 16 immagini locali; mancanti Ba.65 M e CANT Z.506. Allies: 0/19.

## Riferimenti identificati
### AXIS

| Chiave | File locale previsto | Scheda | Corrispondenza |
|---|---|---|---|
| BA65M | ba65m.webp | [Ba.65 (K.14) L](https://wiki.warthunder.com/unit/ba_65_k14_l) | variant |
| JU87R2 | ju87r2.webp | [Ju 87 R-2 italiano](https://wiki.warthunder.com/unit/ju-87r-2_italy) | exact |
| BF109G | bf109g14as.webp | [Bf 109 G-14/AS](https://wiki.warthunder.com/unit/bf-109g-14as) | variant |
| CR42 | cr42.webp | [CR.42](https://wiki.warthunder.com/unit/fiat_cr42_italy) | exact |
| MC202 | mc202.webp | [C.202](https://wiki.warthunder.com/unit/mc-202_italy) | exact |
| MC205 | mc205.webp | [C.205 serie 1](https://wiki.warthunder.com/unit/mc-205_serie1) | family |
| BF109G14AS | bf109g14as.webp | [Bf 109 G-14/AS](https://wiki.warthunder.com/unit/bf-109g-14as) | exact |
| BF110E | bf110e.webp | [Bf 110 F-2](https://wiki.warthunder.com/unit/bf-110f-2) | variant |
| FW190A6 | fw190a6.webp | [Fw 190 A-5](https://wiki.warthunder.com/unit/fw-190a-5_cannons) | variant |
| RE2000 | re2000.webp | [Re.2000 serie 1](https://wiki.warthunder.com/unit/re_2000_int) | family |
| RE2001CB | re2001cb.webp | [Re.2001 CB](https://wiki.warthunder.com/unit/re_2001_cb) | exact |
| RE2001OR | re2001cb.webp | [Re.2001 CB](https://wiki.warthunder.com/unit/re_2001_cb) | variant |
| FW200 | fw200.webp | [Fw 200 C-1](https://wiki.warthunder.com/unit/fw_200c_1) | family |
| P108B | p108b.webp | [P.108B serie 1](https://wiki.warthunder.com/unit/p_108b_serie1) | family |
| BR20 | br20.webp | [B.R.20M M1](https://wiki.warthunder.com/unit/br_20m_m1) | family |
| HE111H6 | he111h6.webp | [He 111 H-6](https://wiki.warthunder.com/unit/he-111h-6) | exact |
| JU88A4 | ju88a4.webp | [Ju 88 A-4](https://wiki.warthunder.com/unit/ju-88a-4) | exact |
| Z506 | z506.webp | Da reperire | missing |
| Z1007 | z1007.webp | [Z.1007 bis serie 3](https://wiki.warthunder.com/unit/z_1007_bis_serie3) | family |
| SM79 | sm79.webp | [S.M.79 AS](https://wiki.warthunder.com/unit/sm_79_1941_italy) | family |

### ALLIES

| Chiave | File locale previsto | Scheda | Corrispondenza |
|---|---|---|---|
| B25JMITCHELL | b25j.webp | [B-25J-1](https://wiki.warthunder.com/unit/b_25j_1) | family |
| BLENHEIMMKIV | blenheim-mkiv.webp | [Blenheim Mk IV](https://wiki.warthunder.com/unit/blenheim_mkiv) | exact |
| CHESAPEAKEMKI | chesapeake-mki.webp | [Chesapeake Mk I](https://wiki.warthunder.com/unit/v_156_b1) | exact |
| SKUA | skua.webp | Da reperire | missing |
| BARRACUDA | barracuda.webp | Da reperire | missing |
| GLADIATORMKII | gladiator-mkii.webp | [Gladiator Mk II](https://wiki.warthunder.com/unit/gladiator_mk2) | exact |
| MARTLETTMKII | martlet-mkii.webp | [Martlet Mk IV](https://wiki.warthunder.com/unit/f4f-4_martlet_mk4) | variant |
| SPITFIREMKV | spitfire-mkv.webp | [Spitfire Mk Vb/trop](https://wiki.warthunder.com/unit/spitfire_mk5b) | family |
| SPITFIREMKIX | spitfire-mkix.webp | [Spitfire F Mk IX](https://wiki.warthunder.com/unit/spitfire_ix_early) | family |
| BEAUFIGHTERTFMKX | beaufighter-mkx.webp | [Beaufighter Mk X](https://wiki.warthunder.com/unit/beaufighter_mkx) | exact |
| MOSQUITOMKVI | mosquito-mkvi.webp | [Mosquito FB Mk VI](https://wiki.warthunder.com/unit/mosquito_fb_mk6) | family |
| FULMARMKII | fulmar-mkii.webp | [Fulmar Mk II](https://wiki.warthunder.com/unit/fulmar_mk2) | exact |
| HURRICANEMKIIB | hurricane-mkiib.webp | [Hurricane Mk IIB/Trop](https://wiki.warthunder.com/unit/hurricanemkii) | family |
| B24LIBERATOR | b24.webp | [B-24D-25-CO](https://wiki.warthunder.com/unit/b_24d) | family |
| HALIFAX | halifax.webp | [Halifax B Mk IIIa](https://wiki.warthunder.com/unit/halifax_mk3) | family |
| SUNDERLAND | sunderland.webp | [Sunderland Mk IIIa](https://wiki.warthunder.com/unit/sunderland_mk3a) | family |
| PBY5CATALINA | pby5.webp | [PBY-5 Catalina](https://wiki.warthunder.com/unit/pby-5) | exact |
| BEAUFORT | beaufort.webp | [Beaufort Mk VIII](https://wiki.warthunder.com/unit/beaufort_mkviii) | family |
| SWORDFISHMKI | swordfish-mki.webp | [Swordfish Mk I](https://wiki.warthunder.com/unit/swordfish_mk1) | exact |

Non si assume che le livree o l'angolo di visualizzazione siano identici: verifica visiva dei file richiesta prima della registrazione. 
