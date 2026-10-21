# Premium-Politur, Runde 3: die übrigen Inhalts- und Infoseiten

Stand: 2026-10-21. Folgt auf `2026-10-18-premium-round-2-design.md` (Abschnitt 5.3 definiert Bausteine und Vokabular; Abschnitt 8 nennt diese Runde). Die Bausteine `PageHead`, `PageLayout`, `PageFacts`, `PageLink`, `DisplayFontPreload`, `page.css` und der Regex-Konverter aus Runde 2b gelten unverändert; dieses Dokument beschreibt nur, was neu dazukommt.

## 1. Entscheidungen des Inhabers (2026-10-21)

| Frage | Entscheidung |
|---|---|
| Umfang | **Gruppen A, B, C in zwei PRs.** A: Inhaltsseiten mit Hero (SBF-Kosten, Prüfungsablauf, Prüfungsfragen Binnen und See, Schein-Finder, Fahrschul-Verzeichnis mit Städteseiten), DE und EN, 14 Seiten. B: Infoseiten (Über uns, Kontakt, Impressum, Datenschutz, Nutzungsbedingungen), DE und EN, 10 Seiten. C: FAQ DE und EN. App-Seiten über `AppLandingPage`, 404, App-Auswahl und Blog-Layout folgen in Runde 4. |
| Seitenleiste | **Kennzahlen, wo die Seite welche hat, sonst eine App-Karte.** Da jede Leseseite dieser Runde Kennzahlen hat, wird die App-Karte in dieser Runde nicht gebaut (YAGNI); Schein-Finder und Fahrschul-Übersicht laufen ohne Leiste. |
| Infoseiten | **Gleicher Seitenkopf plus schmale Spalte links auf der 1240-px-Kante**, Karten und Absätze auf den pg-Klassen; Store-Button im Kopf nur bei Über uns. |
| Fahrschulen | **Mitnehmen:** Übersicht breit, Städteseiten als Leseseite mit Kennzahlen der Stadt. |

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele:** keine Inline-Farben mehr in den 26 Dateien (Spec-Selektoren `#1A1F36`, `background:white`, `#3366FF` in `main` → 0); keine Pfeil- und Dreieckszeichen (`→`, `▶`, `▼`, `&rarr;`) im sichtbaren Text; Logo, H1 und Inhalt bündig; DE und EN strukturgleich; Dark Mode über Tokens.

**Nicht-Ziele:** Texte, Schema.org, URLs, hreflang, Abschnittsreihenfolge; der interaktive Schein-Finder (`.cfg-*`, Skript und `is:global`-Styles der Seite) bleibt unverändert; das Kontaktformular behält seine Felder, Klassen (`.contact-field`, Tailwind-Utilities) und sein Skript; `BoatSchoolFinder`, `CatalogSources`, `AppLandingPage`, `AppComparisonTable` bleiben wie sie sind; die `[style*=…]`-Dark-Mode-Regeln in `global.css` bleiben bis Runde 4.

**Anti-Ziele:** Conversion-Tests brechen (`conversion-journeys*`, `store-routing`, `lang-switcher`, der Finder-Test mit `.cfg-opt`); eine Städteseite ohne Inhalt (die dynamische Route rendert alle Städte aus `getStaticPaths`); das Kontaktformular sendet nicht mehr.

## 3. Neue Bausteine und Regeln

### 3.1 `PageLayout variant="narrow"`
Dritte Variante neben `read` und `wide`: eine Spalte mit `max-width: 760px`, linksbündig in `.h-container`, kein Aside. Für Infoseiten (B), FAQ (C) und den Schein-Finder (dessen Konfigurator für 760 px gebaut ist; „ohne Leiste" war die Vorgabe, nicht „über volle Breite").

### 3.2 `PageFacts from?: boolean`
Mit `from` lautet die Preiszeile „In der App ab {PlatformPrice} einmalig" / „In the app from … one-off" (Seiten, die mehrere Produkte behandeln, z. B. SBF-Kosten, Prüfungsablauf); ohne `from` wie bisher „für".

### 3.3 Kennzahlen je Leseseite (Werte 1:1 aus der Seite, Builder prüft)
| Seite | Paare | `product` |
|---|---|---|
| SBF-Kosten / SBF costs | Prüfungsgebühr Binnen 130,78 € · Prüfungsgebühr See 148,38 € · Kombi-Prüfung 178,61 € · Vorbereitungskurs (optional) ≈ 500–650 € · Theorie mit Boatpass ab 9,99 € | `sbfBinnen`, `from` |
| Prüfungsablauf / SBF exam | Theorie Binnen 30 Fragen · 45 Min · Theorie See 30 Fragen + Navigation · 60 Min · Praxis: Manöver, Knoten · Gebühr Binnen 130,78 € · Gebühr See 148,38 € | `sbfBinnen`, `from` |
| Prüfungsfragen Binnen / Inland exam questions | wie SBF Binnen (Runde 2b) | `sbfBinnen` |
| Prüfungsfragen See / Coastal exam questions | wie SBF See (Runde 2b) | `sbfSee` |
| Städteseite Bootsfahrschulen | Bundesland · Gewässer · Benötigter Schein · Bootsfahrschulen vor Ort (Anzahl, nur wenn > 0) · Prüfung (Ort/Ausschuss, falls die Seite ihn nennt) | Lizenz der `city.variant` (`sbfBinnen` oder `sbfSee`) |
Werte, die die Seite nicht nennt, werden nicht erfunden; dann hat die Karte vier Paare.

