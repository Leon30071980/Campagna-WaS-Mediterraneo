# Campagna W@S Mediterraneo — v1.29 (Nhost)

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
