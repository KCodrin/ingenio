# agent.md — Regole per chi lavora su Ingenio by Tutor Consulting (persone e AI)

> Leggere questo file prima di toccare qualsiasi cosa. Per i dettagli: `design.md`, `brand/voice.md`.

## 1 · Ambito e permessi
- Cartelle: `Nuovo sito/` (il progetto, repository `https://github.com/KCodrin/ingenio`, ramo `main`), `tools/` (generatore delle pagine), `doc/` (documentazione, da tenere aggiornata), `Vecchio sito/` (sola lettura: fonte dei testi originali).
- Si modifica ciò che l'utente chiede, e solo quello. Nel dubbio si chiede.
- `git commit` e `git push` **solo su richiesta esplicita** ("pusha"), mai `--force`.
- Prima di cancellare file o pagine si controlla dove sono usati e si aggiornano i riferimenti.
- Mai password, token o chiavi private nel codice, nel changelog o nei commit.
- I testi legali e i dati dell'azienda non si inventano: si inseriscono come forniti e si segnalano le incongruenze (vedi `CLIENT_INFO.md`).

## 2 · Regola obbligatoria del changelog
Ogni modifica, anche piccola, va registrata in `doc/changelog.md` **nello stesso turno di lavoro**. Nessuna eccezione.
Formato, in cima al file (voci recenti per prime):
```
## AAAA-MM-GG · Titolo breve
**Cosa:** che cosa è cambiato, in italiano semplice, senza gergo.
**Perché / Dettagli:** (se serve) motivo o file toccati.
**Verifica:** come è stato controllato.
```
Se una richiesta viene fraintesa e poi corretta, si registra anche `**Correzione:**`.
Si aggiornano quando serve anche `doc.md`, `wiki.md`, `roadmap.md`, `design.md`, `CLIENT_INFO.md`.

## 3 · Design system
Fonte di verità: `Nuovo sito/css/style.css` (blocco `:root`), descritto in `design.md`. Non si inventano valori: si usano i token.
- Colori: verde `--green` = Ingenio, ambra `--amber` = Hazard. Non scambiarli e non usarli per altro.
- Font: Plus Jakarta Sans per tutto. Nessun altro font.
- Stile di riferimento: template Crafto in `PER IL DESIGN/` (solo stile, non contenuti).
- Componenti da riusare: `.btn`, `.duel`, `.svc`, `.svc-full`, `.steps`, `.hazard-ph` (vedi `design.md`).

## 4 · Stack
- HTML, CSS e JavaScript semplici. Nessun framework, nessuna libreria esterna a runtime (solo Google Fonts).
- **Header, footer e pagine si generano** con `python3 -I tools/build.py .` dalla radice del progetto. Le modifiche a testi e struttura si fanno in `tools/build.py`, non negli HTML: il generatore li sovrascrive. CSS e JS si modificano direttamente.

## 5 · Prima di dichiarare un lavoro finito
1. `python3 -I tools/build.py .` termina con `ok 58 corsi` (non ci sono test automatici).
2. Se si vede nel browser, controllato a schermo su desktop (1280px) e su mobile (375px), senza scorrimento orizzontale e senza immagini mancanti.
3. `doc/` aggiornata (sezione 2).

## 6 · Regole del cliente (si aggiungono man mano)
- Ingenio e Hazard devono comparire in ogni sezione del sito.
- Il sito deve essere meno testuale del vecchio e moderno (2026).
- Hazard non è un mostro né "il cattivo": è il rischio non gestito. Non disegnarlo né descriverlo come mostro.
- Il sito non deve sembrare "fatto dall'AI": lo stile segue il template Crafto.
- Da Crafto si prende **solo lo stile**: contenuti e pagine restano quelli di Ingenio.
