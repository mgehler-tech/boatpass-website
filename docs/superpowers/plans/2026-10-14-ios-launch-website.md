# iOS-Launch: Website-Erweiterung (Recht + Marketing)

Stand: 14.10.2026 · Die iOS-App ist seit 12.10.2026 live:
https://apps.apple.com/de/app/boatpass/id6797036145 (v1.0, iOS/iPadOS 16+, 4+, DE/EN,
Anbieter „Marius Gehler", 0 Bewertungen).

## Ausgangslage (Ist-Analyse)

Die Website behauptet an rund 40 Stellen, dass es BoatPass „nur für Android" gibt
oder die „iOS-App bald" kommt. Auf iOS-Geräten werden die Play-CTAs per Script durch ein Badge
„iOS-App kommt bald" ersetzt (CtaBanner, BlogInlineCta, AppLandingPage, HomeBoot/PlayCta).

Was die iOS-App tatsächlich tut (geprüft im Code von `BoatPassiOS`):

| Thema | iOS | Android-Text auf der Website |
|---|---|---|
| Analytics | Firebase Analytics **ohne IDFA**, **Opt-in** (Standard AUS, Schalter unter Mehr) | „berechtigtes Interesse", Werbe-ID (**falsch:** Android ist laut Code auch Opt-in) |
| Crashlytics | nur mit Einwilligung (gleicher Schalter) | berechtigtes Interesse (**falsch**, s. o.) |
| Remote Config | nicht genutzt | genutzt |
| Käufe | StoreKit / App Store (Apple), keine Familienfreigabe | Google Play Billing |
| Netzwerk | `cdn.boatpass.app/corrections.json` (Fragenkorrekturen) | nicht erwähnt |
| Tracking/ATT | kein Tracking, kein ATT-Dialog | – |
| Lizenz | Apple Standard-EULA (keine eigene EULA hinterlegt) | eigene Nutzungsbedingungen |

**Preise weichen ab** (App Store live vs. Website/Android):

| Produkt | App Store | Website (Android) |
|---|---|---|
| SBF Binnen | 9,99 € | 9,99 € |
| SBF See | 9,99 € | 9,99 € |
| UBI | **8,99 €** | 7,99 € |
| SRC | **8,99 €** | 7,99 € |
| LRC | **7,99 €** | 9,99 € |
| Kombi Binnen+See | **16,99 €** | 16,98 € |
| Funk-Paket (UBI+SRC+LRC) | 17,99 € | – (nicht auf Website) |

---

## Teil A: Rechtliches (Pflicht)

### A1 Datenschutzerklärung (DE `/datenschutz/` + EN `/en/privacy/`)
Die App-Store-Seite verlinkt direkt auf diese Seite, die iOS-App lädt sie als `?embedded=true`.
- Geltungsbereich: „Android-App" → „Apps für Android und iOS/iPadOS" (Meta-Description, Intro, Abschnittsüberschrift)
- Neuer Abschnitt **„iOS-App (iPhone & iPad)"**:
  - Lokale Speicherung (UserDefaults) wie Android
  - Firebase Analytics + Crashlytics **nur nach Einwilligung** (Art. 6 Abs. 1 lit. a DSGVO,
    § 25 Abs. 1 TDDDG), standardmäßig aus, Widerruf unter Mehr → „Analyse-Daten teilen", ohne Werbe-ID (IDFA), kein Tracking im Sinne von Apples ATT
  - **App Store / StoreKit**: Abwicklung durch Apple (Apple Distribution International Ltd., Cork, Irland), Link zur Apple-Datenschutzrichtlinie, wir erhalten keine Zahlungsdaten
  - **App-Store-Analysedaten**: Apple stellt aggregierte Statistiken bereit (Downloads, Abstürze), wenn Nutzer:innen dem Teilen mit Entwickler:innen zugestimmt haben
  - Lokale Benachrichtigungen (UserNotifications)
