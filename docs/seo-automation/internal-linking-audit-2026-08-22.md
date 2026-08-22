# Interne Verlinkung – Audit & Empfehlungen (2026-08-22)

> Follow-up-Analyse zum Audit vom 2026-08-08. Prüft, was seither umgesetzt wurde, und
> führt die dort empfohlene Grep-basierte Vollprüfung über **alle** DE-/EN-Artikel gegen
> `src/pages/**` und `src/content/**` aus (nicht nur die vier Pillar-Seiten). Kein
> automatischer Code-Eingriff – reines Audit.

## Was seit 2026-08-08 umgesetzt wurde

- **Peilung/Kollisionskurs-Artikel** (Top-Empfehlung 2026-08-08): `sbf-see.astro` /
  `en/sbf-coastal.astro` verlinken jetzt auf `peilung-kollisionskurs-cpa-erklaert` /
  `bearing-collision-course-cpa-explained`. ✅ Erledigt, keine Waise mehr.
- **Frühjahrs-Checkliste** (zweithöchste Priorität 2026-08-08): `sbf-binnen.astro` /
  `en/sbf-inland.astro` verlinken jetzt auf
  `boot-startklar-machen-fruehjahr-checkliste-saisonstart` /
  `getting-your-boat-ready-spring-checklist-season-start`. ✅ Erledigt, keine Waise mehr.
- **Grep-basierte Vollprüfung** (Prozess-Empfehlung 2026-08-08): in diesem Lauf umgesetzt
  (siehe unten) – prüft jetzt alle Artikel, nicht nur Stichproben über die Pillar-Seiten.

## Vollständige Orphan-Prüfung (neu: alle 62 DE- und 62 EN-Artikel einzeln geprüft)

Repo-weiter Grep über `src/pages/**` und `src/content/**` für jeden einzelnen Artikel-Slug
(ausgenommen die Artikeldatei selbst und ihr fremdsprachiges Pendant, das die Prüfung nicht
verfälschen soll): **0 Waisen gefunden**, weder DE noch EN. Jeder Artikel hat mindestens
einen editoriellen Inbound-Link von einer Pillar-Seite oder aus dem Fließtext eines anderen
Blogposts – zusätzlich zur automatischen Auflistung auf `/blog/` bzw. `/en/blog/` (per
Content-Collection-Iteration, daher kein Grep-Treffer nötig, aber ebenfalls vollständig,
keine Paginierungs-Waisen).

Die fünf seit dem letzten Audit neu veröffentlichten Artikel wurden gezielt geprüft und sind
bereits vollständig angebunden:

| Artikel (DE-Slug) | Datum | Inbound-Links |
|---|---|---|
| `sportbootfuehrerschein-verloren-beschaedigt-ersatz` | 08-13 | `fuehrerscheine.astro` + EN-Pendant |
| `gewitter-blitzschlag-wasser-verhalten-vorsorge` | 08-14 | `sbf-see.astro` + EN-Pendant |
| `wasserskifahren-wakeboarden-regeln-beobachterpflicht` | 08-15 | `sbf-binnen.astro`, `sbf-see.astro`, 2× Blog-Fließtext + EN-Pendant |
| `schleusenfahrt-ablauf-verhalten-sportbootfahrer` | 08-16 | `sbf-binnen.astro` + EN-Pendant |
| `umweltschutz-gewaesserschutz-bootfahren` | 08-18 | `sbf-binnen.astro`, `sbf-pruefung-ablauf.astro`, `sbf-see.astro` + EN-Pendant |

Die EN-Fassungen sind jeweils spiegelbildlich von den passenden EN-Pillar-Seiten
(`en/sbf-coastal.astro`, `en/sbf-inland.astro`, `en/sbf-exam.astro`, `en/licenses.astro`)
verlinkt – EN/DE-Parität ist durchgehend gegeben.

## Hub-Struktur (Kontrolle)

- **Hauptnavigation** (`Header.astro`): verlinkt auf beide großen Pillar-Seiten (SBF Binnen,
  SBF See) sowie Führerscheine/Preise – von jeder Seite der Domain aus einen Klick entfernt.
- **Pillar-Seiten** bündeln weiterhin den Großteil der Blog-Linkkraft: `sbf-see.astro` (30
  Blog-Links), `en/sbf-coastal.astro` (30), `sbf-binnen.astro` (25), `en/sbf-inland.astro`
  (25), `sbf-pruefung-ablauf.astro` (11), `en/sbf-exam.astro` (11), `fuehrerscheine.astro`
  (10), `en/licenses.astro` (10).
- **BlogTeaser** (`BlogTeaser.astro`) verlinkt von der Startseite auf die 3 neuesten Artikel
  sowie generisch auf `/blog/`.
- **Blog-Übersichten** (DE/EN) listen weiterhin ausnahmslos alle Artikel.
- **Anchor-Text-Stichprobe:** keine generischen Anchor-Texte („hier klicken", „click here",
  „mehr erfahren") in `src/pages` oder `src/content` gefunden – alle geprüften Blog-Links
  nutzen beschreibende, themenspezifische Anchor-Texte.
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden.

## Ergebnis

Keine neuen Lücken. Die interne Verlinkung ist aktuell **gut optimiert**: Die
Vollprüfung (statt Stichprobe) bestätigt 0 Waisen über die gesamte Domain, beide aus dem
letzten Audit gemeldeten Lücken sind geschlossen, und die fünf seither neu erschienenen
Artikel wurden jeweils am Veröffentlichungstag an eine oder mehrere Pillar-Seiten
angebunden – der in früheren Audits beschriebene Prozess (Artikel + Pillar-Link im selben
oder folgenden Commit) funktioniert zuverlässig.

## Weiterhin offen (unverändert, keine neue Priorität – wie in jedem Audit seit 2026-07-30)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`, reines
  `sort(date desc).slice(0,3)`): strukturell unverändert. Kein akuter Handlungsbedarf, da
  neue Artikel inzwischen zuverlässig direkt einen Pillar-Link erhalten und dadurch nicht
  mehr ausschließlich vom 3er-Homepage-Fenster abhängen.
- **Single-Tag-Taxonomie** (`src/content.config.ts`): begrenzt „Verwandte Artikel"
  weiterhin strukturell. Kein Quick-Fix, größerer Aufwand, unverändert niedrige Priorität.

## Priorisierte Kurzliste

1. Keine akuten Maßnahmen – Domain ist vollständig verlinkt (0 Waisen, DE + EN).
2. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrige Priorität, unverändert).
3. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung (unverändert
   größerer Aufwand, kein Quick-Fix).

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis: Codebase-Struktur
(Stand 2026-08-22) + Vorgänger-Audit `internal-linking-audit-2026-08-08.md`. Vollständige
Grep-Prüfung aller 62 DE- und 62 EN-Blogartikel gegen `src/pages/**` und `src/content/**`.
Keine Code-Änderungen in diesem Lauf – Verlinkung bereits vollständig, keine Empfehlung
erforderlich._
