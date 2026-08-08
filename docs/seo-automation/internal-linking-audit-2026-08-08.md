# Interne Verlinkung – Audit & Empfehlungen (2026-08-08)

> Follow-up-Analyse zum Audit vom 2026-08-07. Prüft, was seither umgesetzt wurde, und
> verifiziert diesmal die Orphan-Prüfung des letzten Laufs per direktem Repo-Grep statt
> nur über die vier großen Pillar-Seiten. Kein automatischer Code-Eingriff – Empfehlungen
> zur manuellen bzw. Linkcheck-Routine-Umsetzung.

## Was seit 2026-08-07 umgesetzt wurde

- **Stadtseiten → Wassersport-Reviere** (Top-Empfehlung 2026-08-07): `bootsfahrschulen/[city].astro`
  + `en/boat-schools/[city].astro` verlinken jetzt auf `wassersport-reviere-deutschland` /
  `boating-regions-in-germany` (Commit `bdab38c`). ✅ Erledigt, wirkt auf 26 Seiten.
- **Blog-Prosa → SBF-Binnen/SRC-Pillar** (heute, Commit `00af30f`): `notsignale-auf-see` /
  `distress-signals-at-sea` verlinken jetzt zusätzlich auf `sbf-binnen` / `sbf-inland`,
  `boot-fahren-ohne-fuehrerschein-15-ps` / `boating-without-license-15-hp` verlinken auf
  die SRC-Seite. ✅ Erledigt.

## Korrektur zur Orphan-Prüfung von 2026-08-07

Der letzte Audit meldete „keine Waisen" nach Prüfung „aller 51 DE-/EN-Artikel" gegen die
vier großen Pillar-Seiten (`sbf-see`, `sbf-binnen`, `sbf-pruefung-ablauf`,
`fuehrerscheine`). Ein Repo-weiter Grep über **alle** `src/pages/**/*.astro` inkl.
Blog-Prosa zeigt: Der Artikel `boot-startklar-machen-fruehjahr-checkliste-saisonstart` /
`getting-your-boat-ready-spring-checklist-season-start` – veröffentlicht am 07.08. um
12:50 Uhr, **vor** dem Audit-Lauf um 14:07 Uhr desselben Tages – hat **null**
Inbound-Links aus dem gesamten `src/`-Baum (weder Pillar-Seite noch FAQ, Tool- oder
Blog-Prosa). Er wurde von der letzten Prüfung offenbar übersehen. Diese Lücke ist damit
kein neuer Fund seit gestern, sondern ein nachgeholter aus dem Vortag – wird hier trotzdem
als eigener Punkt geführt, da sie weiterhin unbehoben ist.

## Neue Lücke: heutiger Artikel ohne Pillar-Anbindung (bekanntes, wiederkehrendes Muster)

Heute erschienen (Datum im Frontmatter: 2026-08-08, Commit `2a6de5c`):

