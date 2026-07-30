# Interne Verlinkung – Audit & Empfehlungen (2026-07-30)

> Analyse der internen Linkstruktur zur Verbesserung von Crawlbarkeit und Indexierung.
> Kein automatischer Code-Eingriff – Empfehlungen zur manuellen Umsetzung, priorisiert
> nach Hebelwirkung (kombiniert mit echten GSC-Daten aus `gsc-findings.md`, Zeitraum
> 2026-06-27 bis 2026-07-24).

## Ausgangslage (Fakten)

- **Keine echten Waisen im strengen Sinn:** `/blog/` und `/en/blog/` listen *alle* 52 DE-
  bzw. 52 EN-Artikel ohne Pagination oder Limit (`src/pages/blog/index.astro`). Jede
  Seite ist also mindestens von der Blog-Übersicht aus erreichbar.
- **Automatische "Verwandte Artikel"** in `BlogLayout.astro` (Zeilen 16–27) wählen die
  Top 3 Posts nach gemeinsamem Tag + Aktualität. Jeder Artikel hat aber genau **ein**
  Tag (Taxonomie: Prüfungswissen 20, Vorbereitung 12, Navigation 9, Sicherheit 4,
  Führerschein-Vergleich 4, Praxis 3 – DE wie EN identisch verteilt). In der größten
  Gruppe (Prüfungswissen, 20 Artikel) verdrängen die neuesten 3 Posts strukturell alle
  älteren aus den "Verwandte Artikel"-Slots der anderen.
- **Statischer Pillar-Link-Block** nach jedem Artikel (BlogLayout.astro, Zeilen 220–242)
  verlinkt DE auf 7 Lizenz-/Themenseiten, EN aber nur auf 3 (`/en/licenses/`, `/en/faq/`,
  `/en/blog/`) – keine Parität.
- **Homepage-Blog-Teaser** (`BlogTeaser.astro`, Zeile 14–15) zeigt **immer nur die 3
  neuesten Posts** (`sort by date desc, slice(0,3)`), unabhängig davon, wie gut ein
  älterer Artikel bei Google rankt. Die Startseite ist die Seite mit der höchsten
  internen Linkkraft der ganzen Domain – dieser Hebel wird für performende ältere
  Artikel aktuell nicht genutzt.
- Pillar-Seiten verlinken bereits solide in den Blog: `/sbf-see/` (22 Blog-Links),
  `/sbf-binnen/` (17), `/sbf-pruefung-ablauf/` (9), `/faq/` (7), `/sbf-kosten/` (5).
  Eine Ausnahme: **`/tools/welcher-bootsfuehrerschein/`** (Finder-Tool, prominent aus dem
  Header-Mega-Menü verlinkt) hat **0** ausgehende Links in den Blog – die Seite empfängt
  Linkkraft, gibt aber keine weiter.
- Ø interne Links pro Artikeltext: DE 5,28, EN 4,88 (275 bzw. 254 Links über je 52
  Dateien) – gesunder Wert, kein Artikel im Stichprobenset ganz ohne internen Link.

## Priorisierte Empfehlungen

### 1. Homepage-Teaser um einen "Performer"-Slot statt nur "neueste 3" erweitern
**Betroffen:** `src/components/BlogTeaser.astro` (Startseite, höchste Linkkraft der Domain)
**Problem:** Slot-Auswahl ist reines `date desc, slice(0,3)`. Artikel, die laut GSC bereits
in Striking Distance sind, bekommen nie einen Homepage-Link, sobald sie älter als die
3 neuesten Posts sind:
- `/blog/lichterfuehrung-erklaert/` – Pos. 17,8, 337 Impr., CTR nur 0,30 % (erwartet ~2 %)
- `/blog/kursumrechnung-sbf-see/` – Pos. 10,2, 321 Impr., CTR 0,31 % (erwartet ~2 %)
- `/blog/rettungsweste-auftriebsklassen/` – Pos. 11,6, 228 Impr., CTR 0,00 %
**Empfehlung:** Einen der 3 Teaser-Slots (oder einen zusätzlichen 4.) durch den aktuell
stärksten Striking-Distance-Artikel ersetzen, z. B. `/blog/lichterfuehrung-erklaert/` mit
Anchor-Text „Lichterführung auf dem Wasser – die Regeln einfach erklärt". Empfehlung:
diese Auswahl an die wöchentliche GSC-Auswertung koppeln, damit der Slot automatisch
mitwandert.
**SEO-Begründung:** Ein Link von der Startseite ist das stärkste interne PageRank-Signal
der Domain; genau die Seiten, die kurz vor Seite 1 stehen, profitieren am meisten davon.

