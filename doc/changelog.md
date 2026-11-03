# Changelog

## 2026-11-03 · Template Crafto escluso da GitHub
**Cosa:** la cartella `PER IL DESIGN/` (template Crafto, 22 MB) non viene caricata su GitHub.
**Perché / Dettagli:** è un template commerciale di terzi usato solo come riferimento di stile; aggiunto a `.gitignore`.
**Verifica:** `git status` non elenca più la cartella.

## 2026-11-03 · Nuovo stile sul modello Crafto
**Cosa:** il sito prende lo stile del template Crafto fornito dal cliente: fondo grigio-petrolio scuro, verde lime #97e14d, font Plus Jakarta Sans, pulsanti a pillola in maiuscolo, piccole etichette verdi sopra i titoli, hero della home centrata con fascia di numeri (10 servizi, 58 corsi, 1 referente), parola gigante in trasparenza dietro la frase manifesto, sezioni a fondi alterni, elenchi con spunte, fascia finale verde. Contenuti e pagine non sono cambiati.
**Perché / Dettagli:** il cliente trovava il sito "troppo fatto dall'AI" e ha indicato Crafto "solo per lo stile". File toccati: `Nuovo sito/css/style.css`, `tools/build.py`, `.claude/launch.json` (anteprima del template), tutte le pagine rigenerate.
**Verifica:** controllato a schermo Home e Servizi su desktop (1440px) e Home su mobile (375px): nessuna immagine mancante, nessuno scorrimento orizzontale. Corretto un pulsante della fascia finale con testo invisibile (nero su nero).

## 2026-11-03 · Documentazione con il kit doc/
**Cosa:** creata la cartella `doc/` dal kit e compilata con lo stato reale del progetto; aggiunto `CLAUDE.md` con le regole per l'AI; il generatore delle pagine ora sta in `tools/build.py` dentro il progetto; il contenuto di `PRODUCT.md` è confluito in `doc/doc.md` e `doc/CLIENT_INFO.md`.
**Perché / Dettagli:** richiesta del cliente di applicare il kit. Una sola fonte di verità per la documentazione.
**Verifica:** cercato `[[` in `doc/`: nessun segnaposto rimasto; `python3 -I tools/build.py .` → `ok 58 corsi`.

## 2026-11-03 · Riga del copyright centrata
**Cosa:** nel footer la riga del copyright ha una linea sopra ed è centrata, come nell'esempio fornito.
**Verifica:** non controllata a schermo.

## 2026-11-03 · Nuovo footer
**Cosa:** footer a 4 colonne su tutte le pagine: descrizione di Ingenio con Facebook e Instagram, link rapidi, contatti con icone, newsletter.
**Perché / Dettagli:** il cliente ha fornito un'immagine di riferimento. Email lasciata su `commerciale@`; YouTube e X non aggiunti perché i link non sono noti.
**Verifica:** controllato a schermo su desktop; su mobile no.

## 2026-11-03 · Nuovo sito multipagina
**Cosa:** creato il nuovo sito in `Nuovo sito/`: Home, Ingenio & Hazard, Servizi, Formazione, Azienda, News con 5 articoli, Bambini, Contatti. Tema scuro, Ingenio e Hazard in ogni pagina, catalogo di 58 corsi con ricerca e filtri, immagini convertite in WebP.
**Perché / Dettagli:** il vecchio sito era troppo testuale. Testi, corsi e articoli ripresi dal vecchio sito.
**Verifica:** controllato a schermo su desktop e mobile: nessuna immagine mancante, nessuno scorrimento orizzontale, filtro corsi funzionante.
