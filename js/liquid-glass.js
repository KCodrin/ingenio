// Liquid Glass: rifrazione del vetro con un filtro SVG in backdrop-filter (solo Chromium; altrove resta il blur del CSS).
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  // Profilo squircle convesso: x = distanza dal bordo 0..1
  var squircle = function (x) { return Math.pow(1 - Math.pow(1 - x, 4), 0.25); };

  // Spostamento (px) dei raggi lungo il bezel secondo Snell (aria n=1, vetro n=ior)
  function buildTable(o) {
    var n = 127, table = new Float32Array(n), eps = 1e-3;
    for (var i = 0; i < n; i++) {
      var x = (i + 0.5) / n, x1 = Math.max(x - eps, 0), x2 = Math.min(x + eps, 1);
      var h = squircle(x) * o.thickness;
      var slope = ((squircle(x2) - squircle(x1)) * o.thickness) / ((x2 - x1) * o.bezel);
      var t1 = Math.atan(slope), t2 = Math.asin(Math.sin(t1) / o.ior);
      table[i] = h * Math.tan(t1 - t2);
    }
    return table;
  }

  function buildMaps(w, h, radius, o, table, maxDisp) {
    var cD = document.createElement("canvas"), cS = document.createElement("canvas");
    cD.width = cS.width = w; cD.height = cS.height = h;
    var imgD = cD.getContext("2d").createImageData(w, h), imgS = cS.getContext("2d").createImageData(w, h);
    var a = o.lightAngle * Math.PI / 180, lx = Math.cos(a), ly = Math.sin(a);
    var hx = w / 2, hy = h / 2, bx = hx - radius, by = hy - radius;
    for (var py = 0; py < h; py++) {
      for (var px = 0; px < w; px++) {
        var i = (py * w + px) * 4;
        imgD.data[i] = imgD.data[i + 1] = imgD.data[i + 2] = 128; // 128 = nessuno spostamento
        imgD.data[i + 3] = 255;
        var cx = px + 0.5 - hx, cy = py + 0.5 - hy, qx = Math.abs(cx) - bx, qy = Math.abs(cy) - by;
        var d = radius - (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0));
        if (d < 0) continue;
        var sx = Math.sign(cx) || 1, sy = Math.sign(cy) || 1, nx, ny;
        if (qx > 0 && qy > 0) { var l = Math.hypot(qx, qy); nx = qx / l * sx; ny = qy / l * sy; }
        else if (qx > qy) { nx = sx; ny = 0; } else { nx = 0; ny = sy; }
        if (d < o.bezel) {
          var m = table[Math.min(Math.floor(d / o.bezel * table.length), table.length - 1)] / maxDisp;
          imgD.data[i] = 128 - nx * m * 127;
          imgD.data[i + 1] = 128 - ny * m * 127;
        }
        if (d < o.rim) { // riflesso sul bordo, nel colore del vetro
          imgS.data[i] = o.tint[0]; imgS.data[i + 1] = o.tint[1]; imgS.data[i + 2] = o.tint[2];
          imgS.data[i + 3] = Math.round(Math.abs(nx * lx + ny * ly) * (1 - d / o.rim) * o.specular * 255);
        }
      }
    }
    cD.getContext("2d").putImageData(imgD, 0, 0);
    cS.getContext("2d").putImageData(imgS, 0, 0);
    return { dmap: cD.toDataURL(), spec: cS.toDataURL() };
  }

  var uid = 0;
  window.liquidGlass = function (el, options) {
    var o = Object.assign({ bezel: 18, thickness: 40, ior: 1.5, refraction: 1, blur: 0.8, specular: 0.6,
      lightAngle: -60, rim: 2.5, tint: [29, 233, 182] }, options);
    var id = "liquid-glass-" + (++uid), raf = 0;
    var host = document.createElementNS(SVG_NS, "svg");
    host.setAttribute("width", "0"); host.setAttribute("height", "0"); host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;pointer-events:none";
    document.body.appendChild(host);
    var table = buildTable(o);
    var maxDisp = table.reduce(function (mx, v) { return Math.max(mx, Math.abs(v)); }, 1e-6);
    console.assert(maxDisp > 1, "liquidGlass: spostamento nullo, controlla bezel/thickness");

    function render() {
      var r = el.getBoundingClientRect(), w = Math.round(r.width), h = Math.round(r.height);
      if (!w || !h) return;
      var radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      var maps = buildMaps(w, h, radius, o, table, maxDisp);
      // Lo spostamento è scale × (canale − 0.5): per ±maxDisp px serve scale = 2 × maxDisp
      host.innerHTML = '<filter id="' + id + '" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="0" y="0" width="' + w + '" height="' + h + '" color-interpolation-filters="sRGB">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="' + o.blur + '" result="b"/>' +
        '<feImage href="' + maps.dmap + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="d"/>' +
        '<feDisplacementMap in="b" in2="d" scale="' + (2 * maxDisp * o.refraction) + '" xChannelSelector="R" yChannelSelector="G" result="r"/>' +
        '<feImage href="' + maps.spec + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="s"/>' +
        '<feBlend in="s" in2="r" mode="normal"/></filter>';
      el.style.backdropFilter = el.style.webkitBackdropFilter = "url(#" + id + ")";
    }

    new ResizeObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }).observe(el);
  };
})();
