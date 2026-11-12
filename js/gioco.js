/* Accademia di Ingenio: prototipo del gioco. Dati in #gameData (da tools/data/gioco.json), progressi solo nel browser. */
(function () {
  "use strict";
  var DATA = JSON.parse(document.getElementById("gameData").textContent);
  var KEY = "ingenio-accademia";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var mapEl = $("#gameMap"), statsEl = $("#gameStats"), L = $("#gameLesson");
  var ING = "assets/img/accademia/ingenio.webp";
  var GOAL = 50, SHIELDS = 3, BOSS_N = 8, BOSS_SEC = 20;
  var LEVELS = [[0, "Recluta"], [100, "Osservatore"], [300, "Sentinella"], [600, "Guardiano"], [1000, "Eroe della sicurezza"]];
  var BADGES = [
    ["prima", "Primo passo", "Completa la tua prima tappa"],
    ["stelle", "Tre stelle", "Completa una tappa senza errori"],
    ["perfetto", "Perfezionista", "Tre stelle in tutte le tappe di un'isola"],
    ["occhio", "Occhio di falco", "Nessun errore nella tappa sui segnali"],
    ["combo5", "Inarrestabile", "5 risposte giuste di fila"],
    ["obiettivo", "Costante", "Raggiungi l'obiettivo del giorno"],
    ["serie3", "Tre giorni", "Gioca 3 giorni di fila"],
    ["serie7", "Una settimana", "Gioca 7 giorni di fila"],
    ["palestra", "Allenato", "Completa un ripasso in Palestra"],
    ["isola", "Pronto all'emergenza", "Vinci la sfida finale dell'isola"]
  ];

  // ---------- Stato salvato (solo su questo dispositivo; se il browser lo blocca il gioco funziona lo stesso) ----------
  var st = { xp: 0, done: {}, streak: { n: 0, last: "", freeze: 0 }, daily: { date: "", pts: 0 }, badges: {}, review: {}, boss: {}, sound: true };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) { for (var k in saved) st[k] = saved[k]; } } catch (e) {}
  st.streak.freeze = st.streak.freeze || 0;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function day(off) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + (off || 0)); return d.toISOString().slice(0, 10); }
  function gap(a) { return a ? Math.round((new Date(day()) - new Date(a)) / 864e5) : 99; }
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 11 11c0-4 1-9 1-9z"/></svg>',
    ice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10M9 3.5l3 2 3-2M9 20.5l3-2 3 2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 4 5v6c0 5.2 3.4 9.4 8 11 4.6-1.6 8-5.8 8-11V5l-8-3z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17v.5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M19 19v2H6"/></svg>',
    gym: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>'
  };

  // ---------- Effetti: suoni sintetizzati (nessun file), vibrazione, coriandoli, avvisi ----------
  var ac;
  function tone(notes) {
    if (!st.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      notes.forEach(function (n, i) {
        var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.09;
        o.type = n[1] || "sine"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.3);
      });
    } catch (e) {}
  }
  var SFX = { ok: [[660], [880]], ko: [[220, "square"], [170, "square"]], combo: [[660], [880], [1100]], win: [[523], [659], [784], [1047]], lose: [[300, "triangle"], [240, "triangle"], [180, "triangle"]] };
  function buzz(p) { if (navigator.vibrate && !calm) { try { navigator.vibrate(p); } catch (e) {} } }
  function confetti() {
    if (calm) return;
    var box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
    var cols = ["#00e676", "#ffffff", "#ffb020", "#1de9b6"];
    for (var i = 0; i < 70; i++) {
      var s = document.createElement("i");
      s.style.cssText = "left:" + Math.random() * 100 + "%;background:" + cols[i % 4] + ";animation-delay:" + Math.random() * 0.4 + "s;animation-duration:" + (1.6 + Math.random()) + "s;--r:" + (Math.random() * 720 - 360) + "deg;--x:" + (Math.random() * 160 - 80) + "px";
      box.appendChild(s);
    }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 3000);
  }
  var toastQ = [], toasting = false;
  function toast(html) { toastQ.push(html); if (!toasting) nextToast(); }
  function nextToast() {
    var h = toastQ.shift(); if (!h) { toasting = false; return; }
    toasting = true;
    var t = document.createElement("div"); t.className = "g-toast"; t.setAttribute("role", "status"); t.innerHTML = h;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); nextToast(); }, 400); }, 2600);
  }
  function badge(id) {
    if (st.badges[id]) return;
    st.badges[id] = day();
    var b = BADGES.filter(function (x) { return x[0] === id; })[0];
    toast('<span class="t-ico">' + ICON.star + "</span><div><small>Nuovo badge</small><b>" + esc(b[1]) + "</b></div>");
  }

  // ---------- Livelli, serie, obiettivo del giorno ----------
  function level() {
    var i = 0; while (i + 1 < LEVELS.length && st.xp >= LEVELS[i + 1][0]) i++;
    var next = LEVELS[i + 1];
    return { i: i, name: LEVELS[i][1], pct: next ? (st.xp - LEVELS[i][0]) / (next[0] - LEVELS[i][0]) * 100 : 100, next: next };
  }
  function streakNow() {
    var g = gap(st.streak.last);
    return g <= 1 || (g === 2 && st.streak.freeze > 0) ? st.streak.n : 0;
  }
  function daily() { if (st.daily.date !== day()) st.daily = { date: day(), pts: 0 }; return st.daily; }
  function addPoints(p) {
    var lv = level().i, d = daily(), before = d.pts;
    st.xp += p; d.pts += p;
    if (before < GOAL && d.pts >= GOAL) { badge("obiettivo"); toast('<span class="t-ico">' + ICON.check + "</span><div><small>Obiettivo del giorno</small><b>Raggiunto, ottimo lavoro</b></div>"); }
    if (level().i > lv) toast('<span class="t-ico lv">' + ICON.bolt + "</span><div><small>Nuovo grado</small><b>" + esc(level().name) + "</b></div>");
  }
  function playedToday() {
    var g = gap(st.streak.last);
    if (g === 0) return;
    // Il salva-serie copre un solo giorno saltato
    if (g === 1) st.streak.n++;
    else if (g === 2 && st.streak.freeze > 0) { st.streak.freeze--; st.streak.n++; toast('<span class="t-ico ice">' + ICON.ice + "</span><div><small>Salva-serie usato</small><b>La tua serie è salva</b></div>"); }
    else st.streak.n = 1;
    st.streak.last = day();
    if (st.streak.n % 5 === 0 && st.streak.freeze < 2) { st.streak.freeze++; toast('<span class="t-ico ice">' + ICON.ice + "</span><div><small>Hai guadagnato</small><b>Un salva-serie</b></div>"); }
    if (st.streak.n >= 3) badge("serie3");
    if (st.streak.n >= 7) badge("serie7");
  }

  // ---------- Palestra: ripasso delle domande sbagliate nei giorni dopo ----------
  var BOX = [1, 3, 7];
  function qKey(t, i) { return t.id + "-" + i; }
  function findQ(key) {
    var r = null;
    DATA.isole.forEach(function (isola) { isola.tappe.forEach(function (t) { t.domande.forEach(function (q, i) { if (qKey(t, i) === key) r = q; }); }); });
    return r;
  }
  function dueKeys() { return Object.keys(st.review).filter(function (k) { return st.review[k].due <= day() && findQ(k); }); }

  // ---------- Mappa ----------
  function renderStats() {
    var lv = level(), s = streakNow(), d = daily(), ring = Math.min(1, d.pts / GOAL);
    statsEl.innerHTML =
      '<div class="g-me lv' + lv.i + '"><img src="' + ING + '" alt="" width="64" height="64"><div><small>Grado</small><b>' + esc(lv.name) + '</b>' +
      '<span class="g-lvbar"><i style="width:' + lv.pct + '%"></i></span><small>' + (lv.next ? st.xp + " / " + lv.next[0] + " punti" : st.xp + " punti, grado massimo") + "</small></div></div>" +
      '<div class="g-chips">' +
      '<span class="gs fl" title="Giorni di fila">' + ICON.flame + "<b>" + s + "</b> " + (s === 1 ? "giorno" : "giorni") + (st.streak.freeze ? ' <em class="ice" title="Salva-serie">' + ICON.ice + st.streak.freeze + "</em>" : "") + "</span>" +
      '<span class="gs goal"><svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15"/><circle cx="18" cy="18" r="15" style="stroke-dashoffset:' + (94.2 * (1 - ring)) + '"/></svg><b>' + Math.min(d.pts, GOAL) + "/" + GOAL + "</b> obiettivo di oggi</span>" +
      '<button type="button" class="gs snd" data-sound aria-pressed="' + st.sound + '" aria-label="Suoni ' + (st.sound ? "attivi" : "spenti") + '">' + (st.sound ? ICON.sound : ICON.mute) + "</button></div>";
  }

  function stars(n) { var h = ""; for (var i = 0; i < 3; i++) h += '<i class="' + (i < n ? "on" : "") + '">' + ICON.star + "</i>"; return '<span class="stars" aria-label="' + n + ' stelle su 3">' + h + "</span>"; }

  function renderMap() {
    renderStats();
    var due = dueKeys().length, tot = Object.keys(st.review).length;
    var gym = '<article class="gym"><span class="gym-ico">' + ICON.gym + '</span><div><b>Palestra di Ingenio</b><p>' +
      (due ? due + (due === 1 ? " domanda da ripassare oggi." : " domande da ripassare oggi.") : tot ? "Nessun ripasso per oggi. Le domande sbagliate tornano nei prossimi giorni." : "Qui tornano le domande che sbagli, finché non le sai bene.") +
      "</p></div>" + (due ? '<button type="button" class="btn btn-g" data-gym>Allenati</button>' : "") + "</article>";
    var islands = DATA.isole.map(function (isola) {
      var open = true, all = true;
      var nodes = isola.tappe.map(function (t, n) {
        var d = st.done[t.id], cls = d ? "done" : open ? "now" : "lock";
        if (!d) { all = false; open = false; }
        return '<li class="node ' + cls + '"><button type="button" data-tappa="' + t.id + '"' + (cls === "lock" ? " disabled" : "") + ">" +
          '<span class="dot">' + (d ? ICON.check : cls === "lock" ? ICON.lock : n + 1) + "</span>" +
          '<span class="nt"><b>' + esc(t.titolo) + "</b>" + (d ? stars(d.stars || 1) + "<small>Rigioca per migliorare</small>" : "<small>" + (cls === "lock" ? "Completa la tappa prima" : (t.lezione ? t.lezione.length + " schede e " : "") + t.domande.length + " domande · circa " + (t.lezione ? 4 : 2) + " minuti") + "</small>") + "</span></button></li>";
      }).join("");
      var won = st.boss[isola.id], bcls = won ? "done" : all ? "now" : "lock";
      nodes += '<li class="node boss ' + bcls + '"><button type="button" data-boss="' + isola.id + '"' + (bcls === "lock" ? " disabled" : "") + ">" +
        '<span class="dot">' + (won ? ICON.check : bcls === "lock" ? ICON.lock : ICON.warn) + "</span>" +
        '<span class="nt"><b>' + esc(isola.boss.titolo) + " · Scaccia Hazard</b><small>" + (won ? "Vinta. Rigiocala quando vuoi" : bcls === "lock" ? "Si sblocca dopo tutte le tappe" : BOSS_N + " domande a tempo, 3 scudi") + "</small></span></button></li>";
      return '<article class="island"><header><span class="label">Isola</span><h2>' + esc(isola.titolo) + '</h2><p class="lead">' + esc(isola.sottotitolo) + "</p></header>" +
        '<ol class="path">' + nodes + "</ol>" +
        (won ? '<div class="badge-won"><span class="medal">' + ICON.star + '</span><div><b>Badge conquistato · ' + esc(isola.badge) + "</b><p>Hai scacciato Hazard dall'isola. Vuoi una formazione certificata su questi temi?</p>" +
          '<div class="bw-act"><a class="btn btn-g" href="' + isola.corso.href + '">' + esc(isola.corso.testo) + '</a><button type="button" class="btn" data-cert="' + isola.id + '">Il tuo attestato</button></div></div></div>' : "") + "</article>";
    }).join("");
    var wall = '<section class="wall" aria-labelledby="wallT"><h2 id="wallT">I tuoi badge</h2><p class="lead">' + Object.keys(st.badges).length + " di " + BADGES.length + " conquistati</p><ul>" +
      BADGES.map(function (b) { var on = st.badges[b[0]]; return '<li class="' + (on ? "on" : "") + '"><span class="bi">' + (on ? ICON.star : ICON.lock) + "</span><b>" + esc(b[1]) + "</b><small>" + esc(b[2]) + "</small></li>"; }).join("") + "</ul></section>";
    var levels = '<section class="wall levels" aria-labelledby="lvT"><h2 id="lvT">I gradi di Ingenio</h2><p class="lead">Ogni grado accende un nuovo alone attorno a Ingenio.</p><ol>' +
      LEVELS.map(function (l, i) { return '<li class="lv' + i + (level().i >= i ? " on" : "") + '"><span class="av"><img src="' + ING + '" alt="" width="56" height="56" loading="lazy"></span><b>' + esc(l[1]) + "</b><small>" + l[0] + " punti</small></li>"; }).join("") + "</ol></section>";
    mapEl.innerHTML = gym + islands + '<p class="game-soon">Nuove isole in arrivo · chi fa cosa, i DPI, i rischi specifici e molto altro.</p>' + wall + levels;
  }

  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-tappa]"))) DATA.isole.forEach(function (i) { i.tappe.forEach(function (t) { if (t.id === b.dataset.tappa) startTappa(i, t); }); });
    else if ((b = e.target.closest("[data-boss]"))) DATA.isole.forEach(function (i) { if (i.id === b.dataset.boss) startBoss(i); });
    else if (e.target.closest("[data-gym]")) startGym();
    else if ((b = e.target.closest("[data-cert]"))) DATA.isole.forEach(function (i) { if (i.id === b.dataset.cert) certForm(i); });
    else if (e.target.closest("[data-sound]")) { st.sound = !st.sound; save(); renderStats(); if (st.sound) tone(SFX.ok); }
  });

  // ---------- Lezione (tappa, sfida finale, palestra) ----------
  var cur, timer;
  function open() { L.hidden = false; document.documentElement.classList.add("game-open"); }
  function close() { clearInterval(timer); L.hidden = true; document.documentElement.classList.remove("game-open"); renderMap(); }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !L.hidden) close(); });
  L.addEventListener("click", function (e) { if (e.target.closest("[data-exit]")) close(); });

  function shields() {
    if (cur.mode === "gym") return "";
    var h = ""; for (var i = 0; i < SHIELDS; i++) h += '<i class="' + (i < cur.shields ? "on" : "") + '">' + ICON.shield + "</i>";
    return '<span class="g-shields" aria-label="' + cur.shields + ' scudi rimasti">' + h + "</span>";
  }
  function shell(body, foot, pct, quiz) {
    var hz = cur && cur.queue ? Math.max(0, 100 - cur.right / cur.total * 100) : 100;
    L.innerHTML = '<div class="gl-top"><button type="button" class="gl-x" data-exit aria-label="Esci">' + ICON.x + '</button>' +
      '<div class="gl-bar" role="progressbar" aria-label="Avanzamento" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><i style="width:' + pct + '%"></i></div>' + (quiz ? shields() : "") + "</div>" +
      (quiz && cur.mode !== "gym" ? '<div class="gl-hz"><span>' + ICON.warn + 'Hazard</span><span class="hzbar"><i style="width:' + hz + '%"></i></span>' + (cur.combo >= 3 ? '<span class="combo">Combo ×2</span>' : "") + "</div>" : "") +
      (quiz && cur.mode === "boss" ? '<div class="gl-timer"><i></i></div>' : "") +
      '<div class="gl-body">' + body + '</div><div class="gl-foot">' + foot + "</div>";
    var h = L.querySelector(".gl-body h2");
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  function intro(title, text, cta, fn, extra) {
    shell('<div class="gl-intro"><img src="' + ING + '" alt="Ingenio" width="220" height="220"><h2>' + esc(title) + "</h2><p>" + esc(text) + "</p>" + (extra || "") + "</div>",
      '<button type="button" class="btn btn-g" data-go>' + cta + "</button>", 0, false);
    L.querySelector("[data-go]").addEventListener("click", fn);
  }
  function session(mode, items, extra) {
    cur = { mode: mode, queue: items, i: 0, total: items.length, right: 0, errors: 0, shields: SHIELDS, combo: 0, pts: 0, retried: {} };
    for (var k in extra) cur[k] = extra[k];
  }

  function startTappa(isola, t) {
    session("tappa", t.domande.map(function (q, i) { return { q: q, key: qKey(t, i) }; }), { isola: isola, tappa: t });
    open();
    var cards = t.lezione || [];
    intro(t.titolo, t.intro, cards.length ? "Inizia la lezione" : "Inizia", cards.length ? function () { learn(0); } : quizIntro,
      cards.length ? '<p class="gl-rules">' + ICON.book + " " + cards.length + " schede da leggere, poi il quiz</p>" : "");
    if (cards.length && st.done[t.id]) {
      L.querySelector(".gl-foot").insertAdjacentHTML("beforeend", '<button type="button" class="btn" data-skip>Vai subito al quiz</button>');
      L.querySelector("[data-skip]").addEventListener("click", quizIntro);
    }
  }

  // Lezione: schede brevi da leggere una alla volta, poi il quiz
  var SIGN = {
    divieto: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#fff" stroke="#e53935" stroke-width="5"/><path d="M8 8l24 24" stroke="#e53935" stroke-width="5"/></svg>',
    obbligo: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#1e64c8"/><path d="M12 22a8 8 0 0 1 16 0zM10 22h20" stroke="#fff" stroke-width="2.4" fill="#fff"/></svg>',
    pericolo: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 38 36H2z" fill="#ffc400" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M20 15v10M20 29v1.5" stroke="#111" stroke-width="3.4" stroke-linecap="round"/></svg>',
    soccorso: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="3" fill="#00a152"/><path d="M20 10v20M10 20h20" stroke="#fff" stroke-width="6"/></svg>',
    antincendio: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="3" fill="#d32f2f"/><path d="M17 14h6v18h-6zM19 9h2v5h-2zM21 10h6" stroke="#fff" stroke-width="2.2" fill="#fff"/></svg>'
  };
  function learn(i) {
    var cards = cur.tappa.lezione, c = cards[i], last = i === cards.length - 1;
    var dots = cards.map(function (_, n) { return '<i class="' + (n === i ? "on" : n < i ? "seen" : "") + '"></i>'; }).join("");
    var body = '<article class="lcard"><p class="lc-who"><img src="' + ING + '" alt="" width="40" height="40">Ingenio spiega · ' + (i + 1) + " di " + cards.length + "</p>" +
      "<h2>" + esc(c.titolo) + "</h2><p>" + esc(c.testo) + "</p>" +
      (c.punti ? '<ul class="lc-pts">' + c.punti.map(function (p) { return "<li>" + (p.f ? '<span class="sign">' + SIGN[p.f] + "</span>" : '<span class="bul"></span>') + "<span>" + esc(p.t) + "</span></li>"; }).join("") + "</ul>" : "") +
      (c.dopo ? "<p>" + esc(c.dopo) + "</p>" : "") + '</article><div class="lc-dots" aria-hidden="true">' + dots + "</div>";
    shell(body, '<div class="lc-nav">' + (i ? '<button type="button" class="btn" data-prev>Indietro</button>' : "") +
      '<button type="button" class="btn btn-g" data-fwd>' + (last ? "Inizia il quiz" : "Avanti") + "</button></div>", (i + 1) / cards.length * 100, false);
    L.querySelector("[data-fwd]").addEventListener("click", function () { if (last) quizIntro(); else learn(i + 1); });
    var pv = L.querySelector("[data-prev]"); if (pv) pv.addEventListener("click", function () { learn(i - 1); });
  }
  function quizIntro() {
    intro("Ora il quiz", "Vediamo se Hazard riesce a fregarti. " + cur.queue.length + " domande, con la spiegazione dopo ogni risposta.", "Inizia il quiz", ask,
      '<p class="gl-rules">' + ICON.shield + " Hai 3 scudi. Ogni errore ne rompe uno.</p>");
  }
  function startBoss(isola) {
    var all = [];
    isola.tappe.forEach(function (t) { t.domande.forEach(function (q, i) { all.push({ q: q, key: qKey(t, i) }); }); });
    session("boss", shuffle(all).slice(0, BOSS_N), { isola: isola });
    open();
    intro(isola.boss.titolo, isola.boss.intro, "Sfida Hazard", ask);
  }
  function startGym() {
    var keys = shuffle(dueKeys()).slice(0, 10);
    session("gym", keys.map(function (k) { return { q: findQ(k), key: k }; }));
    open();
    intro("Palestra di Ingenio", "Ripassiamo le domande che ti hanno messo in difficoltà. Qui niente scudi, solo allenamento.", "Allenati", ask);
  }

  function ask() {
    var item = cur.queue[cur.i], q = item.q;
    var body = '<p class="gl-kind">' + ({ scelta: "Scegli la risposta", vf: "Vero o falso?", abbina: "Abbina", ordina: "Metti in ordine" })[q.tipo] + '</p><h2 class="gl-q">' + esc(q.testo) + "</h2>";
    if (q.tipo === "scelta" || q.tipo === "vf") {
      var opts = q.tipo === "vf" ? [["true", "Vero"], ["false", "Falso"]] : shuffle(q.opzioni.map(function (o, n) { return [String(n), o]; }));
      body += '<div class="gl-opts' + (q.tipo === "vf" ? " vf" : "") + '">' + opts.map(function (o) { return '<button type="button" class="opt" data-v="' + o[0] + '">' + esc(o[1]) + "</button>"; }).join("") + "</div>";
    } else if (q.tipo === "abbina") {
      body += '<div class="gl-match"><div>' + shuffle(q.coppie.map(function (c, n) { return '<button type="button" class="opt" data-side="l" data-k="' + n + '">' + esc(c[0]) + "</button>"; })).join("") +
        "</div><div>" + shuffle(q.coppie.map(function (c, n) { return '<button type="button" class="opt" data-side="r" data-k="' + n + '">' + esc(c[1]) + "</button>"; })).join("") + "</div></div>";
    } else {
      body += '<ol class="gl-answer" aria-label="La tua sequenza"></ol><div class="gl-opts pool">' + shuffle(q.passi.map(function (p, n) { return '<button type="button" class="opt" data-k="' + n + '">' + esc(p) + "</button>"; })).join("") + "</div>";
    }
    shell(body, q.tipo === "abbina" ? '<p class="gl-hint">Tocca un elemento a sinistra e poi quello giusto a destra.</p>' : '<button type="button" class="btn btn-g" data-check disabled>Controlla</button>', cur.i / cur.queue.length * 100, true);
    wire(q);
    if (cur.mode === "boss") startTimer(q);
  }

  function startTimer(q) {
    var bar = L.querySelector(".gl-timer i"), t0 = Date.now();
    clearInterval(timer);
    timer = setInterval(function () {
      var left = 1 - (Date.now() - t0) / (BOSS_SEC * 1000);
      bar.style.width = Math.max(0, left * 100) + "%";
      bar.parentNode.classList.toggle("hurry", left < 0.3);
      if (left <= 0) {
        clearInterval(timer);
        L.querySelectorAll(".opt").forEach(function (x) { x.disabled = true; });
        feedback(q, false, true);
      }
    }, 100);
  }

  function wire(q) {
    var check = L.querySelector("[data-check]"), pick = null;
    if (q.tipo === "scelta" || q.tipo === "vf") {
      L.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          L.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); x.setAttribute("aria-pressed", String(x === b)); });
          pick = b.dataset.v; check.disabled = false;
        });
      });
      check.addEventListener("click", function () {
        var ok = q.tipo === "vf" ? pick === String(q.giusta) : Number(pick) === q.giusta;
        L.querySelectorAll(".opt").forEach(function (x) {
          x.disabled = true;
          var right = q.tipo === "vf" ? x.dataset.v === String(q.giusta) : Number(x.dataset.v) === q.giusta;
          if (right) x.classList.add("right"); else if (x.dataset.v === pick) x.classList.add("wrong");
        });
        feedback(q, ok);
      });
    } else if (q.tipo === "abbina") {
      var left = null, errors = 0, rest = q.coppie.length;
      L.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.dataset.side === "l") { left = b; L.querySelectorAll('[data-side="l"]').forEach(function (x) { x.classList.toggle("sel", x === b); }); return; }
          if (!left) return;
          if (left.dataset.k === b.dataset.k) {
            [left, b].forEach(function (x) { x.classList.remove("sel"); x.classList.add("right"); x.disabled = true; });
            left = null; tone([[700 + (q.coppie.length - rest) * 90]]);
            if (--rest === 0) feedback(q, errors === 0);
          } else {
            errors++; buzz(60);
            var l = left;
            [l, b].forEach(function (x) { x.classList.add("wrong"); });
            setTimeout(function () { [l, b].forEach(function (x) { x.classList.remove("wrong"); }); }, 500);
          }
        });
      });
    } else {
      var ans = L.querySelector(".gl-answer"), pool = L.querySelector(".pool");
      pool.addEventListener("click", function (e) {
        var b = e.target.closest(".opt"); if (!b) return;
        var li = document.createElement("li"); li.appendChild(b); ans.appendChild(li);
        check.disabled = pool.children.length > 0;
      });
      ans.addEventListener("click", function (e) {
        var b = e.target.closest(".opt"); if (!b || b.disabled) return;
        var li = b.parentNode; pool.appendChild(b); li.remove(); check.disabled = true;
      });
      check.addEventListener("click", function () {
        var ok = true;
        ans.querySelectorAll(".opt").forEach(function (b, n) { b.disabled = true; var r = Number(b.dataset.k) === n; b.classList.add(r ? "right" : "wrong"); if (!r) ok = false; });
        feedback(q, ok);
      });
    }
  }

  function feedback(q, ok, late) {
    clearInterval(timer);
    var item = cur.queue[cur.i], gain = 0;
    if (ok) {
      cur.combo++; cur.right += cur.retried[item.key] ? 0 : 1;
      gain = cur.combo >= 3 ? 20 : 10; cur.pts += gain;
      if (cur.combo === 3) tone(SFX.combo); else tone(SFX.ok);
      if (cur.combo >= 5) badge("combo5");
      if (cur.mode === "gym") { var r = st.review[item.key]; r.box++; if (r.box >= BOX.length) delete st.review[item.key]; else r.due = day(BOX[r.box]); }
    } else {
      cur.combo = 0; cur.errors++;
      tone(SFX.ko); buzz([80, 60, 80]);
      st.review[item.key] = { due: day(1), box: 0 };
      if (cur.mode !== "gym") cur.shields--;
      // In tappa la domanda sbagliata torna una volta alla fine, come in una vera lezione
      if (cur.mode === "tappa" && !cur.retried[item.key]) { cur.retried[item.key] = true; cur.queue.push(item); }
    }
    save();
    var foot = L.querySelector(".gl-foot"), out = !ok && cur.mode !== "gym" && cur.shields <= 0;
    foot.className = "gl-foot " + (ok ? "ok" : "ko");
    foot.innerHTML = '<div class="gl-fb"><span class="fb-ico">' + (ok ? ICON.check : ICON.warn) + "</span><div><b>" +
      (ok ? (cur.combo >= 3 ? "Combo ×2 · +" + gain + " punti!" : "Ottimo, Hazard non ti ha fregato!") : late ? "Tempo scaduto, Hazard ne approfitta" : "Attenzione, qui c'era Hazard") +
      "</b><p>" + esc(q.spiega) + "</p></div></div>" +
      '<button type="button" class="btn ' + (ok ? "btn-g" : "btn-r") + '" data-next>Continua</button>';
    foot.querySelector("[data-next]").addEventListener("click", function () {
      if (out) return lost();
      cur.i++; if (cur.i < cur.queue.length) ask(); else finish();
    });
    foot.querySelector("[data-next]").focus({ preventScroll: true });
    L.querySelector(".gl-bar i").style.width = (cur.i + 1) / cur.queue.length * 100 + "%";
    var hz = L.querySelector(".hzbar i"); if (hz) hz.style.width = Math.max(0, 100 - cur.right / cur.total * 100) + "%";
    var sh = L.querySelector(".g-shields");
    if (sh) { sh.outerHTML = shields(); if (!ok) L.querySelector(".g-shields").classList.add("hit"); }
    var hzRow = L.querySelector(".gl-hz");
    if (hzRow) { var c = hzRow.querySelector(".combo"); if (cur.combo >= 3 && !c) hzRow.insertAdjacentHTML("beforeend", '<span class="combo">Combo ×2</span>'); else if (cur.combo < 3 && c) c.remove(); }
  }

  function lost() {
    tone(SFX.lose);
    shell('<div class="gl-intro gl-lost"><span class="hz-big">' + ICON.warn + "</span><h2>Hazard ha vinto questa volta</h2><p>Hai finito gli scudi. Le domande sbagliate ti aspettano in Palestra, e la sfida si può rifare subito.</p></div>",
      '<button type="button" class="btn btn-g" data-retry>Riprova</button><button type="button" class="btn" data-exit>Torna alla mappa</button>', 100, false);
    L.querySelector("[data-retry]").addEventListener("click", function () {
      if (cur.mode === "boss") startBoss(cur.isola); else startTappa(cur.isola, cur.tappa);
    });
  }

  function finish() {
    var head, msg, extra = "", bonus = cur.mode === "gym" ? 0 : 20;
    addPoints(cur.pts + bonus); playedToday();
    if (cur.mode === "gym") {
      badge("palestra");
      head = "Allenamento finito"; msg = "Le domande che hai indovinato torneranno più avanti, quelle sbagliate già domani. È così che si ricorda davvero.";
    } else if (cur.mode === "boss") {
      st.boss[cur.isola.id] = true; badge("isola");
      head = "Hazard è stato scacciato!"; msg = "Hai difeso tutta l'isola. Il badge è tuo, e dalla mappa puoi creare il tuo attestato.";
    } else {
      var n = cur.tappa.domande.length, s = cur.errors === 0 ? 3 : cur.errors <= 2 ? 2 : 1, prev = st.done[cur.tappa.id];
      st.done[cur.tappa.id] = { best: Math.max(Math.round(cur.right / n * 100), prev ? prev.best : 0), stars: Math.max(s, prev ? prev.stars || 1 : 0) };
      badge("prima");
      if (s === 3) badge("stelle");
      if (s === 3 && cur.tappa.id === "segnali") badge("occhio");
      if (cur.isola.tappe.every(function (t) { return st.done[t.id] && st.done[t.id].stars === 3; })) badge("perfetto");
      head = "Tappa completata";
      msg = s === 3 ? "Perfetto. Hazard oggi non ha avuto nessuna possibilità." : s === 2 ? "Bel lavoro. Ogni risposta ti rende più difficile da sorprendere." : "Hazard ti ha teso qualche trappola, ma ora sai dove si nasconde. Rigioca per prendere tutte le stelle.";
      extra = '<div class="big-stars">' + stars(s) + "</div>";
    }
    save();
    tone(SFX.win); confetti(); buzz([40, 40, 40]);
    shell('<div class="gl-intro gl-end"><img src="' + ING + '" alt="Ingenio" width="220" height="220"><h2>' + head + "</h2>" + extra + "<p>" + msg + "</p>" +
      '<div class="gl-score"><span><b>+' + (cur.pts + bonus) + "</b> punti</span><span><b>" + streakNow() + "</b> " + (streakNow() === 1 ? "giorno" : "giorni") + " di fila</span><span><b>" + Math.min(daily().pts, GOAL) + "/" + GOAL + "</b> obiettivo di oggi</span></div></div>",
      '<button type="button" class="btn btn-g" data-exit>Torna alla mappa</button>', 100, false);
  }

  // ---------- Attestato di partecipazione (resta sul dispositivo, si stampa o si salva in PDF) ----------
  function certForm(isola) {
    cur = null; open();
    shell('<div class="gl-intro"><h2>Il tuo attestato</h2><p>Scrivi il nome da mettere sull\'attestato. Resta solo su questo dispositivo.</p>' +
      '<label class="cert-in"><span class="sr-only">Nome e cognome</span><input id="certName" type="text" maxlength="60" autocomplete="name" placeholder="Nome e cognome"></label></div>',
      '<button type="button" class="btn btn-g" data-mk>Crea l\'attestato</button>', 100, false);
    var inp = $("#certName"); inp.focus();
    L.querySelector("[data-mk]").addEventListener("click", function () {
      var name = inp.value.trim(); if (!name) { inp.focus(); return; }
      var c = $("#gameCert") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "gameCert" }));
      var date = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
      c.innerHTML = '<div class="cert"><p class="c-k">Accademia di Ingenio · by Tutor Consulting</p><h1>Attestato di partecipazione</h1><p>Si attesta che</p><p class="c-name">' + esc(name) + "</p>" +
        "<p>ha completato l'isola <b>" + esc(isola.titolo) + "</b> e ha scacciato Hazard nella sfida finale.</p><p class=\"c-date\">" + date + "</p>" +
        '<p class="c-note">Attestato di partecipazione a un gioco educativo. Non sostituisce la formazione obbligatoria prevista dalla legge.</p></div>';
      shell('<div class="gl-intro cert-prev">' + c.innerHTML + "</div>", '<button type="button" class="btn btn-g" data-print>Stampa o salva in PDF</button><button type="button" class="btn" data-exit>Torna alla mappa</button>', 100, false);
      L.querySelector("[data-print]").addEventListener("click", function () { window.print(); });
    });
  }

  renderMap();
})();
