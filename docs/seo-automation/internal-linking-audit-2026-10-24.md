# Interne Verlinkung – Audit & Empfehlungen (2026-10-24)

## 0. Waisen-Check
Skript-Scan über 71 DE-/71 EN-Artikel (Markdown-Links) gegen `src/pages/**`, `src/components/**`, `src/layouts/**`, `src/data/*.ts`.
Alle Artikel sind über Blog-Übersicht und „Verwandte Artikel" erreichbar. Ohne Blog-Inbound und ohne Pillar-Link waren:
`boots-uebernahmecheck-charterboot-eigenes-boot`, `sportbootfuehrerschein-gesundheitliche-einschraenkung-aerztliches-zeugnis`
(+ EN) sowie die iOS-Launch-Artikel (nur Blog-Index/Startseiten-Teaser).

## 1. Umgesetzt (DE+EN gespiegelt, 6 Dateien, Fließtext-Links)
| Quelle (DE) | Ziel | Anchor |
|---|---|---|
| `charterschein-boot-mieten-ohne-fuehrerschein` (Einweisung) | `boots-uebernahmecheck-charterboot-eigenes-boot` | „Übernahmecheck für Charterboot und eigenes Boot" |
| `sportbootfuehrerschein-voraussetzungen` (ärztliches Zeugnis) | `sportbootfuehrerschein-gesundheitliche-einschraenkung-aerztliches-zeugnis` | „ärztlichen Zeugnis bei gesundheitlicher Einschränkung" |
| `wetterkunde-beaufort` (Wetterzeichen) | `gewitter-blitzschlag-wasser-verhalten-vorsorge` | „Gewitter auf dem Wasser: Verhalten und Vorsorge" |

SEO-Begründung: thematisch passende Stelle in etabliertem Artikel, beschreibender Anchor, Ziel hatte 0 Blog-Inbound.

## 2. Offen
1. iOS-Launch-Artikel (DE/EN) fallen aus dem Top-3-Teaser, sobald drei neuere Artikel erscheinen – Link aus `sbf-app-vs-bootsschule` erwägen.
2. Artikel mit nur 1 Blog-Inbound: `verkehrstrennungsgebiete-see`, `betonnung-nordsee-ostsee-unterschiede`, `schleusenfahrt-…`, `bruecken-durchfahrtshoehen-…`.
3. Single-Tag-Taxonomie schwächt den „Verwandte Artikel"-Algorithmus (unverändert).
