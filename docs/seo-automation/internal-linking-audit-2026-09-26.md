# Interne Verlinkung – Audit & Empfehlungen (2026-09-26)

> Follow-up-Analyse zum Audit vom 2026-09-12. Diesmal mit anderem Fokus als die
> bisherigen Läufe: Statt nur neue Artikel gegen Pillar-Seiten zu prüfen
> (Waisen-Check, siehe unten), wurde zusätzlich der **Fließtext bestehender
> Artikel** systematisch nach thematischen Erwähnungen ohne kontextuellen Link
> zum passenden Schwesterartikel durchsucht (Skript-Scan über alle 69 DE-/69
> EN-Artikel nach zehn Kern-Themen: Schallsignale, Knoten, Lichterführung,
> Seekarte, Gezeiten, Ankern, KVR, Seefunk, Wetter/Beaufort, Seezeichen).

## 0. Waisen-Check (wie gehabt)

Alle 4 seit dem 09-12-Audit neu veröffentlichten DE-/EN-Artikelpaare
(`kollisionsverhuetungsregeln-kvr-ueberblick`/`colregs-collision-regulations-overview`,
`verkehrstrennungsgebiete-see`/`traffic-separation-schemes-at-sea`,
`wellen-sog-haftung`/`boat-wake-wash-liability`,
`seefunk-grundlagen-einsteiger`/`marine-radio-basics-beginners`) waren zum
Zeitpunkt dieses Audits bereits über mindestens eine Pillar-Seite erreichbar –
die beiden neuesten (KVR, Verkehrstrennungsgebiete) wurden bereits am selben
Tag in einem vorherigen Durchlauf (PR #376) an `sbf-see.astro` /
`en/sbf-coastal.astro` angebunden. Automatisierter Scan über sämtliche 69+69
Blogartikel gegen `src/pages/**`, `src/components/**`, `src/layouts/**`:
**0 Waisen** (weder DE noch EN). Der Waisen-Mechanismus, der in praktisch
jedem Audit seit 2026-07-30 die Hauptfundstelle war, ist damit aktuell
vollständig geschlossen.

## 1. Neue Fundstelle: unverlinkte Themen-Erwähnungen im Fließtext etablierter Artikel

Der Keyword-Scan zeigte, dass zwar keine Artikel mehr komplett isoliert sind,
aber viele **bereits gut verlinkte** Artikel dieselben Themen wie andere
Cornerstone-Artikel im Fließtext erwähnen, ohne dorthin zu verlinken – eine
Lücke, die bisherige Audits (Fokus: Pillar→Artikel-Waisen) nicht abdeckten.
Von ca. 40 gefundenen Kandidaten wurden die fünf mit der engsten thematischen
Passung und dem natürlichsten Ankertext ausgewählt und umgesetzt (DE+EN
jeweils gespiegelt, reine Fließtext-Linkergänzung, keine Listen-/Layout-
Änderung):

| # | Quelle (DE) | Ziel | Anchor-Text (DE) |
|---|---|---|---|
| 1 | `ausweichregeln-vorfahrt-wasser` | `kollisionsverhuetungsregeln-kvr-ueberblick` | „Kollisionsverhütung (KVR)" |
| 2 | `peilung-kollisionskurs-cpa-erklaert` | `kollisionsverhuetungsregeln-kvr-ueberblick` | „Kollisionsverhütungsregeln (KVR)" |
| 3 | `sbf-see-navigationsaufgaben-erklaert` | `seekarte-lesen-lernen` | „Seekartenarbeit" |
| 4 | `ubi-vs-src-funkschein` | `seefunk-grundlagen-einsteiger` | „weltweiten Seefunkdienst (GMDSS)" |
| 5 | `haeufigste-fehler-sbf` | `lichterfuehrung-erklaert` | „Lichterführung" |

Jeweils identisch in der EN-Version umgesetzt (`right-of-way-collision-rules`,
`bearing-collision-course-cpa-explained`, `sbf-coastal-navigation-tasks-explained`,
`ubi-vs-src-radio-license`, `most-common-sbf-mistakes` → passende EN-Ziele).

**SEO-Begründung je Fund:**

1. `ausweichregeln-vorfahrt-wasser` erwähnt „Kollisionsverhütung (KVR)" bereits
   im Eröffnungsabsatz als thematische Einordnung – exakt der Cornerstone-
   Artikel zum KVR-Überblick, bisher aber nur indirekt über gemeinsame
   Pillar-Seiten (sbf-binnen/see) erreichbar. Der neue KVR-Überblicksartikel
   (veröffentlicht 09-25, siehe Waisen-Check oben) profitiert zusätzlich von
   einem weiteren thematisch sehr nahen Inbound-Link, da er erst wenige Tage
   alt ist und noch kein organisches Linkprofil aufgebaut hat.
2. `peilung-kollisionskurs-cpa-erklaert` leitet die „gleichbleibende Peilung"-
   Regel explizit aus KVR Regel 7 ab – der Fließtext zitiert die KVR bereits
   wörtlich, der Link macht die Quelle für Leser direkt zugänglich statt sie
   nur zu nennen.
3. `sbf-see-navigationsaufgaben-erklaert` ist mit 20 Erwähnungen von
   „Seekarte" der mit Abstand am häufigsten betroffene Artikel im Scan und
   die zentrale praktische Anwendung des Seekarten-Grundlagenartikels –
   Theorie-zu-Praxis-Link in beide Richtungen jetzt vervollständigt (der
   Seekarten-Grundlagenartikel verlinkt umgekehrt bereits auf die
   Navigationsaufgaben, siehe „Was weiterhin gut funktioniert" unten).
4. `ubi-vs-src-funkschein` nennt „Seefunkdienst (GMDSS)" als Kernbegriff der
   SRC-Erklärung; der neue Einsteiger-Artikel zum Seefunk (veröffentlicht
   09-16) ist die natürliche Vertiefung für Leser, die den Begriff nicht
   kennen.
5. `haeufigste-fehler-sbf` nennt „Lichterführung" als Fehlerquelle Nr. 1 in
   der Prüfung, verweist aber bisher nirgends auf den dedizierten
   Lichterführungs-Artikel – naheliegendster Anker im gesamten Scan-Ergebnis.

**Bewusst nicht umgesetzt** (Rest der ca. 40 Scan-Treffer): Die übrigen
Kandidaten wurden aus Qualitätsgründen zurückgestellt, u. a. weil mehrere
„Knoten"-Treffer sich auf die Geschwindigkeitseinheit statt auf Tauknoten
bezogen (False Positives des Keyword-Scans) und weil bei sehr hoher
Trefferdichte in einem Artikel (z. B. „Kollisionsverhütung" 15× über
verschiedene Artikel verteilt) eine Verlinkung von wirklich jeder Erwähnung
den Fließtext überladen und den Linkwert der Einzelverweise verwässern würde.
Empfehlung: die verbleibenden Kandidaten über die nächsten 2–3 Audit-Zyklen
gestaffelt umsetzen (siehe Kurzliste unten), statt in einem Durchlauf.

## Was weiterhin gut funktioniert (keine Änderung nötig)

- Blog-Übersichten (DE/EN) listen weiterhin ausnahmslos alle Artikel.
- Der `BlogLayout`-eigene „Verwandte Artikel"-Algorithmus (Tag-/Token-
  Überlappung) funktioniert unverändert.
- Build nach den fünf Linkergänzungen erfolgreich (215 Seiten, 0 Fehler);
  alle zehn neuen Link-Ziele im `dist/`-Output verifiziert (existieren,
  keine 404s).
- Keine `noindex`-Tags auf Blog- oder Pillar-Seiten gefunden.

## Weiterhin offen (unverändert seit 2026-07-30)

- **BlogTeaser-Performer-Slot** (`sort(date desc).slice(0,3)`): macht neue
  Artikel weiterhin kurzzeitig zur Waise, bis sie manuell an eine Pillar-Seite
  angebunden werden. Aktuell durch die laufenden Audit-Zyklen gut
  kompensiert (0 Waisen zum Zeitpunkt dieses Audits), aber strukturell
  unverändert.
- **Single-Tag-Taxonomie** begrenzt „Verwandte Artikel" weiterhin.

## Priorisierte Kurzliste

1. ✅ 5 kontextuelle Fließtext-Links ergänzt (DE+EN, 10 Dateien): KVR-Überblick
   (×2 Quellen), Seekarte-Grundlagen, Seefunk-Grundlagen, Lichterführung.
2. Nächster Zyklus: weitere Kandidaten aus dem Themen-Scan umsetzen,
   insbesondere „Kollisionsverhütung" in `verhalten-bei-verminderter-sicht-nebel`,
   `notsignale-auf-see`, `schallsignale-sbf-erklaert` (alle mit hoher
   Erwähnungsdichte und enger thematischer Nähe zur KVR).
3. „Seefunk"-Cluster: `sbf-im-ausland-gueltig` (8 Erwähnungen) und
   `notsignale-auf-see` (3 Erwähnungen) als nächste Kandidaten prüfen.
4. BlogTeaser-Performer-Slot (unverändert, niedrigere Priorität).
5. Tag-Diversifizierung pro Artikel (unverändert, größerer Aufwand).

---
_Analyse und Umsetzung durch Claude Code (automatisierte Routine), Datenbasis:
Codebase-Struktur (Stand 2026-09-26) + Vorgänger-Audit
`internal-linking-audit-2026-09-12.md`. Build nach Umsetzung erfolgreich
(215 Seiten, 0 Fehler). Methodik-Erweiterung gegenüber Vorgänger-Audits:
Themen-Keyword-Scan über Artikel-Fließtext statt nur Pillar→Artikel-
Waisen-Check._