### 2. `/sbf-pruefung-ablauf/` verlinkt nicht auf die Promillegrenze-Artikel
**Betroffen:** `src/pages/sbf-pruefung-ablauf.astro` (Sitemap-Priorität 0,9) und
`src/pages/en/sbf-exam.astro`
**Problem:** Die Seite listet bereits 8 prüfungsrelevante Blog-Themen als Karten/weiterführende
Links (Manöver, Knoten, Ausweichregeln, Erste Hilfe, Anmeldung, MOB, „Prüfung nicht
bestanden", Schallsignale) – aber **kein einziges Mal** „Promille"/„Alkohol", obwohl:
- `/blog/promillegrenze-boot/` – Pos. 17,0, 152 Impr., **0,00 % CTR**, Top-Query
  „promillegrenze bootsführerschein" (Pos. 10)
- `/en/blog/blood-alcohol-limit-boat/` ebenfalls ohne Link von der Pendant-Seite
Weder `/sbf-see.astro`, `/sbf-binnen.astro` noch `/sbf-pruefung-ablauf.astro` erwähnen
das Thema überhaupt (Volltextsuche negativ).
**Empfehlung:** In `sbf-pruefung-ablauf.astro` bei den Theorie-Themenkarten (Zeile
132–141) bzw. bei den Praxis-Karten (Zeile 151–154) eine vierte Karte ergänzen:
„Vorschriften am Wasser" / Anchor „die Promillegrenze für Bootsführer" → `/blog/promillegrenze-boot/`.
Analog in `en/sbf-exam.astro`: Anchor „the blood alcohol limit for boaters" →
`/en/blog/blood-alcohol-limit-boat/`.
**SEO-Begründung:** Eine 0 %-CTR bei Position 17 mit klarer Nachfrage ist ein Snippet-
oder Autoritätsproblem; ein zusätzlicher, thematisch exakt passender Link von einer
Seite mit Sitemap-Priorität 0,9 stärkt Relevanzsignal und Linkkraft gleichzeitig.

### 3. Finder-Tool-Seite ohne jede Weiterverlinkung in den Blog
**Betroffen:** `src/pages/tools/welcher-bootsfuehrerschein.astro` (aus dem Header-Mega-
Menü als Promo-Kachel prominent verlinkt) und EN-Pendant
**Problem:** 0 Treffer für `/blog/` in der Datei – die Seite ist eine Sackgasse für
Linkkraft, obwohl sie selbst gut verlinkt wird.
**Empfehlung:** In den Ergebnistexten des Finders 2–3 kontextuelle Links ergänzen, z. B.
Ergebnis „SBF Binnen oder See?" → Anchor „Unterschied SBF Binnen und See im Detail" auf
`/blog/sbf-binnen-vs-see/`; Ergebnis „Motorboot oder Segelboot" → Anchor „Motorboot oder
Segelboot – welcher Schein passt?" auf `/blog/motorboot-oder-segelboot-welcher-sbf/`.
**SEO-Begründung:** Gibt der Seite eine Funktion als Verteiler statt als Sackgasse und
leitet thematisch stark passenden Traffic (Nutzer mitten im Entscheidungsprozess) an
vertiefende, konversionsnahe Artikel weiter.

### 4. Lizenzübersicht ohne Link zur Gültigkeit-im-Ausland-Frage
**Betroffen:** `src/pages/fuehrerscheine.astro` / `src/pages/en/licenses.astro`
(„Weiterführende Artikel"-Block, Zeilen ~220–226)
**Problem:** Der Block verlinkt bereits 6 passende Artikel (Voraussetzungen, Reform
2026, Binnen vs. See, Motorboot/Segelboot, UBI vs. SRC, Charterschein, SKS), aber nicht
`/blog/sbf-im-ausland-gueltig/` bzw. `/en/blog/sbf-valid-abroad/` – letzterer der
Artikel mit der **besten Position im gesamten GSC-Report**:
`/en/blog/sbf-valid-abroad/` – Pos. 5,6, 93 Impr.
**Empfehlung:** Artikel als 7. Eintrag ergänzen. Anchor DE: „Gilt dein Sportbootführerschein
auch im Ausland?" Anchor EN: „Is your boating license valid abroad?"
**SEO-Begründung:** Ein Artikel auf Position 5,6 ist der nächste realistische Page-1-
Kandidat im Datensatz; zusätzliche kontextuelle Links von einer Pillar-Seite mit
Sitemap-Priorität 0,9 sind der günstigste Hebel, um die letzten Positionen zu überbrücken.

### 5. EN-Pillar-Link-Block nach Blogartikeln ohne Parität zu DE
**Betroffen:** `src/layouts/BlogLayout.astro`, Zeilen ~220–242
**Problem:** DE verlinkt nach jedem Artikel auf 7 einzelne Lizenzseiten
(`/sbf-binnen/`, `/sbf-see/`, `/sbf-kosten/`, `/src/`, `/ubi/`, `/lrc/`, `/faq/`), EN nur
auf die Sammelseiten `/en/licenses/`, `/en/faq/`, `/en/blog/`. Dadurch bekommen z. B.
`/en/sbf-inland/` (Pos. 7,2, 203 Impr.) und `/en/sbf-costs/` (Pos. 4,1, CTR nur 0,68 %
statt erwarteter ~4 %) **nicht** den gleichen Linkzufluss aus allen 52 EN-Artikeln, den
ihre DE-Pendants aus allen 52 DE-Artikeln erhalten.
**Empfehlung:** EN-Block auf Parität bringen: einzelne Links auf `/en/sbf-inland/`,
`/en/sbf-coastal/`, `/en/sbf-costs/`, `/en/src/`, `/en/ubi/`, `/en/lrc/` ergänzen (Anchor-
Texte analog DE, z. B. „SBF Inland (inland waters license)" statt Sammel-Link).
**SEO-Begründung:** Konsistenter Linkzufluss aus der gesamten Artikel-Basis in beiden
Sprachen; behebt eine strukturelle DE/EN-Asymmetrie, die aktuell zwei bereits gut
platzierte EN-Seiten benachteiligt.

### 6. Single-Tag-Taxonomie begrenzt "Verwandte Artikel" strukturell (niedrigere Priorität)
**Betroffen:** `src/content.config.ts` (Schema), alle Frontmatter, `BlogLayout.astro`
**Problem:** Jeder Post hat genau ein Tag; die Related-Articles-Logik matcht nur auf
volle Tag-Übereinstimmung + Aktualität. In der 20 Artikel großen Gruppe „Prüfungswissen"
sehen ältere Artikel praktisch nie einen anderen als die neuesten 3 als „verwandt".
**Empfehlung (größerer Aufwand, kein Quick-Fix):** Ein zweites, spezifischeres Tag pro
Artikel ergänzen (z. B. zusätzlich zu „Prüfungswissen" ein Thema wie „Alkohol",
„Lichter", „Navigation-Praxis"), damit die Related-Articles-Auswahl auf das speziellere
Signal matchen kann statt nur auf Aktualität zurückzufallen.
**SEO-Begründung:** Verteilt Linkkraft gleichmäßiger innerhalb der größten Content-
Cluster statt sie auf die jeweils neuesten Artikel zu konzentrieren.

## Was bereits gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen ausnahmslos alle Artikel – keine Paginierungs-Waisen.
- Automatischer Related-Articles-Mechanismus + statischer Pillar-Block sorgen im
  Schnitt für 4–6 interne Links pro Artikel zusätzlich zum Fließtext.
- Sitemap-Priorisierung (`astro.config.mjs`) ist bereits sinnvoll nach Geld-/Pillar-Seiten
  gestaffelt (1.0 Startseite, 0.9 Kernprodukte, 0.7 Blog, 0.3 rechtliche Seiten).
- `/sbf-see/` und `/sbf-binnen/` sind bereits stark in den Blog verlinkt (22 bzw. 17
  Artikel) – keine Änderung nötig.

---
_Analyse durch Claude Code, Datenbasis: Codebase-Struktur (Stand 2026-07-30) +
`gsc-findings.md` (Zeitraum 2026-06-27–2026-07-24). Keine Code-Änderungen in diesem
Lauf – Empfehlungen zur Umsetzung durch die Blog-/Linkcheck-Routinen oder manuell._
