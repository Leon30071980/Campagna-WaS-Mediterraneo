# Campagna Mediterraneo — prova connessione Nhost (v0.1)

Questa è la prima versione **funzionante in sola lettura** per GitHub Pages.

## Funzionalità presenti

- Login Nhost Auth con email e password già create (`axis` / `allies`).
- Opzione per mantenere l'accesso sul dispositivo (refresh token nel localStorage).
- Token JWT usato per interrogare Hasura secondo i permessi già configurati.
- Visualizzazione campagna comune, proprio porto e propri cataloghi navali/aeronautici.
- Ricerca in naviglio/aerei, indicatori dei turni, schede di storico e regole.
- Logout e aggiornamento; **nessuna scrittura** del database.

## Non ancora implementato (intenzionalmente)

- Inserimento/modifica/rimozione unità; salvataggio del porto; generazione e conclusione battaglia;
  calcolo incrociato; pulsante «Pronto per il prossimo turno»; snapshot/ripristino.
- Riproduzione completa dei due HTML originali (questa è una verifica tecnica e una base di collegamento).

## Pubblicazione GitHub Pages

1. Crea una repository GitHub, per esempio `Campagna-Mediterraneo`.
2. Carica nella **radice della repository** i file di questa cartella (`index.html`, `css/`, `js/`).
3. In `Settings → Pages` seleziona `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Apri l'indirizzo Pages fornito da GitHub e accedi con le utenze Nhost esistenti.
5. Prova prima `axis` e poi `allies` e controlla che i numeri di unità corrispondano a quelli importati.

Per prova locale, serve un web server statico (non aprire `index.html` come file:// perché usa ES modules).

## Avvertenze

- **MAI** inserire in JS, CSS, HTML o GitHub: `HASURA_GRAPHQL_ADMIN_SECRET`, password, JWT reali, refresh token, backup.
- `config.js` contiene soltanto gli URL pubblici del servizio.
- Hasura deve avere i **sei permessi SELECT con filtro per `user`** già configurati. Le scritture sono bloccate.
- Per opzione "mantieni accesso" si salva un refresh token in `localStorage`. Se il dispositivo è condiviso, non selezionare la casella. In futuro si può passare a sessioni più protette se necessario.
- Il codice non verifica direttamente la sicurezza del backend: la segregazione dipende dai permessi Hasura, già verificati con script 004_v3.
