/* =====================================================================
   BASIKZ · animaciones de las secciones (sin librerías)
   - Título de cada sección que entra letra por letra
   - Un producto real de esa sección que se mueve con el scroll
     (los zapatos giran en 360° con sus fotos reales)
   - La ruta Proveedor → San Pedro Sula de la preventa
   - Aparición suave de bloques
   No hace falta tocar este archivo.
   ===================================================================== */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ease = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp01(x), 3);
  const seg = (x, a, b) => clamp01((x - a) / (b - a));
  if (hasIO && !reduce) document.documentElement.classList.add('js-motion');

  const D = window.BASIKZ_DATA || { products: [] };
  const byId = Object.create(null);
  D.products.forEach(p => { byId[p.id] = p; });
  const heroId = () => window.BASIKZ_HERO || '';
  const pick = list => list[Math.floor(Math.random() * list.length)];

  /* Títulos letra por letra (agrupadas por palabra para que puedan saltar de línea) */
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const wrap = document.createElement('span'); wrap.className = 'split'; wrap.setAttribute('aria-hidden', 'true');
    let i = 0;
    text.split(' ').forEach((word, wi, all) => {
      const w = document.createElement('span'); w.className = 'w';
      [...word].forEach(ch => {
        const s = document.createElement('span'); s.className = 'ch';
        s.textContent = ch;
        s.style.setProperty('--i', String(i++));
        w.appendChild(s);
      });
      wrap.appendChild(w);
      if (wi < all.length - 1) { wrap.appendChild(document.createTextNode(' ')); i++; }
    });
    el.appendChild(wrap);
  });

  /* Producto real de cada sección */
  const visuals = [];
  function caption(fig, p) {
    const cap = document.createElement('figcaption');
    cap.className = 'vis-cap';
    cap.textContent = (p.vendor ? p.vendor + ' ' : '') + p.name + (p.size ? ' · ' + p.size : '');
    fig.appendChild(cap);
  }
  function photo(p, cls) {
    const box = document.createElement('div'); box.className = 'vis-item ' + (cls || '');
    const sh = document.createElement('div'); sh.className = 'vis-shadow';
    const im = document.createElement('img'); im.className = 'vis-img'; im.src = p.img; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
    const sheen = document.createElement('div'); sheen.className = 'vis-sheen';
    sheen.style.setProperty('-webkit-mask-image', 'url("' + p.img + '")');
    sheen.style.setProperty('mask-image', 'url("' + p.img + '")');
    box.append(sh, im, sheen);
    return box;
  }
  document.querySelectorAll('.sec-intro__visual').forEach(fig => {
    const kind = fig.dataset.visual;
    const intro = fig.closest('.sec-intro');
    const v = { kind, fig, intro, items: [], spin: null };
    if (kind === 'row') {
      const ids = (fig.dataset.ids || '').split(',').map(s => s.trim()).filter(id => byId[id] && byId[id].img);
      ids.forEach(id => { const it = photo(byId[id], 'vis-item--row'); fig.appendChild(it); v.items.push(it); });
      const cap = document.createElement('figcaption'); cap.className = 'vis-cap'; cap.textContent = 'Decants de 10 ml de estos originales';
      fig.appendChild(cap);
    } else {
      const cat = fig.dataset.cat;
      const list = D.products.filter(p => p.cat === cat && p.img && (kind !== 'spin' || p.spin));
      if (!list.length) { fig.remove(); return; }
      const others = list.filter(p => p.id !== heroId());
      const p = pick(others.length ? others : list);
      if (kind === 'spin') {
        const box = document.createElement('div'); box.className = 'vis-item vis-item--spin';
        const sh = document.createElement('div'); sh.className = 'vis-shadow';
        const c = document.createElement('canvas'); c.className = 'vis-spin';
        box.append(sh, c); fig.appendChild(box); v.items.push(box);
        if (window.BasikzSpin) {
          // se arma cuando la sección está cerca, para no bajar fotos de más
          v.makeSpin = () => { if (!v.spin) { v.spin = window.BasikzSpin(c, p.spin, 36); v.spin.loadAll(); } };
        }
      } else {
        const it = photo(p, kind === 'float' ? 'vis-item--float' : '');
        fig.appendChild(it); v.items.push(it);
      }
      caption(fig, p);
    }
    visuals.push(v);
  });

  /* Entradas: secciones y bloques */
  const intros = [...document.querySelectorAll('.sec-intro')];
  const reveals = [...document.querySelectorAll('.reveal')];
  if (hasIO) {
    const near = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      visuals.forEach(v => { if (v.intro === e.target && v.makeSpin) { v.makeSpin(); requestAnimationFrame(tick); } });
      near.unobserve(e.target);
    }), { rootMargin: '900px 0px' });
    intros.forEach(el => near.observe(el));
  } else {
    visuals.forEach(v => v.makeSpin && v.makeSpin());
  }
  if (hasIO && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); e.target.classList.remove('pending'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    const vh = window.innerHeight;
    intros.forEach(el => io.observe(el));
    const watchReveal = el => { if (el.getBoundingClientRect().top > vh) { el.classList.add('pending'); io.observe(el); } };
    reveals.forEach(watchReveal);
    const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList.contains('reveal')) watchReveal(n); })));
    document.querySelectorAll('.grid, .lux').forEach(g => mo.observe(g, { childList: true }));
  } else {
    intros.forEach(el => el.classList.add('in'));
  }

  /* Ruta Proveedor → San Pedro Sula */
  const routeArt = document.querySelector('.art-route');
  const routeLine = document.getElementById('routeLine');
  const plane = document.getElementById('routePlane');
  let routeLen = 0;
  if (routeLine && plane && routeLine.getTotalLength) {
    routeLen = routeLine.getTotalLength();
    routeLine.style.strokeDasharray = routeLen.toFixed(1);
    routeLine.style.strokeDashoffset = routeLen.toFixed(1);
  }
  function drawRoute(p) {
    if (!routeLen) return;
    const k = reduce ? 1 : ease(seg(p, 0.12, 0.62));
    routeLine.style.strokeDashoffset = (routeLen * (1 - k)).toFixed(1);
    const at = Math.min(routeLen - 1, Math.max(0, routeLen * k));
    const a = routeLine.getPointAtLength(at), b = routeLine.getPointAtLength(at + 1);
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    plane.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')');
    plane.style.opacity = k > 0.985 ? '0' : '1';
    if (routeArt) routeArt.classList.toggle('is-arrived', k > 0.985);
  }

  /* Movimiento de cada producto según su paso por la pantalla (p: 0 → 1) */
  function moveVisual(v, p) {
    const still = reduce ? 0.5 : p;
    if (v.kind === 'row') {
      v.items.forEach((it, i) => {
        const k = reduce ? 1 : easeOut(seg(p, 0.08 + i * 0.07, 0.42 + i * 0.07));
        it.style.opacity = k.toFixed(3);
        it.style.transform = 'translate3d(0,' + ((1 - k) * 60 + (0.5 - still) * 16).toFixed(1) + 'px,0)';
        it.style.setProperty('--sheen', (-30 + 160 * seg(still, 0.2 + i * 0.05, 0.75 + i * 0.05)).toFixed(1) + '%');
      });
      return;
    }
    const it = v.items[0];
    if (!it) return;
    if (v.kind === 'spin') {
      if (v.spin) v.spin.set(0.25 + seg(p, 0.05, 0.95));
      it.style.transform = 'translate3d(0,' + ((0.5 - still) * 30).toFixed(1) + 'px,0)';
    } else if (v.kind === 'float') {
      it.style.transform = 'translate3d(0,' + ((0.5 - still) * 46).toFixed(1) + 'px,0) rotate(' + ((0.5 - still) * -7).toFixed(2) + 'deg)';
      it.style.setProperty('--sheen', (-30 + 160 * seg(still, 0.2, 0.8)).toFixed(1) + '%');
    } else {
      it.style.transform = 'translate3d(0,' + ((0.5 - still) * 50).toFixed(1) + 'px,0) scale(' + (0.96 + 0.04 * ease(seg(still, 0, 0.5))).toFixed(4) + ')';
      it.style.setProperty('--sheen', (-30 + 160 * seg(still, 0.2, 0.8)).toFixed(1) + '%');
    }
  }

  /* Bucle de scroll (solo trabaja con lo que está a la vista) */
  let ticking = false;
  function tick() {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of intros) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) continue;
      const p = clamp01((vh - r.top) / (vh + r.height));
      el.style.setProperty('--p', p.toFixed(4));
      if (el.dataset.intro === 'route') drawRoute(p);
      for (const v of visuals) if (v.intro === el) moveVisual(v, p);
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { visuals.forEach(v => v.spin && v.spin.resize()); onScroll(); });
  drawRoute(reduce ? 1 : 0);
  visuals.forEach(v => moveVisual(v, 0.5));
  tick();
})();
