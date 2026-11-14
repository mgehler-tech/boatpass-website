# Interne Verlinkung – Audit & Empfehlungen (2026-11-14)

## 0. Befund

Skript-Scan über 76 DE- / 76 EN-Artikel (Blog→Blog-Inbound + Erwähnung in `src/pages/**`,
`src/components/**`, `src/layouts/**`).

**Hauptproblem:** Alle 5 seit dem 10-17-Audit erschienenen Artikel (+ EN-Gegenstücke) hatten
**0 Inbound-Links** aus Artikeln oder Hub-Seiten. Erreichbar waren sie nur über `/blog/`,
den BlogTeaser (Top 3 nach Datum) und den „Verwandte Artikel"-Algorithmus. Sobald neuere
Artikel erscheinen, fallen sie aus dem Teaser und werden effektiv verwaist – genau die
Seiten, die noch nicht indexiert sind.

| Artikel (DE) | Blog-Inbound | Hub-Inbound |
|---|--:|--:|
| `funkzeugnis-lrc-wann-src-nicht-ausreicht` | 0 | 0 (auch nicht von `/lrc/`!) |
| `sprechfunk-praxis-beispieldialoge-anruf-antwort` | 0 | 0 |
| `bootskennzeichen-registrierungspflicht-sportboot` | 0 | 0 |
| `sportbootfuehrerschein-gesundheitliche-einschraenkung-aerztliches-zeugnis` | 0 | 0 |
| `erste-fahrten-nach-dem-sbf-anfaengerfehler` | 0 | 0 |
| `boatpass-jetzt-fuer-iphone-und-ipad` | 0 | 0 |
| `gewitter-blitzschlag-wasser-verhalten-vorsorge` | 0 | 1 |

## 1. Umgesetzt (DE+EN gespiegelt, 16 Dateien)

| Quelle (DE) | Ziel | Anchor (DE) |
|---|---|---|
| `/lrc/` (Hub, „Weiterlesen") | `funkzeugnis-lrc-wann-src-nicht-ausreicht` | „Funkzeugnis LRC: Wann das SRC nicht mehr ausreicht" |
| `/src/` (Hub, „Weiterlesen") | `sprechfunk-praxis-beispieldialoge-anruf-antwort` | „Sprechfunk in der Praxis: Beispieldialoge …" |
| `ubi-vs-src-funkschein` | `funkzeugnis-lrc-wann-src-nicht-ausreicht` | „Funkzeugnis LRC: Wann das SRC nicht mehr ausreicht" |
| `seefunk-grundlagen-einsteiger` | `sprechfunk-praxis-beispieldialoge-anruf-antwort` | „Beispieldialoge für Anruf und Antwort im Sprechfunk" |
| `bussgelder-verstoesse-wasser` | `bootskennzeichen-registrierungspflicht-sportboot` | „amtliches oder amtlich anerkanntes Kennzeichen" |
| `boot-startklar-machen-fruehjahr-…` | `bootskennzeichen-registrierungspflicht-sportboot` | „Bootskennzeichen und Registrierungspflicht" |
| `bootsfuehrerschein-kosten-sparen` | `sportbootfuehrerschein-gesundheitliche-einschraenkung-…` | „Sportbootführerschein trotz gesundheitlicher Einschränkung" |
| `sbf-eigenes-boot-oder-charterboot` | `erste-fahrten-nach-dem-sbf-anfaengerfehler` | „Anfängerfehler bei den ersten Fahrten nach dem SBF" |

SEO-Begründung: Die Hub-Seiten `/lrc/` und `/src/` sind die thematischen Pillars des
Funk-Clusters und liegen eine Ebene unter der Startseite – ein Link dort verkürzt den Pfad
Startseite → Artikel auf 2 Klicks. Die Fließtext-Links sitzen jeweils an der Stelle, an der
das Thema im etablierten Artikel bereits behandelt wird (Kennzeichenpflicht, ärztliches
Zeugnis, LRC, MAYDAY-Rangfolge), mit beschreibendem, keyword-nahem Anchor.
Kein Build möglich (`node_modules` fehlt); Ziel-Slugs per Dateicheck verifiziert.

## 2. Nächste Kandidaten (offen)

1. **Strukturell (höchste Priorität):** Neue Artikel bekommen beim Veröffentlichen keinen
   Inbound-Link. Empfehlung für den Blog-Autopiloten (`docs/blog-automation/playbook.md`):
   Pflichtschritt „1 Fließtext-Link aus einem bestehenden Artikel + Eintrag in der passenden
   Hub-Seite" pro neuem Artikel.
2. `gewitter-blitzschlag-wasser-verhalten-vorsorge` (seit 10-17 offen): Satz zu Gewittern in
   `wetterkunde-beaufort` oder `seewetterbericht-wetterwarnungen-…` ergänzen und verlinken.
3. `sportbootfuehrerschein-gesundheitliche-einschraenkung-…` zusätzlich aus
   `sportbootfuehrerschein-voraussetzungen` und `sehtest-sportbootfuehrerschein-…` verlinken.
4. `erste-fahrten-nach-dem-sbf-anfaengerfehler` in `/sbf-binnen/` bzw. `/sbf-see/`
   („Nach der Prüfung") aufnehmen.
5. `boatpass-jetzt-fuer-iphone-und-ipad`: in `/app/` verlinken.
