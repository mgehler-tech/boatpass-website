# Runde 2b: Lizenzseiten auf Rahmen, Seitenkopf und Tokens – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die fünf Lizenzseiten und die Führerschein-Übersicht (DE und EN, 12 Seiten) bekommen den Seitenkopf, die Spaltenordnung und das Klassen-Vokabular der neuen Startseiten-Sprache; keine Inline-Farben mehr, Dark Mode über Tokens.

**Architecture:** Ein Stylesheet `page.css` (Präfix `pg-`, lädt Archivo) und vier kleine Komponenten (`PageHead`, `PageLayout`, `PageFacts`, `PageLink`) ersetzen den Inline-Hero und die 800-px-Spalte. Die Seiten behalten Texte, Reihenfolge, Schema-Blöcke und Links; nur Hüllen und Klassen wechseln. `PracticeBridge` wird zweisprachig und tokenisiert, damit DE und EN denselben Baustein nutzen. Eine Playwright-Datei prüft Kopf, Spalten, Farbfreiheit und Conversion-Hooks pro Seite.

**Tech Stack:** Astro 6, CSS-Tokens (brand.css), `@fontsource-variable/archivo/wdth.css`, Playwright 1.62, Lighthouse 13.5 (`npx lighthouse`).

**Spec:** `docs/superpowers/specs/2026-10-18-premium-round-2-design.md`, Abschnitte 4, 5.3, 5.4, 6, 9.

**Branch:** `feat/premium-round-2b` von `main` (unabhängig von 2a; einziger gemeinsamer Berührungspunkt sind `de.ts`/`en.ts` mit getrennten Schlüsseln). Ein PR am Ende.

## Global Constraints

- Conversion-Hooks je Lizenzseite: der erste Store-Link in `main` ist ein generischer Play-Link ohne `data-store` (`main a[href="/app/"]` am Desktop sichtbar; `main a[href*="play.google.com"]:not([data-store])` → 0 nach der Umschreibung). Tests `conversion-journeys*.spec.ts` und `store-routing.spec.ts` bleiben grün.
- Keine Emojis, keine „→"/„▶"-Zeichen; Icons über `Icon.astro`.
- Texte, Schema.org-Blöcke, Breadcrumbs, URLs, hreflang, interne Links: unverändert. Reihenfolge der Abschnitte: unverändert.
- Farben nur über `--h-*`-Tokens; in den 12 Dateien und in `PracticeBridge` kein `style="…"` mit Farbwert mehr (`main [style*="#1A1F36"], main [style*="background:white"], main [style*="#3366FF"], main [style*="#4B5563"], main [style*="#656B78"]` → 0).
- Archivo nur über `page.css` (Import im `PageHead`), nicht in `global.css`.
- Lighthouse mobil `/sbf-binnen/`: LCP-Verschlechterung über 150 ms wird gemeldet, nicht still hingenommen.
- E2E-Runbook und Commit-Regeln wie in Plan 2a.

## Review Focus

