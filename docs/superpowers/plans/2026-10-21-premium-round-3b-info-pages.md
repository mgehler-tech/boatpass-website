# Runde 3b: Infoseiten und FAQ – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Über uns, Kontakt, Impressum, Datenschutz, Nutzungsbedingungen und FAQ (DE und EN, 12 Seiten) stehen im Rahmen der Lizenzseiten: `PageHead`, schmale Spalte (`PageLayout variant="narrow"`), Legal-Karten, Schlüssel-Wert-Zeilen, Hinweis-Boxen und FAQ-Akkordeons auf den pg-Klassen; keine Inline-Farben, kein „▼".

**Architecture:** Erweiterung von `page.css` um Legal-, Notice-, Chip- und Akkordeon-Klassen (Spec Runde 3, 3.4). Die Legal-Seiten tragen ihre Stile als JS-Konstanten (`style={card}`); sie werden per Skript auf Klassen abgebildet (Konstante → Klassenname), nicht per Regex auf Attributwerte. Kontaktformular und FAQ-Daten bleiben unverändert.

**Tech Stack:** wie Runde 3a.

**Spec:** `docs/superpowers/specs/2026-10-21-premium-round-3-design.md`, Abschnitte 1–3.5.

**Branch:** `feat/premium-round-3b` von `main` nach dem Merge von 3a (braucht `narrow` und den Test-Helfer). Ein PR.

## Global Constraints

Wie Runde 3a; zusätzlich: das Kontaktformular behält `id="kontakt-form"`, Feld-IDs, `.contact-field`, Button-ID und sein Skript; `#success-msg`/`#error-msg` behalten ihre IDs und `role`/`aria-live`; FAQ-Schema-Blöcke und `details`-Semantik bleiben; `faq.astro` behält `section[id]`-Sprungmarken.

## Review Focus

1. **Kontaktformular sendet weiter:** Task 4 füllt das Formular und prüft, dass der Submit-Handler läuft (Button wird `disabled` oder Status-Box erscheint; Netzwerk per `page.route` auf den Formular-Endpunkt abfangen, 200 liefern, Erfolgsbox sichtbar).
2. **Datenschutz/Nutzungsbedingungen sind lange Rechtstexte:** Task 2 prüft Wort-für-Wort-Gleichheit des sichtbaren Textes vor/nach der Umstellung (`innerText` von `main` auf dem alten Build gegen den neuen, Whitespace normalisiert).
3. **FAQ-Akkordeon ohne JS:** `details/summary` bleibt nativ; Task 5 prüft Öffnen per Klick und dass der Chevron sich dreht (`[open] summary svg` transform).
4. **Über uns lädt das Porträt eager mit `fetchpriority="high"`:** bleibt (LCP-Element); Task 3 prüft die Attribute.
5. **EN-Parität:** je Paar identisches Tag-Skelett (Task 6 vergleicht `main`-Tag/Klassen-Folgen DE↔EN wie der Reviewer in 2b).

---

### Task 1: Legal-Vokabular und Impressum DE/EN

