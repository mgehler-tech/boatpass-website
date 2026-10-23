import { test, expect } from '@playwright/test';
import { expectMigrated } from './helpers/migrated';
import { TOPICS, SHEETS, CATALOGS, topicUrl, practiceUrl, type CatalogKey } from '../../src/data/catalog';

/**
 * Prüfungsfragen-Hubs (SEO-Audit 23.10.2026): Themenseiten mit den amtlichen
 * Fragen SBF Binnen/See, Basisfragen-Seite und Fragebogen im Browser, DE und EN.
 * Erklärungen nur als Anriss, Merkhilfen nur in der App.
 */

test.beforeEach(async ({ page }) => {
  // Plausible hängt offline; die Seite braucht es für keinen Test.
  await page.route(/plausible\.io/, r => r.abort());
});

const lichter = TOPICS.binnen.find(t => t.key === 'lichter')!;
const seeLichter = TOPICS.see.find(t => t.key === 'lichter')!;

test.describe('Themenseiten', () => {
  test('alle Themenseiten DE und EN antworten mit allen Fragen ihres Themas', async ({ request }) => {
    for (const catalog of ['binnen', 'see'] as const) {
      for (const topic of TOPICS[catalog]) {
        for (const lang of ['de', 'en'] as const) {
          const res = await request.get(topicUrl(catalog, topic, lang));
          expect(res.status(), topicUrl(catalog, topic, lang)).toBe(200);
          const html = await res.text();
          expect(html.match(/<article class="cq"/g)?.length, topicUrl(catalog, topic, lang)).toBe(topic.numbers.length);
        }
      }
    }
  });

  test('DE: Kopf, Fakten, Fragen mit markierter Antwort A und Anriss der Erklärung', async ({ page }) => {
    await expectMigrated(page, topicUrl('binnen', lichter, 'de'), { h1: /Lichter & Sichtzeichen/, facts: 4 });
    await page.setViewportSize({ width: 1440, height: 900 });
    const card = page.locator('#frage-120');
    await expect(card.locator('.cq-q')).toHaveText('Was bedeuten diese Lichter?');
    await expect(card.locator('.cq-a').first()).toHaveClass(/is-correct/);
    await expect(card.locator('.cq-a.is-correct')).toHaveCount(1);
    await expect(card.locator('.cq-tag')).toHaveText('Richtig');
    await expect(card.locator('.cq-figs img')).toHaveCount(1);
    await expect(card.locator('.cq-figs img')).toHaveAttribute('alt', 'Abbildung zu Frage 120');
    // Erklärung: nur ein Satz; der verschwommene Rest sind Platzhalter ohne Text.
    await expect(card.locator('.cq-x-label')).toHaveText('Erklärung von Boatpass');
    expect((await card.locator('.cq-x-text').innerText()).length).toBeLessThanOrEqual(202);
    await expect(card.locator('.cq-blur')).toHaveText('');
    await expect(card.locator('.cq-blur')).toHaveAttribute('aria-hidden', 'true');
    await expect(card.locator('.cq-unlock')).toHaveAttribute('href', '/app/');
    await expect(card.locator('.cq-unlock')).toContainText('Merkhilfe in der App');
    // Themennavigation: alle Themen, aktuelle Seite markiert, Basisfragen und Fragebogen verlinkt.
    const nav = page.locator('.cq-topics').first();
    await expect(nav.locator('a')).toHaveCount(TOPICS.binnen.length + 2);
    await expect(nav.locator('a[aria-current="page"]')).toContainText('Lichter & Sichtzeichen');
    await expect(nav.locator(`a[href="${CATALOGS.basis.hub.de}"]`)).toHaveCount(1);
    await expect(nav.locator(`a[href="${practiceUrl('binnen', 'de')}"]`)).toHaveCount(1);
  });

  test('Quellen und Stand, Schema, hreflang', async ({ page }) => {
    await page.goto(topicUrl('binnen', lichter, 'de'));
    const sources = page.locator('#quellen');
    await expect(sources.locator('h2')).toHaveText('Quellen und Stand');
    await expect(sources.locator('a[href*="elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-Binnen/Fragenkatalog-Binnen-node.html"]')).toHaveCount(1);
    await expect(sources).toContainText('gültig seit 01.08.2023');
    await expect(sources).toContainText('Antwort a immer die richtige');
    await expect(sources).toContainText('teilweise von Boatpass nachgezeichnet');
    await expect(sources).toContainText('© Boatpass');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schemas.some(s => s.includes('"BreadcrumbList"'))).toBe(true);
    expect(schemas.some(s => /"FAQPage"|"Quiz"/.test(s))).toBe(false);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://boatpass.de${topicUrl('binnen', lichter, 'en')}`);
  });

  test('keine vollständigen Erklärungen und keine Merkhilfen im HTML', async ({ request }) => {
    const html = await (await request.get(topicUrl('binnen', lichter, 'de'))).text();
    // Zweiter Satz der App-Erklärung und die Merkhilfe zu Frage 120 stehen nur in der App.
    expect(html).toContain('zusätzlich zum vorderen Topplicht ein zweites Topplicht auf dem Achterschiff.');
    expect(html).not.toContain('Das hintere Licht steht höher als das vordere');
    expect(html).not.toContain('zweites, höheres Topplicht achtern');
    const data = await (await request.get('/catalog-data/binnen-de.json')).text();
    expect(data).not.toContain('Das hintere Licht steht höher als das vordere');
  });

  test('Selbst testen: Antworten gemischt, falsche Wahl rot, richtige grün', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(topicUrl('binnen', lichter, 'de'));
    const card = page.locator('#frage-120');
    await expect(card.locator('.cq-tag')).toBeVisible();
    await page.locator('[data-cq-toggle]').click();
    await expect(page.locator('[data-cq-toggle]')).toHaveAttribute('aria-pressed', 'true');
    await expect(card.locator('.cq-tag')).toBeHidden();
    await expect(card.locator('.cq-x')).toBeHidden();
    await card.locator('.cq-a:not([data-correct])').first().click();
    await expect(card.locator('.cq-a.is-chosen-wrong')).toHaveCount(1);
    await expect(card.locator('.cq-verdict')).toHaveText(/Leider falsch/);
    await expect(card.locator('.cq-tag')).toBeVisible();
    await expect(card.locator('.cq-x')).toBeVisible();
    // Zurück in die Leseansicht: Reihenfolge wieder amtlich, A richtig.
    await page.locator('[data-cq-toggle]').click();
    await expect(card.locator('.cq-a').first().locator('.cq-key')).toHaveText('A');
    await expect(card.locator('.cq-a.is-chosen-wrong')).toHaveCount(0);
  });

  test('EN parity: inoffizielle Übersetzung gekennzeichnet', async ({ page }) => {
    await expectMigrated(page, topicUrl('see', seeLichter, 'en'), { h1: /Lights & shapes/, facts: 4 });
    const card = page.locator('#question-91');
    await expect(card.locator('.cq-tag')).toHaveText('Correct');
    await expect(card.locator('.cq-unlock')).toHaveAttribute('href', '/en/app/');
    await expect(page.locator('#sources')).toContainText('unofficial translation');
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', `https://boatpass.de${topicUrl('see', seeLichter, 'de')}`);
  });
});