1. **Geräteweiche ohne `home.css`:** Auf Lizenzseiten lädt `home.css` nicht; `StoreCta` zeigt sonst beide Symbole. Task 1 verschiebt `.h-on-*`/`.h-off-*`/`.h-num` nach `brand.css` und testet auf `/sbf-binnen/`, dass im Kopf-Button genau ein Symbol sichtbar ist (Desktop: `.h-off-android` sichtbar, `.h-on-android` unsichtbar).
2. **Aside-Reihenfolge am Handy und für Screenreader:** Die Fakten-Karte steht im DOM vor `.pg-main`; der Antwort-Kasten bleibt das erste Element von `.pg-main`. Task 3 prüft bei 375 px: `.pg-aside` oberhalb von `.pg-main`; bei 1280 px: rechts daneben, `position: sticky`.
3. **Sticky Aside länger als Viewport:** Bei 1280×620 darf die Karte nicht abgeschnitten kleben. Task 3 begrenzt `.pg-aside` auf `max-height: calc(100vh - 88px - 24px); overflow: auto` und prüft, dass ihr unterer Rand ≤ `innerHeight` bleibt.
4. **Funkseiten-Badge mit Preis am Handy:** Der Preis muss im Kopf sichtbar bleiben (Aside-Preis ist unter 1024 px ausgeblendet). Task 6 prüft bei 375 px auf `/ubi/`: `.pg-head .pg-badge` sichtbar und enthält „€".
5. **Dark Mode ohne Attribut-Hacks:** Task 3 prüft mit `colorScheme: 'dark'`, dass `.pg-card` den `--h-card`-Dunkelwert (#171D2B) als Hintergrund hat und `.pg-answer` keinen weißen Hintergrund.

---

### Task 1: Seitenweite Hilfsklassen und Kopf-Bausteine, erster Kopf auf SBF Binnen

**Files:**
- Modify: `src/styles/brand.css` (anhängen), `src/styles/home.css` (Z. 51 `.h-num`, Z. 93–101 Geräteweiche entfernen)
- Create: `src/styles/page.css`, `src/components/StoreRating.astro`, `src/components/page/PageHead.astro`, `src/components/page/PageLink.astro`
- Modify: `src/components/home/HomeHero.astro` (Bewertungszeile durch `StoreRating` ersetzen, Styles `.hh-rating*` mitnehmen)
- Modify: `src/pages/sbf-binnen.astro` (nur der Hero-Block Z. 143–162)
- Test: `tests/e2e/licence-pages.spec.ts` (neu)

**Interfaces:**
- Produces `StoreRating.astro`: Props `{ lang: 'de' | 'en' }`; rendert `p.hh-rating` mit `.hh-stars` und `.hh-rating-text` (Markup wie heute im Hero, Klassen bleiben, damit `premium-polish.spec.ts` greift) oder nichts, wenn `getBoatpassCombinedRating()` null ist.
- Produces `PageHead.astro`: Props `{ lang: 'de' | 'en'; eyebrow: string; lede: string; cta?: boolean; ctaLabel?: string; position?: string }` (default `position = 'page-head'`); Slots: Default (H1-Inhalt, darf `<br />` enthalten), `badge` (optional). Rendert `header.pg-head > .h-container > p.pg-eyebrow, h1.pg-title, p.pg-lede, [slot badge als .pg-badge], div.pg-actions > StoreCta + StoreRating`. Importiert `../../styles/page.css`.
- Produces `PageLink.astro`: Props `{ lang: 'de' | 'en'; href: string; external?: boolean; class?: string }`, Slot = Linktext; rendert `a.pg-link` mit `Icon chevronRight` 16 px; bei `external` `target="_blank" rel="noopener noreferrer"` und `sr-only`-Hinweis `(öffnet in neuem Tab)` / `(opens in new tab)` nach `lang`.
- Produces `page.css`-Klassen für diesen Task: `.pg-head`, `.pg-eyebrow`, `.pg-title`, `.pg-lede`, `.pg-badge`, `.pg-actions`, `.pg-link`; Werte aus Spec 5.3 „Seitenkopf". Haarlinie unter dem Kopf: `.pg-head::after` über die Containerbreite.
- `brand.css` erhält unverändert die Regeln aus `home.css` Z. 51 und Z. 93–101 (`.h-num`, `.h-on-android`, `.h-on-ios`, `.h-off-android`, `.h-on-other`, `.h-off-desktop`, `.h-btn-mark svg`).

- [ ] **Step 1: Test schreiben**

```ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/plausible\.io/, r => r.abort());
});

test.describe('Seitenkopf', () => {
  test('SBF Binnen: Archivo-Titel bündig zum Logo, Store-Button mit einem Symbol, Bewertung', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/sbf-binnen/');
    const title = page.locator('h1.pg-title');
    await expect(title).toContainText('SBF Binnen lernen');
    expect(await title.evaluate(el => getComputedStyle(el).fontFamily)).toMatch(/Archivo/);
    const logo = (await page.locator('.logo-link').boundingBox())!;
    expect(Math.abs((await title.boundingBox())!.x - logo.x)).toBeLessThanOrEqual(1);
    await expect(page.locator('.pg-head p.pg-eyebrow')).toHaveText('Sportbootführerschein Binnen');
    const cta = page.locator('.pg-actions a[data-cta-position="page-head"]');
    await expect(cta).toHaveAttribute('href', '/app/');
    await expect(cta.locator('.h-off-android')).toBeVisible();
    await expect(cta.locator('.h-on-android')).toBeHidden();
    await expect(page.locator('.pg-actions .hh-rating')).toContainText(/4,96/);
    await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
  });
  test('Startseite behält ihre Bewertungszeile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hh-actions .hh-rating')).toContainText(/4,96 · 29 Bewertungen/);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag sehen**

Run: `lsof -ti:4321 | xargs kill; npx playwright test tests/e2e/licence-pages.spec.ts --reporter=line`
Expected: FAIL – `h1.pg-title` fehlt.

- [ ] **Step 3: Hilfsklassen verschieben, `StoreRating` extrahieren, `page.css`, `PageHead`, `PageLink` anlegen**

`brand.css`: Regeln aus `home.css` Z. 51 und 93–101 anhängen, in `home.css` löschen. `StoreRating.astro`: Markup `p.hh-rating` aus `HomeHero.astro` Z. 55–67 samt `STAR`-Pfad und den Regeln `.hh-rating`, `.hh-stars`, `.hh-stars svg`, `.hh-rating-text`, `.hh-rating-text .h-num` (als `<style is:global>`); `HomeHero.astro` nutzt `<StoreRating lang={lang} />`. `page.css` mit `@import '@fontsource-variable/archivo/wdth.css';` und den Kopf-Klassen; `PageHead.astro`, `PageLink.astro` gemäß Interfaces.

- [ ] **Step 4: Hero von `sbf-binnen.astro` ersetzen**

Hero-`div` (Z. 143–162) durch
```astro
<PageHead lang="de" eyebrow="Sportbootführerschein Binnen" lede="Bereite dich mit dem offiziellen ELWIS-Fragenkatalog auf die SBF-Binnen-Prüfung vor. 3 Lernmodi, Prüfungssimulation und gezieltes Fehlertraining – kostenlos starten." cta>
  SBF Binnen lernen –<br />die smarte Lernapp
</PageHead>
```
ersetzen. Rest der Seite unverändert (kommt in Task 3).

- [ ] **Step 5: Tests laufen lassen**

Run: `npx playwright test tests/e2e/licence-pages.spec.ts tests/e2e/premium-polish.spec.ts -g "Seitenkopf|Hero reduction|Startseite" --reporter=line`
Expected: PASS.

- [ ] **Step 6: Commit und Push**

```bash
git add src/styles/brand.css src/styles/home.css src/styles/page.css src/components/StoreRating.astro src/components/page/PageHead.astro src/components/page/PageLink.astro src/components/home/HomeHero.astro src/pages/sbf-binnen.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): Seitenkopf-Baustein mit Archivo, StoreRating ausgelagert, Hilfsklassen seitenweit"
git push -u origin feat/premium-round-2b
```

---

### Task 2: Spaltenordnung und Fakten-Karte

**Files:**
- Create: `src/components/page/PageLayout.astro`, `src/components/page/PageFacts.astro`
- Modify: `src/styles/page.css` (Layout- und Karten-Klassen)
- Modify: `src/pages/sbf-binnen.astro` (Inhaltsspalte in `PageLayout`, Fakten im `aside`-Slot; Abschnitte noch alt)
- Test: `tests/e2e/licence-pages.spec.ts`

**Interfaces:**
- Produces `PageLayout.astro`: Props `{ variant?: 'read' | 'wide' }` (default `read`); Slots Default (→ `div.pg-main`) und `aside` (→ `aside.pg-aside`, nur bei `read`). Rendert `div.h-container > div.pg-layout.pg-layout--{variant}`.
- Produces `PageFacts.astro`: Props `{ lang: 'de' | 'en'; title: string; items: { k: string; v: string }[]; product?: ProductKey }`. Rendert `div.pg-aside-card > h2.pg-aside-title + dl.pg-facts (dt.pg-fact-k, dd.pg-fact-v.h-num)` und bei `product` einen Block `.pg-aside-buy` mit `p` („In der App ab `<PlatformPrice>` einmalig" / „In the app from … one-off") und `a.h-btn.h-btn--sm[data-cta-position="page-aside"]` (generischer Play-Link, Text „Kostenlos starten" / „Start for free"). `.pg-aside-buy` ist unter 1024 px `display: none`.
- `page.css`: `.pg-layout` (Grid nach Spec: ab 1024 px `minmax(0,1fr) 320px`, `gap: 64px`, areas `main aside`; darunter `aside` über `main`), `.pg-main { max-width: 780px }`, `.pg-aside { position: sticky; top: 88px; max-height: calc(100vh - 112px); overflow: auto }` ab 1024 px, `.pg-aside-card` (Karte `--h-card`, Haarlinie, `--h-r`, 24 px), `.pg-facts` (Paare mit Haarlinie, `dt` 13 px `--h-muted`, `dd` 15 px `--h-ink` 600), `.pg-layout--wide` einspaltig.

- [ ] **Step 1: Test schreiben**

```ts
test.describe('Spaltenordnung', () => {
  test('Aside klebt rechts (1280x620) und steht am Handy vor dem Inhalt', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 620 });
    await page.goto('/sbf-binnen/');
    const aside = page.locator('.pg-aside');
    const main = page.locator('.pg-main');
    expect(await aside.evaluate(el => getComputedStyle(el).position)).toBe('sticky');
    const a = (await aside.boundingBox())!, m = (await main.boundingBox())!;
    expect(a.x).toBeGreaterThan(m.x + m.width);
    expect(a.y + a.height).toBeLessThanOrEqual(620);
    await expect(aside.locator('dl.pg-facts dt')).toHaveCount(5);
    await expect(aside.locator('dl.pg-facts')).toContainText('130,78 €');
    await expect(aside.locator('.pg-aside-buy a[data-cta-position="page-aside"]')).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    const a2 = (await aside.boundingBox())!, m2 = (await main.boundingBox())!;
    expect(a2.y + a2.height).toBeLessThanOrEqual(m2.y);
    await expect(aside.locator('.pg-aside-buy')).toBeHidden();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag sehen**

Run: `npx playwright test tests/e2e/licence-pages.spec.ts -g "Spaltenordnung" --reporter=line`
Expected: FAIL – `.pg-aside` fehlt.

- [ ] **Step 3: Komponenten und Klassen anlegen, `sbf-binnen.astro` einhüllen**

`div[max-width:800px]` durch `<PageLayout>` ersetzen; im `aside`-Slot:
```astro
<PageFacts lang="de" title="Auf einen Blick" product="sbfBinnen" items={[
  { k: 'Fragenkatalog', v: '253+ Fragen' },
  { k: 'Theorieprüfung', v: '30 Fragen · 45 Min' },
  { k: 'Bestehensgrenze', v: '5 von 7 Basis, 18 von 23 spezifisch' },
  { k: 'Prüfungsgebühr 2026', v: '130,78 €' },
  { k: 'Mindestalter', v: '16 Jahre' },
]} />
```

- [ ] **Step 4: Test laufen lassen, Erfolg sehen**

Run: wie Step 2. Expected: PASS.

- [ ] **Step 5: Commit und Push**

```bash
git add src/components/page/PageLayout.astro src/components/page/PageFacts.astro src/styles/page.css src/pages/sbf-binnen.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): Lesespalte mit klebender Fakten-Karte"
git push
```

---

### Task 3: Inhalts-Vokabular `pg-*` und vollständige Umstellung von SBF Binnen (DE)

**Files:**
- Modify: `src/styles/page.css` (Abschnitts-, Karten-, Tabellen-, Listen-Klassen)
- Modify: `src/pages/sbf-binnen.astro` (alle Abschnitte Z. 165–420)
- Test: `tests/e2e/licence-pages.spec.ts`

**Interfaces:**
- Produces Klassen (Werte aus Spec-Tabelle 5.3): `.pg-section`, `.pg-h2`, `.pg-h2--sm`, `.pg-h3`, `.pg-p`, `.pg-note`, `.pg-answer` (mit `.pg-answer-label`), `.pg-cards` + Modifikatoren `--3`, `--4`, `.pg-card`, `.pg-card-label`, `.pg-card-title`, `.pg-card-text`, `.pg-card--kpi` (`.pg-kpi` Zahl, `.pg-kpi--accent`), `.pg-table` (Wrapper) mit `table`-Regeln, `.pg-faq`, `.pg-faq-item`, `.pg-rows`, `.pg-row`, `.pg-row-icon`, `.pg-row-title`, `.pg-row-text`, `.pg-pill`, `.pg-related`.
- Hilfsfunktion in `page.css`-Nutzung: Kategorie-Zeilen verlieren `color`/`bg` je Kategorie; `Icon` bekommt `stroke="currentColor"` innerhalb `.pg-row-icon { color: var(--h-blue-ink); background: var(--h-blue-wash) }`.
- Die Datenobjekte `categories` behalten ihre Felder `color`/`bg` nicht mehr (Typ anpassen), sonst unverändert.

- [ ] **Step 1: Test schreiben**

```ts
const noInline = 'main [style*="#1A1F36"], main [style*="background:white"], main [style*="#3366FF"], main [style*="#4B5563"], main [style*="#656B78"]';

test.describe('SBF Binnen vollständig', () => {
  test('keine Inline-Farben, keine Pfeilzeichen, Bausteine vorhanden', async ({ page }) => {
    await page.goto('/sbf-binnen/');
    await expect(page.locator(noInline)).toHaveCount(0);
    expect(await page.locator('main').innerText()).not.toMatch(/[→▶]/);
    await expect(page.locator('.pg-main .pg-answer')).toHaveCount(1);
    await expect(page.locator('.pg-main > .pg-section').first().locator('.pg-answer')).toHaveCount(1);
    await expect(page.locator('.pg-cards--4 .pg-card')).toHaveCount(4);
    await expect(page.locator('.pg-table table')).toHaveCount(1);
    await expect(page.locator('.pg-faq .pg-faq-item')).toHaveCount(5);
    await expect(page.locator('.pg-rows').first().locator('.pg-row')).toHaveCount(7);
    await expect(page.locator('ul.pg-related a')).toHaveCount(30);
    await expect(page.locator('ul.pg-related a').first()).toHaveAttribute('href', '/sbf-binnen-pruefungsfragen/');
    await expect(page.locator('h2.pg-h2')).toHaveCount(10);
    await expect(page.locator('.content-section-title')).toHaveCount(0);
  });
  test('Dark Mode über Tokens', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sbf-binnen/');
    expect(await page.locator('.pg-card').first().evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(23, 29, 43)');
    expect(await page.locator('.pg-answer').evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe('rgb(255, 255, 255)');
  });
  test('kein horizontaler Überlauf bei 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/sbf-binnen/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});
```
(Die Zählwerte 5 FAQ, 7 Kategorien, 30 Links, 10 H2 entsprechen der heutigen Seite; vor dem Schreiben per `grep -c` gegenprüfen und bei Abweichung die Zahl im Test anpassen, nicht die Seite.)

- [ ] **Step 2: Test laufen lassen, Fehlschlag sehen**

Run: `npx playwright test tests/e2e/licence-pages.spec.ts -g "SBF Binnen" --reporter=line`
Expected: FAIL – Inline-Farben > 0.

- [ ] **Step 3: Klassen in `page.css` schreiben, Abschnitte umstellen**

Jeden Block nach der Zuordnungstabelle der Spec (5.3) umschreiben; `related-links` → `ul.pg-related > li > a` mit Chevron-Icon, Linktexte ohne „→ ". Interne Textlinks („Prüfungsablauf Schritt für Schritt", „Alle SBF-Kosten im Detail", „SBF See im Detail ansehen") → `<PageLink lang="de" href=…>`. Vergleichstabelle in `.pg-table`. Der `CatalogSources`-, `BoatSchoolFinder`-Aufruf bleibt in einer `section.pg-section`.

