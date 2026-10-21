import { test, expect } from '@playwright/test';
import { expectMigrated } from './helpers/migrated';

/**
 * Premium-Politur, Runde 3a (Spec docs/superpowers/specs/2026-10-21-premium-round-3-design.md):
 * Inhaltsseiten (SBF-Kosten, Prüfungsablauf, Prüfungsfragen, Schein-Finder,
 * Fahrschulen) auf Seitenkopf, Spaltenordnung und pg-Vokabular.
 */

test.beforeEach(async ({ page }) => {
  // Plausible hängt offline; die Seite braucht es für keinen Test.
  await page.route(/plausible\.io/, r => r.abort());
});

test.describe('SBF-Kosten', () => {
  test('DE: Kopf, Leiste mit Gebühren, Tabelle mit Zeilenköpfen', async ({ page }) => {
    await expectMigrated(page, '/sbf-kosten/', { h1: /kostet/i, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('178,61 €');
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('340–400');
    await expect(page.locator('.pg-aside .pg-aside-price')).toContainText(/ab/);
    const table = page.locator('.pg-table table').first();
    expect(await table.locator('tbody th[scope="row"]').count()).toBeGreaterThanOrEqual(3);
    await page.setViewportSize({ width: 360, height: 780 });
    expect(await page.locator('.pg-table').first().evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-costs/', { h1: /cost/i, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('€178.61');
    await expect(page.locator('.pg-aside .pg-aside-price')).toContainText(/from/);
  });
});

test.describe('Prüfungsablauf', () => {
  test('DE: Kennzahlen nur aus der Seite (keine Gebühr)', async ({ page }) => {
    await expectMigrated(page, '/sbf-pruefung-ablauf/', { h1: /Prüfung/, facts: 5 });
    const facts = page.locator('.pg-aside dl.pg-facts');
    await expect(facts).toContainText('60 Min');
    await expect(facts).toContainText('16 Jahre');
    await expect(facts).not.toContainText('130,78');
    await expect(page.locator('.pg-aside .pg-aside-price')).toContainText(/ab/);
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-exam/', { h1: /exam/i, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('60 min');
  });
});
