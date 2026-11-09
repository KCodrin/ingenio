/* CTA Dock — logica. Struttura e stili: tools/partials/cta-dock.html (inserito in ogni pagina da build.py). */
(() => {
  'use strict';
  if (window.__ctaDockLoaded) return;
  window.__ctaDockLoaded = true;

  const userCfg = window.CTA_DOCK || {};
  const cfg = Object.assign({
    label: 'Parliamo del tuo progetto',
    accent: '#ff5a1f',
    accent2: '#ff2d87',
    whatsapp: '',            // numero internazionale senza +, es. '393331234567'
    phone: '',               // es. '+390212345678'
    email: '',               // es. 'ciao@tuosito.it'
    hours: '',               // es. 'Lun–Ven, 9:00–18:00'
    title: 'Come preferisci parlarci?',
    lead: 'Scegli il canale più comodo per te: telefono, WhatsApp o email.',
    optCallTitle: 'Chiamaci', optCallSub: 'Parla con una persona del nostro team',
    optWaTitle: 'Scrivici su WhatsApp', optWaSub: 'Scrivici quando vuoi',
    optMailTitle: 'Inviaci una email', optMailSub: 'Scrivici con calma',
    callTitle: 'Chiamaci', callLead: '', callNow: 'Chiama l\'ufficio', callMob: 'Chiama il cellulare', callBack: 'Preferisco essere richiamato',
    cbTitle: 'Quando ti richiamiamo?', cbLead: 'Scegli una fascia e lasciaci il tuo numero.',
    cbPhone: 'Il tuo numero di telefono', cbButton: 'Richiamami',
    waTitle: 'Di cosa hai bisogno?', waLead: 'Scegli un argomento: ti apriamo la chat già pronta.',
    waMsg: 'Aggiungi un messaggio (facoltativo)', waButton: 'Apri WhatsApp',
    mailTitle: 'Scrivici una email', mailLead: 'Dicci di cosa hai bisogno e ti rispondiamo.',
    mailName: 'Il tuo nome', mailEmail: 'La tua email', mailMsg: 'Il tuo messaggio', mailButton: 'Invia email',
    mailSubject: 'Richiesta dal sito',
    topics: [['Preventivo', 'un preventivo'], ['Formazione', 'informazioni sui corsi'], ['Consulenza', 'una consulenza'], ['Altro', 'parlare con voi']],
    times: ['Appena possibile', 'Mattina', 'Pomeriggio', 'Sera'],
    closeText: 'Chiudi',
    errPhone: 'Inserisci un numero di telefono valido.',
    errEmail: 'Inserisci un indirizzo email valido.',
    errMsg: 'Scrivi almeno due parole.',
    errSend: 'Qualcosa non ha funzionato, riprova tra poco.',
    doneCallTitle: 'Ti richiamiamo noi!',
    doneWaTitle: 'Ci vediamo su WhatsApp', doneWaText: 'Abbiamo aperto la chat con il messaggio già pronto: tocca Invia.', doneWaLink: 'Non si è aperto? Tocca qui',
    doneMailTitle: 'Messaggio inviato!', doneMailText: 'Grazie, ti rispondiamo il prima possibile.',
    doneMailtoTitle: 'Quasi fatto!', doneMailtoText: 'Si è aperto il tuo programma di posta: premi Invia per completare.', doneMailLink: 'Riapri la email',
    onSubmit: null,          // async (data) => {...}
    onEvent: null            // (nome, dati) => {...}  per statistiche
  }, userCfg);
  cfg.callLead = cfg.callLead || cfg.hours;

  const ICON = {
    up: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 11l6-6 6 6"/><path d="M6 19l6-6 6 6"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    check: '<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>'
  };



  function boot() {
    const tpl = document.getElementById('cta-dock-template');
    if (!tpl) return;
    const host = document.createElement('div');
    host.setAttribute('data-cta-dock', '');
    host.style.cssText = 'all:initial';
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    root.appendChild(tpl.content.cloneNode(true));
    const rootEl = root.querySelector('.root');
    if (userCfg.accent) rootEl.style.setProperty('--a', cfg.accent);
    if (userCfg.accent2) rootEl.style.setProperty('--a2', cfg.accent2);

    const $ = (s) => root.querySelector(s);
    const dock = $('.dock'), face = $('.face'), ring = $('.ring'), pill = $('.pill'),
          lbl = $('.lbl'), gauge = $('.gauge'), panel = $('.panel'), panelIn = $('.panel-in'),
          veil = $('.veil'), xBtn = $('.x'), homeT = $('.home-t'), optsEl = $('.opts'),
          progBar = $('.prog i');

    const shell = $('.shell');

    // ---- testi dalla configurazione ----
    root.querySelectorAll('[data-t]').forEach((el) => { el.textContent = cfg[el.dataset.t] || ''; });
    root.querySelectorAll('[data-ph]').forEach((el) => {
      el.placeholder = cfg[el.dataset.ph] || '';
      el.setAttribute('aria-label', el.placeholder);
    });
    lbl.textContent = gauge.textContent = cfg.label;
    panel.setAttribute('aria-label', cfg.title);

    // ---- utilità ----
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const vv = window.visualViewport;
    const vh = () => (vv ? vv.height : window.innerHeight);
    const vw = () => document.documentElement.clientWidth || window.innerWidth;
    const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
    const track = (name, data) => { try { typeof cfg.onEvent === 'function' && cfg.onEvent(name, data || {}); } catch (e) {} };

    const H0 = 56;
    let closedW = 0, targetClosedW = 0, openW = 0, openH = 0, openHT = 0, kb = 0;
    let collapsed = false, isOpen = false, openedAt = 0;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let cwv = 0, ohv = 0, pr = 0, prv = 0, prT = 0;   // velocità molle: larghezza, altezza, pressione
    const ctx = { label: cfg.label, title: cfg.title };
    const st = { p: 0, v: 0, target: 0, drag: false, raf: 0, last: 0 };

    // ---- schermate (passaggi) ----
    const views = {};
    root.querySelectorAll('.view').forEach((v) => { views[v.dataset.view] = v; });
    const PROG = { home: 0.2, call: 0.5, callback: 0.8, wa: 0.6, mail: 0.6, done: 1 };
    let cur = 'home', stack = [];

    // ---- misure ----
    function setClosedTarget() {
      const full = Math.min(gauge.offsetWidth + 76, window.innerWidth - 32);
      targetClosedW = collapsed ? H0 : full;
    }
    function fit(instant) {
      openHT = vh();   // a schermo intero
      if (instant || (!isOpen && st.p < 0.02)) { openH = openHT; ohv = 0; }
      kick();
    }
    function measure() {
      openW = vw();    // a schermo intero
      panel.style.width = openW + 'px';
      setClosedTarget();
      fit(true);
    }

    function show(name, dir) {
      views[cur].classList.remove('active', 'fwd', 'rev');
      cur = name;
      const v = views[name];
      v.classList.remove('fwd', 'rev');
      v.classList.add('active');
      if (dir) v.classList.add(dir);
      progBar.style.transform = 'scaleX(' + PROG[name] + ')';
      panel.scrollTop = 0;
      fit();
      if (isOpen && dir) setTimeout(() => v.focus({ preventScroll: true }), 30);
    }
    function go(name) { stack.push(cur); show(name, 'fwd'); }
    function back() { if (stack.length) show(stack.pop(), 'rev'); }

    function showDone(title, text, href, linkText) {
      const v = views.done;
      v.querySelector('.done-t').textContent = title;
      v.querySelector('.done-p').textContent = text;
      const a = v.querySelector('.done-link');
      if (href) {
        a.href = href;
        a.target = /^https?:/.test(href) ? '_blank' : '_self';
        a.rel = 'noopener';
        a.textContent = linkText || '';
        a.hidden = false;
      } else a.hidden = true;
      stack = [];
      show('done', 'fwd');
    }

    function resetFlow() {
      root.querySelectorAll('form.frm').forEach((f) => {
        f.reset();
        lock(f, false);
        const p = f.querySelector('.err');
        if (p) p.hidden = true;
      });
      root.querySelectorAll('[data-group]').forEach((g) => {
        g.querySelectorAll('.chip').forEach((c, i) => c.setAttribute('aria-pressed', String(g.dataset.group === 'when' && i === 0)));
      });
      stack = [];
      show('home', null);
    }

    // ---- le 3 scelte iniziali ----
    const optDefs = [
      { id: 'call', ok: !!(cfg.phone || cfg.onSubmit), icon: ICON.phone, t: cfg.optCallTitle, s: cfg.optCallSub },
      { id: 'wa', ok: !!cfg.whatsapp, icon: ICON.chat, t: cfg.optWaTitle, s: cfg.optWaSub },
      { id: 'mail', ok: !!(cfg.email || cfg.onSubmit), icon: ICON.mail, t: cfg.optMailTitle, s: cfg.optMailSub }
    ];
    optDefs.filter((o) => o.ok).forEach((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.dataset.go = o.id;
      b.innerHTML = '<span class="ic">' + o.icon + '</span><span class="tx"><b></b><small></small></span>' + ICON.chev;
      b.querySelector('b').textContent = o.t;
      b.querySelector('small').textContent = o.s;
      optsEl.appendChild(b);
    });
    optsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.opt');
      if (!b) return;
      buzz(8);
      track('choose', { channel: b.dataset.go });
      if (b.dataset.go === 'call') go(cfg.phone ? 'call' : 'callback');
      else go(b.dataset.go);
    });

    // ---- passaggio "Chiamaci" ----
    const callNow = $('.call-now');
    if (cfg.phone) {
      callNow.href = 'tel:+39' + String(cfg.phone).replace(/\D/g, '');
      callNow.querySelector('.num').textContent = cfg.phone;
      callNow.addEventListener('click', () => track('call_now', {}));
    } else callNow.hidden = true;
    const callMob = $('.call-mob');
    if (cfg.mobile) {
      callMob.href = 'tel:+39' + String(cfg.mobile).replace(/\D/g, '');
      callMob.querySelector('.num2').textContent = cfg.mobile;
    } else callMob.hidden = true;
    const toCb = $('.to-cb');
    if (!cfg.onSubmit) toCb.hidden = true;
    toCb.addEventListener('click', () => go('callback'));

    // ---- chip (fascia oraria / argomento) ----
    function buildChips(el, items, preselect) {
      items.forEach((it, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.textContent = Array.isArray(it) ? it[0] : it;
        b.dataset.value = Array.isArray(it) ? it[1] : it;
        b.setAttribute('aria-pressed', String(preselect && i === 0));
        el.appendChild(b);
      });
    }
    buildChips($('[data-group=when]'), cfg.times, true);
    buildChips($('[data-group=topic]'), cfg.topics, false);
    const chosen = (g) => {
      const c = root.querySelector('[data-group="' + g + '"] .chip[aria-pressed="true"]');
      return c ? c.dataset.value : '';
    };

    panel.addEventListener('click', (e) => {
      if (e.target.closest('.go-back')) { back(); return; }
      if (e.target.closest('.done-close')) { setOpen(false); return; }
      const c = e.target.closest('.chip');
      if (c) {
        const g = c.parentElement, was = c.getAttribute('aria-pressed') === 'true';
        g.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', 'false'));
        c.setAttribute('aria-pressed', String(g.dataset.group === 'topic' ? !was : true));
        buzz(6);
      }
    });

    // ---- moduli ----
    function setErr(f, msg) {
      const p = f.querySelector('.err');
      if (p) { p.textContent = msg || ''; p.hidden = !msg; }
      fit();
    }
    function lock(f, on) { f.querySelectorAll('button,input,textarea').forEach((n) => { n.disabled = on; }); }
    async function submitData(f, payload, ok) {
      setErr(f, '');
      lock(f, true);
      try {
        if (typeof cfg.onSubmit === 'function') await cfg.onSubmit(payload);
        track('submit', payload);
        buzz([12, 40, 12]);
        lock(f, false);
        ok();
      } catch (ex) {
        lock(f, false);
        setErr(f, cfg.errSend);
      }
    }

    root.querySelectorAll('form.frm').forEach((f) => f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const kind = f.dataset.form;

      if (kind === 'callback') {
        const phone = f.elements.phone.value.trim(), when = chosen('when');
        if (phone.replace(/\D/g, '').length < 6) { setErr(f, cfg.errPhone); f.elements.phone.focus(); return; }
        await submitData(f, { channel: 'call', phone: phone, when: when }, () =>
          showDone(cfg.doneCallTitle, 'Ti chiamiamo al ' + phone + (when ? ' — ' + when.toLowerCase() : '') + '.'));

      } else if (kind === 'wa') {
        const topic = chosen('topic'), msg = f.elements.msg.value.trim();
        const text = 'Ciao! ' + (topic ? 'Vorrei ' + topic + '.' : 'Vorrei qualche informazione.') + (msg ? '\n\n' + msg : '');
        const url = 'https://wa.me/' + String(cfg.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
        track('whatsapp', { topic: topic, message: msg });
        const w = window.open(url, '_blank');
        if (w) w.opener = null; else window.location.href = url;
        showDone(cfg.doneWaTitle, cfg.doneWaText, url, cfg.doneWaLink);

      } else if (kind === 'mail') {
        const name = f.elements['name'].value.trim(), email = f.elements.email.value.trim(), msg = f.elements.msg.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr(f, cfg.errEmail); f.elements.email.focus(); return; }
        if (msg.length < 2) { setErr(f, cfg.errMsg); f.elements.msg.focus(); return; }
        if (typeof cfg.onSubmit === 'function') {
          await submitData(f, { channel: 'email', name: name, email: email, message: msg }, () =>
            showDone(cfg.doneMailTitle, cfg.doneMailText));
        } else {
          const url = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(cfg.mailSubject) +
            '&body=' + encodeURIComponent(msg + '\n\n— ' + (name ? name + ' ' : '') + '(' + email + ')');
          track('email', { name: name, email: email, message: msg });
          window.location.href = url;
          showDone(cfg.doneMailtoTitle, cfg.doneMailtoText, url, cfg.doneMailLink);
        }
      }
    }));

    // ---- rendering: tutto dipende da un solo numero, p (0 = pulsante, 1 = pannello) ----
    function render() {
      const p = st.p, pc = clamp(p);
      const wp = p >= 1 ? p : 1 - Math.pow(1 - pc, 1.8);   // la larghezza anticipa l'altezza
      const W = Math.min(vw(), lerp(closedW, openW, wp));
      const H = Math.max(44, Math.min(vh(), lerp(H0, openH, p)));
      dock.style.width = W + 'px';
      dock.style.height = H + 'px';
      dock.style.bottom = 'calc(' + (lerp(14, 0, pc) + kb).toFixed(2) + 'px + env(safe-area-inset-bottom, 0px) * ' + (1 - pc).toFixed(3) + ')';
      shell.style.borderRadius = lerp(28, 0, pc).toFixed(1) + 'px';
      dock.style.transform = 'translate3d(calc(-50% + ' + (mx * (1 - pc)).toFixed(2) + 'px), ' + (my * (1 - pc)).toFixed(2) + 'px, 0) scale(' + (1 - 0.07 * pr * (1 - pc)).toFixed(4) + ')';
      face.style.opacity = 1 - clamp(p * 2.2);
      pill.style.opacity = 1 - clamp(p * 4);
      pill.style.filter = p > 0.005 ? 'blur(' + (clamp(p * 4) * 6).toFixed(1) + 'px)' : 'none';
      ring.style.opacity = 1 - clamp(p * 5);
      panel.style.height = openH + 'px';
      const rv = clamp((p - 0.25) / 0.55);
      panel.style.opacity = rv;
      panel.style.filter = rv < 1 ? 'blur(' + ((1 - rv) * 10).toFixed(1) + 'px)' : 'none';
      panel.style.transform = 'translate(-50%, ' + ((1 - pc) * 28).toFixed(1) + 'px) scale(' + (0.9 + 0.1 * rv).toFixed(3) + ')';
      panel.style.visibility = p > 0.02 ? 'visible' : 'hidden';
      panel.style.pointerEvents = p > 0.85 ? 'auto' : 'none';
      pill.style.pointerEvents = p > 0.15 ? 'none' : 'auto';
      veil.style.opacity = (pc * 0.5).toFixed(3);
      veil.style.visibility = p > 0.002 ? 'visible' : 'hidden';
      veil.style.pointerEvents = p > 0.3 ? 'auto' : 'none';
    }

    // ---- animazione a molla ----
    function tick(t) {
      st.raf = 0;
      const dt = Math.min(0.033, Math.max(0, (t - (st.last || t)) / 1000));
      st.last = t;
      let busy = false;

      if (!st.drag) {
        if (reduce) { st.p = st.target; st.v = 0; }
        else {
          const c = st.target ? 19 : 26;                       // apre con rimbalzo, chiude più composto
          const a = -240 * (st.p - st.target) - c * st.v;      // rigidità, smorzamento
          st.v += a * dt;
          st.p += st.v * dt;
          if (Math.abs(st.p - st.target) > 0.0008 || Math.abs(st.v) > 0.01) busy = true;
          else { st.p = st.target; st.v = 0; }
        }
      }
      // larghezza del pulsante chiuso (si stringe / si allarga come una pillola elastica)
      if (reduce) closedW = targetClosedW;
      else {
        cwv += (-260 * (closedW - targetClosedW) - 22 * cwv) * dt;
        closedW += cwv * dt;
        if (Math.abs(closedW - targetClosedW) > 0.3 || Math.abs(cwv) > 1) busy = true; else { closedW = targetClosedW; cwv = 0; }
      }
      // altezza del pannello quando cambia passaggio
      if (reduce) openH = openHT;
      else {
        ohv += (-210 * (openH - openHT) - 19 * ohv) * dt;
        openH += ohv * dt;
        if (Math.abs(openH - openHT) > 0.3 || Math.abs(ohv) > 1) busy = true; else { openH = openHT; ohv = 0; }
      }
      // schiacciamento quando premi (e rimbalzo quando rilasci)
      if (reduce) { pr = prT; prv = 0; }
      else {
        prv += (-320 * (pr - prT) - 16 * prv) * dt;
        pr += prv * dt;
        if (Math.abs(pr - prT) > 0.002 || Math.abs(prv) > 0.01) busy = true; else { pr = prT; prv = 0; }
      }

      const ex = tx - mx, ey = ty - my;
      if (Math.abs(ex) > 0.05 || Math.abs(ey) > 0.05) { mx += ex * 0.18; my += ey * 0.18; busy = true; } else { mx = tx; my = ty; }

      render();
      if (busy) st.raf = requestAnimationFrame(tick); else st.last = 0;
    }
    function kick() { if (!st.raf) { st.last = 0; st.raf = requestAnimationFrame(tick); } }

    // ---- apri / chiudi ----
    function setOpen(o, v) {
      const was = isOpen;
      isOpen = o;
      st.target = o ? 1 : 0;
      st.v = v || 0;
      panel.inert = !o;
      pill.setAttribute('aria-expanded', String(o));
      if (o) { tx = ty = 0; }
      if (o && !was) {
        openedAt = performance.now();
        homeT.textContent = ctx.title;
        if (cur === 'home') {   // riparte l'animazione di entrata delle 3 scelte
          views.home.classList.remove('active');
          void views.home.offsetWidth;
          views.home.classList.add('active');
        }
        fit();
        buzz(10);
        track('open', {});
        setTimeout(() => { if (isOpen) panel.focus({ preventScroll: true }); }, 320);
      }
      if (!o && was) {
        pill.focus({ preventScroll: true });
        setTimeout(() => { if (!isOpen) resetFlow(); }, 650);
      }
      kick();
    }

    // ---- gesto di trascinamento (dito o mouse) ----
    let drag = null, samples = [], travel = 300;
    function startDrag(e, mode) {
      if (e.button !== undefined && e.button !== 0) return;
      travel = Math.max(120, Math.min(openH - H0, 460));   // il gesto non deve coprire tutto lo schermo
      drag = { x: e.clientX, y: e.clientY, moved: false, mode: mode };
      samples = [{ t: performance.now(), y: e.clientY }];
      if (mode === 'open') { prT = 1; kick(); }
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    }
    function onMove(e) {
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dy) < 6 && Math.abs(e.clientX - drag.x) < 6) return;
        drag.moved = true;
        st.drag = true;
        prT = 0;
      }
      const now = performance.now();
      samples.push({ t: now, y: e.clientY });
      while (samples.length > 2 && samples[0].t < now - 100) samples.shift();
      let p;
      if (drag.mode === 'open') {
        const up = -dy / travel;
        p = up < 0 ? up * 0.15 : up;
        if (p > 1) p = 1 + (p - 1) * 0.12;
      } else {
        const down = dy / travel;
        p = down > 0 ? 1 - down : 1 - down * 0.12;
      }
      st.p = clamp(p, -0.1, 1.12);
      st.v = 0;
      render();
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      const d = drag; drag = null;
      if (!d) return;
      st.drag = false;
      prT = 0; kick();
      if (!d.moved) { if (d.mode === 'open') setOpen(true, 2.2); return; }
      const a = samples[0], b = samples[samples.length - 1];
      const vy = b.t > a.t ? (a.y - b.y) / (b.t - a.t) * 1000 : 0;   // px/s, positivo = verso l'alto
      const vp = vy / travel;
      const open = vp > 1.0 ? true : vp < -1.0 ? false : st.p > 0.5;
      setOpen(open, vp);
    }

    pill.addEventListener('pointerdown', (e) => startDrag(e, 'open'));
    pill.addEventListener('click', (e) => { if (e.detail === 0) setOpen(true, 2.2); });   // tastiera
    panel.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.drag') || e.target.closest('button,a,input,textarea')) return;
      startDrag(e, 'close');
    });
    xBtn.addEventListener('click', () => setOpen(false));
    veil.addEventListener('click', () => { if (performance.now() - openedAt > 350) setOpen(false); });
    veil.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    veil.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) setOpen(false); });
    panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [...panel.querySelectorAll('button,a[href],input,textarea')].filter((n) => !n.disabled && !n.hidden && n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], active = root.activeElement;
      if (e.shiftKey && (active === first || active === panel || active.classList.contains('view'))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    });

    // (nessun effetto al passaggio del mouse: il pulsante resta fermo finché non lo tocchi)

    // ---- si fa piccolo mentre scorri verso il basso, torna intero se risali o ti fermi ----
    function setCollapsed(v) {
      if (collapsed === v || isOpen) return;
      collapsed = v;
      dock.classList.toggle('collapsed', v);
      setClosedTarget();
      kick();
    }
    let lastY = window.scrollY, acc = 0, idleT = 0;
    window.addEventListener('scroll', () => {
      if (isOpen) return;
      const y = window.scrollY, d = y - lastY;
      lastY = y;
      if (d > 0) { acc += d; if (acc > 60 && y > 160) setCollapsed(true); }
      else if (d < 0) { acc = 0; setCollapsed(false); }
      clearTimeout(idleT);
      idleT = setTimeout(() => { acc = 0; setCollapsed(false); }, 1100);
    }, { passive: true });

    // ---- testo contestuale in base alla sezione visibile ----
    const sections = [...document.querySelectorAll('[data-cta]')];
    if (sections.length && 'IntersectionObserver' in window) {
      const ratios = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => ratios.set(en.target, en.intersectionRatio));
        let best = null, br = 0;
        ratios.forEach((r, el) => { if (r > br) { br = r; best = el; } });
        const label = (best && best.dataset.cta) || cfg.label;
        ctx.title = (best && best.dataset.ctaTitle) || cfg.title;
        if (label !== ctx.label) {
          ctx.label = label;
          lbl.classList.add('out');
          setTimeout(() => {
            lbl.textContent = gauge.textContent = ctx.label;
            setClosedTarget();
            lbl.classList.remove('out');
            kick();
          }, 160);
        }
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
      sections.forEach((el) => io.observe(el));
    }

    // ---- ridimensionamenti e tastiera mobile ----
    let rT = 0;
    window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { measure(); kick(); }, 60); });
    if (vv) {
      const onVV = () => {
        const k = vv.scale > 1.01 ? 0 : Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        if (Math.abs(k - kb) > 0.5) { kb = k; kick(); }
      };
      vv.addEventListener('resize', () => { onVV(); measure(); kick(); });
      vv.addEventListener('scroll', onVV);
    }

    // ---- in Home il pulsante resta nascosto finché si vede la barra della hero, per non sovrapporsi ----
    const heroBar = document.querySelector('.hero-bar');
    if (heroBar && 'IntersectionObserver' in window) {
      host.style.transition = 'opacity .3s';
      new IntersectionObserver(([en]) => {
        const hide = en.isIntersecting && !isOpen;
        host.style.opacity = hide ? '0' : '1';
        host.style.pointerEvents = hide ? 'none' : '';
        host.inert = hide;
      }).observe(heroBar);
    }

    // ---- avvio ----
    panel.inert = true;
    measure();
    closedW = targetClosedW;
    openH = openHT;
    render();
    if (!reduce) setTimeout(() => { if (!isOpen && !drag && st.p === 0) { st.v = 1.6; kick(); } }, 1900);   // piccolo "saltello" per far capire che è trascinabile
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();