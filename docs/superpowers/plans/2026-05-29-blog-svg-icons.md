# Blog SVG Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace emoji category icons in compact blog cards with clean monochrome SVG icons (Heroicons stroke style).

**Architecture:** Single file change — `src/components/BlogCard.astro`. The `categoryIcons` map is updated to return SVG path markup strings instead of emoji characters. The compact card template uses Astro's `set:html` directive to render the SVG inline inside a wrapper `<svg>` element.

**Tech Stack:** Astro 5, inline SVG (no external dependency), Heroicons stroke style (24×24 viewBox)

---

### Task 1: Replace emoji icons with SVG in BlogCard

**Files:**
- Modify: `src/components/BlogCard.astro` (lines 18–24 and 46)

- [ ] **Step 1: Open the file and verify current state**

The file currently has this `categoryIcons` map and uses `{icon}` directly in the compact template:

```astro
const categoryIcons: Record<string, string> = {
  'Tipps': '💡', 'Prüfung': '📋', 'Binnen': '🌊', 'See': '⛵',
  'Vorbereitung': '📚', 'Vergleich': '⚖️', 'Leitfaden': '🗺️',
  'Tips': '💡', 'Exam': '📋', 'Preparation': '📚', 'Guide': '🗺️',
};
const secondTag = tags.length > 0 ? (tags[1] ?? tags[0]) : '';
const icon = secondTag ? (categoryIcons[secondTag] ?? '⚓') : '⚓';
```

And in the compact template:
```astro
<div class="blog-icon">{icon}</div>
```

- [ ] **Step 2: Replace `categoryIcons` map with SVG path strings**

Replace the entire `categoryIcons` block (lines 18–24) with:

```astro
const categoryIcons: Record<string, string> = {
  'Tipps':        '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />',
  'Tips':         '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />',
  'Prüfung':      '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />',
  'Exam':         '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />',
  'Binnen':       '<path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25C5.25 6 7.5 8.25 9.75 8.25S14.25 6 16.5 6s4.5 2.25 4.5 2.25M3 14.25c2.25-2.25 4.5 0 6.75 0s4.5-2.25 6.75-2.25 4.5 2.25 4.5 2.25" />',
  'See':          '<path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />',
  'Vorbereitung': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />',
  'Preparation':  '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />',
  'Vergleich':    '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />',
  'Leitfaden':    '<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />',
  'Guide':        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />',
};
const secondTag = tags.length > 0 ? (tags[1] ?? tags[0]) : '';
const iconPaths = secondTag ? (categoryIcons[secondTag] ?? categoryIcons['Prüfung']!) : categoryIcons['Prüfung']!;
```

Note: the variable is renamed from `icon` to `iconPaths` to make its type clear.

- [ ] **Step 3: Update the compact card template to render SVG**

Find the compact variant in the template (the `<div class="blog-icon">{icon}</div>` line) and replace it:

```astro
<div class="blog-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none"
       stroke="white" stroke-width="1.75"
       stroke-linecap="round" stroke-linejoin="round"
       set:html={iconPaths} />
</div>
```

- [ ] **Step 4: Verify the build passes**

Run:
```bash
cd /Users/mariusgehler/boatpass-website && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed in` with no errors. If there are TypeScript errors about `iconPaths` being `string | undefined`, the fallback in Step 2 handles that — double-check the fallback expression uses `!` non-null assertion correctly.

- [ ] **Step 5: Spot-check in browser**

Run:
```bash
cd /Users/mariusgehler/boatpass-website && npm run dev &
```

Open http://localhost:4321 and scroll to the Blog section. The two compact cards on the right should show navy gradient boxes with white SVG icons — no emoji.

- [ ] **Step 6: Commit**

```bash
cd /Users/mariusgehler/boatpass-website
git add src/components/BlogCard.astro
git commit -m "feat: Emojis in Blog-Karten durch SVG-Icons ersetzt"
```

- [ ] **Step 7: Deploy**

```bash
cd /Users/mariusgehler/boatpass-website && npx netlify deploy --build --prod 2>&1 | tail -10
```

Expected: `Deploy is live!`
