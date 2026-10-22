# Premium-Politur Runde 4: App-Seiten, Kleinseiten, Bausteine, Blog und Aufräumen

Stand: 2026-10-22. Baut auf Runde 2 (`2026-10-18-premium-round-2-design.md`, Abschnitt 5.3: Seitenrahmen `PageHead`/`PageLayout`/`PageFacts`/`page.css`) und Runde 3 (`2026-10-21-premium-round-3-design.md`: Varianten `read`/`wide`/`narrow`, Vokabular 3.4, Konverter unter `scripts/pg-migrate/`) auf. Nach dieser Runde läuft jede Seite der Website auf dem Rahmen und den `--h-*`-Tokens; die alten Klassen und die `[style*=…]`-Dark-Regeln in `global.css` sind weg.

## 1. Entscheidungen des Inhabers (2026-10-22)

| Frage | Entscheidung |
|---|---|
| Umfang und Zuschnitt | Zwei PRs. **4a:** zehn App-Landingpages (`AppLandingPage` + `AppComparisonTable`), 404, App-Auswahl (`AppChooser`), die Bausteine `CatalogSources` und `BoatSchoolFinder`. **4b:** Blog-Übersicht und Artikel-Layout (`BlogLayout`, `BlogCard`, `BlogInlineCta`), danach das Aufräumen in `global.css`. |
| App-Landingpages | Lesespalte mit Store-Button im Kopf und Kennzahlen-Leiste; die sechsspaltige Vergleichstabelle bricht über die volle 1240-px-Breite aus, der Rest bleibt in der Lesespalte. |
| Blog-Artikel | Seitenkopf mit Rubrik, Titel, Teaser; Artikeltext in der Lesespalte, rechts klebend Autor, Datum, Lesezeit und App-Karte; FAQ, verwandte Artikel und Autorenbox darunter. Übersicht als breites Kartenraster. |
| Aufräumen | Komplett entfernen mit Tests: die 48 `html.dark [style*=…]`-Regeln, `content-section-title`, `related-links`, `exam-facts-grid`, `section-display-title` sowie die ungenutzten Bausteine `FinderTeaser`, `FeatureCards`, `PricingSection`; ein Test prüft, dass keine Seite sie mehr referenziert. |

Unverändert gültig: kein Emoji im UI (Icon-System `src/icons.ts` + `Icon.astro`), EN spiegelt DE, nach jeder Änderung pushen, der Inhaber sichtet und merged die PRs selbst, je PR ein frischer Reviewer, Native-Ausführung Task für Task mit Tests und Commits.

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele.** (1) Die 10 App-Landingpages, 404, App-Auswahl, Blog-Übersicht (2) und Artikel-Layout (144 Beiträge) stehen auf `PageHead`/`PageLayout`/`page.css`; die Bausteine `CatalogSources`, `BoatSchoolFinder`, `AppComparisonTable`, `AppChooser`, `BlogCard`, `BlogInlineCta` tragen nur noch Tokens und keine `html.dark`-Regeln. (2) `global.css` verliert die Altklassen und die `[style*=…]`-Dark-Regeln; drei ungenutzte Bausteine werden gelöscht. (3) Ein Test hält den Zustand: kein Altklassen-Name und keine `[style*=`-Dark-Regel im Build.

**Nicht-Ziele.** Texte, Daten (`src/data/apps.ts`, `catalogs.ts`, `boat-schools.ts`), Blog-Inhalte, JSON-LD, Metadaten, hreflang; die Such- und Filterlogik der Blog-Übersicht; die Weiterleitungs- und QR-Logik der App-Auswahl; das Einfüge-Skript der Blog-Inline-Karte; Startseite, Header, Footer, `CtaBanner` (bereits auf Tokens); Lighthouse-Messungen (Schriftentscheidung steht).

