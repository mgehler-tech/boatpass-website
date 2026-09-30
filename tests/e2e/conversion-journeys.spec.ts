import { test, expect } from '@playwright/test';

/**
 * Guards the business-critical paths from site entry to the Google Play CTA.
 * A broken link or missing CTA here has direct revenue impact, so these
 * journeys are covered independently of the Lighthouse SEO checks.
 */
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.boatpass.app';

test.describe('Homepage → Play Store CTA', () => {
  test('hero and closing CTAs link to the app listing', async ({ page }) => {
    await page.goto('/');
    const heroCta = page.locator('#hero-cta-play');
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveAttribute('href', PLAY_STORE_URL);
    await expect(heroCta).toHaveAttribute('target', '_blank');

    const finalCta = page.locator('#final-cta-play');
    await expect(finalCta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Homepage quiz → Result → Play Store CTA', () => {
  test('all ten app questions can be answered and end in a result with a working CTA', async ({ page }) => {
    await page.goto('/');
    const quiz = page.locator('[data-quiz]');
    await quiz.scrollIntoViewIfNeeded();
    await expect(quiz.locator('[data-item]')).toHaveCount(10);

    for (let i = 0; i < 10; i++) {
      const item = quiz.locator(`[data-item="${i}"]`);
      await expect(item).toBeVisible();
      await expect(quiz.locator('[data-counter-text]')).toHaveText(`Frage ${i + 1} von 10`);
      const correct = Number(await item.getAttribute('data-correct'));
      await item.locator('[data-answer]').nth(correct).click();
      await expect(item.locator('[data-verdict]')).toHaveText('Richtig!');
      await expect(item.locator('.hq-mnemo')).toBeVisible();
      await item.locator('[data-next]').click();
    }

    const result = quiz.locator('[data-result]');
    await expect(result).toBeVisible();
    await expect(result.locator('[data-result-score]')).toHaveText('10 von 10 richtig');
    await expect(result.locator('a[href*="play.google.com"]')).toHaveAttribute('href', PLAY_STORE_URL);

    await result.locator('[data-restart]').click();
    await expect(quiz.locator('[data-item="0"]')).toBeVisible();
    await expect(quiz.locator('.hq-seg.is-right, .hq-seg.is-wrong')).toHaveCount(0);
  });
});

test.describe('Homepage → Pricing → Play Store CTA', () => {
  test('pricing section CTAs link to the app listing', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a', { hasText: 'Preise' }).first().click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();

    const ctaLinks = page.locator('#pricing a[href*="play.google.com"]');
    await expect(ctaLinks.first()).toHaveAttribute('href', PLAY_STORE_URL);
    expect(await ctaLinks.count()).toBeGreaterThan(0);
  });
});

test.describe('Navigation → SBF Binnen → Play Store CTA', () => {
  test('mega menu leads to SBF Binnen with a working CTA', async ({ page }) => {
    await page.goto('/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/sbf-binnen/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sbf-binnen\/$/);

    const cta = page.locator('a[href*="play.google.com"]').first();
    await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Navigation → SBF See → Play Store CTA', () => {
  test('mega menu leads to SBF See with a working CTA', async ({ page }) => {
    await page.goto('/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/sbf-see/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sbf-see\/$/);

    const cta = page.locator('a[href*="play.google.com"]').first();
    await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('License Finder full flow → Recommendation → Next step', () => {
  test('completing the configurator yields a recommendation with a working next step', async ({ page }) => {
    await page.goto('/tools/welcher-bootsfuehrerschein/');

    await page.locator('.cfg-opt', { hasText: 'Küste (Nord- & Ostsee)' }).click();
    await page.locator('.cfg-opt', { hasText: 'Verbrenner über 15 PS' }).click();
    await page.locator('.cfg-opt', { hasText: 'Ja' }).click();
    await page.locator('.cfg-opt', { hasText: 'Küstennah' }).click();

    const result = page.locator('#cfg-result');
    await expect(result).toBeVisible();

    const recommendationLinks = result.locator('a.res-card');
    await expect(recommendationLinks).toHaveCount(2);

    // The Play Store CTA inside the result must also be correct.
    const playCta = result.locator('a[href*="play.google.com"]');
    await expect(playCta).toHaveAttribute('href', PLAY_STORE_URL);

    // Follow the "next step" link into the recommended licence page.
    const firstHref = await recommendationLinks.first().getAttribute('href');
    await recommendationLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
  });

  // Anyone boating both inland and coastal waters needs both licences, which
  // is also the only path that surfaces the SBF-Bundle upsell — a distinct,
  // revenue-relevant branch of the configurator that the single-licence
  // flow above never exercises.
  test('choosing both regions recommends both licences with the bundle upsell', async ({ page }) => {
    await page.goto('/tools/welcher-bootsfuehrerschein/');

    await page.locator('.cfg-opt', { hasText: 'Beides' }).click();
    await page.locator('.cfg-opt', { hasText: 'Verbrenner über 15 PS' }).click();
    await page.locator('.cfg-opt', { hasText: 'Nein' }).click();

    const result = page.locator('#cfg-result');
    await expect(result).toBeVisible();

    const recommendationLinks = result.locator('a.res-card');
    await expect(recommendationLinks).toHaveCount(2);
    await expect(recommendationLinks.filter({ hasText: 'SBF Binnen' })).toHaveAttribute('href', '/sbf-binnen/');
    await expect(recommendationLinks.filter({ hasText: 'SBF See' })).toHaveAttribute('href', '/sbf-see/');

    await expect(result.locator('.res-bundle')).toBeVisible();

    const playCta = result.locator('a[href*="play.google.com"]');
    await expect(playCta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});
