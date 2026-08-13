import { test, expect, devices } from '@playwright/test';

// Only the UA/viewport/touch bits, not `defaultBrowserType` (webkit) — the
// project always runs on chromium, and overriding the browser type per
// describe block isn't supported by Playwright.
const { defaultBrowserType, ...iPhone13 } = devices['iPhone 13'];

/**
 * BoatPass has no iOS app yet (see hero.ctaIos / "iOS-App kommt bald"), so a
 * Play Store link is a dead end for iOS visitors. The Hero CTA already swapped
 * to a "coming soon" state on iOS; the sitewide bottom banner (CtaBanner,
 * present on every page) and the blog mid-article CTA (BlogInlineCta) did not,
 * so iOS visitors landing anywhere but the homepage still got sent to a store
 * page they can't install from. This guards that both now match the Hero's
 * device-aware behaviour.
 */
test.describe('iOS visitors see "coming soon" instead of a dead Play Store link', () => {
  test.use({ ...iPhone13 });

  test('bottom banner CTA deflects to the iOS badge', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#cta-banner-play')).toBeHidden();
    await expect(page.locator('#cta-banner-ios')).toBeVisible();
  });

  test('blog mid-article CTA deflects to the iOS badge', async ({ page }) => {
    await page.goto('/blog/wichtigste-knoten-sbf/');

    await expect(page.locator('#blog-inline-cta-play')).toBeHidden();
    await expect(page.locator('#blog-inline-cta-ios')).toBeVisible();
  });
});

test.describe('Non-iOS visitors keep the working Play Store CTA', () => {
  test('bottom banner and blog CTA still link to the app listing', async ({ page }) => {
    const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.boatpass.app';

    await page.goto('/');
    await expect(page.locator('#cta-banner-play')).toBeVisible();
    await expect(page.locator('#cta-banner-play')).toHaveAttribute('href', PLAY_STORE_URL);
    await expect(page.locator('#cta-banner-ios')).toBeHidden();

    await page.goto('/blog/wichtigste-knoten-sbf/');
    await expect(page.locator('#blog-inline-cta-play')).toBeVisible();
    await expect(page.locator('#blog-inline-cta-play')).toHaveAttribute('href', PLAY_STORE_URL);
    await expect(page.locator('#blog-inline-cta-ios')).toBeHidden();
  });
});
