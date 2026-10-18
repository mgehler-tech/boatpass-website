# Runde 2a: Lernweg kompakt und Preisliste mit Paket-Karten – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Der Lernweg der Startseite wird rund 40 Prozent kürzer und trägt jede Etappennummer nur einmal; die Preisliste zeigt Einzellizenzen als verlinkte Zeilen mit vier bündigen Spalten und je Gruppe eine Paket-Karte.

**Architecture:** Zwei Astro-Komponenten der Startseite (`HomeJourney.astro`, `HomePricing.astro`) ändern Markup und ihr `<style is:global>`; die Daten (Preise, Fragenzahlen, Texte) kommen weiter aus `data/stores.ts` und `i18n`. Verhalten (ScrollTrigger, IntersectionObserver, Geräteweiche) bleibt unangetastet. Eine neue Playwright-Datei pinnt Höhen, Spaltenbündigkeit, Linkziele und die Zahl der Store-Links.

**Tech Stack:** Astro 6, CSS mit `--h-*`-Tokens (brand.css), Playwright 1.62 (`npx playwright test`, Server `astro build && astro preview` auf 4321).

**Spec:** `docs/superpowers/specs/2026-10-18-premium-round-2-design.md`, Abschnitte 5.1, 5.2, 6.

**Branch:** `feat/premium-round-2a` (von `main`, Worktree `.claude/worktrees/premium-polish`). Ein PR am Ende.

## Global Constraints

- Keine Emojis, keine Pfeil-/Dreieckszeichen im UI; Icons über `Icon.astro` aus `src/icons.ts` (`chevronRight` vorhanden).
- EN spiegelt DE: jeder neue i18n-Schlüssel in `src/i18n/de.ts` **und** `src/i18n/en.ts`; jeder entfernte in beiden.
- Store-Links in `#pricing`: genau drei generische Play-Links ohne `data-store` (zwei Paket-Buttons `data-cta-position="pricing-bundle"`, ein `pricing-cta`); die Geräteweiche des BaseLayouts schreibt sie am Desktop auf `/app/` um.
- Bindende Lernweg-Schwellen: `[data-journey]` < 2100 px bei 1440×900 und < 1750 px bei 1280×620. Werden sie gerissen, sinkt zuerst das Padding, dann `min-height` (nicht unter 40vh); die Schwellen bleiben.
- E2E-Runbook: Port 4321 vor dem Lauf freimachen (`lsof -ti:4321 | xargs kill`), Plausible im `beforeEach` abfangen, unter Last `--workers=1`. `npx astro check`: 47 Alt-Fehler sind bekannt, neue nicht erlaubt.
- Commits enden mit `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; nach jedem Commit pushen (Vorgabe des Inhabers).

## Review Focus

1. **Lenis und programmatisches Scrollen:** Der Etappentest scrollt per `scrollIntoView`; Lenis (≥1024 px) darf das nicht zurückrollen. Test in Task 1 prüft `is-active` für alle vier Etappen bei 1280×620; bricht er, Fallback `page.mouse.wheel` statt `scrollIntoView` (im Test, nicht im Produkt).
2. **Preisliste auf iOS-Geräten:** `PlatformPrice` zeigt dort den App-Store-Preis, die Ersparnis-Zeile wechselt über `.pp-ios`. Task 2 prüft mit `html[data-platform="ios"]`-Emulation (User-Agent iPhone wie in `store-routing.spec.ts`), dass die Karte genau eine Ersparnis-Zeile sichtbar hat.
3. **Zeile als Link, Kind-Inhalte ohne eigene Links:** In `a.hp-row` dürfen keine weiteren `a` oder Buttons liegen (verschachtelte interaktive Elemente). Task 3 prüft `a.hp-row a, a.hp-row button` → 0.
4. **Schmale Breite (360 px):** Vier Spalten stapeln; kein horizontaler Überlauf durch `min-width` der Zellen. Task 3 prüft `scrollWidth <= innerWidth` bei 360 px auf `/`.
5. **Reduced motion:** Die Chevron-Verschiebung und der Zeilen-Hover sind Transitionen; `prefers-reduced-motion: reduce` schaltet sie ab (bestehendes Muster `@media (prefers-reduced-motion: reduce)` in der Komponente). Task 3 ergänzt die Regel; Sichtprüfung reicht.

---

### Task 1: Lernweg kompakt

**Files:**
- Modify: `src/components/home/HomeJourney.astro` (Markup Z. 76–80, Styles `.hj-kicker` Z. 182–187, Desktop-Block Z. 226–230)
- Modify: `src/i18n/de.ts` (`home.journeyStage`), `src/i18n/en.ts` (gleicher Schlüssel)
- Test: `tests/e2e/premium-round-2.spec.ts` (neu)

**Interfaces:**
- Produces: Testdatei mit `test.beforeEach` (Plausible-Abfang) und `describe('Lernweg kompakt')`; spätere Tasks hängen weitere `describe`-Blöcke an.

- [ ] **Step 1: Testdatei anlegen und den Lernweg-Test schreiben**

```ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/plausible\.io/, r => r.abort());
});