- [ ] **Step 4: Tests laufen lassen, Erfolg sehen**

Run: `npx playwright test tests/e2e/licence-pages.spec.ts tests/e2e/conversion-journeys.spec.ts -g "SBF Binnen|Spaltenordnung|Seitenkopf|sbf-binnen" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Sichtung** (Browser-Pane, 1440/1280×620/375, hell und dunkel) und Abstände zu `CatalogSources`/`BoatSchoolFinder` prüfen (kein doppelter Abstand; falls doch, `.pg-main > section + section` statt Komponenten anpassen).

- [ ] **Step 6: Commit und Push**

```bash
git add src/styles/page.css src/pages/sbf-binnen.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): SBF Binnen vollstaendig auf pg-Vokabular und Tokens"
git push
```

---

### Task 4: `PracticeBridge` zweisprachig und auf Tokens

**Files:**
- Modify: `src/components/PracticeBridge.astro`
- Test: `tests/e2e/licence-pages.spec.ts`

**Interfaces:**
- Props werden `{ variant: 'navigation' | 'radio'; lang?: 'de' | 'en' }` (default `de`, damit bestehende DE-Aufrufe unverändert bleiben). `content` wird `Record<Lang, Record<Variant, Content>>`; EN-Texte 1:1 aus `src/pages/en/sbf-coastal.astro` Z. 212–236 (`navigation`) und `src/pages/en/ubi.astro` Z. 238–258 (`radio`; `src`/`lrc` EN tragen denselben Block).
- Markup: `section.pg-section.pg-practice > h2.pg-h2 + p.pg-p + div.pg-rows (div.pg-row mit .pg-row-icon, .pg-row-title, .pg-row-text) + div.pg-card.pg-card--note (Icon lifebuoy + p.pg-note)`. Der `<style>`-Block mit Dark-Mode-Hacks entfällt. Die Konstante `noInline` steht am Dateianfang der Testdatei (aus Task 3 dorthin ziehen).

- [ ] **Step 1: Test schreiben**

```ts
test.describe('PracticeBridge', () => {
  test('DE und EN rendern denselben Baustein ohne Inline-Farben', async ({ page }) => {
    await page.goto('/sbf-see/');
    const de = page.locator('.pg-practice');
    await expect(de).toHaveCount(1);
    await expect(de.locator('.pg-row')).toHaveCount(3);
    await expect(de.locator(noInline)).toHaveCount(0);
    await page.goto('/en/sbf-coastal/');
    const en = page.locator('.pg-practice');
    await expect(en).toHaveCount(1);
    await expect(en.locator('h2.pg-h2')).toContainText('Mastering chart tasks');
  });
});
```
(`section.pg-section.pg-practice` als Wurzel der Komponente.)

- [ ] **Step 2: Fehlschlag sehen** – Run: `npx playwright test tests/e2e/licence-pages.spec.ts -g PracticeBridge --reporter=line` → FAIL (`.pg-practice` fehlt; `/en/sbf-coastal/` nutzt die Komponente noch nicht → erst nach Task 5 grün; diesen Teil des Tests bis dahin mit `test.fixme` markieren und in Task 5 freischalten).

- [ ] **Step 3: Komponente umbauen** gemäß Interfaces. `sbf-see.astro`, `ubi.astro`, `src.astro`, `lrc.astro` rufen weiter `<PracticeBridge variant=… />` auf (Default `de`).

- [ ] **Step 4: Test (DE-Teil) grün** – Run wie Step 2 → PASS für den DE-Teil.

- [ ] **Step 5: Commit und Push**

```bash
git add src/components/PracticeBridge.astro tests/e2e/licence-pages.spec.ts
git commit -m "refactor(practice-bridge): zweisprachig, pg-Klassen statt Inline-Farben"
git push
```

---

### Task 5: SBF See (DE), SBF Inland und SBF Coastal (EN)

**Files:**
- Modify: `src/pages/sbf-see.astro`, `src/pages/en/sbf-inland.astro`, `src/pages/en/sbf-coastal.astro`
- Test: `tests/e2e/licence-pages.spec.ts` (Smoke-Helfer)

**Interfaces:**
- Consumes: `PageHead`, `PageLayout`, `PageFacts`, `PageLink`, `PracticeBridge lang="en"`, `pg-*`.
- Produces: Smoke-Helfer `expectMigrated(page, path, { h1: RegExp, facts: number })`, der prüft: `h1.pg-title` (Archivo, Text), `.pg-aside dl.pg-facts dt` Anzahl, `noInline` → 0, kein „→▶" im `main`, `main a[href="/app/"]` sichtbar (Desktop), `.content-section-title` → 0, kein horizontaler Überlauf bei 360 px.
- Fakten (DE, EN identische Werte, Begriffe übersetzt): **SBF See:** Fragenkatalog: Wert der heutigen „Fragenkatalog"-Karte im Prüfungsaufbau · Theorieprüfung: `30 Fragen + Navigation · 60 Min` · Bestehensgrenze: `5 von 7 Basis, 18 von 23 spezifisch, 7 von 9 Navigation` · Prüfungsgebühr 2026: `148,38 €` · Mindestalter: `16 Jahre`. Werte vor dem Eintragen gegen die Seite prüfen (Prüfungsaufbau-Karten, Kosten, Vergleichstabelle); nichts erfinden.

- [ ] **Step 1: Smoke-Helfer und Tests für die drei Seiten schreiben** (`/sbf-see/` mit `facts: 5`, `/en/sbf-inland/` und `/en/sbf-coastal/` mit `facts: 5`; EN-Eyebrow/H1 aus den heutigen Seiten). `test.fixme` aus Task 4 entfernen.

- [ ] **Step 2: Fehlschlag sehen** – Run: `npx playwright test tests/e2e/licence-pages.spec.ts -g "sbf-see|sbf-inland|sbf-coastal|PracticeBridge" --reporter=line` → FAIL.

- [ ] **Step 3: Drei Seiten umstellen** nach dem Muster von Task 3; in `en/sbf-coastal.astro` den Inline-Praxis-Block durch `<PracticeBridge variant="navigation" lang="en" />` ersetzen (Daten `navPoints` der Seite entfallen).

- [ ] **Step 4: Erfolg sehen** – Run wie Step 2, plus `npx playwright test tests/e2e/conversion-journeys.en.spec.ts tests/e2e/lang-switcher.spec.ts --reporter=line` → PASS.

- [ ] **Step 5: Commit und Push**

```bash
git add src/pages/sbf-see.astro src/pages/en/sbf-inland.astro src/pages/en/sbf-coastal.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): SBF See, SBF Inland und SBF Coastal auf den neuen Rahmen"
git push
```

---

### Task 6: Funkseiten DE (UBI, SRC, LRC) mit Badge-Slot und Modul-Karte

**Files:**
- Modify: `src/styles/page.css` (`.pg-cta`, `.pg-cta-price`, `.pg-badge` ggf. verfeinern)
- Modify: `src/pages/ubi.astro`, `src/pages/src.astro`, `src/pages/lrc.astro`
- Test: `tests/e2e/licence-pages.spec.ts`

**Interfaces:**
- `PageHead` Slot `badge`: `<span slot="badge"><Icon name="check" size={14} strokeWidth={2.5} /> Boatpass UBI-Modul – jetzt verfügbar · einmalig <PlatformPrice product="ubi" lang="de" /></span>` (Text wie heute, ohne „▶").
- `.pg-cta` (Modul-Karte): `section.pg-section > div.pg-cta` mit `div.pg-cta-text > p.pg-eyebrow.pg-eyebrow--on-deep („Jetzt verfügbar") + h2.pg-h2 + p.pg-p` und `div.pg-cta-buy > p.pg-cta-price (PlatformPrice alt, Archivo 32 px) + span („Einmalkauf") + a.h-btn.h-btn--sm[data-cta-position="page-module"]` (Text wie heute ohne „▶"). Fläche `--h-deep`, Text `--h-on-deep`/`--h-on-deep-muted`; `html.dark .pg-cta { background: var(--h-card); box-shadow: inset 0 0 0 1px var(--h-line) }`. Ab 900 px zweispaltig (`minmax(0,1fr) auto`), darunter gestapelt.
- Fakten: **UBI:** `130 Fragen` · `Prüfung: 60 Min, bestanden ab 17 richtig` · `Gebühr: 108,71 €` · `Mindestalter: 15 Jahre` · `Gültigkeit: unbefristet` (nur wenn die Seite das so sagt, sonst 4 Paare). **SRC:** `180 Fragen` · `30 Min, ab 19 richtig` · `127,88 €` · Mindestalter aus der Seite (Z. 254) · Gültigkeit aus der Seite. **LRC:** `76 Fragen` · `20 Min, ab 11 richtig` · Gebühr aus dem Kosten-Abschnitt · Mindestalter (Z. 244) · Gültigkeit aus der Seite. Jeden Wert gegen den Seitentext prüfen.

- [ ] **Step 1: Tests schreiben** – Smoke für `/ubi/`, `/src/`, `/lrc/` (`facts: 4 oder 5` je nach Befund) plus:
```ts
test('UBI: Badge mit Preis im Kopf (375px), Modul-Karte ohne Verlauf, drei Store-Links', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/ubi/');
  await expect(page.locator('.pg-head .pg-badge')).toBeVisible();
  await expect(page.locator('.pg-head .pg-badge')).toContainText('€');
  const cta = page.locator('.pg-cta');
  await expect(cta).toHaveCount(1);
  expect(await cta.evaluate(el => getComputedStyle(el).backgroundImage)).toBe('none');
  await expect(cta.locator('a[data-cta-position="page-module"]')).toBeVisible();
  // Geräteweiche entscheidet nach User-Agent, nicht nach Breite: Playwright-Chromium ist „desktop",
  // die drei generischen Play-Links (Kopf, Aside, Modul) stehen deshalb auf /app/.
  await expect(page.locator('main a[href="/app/"]')).toHaveCount(3);
  await expect(page.locator('main a[href*="play.google.com"]:not([data-store])')).toHaveCount(0);
});
```

- [ ] **Step 2: Fehlschlag sehen** – Run: `npx playwright test tests/e2e/licence-pages.spec.ts -g "ubi|src|lrc|UBI" --reporter=line` → FAIL.

- [ ] **Step 3: `.pg-cta` schreiben, drei Seiten umstellen** (Muster Task 3; Badge-Slot; Modul-Abschnitt → `.pg-cta`; Vergleichsabschnitte „SRC vs UBI vs LRC" / „LRC vs SRC" → `.pg-table` bzw. `.pg-cards--3`, je nachdem, was heute dort steht – Struktur beibehalten).

- [ ] **Step 4: Erfolg sehen** – Run wie Step 2 → PASS.

- [ ] **Step 5: Commit und Push**

```bash
git add src/styles/page.css src/pages/ubi.astro src/pages/src.astro src/pages/lrc.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): UBI, SRC, LRC mit Preis-Badge und ruhiger Modul-Karte"
git push
```

---

### Task 7: Funkseiten EN (UBI, SRC, LRC)

**Files:**
- Modify: `src/pages/en/ubi.astro`, `src/pages/en/src.astro`, `src/pages/en/lrc.astro`
- Test: `tests/e2e/licence-pages.spec.ts`

**Interfaces:**
- Consumes: alles aus Task 6; `PracticeBridge variant="radio" lang="en"` ersetzt die drei Inline-Praxis-Blöcke (Daten `radioPoints` entfallen).
- Fakten: identische Werte wie DE, Begriffe übersetzt („Question catalogue", „Exam", „Fee", „Minimum age", „Validity").

- [ ] **Step 1: Smoke-Tests für `/en/ubi/`, `/en/src/`, `/en/lrc/` schreiben** (gleiche `facts`-Zahl wie DE) plus EN-Badge-Test wie Task 6 für `/en/ubi/`.
- [ ] **Step 2: Fehlschlag sehen** – Run mit `-g "en/ubi|en/src|en/lrc"` → FAIL.
- [ ] **Step 3: Drei Seiten umstellen.**
- [ ] **Step 4: Erfolg sehen** – Run wie Step 2 plus `tests/e2e/conversion-journeys.en.spec.ts` → PASS.
- [ ] **Step 5: Commit und Push**

```bash
git add src/pages/en/ubi.astro src/pages/en/src.astro src/pages/en/lrc.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): UBI, SRC, LRC (EN) auf den neuen Rahmen"
git push
```

---

### Task 8: Führerschein-Übersicht (DE/EN), breite Variante

**Files:**
- Modify: `src/styles/page.css` (`.pg-banner`, Token-Overrides für `.license-grid`/`.license-card`)
- Modify: `src/pages/fuehrerscheine.astro`, `src/pages/en/licenses.astro` (Hero → `PageHead` ohne `cta`; Inhalt in `PageLayout variant="wide"`; Finder-Banner → `.pg-banner`; `license-card`-Links „Mehr erfahren →"/„Vorschau →" → `PageLink`-Markup; FAQ/Weiterführend wie Task 3; page-eigener `<style>` auf Tokens umstellen oder nach `page.css` ziehen)
- Test: `tests/e2e/licence-pages.spec.ts`

**Interfaces:**
- `.pg-banner`: `a.pg-banner` Fläche `--h-deep`, Text `--h-on-deep`, Radius `--h-r`, Grid `minmax(0,1fr) auto`, Button-Optik `span.h-btn.h-btn--sm.pg-banner-cta` (weiß auf Deep: `background: #fff; color: var(--h-deep)`); Dark: `--h-card` mit Haarlinie. Kein Verlauf, kein Schatten.
- `PageLayout variant="wide"`: `.pg-layout--wide { display: block }`, Inhalt über die Containerbreite; `license-grid` bleibt dreispaltig.

