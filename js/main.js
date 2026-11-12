(function () {
  "use strict";

  var hdr = document.querySelector(".hdr");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");

  function onScroll() { hdr.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Liquid Glass: solo su Chromium e se l'utente non chiede meno movimento o trasparenza
  var isChromium = navigator.userAgentData && navigator.userAgentData.brands.some(function (b) { return /Chromium/.test(b.brand); });
  var calm = matchMedia("(prefers-reduced-motion: reduce), (prefers-reduced-transparency: reduce)").matches;
  if (isChromium && !calm && window.liquidGlass) {
    document.querySelectorAll(".glass, .hero-duel .duel > div").forEach(function (el) {
      window.liquidGlass(el, el.classList.contains("hz") ? { tint: [255, 59, 92] } : {}); // vetro di Hazard: riflesso rosso
    });
  }

  // Luce sul vetro: segue il puntatore (desktop) o l'inclinazione del telefono (mobile)
  var glasses = Array.from(document.querySelectorAll(".glass, .hero-duel .duel > div"));
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var frame = 0, tilting = false;
  function light(fn) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(function () { glasses.forEach(fn); });
  }
  if (glasses.length && !still) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || tilting) return; // se c'è il giroscopio comanda lui
      light(function (el) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        // conic-gradient parte dall'alto e gira in senso orario; la luce punta verso il mouse
        el.style.setProperty("--la", (Math.atan2(dx, -dy) * 180 / Math.PI - 40) + "deg");
        el.style.setProperty("--li", Math.max(0.25, Math.min(1, 1 - Math.hypot(dx, dy) / 700)).toFixed(2));
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    }, { passive: true });

    var tilt = function (e) {
      if (e.beta === null) return;
      tilting = true;
      var x = Math.max(-45, Math.min(45, e.gamma)), y = Math.max(-45, Math.min(45, e.beta - 45)); // 45° = telefono tenuto in mano
      light(function (el) {
        el.style.setProperty("--la", (Math.atan2(x, -y) * 180 / Math.PI - 40) + "deg");
        el.style.setProperty("--li", Math.max(0.3, Math.min(1, Math.hypot(x, y) / 45)).toFixed(2));
        el.style.setProperty("--mx", (50 + x) + "%");
        el.style.setProperty("--my", (50 + y) + "%");
      });
    };
    window.addEventListener("deviceorientation", tilt);
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      // iPhone: senza permesso non arrivano dati; va chiesto dopo un tocco
      window.addEventListener("touchend", function ask() {
        window.removeEventListener("touchend", ask);
        DeviceOrientationEvent.requestPermission().catch(function () {});
      });
    }
  }

  // Filtro corsi (pagina Formazione)
  var list = document.getElementById("courses");
  if (list) {
    var q = document.getElementById("courseSearch");
    var chips = Array.from(document.querySelectorAll("[data-track]"));
    var empty = document.getElementById("coursesEmpty");
    var track = "all";
    var apply = function () {
      var term = q.value.trim().toLowerCase();
      var shown = 0;
      Array.from(list.children).forEach(function (li) {
        var ok = (track === "all" || li.dataset.t === track) && li.textContent.toLowerCase().indexOf(term) !== -1;
        li.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    };
    q.addEventListener("input", apply);
    // Arrivo da Chi siamo (formazione.html#sicurezza ecc.): filtro per categoria, o ricerca se non esiste il filtro
    var want = decodeURIComponent(location.hash.slice(1));
    if (want) {
      var chip = chips.find(function (c) { return c.dataset.track === want; });
      if (chip) { setTimeout(function () { chip.click(); }); } else { q.value = want; apply(); }
      setTimeout(function () { document.querySelector(".course-tools").scrollIntoView(); }, 50);
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        track = c.dataset.track;
        chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
        apply();
      });
    });
    // Popup con la scheda completa del corso
    var dlg = document.getElementById("courseDlg");
    var data = JSON.parse(document.getElementById("courseData").textContent);
    var set = function (id, v) { document.getElementById(id).textContent = v; };
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".course");
      if (!b) return;
      var c = data[b.dataset.i];
      document.getElementById("cdImg").src = c.img;
      set("cdCat", c.cat); set("cdTitle", c.titolo); set("cdDesc", c.descrizione_commerciale);
      set("cdDur", c.durata_sito); set("cdAgg", c.aggiornamento_sito); set("cdNorm", c.normativa); set("cdMod", c.modalita);
      set("cdCta", c.call_to_action);
      dlg.showModal();
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  }
})();

// Footer: su telefono le sezioni partono chiuse (fisarmonica); su desktop restano aperte
const ftrAcc = document.querySelectorAll('.ftr-acc');
const ftrMq = matchMedia('(max-width: 760px)');
const ftrSet = () => ftrAcc.forEach(d => { d.open = !ftrMq.matches; });
ftrSet(); ftrMq.addEventListener('change', ftrSet);
