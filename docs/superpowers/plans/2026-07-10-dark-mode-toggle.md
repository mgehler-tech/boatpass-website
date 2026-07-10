# Dark Mode Toggle + Contrast Fixes – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a class-based dark/light mode toggle (Icon-Pill matching the DE/EN lang-switcher) to the navigation, convert all 11 component `@media (prefers-color-scheme: dark)` blocks to `html.dark` selectors, and fix contrast issues in inline-styled elements on pages without dark mode coverage.

**Architecture:** Inline `<script is:inline>` in `<head>` sets `html.dark` before first paint (no FOUC), reading from `localStorage` with `prefers-color-scheme` as fallback. All existing dark mode rules are converted from media queries to `html.dark`-prefixed selectors — 100% textual transformation, values unchanged. Toggle button uses same Pill CSS as lang-switcher.

**Tech Stack:** Astro 5, Tailwind CSS v4, Vanilla TypeScript

---

## Files Modified

| File | Change |
|------|--------|
| `src/layouts/BaseLayout.astro` | Add theme-init inline script (first in `<head>`) |
| `src/styles/global.css` | Convert `@media` dark block to `html.dark` |
| `src/components/Header.astro` | Add toggle button HTML + CSS + JS, convert `@media` dark block |
| `src/components/PricingSection.astro` | Convert `@media` dark block |
| `src/components/Footer.astro` | `text-gray-500` → `text-muted`, convert `@media` dark block |
| `src/components/HeroSection.astro` | Convert `@media` dark block |
| `src/components/FeatureCards.astro` | Convert `@media` dark block |
| `src/components/PracticeBridge.astro` | Convert `@media` dark block |
| `src/components/FinderTeaser.astro` | Convert `@media` dark block |
| `src/components/CatalogSources.astro` | Convert `@media` dark block |
| `src/components/BlogCard.astro` | Convert `@media` dark block |
| `src/components/TrustBar.astro` | Convert `@media` dark block |
| `src/pages/404.astro` | Add `<style>` block for dark mode inline-style overrides |
| `src/pages/tools/welcher-bootsfuehrerschein.astro` | Add `<style>` block + fix JS-generated button class |

---

## Task 1: Theme Init Script + global.css

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add theme init script as first element in `<head>`**

In `src/layouts/BaseLayout.astro`, after line 25 (`<head>`), insert this as the **first child** before any other script or stylesheet:

