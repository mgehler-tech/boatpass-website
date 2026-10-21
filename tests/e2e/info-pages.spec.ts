import { test, expect } from '@playwright/test';
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
