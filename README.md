# Campagna W@S Mediterraneo — v1.63 (Nhost)

Campagna navale 1940–1943 per due fazioni: Axis (Regia Marina) e Allies (Royal Navy).
Frontend statico GitHub Pages; dati PostgreSQL, autenticazione Nhost e API Hasura GraphQL.
Nessun Google Apps Script attivo e nessun servizio a pagamento richiesto da questo rilascio.

## Funzioni
- Login, logout, tema e favicon dinamico per fazione.
- Porto e cataloghi privati: assegnazioni, compilazione casuale, modifica delle unità.
- Estrazione riproducibile da seme, esiti, doppia conclusione e rapporti post-battaglia.
- Storico, punteggi, avanzamento con conferma di entrambi, salvataggi nominati e automatici.
- Ripristino e reset con doppia approvazione e backup preventivo; punteggio iniziale di scenario.
- WebSocket sullo stato condiviso, polling di riserva, protezione dei campi attivi.

## Struttura del repository
Vedere [docs/REPOSITORY.md](docs/REPOSITORY.md) per la divisione common/axis/allies, l’ordine dei fogli di stile e l’inventario. Avvio da index.html, senza build.

## Novità v1.63
- Nuovo banner Allies approvato: mare più realistico, Swordfish più visibili con contrassegni britannici e incrociatore Town a due fumaioli. Fondale adattato senza deformare le unità, stemma integrato centrato, formato 1916 × 821 e targa originale conservati.
- Banner v1.62 e precedenti conservati. Nessuna modifica a Nhost o alla testata Axis.

## Novità v1.62
- Corretto il residuo della corona Axis sul bordo superiore della testata Allies: ricostruito localmente il bordo con un tratto pulito della cornice originale.
- Stemma Royal Navy sempre centrato, abbassato di 15 pixel nel riferimento 1916 × 821 per evitare il contatto con il bordo. Banner, navi, aerei e testata Axis invariati.

## Novità v1.61
- Testata Allies con dimensioni 1916 × 821, identiche ad Axis, e stemma centrato sull’asse x=958.
- Fondale panoramico ricomposto dall’immagine approvata con ridimensionamento uniforme, traslazione e prolungamento laterale del cielo e del mare; navi e aerei non rigenerati. Stemma ridimensionato per non coprire le unità. Targa, cornice e bandiere riportate alla geometria Axis. Immagine v1.60 conservata.
- Nessuna modifica ai dati Nhost o alla logica della campagna.

## Novità v1.60
- Nuovo banner Allies approvato (WebP ad alta qualità, proporzioni originali), stemma Royal Navy spostato nel cielo libero a sinistra della corazzata e targa abbassata sul mare. Cornice, titolo e bandiere conservati; rimosso il precedente livello dei siluri, già presenti nel nuovo disegno.
- Banner precedente e relativo livello siluri archiviati in `assets/allies/header/old-banner/`.
- Nessuna modifica alla logica della campagna, ai dati Nhost o alla grafica Axis.

## Novità v1.59
- Stato del naviglio: proposta 3, fascia compatta con sigle e conteggi su due livelli, separatori sottili, senza miniature per tipologia. Restano le quattro icone di stato, i totali e le categorie, incluso BC.
- Disposizione adattiva: sette colonne quando lo spazio lo consente, altrimenti due o più righe ordinate. Nessuna modifica ai conteggi, alle regole o a Nhost.

## Novità v1.58
- Stato del naviglio: dettaglio per tipologia sotto i quattro totali esistenti, con micro-badge e sagome di riferimento dei cataloghi Axis/Allies. Incluse tutte le categorie, BC e eventuali tipi aggiuntivi; valori nulli attenuati.
- Conteggi derivati dagli stessi scafi univoci già classificati dal riepilogo; nessun doppio conteggio degli ammodernamenti, nessun intervento sul database.
- Riquadro responsivo, con due o tre colonne di badge in base allo spazio disponibile; totali originali e controlli di sessione preservati.

## Novità v1.57
- Corretto il blocco di accesso causato da URL JavaScript diversi per il modulo di autenticazione tra interfaccia e API. I due moduli ora condividono la stessa sessione.
- Aggiunto controllo di regressione sul riferimento unico al modulo di autenticazione; nessun cambiamento alle credenziali, ai permessi o ai dati Nhost.
- Conservate tutte le miniature e le anteprime di Battaglia e Storico introdotte nella v1.56.

## Novità v1.56
- **Battaglia / Forza in mare**: miniature delle navi e degli aerei realmente estratti, nelle squadre della prima ondata e dei rinforzi. Il profilo viene risolto dal catalogo privato della fazione e riutilizza le immagini già presenti nel Porto.
- **Rapporto post-battaglia e Storico**: le miniature sono visibili per entrambe le flotte **solo dopo la conclusione di entrambe le fazioni**, esclusivamente con i dati pubblicati nel rapporto. Restano invariati i permessi Hasura e il divieto di leggere formazioni nemiche in anticipo.
- **Interazione**: miniature opache su fondo scuro, ingrandimento con mouse o clic/tocco, chiusura toccando altrove o con Esc. Se un profilo manca o la fonte fallisce, il nome resta leggibile senza immagini inventate.
- Nessuna modifica a estrazione, danni, punteggi, dati Nhost o logica di gioco. Esteso il test di regressione di Porto/Battaglia e corretto un controllo immagine con parametro cache obsoleto.

## Novità v1.55
- Corretto l'errore di sintassi JavaScript introdotto nella v1.54 che impediva l'inizializzazione dell'app e il funzionamento del pulsante Accedi.
- Aggiornato il versionamento delle risorse JavaScript a v1.55, evitando che il browser riutilizzi la precedente copia difettosa in cache.
- Conservate le semplificazioni dell'interfaccia della v1.54 e la sincronizzazione Nhost, senza alterare dati, autorizzazioni e regole di gioco.

## Novità v1.54
- Nelle testate Axis e Allies «Aggiorna dati» è stato rinominato «Ricarica», mantenendo la ricarica manuale da Nhost come funzione di riserva.
- Rimosso il pulsante «Aggiorna dati» duplicato nella sezione Battaglia; quando il rapporto è in elaborazione, il testo indica il controllo automatico degli aggiornamenti.
- Sincronizzazione WebSocket, polling HTTP di riserva, dati privati e regole della campagna invariati. Nessuna migrazione Nhost.

