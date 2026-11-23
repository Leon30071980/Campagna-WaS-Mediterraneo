# Profili aerei — v1.50

I registri pubblici indicizzano modelli storici, non assegnazioni, quantità, perdite o punti della partita. Il resolver usa la fazione autenticata e le chiavi normalizzate.

Sono state aggiunte 16 miniature Allies WebP 512 × 256 dallo ZIP Royal Air Force e l'immagine Ba.65 Axis fornita in chat. I 16 asset Axis precedenti restano invariati. Nessun caricamento di miniature da server esterni. Fonte: War Thunder / Gaijin; diritto di ripubblicazione non verificato indipendentemente. Consultare le [condizioni Gaijin](https://legal.gaijin.net/contentrules).

## Percorsi
- `assets/axis/aircraft/`: immagini Axis.
- `assets/allies/aircraft/`: immagini Allies.
- `js/axis/aircraft-profiles.js` e `js/allies/aircraft-profiles.js`: registri.
- `js/common/aircraft-profiles.js`: risoluzione per nome e fazione.

Dimensioni visuali: 160 × 80 desktop, 124 × 64 tablet/mobile, con object-fit contain. Usare immagini uniformi, senza deformare o capovolgere i contrassegni. Per associare un file autorizzato, aggiungere la voce al registro ASSETS usando lo slug indicato e i campi file, credit, license, source. Se assente o corrotto, il catalogo non mostra icone rotte.

