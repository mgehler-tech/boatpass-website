# Blog-Automatik – Playbook (für den geplanten Cloud-Agenten)

Dieses Dokument ist die **vollständige, eigenständige Anleitung** für die Routine, die
2× pro Woche (Di + Do) automatisch einen neuen Blogpost für boatpass.de erstellt.
Der Agent startet ohne Vorwissen – alles Nötige steht hier.

Umgesetzt als **Claude Code Routine** (claude.ai/code/routines): ein geplanter Cloud-Lauf,
der auf das Repo `mgehler-tech/boatpass-website` zeigt. Der Routine-Prompt verweist auf
genau dieses Playbook – siehe [`routine-prompt.md`](routine-prompt.md) zum Reinkopieren.

## Ziel

Mehr organische SEO-Reichweite für boatpass.de durch regelmäßige, **echt hilfreiche**
Artikel rund um den Sportbootführerschein. Qualität schlägt Quantität: lieber ein
fundierter Artikel als dünner AI-Fülltext (Google straft Letzteres ab).

## Ablauf pro Lauf

1. **Repo aktuell ziehen** (`git pull`), damit du den neuesten Stand hast.
2. **Vorhandene Themen erfassen:** Liste alle Dateien in `src/content/blog/de/` und
   `src/content/blog/en/`. Nichts darf sich thematisch doppeln.
3. **Thema wählen:** Nimm das **oberste noch offene** Thema aus
   [`topic-backlog.md`](topic-backlog.md) (Zeilen mit `- [ ]`). Passt keines mehr / ist
   die Liste fast leer (< 4 offene Themen), denke dir aus der Domäne neue, sinnvolle,
   noch nicht abgedeckte Themen aus und ergänze sie unten in der Backlog.
4. **Artikel schreiben** – DE **und** EN (siehe Stil & Frontmatter unten).
5. **Dateien anlegen:**
   - DE: `src/content/blog/de/<slug-de>.md`
   - EN: `src/content/blog/en/<slug-en>.md`
   - Slug = Dateiname (Kleinbuchstaben, Bindestriche, keine Umlaute: ä→ae usw.).
6. **Backlog aktualisieren:** Hake das Thema in `topic-backlog.md` ab (`- [x]`) und
   ergänze in Klammern Datum + die beiden Slugs.