**Files:** Modify `src/styles/page.css` (`.pg-card--legal`, `.pg-card-label--muted`, `.pg-h2--sm` vorhanden, `.pg-p--sm`, `.pg-meta`, `.pg-divider`, `.pg-kv*`, `.pg-notice*`, `.pg-chips`/`.pg-chip`, `.pg-faq-q`/`.pg-faq-a`, `.pg-portrait`), `src/pages/impressum.astro`, `src/pages/en/legal.astro`; Create `scripts/pg-migrate/pginfo.py` (Kopf-Block „Header" → `PageHead`, Hülle `max-width:720px…` → `PageLayout variant="narrow"`, Legal-Karten-Inline-Styles → Klassen); Test `tests/e2e/info-pages.spec.ts` (neu).

**Interfaces:**
- `pginfo.py <seitenschluessel>`: Konfiguration je Seite (Eyebrow, H1, Lede, `cta`), Abbildung der Inline-Werte: Karte `background:white; border:1px solid rgba(51,102,255,0.1); border-radius:20px; padding:32px; margin-bottom:16px;` → `pg-card pg-card--legal`; `h2` 13 px Versalien blau → `pg-card-label`; `h2` 18 px 800 → `pg-h2 pg-h2--sm`; `p` 16 px 700 → `pg-p pg-p--sm pg-strong`; `p` 15 px → `pg-p pg-p--sm`; `a` blau → `pg-inline-link`; `strong style="color:#1A1F36;"` → `strong`.
- Rauchtest: `expectMigrated(page, path, { h1, facts: 0, cta: false, variant: 'narrow' })` erwartet `.pg-layout--narrow` und kein Aside.

- [ ] **Step 1: Test** – Impressum DE (`h1: /Impressum/`) und EN (`/en/legal/`, `/Legal|Imprint/`), `.pg-card--legal` ≥ 5, `main` ohne Inline-Farben, Mailadresse als Link vorhanden.
- [ ] **Step 2: Fehlschlag sehen.**
- [ ] **Step 3: Klassen in `page.css`, `pginfo.py`, beide Seiten migrieren.**
- [ ] **Step 4: Erfolg sehen** – `info-pages.spec.ts -g Impressum` plus `licence-pages.spec.ts` (Regression `page.css`).
- [ ] **Step 5: Commit und Push** – `feat(pages): Legal-Vokabular, Impressum DE/EN im schmalen Rahmen`.

---

### Task 2: Datenschutz und Nutzungsbedingungen DE/EN (Stil-Konstanten)

**Files:** Modify `src/pages/datenschutz.astro`, `src/pages/en/privacy.astro`, `src/pages/nutzungsbedingungen.astro`, `src/pages/en/terms.astro`, `scripts/pg-migrate/pginfo.py` (Konstanten-Modus: `style={card}` → `class="pg-card pg-card--legal"`, `style={num}` → `class="pg-card-label pg-card-label--muted"`, `style={h2}` → `class="pg-h2 pg-h2--sm"`, `style={p}`/`{pNext}`/`{pGap}` → `class="pg-p pg-p--sm"`, `style={strong}` → entfällt, `style={link}` → `class="pg-inline-link"`, `style={meta}` → `class="pg-meta"`, `style={divider}` → `class="pg-divider"`, `style={dividerLabel}` → `class="pg-divider-label"`, `style={dividerLine}` → entfällt (`::after`), `style={row}`/`{rowName}`/`{rowText}` → `pg-kv`/`pg-kv-k`/`pg-kv-v`; die `const`-Zeilen entfallen); Test.

- [ ] **Step 1: Test** – vier Seiten `expectMigrated(... variant: 'narrow')`; Textgleichheit: vor der Umstellung `innerText` von `main` je Seite in `tests/e2e/fixtures/legal-text/<slug>.txt` sichern (Playwright-Skript, einmalig, Whitespace normalisiert), Test vergleicht danach.
- [ ] **Step 2: Fehlschlag sehen.**
- [ ] **Step 3: Migrieren.**
- [ ] **Step 4: Erfolg sehen.**
- [ ] **Step 5: Commit und Push** – `feat(pages): Datenschutz und Nutzungsbedingungen DE/EN im schmalen Rahmen`.

---

### Task 3: Über uns DE/EN

**Files:** Modify `src/pages/ueber-uns.astro`, `src/pages/en/about.astro`, `pginfo.py`; Test.

**Interfaces:** `PageHead` mit `cta` (Store-Button „Kostenlos laden"/„Download for free"), Porträt-Karte `.pg-card.pg-portrait` (Bild `loading="eager" fetchpriority="high"` bleibt), Karten wie Legal.

- [ ] **Step 1: Test** – `expectMigrated(page, '/ueber-uns/', { h1: /Boatpass/, facts: 0, cta: true, variant: 'narrow' })`, `img[fetchpriority="high"]` in `.pg-portrait`, EN analog.
- [ ] **Step 2–5** wie oben; Commit `feat(pages): Ueber uns DE/EN im schmalen Rahmen`.

---

### Task 4: Kontakt DE/EN

**Files:** Modify `src/pages/kontakt.astro`, `src/pages/en/contact.astro`, `pginfo.py` (Hülle `max-width:600px` → `narrow`; Status-Boxen → `.pg-notice--ok`/`--error`; Selbsthilfe-Abschnitt → `pg-section`/`pg-h2`/`pg-faq-item`); Test.

- [ ] **Step 1: Test** – `expectMigrated(... cta: false, variant: 'narrow')`; Formular: `#kontakt-form input#name, #email, textarea#message, #submit-btn` vorhanden; `page.route` auf den Endpunkt des Skripts (aus `kontakt.astro` ablesen) mit `{ status: 200 }`, Felder füllen, absenden, `#success-msg` sichtbar und mit Klasse `pg-notice--ok`.
- [ ] **Step 2–5**; Commit `feat(pages): Kontakt DE/EN im schmalen Rahmen, Formular unveraendert`.

---

### Task 5: FAQ DE/EN

**Files:** Modify `src/pages/faq.astro`, `src/pages/en/faq.astro` (Tailwind-Kopf → `PageHead`; `nav` → `.pg-chips`; `details.faq-item` → `details.pg-faq-item` mit `summary.pg-faq-q` + `Icon chevronRight` statt „▼"; `.faq-answer` → `.pg-faq-a.pg-card-text`; `h2.content-section-title` → `pg-h2`; Seiten-Dark-Style entfällt); Test.

- [ ] **Step 1: Test** – `expectMigrated(page, '/faq/', { h1: /Häufige Fragen/, facts: 0, cta: false, variant: 'narrow' })`; `main` ohne „▼"; erstes `details` per Klick öffnen → `[open]`, `summary svg` hat `transform` ≠ `none`; `nav.pg-chips a` Anzahl = Kategorien; EN analog.
- [ ] **Step 2–5**; Commit `feat(pages): FAQ DE/EN im schmalen Rahmen mit Chevron-Akkordeon`.

---

### Task 6: Gesamtlauf, Parität, Reviewer, PR

- [ ] **Step 1:** `astro check` 47; volle Suite grün.
- [ ] **Step 2:** Tag-Skelett DE↔EN je Paar vergleichen (Skript aus dem 2b-Review nachbauen: `main`-Tags mit Klassen extrahieren, `diff`); Screenshots der zwölf Seiten.
- [ ] **Step 3:** Frischer Reviewer, Fix-Pass.
- [ ] **Step 4:** PR `design: Infoseiten und FAQ auf Rahmen und Tokens (Runde 3b)`; Status binden.
