# Dark Mode Toggle + Contrast Fixes

**Date:** 2026-07-10  
**Status:** Approved

## Goal

Add a manual dark/light mode toggle (Option C: Icon-Pill) to the header navigation, and fix contrast/visibility issues across all components in dark mode.

## 1. Toggle Mechanism

Switch from CSS media query to class-based dark mode:

- `html.dark` class controls dark mode (replaces `@media (prefers-color-scheme: dark)`)
- Inline script in `<head>` applies class before first paint — no FOUC
- `localStorage` key `theme` persists choice (`"dark"` | `"light"`)
- If no `localStorage` key: respect `prefers-color-scheme` as default

```js
// Runs before paint
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (saved === 'dark' || (!saved && prefersDark)) {
  document.documentElement.classList.add('dark');
}
```

## 2. Toggle Button (Header, Option C)

Icon-Pill matching the existing DE/EN language switcher style. Placed between the lang-switcher and "App laden" button.

- Light Mode active → Sun icon highlighted (blue pill), Moon icon dimmed
- Dark Mode active → Moon icon highlighted (blue pill), Sun icon dimmed
- Uses same `.lang-switcher` / `.lang-option` / `.lang-active` CSS classes
- JS: click toggles `html.dark`, updates pill state, saves to `localStorage`

## 3. CSS Changes

All `@media (prefers-color-scheme: dark)` blocks replaced with `html.dark` selectors:

- `src/styles/global.css` — root variables + body background
- `src/components/Header.astro` — nav, dropdown, lang-switcher, mobile menu
- `src/components/PricingSection.astro` — catalog cards, stat boxes, compare bar
- All other components with dark mode overrides

## 4. Contrast Fixes (Inline Style Cleanup)

Components with hardcoded inline colors that break in dark mode:

| File | Issue |
|------|-------|
| `PricingSection.astro` | `color:#1A1F36`, `color:#6B7280`, `background:white` in many inline styles → CSS variables |
| `Header.astro` | `.lang-active { background: white }`, `.lang-option:hover { color: #1A1F36 }` |
| `Footer.astro` | `text-gray-500` Tailwind class → `text-muted` (CSS variable) |
| `src/pages/404.astro` | Inline `color:#1A1F36`, `background:white` buttons |
| `src/pages/tools/welcher-bootsfuehrerschein.astro` | Inline `background:#F0F4FA`, `color:#1A1F36` |

Strategy: replace hardcoded hex colors with CSS custom properties (`var(--color-text)`, `var(--color-surface)`, `var(--color-muted)`) where possible, or add targeted `html.dark` overrides in the component's `<style>` block.

## 5. `BaseLayout.astro`

- Add theme-init inline script in `<head>` (before any CSS)
- Ensure `<meta name="color-scheme" content="light dark">` is present

## Scope

Not in scope:
- Changing design tokens themselves
- Per-page theme preferences
- Blog post dark mode (already inherits from global CSS)