## Novità v1.53
- Corretto il contrasto delle miniature **navali** nel Porto: i profili bianchi o azzurro chiarissimo erano quasi invisibili sul fondo grigio della v1.52.
- Sfondo blu notte e contrasto maggiore per le sagome; larghezza anteprima nella casella da 46 a 64 px (52 px su schermi piccoli), ingrandimento da 260×136 a 360×176 px.
- Altezza delle miniature, spaziatura tra le caselle e tra le squadre, colonne del Porto e salvataggi Nhost invariati. Il selettore delle unità si adatta alla maggiore larghezza della miniatura.
- Segnalazione visiva assente solo dove il catalogo non dispone di un profilo storico o la sorgente remota fallisce; non viene sostituita da una sagoma inventata.

## Novità v1.52
- Corretto il difetto visivo della v1.51: rimosse le miniature semitrasparenti dietro al testo e ai menu, che rendevano irriconoscibili sagome e aerei.
- Ogni casella occupata con un profilo disponibile mostra una **miniatura opaca e nitida** in una piccola area distinta dalla selezione; passando il mouse, usando il focus da tastiera oppure toccandola compare un'anteprima ampliata (senza spostare le caselle).
- Clic o tocco sull'anteprima per aprire/chiudere, clic altrove o Esc per chiudere; nessuna miniatura sulle caselle libere, nessun segnaposto generico.
- Griglia del Porto, margini, distanze fra squadre e altezza delle righe invariati. Solo il menu di selezione diventa leggermente più stretto per ospitare la miniatura. Nessuna modifica ai dati Nhost o alle regole di gioco.

## Novità v1.51
- Nel Porto le caselle occupate mostrano una sagoma navale o una miniatura aerea tratta dai rispettivi cataloghi Axis/Allies. Vengono riutilizzati i profili esistenti: locali con priorità, Navypedia come riserva per le navi, soltanto miniature locali per gli aerei.
- Immagini decorative a bassa opacità e posizionamento assoluto, dietro nomi e controlli, senza alterare spaziatura, larghezza, altezza, margini, gap o colonne delle squadre. L'errore di caricamento rimuove l'immagine senza lasciare elementi rotti.
- Invariate selezione, modifiche e salvataggi Nhost; non cambiano le assegnazioni, le navi, gli aerei o le regole della campagna. Test aggiunti in `tests/check-port-visual.mjs`.

## Novità v1.50
- Completata la copertura grafica dell'**Asse: 20/20 modelli** con la miniatura sintetica approvata del **CANT Z.506 Airone**, in WebP trasparente 320×160 ottimizzato, nella cartella `assets/axis/aircraft/z506.webp`.
- Aggiunto il collegamento `Z506` nel registro Axis e alias per `CANT Z.506 "AIRONE"`, `CANT Z506B`, `CRDA CANT Z.506`, `Z.506 Airone`, `Airone`; espressamente distinta la famiglia Z.1007. Conservata la scelta manuale `profileKey`.
- Verifica di integrità del WebP e test di associazione senza interventi su Nhost, valori o cronologia della campagna. L'immagine è una ricostruzione digitale approvata, non fotografia storica.

## Novità v1.49
- Completata la copertura dei 19 aerei Allies originari con le due illustrazioni approvate **Blackburn Skua** e **Fairey Barracuda** (illustrazioni generate, ottimizzate in WebP trasparente 256×128, formato 2:1 per il catalogo).
- Separate le due miniature **Gloster Gladiator Mk.II terrestre** e **Sea Gladiator Mk.II navale**, entrambe recuperate dallo ZIP Royal Air Force dell'utente. L'immagine navale già usata in precedenza è conservata senza ricompressione con nuovo percorso; quella terrestre usa il PNG precedentemente non importato.
- Aggiunta la nuova unità **SEA GLADIATOR MK.II** al repertorio e al meccanismo di sincronizzazione Allies: entrata 1939, ritiro 1944 (fine impiego secondario), tipo F, base IMBARCABILE, punti ereditati dal Gladiator terrestre. La sincronizzazione avviene solo in fase modificabile, senza duplicati né alterazione del catalogo Axis.
- Ulteriori alias per rinomine, inclusi Skua, Barracuda, Gloster/Sea Gladiator, Handley Page Halifax e Bristol Beaufort. Nessuna migrazione Nhost.
- Il caricamento effettivo del nuovo velivolo nel database privato si completa alla prossima sessione Allies in fase modificabile, non al commit GitHub.

## Novità v1.48
- Aggiunta la miniatura Martlet fornita dall'utente (`f4f-4_martlet_mk4.png`), ottimizzata in WebP locale trasparente a 256×128 dal PNG originale 512×256 nella cartella `assets/allies/aircraft/`, senza alterare le immagini esistenti.
- Associata alla voce **MARTLET MK.II**. La miniatura riproduce il **Martlet Mk.IV**, variante storicamente diversa: nell'app la distinzione resta esplicita. Alias inclusi per rinomine comuni F4F-4 Martlet/Grumman Martlet.
- Copertura dei 19 modelli Allies originari: **17/19**; restano senza immagine soltanto Blackburn Skua e Fairey Barracuda. Il motore, Axis, i dati Nhost e i salvataggi non vengono modificati.

## Novità v1.47
- Importate due nuove immagini Sea fornite dall'utente: Sea Hurricane Mk.IB e Seafire Mk.III in formato WebP trasparente 512×256, nella cartella allies/aircraft. Il Seafire Mk.IB già a catalogo usa la miniatura Mk.III, dichiarata come variante di riferimento; nessuna modifica delle date dei velivoli.
- Corretto il resolver: nome normalizzato, alias controllati, varianti esplicite e campo `profileKey` persistente per nomi personalizzati. Scelta `Profilo immagine` nel form Aerei, con opzione Auto o selezione manuale; il cambio di nome non perde più l'immagine riconoscibile e una variante corretta prevale sul fallback generico.
- Bloccata la reinserzione automatica di Sea Hurricane o Seafire se la loro denominazione è cambiata (anche in Mk.III), mantenendo Nhost come unica fonte dello stato privato. Nessuna migrazione, nessuna modifica automatica a Porto o risultati.
- Controlli su associazioni Axis/Allies, caricamento file e compatibilità con le voci preesistenti; le immagini Gaijin restano soggette a diritti da verificare.