**Anti-Ziele (Fehlschlag trotz grüner Tests).** Verschobene oder veränderte Vergleichsdaten; eine Tabelle, die auf dem Desktop scrollt, obwohl Platz da ist; verlorene 44-px-Tap-Flächen (Profil-Links, Chips, Kategorie-Buttons, Lizenz-Pillen); ein Artikel, dessen Inline-Karte nicht mehr nach der ersten H2 erscheint; Dark-Mode-Regress auf den Lizenzseiten durch `CatalogSources`/`BoatSchoolFinder`; eine 404, die der Preview nicht mehr als 404 ausliefert; Blog-Kategoriefarben, die ihren Kontrast (≥ 4,5:1 für Chip-Schrift) verlieren.

## 3. Bausteine und Regeln

### 3.1 App-Landingpages (10 Seiten über `src/components/AppLandingPage.astro`)

Reihenfolge von oben: `PageHead` (Eyebrow = `badge`, H1 = `h1`, Lede = `heroIntro`, `cta` mit Standardbeschriftung, `position="app-landing-head"`) → **Kopfzweispalter** `PageLayout variant="read"` mit `PageFacts` in der Leiste und „Auf den Punkt" (`.pg-answer`, Label `t.answerLabel`, Text `answer`) als einzigem Hauptinhalt → **Tabellenband** `section.h-container.pg-band` mit `h2.pg-h2` (`t.comparison`) und der `AppComparisonTable` in voller Containerbreite → **Lesespalte** `PageLayout variant="read"` ohne Leiste (Hauptspalte 780 px links) mit Kurzprofilen, Android, iOS, Stärken/Grenzen, Transparenzhinweis, CTA, FAQ, Links. Die Slots `after-table` und `before-honesty` bleiben an ihren Stellen (nach dem Band bzw. vor Stärken/Grenzen).

Kennzahlen (Werte aus den Props/Daten, keine neuen Zahlen): „Verglichene Apps" = `apps.length`; „Boatpass-Kataloge" = Anzahl `licenses` der App mit `isOwn` plus Aufzählung der Scheine (`LICENSE_LABELS`); „Plattformen" = aus `playUrl`/`appStoreUrl` der eigenen App („Android · iOS"); „Stand der Daten" = `DATA_AS_OF_LABEL[lang]`; `product="sbfBinnen" from` (Preiszeile „In der App ab …"). EN-Begriffe analog („Apps compared", „Boatpass catalogues", „Platforms", „Data as of").

Abschnitte: Kurzprofile → `.pg-cards` mit `.pg-card` (`h3.pg-card-title`, Anbieter `.pg-row-text`, Zusammenfassung `.pg-card-text`, „Am besten geeignet für" als `.pg-note` mit `<strong>`), Aktionen als `nav.pg-chips` mit `a.pg-chip` (44 px, `target="_blank" rel="noopener noreferrer"`, `data-store` bleibt, Text ohne Pfeil, `Icon chevronRight` dahinter); Android/iOS → `pg-section` mit `pg-h2` und `p.pg-p` (`set:html` bleibt); Stärken/Grenzen → `.pg-cards.pg-cards--2` mit `.pg-card`, Labels `.pg-card-label` (Stärken `--h-stbd-ink`, Grenzen `--h-muted`) und `ul.pg-checks > li.pg-check` mit `Icon check` bzw. `Icon xmark` in `.pg-check-mark` (Stärken `--h-stbd-ink`, Grenzen `--h-muted`); Transparenzhinweis → `.pg-answer.pg-answer--icon` mit `Icon question` in `.pg-row-icon`; CTA → `.pg-cta` (Eyebrow, `h2.pg-h2`, `p.pg-p`, `StoreBadges` wie heute, `id`/`position` bleiben); FAQ → `.pg-faq > .pg-faq-item` (`h3.pg-h3`, `p.pg-card-text`); Links → `section.pg-section.pg-section--related` mit `h2.pg-h2.pg-h2--sm` und `ul.pg-related` (Chevron statt „→"). Der seitenlokale `<style>` (`.table-breakout`, `.app-profile-*`, `html.dark …`) entfällt.

