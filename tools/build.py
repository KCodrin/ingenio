#!/usr/bin/env python3
# Genera le pagine statiche di "Nuovo sito" con header/footer condivisi. Uso: python3 -I build.py <root progetto>
import html, re, sys, pathlib

ROOT = pathlib.Path(sys.argv[1])
OLD, OUT = ROOT / "Vecchio sito", ROOT / "Nuovo sito"

NAV = [("index.html", "Home"), ("ingenio-hazard.html", "Ingenio & Hazard"), ("servizi.html", "Servizi"),
       ("formazione.html", "Formazione"), ("azienda.html", "Azienda"), ("news.html", "News"),
       ("bambini.html", "Bambini"), ("contatti.html", "Contatti")]

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17v.5"/></svg>'


def hazard_ph(label="Illustrazione di Hazard in arrivo"):
    return f'<div class="hazard-ph" role="img" aria-label="{label}"><div>{WARN}<br>{label}</div></div>'


def duel(hz, ing, mini=False, h_title="Hazard", i_title="Ingenio"):
    cls = "duel mini reveal" if mini else "duel reveal"
    return (f'<div class="{cls}"><div class="hz"><strong><span class="dot"></span>{h_title}</strong><p>{hz}</p></div>'
            f'<div class="in"><strong><span class="dot"></span>{i_title}</strong><p>{ing}</p></div></div>')


def page(file, title, desc, body):
    links = "".join(f'<a href="{h}"{" aria-current=\"page\"" if h == file else ""}>{t}</a>' for h, t in NAV)
    flinks = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in NAV)
    doc = f'''<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="assets/img/favicon.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#main">Vai al contenuto</a>
<header class="hdr">
  <div class="wrap">
    <a class="brand" href="index.html"><img src="assets/img/favicon.webp" alt="" width="36" height="36"><span><b>Ingenio</b><small>by Tutor Consulting</small></span></a>
    <nav class="nav" id="nav" aria-label="Principale">{links}</nav>
    <a class="btn btn-g" href="contatti.html">Consulenza gratuita</a>
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="ftr">
  <div class="wrap">
    <div class="grid">
      <div>
        <a class="brand" href="index.html"><img src="assets/img/favicon.webp" alt="" width="36" height="36"><span><b>Ingenio</b><small>by Tutor Consulting</small></span></a>
        <p style="margin-top:16px">Ingenio rappresenta il potere della sicurezza, dell'innovazione e della conformità: la volontà di rendere la tua azienda più forte e protetta.</p>
        <div class="social">
          <a href="https://www.facebook.com/ingeniobytutorconsulting" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg></a>
          <a href="https://www.instagram.com/ingeniobytutorconsulting/" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg></a>
        </div>
      </div>
      <div><h2>Link rapidi</h2><ul>{flinks}</ul></div>
      <div><h2>Contatti</h2><ul class="ico">
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/></svg><a href="mailto:commerciale@tutorconsulting.it">commerciale@tutorconsulting.it</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg><a href="tel:+3901119665116">+39 011 196 65116</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg><a href="tel:+393485291512">+39 348 529 1512</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg><span>Via Vernea 31,<br>Nichelino (TO)</span></li>
      </ul></div>
      <div><h2>Newsletter</h2><p>Iscriviti per ricevere aggiornamenti su Ingenio e le sue missioni di successo.</p>
        <form class="nl" action="mailto:commerciale@tutorconsulting.it?subject=Iscrizione%20newsletter" method="post" enctype="text/plain">
          <label class="sr-only" for="nl-email">La tua email</label>
          <input id="nl-email" type="email" name="email" placeholder="La tua email" autocomplete="email" required>
          <button type="submit">Iscriviti</button>
        </form>
      </div>
    </div>
    <p class="bottom">&copy; 2026 Tutor Consulting. Tutti i diritti riservati. Credits: Codrin Bitculescu</p>
  </div>
</footer>
<script src="js/main.js"></script>
</body>
</html>
'''
    (OUT / file).write_text(doc)


def hero_sub(title, lead, hz, ing, img="assets/img/hero.webp"):
    return f'''<section class="hero hero-sub">
<img src="{img}" alt="" fetchpriority="high">
<div class="wrap"><h1>{title}</h1><p class="lead">{lead}</p>
<div style="max-width:720px;margin-top:32px">{duel(hz, ing, mini=True)}</div></div>
</section>'''


