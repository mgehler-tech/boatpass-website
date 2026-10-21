# Runde 3a: Inhaltsseiten (Kosten, Prüfungsablauf, Prüfungsfragen, Schein-Finder, Fahrschulen) – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vierzehn Inhaltsseiten (SBF-Kosten, Prüfungsablauf, Prüfungsfragen Binnen und See, Schein-Finder, Fahrschul-Übersicht und Städteseiten; DE und EN) stehen im Rahmen der Lizenzseiten: `PageHead`, `PageLayout`, `PageFacts`, pg-Vokabular, keine Inline-Farben, keine Pfeilzeichen.

**Architecture:** Dieselben Bausteine wie Runde 2b; `PageLayout` bekommt die Variante `narrow`, `PageFacts` den Schalter `from`. Die Seiten werden mit dem Regex-Konverter (`pgconvert.py`) und dem Struktur-Skript (`pgpage.py`) umgestellt, ergänzt um die Muster dieser Seiten (Tabellen mit Zebra, Info-Box mit Icon, volltonblaue Buttons, Städte-/Schulkarten). Die Konverter-Skripte wandern dafür als Werkzeug ins Repo (`scripts/pg-migrate/`), damit Runde 4 sie weiternutzt.

**Tech Stack:** Astro 6, page.css auf `--h-*`-Tokens, Playwright 1.62, Python 3 für die Konverter.

**Spec:** `docs/superpowers/specs/2026-10-21-premium-round-3-design.md` (bindend) und `docs/superpowers/specs/2026-10-18-premium-round-2-design.md` Abschnitt 5.3 (Bausteine).

**Branch:** `feat/premium-round-3a` von `main`. Ein PR.

## Global Constraints

- Conversion-Hooks: erster Store-Link in `main` ist ein generischer Play-Link ohne `data-store` (`/app/` bzw. `/en/app/` nach der Geräteweiche); `conversion-journeys*.spec.ts`, `store-routing.spec.ts`, `lang-switcher.spec.ts` und der Finder-Test (`.cfg-opt`-Klicks in `conversion-journeys.spec.ts:110-120`) bleiben grün.
- Keine Emojis, keine `→`/`▶`/`▼`/`&rarr;` im sichtbaren Text; Icons über `Icon.astro`.
- Texte, Schema.org-Blöcke, URLs, hreflang, Abschnittsreihenfolge unverändert; `getStaticPaths` der Städteseiten unverändert.
- Farben nur über Tokens: `main [style*="#1A1F36"], main [style*="background:white"], main [style*="#3366FF"]` → 0 je Seite.
- Der Schein-Finder: Logik, IDs, `.cfg-*`-Klassen und `data-*`-Hooks bleiben unangetastet; Skript und `is:global`-Style dürfen nur wie in Spec 3.6 angefasst werden (Zeichen, Farben, Button).
- E2E-Runbook (Port 4321 freimachen, Plausible abfangen, unter Last `--workers=1`); `astro check` bleibt bei 47 Alt-Fehlern.
- Commits mit `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`, nach jedem Commit pushen.

## Review Focus

1. **Städteseiten sind eine dynamische Route:** ein Template rendert alle Städte; Kennzahlen kommen aus `city` (Bundesland, Gewässer, Schein, Anzahl Schulen). Task 5 testet zwei Städte (eine mit, eine ohne Schulen) und prüft, dass die Karte bei 0 Schulen das Paar weglässt.
2. **Finder bleibt bedienbar:** nach dem Umbau muss `#cfg` sichtbar und `.cfg-opt` klickbar sein; Task 4 lässt den bestehenden Finder-Test laufen und prüft zusätzlich, dass `.cfg-card` innerhalb der 760-px-Spalte liegt.
3. **Tabellen ohne Zebra lesbar:** Entscheidungs- und Kostentabellen bekommen Haarlinien; Task 1 prüft `th[scope="row"]` je Zeile und `min-width` des Tabellen-Wrappers (horizontales Scrollen bei 360 px statt Überlauf).
4. **Konverter-Skripte im Repo:** `scripts/pg-migrate/` darf nicht in den Build geraten (liegt außerhalb `src/`, `public/`); Task 1 prüft `npx astro build` und dass `dist/` keine `.py` enthält.
5. **`narrow` neben `read`/`wide`:** die neue Variante darf die bestehenden Lizenzseiten nicht verändern; Task 1 lässt `licence-pages.spec.ts` komplett mitlaufen.

