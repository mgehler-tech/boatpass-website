# Interne Verlinkung – Audit & Empfehlungen (2026-08-01)

> Follow-up-Analyse zum Audit vom 2026-07-30. Prüft, was seither umgesetzt wurde, und
> deckt neue Lücken auf (u. a. durch 2 neue Blogartikel seit dem letzten Lauf). Kein
> automatischer Code-Eingriff – Empfehlungen zur manuellen bzw. Linkcheck-Routine-Umsetzung.

## Was seit 2026-07-30 umgesetzt wurde

- **Finder-Tool → Blog** (ehem. Empfehlung #3): `src/pages/tools/welcher-bootsfuehrerschein.astro`
  und `src/pages/en/tools/which-boating-license.astro` verlinken jetzt je 3 Ergebnistexte
  in passende Blogartikel (`sbf-binnen-vs-see`, `motorboot-oder-segelboot-welcher-sbf`,
  `ubi-vs-src-funkschein` bzw. EN-Pendants). ✅ Erledigt.
- **EN-Pillar-Link-Parität** (ehem. Empfehlung #5): `src/layouts/BlogLayout.astro` Zeilen
  220–246 verlinken jetzt in beiden Sprachen 7 einzelne Lizenzseiten statt DE=7/EN=3. ✅
  Erledigt, keine Restlücke.

## Offene Empfehlungen aus 2026-07-30 (weiterhin unresolved)

### 1. `/sbf-pruefung-ablauf/` verlinkt weiterhin nicht auf die Promillegrenze
**Seiten:** `src/pages/sbf-pruefung-ablauf.astro` (Block „Weiterführende Seiten", Zeilen
211–223), `src/pages/en/sbf-exam.astro` (Block „Further reading", Zeilen 211–221).
**Ziel:** `/blog/promillegrenze-boot/` bzw. `/en/blog/blood-alcohol-limit-boat/`.
**Vorschlag Anchor-Text:**
- DE: `→ Promillegrenze auf dem Boot – was Sportbootführer wissen müssen`
- EN: `→ Blood alcohol limit on a boat – what skippers need to know`

Einfach als weiterer `<a>`-Eintrag in der bestehenden Link-Liste ergänzen (identisches
Markup wie die 5 Nachbar-Einträge).
**SEO-Begründung:** Artikel steht laut GSC bei Position ~17 mit klarer Nachfrage
(„promillegrenze bootsführerschein") aber 0 % CTR – ein zusätzlicher Link von einer
Seite mit Sitemap-Priorität 0,9 stärkt Relevanz- und Linkkraft-Signal gleichzeitig.
Unverändert seit dem letzten Audit, weiterhin höchste Priorität dieser Liste.

### 2. Lizenzübersicht ohne Link zur „Gültigkeit im Ausland"-Frage
**Seiten:** `src/pages/fuehrerscheine.astro` (Block „Weiterführende Artikel", Zeilen
216–222), `src/pages/en/licenses.astro` (Block „Further reading", Zeilen 216–224).
**Ziel:** `/blog/sbf-im-ausland-gueltig/` bzw. `/en/blog/sbf-valid-abroad/`.
**Vorschlag Anchor-Text:**
- DE: `→ SBF im Ausland gültig? Kroatien, Niederlande & Italien`
- EN: `→ German boat license abroad: Croatia, Netherlands & Italy`

Als 8. Eintrag in beiden bestehenden Listen ergänzen.
**SEO-Begründung:** Die EN-Fassung steht laut GSC-Datensatz bei Position 5,6 – der
nächstliegende Page-1-Kandidat der gesamten Domain. Ein zusätzlicher kontextueller Link
von einer Pillar-Seite mit Sitemap-Priorität 0,9 ist der günstigste Hebel, die letzten
Positionen zu überbrücken.

### 3. Homepage-Teaser verdrängt performante ältere Artikel weiterhin strukturell
**Betroffen:** `src/components/BlogTeaser.astro` Zeilen 13–16, reines
`sort(date desc).slice(0,3)`, keine Performer-/Pin-Logik.
**Beobachtung (neu):** Aktuell profitieren davon zufällig die zwei jüngsten Artikel
(„Verhalten nach einem Bootsunfall", „Bußgelder und Verstöße auf dem Wasser" – siehe
unten), weil sie schlicht die neuesten sind. Sobald der nächste Artikel erscheint,
fällt der ältere der beiden aus dem Homepage-Slot und verliert sein einziges
High-Authority-Linkziel, da er (Stand jetzt) auch von keiner Pillar-Seite aus verlinkt
ist (siehe Punkt 4).
**Empfehlung:** unverändert zu 2026-07-30 – einen der 3 Teaser-Slots an die
GSC-Striking-Distance-Auswertung koppeln statt reinem Datum. Niedrigere Priorität als
1–2, da technisch aufwändiger (Datenquelle nötig).

## Neue Lücke seit dem letzten Audit: zwei frische Artikel ohne Pillar-Anbindung

Seit 2026-07-30 sind zwei neue Artikel dazugekommen (Tag bei beiden: „Prüfungswissen",
DE wie EN):

- `verhalten-nach-bootsunfall-pflichten-meldung` /
  `conduct-after-a-boating-accident-duties-and-reporting` (2026-08-01)
- `bussgelder-verstoesse-wasser` / `fines-violations-on-the-water` (2026-07-31)

Beide sind aktuell **nicht** von einer der vier großen Pillar-Seiten
(`sbf-see.astro`, `sbf-binnen.astro`, `sbf-pruefung-ablauf.astro`, `fuehrerscheine.astro`)
aus verlinkt – weder im Fließtext noch in den „Weiterführende Artikel"-Blöcken. Ihre
einzige strukturelle Sichtbarkeit ist aktuell die Homepage (nur solange sie zu den 3
neuesten Posts zählen, siehe Punkt 3) und `/blog/` selbst. Das Related-Articles-System
in `BlogLayout.astro` matcht nur auf das Tag „Prüfungswissen" (20 Artikel in dieser
Gruppe) – bei so einer breiten Gruppe verdrängen die jeweils neuesten 3 strukturell alle
anderen aus den Related-Slots der Geschwister-Artikel (bekanntes Problem, s. Audit
2026-07-30 #6).

### 4. Pillar-Links für die zwei neuen Artikel ergänzen
**Seiten:** `src/pages/sbf-see.astro` und `src/pages/sbf-binnen.astro` (Block
„Weiterführende Artikel" – beide Seiten listen bereits Sicherheits-/Regelthemen wie
Rettungsweste, Notsignale, Wassersport-Reviere; passt thematisch am besten), plus
EN-Pendants `src/pages/en/sbf-coastal.astro` und `src/pages/en/sbf-inland.astro`.
**Vorschlag Anchor-Text:**
- DE: `→ Verhalten nach einem Bootsunfall – Pflichten, Meldung und Beweissicherung`
- DE: `→ Bußgelder und Verstöße auf dem Wasser – die teuersten Fehler und ihre Folgen`
- EN: `→ Conduct after a boating accident – duties, reporting and evidence`
- EN: `→ Fines and violations on the water – the costliest mistakes and their consequences`

Zusätzlich: `src/pages/sbf-pruefung-ablauf.astro` / `src/pages/en/sbf-exam.astro` könnten
den Bußgeld-Artikel im Theorie-Abschnitt aufnehmen, da Bußgeldtatbestände Teil des
offiziellen ELWIS-Fragenkatalogs sind (Ausweichregeln-Verstöße etc.) – optional, zweite
Priorität gegenüber den Pillar-Seiten oben.
**SEO-Begründung:** Beide Artikel sind faktisch verwaiste Tiefenseiten außerhalb ihres
kurzen Homepage-Fensters. Ohne dauerhaften Link von einer Pillar-Seite verlassen sie
sich vollständig auf `/blog/` und ein Related-Tag-System, das sie in einer 20-Artikel-
Gruppe strukturell benachteiligt (s. o.). Ein früher gesetzter Pillar-Link sichert
Crawlbarkeit und Linkkraft unabhängig vom Publikationsdatum-Zufall.

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- `/sbf-see/` (22 Blog-Links) und `/sbf-binnen/` (17) bleiben stark verlinkt.
- Finder-Tool-Seiten und EN-Pillar-Block sind seit 2026-07-30 nachgezogen (s. o.) –
  keine offenen strukturellen DE/EN-Asymmetrien mehr außer den zwei EN-Einzellinks
  aus Empfehlung #1/#2, die ohnehin für beide Sprachen vorgeschlagen werden.

## Priorisierte Kurzliste

1. Promillegrenze-Link in `sbf-pruefung-ablauf.astro` + EN (höchste Hebelwirkung, GSC-belegt)
2. SBF-im-Ausland-Link in `fuehrerscheine.astro` + EN (Position 5,6, nächster Page-1-Kandidat)
3. Pillar-Links für die 2 neuen Artikel in `sbf-see.astro`/`sbf-binnen.astro` + EN
   (verhindert echte Verwaisung sobald sie aus dem Homepage-Teaser fallen)
4. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität)
5. Zweites Tag pro Artikel für bessere Related-Articles-Streuung (Audit 2026-07-30 #6,
   weiterhin größerer Aufwand, kein Quick-Fix)

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis: Codebase-Struktur
(Stand 2026-08-01) + Vorgänger-Audit `internal-linking-audit-2026-07-30.md` +
`gsc-findings.md`. Keine Code-Änderungen in diesem Lauf – Empfehlungen zur Umsetzung
durch die Blog-/Linkcheck-Routinen oder manuell._