### 3.4 Vokabular-Erweiterungen in `page.css`
| Heute | Neu |
|---|---|
| Entscheidungs-/Kostentabellen (`td` 13/16 px, `#374151`, Zebra `rgba(26,31,54,0.02)`) | `.pg-table` wie in Runde 2b; `th scope="col"`, erste Spalte `th scope="row"`, Zeilen mit Haarlinie statt Zebra |
| Info-Box mit linkem Balken und Icon (Fahrschul-Übersicht) | `.pg-answer` mit `.pg-row-icon` davor (`.pg-answer--icon`: flex, gap 16) |
| Volltonblaue Buttons (`background:#3366FF`, Hero/CTA) | `a.h-btn` (StoreCta im Kopf) bzw. `PageLink` für interne Ziele |
| `city-grid` / `city-card` (Fahrschul-Übersicht, Seiten-Styles) | Regeln nach `page.css` auf Tokens, analog `license-grid` (auto-fill 300 px, Karte `--h-card`, Icon-Kachel `--h-blue-wash`), „Mehr erfahren →" → Chevron-Icon |
| `school-list` / `school-card` / `info-card` (Städteseiten, Seiten-Styles) | nach `page.css` auf Tokens: `.pg-school` (Karte mit Kopfzeile Icon + Name + Ort, Zeilen für Adresse, Web, Telefon als `PageLink`/`pg-inline-link`), `info-card` → `.pg-card` |
| Legal-Karten (`const card/num/h2/p/meta/divider/row…` in Datenschutz, Nutzungsbedingungen; Inline in Impressum) | `.pg-card.pg-card--legal` (28 px innen), Nummer `.pg-card-label.pg-card-label--muted`, `h2.pg-h2.pg-h2--sm`, `p.pg-p.pg-p--sm` (15 px), `.pg-meta` (weiche Box `--h-blue-wash`, 13 px), `.pg-divider` (Label + Haarlinie), `.pg-kv` / `.pg-kv-k` / `.pg-kv-v` (Schlüssel-Wert-Zeilen), Links `pg-inline-link` |
| Kontakt: Status-Boxen (grün/rot inline) | `.pg-notice.pg-notice--ok` (`--h-stbd`-Wash, `--h-stbd-ink`) und `.pg-notice--error` (`--h-port`-Wash, `--h-port-ink`), weiter per `id` und `display` vom Skript gesteuert |
| FAQ: Tailwind-Kopf, Kategorie-Pillen, `details.faq-item` mit „▼" | `PageHead` (Eyebrow „FAQ", H1, Lede), `nav.pg-chips > a.pg-chip` (Haarlinien-Pille wie `.h-seg-opt`, 44 px Treffer), `details.pg-faq-item` mit `summary.pg-faq-q` (Frage + `Icon chevronRight`, dreht sich bei `[open]` um 90°) und `.pg-faq-a` (`pg-card-text`); der Seiten-Dark-Style entfällt |
| Über uns: Porträt-Karte | `.pg-card.pg-portrait` (Bild 380 px hoch, `object-fit: cover`, darunter Name als `.pg-card-title`, Rolle als `.pg-card-label`) |

### 3.5 Seitenköpfe
Eyebrow = Text der heutigen Pille, H1 mit bestehenden Umbrüchen, Lede = heutiger Intro-Absatz. Store-Button: Inhaltsseiten A ja (Beschriftung wie heute, Städteseiten „Kostenlos laden"), Schein-Finder nein, Fahrschul-Übersicht nein, Infoseiten nein außer Über uns, FAQ nein.

## 4. Lieferung
- **PR 3a** (Branch `feat/premium-round-3a`, von `main`): Gruppe A, 14 Seiten. **PR 3b** (`feat/premium-round-3b`, von `main` nach Merge von 3a oder parallel; Berührungspunkte `page.css`, `PageLayout.astro`, Test-Helfer): Gruppen B und C, 12 Seiten.
- **Tests:** `tests/e2e/helpers/migrated.ts` exportiert `expectMigrated` und `noInline` (aus `licence-pages.spec.ts` herausgezogen); neue Dateien `content-pages.spec.ts` (3a) und `info-pages.spec.ts` (3b): Rauchtest je Seite, dazu Finder (`.cfg-card` sichtbar, `.cfg-opt` klickbar, Tabelle), Städteseite (Fakten aus `city`), Kontakt (Formular-Felder und Button vorhanden), FAQ (`details` öffnet, kein „▼").
- Je PR: frischer Reviewer, Fix-Pass, Lighthouse nicht erneut (Schriftentscheidung steht), Sichtung per Screenshots.

## 5. Dem Builder überlassen
Reihenfolge der Seiten innerhalb eines Tasks; exakte Abstände; ob Legal-Karten `section` oder `div` sind (heute `div`, bleibt); EN-Übersetzungen der Kennzahl-Begriffe (Werte identisch).

## 6. Später (Runde 4)
App-Seiten (`AppLandingPage`, `AppComparisonTable`), 404, App-Auswahl, Blog-Layout, `CatalogSources`, `BoatSchoolFinder`; danach `content-section-title`, `related-links`, `exam-facts-grid` und die `[style*=…]`-Dark-Regeln aus `global.css` entfernen.
