# wiki.md — Decisioni

> Per ogni scelta: **Cosa + Perché + Alternative scartate**.

## 1. Sito statico generato da uno script (scelta 2026-11-03)
**Cosa:** le pagine HTML sono create da `tools/build.py`, che contiene header, footer, testi e dati (servizi, corsi, articoli).
**Perché:** 13 pagine con lo stesso header e footer: cambiarli in un punto solo evita errori. Corsi e articoli vengono letti direttamente dal vecchio sito.
**Alternative scartate:** HTML scritto a mano pagina per pagina (header e footer ripetuti 13 volte); framework come Astro o Next (troppo per un sito vetrina).

## 2. Tema scuro "storytelling" (scelta 2026-11-03, stile aggiornato con la decisione 5)
**Cosa:** sfondo verde-nero, verde per Ingenio, ambra per Hazard.
**Perché:** scelto dal cliente; le immagini di Ingenio hanno già sfondi scuri con luci verdi.
**Alternative scartate:** tema chiaro corporate; stile fumetto.

## 3. Immagini in WebP (scelta 2026-11-03)
**Cosa:** PNG da circa 2 MB convertiti in WebP da 25–180 KB in `assets/img/`.
**Perché:** pagine molto più leggere e veloci.
**Alternative scartate:** usare i PNG originali.

## 5. Stile del template Crafto (scelta 2026-11-03)
**Cosa:** colori, font, pulsanti, etichette, hero centrato e fascia numeri ripresi dal template Crafto; contenuti invariati.
**Perché:** il cliente giudicava il sito "troppo fatto dall'AI" e ha fornito Crafto come riferimento, "solo per lo stile".
**Alternative scartate:** copiare struttura e sezioni di Crafto (è un template per criptovalute, non adatto ai contenuti).

## 4. Moduli con `mailto:` (scelta 2026-11-03)
**Cosa:** contatti e newsletter aprono il programma di posta dell'utente.
**Perché:** non c'è ancora un servizio di invio; meglio di un finto messaggio "iscritto!" che non salva nulla.
**Alternative scartate:** messaggio di conferma finto (ingannevole).
