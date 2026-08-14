import { test, expect } from '@playwright/test';

/**
 * Guards the `data-cta-position` instrumentation that BaseLayout's click
 * handler reads to tag `play_store_click` events in Plausible (see
 * BaseLayout.astro). Before this, only the blog-inline and bottom-banner
 * CTAs carried a position — every other CTA (hero, header, pricing, footer,
 * per-page hero/bottom CTAs) fell back to "other", making it impossible to
 * compare which placement actually drives installs. A regression here would
 * silently re-collapse the funnel breakdown without failing any visual test.
 */
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.boatpass.app';

test.describe('CTA position tagging', () => {
  test('every Play Store CTA on the homepage carries a data-cta-position', async ({ page }) => {
    await page.goto('/');

    const links = page.locator(`a[href="${PLAY_STORE_URL}"]`);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      // Only visible/attached CTAs are expected to be tagged — the hidden
      // iOS-badge counterparts have no Play Store href at all.
      await expect(link).toHaveAttribute('data-cta-position', /.+/);
    }
  });

  test('hero, header and pricing CTAs use distinct position values', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#hero-cta-play')).toHaveAttribute('data-cta-position', 'hero');
    await expect(page.locator('#hero-gplay-badge')).toHaveAttribute('data-cta-position', 'hero-badge');

    const headerCta = page.locator(`a[href="${PLAY_STORE_URL}"][data-cta-position="header"]`);
    expect(await headerCta.count()).toBeGreaterThan(0);

    const pricingCtas = page.locator('#pricing a[data-cta-position="pricing"]');
    expect(await pricingCtas.count()).toBeGreaterThan(0);
  });

  test('a license landing page CTA is tagged distinctly from the sitewide banner', async ({ page }) => {
    await page.goto('/sbf-see/');

    const heroCta = page.locator(`a[href="${PLAY_STORE_URL}"][data-cta-position="hero"]`).first();
    await expect(heroCta).toBeVisible();

    // The sitewide bottom banner (CtaBanner.astro) still uses its own
    // long-standing "bottom-banner" position and must not be swallowed by it.
    await expect(page.locator('#cta-banner-play')).toHaveAttribute('data-cta-position', 'bottom-banner');
  });

  test('clicking a tagged CTA fires a play_store_click event with the matching position', async ({ page, context }) => {
    await context.route('https://play.google.com/**', route => route.abort());

    const calls: Array<[string, any]> = [];
    await page.exposeFunction('__recordPlausibleCall', (event: string, options: any) => {
      calls.push([event, options]);
    });
    await page.addInitScript(() => {
      // Installed before BaseLayout's inline script runs; that script does
      // `window.plausible = window.plausible || function(){...}`, so this
      // spy wins and every dispatched call is captured with its real args.
      (window as any).plausible = (...args: any[]) => {
        (window as any).__recordPlausibleCall(args[0], args[1]);
      };
    });

    await page.goto('/');

    const popupPromise = context.waitForEvent('page').catch(() => null);
    await page.locator('#hero-cta-play').click();
    const popup = await popupPromise;
    await popup?.close();

    await expect.poll(() => calls.length).toBeGreaterThan(0);
    const [event, options] = calls[0];
    expect(event).toBe('play_store_click');
    expect(options?.props?.position).toBe('hero');
  });
});
