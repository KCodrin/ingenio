# agent.md — Regole per chi lavora su [[nome progetto]] (persone e AI)

> Leggere questo file prima di toccare qualsiasi cosa. Per i dettagli: `design.md`, `brand/voice.md`.

## 1 · Ambito e permessi
- Cartelle: `[[codice]]/` (il progetto, repository `[[repo]]`, ramo `[[main]]`), `doc/` (documentazione, da tenere aggiornata), `[[altro]]/` (sola lettura).
- Si modifica ciò che l'utente chiede, e solo quello. Nel dubbio si chiede.
- `git commit` e `git push` **solo su richiesta esplicita** ("pusha"), mai `--force`.
- Prima di cancellare file o pagine si controlla dove sono usati e si aggiornano i riferimenti.
- Mai password, token o chiavi private nel codice, nel changelog o nei commit.
- I testi legali e i dati dell'azienda non si inventano: si inseriscono come forniti e si segnalano le incongruenze.

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
Fonte di verità: [[file dei token, es. tokens.css]]. Non si inventano valori: si usano i token. [[Regole fisse: colori, raggi, font, componenti da riusare]]

## 4 · Stack
[[Tecnologie ammesse e vietate. Esempio: "nessuna libreria esterna a runtime"]]

## 5 · Prima di dichiarare un lavoro finito
1. [[comando dei test]] verde.
2. Se si vede nel browser, controllato a schermo su desktop e su mobile.
3. `doc/` aggiornata (sezione 2).

## 6 · Regole del cliente (si aggiungono man mano)
- [[Esempio: "mai parlare di costi o prezzi"]]
- [[Esempio: "testi semplici, senza gergo tecnico"]]