def cta(title="Hazard sta già aspettando?", text="Raccontaci la tua azienda: insieme capiamo dove si nasconde il rischio e da dove partire."):
    return f'''<section class="cta"><div class="wrap reveal"><h2>{title}</h2><p class="lead">{text}</p>
<div class="actions"><a class="btn btn-g" href="contatti.html">Richiedi una consulenza gratuita {ARROW}</a><a class="btn" href="tel:+3901119665116">Chiama 011 196 65116</a></div></div></section>'''


# ---------- Dati ----------
SERVICES = [
    ("sicurezza-lavoro", "Sicurezza sul lavoro", "DVR, valutazione dei rischi fisici, chimici e biologici, procedure e supporto continuo secondo il D.Lgs. 81/08.",
     ["Documento di Valutazione dei Rischi, integrabile con Modello 231", "Nomine e ruoli: RSPP, preposti, addetti", "Fornitura DPI e presidi antincendio certificati", "Monitoraggio e aggiornamento continuo"],
     "Una manutenzione rimandata, un DPI lasciato nel cassetto.", "Valuta i rischi reali del tuo ambiente e li trasforma in procedure chiare."),
    ("sicurezza-alimentare", "Sicurezza alimentare", "HACCP, autocontrollo, formazione e supporto documentale per ristorazione, produzione e filiere alimentari.",
     ["Piano di autocontrollo HACCP su misura", "Formazione per responsabili e addetti", "Analisi e verifiche periodiche", "Supporto in caso di ispezioni"],
     "Una temperatura non registrata, una scheda compilata di fretta.", "Rende l'autocontrollo un'abitudine semplice, non un faldone dimenticato."),
    ("privacy-cyber", "Privacy e cybersecurity", "Adeguamento GDPR, policy, governance dei dati e protezione dai rischi digitali che bloccano l'operatività.",
     ["Adeguamento GDPR e registro dei trattamenti", "Nomina DPO e informative", "Valutazione della sicurezza informatica", "Formazione anti-phishing per il personale"],
     "Una password condivisa, un allegato aperto senza pensarci.", "Mette in ordine dati, accessi e regole prima che qualcuno ne approfitti."),
    ("medicina-lavoro", "Medicina del lavoro", "Coordinamento della sorveglianza sanitaria e degli obblighi legati alla salute dei lavoratori.",
     ["Nomina del medico competente", "Protocollo sanitario e visite periodiche", "Gestione scadenze e idoneità", "Prevenzione dello stress lavoro-correlato"],
     "Una visita scaduta che nessuno ha notato.", "Tiene sotto controllo scadenze e idoneità, perché la salute viene prima."),
    ("formazione", "Formazione aziendale", "Corsi obbligatori, professionalizzanti e finanziati, in aula ed e-learning, per ogni livello.",
     ["Corsi sicurezza Accordo Stato-Regioni 2025", "Soft skills e digital skills", "Piattaforma e-learning certificata", "Formazione finanziata fino al 100%"],
     "Un corso trascurato, una formazione ferma a cinque anni fa.", "Trasforma l'obbligo in competenza: un team formato è un team protetto."),
    ("impianti", "Impianti e progettazione", "Progettazione tecnica, pratiche autorizzative e verifiche di impianti e ambienti di lavoro.",
     ["Progettazione e adeguamento impianti", "Pratiche antincendio e autorizzazioni", "Verifiche periodiche", "Coordinamento con i tecnici"],
     "Un impianto mai verificato, una pratica lasciata a metà.", "Coordina tecnici e pratiche perché tutto sia a norma fin dal progetto."),
    ("legal-fiscal", "Legale e fiscale", "Supporto normativo, contrattuale e fiscale attraverso la rete di professionisti Tutor Consulting.",
     ["Consulenza normativa e contrattuale", "Supporto fiscale e amministrativo", "Modello organizzativo 231", "Apertura di nuove attività"],
     "Una norma ignorata che diventa una sanzione.", "Ti tiene aggiornato su ciò che cambia, prima che diventi un problema."),
    ("marketing", "Marketing e comunicazione", "Brand identity, siti web, social e comunicazione evoluta per farsi trovare e scegliere.",
     ["Brand identity e immagine coordinata", "Siti web ed e-commerce", "Gestione social e contenuti", "Strategia di comunicazione"],
     "Un'azienda valida che nessuno riesce a trovare.", "Dà voce e visibilità al valore che la tua impresa già possiede."),
    ("gestione-aziendale", "Gestione aziendale", "Analisi organizzativa, processi e consulenza direzionale per decisioni più chiare e misurabili.",
     ["Analisi dei processi e dell'organizzazione", "Ruoli, responsabilità e deleghe", "Sistemi di gestione e certificazioni", "Controllo di gestione"],
     "L'improvvisazione quotidiana che diventa abitudine.", "Mette ordine in ruoli e processi, così ogni decisione ha basi solide."),
    ("sostenibilita", "Sostenibilità", "Percorsi ESG, ambiente e responsabilità sociale per crescere in modo duraturo.",
     ["Analisi di sostenibilità e ESG", "Gestione ambientale e rifiuti", "Bilancio di sostenibilità", "Accesso a bandi e incentivi"],
     "La convinzione che il futuro possa aspettare.", "Accompagna la crescita con scelte responsabili e misurabili."),
]

