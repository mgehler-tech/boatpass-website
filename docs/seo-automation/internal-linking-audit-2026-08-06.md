# Interne Verlinkung – Audit & Empfehlungen (2026-08-06)

> Follow-up-Analyse zum Audit vom 2026-08-01. Prüft, was seither umgesetzt wurde, und
> deckt neue Lücken auf (v. a. durch 1 neuen Blogartikel, der taggleich mit diesem Audit
> veröffentlicht wurde). Kein automatischer Code-Eingriff – Empfehlungen zur manuellen
> bzw. Linkcheck-Routine-Umsetzung.

## Was seit 2026-08-01 umgesetzt wurde

Alle drei offenen Empfehlungen aus dem 2026-08-01-Audit wurden in Commit `88bb6ea`
(„chore(seo): interne Verlinkung Blog ↔ Pillar-Seiten schließen", PR #204) umgesetzt:

- **Promillegrenze-Link** (ehem. Empfehlung #1): `sbf-pruefung-ablauf.astro` + EN
  `sbf-exam.astro` verlinken jetzt auf `/blog/promillegrenze-boot/` bzw.
  `/en/blog/blood-alcohol-limit-boat/`. ✅ Erledigt.
- **SBF-im-Ausland-Link** (ehem. Empfehlung #2): `fuehrerscheine.astro` + EN
  `licenses.astro` verlinken jetzt auf `/blog/sbf-im-ausland-gueltig/` bzw.
  `/en/blog/sbf-valid-abroad/`. ✅ Erledigt.
- **Pillar-Links für die 2 vormals verwaisten Artikel** (ehem. Empfehlung #4):
  „Verhalten nach einem Bootsunfall" und „Bußgelder und Verstöße" sind jetzt von
  `sbf-see.astro`/`sbf-binnen.astro` + EN `sbf-coastal.astro`/`sbf-inland.astro`
  verlinkt. ✅ Erledigt, keine Restlücke.

Keine offenen strukturellen Lücken aus dem letzten Lauf.

## Neue Lücke: frischer Artikel ohne Pillar-Anbindung (bekanntes, wiederkehrendes Muster)

Am selben Tag wie dieses Audit erschienen (Datum im Frontmatter: 2026-08-06):

- `kinder-jugendliche-boot-fahren-mindestalter` /
  `minimum-age-children-boat-germany` (Tag: „Prüfungswissen" – DE wie EN)

Dieser Artikel ist aktuell **nicht** von einer der Pillar-Seiten (`fuehrerscheine.astro`,
`sbf-see.astro`, `sbf-binnen.astro`, `sbf-pruefung-ablauf.astro`, `faq.astro` bzw.
EN-Pendants) verlinkt – weder im Fließtext noch in den „Weiterführende Artikel"-Blöcken.
Er ist zwar heute noch über den Homepage-Teaser sichtbar (`BlogTeaser.astro` zeigt die 3
neuesten Posts, aktuell Rang 1), verliert dieses einzige High-Authority-Linkziel aber
automatisch, sobald zwei weitere Artikel erscheinen (siehe Punkt 3, unverändert seit
2026-07-30). Das Related-Articles-System matcht nur auf Tag „Prüfungswissen" (jetzt 21
Artikel DE/EN) – in dieser größten Gruppe verdrängen strukturell die jeweils neuesten 3
alle anderen (bekanntes Problem, s. u.).

### 1. FAQ-Antwort zum Mindestalter verlinkt nicht auf den neuen Vertiefungsartikel
**Seiten:** `src/pages/faq.astro` Zeile 47–49 (Frage „Wie alt muss man für den
Sportbootführerschein sein?"), `src/pages/en/faq.astro` Zeile 47–49 (Frage „What is the
minimum age for the SBF?").
**Ziel:** `/blog/kinder-jugendliche-boot-fahren-mindestalter/` bzw.
`/en/blog/minimum-age-children-boat-germany/`.
**Befund:** Exakte thematische Übereinstimmung – die FAQ-Antwort behandelt nur das
Mindestalter *für den Führerschein selbst* (16 Jahre), der neue Artikel vertieft das
Thema deutlich (führerscheinfreie Boote, Ruderboot/SUP ohne Altersgrenze,
DSV-Jugendsegelschein, Anmeldealter). Andere FAQ-Antworten auf dieser Seite verlinken
bereits regelmäßig auf vertiefende Blogartikel im selben Antworttext (z. B. Zeile 56, 60,
68, 90, 98 – identisches Muster: `<a href="/blog/..." style="color:#3366FF;
text-decoration:underline;">Ankertext</a>` innerhalb des Fließtexts).
**Vorschlag Anchor-Text:**
- DE: `…auch wer führerscheinfrei fährt, muss mindestens 16 Jahre alt sein.` → letzten
  Satz ergänzen um `Mehr zu den Altersregeln für Kinder und Jugendliche auf dem Wasser
  im Artikel „Ab wann dürfen Kinder Boot fahren?".`
- EN: letzten Satz ergänzen um `More on the age rules for children and teenagers on the
  water in the article "What minimum age applies to driving a boat?"`
**SEO-Begründung:** `/faq/` ist eine der am dichtesten mit dem Blog verlinkten
Hub-Seiten der Domain (bereits ~8 kontextuelle Inline-Links) und wird prominent aus der
Hauptnavigation erreicht. Ein Link exakt an der Stelle, wo Nutzer die Frage bereits
stellen, ist der günstigste Hebel für Klickrate und Relevanzsignal gleichzeitig – höchste
Priorität dieser Liste, da es sich um eine reine Textergänzung ohne Layout-Änderung
handelt.

### 2. Lizenzübersicht ohne Link zum neuen Artikel
**Seiten:** `src/pages/fuehrerscheine.astro` (Block „Weiterführende Artikel", Zeilen
216–227, aktuell 7 Einträge), `src/pages/en/licenses.astro` (Block „Further reading",
Zeilen 214–225, aktuell 7 Einträge).
**Ziel:** `/blog/kinder-jugendliche-boot-fahren-mindestalter/` bzw.
`/en/blog/minimum-age-children-boat-germany/`.
**Vorschlag Anchor-Text:**
- DE: `→ Ab wann dürfen Kinder und Jugendliche ein Boot führen?`
- EN: `→ What minimum age applies to children driving a boat in Germany?`
Als 8. Eintrag ergänzen, direkt nach dem ersten Eintrag „Voraussetzungen für den
Sportbootführerschein" (Zeile 220 DE / 218 EN) – identisches Markup wie die
Nachbar-Einträge.
**SEO-Begründung:** `fuehrerscheine.astro`/`licenses.astro` ist laut vorherigen Audits
eine Pillar-Seite mit Sitemap-Priorität 0,9. Das Thema Mindestalter ist eine
Kernvoraussetzung und passt inhaltlich direkt neben den bestehenden ersten Eintrag –
verstärkt sowohl Crawlbarkeit als auch thematische Relevanz der Seite.

### 3. Pillar-Seiten SBF Binnen/See ohne Link zum neuen Artikel
**Seiten:** `src/pages/sbf-binnen.astro` (Zeilen 362–384, aktuell 16 Einträge),
`src/pages/sbf-see.astro` (Zeilen ~362–394, aktuell 16 Einträge), plus EN-Pendants
`src/pages/en/sbf-inland.astro` (Zeilen ~373–384) und `src/pages/en/sbf-coastal.astro`
(Zeilen ~410–421).
**Vorschlag Anchor-Text:** identisch zu Empfehlung #2.
Als weiteren Eintrag ans Ende der jeweiligen Liste anhängen.
**SEO-Begründung:** Gleiches Muster wie in den Audits vom 2026-07-30 und 2026-08-01
identifiziert und seither zweimal erfolgreich umgesetzt – ein neuer Artikel bleibt ohne
Pillar-Link strukturell von der internen Linkkraft der beiden meistverlinkten
Blog-Themenseiten der Domain (22 bzw. 17+ Blog-Links) abgeschnitten, sobald er aus dem
kurzen Homepage-Teaser-Fenster fällt. Niedrigere Priorität als #1/#2, da beide Seiten
bereits sehr lange Listen haben und der Grenznutzen pro zusätzlichem Link etwas sinkt.

## Weiterhin offen (unverändert seit 2026-07-30, keine neue Priorität)

### 4. Homepage-Teaser ohne Performer-Slot
**Betroffen:** `src/components/BlogTeaser.astro` Zeilen 13–15, unverändert reines
`sort(date desc).slice(0,3)`. Aktuell profitiert zufällig der brandneue Artikel davon
(Rang 1), verliert den Slot aber automatisch bei den nächsten zwei Veröffentlichungen,
ohne dass bis dahin ein dauerhafter Pillar-Link gesetzt wäre (s. o.). Empfehlung
unverändert: einen Teaser-Slot an eine GSC-Striking-Distance-Auswertung koppeln statt
reinem Datum. Technisch aufwändiger, daher niedrigere Priorität.

### 5. Single-Tag-Taxonomie begrenzt „Verwandte Artikel" weiterhin strukturell
**Betroffen:** `src/content.config.ts` (`tags: z.array(z.string()).default([])` –
Schema erlaubt zwar mehrere Tags, in der Praxis trägt aber jeder Artikel weiterhin genau
einen). Gruppe „Prüfungswissen" ist mit dem neuen Artikel jetzt auf 21 Artikel (DE/EN)
angewachsen – größte Gruppe, gleiches Verdrängungsproblem wie in den Vorgänger-Audits
beschrieben. Kein Quick-Fix, unverändert niedrigste Priorität dieser Liste.

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- Alle drei aus 2026-08-01 dokumentierten Lücken sind jetzt im Code umgesetzt (s. o.) –
  keine Restarbeit aus dem letzten Lauf.
- Finder-Tool-Seiten und EN-Pillar-Block bleiben seit 2026-07-30/08-01 auf Parität – keine
  neue DE/EN-Asymmetrie in diesem Lauf gefunden.

## Priorisierte Kurzliste

1. Mindestalter-FAQ-Antwort um Inline-Link zum neuen Artikel ergänzen (`faq.astro` +
   EN) – reine Textergänzung, exakte thematische Übereinstimmung, höchste Hebelwirkung.
2. Neuen Artikel als 8. Eintrag in `fuehrerscheine.astro`/`en/licenses.astro` ergänzen.
3. Neuen Artikel an `sbf-binnen.astro`/`sbf-see.astro` + EN-Pendants anhängen (verhindert
   echte Verwaisung, sobald der Artikel aus dem Homepage-Teaser fällt).
4. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität, unverändert).
5. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung (unverändert
   größerer Aufwand, kein Quick-Fix).

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis: Codebase-Struktur
(Stand 2026-08-06) + Vorgänger-Audits `internal-linking-audit-2026-07-30.md` und
`internal-linking-audit-2026-08-01.md`. Keine Code-Änderungen in diesem Lauf –
Empfehlungen zur Umsetzung durch die Blog-/Linkcheck-Routinen oder manuell._
