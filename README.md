# Campagna W@S Mediterraneo — v1.3 (Nhost)

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
