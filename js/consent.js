/* Consenso cookie + Google Analytics 4: GA parte solo dopo "Accetta" (regole del Garante privacy).
   La scelta resta salvata nel browser; "Gestisci cookie" nel footer riapre il banner. */
(() => {
  const GA_ID = 'G-ERKKDWVDNV';
  const KEY = 'ingenio-consent';   // 'yes' | 'no'
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  let loaded = false;

  function loadGA() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function banner() {
    if (document.querySelector('.consent')) return;
    const box = document.createElement('div');
    box.className = 'consent glass';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Preferenze cookie');
    box.innerHTML = '<p>Usiamo Google Analytics per capire come viene usato il sito, solo se sei d\'accordo. ' +
      '<a href="cookie-policy.html">Cookie Policy</a></p>' +
      '<div class="consent-btns"><button type="button" class="btn" data-c="no">Rifiuta</button>' +
      '<button type="button" class="btn btn-g" data-c="yes">Accetta</button></div>';
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]');
      if (!b) return;
      const was = get();
      set(b.dataset.c);
      box.remove();
      if (b.dataset.c === 'yes') loadGA();
      else if (was === 'yes') location.reload();   // revoca: ricarica senza GA
    });
    document.body.appendChild(box);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-consent-open]');
    if (a) { e.preventDefault(); banner(); }
  });

  const c = get();
  if (c === 'yes') loadGA();
  else if (c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
    else banner();
  }
})();