- Neuer Abschnitt **„Fragenkorrekturen (beide Apps)"**: Abruf einer JSON-Datei von `cdn.boatpass.app`, dabei werden IP und Zeitpunkt technisch verarbeitet (Art. 6 Abs. 1 lit. f). *Offen: Hoster des CDN, siehe Fragen.*
- Abschnitt „Datenweitergabe": Apple ergänzen
- Datum „Zuletzt aktualisiert: Oktober 2026"
- **Fehler im bestehenden Android-Teil korrigieren:** Laut Code (`AndroidManifest.xml` mit Erfassung AUS, `ConsentManager`) ist Android ebenfalls **Opt-in**. Die Website nennt dagegen „berechtigtes Interesse" (lit. f). Für Analytics und Crashlytics wird das auf Einwilligung (lit. a + § 25 TDDDG) umgestellt. Damit sind beide Apps einheitlich beschrieben, und der Text ist so ehrlicher und rechtlich sauberer.

### A2 Nutzungsbedingungen (DE `/nutzungsbedingungen/` + EN `/en/terms/`)
- Geltungsbereich: Android- **und iOS-App**
- Nutzungsvoraussetzungen: Android 8.0+ / Google-Konto **und** iOS/iPadOS 16+ / Apple-Account
- Käufe: je nach Plattform über Google Play **oder** den App Store, mit **Rückerstattung über Apple** (reportaproblem.apple.com)
- **Käufe gelten nur auf der jeweiligen Plattform**, keine Übertragung zwischen Android und iOS. Diese Information ist für Verbraucher wichtig und muss vor dem Kauf klar sein.
- Familienfreigabe wird nicht unterstützt
- Neuer Abschnitt **„Zusätzliche Bedingungen für die iOS-App"** mit den Mindestbedingungen nach Apple (Standard-EULA gilt ergänzend; Vertrag besteht mit uns, nicht mit Apple; Apple leistet keinen Support und keine Gewährleistung außer der Kaufpreiserstattung; Apple und Tochtergesellschaften sind Drittbegünstigte). Damit ist es egal, ob später eine eigene EULA in App Store Connect hinterlegt wird.
- Katalogliste: Preise **nicht** hart nennen, sondern „werden vor dem Kauf im jeweiligen Store angezeigt" (so ist es heute schon, bleibt so)

### A3 Impressum (DE `/impressum/` + EN `/en/legal/`)
- Klarstellen: Gilt auch für die Apps „BoatPass" im Google Play Store und im Apple App Store. Das Impressum muss aus den Store-Einträgen erreichbar sein, und die iOS-App lädt es eingebettet.
- Ergänzen: **„Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"**: Marius Gehler, Adresse. Der Ratgeber-Blog mit 70+ Artikeln ist ein journalistisch-redaktionelles Angebot.
- (USt-IdNr. nur falls vorhanden, siehe Fragen)

### A4 Preisangaben (PAngV / UWG: Irreführung)
Die Website nennt heute feste Preise. Auf dem iPhone kostet UBI/SRC aber 8,99 € statt 7,99 €, und LRC ist dort günstiger.
→ **Entscheidung nötig** (siehe Fragen): Preise in App Store Connect angleichen **oder** Website zeigt Preise je Plattform.

### A5 Apple-Markenrichtlinien
- Nur das **offizielle Badge „Laden im App Store"** (DE) bzw. „Download on the App Store" (EN), unverändert und mit Mindestgröße und Schutzraum
- „iPhone", „iPad", „App Store" korrekt geschrieben und nicht als Verb verwendet. Kein Apple-Logo außerhalb des Badges.

---

## Teil B: Marketing & Conversion

### B1 Plattform-gerechte CTAs (größter Hebel)
- Zentrale Konstante `APP_STORE_URL` + `PLAY_STORE_URL` in `src/data/stores.ts` statt 13× hart kodierter Play-URL
- Das „iOS-App kommt bald"-Badge wird zu einem echten **App-Store-Link** (CtaBanner, BlogInlineCta, AppLandingPage, Header, PlayCta/HomeBoot, HomeFinalCta)
- Desktop: **beide Badges** nebeneinander, iOS-Geräte: App Store zuerst, Android: Play
- Footer: Platzhalter „iOS-App (bald)" → echter App-Store-Link + App-Store-Badge neben dem Play-Badge
- i18n: `cta: 'Kostenlos im Play Store'` → plattformneutral „Kostenlos laden" + Store-Badges; `ctaIos` wird zu „Kostenlos im App Store"

### B2 Smart Redirect `/app/` (DE) + `/en/app/`
- Eine Seite, die nach Gerät zum richtigen Store weiterleitet (Fallback: beide Badges). Ziel für **QR-Codes**, Social-Bios, Flyer, Bootsschulen-Kooperationen und Videos (Fiete-Kampagne).
- HomeFinalCta-QR zeigt künftig auf `boatpass.de/app/` statt direkt auf Google Play

