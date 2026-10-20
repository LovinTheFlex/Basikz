/* =====================================================================
   BASIKZ · tienda estática con pedido por WhatsApp
   ---------------------------------------------------------------------
   CONFIGURACIÓN: lo único que normalmente cambias está en este bloque.
   Nada de esto es secreto: es información que el cliente necesita ver
   para pagarte. Esta página NO guarda contraseñas ni llaves privadas.
   ===================================================================== */
const CONFIG = {
  whatsapp: '50487510671',            // con 504, solo dígitos
  paypalMe: '',                       // tu usuario de PayPal.me (ej. 'basikzstore'). Vacío = PayPal "próximamente"
  tipoCambio: 27.027,                 // lempiras por dólar, para cobrar por PayPal en USD
  bancos: [
    { id: 'bac',     banco: 'BAC Credomatic', cuenta: '754989191',    titular: 'Jose Raul Wilson Flores' },
    { id: 'ficohsa', banco: 'Ficohsa',        cuenta: '200005461517', titular: 'Jose Raul Wilson Zeron' }
  ]
};

/* CATÁLOGO: para agregar, quitar o cambiar precios, edita esta lista.
   Las fotos van sin fondo (PNG/WebP transparente) en la carpeta assets/p/.
   spin: carpeta con las 36 fotos en 360° (solo zapatos). */
const P = 'assets/p/';
const PRODUCTS = [
  { id: 'khamrah', cat: 'perfumes', vendor: 'Lattafa', name: 'Khamrah', size: '100 ml', desc: 'Dulce y cálido: canela, dátiles y vainilla. Unisex.', price: 1510, tag: 'Viral', img: P + 'khamrah.webp' },
  { id: 'yara', cat: 'perfumes', vendor: 'Lattafa', name: 'Yara', size: '100 ml', desc: 'Cremoso, vainilla y notas frutales. Mujer.', price: 1510, tag: 'Top mujer', img: P + 'yara.webp' },
  { id: 'yaramoi', cat: 'perfumes', vendor: 'Lattafa', name: 'Yara Moi', size: '100 ml', desc: 'Floral y suave, ideal para el día. Mujer.', price: 1410, tag: 'Mejor precio', img: P + 'yaramoi.webp' },
  { id: '9pm', cat: 'perfumes', vendor: 'Afnan', name: '9PM', size: '100 ml', desc: 'Dulce y especiado, para la noche. Hombre.', price: 1510, img: P + '9pm.webp' },
  { id: 'vsbare', cat: 'perfumes', vendor: "Victoria's Secret", name: 'Bare Vanilla Mist', size: '250 ml', desc: 'Body mist de vainilla para todos los días.', price: 725, img: P + 'vsbare.webp' },

  { id: 'd-yaramoi', cat: 'decants', name: 'Yara Moi', size: '10 ml', desc: 'Lattafa · atomizador de vidrio', price: 260, ref: 'yaramoi' },
  { id: 'd-khamrah', cat: 'decants', name: 'Khamrah', size: '10 ml', desc: 'Lattafa · atomizador de vidrio', price: 300, ref: 'khamrah' },
  { id: 'd-cdni', cat: 'decants', name: 'Club de Nuit Intense', size: '10 ml', desc: 'Armaf · atomizador de vidrio', price: 300 },
  { id: 'd-9pm', cat: 'decants', name: '9PM', size: '10 ml', desc: 'Afnan · atomizador de vidrio', price: 300, ref: '9pm' },
  { id: 'd-yara', cat: 'decants', name: 'Yara', size: '10 ml', desc: 'Lattafa · atomizador de vidrio', price: 320, ref: 'yara' },
  { id: 'd-kit', cat: 'decants', name: 'Kit de prueba', size: '4 × 5 ml', desc: 'Elige 4 aromas (escríbelos en comentarios)', price: 650 },

  { id: 'p-sauvage', cat: 'preventa', vendor: 'Dior', name: 'Sauvage Eau de Parfum', size: '100 ml', desc: 'Fresco y especiado: bergamota, pimienta y ambroxan.', price: 9065, img: P + 'sauvage.webp' },
  { id: 'p-bleu', cat: 'preventa', vendor: 'Chanel', name: 'Bleu de Chanel Eau de Parfum', size: '100 ml', desc: 'Amaderado y aromático: cítricos, incienso y sándalo.', price: 9065, img: P + 'bleu.webp' },
  { id: 'p-dhi', cat: 'preventa', vendor: 'Dior', name: 'Homme Intense Eau de Parfum', size: '100 ml', desc: 'Iris, ámbar y cedro. Elegante y cálido.', price: 9065, img: P + 'dhi.webp' },

  { id: 'asics1130', cat: 'zapatos', vendor: 'ASICS', name: 'Gel-1130 White / Cloud Grey', size: 'Talla 9.5 US', desc: 'El retro runner más pedido del momento.', price: 4795, img: P + 'asics1130.webp', spin: 'assets/360/asics/' },
  { id: 'samba', cat: 'zapatos', vendor: 'adidas', name: 'Samba OG Black / White / Gum', size: 'Talla 9 US', desc: 'El clásico que combina con todo.', price: 4415, img: P + 'samba.webp', spin: 'assets/360/samba/' },

  { id: 'p30i', cat: 'accesorios', vendor: 'Soundcore', name: 'P30i', size: 'Audífonos', desc: 'Cancelación de ruido y estuche de carga.', price: 1550, img: P + 'p30i.webp' },
  { id: 'jblgo4', cat: 'accesorios', vendor: 'JBL', name: 'Go 4', size: 'Bocina', desc: 'Bluetooth, resistente al agua y al polvo.', price: 2275, img: P + 'jblgo4.webp' },
  { id: 'wahl', cat: 'accesorios', vendor: 'Wahl', name: 'Beard Trimmer Kit', size: 'Barba', desc: 'Para recortar y perfilar la barba.', price: 1315 },
  { id: 'akunbem', cat: 'accesorios', vendor: 'Akunbem', name: 'Trimmer corporal', size: 'Cuerpo', desc: 'Recargable y resistente al agua.', price: 2280 }
];

