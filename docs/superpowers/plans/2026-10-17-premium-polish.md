# Startseite Premium-Politur: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hero mit Foto-Bühne und großem, angeschnittenem Gerät, erster Viewport auf fünf Elemente reduziert, Header und Footer auf die Tokens der neuen Startseite, Lernweg ohne grauen Kasten.

**Architecture:** Die `--h-*`-Tokens ziehen aus `.home {}` nach `:root` (`src/styles/brand.css`), damit Header und Footer sie seitenweit nutzen. Header und Footer werden auf dieser Basis neu aufgebaut (Markup + Styles, Skripte bleiben), ein gemeinsames Theme-Skript bedient Umschalter in Footer und mobilem Menü. Der Hero bekommt ein `<picture>`-Paneel (Art Direction 3:4 / 16:9 über `getImage()`), vor dem das Handy steht; bis die echten Fotos kommen, liegen per Skript erzeugte Platzhalter-JPGs an den endgültigen Pfaden, sodass Pipeline, Tests und LCP-Messung schon mit Platzhaltern laufen.

**Tech Stack:** Astro 6 (`astro:assets` `Image`/`getImage`), Tailwind 4 (nur Utilities), CSS-Tokens, GSAP 3 + ScrollTrigger (vorhanden), Playwright 1.62 (E2E gegen `astro build && astro preview`), sharp (Astro-Abhängigkeit) für Platzhalterbilder.

**Spec:** `docs/superpowers/specs/2026-10-17-premium-polish-design.md`

## Global Constraints

- Branch `feat/premium-polish` im Worktree `.claude/worktrees/premium-polish`, Basis origin/main (1e46a97). Jede Aufgabe endet mit einem Commit; Commit-Trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Playwright startet `npm run build && npm run preview` auf Port 4321 und **nutzt einen laufenden Server wieder, ohne neu zu bauen** (`reuseExistingServer`). Vor jedem Testlauf: kein Server auf 4321 (`lsof -ti:4321 | xargs kill 2>/dev/null`) oder vorher `npm run build` von Hand. Testbefehl: `npx playwright test tests/e2e/premium-polish.spec.ts -g "<Describe-Name>"`.
- Typprüfung inklusive DE/EN-Parität: `npx astro check` (der Typ `Translations` leitet sich aus `de.ts` ab; fehlende oder überzählige Schlüssel in `en.ts` sind Fehler).
- Selektoren, die bleiben müssen (E2E): `#hero-cta-play`, `#final-cta-play`, `#footer-badge-ios`, `#footer-badge-play`, `#mobile-menu-btn`, `#mobile-menu`, `#mobile-acc-body`, `#licenses-trigger`, `#licenses-menu`, `#pricing`, `.mobile-nav-link` mit Text „Preise", `nav a` mit Text „Preise"/„Pricing", `data-cta-position` auf allen Store-Links.
- Farben, Radien, Easing ausschließlich über `--h-*`-Tokens in Header, Footer und Home-Komponenten; keine neuen Hex-Werte außer den in der Spec genannten Schattenfarben `rgba(11,21,48,…)` und `rgba(8,11,20,…)`.
- Archivo bleibt nur auf der Startseite (`home.css`); Header und Footer nutzen Inter.
- Texte nur über `src/i18n/de.ts` und `en.ts`; keine Emojis; keine Icons als Dekoration in Footer-Links und Megamenü-Einträgen.
- `prefers-reduced-motion: reduce`: keine Parallaxe, kein Handy-Aufstieg, Header-Übergang ohne Transition.
- WCAG 2.2 AA: Text ≥ 4,5:1 (Token-Paare aus `brand.css` sind geprüft: `--h-muted` 6:1 auf `--h-paper`, `--h-blue-ink` ≥ 4,5:1), Fokusringe `outline: 3px solid var(--h-blue)` bzw. `#fff` auf `--h-deep`.
- Alle Store-Links behalten `target="_blank" rel="noopener noreferrer"` plus sr-only „(öffnet in neuem Tab)" wie heute.

## Review Focus

1. **Sehr niedrige Desktop-Fenster (1280×620, Lesezeichenleiste):** Hero-Button und Handy müssen ohne Scrollen sichtbar bleiben; das Paneel darf auf 560 px fallen, die H1 nutzt bereits `min(…, 11.5vh)`. Test in Task 7 (Viewport 1280×620).
2. **Kein JavaScript / JS-Fehler im Bewegungsskript:** Header muss ohne `is-scrolled`-Umschaltung lesbar bleiben (Startseite oben transparent über Papier, nie über dem Foto), Theme-Umschalter dürfen ohne JS nicht als kaputt erscheinen (`hidden` bis `h-js`). Test in Task 2 (Umschalter unsichtbar ohne `h-js`) und Task 3.
3. **Dark Mode mit Foto:** Overlay und `filter` müssen greifen, sonst steht ein hellblaues Foto in einer dunklen Seite. Test in Task 7 (`html.dark` → `::after`-Opacity 1, `filter` gesetzt).
4. **Horizontaler Überlauf durch das randabfallende Paneel** bei 1024, 1280, 1920 px und durch das Mobile-Band bei 360 px. Test in Task 7 (`scrollWidth <= innerWidth`).
5. **Megamenü-Positionierung nach Containerwechsel (1240 px):** `.nav-mega` darf bei 1024–1100 px nicht aus dem Viewport ragen (`max-width: calc(100vw - 32px)` bleibt). Test in Task 3 (Viewport 1024: Menü-BoundingBox innerhalb des Viewports).

---

### Task 1: Tokens nach `:root` (`brand.css`)

**Files:**
- Create: `src/styles/brand.css`
- Modify: `src/styles/global.css:1-3` (Import), `src/styles/home.css:18-87` (Token-Block), `src/styles/home.css:265-271` (`.h-stage` entfernen)
- Test: `tests/e2e/premium-polish.spec.ts` (neu)

