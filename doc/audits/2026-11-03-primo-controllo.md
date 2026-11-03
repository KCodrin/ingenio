# Audit 2026-11-03 · Primo controllo del nuovo sito

**Ambito:** pagine Home, Formazione e Bambini a schermo (desktop 1280px e mobile 375px); immagini; filtro corsi; footer su desktop.
**Esito:** il sito funziona; restano contenuti mancanti e la richiesta del cliente di renderlo meno "da AI".

## Problemi trovati
1. Su mobile il testo dell'apertura si sovrapponeva all'immagine → aggiunta una sfumatura più scura sotto i 760px.
2. In home 6 servizi su una griglia da 4 lasciavano 2 card isolate → mostrati 8 servizi.
3. Il logo `assets/logo.svg` ha testo nero, invisibile su sfondo scuro → usata l'icona `favicon.webp`, che però ha un fondo nero quadrato.
4. Il generatore leggeva 0 corsi (titoli in `<h3>`, non `<h2>`) → corretto, ora legge 58 corsi.

## Da fare dopo
- Icona del logo con sfondo trasparente.
- Controllo del footer su mobile.
- Controllo di accessibilità completo.
- Revisione degli elementi "da AI" quando il cliente li indica.
