import { test, expect, devices } from '@playwright/test';
import { APP_STORE_URL, PLAY_STORE_URL } from '../../src/data/stores';

// Only the UA/viewport/touch bits, not `defaultBrowserType` (webkit) — the
// project always runs on chromium (see ios-cta-deflection.spec.ts).
const { defaultBrowserType, ...iPhone13 } = devices['iPhone 13'];

/**
 * The desktop conversion-journeys specs drive the mega menu with page.hover(),
 * which only exists on desktop. On mobile the same journeys go through a
 * completely different interaction path — hamburger button → slide-down panel
 * → accordion — that had zero e2e coverage, so a regression there (menu not
 * opening, accordion not expanding, links missing) would ship undetected even
 * though most visitors reach these pages on a phone.
 *
 * The device here is an iPhone, so the device switch in BaseLayout sends every
 * generic app CTA to the App Store; explicit badges keep their store URL.
 */

test.describe('Mobile Homepage → App Store CTA', () => {
  test.use({ ...iPhone13 });

  test('hero and closing CTAs lead to the App Store, footer badges link to both stores', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero-cta-play')).toHaveAttribute('href', APP_STORE_URL);
    await expect(page.locator('#hero-cta-play')).toContainText('Kostenlos im App Store');
    await expect(page.locator('#final-cta-play')).toHaveAttribute('href', APP_STORE_URL);

    await expect(page.locator('#footer-badge-ios')).toHaveAttribute('href', APP_STORE_URL);
    await expect(page.locator('#footer-badge-play')).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Mobile Homepage → Pricing → App Store CTA', () => {
  test.use({ ...iPhone13 });

  test('hamburger menu → Preise leads to the pricing section', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-btn').click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/open/);

    await page.locator('.mobile-nav-link', { hasText: 'Preise' }).click();
    await expect(page).toHaveURL(/#pricing$/);

    const ctaLinks = page.locator(`#pricing a[href="${APP_STORE_URL}"]`);
    expect(await ctaLinks.count()).toBeGreaterThan(0);
    await expect(page.locator('#pricing a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Mobile Navigation → SBF Binnen → App Store CTA', () => {
  test.use({ ...iPhone13 });

  test('hamburger menu → Führerscheine accordion leads to SBF Binnen with a working CTA', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-btn').click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/open/);

    await page.locator('.mobile-accordion-trigger', { hasText: 'Führerscheine' }).click();
    const link = page.locator('#mobile-acc-body a[href="/sbf-binnen/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sbf-binnen\/$/);

    await expect(page.locator(`main a[href="${APP_STORE_URL}"]`).first()).toBeVisible();
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Mobile Navigation → SBF See → App Store CTA', () => {
  test.use({ ...iPhone13 });

  test('hamburger menu → Führerscheine accordion leads to SBF See with a working CTA', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-btn').click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/open/);

    await page.locator('.mobile-accordion-trigger', { hasText: 'Führerscheine' }).click();
    const link = page.locator('#mobile-acc-body a[href="/sbf-see/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/sbf-see\/$/);

    await expect(page.locator(`main a[href="${APP_STORE_URL}"]`).first()).toBeVisible();
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
});

test.describe('Mobile License Finder → Recommendation → App Store CTA', () => {
  test.use({ ...iPhone13 });

  test('configurator on a phone yields a recommendation whose store CTA is the App Store', async ({ page }) => {
    await page.goto('/tools/welcher-bootsfuehrerschein/');

    await page.locator('.cfg-opt', { hasText: 'Küste (Nord- & Ostsee)' }).click();
    await page.locator('.cfg-opt', { hasText: 'Verbrenner über 15 PS' }).click();
    await page.locator('.cfg-opt', { hasText: 'Ja' }).click();
    await page.locator('.cfg-opt', { hasText: 'Küstennah' }).click();

    const result = page.locator('#cfg-result');
    await expect(result).toBeVisible();

    const recommendationLinks = result.locator('a.res-card');
    await expect(recommendationLinks).toHaveCount(2);

    // The result is rendered after load; on an iPhone its store CTA must be
    // the App Store, never the desktop chooser or Google Play.
    await expect(result.locator(`a[href="${APP_STORE_URL}"]`)).toHaveCount(1);
    await expect(result.locator('a[href="/app/"]')).toHaveCount(0);
    await expect(result.locator('a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);

    const firstHref = await recommendationLinks.first().getAttribute('href');
    await recommendationLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
  });
});