## Novità v1.46
- Aggiunte le configurazioni storiche Sea Hurricane Mk.IB (1941–1944) e Seafire Mk.IB (1942–1944) nel registro navale Allies, tipo F, base IMBARCABILE, punteggio ereditato dai modelli terresti corrispondenti (6 nel catalogo iniziale).
- Sincronizzazione *idempotente* con la mutazione protetta Nhost al prossimo accesso Allies quando la campagna è modificabile. Nessuna scrittura in caso di battaglia già avviata, nessuna sovrascrittura dei modelli esistenti e nessun cambiamento a Porto, perdite, navi, storico o Axis. Il rilascio su GitHub non certifica l'avvenuto inserimento nello stato privato Nhost.
- Miniature temporanee riutilizzate da Hurricane Mk.IIB e Spitfire Mk.Vb, dichiarate come immagini di varianti non navali. Nessun file duplicato; vedi docs/AIRCRAFT.md.
- 1944 è oltre la fine della campagna (1943): entrambi i tipi rimangono disponibili sino alla fine.

## Novità v1.45
- Importate 16 miniature Allies WebP (512×256, trasparenza e orientamento originali) dai PNG forniti dall'utente; una per file in assets/allies/aircraft. Copertura Allies 16/19: mancanti Skua, Barracuda e Martlet Mk.II.
- Aggiunto il Ba.65 Axis fornito in chat: Axis 19/20, manca soltanto CANT Z.506. Le altre immagini e regole Axis rimangono invariate.
- Varianti dichiarate correttamente: Gladiator Mk II navale, Spitfire Mk Vb e Sunderland Mk V (modello posteriore alla campagna). Due immagini alternative dello ZIP non importate per evitare duplicati.
- Versioni Sea di Hurricane e Spitfire rinviate alla consegna dei relativi file. Nhost, dati di gioco, bilanciamento, punteggi e salvataggi invariati. Copyright delle immagini Gaijin non verificato indipendentemente.

## Novità v1.44
- Bf 109G Gustav e Re.2001 OR riutilizzano rispettivamente le miniature Bf 109G-14/AS e Re.2001 CB, come concordato; niente duplicati e varianti dichiarate.
- Axis: 18/20 modelli coperti da 16 WebP. Ba.65 e Z.506 non presenti nello ZIP fornito; rimangono da reperire. Database e Allies invariati.

## Novità v1.43
- Importate 16 miniature Axis fornite dal giocatore, convertite da PNG a WebP senza modificare dimensioni (512 × 256), orientamento o trasparenza. File locali in assets/axis/aircraft/, attribuzione e fonte nei registri.
- I quattro modelli Axis non forniti (Ba.65 M, Bf 109G, Re.2001 OR, CANT Z.506) mantengono i riferimenti già presenti. Le varianti di riferimento restano esplicitamente indicate. Allies invariato.
- Diritti di ripubblicazione delle miniature War Thunder non verificati indipendentemente. Nessuna modifica al database o alle regole.

## Novità v1.42
- Catalogo Aerei: layout comune per miniature locali a colori, stessa dimensione e visualizzazione responsive; riferimenti pubblici a War Thunder e nota esplicita per le varianti diverse.
- 39 associazioni storiche, 36 schede reperite e 3 da integrare. I riferimenti non costituiscono il catalogo attivo Nhost.
- Predisposte le cartelle assets/axis/aircraft e assets/allies/aircraft; registri separati, caricamento esclusivamente locale di immagini autorizzate. Nessuna miniatura originale Gaijin è stata redistribuita: download non riuscito e diritto di riuso da verificare. Il catalogo visualizza i collegamenti e non tenta il caricamento esterno.
- Nessuna modifica a punteggi, nave/aereo, motore di battaglia o database. Vedere docs/AIRCRAFT.md.
 
## Novità v1.41
- Riordinati asset e moduli per common, axis e allies; testate e registri delle sagome separati. Motore e API Nhost unici.
- Rimossi dal ramo corrente 53 asset obsoleti/sostituiti e 2 file di codice/stile non caricati. File originali recuperabili dalla cronologia Git.
- Conservati senza ricompressione tutti gli asset attivi; favicon originali 64×64 estratti dai data URI. Verificati percorsi e mappa dei profili, stessa cascata CSS salvo vecchia galleria non utilizzata.
- Nessuna migrazione Nhost né modifica a regole, cataloghi privati, salvataggi e punteggi.

## Novità v1.40
- Aggiunto il profilo locale della portaerei statunitense USS Wasp (CV-7) dalla tavola originale fornita: WebP trasparente, azzurro chiaro, 528 × 152, 2 px/m e lunghezza fuori tutto 225,9 m (NHHC, DANFS). Nessuna modifica a unità, punti o campagna.

## Novità v1.39
- Gestione campagna: distinta la campagna attiva salvata su Nhost da Crea punto di ripristino, Archivio punti di ripristino e Backup automatici. Data e ora dell’ultima modifica della propria fazione e revisione; ogni copia mostra data di creazione e stagione.
- Nuovi salvataggi manuali riconoscibili dal prefisso riservato [Manuale] (nascosto nell’interfaccia, conservato nelle rinomine). Backup riconoscibili solo per etichetta, non per metadati certificati; vecchi archivi di origine indeterminata restano accessibili e non vengono modificati.
- Nessuna scrittura aggiuntiva al cambio turno, per evitare duplicazioni tra le fazioni. Le funzioni SQL private di creazione automatica dei backup non sono disponibili nel repository: verifica della frequenza effettiva e relativo intervento server ancora da eseguire.
- Nessuna migrazione Nhost, nessuna modifica a dati, regole o salvataggi esistenti.

## Novità v1.38
- Dopo l’annullamento dell’ultima versione futura, il Naviglio chiude il ramo e mostra una sola riga. Un suffisso (I) isolato viene nascosto nel Naviglio e nel Porto, senza rinominare le chiavi storiche nel database. Il ramo non può essere espanso con una sola configurazione. Elimina nave è distinto da Rimuovi ammodernamento e richiede di digitare il nome dello scafo. Nessun dato della campagna ripristinato o modificato dal rilascio.

## Novità v1.37
- Naviglio: pulsante Rimuovi sulle configurazioni future espanse. Si annulla prima l’ultima versione programmata, senza eliminare lo scafo; se il ritiro precedente coincide con l’ingresso della versione cancellata, viene ripristinata la scadenza finale ereditata. Sono protette le configurazioni già entrate in servizio o referenziate. Salvataggio tramite mutazione Nhost esistente, nessuna migrazione SQL.

