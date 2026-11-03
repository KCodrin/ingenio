# doc.md — Stato attuale del progetto

> Ultimo aggiornamento: 2026-11-03

## Obiettivo
Nuovo sito multipagina di **Ingenio by Tutor Consulting** (Nichelino, TO): consulenza su sicurezza sul lavoro, formazione, HACCP, privacy e cybersecurity, medicina del lavoro, compliance e organizzazione.
Per titolari e responsabili di piccole e medie imprese italiane; c'è anche un'area per bambini e scuole.
Deve sostituire il vecchio sito (contenuti buoni ma troppo testuale) raccontando lo scontro tra **Ingenio** (consapevolezza, prevenzione) e **Hazard** (il rischio non gestito).

## Stack
| Livello | Scelta | Note |
|---|---|---|
| Markup | HTML statico | Generato da `tools/build.py` |
| Stile | CSS unico `Nuovo sito/css/style.css` | Token in `:root` |
| Script | `Nuovo sito/js/main.js` | Menu mobile, header allo scroll, filtro corsi |
| Font | Google Fonts | Plus Jakarta Sans |
| Immagini | WebP in `Nuovo sito/assets/img/` | Convertite con `cwebp` dagli originali |
| Moduli | `mailto:` | Contatti e newsletter aprono il programma di posta: nessun invio reale |

## Struttura delle cartelle
```
INGENIO/
├── CLAUDE.md              regole per l'AI (rimanda a doc/agent.md)
├── doc/                   documentazione del progetto (questa cartella)
├── tools/build.py         genera tutte le pagine HTML con header e footer comuni
├── Nuovo sito/            il sito nuovo, quello da pubblicare
│   ├── *.html             8 pagine + 5 articoli news (generati)
│   ├── css/style.css      stile e design system
│   ├── js/main.js         interazioni
│   ├── assets/img/        immagini usate dal sito (WebP)
│   ├── assets/services/   PNG originali pesanti, non più usati
│   └── kit-doc/           modello del kit doc/ (originale, non fa parte del sito)
├── Vecchio sito/          sito precedente, sola lettura: fonte di testi, corsi e articoli
├── PER IL DESIGN/         template Crafto: solo riferimento di stile
└── .claude/launch.json    server locali per l'anteprima (sito e template)
```

## Pagine
Home, Ingenio & Hazard, Servizi, Formazione (catalogo di 58 corsi con ricerca e filtri), Azienda, News (+5 articoli), Bambini, Contatti.

## Come si lavora
- Generare le pagine: `python3 -I tools/build.py .` (dalla cartella `INGENIO/`)
- Avvio in locale: `python3 -m http.server 8765 --directory "Nuovo sito"` → `http://localhost:8765`
- Test: nessun test automatico; controllo a schermo desktop e mobile.
- Pubblicazione: repository GitHub `KCodrin/ingenio`, ramo `main`, collegato a Vercel; `vercel.json` pubblica la cartella `Nuovo sito/`. Dominio definitivo: da confermare.
