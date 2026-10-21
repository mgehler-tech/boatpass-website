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
  test('Archivo wird auf Lizenzseiten vorgeladen, auf anderen Seiten nicht', async ({ page }) => {
    // Ohne Preload startet die 90-KB-Schrift erst nach dem CSS und schiebt den LCP (Lighthouse +750 ms).
    await page.goto('/sbf-binnen/');
    await expect(page.locator('head link[rel="preload"][as="font"][href*="archivo"]')).toHaveCount(1);
    await page.goto('/en/licenses/');
    await expect(page.locator('head link[rel="preload"][as="font"][href*="archivo"]')).toHaveCount(1);
    await page.goto('/datenschutz/');
    await expect(page.locator('head link[rel="preload"][as="font"][href*="archivo"]')).toHaveCount(0);
  });
  test('Archivo ist auf Lizenzseiten optional (kein LCP-Warten), auf der Startseite wie bisher', async ({ page }) => {
    // Spec 5.3: über 150 ms LCP-Verschlechterung → font-display: optional (Plan Task 9).
    await page.goto('/sbf-binnen/');
    const displays = await page.evaluate(() => [...document.fonts].filter(f => f.family.includes('Archivo')).map(f => f.display));
    expect(displays.length).toBeGreaterThan(0);
    expect(new Set(displays)).toEqual(new Set(['optional']));
    await page.goto('/');
    const home = await page.evaluate(() => [...document.fonts].filter(f => f.family.includes('Archivo')).map(f => f.display));
    expect(home).toContain('swap');
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

/** Rauchtest für eine migrierte Seite: Kopf, Spaltenordnung, keine Inline-Farben/Pfeile, Conversion-Hook, 360 px. */
async function expectMigrated(page: import('@playwright/test').Page, path: string, opts: { h1: RegExp; facts: number; cta?: boolean }) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path);
  const title = page.locator('h1.pg-title');
  await expect(title).toContainText(opts.h1);
  expect(await title.evaluate(el => getComputedStyle(el).fontFamily)).toMatch(/Archivo/);
  const logo = (await page.locator('.logo-link').boundingBox())!;
  expect(Math.abs((await title.boundingBox())!.x - logo.x)).toBeLessThanOrEqual(1);
  if (opts.facts > 0) {
    await expect(page.locator('.pg-layout--read')).toHaveCount(1);
    await expect(page.locator('.pg-aside dl.pg-facts dt')).toHaveCount(opts.facts);
  } else {
    await expect(page.locator('.pg-layout--wide')).toHaveCount(1);
    await expect(page.locator('.pg-aside')).toHaveCount(0);
  }
  await expect(page.locator(noInline)).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(/[→▶]/);
  if (opts.cta !== false) {
    // Die Geräteweiche schreibt generische Play-Links am Desktop auf die Auswahlseite um: /app/ bzw. /en/app/.
    await expect(page.locator('main a[href="/app/"], main a[href="/en/app/"]').first()).toBeVisible();
  }
  await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  await expect(page.locator('.pg-section .content-section-title, .related-links, .exam-facts-grid')).toHaveCount(0);
  await page.setViewportSize({ width: 360, height: 780 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
}

test.describe('Lizenzseiten migriert', () => {
  test('SBF See (DE)', async ({ page }) => {
    await expectMigrated(page, '/sbf-see/', { h1: /SBF See lernen/, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('148,38 €');
    // FAQ-Markup wie auf allen anderen Seiten (Review-Befund: See/Coastal hatten pg-card).
    await expect(page.locator('.pg-faq .pg-card')).toHaveCount(0);
    expect(await page.locator('.pg-faq .pg-faq-item').count()).toBeGreaterThanOrEqual(3);
    await page.goto('/en/sbf-coastal/');
    await expect(page.locator('.pg-faq .pg-card')).toHaveCount(0);
    expect(await page.locator('.pg-faq .pg-faq-item').count()).toBeGreaterThanOrEqual(3);
  });
  test('SBF Inland (EN)', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-inland/', { h1: /Learn SBF Inland/, facts: 5 });
    await expect(page.locator('.pg-head p.pg-eyebrow')).toHaveText('Inland Boating License');
  });
  test('SBF Coastal (EN)', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-coastal/', { h1: /Learn SBF Coastal/, facts: 5 });
  });
  test('UBI (DE)', async ({ page }) => {
    await expectMigrated(page, '/ubi/', { h1: /UBI lernen/, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('108,71 €');
  });
  test('SRC (DE)', async ({ page }) => {
    await expectMigrated(page, '/src/', { h1: /SRC lernen/, facts: 5 });
  });
  test('LRC (DE)', async ({ page }) => {
    await expectMigrated(page, '/lrc/', { h1: /LRC lernen/, facts: 5 });
  });
  test('UBI (EN)', async ({ page }) => {
    await expectMigrated(page, '/en/ubi/', { h1: /UBI/, facts: 5 });
    await expect(page.locator('.pg-practice h2.pg-h2')).toContainText('Afraid of radio');
  });
  test('SRC (EN)', async ({ page }) => {
    await expectMigrated(page, '/en/src/', { h1: /SRC/, facts: 5 });
    await expect(page.locator('.pg-practice')).toHaveCount(1);
  });
  test('LRC (EN)', async ({ page }) => {
    await expectMigrated(page, '/en/lrc/', { h1: /LRC/, facts: 5 });
    await expect(page.locator('.pg-practice')).toHaveCount(1);
  });
});

test.describe('Führerschein-Übersicht', () => {
  for (const [path, h1, banner] of [['/fuehrerscheine/', /Welche Lizenz/, 'Finder'], ['/en/licenses/', /Which licen/i, 'finder']] as const) {
    test(`${path}: breite Spalte, Finder-Banner ohne Verlauf, Lizenzkarten auf Tokens`, async ({ page }) => {
      await expectMigrated(page, path, { h1, facts: 0, cta: false });
      // Breite Variante: der Inhalt nutzt die ganze Containerbreite (1240 px), nicht die Lesespalte.
      await page.setViewportSize({ width: 1440, height: 900 });
      expect((await page.locator('.pg-layout--wide .pg-main').boundingBox())!.width).toBeGreaterThanOrEqual(1100);
      const bannerEl = page.locator('a.pg-banner');
      await expect(bannerEl).toHaveCount(1);
      await expect(bannerEl).toContainText(new RegExp(banner, 'i'));
      expect(await bannerEl.evaluate(el => getComputedStyle(el).backgroundImage)).toBe('none');
      await expect(page.locator('.license-grid .license-card')).toHaveCount(await page.locator('.license-card').count());
      expect(await page.locator('.license-card').count()).toBeGreaterThanOrEqual(5);
      // Kartenfarben kommen aus den Tokens: im Dunkelmodus ist die Karte dunkel.
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      expect(await page.locator('.license-card').first().evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(23, 29, 43)');
      await expect(page.locator('.license-link svg')).toHaveCount(await page.locator('.license-link').count());
    });
  }
});

test.describe('Funkseiten EN: Badge und Modul-Karte', () => {
  test('UBI (EN): Badge mit Preis, Modul-Karte, drei Store-Links auf /en/app/', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en/ubi/');
    await expect(page.locator('.pg-head .pg-badge')).toBeVisible();
    await expect(page.locator('.pg-head .pg-badge')).toContainText('€');
    await expect(page.locator('.pg-cta a[data-cta-position="page-module"]')).toBeVisible();
    await expect(page.locator('main a[href="/en/app/"]')).toHaveCount(3);
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Funkseiten: Badge und Modul-Karte', () => {
  test('UBI: Badge mit Preis im Kopf (375px), Modul-Karte ohne Verlauf, drei Store-Links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/ubi/');
    await expect(page.locator('.pg-head .pg-badge')).toBeVisible();
    await expect(page.locator('.pg-head .pg-badge')).toContainText('€');
    const cta = page.locator('.pg-cta');
    await expect(cta).toHaveCount(1);
    expect(await cta.evaluate(el => getComputedStyle(el).backgroundImage)).toBe('none');
    await expect(cta.locator('h2')).toContainText('Boatpass UBI-Modul');
    await expect(cta.locator('a[data-cta-position="page-module"]')).toBeVisible();
    // Geräteweiche entscheidet nach User-Agent, nicht nach Breite: Playwright-Chromium ist „desktop",
    // die drei generischen Play-Links (Kopf, Aside, Modul) stehen deshalb auf /app/.
    await expect(page.locator('main a[href="/app/"]')).toHaveCount(3);
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
  test('SRC: Vergleichskarten und Gebührenliste; UBI: Gesamtzeile', async ({ page }) => {
    await page.goto('/src/');
    await expect(page.locator('.funk-compare-grid .pg-card')).toHaveCount(3);
    await expect(page.locator('.funk-compare-grid .pg-card--current')).toHaveCount(1);
    await expect(page.locator('.pg-fees .pg-fee')).toHaveCount(2);
    await expect(page.locator('.pg-fees')).toContainText('ca. 128 €');
    await page.goto('/ubi/');
    await expect(page.locator('.pg-fees .pg-fee')).toHaveCount(4);
    await expect(page.locator('.pg-fees .pg-fee--total')).toContainText('108,71 €');
    await expect(page.locator('.pg-cards--4 .pg-card')).toHaveCount(4);
  });
});

test.describe('PracticeBridge', () => {
  test('DE rendert den Baustein ohne Inline-Farben', async ({ page }) => {
    await page.goto('/sbf-see/');
    const de = page.locator('.pg-practice');
    await expect(de).toHaveCount(1);
    await expect(de.locator('.pg-row')).toHaveCount(3);
    await expect(de.locator('[style*="#1A1F36"], [style*="background:white"], [style*="#3366FF"], [style*="#4B5563"]')).toHaveCount(0);
    await expect(de.locator('h2.pg-h2')).toContainText('Kartenaufgaben digital meistern');
  });
  test('EN nutzt denselben Baustein', async ({ page }) => {
    await page.goto('/en/sbf-coastal/');
    const en = page.locator('.pg-practice');
    await expect(en).toHaveCount(1);
    await expect(en.locator('h2.pg-h2')).toContainText('Mastering chart tasks');
  });
});