**Interfaces:**
- Produces: Alle `--h-*`-Custom-Properties aus `home.css` Zeilen 19–58 unter `:root`, die Dark-Werte aus Zeilen 66–87 unter `html.dark`; zusätzlich `--h-shadow-device: 0 60px 120px -40px rgba(11,21,48,.55), 0 10px 24px -12px rgba(11,21,48,.35)` (hell) und `0 60px 120px -40px rgba(0,0,0,.8), 0 10px 24px -12px rgba(0,0,0,.6)` (dunkel). Später genutzt von Hero (Task 7) und Lernweg (Task 8).

- [ ] **Step 1: Failing test schreiben**

```ts
// tests/e2e/premium-polish.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tokens', () => {
  test('h-tokens are defined on :root on a subpage', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    const paper = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-paper').trim());
    expect(paper).toBe('#F0F4FA');
    const shadow = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-shadow-device').trim());
    expect(shadow).toContain('rgba(11,21,48,.55)');
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Tokens"`
Expected: FAIL, `paper` ist `''`.

- [ ] **Step 3: `src/styles/brand.css` anlegen**

Inhalt: Kommentarkopf (Zweck: seitenweite Tokens der Startseite, Quelle Spec 4.5), dann `:root { … }` mit exakt den Deklarationen aus `home.css` Zeilen 19–58 (alle `--h-*` inkl. `--h-display`, `--h-sans`, `--h-ease`, Radien, `--h-gutter`, `--h-max`) plus `--h-shadow-device` (hell), dann `html.dark { … }` mit den Deklarationen aus Zeilen 67–86 plus `--h-shadow-device` (dunkel).

- [ ] **Step 4: `global.css` importieren, `home.css` bereinigen**

`global.css` Zeile 3: `@import "./brand.css";` nach dem Inter-Import einfügen. In `home.css`: `.home { … }` auf `color: var(--h-text); font-family: var(--h-sans); background: var(--h-paper); overflow-x: clip;` kürzen, den Block `html.dark .home { … }` löschen, den Block `.h-stage { … }` (Zeilen 265–271) löschen. Der Kommentarkopf von `home.css` bekommt den Satz „Tokens liegen seit 2026-10-17 in brand.css (seitenweit)."

- [ ] **Step 5: Test und Build prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Tokens"`
Expected: PASS. Zusätzlich `npm run build` ohne Fehler; die Startseite sieht unverändert aus (Stichprobe: `npm run preview`, `/` im Browser, Hero-Farben wie vorher).

- [ ] **Step 6: Commit**

```bash
git add src/styles/brand.css src/styles/global.css src/styles/home.css tests/e2e/premium-polish.spec.ts
git commit -m "refactor(styles): h-Tokens seitenweit in brand.css statt nur unter .home"
```

---

### Task 2: Theme-Umschalter als Komponente mit gemeinsamem Skript

**Files:**
- Create: `src/scripts/theme-toggle.ts`, `src/components/ThemeToggle.astro`
- Modify: `src/i18n/de.ts` (neuer Namespace `theme`), `src/i18n/en.ts`, `src/layouts/BaseLayout.astro:36-44,116-121` (Init), `src/components/Footer.astro:132-150` (vorläufige Einbindung), `src/styles/brand.css`, `src/styles/home.css:273-275`
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- Produces:
  - `export type Theme = 'light' | 'dark'`
  - `export function applyTheme(theme: Theme): void` in `src/scripts/theme-toggle.ts`: setzt/entfernt `html.dark`, schreibt `localStorage.theme`, ruft intern `syncThemeToggles()`.
  - `export function initThemeToggles(): void`: bindet `click` auf alle `button.theme-choice[data-theme-set]`, synchronisiert `aria-pressed` aus `html.dark`.
  - `ThemeToggle.astro` Props `{ lang: 'de' | 'en'; class?: string }`; rendert `<div class="theme-toggle h-js-only" role="group" aria-label={t.theme.label}>` mit zwei `button.theme-choice` (`data-theme-set="light"` Text `t.theme.light`, `data-theme-set="dark"` Text `t.theme.dark`) und einem `span.theme-sep` „|" dazwischen. Styles: Inter 500 13 px, aktiv `--h-ink`, inaktiv `--h-muted`, `min-height: 44px` Touchfläche, Fokusring Token.
  - i18n: `theme: { label: 'Darstellung', light: 'Hell', dark: 'Dunkel' }` (de) / `{ label: 'Appearance', light: 'Light', dark: 'Dark' }` (en).
- Consumes: `.h-js-only`/`.h-js` aus `home.css` Zeilen 273–275. Diese zwei Regeln ziehen nach `brand.css`, damit sie seitenweit gelten; `HomeBoot` setzt `h-js` nur auf der Startseite, deshalb nimmt `BaseLayout` die Zeile `document.documentElement.classList.add('h-js');` in sein bestehendes `is:inline`-Theme-Init-Skript im `<head>` auf (vor dem ersten Paint). `HomeBoot` behält seine Zeile (idempotent). Für die Gruppe: `.h-js .theme-toggle { display: inline-flex; }`.

- [ ] **Step 1: Failing test schreiben**

```ts
test.describe('ThemeToggle', () => {
  test('footer toggle switches and persists the theme', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    const dark = page.locator('footer .theme-choice[data-theme-set="dark"]');
    await expect(dark).toBeVisible();
    await dark.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(dark).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.locator('footer .theme-choice[data-theme-set="light"]').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
  test('toggle is hidden without the h-js class', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    await page.evaluate(() => document.documentElement.classList.remove('h-js'));
    await expect(page.locator('footer .theme-toggle')).toBeHidden();
  });
});
```

(Der Footer rendert die Komponente endgültig erst in Task 4; für Task 2 wird sie vorübergehend am Ende des bestehenden `footer-bottom`-Blocks eingefügt.)

- [ ] **Step 2: Test laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "ThemeToggle"`
Expected: FAIL, Locator nicht gefunden.

- [ ] **Step 3: Skript, Komponente, i18n, BaseLayout-Init anlegen**

Wie im Interface. `BaseLayout.astro`: nach `<Footer lang={lang} />` ein `<script>import { initThemeToggles } from '../scripts/theme-toggle'; initThemeToggles();</script>`.

- [ ] **Step 4: Test prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "ThemeToggle"`
Expected: PASS. `npx astro check` ohne Fehler (beide Sprachdateien haben `theme`).

- [ ] **Step 5: Commit**

