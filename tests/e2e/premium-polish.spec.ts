import { test, expect } from '@playwright/test';
import { MIN_STORE_RATINGS, getBoatpassStoreRatingsForDisplay } from '../../src/data/apps';

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
    await expect(page.locator('footer .footer-rating', { hasText: 'App Store' })).toHaveCount(0);
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

test.describe('Hero photo pipeline', () => {
  test('renders a day picture with art direction and avif/webp sources', async ({ page }) => {
    await page.goto('/');
    const pic = page.locator('.hh-panel picture.hh-photo--day');
    await expect(pic).toHaveCount(1);
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
    const dusk = page.locator('.hh-panel picture.hh-photo--dusk');
    await expect(dusk).toHaveCount(1);
    await expect(dusk.locator('img')).toHaveAttribute('loading', 'lazy');
    // Hell: Dämmerung unsichtbar und nicht geladen, Tag sichtbar.
    await expect(dusk).toBeHidden();
    expect(await dusk.locator('img').evaluate(el => (el as HTMLImageElement).currentSrc)).toBe('');
    await expect(page.locator('.hh-photo--day')).toBeVisible();
    // Dunkel (per Umschalter): Dämmerung sichtbar, Tag unsichtbar.
    await page.locator('header .theme-choice[data-theme-set="dark"]').click();
    await expect(dusk).toBeVisible();
    await expect(page.locator('.hh-photo--day')).toBeHidden();
  });

  test('mobile band sizes match the rendered width and the parallax overhang is desktop-only', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // 16:9-Bild, das ein 124vw hohes Band per object-fit: cover füllt, ist ~220vw breit.
    for (const variant of ['day', 'dusk']) {
      await expect(page.locator(`.hh-photo--${variant} source:not([media])[type="image/webp"]`)).toHaveAttribute('sizes', '(max-width: 639px) 220vw, 100vw');
    }
    expect(await page.locator('.hh-photo--day').evaluate(el => getComputedStyle(el).bottom)).toBe('0px');
    await page.setViewportSize({ width: 1280, height: 800 });
    expect(parseFloat(await page.locator('.hh-photo--day').evaluate(el => getComputedStyle(el).bottom))).toBeLessThan(0);
  });
});

// Der Auftakt hebt das Gerät 1,4 s lang an; Maße erst danach nehmen.
async function phoneSettled(page: import('@playwright/test').Page) {
  await page.locator('.hh-phone-wrap').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
}

test.describe('Hero panel', () => {
  for (const vp of [{ w: 1280, h: 720 }, { w: 1280, h: 620 }, { w: 1440, h: 900 }]) {
    test(`CTA visible without scrolling, phone fully inside the panel at ${vp.w}x${vp.h}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      // Desktop: die Store-Badges sind der Hero-CTA.
      const cta = await page.locator('#hero-badge-ios').boundingBox();
      expect(cta!.y + cta!.height).toBeLessThanOrEqual(vp.h);
      await phoneSettled(page);
      const phone = await page.locator('.hh-phone').boundingBox();
      const panel = await page.locator('.hh-panel').boundingBox();
      expect(phone!.y).toBeLessThan(vp.h);
      // Nie angeschnitten: oben wie unten Luft zum Paneelrand; nie kleiner als 230 px.
      expect(phone!.width).toBeGreaterThanOrEqual(230);
      expect(phone!.width).toBeLessThanOrEqual(360);
      expect(phone!.y).toBeGreaterThanOrEqual(panel!.y + 16);
      expect(phone!.y + phone!.height).toBeLessThanOrEqual(panel!.y + panel!.height - 16);
      expect(panel!.y).toBeGreaterThanOrEqual(64);
      // Rechte Kante am Viewport-Rand; 16 px Toleranz für eine eventuelle Scrollbar.
      expect(panel!.x + panel!.width).toBeGreaterThanOrEqual(vp.w - 16);
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
  test('mobile band is full-bleed with the phone fully visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await phoneSettled(page);
    const panel = await page.locator('.hh-panel').boundingBox();
    expect(panel!.x).toBe(0);
    expect(panel!.width).toBe(375);
    expect(panel!.height).toBeGreaterThanOrEqual(460);
    expect(panel!.height).toBeLessThanOrEqual(560);
    const phone = await page.locator('.hh-phone').boundingBox();
    expect(phone!.width).toBeGreaterThanOrEqual(190);
    expect(phone!.width).toBeLessThanOrEqual(220);
    expect(phone!.y).toBeGreaterThanOrEqual(panel!.y + 16);
    expect(phone!.y + phone!.height).toBeLessThanOrEqual(panel!.y + panel!.height - 16);
  });
  test('tablet panel keeps 16:9 (size containment must not break aspect-ratio) with the phone inside', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await phoneSettled(page);
    const panel = await page.locator('.hh-panel').boundingBox();
    expect(panel!.width).toBe(768);
    expect(Math.round(panel!.height)).toBe(432);
    const phone = await page.locator('.hh-phone').boundingBox();
    expect(phone!.width).toBeGreaterThanOrEqual(170);
    expect(phone!.y).toBeGreaterThanOrEqual(panel!.y + 16);
    expect(phone!.y + phone!.height).toBeLessThanOrEqual(panel!.y + panel!.height - 16);
  });
  test('dark mode shows the dusk photo with a light overlay', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('.hh-photo--dusk')).toBeVisible();
    await expect(page.locator('.hh-photo--day')).toBeHidden();
    // Ein nicht erzeugtes ::after meldet ebenfalls Opazität 1 – deshalb zusätzlich der Verlauf.
    expect(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').backgroundImage)).toContain('linear-gradient');
    const opacity = parseFloat(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').opacity));
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(0.6);
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