- [ ] **Step 1: Tests schreiben** – Smoke für `/fuehrerscheine/` und `/en/licenses/` ohne `facts` (Helfer akzeptiert `facts: 0` → kein Aside erwartet, stattdessen `.pg-layout--wide`), plus: `.pg-banner` vorhanden mit `backgroundImage === 'none'`, `.license-card` Anzahl wie heute (per `grep -c` ermitteln), kein Inline-Farbwert, kein „→".
- [ ] **Step 2: Fehlschlag sehen** – Run `-g "fuehrerscheine|licenses"` → FAIL.
- [ ] **Step 3: Beide Seiten umstellen.**
- [ ] **Step 4: Erfolg sehen** – Run wie Step 2 → PASS.
- [ ] **Step 5: Commit und Push**

```bash
git add src/styles/page.css src/pages/fuehrerscheine.astro src/pages/en/licenses.astro tests/e2e/licence-pages.spec.ts
git commit -m "feat(pages): Fuehrerschein-Uebersicht DE/EN auf den neuen Rahmen"
git push
```

---

### Task 9: Gesamtlauf, Lighthouse, Review, PR

- [ ] **Step 1: Build und Typen** – `npx astro build 2>&1 | tail -3 && npx astro check 2>&1 | grep -E "^Result|errors"` → Build complete, 47 Alt-Fehler, keine neuen.
- [ ] **Step 2: Volle E2E-Suite** – `lsof -ti:4321 | xargs kill; npx playwright test --reporter=line` → grün (bei Last `--workers=1`).
- [ ] **Step 3: Lighthouse** – Referenz ist der `main`-Stand als lokaler Build auf Port 4325 aus einem temporären Worktree (`git worktree add /tmp/bp-main origin/main`, dort `npm ci && npx astro build && npx astro preview --port 4325`; danach `git worktree remove /tmp/bp-main`). Branch-Build auf 4324. Befehl je URL dreimal: `npx lighthouse http://127.0.0.1:<port>/sbf-binnen/ --only-categories=performance --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --quiet --output=json --output-path=stdout | jq '.audits["largest-contentful-paint"].numericValue'`; Median vergleichen. Über 150 ms Verschlechterung: `font-display: optional` für Archivo in `page.css` (eigene `@font-face`-Deklaration statt des Fontsource-Imports) und dem Inhaber im PR melden.
- [ ] **Step 4: Sichtung im Browser-Pane** – alle 12 Seiten bei 1440, 1280×620, 375, hell und dunkel; Screenshots für die PR.
- [ ] **Step 5: Frischer Reviewer über den Branch** (Spec 5.3 + `git diff main...HEAD`), Fix-Pass, Tests, Commit, Push.
- [ ] **Step 6: PR öffnen und binden** – `gh pr create --base main --title "design: Lizenzseiten auf Rahmen, Seitenkopf und Tokens (Runde 2b)"`, Fußzeile `🤖 Generated with [Claude Code](https://claude.com/claude-code)`; `mcp__ccd_pr__get_status`/`bind_pr`.