test.describe('Basisfragen', () => {
  for (const lang of ['de', 'en'] as const) {
    test(`${lang}: alle 72 Fragen in fünf Abschnitten`, async ({ page }) => {
      await expectMigrated(page, CATALOGS.basis.hub[lang], { h1: lang === 'de' ? /Basisfragen/ : /basic questions/, facts: 4 });
      await expect(page.locator('article.cq')).toHaveCount(72);
      for (const t of TOPICS.basis) {
        await expect(page.locator(`[id="${t.slug[lang]}"] h2`)).toHaveText(t.title[lang]);
      }
      await expect(page.locator(`a[href="${CATALOGS.binnen.hub[lang]}"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="${CATALOGS.see.hub[lang]}"]`).first()).toBeVisible();
    });
  }
});

test.describe('Übersichtsseiten', () => {
  const hubs: [CatalogKey & ('binnen' | 'see'), 'de' | 'en', string][] = [
    ['binnen', 'de', '#themen'], ['see', 'de', '#themen'], ['binnen', 'en', '#topics'], ['see', 'en', '#topics'],
  ];
  for (const [catalog, lang, id] of hubs) {
    test(`${catalog} ${lang}: Themenblock statt App-Kategorien, Herausgeber BMDV`, async ({ page }) => {
      await page.goto(CATALOGS[catalog].hub[lang]);
      const block = page.locator(id);
      await expect(block.locator('a.cq-hub-row')).toHaveCount(TOPICS[catalog].length + 1);
      await expect(block.locator(`a[href="${practiceUrl(catalog, lang)}"]`)).toBeVisible();
      for (const t of TOPICS[catalog]) {
        await expect(block.locator(`a[href="${topicUrl(catalog, t, lang)}"]`)).toHaveCount(1);
      }
      const main = await page.locator('main').innerText();
      expect(main).not.toMatch(/DSV|DMYV/);
      expect(main).toContain('BMDV');
      await expect(page.getByRole('heading', { name: /Lernen nach Kategorie|Learn by category/ })).toHaveCount(0);
    });
  }
});

