# Campagna W@S Mediterraneo — Web v0.3

## Caratteristiche
- Grafica, bandiere, font, temi e colori dei due Quadri Comando originali.
- Login Nhost Axis / Allies, dati cataloghi sempre caricati dal database (nessun catalogo pubblico).
- **Naviglio e Aerei:** aggiungi, modifica e rimuovi le voci (proprio catalogo).
- **Porto:** assegnazione da menu per ogni slot, riempimento casuale delle caselle e svuotamento totale.
- Salvataggio diretto su Nhost con numero di revisione e verifica lato PostgreSQL.
- Nessuna modifica di `perdite`, `storico`, `battaglia`, punteggi, fazione o turni tramite questa funzione.
- Modifiche bloccate dopo la generazione della battaglia, dopo la conclusione o durante la fase risultati.

## Prerequisiti backend (obbligatori)
1. Tabelle Nhost 001, utenti e campagna 002, cataloghi importati 005, squadre importate 007.
2. In Nhost SQL Editor eseguire `009_salvataggio_logistica_nhost.sql` (fornito separatamente, **non da caricare su GitHub**).
3. Sul proprio PC eseguire `010_abilita_funzione_hasura.ps1` per tracciare la funzione e assegnare il permesso Hasura `user` **solo alla funzione**.
4. Verificare che permessi diretti `INSERT`, `UPDATE` e `DELETE` rimangano assenti sulle tabelle pubbliche.
5. Soltanto dopo, pubblicare i file frontend v0.3 su GitHub Pages.

## Nota sulle identità delle unità
L'interfaccia lavora ancora con il nome della nave/aereo come chiave, per compatibilità con i vecchi HTML. In caso di rinomina di una voce attualmente assegnata, la corrispondente casella viene aggiornata nella stessa transazione. Le voci presenti nello storico o nelle perdite non possono essere rimosse o rinominate.

## Verifiche non ancora eseguite
- Le funzioni SQL non sono state eseguite su Nhost: non sono disponibili le credenziali amministrative, e non devono essere condivise.
- Il rendering in browser remoto e le autorizzazioni della mutation richiedono una prova effettiva con gli account Axis/Allies.

## Non ancora disponibili
Estrazioni, registrazione esiti, pulsanti «Concludi battaglia», «Pronto per il prossimo turno», snapshot e ripristino. Le parti in sola lettura nelle sezioni Battaglia e Storico rimangono tali fino alla fase successiva.