---

### Task 1: Werkzeuge und Varianten, SBF-Kosten DE/EN

**Files:**
- Create: `scripts/pg-migrate/pgconvert.py`, `scripts/pg-migrate/pgpage.py` (aus dem Scratchpad `/private/tmp/claude-501/-Users-mariusgehler-boatpass-website/91ce91dc-2be6-45cf-aa63-d91a7580245e/scratchpad/{pgconvert,pgpage}.py` übernehmen; `ROOT` relativ zum Repo bestimmen, Seitenkonfiguration in `pgpage.py` um die Seiten dieser Runde erweitern), `scripts/pg-migrate/README.md` (Aufruf, Grenzen)
- Create: `tests/e2e/helpers/migrated.ts`; Modify: `tests/e2e/licence-pages.spec.ts` (importiert den Helfer statt eigener Definition)
- Modify: `src/components/page/PageLayout.astro` (`variant: 'read' | 'wide' | 'narrow'`), `src/components/page/PageFacts.astro` (`from?: boolean`), `src/styles/page.css` (`.pg-layout--narrow .pg-main { max-width: 760px }`, `.pg-answer--icon`, Tabellen-Feinheiten)
- Modify: `src/pages/sbf-kosten.astro`, `src/pages/en/sbf-costs.astro`
- Test: `tests/e2e/content-pages.spec.ts` (neu)

**Interfaces:**
- `expectMigrated(page, path, { h1: RegExp; facts: number; cta?: boolean; variant?: 'read' | 'wide' | 'narrow' })` aus `tests/e2e/helpers/migrated.ts`; `variant` prüft die passende `.pg-layout--*`-Klasse (default `read` bei `facts > 0`, sonst `wide`).
- `PageFacts` Prop `from?: boolean` → Preiszeile „In der App ab … einmalig" / „In the app from … one-off".
- Konverter-Erweiterungen (Regex): `<td style="padding:13px 16px; color:#374151;">` → `<td>`; erste Zelle `<td style="padding:13px 16px; font-weight:600; color:#1A1F36;">` → `<th scope="row">`; `<th style="text-align:left; padding:14px 16px; …">` → `<th scope="col">`; `<tr style="border-top:… background:rgba(26,31,54,0.02);">` → `<tr>`; `<a … style="display:inline-flex; … background:#3366FF; color:white; …">▶&nbsp;TEXT</a>` → Hero-CTA entfällt (PageHead), im Inhalt → `a.h-btn.h-btn--sm`; Info-Box `<div style="display:flex; align-items:flex-start; gap:18px; background:white; … border-left:4px solid #3366FF; …">` → `<div class="pg-answer pg-answer--icon">`.

- [ ] **Step 1: Helfer extrahieren, Test schreiben**

```ts
// tests/e2e/content-pages.spec.ts
import { test, expect } from '@playwright/test';
import { expectMigrated } from './helpers/migrated';

test.beforeEach(async ({ page }) => { await page.route(/plausible\.io/, r => r.abort()); });

test.describe('SBF-Kosten', () => {
  test('DE: Kopf, Leiste mit Gebühren, Tabelle mit Zeilenköpfen', async ({ page }) => {
    await expectMigrated(page, '/sbf-kosten/', { h1: /kostet/i, facts: 5 });
    await expect(page.locator('.pg-aside dl.pg-facts')).toContainText('178,61 €');
    await expect(page.locator('.pg-aside .pg-aside-price')).toContainText(/ab/);
    const table = page.locator('.pg-table table').first();
    expect(await table.locator('tbody th[scope="row"]').count()).toBeGreaterThanOrEqual(3);
    await page.setViewportSize({ width: 360, height: 780 });
    expect(await page.locator('.pg-table').first().evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  });
  test('EN parity', async ({ page }) => {
    await expectMigrated(page, '/en/sbf-costs/', { h1: /cost/i, facts: 5 });
  });
});
```
Dazu in `licence-pages.spec.ts` die lokale `expectMigrated`/`noInline`-Definition durch den Import ersetzen.

