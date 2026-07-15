# Interne Verlinkung – Audit & Optimierung (2026-07-10)

> Automatisierter Audit der internen Linkstruktur zur Verbesserung von
> Crawlability und Indexierung. Stand: Live-Codestand `src/` (Astro).

## Ausgangslage

Die interne Verlinkung ist bereits gut durchdacht: Jeder Blogpost bekommt
automatisch bis zu 3 „Verwandte Artikel" (Tag-Gewichtung, `BlogLayout.astro`),
die Blog-Übersicht (`/blog/`, `/en/blog/`) listet **alle** Artikel gruppiert
nach Themen-Cluster, und die zehn Produkt-/Service-Hubs (`sbf-see.astro`,
`sbf-binnen.astro`, `fuehrerscheine.astro`, `lrc.astro`, `src.astro`,
`ubi.astro`, `sbf-kosten.astro`, `faq.astro`, die `*-pruefungsfragen.astro`-
Seiten) haben feste „Weiterführende Artikel"-Blöcke mit kuratierten,
sprechenden Ankertexten (kein „hier klicken"). Das ist strukturell deutlich
besser als bei den meisten Wettbewerbern.

**Lücke:** Von 36 DE-Blogartikeln (36 EN-Pendants) waren nur 16 direkt von
einer Hub-Seite aus verlinkt. Die übrigen ~20 waren nur über `/blog/` selbst
oder das automatische Tag-Related-System erreichbar – u. a. mehrere Artikel zu
Kernthemen, die exakt in den Prüfungs-Curricula der Hub-Seiten genannt werden
(Ausweichregeln, Schallsignale, Ankern, Seekarte, Mann-über-Bord, 15-PS-Regel),
aber dort nicht verlinkt waren.

## Umgesetzte Fixes (bereits committed)

Alle Änderungen nutzen ausschließlich bestehende Patterns der jeweiligen
Seite (kein neues Component-Design) und wurden gegen einen lokalen
`astro build` verifiziert (111 Seiten, keine Fehler, alle Ziel-Slugs
existieren).

| # | Datei | Änderung | Ziel | Begründung |
|---|---|---|---|---|
| 1 | `sbf-pruefung-ablauf.astro` (+ `en/sbf-exam.astro`) | Zwei Feature-Karten hatten bereits ein `href`-Feld, das aber auf `null` gesetzt war („Manöver", „Bootsführung & Sicherheit") | `/blog/anlegen-ablegen-hafenmanoever/`, `/blog/ausweichregeln-vorfahrt-wasser/` | Wörtlicher Bug/Lücke im bestehenden Code – die Verlinkungs-Logik war fertig gebaut, nur die URLs fehlten |
| 2 | `sbf-pruefung-ablauf.astro` (+ EN) | „Weiterführende Seiten" um 2 Links ergänzt | `mann-ueber-bord-manoever`, `schallsignale-sbf-erklaert` | Beide Themen werden auf der Seite genannt, aber bisher nicht verlinkt |
| 3 | `sbf-pruefung-ablauf.astro` (+ EN) | Neuer Satz mit Inline-Link im Abschnitt „Voraussetzungen & Anmeldung" | `sbf-pruefung-anmelden` | 1:1-Themenmatch (Anmeldung bei DSV/DMYV), bisher unverlinkt |
| 4 | `sbf-see.astro` | „Weiterführende Artikel" um 2 Links ergänzt | `richtig-ankern-grundlagen-ankerarten-fehler`, `seekarte-lesen-lernen` | Kernthemen der SBF-See-Praxis-/Navigationsprüfung, bisher unverlinkt |
| 5 | `sbf-binnen.astro` | Inline-Link in der Eröffnungs-Prosa („11,03 kW / 15 PS") | `boot-fahren-ohne-fuehrerschein-15-ps` | Direkter Themenbezug zur genannten Leistungsgrenze |
| 6 | `sbf-binnen.astro` | „Weiterführende Artikel" um 2 Links ergänzt | `ausweichregeln-vorfahrt-wasser`, `schallsignale-sbf-erklaert` | Analog zu SBF See, bisher unverlinkt |
| 7 | `en/sbf-coastal.astro`, `en/sbf-inland.astro` | Spiegelung von 4/5/6 für die EN-Seiten | `anchoring-basics-anchor-types-mistakes`, `how-to-read-a-nautical-chart`, `right-of-way-collision-rules`, `sound-signals-sbf-explained`, `boating-without-license-15-hp` | Parität zur DE-Seite |

**Ergebnis:** 8 vorher unverlinkte Artikel (DE) bzw. deren EN-Pendants sind
jetzt von den höchst-frequentierten Produktseiten aus erreichbar –
Ausweichregeln, Schallsignale, Anlegen/Ablegen, Mann-über-Bord, Ankern,
Seekarte lesen, 15-PS-Regel, SBF-Prüfung anmelden.

## Verbleibende Opportunities (nicht umgesetzt – Empfehlung)

Diese Artikel sind weiterhin nur über `/blog/` bzw. das Tag-Related-System
erreichbar. Priorisiert nach Relevanz für die höchst-frequentierten Hub-Seiten:

1. **`lichterfuehrung-erklaert`** – `sbf-see.astro`/`sbf-binnen.astro` nennen
   „Schifffahrtszeichen und Lichterführung" als reinen Text-Listenpunkt
   (Zeile ~69–70). Empfehlung: Listenpunkt in Link umwandeln oder Satz mit
   Anker „Lichterführung erklärt" ergänzen.
2. **`wetterkunde-beaufort`** – Card-Beschreibung „Wind, Wetter, Gezeitentafel
   & Vorhersage" auf `sbf-see.astro`/`sbf-see-pruefungsfragen.astro` ist aktuell
   reiner Text ohne Link-Fähigkeit der Card-Komponente.
3. **`gezeiten-zwoelftelregel`** und **`kursumrechnung-sbf-see`** – beide
   passen exakt zur Navigationsaufgaben-Beschreibung auf `sbf-see.astro` /
   `sbf-see-pruefungsfragen.astro` („Kurse abtragen … Gezeiten berücksichtigen").
4. **`seezeichen-lateralsystem`** / **`betonnung-nordsee-ostsee-unterschiede`**
   – Navigation-Cluster, kein aktueller Hub-Bezug; Kandidat für
   „Weiterführende Artikel" auf `sbf-see.astro`.
5. **`rettungsweste-auftriebsklassen`**, **`erste-hilfe-an-bord`**,
   **`fkn-pyrotechnik-seenotsignalmittel`** – Sicherheitsthemen ohne
   Hub-Anbindung; passen z. B. in die Sicherheits-Absätze von `sbf-see.astro`
   oder als zusätzliche Links auf `lrc.astro`/`src.astro`/`ubi.astro`
   (dort bereits `notsignale-auf-see` verlinkt – guter Nachbar-Slot).
6. **`sbf-gueltigkeit-welcher-schein-wo`**, **`sbf-im-ausland-gueltig`** –
   passen thematisch zu `fuehrerscheine.astro` und `faq.astro`.

Diese wurden bewusst nicht automatisch verlinkt, weil sie entweder (a) eine
Komponenten-Änderung erfordern würden (Card-Komponenten ohne `href`-Slot) oder
(b) redaktionelle Abwägung brauchen, *welcher* von mehreren passenden Artikeln
an einer Stelle verlinkt werden soll, um Link-Dilution zu vermeiden.

## Nicht verändert (bewusst)

- Die Kategorie-Cluster auf `/blog/` und `/en/blog/` (`categoryMeta`) decken
  bereits alle 6 Tag-Kategorien ab; jeder Artikel erscheint dort. Kein
  Orphan-Risiko auf Blog-Ebene.
- Das automatische „Verwandte Artikel"-System (`BlogLayout.astro`) ist
  korrekt implementiert und wurde nicht angefasst.

## Re-Audit (2026-07-15) – Status: alle Lücken geschlossen

Alle 6 „Verbleibende Opportunities" aus dem Audit vom 2026-07-10 wurden in der
Zwischenzeit umgesetzt (siehe `sbf-see.astro` „Weiterführende Artikel":
`lichterfuehrung-erklaert`, `wetterkunde-beaufort`, `gezeiten-zwoelftelregel`,
`kursumrechnung-sbf-see`, `seezeichen-lateralsystem`; `sbf-binnen.astro`:
`rettungsweste-auftriebsklassen`; `sbf-pruefung-ablauf.astro`:
`erste-hilfe-an-bord`; `sbf-see.astro`: `fkn-pyrotechnik-seenotsignalmittel`;
`faq.astro`: Inline-Links zu `sbf-gueltigkeit-welcher-schein-wo` und
`sbf-im-ausland-gueltig`).

Vollständige Prüfung aller 37 DE- und 37 EN-Blogartikel gegen die 12
Haupt-Hub-Seiten (Homepage, `sbf-see`/`sbf-binnen`, `fuehrerscheine`, `lrc`,
`src`, `ubi`, `sbf-kosten`, `faq`, `sbf-pruefung-ablauf`, beide
`*-pruefungsfragen`-Seiten, Finder-Tool) sowie deren EN-Pendants ergab: **jeder
einzelne Artikel hat mindestens einen kontextuellen Inbound-Link von einer
Hub-Seite**, alle mit sprechenden Ankertexten (kein „hier klicken"). Neu seit
dem letzten Audit hinzugekommene Artikel
(`betonnung-nordsee-ostsee-unterschiede`, `sbf-eigenes-boot-oder-charterboot`,
inkl. EN-Pendants) sind ebenfalls bereits verlinkt (`sbf-see.astro` bzw.
`sbf-kosten.astro`).

Zusätzlich geprüft und unauffällig:
- `robots.txt` blockiert nichts; kein Blogpost trägt `draft`/`noindex` im
  Frontmatter.
- `/blog/`- und `/en/blog/`-Übersichten haben kein Slice/Limit – sie listen
  weiterhin ausnahmslos alle Artikel.
- `BlogTeaser.astro` (Homepage) zeigt die 3 neuesten Artikel plus Link zu
  „Alle Artikel" – Homepage → `/blog/` → jeder Artikel bleibt in 2 Klicks
  erreichbar.

**Ergebnis:** Keine offenen Linking-Gaps und keine Orphan-Seiten gefunden.
Keine Code-Änderung in diesem Durchgang nötig.