`AppComparisonTable`: Desktop-Tabelle → `.pg-table` (Tokens, `th scope` bleibt, Eigen-App-Hinweis als `.pg-pill`, Bewertungs-Nebensatz `.pg-note`), `caption` → `.pg-table-caption` (13 px, muted, links oben); Mobile-Karten (< 760 px) bleiben als Struktur, ihre Klassen `.cmp-*` wandern tokenisiert nach `page.css` als `.pg-cmp-*` (Karte `--h-card`/`--h-line`, Name `--h-ink`, Zeilen `--h-text`/`--h-muted`); die `html.dark .cmp-*`-Regeln entfallen. Die Sonderseiten `sbf-app-kostenlos.astro`/`en/sbf-app-free.astro` ersetzen ihre fünf Inline-Stile und `content-section-title` in den Slots durch `pg-section`/`pg-h2`/`pg-p`/`pg-card`.

### 3.2 404 und App-Auswahl

**404** (`src/pages/404.astro`): `PageHead` mit Eyebrow „404 · Seite nicht gefunden", H1 „Hier ist niemand an Bord", Lede = heutiger Absatz; `PageLayout variant="narrow"` mit `.pg-actions`: `a.h-btn` zur Startseite (Icon `home` falls vorhanden, sonst ohne Kachel), danach `nav.pg-chips` mit `a.pg-chip` zu SBF Binnen, SBF See, FAQ, darunter `PageLink` zur App-Auswahl (`/app/`, Text „Oder lade die Boatpass-App für iPhone oder Android" ohne Pfeil). `noindex`, `hasAlternate={false}`, `showCta={false}` bleiben; die große „404"-Ziffer entfällt zugunsten des Eyebrows (meine Festlegung, weil der Rahmen keine Schmuckziffer kennt). Es gibt nur eine deutsche 404; sie bleibt deutsch.

**App-Auswahl** (`src/components/AppChooser.astro`, Seiten `/app/`, `/en/app/`): Layout, IDs, QR, Weiterleitung und `?stay` bleiben; der gescopte `<style>` wechselt auf Tokens (`--h-card`, `--h-line`, `--h-ink`, `--h-muted`, `--h-blue-wash`), Eyebrow und H1 übernehmen `.pg-eyebrow`/`.pg-title`-Typografie (Archivo über `--h-display`), `dl.ac-facts` wird `dl.pg-facts` in einer `.pg-aside-card`, der Zurück-Link ein `PageLink` ohne Pfeilzeichen; die 11 `html.dark`-Regeln entfallen. Kein `PageHead` (Sprungbrettseite, `noindex`; meine Festlegung). `DisplayFontPreload` kommt in den `head`-Slot beider Seiten.

### 3.3 Bausteine der Lizenzseiten

**`CatalogSources`** (10 Lizenzseiten; auf der Startseite nicht mehr eingebunden, nur noch über das zu löschende `PricingSection`): Struktur (Details-Aufklapper, Desktop-Tabelle, Mobile-Karten, Pillen, Fußnoten) bleibt; `section-display-title` → `h2.pg-h2`, `h3.cat-single-title` → `pg-h3`, Tabelle → `.pg-table`-Optik (die eigenen `.cat-table`-Regeln auf Tokens oder durch `.pg-table` ersetzt – Builder-Entscheidung, Ergebnis ohne Hex-Farben), Pillen → `.pg-pill` (Lizenz-Badges dürfen ihre Kurzfarbe behalten, wenn sie als Token oder `color-mix` auf `--h-blue` beruht), `.src-link` → `pg-inline-link` oder `PageLink external`; die 24 `html.dark`-Regeln entfallen. Die Props `only`/`collapsible`/`embedded` bleiben, `embedded` darf nach dem Löschen von `PricingSection` entfallen, wenn kein Aufrufer bleibt (grep).

**`BoatSchoolFinder`** (4 Lizenzseiten): `content-section-title` → `pg-h2`, `section style="margin-bottom:48px"` → `section.pg-section.boat-school-finder` (die `.pg-main > .boat-school-finder`-Regel aus Runde 2b bleibt gültig), `.bsf-*` auf Tokens (Karte `--h-card`/`--h-line`, Icon-Kachel `--h-blue-wash`/`--h-blue-ink`, Pfeil als `Icon chevronRight`), Hinweisbox → `.pg-answer.pg-answer--icon`; die 10 `html.dark`-Regeln entfallen. Externe Ziele behalten `target`/`rel`.

### 3.4 Blog-Artikel (`src/layouts/BlogLayout.astro`)

`PageHead` mit Eyebrow = erster Tag (die Artikel tragen genau einen), H1 = `title`, Lede = `description`, ohne Store-Button (Inline-Karte und `CtaBanner` bleiben die App-Hinweise). `PageLayout variant="read"`: Hauptspalte mit Zurück-Link `a.pg-back` (`Icon chevronRight` um 180° gedreht, Text „Alle Artikel"/„All articles"), optionalem Hero-Bild `img.pg-hero-img` (16:9, `--h-r`, `loading="eager" fetchpriority="high"` bleibt), Artikeltext in `div.pg-prose` (ehemals `.article-body`; Regeln nach `page.css`: Absätze 17 px/1.75 `--h-text`, H2/H3 in `--h-display` wie `pg-h2`/`pg-h3`, Listen, `strong` `--h-ink`, Links `--h-blue-ink` unterstrichen, Blockquote mit `--h-blue`-Linie auf `--h-blue-wash`, Tabellen wie `.pg-table` (Zebra entfällt, Haarlinien), `code` auf `--h-paper-2`; unter 700 px scrollen Tabellen), `BlogInlineCta` (Skript unverändert, Optik auf `--h-blue-wash`/`--h-line`, Button `a.h-btn.h-btn--sm`), FAQ → `.pg-faq`, verwandte Artikel → `ul.pg-related` mit Lesezeit als `.pg-pill` statt „→", Autorenbox → `.pg-card.pg-author` (Avatar 64 px rund, `.pg-card-label` „Über den Autor", Name als `pg-card-title`-Link, Rolle `.pg-row-text`, Bio `.pg-card-text`), Führerschein-Pillen → `nav.pg-chips > a.pg-chip` (44 px bleibt). Leiste: `PageFacts` mit Titel „Zum Artikel"/„About this article" und Paaren Autor, Veröffentlicht (`formattedDate`), Aktualisiert (nur mit `updated`), Lesezeit („N Min."/„N min"); `product="sbfBinnen" from` (Preiszeile und Store-Button wie auf den Inhaltsseiten; unter 1024 px wie dort ausgeblendet). `<article>` bleibt das umschließende Element der Hauptspalte (Schema und Lesemodus), der seitenlokale `<style is:global>` (`.article-body`, `.licence-pills`, `html.dark …`) entfällt.

