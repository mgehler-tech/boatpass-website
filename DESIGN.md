# BoatPass – Designsystem „Seekarte & Prüfungsbogen“

Stand: September 2026. Gilt bisher für die Startseite (`/`, `/en/`) samt Header, Footer und
Abschluss-Banner. Die Unterseiten nutzen noch die alte blaue Gestaltung und sollen schrittweise
folgen.

## Idee

Die Seite sieht aus wie das Material, mit dem man für den Schein lernt: Seekarte, amtlicher
Prüfungsbogen, Stempel. Keine generischen Web-Muster (Farbverläufe, Lichtflecken, Punktraster,
schwebende Handys, Pillen-Labels, Karten mit großen Radien, Laufbänder). Jede Verzierung muss
aus der Welt des Bootsführerscheins kommen und etwas bedeuten.

## Farben (Variablen in `src/styles/global.css`)

| Variable | Hell | Dunkel („Nachtpalette“) | Rolle |
|---|---|---|---|
| `--paper` | `#F5F3EC` | `#0B1118` | Seitengrund (Kartenpapier) |
| `--paper-2` | `#ECE8DC` | `#101923` | Bänder (Gründer, Footer) |
| `--sheet` | `#FFFEFA` | `#141E2A` | Prüfungsbogen, Flächen mit Inhalt |
| `--ink` / `--ink-2` | `#0F1B2A` / `#4A5668` | `#E8ECF1` / `#A5B0BF` | Text, Linien |
| `--water-1` / `--water-2` | `#E1ECF3` / `#C8DDEC` | `#0F2130` / `#143049` | Flachwasser-Stufen |
| `--contour` | `#8CB3D1` | `#2F5A7C` | Tiefenlinien |
| `--land` / `--land-ink` | `#EADBA8` / `#5B4B16` | `#3B3423` / `#E6D6A0` | Land, Merkhilfe, Textmarker |
| `--action` | `#2556D6` | `#3566E0` | Primär-Button (Blau der App) |
| `--link` | `#1F4DC4` | `#8FB0FF` | Textlinks |
| `--magenta` | `#A3246C` | `#E07AB6` | Karten-Annotationen (Leuchtfeuer, Wegpunkte, Kategorien) |
| `--port` / `--starboard` | `#B8322B` / `#1B7A4C` | `#F07A70` / `#62C997` | Backbord/Steuerbord = falsch/richtig, gültige Fassung |
| `--stamp` | `#3D3A9E` | `#A9A6FF` | Stempel „bestanden“ |

Alle Text-Kombinationen erreichen WCAG AA (≥ 4,5:1). Magenta, Rot und Grün nur sparsam als Akzent.

## Schrift

Archivo Variable (`wdth` 62–125 %, `wght` 100–900), selbst gehostet über Fontsource.

- **Display** (`.display`): `font-stretch: 76%`, Gewicht 780, Zeilenhöhe 0,96 – schmal und kräftig
  wie Beschriftungen auf Karten und Schifffahrtszeichen. Für H1/H2.
- **Text**: normale Breite, 15–20 px, Zeilenhöhe 1,5–1,65.
- **Labels**: 11–13 px, Versalien, Laufweite 0,08–0,1 em – ohne Pillen-Hintergrund.
- **Kursiv** nur für Karten-Annotationen (Lotungen, Kennungen, Hinweise), wie die Gewässer-Beschriftung
  auf Seekarten.
- Zahlen in Preisen/Bewertungen: `.num` (tabellarische Ziffern).

## Formen und Linien

- Radien: 2–3 px (Bogen, Kästchen, Legenden), 8 px (Buttons). Keine 16–28-px-Karten.
- Struktur über Linien statt Boxen: 2 px Druckfarbe als Kopflinie einer Tafel, 1 px Haarlinien
  (`--rule`, `--rule-2`) zwischen Zeilen.
- `.chart-rule`: die Minuten-Randskala einer Seekarte als Abschnittsgrenze (Hero, Abschluss-Banner).
  Sparsam einsetzen.
- Schatten nur, wo ein Gegenstand auf dem Tisch liegt (Prüfungsbogen, Screenshot).

## Bausteine der Startseite

- `HeroSection` – H1 als Kartentitel über die volle Breite, darunter Randskala; links Text und
  Download, rechts `ChartArt` mit `SampleQuestion`.
- `ChartArt` – Kartenausschnitt als SVG (Land, Tiefenlinien, Lotungen, Leuchtfeuer, Tonnen,
  Kompassrose), im Build erzeugt, dekorativ.
- `SampleQuestion` – echte Frage aus der App (Daten: `src/data/sampleQuestions.ts`, wortgleich),
  Ankreuz-Kästchen, Auswertung mit Erklärung und Merkhilfe; läuft ohne JS über `:has()`.
- `LearningSteps` – vier Screens auf einer Kurslinie mit Wegpunkten (WP 1–4).
- `FinderTeaser` – Flachwasser-Band mit drei leeren Formularzeilen.
- `Reviews` – Zitate mit Haarlinien, Stempel bei „bestanden“.
- `PricingSection` – Preistafel: Lizenz, amtlicher Katalog mit Fassung und ELWIS-Quelle, Preis.
- `HomeFaq`, `BlogTeaser`, `CtaBanner` – Linien statt Karten, Druckfarben-Band zum Abschluss.

## Bewegung

Nur wo sie etwas erklärt: Auswertung der Beispielfrage blendet ein, FAQ-Plus dreht zum Minus.
Keine Einblend-Animationen beim Scrollen, kein Schweben, keine Laufbänder.
`prefers-reduced-motion` schaltet alles ab.

## Umsetzung auf weiteren Seiten

`bodyClass="page-home"` am `BaseLayout` setzt Papiergrund sowie Header- und Footer-Farben.
Neue oder umgebaute Seiten sollten die Variablen oben nutzen statt fester Hex-Werte in
`style`-Attributen.
