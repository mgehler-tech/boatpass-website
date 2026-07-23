# GSC-Findings – automatisch erzeugt

> Deterministisch aus Search-Console-Daten von `scripts/analyze-gsc-data.mjs`.
> **Kein LLM, keine automatischen Code-Änderungen.** Die Bewertung und jede
> Umsetzung passieren manuell – so bleibt der `git diff` zwischen den Wochen lesbar.

- **Erzeugt:** 2026-07-23 05:08 UTC
- **Zeitraum:** 2026-06-23 bis 2026-07-20
- **Vorperiode:** 2026-05-26 bis 2026-06-22

## Kennzahlen

| Metrik | Aktuell | Vorperiode | Δ |
|---|--:|--:|--:|
| Klicks | 52 | 11 | +373 % |
| Impressionen | 6.072 | 1.772 | +243 % |
| CTR gesamt | 0,86 % | 0,62 % | — |
| Seiten mit Impressionen | 93 | 38 | — |

## A) Striking Distance (Position 5–20, ≥ 80 Impressionen)

Rankings knapp vor Seite 1 – der ertragreichste Hebel. „Top-Query" ist die stärkste
Suchanfrage, über die die Seite gefunden wird.

| Seite | Pos | Impr. | Klicks | CTR | Top-Query (Pos) |
|---|--:|--:|--:|--:|---|
| `/en/blog/boating-without-license-15-hp/` | 6,8 | 463 | 2 | 0,4 % | — |
| `/en/sbf-inland/` | 7,3 | 163 | 1 | 0,6 % | sbf kurs (76) |
| `/blog/sbf-see-navigationsaufgaben-erklaert/` | 9,1 | 129 | 3 | 2,3 % | — |
| `/en/blog/blood-alcohol-limit-boat/` | 9,5 | 114 | 2 | 1,8 % | alcohol limit for boat drivers (5) |
| `/blog/kursumrechnung-sbf-see/` | 10,0 | 351 | 0 | 0,0 % | rwk navigation (11) |
| `/blog/rettungsweste-auftriebsklassen/` | 11,6 | 218 | 0 | 0,0 % | 50n auftrieb (18) |
| `/en/faq/` | 12,0 | 176 | 1 | 0,6 % | boat license germany (59) |
| `/blog/promillegrenze-boot/` | 17,2 | 146 | 0 | 0,0 % | promillegrenze bootsführerschein (10) |
| `/blog/boot-fahren-ohne-fuehrerschein-15-ps/` | 17,5 | 225 | 0 | 0,0 % | motorboot 15 ps führerscheinfrei (31) |
| `/blog/lichterfuehrung-erklaert/` | 18,1 | 384 | 0 | 0,0 % | lichterführung (39) |
| `/blog/gezeiten-zwoelftelregel/` | 18,2 | 181 | 1 | 0,6 % | gezeitenberechnung (49) |

## B) CTR-Schwächen (gute Position, zu wenig Klicks)

CTR unter der Hälfte des Positions-Erwartungswerts. Ursache meist schwacher Title/Snippet
– **oder** ein breiter, unpassender Long-Tail. Vor jeder Maßnahme prüfen, welches von beidem.

| Seite | Pos | Impr. | CTR | Erwartet |
|---|--:|--:|--:|--:|
| `/en/blog/boating-without-license-15-hp/` | 6,8 | 463 | 0,43 % | ~4 % |
| `/blog/lichterfuehrung-erklaert/` | 18,1 | 384 | 0,00 % | ~2 % |
| `/blog/kursumrechnung-sbf-see/` | 10,0 | 351 | 0,00 % | ~2 % |
| `/blog/boot-fahren-ohne-fuehrerschein-15-ps/` | 17,5 | 225 | 0,00 % | ~2 % |
| `/blog/rettungsweste-auftriebsklassen/` | 11,6 | 218 | 0,00 % | ~2 % |
| `/blog/gezeiten-zwoelftelregel/` | 18,2 | 181 | 0,55 % | ~2 % |
| `/en/faq/` | 12,0 | 176 | 0,57 % | ~2 % |
| `/en/sbf-inland/` | 7,3 | 163 | 0,61 % | ~4 % |

## C) Bewegungen ggü. Vorperiode

**Aufsteiger:**
- `/en/blog/boating-without-license-15-hp/`: 1 → 463 Impr. (+462)
- `/blog/lichterfuehrung-erklaert/`: 23 → 384 Impr. (+361)
- `/blog/kursumrechnung-sbf-see/`: 90 → 351 Impr. (+261)
- `/blog/rettungsweste-auftriebsklassen/`: 0 → 218 Impr. (+218)
- `/sbf-kosten/`: 267 → 463 Impr. (+196)
- `/en/faq/`: 4 → 176 Impr. (+172)

**Verlierer:**
- `/sbf-see/`: 158 → 63 Impr. (-95)

## D) Themen-Chancen (Query mit Nachfrage, Position > 20, 0 Klicks)

Kandidaten für neue oder vertiefte Inhalte – Rohmaterial für den Blog-Autopilot.

| Query | Impr. | Pos |
|---|--:|--:|
| bootsführerschein kosten | 44 | 86 |
| gezeitenberechnung | 18 | 49 |
| funkschein lrc | 16 | 72 |
| bootsschein kosten | 14 | 84 |
| fahrtenbereich 3 | 13 | 68 |
| beleuchtung schiff | 12 | 37 |
| fahrmanöver | 12 | 64 |
| boat license | 10 | 41 |
| how do you get a boat license | 10 | 86 |
| how to get a boating license | 10 | 98 |
| boating license | 9 | 37 |
| bootsführerschein preis | 9 | 75 |

---

_Nächster Lauf: automatisch montags. Rohreport als Workflow-Artefakt `gsc-report` angehängt._