```bash
git add src/scripts/theme-toggle.ts src/components/ThemeToggle.astro src/i18n/de.ts src/i18n/en.ts src/layouts/BaseLayout.astro src/styles/brand.css src/styles/home.css src/components/Footer.astro tests/e2e/premium-polish.spec.ts
git commit -m "feat(theme): Umschalter als Komponente mit gemeinsamem Skript"
```

---

### Task 3: Header auf die neue Sprache

**Files:**
- Modify: `src/components/Header.astro` (Markup 96–325; Skript 327–461: Theme-Teil 428–460 entfernen, Sentinel-Observer ergänzen; Styles 463–978 ersetzen), `src/layouts/BaseLayout.astro:14-32,116` (Prop `heroHeader`, Sentinel), `src/pages/index.astro`, `src/pages/en/index.astro` (Prop setzen), `src/i18n/de.ts` + `en.ts` (`nav.readGroup`, `nav.switchLang`), `src/styles/brand.css` + `src/styles/home.css` (`.h-container`, `.h-btn*` nach `brand.css`, neuer Modifier `.h-btn--sm`)
- Modify: `tests/e2e/lang-switcher.spec.ts`
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- Consumes: `ThemeToggle.astro` (Task 2) in der Fußzeile des mobilen Menüs.
- Produces:
  - `.h-container`, `.h-btn`, `.h-btn:hover/:active/:focus-visible`, `.h-btn-mark`, `.h-btn-arrow` ziehen aus `home.css` nach `brand.css`; neu `.h-btn--sm { min-height: 40px; padding: 0 16px; font-size: 14px; gap: 8px; }`.
  - `header.site-header[data-hero]` (Attribut nur bei `transparentAtTop`), Zustand `is-scrolled` per IntersectionObserver (`threshold: 0`) auf `div.header-sentinel` (von `BaseLayout` direkt vor `<Header>` gerendert: `position:absolute; top:0; left:0; width:1px; height:24px; pointer-events:none`). Ohne Sentinel passiert nichts.
  - `nav.site-nav` mit genau vier Kindern: `a` Features (`#features`), `a` Preise (`#pricing`), `div.nav-dropdown` Führerscheine (`#licenses-trigger`/`#licenses-menu`), `div.nav-dropdown` Ratgeber (`#guides-trigger`/`#guides-menu`). `guidesGroups` bekommt eine dritte Gruppe `t.nav.readGroup` mit Blog (`getLocalizedPath(lang,'/blog/')`, desc de „Artikel rund ums Bootfahren"/en „Articles on boating") und FAQ (`getLocalizedPath(lang,'/faq/')`, desc de „Kurze Antworten"/en „Short answers"). Blog und FAQ verschwinden als Top-Level-Links in Desktop- und Mobilmenü; mobil rendert das Ratgeber-Akkordeon alle `guidesGroups`.
  - `a.lang-switch` (ein Link, Text „EN" auf de-Seiten, „DE" auf en-Seiten, `href` = bisheriges `otherLangPath`, `aria-label={t.nav.switchLang}`, `hreflang`).
  - `a.site-cta.h-btn.h-btn--sm` (Text `t.nav.getApp`, `data-cta-position="header"`, `href={PLAY_STORE_URL}`, `target="_blank" rel="noopener noreferrer"`, ab 1024 px sichtbar).
  - `button#mobile-menu-btn.site-burger` (44×44, ohne Rahmenfläche, zwei `span.hamburger-line` à 18×2 px), unter 1024 px sichtbar.
  - Megamenü-Einträge `a.nav-mega-item` ohne `span.nav-mega-icon`; Promo-Kachel `a.nav-mega-promo` mit `background: var(--h-deep)`, Text `--h-on-deep`.
  - Mobilmenü-Fußzeile `div.mobile-menu-footer` enthält `a.mobile-cta-btn` und `<ThemeToggle lang={lang} />`.
  - i18n: `nav.readGroup` („Lesen & Fragen"/„Read & ask"), `nav.switchLang` („Zur englischen Version"/„Switch to German").
  - BaseLayout Prop `heroHeader?: boolean` (Default `false`), weitergereicht als `transparentAtTop` an Header; Sentinel nur bei `heroHeader`.

- [ ] **Step 1: Failing tests schreiben**

```ts
test.describe('Header', () => {
  test('has four nav entries, one language link and a CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav.site-nav > *')).toHaveCount(4);
    await expect(page.locator('nav.site-nav > a', { hasText: 'Blog' })).toHaveCount(0);
    await expect(page.locator('#guides-menu a', { hasText: 'Blog' })).toHaveCount(1);
    await expect(page.locator('#guides-menu a', { hasText: 'FAQ' })).toHaveCount(1);
    await expect(page.locator('a.lang-switch')).toHaveText('EN');
    await expect(page.locator('a.lang-switch')).toHaveAttribute('href', '/en/');
    await expect(page.locator('a.site-cta')).toHaveAttribute('data-cta-position', 'header');
    await expect(page.locator('.lang-switcher, .theme-switcher')).toHaveCount(0);
    await expect(page.locator('#guides-menu .nav-mega-icon, #licenses-menu .nav-mega-icon')).toHaveCount(0);
  });

  test('is transparent at the top of the homepage and solid after scrolling, solid on subpages', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header.site-header');
    await expect(header).toHaveAttribute('data-hero', '');
    await expect(header).not.toHaveClass(/is-scrolled/);
    expect(await header.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect(header).toHaveClass(/is-scrolled/);
    await page.goto('/sbf-binnen/');
    await expect(page.locator('header.site-header')).not.toHaveAttribute('data-hero');
    expect(await page.locator('header.site-header').evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('mega menu stays inside a 1024px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.locator('#guides-trigger').hover();
    const box = await page.locator('#guides-menu').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1024);
  });

  test('mobile menu has Preise, Ratgeber accordion with Blog, and a theme toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('#mobile-menu-btn').click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/open/);
    await expect(page.locator('#mobile-menu .mobile-nav-link', { hasText: 'Preise' })).toBeVisible();
    await expect(page.locator('#mobile-menu > nav > a.mobile-nav-link', { hasText: 'Blog' })).toHaveCount(0);
    await page.locator('#mobile-menu .mobile-accordion-trigger', { hasText: 'Ratgeber' }).click();
    await expect(page.locator('#mobile-acc-guides-body a', { hasText: 'Blog' })).toBeVisible();
    await expect(page.locator('#mobile-menu .theme-choice[data-theme-set="dark"]')).toBeVisible();
  });
});
```