### B3 Safari Smart App Banner
- `<meta name="apple-itunes-app" content="app-id=6797036145">` im BaseLayout. Safari-Nutzer:innen auf dem iPhone sehen dann oben das native „Öffnen/Laden"-Banner.

### B4 SEO / strukturierte Daten
- `SEO.astro`: `operatingSystem: "Android, iOS"`, `downloadUrl`/`installUrl` für beide Stores, App-Store-URL in `sameAs`
- `apps.ts`: Boatpass `appStoreUrl` setzen, damit die Vergleichstabellen automatisch „Android · iOS" zeigen
- `llms.txt`: Verfügbarkeit iOS + App-Store-Link
- `AggregateRating` bleibt Play-only (wird so gekennzeichnet), solange iOS keine Bewertungen hat

### B5 Inhalte aktualisieren (DE + EN, Parität)
- **Vergleichsseiten** `sbf-app`, `sbf-binnen-app`, `sbf-see-app`, `sbf-app-kostenlos`, `funkschein-app` + 5 EN-Pendants: iOS-Absätze, FAQ („Gibt es … fürs iPhone?"), Contra „Bisher nur für Android" streichen. Hinweis auf die gleichnamige US-App „BoatPass" (Florida) behalten und schärfen: „Unsere App erkennst du am Anbieter Marius Gehler."
- **FAQ** `/faq/` + `/en/faq/`: iOS-Frage, neue Frage „Kann ich meinen Android-Kauf auf dem iPhone nutzen?" (Nein, Käufe gelten je Store)
- **Kontakt-FAQ** (+ JSON-LD): „Käufe wiederherstellen" für Apple-Account ergänzen, iPhone-Frage beantworten
- **Über uns**: „Android-Entwickler" → „App-Entwickler (Android & iOS)"
- **Hero-Bildunterschrift** „(Android)" anpassen, 404-Seite, `sbf-binnen`/`sbf-see`/`[city]`-CTAs „Kostenlos im Play Store"
- **Pricing**: „über Google Play" → „über Google Play oder den App Store", Preise je nach Entscheidung A4

### B6 Launch-Kommunikation
- **Blogartikel** DE + EN: „BoatPass jetzt für iPhone und iPad". Was drin ist, Preise, was nicht geht (kein Kauf-Transfer), Link `/app/`. Erscheint in Blogübersicht, Sitemap und RSS.
- Startseite: dezenter **„Neu: Jetzt auch für iPhone & iPad"**-Hinweis (NAVTEX-Leiste der neuen Startseite bietet sich an)

### B7 Messbarkeit
- Plausible-Outbound-Tracking (BaseLayout zählt bisher nur `play.google.com`) um `apps.apple.com` erweitern, damit Store-Klicks getrennt messbar sind
- App-Store-**Kampagnenlinks** (`?pt=…&ct=website-hero&mt=8`) für die Auswertung in App Store Connect. *Braucht dein Provider-Token, siehe Fragen.*

### B8 Tests
- `tests/e2e/ios-cta-deflection.spec.ts` umschreiben: iOS-UA muss jetzt einen App-Store-Link sehen statt „kommt bald"
- Conversion-Journey-Tests auf beide Stores erweitern, Build und Playwright laufen lassen

---

## Nicht im Umfang (Vorschläge für später)
- Echte iPhone-/iPad-Screenshots auf der Website (Material liegt in `~/Downloads/AppScreens-*`)
- App-Store-Bewertungen einsammeln (In-App-Prompt existiert bereits: `RateAppCard`), später in HomeReviews einbinden
- Presse-Kit-Seite, Newsletter an Interessenten aus dem Kontaktformular („sagt mir Bescheid, wenn iOS kommt")
- Apple Search Ads

## Umsetzungsreihenfolge
1. `stores.ts` + Badges (Fundament)
2. Rechtstexte A1–A3 (DE+EN)
3. CTAs, Footer, Header, Smart Banner, `/app/`
4. Inhalte, FAQ, Vergleichsseiten, SEO, llms.txt
5. Blogartikel DE+EN
6. Tests anpassen, Build, Playwright, Sichtprüfung im Browser (Desktop + iPhone-Viewport)
7. Commit + Push, PR
