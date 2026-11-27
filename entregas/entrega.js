/* Moderato Studio — página de entrega (opción A: Google Drive).
   Lee los datos del bloque <script id="entrega"> de cada página y construye la entrega.
   Todo el texto se inserta como texto (nunca como HTML). */

(function () {
  const T = {
    es: {
      privada: 'Entrega privada · acceso por enlace', privadaClave: 'Entrega privada · acceso con contraseña',
      entrega: n => `Entrega n.º ${n}`,
      para: 'Para',
      contenido: 'Contenido', tamano: 'Tamaño', hasta: 'Disponible hasta',
      carpeta: 'Abrir la carpeta en Google Drive',
      video: 'Vídeo', fotos: 'Fotografías', archivos: 'Archivos',
      verTodas: 'Ver todas en Google Drive',
      abrir: 'Abrir', archivo: 'Archivo',
      nota: f => `Los archivos estarán disponibles hasta ${f}. Conviene descargarlos y guardar una copia antes de esa fecha.`,
      notaDrive: 'Las descargas se abren en Google Drive. Con archivos grandes, Drive avisa de que no puede analizarlos en busca de virus: es normal y se pueden descargar igualmente.',
      ayuda: '¿Algún problema con la descarga?', lema: 'Compuesto en tempo moderato',
      foto: n => `Fotografía ${n}`, boton: 'EN', botonAria: 'View in English',
      fotosN: n => `${n.toLocaleString('es-ES')} fotografías. Pulsa una para verla en grande y descargarla en calidad completa.`,
      descargar: 'Descargar en calidad completa', cerrar: 'Cerrar', anterior: 'Anterior', siguiente: 'Siguiente',
      cargando: 'Cargando fotografías…', arriba: 'Volver arriba',
      notaSin: 'Conviene descargar los archivos y guardar una copia.',
      claveTitulo: 'Entrega privada', claveTexto: 'Escribe la contraseña que te hemos enviado para ver la entrega.',
      claveCampo: 'Contraseña', claveEntrar: 'Entrar', claveRecordar: 'Recordar en este dispositivo',
      claveMal: 'La contraseña no es correcta.', claveAbriendo: 'Abriendo…'
    },
    en: {
      privada: 'Private delivery · link access', privadaClave: 'Private delivery · password access',
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
      foto: n => `Photograph ${n}`, boton: 'ES', botonAria: 'Ver en español',
      fotosN: n => `${n.toLocaleString('en-GB')} photographs. Tap one to view it large and download it in full quality.`,
      descargar: 'Download full quality', cerrar: 'Close', anterior: 'Previous', siguiente: 'Next',
      cargando: 'Loading photographs…', arriba: 'Back to top',
      notaSin: 'Please download the files and keep a copy.',
      claveTitulo: 'Private delivery', claveTexto: 'Enter the password we sent you to view the delivery.',
      claveCampo: 'Password', claveEntrar: 'Enter', claveRecordar: 'Remember on this device',
      claveMal: 'That password is not correct.', claveAbriendo: 'Opening…'
    }
  };

  const bloquePlano = document.getElementById('entrega');
  const bloqueCifrado = document.getElementById('entrega-cifrada');
  let datos = bloquePlano ? JSON.parse(bloquePlano.textContent) : null;
  const main = document.getElementById('contenido-entrega');
  const enlace = id => `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;
  const miniatura = (id, w) => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${w}`;
  const descarga = id => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
  const normalizar = lista => lista.map(x => Array.isArray(x) ? { id: x[0], nombre: x[1] } : x);
  let fotos = datos && Array.isArray(datos.fotos) ? normalizar(datos.fotos) : [];

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
    arriba.setAttribute('aria-label', t.arriba); arriba.title = t.arriba;
    document.querySelectorAll('[data-t]').forEach(n => { n.textContent = t[n.dataset.t]; });
    if (bloqueCifrado) document.querySelector('[data-t="privada"]').textContent = t.privadaClave;
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
          datos.tamano ? el('div', {}, el('dt', {}, t.tamano), el('dd', {}, datos.tamano)) : null,
          datos.disponibleHasta ? el('div', {}, el('dt', {}, t.hasta), el('dd', {}, datos.disponibleHasta)) : null),
        el('a', { class: 'boton', href: datos.carpeta, target: '_blank', rel: 'noopener' }, t.carpeta))));

    main.append(el('section', { class: 'entrega-nota contenedor' },
      el('p', {}, datos.disponibleHasta ? t.nota(datos.disponibleHasta) : t.notaSin),
      el('p', { class: 'etiqueta' }, t.notaDrive),
      el('p', { class: 'etiqueta' }, `${t.ayuda} `, el('a', { class: 'subrayado-fino', href: 'mailto:moderatostudio.es@gmail.com' }, 'moderatostudio.es@gmail.com'))));

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

    if (fotos.length) {
      const sec = el('section', { class: 'entrega-seccion contenedor' },
        el('div', { class: 'entrega-titulo-fila' }, cabeceraSeccion(n++, t.fotos),
          el('a', { class: 'subrayado etiqueta-clara', href: datos.carpeta, target: '_blank', rel: 'noopener' }, t.verTodas)),
        el('p', { class: 'etiqueta' }, t.fotosN(fotos.length)));
      const rejilla = el('div', { class: 'entrega-fotos' });
      fotos.forEach((f, i) => {
        const num = String(i + 1).padStart(fotos.length > 999 ? 4 : 3, '0');
        const img = el('img', { src: miniatura(f.id, 320), alt: '', loading: 'lazy', decoding: 'async', width: '320', height: '213' });
        img.addEventListener('error', () => { if (!img.dataset.reintento) { img.dataset.reintento = '1'; setTimeout(() => { img.src = miniatura(f.id, 320) + '&r=1'; }, 1500); } });
        const boton = el('button', { type: 'button', 'aria-label': t.foto(num) }, img);
        boton.addEventListener('click', () => abrirVisor(i));
        rejilla.append(el('figure', {}, boton, el('figcaption', { class: 'etiqueta' }, num)));
      });
      sec.append(rejilla);
      main.append(sec);
    } else if (typeof datos.fotos === 'string') {
      main.append(el('section', { class: 'entrega-seccion contenedor' }, el('p', { class: 'etiqueta' }, t.cargando)));
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

  }

  /* Visor: vista previa grande, flechas, teclado, gesto lateral y descarga del original */
  let visor = null, actual = 0, langActual = 'es';
  function crearVisor() {
    const img = el('img', { class: 'visor__img', alt: '' });
    const num = el('span', { class: 'etiqueta visor__num' });
    const nombre = el('span', { class: 'etiqueta visor__nombre' });
    const bajar = el('a', { class: 'boton visor__bajar', rel: 'noopener' });
    const cerrar = el('button', { type: 'button', class: 'visor__cerrar' }, '×');
    const ant = el('button', { type: 'button', class: 'visor__flecha visor__flecha--ant' }, '‹');
    const sig = el('button', { type: 'button', class: 'visor__flecha visor__flecha--sig' }, '›');
    const caja = el('div', { class: 'visor', role: 'dialog', 'aria-modal': 'true', hidden: '' },
      el('div', { class: 'visor__barra' }, el('div', {}, num, nombre), cerrar),
      el('div', { class: 'visor__escena' }, ant, img, sig),
      el('div', { class: 'visor__pie' }, bajar));
    document.body.append(caja);
    cerrar.addEventListener('click', cerrarVisor);
    ant.addEventListener('click', () => mostrar(actual - 1));
    sig.addEventListener('click', () => mostrar(actual + 1));
    caja.addEventListener('click', e => { if (e.target === caja || e.target.classList.contains('visor__escena')) cerrarVisor(); });
    let x0 = null;
    caja.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    caja.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1)); x0 = null; });
    document.addEventListener('keydown', e => {
      if (caja.hidden) return;
      if (e.key === 'Escape') cerrarVisor();
      else if (e.key === 'ArrowRight') mostrar(actual + 1);
      else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    });
    return { caja, img, num, nombre, bajar, cerrar, ant, sig };
  }
  function mostrar(i) {
    actual = (i + fotos.length) % fotos.length;
    const f = fotos[actual], t = T[langActual];
    visor.img.src = miniatura(f.id, 320);
    const grande = new Image();
    grande.onload = () => { if (fotos[actual] === f) visor.img.src = grande.src; };
    grande.src = miniatura(f.id, 2000);
    visor.num.textContent = `${actual + 1} / ${fotos.length}`;
    visor.nombre.textContent = f.nombre || '';
    visor.bajar.textContent = t.descargar; visor.bajar.href = descarga(f.id);
    visor.cerrar.setAttribute('aria-label', t.cerrar);
    visor.ant.setAttribute('aria-label', t.anterior); visor.sig.setAttribute('aria-label', t.siguiente);
    [actual + 1, actual - 1].forEach(j => { const o = fotos[(j + fotos.length) % fotos.length]; if (o) new Image().src = miniatura(o.id, 2000); });
  }
  let foco = null;
  function abrirVisor(i) {
    if (!visor) visor = crearVisor();
    foco = document.activeElement;
    visor.caja.hidden = false; document.documentElement.classList.add('sin-scroll');
    mostrar(i); visor.cerrar.focus();
  }
  function cerrarVisor() {
    visor.caja.hidden = true; document.documentElement.classList.remove('sin-scroll');
    visor.img.removeAttribute('src'); if (foco) foco.focus();
  }

  function guardado() { try { return localStorage.getItem('idioma'); } catch (e) { return null; } }
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  let lang = guardado() || (['es', 'ca', 'gl', 'eu'].includes(nav) ? 'es' : 'en');
  let pintarTodo = l => { langActual = l; pintar(l); };

  /* Botón flotante para volver arriba, donde están la carpeta y los datos de la entrega */
  const arriba = el('button', { type: 'button', class: 'entrega-arriba', hidden: '' }, '↑');
  document.body.append(arriba);
  arriba.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => { arriba.hidden = window.scrollY < window.innerHeight * 1.5; }, { passive: true });

  function arrancar() {
    pintarTodo(lang);
    if (typeof datos.fotos === 'string') {
      fetch(datos.fotos, { cache: 'no-cache' }).then(r => r.json()).then(lista => {
        fotos = normalizar(lista);
        pintarTodo(lang);
      }).catch(() => {});
    }
  }

  /* Entrega con contraseña: los datos van cifrados (AES-GCM, clave PBKDF2) y solo se descifran aquí */
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const llaveGuardada = 'entrega-clave:' + location.pathname;
  async function descifrar(clave) {
    const c = JSON.parse(bloqueCifrado.textContent);
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveKey']);
    const llave = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(c.sal), iterations: c.iter, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plano = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(c.iv) }, llave, b64(c.datos));
    return JSON.parse(new TextDecoder().decode(plano));
  }
  function abrirCon(d) {
    datos = d;
    fotos = Array.isArray(d.fotos) ? normalizar(d.fotos) : [];
    pintarTodo = l => { langActual = l; pintar(l); };
    arrancar();
  }
  function pedirClave(l) {
    const t = T[l];
    document.documentElement.lang = l;
    document.querySelectorAll('[data-t]').forEach(n => { n.textContent = t[n.dataset.t]; });
    document.querySelector('[data-t="privada"]').textContent = t.privadaClave;
    const b = document.querySelector('[data-idioma-entrega]');
    b.textContent = t.boton; b.setAttribute('aria-label', t.botonAria);
    const campo = el('input', { type: 'password', id: 'clave', name: 'clave', autocomplete: 'current-password', required: '' });
    const recordar = el('input', { type: 'checkbox', id: 'recordar', checked: '' });
    const aviso = el('p', { class: 'entrega-clave__aviso', role: 'alert' });
    const entrar = el('button', { type: 'submit', class: 'boton' }, t.claveEntrar);
    const form = el('form', { class: 'entrega-clave__form' },
      el('label', { for: 'clave', class: 'etiqueta' }, t.claveCampo),
      el('div', { class: 'entrega-clave__fila' }, campo, entrar),
      el('label', { class: 'entrega-clave__recordar etiqueta', for: 'recordar' }, recordar, t.claveRecordar),
      aviso);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      aviso.textContent = ''; entrar.disabled = true; entrar.textContent = t.claveAbriendo;
      try {
        const d = await descifrar(campo.value);
        if (recordar.checked) { try { localStorage.setItem(llaveGuardada, campo.value); } catch (x) {} }
        abrirCon(d);
      } catch (x) {
        aviso.textContent = t.claveMal; entrar.disabled = false; entrar.textContent = t.claveEntrar;
        campo.select();
      }
    });
    main.replaceChildren(el('section', { class: 'entrega-clave contenedor' },
      el('h1', {}, t.claveTitulo),
      el('span', { class: 'linea-laton', 'aria-hidden': 'true' }),
      el('p', { class: 'entrega-clave__texto' }, t.claveTexto),
      form));
    campo.focus();
  }

  document.querySelector('[data-idioma-entrega]').addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('idioma', lang); } catch (e) {}
    pintarTodo(lang);
  });

  if (datos) {
    arrancar();
  } else if (bloqueCifrado) {
    pintarTodo = pedirClave;
    let guardada = null;
    try { guardada = localStorage.getItem(llaveGuardada); } catch (e) {}
    if (guardada) {
      descifrar(guardada).then(abrirCon).catch(() => {
        try { localStorage.removeItem(llaveGuardada); } catch (e) {}
        pedirClave(lang);
      });
    } else {
      pedirClave(lang);
    }
  }
})();