### 3.5 Blog-Übersicht (`src/pages/blog/index.astro`, `en/blog/index.astro`, `BlogCard`)

`PageHead` (Eyebrow „Blog"/„Blog", H1 „Blog", Lede = heutiger Untertitel; meine Festlegung: H1 bleibt „Blog", weil Title/Breadcrumb darauf stehen) → `PageLayout variant="wide"`: Lernpfad-Block → `.pg-journey` (Karte auf `--h-blue-wash`, Eyebrow `.pg-eyebrow`, `h2.pg-h2`, `p.pg-p`, vier `a.pg-card.pg-journey-step` mit Nummer `.pg-card-label`, Label, Titel `.pg-card-title`, Lesezeit `.pg-row-text` ohne „→"); Werkzeugleiste → `.pg-toolbar` mit `.pg-search` (Input auf `--h-card`/`--h-line-2`, Fokusring `--h-blue`, Lupe als `Icon search` falls vorhanden, sonst bisheriges Inline-SVG mit `currentColor`) und `div.pg-chips` mit `button.pg-chip` (+ `.is-active`: `--h-blue` Rand, `--h-blue-ink` Schrift; Zähler `.pg-chip-count` als kleine Pille); Cluster → `section.pg-section.cluster` mit `.pg-cluster-head` (`span.pg-cluster-dot` auf `--accent`, `h2.pg-h2`, Zähler `.pg-pill`, Beschreibung `.pg-note`) und `.pg-cluster-grid` (auto-fill 300 px); IDs und `data-*` (`blog-search`, `blog-categories`, `data-cat`, `data-cluster`, `blog-noresults`, `data-tags`, `data-search`) und das Skript bleiben unverändert; CTA-Block → `.pg-cta` mit `StoreBadges` (statt reinem Play-Link). Kategoriefarben: die sechs Akzentfarben bleiben Daten (`categoryMeta`/`categoryColors`) und kommen als `--accent`-Custom-Property auf Button, Punkt und Karten-Icon-Kachel; die Chip-Schriftfarben (`categoryInk` hell/dunkel) bleiben, weil sie den Kontrast sichern. `BlogCard`: Hülle `.pg-card.pg-post-card` (Hover wie `.city-card`), Icon-Kachel mit `--accent`, Tag-Chip wie heute auf `--tag-ink`, „Neu"-Badge auf `--h-ink`/`--h-card`, Titel `.pg-card-title`, Text `.pg-card-text`, Autorzeile `.pg-row-text`; die `html.dark`-Regeln der Karte und der Übersicht entfallen.

### 3.6 Aufräumen `global.css` (Ende von 4b)

Entfernt werden: `.section-display-title`, `.content-section-title`, `.related-links`, `.exam-facts-grid` (mit Media-Queries) und der Block „Global attribute-selector overrides" samt Vordergrund-Akzent (`html.dark [style*=…]`, heute 48 Regeln) sowie alle weiteren `html.dark` + Attribut-Selektoren auf `style`. Gelöscht werden `src/components/FeatureCards.astro`, `FinderTeaser.astro`, `PricingSection.astro` (heute ohne Aufrufer; der Builder prüft per grep vor dem Löschen, inklusive `src/pages` und `src/layouts`). Vorbedingung: ein Lauf über `dist/**/*.html` findet in `main` keine `style="…"` mit `#1A1F36`, `#4B5563`, `#656B78`, `#3366FF`, `background:white` mehr – was dann noch auftaucht, gehört in 4b, bevor die Regeln fallen. `Icon.astro` bekommt ein `aria-hidden`-Prop (Standard `true`, weil die Icons dekorativ sind; `PageLink`, Chevrons, Kacheln nutzen es). Schmuck-Glyphen `✓`/`·` in Datenstrings bleiben (Runde 2/3).

### 3.7 Vokabular-Erweiterungen in `page.css`

| Neu | Zweck |
|---|---|
| `.pg-band` | Vollbreiter Abschnitt zwischen zwei `PageLayout`-Blöcken (innerhalb `.h-container`, Abstände wie `.pg-main > * + *`) |
| `.pg-table-caption` | Tabellenbeschriftung 13 px muted, links oben |
| `.pg-cmp-card`, `.pg-cmp-head`, `.pg-cmp-row` | Mobile Karten der Vergleichstabelle |
| `.pg-chip.is-active`, `.pg-chip-count`, `button.pg-chip` | Filter-Chips mit Zustand und Zähler |
| `.pg-toolbar`, `.pg-search` | Such- und Filterzeile der Blog-Übersicht |
| `.pg-journey`, `.pg-journey-step` | Lernpfad-Karte und Schritte |
| `.pg-cluster-head`, `.pg-cluster-dot`, `.pg-cluster-grid` | Themenblöcke der Übersicht |
| `.pg-post-card` | Blog-Karte (auf `.pg-card`) |
| `.pg-back`, `.pg-hero-img`, `.pg-prose`, `.pg-author` | Artikel: Zurück-Link, Hero-Bild, Fließtext, Autorenbox |
| `.pg-check-mark svg` | Icon statt Glyphe in Versprechen-/Stärken-Listen |

Bestehendes wird wiederverwendet: `.pg-answer(--icon)`, `.pg-cards(--2)`, `.pg-card*`, `.pg-checks`, `.pg-chips/.pg-chip`, `.pg-faq*`, `.pg-related`, `.pg-cta`, `.pg-pill`, `.pg-table`, `.pg-facts`, `.pg-aside-card`.

### 3.8 Seitenköpfe und Store-Button

Eyebrow = Text der heutigen Pille (App-Seiten: `badge`; 404: „404 · Seite nicht gefunden"; Blog: Rubrik bzw. „Blog"), H1 unverändert, Lede = heutiger Intro-Absatz bzw. Artikel-Description. Store-Button im Kopf: App-Landingpages ja (Standardbeschriftung „Kostenlos laden"/„Download for free"), 404 nein, App-Auswahl kein Kopf, Blog-Artikel nein, Blog-Übersicht nein.

## 4. Lieferung

- **PR 4a** (`feat/premium-round-4a`, von `main`): 3.1, 3.2, 3.3; `Icon` `aria-hidden`-Prop; Tests `tests/e2e/app-pages.spec.ts` (10 App-Seiten über `expectMigrated` mit `facts: 4, cta: true`, Tabelle bei 1440 breiter als 1000 px und ohne horizontales Scrollen, Mobile-Karten bei 375, Profil-Chips 44 px, keine Pfeilzeichen; 404 über eine unbekannte URL im Preview mit Status 404, `PageHead` und Chips; `/app/?stay` ohne Inline-Farben, QR sichtbar, Dark-Hintergrund = `--h-card`; `/sbf-binnen/` und `/en/sbf-coastal/`: `CatalogSources`/`BoatSchoolFinder` ohne Hex-Farben in berechneten Stilen, `licence-pages.spec.ts` komplett grün).
- **PR 4b** (`feat/premium-round-4b`, von `main` nach Merge von 4a): 3.4, 3.5, 3.6; Tests `tests/e2e/blog.spec.ts` (Übersicht DE/EN: Kopf, Lernpfad, Suche filtert Cluster, Kategorie-Button filtert, Chips 44 px; je ein Artikel DE/EN: Kopf, Leiste mit Autor/Datum/Lesezeit, Inline-Karte nach der ersten H2, FAQ, verwandte Artikel, Pillen, Hero-Bild eager wo vorhanden) und `tests/e2e/legacy-free.spec.ts` (kein Altklassen-Name und keine `html.dark [style*=`-Regel im Build; Stichprobe von acht Seiten im Dark Mode ohne `style="…#1A1F36"` in `main`).
- **Werkzeuge:** Komponenten werden von Hand umgestellt; `pgconvert.py` darf für FAQ/Links/Absätze auf `AppLandingPage`/`BlogLayout` laufen (Sprachparameter nach Fall). Alles, was der Builder dafür baut, liegt unter `scripts/pg-migrate/` mit README-Absatz.
- Je PR: Screenshots (1440 hell/dunkel, 1280×620, 375) der betroffenen Seiten, DE↔EN-Tag-Skelett je Paar, frischer Reviewer, Fix-Pass; kein Lighthouse.

## 5. Dem Builder überlassen

Exakte Abstände; ob `CatalogSources` seine Tabelle auf `.pg-table` umstellt oder die eigenen Regeln tokenisiert; Reihenfolge der Seiten je Task; ob der 404-Button ein Icon trägt; Benennung interner Hilfsklassen innerhalb der Bausteine (`.pg-cmp-*`, `.ac-*` tokenisiert); EN-Übersetzungen der Kennzahl-Begriffe; ob `embedded` in `CatalogSources` bleibt.

## 6. Später (Runde 5)

Kontaktformular-Felder und -Button auf Tokens (`.contact-field`, Tailwind-Utilities), Tailwind-Reste in `BaseLayout`/Header-Menü, `textContent`-Fixtures für die Rechtstexte, kleinere statische Archivo-Instanz, OG-Bild-Generator auf die neue Schrift.
