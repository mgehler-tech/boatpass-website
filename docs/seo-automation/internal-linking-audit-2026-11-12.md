# Interne Verlinkung – Audit & Empfehlungen (2026-11-12)

Erstmals gegen den **gebauten** Stand gemessen (`astro build`, 272 HTML-Seiten,
Linkgraph aus `dist/`), nicht nur per Quelltext-Scan.

## 0. Gesamtbild

- **0 Waisen, 0 defekte interne Links.** Alle 272 Seiten sind von der Startseite
  aus erreichbar; maximale Klicktiefe 2 (DE wie EN: 29 Seiten auf Tiefe 1, 106 auf Tiefe 2).
- Header und Footer verlinken alle Pillar-Seiten; `/blog/` listet alle 75 Artikel
  ohne Paginierung. Die Grundstruktur ist in Ordnung, Lücken gab es nur punktuell.
- `/app/` und `/en/app/` sind bewusst `noindex` (Geräteweiche).

## 1. Gefundene Lücken (vor diesem Lauf)

**a) Artikel ohne Link von einer Hub-/Pillar-Seite** (nur über `/blog/` und
„Verwandte Artikel" erreichbar, je DE+EN):
`funkzeugnis-lrc-wann-src-nicht-ausreicht`, `boatpass-jetzt-fuer-iphone-und-ipad`,
`boots-uebernahmecheck-charterboot-eigenes-boot`,
`sportbootfuehrerschein-gesundheitliche-einschraenkung-aerztliches-zeugnis`.
Dazu drei Artikel, deren einziger Hub-Link der Startseiten-Teaser (Top 3 nach
Datum) war und die mit den nächsten drei Veröffentlichungen herausgefallen wären:
`sprechfunk-praxis-beispieldialoge-anruf-antwort`,
`erste-fahrten-nach-dem-sbf-anfaengerfehler`,
`bootskennzeichen-registrierungspflicht-sportboot`.

**b) Artikel ohne einen einzigen Fließtext-Link aus anderen Artikeln** (9 DE + 9 EN):
die sieben oben genannten außer dem Übernahmecheck, plus
`gewitter-blitzschlag-wasser-verhalten-vorsorge`,
`sbf-binnen-pruefung-nicht-bestanden`, `umweltschutz-gewaesserschutz-bootfahren`.

## 2. Umgesetzt (DE+EN gespiegelt, 28 Dateien)

### Hub-Listen („Weiterlesen" auf Pillar-Seiten)

| Hub | Neu verlinkt | Begründung |
|---|---|---|
| `/lrc/` | LRC-Artikel, Sprechfunk-Beispieldialoge | Der einzige LRC-Ratgeber hing nicht an der LRC-Seite |
| `/src/` | Sprechfunk-Beispieldialoge, LRC-Artikel | Thematischer Kern der SRC-Praxisprüfung; Aufstiegspfad SRC → LRC |
| `/ubi/` | Sprechfunk-Beispieldialoge | Funkverkehr ist Prüfungsteil |
| `/sbf-pruefung-ablauf/` | Gesundheitliche Einschränkung / ärztliches Zeugnis | Zulassungsvoraussetzung, passt zur Prüfungs-Pillar |
| `/sbf-binnen/` | Erste Fahrten, Bootskennzeichen, Übernahmecheck | Dauerhafter Hub-Link statt nur Startseiten-Teaser |
| `/sbf-see/` | Erste Fahrten, Übernahmecheck | wie oben |
| `/sbf-app/` | iOS-Launch-Artikel | Einziger sinnvoller Hub für die Produktmeldung |

### Fließtext-Links (Anchor jeweils an der Stelle, an der das Thema schon steht)

