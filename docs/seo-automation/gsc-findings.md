# GSC-Findings – automatisch erzeugt

> Deterministisch aus Search-Console-Daten von `scripts/analyze-gsc-data.mjs`.
> **Kein LLM, keine automatischen Code-Änderungen.** Die Bewertung und jede
> Umsetzung passieren manuell – so bleibt der `git diff` zwischen den Wochen lesbar.

- **Erzeugt:** 2026-07-23 05:05 UTC
- **Zeitraum:** 2026-06-22 bis 2026-07-19
- **Vorperiode:** 2026-05-25 bis 2026-06-21

## Kennzahlen

| Metrik | Aktuell | Vorperiode | Δ |
|---|--:|--:|--:|
| Klicks | 49 | 9 | +444 % |
| Impressionen | 6.035 | 1.644 | +267 % |
| CTR gesamt | 0,81 % | 0,55 % | — |
| Seiten mit Impressionen | 92 | 35 | — |

## A) Striking Distance (Position 5–20, ≥ 80 Impressionen)

Rankings knapp vor Seite 1 – der ertragreichste Hebel. „Top-Query" ist die stärkste
Suchanfrage, über die die Seite gefunden wird.

| Seite | Pos | Impr. | Klicks | CTR | Top-Query (Pos) |
|---|--:|--:|--:|--:|---|
| `/en/blog/boating-without-license-15-hp/` | 6,8 | 455 | 2 | 0,4 % | — |
| `/en/sbf-inland/` | 7,3 | 153 | 1 | 0,7 % | sbf kurs (76) |
| `/blog/sbf-see-navigationsaufgaben-erklaert/` | 8,8 | 107 | 2 | 1,9 % | — |
| `/en/blog/blood-alcohol-limit-boat/` | 9,5 | 114 | 2 | 1,8 % | alcohol limit for boat drivers (5) |
| `/blog/kursumrechnung-sbf-see/` | 10,0 | 368 | 1 | 0,3 % | rwk navigation (11) |
| `/blog/rettungsweste-auftriebsklassen/` | 11,6 | 218 | 0 | 0,0 % | 50n auftrieb (18) |
| `/en/faq/` | 12,0 | 176 | 1 | 0,6 % | boat license germany (59) |
| `/blog/promillegrenze-boot/` | 17,3 | 145 | 0 | 0,0 % | promillegrenze bootsführerschein (10) |
| `/blog/boot-fahren-ohne-fuehrerschein-15-ps/` | 17,8 | 251 | 0 | 0,0 % | motorboot 15 ps führerscheinfrei (31) |
| `/blog/lichterfuehrung-erklaert/` | 18,0 | 388 | 0 | 0,0 % | lichterführung (39) |
| `/blog/gezeiten-zwoelftelregel/` | 18,3 | 181 | 1 | 0,6 % | gezeitenberechnung (49) |

## B) CTR-Schwächen (gute Position, zu wenig Klicks)

CTR unter der Hälfte des Positions-Erwartungswerts. Ursache meist schwacher Title/Snippet
– **oder** ein breiter, unpassender Long-Tail. Vor jeder Maßnahme prüfen, welches von beidem.

| Seite | Pos | Impr. | CTR | Erwartet |
|---|--:|--:|--:|--:|
| `/en/blog/boating-without-license-15-hp/` | 6,8 | 455 | 0,44 % | ~4 % |
| `/blog/lichterfuehrung-erklaert/` | 18,0 | 388 | 0,00 % | ~2 % |
| `/blog/kursumrechnung-sbf-see/` | 10,0 | 368 | 0,27 % | ~2 % |
| `/blog/boot-fahren-ohne-fuehrerschein-15-ps/` | 17,8 | 251 | 0,00 % | ~2 % |
| `/blog/rettungsweste-auftriebsklassen/` | 11,6 | 218 | 0,00 % | ~2 % |
| `/blog/gezeiten-zwoelftelregel/` | 18,3 | 181 | 0,55 % | ~2 % |
| `/en/faq/` | 12,0 | 176 | 0,57 % | ~2 % |
| `/en/sbf-inland/` | 7,3 | 153 | 0,65 % | ~4 % |

## C) Bewegungen ggü. Vorperiode

**Aufsteiger:**
- `/en/blog/boating-without-license-15-hp/`: 1 → 455 Impr. (+454)
- `/blog/lichterfuehrung-erklaert/`: 16 → 388 Impr. (+372)
- `/blog/kursumrechnung-sbf-see/`: 61 → 368 Impr. (+307)
- `/blog/rettungsweste-auftriebsklassen/`: 0 → 218 Impr. (+218)
- `/sbf-kosten/`: 256 → 468 Impr. (+212)
- `/blog/boot-fahren-ohne-fuehrerschein-15-ps/`: 69 → 251 Impr. (+182)

**Verlierer:**
- `/sbf-see/`: 156 → 65 Impr. (-91)

## D) Themen-Chancen (Query mit Nachfrage, Position > 20, 0 Klicks)

Kandidaten für neue oder vertiefte Inhalte – Rohmaterial für den Blog-Autopilot.

| Query | Impr. | Pos |
|---|--:|--:|
| bootsführerschein kosten | 45 | 86 |
| gezeitenberechnung | 18 | 49 |
| bootsschein kosten | 14 | 84 |
| funkschein lrc | 14 | 75 |
| fahrtenbereich 3 | 13 | 68 |
| beleuchtung schiff | 12 | 37 |
| fahrmanöver | 12 | 64 |
| boat license | 10 | 41 |
| bootsführerschein preis | 10 | 75 |
| how do you get a boat license | 10 | 89 |
| how to get a boating license | 10 | 98 |
| boating license | 9 | 37 |

---

_Nächster Lauf: automatisch montags. Rohreport als Workflow-Artefakt `gsc-report` angehängt._