test.describe('Lernweg kompakt', () => {
  for (const vp of [{ w: 1440, h: 900, max: 2100 }, { w: 1280, h: 620, max: 1750 }]) {
    test(`unter ${vp.max}px bei ${vp.w}x${vp.h}, kein Kicker, alle Etappen werden aktiv`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      await expect(page.locator('.hj-kicker')).toHaveCount(0);
      await expect(page.locator('.hj-marker')).toHaveCount(4);
      expect((await page.locator('[data-journey]').boundingBox())!.height).toBeLessThan(vp.max);
      for (let i = 0; i < 4; i++) {
        const step = page.locator(`[data-journey-step="${i}"]`);
        await step.evaluate(el => el.scrollIntoView({ block: 'center' }));
        await expect(step).toHaveClass(/is-active/);
      }
    });
  }
  test('Kicker auch am Handy weg, Screenshot je Etappe bleibt', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('.hj-kicker')).toHaveCount(0);
    await expect(page.locator('.hj-shot')).toHaveCount(4);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag sehen**

Run: `lsof -ti:4321 | xargs kill; npx playwright test tests/e2e/premium-round-2.spec.ts --reporter=line`
Expected: FAIL – `.hj-kicker` hat 4 Treffer, Höhe 3150 > 2100.

- [ ] **Step 3: Markup und CSS ändern**

In `HomeJourney.astro`: `<p class="hj-kicker">…</p>` und `const total` entfernen; `.hj-kicker`-Regel entfernen; im `@media (min-width: 1024px)`-Block `.hj-step { min-height: 44vh; padding: 28px 0 36px; }` und die Regel `.hj-step--quiz { min-height: 110vh; }` streichen (Klasse bleibt am `li`, weil `.h-js .hj-step--quiz .hj-shot` sie braucht). Kommentar im Dateikopf (Z. 2–8) auf den neuen Stand bringen. In `de.ts`/`en.ts` den Schlüssel `journeyStage` entfernen; `grep -rn journeyStage src` muss leer sein.

- [ ] **Step 4: Test laufen lassen, Erfolg sehen; Höhen notieren**

Run: wie Step 2. Expected: PASS. Zusätzlich die gemessenen Höhen für die PR-Beschreibung festhalten (vorher 3150 px bei 1440×900).

- [ ] **Step 5: Bestehende Journey-Tests gegenprüfen**

Run: `npx playwright test tests/e2e/premium-polish.spec.ts -g "Journey" tests/e2e/conversion-journeys.spec.ts --reporter=line`
Expected: PASS.

- [ ] **Step 6: Commit und Push**

```bash
git add src/components/home/HomeJourney.astro src/i18n/de.ts src/i18n/en.ts tests/e2e/premium-round-2.spec.ts
git commit -m "design(journey): Etappen auf 44vh, Quiz auf Inhaltshoehe, Kicker entfaellt"
git push -u origin feat/premium-round-2a
```

---

### Task 2: Preisliste – Pakete als Karten

**Files:**
- Modify: `src/components/home/HomePricing.astro` (Datenmodell Z. 36–74, Markup Z. 102–150, Styles ab Z. 200)
- Modify: `src/i18n/de.ts`, `src/i18n/en.ts` (unter `pricing`: `catalogsLabel`, `bundleNote`)
- Test: `tests/e2e/premium-round-2.spec.ts`

**Interfaces:**
- Produces: `type Bundle = { name: string; sub: string; questions: string; product: ProductKey; parts: ProductKey[]; badge: string; choose: string }`; `groups: { key: 'sbf' | 'funk'; title: string; note?: string; rows: Row[]; bundle: Bundle }[]`; `Row` verliert `parts`, `badge`, `external`. Markup-Hülle `div.hp-group-body` (Zeilen + Karte), die Task 3 weiterverwendet.
- i18n: `pricing.catalogsLabel` = `'Kataloge'` / `'catalogues'`; `pricing.bundleNote` = `'Einmalkauf, kein Abo. Alle Lernfunktionen inklusive.'` / `'One-off purchase, no subscription. All study features included.'`.

- [ ] **Step 1: Test schreiben**

```ts
test.describe('Preisliste: Paket-Karten', () => {
  test('je Gruppe eine Karte rechts neben den Zeilen, drei Store-Links bleiben', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const cards = page.locator('#pricing .hp-bundle');
    await expect(cards).toHaveCount(2);
    await expect(page.locator('#pricing .hp-row--bundle')).toHaveCount(0);
    await expect(cards.nth(0)).toContainText('Binnen + See');
    await expect(cards.nth(0)).toContainText(/2 Kataloge/);
    await expect(cards.nth(1)).toContainText(/3 Kataloge/);
    await expect(cards.nth(0).locator('s.h-num')).toHaveCount(2); // Streichpreis je Store im DOM
    await expect(cards.nth(0).locator('a[data-cta-position="pricing-bundle"].h-btn')).toHaveCount(1);
    await expect(page.locator('#pricing a[href="/app/"]')).toHaveCount(3);
    const rows = (await page.locator('#pricing .hp-group').first().locator('.hp-rows').boundingBox())!;
    const card = (await cards.nth(0).boundingBox())!;
    expect(card.x).toBeGreaterThanOrEqual(rows.x + rows.width);
    expect(Math.abs(card.y - rows.y)).toBeLessThan(2);
  });
  test('am Handy unter den Zeilen, iOS zeigt eine Ersparnis-Zeile', async ({ page, browser }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const rows = (await page.locator('#pricing .hp-group').first().locator('.hp-rows').boundingBox())!;
    const card = (await page.locator('#pricing .hp-bundle').first().boundingBox())!;
    expect(card.y).toBeGreaterThanOrEqual(rows.y + rows.height);
    const ios = await browser.newContext({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', viewport: { width: 390, height: 844 } });
    const p2 = await ios.newPage();
    await p2.route(/plausible\.io/, r => r.abort());
    await p2.goto('/');
    await expect(p2.locator('html')).toHaveAttribute('data-platform', 'ios');
    await expect(p2.locator('#pricing .hp-bundle').first().locator('.hp-bundle-save span:visible')).toHaveCount(1);
    await ios.close();
  });
  test('EN parity', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#pricing .hp-bundle').nth(0)).toContainText(/2 catalogues/);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag sehen**

Run: `npx playwright test tests/e2e/premium-round-2.spec.ts -g "Paket" --reporter=line`
Expected: FAIL – `.hp-bundle` 0 Treffer.

- [ ] **Step 3: Datenmodell und Markup**

In `HomePricing.astro`: `groups` auf `{ key, title, note?, rows, bundle }` umbauen (Pakete aus `rows` herausnehmen). Markup je Gruppe:

```astro
<div class="hp-group-body">
  <ul class="hp-rows">…bestehende Zeilen ohne Paket…</ul>
  <aside class="hp-bundle" aria-labelledby={`hp-bundle-${group.key}`} data-reveal>
    <span class="hp-badge">{group.bundle.badge}</span>
    <h4 id={`hp-bundle-${group.key}`} class="hp-bundle-title">{group.bundle.name}</h4>
    <p class="hp-bundle-sub">{group.bundle.sub}</p>
    <p class="hp-bundle-meta h-num"><strong>{group.bundle.questions}</strong> {h.colQuestions} · {group.bundle.parts.length} {p.catalogsLabel}</p>
    <p class="hp-bundle-price h-num"><PlatformPrice product={group.bundle.product} lang={lang} /></p>
    <p class="hp-bundle-save">{bundleInfo(group.bundle.product, group.bundle.parts).map(b => <span class={b.cls}><s class="h-num">{b.strike}</s> · {saveLabel} {b.save}</span>)}</p>
    <a class="h-btn h-btn--sm hp-bundle-cta" href={playStoreUrl} target="_blank" rel="noopener noreferrer" data-cta-position="pricing-bundle">{group.bundle.choose}<Icon name="chevronRight" size={16} strokeWidth={2.25} class="h-btn-arrow" /><span class="sr-only h-off-desktop">{h.newTab}</span></a>
    <p class="hp-bundle-note">{p.bundleNote}</p>
  </aside>
</div>
```

Styles: `.hp-group-body` ab 1024 px `display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px 40px; align-items: start`; darunter Block, Karte `margin-top: 24px`. `.hp-bundle`: `padding: 28px` (24 px unter 640 px), `border-radius: var(--h-r)`, `background: var(--h-card)`, `box-shadow` wie `.hp-model`. Titel Archivo (`--h-display`, Stretch 84 %, 700) 26 px; Preis Archivo 36 px (Stretch 82 %, 720), `.hp-bundle-save` 13 px `--h-blue-ink`; Button `margin-top: 20px`; Note 12,5 px `--h-muted`. `.hp-row--bundle`-Regel löschen.

- [ ] **Step 4: Test laufen lassen, Erfolg sehen**

Run: wie Step 2. Expected: PASS. Dazu `npx playwright test tests/e2e/conversion-journeys.spec.ts tests/e2e/mobile-conversion-journeys.spec.ts --reporter=line` → PASS (Store-Link-Zählung).

- [ ] **Step 5: Commit und Push**

```bash
git add src/components/home/HomePricing.astro src/i18n/de.ts src/i18n/en.ts tests/e2e/premium-round-2.spec.ts
git commit -m "design(pricing): Pakete als Karten neben den Lizenzzeilen"
git push
```

---

### Task 3: Preisliste – Zeilen als Links mit vier bündigen Spalten

**Files:**
- Modify: `src/components/home/HomePricing.astro` (Zeilen-Markup, `.hp-row*`-Styles)
- Test: `tests/e2e/premium-round-2.spec.ts`

**Interfaces:**
- Consumes: `Row` aus Task 2 (ohne Paket-Felder), `div.hp-group-body`.
- Produces: `li > a.hp-row[href]` mit Zellen `.hp-name`, `.hp-cell--q`, `.hp-cell--t`, `.hp-price`, `.hp-chevron`; `.hp-action` existiert nicht mehr.

- [ ] **Step 1: Test schreiben**

```ts
test.describe('Preisliste: Zeilen als Links', () => {
  test('vier bündige Spalten, Zeile führt zur Detailseite', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const rows = page.locator('#pricing .hp-group').first().locator('a.hp-row');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toHaveAttribute('href', '/sbf-binnen/');
    await expect(rows.nth(0)).toHaveAccessibleName(/SBF Binnen.*300.*Details ansehen/s);
    await expect(page.locator('#pricing .hp-action')).toHaveCount(0);
    await expect(page.locator('#pricing a.hp-row a, #pricing a.hp-row button')).toHaveCount(0);
    const all = page.locator('#pricing a.hp-row');
    for (const cell of ['.hp-cell--q', '.hp-cell--t', '.hp-price', '.hp-chevron']) {
      const xs = await all.locator(cell).evaluateAll(els => els.map(e => e.getBoundingClientRect().x));
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(1);
    }
  });
  test('kein horizontaler Überlauf bei 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await expect(page.locator('#pricing a.hp-row').first().locator('.hp-chevron')).toBeVisible();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag sehen**

Run: `npx playwright test tests/e2e/premium-round-2.spec.ts -g "Zeilen" --reporter=line`
Expected: FAIL – `a.hp-row` 0 Treffer.

- [ ] **Step 3: Zeilen umbauen**

Markup je Zeile: `<li><a class="hp-row" href={row.href}>` mit `.hp-name` (main, sub, note), `.hp-cell.hp-cell--q`, `.hp-cell.hp-cell--t`, `.hp-price` (`.hp-price-num` + `.hp-price-sub` = `h.once`), `<span class="hp-chevron" aria-hidden="true"><Icon name="chevronRight" size={18} strokeWidth={2.25} /></span>`, und am Ende `<span class="sr-only">, {row.action}</span>`. Kein sichtbarer Linktext mehr.

CSS: `.hp-row { display: grid; color: inherit; text-decoration: none; margin-inline: -12px; padding: 20px 12px; min-height: 72px; border-bottom: 1px solid var(--h-line-2); border-radius: var(--h-r-sm); grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'name chev' 'q t' 'price price'; gap: 10px 16px; align-items: baseline; transition: background-color 0.2s ease; }` · `.hp-row:hover { background: var(--h-blue-wash); }` · `.hp-row:focus-visible { outline: 3px solid var(--h-blue); outline-offset: 2px; }` · ab 900 px `grid-template-columns: minmax(0, 1fr) 110px 110px 170px 20px; grid-template-areas: 'name q t price chev'; gap: 24px;` · `.hp-chevron { grid-area: chev; justify-self: end; align-self: center; color: var(--h-blue-ink); transition: transform 0.3s var(--h-ease); }` · `.hp-row:hover .hp-chevron { transform: translateX(4px); }` · `.hp-price-num` 24 px. Reduced motion: `.hp-row, .hp-chevron { transition: none; }` im bestehenden `prefers-reduced-motion`-Block (anlegen, falls in dieser Komponente noch keiner existiert). Alte `.hp-action`-Regeln löschen.

- [ ] **Step 4: Test laufen lassen, Erfolg sehen**

Run: wie Step 2, dann `npx playwright test tests/e2e/premium-round-2.spec.ts tests/e2e/conversion-journeys.spec.ts tests/e2e/mobile-conversion-journeys.spec.ts --reporter=line`
Expected: PASS.

- [ ] **Step 5: Commit und Push**

```bash
git add src/components/home/HomePricing.astro tests/e2e/premium-round-2.spec.ts
git commit -m "design(pricing): Lizenzzeilen als Links mit vier buendigen Spalten"
git push
```

---

### Task 4: Gesamtlauf, Sichtung, Review, PR

**Files:**
- Keine Produktänderung außer Review-Fixes.

- [ ] **Step 1: Build und Typen**

Run: `npx astro build 2>&1 | tail -3 && npx astro check 2>&1 | grep -E "^Result|errors"`
Expected: Build complete; astro check: 47 errors (keine neuen).

- [ ] **Step 2: Volle E2E-Suite**

Run: `lsof -ti:4321 | xargs kill; npx playwright test --reporter=line`
Expected: alles grün; bei Lastflakes mit `--workers=1` wiederholen.

- [ ] **Step 3: Sichtung im Browser-Pane**

Branch-Build auf 4324 servieren (`npm run preview -- --port 4324 --host 127.0.0.1`), Lernweg und Preisliste bei 1440×900, 1280×620, 375 hell und dunkel prüfen (Karte rechts, Spalten bündig, Chevron, Hover). Screenshots für die PR-Beschreibung.

- [ ] **Step 4: Frischer Reviewer über den Branch** (Vorgabe des Inhabers aus Runde 1: Native, ein Reviewer am Ende)

Reviewer liest Spec 5.1/5.2 und `git diff main...HEAD`; Befunde beheben, Tests erneut laufen lassen, committen, pushen.

- [ ] **Step 5: PR öffnen und binden**

`gh pr create --base main --title "design: Lernweg kompakt, Preisliste mit Paket-Karten (Runde 2a)"`, Beschreibung mit Vorher/Nachher-Höhen und Screenshots, Fußzeile `🤖 Generated with [Claude Code](https://claude.com/claude-code)`; danach `mcp__ccd_pr__get_status`/`bind_pr`.
