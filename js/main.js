/* Moderato Studio — idioma (ES/EN), carrusel y año.
   El español está escrito en el HTML. Cada texto traducible lleva data-i18n="clave"
   (o data-i18n-attr="atributo:clave") y su inglés va en EN, más abajo. */

const EN = {
  'nav.inicio': 'Home',
  'nav.obras': 'Works',
  'nav.contacto': 'Contact',
  'nav.principal': 'Main',
  'nav.pie': 'Footer',
  'nav.inicioMarca': 'Moderato Studio, home',
  'portada.aria': 'Home',
  'conoce.a': 'Meet',
  'conoce.p1': '<strong>Moderato</strong> is a tempo marking: neither fast nor slow. Measured, intentional, with just the right pulse.',
  'conoce.p2': 'Under that name we make audiovisual essays. Each piece is written before filming, around a single idea and its sources. Music is the spine, and the image follows it <strong>unhurried</strong>, with careful light and time to look.',
  'conoce.p3': 'What you see is what surrounds a piece of music: the practice room, the places, the books and the ideas that hold it up.',
  'conoce.p4': 'This is <strong>Moderato Studio</strong>.',
  'carrusel.aria': 'Featured stills',
  'carrusel.rodaje': 'On set',
  'carrusel.prev': 'Previous',
  'carrusel.next': 'Next',
  'nav.fotogramas': 'Stills',
  'fotogramas.titulo': 'Stills',
  'fotogramas.momento': 'The musical moment',
  'fotogramas.estudio': 'The study, in the foreground',
  'fotogramas.palabra': 'The spoken word',
  'fotogramas.atocha': 'Atocha, at dusk',
  'alt.dosPianos': 'Two musicians talk, seated between two grand pianos',
  'alt.atocha': 'Atocha station at dusk, with traffic in front',
  'alt.palabra': 'A man explains something with his hands, beside a piano',
  'alt.piano': 'A pianist plays a grand piano in a wood-panelled hall',
  'alt.escucha': 'A man speaks in a study full of books and records',
  'alt.conversacion': 'Two people talk, seated beside a grand piano',
  'obras.titulo': 'Works',
  'obras.hortus.linea': 'Audiovisual essay · Albéniz’s <i>Granada</i>, studied in Madrid',
  'obras.estado.investigacion': 'In research',
  'pie.lema': 'Composed in tempo moderato',
  'obra.videoAria': 'Film',
  'obra.enPreparacion': 'In preparation',
  'obra.idea': 'The idea',
  'obra.capitulos': 'Chapters',
  'obra.ficha': 'Credits',
  'obra.musica': 'Music',
  'obra.fuentes': 'Sources',
  'obra.catalogo': 'Catalogue',
  'obra.todas': 'All works →',
  'obra.volverAria': 'Back to the works',
  'ficha.guion': 'Script',
  'ficha.imagen': 'Image',
  'ficha.lugar': 'Place',
  'ficha.estado': 'Status',
  'hortus.sello': 'Mod. I · Audiovisual essay · Working title · In research',
  'hortus.tesis': 'The place of a piece is not on the map, but in the daily work of whoever plays it, who builds it anew each day like an enclosed garden.',
  'hortus.idea1': 'Isaac Albéniz’s <i>Granada (Serenata)</i> was printed in Madrid in 1886. Today it is practised and recorded in Madrid. The film asks whether one can play a place where one is not.',
  'hortus.idea2': 'It moves from day to night, like the serenade, which is a night song: the morning of slow practice, the afternoon of interpretation and the night of the enclosed garden.',
  'hortus.citaFuente': '“A garden enclosed is my sister, my spouse.” Song of Songs 4:12',
  'hortus.cap1': 'Morning · to execute',
  'hortus.cap2': 'Afternoon · to interpret',
  'hortus.cap3': 'Night · the enclosed garden'
};

const META_EN = {
  inicio: ['Moderato Studio — Audiovisual essays', 'Moderato Studio makes audiovisual essays about what surrounds a piece of music: the practice room, the places and the books. Madrid.'],
  hortus: ['Hortus conclusus — Mod. I · Moderato Studio', 'Mod. I, Hortus conclusus: an audiovisual essay on Isaac Albéniz’s Granada, studied in Madrid. In research.']
};

