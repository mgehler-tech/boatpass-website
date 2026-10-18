import { test, expect } from '@playwright/test';

/**
 * Premium-Politur, Runde 2b (Spec docs/superpowers/specs/2026-10-18-premium-round-2-design.md,
 * Abschnitt 5.3): die fünf Lizenzseiten und die Führerschein-Übersicht (DE/EN)
 * auf Seitenkopf, Spaltenordnung und das pg-Vokabular der Startseiten-Sprache.
 */

test.beforeEach(async ({ page }) => {
  // Plausible hängt offline; die Seite braucht es für keinen Test.
  await page.route(/plausible\.io/, r => r.abort());
});

test.describe('Seitenkopf', () => {
  test('SBF Binnen: Archivo-Titel bündig zum Logo, Store-Button mit einem Symbol, Bewertung', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/sbf-binnen/');
    const title = page.locator('h1.pg-title');
    await expect(title).toContainText('SBF Binnen lernen');
    expect(await title.evaluate(el => getComputedStyle(el).fontFamily)).toMatch(/Archivo/);
    const logo = (await page.locator('.logo-link').boundingBox())!;
    expect(Math.abs((await title.boundingBox())!.x - logo.x)).toBeLessThanOrEqual(1);
    await expect(page.locator('.pg-head p.pg-eyebrow')).toHaveText('Sportbootführerschein Binnen');
    const cta = page.locator('.pg-actions a[data-cta-position="page-head"]');
    await expect(cta).toHaveAttribute('href', '/app/');
    await expect(cta.locator('.h-off-android')).toBeVisible();
    await expect(cta.locator('.h-on-android')).toBeHidden();
    await expect(page.locator('.pg-actions .hh-rating')).toContainText(/4,96/);
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
  test('Startseite behält ihre Bewertungszeile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hh-actions .hh-rating')).toContainText(/4,96 · 29 Bewertungen/);
  });
});

test.describe('Spaltenordnung', () => {
  test('Aside klebt rechts (1280x620) und steht am Handy vor dem Inhalt', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 620 });
    await page.goto('/sbf-binnen/');
    const aside = page.locator('.pg-aside');
    const main = page.locator('.pg-main');
    expect(await aside.evaluate(el => getComputedStyle(el).position)).toBe('sticky');
    // Erst nach dem Scrollen klebt die Leiste; dann muss sie ganz ins flache Fenster passen.
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(300);
    const a = (await aside.boundingBox())!;
    const m = (await main.boundingBox())!;
    expect(a.x).toBeGreaterThan(m.x + m.width);
    expect(a.y).toBeGreaterThanOrEqual(80);
    expect(a.y + a.height).toBeLessThanOrEqual(620);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(aside.locator('dl.pg-facts dt')).toHaveCount(5);
    await expect(aside.locator('dl.pg-facts')).toContainText('130,78 €');
    await expect(aside.locator('.pg-aside-buy a[data-cta-position="page-aside"]')).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    const a2 = (await aside.boundingBox())!;
    const m2 = (await main.boundingBox())!;
    expect(a2.y + a2.height).toBeLessThanOrEqual(m2.y);
    await expect(aside.locator('.pg-aside-buy')).toBeHidden();
  });
});