7. **Build prüfen:** `npm run build` muss fehlerfrei durchlaufen (Frontmatter-Schema!).
8. **Qualitätssicherung – PFLICHT-GATE vor jeder Veröffentlichung** (siehe eigener Abschnitt
   „Qualitätssicherung" unten). Erst veröffentlichen, wenn die QA mit **BESTANDEN** abschließt.
9. **Veröffentlichen** (nur nach bestandener QA):
   - Bevorzugt **direkt auf `main`**: `git commit -m "feat(blog): <Titel DE>"` → `git push origin main`.
     Cloudflare/Netlify deployt automatisch beim Push – sofort live.
   - Falls die Umgebung keinen Direkt-Push auf `main` erlaubt: Branch `blog/<slug-de>` pushen
     und einen **Pull Request** öffnen (Titel = Commit-Titel). Mit aktiviertem Auto-Merge geht
     der Post nach den Checks automatisch live.

## Frontmatter (Pflicht, exakt nach Schema in `src/content.config.ts`)

```yaml
---
title: "…"            # prägnant, Keyword vorne, < 60 Zeichen wenn möglich
description: "…"       # 140–160 Zeichen, enthält das Haupt-Keyword, macht neugierig
date: <YYYY-MM-DD>     # das HEUTIGE Datum des Laufs
tags: ["…"]            # bestehende Tags wiederverwenden (s. u.), nicht neu erfinden
readingTime: <Zahl>    # realistische Lesezeit in Minuten (ca. Wörter / 200)
lang: de               # bzw. en
author: "Marius Gehler"
altSlug: "<slug der anderen Sprache>"   # für hreflang DE↔EN, MUSS gegenseitig stimmen
---
```

Bestehende Tags (DE): `Vorbereitung`, `Prüfungswissen`. EN-Pendant: `Exam Knowledge`.
Neue Tags nur, wenn wirklich nötig und konsistent in beiden Sprachen.

## Stil & Aufbau (am Bestand orientiert)

- **Länge:** ~1.500–2.000 Wörter, ehrlicher Mehrwert.
- **Ansprache:** „du" (DE), direkt und freundlich-sachlich. EN: „you".
- **Struktur:** Einleitung (2–3 Sätze, Problem/Versprechen) → mehrere `##`-Abschnitte,
  bei Bedarf `###` → abschließender `## Fazit`.
- **Formatierung:** zentrale Begriffe **fett**, Aufzählungen wo sinnvoll. Keine Tabellen
  nötig. Korrekte Fachbegriffe (ELWIS-Katalog, Prüfungsmodalitäten) – keine erfundenen
  Fakten/Zahlen. Im Zweifel konservativ formulieren.
- **Interne Verlinkung (wichtig für SEO):** verlinke 1–3 thematisch passende eigene
  Seiten/Posts, z. B. `/sbf-binnen/`, `/sbf-see/`, `/sbf-kosten/`,
  `/sbf-pruefung-ablauf/`, `/faq/` oder verwandte Blogposts. Markdown-Links.
- **CTA am Ende:** ein natürlicher Hinweis auf die **Boatpass-App** (offizieller
  ELWIS-Fragenkatalog, Prüfungsmodus), wie im Bestand – nicht werblich-marktschreierisch.
- **EN-Version:** eigenständige Übersetzung desselben Artikels (kein Wort-für-Wort),
  gleiche Struktur. Deutsche Begriffe (z. B. „Sportbootführerschein") erklären.

## Qualitätssicherung (PFLICHT-GATE vor jeder Veröffentlichung)

Jeder Post wird **vor** dem Push von einem **separaten Review-Pass mit frischem Blick**
fachlich geprüft. Starte dafür einen eigenen **Prüf-/Subagenten** (eigener Kontext), der NUR
prüft – nicht schreibt. Er bekommt die beiden fertigen Dateien
(`de/<slug>.md`, `en/<slug>.md`) und dieses Playbook und arbeitet die Checkliste ab.
Er gibt am Ende **BESTANDEN** oder **DURCHGEFALLEN** zurück, bei „durchgefallen" mit konkreter
Mängelliste.

**Wichtigste Regel – Richtigkeit vor Veröffentlichung:**
- Jede fachliche Aussage zum SBF (Prüfungsaufbau, Fragenzahl, Bestehensgrenzen, Fristen,
  Rechtsregeln, Lichter/Schallsignale, Knoten, Seezeichen, Promille, Geltungsbereiche usw.)
  muss **sachlich korrekt** sein und dem offiziellen Stand (ELWIS-Fragenkatalog, geltende
  Vorschriften) entsprechen. **Keine erfundenen Zahlen oder Regeln.**
- Lässt sich eine Aussage **nicht sicher verifizieren**, wird sie **korrigiert, konservativ
  umformuliert oder gestrichen** – im Zweifel weglassen. Ungeprüfte Fakten dürfen NICHT live gehen.
- Bei Unsicherheit recherchiert der Prüf-Agent (Websuche/offizielle Quellen) und gleicht ab.

**Ablauf des Gates:**
1. Review-Agent prüft (Checkliste unten).
2. Bei **DURCHGEFALLEN**: Hauptagent behebt die genannten Mängel, dann erneut prüfen –
   so lange, bis BESTANDEN.
3. Lässt sich ein fachlicher Fehler nicht sicher beheben: **nicht direkt auf `main` pushen**.
   Stattdessen als Pull Request (Branch `blog/<slug-de>`) öffnen und im Abschlussbericht klar
   auf die offene Stelle hinweisen, damit ein Mensch entscheidet.
4. Erst nach **BESTANDEN** veröffentlichen (Schritt 9).

**Review-Checkliste:**
- [ ] **Fachliche Richtigkeit:** jede Zahl/Regel/Behauptung stimmt mit dem offiziellen Stand überein
- [ ] Keine unbelegten oder erfundenen Fakten; Unsicheres entfernt/abgeschwächt
- [ ] DE und EN inhaltlich konsistent (gleiche Fakten, keine Widersprüche)
- [ ] Thema nicht schon vorhanden (keine Dopplung mit Bestand)
- [ ] DE + EN erstellt, `altSlug` gegenseitig korrekt
- [ ] Frontmatter vollständig, `date` = heute, `tags` aus Bestand
- [ ] Interne Links zeigen auf existierende Seiten; Boatpass-App-CTA vorhanden
- [ ] Sprache/Stil sauber (Rechtschreibung, Grammatik, „du"/„you", keine KI-Floskeln)
- [ ] `npm run build` grün
- [ ] Backlog abgehakt