- `peilung-kollisionskurs-cpa-erklaert` / `bearing-collision-course-cpa-explained`
  (Tag: „Navigation" – DE wie EN)

Wie in praktisch jedem Audit seit 2026-07-30 gilt: **null** Inbound-Links aus `src/pages/`
– weder Fließtext noch „Weiterführende Artikel"/„Further reading"-Blöcke. Einzige aktuelle
Sichtbarkeit: Homepage-Teaser (Rang 1, `BlogTeaser.astro`, reines `sort(date desc).slice(0,3)`)
und die Blog-Übersicht. Verliert den Homepage-Slot automatisch, sobald zwei weitere
Artikel erscheinen.

### 1. SBF-See-Pillar ohne Link zum neuen Peilung/CPA-Artikel
**Seiten:** `src/pages/sbf-see.astro` (Block „Weiterführende Artikel", Zeilen 366–398,
aktuell 26 Blog-Einträge – bereits die dichteste Navigations-Link-Sammlung der Domain:
Seekarte, Kursumrechnung, GPS/Kartenplotter, Gezeiten, Strömung/Tide, Seezeichen),
`src/pages/en/sbf-coastal.astro` (Block „Further reading", Zeilen ~395–424, identisches
Set an EN-Pendants).
**Ziel:** `/blog/peilung-kollisionskurs-cpa-erklaert/` bzw.
`/en/blog/bearing-collision-course-cpa-explained/`.
**Befund:** Der Artikel behandelt Peilung, gleichbleibende Peilung, KVR Regel 7 und
CPA/TCPA – exakt dieselbe Navigations-/Ausweichregel-Themenwelt wie die bereits verlinkten
Nachbarartikel (Kursumrechnung, GPS/Kartenplotter, Seekarte lesen). `sbf-see.astro` ist die
Seite mit den meisten Blog-Links der gesamten Domain und die naheliegendste
Themen-Passung.
**Vorschlag Anchor-Text:**
- DE: `→ Peilung und Kollisionskurs erkennen – CPA einfach erklärt`
- EN: `→ Bearing and collision course – CPA explained simply`
Als weiteren Eintrag in der bestehenden Liste ergänzen, identisches Markup wie die
Nachbar-Einträge (`<a href="..." style="color:#3366FF; text-decoration:none;
font-size:15px;">&rarr; ...</a>`), z. B. direkt nach dem GPS/Kartenplotter-Eintrag
(Zeile 379 DE / 406 EN), da beide Artikel thematisch benachbart sind (Radar/AIS-CPA vs.
manuelle Peilung).
**SEO-Begründung:** Höchste Priorität dieser Liste – reine Textergänzung ohne
Layout-Änderung, exakte thematische Übereinstimmung, sichert Crawlbarkeit unabhängig vom
Zufall des Homepage-Teaser-Fensters. Gleiches erfolgreich wiederholtes Muster wie in den
Audits vom 2026-07-30, 08-01 und 08-06 (jeweils folgenlos behoben innerhalb eines Tages).

### 2. Nachgeholte Lücke: Frühjahrs-Checkliste bleibt vollständig verwaist
**Seiten:** `src/pages/sbf-binnen.astro` (Block „Weiterführende Artikel", Zeilen 364–397,
aktuell 27 Einträge, direkt neben dem thematisch passenden Gegenstück „Boot einwintern –
Checkliste fürs Winterlager", Zeile 382), `src/pages/en/sbf-inland.astro` (EN-Pendant).
**Ziel:** `/blog/boot-startklar-machen-fruehjahr-checkliste-saisonstart/` bzw.
`/en/blog/getting-your-boat-ready-spring-checklist-season-start/`.
**Befund:** Verifizierter Volltreffer für „echte Waise" – repo-weiter Grep über `src/`
liefert außer der Artikeldatei selbst **keinen einzigen Treffer**. Das saisonale
Gegenstück „Boot einwintern" ist bereits seit Längerem ausschließlich von
`sbf-binnen.astro` aus verlinkt (nicht von `sbf-see.astro` oder `fuehrerscheine.astro`) –
für den neuen Frühjahrs-Artikel bietet sich exakt dieselbe Platzierung an, um das
etablierte Paar konsistent zu halten.
**Vorschlag Anchor-Text:**
- DE: `→ Boot startklar machen im Frühjahr – Checkliste zum Saisonstart`
- EN: `→ Getting your boat ready in spring – a season start checklist`
Direkt neben dem Winterlager-Eintrag einfügen (identisches Markup).
**SEO-Begründung:** Zweithöchste Priorität – der Artikel ist bereits einen Tag alt und
strukturell komplett von der internen Linkkraft der Domain abgeschnitten; sobald er aus
dem 3er-Homepage-Fenster fällt (nach nur einer weiteren Veröffentlichung), bleibt einzig
`/blog/` als Fundstelle. Die direkte Nähe zum saisonalen Gegenstück auf einer der
meistverlinkten Pillar-Seiten der Domain ist der günstigste und thematisch stimmigste
Hebel.

## Weiterhin offen (unverändert seit 2026-07-30, keine neue Priorität)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`, reines
  `sort(date desc).slice(0,3)`): unverändert. Beide oben genannten Artikel zeigen erneut,
  wie kurz das Zeitfenster ist, in dem ein neuer Artikel ohne Pillar-Link überhaupt
  sichtbar bleibt.
- **Single-Tag-Taxonomie** begrenzt „Verwandte Artikel" weiterhin strukturell
  (`src/content.config.ts`): unverändert, kein Quick-Fix. Gruppe „Prüfungswissen" bleibt
  mit Abstand größte Gruppe.
- **Prozess-Empfehlung (neu):** Die Orphan-Vollprüfung sollte künftig als repo-weiter Grep
  über `src/pages/**` und `src/content/blog/**` laufen (Artikel-Slug suchen, nicht nur die
  vier Pillar-Seiten manuell durchsehen) – hätte die Lücke aus Punkt 2 gestern bereits
  gefunden. Empfehlung für die nächste Linkcheck-Routine: dieses Grep-Muster fest in
  Schritt 3 der Routine übernehmen.

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- Die Stadtseiten-Empfehlung aus 2026-08-07 ist vollständig umgesetzt, keine Restarbeit.
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden.
- Alle 51 übrigen DE-/EN-Artikelpaare (außer den zwei oben genannten) bleiben von
  mindestens einer Hub-Seite aus erreichbar.

## Priorisierte Kurzliste

1. Peilung/Kollisionskurs-Artikel in `sbf-see.astro` + `en/sbf-coastal.astro` ergänzen –
   reine Textergänzung, höchste Themen-Passung, verhindert Verwaisung nach Ablauf des
   Homepage-Fensters.
2. Frühjahrs-Checkliste in `sbf-binnen.astro` + `en/sbf-inland.astro` neben dem
   Winterlager-Artikel ergänzen – schließt eine seit gestern bestehende, echte Waise.
3. Grep-basierte Vollprüfung in die Linkcheck-Routine übernehmen, um Übersehen wie bei
   Punkt 2 künftig zu vermeiden.
4. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität, unverändert).
5. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung (unverändert
   größerer Aufwand, kein Quick-Fix).

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis: Codebase-Struktur
(Stand 2026-08-08) + Vorgänger-Audit `internal-linking-audit-2026-08-07.md`. Keine
Code-Änderungen in diesem Lauf – Empfehlungen zur Umsetzung durch die Blog-/
Linkcheck-Routinen oder manuell._
