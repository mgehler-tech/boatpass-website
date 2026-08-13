import { test, expect } from '@playwright/test';

/**
 * English-language counterpart to conversion-journeys.spec.ts. The /en/ site
 * is a fully parallel funnel (its own hero, pricing, nav and license finder),
 * so it needs the same guardrails as the German site — a regression here has
 * the same direct revenue impact but previously shipped with zero coverage.
 */
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.boatpass.app';

test.describe('EN Homepage → Play Store CTA', () => {
  test('hero CTA and Google Play badge link to the app listing', async ({ page }) => {
    await page.goto('/en/');
    const heroCta = page.locator('#hero-cta-play');
    await expect(heroCta).toHaveAttribute('href', PLAY_STORE_URL);
    await expect(heroCta).toHaveAttribute('target', '_blank');

    const gplayBadge = page.locator('#hero-gplay-badge');
    await expect(gplayBadge).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('EN Homepage → Pricing → Play Store CTA', () => {
  test('pricing section CTAs link to the app listing', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('nav a', { hasText: 'Pricing' }).first().click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();

    const ctaLinks = page.locator('#pricing a[href*="play.google.com"]');
    await expect(ctaLinks.first()).toHaveAttribute('href', PLAY_STORE_URL);
    expect(await ctaLinks.count()).toBeGreaterThan(0);
  });
});

test.describe('EN Navigation → SBF Inland → Play Store CTA', () => {
  test('mega menu leads to SBF Inland with a working CTA', async ({ page }) => {
    await page.goto('/en/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/en/sbf-inland/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/en\/sbf-inland\/$/);

    const cta = page.locator('a[href*="play.google.com"]').first();
    await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('EN Navigation → SBF Coastal → Play Store CTA', () => {
  test('mega menu leads to SBF Coastal with a working CTA', async ({ page }) => {
    await page.goto('/en/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/en/sbf-coastal/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/en\/sbf-coastal\/$/);

    const cta = page.locator('a[href*="play.google.com"]').first();
    await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('EN License Finder full flow → Recommendation → Next step', () => {
  test('completing the configurator yields a recommendation with a working next step', async ({ page }) => {
    await page.goto('/en/tools/which-boating-license/');

    await page.locator('.cfg-opt', { hasText: 'Coast (North & Baltic Sea)' }).click();
    await page.locator('.cfg-opt', { hasText: 'Combustion over 15 hp' }).click();
    await page.locator('.cfg-opt', { hasText: 'Yes' }).click();
    await page.locator('.cfg-opt', { hasText: 'Coastal' }).click();

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
});
