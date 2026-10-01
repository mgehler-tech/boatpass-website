/**
 * Bewegung der Startseite.
 *
 * GSAP ist das einzige Animationssystem, Lenis die einzige Smooth-Scroll-
 * Engine (Locomotive wurde bewusst nicht genommen: Lenis lässt das native
 * Scrollen – und damit position:sticky im Lernweg – unangetastet und
 * koppelt sich direkt an ScrollTrigger). Three.js gibt es nicht: Die
 * Geschichte tragen echte App-Screens, eine WebGL-Szene wäre hier nur Deko.
 *
 * Der Hero-Auftakt ist reines CSS (HomeHero.astro), damit Text und Handy
 * ab dem ersten Paint stehen und nicht auf dieses Bundle warten.
 *
 * Reduzierte Bewegung / Skript-Sicherung (HomeBoot) → kein Lenis, keine
 * Scrubs, keine Startzustände; der Lernweg schaltet trotzdem zwischen den
 * Etappen um, nur ohne Übergänge.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const motion =
  root.classList.contains('h-motion') &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

let lenis: Lenis | null = null;

/* ── Lernweg: aktive Etappe, Screen-Wechsel, Kurslinie ───────────────── */
function initJourney() {
  const grid = document.querySelector<HTMLElement>('[data-journey]');
  if (!grid) return;
  const steps = Array.from(grid.querySelectorAll<HTMLElement>('[data-journey-step]'));
  const screens = Array.from(grid.querySelectorAll<HTMLElement>('[data-journey-screen]'));
  const fill = grid.querySelector<HTMLElement>('[data-journey-fill]');
  const capNum = grid.querySelector<HTMLElement>('[data-stage-cap-num]');
  const capTitle = grid.querySelector<HTMLElement>('[data-stage-cap-title]');
  if (!steps.length) return;

  // Die Bühne gibt es nur am Desktop. Dort alle vier Screens vorab laden,
  // sonst wischt beim Etappenwechsel womöglich ein noch leeres Bild herein.
  if (window.matchMedia('(min-width: 1024px)').matches) {
    screens.forEach((img) => {
      if (img instanceof HTMLImageElement) img.loading = 'eager';
    });
  }

  let current = -1;
  let prevTimer = 0;

  const activate = (i: number) => {
    if (i < 0 || i === current) return;
    const prev = current;
    current = i;

    steps.forEach((step, j) => {
      step.classList.toggle('is-active', j === i);
      step.classList.toggle('is-done', j < i);
    });

    // Der alte Screen bleibt unter dem neuen stehen, bis dessen Wisch-
    // Übergang (clip-path, CSS) fertig ist – sonst blitzt der Grund durch.
    if (screens.length) {
      window.clearTimeout(prevTimer);
      screens.forEach((s) => s.classList.remove('is-prev'));
      if (prev >= 0) screens[prev]?.classList.add('is-prev');
      screens.forEach((s, j) => s.classList.toggle('is-active', j === i));
      prevTimer = window.setTimeout(() => screens.forEach((s) => s.classList.remove('is-prev')), 950);
    }

    const num = String(i + 1).padStart(2, '0');
    if (capNum) capNum.textContent = num;
    if (capTitle) capTitle.textContent = steps[i].dataset.journeyTitle ?? '';
    // Ohne Scrub zeigt die Linie den Stand der aktiven Etappe.
    if (!motion && fill) fill.style.setProperty('--hj-progress', String(i / (steps.length - 1)));
  };

  // Aktiv ist die Etappe, die gerade die Bildschirmmitte kreuzt.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activate(steps.indexOf(e.target as HTMLElement));
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  steps.forEach((s) => io.observe(s));
  activate(0);

  if (motion && fill) {
    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: grid.querySelector('.hj-track') ?? grid,
          start: 'top 55%',
          end: 'bottom 55%',
          scrub: 0.5,
        },
      },
    );
  }
}

/* ── NAVTEX-Streifen: das einzige Laufband der Seite ──────────────────── */
function initMarquee() {
  const viewport = document.querySelector<HTMLElement>('[data-marquee]');
  const track = viewport?.querySelector<HTMLElement>('[data-marquee-track]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-marquee-toggle]');
  const toggleLabel = toggle?.querySelector<HTMLElement>('[data-marquee-toggle-label]');
  if (!viewport || !track || !motion) return;

  // Klone sind für Screenreader und Tastatur unsichtbar – jede Merkhilfe
  // existiert für sie genau einmal.
  Array.from(track.children).forEach((item) => {
    const clone = item.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    track.appendChild(clone);
  });
  // Lesetempo: rund 45 px pro Sekunde.
  const half = track.scrollWidth / 2;
  track.style.setProperty('--hr-duration', `${Math.max(40, Math.round(half / 45))}s`);
  viewport.scrollLeft = 0;
  viewport.classList.add('is-marquee');
  // Nichts mehr zu scrollen → kein leerer Tab-Stopp.
  viewport.removeAttribute('tabindex');

  // Außerhalb des Sichtbereichs steht das Band still.
  new IntersectionObserver(([entry]) => {
    viewport.classList.toggle('is-offscreen', !entry.isIntersecting);
  }).observe(viewport);

  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const paused = viewport.classList.toggle('is-paused');
      toggle.dataset.paused = String(paused);
      if (toggleLabel) toggleLabel.textContent = (paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause) ?? '';
    });
  }
}

