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
