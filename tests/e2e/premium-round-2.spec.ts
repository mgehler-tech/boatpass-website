import { test, expect } from '@playwright/test';

/**
 * Premium-Politur, Runde 2a (Spec docs/superpowers/specs/2026-10-18-premium-round-2-design.md,
 * Abschnitte 5.1 und 5.2): Lernweg kompakt, Preisliste mit Paket-Karten und
 * verlinkten Zeilen.
 */

test.beforeEach(async ({ page }) => {
  // Plausible hängt offline; die Seite braucht es für keinen Test.
  await page.route(/plausible\.io/, r => r.abort());
});

test.describe('Lernweg kompakt', () => {
  for (const vp of [{ w: 1440, h: 900, max: 2100 }, { w: 1280, h: 620, max: 1750 }]) {
    test(`unter ${vp.max}px bei ${vp.w}x${vp.h}, kein Kicker, alle Etappen werden aktiv`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      await expect(page.locator('.hj-kicker')).toHaveCount(0);
      await expect(page.locator('.hj-marker')).toHaveCount(4);
      expect((await page.locator('[data-journey]').boundingBox())!.height).toBeLessThan(vp.max);
      for (let i = 0; i < 4; i++) {
        const step = page.locator(`[data-journey-step="${i}"]`);
        await step.evaluate(el => el.scrollIntoView({ block: 'center' }));
        await expect(step).toHaveClass(/is-active/);
      }
    });
  }
  test('Kicker auch am Handy weg, Screenshot je Etappe bleibt', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('.hj-kicker')).toHaveCount(0);
    await expect(page.locator('.hj-shot')).toHaveCount(4);
  });
});

test.describe('Preisliste: Paket-Karten', () => {
  test('je Gruppe eine Karte rechts neben den Zeilen, drei Store-Links bleiben', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const cards = page.locator('#pricing .hp-bundle');
    await expect(cards).toHaveCount(2);
    await expect(page.locator('#pricing .hp-row--bundle')).toHaveCount(0);
    await expect(cards.nth(0)).toContainText('Binnen + See');
    await expect(cards.nth(0)).toContainText(/2 Kataloge/);
    await expect(cards.nth(1)).toContainText(/3 Kataloge/);
    await expect(cards.nth(0).locator('s.h-num')).toHaveCount(2); // Streichpreis je Store im DOM
    await expect(cards.nth(0).locator('a[data-cta-position="pricing-bundle"].h-btn')).toHaveCount(1);
    // Geräteweiche (Desktop-UA): die drei generischen Play-Links stehen auf /app/.
    await expect(page.locator('#pricing a[href="/app/"]')).toHaveCount(3);
    // Maße erst nach dem Einblenden (data-reveal hebt Elemente 20 px an, bis sie im Bild sind).
    await cards.nth(0).scrollIntoViewIfNeeded();
    await expect(cards.nth(0)).toHaveCSS('opacity', '1');
    const rows = (await page.locator('#pricing .hp-group').first().locator('.hp-rows').boundingBox())!;
    const card = (await cards.nth(0).boundingBox())!;
    expect(card.x).toBeGreaterThanOrEqual(rows.x + rows.width);
    expect(Math.abs(card.y - rows.y)).toBeLessThan(2);
  });
  test('am Handy unter den Zeilen, iOS zeigt eine Ersparnis-Zeile', async ({ page, browser }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const rows = (await page.locator('#pricing .hp-group').first().locator('.hp-rows').boundingBox())!;
    const card = (await page.locator('#pricing .hp-bundle').first().boundingBox())!;
    expect(card.y).toBeGreaterThanOrEqual(rows.y + rows.height);
    const ios = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 },
    });
    const p2 = await ios.newPage();
    await p2.route(/plausible\.io/, r => r.abort());
    await p2.goto('/');
    await expect(p2.locator('html')).toHaveAttribute('data-platform', 'ios');
    await expect(p2.locator('#pricing .hp-bundle').first().locator('.hp-bundle-save span:visible')).toHaveCount(1);
    await ios.close();
  });
  test('EN parity', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#pricing .hp-bundle').nth(0)).toContainText(/2 catalogues/);
  });
});