`tests/e2e/lang-switcher.spec.ts` anpassen: statt `.lang-switcher a.lang-active`/`hasText` jeweils `a.lang-switch`: vor dem Klick `toHaveAttribute('href', '/en/sbf-inland/')`, Klick, URL prüfen, zurück `toHaveAttribute('href', '/sbf-binnen/')`, Klick, URL prüfen. Gleiches Muster in den beiden anderen Tests.

- [ ] **Step 2: Tests laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Header" tests/e2e/lang-switcher.spec.ts`
Expected: FAIL (`nav.site-nav` fehlt, `a.lang-switch` fehlt).

- [ ] **Step 3: Header-Markup umbauen**

`<header class="site-header" data-hero={transparentAtTop ? '' : undefined}>` ohne Tailwind-Farb-/Rahmen-Utilities; innerer Wrapper `div.h-container.site-header-bar` (Flex, 64 px, `justify-content: space-between`). Logo unverändert, Inline-Farben durch `var(--h-ink)`/`var(--h-blue-ink)` ersetzen. `nav.site-nav` mit vier Einträgen; `guidesGroups` um `readGroup` erweitern. Rechts `a.lang-switch`, `a.site-cta.h-btn.h-btn--sm`, `button#mobile-menu-btn.site-burger`. Mobilmenü: Top-Level Blog/FAQ entfernen, Ratgeber-Akkordeon rendert alle Gruppen, Fußzeile mit CTA und `ThemeToggle`. Theme-Code (Zeilen 428–460) löschen; Observer für `.header-sentinel` ergänzen (`isIntersecting === false` → `is-scrolled`).

- [ ] **Step 4: Header-Styles ersetzen**

Komplett neu nach Spec 4.3: Fläche `color-mix(in srgb, var(--h-paper) 78%, transparent)` + `backdrop-filter: blur(20px)`, `border-bottom: 1px solid var(--h-line)`; `html.dark`: `color-mix(in srgb, var(--h-deep) 78%, transparent)`; `.site-header[data-hero]:not(.is-scrolled) { background: transparent; border-color: transparent; backdrop-filter: none; }`; `transition: background-color .3s var(--h-ease), border-color .3s var(--h-ease)` (reduced-motion: `transition: none`). Nav-Links Inter 500 15 px `--h-text`, Hover `--h-ink`. Megamenü: Radius `--h-r`, Schatten `0 1px 2px rgba(11,21,48,.04), 0 24px 48px -24px rgba(11,21,48,.3)`, Gruppen-Titel Inter 600 13 px `--h-muted` ohne `text-transform`/`letter-spacing`, Einträge zweizeilig (Label Inter 600 15 px `--h-ink`, Beschreibung 13 px `--h-muted`), Promo `--h-deep`. Mobilmenü: Fläche `--h-paper`, Links Inter 600 18 px `--h-ink` 52 px hoch, Unterlinks 16 px `--h-text`, Trenner `--h-line`. Dark-Overrides nur über Tokens, keine `!important`-Hex-Blöcke. `BaseLayout`: Prop `heroHeader`, Sentinel-Div, Weitergabe; `index.astro`/`en/index.astro`: `heroHeader`.

- [ ] **Step 5: Tests prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Header" tests/e2e/lang-switcher.spec.ts tests/e2e/conversion-journeys.spec.ts tests/e2e/conversion-journeys.en.spec.ts tests/e2e/mobile-conversion-journeys.spec.ts`
Expected: PASS. `npx astro check` ohne Fehler.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.astro src/layouts/BaseLayout.astro src/pages/index.astro src/pages/en/index.astro src/i18n/de.ts src/i18n/en.ts src/styles/brand.css src/styles/home.css tests/e2e/lang-switcher.spec.ts tests/e2e/premium-polish.spec.ts
git commit -m "feat(header): vier Einträge, ein Sprachlink, Tokens, transparent über dem Hero"
```

---

### Task 4: Footer auf die neue Sprache, Store-Bewertung ab 10 Bewertungen

**Files:**
- Modify: `src/data/apps.ts` (nach `getBoatpassIosRating`), `src/components/Footer.astro` (komplett), `src/i18n/de.ts` + `en.ts` (`footer.madeIn`)
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- Produces in `apps.ts`:
  - `export const MIN_STORE_RATINGS = 10;`
  - `export type StoreKey = 'ios' | 'play';`
  - `export function getBoatpassStoreRatingsForDisplay(): { store: StoreKey; rating: AppRating }[]` — Reihenfolge ios, play; nur Einträge mit `rating.ratings >= MIN_STORE_RATINGS`.
- Produces Markup: `footer.site-footer` > `.h-container` > `div.footer-store` (StoreBadges `id="footer-badge"` + `a.footer-rating` je Eintrag mit `data-store`), `div.footer-cols` (3× `div.footer-col` > `h3.footer-col-title` + `ul.footer-links` > `li > a`; Ratgeber-Spalte zusätzlich `footer-col--guides`, unter 640 px ausgeblendet), `div.footer-legal` (`p.footer-copyright`, `a.footer-legal-link` ×3, `<ThemeToggle>` mit `margin-left: auto`), `p.footer-made` (`t.footer.madeIn`).
- i18n: `footer.madeIn` („Entwickelt in Deutschland"/„Made in Germany").
- Consumes: `ThemeToggle.astro` (Task 2); `.h-container` (Task 3).

- [ ] **Step 1: Failing tests schreiben**

```ts
import { MIN_STORE_RATINGS, getBoatpassStoreRatingsForDisplay } from '../../src/data/apps';

