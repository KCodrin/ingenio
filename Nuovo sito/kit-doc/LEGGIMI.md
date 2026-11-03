# Kit "doc/" riutilizzabile

Come usarlo in un nuovo progetto, in 5 passi.

1. **Copia la cartella.** Copia il contenuto di `kit-doc/` (tranne questo file) in `doc/`, alla radice del nuovo progetto, accanto al codice (non dentro).
2. **Riempi i segnaposto.** Cerca `[[` in tutti i file: ogni `[[...]]` è un dato del nuovo progetto (nome, cliente, stack, regole). Non lasciare dati del vecchio progetto.
3. **Dai la regola all'AI.** Nel nuovo progetto crea un file `CLAUDE.md` alla radice con le tre righe qui sotto. È ciò che fa rispettare il metodo in ogni sessione:
   ```
   Prima di toccare qualsiasi cosa leggi doc/agent.md.
   Ogni modifica, anche piccola, va registrata in doc/changelog.md nello stesso turno. Nessuna eccezione.
   Il push su GitHub si fa solo quando l'utente lo chiede esplicitamente.
   ```
4. **Primo giro.** Chiedi all'AI: "Leggi doc/ e il codice, poi compila doc.md e CLIENT_INFO.md con lo stato reale. Non inventare: dove manca un dato scrivi 'da confermare'."
5. **Tieni aggiornato.** Da qui in poi il changelog si scrive a ogni modifica; gli altri file solo quando cambia ciò che descrivono.

## A cosa serve ogni file

| File | Cosa contiene | Quando si aggiorna |
|---|---|---|
| `agent.md` | Regole per chi lavora sul progetto (persone e AI): cosa si può toccare, quando si pusha, cosa serve prima di dire "finito" | Solo quando cambia una regola |
| `changelog.md` | Storico di ogni modifica, le più recenti in cima | **A ogni modifica** |
| `doc.md` | Stato attuale: obiettivo, stack, struttura delle cartelle | Quando cambia la struttura o lo stack |
| `wiki.md` | Decisioni importanti: cosa, perché, alternative scartate | Quando si prende una decisione che non è ovvia |
| `roadmap.md` | Cose da fare e stato (`[ ]` `[~]` `[x]`) | A ogni inizio e fine lavoro |
| `CLIENT_INFO.md` | Dati del cliente, cose da confermare, domande aperte | Quando arriva un'informazione |
| `design.md` | Colori, font, spazi, componenti: il design system | Quando cambia un valore |
| `brand/voice.md` | Come si scrive (tono, parole da usare e da evitare) | Quando il cliente corregge un testo |
| `audits/` | Controlli fatti in un giorno preciso (uno per file, con data nel nome) | Un file nuovo a ogni controllo |
| `patterns/` | Guide per rifare una struttura già fatta (es. pagina prodotto) | Quando si crea un modello da ripetere |

## Il metodo, in breve
- **Una sola fonte di verità:** la documentazione sta solo in `doc/`, mai sparsa nel codice.
- **Il changelog è obbligatorio e in italiano semplice:** "Cosa / Perché / Verifica", senza gergo.
- **Non si inventa:** dati, testi legali e valori mancanti si scrivono "da confermare".
- **Si verifica prima di dire "finito":** test verdi, controllo a schermo desktop e mobile, doc aggiornata.
- **Si chiede prima delle azioni difficili da annullare:** push, cancellazioni, cose pubbliche.
- **Le regole del cliente diventano regole scritte:** ogni correzione ricorrente ("mai prezzi", "testi semplici") finisce in `brand/voice.md` o `agent.md`.