SOFT = ("Comunicazione", "Conflict", "Decision", "Stress", "Leadership", "Problem", "Psicologia", "Time", "Visione")
DIGI = ("Cyber", "Sistemi Operativi", "Suite Microsoft")


def courses():
    s = (OLD / "formazione-obbligatoria.html").read_text()
    out = []
    for m in re.finditer(r'<h[23][^>]*entry-title[^>]*>([^<]+)</h[23]>.*?(\d+)h\b', s, re.S):
        t = html.unescape(m.group(1)).strip()
        t = re.sub(r'-(\d)$', r' \1', t)
        tr = "soft" if t.startswith(SOFT) else "digital" if t.startswith(DIGI) else "obbligatori"
        out.append((t, m.group(2), tr))
    return out


ARTICLES = [
    ("la-medicina-del-lavoro-e-prevenzione-aziendale-perche-la-sicurezza-inizia-molto-prima", "medicina-del-lavoro-prevenzione.webp"),
    ("il-rischio-piu-sottovalutato-oggi-entra-ogni-mattina-in-ufficio", "rischio-sottovalutato-in-ufficio.webp"),
    ("la-sicurezza-informatica-non-riguarda-solo-le-grandi-aziende", "sicurezza-informatica-aziende.webp"),
    ("accordo-stato-regioni-2025-sulla-sicurezza-sul-lavoro", "accordo-stato-regioni-2025.webp"),
    ("dietro-una-sicurezza-efficace-ce-sempre-un-buon-rspp", "dietro-una-sicurezza-efficace-rspp.webp"),
]
MESI = "gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre".split()


def article(slug):
    s = (OLD / f"{slug}.html").read_text()
    title = html.unescape(re.search(r'entry-title[^>]*>(.*?)</h1>', s, re.S).group(1))
    title = re.sub(r'<[^>]+>', '', title).strip()
    iso = re.search(r'datetime="(\d{4})-(\d\d)-(\d\d)', s)
    date = (f"{iso.group(1)}-{iso.group(2)}-{iso.group(3)}", f"{int(iso.group(3))} {MESI[int(iso.group(2)) - 1]} {iso.group(1)}")
    blocks = re.findall(r'class="w-post-elm post_content[^"]*"[^>]*>(.*?)</div>\s*(?:</div>|<div class="w-post)', s, re.S)
    raw = max(blocks, key=len) if blocks else ""
    raw = re.sub(r'<(/?)(p|h2|h3|h4|ul|ol|li|strong|em|b)\b[^>]*>', r'<\1\2>', raw)
    raw = re.sub(r'<(?!/?(p|h2|h3|ul|ol|li|strong|em|b)>)[^>]+>', '', raw).replace("<h4>", "<h3>").replace("</h4>", "</h3>")
    text = re.sub(r'<[^>]+>', ' ', raw)
    excerpt = html.unescape(" ".join(text.split()))[:170].rsplit(" ", 1)[0] + "…"
    return title, date, raw.strip(), excerpt


