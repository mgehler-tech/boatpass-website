# Website-Optimierung – Playbook (für den geplanten Cloud-Agenten)

Dieses Dokument ist die **vollständige, eigenständige Anleitung** für die Routine, die
**täglich um 09:00 Europe/Berlin** die **bestehende** Website boatpass.de technisch prüft
und in **kleinen, fokussierten Schritten** verbessert. Der Agent startet ohne Vorwissen –
alles Nötige steht hier.

Umgesetzt als **Claude Code Routine** (claude.ai/code/routines): ein geplanter Cloud-Lauf,
der auf das Repo `mgehler-tech/boatpass-website` zeigt. Der Routine-Prompt verweist auf
genau dieses Playbook – siehe [`routine-prompt.md`](routine-prompt.md) zum Reinkopieren.

> **Abgrenzung zur Blog-Automatik:** Die Blog-Routine (`docs/blog-automation/`) erzeugt
> **neue Inhalte**. Diese Routine schreibt **keine** Blogposts. Sie kümmert sich um die
> **technische Gesundheit und On-Page-Qualität der bestehenden Seiten** (SEO, Performance,
> Accessibility, interne Verlinkung, strukturierte Daten, tote Links, Aktualität).

## Ziel

boatpass.de dauerhaft schnell, sauber indexierbar, barrierearm und intern gut verlinkt
halten. Pro Lauf **eine** klar abgegrenzte Verbesserung mit echtem Nutzen – kein Massen-
Refactoring, keine Designänderungen ohne Anlass. Lieber ein kleiner, sicherer, gut
geprüfter Diff als ein großer riskanter.

## Grundprinzipien (wichtig)

1. **Ein Fokus pro Lauf.** Wähle genau **einen** Fokusbereich (siehe Rotation unten) und
   bearbeite dort die lohnendste Einzelmaßnahme. Nicht alles auf einmal.
2. **Klein & sicher.** Der Diff soll überschaubar und reviewbar sein. Keine Layout-/Design-
   Umbauten, keine Abhängigkeits-Upgrades, keine Umbenennungen von Routen/Slugs (kaputte
   URLs = SEO-Schaden) ohne ausdrücklichen Auftrag.
3. **Nichts kaputt machen.** `npm run build` und `npx astro check` müssen grün bleiben.
   Bestehende URLs, hreflang-Paare, Canonicals und Redirects nicht brechen.
4. **Messbar/begründet.** Jede Änderung hat einen nachvollziehbaren Grund (Lighthouse-/
   SEO-/A11y-Prinzip). Keine kosmetischen Änderungen „weil es geht".
5. **Keine erfundenen Fakten.** Bei Inhaltsänderungen (z. B. Meta-Description-Texte)
   gelten dieselben Sachlichkeits-Regeln wie im Blog-Playbook: keine erfundenen Zahlen,
   ELWIS-konform, im Zweifel konservativ.
6. **Kein Em-Dash „—".** Das lange Strichzeichen ist im Seiten-Text verboten – stattdessen
   kurzer Bindestrich „–", Komma oder Punkt.
7. **Leerlauf ist erlaubt.** Die Routine läuft täglich. Findet sich an einem Tag im
   gesamten Turnus **keine** wirklich lohnende Maßnahme, macht der Agent **keine** Änderung
   und öffnet **keinen** PR – er vermerkt nur „nichts zu tun" im Audit-Log. Lieber ein Tag
   ohne Diff als ein erzwungener, sinnloser PR.

## Fokus-Rotation

Damit nicht jeder Lauf dasselbe prüft, rotieren die Fokusbereiche. Der Agent führt in
[`audit-log.md`](audit-log.md) Protokoll und nimmt pro Lauf den Bereich, der **am längsten
nicht** dran war (oder den, für den beim letzten Audit ein offener Befund notiert wurde).

| # | Fokusbereich | Was geprüft / verbessert wird |
|---|--------------|-------------------------------|
| 1 | **Technisches SEO** | `<title>`/`description`-Länge & Eindeutigkeit, Canonicals, `hasAlternate`/`altUrl` korrekt, `noindex` nur bei dünnen Seiten, Heading-Hierarchie (genau ein `<h1>`), `robots.txt`, Sitemap-Prioritäten in `astro.config.mjs`. |
| 2 | **Strukturierte Daten** | JSON-LD in `src/components/SEO.astro` und Layouts: valide Schemas (Organization, MobileApplication, BlogPosting/Article, BreadcrumbList, FAQPage auf `/faq/`), korrekte Felder, keine veralteten Preise/Links. |
| 3 | **Performance** | Bilder: Größen/Format (WebP/AVIF wo sinnvoll), `width`/`height` gegen Layout-Shift, `loading="lazy"` für below-the-fold, Astro `<Image>`-Nutzung. Keine unnötig großen Assets in `public/`. Font-/CSS-Hygiene. |
| 4 | **Accessibility** | `alt`-Texte an allen Bildern, Link-/Button-Beschriftungen, Fokus-Sichtbarkeit, Farbkontrast, `lang`-Attribute, sinnvolle `aria-*`, Tastaturbedienbarkeit von Header/Nav. |
| 5 | **Interne Verlinkung** | Verwaiste Seiten finden, sinnvolle kontextuelle Links zwischen Pillar-Seiten (`/sbf-binnen/`, `/sbf-see/`, `/sbf-kosten/`, `/sbf-pruefung-ablauf/`, `/faq/`) und passenden Blogposts ergänzen. Footer-/Header-Navigation auf Vollständigkeit prüfen. |
| 6 | **Tote Links & Konsistenz** | Interne Links auf existierende Routen prüfen (DE↔EN-Pendants, Slugs), externe Links erreichbar, `altSlug`/`altUrl` gegenseitig stimmig, einheitliche Trailing-Slashes. |
| 7 | **Content-Aktualität** | Offensichtlich veraltete Angaben auf den statischen Seiten (Preise vs. `PricingSection.astro`, Jahreszahlen, App-Features) gegen den aktuellen Stand abgleichen. Nur klar belegbare Korrekturen. |