/* PORTADA: cada visita muestra UNA de estas escenas al azar, con uno de sus productos.
   - pregunta: la palabra grande del inicio.
   - productos: entre cuáles elige (los zapatos giran en 360° con el scroll).
   - video: opcional, ej. 'assets/hero/perfumes.mp4' (se reproduce con el scroll).
   Para forzar una escena en un enlace: basikz.store/?escena=zapatos */
const HERO = {
  perfumes: { pregunta: '¿Perfumes?', productos: ['khamrah', 'yara', 'yaramoi'], seccion: '#perfumes', nombre: 'perfumes', video: '' },
  lujo:     { pregunta: '¿Lujo?',     productos: ['p-sauvage', 'p-bleu', 'p-dhi'], seccion: '#preventa', nombre: 'la preventa', video: '' },
  zapatos:  { pregunta: '¿Zapatos?',  productos: ['samba', 'asics1130'], seccion: '#zapatos', nombre: 'zapatos', video: '' },
  audio:    { pregunta: '¿Audio?',    productos: ['jblgo4', 'p30i'], seccion: '#accesorios', nombre: 'audio y aseo', video: '' }
};
window.BASIKZ_DATA = Object.freeze({ products: PRODUCTS, hero: HERO });

/* =====================================================================
   A partir de aquí no hace falta tocar nada.
   ===================================================================== */
