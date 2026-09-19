# Interne Verlinkung – Audit & Empfehlungen (2026-09-19)

> Follow-up-Analyse zum Audit vom 2026-09-12. Prüft alle seither (13.09.–19.09.) neu
> veröffentlichten Artikel gegen sämtliche Hub-/Pillar-Seiten in `src/pages/**`, plus
> gezielte Suche nach bestehenden Textstellen, die das jeweilige Thema bereits ohne Link
> erwähnen. Inklusive Umsetzung der Findings (Textergänzungen, keine Layout-Änderungen),
> nicht nur Empfehlung.

## Geprüft: alle 2 seit 2026-09-12 neu erschienenen DE-/EN-Artikelpaare

| Datum | Artikel (DE-Slug) | Inbound-Links aus `src/pages/` vor diesem Audit |
|---|---|---|
| 09-16 | `seefunk-grundlagen-einsteiger` | ❌ **keine** |
| 09-17 | `wellen-sog-haftung` | ❌ **keine** |

(`promillegrenze-boot` wurde im Zeitraum aktualisiert, ist aber kein neuer Artikel und
bereits seit früheren Audits gut verlinkt – keine Prüfung nötig.)

Beide Artikel waren zum Zeitpunkt des Audits ausschließlich über die Blog-Übersicht
(`/blog/`, `/en/blog/`) und den zeitlich befristeten Homepage-Teaser (`BlogTeaser.astro`,
`sort(date desc).slice(0,3)`) erreichbar – kein einziger kontextueller Link von einer
Pillar-/Hub-Seite oder aus einem anderen Blogartikel. Gleiches wiederkehrendes Muster wie
in praktisch jedem Audit seit 2026-07-30.

## 1. `wellen-sog-haftung` / `boat-wake-wash-liability` ohne Pillar-Anbindung

**Thema:** Haftungsratgeber zu Wellenschlag und Sog (§ 6.20 BinSchStrO, KVR Regel 6 auf
See). Relevant für Binnen- und Seeschein gleichermaßen, da die Sorgfaltspflicht auf
beiden Fahrtgebieten gilt – identisches Muster wie beim Nachtfahrt-Artikel im
Vorgänger-Audit.

**Umgesetzt:**
- `src/pages/sbf-binnen.astro` und `src/pages/sbf-see.astro` (Block „Weiterführende
  Artikel"): neuer Eintrag direkt nach dem Nachtfahrt-Artikel (bisher letzter Eintrag
  beider Listen). Anchor-Text: „→ Wellenschlag und Sog – Rücksicht und Haftung auf dem
  Wasser"
- `src/pages/en/sbf-inland.astro` und `src/pages/en/sbf-coastal.astro`: analog, „→ Boat
  wake and suction: consideration and liability"
- Zusätzlicher **kontextueller Link im Fließtext** von
  `umweltschutz-gewaesserschutz-bootfahren.md` (DE) und
  `environmental-protection-boating-water-conservation.md` (EN), jeweils im Abschnitt
  „Lärm und Wellenschlag" / „Noise and Wash": Der bestehende Umweltschutz-Artikel
  erwähnte Wellenschlag bereits ausführlich, ohne auf die Haftungsfrage zu verweisen –
  naheliegendste denkbare Verknüpfung, da beide Artikel dasselbe Phänomen aus zwei
  Perspektiven (Umwelt vs. Haftung) behandeln.

**SEO-Begründung:** Schließt die Waisen-Lücke, bevor der Artikel den
Homepage-Teaser-Slot verliert (tritt automatisch nach zwei weiteren Veröffentlichungen
ein). Vier neue Hub-Links plus zwei kontextuelle Inline-Links stärken das
Themen-Cluster „Prüfungswissen/Verhaltensregeln" für SBF Binnen und SBF See gleichermaßen.

## 2. `seefunk-grundlagen-einsteiger` / `marine-radio-basics-beginners` ohne Pillar-Anbindung

**Thema:** Einsteiger-Grundlagen zum Seefunk (Kanal 16, DSC, MAYDAY/PAN PAN/SECURITE).
Inhaltlich die exakte Prüfungsvorbereitung für UBI- und SRC-Kandidaten – bislang gab es
keine dedizierte Einsteiger-Erklärung, obwohl beide Funkschein-Seiten dafür werben.