## Stato importazione
Axis: 20/20 modelli coperti (18 WebP distinti, inclusa l'illustrazione del CANT Z.506). Allies: 19/19 modelli originari coperti; Skua e Barracuda utilizzano illustrazioni sintetiche approvate. Sea Gladiator aggiunto come modello navale separato. Le versioni Sea, aggiunte successivamente, sono documentate a parte.

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
| Z506 | z506.webp | [Illustrazione generata per il progetto](../assets/axis/aircraft/z506.webp) | illustration |
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
| GLADIATORMKII | gladiator-mkii.webp | [Gladiator Mk II navale](https://wiki.warthunder.com/unit/gladiator_mk2_navy) | exact |
| MARTLETTMKII | martlet-mkii.webp | [Martlet Mk IV](https://wiki.warthunder.com/unit/f4f-4_martlet_mk4) | variant |
| SPITFIREMKV | spitfire-mkv.webp | [Spitfire Mk Vb](https://wiki.warthunder.com/unit/spitfire_mk5b_notrop) | family |
| SPITFIREMKIX | spitfire-mkix.webp | [Spitfire F Mk IX](https://wiki.warthunder.com/unit/spitfire_ix_early) | family |
| BEAUFIGHTERTFMKX | beaufighter-mkx.webp | [Beaufighter Mk X](https://wiki.warthunder.com/unit/beaufighter_mkx) | exact |
| MOSQUITOMKVI | mosquito-mkvi.webp | [Mosquito FB Mk VI](https://wiki.warthunder.com/unit/mosquito_fb_mk6) | family |
| FULMARMKII | fulmar-mkii.webp | [Fulmar Mk II](https://wiki.warthunder.com/unit/fulmar_mk2) | exact |
| HURRICANEMKIIB | hurricane-mkiib.webp | [Hurricane Mk IIB/Trop](https://wiki.warthunder.com/unit/hurricanemkii) | family |
| B24LIBERATOR | b24.webp | [B-24D-25-CO](https://wiki.warthunder.com/unit/b_24d) | family |
| HALIFAX | halifax.webp | [Halifax B Mk IIIa](https://wiki.warthunder.com/unit/halifax_mk3) | family |
| SUNDERLAND | sunderland.webp | [Sunderland Mk V](https://wiki.warthunder.com/unit/sunderland_mk5) | variant |
| PBY5CATALINA | pby5.webp | [PBY-5 Catalina](https://wiki.warthunder.com/unit/pby-5) | exact |
| BEAUFORT | beaufort.webp | [Beaufort Mk VIII](https://wiki.warthunder.com/unit/beaufort_mkviii) | family |
| SWORDFISHMKI | swordfish-mki.webp | [Swordfish Mk I](https://wiki.warthunder.com/unit/swordfish_mk1) | exact |

Non si assume che le livree o l'angolo di visualizzazione siano identici: verifica visiva dei file richiesta prima della registrazione. 

## Nota sul caricamento v1.45
L'archivio ricevuto conteneva 18 PNG originali da 512 × 256. Sono stati importati come singoli WebP i 16 associabili agli aerei del catalogo Allied. I file alternativi `gladiator_mk2.png` e `hurricane_mk1c.png` non sono stati pubblicati nel repository per evitare duplicati. È stato scelto `gladiator_mk2_navy.png` per il Gladiator navale. Il Sunderland Mk V raffigurato è una variante posteriore al periodo della campagna: **sola immagine**, dati di gioco invariati. Le versioni Sea di Hurricane e Spitfire potranno essere aggiunte in seguito quando saranno fornite. Il sito non carica le miniature da domini esterni; diritti e permessi di redistribuzione delle immagini War Thunder non verificati indipendentemente.

## Sea Hurricane e Seafire — v1.46

| Nome | Tipo | Entrata | Ritiro | Base | Immagine riutilizzata |
|---|---|---:|---:|---|---|
| SEA HURRICANE MK.IB | F | 1941 | 1944 | IMBARCABILE | hurricane-mkiib.webp (variante non navale) |
| SEAFIRE MK.IB | F | 1942 | 1944 | IMBARCABILE | spitfire-mkv.webp (variante non navale) |

Fonti: [Sea Hurricane IB](https://www.historyofwar.org/articles/weapons_hawker_sea_hurricane_IB.html), [ultimo Sea Hurricane in servizio nel 1944](https://www.classicwarbirds.co.uk/british-aircraft/hawker-sea-hurricane.php), [Seafire IB dal giugno 1942](https://www.historyofwar.org/articles/weapons_supermarine_seafire_Ib.html), [801 Squadron e Seafire IB fino al settembre 1944](https://1000aircraftphotos.com/Contributions/CrupiRay/13008.htm). Il ritiro 1944 del Sea Hurricane è riferito alla famiglia operativa (l'IB fu progressivamente sostituito), e rappresenta una convenzione prudenziale del gioco. Le date non comportano ritiro nella campagna, che termina nel 1943.

L'inserimento è effettuato sulla sola fazione Allies mediante sessione autenticata, mutazione protetta e controllo di revisione. Per battaglie concluse o in corso l'inserimento è rinviato alla successiva fase modificabile. Non vengono modificate le voci terresti preesistenti. La pubblicazione GitHub, da sola, non equivale alla conferma del salvataggio Nhost.

## v1.47 — immagini Sea e rinomina

- `sea-hurricane-mkib.webp`: originale `hurricane_mk1b.png`, riferimento **Sea Hurricane Mk.IB**.
- `seafire-mkiii.webp`: originale `seafire_mk3.png`, riferimento **Seafire Mk.III**. Per il **Seafire Mk.IB** del catalogo iniziale è una miniatura di altra variante (indicata come tale).
- Le miniature sono mantenute a 512×256, orientamento e trasparenza originali.
- Le varianti vengono risolte da `aircraftKey(unit,side)`; usa, in ordine, `profileKey` esplicito, nome esatto, alias controllati e fallback per famiglia. Non si usano distanze ortografiche arbitrarie.
- Il form Aerei include **Profilo immagine**: Automatico sceglie la variante riconosciuta, mentre una scelta esplicita persiste con `profileKey`. Se un nome è totalmente personalizzato, la prima rinomina conserva il profilo originario.
- La sincronizzazione Nhost v1.46 non duplica la configurazione Seafire Mk.IB se una versione Seafire Mk.III è stata già rinominata/aggiunta. Nessun intervento retroattivo sulle anagrafiche private.

## v1.48 — Martlet

Aggiunto `martlet-mkii.webp` da `f4f-4_martlet_mk4.png`, PNG originale dell'utente 512×256, ottimizzato per la miniatura WebP a 256×128, preservando proporzioni, sfondo trasparente e orientamento. La voce **MARTLET MK.II** punta alla miniatura **Martlet Mk.IV** (`match: variant`), senza presentarla come corrispondenza storica esatta. Alias compatibili con denominazioni alternative. Asset locale in `assets/allies/aircraft/`, riutilizzo soggetto ai diritti Gaijin da verificare.

## v1.49 — Skua, Barracuda, Gladiator terrestre e Sea Gladiator
- `skua.webp` e `barracuda.webp`: ricostruzioni digitali approvate dall'utente, ottimizzate in WebP a 256×128; non sono fotografie né fonti storiche.
- `gladiator-mkii.webp` (terrestre) da `gladiator_mk2.png` nello ZIP originario; `sea-gladiator-mkii.webp` (navale) conserva i byte dell'asset prima assegnato impropriamente a Gladiator terrestre, da `gladiator_mk2_navy.png`.
- **SEA GLADIATOR MK.II**: tipo F, anno 1939, ritiro 1944 (ultimo impiego non operativo), base IMBARCABILE; punti ereditati dal Gladiator terrestre alla sincronizzazione, altrimenti 6. Separato da **GLADIATOR MK.II**, terrestre.
- Fonti per l'anno: [Aeroflight, Sea Gladiators imbarcati marzo 1939](https://www.aeroflight.co.uk/aircraft/types/type-details/gloster-gladiator) e [Fleet Air Arm aircraft service, fine attività secondarie nel 1944](https://www.wings-aviation.ch/32-FAA/2-Aircraft/Gloster-Gladiator/Fighter.htm).
- `aircraftKey` gestisce anche denominazioni estese per i modelli Halifax e Beaufort, con distinzione esplicita dal Beaufighter.

## v1.50 — CANT Z.506 Airone

- `assets/axis/aircraft/z506.webp` è la conversione WebP della revisione **CANT_Z506_Airone_corretto.png** approvata in chat; 320×160 pixel, canale alfa, nessuna deformazione delle proporzioni. È un'illustrazione generata, non una fotografia di velivolo reale.
- La voce `Z506` usa `match: illustration` e non dipende da Cybermodeler né da War Thunder.
- Alias espliciti coprono `CANT Z506`, `CANT Z506B`, `CANT Z.506 Airone`, `Z.506 Airone`, `CRDA CANT Z506` e `Airone`; la voce Z.1007 resta separata.
- Il catalogo Axis ora dispone di immagini per tutte le 20 voci originali, comprese le due che condividono una miniatura di variante. Nessun valore di gioco o registro privato è stato modificato.