test.describe('Fragebogen', () => {
  test('DE Binnen: amtlicher Bogen 1 mit allen richtigen Antworten ist bestanden', async ({ page }) => {
    await expectMigrated(page, practiceUrl('binnen', 'de'), { h1: /SBF Binnen Fragebogen/, facts: 5, cta: false });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.locator('[data-pt-setup] select').selectOption('1');
    await page.locator('[data-pt-setup] button[type="submit"]').click();
    const qs = page.locator('fieldset.pt-q');
    await expect(qs).toHaveCount(30);
    const nums = (await qs.evaluateAll(els => els.map(e => Number((e as HTMLElement).dataset.n))));
    expect(nums).toEqual([...SHEETS.binnenMotor[0]].sort((a, b) => a - b));
    await expect(page.locator('[data-pt-count]')).toHaveText('0 von 30 beantwortet');
    for (const n of nums) await page.locator(`input[name="q${n}"][value="0"]`).check({ force: true });
    await expect(page.locator('[data-pt-count]')).toHaveText('30 von 30 beantwortet');
    await page.locator('.pt-submit').click();
    const result = page.locator('[data-pt-result]');
    await expect(result).toBeVisible();
    await expect(result.locator('[data-pt-verdict]')).toHaveText('Bestanden');
    await expect(result).toContainText('Basisfragen: 7 von 7 richtig (nötig: 5)');
    await expect(result).toContainText('Spezifische Fragen Binnen: 23 von 23 richtig (nötig: 18)');
    await expect(page.locator('.cq-more')).toHaveCount(0);
  });

  test('DE Binnen: mit Ergänzungsbogen Segeln 37 Fragen, falsche Antworten verlinken die Frage', async ({ page }) => {
    await page.goto(practiceUrl('binnen', 'de'));
    await page.locator('[data-pt-setup] select').selectOption('3');
    await page.locator('[data-pt-setup] input[name="segel"]').check();
    await page.locator('[data-pt-setup] button[type="submit"]').click();
    await expect(page.locator('fieldset.pt-q')).toHaveCount(37);
    await expect(page.locator('.pt-part')).toHaveText(['Basisfragen', 'Spezifische Fragen Binnen', 'Ergänzungsbogen Segeln']);
    page.on('dialog', d => d.accept());
    await page.locator('.pt-submit').click();
    await expect(page.locator('[data-pt-verdict]')).toHaveText('Noch nicht bestanden');
    await expect(page.locator('[data-pt-result]')).toContainText('Ergänzungsbogen Segeln: 0 von 7 richtig (nötig: 5)');
    await expect(page.locator('.cq-more a')).toHaveCount(37);
    await expect(page.locator('fieldset[data-n="6"] .cq-more a')).toHaveAttribute('href', '/sbf-basisfragen/#frage-6');
  });

  test('EN See: Zufallsbogen mit 7 Basis- und 23 spezifischen Fragen', async ({ page }) => {
    await expectMigrated(page, practiceUrl('see', 'en'), { h1: /SBF Coastal practice test/, facts: 5, cta: false });
    await page.locator('[data-pt-setup] button[type="submit"]').click();
    const nums = await page.locator('fieldset.pt-q').evaluateAll(els => els.map(e => Number((e as HTMLElement).dataset.n)));
    expect(nums).toHaveLength(30);
    expect(nums.filter(n => n <= 72)).toHaveLength(7);
    expect(nums.filter(n => n > 72 && n <= 285)).toHaveLength(23);
    await expect(page.locator('.pt-part')).toHaveText(['Basic questions', 'Specific questions Coastal']);
    await expect(page.locator('#sources a[href*="Fragenverteilung-See.pdf"]')).toHaveCount(1);
  });
});

test('Sitemap: Themenseiten drin, Fragebogen-Daten nicht', async ({ request }) => {
  const index = await (await request.get('/sitemap-0.xml')).text();
  expect(index).toContain(`https://boatpass.de${topicUrl('binnen', lichter, 'de')}`);
  expect(index).toContain(`https://boatpass.de${topicUrl('see', seeLichter, 'en')}`);
  expect(index).toContain('https://boatpass.de/sbf-basisfragen/');
  expect(index).toContain(`https://boatpass.de${practiceUrl('see', 'de')}`);
  expect(index).not.toContain('catalog-data');
});
