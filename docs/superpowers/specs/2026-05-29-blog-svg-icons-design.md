# Blog SVG Icons Design

**Goal:** Replace emoji category icons in compact blog cards with clean SVG icons (Heroicons stroke style).

**Architecture:** Single file change — `src/components/BlogCard.astro`. The `categoryIcons` map changes from emoji strings to inline SVG markup. The icon box container stays identical.

**Tech Stack:** Astro 5, inline SVG (no external library), Heroicons stroke style (24×24 viewBox, stroke="white", stroke-width="2")

---

## Changes

### `src/components/BlogCard.astro`

**Replace** `categoryIcons` map (currently returns emoji strings) with a map returning SVG inner markup (the `<path>` and other child elements only — not the `<svg>` wrapper).

**Icon mapping:**

| Key | Icon | SVG paths |
|---|---|---|
| Tipps / Tips | Lightbulb | `<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />` |
| Prüfung / Exam | Clipboard list | `<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />` |
| Binnen | Waves | `<path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25C5.25 6 7.5 8.25 9.75 8.25S14.25 6 16.5 6s4.5 2.25 4.5 2.25M3 14.25c2.25-2.25 4.5 0 6.75 0s4.5-2.25 6.75-2.25 4.5 2.25 4.5 2.25" />` |
| See | Anchor | `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m-7-9H4m16 0h-1M5.636 5.636l.707.707M17.657 17.657l.707.707M5.636 18.364l.707-.707M17.657 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />` |
| Vorbereitung / Preparation | Book open | `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />` |
| Vergleich | Scale | `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />` |
| Leitfaden / Guide | Map | `<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />` |
| Default (⚓ fallback) | Anchor | `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 12v5m-4-2.5l-1.5 1.5M16 18.5l1.5 1.5M6 9H3m18 0h-3m-1.172-3.828A4 4 0 008.172 9.17M9 12a3 3 0 106 0 3 3 0 00-6 0z" />` |

**Template change (compact variant):**

The `blog-icon` div renders an `<svg>` wrapper with the icon markup inside (using `set:html` for the SVG paths):

```astro
<div class="blog-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
       fill="none" stroke="white" stroke-width="1.75"
       stroke-linecap="round" stroke-linejoin="round"
       set:html={icon} />
</div>
```

The `icon` variable now holds an SVG path string instead of an emoji character.

## No other changes

- Featured card: unchanged
- BlogTeaser layout: unchanged
- BlogLayout: unchanged
- i18n strings: unchanged
- CSS: unchanged (icon box size/style stays)
