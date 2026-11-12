import { test, expect } from '@playwright/test';
import {
  MIN_STORE_RATINGS,
  formatRating,
  getBoatpassCombinedRating,
  getBoatpassRating,
  getBoatpassStoreRatingsForDisplay,
} from '../../src/data/apps';

// Bewertungen aus den Daten statt fest im Test: sonst bricht jeder Daten-Refresh die Suite.
const combined = getBoatpassCombinedRating()!;
const play = getBoatpassRating()!;
const fmt = (score: number, lang: 'de' | 'en') => formatRating(score).replace('.', lang === 'de' ? ',' : '.');
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Startseite Premium-Politur (Spec docs/superpowers/specs/2026-10-17-premium-polish-design.md).
 * Prüft die sichtbaren Verträge der Umsetzung: seitenweite Tokens, Header,
 * Footer, Hero-Reduktion, Foto-Paneel und Lernweg-Bühne.
 */

// Analytics nicht laden: Ohne Internet hängt das externe Skript und verzögert
// das load-Ereignis, bis page.goto in den Timeout läuft. Der Inline-Stub
// (window.plausible) im BaseLayout fängt Events weiterhin ab.
test.beforeEach(async ({ page }) => {
  await page.route(/plausible\.io/, route => route.abort());
});

test.describe('Tokens', () => {
  test('h-tokens are defined on :root on a subpage', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    // Der CSS-Minifier normalisiert Hex (klein) und rgba() (zu #rrggbbaa);
    // geprüft wird deshalb der Wert, nicht seine Schreibweise.
    const paper = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-paper').trim());
    expect(paper.toLowerCase()).toBe('#f0f4fa');
    const shadow = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-shadow-device').trim());
    expect(shadow).toContain('0 60px 120px -40px');
    expect(shadow).toContain('0 10px 24px -12px');
  });
});

test.describe('ThemeToggle', () => {
  test('header toggle switches and persists the theme, on desktop and phone', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    const dark = page.locator('header .theme-choice[data-theme-set="dark"]');
    await expect(dark).toBeVisible();
    await expect(dark).toHaveAttribute('aria-label', 'Dunkel');
    await dark.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(dark).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.locator('header .theme-choice[data-theme-set="light"]').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    // Auf dem Handy bleibt er im Header; Footer und mobiles Menü haben keinen.
    await page.setViewportSize({ width: 360, height: 780 });
    await expect(page.locator('header .theme-toggle')).toBeVisible();
    await expect(page.locator('footer .theme-toggle, #mobile-menu .theme-toggle')).toHaveCount(0);
  });
  test('toggle is hidden without the h-js class', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    await expect(page.locator('header .theme-toggle')).toHaveCount(1);
    await expect(page.locator('header .theme-toggle')).toBeVisible();
    // Die generische .h-js-only-Regel (display:block) darf die Gruppe nicht überstimmen.
    // Als Flex-Item der Aktionsleiste wird inline-flex zu flex blockifiziert; beides ist richtig.
    expect(await page.locator('header .theme-toggle').evaluate(el => getComputedStyle(el).display)).toMatch(/^(inline-)?flex$/);
    await page.evaluate(() => document.documentElement.classList.remove('h-js'));
    await expect(page.locator('header .theme-toggle')).toBeHidden();
  });
});