## Novità v1.36
- Naviglio Axis/Allies: un solo scafo per riga; versioni espandibili, attuale/passata/futura/annullata. Filtri e conteggi per scafo.
- Ammodernamento programmabile (II/III) in un anno successivo entro il 1943, stessi record JSON legacy, ritiro precedente e date non sovrapposte. Le versioni esistenti non vengono migrate.
- Disponibilità della configurazione più recente; perdite e riparazioni valgono per lo scafo; dopo una perdita si mostra la versione del turno di perdita.
- Al caricamento, il client tenta la sostituzione nella stessa casella del Porto, solo se tuttora presente, compatibile e operativa, usando campaign_save_logistics con revisione. Rifiuti e incompatibilità non forzati; finché una sostituzione operativa resta pendente, non si genera una nuova formazione. Non recupera caselle già svuotate dal server.
- Registro per profili specifici per configurazione; nessun disegno inventato. Storici non riscritti. SQL privato non incluso: collaudo reale Nhost ancora necessario.

## Novità v1.35
- Importate le 16 tavole di `royal navy 2.zip`, normalizzate in WebP trasparente 528 × 152, tinta #D8EAF2 e scala nominale 2 px/m. Lunghezze indicative per classe (Navypedia e repertori navali).
- Classe Queen Elizabeth: quattro profili distinti, selezione per nome dello scafo; Valiant usa Queen Elizabeth come richiesto, Warspite, Malaya e Barham i rispettivi profili. Classe storica invariata.
- Nuovi profili D/E/F/G/H, V/W (W selezionata per gli scafi W), Le Fantasque, Vasilefs Georgios e sommergibili Glafkos, U, T. Profili Axis, testate e dati Nhost invariati.

## Novità v1.34
- Sostituite esclusivamente le due bandiere laterali Allies con la terza variante pittorica scelta dal giocatore, ottimizzata in WebP trasparente. Posizione, simmetria, resto della testata e logica invariati.

## Novità v1.33
- Aggiunto un siluro sotto ciascuno dei due Swordfish nella testata Allies, mediante un livello WebP trasparente separato. Sfondo, aerei originali, navi, stemma, nodo, bandiere e layout invariati.

## Novità v1.32
- Nuovo sfondo illustrato Allies: corazzata in primo piano più piccola e spostata verso destra, centro libero per lo stemma, scorta e biplani mantenuti nella composizione. Il precedente sfondo resta archiviato.
- Ritaglio del nodo dorato ristretto alla corda e al contorno inferiore, senza la superficie scura eccedente. Bandiere, cornice, testata Axis, logica e layout responsive invariati.

## Novità v1.31
- Testata Allies: White Ensign ondulate con asta, ombreggiatura e bandiera destra specchiata, nelle stesse proporzioni della Regia Marina. La bandiera rettangolare dei cataloghi resta invariata.
- Ripristinato integralmente il nodo dorato originale: livello SVG separato dopo la copertura del titolo, con ritaglio esteso sopra e sotto. Nessuna modifica alle testate Axis, ai pannelli, ai dati e al layout responsive v1.30.

## Novità v1.30
- Base grafica unica Axis/Allies: riepilogo naviglio, stati, menu, Porto, Battaglia, cataloghi, Storico, rapporti, Gestione e Regole condividono lo stile Axis. Testate, stemmi, bandiere e profili storici restano distinti.
- Layout responsive: griglia Porto a 4/3/2/1 colonne, schede catalogo con ordinamento e azioni sotto 960 px, rapporti impilati sotto 1000 px, menu e riepiloghi adattivi, input touch da 16 px, aree sicure iOS e finestre adattive. Tabelle storiche ampie scorrono nel proprio contenitore.
- Solo frontend: Nhost, autentificazione, logica turni, punteggi e dati invariati. Il vecchio royal.css resta in archivio e non viene più caricato.

## Novità v1.29
- Profilo Orsa (Pegaso): contrasto tonale e riempimento dello scafo corretti sulla tavola esistente; canvas 528 × 152, scala 2 px/m, lunghezza 89,3 m e allineamento invariati. Nessun altro profilo o dato di gioco modificato.

## Novità v1.28
- 38 profili Axis (comprese le due serie Soldati e le classi francesi e tedesche già mappate) rielaborati dalle tavole PNG dettagliate del pacchetto v1.14 e dai GIF originali di Bolzano e Acciaio. Non dalle sagome SVG semplificate. Tutti i WebP sono lossless, con tinta #D8EAF2 e trasparenza tonale, senza nuove ricostruzioni.
- Stesso canvas 528 × 152 e scala nominale 2 px/m della Royal Navy: proporzioni, dettagli del disegno e allineamento alla base conservati. Le immagini Royal Navy v1.27 sono invariate. La scala visualizzata è indicativa; non costituisce una tavola costruttiva.
- Vecchi SVG conservati come archivio; mappatura storica, lunghezze nominali, testata, regole, punteggi e Nhost invariati. Le classi non comprese nel repertorio conservano il comportamento precedente.

## Novità v1.27
- 27 profili locali Royal Navy / Commonwealth per BB, BC, CV, CA, CL e DD, derivati dai GIF dello ZIP «royal navy.zip» consegnato dal giocatore. WebP lossless trasparenti, colore #D8EAF2, contorni e proporzioni originali preservati; nessuna ricostruzione. Refuso artehusa corretto in arethusa. J e K hanno lo stesso disegno nel lotto originale.
- Mappatura sulle classi storiche già presenti nel catalogo, incluse Town (Southampton, Gloucester, Edinburgh), C (Carlisle, Ceres), County (Kent), Crown Colony (Fiji) e Leander (Perth), con indicazione della lunghezza nominale di classe e scala orizzontale indicativa comune. Il profilo non rappresenta necessariamente il refit preciso di ciascuna nave.
- Nessuna sostituzione artificiale per Queen Elizabeth, Crown Colony (Ceylon), Wasp, sommergibili e altre classi non incluse: resta il comportamento precedente (fonte Navypedia dove disponibile). Le 27 immagini non comprendono nuove tavole per queste classi.
- Testata, bandiere, sagome Axis, punteggi, motore di battaglia, dati e Nhost invariati.

