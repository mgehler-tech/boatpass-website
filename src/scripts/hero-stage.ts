/**
 * Bühne des Heros (Richtung „Horizont“): Szenenwechsel, Screen-Wechsel im
 * Handy, Spiegelung im Wasser und die Video-Loops je Szene.
 *
 * - Szenenwechsel: Die neue Szene öffnet sich vom Horizont aus nach oben und
 *   unten (clip-path), die alte bleibt darunter stehen, bis die Blende fertig
 *   ist. Reduzierte Bewegung: kurze Überblendung über die CSS-Klassen.
 * - Screen-Wechsel: Der neue App-Screen gleitet von unten nach, der alte
 *   weicht nach oben – wie beim Blättern in der App.
 * - Video: Liegt zur aktiven Szene ein Clip vor (data-video-* an den Bildern,
 *   HeroPhoto.astro), lädt er erst nach dem Seiten-Load und nur bei erlaubter
 *   Bewegung ohne Datensparmodus. Er blendet ein, sobald er läuft, und hält
 *   an, wenn der Hero aus dem Bild scrollt oder der Tab im Hintergrund liegt.
 *   Fehlt der Clip, bleibt das Foto mit seiner langsamen Drift stehen.
 *
 * Alle Zustände stehen in Klassen (is-active), damit der Hero ohne dieses
 * Skript und nach jeder abgebrochenen Animation korrekt dasteht.
 */

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
/** Horizont im Foto, in Prozent der Bildhöhe (alle Szenen liegen bei 38–42 %). */
const HORIZON = 40;

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 1024px)');
const band = window.matchMedia('(min-width: 640px)');

/** Bewegung erlaubt? h-motion fällt weg, wenn das Bewegungs-Skript ausfällt (HomeBoot). */
const moving = () => root.classList.contains('h-motion') && !reduced.matches;