test.describe('Header', () => {
  test('has four nav entries, a DE|EN pill, a theme pill and a CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav.site-nav > *')).toHaveCount(4);
    await expect(page.locator('nav.site-nav > a', { hasText: 'Blog' })).toHaveCount(0);
    await expect(page.locator('#guides-menu a', { hasText: 'Blog' })).toHaveCount(1);
    await expect(page.locator('#guides-menu a', { hasText: 'FAQ' })).toHaveCount(1);
    const lang = page.locator('header nav.lang-switcher a.lang-option');
    await expect(lang).toHaveCount(2);
    await expect(lang.nth(0)).toHaveText('DE');
    await expect(lang.nth(0)).toHaveAttribute('aria-current', 'page');
    await expect(lang.nth(1)).toHaveText('EN');
    await expect(lang.nth(1)).toHaveAttribute('href', '/en/');
    await expect(lang.nth(1)).not.toHaveAttribute('aria-current');
    await expect(page.locator('header .site-actions .theme-toggle .theme-choice')).toHaveCount(2);
    await expect(page.locator('a.site-cta')).toHaveAttribute('data-cta-position', 'header');
    await expect(page.locator('a.lang-switch')).toHaveCount(0);
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

  test('falls back to a solid header without JavaScript and keeps a non-color-mix background', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header.site-header');
    expect(await header.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    // Ohne JavaScript gibt es kein h-js: die Kopfzeile muss dann Fläche sein,
    // sonst steht sie beim Scrollen durchsichtig über Foto und Navy-Abschnitten.
    await page.evaluate(() => document.documentElement.classList.remove('h-js'));
    expect(await header.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    // Browser ohne color-mix() (iOS 15, Safari < 16.2) brauchen eine Rückfall-Deklaration davor.
    const css = await page.evaluate(async () => {
      const hrefs = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(l => l.href);
      const texts = await Promise.all(hrefs.map(h => fetch(h).then(r => r.text())));
      return texts.join('\n');
    });
    expect(css).toMatch(/background:\s*var\(--h-paper\);\s*background:\s*color-mix\(/);
    expect(css).toMatch(/background:\s*var\(--h-deep\);\s*background:\s*color-mix\(/);
  });

  test('both pills fit a 360px header in one row and mark the current language (EN)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/en/');
    await expect(page.locator('nav.lang-switcher a.lang-option[hreflang="en"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('nav.lang-switcher a.lang-option[hreflang="de"]')).toHaveAttribute('href', '/');
    await expect(page.locator('nav.lang-switcher')).toHaveAttribute('aria-label', 'Language');
    const logo = await page.locator('.logo-link').boundingBox();
    const theme = await page.locator('header .theme-toggle').boundingBox();
    const burger = await page.locator('#mobile-menu-btn').boundingBox();
    expect(theme!.x).toBeGreaterThan(logo!.x + logo!.width);
    expect(burger!.x + burger!.width).toBeLessThanOrEqual(360);
    expect(Math.abs(logo!.y + logo!.height / 2 - (burger!.y + burger!.height / 2))).toBeLessThan(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('mega menu stays inside a 1024px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.locator('#guides-trigger').hover();
    const box = await page.locator('#guides-menu').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1024);
  });

  test('mobile menu has Preise and a Ratgeber accordion with Blog; the theme toggle stays in the header', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('#mobile-menu-btn').click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/open/);
    await expect(page.locator('#mobile-menu .mobile-nav-link', { hasText: 'Preise' })).toBeVisible();
    await expect(page.locator('#mobile-menu > nav > a.mobile-nav-link', { hasText: 'Blog' })).toHaveCount(0);
    await page.locator('#mobile-menu .mobile-accordion-trigger', { hasText: 'Ratgeber' }).click();
    await expect(page.locator('#mobile-acc-guides-body a', { hasText: 'Blog' })).toBeVisible();
    await expect(page.locator('#mobile-menu .theme-choice')).toHaveCount(0);
    await expect(page.locator('header .site-actions .theme-choice[data-theme-set="dark"]')).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('only stores with enough ratings are shown, no icons, no theme toggle', async ({ page }) => {
    const shown = getBoatpassStoreRatingsForDisplay();
    expect(shown.every(r => r.rating.ratings >= MIN_STORE_RATINGS)).toBe(true);
    await page.goto('/');
    await expect(page.locator('footer .footer-rating')).toHaveCount(shown.length);
    await expect(page.locator('footer .footer-rating', { hasText: 'App Store' })).toHaveCount(shown.filter(r => r.store === 'ios').length);
    await expect(page.locator('footer .footer-links svg')).toHaveCount(0);
    await expect(page.locator('footer .footer-col')).toHaveCount(3);
    await expect(page.locator('footer .theme-toggle')).toHaveCount(0);
    await expect(page.locator('footer')).not.toContainText('Entwickelt mit');
    await expect(page.locator('#footer-badge-ios')).toBeVisible();
  });
});

test.describe('Hero reduction', () => {
  test('rating is one line, facts are one sentence, catalogs are text links, rating appears three times (DE)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hh-rating')).toContainText(`${fmt(combined.score, 'de')} · ${combined.ratings} Bewertungen`);
    await expect(page.locator('.hh-rating-score, .hh-data')).toHaveCount(0);
    await expect(page.locator('.hh-note')).toContainText('Ohne Account starten');
    await expect(page.locator('.hh-catalogs a')).toHaveCount(5);
    await expect(page.locator('.hh-catalogs a').nth(1)).toHaveAttribute('href', '/sbf-see/');
    await expect(page.locator('.hx-rating')).toHaveCount(0);
    // Google-Play-Wert: Rezensionsblock und Footer; der Hero zeigt beide Stores zusammen.
    const playDe = fmt(play.score, 'de');
    const expectedDe = 2 + (fmt(combined.score, 'de') === playDe ? 1 : 0);
    expect(await page.evaluate((p) => (document.body.innerText.match(new RegExp(p, 'g')) ?? []).length, esc(playDe))).toBe(expectedDe);
  });
  test('EN parity', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('.hh-rating')).toContainText(`${fmt(combined.score, 'en')} · ${combined.ratings} ratings`);
    await expect(page.locator('.hh-catalogs a')).toHaveCount(5);
    const playEn = fmt(play.score, 'en');
    const expectedEn = 1 + (fmt(combined.score, 'en') === playEn ? 1 : 0);
    expect(await page.evaluate((p) => (document.body.innerText.match(new RegExp(p, 'g')) ?? []).length, esc(playEn))).toBe(expectedEn);
  });
});

