# design.md — Design system

> Fonte di verità: `Nuovo sito/css/style.css`, blocco `:root`. Mondo visivo scelto dal cliente: "storytelling scuro", con lo stile del template Crafto (`PER IL DESIGN/`, solo come riferimento di stile).

## Colori
| Token | Valore | Uso |
|---|---|---|
| `--night` | `#0d1517` | Sfondo della pagina |
| `--deep` | `#19272b` | Sezioni alterne, card, footer, moduli |
| `--panel` | `#213237` | Superfici rialzate (riserva) |
| `--line` | `rgba(255,255,255,.1)` | Bordi e separatori |
| `--text` | `#ffffff` | Testo principale |
| `--soft` | `rgba(255,255,255,.6)` | Testo secondario |
| `--green` | `#97e14d` | **Ingenio**: pulsanti principali, etichette, link attivi, fascia CTA |
| `--green-ink` | `#000000` | Testo sopra il verde |
| `--green-dim` | `#4f7a24` | Barra di scorrimento |
| `--amber` | `#ffb547` | **Hazard**: solo per ciò che parla del rischio |
| `--amber-dim` | `#8a5a12` | Riserva |

## Tipografia
| Ruolo | Font | Dimensione |
|---|---|---|
| Titoli (`--display`) | Plus Jakarta Sans 600, spaziatura -0.035em | h1 `clamp(2.8rem, 6vw, 5rem)`, h2 `clamp(2rem, 3.6vw, 2.85rem)`, h3 `clamp(1.25rem, 2vw, 1.6rem)` |
| Testo (`--body`) | Plus Jakarta Sans 400–700 | 17px, interlinea 1.7, righe max 65 caratteri |
| Etichetta (`.label`) | Plus Jakarta Sans 700 maiuscolo | 13px, verde, sopra i titoli di sezione |
| Pulsanti | Plus Jakarta Sans 700 maiuscolo | 13px (12px nell'header) |

## Spazi, raggi, ombre, movimento
- Larghezza contenuto `--wrap`: `min(1200px, 100% - 32px)`.
- Sezioni: padding verticale `clamp(72px, 10vw, 128px)`.
- Raggi: `--radius` 6px per card e riquadri; pulsanti, chip e fascia numeri a pillola (999px).
- Sezioni alterne su `--deep`; le card dentro di esse su `--night`.
- Ombre: nessuna; la profondità è data dall'alternanza dei fondi e dai bordi `--line`.
- Movimento: `--ease` `cubic-bezier(0.16, 1, 0.3, 1)`; comparsa allo scroll `.reveal` solo nei browser che la supportano e senza "riduci movimento".

## Componenti
| Nome | Quando si usa | Dove |
|---|---|---|
| `.hdr` / `.nav` / `.burger` | Header fisso con menu; sotto 1020px menu a tendina | `build.py` → `page()` |
| `.ftr` | Footer a 4 colonne: Ingenio + social, link rapidi, contatti con icone, newsletter | `build.py` → `page()` |
| `.btn`, `.btn-g` | Pulsante neutro / pulsante principale verde | ovunque |
| `.hero`, `.hero-sub` | Apertura della home / delle altre pagine, con immagine di sfondo | `build.py` → `hero_sub()` |
| `.duel` (`.mini`) | Blocco a due colonne Hazard / Ingenio | `build.py` → `duel()` |
| `.char` | Scheda personaggio (Ingenio o Hazard) | Home |
| `.hazard-ph` | Segnaposto per l'illustrazione di Hazard (da sostituire) | `build.py` → `hazard_ph()` |
| `.svc` / `.svc-full` | Servizio in card (home) / in riga estesa (Servizi, Azienda) | Home, Servizi, Azienda |
| `.steps` | Passi numerati | Home, Formazione, Bambini |
| `.courses` + `.course-tools` | Catalogo corsi con ricerca e filtri | Formazione |
| `.news`, `.article` | Elenco news / testo articolo | News e articoli |
| `.kid-card` | Materiale didattico ("In arrivo") | Bambini |
| `.form`, `.nl` | Modulo contatti / campo newsletter | Contatti, footer |
| `.cta` | Fascia finale verde pieno con testo nero | Quasi tutte le pagine |
| `.label` | Etichetta maiuscola verde sopra i titoli di sezione | `build.py` |
| `.stats` | Fascia a pillola con numeri (10 servizi, 58 corsi, 1 referente) | Home, hero |
| `.ghost` | Parola gigante in trasparenza dietro la frase manifesto | `build.py` |