> Reihenfolge ist Richtwert. Steht im Audit-Log ein **offener Befund**, hat dessen
> Behebung Vorrang vor dem turnusgemäßen nächsten Bereich.

## Ablauf pro Lauf

1. **Repo aktuell ziehen** (`git pull origin main`).
2. **Audit-Log lesen** ([`audit-log.md`](audit-log.md)): Welcher Fokusbereich ist diesmal
   dran? Gibt es offene Befunde aus früheren Läufen?
3. **Bestandsaufnahme im Fokusbereich.** Relevante Dateien sichten (`src/pages/`,
   `src/components/`, `src/layouts/`, `astro.config.mjs`, `public/`). Optional als
   Referenz die Pläne in `docs/superpowers/plans/` (SEO) heranziehen.
4. **Eine Maßnahme auswählen** – die mit dem besten Aufwand/Nutzen-Verhältnis im Fokus.
   Wenn der Bereich bereits sauber ist: das im Audit-Log vermerken und zum nächsten
   Fokusbereich der Rotation wechseln (max. einmal pro Lauf weiterspringen).
5. **Umsetzen** – minimal-invasiv, am bestehenden Code-Stil orientiert (Astro, Tailwind v4,
   TypeScript). Keine neuen Abhängigkeiten ohne zwingenden Grund.
6. **Bauen & prüfen:**
   - `npm install` (falls nötig)
   - `npm run build` muss fehlerfrei sein
   - `npx astro check` darf keine neuen Fehler zeigen
7. **Qualitätssicherung – PFLICHT-GATE vor jeder Veröffentlichung** (eigener Abschnitt
   unten). Erst weiter, wenn die QA **BESTANDEN** ist.
8. **Audit-Log aktualisieren:** Eintrag mit Datum, Fokusbereich, durchgeführter Maßnahme,
   Build-/QA-Status und ggf. offenen Restbefunden für den nächsten Lauf.
9. **Veröffentlichen** (nur nach bestandener QA):
   - Branch `optimize/<kurzbeschreibung>` anlegen, committen
     (`fix(seo|a11y|perf|links): <kurze Beschreibung>`) und pushen.
   - **Pull Request** öffnen (Titel = Commit-Titel, Beschreibung = was & warum, plus die
     QA-Checkliste). Optimierungen am Bestand werden **per PR** gemerged, nicht direkt auf
     `main` – so bleibt ein menschlicher Review-Schritt für Änderungen an Live-Seiten.
   - Mit aktiviertem Auto-Merge geht die Änderung nach grünen Checks live.

## Qualitätssicherung (PFLICHT-GATE vor jeder Veröffentlichung)

Jede Änderung wird **vor** dem PR von einem **separaten Review-Pass mit frischem Blick**
geprüft. Starte dafür einen eigenen **Prüf-/Subagenten** (eigener Kontext), der NUR prüft –
nicht selbst umbaut. Er bekommt den Diff (`git diff main`) und dieses Playbook und arbeitet
die Checkliste ab. Ergebnis: **BESTANDEN** oder **DURCHGEFALLEN** (mit konkreter Mängelliste).
Bei DURCHGEFALLEN behebt der Hauptagent die Mängel und lässt erneut prüfen, bis BESTANDEN.

**Review-Checkliste:**
- [ ] Genau **ein** Fokusbereich, Diff klein und reviewbar
- [ ] Keine URL/Route/Slug gebrochen; hreflang-Paare & Canonicals weiterhin stimmig
- [ ] Kein neues `noindex` auf ranking-relevanten Seiten; Sitemap-Logik intakt
- [ ] Strukturierte Daten valide (keine kaputten JSON-LD-Blöcke, keine veralteten Preise/Links)
- [ ] Bilder mit `alt`, sinnvollen `width`/`height` und passendem `loading`
- [ ] Interne Links zeigen auf existierende Seiten (DE & EN)
- [ ] Keine erfundenen Fakten/Zahlen in geänderten Texten; ELWIS-konform
- [ ] Kein Em-Dash „—" im Seiten-Text
- [ ] `npm run build` grün, `npx astro check` ohne neue Fehler
- [ ] Audit-Log aktualisiert (Datum, Fokus, Maßnahme, Status, offene Punkte)

## Was diese Routine NICHT tut

- Keine neuen Blogposts schreiben (das macht die Blog-Automatik).
- Keine großflächigen Redesigns, Framework-Wechsel oder Dependency-Upgrades.
- Keine Umbenennung/Löschung bestehender Routen oder Slugs ohne ausdrücklichen Auftrag.
- Keine direkten Pushes auf `main` – Änderungen am Bestand laufen über Pull Requests.

## Erfolg

Erfolg = eine kleine, begründete Verbesserung im gewählten Fokusbereich liegt als PR vor,
Build & `astro check` grün, QA BESTANDEN, Audit-Log fortgeschrieben. Abschlussmeldung:
Fokusbereich, durchgeführte Maßnahme, Build-/QA-Status, PR-Link, offene Restbefunde.