- [ ] **Step 2: Fehlschlag sehen** – Run: `lsof -ti:4321 | xargs kill; npx playwright test tests/e2e/content-pages.spec.ts --reporter=line` → FAIL (`h1.pg-title` fehlt). Danach `npx playwright test tests/e2e/licence-pages.spec.ts` → PASS (Helfer-Refactor ohne Verhaltensänderung).

- [ ] **Step 3: Varianten, Werkzeuge, Seiten** – `narrow` und `from` einbauen; Skripte nach `scripts/pg-migrate/` (Pfade relativ, Konfiguration `sbf-kosten`/`en-sbf-costs` mit Eyebrow/H1/Lede/Fakten laut Spec 3.3, `cta_label` wie heutige Button-Beschriftung); Konverter um die Tabellen-/Button-/Info-Box-Muster erweitern; beide Seiten migrieren; Leftover-Liste des Konverters leer.

- [ ] **Step 4: Erfolg sehen** – Run: `npx playwright test tests/e2e/content-pages.spec.ts tests/e2e/licence-pages.spec.ts tests/e2e/conversion-journeys.spec.ts --reporter=line` → PASS. `npx astro build` → ok; `find dist -name "*.py" | wc -l` → 0.

- [ ] **Step 5: Commit und Push**

```bash
git add scripts/pg-migrate tests/e2e/helpers/migrated.ts tests/e2e/licence-pages.spec.ts tests/e2e/content-pages.spec.ts src/components/page/PageLayout.astro src/components/page/PageFacts.astro src/styles/page.css src/pages/sbf-kosten.astro src/pages/en/sbf-costs.astro
git commit -m "feat(pages): SBF-Kosten DE/EN auf den neuen Rahmen, Konverter als Werkzeug im Repo"
git push -u origin feat/premium-round-3a
```

---

### Task 2: Prüfungsablauf DE/EN

**Files:** Modify `src/pages/sbf-pruefung-ablauf.astro`, `src/pages/en/sbf-exam.astro`, `scripts/pg-migrate/pgpage.py` (Konfiguration); Test `tests/e2e/content-pages.spec.ts`.

**Interfaces:** Fakten laut Spec 3.3 (fünf Paare: Theorie Binnen, Theorie See, Bestehensgrenze, Mindestalter, Anmeldung; `product="sbfBinnen"`, `from`); jeder Wert per `grep` im Seitentext belegt.

- [ ] **Step 1: Test** – `expectMigrated(page, '/sbf-pruefung-ablauf/', { h1: /Prüfung/, facts: 5 })` und `'/en/sbf-exam/'` (`/exam/i`); zusätzlich `.pg-aside dl.pg-facts` enthält `60 Min` und `16 Jahre`, nicht `130,78`.
- [ ] **Step 2: Fehlschlag sehen** – `-g "Prüfungsablauf"` → FAIL.
- [ ] **Step 3: Migrieren** (Konfiguration + Konverter; neue Restmuster in den Konverter aufnehmen, nicht per Hand in die Seite).
- [ ] **Step 4: Erfolg sehen** – `-g "Prüfungsablauf"` plus `conversion-journeys.en.spec.ts` → PASS.
- [ ] **Step 5: Commit und Push** – `feat(pages): Pruefungsablauf DE/EN auf den neuen Rahmen`.

---

### Task 3: Prüfungsfragen Binnen und See, DE/EN

**Files:** Modify `src/pages/sbf-binnen-pruefungsfragen.astro`, `src/pages/sbf-see-pruefungsfragen.astro`, `src/pages/en/sbf-inland-exam-questions.astro`, `src/pages/en/sbf-coastal-exam-questions.astro`, `scripts/pg-migrate/pgpage.py`; Test `tests/e2e/content-pages.spec.ts`.