test.describe('Footer', () => {
  test('only stores with enough ratings are shown, no icons, theme toggle present', async ({ page }) => {
    const shown = getBoatpassStoreRatingsForDisplay();
    expect(shown.every(r => r.rating.ratings >= MIN_STORE_RATINGS)).toBe(true);
    await page.goto('/');
    await expect(page.locator('footer .footer-rating')).toHaveCount(shown.length);
    await expect(page.locator('footer .footer-rating', { hasText: 'App Store' })).toHaveCount(0);
    await expect(page.locator('footer .footer-links svg')).toHaveCount(0);
    await expect(page.locator('footer .footer-col')).toHaveCount(3);
    await expect(page.locator('footer .theme-toggle')).toBeVisible();
    await expect(page.locator('footer')).not.toContainText('Entwickelt mit');
    await expect(page.locator('#footer-badge-ios')).toBeVisible();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Footer"`
Expected: FAIL (Import fehlt → Fehler, oder `.footer-rating` Count 2).

- [ ] **Step 3: `apps.ts` erweitern, Footer neu aufbauen**

`getBoatpassStoreRatingsForDisplay()` auf Basis von `getBoatpassIosRating()`/`getBoatpassRating()`. Footer-Markup wie im Interface; Link-Listen unverändert in Inhalt und Reihenfolge (`licenseLinks`, `guideLinks`, `aboutLinks`, `legalLinks`), ohne `icon`-Felder, ohne `Icon`-Import. Styles (Spec 4.4): Fläche `--h-paper-2`, `border-top: 1px solid var(--h-line)`; Spaltentitel Inter 600 14 px `--h-ink`; Links Inter 400 15 px `--h-text`, `padding-block: 10px`, Hover `--h-ink` + Unterstreichung; `footer-legal` als umbrechende Flex-Zeile `gap: 8px 20px`; Bewertung: Sterne 14 px `--h-beacon`, Score Inter 600 `--h-ink`, Zähler 13 px `--h-muted`; Dark: `html.dark .site-footer { background: #0D1018 }`.

- [ ] **Step 4: Tests prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Footer|ThemeToggle" tests/e2e/conversion-journeys.spec.ts`
Expected: PASS. `npx astro check` ohne Fehler.

- [ ] **Step 5: Commit**

```bash
git add src/data/apps.ts src/components/Footer.astro src/i18n/de.ts src/i18n/en.ts tests/e2e/premium-polish.spec.ts
git commit -m "feat(footer): Tokens, ohne Icons, Theme-Umschalter, Store-Bewertung ab 10 Bewertungen"
```

---

### Task 5: Hero-Reduktion und Abschluss ohne Bewertung

**Files:**
- Modify: `src/components/home/HomeHero.astro:53-116` (Markup), `:127-218, 267-304` (Styles), `src/components/home/HomeFinalCta.astro:22-23, 42-48, 94-110`, `src/i18n/de.ts` + `en.ts` (neu `home.heroNote`, `home.ratingCountLabel`; entfernen `home.heroFacts`, `home.ratingSource`, `home.funkQuestions`)
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- Produces Markup im Hero:
  - `p.hh-rating` = `span.hh-stars` (5 SVG-Sterne 12 px, `aria-hidden`) + `span.hh-rating-text` mit `span.sr-only` `{h.ratingOutOf},` und Text `{score} · {rating.ratings} {h.ratingCountLabel}` (Score in `span.h-num`).
  - `p.hh-note` = `h.heroNote` (statt `ul.hh-facts`).
  - `p.hh-catalogs` (statt `nav.hh-data`) = `span.hh-catalogs-label` `{h.heroData}` + fünf `a.hh-catalog` (Name als Text, `href` wie heute) mit `span.hh-catalog-sep` „·" dazwischen.
  - `HomeFinalCta`: Block `p.hx-rating` samt Konstanten `rating`, `score` und Importen `getBoatpassCombinedRating`, `formatRating` entfernen; CSS `.hx-rating`, `.hx-rating strong` löschen.
- i18n: `home.heroNote` de „Ohne Account starten, 15 Fragen täglich gratis. Danach Einmalkauf statt Abo, für iPhone, iPad und Android." en „Start without an account, 15 free questions a day. After that a one-off purchase instead of a subscription, for iPhone, iPad and Android."; `home.ratingCountLabel` de „Bewertungen" en „ratings".

- [ ] **Step 1: Failing tests schreiben**

```ts
test.describe('Hero reduction', () => {
  test('rating is one line, facts are one sentence, catalogs are text links, rating appears three times (DE)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hh-rating')).toContainText(/4,96 · 29 Bewertungen/);
    await expect(page.locator('.hh-rating-score, .hh-facts, .hh-chip, .hh-data')).toHaveCount(0);
    await expect(page.locator('.hh-note')).toContainText('Ohne Account starten');
    await expect(page.locator('.hh-catalogs a')).toHaveCount(5);
    await expect(page.locator('.hh-catalogs a').nth(1)).toHaveAttribute('href', '/sbf-see/');
    await expect(page.locator('.hx-rating')).toHaveCount(0);
    expect(await page.evaluate(() => (document.body.innerText.match(/4,96/g) ?? []).length)).toBe(3);
  });
  test('EN parity', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('.hh-rating')).toContainText(/4\.96 · 29 ratings/);
    await expect(page.locator('.hh-catalogs a')).toHaveCount(5);
    expect(await page.evaluate(() => (document.body.innerText.match(/4\.96/g) ?? []).length)).toBe(2);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero reduction"`
Expected: FAIL (`.hh-note` fehlt).

- [ ] **Step 3: Markup, Styles, i18n umsetzen**

Styles (Spec 4.2): `.hh-rating { display:inline-flex; align-items:center; gap:8px; margin:0; }`, `.hh-stars { display:inline-flex; gap:2px; color: var(--h-beacon); }`, `.hh-rating-text { font: 600 14px/1 var(--h-sans); color: var(--h-muted); }`; `.hh-note { margin: 20px 0 0; max-width: 46ch; font-size: 15px; line-height: 1.6; color: var(--h-muted); text-wrap: pretty; }`; `.hh-catalogs { margin-top: clamp(32px, 4vw, 48px); display:flex; flex-wrap:wrap; gap: 0 10px; align-items: baseline; font-size: 14px; color: var(--h-muted); }`, `.hh-catalogs-label { color: var(--h-ink); font-weight: 600; margin-right: 6px; }`, `.hh-catalog { display:inline-flex; align-items:center; min-height: 44px; color: var(--h-blue-ink); font-weight: 600; text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 5px; text-decoration-color: color-mix(in srgb, currentColor 35%, transparent); }`, Hover `text-decoration-color: currentColor`. Alte Regeln `.hh-data*`, `.hh-chip*`, `.hh-facts*`, `.hh-fact-icon`, `.hh-rating-score`, `.hh-rating-meta`, `.hh-rating-count`, `.hh-star--off` löschen.

- [ ] **Step 4: Tests prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero reduction" tests/e2e/conversion-journeys.spec.ts tests/e2e/conversion-journeys.en.spec.ts`
Expected: PASS. `npx astro check` ohne Fehler; `grep -rn "heroFacts\|ratingSource\b\|funkQuestions" src` liefert nichts.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HomeHero.astro src/components/home/HomeFinalCta.astro src/i18n/de.ts src/i18n/en.ts tests/e2e/premium-polish.spec.ts
git commit -m "design(hero): Bewertung einzeilig, Fakten als Satz, Kataloge als Textzeile, Abschluss ohne Bewertung"
```

---

### Task 6: Platzhalter-Fotos und Bild-Pipeline

**Files:**
- Create: `scripts/make-hero-placeholders.mjs`, `src/assets/images/hero/water-day.jpg` (2400×3200), `src/assets/images/hero/water-day-wide.jpg` (2400×1350), `src/components/home/HeroPhoto.astro`
- Modify: `src/components/home/HomeHero.astro:78-96` (Einbindung, `fetchpriority` vom Handy-Bild entfernen)
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- `scripts/make-hero-placeholders.mjs`: `node scripts/make-hero-placeholders.mjs` schreibt beide JPGs (sharp aus `node_modules`): SVG-Quelle mit linearem Verlauf von `#E6ECF5` (oben) nach `#F0F4FA` (unten) und einem radialen Lichtfleck `rgba(255,255,255,.9)` bei 22 %/18 % mit 55 % Radius, JPEG-Qualität 82. Kopfkommentar: „Platzhalter bis die echten Fotos (Spec Anhang A) vorliegen; Dateien 1:1 ersetzen, Skript bleibt zum Regenerieren."
- `HeroPhoto.astro` Props `{ class?: string }`. Frontmatter: `import { getImage } from 'astro:assets'`; je Quelle (`waterDay`, `waterDayWide`) und Format (`avif`, `webp`) ein `getImage({ src, widths: [640, 960, 1280, 1920], format, quality: 68 })`. Rendert:
  ```html
  <picture class="hh-photo">
    <source media="(min-width: 1024px)" type="image/avif" srcset={portraitAvif.srcSet.attribute} sizes="42vw" />
    <source media="(min-width: 1024px)" type="image/webp" srcset={portraitWebp.srcSet.attribute} sizes="42vw" />
    <source type="image/avif" srcset={wideAvif.srcSet.attribute} sizes="100vw" />
    <source type="image/webp" srcset={wideWebp.srcSet.attribute} sizes="100vw" />
    <img src={wideWebp.src} width={wideWebp.attributes.width} height={wideWebp.attributes.height} alt="" loading="eager" fetchpriority="high" decoding="async" />
  </picture>
  ```
  Styles (`is:global`): `.hh-photo { position:absolute; inset: 0 0 -12% 0; } .hh-photo img { width:100%; height:100%; object-fit: cover; object-position: center 60%; display:block; } html.dark .hh-photo img { filter: saturate(.85) brightness(.8); }`.
- `HomeHero.astro`: `div.hh-visual` bekommt zusätzlich die Klasse `hh-panel`; `<HeroPhoto />` als erstes Kind (vor dem bisherigen `div.h-stage.hh-stage`, das in Task 7 verschwindet). Handy-`<Image>` verliert `fetchpriority="high"`, behält `loading="eager"`.

- [ ] **Step 1: Failing test schreiben**

```ts
test.describe('Hero photo pipeline', () => {
  test('renders a picture with art direction and avif/webp sources', async ({ page }) => {
    await page.goto('/');
    const pic = page.locator('.hh-panel picture.hh-photo');
    await expect(pic).toHaveCount(1);
    await expect(pic.locator('source[media="(min-width: 1024px)"][type="image/avif"]')).toHaveCount(1);
    await expect(pic.locator('source:not([media])[type="image/webp"]')).toHaveCount(1);
    const img = pic.locator('img');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(img).toHaveAttribute('alt', '');
    expect(await img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.hh-phone img[fetchpriority="high"]')).toHaveCount(0);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero photo pipeline"`
Expected: FAIL (`.hh-panel` fehlt).

- [ ] **Step 3: Skript ausführen, Komponente anlegen, einhängen**

`node scripts/make-hero-placeholders.mjs`; `HeroPhoto.astro` und `HomeHero.astro` wie im Interface.

- [ ] **Step 4: Test und Build-Größen prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero photo pipeline"`
Expected: PASS. `npm run build && ls -la dist/_astro/water-day*` zeigt AVIF- und WebP-Varianten in vier Breiten je Quelle.

- [ ] **Step 5: Commit**

```bash
git add scripts/make-hero-placeholders.mjs src/assets/images/hero src/components/home/HeroPhoto.astro src/components/home/HomeHero.astro tests/e2e/premium-polish.spec.ts
git commit -m "feat(hero): Foto-Pipeline mit Art Direction und Platzhalterbildern"
```

---

### Task 7: Hero-Paneel mit Gerät im Wasser

**Files:**
- Modify: `src/components/home/HomeHero.astro` (Markup `div.hh-visual`; Styles `.hh`, `.hh-grid`, `.hh-copy`, `.hh-visual`/`.hh-stage`/`.hh-phone-wrap`/`.hh-phone`, Keyframe `hh-rise`), `src/scripts/home-motion.ts` (neue `initHeroParallax()`)
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- Consumes: `HeroPhoto.astro` und Klasse `hh-panel` (Task 6), `--h-shadow-device` (Task 1).
- Produces Markup: `div.hh-visual.hh-panel` > `HeroPhoto` + `div.hh-phone-pos` > `div.hh-phone-wrap` > `div.h-phone.hh-phone[data-tilt]` > `div.h-phone-screen` > `Image`. `div.h-stage.hh-stage` entfällt.
- Produces Styles (Spec 4.1):
  - `.hh { padding: calc(64px + clamp(20px, 3vw, 36px)) 0 clamp(48px, 6vw, 88px); container-type: inline-size; }`; ab 1024 px `padding-top: 80px`.
  - ≥ 1024: `.hh-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: center; }`, `.hh-copy { align-self: center; }`, `.hh-panel { position: relative; overflow: hidden; height: clamp(560px, 86vh, 820px); border-radius: 28px 0 0 28px; margin-inline-end: calc(-1 * ((100cqw - min(100cqw, var(--h-max))) / 2 + var(--h-gutter))); }`.
  - < 1024: `.hh-panel { position: relative; overflow: hidden; margin-inline: calc(-1 * var(--h-gutter)); border-radius: 0; height: clamp(420px, 118vw, 540px); }`; 640–1023 px: `height: auto; aspect-ratio: 16 / 9;`.
  - `.hh-phone-pos { position: absolute; left: 50%; bottom: 0; transform: translate(-50%, 12%); }` (< 1024: `translate(-50%, 22%)`), `.hh-phone-wrap { perspective: 1400px; }`, `.hh-phone { --pw: clamp(280px, 24vw, 360px); box-shadow: var(--h-shadow-device); transform-style: preserve-3d; }` (< 1024: `--pw: 220px`).
  - `.hh-panel::after { content:''; position:absolute; inset:0; pointer-events:none; background: linear-gradient(180deg, rgba(8,11,20,.35), rgba(8,11,20,.6)); opacity: 0; transition: opacity .3s; } html.dark .hh-panel::after { opacity: 1; }`.
  - `.h-motion .hh-phone-wrap { animation: hh-rise 1.4s var(--h-ease) .1s both; }` bleibt (Positionierung liegt auf `.hh-phone-pos`, kein Transform-Konflikt mehr).
- Produces in `home-motion.ts`: `function initHeroParallax(): void` — `gsap.matchMedia().add('(min-width: 1024px)', () => { gsap.to('.hh-photo', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hh', start: 'top top', end: 'bottom top', scrub: true } }); })`, aufgerufen nach `initTilt()` nur im `motion`-Zweig.

- [ ] **Step 1: Failing tests schreiben**

```ts
test.describe('Hero panel', () => {
  for (const vp of [{ w: 1280, h: 720 }, { w: 1280, h: 620 }, { w: 1440, h: 900 }]) {
    test(`CTA and phone visible without scrolling at ${vp.w}x${vp.h}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      const cta = await page.locator('#hero-cta-play').boundingBox();
      expect(cta!.y + cta!.height).toBeLessThanOrEqual(vp.h);
      const phone = await page.locator('.hh-phone').boundingBox();
      expect(phone!.y).toBeLessThan(vp.h);
      expect(phone!.width).toBeGreaterThanOrEqual(280);
      const panel = await page.locator('.hh-panel').boundingBox();
      expect(panel!.y).toBeGreaterThanOrEqual(64);
      // Rechte Kante am Viewport-Rand; 16 px Toleranz für eine eventuelle Scrollbar.
      expect(panel!.x + panel!.width).toBeGreaterThanOrEqual(vp.w - 16);
      expect(phone!.y + phone!.height).toBeGreaterThan(panel!.y + panel!.height);
      await expect(page.locator('.hh-stage')).toHaveCount(0);
    });
  }
  for (const w of [360, 1024, 1280, 1920]) {
    test(`no horizontal overflow at ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto('/');
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(over).toBeLessThanOrEqual(0);
    });
  }
  test('mobile band is full-bleed with the phone cropped at the bottom', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const panel = await page.locator('.hh-panel').boundingBox();
    expect(panel!.x).toBe(0);
    expect(panel!.width).toBe(375);
    expect(panel!.height).toBeGreaterThanOrEqual(420);
    expect(panel!.height).toBeLessThanOrEqual(540);
    const phone = await page.locator('.hh-phone').boundingBox();
    expect(Math.round(phone!.width)).toBe(220);
    expect(phone!.y + phone!.height).toBeGreaterThan(panel!.y + panel!.height);
    expect(phone!.y - panel!.y).toBeGreaterThanOrEqual(60);
  });
  test('dark mode darkens the photo', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').opacity)).toBe('1');
    expect(await page.locator('.hh-photo img').evaluate(el => getComputedStyle(el).filter)).toContain('saturate');
  });
});
```

- [ ] **Step 2: Tests laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero panel"`
Expected: FAIL (Paneel endet nicht am Viewport-Rand, `.hh-stage` vorhanden, Handy < 280 px).

- [ ] **Step 3: Markup und Styles umsetzen, Parallaxe ergänzen**

Wie im Interface. Alte Regeln `.hh-visual { margin:0 }`, `.hh-stage`, `.hh-phone-wrap` (Breite/Margin), `.hh-phone { --pw: 230px }` und den 1024er Block mit `--hh-pw` löschen.

- [ ] **Step 4: Tests prüfen, Sichtprüfung**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero panel|Hero photo pipeline|Hero reduction"`
Expected: PASS. Sichtprüfung im Browser (hell/dunkel, 375/768/1280/1440): Gerät steht im Band, Schatten weich, kein Kasten, Header oben transparent über Papier.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HomeHero.astro src/scripts/home-motion.ts tests/e2e/premium-polish.spec.ts
git commit -m "feat(hero): Foto-Paneel bis an den Rand, Gerät groß und angeschnitten, Parallaxe"
```

---

### Task 8: Lernweg ohne Kasten und Caption

**Files:**
- Modify: `src/components/home/HomeJourney.astro:98-123` (Markup), `:236-269` (Styles), `src/scripts/home-motion.ts` (Caption-Code: `capNum`, `capTitle` und ihre Zuweisungen entfernen)
- Test: `tests/e2e/premium-polish.spec.ts`

**Interfaces:**
- Produces: `div.hj-stage-sticky` > `div.hj-backdrop` (ohne `h-stage`) > `div.h-phone.hj-phone`; `p.hj-stage-cap` entfällt samt `data-stage-cap-num`/`data-stage-cap-title`.
- Styles: `.hj-backdrop { position: relative; display: grid; place-items: center; padding: 40px 0; } .hj-backdrop::before { content:''; position:absolute; inset:-10%; background: radial-gradient(closest-side, var(--h-paper-2), transparent); opacity: .6; pointer-events:none; } .hj-phone { position: relative; --pw: min(320px, calc((100svh - 64px) * 0.36)); box-shadow: var(--h-shadow-device); }`. `.hj-stage-cap*`-Regeln löschen.

- [ ] **Step 1: Failing test schreiben**

```ts
test.describe('Journey stage', () => {
  test('sticky phone stands free without box or caption', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('.hj-stage-cap, [data-stage-cap-num]')).toHaveCount(0);
    const bd = page.locator('.hj-backdrop');
    expect(await bd.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    expect(await bd.evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
    expect((await page.locator('.hj-phone').boundingBox())!.width).toBeGreaterThanOrEqual(260);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Journey stage"`
Expected: FAIL (Caption vorhanden, Hintergrund `--h-paper-2`).

- [ ] **Step 3: Umsetzen**

Markup, Styles, Skript wie im Interface.

- [ ] **Step 4: Tests prüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Journey stage" tests/e2e/conversion-journeys.spec.ts`
Expected: PASS (Quiz-Test unberührt).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HomeJourney.astro src/scripts/home-motion.ts tests/e2e/premium-polish.spec.ts
git commit -m "design(journey): sticky Handy ohne grauen Kasten und ohne Caption"
```

---

### Task 9: Gesamtlauf, LCP-Vergleich, Sichtabnahme

**Files:**
- Modify: keine (nur falls die Abnahme Korrekturen erzwingt)
- Test: alle `tests/e2e/*.spec.ts`

- [ ] **Step 1: Vollständiger Testlauf**

Run: `lsof -ti:4321 | xargs kill 2>/dev/null; npx playwright test`
Expected: alle Tests PASS.

- [ ] **Step 2: Typen und Build**

Run: `npx astro check && npm run build`
Expected: 0 Fehler.

- [ ] **Step 3: LCP-Vergleich (lokal)**

Basis-Build in einem eigenen Worktree (kein Stash, der Stash ist geteilt): `git worktree add /tmp/bp-base origin/main && (cd /tmp/bp-base && npm ci && npm run build && npx astro preview --port 4330 &)`; dann `npx lighthouse http://localhost:4330/ --preset=desktop --only-categories=performance --output=json --output-path=/tmp/lh-base.json --chrome-flags="--headless"`. Branch: `npm run preview` (4321) und dieselbe Messung nach `/tmp/lh-new.json`. Vergleich: `node -e "for (const f of ['/tmp/lh-base.json','/tmp/lh-new.json']) { const r = require(f); console.log(f, Math.round(r.audits['largest-contentful-paint'].numericValue), r.audits['largest-contentful-paint'].details?.items?.[0]?.node?.selector) }"`.
Expected: LCP neu ≤ LCP Basis + 300 ms; LCP-Element am Desktop ist das Foto, unter 1024 px die H1. Werte für die PR-Beschreibung notieren. Danach `git worktree remove /tmp/bp-base --force`.

- [ ] **Step 4: Sichtabnahme nach Spec Abschnitt 7**

Screenshots hell/dunkel bei 375, 768, 1024, 1280×720, 1440×900 von `/` und `/sbf-binnen/`. Prüfen: Logo und H1 auf einer linken Flucht (Startseite), genau fünf Elemente im ersten Viewport, Footer ohne Icons, Umschalter funktioniert in Footer und mobilem Menü.

- [ ] **Step 5: Push**

```bash
git push -u origin feat/premium-polish
```

---

### Task 10: Echte Fotos einhängen (sobald geliefert)

**Files:**
- Modify: `src/assets/images/hero/water-day.jpg`, `src/assets/images/hero/water-day-wide.jpg` (1:1 ersetzen, gleiche Dateinamen); ggf. `src/components/home/HeroPhoto.astro` (`quality`, `object-position`)
- Test: `tests/e2e/premium-polish.spec.ts` (bestehend), Build-Größen

- [ ] **Step 1: Dateien prüfen**

Run: `sips -g pixelWidth -g pixelHeight src/assets/images/hero/water-day.jpg src/assets/images/hero/water-day-wide.jpg`
Expected: Breite ≥ 2400, Seitenverhältnisse 3:4 (±2 %) und 16:9 (±2 %). Bei Abweichung zentriert beschneiden (`sips -c <h> <w>`), nicht verzerren.

- [ ] **Step 2: Build-Größe und Tests**

Run: `npm run build && ls -la dist/_astro/water-day* | sort -k5 -n | tail -8 && npx playwright test tests/e2e/premium-polish.spec.ts -g "Hero"`
Expected: 1280er AVIF ≤ 140 KB (sonst `quality` in `HeroPhoto.astro` schrittweise bis 58 senken), Tests PASS.

- [ ] **Step 3: Sicht- und Kontrastprüfung mit echtem Foto**

Hell: Gerät und Schatten lesbar vor dem Wasser; Dunkel: Overlay dunkelt ausreichend. Falls der Bildausschnitt nicht sitzt: nur `object-position` in `HeroPhoto.astro` anpassen.

- [ ] **Step 4: LCP erneut messen (nur Branch), Commit, Push**

Wie Task 9 Schritt 3 nur für den Branch; Wert in die PR-Beschreibung.

```bash
git add src/assets/images/hero src/components/home/HeroPhoto.astro
git commit -m "feat(hero): echte Wasser-Fotos (Tag) für Paneel und Band"
git push
```

- [ ] **Step 5: PR anlegen**

`gh pr create --base main --head feat/premium-polish --title "design(home): Premium-Politur – Foto-Hero, Reduktion, Header & Footer" --body-file <Datei>` mit Zusammenfassung, Screenshots, LCP-Werten, Verweis auf die Spec und die Folgerunde (Lernweg-Layout, Preisliste, Unterseiten auf `.h-container`), abgeschlossen mit `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
