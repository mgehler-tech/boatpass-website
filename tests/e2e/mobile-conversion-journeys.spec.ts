import { test, expect, devices } from '@playwright/test';

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
 */
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.boatpass.app';

test.describe('Mobile Homepage → Play Store CTA', () => {
  test.use({ ...iPhone13 });

  test('hero CTA and Google Play badge link to the app listing', async ({ page }) => {
    await page.goto('/');
    const heroCta = page.locator('#hero-cta-play');
    await expect(heroCta).toHaveAttribute('href', PLAY_STORE_URL);

    const gplayBadge = page.locator('#hero-gplay-badge');
    await expect(gplayBadge).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Mobile Homepage → Pricing → Play Store CTA', () => {
  test.use({ ...iPhone13 });

  test('hamburger menu → Preise leads to the pricing section', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-btn').click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/open/);

    await page.locator('.mobile-nav-link', { hasText: 'Preise' }).click();
    await expect(page).toHaveURL(/#pricing$/);

    const ctaLinks = page.locator('#pricing a[href*="play.google.com"]');
    await expect(ctaLinks.first()).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Mobile Navigation → SBF Binnen → Play Store CTA', () => {
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

    const cta = page.locator('a[href*="play.google.com"]').first();
    await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

test.describe('Mobile Navigation → SBF See → Play Store CTA', () => {
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

    const cta = page.locator('a[href*="play.google.com"]').first();
    await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  });
});

// The desktop and EN specs both cover the License Finder, but until now no
// spec exercised it under a touch viewport — the one place most visitors
// actually reach this tool from. The `.cfg-opt` buttons are plain buttons
// with no desktop-only interaction (unlike the mega menu's hover), so this
// mainly guards against a mobile-only layout regression hiding the options
// or the result panel off-screen.
test.describe('Mobile License Finder full flow → Recommendation → Next step', () => {
  test.use({ ...iPhone13 });

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

    const playCta = result.locator('a[href*="play.google.com"]');
    await expect(playCta).toHaveAttribute('href', PLAY_STORE_URL);

    const firstHref = await recommendationLinks.first().getAttribute('href');
    await recommendationLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${firstHref}$`));
  });
});
