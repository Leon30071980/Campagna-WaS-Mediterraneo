# Campagna W@S Mediterraneo — v1.1 (Nhost)

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
