import { test, expect } from '@playwright/test';
import { APP_STORE_URL_INTL, PLAY_STORE_URL } from '../../src/data/stores';

/**
 * English-language counterpart to conversion-journeys.spec.ts. The /en/ site
 * is a fully parallel funnel (its own hero, pricing, nav and licence finder),
 * so it needs the same guardrails as the German site – a regression here has
 * the same direct revenue impact.
 *
 * Desktop: generic CTAs lead to the store chooser /en/app/, explicit badges
 * to the stores (see conversion-journeys.spec.ts for the reasoning).
 */
const CHOOSER = '/en/app/';

test.describe('EN Homepage → app CTA', () => {
  test('hero and closing CTAs lead to the store chooser, footer badges link to both stores', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#hero-cta-play')).toHaveAttribute('href', CHOOSER);
    await expect(page.locator('#hero-cta-play')).toContainText('Download for free');
    await expect(page.locator('#final-cta-play')).toHaveAttribute('href', CHOOSER);

    await expect(page.locator('#footer-badge-ios')).toHaveAttribute('href', APP_STORE_URL_INTL);
    await expect(page.locator('#footer-badge-play')).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('EN Homepage → Pricing → app CTA', () => {
  test('pricing section CTAs lead to the store chooser', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('nav a', { hasText: 'Pricing' }).first().click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();

    expect(await page.locator(`#pricing a[href="${CHOOSER}"]`).count()).toBeGreaterThan(0);
    await expect(page.locator('#pricing a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('EN Navigation → SBF Inland → app CTA', () => {
  test('mega menu leads to SBF Inland with a working CTA', async ({ page }) => {
    await page.goto('/en/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/en/sbf-inland/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/en\/sbf-inland\/$/);

    await expect(page.locator(`main a[href="${CHOOSER}"]`).first()).toBeVisible();
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('EN Navigation → SBF Coastal → app CTA', () => {
  test('mega menu leads to SBF Coastal with a working CTA', async ({ page }) => {
    await page.goto('/en/');
    await page.hover('#licenses-trigger');
    const link = page.locator('#licenses-menu a[href="/en/sbf-coastal/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/en\/sbf-coastal\/$/);

    await expect(page.locator(`main a[href="${CHOOSER}"]`).first()).toBeVisible();
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
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

    // The result is rendered after load, so it picks its store link itself.
    await expect(result.locator(`a[href="${CHOOSER}"]`)).toHaveCount(1);

    // Follow the "next step" link into the recommended licence page.
    const firstHref = await recommendationLinks.first().getAttribute('href');
    await recommendationLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
  });

  // EN counterpart of the DE bundle-upsell test in conversion-journeys.spec.ts:
  // choosing both regions is the only path that recommends two licences and
  // surfaces the SBF-Bundle upsell, so it needs its own coverage independent
  // of the single-licence flow above.
  test('choosing both regions recommends both licences with the bundle upsell', async ({ page }) => {
    await page.goto('/en/tools/which-boating-license/');

    await page.locator('.cfg-opt', { hasText: 'Both' }).click();
    await page.locator('.cfg-opt', { hasText: 'Combustion over 15 hp' }).click();
    await page.locator('.cfg-opt', { hasText: 'No' }).click();

    const result = page.locator('#cfg-result');
    await expect(result).toBeVisible();

    const recommendationLinks = result.locator('a.res-card');
    await expect(recommendationLinks).toHaveCount(2);
    await expect(recommendationLinks.filter({ hasText: 'SBF Inland' })).toHaveAttribute('href', '/en/sbf-inland/');
    await expect(recommendationLinks.filter({ hasText: 'SBF Coastal' })).toHaveAttribute('href', '/en/sbf-coastal/');

    await expect(result.locator('.res-bundle')).toBeVisible();
    await expect(result.locator('.res-bundle')).toContainText('€16.98');

    await expect(result.locator(`a[href="${CHOOSER}"]`)).toHaveCount(1);
  });
});
