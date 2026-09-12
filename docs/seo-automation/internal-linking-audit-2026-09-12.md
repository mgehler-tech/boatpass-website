# Interne Verlinkung – Audit & Empfehlungen (2026-09-12)

> Follow-up-Analyse zum Audit vom 2026-08-29. Prüft alle seither (30.08.–12.09.) neu
> veröffentlichten Artikel gegen sämtliche Hub-/Pillar-Seiten in `src/pages/**`, plus
> stichprobenartige Prüfung bestehender Hub-Listen auf Redundanzen. Diesmal inklusive
> Umsetzung der Findings (Textergänzungen, keine Layout-Änderungen), nicht nur Empfehlung.

## Geprüft: alle 2 seit 2026-08-29 neu erschienenen DE-/EN-Artikelpaare

| Datum | Artikel (DE-Slug) | Inbound-Links aus `src/pages/` vor diesem Audit |
|---|---|---|
| 09-09 | `ubi-fragenkatalog-2026` | ❌ **keine** |
| 09-11 | `nachtfahrt-sportboot` | ❌ **keine** |

Beide Artikel waren zum Zeitpunkt des Audits ausschließlich über die Blog-Übersicht
(`/blog/`, `/en/blog/`) und den zeitlich befristeten Homepage-Teaser (`BlogTeaser.astro`,
`sort(date desc).slice(0,3)`) erreichbar – kein einziger kontextueller Link von einer
Pillar-/Hub-Seite oder aus einem anderen Blogartikel. Gleiches wiederkehrendes Muster wie
in praktisch jedem Audit seit 2026-07-30.

## 1. `nachtfahrt-sportboot` / `boating-at-night` ohne Pillar-Anbindung

**Thema:** Praxis-Ratgeber zur Nachtfahrt (Vorbereitung, Lichterführung anwenden,
Nachtsicht, Pflichten). Passt inhaltlich zu beiden SBF-Scheinen, da Nachtfahrt-Regeln
sowohl für Binnen- als auch für Seeschein-Inhaber gelten.

**Umgesetzt:**
- `src/pages/sbf-binnen.astro` (Block „Weiterführende Artikel“) und
  `src/pages/sbf-see.astro` (dito): neuer Eintrag direkt nach dem
  Umweltschutz-Artikel (dem bisher letzten Eintrag beider Listen).
  Anchor-Text: „→ Nachtfahrt mit dem Sportboot – sicher durch die Dunkelheit“
- `src/pages/en/sbf-inland.astro` und `src/pages/en/sbf-coastal.astro`: analog,
  „→ Boating at night: how to stay safe after sunset“
- Zusätzlicher **kontextueller Link im Fließtext** von `lichterfuehrung-erklaert.md`
  (DE) und `navigation-lights-explained.md` (EN), jeweils im Fazit-Absatz: Die
  Lichterführungs-Theorie verweist jetzt auf den praktischen Nachtfahrt-Artikel –
  thematisch die engste denkbare Verknüpfung (Theorie → Praxis), da beide Artikel
  exakt dieselbe Prüfungs-/Praxis-Situation behandeln.

**SEO-Begründung:** Schließt die Waisen-Lücke, bevor der Artikel den
Homepage-Teaser-Slot verliert (tritt automatisch nach zwei weiteren Veröffentlichungen
ein). Vier neue Hub-Links plus zwei kontextuelle Inline-Links stärken das
Themen-Cluster „Praxis/Sicherheit" für SBF Binnen und SBF See gleichermaßen.

## 2. `ubi-fragenkatalog-2026` / `ubi-question-catalog-2026` ohne Pillar-Anbindung

**Thema:** Ankündigung des neuen amtlichen UBI-Fragenkatalogs zum 1. Oktober 2026
(VDES statt MIB, neue Sprechfunktafel). Zeitkritischer Inhalt – Relevanz sinkt nach
dem Stichtag spürbar, daher besonders wichtig, ihn jetzt sauber anzubinden.

**Umgesetzt:**
- `src/pages/ubi.astro` und `src/pages/en/ubi.astro`: neuer Eintrag im Block
  „Verwandte Führerscheine“ / „Related licenses“, direkt neben dem bereits
  vorhandenen `ubi-vs-src-funkschein`-Link (identisches Themen-Cluster).
  Anchor-Text DE: „→ UBI-Fragenkatalog 2026: Das ändert sich zum 1. Oktober“
  Anchor-Text EN: „→ UBI question catalog 2026: what changes on October 1"