**Interfaces:** Fakten laut Spec 3.3 (Binnen vier Paare: Katalog 253, Theorieprüfung, Basisfragen, spezifische Fragen; See fünf Paare, zusätzlich Navigationsaufgabe), `product` entsprechend, ohne `from`.

- [ ] **Step 1: Test** – vier `expectMigrated`-Aufrufe (Binnen `facts: 4`, See `facts: 5`), Binnen enthält `253`, See `285` und `9 Fragen`; keine Gebühr in der Karte.
- [ ] **Step 2: Fehlschlag sehen** – `-g "Prüfungsfragen"` → FAIL.
- [ ] **Step 3: Migrieren.**
- [ ] **Step 4: Erfolg sehen** – `-g "Prüfungsfragen"` → PASS.
- [ ] **Step 5: Commit und Push** – `feat(pages): Pruefungsfragen Binnen/See DE/EN auf den neuen Rahmen`.

---

### Task 4: Schein-Finder DE/EN (narrow, Konfigurator unangetastet)

**Files:** Modify `src/pages/tools/welcher-bootsfuehrerschein.astro`, `src/pages/en/tools/which-boating-license.astro`, `scripts/pg-migrate/pgpage.py` (Konfiguration mit `wide=False`, `cta=False`, `narrow=True`, Inhaltsmarker `max-width:760px; margin:0 auto; padding:48px 24px 90px;`); Test.

