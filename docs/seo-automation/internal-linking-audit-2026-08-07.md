# Interne Verlinkung – Audit & Empfehlungen (2026-08-07)

> Follow-up-Analyse zum Audit vom 2026-08-06. Prüft, was seither umgesetzt wurde,
> sucht nach verwaisten Blogartikeln über alle Hub-Seiten hinweg (nicht nur den
> jüngsten Artikel) und deckt einen bisher nicht auditierten Linkpfad auf. Kein
> automatischer Code-Eingriff – Empfehlungen zur manuellen bzw.
> Linkcheck-Routine-Umsetzung.

## Was seit 2026-08-06 umgesetzt wurde

Alle drei Top-Empfehlungen aus dem 2026-08-06-Audit wurden in Commit `937c66d`
(„chore(seo): link new Mindestalter article from FAQ + pillar pages", PR #208)
umgesetzt:

- **FAQ-Inline-Link** (ehem. Empfehlung #1): `faq.astro` + `en/faq.astro`
  verlinken jetzt aus der Mindestalter-Antwort auf
  `/blog/kinder-jugendliche-boot-fahren-mindestalter/` bzw.
  `/en/blog/minimum-age-children-boat-germany/`. ✅ Erledigt.
- **Lizenzübersicht-Link** (ehem. Empfehlung #2): `fuehrerscheine.astro` +
  `en/licenses.astro` haben den Artikel als Eintrag im
  „Weiterführende Artikel"-Block. ✅ Erledigt.
- **Pillar-Links SBF Binnen/See** (ehem. Empfehlung #3): `sbf-binnen.astro`,
  `sbf-see.astro`, `en/sbf-inland.astro`, `en/sbf-coastal.astro` verlinken jetzt
  ebenfalls auf den Artikel. ✅ Erledigt.

Seit dem 06.08. sind keine neuen Blogartikel erschienen (jüngster Artikel
weiterhin `kinder-jugendliche-boot-fahren-mindestalter` /
`minimum-age-children-boat-germany`, Datum 2026-08-06) – das wiederkehrende
„frischer Artikel ohne Pillar-Anbindung"-Muster der letzten drei Audits tritt
diesmal nicht neu auf.

## Vollständige Orphan-Prüfung (neu in diesem Lauf)

Bisherige Audits prüften primär den jeweils neuesten Artikel. Dieser Lauf
prüft zusätzlich **alle 51 DE- und 51 EN-Blogartikel** auf mindestens einen
Inbound-Link von einer Nicht-Blog-Seite (Pillar-, FAQ-, Tool- oder
Bootsfahrschulen-Seite). Ergebnis: **keine Waisen.** Jeder Artikel ist von
mindestens einer Hub-Seite aus erreichbar – die in den Vorgänger-Audits
dokumentierte Schließungsarbeit hat sich bewährt.

## Neu identifizierte Chance: Bootsfahrschulen-Stadtseiten ohne Blog-Link

**Seiten:** `src/pages/bootsfahrschulen/[city].astro` (13 Stadtseiten: Berlin,
Hamburg, München, Köln, Düsseldorf, Frankfurt, Stuttgart, Kiel, Rostock,
Bremen, Hannover, Dresden, Lübeck) sowie `src/pages/en/boat-schools/[city].astro`
(13 EN-Pendants) – insgesamt 26 Seiten.

**Befund:** Der „Weiterführende Artikel"-Block jeder Stadtseite (DE:
Zeilen 238–252, EN: Zeilen 204–215) verlinkt bereits auf 4–5 Pillar-Seiten
(`/sbf-binnen/`, `/sbf-see/`, `/sbf-kosten/`, `/sbf-pruefung-ablauf/`,
`/fuehrerscheine/` bzw. EN-Pendants), aber auf **keinen einzigen Blogartikel**
– weder im Fließtext noch im Link-Block. Damit sind diese 26 Seiten bislang
nur indirekt (über die Pillar-Seiten, 2 Klicks) mit dem Blog verbunden. Dieser
Linkpfad wurde in den Audits vom 2026-07-30/08-01/08-06 noch nicht geprüft.

Der Artikel `wassersport-reviere-deutschland` /
`boating-regions-in-germany` (veröffentlicht 2026-07-22, aktuell laut
`gsc-findings.md` mit +203 Impressionen aufsteigend, Rubrik „Vorbereitung")
passt inhaltlich sehr genau: Er behandelt Reviere wie Berlin/Brandenburg,
Mecklenburgische Seenplatte, Rhein/Mosel/Donau sowie Nord- und Ostseeküste
und erklärt, wann SBF Binnen bzw. SBF See gilt – exakt die Frage, vor der
Nutzer einer Stadtseite (die bereits weiß, in welcher Stadt sie einen Kurs
suchen) als Nächstes stehen.

**Vorschlag Anchor-Text:**
- DE (als zusätzlicher Eintrag im „Weiterführende Artikel"-Block, z. B. direkt
  nach dem ersten Eintrag „Alle Bootsfahrschulen in Deutschland"):
  `→ Wassersport-Reviere in Deutschland: Wo darfst du mit dem SBF fahren?`
  → `/blog/wassersport-reviere-deutschland/`
- EN: `→ Boating regions in Germany: where can you go with the SBF?`
  → `/en/blog/boating-regions-in-germany/`

Identisches Markup wie die Nachbar-Einträge (`<a href="..." style="color:#3366FF;
text-decoration:none; font-size:15px;">&rarr; ...</a>`), keine Layout-Änderung
nötig.

**SEO-Begründung:** 26 Seiten sind ein deutlich größerer Hebel als eine
einzelne Pillar-Seite – jede Stadtseite ist bereits über die
Bootsfahrschulen-Übersicht sowie über Local-SEO-Suchanfragen indexiert und
erhält eigenständigen organischen Traffic. Ein direkter Link zu einem
Artikel mit steigenden Impressionen verkürzt den Klickpfad Homepage →
Blog von 3 auf 2 Stufen für diesen Nutzerpfad und stärkt das
Relevanzsignal des Artikels durch 26 zusätzliche, thematisch passende
Inbound-Links. Aufwand: eine Zeile pro Datei (2 Template-Dateien, da
`[city].astro` alle 13 Städte über `getStaticPaths()` rendert – keine
13-fache Bearbeitung nötig).

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden (einzige
  `noindex`-Verwendung: `404.astro`, korrekt).
- Sitemap-Integration (`@astrojs/sitemap`) aktiv, keine Auffälligkeiten.
- Alle drei aus 2026-08-06 dokumentierten Lücken sind jetzt im Code
  umgesetzt – keine Restarbeit aus dem letzten Lauf.

## Weiterhin offen (unverändert seit 2026-07-30, keine neue Priorität)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`,
  reines `sort(date desc).slice(0,3)`): unverändert, technisch aufwändiger.
- **Single-Tag-Taxonomie** begrenzt „Verwandte Artikel" weiterhin strukturell
  (`src/content.config.ts`): unverändert, kein Quick-Fix.

## Priorisierte Kurzliste

1. Blog-Link „Wassersport-Reviere in Deutschland" / „Boating regions in
   Germany" in den „Weiterführende Artikel"-Block der Stadtseiten-Templates
   ergänzen (`src/pages/bootsfahrschulen/[city].astro` +
   `src/pages/en/boat-schools/[city].astro`) – wirkt auf 26 Seiten,
   Ein-Zeilen-Änderung pro Template.
2. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität,
   unverändert).
3. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung
   (unverändert größerer Aufwand, kein Quick-Fix).

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis:
Codebase-Struktur (Stand 2026-08-07) + `docs/seo-automation/gsc-findings.md`
+ Vorgänger-Audits vom 2026-07-30, 2026-08-01 und 2026-08-06. Keine
Code-Änderungen in diesem Lauf – Empfehlung #1 ist eine risikoarme,
klar umrissene Umsetzung für die nächste Linkcheck-/Blog-Routine oder
manuelle PR._
