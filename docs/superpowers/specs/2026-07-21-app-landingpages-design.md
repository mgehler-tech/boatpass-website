# App-Landingpages – Sichtbarkeit für App-Suchanfragen

**Datum:** 2026-07-21
**Status:** Freigegeben

## Problem

Bei Suchanfragen wie „sbf binnen android", „sbf see android" oder „beste sbf app" taucht
BoatPass weder in der KI-Übersicht noch in den organischen Ergebnissen auf. Zitiert werden
dort Bootspruefung.de, Sailbyte und SBF-Fragen.de – also Websites, nicht Apps.

Die Website hat 44 Blogposts, aber keine einzige Seite zum Thema „App". Der einzige
verwandte Beitrag, `sbf-app-vs-bootsschule.md`, vergleicht App gegen Bootsschule, nicht
Apps untereinander. Für die Anbieter-Vergleichsfrage, die Nutzer tatsächlich stellen,
existiert kein Inhalt.

Das Play-Store-Ranking (Apps-Block) ist ein separates Thema und über ASO bereits
bearbeitet. Diese Spec behandelt ausschließlich die Website.

## Ziel

Für alle Suchvarianten rund um Lern-Apps für deutsche Sportboot- und Funkscheine als
Quelle in der KI-Übersicht zitiert werden und organisch ranken.

Abgedeckte Suchmuster:

- `sbf app`, `bootsführerschein app`, `sbf lernen app`, `prüfungsfragen app`
- `sbf see app android`, `sbf see app iphone`, `sbf binnen app android`, `sbf binnen app ios`
- `sbf app kostenlos`, `sbf see app kostenlos`, `kostenlose bootsführerschein app`
- `beste sbf app`, `sbf app vergleich`, `sbf app test`, `welche sbf app`
- `ubi app`, `src app`, `lrc app`, `funkschein app`, `sprechfunk app`
- englische Entsprechungen für die EN-Seiten

## Wettbewerbsdaten (Stand 2026-07-21)

| App | Bewertung | Downloads | Preismodell | Abgedeckte Scheine |
|---|---|---|---|---|
| Bootspruefung.de (`de.sbfbinnen.app`) | Marktführer seit 2013, 900.000+ Kunden | – | Kostenlos + Pro | Binnen, See, BSP, UBI, SRC, LRC, FKN |
| Sportbootführerschein See 2023 (`eu.wimmerinformatik.sbfs`) | 4,8 ★ / 703 | 100.000+ | Vollständig kostenlos, keine In-App-Käufe, keine Werbung | See (Binnen als separate App `eu.wimmerinformatik.sbfb`) |
| SBF-Fragen, Delius Klasing (`de.deliusklasing.sbffragen2.app`) | 4,7 ★ / 647 | – | Kostenlos eingeschränkt + In-App-Kauf je Schein | See, Binnen, SKS, BSP, SRC, UBI, LRC, FKN |
| Sailbyte (sailbyte.de) | – | 3.000+ | Abo je App, monatlich kündbar | Drei getrennte Apps: See, Binnen, SKS |
| **BoatPass** (`com.boatpass.app`) | 5,0 ★ / 7 | 10+ | Kostenlos + Einmalkauf, kein Abo | See, Binnen, UBI, SRC, LRC – in einer App |

**Ehrliche Alleinstellungen von BoatPass:** alle fünf Scheine in einer App (Sailbyte
benötigt drei, Wimmer zwei); Einmalkauf statt Abo (direkt gegen Sailbyte).

**Ehrliche Schwächen, die benannt werden:** kein SKS, kein Bodenseeschifferpatent, kein
FKN; kleine Nutzerbasis im Vergleich zum Wettbewerb.

## Seitenarchitektur

Fünf Seiten je Sprache, flache URLs neben den bestehenden Schein-Seiten.

| DE | EN | Thema |
|---|---|---|
| `/sbf-app/` | `/en/sbf-app/` | Hub: Bootsführerschein-Apps im Vergleich 2026 |
| `/sbf-see-app/` | `/en/sbf-coastal-app/` | SBF See |
| `/sbf-binnen-app/` | `/en/sbf-inland-app/` | SBF Binnen |
| `/funkschein-app/` | `/en/radio-certificate-app/` | UBI, SRC, LRC gebündelt |
| `/sbf-app-kostenlos/` | `/en/sbf-app-free/` | Kostenlose Apps – was geht wirklich gratis |

Die EN-Slugs folgen der bestehenden Konvention (`sbf-coastal`, `sbf-inland`).

### Bewusste Abgrenzungen

**UBI, SRC und LRC bekommen eine gemeinsame Seite.** Drei Einzelseiten hätten je zu wenig
eigenständigen Inhalt und würden als Thin Content gewertet.