## Novità v1.26
- Testata Royal Navy speculare al formato originale Axis (1916 × 821, anche su mobile): riusi della cornice, targa, ornamenti e scritta Campagna W@S originali Axis; titolo Royal Navy riprodotto in serif metallico equivalente, poiché il font Axis è incorporato nel raster. Ricomposizione dello sfondo fornito per mostrare la corazzata in primo piano sopra il titolo; aerei originali ritagliati dal dipinto, senza ridisegnarli.
- Riepilogo Allies usa lo stesso markup Axis: cinque riquadri, quattro icone del naviglio, identiche proporzioni e colori, stessi breakpoint. Titoli e punteggi restano relativi alla propria fazione.
- Bandiera USA fornita dal giocatore, salvata localmente: Wasp e unità USA riconosciute tramite nazionalità, prefissi o denominazioni americane; B-25J, B-24 e PBY-5 nel catalogo originale. Le denominazioni britanniche o attribuzioni esplicite a servizi alleati diversi conservano l'insegna appropriata. La bandiera allegata è a 50 stelle, utilizzata come richiesto.
- Axis, salvataggi, Nhost, motore e regole di gioco invariati.

## Novità v1.25
- Testata Allies ripresa dalla struttura Axis: cornice dorata, stemma della Royal Navy al centro, scena navale e targa inferiore blu/oro, titolo Quadro Comando Royal Navy, White Ensign ai due lati. Asset locali forniti dal giocatore, convertiti in WebP; lo sfondo è adattato al formato della testata senza deformazione. Nessuna ricostruzione generativa dell'immagine.
- Menu Royal Navy con le sette icone B originali già approvate per Axis.
- Cataloghi Allies: White Ensign per Regno Unito, Canada, Australia e Nuova Zelanda; bandiera Francia Libera per le unità francesi riconosciute. Le unità USA e Grecia mantengono i distintivi precedenti. Per i velivoli di origine americana in servizio britannico resta il White Ensign. La Francia è identificata da nazionalità esplicita, sigle di servizio o denominazioni francesi riconosciute; non si inferisce una nazionalità diversa per gli altri modelli.
- Testata Axis, dati della campagna, motore, icone di stato e Nhost invariati.

## Novità v1.24
- Sostituite le sette icone del menu Regia Marina v1.23 con ritagli delle sagome dell'immagine B approvata dal giocatore (barra_di_navigazione_navale_dorata_e_blu.png, 1916 × 821). Nessun ridisegno: rimozione dello sfondo mediante maschere alfa PNG e mantenimento delle proporzioni originali. Il colore si adatta al pulsante attivo e al tema.
- Icone navali di stato, profili, menu Royal Navy, dati e motore invariati.

## Novità v1.23
- Menu Regia Marina: alternativa B approvata, sette icone SVG piene e monocromatiche (ancora, spade incrociate, corazzata, aereo, archivio, ingranaggio e documento). Ridisegno vettoriale dell'anteprima; colore del testo ereditato automaticamente, scuro sulla scheda dorata attiva.
- Dimensioni, allineamento e spaziature coerenti, media query per schermi compatti; ordine e comportamento delle schede invariati.
- Menu Royal Navy e tutte le icone di stato, profili, dati, regole e Nhost invariati.

## Novità v1.22
- Naviglio e Aerei: filtri in alto, contatore dinamico delle righe visibili sul totale del catalogo privato, aggiornato anche con la ricerca, inclusi i risultati vuoti. I comandi Aggiungi nave/Aggiungi aereo sono in fondo al catalogo.
- Stato connessione Nhost, revisione, modalità di sincronizzazione e nota sulla privacy sono ora visibili esclusivamente nella sezione Gestione campagna. La sincronizzazione automatica, le notifiche di errore e i salvataggi rimangono invariati.
- Entrambe le fazioni; nessuna modifica ai dati, al motore, alle icone o alle regole di gioco.

## Novità v1.21
- Icona blu In costruzione rielaborata in stile simile al cantiere dell'icona In riparazione: scafo di corazzata sullo scalo, gru, sovrastruttura parziale e intelaiature ancora aperte. Le altre icone navali sono intatte.
- Catalogo Aerei di entrambe le fazioni: colonne Ritiro e Stato, ordinabili, con indicatore verde Operativo, rosso Obsoleto e blu In costruzione. Filtro Stato combinabile con Base e ricerca.
- Il criterio temporale è quello già utilizzato nelle regole del gioco: anno d'ingresso futuro = In costruzione; raggiunto l'anno di ritiro = Obsoleto; altrimenti Operativo. Nessuna obsolescenza inventata per le unità prive di anno ritiro.
- Nessuna modifica ai cataloghi privati, a Nhost, alla disponibilità effettiva o alle battaglie.

