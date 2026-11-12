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
  if (!steps.length) return;

  const chips = Array.from(grid.querySelectorAll<HTMLButtonElement>('[data-journey-chip]'));
  const inlines = Array.from(grid.querySelectorAll<HTMLElement>('[data-journey-inline]'));
  const desktop = window.matchMedia('(min-width: 1024px)');
  const idOf = (i: number, k: number) => `${i}-${k}`;
  const countOf = (i: number) => chips.filter((c) => c.dataset.journeyChip?.startsWith(`${i}-`)).length;

  // Die Bühne gibt es nur am Desktop. Dort den ersten Screen jeder Etappe
  // vorab laden, die übrigen erst, wenn ihre Etappe aktiv wird – sonst wischt
  // beim Wechsel womöglich ein noch leeres Bild herein.
  const preload = (match: (id: string) => boolean) => {
    if (!desktop.matches) return;
    screens.forEach((img) => {
      if (img instanceof HTMLImageElement && match(img.dataset.journeyScreen ?? '')) img.loading = 'eager';
    });
  };
  preload((id) => id.endsWith('-0'));

  let current = -1;
  let shown = '';
  let prevTimer = 0;
  let tourTimer = 0;
  const selected = steps.map(() => 0);
  const toured = steps.map(() => false);

  // Zeigt Screen k der Etappe i: auf der Bühne (Wisch), im Handy der Etappe
  // (Blende, unter 1024px) und am gedrückten Chip.
  const show = (i: number, k: number) => {
    selected[i] = k;
    const id = idOf(i, k);
    chips.forEach((c) => {
      const [ci, ck] = (c.dataset.journeyChip ?? '').split('-').map(Number);
      if (ci === i) c.setAttribute('aria-pressed', String(ck === k));
    });
    inlines.forEach((el) => {
      const cid = el.dataset.journeyInline ?? '';
      if (!cid.startsWith(`${i}-`)) return;
      el.classList.toggle('is-active', cid === id);
      // Unsichtbare Screens laden träge; der gewählte soll sofort kommen.
      if (cid === id && el instanceof HTMLImageElement) el.loading = 'eager';
    });
    if (i !== current || id === shown) return;

    // Der alte Screen bleibt unter dem neuen stehen, bis dessen Wisch-
    // Übergang (clip-path, CSS) fertig ist – sonst blitzt der Grund durch.
    window.clearTimeout(prevTimer);
    screens.forEach((s) => {
      const sid = s.dataset.journeyScreen;
      s.classList.toggle('is-prev', sid === shown);
      s.classList.toggle('is-active', sid === id);
    });
    shown = id;
    prevTimer = window.setTimeout(() => screens.forEach((s) => s.classList.remove('is-prev')), 950);
  };

  const stopTour = () => window.clearTimeout(tourTimer);

  // Beim ersten Erreichen einer Etappe einmal durch ihre Screens blättern und
  // zum ersten zurück – zeigt, dass die Chips schalten. Nur am Desktop und
  // nur mit Bewegung; jede Bedienung der Chips beendet es.
  const tour = (i: number) => {
    stopTour();
    if (toured[i] || !motion || !desktop.matches) return;
    toured[i] = true;
    const n = countOf(i);
    let k = 0;
    const next = () => {
      if (current !== i) return;
      k = (k + 1) % n;
      show(i, k);
      if (k !== 0) tourTimer = window.setTimeout(next, 2600);
    };
    tourTimer = window.setTimeout(next, 2200);
  };

  const activate = (i: number) => {
    if (i < 0 || i === current) return;
    current = i;

    steps.forEach((step, j) => {
      step.classList.toggle('is-active', j === i);
      step.classList.toggle('is-done', j < i);
    });

    preload((id) => id.startsWith(`${i}-`));
    show(i, selected[i]);

    // Ohne Scrub zeigt die Linie den Stand der aktiven Etappe.
    if (!motion && fill) fill.style.setProperty('--hj-progress', String(i / (steps.length - 1)));
  };

  chips.forEach((chip) => {
    const [i, k] = (chip.dataset.journeyChip ?? '').split('-').map(Number);
    chip.addEventListener('click', () => {
      stopTour();
      toured[i] = true;
      // Am Desktop zeigt die Bühne die Etappe des gedrückten Chips.
      if (desktop.matches) activate(i);
      show(i, k);
    });
    chip.addEventListener('pointerenter', () => {
      if (current === i) stopTour();
    });
  });

  // Aktiv ist die Etappe, die gerade die Bildschirmmitte kreuzt.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = steps.indexOf(e.target as HTMLElement);
        activate(i);
        // Erst hier, nicht in activate(): Beim Laden ist Etappe 01 schon
        // aktiv, aber noch nicht im Bild.
        if (i === current) tour(i);
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
   Inhalte heben sich dezent an, das Gründerporträt wird aufgezogen.
   IntersectionObserver statt ScrollTrigger: Er meldet für jedes Element
   sofort den Ausgangszustand. Was beim Laden schon oberhalb liegt (Sprung
   per #pricing aus dem Menü, wiederhergestellte Scrollposition), steht
   damit sofort da, statt unsichtbar zu bleiben. */
function initReveals() {
  const items = gsap.utils.toArray<HTMLElement>('.home [data-reveal]');
  const portrait = document.querySelector<HTMLElement>('[data-hf-portrait]');

  gsap.set(items, { opacity: 0, y: 20 });
  if (portrait) gsap.set(portrait, { clipPath: 'inset(0% 0% 100% 0%)' });

  const show = (el: HTMLElement, instant: boolean, delay: number) => {
    let to: gsap.TweenVars;
    if (el === portrait) to = { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' };
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
  [...items, ...(portrait ? [portrait] : [])].forEach((el) => io.observe(el));
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

/* ── Hero: Kamerafahrt beim Herausscrollen ───────────────────────────────
   Nur am Desktop (darunter ist das Band kurz und scrollt nativ). Das Bild
   läuft etwas langsamer als die Seite und die Kamera fährt dabei leicht aufs
   Wasser zu (Zoom um den Horizont). Kein zusätzlicher Scrollweg: Die Fahrt
   passiert, während der Hero ohnehin aus dem Bild scrollt. Das Gerät bewegt
   sich nicht mit – es steht „im Wasser". Fotos und Videos haben 12 % Überhang
   (HeroPhoto); der Zoom vergrößert die Fläche zusätzlich, es blitzt also nie
   ein Rand durch. */
function initHeroParallax() {
  const hero = document.querySelector<HTMLElement>('.hh');
  // Die ganze Medienebene (alle Szenen, Fotos wie spätere Videos aus
  // hero-stage.ts) wandert gemeinsam; sichtbar ist immer nur eine Szene.
  const media = hero?.querySelector<HTMLElement>('.hh-media');
  if (!hero || !media) return;
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    gsap.set(media, { transformOrigin: '50% 40%' });
    gsap.to(media, {
      yPercent: -10,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

/* ── Lenis (nur ab 1024px: darunter gibt es das mobile Menü mit eigenem
   Scrollbereich, und Touch scrollt ohnehin nativ) ───────────────────── */
function initSmoothScroll() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
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
  initHeroParallax();
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
