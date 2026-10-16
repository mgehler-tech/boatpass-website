import { test, expect } from '@playwright/test';
import { APP_STORE_URL, PLAY_STORE_URL } from '../../src/data/stores';

/**
 * Guards the business-critical paths from site entry to the app stores.
 * A broken link or missing CTA here has direct revenue impact, so these
 * journeys are covered independently of the Lighthouse SEO checks.
 *
 * Desktop (this project's default device): generic CTAs are rewritten by the
 * device switch in BaseLayout to the store chooser /app/, because a desktop
 * visitor cannot install from either store directly. Explicit store badges
 * (data-store) keep their store URL. Device-specific routing (iPhone → App
 * Store, Android → Google Play) is covered in store-routing.spec.ts.
 */
const CHOOSER = '/app/';

test.describe('Homepage → app CTA', () => {
  test('hero and closing CTAs lead to the store chooser, closing badges link to both stores', async ({ page }) => {
    await page.goto('/');
    const heroCta = page.locator('#hero-cta-play');
    await expect(heroCta).toHaveAttribute('href', CHOOSER);
    await expect(heroCta).toContainText('Kostenlos laden');
    await expect(page.locator('#final-cta-play')).toHaveAttribute('href', CHOOSER);

    await expect(page.locator('#final-badge-ios')).toHaveAttribute('href', APP_STORE_URL);
    await expect(page.locator('#final-badge-play')).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Homepage quiz → Result → app CTA', () => {
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
    await expect(result.locator(`a[href="${CHOOSER}"]`)).toBeVisible();

    await result.locator('[data-restart]').click();
    await expect(quiz.locator('[data-item="0"]')).toBeVisible();
    await expect(quiz.locator('.hq-seg.is-right, .hq-seg.is-wrong')).toHaveCount(0);
  });
});

test.describe('Homepage → Pricing → app CTA', () => {
  test('pricing section CTAs lead to the store chooser', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a', { hasText: 'Preise' }).first().click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();

    const ctaLinks = page.locator(`#pricing a[href="${CHOOSER}"]`);
    expect(await ctaLinks.count()).toBeGreaterThan(0);
    // No generic CTA may still point straight at Google Play on desktop.
    await expect(page.locator('#pricing a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Navigation → SBF Binnen → app CTA', () => {
  test('mega menu leads to SBF Binnen with a working CTA', async ({ page }) => {
    await page.goto('/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/sbf-binnen/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sbf-binnen\/$/);

    await expect(page.locator(`main a[href="${CHOOSER}"]`).first()).toBeVisible();
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Navigation → SBF See → app CTA', () => {
  test('mega menu leads to SBF See with a working CTA', async ({ page }) => {
    await page.goto('/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/sbf-see/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sbf-see\/$/);

    await expect(page.locator(`main a[href="${CHOOSER}"]`).first()).toBeVisible();
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Store chooser /app/', () => {
  test('desktop visitors see both store badges and a QR code instead of a redirect', async ({ page }) => {
    await page.goto(CHOOSER);
    await expect(page).toHaveURL(/\/app\/$/);
    await expect(page.locator('#ac-badge-ios')).toHaveAttribute('href', APP_STORE_URL);
    await expect(page.locator('#ac-badge-play')).toHaveAttribute('href', PLAY_STORE_URL);
    await expect(page.locator('.ac-qr svg')).toBeVisible();
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

    // The result is rendered after load, so it picks its store link itself.
    await expect(result.locator(`a[href="${CHOOSER}"]`)).toHaveCount(1);

    // Follow the "next step" link into the recommended licence page.
    const firstHref = await recommendationLinks.first().getAttribute('href');
    await recommendationLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
  });

  // Anyone boating both inland and coastal waters needs both licences, which
  // is also the only path that surfaces the SBF-Bundle upsell – a distinct,
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

    // Desktop shows the Google Play prices (16,98 € bundle).
    await expect(result.locator('.res-bundle')).toBeVisible();
    await expect(result.locator('.res-bundle')).toContainText('16,98 €');

    await expect(result.locator(`a[href="${CHOOSER}"]`)).toHaveCount(1);
  });
});
