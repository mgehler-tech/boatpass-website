# Wettbewerbsanalyse & SEO-Lückenanalyse — Boatpass

Stand: 2026-06-04. Markt: Sportbootführerschein (SBF) lernen, DE.
Ziel: Auffindbarkeit verbessern. Ergänzt [2026-06-03-seo-optimierung.md](2026-06-03-seo-optimierung.md).

## Unsere Ausgangslage
- **Produkt:** Android-App, ELWIS-Fragenkatalog, Prüfungssimulation, Fehler-Training.
- **Differenzierung:** Einmalkauf statt Abo (6,99 € je Katalog / 11,99 € Kombi), kostenloser Einstieg.
- **Status:** App im geschlossenen Test → keine Store-Bewertungen, kein `aggregateRating`.
- **Technik:** Fundament stark (Canonical, hreflang DE/EN, Sitemap, Schema, OG, Alt-Texte).
- **Content:** Landingpages (Binnen, See, Kosten, Prüfungsablauf, Prüfungsfragen, UBI) + 11 Blogartikel, DE+EN.

## Die größten Wettbewerber

| Anbieter | Typ | Stärke (für SEO) |
|---|---|---|
| **bootsschule1.de** | Online-Kurs + Praxis | Marktführer-Brand, Awards (DBA-Sieger, Computer Bild Top 2026), Presse, Geld-zurück, 100+ Standorte → Domain Authority + Local Intent |
| **sportbootfuehrerschein.de** (R. Dreyer) | Schule + Lehrbuchautor | Autoren-Autorität, 250 Prüfungsorte, etablierte Marke |
| **skipperwerden.de** | Kostenloser Online-Kurs | 100+ Lernvideos, **Fragentrainer & Funksimulator im Browser**, Content-SEO (Kurse als indexierbare Artikel-URLs), SBF/SRC/UBI |
| **bootspruefung.de** | Kostenloser Kurs + App | **Alle amtlichen Fragen im Browser**, breite Abdeckung (Binnen/See/BSP/SRC/LRC/UBI/FKN), App iOS+Android |
| **sbf-fragen.de** (Delius Klasing) | App | Verlags-Autorität, Leitner-System, iOS+Android |
| **bootsfuehrerscheinpruefung.de / online-pruefen.de** | Web-Trainer | Kostenlos im Browser üben, Spaced Repetition |
| **App-Konkurrenz** (Bootsprüfung-App u.a.) | Apps | 4,8★ / 5.000+ Bewertungen, "98 % Bestehensquote", iOS+Android |

## Was uns fehlt — priorisiert nach Wirkung

### 🔴 1. Kein webbasierter Fragentrainer (größte Lücke)
skipper, bootspruefung, online-pruefen, bootsfuehrerscheinpruefung lassen Nutzer die **amtlichen Fragen direkt im Browser kostenlos üben**. Eine reine App-Download-Seite kann auf die wichtigste Suchintention nicht ranken: *"SBF Binnen Fragen online üben / kostenlos / Fragenkatalog"*.
- **Folge:** Wir verlieren das größte Keyword-Cluster + Engagement-Signale (Verweildauer) + natürliche Backlinks.
- **Hebel:** Wir **haben** den ELWIS-Katalog schon. Als indexierbaren Web-Trainer ausspielen — eine Seite pro Themenblock/Frage. Funnel: im Browser üben → App für Offline/Komplettpaket. Schlägt drei Probleme auf einmal: Rankings, iOS-Nutzer, Backlinks.

### 🔴 2. iOS-Lücke
App nur Android. Konkurrenz durchweg iOS+Android oder Web. Suchanfragen *"SBF App iPhone/iOS"* gehen verloren. Web-Trainer (Punkt 1) deckt iOS-Nutzer übergangsweise ab; mittelfristig iOS-App.

### 🟠 3. Domain Authority & Backlinks
Wettbewerber haben Awards, Presse (Computer Bild, YACHT, Sail24, ADAC) und Verlagsbacking. Wir: neu, keine Reviews.
- **Digital PR:** In die Vergleichsartikel rein, die es schon gibt — YACHT und Sail24 haben "X SBF-Apps im Test"-Stücke. Da müssen wir gelistet sein.
- **Linkwürdige Gratis-Assets:** Web-Trainer, druckbare Spickzettel, Knoten-PDF, Seekarten-Übung (Bereich D49).
- **Reviews nach Launch** → `aggregateRating`-Schema (schon geplant, durch Launch blockiert) → Sterne im Snippet.

### 🟠 4. Topical Authority — fehlende Content-Cluster
Konkurrenz deckt ein breiteres Keyword-Universum ab. Uns fehlen ganze Themen:
- **Funk:** SRC / LRC (wir haben nur UBI, "bald"). Hohes Volumen.
- **Knoten lernen** — starkes Keyword, ideal als interaktiver Gratis-Trainer.
- **Seezeichen / Lichterführung / Befahrensregeln** — visuell, ranken gut, interaktiv linkwürdig.
- **Navigationsaufgaben** — nur 1 Artikel; ausbauen zu interaktivem Hub (Kartenarbeit D49).
- **Praxisprüfung / Manöver**-Guides.
- **Bodenseeschifferpatent**, top-of-funnel **SKS**.

### 🟡 5. Tool-/Interaktiv-Content (verdient Links & Rankings)
Statische Seiten ranken schlechter als Tools. Bauen:
- **Knotentrainer**, **Seezeichen-Quiz**, **interaktiver Kosten-Rechner** (wir haben Kosten-*Seite*, kein Tool), **Lichterführungs-Trainer**.

### 🟡 6. Video / YouTube
skipper 100+ Videos, bootsschule1 Kurzvideos, nautigo 4K. YouTube = zweite Suchmaschine für *"Navigationsaufgabe erklärt"*. Wir: keine Videos. Kanal + Einbettung erhöht Verweildauer.

### 🟡 7. Local & Vergleichs-Intent
- **Local:** Konkurrenz rankt für *"Sportbootführerschein [Stadt]"* über Standorte. Als App ohne Standorte nicht 1:1 angreifbar — aber wenige hochwertige Hub-Seiten *"SBF Prüfung in [Großstadt] — Termine & Vorbereitung"* möglich (Doorway-/Thin-Content-Risiko beachten, nicht skalieren).
- **Vergleich:** Keywords *"beste SBF App 2026"*, *"[Konkurrent] Alternative"* gezielt bespielen.

### 🟢 8. Schema-Ergänzungen (Quick Wins)
- **Course**-Schema für das Lernangebot (Wettbewerber = Kurse).
- **HowTo** für Anleitungen (Navigationsaufgaben, Knoten).
- **BreadcrumbList** für Blog/Landingpages.

## Empfohlene Reihenfolge
1. **Web-Fragentrainer** (Punkt 1) — höchster Hebel, Content schon vorhanden, löst 1+2+3 teils mit.
2. **Content-Cluster + Tools** (4, 5) — Knoten, Seezeichen, SRC, Navigation ausbauen.
3. **Digital PR + Reviews** (3) — in Vergleichsartikel, Launch beschleunigen für `aggregateRating`.
4. **Video/YouTube** (6), **Schema** (8), **Local/Vergleich** (7) — mittelfristig.

## Quellen
- https://bootsschule1.de/bootsfuehrerschein/
- https://www.skipperwerden.de/
- https://www.bootspruefung.de/
- https://sbf-fragen.de/
- https://www.online-pruefen.de/ , https://www.bootsfuehrerscheinpruefung.de/
- https://www.sportbootfuehrerschein.de/
- YACHT- & Sail24-App-Tests (Presse-Linkziele)
