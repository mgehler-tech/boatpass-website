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

// Die alten Inline-Farben der Inhaltsseiten (Spec 5.3); auf migrierten Seiten darf keine mehr in
// main stehen. Die eingebetteten Bausteine CatalogSources und BoatSchoolFinder bleiben in dieser
// Runde unangetastet und tragen noch #4B5563/#656B78, deshalb nur die drei Selektoren der Spec.
const noInline = 'main [style*="#1A1F36"], main [style*="background:white"], main [style*="#3366FF"]';

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

test.describe('SBF Binnen vollständig', () => {
  test('keine Inline-Farben, keine Pfeilzeichen, Bausteine vorhanden', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    await expect(page.locator(noInline)).toHaveCount(0);
    expect(await page.locator('main').innerText()).not.toMatch(/[→▶]/);
    await expect(page.locator('.pg-main .pg-answer')).toHaveCount(1);
    await expect(page.locator('.pg-main > .pg-section').first().locator('.pg-answer')).toHaveCount(1);
    await expect(page.locator('.pg-cards--4 .pg-card')).toHaveCount(4);
    await expect(page.locator('.pg-table table')).toHaveCount(1);
    await expect(page.locator('.pg-faq .pg-faq-item')).toHaveCount(5);
    await expect(page.locator('.pg-rows').first().locator('.pg-row')).toHaveCount(7);
    await expect(page.locator('ul.pg-related a')).toHaveCount(30);
    await expect(page.locator('ul.pg-related a').first()).toHaveAttribute('href', '/sbf-binnen-pruefungsfragen/');
    await expect(page.locator('h2.pg-h2')).toHaveCount(10);
    // Alte Klassen nur noch im unangetasteten BoatSchoolFinder (eigene section), nicht in den Seitenabschnitten.
    await expect(page.locator('.pg-section .content-section-title, .related-links, .exam-facts-grid')).toHaveCount(0);
    await expect(page.locator('a.pg-link')).toHaveCount(3);
  });
  test('Dark Mode über Tokens', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sbf-binnen/');
    expect(await page.locator('.pg-card').first().evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(23, 29, 43)');
    expect(await page.locator('.pg-answer').evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe('rgb(255, 255, 255)');
  });
  test('kein horizontaler Überlauf bei 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/sbf-binnen/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});