export function createHeroStage(hero: HTMLElement, panel: HTMLElement) {
  const shots = Array.from(panel.querySelectorAll<HTMLImageElement>('.hh-shot'));
  const reflect = panel.querySelector<HTMLImageElement>('.hh-reflect img');
  const media = panel.querySelector<HTMLElement>('.hh-media');
  let scene = panel.querySelector<HTMLElement>('.hh-photo.is-active')?.dataset.scene ?? 'binnen';
  let running: Animation[] = [];
  let pendingDone: (() => void) | null = null;
  let visible = true;
  let loaded = document.readyState === 'complete';

  const sceneEls = (key: string) =>
    Array.from(panel.querySelectorAll<HTMLElement>(`.hh-photo[data-scene="${key}"], .hh-video[data-scene="${key}"]`));

  /* ── Szenen ── */
  // Bricht eine laufende Blende ab und setzt sofort ihren Endzustand.
  // onfinish käme erst asynchron – zu spät, wenn direkt die nächste Szene folgt.
  const settle = () => {
    running.forEach((a) => {
      a.onfinish = null;
      a.finish();
    });
    running = [];
    const done = pendingDone;
    pendingDone = null;
    done?.();
  };

  function showScene(next: string) {
    if (next === scene) return;
    settle();
    const prev = scene;
    scene = next;
    const incoming = sceneEls(next);
    const outgoing = sceneEls(prev);

    if (!moving()) {
      outgoing.forEach((el) => el.classList.remove('is-active'));
      incoming.forEach((el) => el.classList.add('is-active'));
      syncVideo();
      return;
    }

    incoming.forEach((el) => el.classList.add('is-active', 'is-entering'));
    syncVideo();
    running = incoming.map((el) =>
      el.animate(
        [
          { clipPath: `inset(${HORIZON}% 0 ${100 - HORIZON}% 0)` },
          { clipPath: 'inset(0% 0 0% 0)' },
        ],
        { duration: 1100, easing: EASE_IN_OUT },
      ),
    );
    const done = () => {
      pendingDone = null;
      running = [];
      // Nur abräumen, was nicht inzwischen wieder die aktuelle Szene ist.
      outgoing.forEach((el) => {
        if (el.dataset.scene === scene) return;
        el.classList.remove('is-active');
        if (el instanceof HTMLVideoElement) el.pause();
      });
      incoming.forEach((el) => el.classList.remove('is-entering'));
    };
    pendingDone = done;
    if (running[0]) running[0].onfinish = done;
    else done();
  }

  /* ── App-Screens ── */
  let shotAnims: Animation[] = [];
  function showShot(key: string) {
    const next = shots.find((s) => s.dataset.license === key);
    const prev = shots.find((s) => s.classList.contains('is-active'));
    if (!next || next === prev) return;
    shotAnims.forEach((a) => a.finish());
    shotAnims = [];

    shots.forEach((s) => {
      const on = s === next;
      s.classList.toggle('is-active', on);
      if (on) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });

    if (moving() && prev) {
      shotAnims = [
        prev.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6%)' }],
          { duration: 380, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
        ),
        next.animate(
          [{ opacity: 0, transform: 'translateY(12%)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 640, delay: 90, easing: EASE_OUT, fill: 'backwards' },
        ),
      ];
    }
    updateReflection(next);
  }

  /* ── Spiegelung: zeigt den aktiven Screen, gespiegelt und weich ── */
  function updateReflection(shot: HTMLImageElement) {
    if (!reflect) return;
    const src = shot.currentSrc || shot.src;
    if (src && reflect.src !== src) {
      reflect.removeAttribute('srcset');
      reflect.src = src;
    }
  }
  const first = shots.find((s) => s.classList.contains('is-active'));
  if (first) {
    if (first.complete) updateReflection(first);
    else first.addEventListener('load', () => updateReflection(first), { once: true });
  }

  /* ── Video ── */
  const saveData = () =>
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const layout = () => (desktop.matches || !band.matches ? 'tall' : 'wide');
  const light = () => (root.classList.contains('dark') ? 'dusk' : 'day');

  /** URLs des Clips zur Szene im aktuellen Licht und Format (leer = keiner). */
  function clipFor(key: string) {
    const pic = panel.querySelector<HTMLElement>(`.hh-photo--${light()}[data-scene="${key}"]`);
    return pic?.dataset[layout() === 'tall' ? 'videoTall' : 'videoWide']?.split(' ').filter(Boolean) ?? [];
  }

  function videoFor(key: string) {
    const urls = clipFor(key);
    const id = `${key}|${urls.join(' ')}`;
    let v = panel.querySelector<HTMLVideoElement>(`.hh-video[data-scene="${key}"]`);
    if (v && v.dataset.clip !== id) {
      v.remove();
      v = null;
    }
    if (!urls.length) return null;
    if (!v) {
      v = document.createElement('video');
      v.className = 'hh-video';
      v.dataset.scene = key;
      v.dataset.clip = id;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.disablePictureInPicture = true;
      v.setAttribute('aria-hidden', 'true');
      v.setAttribute('tabindex', '-1');
      // Erstes Bild = vorhandenes Foto, deshalb kein eigenes Poster nötig.
      const sources = urls.map((url) => {
        const s = document.createElement('source');
        s.src = url;
        s.type = url.endsWith('.webm') ? 'video/webm' : 'video/mp4';
        return s;
      });
      v.append(...sources);
      v.addEventListener('playing', () => v!.classList.add('is-playing'));
      // Scheitert auch die letzte Quelle, bleibt das Foto.
      sources[sources.length - 1].addEventListener('error', () => v!.remove());
      media?.append(v);
    }
    return v;
  }

  function syncVideo() {
    const allowed = loaded && moving() && !saveData();
    panel.querySelectorAll<HTMLVideoElement>('.hh-video').forEach((v) => {
      if (v.dataset.scene !== scene && !v.classList.contains('is-entering')) {
        v.pause();
        v.classList.remove('is-active');
      }
    });
    if (!allowed) {
      panel.querySelectorAll<HTMLVideoElement>('.hh-video').forEach((v) => v.pause());
      return;
    }
    const v = videoFor(scene);
    if (!v) return;
    // Ein frisch angelegtes Video liegt unter der laufenden Blende und
    // blendet erst ein, wenn es spielt.
    v.classList.add('is-active');
    if (visible && !document.hidden) v.play().catch(() => {});
    else v.pause();
  }

  /* ── Sichtbarkeit: Drift und Video ruhen außerhalb des Bildschirms ── */
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      hero.classList.toggle('is-offscreen', !visible);
      syncVideo();
    },
    { threshold: 0 },
  ).observe(panel);
  document.addEventListener('visibilitychange', syncVideo);
  // Hell/Dunkel (Klasse am <html>) und Breakpoints wechseln den Clip.
  new MutationObserver(syncVideo).observe(root, { attributes: true, attributeFilter: ['class'] });
  desktop.addEventListener('change', syncVideo);
  band.addEventListener('change', syncVideo);
  reduced.addEventListener('change', syncVideo);

  if (!loaded) {
    window.addEventListener(
      'load',
      () => {
        loaded = true;
        syncVideo();
      },
      { once: true },
    );
  } else syncVideo();

  return { showScene, showShot };
}
