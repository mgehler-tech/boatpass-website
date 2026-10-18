# Premium-Politur, Runde 2: Lernweg, Preisliste, Lizenzseiten

Stand: 2026-10-18. Folgt auf `2026-10-17-premium-polish-design.md` (PR 399, gemergt). Diese Runde setzt die dort zurückgestellten Punkte um. Entscheidungen des Inhabers stehen als solche markiert; alles andere sind Vorgaben an den Builder oder dessen Spielraum.

## 1. Absicht

Die Startseite hat seit PR 399 eine ruhige, luftige Sprache: Papier-Töne, Archivo für Überschriften, Hairlines statt Kästen, das Gerät als Produkt. Drei Stellen fallen dahinter zurück:

1. **Lernweg.** Vier Etappen mit 80 bzw. 110 Prozent Fensterhöhe ergeben bei 1440×900 rund 3150 px Scrollweg für vier Sätze; die Etappennummer steht zweimal (Marker auf der Linie und Kicker „Etappe 01 / 04").
2. **Preisliste.** Die Angebotszeilen haben fünf Spalten mit versetzten Grundlinien; die zwei Pakete (Binnen + See, Funk-Paket) sind als blau gewaschene Zeilen kaum vom Rest zu unterscheiden und tragen zugleich die wichtigste Kaufentscheidung.
3. **Lizenzseiten.** SBF Binnen, SBF See, UBI, SRC, LRC und die Führerschein-Übersicht (je DE und EN) stehen noch im alten System: zentrierter Kopf mit Verlaufs-Button und „▶"-Zeichen, 85 bis 150 Inline-Styles je Seite mit fest verdrahteten Farben, 800-px-Spalte ohne Bezug zur 1240-px-Kopfzeile. Dark Mode funktioniert dort nur über `[style*=…]`-Hacks in global.css. Das sind die Seiten, auf die Menü und Hero verlinken; der Stilbruch ist einen Klick entfernt.

## 2. Entscheidungen des Inhabers (2026-10-18)

| Frage | Entscheidung |
|---|---|
| Tiefe der Unterseiten-Angleichung | **Rahmen und Seitenkopf angleichen:** Breite 1240 px wie die Kopfzeile, Farben/Buttons/Kästen auf die h-Tokens, gemeinsamer Seitenkopf im Stil der Startseite. Inhalt und Struktur bleiben. Keine neuen Fotos. |
| Umfang | **Lizenzseiten zuerst:** die fünf Lizenzseiten plus Führerschein-Übersicht, DE und EN (12 Seiten). Die übrigen 34 Seiten mit altem Aufbau folgen in einer weiteren Runde über dieselben Bausteine. |
| Preisliste | **Vier bündige Spalten, Pakete als Karten.** |
| Lernweg | **Kompakt, Nummer nur einmal:** Etappen auf Inhaltshöhe mit kleinem Mindestmaß, Quiz-Etappe nur so hoch wie das Quiz, Kicker entfällt, Marker bleibt, Handy bleibt sticky. |

## 3. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
- Lernweg bei 1440×900 höchstens etwa halb so lang wie heute, ohne dass die Etappenumschaltung des sticky Geräts leidet.
- Preisliste: Einzellizenzen in einer ruhigen, bündigen Tabelle; je Gruppe eine Paket-Karte mit Streichpreis und Ersparnis, die ins Auge fällt, ohne zu schreien.
- Die 12 Lizenzseiten teilen sich einen Seitenkopf, eine Spaltenordnung und ein kleines Klassen-Vokabular auf den `--h-*`-Tokens. Keine Inline-Styles mit Farbwerten mehr in diesen 12 Dateien. Dark Mode über Tokens, nicht über Attribut-Hacks.
- Logo, H1 und Inhalt stehen auf den 12 Seiten auf derselben linken Kante.
- EN spiegelt DE vollständig (Struktur, Bausteine, Texte wie bisher).

**Nicht-Ziele**
- Keine Änderung an Texten, Schema.org-Daten, URLs, internen Links oder der Reihenfolge der Abschnitte auf den Lizenzseiten.
- Keine Fotos, kein Geräte-Kopf auf den Lizenzseiten (Inhaber hat die Variante „Lizenzseiten inszenieren" nicht gewählt).
- Keine Migration der übrigen 34 Seiten, des Blog-Layouts, der Tools oder der eingebetteten Komponenten `CatalogSources` und `BoatSchoolFinder` (sie behalten ihre eigenen Styles; siehe 7). Ausnahme ist `PracticeBridge`, siehe 5.3 „Praxis-Brücke".
- Keine neue Preislogik: Preise, Streichpreise und Ersparnis kommen weiter aus `data/stores.ts` und `PlatformPrice`.

**Anti-Ziele** (die Runde ist gescheitert, wenn …)
- … die Conversion-Tests brechen: Auf den Lizenzseiten muss der erste Store-Link in `main` weiterhin ein generischer Google-Play-Link ohne `data-store` sein, den die Geräteweiche des BaseLayouts umschreibt (`main a[href="/app/"]` sichtbar am Desktop, kein `main a[href*="play.google.com"]:not([data-store])` nach dem Umschreiben).
- … die Preisliste mehr oder weniger Store-Links enthält als heute (drei: zwei Pakete, ein CTA), die Tests zählen sie.
- … die Lizenzseiten lauter werden (Verläufe, Schatten, Farbflächen). Die Richtung bleibt ruhig und luftig.
- … der Kopf einer Lizenzseite am Handy länger als ein Bildschirm wird, bevor der erste Inhalt kommt.

## 4. Rahmenbedingungen

- Astro 6, Tailwind 4 (nur Utilities), Tokens in `src/styles/brand.css` unter `:root` / `html.dark`. Inter global; Archivo Variable (`@fontsource-variable/archivo/wdth.css`) wird heute nur von `home.css` geladen.
- Playwright-E2E gegen `astro build && astro preview` (Runbook in der Projekt-Memory: Port 4321 freimachen, Plausible abfangen, `--workers=1` unter Last). `npx astro check` hat 47 Alt-Fehler, neue sind nicht erlaubt.
- Keine Emojis, keine Pfeilzeichen („→", „▶") im UI: Icons kommen aus `src/icons.ts` über `Icon.astro`.
- Store-Links: generische Play-Links, Umschreibung per BaseLayout; `data-cta-position` für Plausible beibehalten bzw. neu vergeben (`pricing`, `pricing-bundle`, `page-head`, `page-aside`, `page-module`).
- Die Geräteweichen-Klassen `.h-on-android`, `.h-off-android`, `.h-off-desktop` und die Ziffernklasse `.h-num` liegen heute nur in `home.css`. Sie wandern nach `brand.css` (seitenweit), sonst zeigt der Store-Button auf den Lizenzseiten beide Symbole und der „öffnet in neuem Tab"-Hinweis bleibt am Desktop hörbar. `home.css` verliert die Duplikate.

## 5. Entwurf

### 5.1 Lernweg kompakt (`HomeJourney.astro`, `home-motion.ts`, i18n)

- `.hj-step` ab 1024 px: `min-height: 44vh; padding: 28px 0 36px` (heute 80vh / 8vh). `.hj-step--quiz`: kein eigenes Mindestmaß mehr (heute 110vh); die Etappe ist so hoch wie Text, Chips und `QuizDemo` (Überschlag 680 bis 750 px). Die Quiz-Etappe begrenzt damit, wie kurz der Abschnitt werden kann: „halb so lang" ist mit dem Quiz auf Inhaltshöhe nicht erreichbar, rund 40 Prozent kürzer schon.
- Der Kicker `p.hj-kicker` („Etappe 01 / 04") entfällt im Markup und im CSS, auf allen Breiten. Die Übersetzung `home.journeyStage` wird in `de.ts` und `en.ts` entfernt. Der Marker `.hj-marker` (Nummer auf der Linie) bleibt die einzige Nummer.
- Die Etappen-Umschaltung bleibt unverändert: IntersectionObserver mit `rootMargin: -50% 0 -50% 0` schaltet, wenn eine Etappe die Bildschirmmitte kreuzt. Mit 52vh Mindesthöhe kreuzt jede Etappe die Mitte weiterhin; der Builder prüft bei 1280×620 (flaches Fenster), dass alle vier Etappen einmal aktiv werden (Testfall).
- Das sticky Gerät (`.hj-stage-sticky`, Höhe `100svh - 64px`) bleibt; sein `--pw` ändert sich nicht.
- Bindende Zielwerte (Testschwellen): Gesamthöhe `[data-journey]` bei 1440×900 unter 2100 px (heute 3150 px), bei 1280×620 unter 1750 px. Liegt der Build darüber, sinkt zuerst das Padding, dann das Mindestmaß (nicht unter 40vh); die Schwellen werden nicht angehoben.
- Unter 1024 px (Screenshot je Etappe) ändert sich nur der Wegfall des Kickers.

### 5.2 Preisliste: vier Spalten, Pakete als Karten (`HomePricing.astro`, i18n)

**Struktur je Gruppe** (Sportbootführerscheine, Funkscheine):

```
.hp-group
  .hp-group-head            (Titel, Hinweis – wie heute)
  .hp-group-body            (≥1024 px: grid minmax(0,1fr) 340px, gap 32px, align-items start)
    ul.hp-rows              (Einzellizenzen, 2 bzw. 3 Zeilen)
      li > a.hp-row         (ganze Zeile ist der Link zur Detailseite)
    aside.hp-bundle         (die Paket-Karte der Gruppe)
```

**Zeile `a.hp-row`** – vier Spalten, sobald die Zeilenliste mindestens 720 px breit ist (Container-Query auf `ul.hp-rows`, nicht Viewport-Breite; neben der Karte ist das ab etwa 1200 px Fensterbreite der Fall, einspaltig ab etwa 800 px): `minmax(0,1fr) 110px 110px 170px`, plus ein 20-px-Chevron (`Icon chevronRight`) als fünfte, schmale Spalte am rechten Rand, der die Zeile als Link ausweist. Darunter stapelt die Zeile; die Namensspalte bekommt so nie weniger als rund 215 px (Review-Befund: mit einer 900-px-Viewport-Schwelle kollabierte sie zwischen 1024 und 1150 px auf 58 px). Grundlinie aller Zellen bündig (`align-items: baseline`, Zahlen in `.h-num`):
1. Lizenz: Name (Archivo 22 px) und Untertitel (14,5 px, `--h-muted`); der heutige `note`-Zusatz („inkl. 15 Navigationsaufgaben à 9 Fragen") bleibt als dritte Zeile.
2. Fragen: Zahl 15 px `--h-ink`, Einheit 13 px `--h-muted`.
3. Themen: wie Fragen; Funkscheine ohne Themen zeigen „–" mit `aria-hidden` (wie heute).
4. Preis: `PlatformPrice` 24 px Archivo, darunter „einmalig" 12,5 px.
Die Zeile hat `min-height: 72px`, Hairline `--h-line-2` unten, Hover: Hintergrund `--h-blue-wash` mit 8 px Rundung und `margin-inline: -12px; padding-inline: 12px` (keine Layoutverschiebung), Chevron rückt 4 px nach rechts (`--h-ease`). Zugänglicher Name: „SBF Binnen, 300 Fragen, 8 Themen, 9,99 € einmalig, Details ansehen" entsteht aus dem Zeileninhalt; der sichtbare Linktext „Details ansehen" entfällt, dafür ein `sr-only`-Suffix „: Details ansehen" bzw. „: Mehr erfahren" (Funk) am Ende der Zeile. Unter 900 px stapeln die Zellen wie heute (`name` / `q t` / `price`), der Chevron sitzt rechts oben.

**Paket-Karte `aside.hp-bundle`** (eine je Gruppe; `aria-labelledby` auf ihren Titel):
- Fläche `--h-card`, `border-radius: var(--h-r)`, Haarlinie `--h-line` und derselbe weiche Schatten wie `.hp-model`; innen 28 px (24 px unter 640 px). Keine Farbfläche, kein Verlauf.
- Inhalt von oben: Badge `.hp-badge` („Paket" bzw. „Bundle", wie heute `p.bundleLabel`); Titel (Archivo 26 px: „Binnen + See", „Funk-Paket"); Untertitel (`p.bundleTagline` / `h.funkBundleTagline`); Kennzahl „730 Fragen · 2 Kataloge" bzw. „… · 3 Kataloge" (Summe wie heute; Katalogzahl = Anzahl `parts`); Preis groß (`PlatformPrice`, Archivo 36 px) mit Streichpreis und „Spare X €" je Store (`.pp-android` / `.pp-ios`, wie heute); Button `StoreCta`-Markup als `a.h-btn.h-btn--sm` mit `data-cta-position="pricing-bundle"` und Beschriftung `p.bundleChoose` (heutiger Link „Bundle wählen"); darunter `h.once` („einmalig, kein Abo" o. ä., vorhandener String) 12,5 px.
- Unter 1024 px steht die Karte unter den Zeilen der Gruppe, volle Breite.
- Dark Mode: Karte auf `--h-card` (dunkel), Haarline `--h-line`; Streichpreis/Ersparnis in `--h-blue-ink`-Dark-Wert wie heute `.hp-row--bundle .hp-price-sub`.

**Entfällt:** `.hp-row--bundle` (Paket als Zeile), `.hp-action` als sichtbarer Textlink je Zeile. Das Modell oben (`.hp-model`: Kostenlos / Vollzugang / CTA), der Preishinweis (PAngV) und der Schein-Finder bleiben unverändert.

**Store-Links in `#pricing`:** genau drei wie heute (zwei Paket-Buttons, ein `pricing-cta`). Die Detail-Zeilen sind interne Links.

### 5.3 Lizenzseiten: Rahmen und Seitenkopf (12 Seiten)

**Betroffene Dateien:** `src/pages/{sbf-binnen,sbf-see,ubi,src,lrc,fuehrerscheine}.astro` und `src/pages/en/{sbf-inland,sbf-coastal,ubi,src,lrc,licenses}.astro`.

**Neue Bausteine**
- `src/styles/page.css`: Klassen-Vokabular mit Präfix `pg-` auf den h-Tokens (unten), plus `@import '@fontsource-variable/archivo/wdth.css'`. Wird **nicht** in `global.css` eingebunden, sondern vom Kopf-Baustein importiert, damit Archivo und die Klassen nur auf Seiten landen, die den neuen Rahmen nutzen.
- `src/components/page/PageHead.astro` (importiert `page.css`): Props `lang`, `eyebrow`, `title` (darf `<br>` enthalten → als Slot), `lede`, `cta?: boolean` (Store-Button + Bewertung), `ctaLabel?`, `position` (default `page-head`), optionaler Slot `badge` (Funkseiten: „jetzt verfügbar · einmalig {PlatformPrice}" als `.pg-badge` zwischen Lede und Aktionen; so bleibt der Preis auch am Handy im Kopf sichtbar).
- `src/components/page/PageLayout.astro`: Props `lang`, `variant: 'read' | 'wide'`; rendert `.pg-layout` mit Slot `aside` (nur `read`) und Default-Slot `main`.
- `src/components/page/PageFacts.astro`: Props `title` („Auf einen Blick" / „At a glance"), `items: { k: string; v: string }[]`, optional `product?: ProductKey` (dann eine Preiszeile mit `PlatformPrice` und ein kleiner Store-Button `data-cta-position="page-aside"`).
- `src/components/page/PageLink.astro`: Textlink mit `Icon chevronRight` (ersetzt alle „→"-Links), Props `href`, `external?`.

**Seitenkopf `.pg-head`** (ersetzt den zentrierten Hero):
- Steht in `.h-container`, linksbündig, Textmaß `max-width: 760px`. Abstand oben `calc(64px + clamp(40px, 6vw, 72px))`, unten `clamp(32px, 4vw, 48px)`, darunter eine Haarlinie `--h-line` über die Containerbreite.
- `p.pg-eyebrow`: 12,5 px, `letter-spacing: 0.08em`, Versalien, `--h-blue-ink`, kein Pillen-Rahmen (heute: Pille mit Rahmen). Text wie heute („Sportbootführerschein Binnen", „Funkzeugnis", „Alle Lizenzen" …).
- `h1.pg-title`: `--h-display` (Archivo), `font-stretch: 84%`, Gewicht 760, `clamp(2.4rem, 4.6vw, 4rem)`, Zeilenhöhe 0,98, `letter-spacing: -0.02em`, `--h-ink`. Umbrüche der heutigen H1 bleiben (`<br>` im Slot).
- `p.pg-lede`: 18 px (17 px unter 640 px), Zeilenhöhe 1,6, `--h-muted`, `max-width: 58ch`, `text-wrap: pretty`.
- `.pg-actions` (nur mit `cta`): `StoreCta` (Beschriftung wie heute „Kostenlos laden" / „Download free", `position="page-head"`) und daneben die Bewertungszeile aus dem Hero (Sterne, Score, Anzahl); die Bewertungszeile wird dafür aus `HomeHero.astro` in `src/components/StoreRating.astro` ausgelagert und an beiden Stellen genutzt (gleiches Markup, Klassen `.hh-rating*` bleiben, damit die bestehenden Tests greifen).
- Hintergrund: `--h-paper` wie die Seite; kein eigener Streifen.

**Spaltenordnung `.pg-layout`**
- `variant="read"` (die zehn Lizenzseiten): ab 1024 px `grid-template-columns: minmax(0, 1fr) 320px; gap: 64px; align-items: start`, `grid-template-areas: "main aside"`; darunter einspaltig mit `"aside" "main"`, so steht die Fakten-Karte am Handy direkt unter dem Kopf. `.pg-main` hat `max-width: 780px`. `.pg-aside` ist ab 1024 px `position: sticky; top: 88px` (Kopfzeile 64 px + 24 px).
- `variant="wide"` (Führerschein-Übersicht DE/EN): eine Spalte über die Containerbreite; das `license-grid` behält seine drei Spalten, bekommt aber Tokens (siehe Zuordnung).
- Vertikaler Rhythmus: `.pg-section + .pg-section { margin-top: clamp(48px, 6vw, 64px) }`; Abstand Kopf → Inhalt `clamp(40px, 5vw, 56px)`.

**Fakten-Karte `PageFacts`** (im `aside`-Slot der zehn Lizenzseiten): `dl` mit 4 bis 5 Paaren, Werte in `.h-num`. Quelle je Seite sind die bereits vorhandenen Angaben der Seite (Prüfungsaufbau, Kosten, Vergleichstabelle); der Builder überträgt sie 1:1, keine neuen Fakten. Vorgabe je Seite:

| Seite | Paare (Begriff: Wert) |
|---|---|
| SBF Binnen / Inland | Fragenkatalog: 253+ · Theorieprüfung: 30 Fragen, 45 Min · Bestehensgrenze: 5 von 7 Basis, 18 von 23 spezifisch · Prüfungsgebühr 2026: 130,78 € · Mindestalter: 16 Jahre |
| SBF See / Coastal | Fragenkatalog: Zahl aus der Seite · Theorieprüfung: 30 Fragen + Navigation, 60 Min · Bestehensgrenze: wie auf der Seite · Prüfungsgebühr 2026: 148,38 € · Mindestalter: 16 Jahre |
| UBI, SRC, LRC | Fragenkatalog: Zahl aus der Seite · Prüfung: Aufbau aus „Prüfungsaufbau" · Gebühr: aus „Kosten" · Mindestalter: aus der Seite · Gültigkeit/Geltung: aus „Wer braucht es" (falls als Zahl/kurzer Wert vorhanden, sonst 4 Paare) |

Unter den Paaren, mit Haarlinie getrennt: „In der App ab {PlatformPrice} einmalig" und ein `a.h-btn.h-btn--sm` (generischer Play-Link, `data-cta-position="page-aside"`, Beschriftung „Kostenlos starten" / „Start for free"). Unter 1024 px wird dieser Preis/Button-Teil ausgeblendet (`display: none`), weil der Kopf-CTA unmittelbar darüber steht; die Paare bleiben.

**Zuordnung alter Inline-Blöcke → neue Klassen** (gilt für alle 12 Dateien; Texte, Links und Reihenfolge unverändert):

| Heute (Inline) | Neu |
|---|---|
| Hero-`div` mit Pille, H1, Text, Verlaufs-Button „▶ Kostenlos laden" | `PageHead` mit `cta` (Übersicht ohne `cta`) |
| `div[max-width:800px]` Inhaltsspalte | `PageLayout variant="read"`, Inhalt in `.pg-main`, `PageFacts` im `aside`-Slot |
| „Auf den Punkt"-Kasten (weiß, blauer linker Rand) | `.pg-answer`: `--h-card`, Haarlinie `--h-line`, Radius `--h-r`, Label 12 px Versalien `--h-blue-ink`, Text 17 px/1,6 `--h-ink` Gewicht 500; kein farbiger Rand |
| `h2.content-section-title` | `h2.pg-h2`: Archivo, Stretch 84 %, Gewicht 700, `clamp(1.5rem, 2.4vw, 1.9rem)`, `--h-ink`, `margin-bottom: 14px` |
| Fließtext `p[font-size:16px; color:#4B5563]` | `p.pg-p`: 16,5 px/1,7 `--h-text`; `strong` in `--h-ink` |
| Hinweistext 15 px `#656B78` | `p.pg-note`: 15 px/1,65 `--h-muted` |
| `exam-facts-grid` + weiße Karten mit Versal-Label | `.pg-cards.pg-cards--4` + `.pg-card` (Label `.pg-card-label`, Wert `.pg-card-text`); Karte: `--h-card`, Haarlinie, Radius `--h-r`, 20 px innen, kein Schatten |
| Karten-Raster `repeat(auto-fit, minmax(220px,1fr))` (Ablauf, Geltung, Wer braucht es) | `.pg-cards.pg-cards--3` + `.pg-card` mit `.pg-card-title` (16 px, 650) und `.pg-card-text` |
| Kosten-Karten mit großer Zahl | `.pg-cards.pg-cards--3` + `.pg-card.pg-card--kpi`: Zahl Archivo 26 px `--h-ink` (der App-Preis in `--h-blue-ink`), Unterzeile `.pg-card-text` |
| Vergleichstabelle (weiß, inline) | `.pg-table` (Wrapper `overflow-x: auto`, `table` mit `min-width: 640px`, Kopf `--h-paper-2`, Zeilen mit Haarlinie `--h-line`, 14 px/18 px Zellabstand, keine Zebra-Flächen) |
| FAQ-Karten | `.pg-faq` > `.pg-faq-item` (Karte wie `.pg-card`), `h3.pg-h3` 16 px 650, Antwort `.pg-card-text` |
| „Lernen nach Kategorie"-Zeilen mit farbigen Icon-Kacheln | `.pg-rows` > `.pg-row` (Haarlinie statt Karte, 56 px hoch, Icon in `--h-blue-wash`-Kachel 40 px mit `--h-blue-ink`-Strich; die heutigen Einzelfarben je Kategorie entfallen), Zähler als `.pg-pill` (Haarlinie, `--h-muted`) |
| „So hilft Boatpass"-Karten | `.pg-rows` wie Kategorien, ohne Zähler |
| Textlinks mit „→" / „… →" | `PageLink` (Chevron-Icon, `--h-blue-ink`, 15 px, 650, Unterstreichung bei Hover) |
| „Weiterführende Artikel" + `.related-links` mit „→ …"-Texten | `h2.pg-h2` (klein: `.pg-h2--sm` 18 px) + `ul.pg-related` > `li > a`: 44 px Zeilen, Haarlinie `--h-line`, Chevron rechts, ohne Pfeilzeichen im Text |
| Verfügbar-Badge im Hero (Funkseiten, grün, mit Preis) | `PageHead`-Slot `badge` → `.pg-badge`: Haarlinie, `--h-stbd-ink` Text, kleiner Punkt in `--h-stbd`, Preis per `PlatformPrice` in `.h-num` |
| „Boatpass UBI/SRC/LRC-Modul verfügbar"-Abschnitt (blauer Verlauf, Schatten, 40-px-Preis, weißer Button „▶ … freischalten") | `.pg-section` mit `.pg-cta`: Karte auf `--h-deep` mit `--h-on-deep`-Text (Dark Mode: `--h-card` mit Haarlinie), Radius `--h-r`, 28 px innen; links `h2.pg-h2` (auf Deep in `--h-on-deep`) und der heutige Text, rechts Preis (`PlatformPrice alt`, Archivo 32 px) mit „Einmalkauf"-Zeile und `a.h-btn.h-btn--sm` (generischer Play-Link, `data-cta-position="page-module"`, Beschriftung ohne „▶"). Kein Verlauf, kein Schatten. Der Abschnitt bleibt an seiner Stelle; die Seite hat damit drei Store-Links in `main` (Kopf, Aside, Modul). |
| Praxis-Brücke (DE: Komponente `PracticeBridge`; EN: derselbe Block inline mit `background:white`, `#1A1F36`, Verlauf) | `PracticeBridge` bekommt ein `lang`-Prop und eine Light-Touch-Migration: Inline-Farben und Verlauf → `.pg-card`/`.pg-note`-Klassen auf Tokens, Icon-Kachel `--h-blue-wash`, sonst unverändert (Struktur, Texte). Die EN-Texte kommen aus den heutigen EN-Inline-Blöcken in die Komponente; die sechs EN-Seiten (`sbf-coastal`, `ubi`, `src`, `lrc`) binden sie ein. Damit sind DE und EN identisch aufgebaut und der Farb-Test greift auch dort. |
| Führerschein-Übersicht: `finder-banner` (dunkler Verlauf) | `.pg-banner`: `--h-deep`-Fläche mit `--h-on-deep`-Text, Radius `--h-r`, Button als `a.h-btn.h-btn--sm` in Weiß auf Deep; Dark Mode: `--h-card` mit Haarlinie |
| Führerschein-Übersicht: `license-grid` / `license-card` | Klassen bleiben, Werte in `page.css` auf Tokens überschrieben (Karte `--h-card`, Haarlinie, Icon-Kachel `--h-blue-wash`), „Mehr erfahren →" → `PageLink`-Markup |
| Abschnitts-`section[margin-bottom:48px]` | `section.pg-section` |

**Eingebettete Komponenten** (`CatalogSources only=…`, `BoatSchoolFinder`, `PlatformPrice`): bleiben wie sie sind und stehen in `.pg-main` (sie enthalten keine der getesteten Inline-Farben und keine Pfeilzeichen). Ihre eigenen Abstände nach unten (`margin-bottom: 48px`) werden per `.pg-main > :where(section, div) { margin-bottom: 0 }` nicht neutralisiert; der Builder prüft, dass kein doppelter Abstand entsteht, und korrigiert über `.pg-section`-Abstände, nicht in den Komponenten.

**Dark Mode:** ausschließlich über die Tokens (`--h-card`, `--h-paper-2`, `--h-line`, `--h-ink`, `--h-text`, `--h-muted`, `--h-blue-ink`). Die `[style*=…]`-Regeln in `global.css` bleiben für die übrigen Seiten bestehen; auf den 12 Seiten greifen sie nicht mehr, weil es dort keine Inline-Farben mehr gibt (Testfall: `main [style*="#1A1F36"], main [style*="background:white"]` → 0).

**Schrift:** Archivo auf diesen 12 Seiten für `.pg-title`, `.pg-h2`, Kennzahlen und Preise; Fließtext bleibt Inter. Die Fontsource-Einbindung nutzt `font-display: swap`; die H1 bleibt das LCP-Element. Builder misst Lighthouse mobil für `/sbf-binnen/` vor und nach der Umstellung; eine LCP-Verschlechterung über 150 ms ist zu melden (nicht still hinzunehmen).

### 5.4 Was gleich bleibt
- Header, Footer, Hero, alle übrigen Startseiten-Abschnitte.
- Alle Texte, Schema.org-Blöcke, Breadcrumbs, URLs, hreflang.
- Die 34 nicht migrierten Seiten; `content-section-title`, `related-links`, `exam-facts-grid` in `global.css` bleiben für sie erhalten.

## 6. Lieferung

- **Zwei PRs** (Entscheidung des Builders, zur Prüfbarkeit): PR A „Lernweg und Preisliste" (5.1, 5.2), PR B „Lizenzseiten" (5.3). Beide zweigen von `main` ab; B kann beginnen, bevor A gemergt ist (disjunkte Dateien, außer `de.ts`/`en.ts`: dort nur additive bzw. getrennte Schlüssel). Jeder PR enthält seine Tests und eine kurze PR-Beschreibung mit Vorher/Nachher-Maßen.
- **Tests** (neue Datei `tests/e2e/premium-round-2.spec.ts`, Plausible abfangen wie in `premium-polish.spec.ts`):
  - Lernweg: kein `.hj-kicker`; `[data-journey]`-Höhe < 2000 px bei 1440×900 und < 1700 px bei 1280×620; alle vier Etappen werden beim Durchscrollen einmal `is-active`.
  - Preisliste: je Gruppe eine `.hp-bundle`-Karte, in ihr ein `a[data-cta-position="pricing-bundle"]`; `a.hp-row` führt zur Detailseite (href-Prüfung für SBF Binnen); bei 1280 px liegen die vier Spalten aller Zeilen einer Gruppe auf denselben x-Positionen (Toleranz 1 px); `#pricing a[href="/app/"]`-Anzahl wie heute (Desktop) – die bestehenden `conversion-journeys`-Tests decken das mit ab.
  - Lizenzseiten (DE und EN, je eine Seite exemplarisch plus Smoke über alle 12): `h1.pg-title` mit Archivo im berechneten `font-family`; `.pg-aside` sticky ab 1024 px und vor dem Inhalt unter 1024 px; `main [style*="#1A1F36"], main [style*="background:white"], main [style*="#3366FF"]` → 0; kein „→"/„▶" im `main`-Text; `main a[href="/app/"]` sichtbar; linke Kante von `.logo-link` und `.pg-title` gleich (Toleranz 1 px) bei 1440 px; kein horizontaler Überlauf bei 360 px.
  - Bestehende Suiten (`conversion-journeys`, `mobile-conversion-journeys`, `store-routing`, `lang-switcher`, `premium-polish`) bleiben grün.
- **Review:** frischer Reviewer über jeden Branch vor dem PR (wie Runde 1), danach Fix-Pass.
- **Sichtung:** Branch-Build im Browser-Pane für den Inhaber vor dem Merge; der Inhaber merged.

## 7. Dem Builder überlassen
- Exakte Abstände innerhalb der Vorgaben, Hover-/Fokus-Details, Reihenfolge der Commits.
- Ob `PageFacts` die Paare als `dl` oder Liste rendert (semantisch beides vertretbar; `dl` bevorzugt).
- Wie die EN-Fakten formuliert werden (Übersetzung der DE-Vorgaben, Werte identisch).
- Light-touch-Anpassungen an `BoatSchoolFinder`-/`CatalogSources`-Abständen, falls sie im neuen Rhythmus auffallen; keine Farb- oder Strukturänderung dort (Folgerunde).

## 8. Offene Punkte für spätere Runden
- Die übrigen 34 Seiten mit altem Aufbau auf `PageHead`/`PageLayout`/`pg-*` umstellen; danach `content-section-title`, `related-links`, `exam-facts-grid` und die `[style*=…]`-Dark-Mode-Regeln aus `global.css` entfernen.
- `CatalogSources`, `BoatSchoolFinder`, `CtaBanner`, `FeatureCards`, `PricingSection` auf Tokens und `.h-container`.
- Blog-Layout.

## 9. Nachtrag Builder-Check (2026-10-18)

Ein frischer Prüfer hat das Dokument gelesen; drei Punkte waren offen und sind oben als Entscheidungen des Autors eingearbeitet, keine davon ändert die Richtung des Inhabers:

1. **Funkseiten:** Der Verlaufs-Abschnitt „Modul verfügbar" wird als ruhige Deep-Karte `.pg-cta` nachgebaut (bleibt an seiner Stelle, drei Store-Links je Seite), das Hero-Preis-Badge kommt als Slot in `PageHead`.
2. **Praxis-Brücke:** `PracticeBridge` wird in dieser Runde light-touch auf Tokens gebracht und bekommt `lang`, damit DE und EN denselben Baustein nutzen und der Farb-Test auf allen zwölf Seiten greift.
3. **Lernweg:** 44vh statt 52vh Mindestmaß, bindende Schwellen 2100 px (1440×900) und 1750 px (1280×620); „halb so lang" ist mit dem Quiz auf Inhaltshöhe nicht erreichbar, rund 40 Prozent kürzer schon.

Dazu der Hinweis, dass die Geräteweichen-Klassen und `.h-num` seitenweit nach `brand.css` müssen (Abschnitt 4).