test.describe('Hero photo pipeline', () => {
  test('renders a day picture per scene; the start scene (Binnen) loads eagerly with avif/webp sources', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hh-panel picture.hh-photo--day')).toHaveCount(3);
    const pic = page.locator('.hh-panel picture.hh-photo--day[data-scene="binnen"]');
    await expect(pic).toHaveClass(/is-active/);
    await expect(pic.locator('source[media="(min-width: 1024px)"][type="image/avif"]')).toHaveCount(1);
    await expect(pic.locator('source:not([media])[type="image/webp"]')).toHaveCount(1);
    const img = pic.locator('img');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(img).toHaveAttribute('alt', '');
    expect(await img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.hh-phone img[fetchpriority="high"]')).toHaveCount(0);
  });

  test('ships a dusk picture that only shows (and only loads) in dark mode', async ({ page }) => {
    await page.goto('/');
    const dusk = page.locator('.hh-panel picture.hh-photo--dusk[data-scene="binnen"]');
    await expect(dusk).toHaveCount(1);
    await expect(dusk.locator('img')).toHaveAttribute('loading', 'lazy');
    // Hell: Dämmerung unsichtbar und nicht geladen, Tag sichtbar.
    await expect(dusk).toBeHidden();
    expect(await dusk.locator('img').evaluate(el => (el as HTMLImageElement).currentSrc)).toBe('');
    await expect(page.locator('.hh-photo--day.is-active')).toBeVisible();
    // Dunkel (per Umschalter): Dämmerung sichtbar, Tag unsichtbar.
    await page.locator('header .theme-choice[data-theme-set="dark"]').click();
    await expect(dusk).toBeVisible();
    await expect(page.locator('.hh-photo--day.is-active')).toBeHidden();
  });

  test('mobile band sizes match the rendered width and the parallax overhang is desktop-only', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Unter 640 px füllt das 2:3-Bild das hochkante Band, rund 100vw breit.
    for (const variant of ['day', 'dusk']) {
      await expect(page.locator(`.hh-photo--${variant}[data-scene="binnen"] source:not([media])[type="image/webp"]`)).toHaveAttribute('sizes', '(min-width: 1024px) 42vw, 100vw');
    }
    const day = page.locator('.hh-photo--day.is-active');
    expect(await day.evaluate(el => getComputedStyle(el).bottom)).toBe('0px');
    await page.setViewportSize({ width: 1280, height: 800 });
    expect(parseFloat(await day.evaluate(el => getComputedStyle(el).bottom))).toBeLessThan(0);
  });
});

