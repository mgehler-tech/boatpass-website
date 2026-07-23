# CLAUDE.md

Boatpass is a bilingual (DE/EN) static marketing + content site for German
boating licenses (Sportbootführerschein / SBF, UBI/SRC/LRC radio certs).
Built with **Astro 6**, **Tailwind CSS v4**, deployed to **Netlify**.
Live at https://boatpass.de. SEO/GEO is the core product concern — most of the
non-obvious complexity exists to serve search engines and AI crawlers.

## Commands

Node **>= 22.12** (`.nvmrc`). All commands run from repo root.

| Command             | Action                                      |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Dev server at `localhost:4321`              |
| `npm run build`     | Production build to `./dist/`               |
| `npm run preview`   | Preview the production build                |
| `npm run astro check` | Type-check `.astro`/TS (run before commits) |

There is no test runner or linter. `astro check` is the correctness gate.

## Architecture

- **`src/pages/`** — file-based routes. DE pages live at the root
  (`sbf-binnen.astro` → `/sbf-binnen`); the EN mirror lives under
  `src/pages/en/`. Many pages are hand-built SEO landing pages
  (`sbf-*`, `ubi`, `src`, `lrc`, `funkschein-app`, `tools/`).
- **`src/content/blog/{de,en}/*.md`** — the blog collection. Schema is defined
  in `src/content.config.ts` (Zod). ~48 posts per language.
- **`src/layouts/`** — `BaseLayout.astro` (all pages) and `BlogLayout.astro`
  (blog posts, adds JSON-LD).
- **`src/components/`** — `SEO.astro` owns `<head>`/meta/canonical/hreflang;
  reusable sections (`HeroSection`, `PricingSection`, `AppLandingPage`, etc.).
- **`src/i18n/`** — `de.ts` / `en.ts` translation tables. Use
  `useTranslations(lang)`, `getLangFromUrl(url)`, `getLocalizedPath(lang, path)`.
- **`src/data/apps.ts`** — app metadata & ratings (`AppRating` type).
- **`src/pages/og/`** — dynamic OG images via `astro-og-canvas`.

## Conventions (important, easy to get wrong)

- **Bilingual parity.** New DE page/post usually needs an EN counterpart. Link
  the two: pages via `SEO`'s `hasAlternate`/`altUrl`, blog posts via the
  `altSlug` frontmatter field (drives DE↔EN hreflang). If a page is
  intentionally single-language, set `hasAlternate={false}` — don't emit
  hreflang to a URL that doesn't exist.
- **Blog frontmatter** (see `content.config.ts` for the authoritative schema):
  - `seoTitle` — optional, **max 47 chars** (the `<title>` gets ` | Boatpass`
    appended and Google truncates at ~60). Only set it when `title` is too long.
  - `faq` / `howTo` — optional; when present they generate FAQPage / HowTo
    JSON-LD in `BlogLayout`. **They must mirror content visible on the page** —
    invented Q&A violates Google's rich-result rules.
  - `updated` — set on meaningful content edits (freshness signal for
    `dateModified`); don't bump it for trivial changes.
- **JSON-LD lives in `BlogLayout.astro`** (Article, Breadcrumb, + optional
  FAQ/HowTo). E-E-A-T/author schema ties back to `/ueber-uns/`.
- **Sitemap priorities** are hand-tuned in `astro.config.mjs` `serialize()`.
  Money/pillar pages rank high, legal pages low. **No `lastmod` is emitted on
  purpose** — a per-build `new Date()` is a false freshness signal. If you add a
  new URL pattern that matters, add it to the priority rules there.
- **Styling** is Tailwind v4 (via `@tailwindcss/vite`, no config file);
  globals in `src/styles/global.css`. Font is self-hosted Inter (`@fontsource`).
- **Language of prose:** site content is German-first; inline code comments in
  this repo are German — match that when editing existing files.

## Automation & CI (`.github/workflows/`)

- `lighthouse-ci.yml` — Core Web Vitals budget (`.lighthouserc.js`,
  `scripts/lh-assert.mjs`). Keep pages fast; don't regress LCP/CLS.
- `daily-rebuild.yml` — nightly rebuild/deploy.
- `seo-autopilot.yml`, `aeo-autopilot.yml`, `gsc-feedback.yml` — scheduled
  SEO/GEO agents. `scripts/fetch-gsc-data.mjs` + `analyze-gsc-data.mjs` pull
  Search Console data. Playbooks live in `docs/seo-automation/` and
  `docs/blog-automation/`.

## Notes

- Deploy target is Netlify (`.netlify/` is gitignored); `astro.config.mjs`
  `site` must stay `https://boatpass.de` for correct canonical/sitemap URLs.
- Planning docs and design specs live under `docs/superpowers/`.
