import { test, expect } from '@playwright/test';
import { expectMigrated } from './helpers/migrated';
import { cities } from '../../src/data/boat-schools';

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

test.describe('Prüfungsfragen', () => {
  test('Binnen DE: vier Kennzahlen aus der Seite, keine Gebühr', async ({ page }) => {
    await expectMigrated(page, '/sbf-binnen-pruefungsfragen/', { h1: /SBF Binnen Fragen/, facts: 4 });
    const facts = page.locator('.pg-aside dl.pg-facts');
    await expect(facts).toContainText('253');
    await expect(facts).not.toContainText('130,78');
  });
  test('See DE: fünf Kennzahlen inkl. Navigationsaufgabe', async ({ page }) => {
    await expectMigrated(page, '/sbf-see-pruefungsfragen/', { h1: /SBF See Fragen/, facts: 5 });
    const facts = page.locator('.pg-aside dl.pg-facts');
    await expect(facts).toContainText('285');
    await expect(facts).toContainText('9 Fragen');
  });
  test('Inland EN', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-inland-exam-questions/', { h1: /SBF Inland questions/, facts: 4 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('253');
  });
  test('Coastal EN', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-coastal-exam-questions/', { h1: /SBF Coastal questions/, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('9 questions');
  });
});

test.describe('Schein-Finder', () => {
  test('DE: schmale Spalte, Konfigurator bedienbar bis zum Ergebnis, Tabelle mit Zeilenköpfen', async ({ page }) => {
    await expectMigrated(page, '/tools/welcher-bootsfuehrerschein/', { h1: /Bootsführerschein/, facts: 0, cta: false, variant: 'narrow' });
    await page.setViewportSize({ width: 1440, height: 900 });
    const col = (await page.locator('.pg-layout--narrow .pg-main').boundingBox())!;
    expect(col.width).toBeLessThanOrEqual(760);
    await expect(page.locator('#cfg .cfg-opt').first()).toBeVisible();
    // Durchklicken wie in conversion-journeys; danach darf das Ergebnis weder Pfeile noch Inline-Farben tragen.
    await page.locator('.cfg-opt', { hasText: 'Küste (Nord- & Ostsee)' }).click();
    await page.locator('.cfg-opt', { hasText: 'Verbrenner über 15 PS' }).click();
    await page.locator('.cfg-opt', { hasText: 'Ja' }).click();
    await page.locator('.cfg-opt', { hasText: 'Küstennah' }).click();
    await expect(page.locator('#cfg-result')).toBeVisible();
    expect(await page.locator('main').innerText()).not.toMatch(/[→▶▼←💡]/);
    await expect(page.locator('#cfg-result [style*="#1A1F36"], #cfg-result [style*="#3366FF"], #cfg-result [style*="linear-gradient"]')).toHaveCount(0);
    expect(await page.locator('.pg-table table tbody th[scope="row"]').count()).toBeGreaterThanOrEqual(4);
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/tools/which-boating-license/', { h1: /licen/i, facts: 0, cta: false, variant: 'narrow' });
    await expect(page.locator('#cfg .cfg-opt').first()).toBeVisible();
  });
});

test.describe('Fahrschulen', () => {
  const berlin = cities.find(c => c.slug === 'berlin')!;   // inland
  const hamburg = cities.find(c => c.slug === 'hamburg')!; // both

  test('Übersicht DE: breite Spalte, Info-Kasten mit Icon, eine Karte je Stadt', async ({ page }) => {
    await expectMigrated(page, '/bootsfahrschulen/', { h1: /Bootsfahrschule/, facts: 0, cta: false });
    await expect(page.locator('.city-grid .city-card')).toHaveCount(cities.length);
    await expect(page.locator('.pg-answer--icon .pg-row-icon svg')).toHaveCount(1);
    await expect(page.locator('.city-card .city-link svg')).toHaveCount(cities.length);
  });
  test('Übersicht EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/boat-schools/', { h1: /Boat Schools/, facts: 0, cta: false });
    await expect(page.locator('.city-grid .city-card')).toHaveCount(cities.length);
  });
  test('Berlin (Binnen): Kennzahlen aus den Stadtdaten, Schulkarten, Karten-Banner', async ({ page }) => {
    await expectMigrated(page, `/bootsfahrschulen/${berlin.slug}/`, { h1: /Berlin/, facts: 4 });
    const facts = page.locator('.pg-aside dl.pg-facts');
    await expect(facts).toContainText(berlin.state);
    await expect(facts).toContainText('SBF Binnen');
    await expect(facts).not.toContainText('SBF See');
    await expect(facts).toContainText(`${berlin.schools.length}`);
    await expect(page.locator('.pg-aside .pg-aside-price')).toContainText(/ab/);
    await expect(page.locator('.pg-school')).toHaveCount(berlin.schools.length);
    await expect(page.locator('.pg-school .pg-pill')).toHaveCount(berlin.schools.reduce((n, s) => n + s.licenses.length, 0));
    await expect(page.locator('a.pg-banner[href*="google"]')).toHaveCount(1);
    // Schulkarten-Links bleiben 44 px hohe Tap-Flächen (WCAG 2.5.5, frühere Korrektur).
    const link = (await page.locator('.pg-school a').first().boundingBox())!;
    expect(link.height).toBeGreaterThanOrEqual(44);
  });
  test('Hamburg (beides): Schein-Paar nennt beide Scheine', async ({ page }) => {
    await expectMigrated(page, `/bootsfahrschulen/${hamburg.slug}/`, { h1: /Hamburg/, facts: 4 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('SBF Binnen & SBF See');
    await expect(page.locator('.pg-school')).toHaveCount(hamburg.schools.length);
  });
  test('Stadt EN parity', async ({ page }) => {
    await expectMigrated(page, `/en/boat-schools/${hamburg.slug}/`, { h1: /Hamburg/, facts: 4 });
    const facts = page.locator('.pg-aside dl.pg-facts');
    await expect(facts).toContainText('SBF Inland');
    await expect(facts).toContainText('SBF Coastal');
    await expect(page.locator('.pg-aside .pg-aside-price')).toContainText(/from/);
    await expect(page.locator('.pg-school')).toHaveCount(hamburg.schools.length);
  });
});