// Der Auftakt hebt Karte bzw. Gerät 1,4 s lang an; Maße erst danach nehmen.
async function phoneSettled(page: import('@playwright/test').Page) {
  await page.locator('.hh-phone-wrap').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
}

test.describe('Hero panel', () => {
  for (const vp of [{ w: 1280, h: 720 }, { w: 1280, h: 620 }, { w: 1440, h: 900 }]) {
    test(`CTA visible without scrolling, question fully inside the panel at ${vp.w}x${vp.h}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      // Desktop: die Store-Badges sind der Hero-CTA.
      const cta = await page.locator('#hero-badge-ios').boundingBox();
      expect(cta!.y + cta!.height).toBeLessThanOrEqual(vp.h);
      await phoneSettled(page);
      const phone = await page.locator('.hh-phone').boundingBox();
      const panel = await page.locator('.hh-panel').boundingBox();
      expect(phone!.y).toBeLessThan(vp.h);
      // Ab 840 px Fensterhöhe ein Handy mit Rahmen, darunter die Karte ohne
      // Rahmen. Nie angeschnitten: oben wie unten Luft zum Paneelrand.
      const framed = vp.h >= 840;
      expect(phone!.width).toBeGreaterThanOrEqual(framed ? 200 : 300);
      expect(phone!.width).toBeLessThanOrEqual(framed ? 360 : 420);
      expect(await page.locator('.hhq-screen').evaluate(el => getComputedStyle(el).containerType)).toBe(framed ? 'inline-size' : 'normal');
      expect(phone!.y).toBeGreaterThanOrEqual(panel!.y + 16);
      expect(phone!.y + phone!.height).toBeLessThanOrEqual(panel!.y + panel!.height - 16);
      expect(panel!.y).toBeGreaterThanOrEqual(64);
      // Rechte Kante am Viewport-Rand; 16 px Toleranz für eine eventuelle Scrollbar.
      expect(panel!.x + panel!.width).toBeGreaterThanOrEqual(vp.w - 16);
      // Das Gerät beginnt unterhalb der Faktenzeile.
      const facts = await page.locator('.hh-fact:not([hidden])').boundingBox();
      expect(phone!.y).toBeGreaterThan(facts!.y + facts!.height);
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
  test('mobile band is full-bleed and grows with the question card (no device frame)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await phoneSettled(page);
    const panel = await page.locator('.hh-panel').boundingBox();
    expect(panel!.x).toBe(0);
    expect(panel!.width).toBe(375);
    expect(panel!.height).toBeGreaterThanOrEqual(560);
    const phone = await page.locator('.hh-phone').boundingBox();
    expect(phone!.width).toBe(343);
    expect(phone!.y).toBeGreaterThanOrEqual(panel!.y + 16);
    expect(phone!.y + phone!.height).toBeLessThanOrEqual(panel!.y + panel!.height - 16);
  });
  test('tablet panel centres the question card', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await phoneSettled(page);
    const panel = await page.locator('.hh-panel').boundingBox();
    expect(panel!.width).toBe(768);
    const phone = await page.locator('.hh-phone').boundingBox();
    expect(phone!.width).toBe(440);
    expect(Math.round(phone!.x + phone!.width / 2)).toBe(384);
    expect(phone!.y).toBeGreaterThanOrEqual(panel!.y + 16);
    expect(phone!.y + phone!.height).toBeLessThanOrEqual(panel!.y + panel!.height - 16);
  });
  test('dark mode shows the dusk photo with a light overlay', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('.hh-photo--dusk.is-active')).toBeVisible();
    await expect(page.locator('.hh-photo--day.is-active')).toBeHidden();
    // Ein nicht erzeugtes ::after meldet ebenfalls Opazität 1 – deshalb zusätzlich der Verlauf.
    expect(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').backgroundImage)).toContain('linear-gradient');
    const opacity = parseFloat(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').opacity));
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(0.6);
  });
});

test.describe('Hero licence picker', () => {
  test('chips switch question, facts and scene; arrow keys move the selection', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(5);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.hh-fact:not([hidden])')).toContainText('300 Fragen');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.hh-fact:not([hidden])')).toContainText('420 Fragen');
    await expect(page.locator('.hh-shot:not([hidden])')).toHaveAttribute('data-license', 'see');
    await expect(page.locator('.hh-shot:not([hidden])')).toHaveCount(1);
    // Während der Horizont-Blende sind kurz beide Szenen aktiv; danach nur See.
    await expect(page.locator('.hh-photo--day[data-scene="see"]')).toHaveClass(/is-active/);
    await expect(page.locator('.hh-photo--day.is-active')).toHaveCount(1);
    await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'hh-tab-see');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(tabs.nth(4)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.hh-photo--day[data-scene="funk"]')).toHaveClass(/is-active/);
    await expect(page.locator('.hh-photo--day.is-active')).toHaveCount(1);
  });
  test('EN parity', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.getByRole('tablist')).toHaveAttribute('aria-label', 'Choose a licence');
    await page.getByRole('tab', { name: 'SBF Coastal' }).click();
    await expect(page.locator('.hh-fact:not([hidden])')).toContainText('420 questions');
  });
});

// Prüfungsfrage im Hero (HeroQuestion.astro): je Schein eine echte Frage zum
// Antippen; nach der Antwort führt die Auflösung in die App und zum Quiz.
test.describe('Hero question', () => {
  const item = (page: import('@playwright/test').Page) => page.locator('.hhq-item:not([hidden])');
  const fits = (page: import('@playwright/test').Page) =>
    page.locator('.hhq-screen').evaluate(el => el.scrollHeight <= el.clientHeight + 1);
  // Das Handy hebt sich mit der Dünung; der Zeiger über dem Gerät hält sie an.
  // (Zeiger direkt setzen: hover() würde selbst auf Stillstand warten.)
  const rest = async (page: import('@playwright/test').Page) => {
    const box = (await page.locator('.hh-phone').boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 12);
    await expect.poll(() => page.locator('.hh-phone-float').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  };

  test('a wrong answer keeps the chosen and the correct answer, explains, and leads to the app and the quiz', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await phoneSettled(page);
    await expect(item(page).locator('.hhq-source')).toContainText('SBF Binnen · Amtliche Frage 157');
    await expect(item(page).locator('.hhq-q')).toHaveText('Was bedeutet dieses Tafelzeichen?');
    await expect(item(page).locator('.hhq-fig img')).toHaveAttribute('alt', 'Abbildung zu Frage 157');
    expect(await item(page).locator('.hhq-fig img').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const answers = item(page).locator('.hhq-answer');
    await expect(answers).toHaveCount(4);
    await expect(item(page).locator('.hhq-after')).toBeHidden();
    expect(await fits(page)).toBe(true);

    await rest(page);
    await answers.nth(0).click();
    await expect(item(page)).toHaveAttribute('data-state', 'wrong');
    await expect(answers.nth(0)).toHaveClass(/is-wrong/);
    await expect(answers.nth(1)).toHaveClass(/is-correct/);
    await expect(answers.nth(1)).toContainText('Fahrverbot für Fahrzeuge mit Maschinenantrieb.');
    await expect(item(page).locator('.hhq-answer:visible')).toHaveCount(2);
    await expect(item(page).locator('.hhq-verdict')).toHaveText('Leider falsch');
    await expect(item(page).locator('.hhq-expl')).toContainText('A.12');
    await expect(item(page).locator('.hhq-hint')).toBeHidden();
    await expect(page.locator('.hhq [data-status]')).toContainText('Richtige Antwort: Fahrverbot für Fahrzeuge mit Maschinenantrieb.');
    const cta = item(page).locator('.hhq-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('data-cta-position', 'hero-question');
    await expect(cta).toHaveAttribute('href', '/app/');
    await expect(cta).toContainText('In der App weiterlernen');
    await expect(item(page).locator('.hhq-more')).toHaveAttribute('href', '#quiz');
    await expect(page.locator('#quiz')).toHaveCount(1);
    // Nichts verdeckt, nichts abgeschnitten: Auflösung und Button liegen im Screen.
    expect(await fits(page)).toBe(true);
    // Ein zweiter Klick ändert nichts mehr (aria-disabled, deshalb erzwungen).
    await answers.nth(1).click({ force: true });
    await expect(item(page)).toHaveAttribute('data-state', 'wrong');
  });

  test('every licence has its own question that fits the phone before and after the answer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await phoneSettled(page);
    const expected = [
      ['SBF Binnen', 'Amtliche Frage 157'],
      ['SBF See', 'Amtliche Frage 190'],
      ['UBI', 'Amtliche Frage 111'],
      ['SRC', 'Amtliche Frage 58'],
      ['LRC', 'Amtliche Frage 55'],
    ];
    for (const [name, source] of expected) {
      await page.getByRole('tab', { name }).click();
      await expect(item(page).locator('.hhq-source')).toContainText(`${name} · ${source}`);
      await expect(item(page).locator('.hhq-answer')).toHaveCount(4);
      // Die neue Frage gleitet von unten nach; erst danach messen.
      await item(page).evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
      expect(await fits(page)).toBe(true);
      await rest(page);
      await item(page).locator('.hhq-answer[data-right]').click();
      await expect(item(page).locator('.hhq-verdict')).toHaveText('Richtig!');
      await expect(item(page).locator('.hhq-answer:visible')).toHaveCount(1);
      await expect(item(page).locator('.hhq-cta')).toBeVisible();
      expect(await fits(page)).toBe(true);
    }
  });

  test('on a phone the question is a readable card with large touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await phoneSettled(page);
    const answer = item(page).locator('.hhq-answer').first();
    expect(parseFloat(await answer.evaluate(el => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(15);
    expect((await answer.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    expect(parseFloat(await item(page).locator('.hhq-q').evaluate(el => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(17);
    await page.getByRole('tab', { name: 'LRC' }).click();
    await item(page).locator('.hhq-answer[data-right]').click();
    await expect(item(page).locator('.hhq-verdict')).toHaveText('Richtig!');
    const more = (await item(page).locator('.hhq-more').boundingBox())!;
    expect(more.height).toBeGreaterThanOrEqual(44);
    const card = (await page.locator('.hh-phone').boundingBox())!;
    const panel = (await page.locator('.hh-panel').boundingBox())!;
    expect(card.y + card.height).toBeLessThanOrEqual(panel.y + panel.height - 16);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('in a low desktop window the card stays inside the panel after the answer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 620 });
    await page.goto('/');
    await phoneSettled(page);
    for (const name of ['SBF Binnen', 'SBF See']) {
      await page.getByRole('tab', { name }).click();
      await item(page).locator('.hhq-answer:not([data-right])').first().click();
      await expect(item(page).locator('.hhq-cta')).toBeVisible();
      const card = (await page.locator('.hh-phone').boundingBox())!;
      const panel = (await page.locator('.hh-panel').boundingBox())!;
      expect(card.y + card.height).toBeLessThanOrEqual(panel.y + panel.height - 16);
      const more = (await item(page).locator('.hhq-more').boundingBox())!;
      expect(more.y + more.height).toBeLessThanOrEqual(card.y + card.height + 1);
      expect((await item(page).locator('.hhq-fig').boundingBox())!.height).toBeGreaterThanOrEqual(56);
    }
  });

  test('EN parity', async ({ page }) => {
    await page.goto('/en/');
    await expect(item(page).locator('.hhq-source')).toContainText('SBF Inland · Official question 157');
    await page.getByRole('tab', { name: 'SRC' }).click();
    await expect(item(page).locator('.hhq-q')).toHaveText('On which VHF channel does alerting by DSC take place?');
    await item(page).locator('.hhq-answer', { hasText: 'Channel 70' }).click();
    await expect(item(page).locator('.hhq-verdict')).toHaveText('Correct!');
    await expect(item(page).locator('.hhq-cta')).toContainText('Keep learning in the app');
    await expect(item(page).locator('.hhq-more')).toHaveText('Try more questions here');
  });

  test('without JavaScript the solution is shown instead of dead buttons', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto('/');
    await expect(item(page).locator('.hhq-after')).toBeVisible();
    await expect(item(page).locator('.hhq-verdict')).toBeHidden();
    await expect(item(page).locator('.hhq-expl')).toContainText('A.12');
    expect(await item(page).locator('.hhq-answer[data-right]').evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
    await context.close();
  });
});

// Richtung „Horizont“ (2026-10-31): Szenenwechsel als Blende vom Horizont,
// Handy mit Dünung und Spiegelung (ab 840 px Fensterhöhe), Video-Slots je
// Szene (noch ohne Clips).
test.describe('Hero horizon stage', () => {
  test('switching the scene opens the new photo from the horizon, then only it stays active', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/h-ready/);
    await page.getByRole('tab', { name: 'SBF See' }).click();
    const see = page.locator('.hh-photo--day[data-scene="see"]');
    // Während der Blende liegt die neue Szene über der alten, beschnitten auf ein Band um den Horizont.
    await expect(see).toHaveClass(/is-entering/);
    expect(await see.evaluate(el => getComputedStyle(el).clipPath)).toContain('inset');
    await expect(page.locator('.hh-photo--day[data-scene="binnen"]')).toHaveClass(/is-active/);
    // Danach: nur noch See aktiv, ohne Beschnitt.
    await expect(see).not.toHaveClass(/is-entering/);
    await expect(page.locator('.hh-photo--day.is-active')).toHaveCount(1);
    expect(await see.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
  });

  test('the phone floats with a soft reflection and rests while the question is in use', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/h-ready/);
    const reflect = page.locator('.hh-reflect');
    await expect(reflect).toHaveAttribute('aria-hidden', 'true');
    await phoneSettled(page);
    // Unter dem Gerät, im Paneel, rein dekorativ.
    const phone = (await page.locator('.hh-phone').boundingBox())!;
    const box = (await reflect.boundingBox())!;
    const panel = (await page.locator('.hh-panel').boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(phone.y + phone.height - 8);
    expect(box.y + box.height).toBeLessThanOrEqual(panel.y + panel.height + 1);
    expect(await page.locator('.hh-phone-float').evaluate(el => el.getAnimations().some(a => (a as CSSAnimation).animationName === 'hh-bob'))).toBe(true);
    // Fokus in der Frage hält die Dünung an, damit die Antworten stillstehen.
    await page.locator('.hhq-item:not([hidden]) .hhq-answer').first().focus();
    expect(await page.locator('.hh-phone-float').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  });

  test('ships no video until clips exist, and the stage rests when the hero leaves the screen', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/h-ready/);
    await expect(page.locator('.hh-video')).toHaveCount(0);
    await expect(page.locator('.hh-photo[data-video-tall], .hh-photo[data-video-wide]')).toHaveCount(0);
    await expect(page.locator('.hh')).not.toHaveClass(/is-offscreen/);
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(page.locator('.hh')).toHaveClass(/is-offscreen/);
  });

  test('desktop: scrolling out pushes the camera towards the water, the phone stays put', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/h-ready/);
    await phoneSettled(page);
    const scale = () => page.locator('.hh-media').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await scale()).toBeCloseTo(1, 2);
    const phoneBefore = (await page.locator('.hh-phone-pos').evaluate(el => el.getBoundingClientRect().top + window.scrollY));
    await page.mouse.wheel(0, 400);
    await expect.poll(scale).toBeGreaterThan(1.02);
    const phoneAfter = (await page.locator('.hh-phone-pos').evaluate(el => el.getBoundingClientRect().top + window.scrollY));
    expect(Math.abs(phoneAfter - phoneBefore)).toBeLessThan(1);
  });

  test('reduced motion: no drift, no swell, scenes switch without the horizon wipe', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.getAnimations().map(a => (a as CSSAnimation).animationName).filter(n => ['hh-drift', 'hh-bob'].includes(n)))).toEqual([]);
    await page.getByRole('tab', { name: 'SBF See' }).click();
    const see = page.locator('.hh-photo--day[data-scene="see"]');
    await expect(see).toHaveClass(/is-active/);
    await expect(see).not.toHaveClass(/is-entering/);
    await expect(page.locator('.hh-photo--day.is-active')).toHaveCount(1);
    await expect(page.locator('.hh-shot:not([hidden])')).toHaveAttribute('data-license', 'see');
  });
});

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
