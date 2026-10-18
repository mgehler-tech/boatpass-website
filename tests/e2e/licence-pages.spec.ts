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
