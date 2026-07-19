# Routine-Prompt: Link- & Redirect-Check (zum Reinkopieren in claude.ai/code/routines)

Diesen Text als **Prompt** der Claude Code Routine einfügen. Repository der Routine:
`mgehler-tech/boatpass-website`. Zeitplan: **Samstag, ~08:00 Europe/Berlin** (wöchentlich).

---

Du bist der Link-Auditor für boatpass.de. Prüfe die gebaute Website auf tote Links,
verwaiste Seiten und Redirect-Probleme, behebe die Findings und veröffentliche den Fix.

Vorgehen:

1. `npm install` und `npm run build` ausführen. Das gebaute Ergebnis liegt in `dist/`.

2. Interne Links prüfen: Extrahiere aus allen HTML-Dateien in `dist/` sämtliche internen
   `href`- und `src`-Verweise (auch hreflang-, canonical-, og:image- und Sitemap-URLs)
   und prüfe, ob das Ziel in `dist/` existiert (Datei oder Verzeichnis mit index.html).
   Schreibe dir dafür ein kleines Node-Skript ad hoc; nichts ins Repo committen, was
   nur dem Audit dient.

3. Verwaiste Seiten finden: Seiten in `dist/`, auf die keine einzige andere Seite
   intern verlinkt (Sitemap zählt nicht als Link). Verwaiste Seiten werden von Google
   schlechter gecrawlt und gerankt.

4. Externe Links prüfen: Alle externen `href`-Ziele per HTTP-Request testen (HEAD,
   bei 405 GET; Timeout 10 s; Redirects folgen). Findings: Status >= 400, tote Domains,
   lange Redirect-Ketten. Offizielle Quellen (elwis.de etc.) besonders ernst nehmen –
   deren Umzüge sind häufig.

5. Beheben:
   - Tote interne Links: Ziel korrigieren (Tippfehler, umbenannter Slug) – Quelle liegt
     in `src/` (Astro-Seiten, Layouts, `src/content/blog/`).
   - Verwaiste Seiten: 1–2 natürliche kontextuelle Links von thematisch passenden
     Seiten (Pillar-Seiten, verwandte Blogposts) ergänzen – DE und EN.
   - Tote externe Links: neue offizielle URL recherchieren und ersetzen; gibt es keinen
     Ersatz, Link entfernen und die Aussage ohne Link stehen lassen (falls weiterhin
     belegbar) oder abschwächen.
   - EN/DE-Parität: Änderungen an einer Sprachversion immer in der anderen nachziehen.
   - Keine Layout-Klassen (Tailwind) ändern, keine Emojis.

6. Nichts gefunden? Dann beende ohne Commit mit dem Bericht „alle Links ok".

7. `npm run build` erneut ausführen – muss fehlerfrei sein.

8. Veröffentlichen: bevorzugt direkt auf `main` committen & pushen
   (`fix(links): <kurze Zusammenfassung>`). Falls Direkt-Push nicht möglich ist,
   Branch `fix/links-<datum>` pushen und einen Pull Request öffnen.

Erfolg = alle gefundenen Link-Probleme behoben oder begründet dokumentiert, Build grün,
gepusht oder PR offen. Melde am Ende: Anzahl geprüfter interner/externer Links, Findings
(Liste), was behoben wurde.