**Interfaces:** `PageHead` ohne `cta`; `PageLayout variant="narrow"`; `#cfg-result` behält `style="display:none; margin-top:24px;"` (kein Farbwert, vom Skript gesteuert); Skript light-touch nach Spec 3.6: Pfeilzeichen → Inline-SVG-Chevron (Pfad von `chevronRight`, für „Zurück" per CSS gespiegelt), Emoji und Dreieck entfernen, Ergebniskarten-Inline-Farben → `.res-*`-Klassen auf Tokens im `is:global`-Block (Dark-Regeln dort entfallen), Verlaufs-Button → `a.h-btn.h-btn--sm`; Entscheidungstabelle → `.pg-table`; FAQ/Links wie üblich.

- [ ] **Step 1: Test**
```ts
test('Finder: schmale Spalte, Konfigurator bedienbar, Tabelle', async ({ page }) => {
  await expectMigrated(page, '/tools/welcher-bootsfuehrerschein/', { h1: /Bootsführerschein/, facts: 0, cta: false, variant: 'narrow' });
  await page.setViewportSize({ width: 1440, height: 900 });
  const col = (await page.locator('.pg-layout--narrow .pg-main').boundingBox())!;
  expect(col.width).toBeLessThanOrEqual(760);
  await expect(page.locator('#cfg .cfg-opt').first()).toBeVisible();
  await page.locator('.cfg-opt', { hasText: 'Küste (Nord- & Ostsee)' }).click();
  await expect(page.locator('#cfg-question')).not.toBeEmpty();
  expect(await page.locator('.pg-table table tbody th[scope="row"]').count()).toBeGreaterThanOrEqual(4);
});
```
plus EN (`/en/tools/which-boating-license/`, `h1: /licen/i`).
- [ ] **Step 2: Fehlschlag sehen** – `-g "Finder"` → FAIL.
- [ ] **Step 3: Migrieren** (Hero → `PageHead`, Hülle → `PageLayout variant="narrow"`, Tabelle/FAQ/Links per Konverter; im Skript nur Strings und Klassen ändern – der Diff des `<script>`-Blocks darf keine Zeile mit Logik (`if`, `questions`, `result`, `addEventListener`) berühren; der Test klickt die Optionen weiter durch).
- [ ] **Step 4: Erfolg sehen** – `-g "Finder"` plus `npx playwright test tests/e2e/conversion-journeys.spec.ts -g "finder|Finder|Konfigurator|license"` → PASS.
- [ ] **Step 5: Commit und Push** – `feat(pages): Schein-Finder DE/EN im schmalen Rahmen`.

---

### Task 5: Fahrschul-Übersicht und Städteseiten DE/EN

**Files:** Modify `src/pages/bootsfahrschulen/index.astro`, `src/pages/bootsfahrschulen/[city].astro`, `src/pages/en/boat-schools/index.astro`, `src/pages/en/boat-schools/[city].astro`, `src/styles/page.css` (`.city-grid`/`.city-card`/`.pg-school`-Regeln auf Tokens; Seiten-Style-Blöcke entfallen), `scripts/pg-migrate/pgpage.py`; Test.

**Interfaces:**
- Übersicht: `PageHead` ohne `cta`, `PageLayout variant="wide"`, Info-Box → `.pg-answer.pg-answer--icon`, `city-card`-Link „Mehr erfahren →" → Text + `Icon chevronRight`.
- Städteseite: `PageHead` mit `cta` (Beschriftung „Kostenlos laden" / „Download for free"), `PageLayout` (read) mit `PageFacts` aus `city`: `[{ k: 'Bundesland', v: city.state }, { k: 'Gewässer', v: city.waterways.de }, { k: 'Benötigter Schein', v: licenceLabel(city.variant) }, ...(city.schools.length ? [{ k: 'Bootsfahrschulen vor Ort', v: `${city.schools.length}` }] : [])]`, `product="sbfBinnen" from` für alle Städte (Spec 3.3; `variant` ist `inland` | `coastal` | `both`), EN analog mit `.en`-Feldern; `.maps-cta` → `.pg-banner`, Lizenz-Tags → `.pg-pill`, Info-Box der Übersicht mit `Icon lightbulb`.
- Schulkarten: `.pg-school` (Karte), `.pg-school-head` (Icon-Kachel + `h3.pg-card-title` + Ort), Zeilen als `.pg-row-text`, Links `pg-inline-link`/`PageLink external` (Web).

- [ ] **Step 1: Test** – Übersicht DE/EN (`facts: 0, cta: false`, `.city-grid .city-card` Anzahl = alle `.city-card`, kein `→`), zwei Städteseiten aus `src/data/boat-schools.ts` (eine `inland`, eine `both`, Slugs dort ablesen) mit `facts: 4` und `.pg-school`-Anzahl = `city.schools.length`; Preiszeile enthält „ab".
- [ ] **Step 2: Fehlschlag sehen** – `-g "Fahrschul"` → FAIL.
- [ ] **Step 3: Migrieren** (Style-Blöcke der vier Seiten nach `page.css`, tokenisiert; Konfiguration für Übersicht und Städte-Template; die Städte-Template-Konfiguration übergibt Eyebrow/H1/Lede als Ausdrücke – `pgpage.py` braucht dafür `raw=True`, damit `{city.state}` nicht in Anführungszeichen landet).
- [ ] **Step 4: Erfolg sehen** – `-g "Fahrschul"` plus volle `licence-pages.spec.ts` → PASS; `npx astro build` rendert alle Städte (Anzahl `dist/bootsfahrschulen/*/index.html` = Anzahl Städte).
- [ ] **Step 5: Commit und Push** – `feat(pages): Fahrschul-Uebersicht und Staedteseiten DE/EN auf den neuen Rahmen`.

---

### Task 6: Gesamtlauf, Sichtung, Reviewer, PR

- [ ] **Step 1:** `npx astro check` → 47; `lsof -ti:4321 | xargs kill; npx playwright test --reporter=line` → grün.
- [ ] **Step 2:** Screenshots (shots.mjs-Muster) der 14 Seiten bei 1440, 1280×620, 375, hell/dunkel; sichten, Auffälliges mit Test fixen.
- [ ] **Step 3:** Frischer Reviewer über `git merge-base origin/main HEAD..HEAD` mit Spec Runde 3 und diesem Plan; Fix-Pass nach executing-plans-Regeln.
- [ ] **Step 4:** `gh pr create --base main --title "design: Inhaltsseiten auf Rahmen und Tokens (Runde 3a)"`, Fußzeile `🤖 Generated with [Claude Code](https://claude.com/claude-code)`; `mcp__ccd_pr__get_status`.