```html
<script is:inline>
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 2: Convert dark mode block in global.css**

In `src/styles/global.css`, find and replace the entire `@media (prefers-color-scheme: dark) { ... }` block (which currently contains `:root {}`, `body {}`, and `.gradient-text {}`) with:

```css
html.dark {
  --color-background: #0F1117;
  --color-surface:    #181E2E;
  --color-text:       #E2E8F0;
  --color-navy:       #E2E8F0;
  --color-muted:      #94A3B8;
  --color-border:     rgba(100, 140, 255, 0.12);
}
html.dark body { background-color: #0F1117; }
html.dark .gradient-text {
  background: linear-gradient(135deg, #6B9CFF 0%, #A0C4FF 100%);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat(dark-mode): class-based html.dark, theme init script before first paint"
```

---

## Task 2: Header – Toggle Button + JS + Dark Mode CSS

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Add toggle button HTML**

In `src/components/Header.astro`, in the "Right side" `<div class="flex items-center gap-3">` (around line 62), insert the toggle **after** the closing `</div>` of `.lang-switcher` (line 70) and **before** the `<a>` (App laden, line 71):

```html
<!-- Theme Toggle (Icon-Pill matching lang-switcher) -->
<button id="theme-toggle" class="theme-switcher" aria-label={lang === 'de' ? 'Design wechseln' : 'Toggle theme'}>
  <span class="theme-option" id="theme-opt-light">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </span>
  <span class="theme-option" id="theme-opt-dark">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </span>
</button>
```

- [ ] **Step 2: Add theme-switcher CSS + convert dark mode block**

In `src/components/Header.astro` `<style>` block, do two things:

**a) Add after `.mobile-divider` rule (before the current `@media` block), insert:**

```css
/* ── Theme Toggle (mirrors .lang-switcher) ─────────────────── */
.theme-switcher {
  display: inline-flex;
  align-items: center;
  background: rgba(51,102,255,0.06);
  border: 1px solid rgba(51,102,255,0.12);
  border-radius: 100px;
  padding: 3px;
  gap: 2px;
  cursor: pointer;
}
.theme-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  padding: 4px 8px;
  border-radius: 100px;
  transition: color 0.15s, background 0.15s;
}
.theme-option-active {
  background: white;
  color: #1A1F36;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.theme-option:not(.theme-option-active):hover { color: #1A1F36; }
```

**b) Replace the entire `@media (prefers-color-scheme: dark) { ... }` block (lines ~469–537) with:**

```css
/* ── Dark Mode (controlled by html.dark class) ─────────────── */
html.dark header {
  background: rgba(10, 13, 20, 0.95) !important;
  border-color: rgba(90, 120, 255, 0.14) !important;
}
html.dark .logo-link { color: #E2E8F0 !important; }
html.dark .nav-link { color: #94A3B8 !important; }
html.dark .nav-link:hover { color: #E2E8F0 !important; }
html.dark .lang-switcher {
  background: rgba(90, 120, 255, 0.12) !important;
  border-color: rgba(90, 120, 255, 0.24) !important;
}
html.dark .lang-option { color: #6B7280 !important; }
html.dark .lang-option:hover { color: #E2E8F0 !important; }
html.dark .lang-active {
  background: #3366FF !important;
  color: #ffffff !important;
  box-shadow: 0 1px 6px rgba(51, 102, 255, 0.40) !important;
}
html.dark .theme-switcher {
  background: rgba(90, 120, 255, 0.12) !important;
  border-color: rgba(90, 120, 255, 0.24) !important;
}
html.dark .theme-option { color: #6B7280 !important; }
html.dark .theme-option:not(.theme-option-active):hover { color: #E2E8F0 !important; }
html.dark .theme-option-active {
  background: #3366FF !important;
  color: #ffffff !important;
  box-shadow: 0 1px 6px rgba(51, 102, 255, 0.40) !important;
}
html.dark .hamburger-line { background: #C8D0E8 !important; }
html.dark #mobile-menu-btn {
  background: rgba(90, 120, 255, 0.10) !important;
  border-color: rgba(90, 120, 255, 0.18) !important;
}
html.dark .nav-dropdown-menu {
  background: #1A2140 !important;
  border-color: rgba(90, 120, 255, 0.16) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
}
html.dark .nav-dropdown-item { color: #B4BCDA !important; }
html.dark .nav-dropdown-item:hover {
  background: rgba(90, 120, 255, 0.10) !important;
  color: #E2E8F0 !important;
}
html.dark .mobile-menu-panel {
  background: rgba(10, 13, 20, 0.98) !important;
  border-color: rgba(90, 120, 255, 0.12) !important;
}
html.dark .mobile-nav-link { color: #E2E8F0 !important; }
html.dark .mobile-nav-link:hover { background: rgba(90, 120, 255, 0.10) !important; }
html.dark .mobile-nav-sublink { color: #94A3B8 !important; }
html.dark .mobile-nav-sublink:hover {
  background: rgba(90, 120, 255, 0.10) !important;
  color: #E2E8F0 !important;
}
html.dark .mobile-divider { background: rgba(90, 120, 255, 0.10) !important; }
html.dark .accordion-chevron { background: rgba(90, 120, 255, 0.14) !important; }
html.dark .accordion-open .accordion-chevron { background: #3366FF !important; }
html.dark .soon-badge {
  background: rgba(90, 120, 255, 0.20) !important;
  color: #8BB4FF !important;
}
```

- [ ] **Step 3: Add toggle JS at end of `<script>` block**

In `src/components/Header.astro`, at the very end of the existing `<script>` block (after line 238, before `</script>`), append:

```typescript
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement | null;
  const themeOptLight = document.getElementById('theme-opt-light');
  const themeOptDark = document.getElementById('theme-opt-dark');

  function syncThemeToggle() {
    const isDark = document.documentElement.classList.contains('dark');
    themeOptLight?.classList.toggle('theme-option-active', !isDark);
    themeOptDark?.classList.toggle('theme-option-active', isDark);
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    syncThemeToggle();
  });

  syncThemeToggle();
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(header): add dark/light mode toggle pill, convert to html.dark selectors"
```

---

## Task 3: PricingSection – Convert Dark Mode Block

**Files:**
- Modify: `src/components/PricingSection.astro`

The existing dark mode block already covers inline text via `#pricing [style*="color:#1A1F36"]` attribute selectors. Only the media query wrapper needs replacing.

- [ ] **Step 1: Replace `@media` block with `html.dark` selectors**

In `src/components/PricingSection.astro` `<style>` block, replace:

```css
@media (prefers-color-scheme: dark) {
  .catalog-card { ... }
  ...all rules...
}
```

with (unwrap every rule, prefix each selector with `html.dark `):

```css
html.dark .catalog-card {
  background: #181E2E !important;
  border-color: rgba(90, 120, 255, 0.12) !important;
}
html.dark .catalog-card.featured { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important; }
html.dark .compare-bar {
  background: #181E2E !important;
  border-color: rgba(90, 120, 255, 0.14) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25) !important;
}
html.dark .compare-free .compare-label { color: #E2E8F0 !important; }
html.dark .compare-free .compare-sub   { color: #94A3B8 !important; }
html.dark .compare-free .compare-feature { color: #B4BCDA !important; }
html.dark .compare-check-free { background: rgba(90, 120, 255, 0.14) !important; }
html.dark .soon-bar {
  background: #181E2E !important;
  border-color: rgba(90, 120, 255, 0.08) !important;
}
html.dark .plus-circle { background: #1A2140 !important; }
html.dark .stat-box {
  background: #1A2140 !important;
  border-color: rgba(90, 120, 255, 0.10) !important;
}
html.dark .stat-num { color: #E2E8F0 !important; }
html.dark .hero-stat {
  background: #1A2140 !important;
  border-color: rgba(90, 120, 255, 0.10) !important;
}
html.dark .hero-stat strong { color: #E2E8F0 !important; }
html.dark .licenses-link-card {
  background: #1A2140 !important;
  border-color: rgba(90, 120, 255, 0.22) !important;
}
html.dark .licenses-link-card:hover {
  background: #1E2842 !important;
  border-color: rgba(90, 120, 255, 0.40) !important;
}
html.dark #pricing [style*="color:#1A1F36"]  { color: #E2E8F0 !important; }
html.dark #pricing [style*="color: #1A1F36"] { color: #E2E8F0 !important; }
html.dark #pricing [style*="color:#6B7280"]  { color: #94A3B8 !important; }
html.dark #pricing [style*="color: #6B7280"] { color: #94A3B8 !important; }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PricingSection.astro
git commit -m "fix(pricing): convert prefers-color-scheme to html.dark selectors"
```

---

## Task 4: Bulk Component Conversions (7 files)

**Files:**
- Modify: `src/components/HeroSection.astro`
- Modify: `src/components/FeatureCards.astro`
- Modify: `src/components/PracticeBridge.astro`
- Modify: `src/components/FinderTeaser.astro`
- Modify: `src/components/CatalogSources.astro`
- Modify: `src/components/BlogCard.astro`
- Modify: `src/components/TrustBar.astro`

The transformation for **each file** is identical: in the `<style>` block, find `@media (prefers-color-scheme: dark) { ... }` and "unwrap" it — each rule `selector { props }` becomes `html.dark selector { props }`. Values, `!important` flags, and selectors are unchanged; only the media query wrapper is removed and `html.dark ` is prepended to each selector.

- [ ] **Step 1: Convert HeroSection.astro**

Open `src/components/HeroSection.astro`. Find the `@media (prefers-color-scheme: dark)` block in `<style>`. Unwrap every rule with `html.dark` prefix.

- [ ] **Step 2: Convert FeatureCards.astro**

Open `src/components/FeatureCards.astro`. Same transformation.

- [ ] **Step 3: Convert PracticeBridge.astro**

Open `src/components/PracticeBridge.astro`. Same transformation.

- [ ] **Step 4: Convert FinderTeaser.astro**

Open `src/components/FinderTeaser.astro`. Same transformation.

- [ ] **Step 5: Convert CatalogSources.astro**

Open `src/components/CatalogSources.astro`. Same transformation.

- [ ] **Step 6: Convert BlogCard.astro**

Open `src/components/BlogCard.astro`. Same transformation.

- [ ] **Step 7: Convert TrustBar.astro**

Open `src/components/TrustBar.astro`. Same transformation.

- [ ] **Step 8: Commit all**

```bash
git add src/components/HeroSection.astro src/components/FeatureCards.astro src/components/PracticeBridge.astro src/components/FinderTeaser.astro src/components/CatalogSources.astro src/components/BlogCard.astro src/components/TrustBar.astro
git commit -m "fix(components): convert all prefers-color-scheme blocks to html.dark selectors"
```

---

## Task 5: Footer – text-gray-500 Fix + Dark Mode Conversion

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace text-gray-500 with text-muted (all occurrences)**

In `src/components/Footer.astro`, replace ALL occurrences of `text-gray-500` with `text-muted`. This affects the subtitle `<p>` (line 22) and all nav `<a>` elements (lines 36–71). The `--color-muted` CSS variable already adapts to `#94A3B8` in dark mode via the `html.dark` block added in Task 1.

Use the Edit tool with `replace_all: true`:
- old: `text-gray-500`
- new: `text-muted`

- [ ] **Step 2: Convert dark mode block**

In `src/components/Footer.astro` `<style>` block, unwrap the `@media (prefers-color-scheme: dark)` block with `html.dark` prefix on each selector.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "fix(footer): text-gray-500 → text-muted, convert to html.dark"
```

---

## Task 6: 404 Page – Dark Mode for Inline Styles

**Files:**
- Modify: `src/pages/404.astro`

The 404 page has no `<style>` block. The secondary buttons (`background:white; color:#1A1F36`) are invisible on dark backgrounds.

- [ ] **Step 1: Add `<style>` block**

In `src/pages/404.astro`, before `</BaseLayout>` (at the very end of the file), add:

```html
<style>
  html.dark h1 { color: #E2E8F0; }
  html.dark p  { color: #94A3B8; }
  html.dark a[style*="background:white"],
  html.dark a[style*="background: white"] {
    background: #1A2140 !important;
    color: #E2E8F0 !important;
    border-color: rgba(90, 120, 255, 0.22) !important;
  }
  html.dark a[style*="color:#6B7280"] { color: #94A3B8 !important; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "fix(404): dark mode for inline-styled buttons and headings"
```

---

## Task 7: Welcher-Bootsfuehrerschein – Dark Mode

**Files:**
- Modify: `src/pages/tools/welcher-bootsfuehrerschein.astro`

- [ ] **Step 1: Fix JS-generated restart button — remove inline background:white**

In the `<script>` block (around line 387), find:

```javascript
'<button type="button" id="cfg-restart" style="background:white; border:1.5px solid rgba(51,102,255,0.2); color:#3366FF; font-weight:700; font-size:15px; padding:14px 24px; border-radius:14px; cursor:pointer;">Nochmal starten</button>'
```

Replace with (remove `background:white;` from inline style, add class):

```javascript
'<button type="button" id="cfg-restart" class="cfg-restart-btn" style="border:1.5px solid rgba(51,102,255,0.2); color:#3366FF; font-weight:700; font-size:15px; padding:14px 24px; border-radius:14px; cursor:pointer;">Nochmal starten</button>'
```

- [ ] **Step 2: Add `<style>` block with dark mode overrides**

In `src/pages/tools/welcher-bootsfuehrerschein.astro`, in the existing `<style>` block, append at the end:

```css
/* ── Dark Mode ─────────────────────────────────────────────── */
.cfg-restart-btn { background: white; }
html.dark .cfg-restart-btn {
  background: #181E2E !important;
  color: #6B9CFF !important;
  border-color: rgba(90,120,255,0.25) !important;
}
html.dark div[style*="background:#F0F4FA"] { background: #0F1117 !important; }
html.dark h1[style*="color:#1A1F36"],
html.dark h2[style*="color:#1A1F36"] { color: #E2E8F0 !important; }
html.dark p[style*="color:#6B7280"] { color: #94A3B8 !important; }
html.dark table[style*="background:white"] {
  background: #181E2E !important;
  border-color: rgba(90,120,255,0.14) !important;
}
html.dark th[style*="color:#1A1F36"] { color: #E2E8F0 !important; }
html.dark td[style*="color:#1A1F36"] { color: #E2E8F0 !important; }
html.dark div[style*="background:white"][style*="border-radius:16px"] {
  background: #181E2E !important;
  border-color: rgba(90,120,255,0.12) !important;
}
/* Broad catch for all inline-styled text on this page (incl. JS-generated result card) */
html.dark [style*="color:#1A1F36"] { color: #E2E8F0 !important; }
html.dark [style*="color:#6B7280"] { color: #94A3B8 !important; }
html.dark .cfg-opt-label { color: #E2E8F0 !important; }
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/tools/welcher-bootsfuehrerschein.astro
git commit -m "fix(tool-page): dark mode for welcher-bootsfuehrerschein inline styles"
```

---

## Task 8: Push to GitHub

- [ ] **Push all commits**

```bash
git push
```
