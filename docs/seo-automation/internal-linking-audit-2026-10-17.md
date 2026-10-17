# Interne Verlinkung – Audit & Empfehlungen (2026-10-17)

## 0. Waisen-Check

Skript-Scan über 70 DE-/70 EN-Artikel gegen `src/pages/**`, `src/components/**`,
`src/layouts/**`: **0 echte Waisen**. Die beiden iOS-Launch-Artikel
(`boatpass-jetzt-fuer-iphone-und-ipad` / `boatpass-now-on-iphone-and-ipad`)
tauchen in keiner Pillar-Seite namentlich auf, sind aber aktuell die neuesten
Artikel und damit über den `BlogTeaser` (Startseite, Top 3 nach Datum) sowie
die Blog-Übersicht erreichbar. Sobald drei neuere Artikel erscheinen, werden
sie Waisen (bekannte strukturelle Lücke, siehe 09-26-Audit).

## 1. Artikel ohne Inbound-Link aus anderen Artikeln (Blog→Blog = 0)

`gewitter-blitzschlag-wasser-verhalten-vorsorge`, `schleusenfahrt-ablauf-verhalten-sportbootfahrer`,
`sehtest-sportbootfuehrerschein-anforderungen-ablauf`, `boot-startklar-machen-fruehjahr-checkliste-saisonstart`,
`sportkuestenschifferschein-sks`, `verhalten-nach-bootsunfall-pflichten-meldung`, `wellen-sog-haftung`,
`umweltschutz-gewaesserschutz-bootfahren`, `kinder-jugendliche-boot-fahren-mindestalter` (+ EN-Gegenstücke).
Sie hängen nur an einer Pillar-Seite bzw. am „Verwandte Artikel"-Algorithmus.

## 2. Umgesetzt (DE+EN gespiegelt, 10 Dateien, reine Fließtext-Links)

| Quelle (DE) | Ziel | Anchor (DE) |
|---|---|---|
| `bussgelder-verstoesse-wasser` | `verhalten-nach-bootsunfall-pflichten-meldung` | „Pflichten nach einem Bootsunfall" |
| `bruecken-durchfahrtshoehen-binnengewaesser` | `schleusenfahrt-ablauf-verhalten-sportbootfahrer` | „Schleusen" |
| `sportbootfuehrerschein-voraussetzungen` | `sehtest-sportbootfuehrerschein-anforderungen-ablauf` | „Sehtest" |
| `boot-einwintern-checkliste-winterlager` | `boot-startklar-machen-fruehjahr-checkliste-saisonstart` | „Checkliste für den Saisonstart im Frühjahr" |
| `umweltschutz-gewaesserschutz-bootfahren` | `wellen-sog-haftung` | „Wellenschlag und Sog haftet" |

SEO-Begründung: Jeweils Link von einem etablierten Artikel an exakt der Stelle,
an der das Thema bereits im Text vorkommt, auf einen Artikel mit bisher 0
Blog-Inbound-Links; beschreibende Anchor statt „hier klicken". Ziel-Slugs
per Dateicheck verifiziert (kein Build möglich: `node_modules` fehlt in der Umgebung).

## 3. Nächste Kandidaten

1. `gewitter-blitzschlag-wasser-verhalten-vorsorge`: kein natürlicher Fließtext-Anker in `wetterkunde-beaufort` / `seewetterbericht-…` gefunden – dort einen Satz „Gewitter" + Link ergänzen oder in „Weiterlesen"-Block aufnehmen.
2. `sportkuestenschifferschein-sks`: wird in keinem anderen Artikel erwähnt – Hinweis auf SKS als Aufbauschein in `sbf-binnen-vs-see` und `sbf-gueltigkeit-welcher-schein-wo`.
3. `kinder-jugendliche-boot-fahren-mindestalter`: „Mindestalter" in `sbf-pruefung-anmelden`, `boot-fahren-ohne-fuehrerschein-15-ps` verlinken.
4. BlogTeaser-Slot (nur Top 3 nach Datum) und Single-Tag-Taxonomie – unverändert offen.

## 4. Zweiter Durchlauf (2026-10-17, Routine)

Blog→Blog-Inbound vorher: `gewitter-…`, `boots-uebernahmecheck-…`,
`umweltschutz-…` = 0, `sportkuestenschifferschein-sks` = 1. Vier weitere
Fließtext-Links ergänzt (DE+EN, 8 Dateien):

| Quelle (DE) | Ziel | Anchor (DE) |
|---|---|---|
| `bussgelder-verstoesse-wasser` | `umweltschutz-gewaesserschutz-bootfahren` | „Umwelt- und Gewässerschutz beim Bootfahren" |
| `bruecken-durchfahrtshoehen-binnengewaesser` | `boots-uebernahmecheck-charterboot-eigenes-boot` | „Übernahmecheck für Charterboot und eigenes Boot" |
| `wetterkunde-beaufort` | `gewitter-blitzschlag-wasser-verhalten-vorsorge` | „Verhalten bei Gewitter und Blitzschlag auf dem Wasser" |
| `sbf-gueltigkeit-welcher-schein-wo` | `sportkuestenschifferschein-sks` | „Sportküstenschifferschein (SKS)" |

Ziel-Slugs per Dateicheck verifiziert. Offen: iOS-Launch-Artikel (Waisen-Risiko
sobald BlogTeaser rotiert), BlogTeaser-Slot, Single-Tag-Taxonomie.
