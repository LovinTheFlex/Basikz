/* =====================================================================
   BASIKZ · portada con el producto real
   Una escena al azar por visita. Al deslizar:
   1) la pregunta  2) entra el producto real (los zapatos giran en 360°
   con sus fotos reales)  3) llegan nombre, precio y botón de compra.
   No hace falta tocar este archivo: todo se configura en assets/app.js.
   ===================================================================== */
(function () {
  'use strict';
  const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ease = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp01(x), 3);
  const seg = (x, a, b) => clamp01((x - a) / (b - a));
  const rand = n => {
    const a = new Uint32Array(1);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a); else a[0] = Math.floor(Math.random() * 4294967296);
    return a[0] % n;
  };
  const money = n => 'L ' + Math.round(n).toLocaleString('en-US');

  /* ---------- Secuencia 360°: 36 fotos reales que se dibujan según el scroll ---------- */
  function createSpin(canvas, base, count) {
    count = count || 36;
    const ctx = canvas.getContext('2d');
    const imgs = new Array(count).fill(null), ok = new Array(count).fill(false);
    let cur = -1, target = 0, queued = false;
    const src = i => base + String(i + 1).padStart(2, '0') + '.webp';
    function fit() {
      const r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(r.width * d)), h = Math.max(2, Math.round(r.height * d));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; cur = -1; }
    }
    function nearest(i) {
      for (let k = 0; k < count; k++) {
        const a = (i + k) % count, b = (i - k + count) % count;
        if (ok[a]) return a; if (ok[b]) return b;
      }
      return -1;
    }
    function draw() {
      const i = nearest(target);
      if (i < 0 || i === cur) return;
      cur = i;
      const im = imgs[i], cw = canvas.width, ch = canvas.height;
      const s = Math.min(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * s, h = im.naturalHeight * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    function load(i, done) {
      if (imgs[i]) { if (done) done(); return; }
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { ok[i] = true; draw(); if (done) done(); };
      im.onerror = () => { if (done) done(); };
      im.src = src(i);
      imgs[i] = im;
    }
    function loadAll() {
      if (queued) return; queued = true;
      let next = 1;
      const chain = () => { if (next < count) load(next++, chain); };
      for (let k = 0; k < 4; k++) chain();
    }
    fit();
    load(0);
    return {
      loadAll,
      set(frac) { target = ((Math.round(frac * count) % count) + count) % count; draw(); },
      resize() { fit(); draw(); }
    };
  }

  /* ---------- Portada ---------- */
  function initHero() {
    const hero = document.getElementById('hero');
    const D = window.BASIKZ_DATA;
    if (!hero || !D) return;
    const $ = s => hero.querySelector(s);
    const stage = $('.hero__stage'), word = $('#heroWord'), product = $('#heroProduct'), info = $('#heroInfo');
    const hint = $('.hero__hint'), bar = $('#heroBar'), media = $('#heroMedia');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const byId = Object.create(null);
    D.products.forEach(p => { byId[p.id] = p; });

    // 1. Escena: ?escena=perfumes|lujo|zapatos|audio, o al azar sin repetir la anterior
    const keys = Object.keys(D.hero);
    const params = new URLSearchParams(location.search);
    let key = params.get('escena');
    if (keys.indexOf(key) < 0) {
      let last = null;
      try { last = localStorage.getItem('basikz-hero'); } catch (e) { /* sin almacenamiento */ }
      const pool = keys.filter(k => k !== last);
      key = pool[rand(pool.length)];
      try { localStorage.setItem('basikz-hero', key); } catch (e) { /* sin almacenamiento */ }
    }
    const cfg = D.hero[key];
    const options = cfg.productos.map(id => byId[id]).filter(p => p && p.img);
    if (!options.length) return;
    // ?producto=samba fija el producto (útil para anuncios)
    const forced = byId[params.get('producto')];
    const prod = (forced && forced.img && forced.cat === options[0].cat) ? forced : options[rand(options.length)];
    hero.dataset.escena = key;
    window.BASIKZ_HERO = prod.id; // las secciones muestran otro producto

    // 2. La pregunta, letra por letra
    word.textContent = '';
    [...cfg.pregunta].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch' + (ch === '¿' || ch === '?' ? ' q' : '');
      s.textContent = ch;
      s.style.setProperty('--i', String(i));
      word.appendChild(s);
    });
    function fitWord() {
      const w = stage.clientWidth, h = stage.clientHeight;
      word.style.setProperty('--word-size', Math.round(Math.min(w * 0.9 / (cfg.pregunta.length * 0.55), h * 0.34)) + 'px');
    }

    // 3. El producto real
    let spin = null, video = null;
    if (cfg.video) {
      video = document.createElement('video');
      video.className = 'hero__video'; video.muted = true; video.playsInline = true; video.preload = 'auto';
      video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.src = cfg.video;
      media.appendChild(video);
      hero.classList.add('has-video');
    } else if (prod.spin) {
      const c = document.createElement('canvas');
      c.className = 'hero__spin';
      product.appendChild(c);
      spin = createSpin(c, prod.spin, 36);
      hero.classList.add('is-spin');
    } else {
      const im = document.createElement('img');
      im.className = 'hero__img'; im.src = prod.img; im.alt = ''; im.decoding = 'async';
      product.appendChild(im);
      // brillo de estudio que recorre el frasco (usa la misma foto como máscara)
      const sheen = document.createElement('div');
      sheen.className = 'hero__sheen';
      sheen.style.setProperty('-webkit-mask-image', 'url("' + prod.img + '")');
      sheen.style.setProperty('mask-image', 'url("' + prod.img + '")');
      product.appendChild(sheen);
      hero.classList.add('is-still');
    }
    hero.dataset.cat = prod.cat;

    // 4. Ficha: marca, nombre, descripción, precio, botones
    const lines = [];
    const add = (tag, cls, text) => { const el = document.createElement(tag); el.className = cls; if (text) el.textContent = text; info.appendChild(el); lines.push(el); return el; };
    add('span', 'hero__tag', (prod.cat === 'preventa' ? 'Por encargo' : 'En stock') + (prod.size ? ' · ' + prod.size : ''));
    add('span', 'hero__brand', prod.vendor || 'Basikz');
    add('h2', 'hero__name', prod.name);
    if (prod.desc) add('p', 'hero__desc', prod.desc);
    add('p', 'hero__price', money(prod.price));
    const act = add('div', 'hero__actions');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn--solid'; b.dataset.add = prod.id;
    b.textContent = prod.cat === 'preventa' ? 'Apartar' : 'Agregar a la bolsa';
    const ln = document.createElement('a');
    ln.className = 'txt-btn'; ln.href = cfg.seccion; ln.textContent = 'Ver ' + cfg.nombre;
    act.append(b, ln);

    // 5. Avance del scroll dentro de la portada (0 → 1)
    function progress() {
      if (hero.classList.contains('is-static')) return 0.92;
      const r = hero.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0; // la portada se queda fija debajo del menú
      return clamp01((top - r.top) / Math.max(1, r.height - stage.offsetHeight));
    }

    function update() {
      const p = progress();
      const portrait = stage.clientWidth / stage.clientHeight < 0.8;
      const enter = easeOut(seg(p, 0.03, 0.4));     // el producto entra
      const showP = ease(seg(p, 0.02, 0.18));       // y aparece
      const side = ease(seg(p, 0.42, 0.72));        // se hace a un lado para la ficha
      const c = seg(p, 0.48, 0.82);                 // la ficha

      const wq = ease(seg(p, 0.03, 0.4));
      word.style.opacity = ((1 - 0.72 * wq) * (1 - ease(seg(p, 0.4, 0.6)))).toFixed(3);
      word.style.transform = 'translate3d(0,' + (-4 * wq).toFixed(2) + 'vh,0) scale(' + (1 - 0.05 * wq).toFixed(4) + ')';

      const tx = portrait ? 0 : side * 14;
      const ty = (1 - enter) * 40 + (portrait ? -side * 10 : 0);
      const sc = (0.9 + 0.1 * enter) * (portrait ? 1 - 0.14 * side : 1 - 0.04 * side);
      const vis = video || product;
      vis.style.opacity = showP.toFixed(3);
      if (!video) vis.style.transform = 'translate3d(' + tx.toFixed(2) + 'vw,' + ty.toFixed(2) + 'vh,0) scale(' + sc.toFixed(4) + ')';
      product.style.setProperty('--sheen', (-30 + 160 * seg(p, 0.1, 0.75)).toFixed(1) + '%');
      product.style.setProperty('--shadow', enter.toFixed(3));
      if (spin) spin.set(0.25 + 1.0 * seg(p, 0.03, 0.96));
      if (video && video.duration) {
        const t = p * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.03) { try { video.currentTime = t; } catch (e) { /* cargando */ } }
      }

      lines.forEach((el, i) => {
        const k = easeOut(seg(c, i * 0.09, i * 0.09 + 0.42));
        el.style.opacity = k.toFixed(3);
        el.style.transform = 'translate3d(0,' + ((1 - k) * 22).toFixed(1) + 'px,0)';
      });
      info.classList.toggle('on', c > 0.55);
      if (hint) hint.style.opacity = (1 - seg(p, 0, 0.06)).toFixed(3);
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }

    function resize() { fitWord(); if (spin) spin.resize(); update(); }

    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };

    if (reduce) {
      hero.classList.add('is-static', 'is-ready');
      if (spin) spin.loadAll();
    } else {
      requestAnimationFrame(() => hero.classList.add('is-ready'));
      window.addEventListener('scroll', onScroll, { passive: true });
      // las 36 fotos del 360 se bajan apenas carga la página, de 4 en 4
      if (spin) { if (document.readyState === 'complete') spin.loadAll(); else window.addEventListener('load', () => spin.loadAll()); }
    }
    window.addEventListener('resize', resize);
    resize();
  }

  window.BasikzSpin = createSpin;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHero); else initHero();
})();