(function () {
  'use strict';

  // Forzar HTTPS si alguien entra por http:// (GitHub Pages también lo fuerza)
  if (location.protocol === 'http:' && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
    return;
  }

  const $ = (s, r = document) => r.querySelector(s);
  const byId = Object.create(null);
  PRODUCTS.forEach(p => { byId[p.id] = p; });
  const money = n => 'L ' + Math.round(n).toLocaleString('en-US');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const full = p => (p.vendor ? p.vendor + ' ' : '') + p.name + (p.size ? ' ' + p.size : '');
  const MAX_QTY = 20;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- bolsa (solo en este navegador; los precios SIEMPRE salen del catálogo) ---------- */
  let bag = {};
  try {
    const raw = JSON.parse(localStorage.getItem('basikz-bag') || '{}');
    if (raw && typeof raw === 'object') {
      for (const id of Object.keys(raw)) {
        const q = Number(raw[id]);
        if (byId[id] && Number.isInteger(q) && q > 0) bag[id] = Math.min(q, MAX_QTY);
      }
    }
  } catch (e) { bag = {}; }
  const save = () => { try { localStorage.setItem('basikz-bag', JSON.stringify(bag)); } catch (e) {} };
  const count = () => Object.values(bag).reduce((a, b) => a + b, 0);
  const total = () => Object.entries(bag).reduce((s, [id, q]) => s + byId[id].price * q, 0);

  /* ---------- render del catálogo ---------- */
  const imgTag = (p, alt) => p.img
    ? `<img src="${esc(p.img)}" alt="${esc(alt == null ? full(p) : alt)}" loading="lazy" decoding="async">`
    : `<span class="ph"><b>${esc(p.vendor || 'Basikz')}</b>Foto próximamente</span>`;
  const card = p => `<article class="card reveal">
      <div class="card__media">${imgTag(p)}${p.tag ? `<span class="card__tag">${esc(p.tag)}</span>` : ''}</div>
      ${p.vendor ? `<span class="card__vendor">${esc(p.vendor)}</span>` : ''}
      <span class="card__name">${esc(p.name)}</span>
      ${p.desc ? `<span class="card__desc">${esc(p.desc)}</span>` : ''}
      <div class="card__row"><span class="card__price">${money(p.price)}</span><button class="txt-btn" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(full(p))}">Agregar</button></div>
    </article>`;
  const of = c => PRODUCTS.filter(p => p.cat === c);

  function renderCatalog() {
    $('#gridPerfumes').innerHTML = of('perfumes').map(card).join('');
    $('#gridZapatos').innerHTML = of('zapatos').map(card).join('');
    $('#gridAccesorios').innerHTML = of('accesorios').map(card).join('');
    $('#listDecants').innerHTML = of('decants').map(p => `<div class="drow">
        <span class="drow__img">${p.ref && byId[p.ref] && byId[p.ref].img ? imgTag(byId[p.ref], '') : ''}</span>
        <div><strong>${esc(p.name)} · ${esc(p.size)}</strong><small>${esc(p.desc || '')}</small></div>
        <span class="price">${money(p.price)}</span>
        <button class="txt-btn" type="button" data-add="${esc(p.id)}" aria-label="Agregar decant ${esc(p.name)}">Agregar</button></div>`).join('');
    $('#gridPreventa').innerHTML = of('preventa').map(p => `<article class="luxcard reveal">
        <div class="luxcard__img">${imgTag(p)}</div>
        <div class="luxcard__body"><span class="card__vendor">${esc(p.vendor)}</span><span class="card__name">${esc(p.name)}</span>
        <div class="card__row"><span class="card__price">${money(p.price)}</span><button class="txt-btn" type="button" data-add="${esc(p.id)}" aria-label="Apartar ${esc(full(p))}">Apartar</button></div></div>
      </article>`).join('');
    const tiles = [
      ['perfumes', 'Perfumes', 'Árabes y diseñador', 'khamrah'],
      ['preventa', 'Lujo', 'Por encargo', 'p-sauvage'],
      ['zapatos', 'Zapatos', 'Stock y encargo', 'samba'],
      ['accesorios', 'Audio y aseo', 'Para todos los días', 'jblgo4']
    ];
    $('#cats').innerHTML = tiles.map(([href, t, s, pid]) => `<a class="cat" href="#${href}">${imgTag(byId[pid], '')}<strong>${esc(t)}</strong><span>${esc(s)}</span></a>`).join('');
    $('#year').textContent = String(new Date().getFullYear());
  }

  /* ---------- azar seguro (para códigos de pedido) ---------- */
  const rnd = n => {
    const a = new Uint32Array(1);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a); else a[0] = Math.floor(Math.random() * 4294967296);
    return a[0] % n;
  };

  /* ---------- bolsa y pagos ---------- */
  const PAY = [
    ...CONFIG.bancos.map(b => ({ id: b.id, label: 'Transferencia ' + b.banco, sub: 'Te mostramos la cuenta al elegirla' })),
    { id: 'paypal', label: 'PayPal', sub: CONFIG.paypalMe ? 'Pago en dólares con tarjeta o saldo PayPal' : 'Próximamente', disabled: !CONFIG.paypalMe },
    { id: 'contra', label: 'Contra entrega', sub: 'Pagas al recibir (según tu zona)' }
  ];
  let payChoice = PAY[0].id;
  let orderCode = '';
  const newCode = () => {
    const d = new Date(), pad = n => String(n).padStart(2, '0');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = ''; for (let i = 0; i < 4; i++) s += chars[rnd(chars.length)];
    return `BKZ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${s}`;
  };
  const usd = l => Math.ceil((l / CONFIG.tipoCambio) * 100) / 100;

  function renderPayOpts() {
    $('#payOpts').innerHTML = PAY.map(o => `<label class="opt"><input type="radio" name="pay" value="${esc(o.id)}"${o.id === payChoice ? ' checked' : ''}${o.disabled ? ' disabled' : ''}><span><b>${esc(o.label)}</b><small>${esc(o.sub)}</small></span></label>`).join('');
  }
  function renderPayBox() {
    const box = $('#payBox');
    const bank = CONFIG.bancos.find(b => b.id === payChoice);
    if (!count()) { box.hidden = true; return; }
    if (!orderCode) orderCode = newCode();
    if (bank) {
      box.innerHTML = `<dl><dt>Banco</dt><dd>${esc(bank.banco)}</dd><dt>Cuenta</dt><dd><span class="copy-row"><span>${esc(bank.cuenta)}</span><button class="copy-btn" type="button" data-copy="${esc(bank.cuenta)}">Copiar</button></span></dd><dt>A nombre de</dt><dd>${esc(bank.titular)}</dd><dt>Monto</dt><dd>${money(total())} + envío</dd><dt>Referencia</dt><dd><span class="copy-row"><span>${esc(orderCode)}</span><button class="copy-btn" type="button" data-copy="${esc(orderCode)}">Copiar</button></span></dd></dl>
        <p class="note">Transfiere el total, escribe tu código de pedido como referencia y envíanos el comprobante por WhatsApp.</p>`;
      box.hidden = false;
    } else if (payChoice === 'paypal' && CONFIG.paypalMe) {
      const amount = usd(total()).toFixed(2);
      const href = `https://www.paypal.me/${encodeURIComponent(CONFIG.paypalMe)}/${amount}USD`;
      box.innerHTML = `<dl><dt>Total en dólares</dt><dd>$${amount} USD</dd><dt>Referencia</dt><dd>${esc(orderCode)}</dd></dl>
        <a class="btn btn--block" href="${esc(href)}" target="_blank" rel="noopener noreferrer">Pagar $${amount} con PayPal</a>
        <p class="note">Cambio usado: L ${CONFIG.tipoCambio} por dólar. Después de pagar, envía tu pedido por WhatsApp.</p>`;
      box.hidden = false;
    } else if (payChoice === 'contra') {
      box.innerHTML = '<p class="note">Pagas en efectivo o transferencia al recibir. Te confirmamos si tu zona tiene entrega disponible.</p>';
      box.hidden = false;
    } else { box.hidden = true; }
  }

  function drawBag() {
    $('#bagCount').textContent = String(count());
    const ids = Object.keys(bag);
    $('#bagLines').innerHTML = ids.length ? ids.map(id => { const p = byId[id], q = bag[id];
      const ip = p.img ? p : (p.ref && byId[p.ref]) || null;
      return `<div class="line"><div class="line__img">${ip && ip.img ? imgTag(ip, '') : ''}</div>
        <div><b>${esc(full(p))}</b>${p.cat === 'preventa' ? '<small>Preventa</small>' : p.cat === 'decants' ? '<small>Decant</small>' : ''}
          <div class="qty"><button type="button" data-dec="${esc(id)}" aria-label="Quitar uno de ${esc(p.name)}">−</button><span>${q}</span><button type="button" data-inc="${esc(id)}" aria-label="Agregar uno de ${esc(p.name)}">+</button></div></div>
        <span class="lp">${money(p.price * q)}</span></div>`; }).join('')
      : '<p class="empty">Tu bolsa está vacía.</p>';
    $('#bagTotal').textContent = money(total());
    $('#preNote').hidden = !ids.some(id => byId[id].cat === 'preventa');
    $('#orderForm').hidden = !ids.length;
    $('#sendOrder').disabled = !ids.length;
    renderPayBox();
  }

  let toastT;
  function toast(msg) { if (!$('#drawer').hidden) return; const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2200); }
  let lastFocus = null;
  function openBag() { lastFocus = document.activeElement; $('#overlay').hidden = false; $('#drawer').hidden = false; document.body.style.overflow = 'hidden'; $('#closeBag').focus(); }
  function closeBag() { $('#overlay').hidden = true; $('#drawer').hidden = true; document.body.style.overflow = ''; (lastFocus || $('#openBag')).focus(); }

  const waUrl = text => 'https://wa.me/' + CONFIG.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
  const goWA = text => { window.open(waUrl(text), '_blank', 'noopener') || (location.href = waUrl(text)); };

  // Validación y limpieza de lo que escribe el cliente
  const clean = (s, max) => String(s || '').replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{2,60}$/;
  const CITY_RE = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ'#,.()\- ]{3,80}$/;

  let sending = false;
  function sendOrder() {
    const f = $('#orderForm'), warn = $('#formWarn');
    const name = clean(f.name.value, 60), city = clean(f.city.value, 80), notes = clean(f.notes.value, 300);
    f.name.setAttribute('aria-invalid', String(!NAME_RE.test(name)));
    f.city.setAttribute('aria-invalid', String(!CITY_RE.test(city)));
    const fail = m => { warn.textContent = m; warn.hidden = false; };
    if (!count()) return fail('Agrega al menos un producto.');
    if (!NAME_RE.test(name)) { f.name.focus(); return fail('Escribe tu nombre (solo letras, de 2 a 60 caracteres).'); }
    if (!CITY_RE.test(city)) { f.city.focus(); return fail('Escribe tu ciudad y colonia (de 3 a 80 caracteres).'); }
    if (sending) return;
    warn.hidden = true;
    if (!orderCode) orderCode = newCode();
    const opt = PAY.find(o => o.id === payChoice) || PAY[0];
    const delivery = { sps: 'Entrega en San Pedro Sula', envio: 'Envío a otra ciudad', recoger: 'Paso a recoger' }[f.delivery.value] || 'Por definir';
    const lines = Object.entries(bag).map(([id, q]) => { const p = byId[id];
      return `• ${q} × ${full(p)}${p.cat === 'preventa' ? ' (PREVENTA)' : p.cat === 'decants' ? ' (decant)' : ''} — ${money(p.price * q)}`; });
    const msg = [
      `Hola Basikz, quiero hacer este pedido (${orderCode}):`, '', ...lines, '',
      `Total: ${money(total())} + envío`,
      payChoice === 'paypal' ? `En dólares: $${usd(total()).toFixed(2)} USD` : null, '',
      `Nombre: ${name}`, `Ciudad/colonia: ${city}`, `Entrega: ${delivery}`, `Pago: ${opt.label}`,
      notes ? `Comentarios: ${notes}` : null
    ].filter(l => l !== null).join('\n');
    sending = true; $('#sendOrder').disabled = true;
    setTimeout(() => { sending = false; $('#sendOrder').disabled = !count(); }, 4000); // evita envíos repetidos
    goWA(msg);
  }

  function copy(text, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = 'Copiado'; setTimeout(() => { btn.textContent = o; }, 1500); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
    else fallback();
    function fallback() { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); }
  }

  function confirmAdd(btn) {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.classList.add('is-added'); btn.textContent = 'Agregado';
    clearTimeout(btn._t); btn._t = setTimeout(() => { btn.textContent = btn.dataset.label; btn.classList.remove('is-added'); }, 1400);
    const c = $('#bagCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }

  /* ---------- eventos ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-ask],[data-copy]');
    if (!t) return;
    const d = t.dataset;
    if (d.add && byId[d.add]) { bag[d.add] = Math.min((bag[d.add] || 0) + 1, MAX_QTY); save(); drawBag(); toast('Agregado: ' + byId[d.add].name); confirmAdd(t); }
    else if (d.inc && byId[d.inc]) { bag[d.inc] = Math.min((bag[d.inc] || 0) + 1, MAX_QTY); save(); drawBag(); }
    else if (d.dec && bag[d.dec]) { bag[d.dec]--; if (bag[d.dec] <= 0) delete bag[d.dec]; save(); drawBag(); }
    else if (d.ask) goWA(d.ask === 'shoes' ? 'Hola Basikz, quiero cotizar unos zapatos por encargo: ' : 'Hola Basikz, tengo una consulta: ');
    else if (d.copy) copy(d.copy, t);
  });
  document.addEventListener('change', e => {
    if (e.target.name === 'pay') { const o = PAY.find(x => x.id === e.target.value); if (o && !o.disabled) { payChoice = o.id; renderPayBox(); } }
  });
  $('#openBag').addEventListener('click', openBag);
  $('#closeBag').addEventListener('click', closeBag);
  $('#overlay').addEventListener('click', closeBag);
  $('#sendOrder').addEventListener('click', sendOrder);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#drawer').hidden) closeBag(); });
  const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  const header = $('#siteHeader');
  menuBtn.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); header.classList.toggle('menu-open', open); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); header.classList.remove('menu-open'); } });

  /* ---------- arranque ---------- */
  renderCatalog();
  renderPayOpts();
  drawBag();
})();
