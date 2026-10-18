import { test, expect } from '@playwright/test';

/**
 * The header's language switcher is present on every page, including the
 * business-critical conversion pages (SBF Binnen/See, License Finder). It used
 * to hard-link to the two homepages regardless of the current page, so a
 * visitor deep in a conversion journey who switched language was dropped back
 * to the homepage and had to re-navigate — an unnecessary, revenue-relevant
 * detour. This guards that the link instead lands on the equivalent page in
 * the other language (DE/EN slugs differ for the license pages), in both
 * directions.
 *
 * The switcher is a DE|EN pill (`nav.lang-switcher` with two `a.lang-option`,
 * each carrying `hreflang`); the current language is marked with
 * `aria-current="page"` and links to the page itself.
 */
const toEn = 'nav.lang-switcher a.lang-option[hreflang="en"]';
const toDe = 'nav.lang-switcher a.lang-option[hreflang="de"]';

test.describe('Language switcher stays on the equivalent page', () => {
  test('SBF Binnen (DE) switches to SBF Inland (EN) and back', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    await expect(page.locator(toEn)).toHaveAttribute('href', '/en/sbf-inland/');
    await expect(page.locator(toDe)).toHaveAttribute('aria-current', 'page');
    await page.locator(toEn).click();
    await expect(page).toHaveURL(/\/en\/sbf-inland\/$/);

    await expect(page.locator(toDe)).toHaveAttribute('href', '/sbf-binnen/');
    await expect(page.locator(toEn)).toHaveAttribute('aria-current', 'page');
    await page.locator(toDe).click();
    await expect(page).toHaveURL(/\/sbf-binnen\/$/);
  });

  test('SBF See (DE) switches to SBF Coastal (EN) and back', async ({ page }) => {
    await page.goto('/sbf-see/');
    await page.locator(toEn).click();
    await expect(page).toHaveURL(/\/en\/sbf-coastal\/$/);

    await page.locator(toDe).click();
    await expect(page).toHaveURL(/\/sbf-see\/$/);
  });

  test('License Finder (DE) switches to the EN tool, not the homepage', async ({ page }) => {
    await page.goto('/tools/welcher-bootsfuehrerschein/');
    await page.locator(toEn).click();
    await expect(page).toHaveURL(/\/en\/tools\/which-boating-license\/$/);
  });
});
