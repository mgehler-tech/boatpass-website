import { test, expect } from '@playwright/test';

/**
 * The header's language link is present on every page, including the
 * business-critical conversion pages (SBF Binnen/See, License Finder). It used
 * to hard-link to the two homepages regardless of the current page, so a
 * visitor deep in a conversion journey who switched language was dropped back
 * to the homepage and had to re-navigate — an unnecessary, revenue-relevant
 * detour. This guards that the link instead lands on the equivalent page in
 * the other language (DE/EN slugs differ for the license pages), in both
 * directions.
 *
 * Since 2026-10-17 the switcher is a single link (`a.lang-switch`) that shows
 * the other language's code; the previous DE|EN pill is gone.
 */
test.describe('Language switcher stays on the equivalent page', () => {
  test('SBF Binnen (DE) switches to SBF Inland (EN) and back', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    await expect(page.locator('a.lang-switch')).toHaveAttribute('href', '/en/sbf-inland/');
    await page.locator('a.lang-switch').click();
    await expect(page).toHaveURL(/\/en\/sbf-inland\/$/);

    await expect(page.locator('a.lang-switch')).toHaveAttribute('href', '/sbf-binnen/');
    await page.locator('a.lang-switch').click();
    await expect(page).toHaveURL(/\/sbf-binnen\/$/);
  });

  test('SBF See (DE) switches to SBF Coastal (EN) and back', async ({ page }) => {
    await page.goto('/sbf-see/');
    await page.locator('a.lang-switch').click();
    await expect(page).toHaveURL(/\/en\/sbf-coastal\/$/);

    await page.locator('a.lang-switch').click();
    await expect(page).toHaveURL(/\/sbf-see\/$/);
  });

  test('License Finder (DE) switches to the EN tool, not the homepage', async ({ page }) => {
    await page.goto('/tools/welcher-bootsfuehrerschein/');
    await page.locator('a.lang-switch').click();
    await expect(page).toHaveURL(/\/en\/tools\/which-boating-license\/$/);
  });
});
