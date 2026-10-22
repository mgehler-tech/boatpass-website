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
    // Review 3b: der Mail-Link steht in einem Absatz, nicht nackt in der Karte (sonst 2 px Abstand zum Folgetext).
    await expect(page.locator('main .pg-card--legal p > a[href^="mailto:"]')).toHaveCount(1);
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
  // Weiche Trennstriche (U+00AD) in den langen Titeln sind kein Inhalt.
  const norm = (t: string) => t.replace(/\s*→/g, '').replace(/\((?:öffnet in neuem tab|opens in new tab)\)/gi, '')
    .replace(/­/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const pages = [
    ['datenschutz', '/datenschutz/', /Datenschutz­?erklärung/],
    ['privacy', '/en/privacy/', /Privacy Policy/],
    ['nutzungsbedingungen', '/nutzungsbedingungen/', /Nutzungs­?bedingungen/],
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
  test('Lange Titel brechen bei 375 px am weichen Trennstrich, nicht mitten im Wort', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const path of ['/nutzungsbedingungen/', '/datenschutz/']) {
      await page.goto(path);
      // Zeilenkästen des Titeltexts: eine verwaiste Endsilbe („…unge | n") wäre eine schmale letzte Zeile.
      // Rechtecke je Zeile zusammenfassen (der eingefügte Trennstrich liefert ein eigenes schmales Rechteck).
      const widths = await page.locator('h1.pg-title').evaluate(el => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const lines = new Map<number, number>();
        for (const r of Array.from(range.getClientRects())) {
          if (r.width <= 0) continue;
          const key = Math.round(r.top);
          lines.set(key, (lines.get(key) ?? 0) + r.width);
        }
        return Array.from(lines.values()).map(w => Math.round(w));
      });
      expect(widths.length).toBeGreaterThanOrEqual(2);
      expect(Math.min(...widths)).toBeGreaterThan(80);
    }
  });
  test('Nutzungsbedingungen: Schlüssel-Wert-Zeilen', async ({ page }) => {
    await page.goto('/nutzungsbedingungen/');
    expect(await page.locator('main .pg-kvs .pg-kv .pg-kv-k').count()).toBeGreaterThanOrEqual(4);
    await expect(page.locator('main .pg-kv .pg-kv-v').first()).toBeVisible();
    // Review 3b: ein Hinweis direkt nach der Schlüssel-Wert-Liste bekommt Luft (vorher 0 px).
    const gap = await page.locator('main .pg-kvs + .pg-note').first().evaluate(note => {
      const list = note.previousElementSibling as HTMLElement;
      return note.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(8);
  });
});

test.describe('Über uns', () => {
  test('DE: Kopf mit Store-Button, Porträt lädt eager, Versprechen-Liste', async ({ page }) => {
    await expectMigrated(page, '/ueber-uns/', { h1: /Boatpass/, facts: 0, cta: true, variant: 'narrow' });
    await expect(page.locator('main .pg-portrait img[loading="eager"][fetchpriority="high"]')).toHaveCount(1);
    await expect(page.locator('main .pg-portrait .pg-card-title')).toContainText('Marius Gehler');
    await expect(page.locator('main .pg-checks .pg-check')).toHaveCount(5);
    expect(await page.locator('main .pg-card--legal').count()).toBeGreaterThanOrEqual(5);
    await expect(page.locator('main [style*="color:#"], main [style*="background:"]')).toHaveCount(0);
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/about/', { h1: /Boatpass/i, facts: 0, cta: true, variant: 'narrow' });
    await expect(page.locator('main .pg-portrait img[loading="eager"][fetchpriority="high"]')).toHaveCount(1);
    await expect(page.locator('main .pg-checks .pg-check')).toHaveCount(5);
  });
});

test.describe('Kontakt', () => {
  const FORM_ENDPOINT = 'https://formspree.io/f/xgoqqywe'; // aus kontakt.astro / contact.astro
  test('DE: schmale Spalte, Formular unverändert, Erfolgsbox als Hinweis', async ({ page }) => {
    await expectMigrated(page, '/kontakt/', { h1: /Schreib uns/, facts: 0, cta: false, variant: 'narrow' });
    await expect(page.locator('#kontakt-form input#name')).toBeVisible();
    await expect(page.locator('#kontakt-form input#email')).toBeVisible();
    await expect(page.locator('#kontakt-form textarea#message')).toBeVisible();
    await expect(page.locator('#kontakt-form #submit-btn')).toBeVisible();
    await expect(page.locator('main .pg-faq .pg-faq-item')).toHaveCount(4);
    await expect(page.locator('main [style*="color:#"], main [style*="background:#"]')).toHaveCount(0);
    // Absenden: Endpunkt abfangen, Erfolgsbox erscheint mit Hinweis-Klasse (Review Focus 1).
    let posted = false;
    await page.route(FORM_ENDPOINT, async route => {
      posted = route.request().method() === 'POST';
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.fill('#name', 'Test Person');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'Nur ein Test.');
    await page.click('#submit-btn');
    await expect(page.locator('#success-msg')).toBeVisible();
    expect(posted).toBe(true);
    await expect(page.locator('#success-msg')).toHaveClass(/pg-notice--ok/);
    await expect(page.locator('#kontakt-form')).toBeHidden();
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/contact/', { h1: /Get in touch|Contact|Write/i, facts: 0, cta: false, variant: 'narrow' });
    await expect(page.locator('#contact-form #submit-btn')).toBeVisible();
    await expect(page.locator('main .pg-faq .pg-faq-item')).toHaveCount(4);
    await expect(page.locator('#error-msg')).toHaveClass(/pg-notice--error/);
  });
});

test.describe('FAQ', () => {
  test('DE: schmale Spalte, Kategorie-Chips, Akkordeon mit Chevron ohne Skript', async ({ page }) => {
    await expectMigrated(page, '/faq/', { h1: /Häufige Fragen/, facts: 0, cta: false, variant: 'narrow' });
    const sections = await page.locator('main section[id]').count();
    expect(sections).toBeGreaterThanOrEqual(3);
    await expect(page.locator('main nav.pg-chips a.pg-chip')).toHaveCount(sections);
    const chip = (await page.locator('main nav.pg-chips a.pg-chip').first().boundingBox())!;
    expect(chip.height).toBeGreaterThanOrEqual(44);
    const first = page.locator('main details.pg-faq-item').first();
    await expect(first).not.toHaveAttribute('open', '');
    expect(await first.locator('summary.pg-faq-q svg').evaluate(el => getComputedStyle(el).transform)).toBe('none');
    await first.locator('summary.pg-faq-q').click();
    await expect(first).toHaveAttribute('open', '');
    await expect(first.locator('.pg-faq-a')).toBeVisible();
    expect(await first.locator('summary.pg-faq-q svg').evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
    await expect(page.locator('main [style*="color:#"]')).toHaveCount(0);
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/faq/', { h1: /Frequently Asked Questions/, facts: 0, cta: false, variant: 'narrow' });
    const sections = await page.locator('main section[id]').count();
    await expect(page.locator('main nav.pg-chips a.pg-chip')).toHaveCount(sections);
    await page.locator('main details.pg-faq-item').first().locator('summary').click();
    await expect(page.locator('main details.pg-faq-item').first()).toHaveAttribute('open', '');
  });
});
