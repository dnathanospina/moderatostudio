/* Moderato Studio — página de entrega (opción A: Google Drive).
   Lee los datos del bloque <script id="entrega"> de cada página y construye la entrega.
   Todo el texto se inserta como texto (nunca como HTML). */

(function () {
  const T = {
    es: {
      privada: 'Entrega privada · acceso por enlace',
      entrega: n => `Entrega n.º ${n}`,
      para: 'Para',
      contenido: 'Contenido', tamano: 'Tamaño', hasta: 'Disponible hasta',
      carpeta: 'Abrir la carpeta en Google Drive',
      video: 'Vídeo', fotos: 'Fotografías', archivos: 'Archivos',
      verTodas: 'Ver todas en Google Drive',
      abrir: 'Abrir', archivo: 'Archivo',
      nota: f => `Los archivos estarán disponibles hasta el ${f}. Conviene descargarlos y guardar una copia antes de esa fecha.`,
      notaDrive: 'Las descargas se abren en Google Drive. Con archivos grandes, Drive avisa de que no puede analizarlos en busca de virus: es normal y se pueden descargar igualmente.',
      ayuda: '¿Algún problema con la descarga?', lema: 'Compuesto en tempo moderato',
      foto: n => `Fotografía ${n}`, boton: 'EN', botonAria: 'View in English'
    },
    en: {
      privada: 'Private delivery · link access',
      entrega: n => `Delivery no. ${n}`,
      para: 'For',
      contenido: 'Contents', tamano: 'Size', hasta: 'Available until',
      carpeta: 'Open the folder in Google Drive',
      video: 'Video', fotos: 'Photographs', archivos: 'Files',
      verTodas: 'See all in Google Drive',
      abrir: 'Open', archivo: 'File',
      nota: f => `Files will be available until ${f}. Please download them and keep a copy before that date.`,
      notaDrive: 'Downloads open in Google Drive. For large files Drive warns that it cannot scan them for viruses: this is normal and they can still be downloaded.',
      ayuda: 'Any trouble downloading?', lema: 'Composed in tempo moderato',
      foto: n => `Photograph ${n}`, boton: 'ES', botonAria: 'Ver en español'
    }
  };

  const datos = JSON.parse(document.getElementById('entrega').textContent);
  const main = document.getElementById('contenido-entrega');
  const enlace = id => `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;

  function el(tag, attrs, ...hijos) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') e.className = v; else e.setAttribute(k, v);
    }
    for (const h of hijos) if (h != null) e.append(h);
    return e;
  }
  const romano = n => ['I', 'II', 'III', 'IV'][n];

  function cabeceraSeccion(i, titulo) {
    return el('div', { class: 'entrega-titulo' },
      el('span', { class: 'entrega-titulo__num' }, romano(i)),
      el('h2', { class: 'titulo-seccion' }, titulo));
  }

  function pintar(lang) {
    const t = T[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(n => { n.textContent = t[n.dataset.t]; });
    const b = document.querySelector('[data-idioma-entrega]');
    b.textContent = t.boton; b.setAttribute('aria-label', t.botonAria);
    main.replaceChildren();
    let n = 0;

    main.append(el('section', { class: 'entrega-portada contenedor' },
      el('span', { class: 'etiqueta' }, `${t.entrega(datos.numero)} · ${datos.fechaEntrega}`),
      el('div', { class: 'entrega-portada__titulos' },
        el('h1', {}, datos.titulo),
        el('p', {}, `${t.para} ${datos.cliente} · ${datos.lugar}, ${datos.fechaRodaje}`)),
      el('span', { class: 'linea-laton', 'aria-hidden': 'true' }),
      el('div', { class: 'entrega-portada__fila' },
        el('dl', { class: 'entrega-datos' },
          el('div', {}, el('dt', {}, t.contenido), el('dd', {}, datos.contenido)),
          el('div', {}, el('dt', {}, t.tamano), el('dd', {}, datos.tamano)),
          el('div', {}, el('dt', {}, t.hasta), el('dd', {}, datos.disponibleHasta))),
        el('a', { class: 'boton', href: datos.carpeta, target: '_blank', rel: 'noopener' }, t.carpeta))));

    if (datos.videos && datos.videos.length) {
      const sec = el('section', { class: 'entrega-seccion contenedor' }, cabeceraSeccion(n++, t.video));
      datos.videos.forEach((v, i) => {
        if (i === 0) {
          sec.append(el('div', { class: 'entrega-video' },
            el('iframe', { src: `https://drive.google.com/file/d/${encodeURIComponent(v.id)}/preview`, title: v.titulo, allow: 'autoplay; fullscreen', loading: 'lazy' })));
        }
      });
      const lista = el('ul', { class: 'entrega-lista' });
      datos.videos.forEach(v => lista.append(el('li', {},
        el('em', {}, v.titulo), el('span', { class: 'etiqueta' }, v.detalle),
        el('a', { href: enlace(v.id), target: '_blank', rel: 'noopener' }, t.abrir))));
      sec.append(lista);
      main.append(sec);
    }

    if (datos.fotos && datos.fotos.length) {
      const sec = el('section', { class: 'entrega-seccion contenedor' },
        el('div', { class: 'entrega-titulo-fila' }, cabeceraSeccion(n++, t.fotos),
          el('a', { class: 'subrayado etiqueta-clara', href: datos.carpeta, target: '_blank', rel: 'noopener' }, t.verTodas)));
      const rejilla = el('div', { class: 'entrega-fotos' });
      datos.fotos.forEach((f, i) => {
        const num = String(i + 1).padStart(3, '0');
        rejilla.append(el('figure', {},
          el('a', { href: enlace(f.id), target: '_blank', rel: 'noopener', 'aria-label': t.foto(num) },
            el('img', { src: `https://drive.google.com/thumbnail?id=${encodeURIComponent(f.id)}&sz=w1200`, alt: '', loading: 'lazy' })),
          el('figcaption', { class: 'etiqueta' }, num)));
      });
      sec.append(rejilla);
      main.append(sec);
    }

    if (datos.archivos && datos.archivos.length) {
      const sec = el('section', { class: 'entrega-seccion contenedor' }, cabeceraSeccion(n++, t.archivos));
      const tbody = el('tbody');
      datos.archivos.forEach(a => tbody.append(el('tr', {},
        el('td', {}, a.nombre), el('td', { class: 'tenue' }, a.contenido), el('td', { class: 'tenue derecha' }, a.tamano),
        el('td', { class: 'derecha' }, el('a', { class: 'subrayado', href: enlace(a.id), target: '_blank', rel: 'noopener' }, t.abrir)))));
      sec.append(el('div', { class: 'entrega-tabla' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', { scope: 'col' }, t.archivo), el('th', { scope: 'col' }, t.contenido),
          el('th', { scope: 'col', class: 'derecha' }, t.tamano), el('th', { scope: 'col' }, el('span', { class: 'sr-only' }, t.abrir)))),
        tbody)));
      main.append(sec);
    }

    main.append(el('section', { class: 'entrega-nota contenedor' },
      el('p', {}, t.nota(datos.disponibleHasta)),
      el('p', { class: 'etiqueta' }, t.notaDrive)));
  }

  function guardado() { try { return localStorage.getItem('idioma'); } catch (e) { return null; } }
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  let lang = guardado() || (['es', 'ca', 'gl', 'eu'].includes(nav) ? 'es' : 'en');
  pintar(lang);
  document.querySelector('[data-idioma-entrega]').addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('idioma', lang); } catch (e) {}
    pintar(lang);
  });
})();
