[README.md](https://github.com/user-attachments/files/33260939/README.md)
# Campagna W@S Mediterraneo — Versione 0.2 (grafica originale)

## Requisiti

- Nhost gia configurato (`001`, `002`, `005`), due account Axis / Allies.
- Permessi Hasura `user:select` gia testati.
- Facoltativo ma consigliato: eseguire da Nhost SQL Editor lo script
  `007_configurazione_squadre_private.sql` fornito a parte, prima del caricamento della v0.2.
  Serve per caricare i nomi degli ammiragli e gli slot esatti in ciascuno stato privato.

## Pubblicazione GitHub Pages

Aggiornare nella RADICE della repository:

- index.html
- css/regia.css
- css/royal.css
- css/nhost.css
- js/main.js
- js/api.js
- js/auth.js
- js/config.js

Si possono sostituire i file via GitHub (Upload files) o caricare le due cartelle intere.
Conservare i percorsi relativi, non mettere tutti i file nella root.
GitHub Pages: branch main, cartella /(root).
Dopo il deploy, aggiornare con Ctrl+F5.

## Cosa comprende

- Testata originale Regia Marina e Royal Navy, SVG originali delle bandiere.
- CSS e font Barlow Semi Condensed/IBM Plex Mono originali, inclusi temi chiaro/scuro.
- Navigazione delle sei schede e griglia porto originale; cataloghi letti da Nhost.
- Autenticazione Nhost esistente e isolamento di lettura Hasura.
- Visualizzazione in sola lettura: le funzioni che modificano lo stato sono disabilitate.

## Cosa NON comprende ancora

- Selezione e salvataggio delle squadre.
- Modifiche a navi/aerei, nuove unita, archiviazione.
- Estrazioni, gestione dei danni, invio conclusione battaglia.
- Calcolo incrociato e doppio passaggio turno.
- Ripristino snapshot.

Queste funzioni dovranno essere attivate con API transazionali autorizzate sul server.
NON concedere direttamente permessi INSERT, UPDATE o DELETE al ruolo Hasura user.

## Sicurezza

Non caricare `007_configurazione_squadre_private.sql` su GitHub, dato che contiene
nomi delle squadre delle due fazioni. Gli HTML originali con i cataloghi incorporati
non devono essere pubblicati. Non inserire Hasura Admin Secret nei JavaScript pubblici.
