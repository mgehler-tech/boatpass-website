# Startseite Premium-Politur: Hero-Inszenierung, Reduktion, Header & Footer

**Datum:** 2026-10-17
**Status:** Freigegeben am 2026-10-17 (Inhaber)
**Basis:** origin/main (Homepage-Redesign PR 384), `src/components/home/*`, `src/styles/home.css`, `PRODUCT.md`
**Vorarbeit:** Critique vom 2026-10-17 (29/40), Snapshot unter `.impeccable/critique/2026-10-17T07-29-56Z__src-pages-index-astro.md`

---

## 1. Absicht und Warum

Die Startseite soll ein Premium-Gefühl vermitteln. Die Critique hat drei Ursachen benannt, warum sie das heute nicht tut:

1. **Flache Bühnen-Kästen.** Das Handy steht klein (216 px) in einer großen grauen Fläche (Hero 457×570 px, Lernweg sticky). Das liest sich als Platzhalter, nicht als Produkt. Es gibt kein Licht, kein Material, keine Welt.
2. **Kleinteiliger erster Viewport.** H1, Subline, Button, Bewertungsblock (Score 40 px + 5 Sterne + Quelle), vier grüne Häkchen-Fakten, Label plus fünf Katalog-Chips mit Zählern: neun Elemente konkurrieren. Die Bewertung erscheint fünfmal auf der Seite.
3. **Zwei Designsprachen.** Header und Footer (Inter 900, Pillen-Trio DE/EN + Theme + Button, Icon vor jedem Footer-Link, altes Navy #1A1F36) sprechen das Mai-System; die Seitenmitte spricht das Oktober-System (Archivo, Ink #0B1530, Haarlinien, Pillen-Buttons).

**Richtung (Entscheidung des Inhabers):** ruhig und luftig (viel Luft, wenige große Elemente, kaum Deko) **und** atmosphärisch (echte Fotografie von Wasser und Licht als Bühne). Fotos werden nach den Prompts in Anhang A mit ChatGPT erzeugt.

**Umfang dieser Runde (Entscheidung des Inhabers):** nur die drei P1-Punkte. Lernweg-Layout (Mindesthöhen, Dreifach-Nummerierung) und Preisliste folgen in einer eigenen Runde.

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
- Der erste Viewport wirkt wie ein Produkt in einer Welt: großes, angeschnittenes Gerät vor einem ruhigen Wasser-/Horizont-Foto, Text mit Luft. **Das Foto ist Teil des Ziels, nicht optional:** Ohne Foto ist Ursache 1 nicht behoben.
- Höchstens fünf Elemente im ersten Viewport (H1, Subline, Button mit kompakter Bewertung, eine ruhige Faktenzeile, eine ruhige Katalogzeile).
- Header und Footer sehen auf allen Seiten aus wie die neue Startseite: gleiche Tokens, gleiche Radien, gleiche Haarlinien, keine Icons als Dekoration.
- Die Bewertung erscheint höchstens dreimal pro Seite (DE: Hero kompakt, Rezensionen groß, Footer je Store; EN hat keine Rezensionen, dort zweimal).
- Alles funktioniert bei 375 px zuerst, hell und dunkel gleichwertig, DE und EN inhaltlich gleich.

**Nicht-Ziele (diese Runde)**
- Keine Änderung an Lernweg-Etappenhöhen, Nummerierung, Preisliste, FAQ, Ratgeber, Rezensions-Raster.
- Keine Migration der Unterseiten (SBF Binnen, See, Funk, Blog) auf Archivo oder h-Tokens. Sie erben nur den neuen Header und Footer.
- Keine neue Schrift, keine neue Akzentfarbe, kein neues Logo.
- Kein Umbau der Geräteweiche, der Store-Links oder der Plausible-Events.

**Anti-Ziele (das wäre ein Fehlschlag, auch wenn es technisch läuft)**
- Nautik-Kitsch: Anker, Tauwerk, Kompassrose, Wellen-Ornamente, Schreibmaschinenschrift.
- Ein Foto, das lauter ist als die Überschrift (Boote im Vordergrund, Menschen, harte Kontraste, Sonnenuntergangs-Orange).
- Dekorative Glas-Effekte, Verläufe im Text, leuchtende Schatten.
- Ein Hero, der am Laptop (1280×720) Button oder Handy unter den Rand schiebt.
- LCP-Verschlechterung über 3 s im Lighthouse-Lauf durch das Foto.

## 3. Rahmenbedingungen

- Astro 6, Tailwind 4 (nur Utilities, Design per CSS-Tokens), Inter Variable global, Archivo Variable nur auf der Startseite (home.css). Keine weitere Schriftdatei für Unterseiten.
- Tokens stehen heute in `home.css` unter `.home { … }`. Header und Footer liegen außerhalb von `.home`. Deshalb wandern die Farb-, Radius- und Easing-Tokens nach `:root` / `html.dark` (siehe Abschnitt 4.5).
- E2E-Tests (Playwright) verlassen sich auf diese Selektoren, die bleiben müssen: `#hero-cta-play`, `#final-cta-play`, `#footer-badge-ios`, `#footer-badge-play`, `#mobile-menu-btn`, `#mobile-menu`, `#mobile-acc-body`, `#licenses-trigger`, `#licenses-menu`, `#pricing`, `.mobile-nav-link` mit Text „Preise", `nav a` mit Text „Preise". `tests/e2e/lang-switcher.spec.ts` erwartet `.lang-switcher a` mit Text DE/EN und `.lang-active`; dieser Test wird an das neue Markup angepasst (Abschnitt 4.3).
- `data-cta-position` auf allen Store-Links bleibt (Plausible-Auswertung).
- WCAG 2.2 AA: Text ≥ 4,5:1, sichtbare Fokusringe, Tastatur. Text über Foto nur dort, wo ein Abdunkelungsverlauf den Kontrast sichert, besser: gar kein Text über dem Foto.
- `prefers-reduced-motion`: keine Parallaxe, kein Aufstieg des Handys, Header-Übergang sofort.
- DE und EN: alle Texte in `src/i18n/de.ts` und `en.ts`, Komponenten sprachneutral.
- Lighthouse-CI warnt bei LCP > 3000 ms, CLS > 0,25. Hero-Foto und Handy-Screenshot bekommen feste Abmessungen (kein CLS), `loading="eager"`, `fetchpriority="high"` nur auf dem LCP-Kandidaten.

## 4. Entscheidungen

### 4.1 Hero: Foto-Bühne statt grauer Kasten

**Desktop (≥ 1024 px)**
- Raster 12 Teile: Textspalte 7 Teile im Container, Foto-Paneel 5 Teile, das nach rechts **bis an den Viewport-Rand** läuft. Oben **beginnt das Paneel unter dem Header** (Abstand = Header-Höhe 64 px plus 16 px Luft), damit Navigation, Sprachlink und CTA nie über dem Foto liegen und der Kontrast ohne Foto-Abhängigkeit stimmt. Innen-Ecken (oben links, unten links) mit 28 px Radius, rechte Kante gerade, obere rechte Ecke ebenfalls gerade.
- Paneel-Höhe: `clamp(560px, 86vh, 820px)`. Die Textspalte ist vertikal auf das Paneel zentriert.
- Das Handy steht unten-mittig **vor** dem Foto, Breite `clamp(280px, 24vw, 360px)` (heute 200–256 px). Die unteren 12 % des Geräts werden vom Paneel abgeschnitten (`overflow: hidden`), das Gerät „steht im Wasser". Zwei Schatten: ein langer, weicher Fallschatten (`0 60px 120px -40px rgba(11,21,48,.55)`) und ein kurzer Kontaktschatten. Die Maus-Neigung (GSAP, `data-tilt`) bleibt.
- Keine Bildunterschrift, kein Rahmen, kein Chip auf dem Foto.
- Foto-Fallback bis die Assets da sind: eine ruhige zweistufige Fläche (`--h-paper-2` nach `--h-paper` mit weichem Lichtfleck oben links). Das Markup ist dasselbe, nur `src` fehlt. So lässt sich alles bauen und testen, das Foto wird später eingehängt.

**Tablet und Handy (< 1024 px)**
- Reihenfolge: H1, Subline, Button mit Bewertung, Faktenzeile, dann das Foto-Band **randabfallend** (negativer Gutter), Höhe `clamp(420px, 118vw, 540px)` unter 640 px, sonst 16:9. Das Handy steht unten-mittig, **220 px** breit (Gerätehöhe ≈ 460 px), die unteren **22 %** abgeschnitten; so bleiben bei 375 px rund 80 px Himmel über dem Gerät und je 77 px Wasser daneben, bei 360 px noch rund 65 px. Darunter die Katalogzeile.
- Keine Bühne mit Rundung und Rahmen mehr; das Foto ist die Fläche.

**Dark Mode**
- Dasselbe Foto mit Abdunkelung: Overlay `linear-gradient(180deg, rgba(8,11,20,.35), rgba(8,11,20,.6))` plus `filter: saturate(.85) brightness(.8)`. Optional später: Dämmerungs-Variante (Prompt A2) über zwei `<img>` mit CSS-Umschaltung, nur geladen, wenn `html.dark` gesetzt ist (per `<picture>` ist das nicht möglich, weil der Dark Mode klassenbasiert ist; der Builder entscheidet zwischen zwei `<img>` mit `loading="lazy"` auf der inaktiven oder einem späteren `src`-Tausch).

**Bild-Pipeline**
- Quelle: `src/assets/images/hero/water-day.jpg` (3:4, ≥ 2400 px breit) und `water-day-wide.jpg` (16:9, ≥ 2400 px breit). Art Direction (3:4 ab 1024 px, 16:9 darunter) geht nicht mit Astros `<Picture>` (kein `<source media>`); stattdessen `getImage()` je Format und Breite und ein handgebautes `<picture>` mit zwei `<source media>` (AVIF, dann WebP) und einem `<img>`-Fallback. `widths={[640, 960, 1280, 1920]}`, `quality={68}`. Zielgröße der 1280-px-Variante ≤ 140 KB. So lädt das Handy nie beide Bilder.
- Das Foto ist LCP-Kandidat am Desktop; der Handy-Screenshot bleibt `eager`, verliert aber `fetchpriority="high"` zugunsten des Fotos. Unter 1024 px ist die H1 LCP; das Foto-Band lädt `eager` ohne `fetchpriority`.
- Beide Bilder bekommen `width`/`height`, das Paneel eine feste `aspect-ratio`.

### 4.2 Reduktion des ersten Viewports

| Heute | Neu |
|-------|-----|
| Bewertungsblock: Score 40 px, 5 Sterne 13 px, zweizeilige Quelle | Eine Zeile rechts neben dem Button: 5 Sterne 12 px in `--h-beacon`, dann „4,96 · 29 Bewertungen" 14 px `--h-muted`. Score in Inter 600, nicht Archivo. |
| Vier Häkchen-Fakten in Grün | Eine Zeile Fließtext, 15 px, `--h-muted`, max. 46 ch, ohne Häkchen, ohne Grün: DE „Ohne Account starten, 15 Fragen täglich gratis. Danach Einmalkauf statt Abo, für iPhone, iPad und Android." EN sinngemäß. |
| „Amtliche Fragenkataloge 2026" + fünf Pillen mit Zählern | Eine ruhige Zeile unter dem Hero: Label „Amtliche Fragenkataloge 2026" in `--h-ink` 14 px, dann die fünf Lizenzen als schlichte Textlinks (dünne Unterstreichung wie `.h-link`, 14 px), durch „·" getrennt. Keine Zähler, keine Pillen. Die Fragenzahlen stehen weiter in der Preisliste. |
| Bewertung fünfmal (Hero, Rezensionen, Abschluss, Footer ×2) | Hero kompakt, Rezensionen groß (unverändert), Footer je Store. Der Abschluss-CTA zeigt keine Bewertung mehr (Button plus QR genügen). Im Footer erscheint eine Store-Bewertung nur, wenn der Store mindestens 10 Bewertungen hat (Regel in `data/apps.ts`, heute: Play 28 ja, App Store 1 nein). Die kombinierte Zahl (29) bleibt überall sonst korrekt. |

Die H1, die Subline und der Store-Button bleiben unverändert (Text, Größe, Geräteweiche).

### 4.3 Header

- **Fläche:** `color-mix(in srgb, var(--h-paper) 78%, transparent)` mit `backdrop-filter: blur(20px)`, Haarlinie `--h-line`. Dark: `--h-deep` 78 %. Auf der Startseite ist der Header **ganz oben transparent ohne Haarlinie** (er liegt dort über Papier, das Foto-Paneel beginnt erst darunter) und wird ab 24 px Scrollweg zur transluzenten Fläche (Klasse `is-scrolled` per IntersectionObserver auf einen Sentinel, Übergang 0,3 s, bei reduced-motion sofort). Auf Unterseiten ist er von Anfang an die Fläche.
- **Breite:** Header und Footer wechseln von `max-w-6xl px-6` (Inhalt 1104 px) auf `.h-container` (`--h-max` 1240 px, `--h-gutter`), damit Logo und H1 auf der Startseite bündig stehen. Auf den Unterseiten (noch `max-w-6xl`) steht das Logo dadurch vorübergehend 28 px links vom Seiteninhalt; das löst sich, wenn die Unterseiten in einer Folgerunde auf `.h-container` wechseln. Megamenüs positionieren sich relativ zu ihrem Auslöser und sind davon unberührt.
- **Logo:** unverändert (App-Icon 28 px + „Boat" Ink + „Pass" `--h-blue-ink`, Inter 800). Farben auf Tokens umstellen.
- **Navigation Desktop (≥ 1024 px), vier Einträge:** Features · Preise · Führerscheine ▾ · Ratgeber ▾. Blog und FAQ ziehen in das Ratgeber-Megamenü als dritte Gruppe „Lesen & Fragen" (Blog, FAQ). Inter 500, 15 px, `--h-text`, Hover `--h-ink`.
- **Megamenüs:** Tokens statt Hex, Radius `--h-r`, Schatten `0 1px 2px rgba(11,21,48,.04), 0 24px 48px -24px rgba(11,21,48,.3)`. Einträge als zwei Zeilen (Label Inter 600 15 px, Beschreibung 13 px `--h-muted`) **ohne Icon-Kachel**. Die Promo-Kachel wird flach `--h-deep` mit `--h-on-deep`-Text statt Verlauf. Gruppen-Überschriften bleiben, aber in Inter 600 13 px `--h-muted` ohne Versalien und ohne Laufweite.
- **Rechts:** ein Sprachlink („EN" auf deutschen Seiten, „DE" auf englischen) als Text 14 px Inter 600 mit `aria-label` („Zur englischen Version" / „Switch to German") und Ziel wie heute (gleiche Seite in der anderen Sprache). Das Pillen-Paar entfällt. Danach der CTA „App laden" als `.h-btn` in 40 px Höhe (Padding 0 16 px, ohne Icon-Kreis). Der Theme-Umschalter verlässt den Header (siehe Footer und mobiles Menü).
- **Handy (< 1024 px):** Logo links, rechts Sprachlink und Hamburger (44×44, kein Rahmenkasten, zwei Linien 18 px). Das Panel bleibt in Aufbau und Verhalten (Akkordeons, Fokusfalle, Escape, Backdrop) wie heute, bekommt aber die Tokens: Fläche `--h-paper`, Links Inter 600 18 px `--h-ink` mit 52 px Zeilenhöhe, Unterlinks 16 px `--h-text`, Trenner `--h-line`. Die Fußzeile des Panels enthält den CTA und den Theme-Umschalter.
- **Test-Anpassung:** `tests/e2e/lang-switcher.spec.ts` prüft künftig `a.lang-switch` (ein Link) auf das richtige `href` und klickt ihn; die Prüfung von `.lang-active` entfällt. Die Zielseiten-Erwartungen bleiben identisch.

### 4.4 Footer

- **Fläche:** `--h-paper-2`, Haarlinie oben `--h-line`. Dark: `#0D1018` bleibt, Linie `--h-line`.
- **Zeile 1:** Store-Badges (IDs `footer-badge-ios`, `footer-badge-play` bleiben) links, rechts daneben die Store-Bewertung(en) nach der 10er-Regel: Sterne 14 px `--h-beacon`, „4,96 von 5" Inter 600, „28 Bewertungen · Google Play" 13 px `--h-muted`.
- **Zeile 2:** drei Spalten Lizenzen · Ratgeber · BoatPass. Spaltentitel Inter 600 14 px `--h-ink`, Links Inter 400 15 px `--h-text`, Zeilenhöhe 2,1, **ohne Icons, ohne Chevrons, ohne Haarlinien zwischen den Zeilen**. Unter 640 px bleiben Ratgeber-Links ausgeblendet wie heute. Touch-Flächen ≥ 44 px über `padding-block`.
- **Zeile 3:** Haarlinie, dann in einer umbrechenden Zeile: „© 2026 Boatpass" · Datenschutz · Impressum · Nutzungsbedingungen · rechts außen der **Theme-Umschalter** als zwei Textschalter „Hell | Dunkel" (Inter 500 13 px, aktiver Wert `--h-ink`, inaktiver `--h-muted`, `aria-pressed`). Darunter „Entwickelt in Deutschland" 13 px `--h-muted` ohne Herz-Icon.
- Das Theme-Skript (localStorage `theme`, Klasse `html.dark`, Synchronisierung mehrerer Umschalter) zieht aus `Header.astro` in ein kleines gemeinsames Skript `src/scripts/theme-toggle.ts`, das Header (mobiles Menü) und Footer nutzen.

### 4.5 Tokens werden Seiten-Tokens

- Neue Datei `src/styles/brand.css`, importiert aus `global.css` nach Tailwind: alle `--h-*`-Farben, Radien, `--h-ease`, `--h-gutter`, `--h-max` unter `:root`, die Dark-Werte unter `html.dark`. `home.css` behält nur Layout und die Archivo-Einbindung; `.home { --h-… }` entfällt.
- Die alten Tailwind-Theme-Tokens (`--color-primary`, `--color-navy` …) bleiben bestehen, damit Unterseiten unverändert rendern. Header und Footer nutzen ausschließlich `--h-*`.
- Kein Unterseiten-Umbau in dieser Runde; sichtbar ändern sich dort nur Header und Footer.

### 4.6 Lernweg: Bühne ohne Kasten

- Der graue `h-stage`-Kasten hinter dem sticky Handy (Desktop) entfällt. Das Handy steht frei auf dem Papier, Breite `min(320px, calc((100svh - 64px) * 0.36))`, mit demselben Schattenpaar wie im Hero. Hinter dem Gerät ein sehr weicher, großer Lichtfleck in `--h-paper-2` (radial, 60 % Deckkraft), kein Rand.
- Die 12,5-px-Caption „01 / 04 — Titel" unter dem Handy entfällt (sie ist dreifach redundant; die Etappe steht links).
- Etappenhöhen, Marker und Kicker bleiben für die Folgerunde unverändert.

### 4.7 Bewegung

- Hero: Aufstieg des Handys (CSS, wie heute) und Maus-Neigung bleiben. Neu: das Foto bewegt sich beim Scrollen um 6 % langsamer als die Seite (GSAP ScrollTrigger, nur ≥ 1024 px und nur mit `h-motion`), das Handy nicht. Nichts läuft in Dauerschleife.
- Header: Wechsel transparent → Fläche 0,3 s `--h-ease`.
- Reduced motion: keine Parallaxe, kein Aufstieg, keine Übergänge; alles steht sofort.

### 4.8 Bild-Assets und Prompts

Anhang A enthält die Prompts. Benötigt werden mindestens Asset A1 (Tag, 3:4 und 16:9). A2 (Dämmerung) ist optional für den Dark Mode. Bis die Assets vorliegen, wird mit dem Fallback aus 4.1 gebaut; das Einhängen ist ein reiner Asset-Tausch.

## 5. Was dem Builder überlassen bleibt

- Exakte Schattenwerte, Lichtfleck-Radien, Abstände zwischen 1024 und 1279 px, Verhalten bei sehr niedrigen Fenstern (< 700 px Höhe: Paneel darf auf 560 px fallen, das Handy wird kleiner, nie der Button verdeckt).
- Ob das Foto-Paneel per `grid` oder per absoluter Positionierung an den Rand läuft; Bedingung: keine horizontale Scrollleiste bei 1024–1920 px, `overflow-x: clip` am Hero.
- Aufbau des Sentinels für den Header-Zustand, Dateiaufteilung für das Theme-Skript.
- Übergang der Mobile-Menü-Fläche (Fade/Slide), solange er unter 250 ms bleibt und bei reduced-motion entfällt.
- AVIF/WebP-Erzeugung über Astro `<Picture>` und die konkreten `widths`.
- Reihenfolge der Commits; Vorschlag: (1) Tokens nach :root, (2) Header, (3) Footer, (4) Hero-Reduktion, (5) Hero-Foto-Bühne, (6) Lernweg-Bühne, (7) Tests und EN-Texte, (8) Fotos einhängen.

## 6. Ergebnis des Builder-Checks

Ein unbeteiligter Entwickler hat das Dokument gegengelesen. Vier Punkte waren offen; drei sind hier entschieden (Aufrufe des Autors), einer ist die Entscheidung des Inhabers:

1. **Header über dem Foto** (entschieden): Das Paneel beginnt unter dem Header statt dahinter (4.1). Begründung: Die zentrierte Navigation und der Sprachlink lägen sonst bei 1280 bis 1920 px über dem Foto; Kontrast wäre vom Bild abhängig und im Dark Mode kritisch.
2. **Mobiles Band** (entschieden): 220 px Gerät, 22 % Anschnitt, Band `clamp(420px, 118vw, 540px)` (4.1). Die ursprünglichen 240 px mit 15 % passten bei 375 px nicht ins Band.
3. **Containerbreite** (entschieden): Header und Footer auf `.h-container` mit 1240 px (4.3). Unterseiten folgen in einer späteren Runde.
4. **Fotos in dieser Runde oder Fallback zuerst** (Inhaber, entschieden): Der Branch wartet auf die Fotos, ein einziger PR; die Bild-Pipeline wird mit echten Assets abgenommen. Die Fotos werden parallel zur Umsetzung erzeugt. Nachgefragt und bestätigt: Beide Gründerfotos (Marina und Segelboot) zeigen den Inhaber; sie bleiben unverändert.

Nebenbefunde: Die englische Startseite hat bewusst keine Rezensionen (Bewertung dort zweimal). `.lighthouserc.js` ist in keinem Workflow verdrahtet; der LCP-Vergleich ist ein lokaler Lauf vor und nach der Änderung.

## 7. Abnahme

- Screenshots hell/dunkel bei 375, 768, 1024, 1280×720, 1440×900: Button und Handy im Hero ohne Scrollen sichtbar; keine horizontale Scrollleiste. Auf der Startseite stehen Logo (Header) und H1 auf derselben linken Flucht.
- Erster Viewport am Desktop zeigt genau: H1, Subline, Button + Bewertungszeile, Faktenzeile, Foto-Paneel mit Handy. Katalogzeile darf unter dem Fold liegen.
- Bewertung erscheint auf der Startseite genau dreimal (Hero, Rezensionen, Footer).
- Header auf Startseite oben transparent, nach Scrollen Fläche; auf `/sbf-binnen/` von Anfang an Fläche. Vier Nav-Einträge, ein Sprachlink, ein CTA.
- Footer ohne Icons; Theme-Umschalter dort und im mobilen Menü funktionsfähig, Zustand bleibt nach Reload.
- `npm run build` fehlerfrei, `npx playwright test` grün (inkl. angepasstem lang-switcher-Test), Lighthouse-Lauf ohne neue Fehler, LCP-Warnung nicht schlechter als vor der Änderung (Vergleich auf dem Build der Basis).
- Kontrast geprüft: Kein Header-Element liegt über dem Foto (Paneel beginnt unter dem Header, Band auf dem Handy liegt unter der Textspalte). Nav, Sprachlink und CTA stehen auf Papier bzw. der transluzenten Fläche.
- DE und EN: alle neuen Strings in beiden Dateien, Seiten optisch identisch.

---

## Anhang A: Foto-Prompts (für ChatGPT-Bildgenerierung)

Alle Bilder: fotorealistisch, keine Menschen, kein Text, keine Logos, kein Wasserzeichen, keine Boote im Vordergrund. Die Bilder sind **Hintergrund**: ruhig, viel Negativraum, nichts darf mit einer Überschrift oder einem Handy davor konkurrieren. Farbwelt kühl und zurückhaltend, passend zu Papier #F0F4FA, Tinte #0B1530 und Blau #3366FF. Bitte jeweils die größte verfügbare Auflösung erzeugen (Ziel ≥ 2400 px lange Kante), als PNG oder JPG in höchster Qualität.

### A1a: Hero, Tag, Hochformat 3:4 (Desktop-Paneel)

```
Ultra-realistic photograph of calm open water in the early morning, shot from a low boat deck perspective at about 1.2 m above the surface. Horizon line in the lower third of the frame. Soft morning haze, pale blue-grey overcast sky brightening toward the upper left where diffused sunlight comes through. Water surface is almost still with very fine, gentle ripples and a soft silvery sheen; no waves, no spray. Far on the horizon, a faint low coastline or a single tiny distant sailboat is acceptable but must be barely visible. No people, no boats in the foreground, no birds, no text, no logos. Colour grading: cool, desaturated, slightly lifted blacks, muted blues and greys (#D9E2F0 sky, #9FB3CF water, #5F7596 shadows); absolutely no orange or golden sunset tones. Very clean, minimal composition with lots of empty sky in the upper two thirds. Natural optical look of a full-frame camera, 35 mm lens, f/8, deep focus, extremely fine grain. Portrait orientation 3:4, highest possible resolution.
```

### A1b: Hero, Tag, Querformat 16:9 (Handy- und Tablet-Band)

```
Same scene and same colour grading as before: ultra-realistic calm open water in early morning haze, pale blue-grey overcast sky brightening toward the upper left, horizon in the lower third, almost still water with fine gentle ripples and a soft silvery sheen. No people, no boats in the foreground, no birds, no text, no logos; at most a faint distant coastline. Cool, desaturated palette (#D9E2F0 sky, #9FB3CF water, #5F7596 shadows), no warm tones. Minimal composition with a lot of empty sky. Full-frame camera look, 35 mm, f/8, deep focus, extremely fine grain. Landscape orientation 16:9, highest possible resolution.
```

### A2 (optional, Dark Mode): Hero, blaue Stunde, 3:4 und 16:9

```
Ultra-realistic photograph of calm open water during the blue hour just after sunset, shot from a low boat deck perspective about 1.2 m above the surface. Horizon in the lower third. Deep navy sky (#0B1530 to #1C2B5A) with a faint cooler band of light along the horizon (#3A507F), no stars, no moon, no clouds with strong shapes. Water almost still with fine ripples reflecting the dark sky with a subtle steel-blue sheen. No people, no boats in the foreground, no lights, no text, no logos. Cool, desaturated grading, lifted blacks so the shadows are not pure black; no orange, no purple. Minimal composition with lots of empty sky. Full-frame camera look, 35 mm, f/8, deep focus, extremely fine grain. Produce one version in portrait 3:4 and one in landscape 16:9, highest possible resolution.
```

### Hinweise zur Abgabe
- Dateinamen: `water-day.jpg` (3:4), `water-day-wide.jpg` (16:9), optional `water-dusk.jpg`, `water-dusk-wide.jpg`.
- Ablage: `src/assets/images/hero/`. Astro erzeugt daraus AVIF/WebP in allen Breiten; es muss nichts vorab verkleinert werden.
- Wenn das Modell Boote oder warme Töne hinzufügt: Bild verwerfen und mit dem Zusatz „no boats, no warm tones, more empty sky" erneut erzeugen. Lieber ein zu leeres Bild als ein zu volles.