(function () {
  const ES = {};
  const META_ES = { title: document.title, desc: document.querySelector('meta[name="description"]')?.content || '' };

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (!(k in ES)) ES[k] = el.innerHTML;
  });
  const ES_ATTR = new Map();
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr] = pair.split(':');
      ES_ATTR.set(el.tagName + attr + pair, el.getAttribute(attr.trim()));
    });
  });

  function aplicar(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      const t = lang === 'en' ? EN[k] : ES[k];
      if (t !== undefined) el.innerHTML = t;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, k] = pair.split(':').map(s => s.trim());
        const t = lang === 'en' ? EN[k] : ES_ATTR.get(el.tagName + attr + pair);
        if (t != null) el.setAttribute(attr, t);
      });
    });
    const page = document.body.dataset.page;
    const desc = document.querySelector('meta[name="description"]');
    if (lang === 'en' && META_EN[page]) {
      document.title = META_EN[page][0];
      if (desc) desc.content = META_EN[page][1];
    } else {
      document.title = META_ES.title;
      if (desc) desc.content = META_ES.desc;
    }
    document.querySelectorAll('[data-cambiar-idioma]').forEach(b => {
      b.textContent = lang === 'en' ? 'ES' : 'EN';
      b.setAttribute('aria-label', lang === 'en' ? 'Ver en español' : 'View in English');
    });
  }

  function guardado() { try { return localStorage.getItem('idioma'); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem('idioma', v); } catch (e) {} }

  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  let lang = guardado() || (['es', 'ca', 'gl', 'eu'].includes(nav) ? 'es' : 'en');
  if (lang !== 'es') aplicar(lang); else aplicar('es');

  document.querySelectorAll('[data-cambiar-idioma]').forEach(b => b.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    guardar(lang);
    aplicar(lang);
  }));

  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Carruseles: flechas, teclado y arrastre con el ratón */
  document.querySelectorAll('[data-carrusel]').forEach(pista => {
    const caja = pista.closest('section');
    const prev = caja.querySelector('[data-carrusel-prev]');
    const next = caja.querySelector('[data-carrusel-next]');
    const paso = () => (pista.querySelector('figure')?.offsetWidth || 600) + 16;
    const estado = () => {
      if (prev) prev.disabled = pista.scrollLeft < 8;
      if (next) next.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 8;
    };
    const mover = d => pista.scrollBy({ left: d * paso(), behavior: quieto ? 'auto' : 'smooth' });
    prev && prev.addEventListener('click', () => mover(-1));
    next && next.addEventListener('click', () => mover(1));
    pista.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
    });
    let x0 = 0, s0 = 0, abajo = false, movido = false;
    pista.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      abajo = true; movido = false; x0 = e.clientX; s0 = pista.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!abajo) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 4) { movido = true; pista.classList.add('arrastrando'); }
      pista.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!abajo) return;
      abajo = false;
      if (movido) {
        pista.classList.remove('arrastrando');
        const i = Math.round(pista.scrollLeft / paso());
        pista.scrollTo({ left: i * paso(), behavior: quieto ? 'auto' : 'smooth' });
      }
    });
    pista.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado);
    estado();
  });

  /* Aparición al desplazarse */
  const revelables = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && !quieto) {
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revelables.forEach(el => io.observe(el));
  } else {
    revelables.forEach(el => el.classList.add('visible'));
  }

  /* Portada: la imagen baja más despacio y la marca se desvanece */
  const fondo = document.querySelector('[data-paralaje]');
  const marca = document.querySelector('[data-desvanecer]');
  if (fondo && !quieto) {
    let pendiente = false;
    const pintar = () => {
      pendiente = false;
      const y = Math.min(window.scrollY, window.innerHeight);
      const h = window.innerHeight || 800;
      fondo.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.08)`;
      if (marca) {
        marca.style.opacity = String(Math.max(0, 1 - y / (h * 0.55)));
        marca.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      }
    };
    window.addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } }, { passive: true });
    pintar();
  }

  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
