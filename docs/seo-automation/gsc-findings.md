# GSC-Findings – automatisch erzeugt

> Deterministisch aus Search-Console-Daten von `scripts/analyze-gsc-data.mjs`.
> **Kein LLM, keine automatischen Code-Änderungen.** Die Bewertung und jede
> Umsetzung passieren manuell – so bleibt der `git diff` zwischen den Wochen lesbar.

- **Erzeugt:** 2026-07-27 08:53 UTC
- **Zeitraum:** 2026-06-27 bis 2026-07-24
- **Vorperiode:** 2026-05-30 bis 2026-06-26

## Kennzahlen

| Metrik | Aktuell | Vorperiode | Δ |
|---|--:|--:|--:|
| Klicks | 60 | 18 | +233 % |
| Impressionen | 6.242 | 2.422 | +158 % |
| CTR gesamt | 0,96 % | 0,74 % | — |
| Seiten mit Impressionen | 105 | 47 | — |

## A) Striking Distance (Position 5–20, ≥ 80 Impressionen)

Rankings knapp vor Seite 1 – der ertragreichste Hebel. „Top-Query" ist die stärkste
Suchanfrage, über die die Seite gefunden wird.

| Seite | Pos | Impr. | Klicks | CTR | Top-Query (Pos) |
|---|--:|--:|--:|--:|---|
| `/en/blog/sbf-valid-abroad/` | 5,6 | 93 | 1 | 1,1 % | — |
| `/en/blog/boating-without-license-15-hp/` | 6,7 | 428 | 1 | 0,2 % | — |
| `/en/sbf-inland/` | 7,2 | 203 | 1 | 0,5 % | sbf kurs (76) |
| `/blog/sbf-see-navigationsaufgaben-erklaert/` | 9,1 | 195 | 4 | 2,1 % | — |
| `/en/blog/blood-alcohol-limit-boat/` | 9,5 | 114 | 2 | 1,8 % | alcohol limit for boat drivers (5) |
| `/blog/kursumrechnung-sbf-see/` | 10,2 | 321 | 1 | 0,3 % | rwk navigation (11) |
| `/blog/rettungsweste-auftriebsklassen/` | 11,6 | 228 | 0 | 0,0 % | 50n auftrieb (18) |
| `/en/faq/` | 11,9 | 187 | 2 | 1,1 % | boat license germany (59) |
| `/blog/boot-fahren-ohne-fuehrerschein-15-ps/` | 15,8 | 172 | 0 | 0,0 % | motorboot 15 ps führerscheinfrei (31) |
| `/blog/gezeiten-zwoelftelregel/` | 16,5 | 170 | 2 | 1,2 % | gezeitenberechnung (48) |
| `/blog/promillegrenze-boot/` | 17,0 | 152 | 0 | 0,0 % | promillegrenze bootsführerschein (10) |
| `/blog/sbf-im-ausland-gueltig/` | 17,1 | 81 | 0 | 0,0 % | sbf see international (59) |
| `/blog/lichterfuehrung-erklaert/` | 17,8 | 337 | 1 | 0,3 % | lichterführung (39) |

## B) CTR-Schwächen (gute Position, zu wenig Klicks)

CTR unter der Hälfte des Positions-Erwartungswerts. Ursache meist schwacher Title/Snippet
– **oder** ein breiter, unpassender Long-Tail. Vor jeder Maßnahme prüfen, welches von beidem.

| Seite | Pos | Impr. | CTR | Erwartet |
|---|--:|--:|--:|--:|
| `/en/blog/boating-without-license-15-hp/` | 6,7 | 428 | 0,23 % | ~4 % |
| `/blog/lichterfuehrung-erklaert/` | 17,8 | 337 | 0,30 % | ~2 % |
| `/blog/kursumrechnung-sbf-see/` | 10,2 | 321 | 0,31 % | ~2 % |
| `/blog/rettungsweste-auftriebsklassen/` | 11,6 | 228 | 0,00 % | ~2 % |
| `/en/sbf-inland/` | 7,2 | 203 | 0,49 % | ~4 % |
| `/blog/boot-fahren-ohne-fuehrerschein-15-ps/` | 15,8 | 172 | 0,00 % | ~2 % |
| `/blog/promillegrenze-boot/` | 17,0 | 152 | 0,00 % | ~2 % |
| `/en/sbf-costs/` | 4,1 | 146 | 0,68 % | ~4 % |

## C) Bewegungen ggü. Vorperiode

**Aufsteiger:**
- `/en/blog/boating-without-license-15-hp/`: 53 → 428 Impr. (+375)
- `/blog/lichterfuehrung-erklaert/`: 92 → 337 Impr. (+245)
- `/blog/rettungsweste-auftriebsklassen/`: 0 → 228 Impr. (+228)
- `/en/sbf-inland/`: 0 → 203 Impr. (+203)
- `/blog/sbf-see-navigationsaufgaben-erklaert/`: 0 → 195 Impr. (+195)
- `/en/faq/`: 11 → 187 Impr. (+176)

**Verlierer:**
_keine_

## D) Themen-Chancen (Query mit Nachfrage, Position > 20, 0 Klicks)

Kandidaten für neue oder vertiefte Inhalte – Rohmaterial für den Blog-Autopilot.

| Query | Impr. | Pos |
|---|--:|--:|
| bootsführerschein kosten | 42 | 86 |
| funkschein lrc | 20 | 73 |
| bootsschein kosten | 13 | 86 |
| how to get a boating license | 13 | 96 |
| beleuchtung schiff | 12 | 37 |
| how do you get a boat license | 12 | 84 |
| gezeitenberechnung | 11 | 48 |
| boat registration | 10 | 53 |
| boat license | 9 | 41 |
| boating license | 9 | 40 |
| bootsführerschein preis | 9 | 74 |
| kollisionsverhütungsregeln | 9 | 51 |

---

_Nächster Lauf: automatisch montags. Rohreport als Workflow-Artefakt `gsc-report` angehängt._