**Android und iOS bekommen keine eigenen Seiten.** Jede der fünf Seiten enthält stattdessen
je einen H2-Abschnitt „… für Android" und „… für iPhone und iPad" plus passende
FAQ-Einträge. Das deckt `sbf binnen app android` ab, ohne Doorway-Seiten zu erzeugen.

**Keine Keyword-Matrix.** Kombinationsseiten wie `/sbf-see-app-android-kostenlos/` werden
nicht angelegt.

## Aufbau jeder Seite

Alle fünf Seiten nutzen dasselbe Modul-Set, in dieser Reihenfolge:

1. **Direkte Antwort** – die ersten 40 Wörter beantworten die Suchanfrage vollständig und
   in sich verständlich. Dieser Absatz ist das Zitat-Ziel für die KI-Übersicht.
2. **Vergleichstabelle** – alle fünf Anbieter mit echten Zahlen. Sortierung alphabetisch,
   BoatPass steht nicht an erster Stelle.
3. **Kurzprofile** – je Anbieter drei bis vier Sätze mit einer Zeile „am besten geeignet
   für". Vorteile des Wettbewerbs werden benannt, wo sie bestehen.
4. **Android-Abschnitt** – Verfügbarkeit, Play-Store-Links, Android-spezifische Hinweise.
5. **iOS-Abschnitt** – dasselbe für App Store.
6. **„Was BoatPass kann – und was nicht"** – fehlende Scheine (SKS, BSP, FKN) und die
   kleine Nutzerbasis werden ausdrücklich genannt.
7. **Transparenzhinweis** – „BoatPass ist unsere eigene App. Deshalb nennen wir hier
   Preise und Funktionen der Alternativen vollständig." Ohne diesen Hinweis droht eine
   Bewertung als Site Reputation Abuse.
8. **FAQ** – sechs bis acht Fragen je Seite, keine Wiederholungen zwischen den Seiten.
9. **CTA** – Play Store und App Store.

## Datenhaltung

Alle Anbieterdaten liegen zentral in `src/data/apps.ts` als typisiertes Array. Die Seiten
importieren daraus, keine Zahl wird in einer `.astro`-Datei hartkodiert. Grund: Bei der
nächsten Preisänderung eines Wettbewerbers müssen die Angaben an genau einer Stelle
geändert werden, sonst driften die fünf Seiten auseinander.

Pro Anbieter erfasst: Name, Anbieter, Play-Store-URL, App-Store-URL, Website, Bewertung,
Anzahl Bewertungen, Downloads, Preismodell, Preis, abgedeckte Scheine, Offline-Fähigkeit,
Prüfungssimulation, Stand der Datenerhebung.

Das Feld „Stand der Datenerhebung" wird auf den Seiten sichtbar ausgegeben.

## Strukturierte Daten

Je Seite:

- `SoftwareApplication` für jede gelistete App, mit `operatingSystem: "ANDROID, IOS"`,
  `applicationCategory: "EducationalApplication"`, `offers` und – nur wo vorhanden –
  `aggregateRating`
- `ItemList` über die Vergleichstabelle
- `FAQPage` über den FAQ-Block
- `BreadcrumbList`
- `hreflang` DE↔EN, wie bei den bestehenden Seitenpaaren

## Integration

Interne Verlinkung auf die neuen Seiten aus:

- `/sbf-see/`, `/sbf-binnen/`, `/ubi/`, `/src/`, `/lrc/`
- `/sbf-binnen-pruefungsfragen/`, `/sbf-see-pruefungsfragen/`
- `/fuehrerscheine/`, `/sbf-kosten/`
- Blogpost `sbf-app-vs-bootsschule.md` (DE und EN)

Zusätzlich: Aufnahme in die Sitemap und in die Footer-Navigation. Die EN-Seiten werden
zeitgleich mit den DE-Seiten angelegt, entsprechend der EN/DE-Parität.

## Nicht Teil dieser Spec

- Play-Store-Optimierung (ASO) – bereits separat bearbeitet
- Änderungen an der App selbst
- Bewertungs-Kampagne im Play Store

## Erfolgskriterien

- Die fünf DE- und fünf EN-Seiten sind live, valide und in der Sitemap
- Rich-Results-Test bestätigt `FAQPage` und `SoftwareApplication` je Seite
- Alle Wettbewerbsangaben stimmen mit den Quellen vom 2026-07-21 überein
- Jede Seite beantwortet ihre Hauptsuchanfrage in den ersten 40 Wörtern
- Keine Zahl ist außerhalb von `src/data/apps.ts` hartkodiert
