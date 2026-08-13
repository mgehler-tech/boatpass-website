# Interne Verlinkung – Audit (2026-08-13)

> Follow-up zum Audit vom 2026-08-08. Prüft, was seither umgesetzt wurde, und führt
> eine vollständige repo-weite Orphan-Prüfung (alle 57 DE-/EN-Artikelpaare gegen den
> gesamten `src/`-Baum) sowie Stichproben zu den Kernthemen Sportbootführerschein,
> Navigation, Schallsignale und Knoten durch. Keine Code-Änderung in diesem Lauf –
> Ergebnis ist eine Bestätigung, kein neuer Findings-Katalog.

## Was seit 2026-08-08 umgesetzt wurde

- **Peilung/Kollisionskurs (CPA)** → jetzt aus `sbf-see.astro` / `en/sbf-coastal.astro`
  verlinkt (Commit `fca5f85`, 2026-08-12). ✅ Erledigt, wie am 08-08 empfohlen.
- **Frühjahrs-Checkliste** → jetzt aus `sbf-binnen.astro` / `en/sbf-inland.astro`
  neben dem Winterlager-Artikel verlinkt (Commit `fca5f85`). ✅ Erledigt.
- **Zusätzlich (nicht im 08-08-Audit gefordert, aber laut Strategie-Doc Woche 2
  „Interner-Verlinkungs-Audit"):** 5 weitere Blogartikel
  (`anlegen-ablegen-hafenmanoever`, `peilung-kollisionskurs-cpa-erklaert`,
  `richtig-ankern-grundlagen-ankerarten-fehler`, `sbf-app-vs-bootsschule`,
  `verhalten-nach-bootsunfall-pflichten-meldung`) haben jetzt Fließtext-Backlinks zur
  jeweiligen Pillar-Seite, DE und EN parallel (Commit `4186090`, 2026-08-12).

## Methodik dieser Prüfung

Repo-weiter Grep über `src/pages/**`, `src/content/blog/**`, `src/components/**` und
`src/layouts/**` für jeden der 57 DE-Artikel-Slugs, jeweils abzüglich der Artikeldatei
selbst und der generischen Auflistungs-Mechanismen (`blog/index.astro`,
`blog/[slug].astro`, `BlogTeaser.astro`). Das entspricht der Prozess-Empfehlung aus dem
08-08-Audit, künftig repo-weit statt nur über die vier Pillar-Seiten zu prüfen.

## Ergebnis: keine Waisen gefunden

- **Neue Blogartikel seit 08-08:** keine (letzter Artikel laut Frontmatter weiterhin
  `peilung-kollisionskurs-cpa-erklaert`, Datum 2026-08-08). Damit gibt es aktuell keinen
  frischen Artikel, der Gefahr liefe, aus dem Homepage-Teaser-Fenster zu fallen, ohne
  eine Pillar-Anbindung zu haben.
- **Alle 57 DE-Artikel** haben mindestens 2 echte Inbound-Referenzen außerhalb der
  generischen Listings (Pillar-Seite und/oder thematisch verwandter Blogartikel via
  automatischem „Verwandte Artikel"-Block in `BlogLayout.astro`, Tag-basiert). Die vier
  Artikel mit dem geringsten Wert (`boot-startklar-machen-fruehjahr-checkliste-saisonstart`,
  `bruecken-durchfahrtshoehen-binnengewaesser`, `peilung-kollisionskurs-cpa-erklaert`,
  `sportbootfuehrerschein-reform-2026`) wurden einzeln verifiziert: jeweils direkt aus
  `sbf-binnen.astro`, `sbf-see.astro` bzw. `fuehrerscheine.astro` verlinkt.
- **Stichprobe zu den Kernthemen:**
  - *Sportbootführerschein/Prüfung:* Pillar-Seiten (`sbf-see.astro`, `sbf-binnen.astro`,
    `fuehrerscheine.astro`, `sbf-pruefung-ablauf.astro`) verlinken weiterhin die größte
    Artikel-Sammlung der Domain, keine Lücke.
  - *Navigation:* `seekarte-lesen-lernen`, `gps-kartenplotter-funkgeraet-moderne-navigation`,
    `peilung-kollisionskurs-cpa-erklaert`, `kompass-missweisung-deviation-erklaert`
    allesamt aus `sbf-see.astro` erreichbar.
  - *Schallsignale:* `schallsignale-sbf-erklaert` ist aus `sbf-binnen.astro`,
    `sbf-see.astro` und `sbf-pruefung-ablauf.astro` verlinkt, zusätzlich Querverweise aus
    `ausweichregeln-vorfahrt-wasser`, `verhalten-bei-verminderter-sicht-nebel` u. a.
  - *Knoten:* `wichtigste-knoten-sbf` ist aus `sbf-app-kostenlos.astro` sowie diversen
    Blogartikeln (Prüfungsvorbereitung, Ankern, Mann-über-Bord) verlinkt.
- **EN/DE-Parität:** identisches Bild auf der EN-Seite, keine separate Prüfung ergab
  Abweichungen.
- **Keine `noindex`-Tags** auf Blog- oder Pillar-Seiten gefunden.
- **Blog-Übersichten** (DE/EN) listen weiterhin ausnahmslos alle Artikel.

## Weiterhin offen (unverändert, keine neue Priorität)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`,
  `sort(date desc).slice(0,3)`): strukturelles Risiko für den nächsten neuen Artikel
  bleibt bestehen, ist aber aktuell folgenlos, da seit 08-08 nichts Neues erschienen ist.
  Sobald der nächste Artikel veröffentlicht wird, sollte er nach demselben Muster wie
  am 08-12 sofort eine Pillar-Anbindung erhalten.
- **Single-Tag-Taxonomie** (`src/content.config.ts`) begrenzt die Streuung der
  automatischen „Verwandte Artikel"-Blöcke weiterhin strukturell; kein Quick-Fix.

## Fazit

Die interne Linkstruktur ist zum Stand 2026-08-13 **bereits gut optimiert**. Beide am
2026-08-08 identifizierten Lücken wurden am 2026-08-12 geschlossen, seither ist kein
neuer Artikel erschienen, und eine vollständige repo-weite Orphan-Prüfung findet keine
Seite ohne Inbound-Links. Keine Code-Änderung in diesem Lauf notwendig.

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis: Codebase-Struktur
(Stand 2026-08-13) + Vorgänger-Audit `internal-linking-audit-2026-08-08.md` +
`docs/seo-geo-strategie-2026.md`. Keine Code-Änderungen in diesem Lauf._