| Quelle (DE) | Ziel | Anchor (DE) |
|---|---|---|
| `bussgelder-verstoesse-wasser` | `bootskennzeichen-registrierungspflicht-sportboot` | „Kennzeichnungspflicht für Sportboote" |
| `bussgelder-verstoesse-wasser` | `umweltschutz-gewaesserschutz-bootfahren` | „Umweltschutz und Gewässerschutz beim Bootfahren" |
| `ubi-vs-src-funkschein` | `funkzeugnis-lrc-wann-src-nicht-ausreicht` | „Funkzeugnis LRC: wann das SRC nicht mehr ausreicht" |
| `seewetterbericht-wetterwarnungen-wetterdienste-skipper` | `gewitter-blitzschlag-wasser-verhalten-vorsorge` | „Gewitter und Blitzschlag auf dem Wasser" |
| `bootsfuehrerschein-kosten-sparen` | `sbf-binnen-pruefung-nicht-bestanden` | „SBF-Binnen-Prüfung nicht bestanden – was jetzt zu tun ist" |
| `sbf-pruefung-anmelden` | `sportbootfuehrerschein-gesundheitliche-einschraenkung-aerztliches-zeugnis` | „Sportbootführerschein trotz gesundheitlicher Einschränkung" |
| `seefunk-grundlagen-einsteiger` | `sprechfunk-praxis-beispieldialoge-anruf-antwort` | „Beispieldialoge für Anruf und Antwort im Sprechfunk" |
| `boots-uebernahmecheck-charterboot-eigenes-boot` | `erste-fahrten-nach-dem-sbf-anfaengerfehler` | „Anfängerfehler bei den ersten Fahrten nach dem SBF" |

Ergebnis nach erneutem Build: **kein Artikel mehr ohne Hub-Link**, 0 defekte Links.
Ohne Fließtext-Inbound bleibt nur der iOS-Launch-Artikel (Produktmeldung, jetzt über `/sbf-app/` angebunden).

## 3. Offen (nicht umgesetzt, Empfehlungen nach Priorität)

1. **Strukturelle Ursache beheben:** Neue Artikel landen nur im Startseiten-Teaser
   (Top 3 nach Datum) und in `/blog/`. Im Blog-Playbook (`docs/blog-automation/playbook.md`)
   als Pflichtschritt aufnehmen: pro neuem Artikel ein Eintrag in der passenden
   Pillar-Liste und ein Fließtext-Link aus einem bestehenden Artikel.
2. **Startseite:** `HomeGuide` um eine feste Reihe „Meistgelesen" ergänzen
   (z. B. `lichterfuehrung-erklaert`, `kursumrechnung-sbf-see`,
   `boot-fahren-ohne-fuehrerschein-15-ps`, `rettungsweste-auftriebsklassen` –
   laut GSC in Striking Distance). Das bringt diese Seiten von Tiefe 2 auf Tiefe 1.
3. **Stadtseiten `/bootsfahrschulen/<stadt>/`:** je nur 2 Inbound-Links aus dem
   Inhaltsbereich (Bremen: 1). Nachbarstädte gegenseitig verlinken und passende
   Stadt in `wassersport-reviere-deutschland` im Fließtext verlinken.
4. **Schwach angebundene Artikel** (1 Hub-Link, 1 Fließtext-Link):
   `betonnung-nordsee-ostsee-unterschiede` (aus `seezeichen-lateralsystem`),
   `bruecken-durchfahrtshoehen-binnengewaesser` (aus `schleusenfahrt-…`),
   `5-tipps-sbf-bestehen` (aus `haeufigste-fehler-sbf`).
5. **DE/EN-Asymmetrien** (Link existiert nur in einer Sprache): 6 Fälle, u. a.
   `ausweichregeln → schallsignale` (nur DE), `sbf-binnen-vs-see → wichtigste-knoten` (nur DE),
   `blood-alcohol-limit-boat → most-common-sbf-mistakes` (nur EN).
6. **Pillar-Listen `/sbf-binnen/` (28) und `/sbf-see/` (35 Artikel):** werden lang.
   Mittelfristig nach Themen gruppieren (Regeln, Navigation, Praxis, Sicherheit) –
   bessere Orientierung und klarere thematische Signale.
