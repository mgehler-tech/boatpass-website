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
    await expect(page.locator('footer .theme-toggle')).toHaveCount(1);
    await expect(page.locator('footer .theme-toggle')).toBeVisible();
    await page.evaluate(() => document.documentElement.classList.remove('h-js'));
    await expect(page.locator('footer .theme-toggle')).toBeHidden();
  });
});

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
    // Ein nicht erzeugtes ::after meldet ebenfalls Opazität 1 – deshalb zusätzlich der Verlauf.
    expect(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').backgroundImage)).toContain('linear-gradient');
    expect(await page.locator('.hh-panel').evaluate(el => getComputedStyle(el, '::after').opacity)).toBe('1');
    expect(await page.locator('.hh-photo img').evaluate(el => getComputedStyle(el).filter)).toContain('saturate');
  });
});
