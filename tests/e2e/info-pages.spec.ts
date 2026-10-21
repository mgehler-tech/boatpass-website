import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expectMigrated } from './helpers/migrated';

/**
 * Premium-Politur, Runde 3b (Spec docs/superpowers/specs/2026-10-21-premium-round-3-design.md,
 * Plan docs/superpowers/plans/2026-10-21-premium-round-3b-info-pages.md):
 * Infoseiten (Impressum, Datenschutz, Nutzungsbedingungen, Über uns, Kontakt) und FAQ
 * auf Seitenkopf, schmale Spalte und pg-Vokabular.
 */

test.beforeEach(async ({ page }) => {
  // Plausible hängt offline; die Seite braucht es für keinen Test.
  await page.route(/plausible\.io/, r => r.abort());
});

test.describe('Impressum', () => {
  test('DE: schmale Spalte, Legal-Karten, Mailadresse als Link', async ({ page }) => {
    await expectMigrated(page, '/impressum/', { h1: /Impressum/, facts: 0, cta: false, variant: 'narrow' });
    expect(await page.locator('main .pg-card--legal').count()).toBeGreaterThanOrEqual(5);
    await expect(page.locator('main a[href^="mailto:"]')).toHaveCount(1);
    await expect(page.locator('main .pg-card--legal .pg-card-label').first()).toBeVisible();
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/legal/', { h1: /Legal|Imprint/, facts: 0, cta: false, variant: 'narrow' });
    expect(await page.locator('main .pg-card--legal').count()).toBeGreaterThanOrEqual(5);
    await expect(page.locator('main a[href^="mailto:"]')).toHaveCount(1);
  });
});

test.describe('Rechtstexte', () => {
  // Sichtbarer Text vor der Umstellung (tests/e2e/fixtures/legal-text, einmalig gesichert);
  // Pfeilzeichen wurden zu Icons, Groß-/Kleinschreibung hängt an text-transform.
  // rootDir ist das testDir (tests/e2e).
  const fixture = (slug: string) => readFileSync(join(test.info().config.rootDir, 'fixtures/legal-text', `${slug}.txt`), 'utf8');
  // PageLink external ergänzt einen Screenreader-Hinweis; der ist kein Inhalt des Rechtstexts.
  const norm = (t: string) => t.replace(/\s*→/g, '').replace(/\((?:öffnet in neuem tab|opens in new tab)\)/gi, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
  const pages = [
    ['datenschutz', '/datenschutz/', /Datenschutzerklärung/],
    ['privacy', '/en/privacy/', /Privacy Policy/],
    ['nutzungsbedingungen', '/nutzungsbedingungen/', /Nutzungsbedingungen/],
    ['terms', '/en/terms/', /Terms of Use/],
  ] as const;
  for (const [slug, path, h1] of pages) {
    test(`${slug}: schmale Spalte, Legal-Karten, Text wörtlich unverändert`, async ({ page }) => {
      // arrows: false – „Mehr → Fortschritt zurücksetzen" ist ein Menüpfad im Rechtstext, kein Schmuckpfeil.
      await expectMigrated(page, path, { h1, facts: 0, cta: false, variant: 'narrow', arrows: false });
      expect(await page.locator('main .pg-card--legal').count()).toBeGreaterThanOrEqual(10);
      await expect(page.locator('main [style*="color:#"], main [style*="background:"]')).toHaveCount(0);
      expect(norm(await page.locator('main').innerText())).toBe(norm(fixture(slug)));
    });
  }
  test('Datenschutz: Trenner, Meta-Boxen und Aufzählungen auf Klassen', async ({ page }) => {
    await page.goto('/datenschutz/');
    expect(await page.locator('main .pg-divider .pg-divider-label').count()).toBeGreaterThanOrEqual(2);
    expect(await page.locator('main .pg-meta').count()).toBeGreaterThanOrEqual(5);
    expect(await page.locator('main .pg-bullet').count()).toBeGreaterThanOrEqual(8);
    await expect(page.locator('main a.pg-link[href*="plausible.io"][target="_blank"] svg')).toHaveCount(1);
  });
  test('Nutzungsbedingungen: Schlüssel-Wert-Zeilen', async ({ page }) => {
    await page.goto('/nutzungsbedingungen/');
    expect(await page.locator('main .pg-kvs .pg-kv .pg-kv-k').count()).toBeGreaterThanOrEqual(4);
    await expect(page.locator('main .pg-kv .pg-kv-v').first()).toBeVisible();
  });
});
