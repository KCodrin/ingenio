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
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        track = c.dataset.track;
        chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
        apply();
      });
    });
  }
})();
