# Interne Verlinkung – Audit & Empfehlungen (2026-08-29)

> Follow-up-Analyse zum Audit vom 2026-08-08. Prüft alle seither (13.–22.08.) neu
> veröffentlichten Artikel per repo-weitem Grep gegen sämtliche `src/pages/**`-Hub-Seiten
> (nicht nur die vier Pillar-Seiten), wie in der Prozess-Empfehlung des letzten Audits
> vorgeschlagen. Kein automatischer Code-Eingriff – Empfehlung zur Umsetzung durch die
> Linkcheck-Routine oder manuell.

## Geprüft: alle 6 seit 2026-08-08 neu erschienenen DE-/EN-Artikelpaare

| Datum | Artikel (DE-Slug) | Inbound-Links aus `src/pages/` |
|---|---|---|
| 08-13 | `sportbootfuehrerschein-verloren-beschaedigt-ersatz` | ✅ `fuehrerscheine.astro` |
| 08-14 | `gewitter-blitzschlag-wasser-verhalten-vorsorge` | ✅ `sbf-see.astro` |
| 08-15 | `wasserskifahren-wakeboarden-regeln-beobachterpflicht` | ✅ `sbf-binnen.astro`, `sbf-see.astro` |
| 08-16 | `schleusenfahrt-ablauf-verhalten-sportbootfahrer` | ✅ `sbf-binnen.astro` |
| 08-18 | `umweltschutz-gewaesserschutz-bootfahren` | ✅ `sbf-binnen.astro`, `sbf-pruefung-ablauf.astro`, `sbf-see.astro` |
| 08-22 | `sehtest-sportbootfuehrerschein-anforderungen-ablauf` | ❌ **keine** |

Fünf von sechs Artikeln sind bereits sauber an mindestens eine Pillar-Seite angebunden.
Der zuletzt veröffentlichte Artikel ist der einzige Fund dieses Audits.

## 1. Sehtest-Artikel ohne jede Pillar-Anbindung (aktuellster Artikel der Domain)

**Betroffene Seiten:** `src/pages/sbf-pruefung-ablauf.astro` (Block „Weiterführende Seiten“,
Zeilen 209–221, endet aktuell beim Umweltschutz-Artikel vom 18.08. – dem direkten
Vorgänger), `src/pages/en/sbf-exam.astro` (Block „Further reading“, Zeilen 210–222,
identisch aufgebaut, EN-Pendant endet ebenfalls beim Umweltschutz-Artikel).

**Ziel:** `/blog/sehtest-sportbootfuehrerschein-anforderungen-ablauf/` bzw.
`/en/blog/eyesight-test-boating-license-requirements-process/`.

**Befund:** Repo-weiter Grep über `src/pages/**/*.astro` und `src/content/blog/**/*.md`
liefert außer der Artikeldatei selbst und dem `altSlug`-Frontmatter-Feld des
Sprach-Pendants **keinen einzigen inhaltlichen Link** – weder Fließtext noch
„Weiterführende Artikel“/„Further reading“-Block auf irgendeiner Hub-Seite. Anders als bei
den fünf vorangegangenen Artikeln fehlt hier sogar der übliche DE↔EN-Querverweis im
Fließtext. Einzige aktuelle Sichtbarkeit: Homepage-Teaser (`BlogTeaser.astro`, reines
`sort(date desc).slice(0,3)`, aktuell Rang 1) und die Blog-Übersicht `/blog/` bzw.
`/en/blog/`. Verliert den Homepage-Slot automatisch, sobald zwei weitere Artikel
erscheinen – exakt das wiederkehrende Muster aus den Audits seit 2026-07-30.

Thematisch passt der Artikel klar zu `sbf-pruefung-ablauf.astro`: Er behandelt formale
Prüfungsvoraussetzungen (Sehtest, ärztliches Zeugnis, Sehschärfe-Grenzwerte), exakt die
gleiche „Vorbereitung“/„Prüfungswissen“-Themenwelt wie die bereits verlinkten
Nachbarartikel (SBF-Binnen-Prüfung nicht bestanden, Promillegrenze, Umweltschutz). Diese
Seite ist zudem die naheliegendste Pillar-Seite, da sie bereits alle formalen
Prüfungs-Voraussetzungsartikel gebündelt hat.