/* ── Hero: Handy folgt dezent dem Zeiger (nur Maus) ───────────────────── */
function initTilt() {
  const hero = document.querySelector<HTMLElement>('.hh');
  const phone = hero?.querySelector<HTMLElement>('[data-tilt]');
  if (!hero || !phone || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const rx = gsap.quickTo(phone, 'rotationX', { duration: 0.9, ease: 'power3.out' });
  const ry = gsap.quickTo(phone, 'rotationY', { duration: 0.9, ease: 'power3.out' });
  let frame = 0;
  let px = 0;
  let py = 0;

  hero.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX;
      py = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = hero.getBoundingClientRect();
        ry(((px - r.left) / r.width - 0.5) * 10);
        rx(-((py - r.top) / r.height - 0.5) * 8);
      });
    },
    { passive: true },
  );
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    rx(0);
    ry(0);
  };
  hero.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
}

/* ── Einblenden beim Scrollen ─────────────────────────────────────────────
   Logbuch-Linien ziehen sich von links auf, Inhalte heben sich dezent an.
   IntersectionObserver statt ScrollTrigger: Er meldet für jedes Element
   sofort den Ausgangszustand. Was beim Laden schon oberhalb liegt (Sprung
   per #pricing aus dem Menü, wiederhergestellte Scrollposition), steht
   damit sofort da, statt unsichtbar zu bleiben. */
function initReveals() {
  const items = gsap.utils.toArray<HTMLElement>('.home [data-reveal]');
  const rules = gsap.utils.toArray<HTMLElement>('.home [data-rule]');
  const portrait = document.querySelector<HTMLElement>('[data-hf-portrait]');

  gsap.set(items, { opacity: 0, y: 20 });
  gsap.set(rules, { scaleX: 0 });
  if (portrait) gsap.set(portrait, { clipPath: 'inset(0% 0% 100% 0%)' });

  const show = (el: HTMLElement, instant: boolean, delay: number) => {
    let to: gsap.TweenVars;
    if (el.matches('[data-rule]')) to = { scaleX: 1, duration: 1.1, ease: 'expo.inOut' };
    else if (el === portrait) to = { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' };
    else to = { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' };
    if (instant) gsap.set(el, { ...to, duration: 0 });
    else gsap.to(el, { ...to, delay });
  };

  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries
        .filter((e) => e.isIntersecting || e.boundingClientRect.bottom < 0)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((e) => {
          io.unobserve(e.target);
          const passed = !e.isIntersecting;
          show(e.target as HTMLElement, passed, passed ? 0 : Math.min(n++, 6) * 0.07);
        });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  [...rules, ...items, ...(portrait ? [portrait] : [])].forEach((el) => io.observe(el));
}

/* ── Scrubs: Gründer-Fotos ────────────────────────────────────────────── */
function initParallax() {
  const section = document.querySelector<HTMLElement>('.hf');
  const img = section?.querySelector<HTMLElement>('.hf-portrait img');
  const inset = section?.querySelector<HTMLElement>('.hf-inset');
  if (!section) return;
  const st = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true };
  if (img) gsap.fromTo(img, { scale: 1.14, yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: st });
  if (inset) gsap.fromTo(inset, { yPercent: 18 }, { yPercent: -12, ease: 'none', scrollTrigger: { ...st } });
}

/* ── Lenis (nur ab 768px: darunter gibt es das mobile Menü mit eigenem
   Scrollbereich, und Touch scrollt ohnehin nativ) ───────────────────── */
function initSmoothScroll() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    const instance = new Lenis({ lerp: 0.11, allowNestedScroll: true });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis = instance;
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis = null;
    };
  });

  // Sprunglinks auf derselben Seite (Header „Features"/„Preise", Hero,
  // Skip-Link): weich scrollen und danach den Fokus ans Ziel übergeben,
  // wie es der Browser beim normalen Sprung auch täte.
  document.addEventListener('click', (e) => {
    if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    lenis.scrollTo(target, {
      offset: -72,
      duration: 1.2,
      onComplete: () => {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      },
    });
  });
}

/* ── Start ────────────────────────────────────────────────────────────── */
if (motion) {
  initReveals();
  initParallax();
  initTilt();
  initSmoothScroll();
  // Ab hier gelten die Inline-Werte von GSAP, nicht mehr die CSS-Startzustände.
  root.classList.add('h-ready');

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
} else {
  root.classList.remove('h-motion');
}

initJourney();
initMarquee();
