# Basikz · basikz.store

Tienda estática: catálogo + bolsa + pedido por WhatsApp. No tiene servidor, base de datos ni cuentas de usuario.

## Archivos
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página. Textos de secciones, preguntas frecuentes y pie. |
| `assets/app.js` | **Lo único que vas a editar seguido**: datos de contacto, cuentas, catálogo y portada. |
| `assets/p/` | Fotos de los productos, sin fondo (WebP transparente). |
| `assets/360/` | Las 36 fotos reales de cada tenis para el giro en 360° (Samba y ASICS). |
| `assets/hero.js` | La portada (producto real + giro 360°). No hace falta tocarlo. |
| `assets/motion.js` | Animaciones de las secciones. No hace falta tocarlo. |
| `assets/styles.css` | Colores, letras y diseño. |
| `CNAME`, `_headers`, `robots.txt`, `.gitignore` | Dominio, seguridad y buscadores. |

## Qué cambiar y dónde
Todo está al inicio de `assets/app.js`:
- `CONFIG.whatsapp`: tu número con 504, solo dígitos.
- `CONFIG.paypalMe`: tu usuario de PayPal.me. Mientras esté vacío, PayPal sale como "Próximamente".
- `CONFIG.tipoCambio`: lempiras por dólar (para cobrar por PayPal).
- `CONFIG.bancos`: cuentas BAC y Ficohsa.
- `PRODUCTS`: el catálogo (nombre, precio, foto, categoría).
- `HERO`: las 4 portadas (pregunta, entre qué productos elige y video opcional).

### Agregar un producto nuevo
1. Foto sin fondo en PNG o WebP (puedes quitar el fondo gratis en remove.bg) dentro de `assets/p/`, ej. `assets/p/asad.webp`.
2. En `PRODUCTS` copia una línea parecida y cambia `id`, nombre, precio e `img: P + 'asad.webp'`.
3. Si es un tenis con fotos 360°, pon sus 36 fotos como `01.webp` … `36.webp` en `assets/360/nombre/` y agrega `spin: 'assets/360/nombre/'`.

## La portada
- Cada vez que alguien abre la tienda sale **una sola** portada al azar (nunca la misma dos veces seguidas): ¿Perfumes?, ¿Lujo?, ¿Zapatos? o ¿Audio?
- Primero sale la pregunta; al deslizar entra el producto real (los zapatos giran en 360° con sus fotos reales) y llega la ficha con nombre, precio y botón de compra.
- Con "reducir movimiento" activado en el teléfono, la portada sale quieta con el producto y la ficha.

### Links para anuncios (portada y producto fijos)
- `https://basikz.store/?escena=perfumes` · `?escena=lujo` · `?escena=zapatos` · `?escena=audio`
- Producto exacto: `https://basikz.store/?escena=zapatos&producto=samba` (o `asics1130`, `khamrah`, `yara`, `yaramoi`, `p-sauvage`, `p-bleu`, `p-dhi`, `jblgo4`, `p30i`).

### Poner un video en la portada (opcional)
La portada acepta un video que avanza con el scroll (ej.: el frasco y luego las manos atomizándose el antebrazo).
1. Graba 3 a 4 segundos con fondo claro y buena luz.
2. Pásamelo y lo dejo listo para que se mueva suave con el dedo (pesa unos 2–4 MB).
3. Súbelo a `assets/` y en `assets/app.js`, dentro de `HERO.perfumes`, cambia `video: ''` por `video: 'assets/portada-perfume.mp4'`.

## Publicar gratis en GitHub Pages
1. Crea una cuenta en github.com y un repositorio público llamado `basikz`.
2. Sube TODO el contenido de esta carpeta (incluida la carpeta `assets`) con Add file → Upload files. Si ya tenías la versión anterior, sube los archivos nuevos encima: GitHub reemplaza los que tienen el mismo nombre.
3. Settings → Pages → Branch: `main` → Save.
4. En Custom domain escribe `basikz.store` (el archivo `CNAME` ya lo trae).
5. Namecheap → Domain List → basikz.store → Advanced DNS:
   - Registros A, Host `@`: 185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153
   - Registro CNAME, Host `www`, valor `TUUSUARIO.github.io`
   - Borra los registros de "parking" de Namecheap.
6. Cuando GitHub verifique el dominio, marca **Enforce HTTPS**.

## Seguridad
| Punto | Estado |
|---|---|
| Ocultar API keys | No hay llaves privadas. El número de WhatsApp, las cuentas bancarias y PayPal.me son datos públicos a propósito. |
| Secretos fuera de Git | `.gitignore` bloquea .env, llaves y archivos "secrets". No subas nada de eso. |
| Llave pública para DB / RLS / restringir registros | No aplica: no hay base de datos. |
| Encriptar datos sensibles | No se guardan datos del cliente. La bolsa vive solo en su navegador; el pedido viaja por WhatsApp (cifrado de extremo a extremo). |
| Autenticación / cookies de sesión / hash de contraseñas | No aplica: no hay cuentas ni contraseñas ni cookies. |
| Bloquear manipulación de campos | Los precios siempre salen del catálogo, nunca de lo guardado en el navegador. Cantidades limitadas de 1 a 20. Igual: confirma el monto antes de entregar. |
| Rate limiting / bots | No hay servidor que atacar. El botón de enviar se bloquea 4 s para evitar envíos repetidos. |
| Queries parametrizadas | No aplica: no hay base de datos. |
| Validar inputs | Nombre y ciudad con caracteres permitidos y largo máximo; comentarios con máximo 300. |
| Sanitizar contenido | Todo texto se escapa antes de mostrarse; se eliminan `<`, `>` y caracteres de control del mensaje. |
| Security headers | CSP y Referrer-Policy en `index.html` (sin scripts ni estilos en línea). `_headers` trae las cabeceras completas (HSTS, X-Frame-Options, etc.) para Cloudflare Pages o Netlify; GitHub Pages no permite cabeceras propias. |
| Forzar HTTPS | "Enforce HTTPS" en GitHub Pages + redirección en el código + `upgrade-insecure-requests`. |
| Escanear dependencias | No hay paquetes npm ni librerías externas: las animaciones están hechas a mano. Solo se carga Google Fonts. Las fotos están dentro de la página (ya no dependen de Shopify). |