## Novità v1.20
- Nuovo stato automatico **In costruzione** (anno di entrata in servizio maggiore dell'anno del turno corrente); icona A blu, scafo su scalo di varo, identica alla proposta approvata. Le icone Operativa, In riparazione e Persa restano quelle originali.
- Catalogo Naviglio di entrambe le fazioni: filtro Stato combinabile con Tipo Nave e ricerca; ordinamento Stato per etichetta. Le versioni ritirate sono riconoscibili come Ritirata (solo catalogo, senza nuova icona), per non confonderle con le operative.
- Riepilogo: quattro stati, conteggio per scafo mediante la stessa funzione shipBase esistente. Gli ammodernamenti futuri non incrementano il totale costruzioni se una versione dello scafo è già entrata in servizio. Le perdite definitive prevalgono, le riparazioni e le disponibilità mantengono le regole precedenti.
- Stato calcolato solo nel frontend, aggiornato al cambio di turno. Nessuna modifica ai dati, ai punti, alla logica di disponibilità del porto, al motore o a Nhost.

## Novità v1.19
- Ripristinata la poppa del profilo locale Acciaio: tratto affusolato continuo e non più coincidente con la linea di galleggiamento. Correzione manuale del contorno in riferimento alla tavola del giocatore (Acciaio 1942); non è una nuova scansione o una ricostruzione integrale.
- Lunghezza fuori tutto 60,2 m, scala comune, colore #D8EAF2 e sfondo trasparente conservati; centro geometrico a 120 m. Nessun altro profilo navale, dato, regola di gioco o schema Nhost modificato.

## Novità v1.18
- Sostituiti esclusivamente i profili locali dei sommergibili tedeschi: Tipo VIIB (prima immagine fornita) e Tipo VIIC (seconda immagine fornita).
- Contorni vettoriali ricavati direttamente dalle immagini, senza ricostruzione generativa. Fondo trasparente, colore uniforme #D8EAF2, dettagli sottili semplificati e scala comune mantenuta (66,5 m e 67,1 m, rispettivamente).
- Nessuna modifica agli altri profili, alla nazionalità, alle regole di gioco o al database Nhost.

## Novità v1.17
- Naviglio: classe Soldati I (12 unità) e Soldati II (7 unità), secondo la distinzione già presente nei profili locali. Ordinamento, ricerca e profili coerenti; gruppo di gioco invariato.
- Bandiere storiche nelle righe di Naviglio e Aerei Axis: tricolore sabaudo coronato e insegna di guerra tedesca 1938–1945, utilizzate come indicatori storici di nazionalità in un gioco ambientato nel 1940–1943. La classificazione della nazionalità già adottata rimane invariata.
- I file WebP caricati sono stati individuati ma non erano estraibili dalla libreria: si utilizzano i corrispondenti SVG originali pubblici di Wikimedia Commons, con fallback grafico precedente in caso di rete non disponibile. Fonti: [Regno d’Italia, F l a n k e r](https://commons.wikimedia.org/wiki/File:Flag_of_Italy_(1861-1946)_crowned.svg), [insegna di guerra tedesca](https://commons.wikimedia.org/wiki/File:War_ensign_of_Germany_(1938%E2%80%931945).svg); licenze e attribuzioni nelle pagine dei file.
- Quadro comando di entrambe le fazioni: etichetta Turno, valore n di 10, stagione in un riquadro separato.
- Nessuna modifica alle sagome approvate v1.16, alle regole, ai punti o a Nhost.

## Novità v1.16
- Test A approvato: torri e canne principali ripristinate su 14 profili locali BB, CA e CL, per 54 postazioni di torre tracciate dalle tavole fornite; stile semplice, senza contorno decorativo.
- Scala reciproca e colore invariati. Profili BC e altre classi senza tavole locali restano invariati. Le canne sono leggermente stilizzate per la leggibilità nel catalogo.
- Nessuna modifica Nhost, ai dati della campagna o al motore di gioco.

## Novità v1.15
- Integrate le due nuove tavole originali del giocatore: Bolzano (196,9 m) e Acciaio (60,2 m, arrotondato da 60,18 m). La tavola corretta di Bolzano sostituisce il precedente riferimento remoto; Acciaio e le altre unità della classe hanno ora il proprio profilo locale.
- 38 profili locali SVG per 37 classi; identico colore, viewport comune di 240 m, sfondo trasparente e stilizzazione della v1.14.
- Riferimenti dimensionali: https://www.marina.difesa.it/noi-siamo-la-marina/pilastro-operativo/mezzi/mezzi-storici/Pagine/ABCD/bolzano.aspx ; https://en.wikipedia.org/wiki/Acciaio-class_submarine .
- Nessuna modifica al database o al motore.

## Novità v1.14
- 36 silhouette locali SVG, 35 classi (due serie Soldati), dalle tavole consegnate dal giocatore. Versione grafica V2: colore uniforme #D8EAF2, fondo trasparente, dettagli minuti e cavi ridotti, contorni semplificati; Pegaso ottenuto seguendo lo scafo della tavola non ombreggiata.
- Scala grafica comune: lunghezze fuori tutto indicative, 240 m per viewport, senza normalizzazione individuale a tutta larghezza. I dati del repertorio non determinano i punti o le regole di gioco.
- Bolzano escluso perché la tavola locale coincide con Zara; per le classi non coperte resta il precedente repertorio remoto, esplicitamente non in scala. Profili di classe, non ricostruzioni delle singole configurazioni per ogni turno.
- Riferimenti dimensionali: https://regiamarina.net/vessels-specifications-by-class/ ; https://www.italiansubmarines.com/classes/ ; https://naval-encyclopedia.com/ww2/italy/italian-destroyers-of-ww2.php .
- Nessuna modifica Nhost, ai cataloghi privati, ai punteggi o al motore di gioco.

## Novità v1.13
- Rimosse integralmente dal frontend le sagome vettoriali della v1.12 e i riferimenti alle tavole non approvate. Repertorio esclusivamente Navypedia: 65 associazioni (51 classi con almeno un profilo associato), con didascalia originale nave/anno e link alla scheda. Se manca un profilo della variante corretta, non viene sostituito con uno fittizio.
- Fonti esclusive: https://www.navypedia.org/ships/italy/it_index.htm, https://www.navypedia.org/ships/uk/uk_index.htm, https://www.navypedia.org/ships_index.htm. Link immagine estratti da Standard scale images; il sito sorgente mantiene il controllo dei file, non redistribuiti nel repository. I file non sono stati scaricabili nell'ambiente di sviluppo; disponibilità effettiva del singolo GIF/JPG e uso inline da verificare nel browser. Se fallisce il caricamento, appare un link alla scheda, senza icona rotta.
- Le sagome indicate sono riferimenti reali di classe o sottogruppo e non una certificazione dell'allestimento di ogni singola nave nel turno corrente. Sono inclusi, se indicati, disegni 1937/1939 e progetti non completati. I riferimenti specifici per varianti hanno precedenza.
- Classi ancora non documentate o schede non accessibili rimangono prive di immagine. Nessun dato privato o modifica Nhost. Le richieste delle immagini esterne non includono referrer o credenziali.
- Nessuna modifica a testata, bandiere, icone NP5/AE1 e regole di gioco.

## Novità v1.12 (superata dalla v1.13; sagome ritirate)
- Primo repertorio di profili laterali: 35 sagome SVG semplificate ricavate manualmente da tavole di riconoscimento navale statunitensi del 1943, con associazione a 43 classi storiche e ai relativi gruppi. Fonte per ogni profilo visibile nel catalogo; le immagini originali non vengono ripubblicate e l'app non carica risorse remote per il nuovo repertorio.
- La sagoma documenta il profilo della classe/gruppo, non l'allestimento esatto di ogni nave nel singolo turno. Non sono disegni costruttivi né sagome in scala reciproca. Le varianti Queen Elizabeth/Valiant, Warspite e Malaya sono distinte; Barham non ha un profilo in questo lotto. Vittorio Veneto e Littorio conservano il disegno fornito dal giocatore.
- Fonti: [FM 30-50, settembre 1943 (Regia Marina)](https://www.lonesentry.com/blog/italian-navy-ship-silhouettes.html); U.S. Army–Navy Journal of Recognition, novembre 1943 ([tavola BB/CV/CA](https://www.coatneyhistory.com/RNBBsCVs.jpg), [tavola CL/DD](https://www.coatneyhistory.com/RNCAsCLsDDs.jpg)); scansioni consultate solo come riferimento, tracciati vettoriali originali.
- Classi non coperte (in particolare sommergibili, portaerei mancanti e alcune classi di incrociatori/cacciatorpediniere) restano senza profilo; nessuna sagoma generica assegnata al posto di quella documentata.
- Testata approvata, bandiere, NP5/AE1, ordinamenti, Nhost e regole del gioco invariati.

## Novità v1.11
- Sostituite le icone Axis con le proposte selezionate NP5 (esplosione, fumo e nave affondata) e AE1 (caccia WWII con elica visto dall'alto).
- Icone ricavate direttamente dalla tavola approvata, senza riquadri o sfondo: WebP lossless locali con trasparenza; colori originali e dimensioni adeguate per la leggibilità.
- Testata, ordine del menu, Royal Navy (salvo numero di versione), database Nhost e logica di gioco invariati.

## Novità v1.10
- Quadro Comando Axis e catalogo Naviglio: nuova icona SVG rossa di una nave da guerra inclinata, parzialmente sommersa, con onde e bolle, per lo stato Persa.
- Tasto Aerei Axis: sagoma vettoriale di un caccia monomotore a elica ad ala bassa, ispirata al periodo 1940–43; non rappresenta un modello specifico.
- Ordine schede per entrambe le fazioni: Porto, Battaglia, Naviglio, Aerei, Storico, Gestione campagna, Regole.
- Nessuna modifica a Nhost, dati, regole, testata o logica di gioco.

## Novità v1.9
- Bandiere sabaude ai due lati del titolo Axis: disegno originale fornito dall'utente (216 × 166 px), sfondo esterno bianco rimosso con trasparenza, copia speculare a destra, asset locale WebP lossless. Nessuna rigenerazione IA.
- Testata v1.8 mantenuta identica come risorsa separata; le bandiere si adattano proporzionalmente alla larghezza senza coprire la scritta.
- Nessuna modifica a Nhost, regole o grafica Royal Navy salvo versione.

## Novità v1.8
- Testata Axis sostituita dalla composizione grafica approvata: dipinto della flotta, stemma centrale, cornice e targa dorate, come nell'anteprima fornita.
- Asset WebP locale (1916 × 821 pixel, 561270 byte) derivato dall'anteprima approvata, senza ulteriore rigenerazione; riquadro proporzionale e titolo accessibile. Versione sotto l'immagine. Nessun ritaglio, nessuna deformazione e nessun caricamento remoto della testata.
- Eliminati la fascia fotografica, il carosello e il relativo timer dalla UI attiva. Le risorse storiche delle release precedenti restano nel repository per eventuale rollback.
- Nessun intervento su Nhost, regole di gioco, dati o grafica Royal Navy (salvo versione).

## Novità v1.7
- Testata Axis: bandiere sabaude ondeggianti, ombre, aste e cordoni in SVG locale; carta del Mediterraneo vettoriale da dati geografici Natural Earth (pubblico dominio, https://www.naturalearthdata.com/about/terms-of-use/), senza confini politici.
- Carosello con le dieci foto originali a colori della rivista navale di Napoli del 5 maggio 1938: avanza di una foto ogni 5 secondi, con transizione breve, pausa manuale, al passaggio del mouse e durante la messa a fuoco da tastiera; 7, 4 o 2 foto visibili secondo la larghezza. Rispetta la riduzione delle animazioni. Gli URL alternativi servono solo da fallback; se entrambe le richieste falliscono la foto viene esclusa.
- Fonte: https://inchhighguy.wordpress.com/2023/04/12/italian-fleet-review-color-photographs-hugo-jaeger-collection-part-vii/; Hugo Jaeger / LIFE Photo Collection ©. Le immagini sono richiamate da URL esterni senza ritagli, filtri o ritocchi. Non vengono copiate nel repository pubblico in assenza di una licenza di redistribuzione verificata.
- Nessuna modifica alle regole, ai cataloghi, a Nhost o alla grafica Royal Navy salvo numero di versione.

## Novità v1.6
- Testata Axis: bandiere ondeggianti, aste e cordoni dorati e carta decorativa del Mediterraneo prelevati dalla parte superiore dell'anteprima approvata, ottimizzata in WebP. Lo stemma centrale rimane un elemento indipendente.
- Nessuna fotografia di nave o aereo dell'anteprima generata è stata utilizzata. La fascia fotografica v1.5 resta identica.
- Nessuna modifica a Nhost, regole del gioco o Royal Navy salvo numero di versione.

## Novità v1.5
- Nuova testata Regia Marina: emblema araldico originale, doppia insegna sabauda, titolo centrale in ottone, sette fotografie storiche senza didascalie visibili e con collegamenti alle fonti.
- Le fotografie sono mostrate nelle loro proporzioni originali senza filtri, ritagli, ricostruzioni IA o alterazione dei profili. Tre fotografie a colori e quattro in bianco e nero (per le quali non è stata individuata una versione a colori attendibile). Le foto del 1938 documentano la flotta dello stesso periodo storico prima della guerra.
- Emblema: [F l a n k e r / Wikimedia Commons, CC BY-SA 2.5](https://commons.wikimedia.org/wiki/File:Emblem_of_the_Regia_Marina.svg) ([licenza](https://creativecommons.org/licenses/by-sa/2.5/)); immagine invariata.
- Fonti delle immagini:
  - [Macchi C.202 Folgore, 1942–43](https://commons.wikimedia.org/wiki/File:C.202_fighter_taking_off.jpg): Fotografia a colori; Wikimedia Commons.
  - [Sommergibile Enrico Tazzoli](https://commons.wikimedia.org/wiki/File:Italian-submarine-Tazzoli.jpg): Fotografia storica in bianco e nero; Wikimedia Commons.
  - [Corazzate Vittorio Veneto e Littorio, 1940–43](https://commons.wikimedia.org/wiki/File:Vittorio_Veneto_and_Littorio_during_WW2.jpg): Regia Marina; fotografia in bianco e nero.
  - [Incrociatore classe Zara, Napoli, 5 maggio 1938](https://inchhighguy.wordpress.com/2023/04/12/italian-fleet-review-color-photographs-hugo-jaeger-collection-part-vii/): Hugo Jaeger / LIFE Photo Collection ©; fotografia originale a colori.
  - [Cacciatorpediniere alla rivista navale, Napoli, 5 maggio 1938](https://inchhighguy.wordpress.com/2023/04/12/italian-fleet-review-color-photographs-hugo-jaeger-collection-part-vii/): Hugo Jaeger / LIFE Photo Collection ©; fotografia originale a colori.
  - [Cacciatorpediniere Antonio Pigafetta, 1941–42](https://commons.wikimedia.org/wiki/File:RCT_Pigafetta_1942_Fraccaroli_Allan_2.jpg): Fotografia in bianco e nero; Aldo Fraccaroli, Italian Warships of World War II (1968), Wikimedia Commons.
  - [Savoia-Marchetti S.M.79 Sparviero, primi anni 1940](https://commons.wikimedia.org/wiki/File:Savoia-Marchetti_S.M.79.jpg): Fotografia in bianco e nero; Wikimedia Commons.
- Le foto sono richiamate da URL esterni, non ridistribuite. Disponibilità subordinata ai siti sorgente; per le foto LIFE il diritto di riutilizzo non è accertato. Nessuna modifica a Royal Navy (salvo numero di versione), Nhost o alle regole della campagna.

## Novità v1.4
- Proposta A (Ammiragliato italiano) per Axis: fotografie laterali, titolo centrale in ottone, insegne sabaude, sfondo blu notte senza carta geografica; navigazione e pannelli coordinati.
- Le due foto a colori della rivista navale di Napoli del 5 maggio 1938, attribuite a Hugo Jaeger / LIFE Photo Collection, sono richiamate tramite URL esterni al sito che le pubblica, senza redistribuzione dei file in questo repository, filtri, ritagli o ricostruzioni. Fonte: https://inchhighguy.wordpress.com/2023/04/12/italian-fleet-review-color-photographs-hugo-jaeger-collection-part-vii/ . Copyright LIFE/Time Inc.; la licenza di riutilizzo non è accertata, la visualizzazione dipende dal sito esterno. Per una distribuzione con fotografie proprie occorre verificare l'autorizzazione.
- Tema chiaro e mobile conservati; titolo sopra le immagini su schermi stretti. Royal Navy non ridisegnata.
- Nessuna modifica al database Nhost, alle regole o ai dati della campagna.

## Novità v1.3
- Naviglio: BB → BC → CV → CA → CL → DD → SUB; classi storiche consecutive ordinate per massimo valore della classe, poi punti decrescenti e nome. Ripristino dell’ordine predefinito; ordinamenti manuali ancora disponibili.
- Bandiere e distintivi di servizio nei cataloghi; per gli aerei Axis si distingue la Regia Aeronautica dalla Luftwaffe, in base alle forniture del periodo. Per gli aerei Allies il distintivo indica il servizio della fazione, non il paese costruttore. I simboli tedeschi sono distintivi grafici stilizzati, non vessilli storici completi.
- I Ju 87 R-2, Bf 109 G (eccetto G-14) e Ju 88 A-4 hanno insegna italiana in riferimento alle forniture storiche (Ju 88 in quantità limitata, soprattutto addestramento). Bf 109 G-14/AS: variante del 1944, mantenuta senza cambiare l’anno di gioco. Per nuove denominazioni Axis non riconosciute non si inventa un’insegna aerea.
- Badge Tipo per gli aerei e le navi; Turno n/10 senza ripetizione della stagione. Testata scenografica, mappa decorativa schematica e pulsanti Axis con contorno e ombra.
- Nessuna migrazione Nhost, nessuna modifica ai punti, alle disponibilità o alla logica di battaglia.

## Novità v1.2
- Colonna Classe subito dopo Nome, in corsivo e con dimensione ridotta; ordinabile e ricercabile. Repertorio storico pubblico indipendente dalla fazione, separato da cls (motore); i cataloghi di gioco restano privati. Nuove unità sconosciute: «—», senza supposizioni.
- Filtro Tipo Nave per sigla (BB, BC, CA, CL, DD, CV, SUB e altri tipi eventualmente presenti).
- Nuova icona Axis Persa/Perse: profilo storico del Vittorio Veneto quasi sommerso con fumo stilizzato. Grafica Royal Navy invariata salvo colonna e filtro.
- Fonti anagrafiche: https://www.navypedia.org/ships_index.htm e https://uboat.net/italian_submarines/boats/; https://uboat.net/allies/warships/; https://uboat.net/types/.
- Nessun intervento Nhost o sui dati della campagna.

## Novità v1.1
- Restyling Axis: testata, riepilogo flotte, navigazione, catalogo e badge originali BB/BC/CA/CL/DD/CV/SUB.
- Tre icone di stato ricavate dal profilo storico fornito del Vittorio Veneto; la nave persa è quasi sommersa, la riparazione mostra bacino e gru.
- Due voci illustrate: Vittorio Veneto (profilo fornito dall'utente) e Littorio (riferimento di classe esplicitamente indicato). Nessuna sagoma fittizia per le altre unità. Le tavole mancanti saranno integrate solo dopo acquisizione e verifica.
- Nessuna migrazione Nhost. Logica, dati e tema Royal Navy invariati.

## Novità v1.0
- Regola dei nomi di scafo condivisa tra Porto e motore; una perdita definitiva prevale su qualsiasi versione.
- Controlli delle versioni duplicate anche nel database, snapshot completi v2 e indicazione degli archivi incompleti (richiedono migrazione SQL e metadati).
- Rinnovo autenticazione coordinato nella singola scheda; messaggi di rete espliciti, timeout e protezione contro risposte obsolete.
- Interfaccia stabile durante la modifica di un campo, nessun ridisegno per notifiche equivalenti, controllo periodico di salute anche con WebSocket attivo.
- Icona neutra Apple Touch; versionamento degli import JavaScript.

## Installazione
Sostituire soltanto i file frontend del pacchetto GitHub, mantenendo CSS e asset esistenti.
Prima applicare gli script privati SQL/metadati v1.0 secondo la guida separata, dopo il backup.
Non pubblicare sul repository password, Hasura Admin Secret, esportazioni reali o script SQL privati.
Il piano gratuito può sospendere il progetto dopo inattività: controllare lo stato Nhost se il login non riesce.

## Sicurezza e limiti
Il backend, non il browser, deve far rispettare i filtri di fazione e i permessi delle funzioni.
L'estrazione avviene nel client; le mutazioni convalidano unità, porto, disponibilità e punteggi, ma non riproducono a server ogni tiro del seme. Il gioco presuppone giocatori collaborativi.
Usare profili browser distinti per le due fazioni: il token persistente è condiviso tra schede sullo stesso origin.
I test locali non sostituiscono il collaudo sul progetto Nhost attivo. Conservare backup indipendenti dal database.
