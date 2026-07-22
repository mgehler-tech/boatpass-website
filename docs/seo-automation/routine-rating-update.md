# Routine-Prompt: Play-Store-Rating-Update (zum Reinkopieren in claude.ai/code/routines)

Diesen Text als **Prompt** der Claude Code Routine einfügen. Repository der Routine:
`mgehler-tech/boatpass-website`. Zeitplan: **Sonntag, ~09:00 Europe/Berlin** (wöchentlich).

---

Du prüfst, ob sich Boatpass' Play-Store-Bewertung (Sterne-Score und Anzahl der
Bewertungen) seit dem letzten Check verändert hat, und aktualisierst den manuell
gepflegten Wert im Repo entsprechend. Live-Scraping bei jedem Seiten-Build wurde
bewusst verworfen (siehe Hintergrund unten) – stattdessen wird der Wert hier
periodisch geprüft und bei Bedarf per Commit aktualisiert.

**Hintergrund:** Google liefert Play-Store-Seiten an Datacenter-/CI-IPs (z. B.
GitHub-Actions-Runner) das eingebettete `SoftwareApplication`-JSON-LD teils **ohne**
`aggregateRating`-Feld aus – vermutlich Bot-Erkennung, kein Consent-Wall, sonst
identischer Seiteninhalt. Ein Live-Fetch beim täglichen Rebuild war deshalb
unzuverlässig. Diese Routine läuft dagegen aus der claude.ai/code-Umgebung, die
zuverlässiger echte Nutzer-Antworten bekommt – trotzdem: Schritt 3 unten ist der
Zuverlässigkeits-Check, der eine falsche Aktualisierung verhindert.

Datenquelle im Repo: `src/data/apps.ts`, Eintrag `id: 'boatpass'`, Felder `rating`
(Zahl, z. B. `5.0`) und `ratingCount` (Zahl, z. B. `8`). Von dort liest
`getBoatpassRating()` in dieselbe Datei sowohl das Footer-Badge
(`src/components/Footer.astro`), die TrustBar auf der Startseite
(`src/components/TrustBar.astro`) als auch das `MobileApplication`-Schema
(`src/pages/index.astro`, `src/pages/en/index.astro`) und die
App-Vergleichstabelle (`src/components/AppComparisonTable.astro`).

Vorgehen:

1. Play-Store-Seite abrufen: `https://play.google.com/store/apps/details?id=com.boatpass.app&hl=de`
   (einfacher HTTP-GET, kein Login nötig).

2. Im HTML den `<script type="application/ld+json">`-Block mit `@type: "SoftwareApplication"`
   suchen und als JSON parsen. Darin liegt `aggregateRating.ratingValue` (Score) und
   `aggregateRating.ratingCount` (Anzahl).

3. Zuverlässigkeits-Check (Pflicht, siehe Hintergrund): Falls die Antwort keinen
   `aggregateRating`-Block enthält, kein JSON-LD gefunden wird, oder die Werte
   unplausibel wirken (z. B. `ratingCount` kleiner als der aktuell im Repo hinterlegte
   Wert, oder `ratingValue` außerhalb 1–5) – **nichts committen**. Stattdessen einmal
   erneut abrufen; scheitert das ebenfalls, ohne Änderung mit Begründung beenden.

4. Mit dem aktuellen Wert in `src/data/apps.ts` (Eintrag `boatpass`) vergleichen.
   - Werte identisch: ohne Änderung beenden, kurz melden „Rating unverändert: X,X / N".
   - Werte unterschiedlich: `rating` und `ratingCount` im `boatpass`-Eintrag aktualisieren.

5. `npm run build` ausführen – muss fehlerfrei sein, UND im Build-Output prüfen, dass
   `dist/index.html` den neuen Wert enthält (`grep -o '"aggregateRating":{[^}]*}' dist/index.html`
   sowie `grep -o 'footer-rating[^<]*' dist/index.html` – beide müssen den neuen Score/Count zeigen).

6. Veröffentlichen: direkt auf `main` committen & pushen
   (`chore(seo): Play-Store-Rating aktualisiert – <neuer Score> / <neue Anzahl>`).
   Der Push löst automatisch den Deploy-Workflow (`.github/workflows/daily-rebuild.yml`,
   Trigger `push` auf `main`) aus – kein manuelles Anstoßen nötig.

Erfolg = aktueller Play-Store-Wert ermittelt, mit Repo-Stand verglichen, bei
Abweichung `apps.ts` aktualisiert und Build/Deploy verifiziert (oder unverändert
mit Begründung gemeldet, falls Werte gleich blieben oder der Abruf unzuverlässig war).
Melde am Ende: alter Wert, neuer Wert (falls geändert), Build-Status.