# ---------- Pagine ----------
def build():
    arts = [(slug, img, *article(slug)) for slug, img in ARTICLES]
    arts.sort(key=lambda a: a[3][0], reverse=True)

    def news_cards(items):
        return "".join(f'<a href="{s}.html" class="reveal"><img src="assets/img/{i}" alt="" loading="lazy"><div><time datetime="{d[0]}">{d[1]}</time><h3>{t}</h3><p>{e}</p></div></a>'
                       for s, i, t, d, _, e in items)

    svc_cards = "".join(f'<a class="svc reveal" href="servizi.html#{k}"><img src="assets/img/ingenio-{k}.webp" alt="" loading="lazy"><div><h3>{t}</h3><p>{d}</p></div></a>'
                        for k, t, d, *_ in SERVICES[:8])

    # Home
    page("index.html", "Ingenio by Tutor Consulting | Sicurezza, formazione e prevenzione per le imprese",
         "Ingenio, il piccolo eroe di Tutor Consulting, protegge le aziende con sicurezza sul lavoro, formazione, HACCP, privacy e compliance. Contro Hazard, il rischio che nessuno vede arrivare.", f'''
<section class="hero hero-home">
<img src="assets/img/hero.webp" alt="" fetchpriority="high">
<div class="wrap">
<h1>Il rischio aspetta. <span class="g">Ingenio no.</span></h1>
<p class="lead">Sicurezza sul lavoro, formazione, HACCP, privacy e organizzazione: un unico team che riconosce i rischi prima che diventino problemi.</p>
<div class="actions"><a class="btn btn-g" href="contatti.html">Consulenza gratuita {ARROW}</a><a class="btn" href="ingenio-hazard.html">Conosci Ingenio e Hazard</a></div>

<ul class="stats"><li><b>10</b> aree di servizio</li><li><b>58</b> corsi di formazione</li><li><b>1</b> solo referente</li></ul>
</div>
</section>

<section>
<div class="wrap">
<div class="head reveal"><span class="label">I protagonisti</span><h2>Ogni azienda ha un eroe. <span class="a">E un rischio in agguato.</span></h2></div>
<div class="cast">
<article class="char in reveal"><figure><img src="assets/img/ingenio-presentazione.webp" alt="Ingenio, il piccolo eroe con lo scudo" loading="lazy"></figure>
<div class="body"><h3>Ingenio</h3><p>Il piccolo eroe di Tutor Consulting. Con il suo scudo rappresenta conoscenza, prevenzione e consapevolezza.</p>
<ul class="tags"><li>Osserva</li><li>Analizza</li><li>Anticipa</li></ul></div></article>
<article class="char hz reveal"><figure>{hazard_ph()}</figure>
<div class="body"><h3>Hazard</h3><p>Il rischio che nessuno vede arrivare. Non crea il caos: gli basta aspettare.</p>
<ul class="tags"><li>Fretta</li><li>Improvvisazione</li><li>Falsa sicurezza</li></ul></div></article>
</div>
<div class="actions"><a class="btn" href="ingenio-hazard.html">Leggi la loro storia {ARROW}</a></div>
</div>
</section>

<section class="manifesto"><span class="ghost" aria-hidden="true">consapevolezza</span><div class="wrap reveal"><p>Il vero potere contro <span class="hz-word">Hazard</span> non è la forza. È la <span class="in-word">consapevolezza</span>.</p></div></section>

<section>
<div class="wrap">
<div class="head reveal"><span class="label">Servizi</span><h2>I poteri di Ingenio</h2><p class="lead">Ogni servizio è una risposta concreta a un modo in cui Hazard entra in azienda.</p></div>
<div class="svc-list">{svc_cards}</div>
<div class="actions"><a class="btn" href="servizi.html">Tutti i 10 servizi {ARROW}</a></div>
</div>
</section>

<section>
<div class="wrap">
<div class="head reveal"><span class="label">Il metodo</span><h2>Prima si mette ordine, poi si interviene.</h2></div>
<ol class="steps">
<li class="reveal"><h3>Ascolto</h3><p>Ingenio va oltre la richiesta iniziale: contesto, documenti, scadenze, persone.</p></li>
<li class="reveal"><h3>Mappa dei rischi</h3><p>Troviamo dove Hazard si nasconde e distinguiamo l'urgente dall'importante.</p></li>
<li class="reveal"><h3>Intervento</h3><p>Consulenza, formazione e documenti coordinati da un solo referente.</p></li>
<li class="reveal"><h3>Presidio</h3><p>Scadenze e aggiornamenti sotto controllo, nel tempo.</p></li>
</ol>
{duel("Cresce nella fretta, nelle cattive abitudini e nella convinzione che “tanto non succederà nulla”.", "Ti consegna una roadmap leggibile: priorità, responsabilità, tempi e prossimi controlli.")}
</div>
</section>

<section>
<div class="wrap split">
<figure class="reveal"><img src="assets/img/ingenio-formazione.webp" alt="Ingenio in aula di formazione" loading="lazy"></figure>
<div class="reveal"><h2>La formazione è il primo superpotere.</h2><p class="lead">Oltre 50 corsi obbligatori, soft skills e digital skills, in aula ed e-learning. Anche finanziati al 100%.</p>
{duel("Una formazione trascurata.", "Un team formato è un team protetto.", mini=True)}
<div class="actions"><a class="btn btn-g" href="formazione.html">Scopri i corsi {ARROW}</a></div></div>
</div>
</section>

<section>
<div class="wrap split">
<div class="reveal"><h2>Ingenio va anche a scuola.</h2><p class="lead">Una pagina dedicata ai bambini, con storie, giochi e schede per imparare fin da piccoli a riconoscere Hazard.</p>
<div class="actions"><a class="btn" href="bambini.html">Vai all'area bambini {ARROW}</a></div></div>
<figure class="reveal"><img src="assets/img/ingenio-illuminazione.webp" alt="Ingenio illumina la strada" loading="lazy"></figure>
</div>
</section>

<section>
<div class="wrap">
<div class="head reveal"><span class="label">News</span><h2>Le ultime da Ingenio</h2></div>
<div class="news">{news_cards(arts[:3])}</div>
</div>
</section>
{cta()}''')

    # Ingenio & Hazard
    page("ingenio-hazard.html", "Ingenio & Hazard | Ingenio by Tutor Consulting",
         "Ingenio rappresenta la consapevolezza, Hazard il rischio non gestito. Scopri i due protagonisti di Tutor Consulting.",
         hero_sub("Due protagonisti, <span class='g'>una sola scelta.</span>", "Ogni giorno, in ogni azienda, si incontrano. Chi vince dipende da quanto si conosce il rischio.",
                  "Il rischio non gestito.", "La capacità di riconoscerlo prima che diventi un problema.") + f'''
<section>
<div class="wrap split">
<figure class="reveal"><img src="assets/img/ingenio-presentazione.webp" alt="Ingenio con il suo scudo" loading="lazy"></figure>
<div class="reveal"><h2 class="g">Ingenio</h2>
<p class="lead">Il piccolo eroe di Tutor Consulting, nato per proteggere le aziende attraverso conoscenza, prevenzione e consapevolezza.</p>
<p>Con il suo inseparabile scudo rappresenta l'esperienza di un intero team di professionisti. Sicurezza sul lavoro, formazione, HACCP, privacy, cybersecurity, compliance e organizzazione diventano, attraverso Ingenio, temi più semplici da capire e da gestire.</p>
<p>Ingenio non aspetta che nasca un problema. Osserva, analizza e capisce ciò di cui un'azienda ha davvero bisogno, oltre la richiesta iniziale.</p>
<ul class="tags in"><li>Conoscenza</li><li>Prevenzione</li><li>Consapevolezza</li><li>Squadra</li></ul></div>
</div>
</section>

<section>
<div class="wrap split">
<div class="reveal"><h2 class="a">Hazard</h2>
<p class="lead">Il rischio che nessuno vede arrivare. Non è un mostro, e non è semplicemente il “cattivo” della storia.</p>
<p>È tutto ciò che mette in difficoltà un'azienda quando viene sottovalutato: una procedura eseguita male, una manutenzione rimandata, una formazione trascurata, una norma ignorata.</p>
<p>Hazard non ha bisogno di creare il caos. Gli basta aspettare. Trasforma piccoli segnali ignorati in infortuni, sanzioni, fermi produttivi e criticità organizzative.</p>
<ul class="tags hz"><li>Fretta</li><li>Improvvisazione</li><li>Cattive abitudini</li><li>Falsa sicurezza</li></ul></div>
<figure class="reveal" style="aspect-ratio:4/3">{hazard_ph()}</figure>
</div>
</section>

<section>
<div class="wrap">
<div class="head reveal"><span class="label">Ingenio contro Hazard</span><h2>Il confronto</h2><p class="lead">Dove Hazard si nasconde, Ingenio accende la luce.</p></div>
<div style="display:grid;gap:16px">
{duel("“Tanto non succederà nulla.”", "Conosce i rischi e li mette in fila per priorità.")}
{duel("Una manutenzione rimandata a domani.", "Scadenze visibili, controlli pianificati.")}
{duel("Una formazione trascurata.", "Persone preparate che sanno cosa fare.")}
{duel("Una norma ignorata.", "Aggiornamento continuo, prima che arrivi la sanzione.")}
</div>
</div>
</section>

<section class="manifesto"><span class="ghost" aria-hidden="true">consapevolezza</span><div class="wrap reveal"><p>Perché il vero potere contro <span class="hz-word">Hazard</span> non è la forza: è la <span class="in-word">consapevolezza</span>.</p></div></section>
{cta()}''')

    # Servizi
    chips = "".join(f'<a href="#{k}">{t}</a>' for k, t, *_ in SERVICES)
    rows = "".join(f'''<article class="svc-full" id="{k}">
<figure class="reveal"><img src="assets/img/ingenio-{k}.webp" alt="Ingenio – {t}" loading="lazy"></figure>
<div class="reveal"><h2>{t}</h2><p class="lead">{d}</p><ul>{"".join(f"<li>{b}</li>" for b in bl)}</ul>
{duel(hz, ing, mini=True)}</div></article>''' for k, t, d, bl, hz, ing in SERVICES)
    page("servizi.html", "Servizi | Ingenio by Tutor Consulting",
         "Sicurezza sul lavoro, HACCP, privacy e cybersecurity, medicina del lavoro, formazione, impianti, legale, marketing, gestione aziendale e sostenibilità.",
         hero_sub("I superpoteri <span class='g'>di Ingenio</span>", "Dieci aree, un solo referente. Ogni servizio può partire da solo o entrare in un piano integrato.",
                  "Entra da dove nessuno guarda.", "Copre ogni fronte con la rete di professionisti Tutor Consulting.", "assets/img/ingenio-difesa-aziendale.webp")
         + f'<section style="padding-top:48px"><div class="wrap"><nav class="chips" aria-label="Servizi">{chips}</nav>{rows}</div></section>{cta()}')

    # Formazione
    cs = courses()
    lis = "".join(f'<li data-t="{tr}">{html.escape(t)}<span>{h} h</span></li>' for t, h, tr in cs)
    page("formazione.html", "Formazione | Ingenio by Tutor Consulting",
         "Corsi di formazione obbligatori sulla sicurezza, soft skills e digital skills, in aula ed e-learning, anche finanziati.",
         hero_sub("Cresci con <span class='g'>Ingenio</span>", "La formazione è il primo superpotere di ogni impresa: trasforma gli obblighi in competenze.",
                  "Una formazione trascurata, una procedura mai spiegata.", "Corsi chiari, certificati e su misura.", "assets/img/ingenio-formazione.webp") + f'''
<section>
<div class="wrap">
<div class="head reveal"><span class="label">Formazione</span><h2>Quattro percorsi</h2></div>
<ol class="steps">
<li class="reveal"><h3>Corsi obbligatori</h3><p>Ruoli, rischi e procedure secondo l'Accordo Stato-Regioni 2025.</p></li>
<li class="reveal"><h3>Soft skills</h3><p>Leadership, comunicazione e relazioni che sbloccano le performance.</p></li>
<li class="reveal"><h3>Digital skills</h3><p>Strumenti digitali e sicurezza informatica per lavorare meglio, da subito.</p></li>
<li class="reveal"><h3>Marketing</h3><p>Messaggi chiari che creano relazioni e valore.</p></li>
</ol>
</div>
</section>
<section style="padding-top:0">
<div class="wrap">
<div class="head reveal"><span class="label">Catalogo</span><h2>Catalogo corsi</h2><p class="lead">{len(cs)} corsi. Cerca per nome o filtra per percorso.</p></div>
<div class="course-tools">
<label class="sr-only" for="courseSearch">Cerca un corso</label>
<input id="courseSearch" type="search" placeholder="Cerca un corso, es. antincendio">
<div class="chips"><button type="button" data-track="all" aria-pressed="true">Tutti</button><button type="button" data-track="obbligatori" aria-pressed="false">Obbligatori</button><button type="button" data-track="soft" aria-pressed="false">Soft skills</button><button type="button" data-track="digital" aria-pressed="false">Digital</button></div>
</div>
<ul class="courses" id="courses">{lis}</ul>
<p class="empty" id="coursesEmpty" hidden>Nessun corso trovato. <a href="contatti.html">Chiedici un percorso su misura</a>.</p>
</div>
</section>
{cta("Formazione finanziata fino al 100%", "Ti aiutiamo a capire quali corsi servono e come finanziarli.")}''')

    # Azienda
    powers = [("difesa-aziendale", "Difesa", "Protegge la tua impresa, ogni giorno.", "Armatura verde e scudo impenetrabile contro rischi normativi, sanzioni e violazioni: sicurezza, privacy, HACCP, GDPR.", "Sanzioni, violazioni, incertezze."),
              ("accelerazione", "Accelerazione", "Dal progetto al mercato, subito.", "Dallo studio di fattibilità alle pratiche tecniche: l'apertura di un'attività diventa un percorso semplice e guidato.", "La burocrazia che rallenta tutto."),
              ("illuminazione", "Illuminazione", "Fa luce su ciò che conta davvero.", "Mente brillante e radar sempre attivo: priorità chiare, dubbi risolti, problemi anticipati.", "Le zone d'ombra dove nessuno guarda."),
              ("innovazione", "Innovazione", "Trasforma la tua azienda. Davvero.", "Dalla brand identity ai processi digitali: dove altri vedono limiti, Ingenio vede possibilità.", "La paura del cambiamento.")]
    prow = "".join(f'''<article class="svc-full"><figure class="reveal"><img src="assets/img/ingenio-{k}.webp" alt="Ingenio – {t}" loading="lazy"></figure>
<div class="reveal"><h2>{t}</h2><p class="lead">{s}</p><p>{d}</p>{duel(h, s, mini=True)}</div></article>''' for k, t, s, d, h in powers)
    page("azienda.html", "Azienda | Ingenio by Tutor Consulting",
         "La storia di Ingenio e di Tutor Consulting: sicurezza, innovazione e crescita per imprese di ogni dimensione.",
         hero_sub("La storia <span class='g'>di Ingenio</span>", "Nato dalla visione di Tutor Consulting, Ingenio incarna sicurezza, innovazione e crescita per imprese di ogni dimensione.",
                  "Sfide normative e competitive sempre più complesse.", "Tecnologia e competenza umana, insieme.", "assets/img/ingenio-presentazione.webp") + f'''
<section class="manifesto"><span class="ghost" aria-hidden="true">consapevolezza</span><div class="wrap reveal"><p>“Insieme, rendiamo la tua azienda <span class="in-word">invincibile</span>.”</p></div></section>
<section style="padding-top:0"><div class="wrap">{prow}</div></section>
<section><div class="wrap">
<div class="head reveal"><span class="label">Missioni</span><h2>Le missioni di Ingenio</h2><p class="lead">Storie di aziende che hanno visto arrivare Hazard in tempo.</p></div>
<div style="display:grid;gap:16px">
{duel("Impresa alimentare con non conformità HACCP e personale da formare.", "Adeguamento HACCP e formazione: −25% sui costi di non conformità.", h_title="Missione: impresa alimentare", i_title="Risultato")}
{duel("PMI invisibile online, senza canali di vendita digitali.", "Nuovo sito web ed e-commerce: l'azienda si fa trovare e vende.", h_title="Missione: digitalizzazione PMI", i_title="Risultato")}
</div></div></section>
{cta()}''')

    # News
    page("news.html", "News | Ingenio by Tutor Consulting", "Normative, sicurezza, formazione e prevenzione: gli aggiornamenti di Ingenio per le imprese.",
         hero_sub("Resta aggiornato <span class='g'>con Ingenio</span>", "Normative, agevolazioni, tecnologie: ciò che conta davvero per la tua impresa.",
                  "Una novità normativa che passa inosservata.", "Te la spiega in parole semplici.", "assets/img/ingenio-illuminazione.webp")
         + f'<section><div class="wrap"><div class="news">{news_cards(arts)}</div></div></section>{cta()}')

    for slug, img, title, date, body, excerpt in arts:
        page(f"{slug}.html", f"{title} | Ingenio News", html.escape(excerpt), f'''
<section style="padding-bottom:0"><div class="wrap article"><p><a href="news.html">← Tutte le news</a></p><time datetime="{date[0]}" class="g">{date[1]}</time><h1 style="font-size:clamp(2rem,5vw,3.4rem)">{title}</h1></div></section>
<section style="padding-top:32px"><div class="wrap article"><figure><img src="assets/img/{img}" alt=""></figure>{body}
<div style="margin-top:48px">{duel("Aspetta che questo tema venga sottovalutato.", "Ti aiuta a trasformarlo in un'azione concreta. <a href='contatti.html'>Parliamone</a>.", mini=True)}</div></div></section>''')

    # Bambini
    kid_items = [("Storie di Ingenio", "Racconti illustrati: Ingenio scopre dove si nasconde Hazard.", '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M8 7h7"/>'),
                 ("Disegni da colorare", "Schede da stampare con Ingenio, lo scudo e i segnali di sicurezza.", '<path d="m4 20 4-1 11-11-3-3L5 16l-1 4z"/><path d="m14 7 3 3"/>'),
                 ("Giochi e quiz", "Trova l'errore, unisci i puntini, quiz sulla sicurezza a casa e a scuola.", '<path d="M9 3h6v4a2 2 0 1 0 0 4v4h-4a2 2 0 1 0-4 0H3V9h4a2 2 0 1 0 0-4V3h2z"/>'),
                 ("Per insegnanti", "Schede didattiche e attività da proporre in classe.", '<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M7 10v5c3 2 7 2 10 0v-5"/>')]
    kc = "".join(f'<article class="kid-card reveal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{p}</svg><h3>{t}</h3><p>{d}</p><span class="state">In arrivo</span></article>' for t, d, p in kid_items)
    page("bambini.html", "Area bambini | Ingenio by Tutor Consulting", "Storie, giochi e schede didattiche con Ingenio e Hazard per imparare la sicurezza fin da piccoli.",
         hero_sub("Impara con <span class='g'>Ingenio</span>", "Ciao! Sono Ingenio. Ti insegno a riconoscere i pericoli prima che diventino guai. Sei pronto?",
                  "Si nasconde dove non guardi: un filo per terra, un gioco lasciato sulle scale.", "Guarda bene, ragiona e chiede aiuto a un adulto.", "assets/img/ingenio-sicurezza-lavoro.webp") + f'''
<section class="kids"><div class="wrap">
<div class="head reveal"><span class="label">Area bambini</span><h2>Materiale didattico</h2><p class="lead">Qui troverai storie, giochi e schede da scaricare. Stiamo preparando i primi materiali.</p></div>
<div class="kid-grid">{kc}</div>
</div></section>
<section><div class="wrap">
<div class="head reveal"><span class="label">Impara con Ingenio</span><h2>Le 3 regole di Ingenio</h2></div>
<ol class="steps" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
<li class="reveal"><h3>Guarda</h3><p>Prima di correre, guarda dove metti i piedi.</p></li>
<li class="reveal"><h3>Pensa</h3><p>Se qualcosa sembra pericoloso, probabilmente lo è.</p></li>
<li class="reveal"><h3>Chiedi</h3><p>Hai un dubbio? Chiedi a un adulto. È il superpotere più forte.</p></li>
</ol>
{duel("Dice: “Dai, non succede niente!”", "Risponde: “Fermati un attimo e guarda bene.”")}
</div></section>
{cta("Sei una scuola o un insegnante?", "Scrivici per portare Ingenio in classe con attività su sicurezza e prevenzione.")}''')

    # Contatti
    page("contatti.html", "Contatti | Ingenio by Tutor Consulting", "Richiedi una consulenza gratuita a Tutor Consulting, Nichelino (TO).",
         hero_sub("Parla <span class='g'>con Ingenio</span>", "Ogni grande impresa inizia da una conversazione. Raccontaci cosa vuoi mettere in ordine.",
                  "Aspetta che rimandi la telefonata.", "Ti risponde e ti aiuta a capire da dove partire.") + f'''
<section><div class="wrap split" style="align-items:start">
<div class="reveal"><h2>Contatti diretti</h2>
<ul class="contact-list">
<li><a href="tel:+3901119665116">011 196 65116</a></li>
<li><a href="tel:+393485291512">348 529 1512</a></li>
<li><a href="mailto:commerciale@tutorconsulting.it">commerciale@tutorconsulting.it</a></li>
<li>Via Vernea 31, 10042 Nichelino (TO)</li>
</ul></div>
<form class="form reveal" action="mailto:commerciale@tutorconsulting.it" method="post" enctype="text/plain">
<label class="full">Ragione sociale *<input name="ragione_sociale" required autocomplete="organization"></label>
<label>Nome referente *<input name="nome" required autocomplete="name"></label>
<label>Cellulare<input name="cellulare" type="tel" autocomplete="tel"></label>
<label>Email *<input name="email" type="email" required autocomplete="email"></label>
<label>Città *<input name="citta" required autocomplete="address-level2"></label>
<label class="full">Di cosa hai bisogno?<select name="area"><option>Non so ancora, consigliatemi</option>{"".join(f"<option>{t}</option>" for _, t, *_ in SERVICES)}<option>Area bambini / scuole</option></select></label>
<label class="full">Messaggio<textarea name="messaggio" rows="5"></textarea></label>
<label class="privacy"><input type="checkbox" required> Acconsento al trattamento dei dati personali per essere ricontattato.</label>
<div class="full"><button class="btn btn-g" type="submit">Invia richiesta {ARROW}</button></div>
</form>
</div></section>''')


build()
print("ok", len(courses()), "corsi")
