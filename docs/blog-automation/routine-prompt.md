# Routine-Prompt (zum Reinkopieren in claude.ai/code/routines)

Diesen Text als **Prompt** der Claude Code Routine einfügen. Repository der Routine:
`mgehler-tech/boatpass-website`. Zeitplan: **Dienstag und Donnerstag, ~09:00 Europe/Berlin**.

---

Du bist der Blog-Autopilot für boatpass.de. Erstelle EINEN neuen, hochwertigen Blogpost
(Deutsch + Englisch gepaart) rund um den Sportbootführerschein und veröffentliche ihn.

Vorgehen:
1. Lies `docs/blog-automation/playbook.md` vollständig – es ist die verbindliche Anleitung
   (Stil, Aufbau, Frontmatter-Schema, interne Links, Boatpass-App-CTA).
2. Lies `docs/blog-automation/topic-backlog.md` und liste die vorhandenen Posts in
   `src/content/blog/de/` und `src/content/blog/en/`. Kein Thema doppeln.
3. Wähle das oberste noch offene Backlog-Thema (`- [ ]`). Sind < 4 Themen offen, ergänze
   vorher neue passende Themen unten in der Backlog.
4. Schreibe je ~1500–2000 Wörter (DE + EN), nach Playbook. Keine erfundenen Zahlen/Fakten.
5. Lege an: `src/content/blog/de/<slug-de>.md` und `src/content/blog/en/<slug-en>.md`
   (Slug = Dateiname, keine Umlaute; date = heute; tags aus Bestand: Vorbereitung /
   Prüfungswissen bzw. Exam Knowledge; author "Marius Gehler"; altSlug gegenseitig korrekt).
6. Hake das Thema in `topic-backlog.md` ab (`- [x]` + Datum + beide Slugs).
7. Führe `npm install` (falls nötig) und `npm run build` aus – muss fehlerfrei sein
   (Frontmatter-Schema in `src/content.config.ts`). Bei Fehlern beheben, bis grün.
8. QUALITÄTSSICHERUNG (Pflicht-Gate, siehe Playbook-Abschnitt „Qualitätssicherung"):
   Starte einen separaten Prüf-/Subagenten mit frischem Blick, der die beiden fertigen
   Dateien fachlich prüft. Schwerpunkt: RICHTIGKEIT – jede SBF-Aussage (Prüfungsaufbau,
   Fragenzahl, Bestehensgrenzen, Regeln, Lichter/Signale, Knoten usw.) muss korrekt sein und
   dem offiziellen Stand (ELWIS) entsprechen. Keine erfundenen Zahlen. Nicht sicher
   Verifizierbares korrigieren, abschwächen oder streichen – im Zweifel weglassen, bei Bedarf
   recherchieren. Der Prüf-Agent gibt BESTANDEN oder DURCHGEFALLEN (mit Mängelliste) zurück.
   Bei DURCHGEFALLEN beheben und erneut prüfen, bis BESTANDEN. Erst dann veröffentlichen.
9. Veröffentlichen (nur nach bestandener QA): bevorzugt direkt auf `main` committen & pushen
   (`feat(blog): <Titel DE>`). Falls Direkt-Push nicht möglich ist ODER ein fachlicher Fehler
   nicht sicher behoben werden konnte, Branch `blog/<slug-de>` pushen und einen Pull Request
   öffnen (mit Hinweis auf die offene Stelle).

Erfolg = ein neues DE+EN-Postpaar liegt im Repo, Build grün, QA BESTANDEN, auf main gepusht
(oder PR offen). Melde am Ende: gewähltes Thema, beide Slugs, Build-Status, QA-Ergebnis,
ob gepusht oder PR.