- Zusätzlicher **kontextueller Link im Fließtext** von `ubi-vs-src-funkschein.md`
  (DE) und `ubi-vs-src-radio-license.md` (EN) im Abschnitt „Wie du dich am besten
  vorbereitest" / „How to Prepare": Der bestehende, gut verlinkte Vergleichsartikel
  verweist jetzt direkt auf die Katalog-Änderung – naheliegendster Ankerpunkt, da
  Leser dieses Artikels aktiv nach Prüfungsvorbereitung suchen.

**Bewusst nicht verlinkt von** `sbf-pruefung-ablauf.astro` / `en/sbf-exam.astro`:
Diese Pillar-Seiten behandeln die SBF-Prüfung, nicht die UBI-Funkprüfung – eine
Verlinkung dort wäre thematisch ungenau. `ubi.astro` ist die exakt passende,
dedizierte Hub-Seite für dieses Thema.

**SEO-Begründung:** Einzige inhaltliche Hub-Seite für UBI-Themen war bisher ohne
Verweis auf die wichtigste UBI-Neuigkeit des Jahres. Zwei Hub-Links plus zwei
kontextuelle Inline-Links sichern Crawlbarkeit unabhängig vom Homepage-Teaser-Fenster,
das für diesen Artikel bereits in ca. zwei Wochen ausläuft.

## 3. Nebenbefund: doppelter Link in vier Pillar-Listen (behoben)

Beim Einfügen der neuen Einträge fiel auf, dass der Artikel
`wasserskifahren-wakeboarden-regeln-beobachterpflicht` (DE) bzw.
`water-skiing-wakeboarding-rules-observer-duty` (EN) in allen vier
SBF-Pillar-Seiten (`sbf-binnen.astro`, `sbf-see.astro`, `en/sbf-inland.astro`,
`en/sbf-coastal.astro`) **zweimal** mit unterschiedlichem Anchor-Text gelistet war
(vermutlich aus zwei separaten früheren Linking-Durchläufen). Doppelte interne Links
auf dieselbe URL verwässern den Linkwert der Liste und wurden entfernt (jeweils die
zweite, kürzere Anchor-Text-Variante); die erste, deskriptivere Variante bleibt
erhalten. Keine Inhalts- oder Layoutänderung, reine Bereinigung.

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- Der `BlogLayout`-eigene „Verwandte Artikel"-Algorithmus (Tag- + Titel-/Slug-Token-
  Überlappung) funktioniert unverändert und verlinkt neue Artikel automatisch in
  bestehende Artikel, sobald diese über gemeinsame Tags/Tokens gefunden werden.
- Keine toten internen Links im gebauten Output gefunden (208 Seiten geprüft, siehe
  Build-Log dieses Laufs – 0 broken links, 0 orphaned blog pages nach Umsetzung
  der obigen Fixes).
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden.

## Weiterhin offen (unverändert seit 2026-07-30, keine neue Priorität)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`, reines
  `sort(date desc).slice(0,3)`): unverändert. Bleibt das strukturelle Muster, das
  praktisch jeden neuen Artikel kurzzeitig zur Waise macht, bis er manuell verlinkt
  wird.
- **Single-Tag-Taxonomie** begrenzt „Verwandte Artikel" weiterhin strukturell
  (`src/content.config.ts`): unverändert, kein Quick-Fix.

## Priorisierte Kurzliste

1. ✅ `nachtfahrt-sportboot` / `boating-at-night`: 4 Hub-Links + 2 kontextuelle
   Inline-Links ergänzt (sbf-binnen, sbf-see, EN-Pendants, lichterfuehrung-erklaert).
2. ✅ `ubi-fragenkatalog-2026` / `ubi-question-catalog-2026`: 2 Hub-Links + 2
   kontextuelle Inline-Links ergänzt (ubi.astro DE/EN, ubi-vs-src-funkschein DE/EN).
3. ✅ Doppelten Wasserski-Link in 4 Pillar-Seiten bereinigt.
4. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität,
   unverändert).
5. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung
   (unverändert größerer Aufwand, kein Quick-Fix).

---
_Analyse und Umsetzung durch Claude Code (automatisierte Routine), Datenbasis:
Codebase-Struktur (Stand 2026-09-12) + Vorgänger-Audit
`internal-linking-audit-2026-08-29.md`. Build nach Umsetzung erfolgreich
(207 Seiten, 0 Fehler), Linkcheck-Skript ad hoc gegen `dist/` ausgeführt: 208 Seiten,
0 broken links, 0 orphaned blog pages._
