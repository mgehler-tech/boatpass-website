# GSC Feedback Loop – Einrichtung

Der Workflow `.github/workflows/gsc-feedback.yml` läuft jeden Montag 05:30 UTC,
holt Search-Console-Daten der letzten 28 Tage (plus Vorperiode), schreibt
priorisierte Findings nach `docs/seo-automation/gsc-findings.md` und reicht eine
On-Page-Verbesserung als PR ein. SEO-Autopilot (Mo/Do) liest die Findings als
Prioritätenliste.

## Einmalige Einrichtung (Service Account)

1. **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com)):
   Projekt anlegen oder bestehendes wählen.
2. **API aktivieren:** "Google Search Console API" unter *APIs & Dienste → Bibliothek*.
3. **Service Account anlegen:** *IAM & Verwaltung → Dienstkonten → Erstellen*,
   z. B. `gsc-feedback@<projekt>.iam.gserviceaccount.com`. Keine Projektrollen nötig.
4. **JSON-Key erzeugen:** Beim Dienstkonto *Schlüssel → Schlüssel hinzufügen → JSON*.
   Datei herunterladen.
5. **In der Search Console freigeben:** [search.google.com/search-console](https://search.google.com/search-console)
   → Property `boatpass.de` → *Einstellungen → Nutzer und Berechtigungen → Nutzer hinzufügen*
   → E-Mail des Dienstkontos, Berechtigung **Uneingeschränkt** (oder mindestens *Vollständig*).
6. **GitHub Secret setzen:** Repo → *Settings → Secrets and variables → Actions* →
   `GSC_SERVICE_ACCOUNT_JSON` = kompletter Inhalt der JSON-Key-Datei.

Danach den Workflow einmal manuell testen: *Actions → GSC Feedback Loop → Run workflow*.

## Konfiguration

- Property: `GSC_SITE_URL` im Workflow, aktuell `sc-domain:boatpass.de`
  (Domain-Property; für eine URL-Prefix-Property stattdessen `https://boatpass.de/`).
- Datenfenster: 28 Tage, endet 3 Tage vor heute (GSC-Datenverzögerung),
  definiert in `scripts/fetch-gsc-data.mjs`.
