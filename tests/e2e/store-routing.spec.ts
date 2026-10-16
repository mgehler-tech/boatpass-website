import { test, expect, devices } from '@playwright/test';
import { APP_STORE_ID, APP_STORE_URL, PLAY_STORE_URL } from '../../src/data/stores';

// Only the UA/viewport/touch bits, not `defaultBrowserType` (webkit) – the
// project always runs on chromium, and overriding the browser type per
// describe block isn't supported by Playwright.
const { defaultBrowserType: _ios, ...iPhone13 } = devices['iPhone 13'];
const { defaultBrowserType: _android, ...pixel7 } = devices['Pixel 7'];

/**
 * BoatPass is on Google Play and the App Store. Generic app CTAs link to
 * Google Play in the markup (works without JS); the device switch in
 * BaseLayout rewrites them per device: iPhone/iPad → App Store, Android →
 * Google Play, desktop → store chooser /app/. Explicit store badges carry
 * data-store and are never rewritten. Prices that differ between the stores
 * (PlatformPrice.astro) follow the same html[data-platform] switch.
 *
 * Covered here: the homepage CTA (home/StoreCta – label follows the device),
 * the sitewide bottom banner (CtaBanner, not on the homepage), the blog
 * mid-article CTA (BlogInlineCta), the store chooser and platform prices.
 */

test.describe('iPhone visitors are sent to the App Store', () => {
  test.use({ ...iPhone13 });

  test('homepage CTA, bottom banner, blog CTA and comparison badges lead to the App Store', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-platform', 'ios');
    await expect(page.locator('#hero-cta-play')).toHaveAttribute('href', APP_STORE_URL);
    await expect(page.locator('#hero-cta-play')).toContainText('Kostenlos im App Store');

    await page.goto('/faq/');
    await expect(page.locator('#cta-banner-play')).toHaveAttribute('href', APP_STORE_URL);

    await page.goto('/blog/wichtigste-knoten-sbf/');
    await expect(page.locator('#blog-inline-cta-play')).toBeVisible();
    await expect(page.locator('#blog-inline-cta-play')).toHaveAttribute('href', APP_STORE_URL);

    // Explicit badges keep their own store, even on iPhone.
    await page.goto('/sbf-app/');
    await expect(page.locator('#app-landing-cta-ios')).toHaveAttribute('href', APP_STORE_URL);
    await expect(page.locator('#app-landing-cta-play')).toHaveAttribute('href', PLAY_STORE_URL);
  });

  test('the store chooser redirects to the App Store', async ({ page }) => {
    await page.route('https://plausible.io/**', (route) => route.abort());
    await page.route('https://apps.apple.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>App Store</title>' }),
    );
    await page.goto('/app/');
    await expect(page).toHaveURL(new RegExp(`apps\\.apple\\.com/.*id${APP_STORE_ID}`));
  });

  test('?stay keeps the chooser page open', async ({ page }) => {
    await page.goto('/app/?stay');
    await expect(page).toHaveURL(/\/app\/\?stay$/);
    await expect(page.locator('#ac-redirect')).toBeHidden();
    // A QR code makes no sense on the phone itself.
    await expect(page.locator('.ac-qr')).toBeHidden();
  });

  test('prices show the App Store price', async ({ page }) => {
    await page.goto('/ubi/');
    await expect(page.getByText('Bei Google Play: 7,99 €')).toBeVisible();
    await expect(page.getByText('Im App Store: 8,99 €')).toBeHidden();
  });

  test('Safari Smart App Banner is declared', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="apple-itunes-app"]')).toHaveAttribute('content', `app-id=${APP_STORE_ID}`);
  });
});

test.describe('Android visitors are sent to Google Play', () => {
  test.use({ ...pixel7 });

  test('homepage CTA, bottom banner and blog CTA lead to Google Play, Play badge comes first', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-platform', 'android');
    await expect(page.locator('#hero-cta-play')).toHaveAttribute('href', PLAY_STORE_URL);
    await expect(page.locator('#hero-cta-play')).toContainText('Kostenlos bei Google Play');

    const playBadge = page.locator('#final-badge-play');
    const iosBadge = page.locator('#final-badge-ios');
    await playBadge.scrollIntoViewIfNeeded();
    const playBox = await playBadge.boundingBox();
    const iosBox = await iosBadge.boundingBox();
    expect(playBox && iosBox && (playBox.y < iosBox.y || playBox.x < iosBox.x)).toBeTruthy();

    await page.goto('/faq/');
    await expect(page.locator('#cta-banner-play')).toHaveAttribute('href', PLAY_STORE_URL);

    await page.goto('/blog/wichtigste-knoten-sbf/');
    await expect(page.locator('#blog-inline-cta-play')).toHaveAttribute('href', PLAY_STORE_URL);
  });

  test('the store chooser passes the share-card ref to Google Play as install referrer', async ({ page }) => {
    await page.route('https://plausible.io/**', (route) => route.abort());
    await page.route('https://play.google.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Google Play</title>' }),
    );
    await page.goto('/app/?ref=passed_sbf_see');
    await expect(page).toHaveURL(
      `${PLAY_STORE_URL}&referrer=utm_source%3Dshare_card%26utm_campaign%3Dpassed_sbf_see`,
    );
  });

  test('an invalid ref is dropped instead of reaching the store URL', async ({ page }) => {
    await page.route('https://plausible.io/**', (route) => route.abort());
    await page.route('https://play.google.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Google Play</title>' }),
    );
    await page.goto('/app/?ref=%3Cscript%3E');
    await expect(page).toHaveURL(PLAY_STORE_URL);
  });

  test('prices show the Google Play price', async ({ page }) => {
    await page.goto('/ubi/');
    await expect(page.getByText('Im App Store: 8,99 €')).toBeVisible();
    await expect(page.getByText('Bei Google Play: 7,99 €')).toBeHidden();
  });
});

test.describe('Desktop visitors are sent to the store chooser', () => {
  test('homepage CTA, bottom banner and blog CTA lead to /app/', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-platform', 'desktop');
    await expect(page.locator('#hero-cta-play')).toHaveAttribute('href', '/app/');
    await expect(page.locator('#hero-cta-play')).toContainText('Kostenlos laden');

    await page.goto('/faq/');
    await expect(page.locator('#cta-banner-play')).toHaveAttribute('href', '/app/');

    await page.goto('/blog/wichtigste-knoten-sbf/');
    await expect(page.locator('#blog-inline-cta-play')).toHaveAttribute('href', '/app/');

    await page.goto('/en/blog/');
    await expect(page.locator('main a[href="/en/app/"]').first()).toBeVisible();
  });
});