**Umgesetzt:**
- `src/pages/src.astro` und `src/pages/en/src.astro` (Block „Verwandte Führerscheine" /
  „Related licenses"): neuer Eintrag direkt neben dem bereits vorhandenen
  `ubi-vs-src-funkschein`-Link (identisches Themen-Cluster). Anchor-Text DE: „→ Seefunk
  für Einsteiger: Kanäle, DSC und Notruf verstehen", EN: „→ Marine radio basics:
  channels, DSC and distress calls"
- `src/pages/ubi.astro` und `src/pages/en/ubi.astro`: analog, direkt neben dem
  UBI-Fragenkatalog-Link (aus dem letzten Audit), da das Thema für Binnenfunk- und
  Seefunk-Kandidaten gleichermaßen relevant ist.
- Zusätzlicher **kontextueller Link im Fließtext** von
  `gps-kartenplotter-funkgeraet-moderne-navigation.md` (DE) und
  `gps-chartplotter-vhf-modern-navigation.md` (EN), jeweils im Abschnitt zum Funkgerät:
  Der bestehende Navigations-Artikel erklärt Funkgerät/DSC/MMSI nur kurz und verweist
  bereits auf den UBI-vs-SRC-Vergleich – jetzt zusätzlich auf die neue Einsteiger-Anleitung
  für den praktischen Umgang mit Kanälen und Notrufen, der nächste logische Lese-Schritt.

**Bewusst nicht verlinkt von** `sbf-pruefung-ablauf.astro` / `en/sbf-exam.astro` und
`sbf-binnen.astro` / `sbf-see.astro`: Diese Pillar-Seiten behandeln die SBF-Theorie- und
Praxisprüfung, nicht die separate Funkprüfung – eine Verlinkung dort wäre thematisch
ungenau. `src.astro` und `ubi.astro` sind die exakt passenden, dedizierten Hub-Seiten für
dieses Thema (gleiche Begründung wie beim UBI-Fragenkatalog-Artikel im Vorgänger-Audit).

**SEO-Begründung:** Beide Funkschein-Hub-Seiten (`src.astro`, `ubi.astro`) bewarben bisher
den amtlichen Fragenkatalog, verlinkten aber keine einführende Erklärung der
Grundbegriffe – eine Lücke für Einsteiger, die zuerst verstehen wollen, worum es beim
Seefunk überhaupt geht, bevor sie sich für ein Zeugnis entscheiden. Vier neue Hub-Links
plus zwei kontextuelle Inline-Links sichern Crawlbarkeit unabhängig vom
Homepage-Teaser-Fenster.

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- Der `BlogLayout`-eigene „Verwandte Artikel"-Algorithmus (Tag- + Titel-/Slug-Token-
  Überlappung) funktioniert unverändert und verlinkt neue Artikel automatisch in
  bestehende Artikel, sobald diese über gemeinsame Tags/Tokens gefunden werden.
- Keine toten internen Links im gebauten Output gefunden (211 Seiten geprüft, siehe
  Build-Log dieses Laufs – 0 broken links, 0 orphaned blog pages nach Umsetzung der
  obigen Fixes).
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden.
- Keine doppelten Links in den geprüften Pillar-Listen gefunden (Nebenbefund aus dem
  Vorgänger-Audit – Wasserski-Dopplung – bleibt behoben).

## Weiterhin offen (unverändert seit 2026-07-30, keine neue Priorität)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`, reines
  `sort(date desc).slice(0,3)`): unverändert. Bleibt das strukturelle Muster, das
  praktisch jeden neuen Artikel kurzzeitig zur Waise macht, bis er manuell verlinkt wird.
- **Single-Tag-Taxonomie** begrenzt „Verwandte Artikel" weiterhin strukturell
  (`src/content.config.ts`): unverändert, kein Quick-Fix.

## Priorisierte Kurzliste

1. ✅ `wellen-sog-haftung` / `boat-wake-wash-liability`: 4 Hub-Links + 2 kontextuelle
   Inline-Links ergänzt (sbf-binnen, sbf-see, EN-Pendants, umweltschutz-Artikel DE/EN).
2. ✅ `seefunk-grundlagen-einsteiger` / `marine-radio-basics-beginners`: 4 Hub-Links + 2
   kontextuelle Inline-Links ergänzt (src.astro, ubi.astro DE/EN, gps-kartenplotter-Artikel
   DE/EN).
3. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität, unverändert).
4. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung (unverändert
   größerer Aufwand, kein Quick-Fix).

---
_Analyse und Umsetzung durch Claude Code (automatisierte Routine), Datenbasis:
Codebase-Struktur (Stand 2026-09-19) + Vorgänger-Audit
`internal-linking-audit-2026-09-12.md`. Build nach Umsetzung erfolgreich (211 Seiten,
0 Fehler), Linkcheck-Skript ad hoc gegen `dist/` ausgeführt: 211 Seiten, 0 broken links,
0 orphaned blog pages._
