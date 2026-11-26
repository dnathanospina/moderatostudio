# Moderato Studio — Brief de la web

Fuente de verdad: `identidad/01-identidad-visual-moderato.md` (v1.1) del proyecto Moderato Studio en Claude.
Diseño de referencia: lienzo *Moderato Studio — paquete completo para revisión* (Web · Portada, Página de obra, Favicon y Entregas).

## Qué es Moderato Studio
Un sello de **ensayos audiovisuales**: piezas sobre lo que ocurre alrededor de una obra musical (el estudio, los lugares, los libros), escritas antes de rodar y filmadas con calidad de cine. No es una agencia: la web es un catálogo de obras. **Sin servicios ni precios.** La marca no se liga a una persona.

## Estructura
- `index.html` — Portada a pantalla completa (fotograma desenfocado + logotipo) · Conoce Moderato · carrusel de fotogramas · Obras (lista con números romanos) · pie crema con contacto.
- `obras/hortus-conclusus.html` — Página de obra (Mod. I, título provisional, en investigación). Cuando haya vídeo, sustituir el bloque `.obra-video__cine` por el reproductor de YouTube (barras 2,39:1).
- `entregas/` — Entregas privadas a clientes (opción A, Google Drive). Ver `entregas/README.md`. No se indexan (`noindex` + `robots.txt`) ni aparecen en el menú.
- `servicios.html`, `portfolio.html`, `contacto.html` — Solo redirigen a la portada, para no romper enlaces antiguos.
- `css/tokens.css` — Colores, fuentes y medidas. **Nunca escribir un color fuera de aquí.**
- `css/style.css` — Estilos de la web. `css/entregas.css` — estilos de las entregas.
- `js/main.js` — Idioma ES/EN, carrusel y año. `entregas/entrega.js` — genera cada página de entrega.
- `assets/marca/` — La M en vector (`m.svg` usa `currentColor`; `m-crema`, `m-sombra`, `m-laton`) e iconos de app.
- `assets/img/` — Portada, fotogramas e imagen para compartir (`og-image.jpg`, 1200 × 630).
- `assets/logos/` — Logos de la etapa anterior (verde). Ya no se usan; se conservan como archivo.

## Caché
Los enlaces a CSS y JS llevan `?v=AAAAMMDDHHMM`. **Al cambiar un CSS o JS, actualizar ese número en todas las páginas**; si no, móviles y tablets siguen usando la versión guardada.

## Favicon
- `favicon.svg`: solo la M, sin fondo; sombra en navegador claro y crema en oscuro (`prefers-color-scheme`).
- `favicon.ico` (16/32/48): la M sombra sin fondo, para navegadores antiguos.
- `apple-touch-icon.png` y `assets/marca/icon-192/512.png` (con `site.webmanifest`): M crema sobre noche.
- Pendiente: una M de trazo algo más grueso dibujada para 16 px.

## Idiomas (ES / EN)
El español está en el HTML. Cada texto traducible lleva `data-i18n="clave"` (o `data-i18n-attr="atributo:clave"`) y su inglés va en el objeto `EN` de `js/main.js`; el título y la descripción en inglés, en `META_EN` según el `data-page` del `<body>`. Idioma inicial: el guardado; si no, el del dispositivo (es, ca, gl, eu → español; el resto → inglés).

## Tipografía y color
Cormorant Garamond (títulos y texto) y Hanken Grotesk (logotipo, etiquetas, datos), desde Google Fonts. Base oscura (sombra) con texto crema; el pie en crema; el latón solo en líneas finas y aros. Títulos de obra siempre en cursiva; numeración en romanos; etiquetas en minúsculas normales (nunca mayúsculas espaciadas).

## Contacto
Mientras no exista el correo del dominio, la web usa **moderatostudio.es@gmail.com**. Cuando funcione **hola@moderatostudio.com** (reenvío de Namecheap o Cloudflare Email Routing), sustituirlo en `index.html`, `obras/*.html`, `entregas/plantilla/index.html` y `entregas/entrega.js`.

## Pendiente
- Correo del dominio y registro SPF (ver documento *Entregas a clientes desde moderatostudio.com*, sección VI).
- Aviso legal y política de privacidad: requieren los datos del titular (nombre o razón social, NIF, domicilio). Añadir la página y su enlace en el pie.
- Fotogramas en mayor resolución (los actuales son de 800 px de ancho).
- Vídeo de *Hortus conclusus* cuando se estrene; sección «Última obra» en la portada a partir de entonces.
- Opción B de entregas (Cloudflare R2 con contraseña), si se elige.
