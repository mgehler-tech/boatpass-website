import { test, expect } from '@playwright/test';

/**
 * Startseite Premium-Politur (Spec docs/superpowers/specs/2026-10-17-premium-polish-design.md).
 * Prüft die sichtbaren Verträge der Umsetzung: seitenweite Tokens, Header,
 * Footer, Hero-Reduktion, Foto-Paneel und Lernweg-Bühne.
 */

test.describe('Tokens', () => {
  test('h-tokens are defined on :root on a subpage', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    // Der CSS-Minifier normalisiert Hex (klein) und rgba() (zu #rrggbbaa);
    // geprüft wird deshalb der Wert, nicht seine Schreibweise.
    const paper = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-paper').trim());
    expect(paper.toLowerCase()).toBe('#f0f4fa');
    const shadow = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-shadow-device').trim());
    expect(shadow).toContain('0 60px 120px -40px');
    expect(shadow).toContain('0 10px 24px -12px');
  });
});
