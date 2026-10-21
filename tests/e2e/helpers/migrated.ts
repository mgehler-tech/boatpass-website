import { expect, type Page } from '@playwright/test';

/**
 * Gemeinsame Prüfungen für Seiten, die auf den Rahmen der Premium-Politur
 * umgestellt sind (PageHead, PageLayout, pg-Vokabular; Spec Runde 2, 5.3 und
 * Runde 3). Genutzt von licence-pages, content-pages und info-pages.
 */

/** Die alten Inline-Farben der Inhaltsseiten (Spec-Selektoren); auf migrierten Seiten
 * darf keine mehr in main stehen. Die eingebetteten Bausteine CatalogSources und
 * BoatSchoolFinder bleiben vorerst unangetastet und tragen noch #4B5563/#656B78,
 * deshalb nur diese drei. */
export const noInline = 'main [style*="#1A1F36"], main [style*="background:white"], main [style*="#3366FF"]';

export type MigratedOptions = {
  h1: RegExp;
  /** Anzahl der Paare in der Fakten-Karte; 0 = keine Seitenleiste. */
  facts: number;
  /** Store-Button im Kopf erwartet (Standard ja). */
  cta?: boolean;
  /** Spaltenordnung; Standard: read bei Fakten, sonst wide. */
  variant?: 'read' | 'wide' | 'narrow';
  /** false: Pfeilzeichen im Fließtext erlaubt (Rechtstexte nennen Menüpfade wie „Mehr → Fortschritt"); Links bleiben pfeilfrei. */
  arrows?: boolean;
};

/** Rauchtest: Kopf, Spaltenordnung, keine Inline-Farben/Pfeile, Conversion-Hook, 360 px. */
export async function expectMigrated(page: Page, path: string, opts: MigratedOptions) {
  const variant = opts.variant ?? (opts.facts > 0 ? 'read' : 'wide');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path);
  const title = page.locator('h1.pg-title');
  await expect(title).toContainText(opts.h1);
  expect(await title.evaluate(el => getComputedStyle(el).fontFamily)).toMatch(/Archivo/);
  const logo = (await page.locator('.logo-link').boundingBox())!;
  expect(Math.abs((await title.boundingBox())!.x - logo.x)).toBeLessThanOrEqual(1);
  await expect(page.locator(`.pg-layout--${variant}`)).toHaveCount(1);
  if (opts.facts > 0) {
    await expect(page.locator('.pg-aside dl.pg-facts dt')).toHaveCount(opts.facts);
  } else {
    await expect(page.locator('.pg-aside')).toHaveCount(0);
  }
  await expect(page.locator(noInline)).toHaveCount(0);
  if (opts.arrows !== false) {
    expect(await page.locator('main').innerText()).not.toMatch(/[→▶▼←]/);
  } else {
    await expect(page.locator('main a', { hasText: /[→▶▼←]/ })).toHaveCount(0);
  }
  if (opts.cta !== false) {
    // Die Geräteweiche schreibt generische Play-Links am Desktop auf die Auswahlseite um: /app/ bzw. /en/app/.
    await expect(page.locator('main a[href="/app/"], main a[href="/en/app/"]').first()).toBeVisible();
  }
  await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  await expect(page.locator('.pg-section .content-section-title, .related-links, .exam-facts-grid')).toHaveCount(0);
  await page.setViewportSize({ width: 360, height: 780 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
}