**Vorschlag Anchor-Text:**
- DE: `→ Sehtest für den Sportbootführerschein – Anforderungen und Ablauf`
- EN: `→ Eyesight test for the boating license – requirements and process`

Als neuen Eintrag direkt nach dem Umweltschutz-Eintrag (Zeile 222 DE / 222 EN) einfügen,
identisches Markup wie die Nachbar-Einträge:

```html
<a href="/blog/sehtest-sportbootfuehrerschein-anforderungen-ablauf/" style="color:#3366FF; text-decoration:none; font-size:15px;">→ Sehtest für den Sportbootführerschein – Anforderungen und Ablauf</a>
```
```html
<a href="/en/blog/eyesight-test-boating-license-requirements-process/" style="color:#3366FF; text-decoration:none; font-size:15px;">→ Eyesight test for the boating license – requirements and process</a>
```

**SEO-Begründung:** Höchste (und einzige) Priorität dieser Liste – reine Textergänzung
ohne Layout-Änderung, exakte Themen-Passung zur bestehenden Liste formaler
Prüfungsvoraussetzungen, sichert Crawlbarkeit unabhängig vom Zufall des
Homepage-Teaser-Fensters. Gleiches wiederkehrendes Muster wie in praktisch jedem Audit
seit 2026-07-30 (jeweils folgenlos behoben innerhalb eines Tages) – diesmal jedoch der
einzige Fund unter sechs geprüften Artikeln, was auf eine insgesamt verbesserte
Verlinkungsdisziplin seit dem letzten Audit hindeutet (5 von 6 neuen Artikeln waren bei
Veröffentlichung bereits angebunden).

## Was seit 2026-08-08 gut funktioniert (keine Änderung nötig)

- 5 von 6 neu veröffentlichten Artikeln wurden direkt bei Veröffentlichung an mindestens
  eine Pillar-Seite angebunden (`fuehrerscheine`, `sbf-see`, `sbf-binnen`,
  `sbf-pruefung-ablauf`) – deutliche Verbesserung gegenüber dem Muster aus den Audits
  2026-07-30 bis 2026-08-08, wo praktisch jeder neue Artikel zunächst als Waise startete.
- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel – keine
  Paginierungs-Waisen.
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden.
- Die Stadtseiten- und Frühjahrs-Checkliste-Empfehlungen aus 2026-08-07/08 sind weiterhin
  vollständig umgesetzt.

## Weiterhin offen (unverändert seit 2026-07-30, keine neue Priorität)

- **BlogTeaser-Performer-Slot** (`src/components/BlogTeaser.astro`, reines
  `sort(date desc).slice(0,3)`): unverändert. Der Sehtest-Artikel zeigt erneut, wie kurz
  das Zeitfenster ist, in dem ein neuer Artikel ohne Pillar-Link überhaupt sichtbar
  bleibt.
- **Single-Tag-Taxonomie** begrenzt „Verwandte Artikel“ weiterhin strukturell
  (`src/content.config.ts`): unverändert, kein Quick-Fix.

## Priorisierte Kurzliste

1. Sehtest-Artikel in `sbf-pruefung-ablauf.astro` + `en/sbf-exam.astro` ergänzen – reine
   Textergänzung, höchste Themen-Passung, verhindert Verwaisung nach Ablauf des
   Homepage-Fensters. Einziger Fund dieses Audits.
2. BlogTeaser-Performer-Slot (technisch aufwändiger, niedrigere Priorität, unverändert).
3. Tag-Diversifizierung pro Artikel für bessere Related-Articles-Streuung (unverändert
   größerer Aufwand, kein Quick-Fix).

---
_Analyse durch Claude Code (automatisierte Routine), Datenbasis: Codebase-Struktur
(Stand 2026-08-29) + Vorgänger-Audit `internal-linking-audit-2026-08-08.md`. Keine
Code-Änderungen in diesem Lauf – Empfehlung zur Umsetzung durch die Blog-/
Linkcheck-Routinen oder manuell._
