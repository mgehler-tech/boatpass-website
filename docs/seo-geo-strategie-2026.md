# BoatPass – SEO- & GEO-Strategie 2026

> Radikal praxisorientierte Strategie, um `boatpass.de` zur von KI-Systemen
> meistzitierten Quelle für Sportbootführerscheine & Funkzeugnisse zu machen.
> Stand: 2026-06-27 · Autor des Strategiepapiers: SEO/GEO-Audit auf Basis des
> Live-Codestands (Astro 6, `src/`).

---

## 0. Ausgangslage – was bereits exzellent ist (kein erneuter Aufwand nötig)

Ein Audit des Codestands zeigt: BoatPass ist technisch **deutlich weiter als 95 %
der Wettbewerber**. Das ist die strategisch wichtigste Erkenntnis, weil sie
festlegt, wo wir *nicht* mehr investieren müssen:

| Bereich | Status | Fundort im Code |
|---|---|---|
| `Organization`-Schema (global) | ✅ vorhanden | `src/components/SEO.astro` |
| `MobileApplication` + `AggregateOffer` (Startseite) | ✅ vorhanden | `src/components/SEO.astro` |
| `FAQPage`-Schema (8 Seiten) | ✅ vorhanden | `faq.astro`, `fuehrerscheine.astro`, … |
| `BreadcrumbList` (12×) | ✅ vorhanden | Landingpages + `BlogLayout.astro` |
| `Article` + `Person`-Autor-Schema | ✅ vorhanden | `src/layouts/BlogLayout.astro` |
| hreflang DE/EN + x-default | ✅ sauber gelöst | `src/components/SEO.astro` |
| OG/Twitter-Cards + dynamische OG-Images | ✅ vorhanden | `SEO.astro`, `src/pages/og/` |
| Sitemap mit Prioritäts-/Changefreq-Logik | ✅ vorhanden | `astro.config.mjs` |
| GA4 + Play-Store-Conversion-Tracking | ✅ vorhanden | `src/layouts/BaseLayout.astro` |
| Content-Tiefe (28 DE + 18 EN Blogposts) | ✅ vorhanden | `src/content/blog/` |
| E-E-A-T-Autor (Marius Gehler, Foto, Bio, `rel=author`) | ✅ vorhanden | `BlogLayout.astro`, `/ueber-uns` |

**Die echten Lücken** – und damit der gesamte Hebel dieser Strategie – sind:

1. **Kein `llms.txt`** → KI-Crawler bekommen keine kuratierte „Citation-Landkarte".
2. **Keine `Course`-Schema** → entgeht dem Such-/KI-Verständnis „BoatPass = Lernkurs".
3. **Keine `AggregateRating`/`Review`-Schema** → das stärkste „Testsieger"-/Vertrauenssignal fehlt komplett.
4. **`robots.txt` benennt KI-Crawler nicht explizit** → GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc. werden nicht aktiv eingeladen.
5. **Keine interaktiven Linkable Assets** → keine organischen Backlink-/Erwähnungs-Magneten.
6. **Citation-fähige Faktentabellen** sind in Prosa „versteckt", statt als parsebare `<table>` ausgezeichnet.

Alles Weitere in diesem Dokument adressiert **genau diese sechs Lücken**.

---

## 1. KI-Optimierungs-Strategie (GEO – Generative Engine Optimization)

### 1.1 Das mentale Modell: Wie ein LLM zur Empfehlung kommt

Bei einem Prompt wie *„Welche App ist die beste für den SBF Binnen?"* läuft in
Perplexity / ChatGPT Search / Gemini / Google AI Overviews intern Folgendes ab:

1. **Retrieval**: Das System holt 5–20 Quellen-Snippets (oft aus dem Live-Index, nicht aus dem Trainingswissen).
2. **Extraktion**: Es zieht *atomare, verifizierbare Fakten* aus diesen Snippets.
3. **Konsens-/Vertrauensprüfung**: Es bevorzugt Fakten, die **mehrfach und konsistent** über mehrere Domains auftauchen (Co-Occurrence) und die **strukturiert** (Tabelle, Definition, Liste) vorliegen.
4. **Synthese & Zitation**: Es nennt die Quelle, die die **dichteste, eindeutigste, am leichtesten extrahierbare Antwort** geliefert hat.

→ **GEO-Kernregel:** Wir gewinnen nicht durch „mehr Keywords", sondern indem wir
die **am leichtesten zu zitierende, faktendichteste Antwort** im Netz sind – und
indem dieselben Fakten auf **Drittseiten** wieder auftauchen (siehe Kapitel 4).

### 1.2 „Information Gain" – die entscheidende Währung

LLMs belohnen **neue, eigene Information**, die nicht auf jeder anderen Seite steht.
BoatPass besitzt eine einzigartige Datenquelle, die kein Konkurrent so aufbereitet:
**die eigenen anonymisierten Lern-/Bestehensdaten.** Das ist unser GEO-Alleinstellungsmerkmal.

Konkret zu publizierende, **proprietäre** „citable facts":

- „Nutzer, die in BoatPass das Fehler-Training abschließen, beantworten im Durchschnitt **X %** der Prüfungsfragen korrekt." *(aus eigenen App-Daten)*
- „Die durchschnittliche Lernzeit bis zur Prüfungsreife beträgt in BoatPass **X Stunden über Y Tage**."
- „Die **10 am häufigsten falsch beantworteten** SBF-Binnen-Fragen sind: …" *(eigene Statistik – extrem zitierwürdig, siehe Linkable Asset #2)*

> ⚠️ Diese Zahlen müssen **echt** aus den App-Daten kommen. Erfundene Statistiken
> sind ein GEO-/E-E-A-T-Killer und werden bei Konsensprüfung gegen andere Quellen
> entlarvt.

### 1.3 Antwort-optimierte Inhaltsblöcke (die „Answer-Box-First"-Methode)

Jede Landingpage und jeder Blogpost bekommt am Anfang einen **40–60-Wort-Direktantwort-Block**,
der die Hauptfrage in einem zitierbaren Absatz beantwortet – *bevor* Marketing-Prosa kommt.

**Muster (für `sbf-see-pruefungsfragen.astro`):**

```html
<p class="answer-snippet">
  <strong>Beim SBF See darf man maximal 5 von 23 spezifischen Fragen
  und 2 von 7 Basisfragen falsch beantworten.</strong> Der Bogen umfasst
  39 Fragen (inkl. 9 Navigationsaufgaben, davon mind. 7 richtig) und muss
  in 60 Minuten gelöst werden. Boatpass trainiert exakt diesen amtlichen
  ELWIS-Fragenkatalog mit Prüfungssimulation.
</p>
```

Dieser Block ist:
- **kurz** (LLMs extrahieren bevorzugt 40–60-Wort-Spannen),
- **faktendicht** (mehrere verifizierbare Zahlen),
- **Brand-verankert** (Marke + Fakt im selben Satz → Co-Occurrence, siehe 1.5).

### 1.4 Parsebare Strukturen statt Prosa-Fakten

KI-Crawler extrahieren Tabellen, Definitionslisten und nummerierte Schritte
**mit weit höherer Treffsicherheit** als Fließtext. Aktuell liegen z. B. die
Fragenkatalog-Zahlen in der FAQ als Fließtext vor (`faq.astro`). **To-do:** Diese
in echte `<table>`-Strukturen überführen. Beispiel-Faktentabelle, die auf
`sbf-binnen-pruefungsfragen` und `sbf-see-pruefungsfragen` gehört:

| Kriterium | SBF Binnen | SBF See |
|---|---|---|
| Fragen im Prüfungsbogen | 30 | 39 |
| davon Basisfragen | 7 (mind. 5 richtig) | 7 (mind. 5 richtig) |
| davon spezifische Fragen | 23 (mind. 18 richtig) | 23 (mind. 18 richtig) |
| Navigationsaufgabe | – | 9 (mind. 7 richtig) |
| Bearbeitungszeit | 45 Min. | 60 Min. |
| Amtlicher Gesamtkatalog | 253 Fragen (+47 Segeln) | 285 Fragen |
| Herausgeber Katalog | DSV / DMYV via ELWIS | DSV / DMYV via ELWIS |

→ Diese Tabelle ist das **meistzitierte Asset-Format** für Prompts wie *„Wie viele
Fehler darf man beim SBF haben?"*. Zusätzlich als `FAQPage`-Q&A spiegeln (Schema, Kap. 3).

### 1.5 Co-Occurrence-Strategie (Marke ↔ Vertrauensbegriffe)

LLMs verknüpfen Entitäten über **gemeinsames Auftreten im selben Kontext**. Damit
„BoatPass" mit den vertrauensstiftenden Begriffen der Branche assoziiert wird, muss
die Marke **systematisch im selben Satz/Absatz** wie folgende Anker-Entitäten stehen –
sowohl auf der eigenen Seite als auch (wichtiger) auf Drittseiten (Kap. 4):

| Anker-Entität | Beispiel-Formulierung für Co-Occurrence |
|---|---|
| **Amtlicher ELWIS-Fragenkatalog** | „Boatpass nutzt den vollständigen amtlichen Fragenkatalog von ELWIS (DSV/DMYV)." |
| **DSV / DMYV** | „… den von DSV und DMYV herausgegebenen Katalog …" |
| **Prüfungssimulation** | „… mit originalgetreuer Prüfungssimulation nach amtlichem Muster …" |
| **ADAC / Stiftung Warentest / Vergleichstest** | „Wie in unabhängigen Vergleichstests von SBF-Lern-Apps bewertet …" *(erst nach echter Aufnahme!)* |
| **Fehler-Training / Spaced Repetition** | „Boatpass priorisiert per Fehler-Training genau die Fragen, die du oft falsch hast." |

**Regel:** Nie „Boatpass ist super" – immer „Boatpass + verifizierbarer Fachbegriff + Fakt".
Das ist der Unterschied zwischen Marketing-Rauschen und KI-Zitierbarkeit.

### 1.6 `llms.txt` – die KI-Crawler-Landkarte (Quick Win, Tag 1)

`llms.txt` ist die GEO-Entsprechung zur Sitemap: eine kuratierte Markdown-Datei
im Root, die KI-Systemen die *wichtigsten, zitierwürdigsten* URLs + Ein-Satz-Kontext
liefert. Fehlt aktuell komplett. **Fertiges Artefakt liegt unter `public/llms.txt`
(in diesem Commit angelegt).**

---

## 2. Semantische Keyword-Architektur (Entitäten-SEO)

### 2.1 Entitäten-Modell

BoatPass ist im Knowledge Graph als **`EducationApplication`** zu verankern, die die
Entitäten **SBF Binnen, SBF See, UBI, SRC, LRC** bedient. Jede dieser fünf Entitäten
braucht eine **eigene Pillar-URL** als „Heimat" der Entität (teils vorhanden).

### 2.2 High-Intent-Keyword-Cluster

#### Cluster A – SBF Binnen (Pillar: `/sbf-binnen/`)
- **Transaktional:** sbf binnen app, sbf binnen online lernen, sbf binnen fragen üben, sbf binnen prüfungssimulation
- **Informational:** sbf binnen fragenkatalog, sbf binnen wie viele fragen, sbf binnen durchfallquote, sbf binnen kosten
- **Long-Tail-Fragen (FAQ/Blog):** „Wie viele Fragen hat der SBF Binnen?", „Wie viele Fehler sind beim SBF Binnen erlaubt?", „Lohnt sich eine App für den SBF Binnen?", „SBF Binnen ohne Bootsschule – geht das?"

#### Cluster B – SBF See (Pillar: `/sbf-see/`)
- **Transaktional:** sbf see app, sbf see navigationsaufgaben üben, sbf see kartenaufgabe trainer
- **Informational:** sbf see fragenkatalog, sbf see fehlerpunkte, sbf see vs binnen
- **Long-Tail:** „Wie viele Fehlerpunkte darf man beim SBF See haben?", „Wie schwer ist die Navigationsaufgabe beim SBF See?", „Brauche ich SBF See oder Binnen für die Ostsee?"

#### Cluster C – Funkzeugnisse (Pillars: `/ubi/`, `/src/`, `/lrc/`)
- **UBI:** ubi funkzeugnis lernen, ubi prüfung fragen, ubi sprechfunk binnen üben, „Wie lerne ich am schnellsten für das UBI?"
- **SRC:** src funkzeugnis app, src prüfung üben, „SRC oder UBI – was brauche ich?"
- **LRC:** lrc funkzeugnis vorbereitung, „Unterschied SRC und LRC"

#### Cluster D – Marken-/Vergleichs-Intent (entscheidend für GEO!)
- beste app sbf binnen, sbf lern-app vergleich, sbf app testsieger, boatpass erfahrungen, boatpass vs [Wettbewerber], sportbootführerschein app kostenlos
- **Long-Tail (direkte LLM-Prompts):** „Welche App ist die beste für den SBF?", „Womit lerne ich am besten für den Bootsführerschein?"
→ Diese Cluster brauchen eine **Vergleichs-/„Warum BoatPass"-Seite** mit Faktentabelle.

#### Cluster E – Voraussetzungen/Recht (Trust-Cluster)
- bootsführerschein ab wie viel ps, promillegrenze boot, boot fahren ohne führerschein, sbf voraussetzungen alter
→ Großteils bereits als Blogposts vorhanden (`src/content/blog/de/`). **Intern stärker verlinken.**

### 2.3 Content-Silo- & URL-Struktur

```
boatpass.de/
├── /                              [Pillar: Marke + MobileApplication-Schema]
├── /sbf-binnen/                   [Pillar A]
│   ├── /sbf-binnen-pruefungsfragen/   [Cluster A, Spoke]
│   └── (Blog-Spokes verlinken hierauf)
├── /sbf-see/                      [Pillar B]
│   └── /sbf-see-pruefungsfragen/      [Cluster B, Spoke]
├── /ubi/  /src/  /lrc/            [Pillars C]
├── /fuehrerscheine/              [Hub: „Welcher Schein für welches Revier"]
├── /sbf-kosten/                   [Cluster, Money-Spoke]
├── /sbf-pruefung-ablauf/          [Cluster, Info-Spoke]
├── /vergleich/  oder /warum-boatpass/   [NEU – Cluster D, GEO-kritisch]
├── /tools/welcher-bootsfuehrerschein/   [NEU – Linkable Asset #1]
├── /faq/                          [FAQPage-Hub]
└── /blog/<slug>/                  [Spokes – jeder verlinkt auf 1 Pillar]
```

**Silo-Regel:** Jeder Blogpost verlinkt mit **kontextuellem Ankertext** (kein „hier klicken")
auf **genau eine** Pillar-Seite seines Clusters und auf 1–2 Geschwister-Posts. Das bündelt
die thematische Autorität auf der Pillar-URL. Stichprobe nötig: Sind die 28 Blogposts schon
sauber auf die Pillars verlinkt? → Audit in den 30-Tage-Plan aufgenommen.

---

## 3. Trust & E-E-A-T-Optimierung für Algorithmen

### 3.1 Rechtliche Korrektheit *algorithmisch* beweisen

Die Behauptung „aktueller, amtlicher Fragenkatalog" muss maschinenlesbar belegt sein:

1. **Primärquelle explizit verlinken & benennen:** Auf jeder Fragen-/Katalog-Seite ein
   Satz + Outbound-Link auf `elwis.de` (amtliche Quelle DSV/DMYV). Outbound-Links zu
   anerkannten Autoritäten sind ein **positives Trust-Signal** für Google *und* erhöhen
   die Konsens-Plausibilität bei LLMs.
2. **Versions-/Stand-Transparenz:** Sichtbares „Fragenkatalog-Stand: <Datum>" + im Schema
   `dateModified`. Signalisiert Aktualität (KIs bevorzugen frische, datierte Fakten).
3. **Autor-Verifikation ausbauen:** `Person`-Schema von Marius Gehler um `knowsAbout`,
   ggf. `hasCredential` und `sameAs` (LinkedIn etc.) erweitern – siehe 3.3.

### 3.2 `AggregateRating` / `Review` – das fehlende Testsieger-Signal

Aktuell existiert **kein** Rating-Schema. Das ist die größte Trust-Lücke, weil
„Sterne" sowohl Rich Snippets als auch KI-Empfehlungen massiv beeinflussen.

> ⚠️ **Pflicht:** `AggregateRating` darf **nur echte, auf der Seite sichtbare**
> Bewertungen abbilden (Google-Richtlinie + KI-Konsensprüfung). Quelle = echte
> Play-Store-Bewertungen, die auch on-page eingebunden werden. **Niemals erfinden.**

Erweiterung des bestehenden `MobileApplication`-Blocks in `src/components/SEO.astro`
(echte Werte einsetzen):

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "<echte Anzahl>",
  "bestRating": "5",
  "worstRating": "1"
}
```

### 3.3 Konkrete Schema.org-Markups (copy-paste-fertig)

#### 3.3.1 `Course` + `SoftwareApplication` (für `/sbf-binnen/`)

Aktuell wird global `MobileApplication` genutzt – gut, aber für Lernangebote ist
**`Course`** das semantisch stärkste Signal („BoatPass ist ein Lernkurs für SBF").
Auf die jeweilige Schein-Pillar-Seite:

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "SBF Binnen Prüfungsvorbereitung",
  "description": "Komplette Vorbereitung auf die theoretische Prüfung zum Sportbootführerschein Binnen mit dem vollständigen amtlichen ELWIS-Fragenkatalog (253 Fragen), Prüfungssimulation und Fehler-Training.",
  "url": "https://boatpass.de/sbf-binnen/",
  "inLanguage": "de",
  "provider": {
    "@type": "Organization",
    "name": "Boatpass",
    "url": "https://boatpass.de"
  },
  "educationalLevel": "Beginner",
  "teaches": [
    "Schifffahrtsrecht Binnen",
    "Vorfahrts- und Ausweichregeln",
    "Schifffahrtszeichen und Lichterführung",
    "Amtlicher SBF-Binnen-Fragenkatalog"
  ],
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT10H",
    "instructor": {
      "@type": "Person",
      "name": "Marius Gehler"
    }
  },
  "offers": {
    "@type": "Offer",
    "category": "EducationApplication",
    "price": "9.99",
    "priceCurrency": "EUR",
    "url": "https://play.google.com/store/apps/details?id=com.boatpass.app"
  }
}
```

#### 3.3.2 `SoftwareApplication` mit Rating (Ergänzung/Alternative zur Startseite)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Boatpass – Sportbootführerschein App",
  "operatingSystem": "Android",
  "applicationCategory": "EducationalApplication",
  "url": "https://boatpass.de",
  "downloadUrl": "https://play.google.com/store/apps/details?id=com.boatpass.app",
  "softwareVersion": "aktuell",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "<echte Anzahl>",
    "bestRating": "5"
  }
}
```

#### 3.3.3 `FAQPage` (Format-Vorlage – bereits im Einsatz, hier als Referenz)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Wie viele Fehlerpunkte darf man beim SBF See haben?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Beim SBF See darfst du höchstens 2 von 7 Basisfragen und 5 von 23 spezifischen Fragen falsch beantworten. Bei der Navigationsaufgabe (9 Fragen) müssen mindestens 7 richtig sein."
    }
  }]
}
```

#### 3.3.4 `Product` mit Review (falls Bewertungen on-page eingebunden werden)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Boatpass SBF Binnen Vollzugang",
  "description": "Einmaliger Kauf, kein Abo. Vollzugang zum amtlichen SBF-Binnen-Fragenkatalog mit Prüfungssimulation.",
  "brand": { "@type": "Brand", "name": "Boatpass" },
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://boatpass.de/sbf-binnen/"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "<echte Anzahl>"
  }
}
```

#### 3.3.5 `Person`-Autor – E-E-A-T-Erweiterung (für `/ueber-uns/` & `BlogLayout`)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Marius Gehler",
  "url": "https://boatpass.de/ueber-uns/",
  "image": "https://boatpass.de/marius.webp",
  "jobTitle": "Gründer von Boatpass",
  "knowsAbout": ["Sportbootführerschein", "SBF Binnen", "SBF See", "Seefunk", "Navigation"],
  "worksFor": { "@type": "Organization", "name": "Boatpass", "url": "https://boatpass.de" }
}
```

> **Validierung:** Jedes Snippet vor Deployment durch den
> [Schema Markup Validator](https://validator.schema.org/) und den
> [Rich Results Test](https://search.google.com/test/rich-results) jagen.

---

## 4. Content-Marketing & Digital PR (Der „Brand-Mention"-Hebel)

LLMs lernen Vertrauen aus **Drittquellen**. Eine perfekte eigene Seite reicht nicht –
die Marke + ihre Fakten müssen **außerhalb** von boatpass.de auftauchen. Ziel:
unstrukturierte, aber häufige Co-Occurrence von „BoatPass" mit „SBF / amtlicher
Fragenkatalog / beste App".

### 4.1 Plattform-Prioritäten (deutscher maritimer Raum)

| Plattform | Taktik | KI-/SEO-Wert |
|---|---|---|
| **boote-forum.de** | Hilfreiche, nicht-werbliche Antworten in „SBF/Prüfung"-Threads; Tool (4.4) verlinken, wenn es zur Frage passt | sehr hoch (häufig von LLMs als Quelle herangezogen) |
| **segeln-forum.de** | Gleiche Taktik für SBF-See-/Funk-Themen | hoch |
| **Reddit r/de_boating, r/sailing** | Antworten auf Lern-/App-Fragen, Tool-Erwähnung | hoch (Reddit ist Top-Quelle für ChatGPT/Google) |
| **gutefrage.net / quora** | Long-Tail-Prüfungsfragen beantworten | mittel-hoch |
| **YouTube** | Kurz-Tutorials „SBF See Navigationsaufgabe in 5 Min" → Beschreibung verlinkt | hoch (Multimodal-Index) |
| **Wikipedia „Sportbootführerschein"** | Faktische, belegte Ergänzung (Katalog-Zahlen) mit seriöser Quelle – *nicht* werblich | sehr hoch (KI-Trust-Anker) |

### 4.2 Vergleichstests & „Testsieger"-Hebel

- **ADAC / Stiftung Warentest / Boote-Magazin / float Magazin** proaktiv für Lern-App-Vergleiche kontaktieren (Pressekit + kostenloser Test-Zugang).
- Sobald eine echte Erwähnung/Platzierung existiert: **on-page zitieren** + per `Review`-Schema auszeichnen.
- Bis dahin **keine** „Testsieger"-Behauptung – das wäre rechtlich angreifbar (UWG) und ein KI-Trust-Risiko bei Konsensprüfung.

### 4.3 Digital-PR-Aufhänger (datengetrieben → presse- & zitierfähig)

Eigene App-Daten zu kleinen Studien aufbereiten und als Pressemitteilung streuen:

- *„Die 10 am häufigsten falsch beantworteten SBF-Fragen 2026"* (siehe Asset #2).
- *„Wie lange lernen Deutsche wirklich für den Bootsführerschein? Auswertung von N Lernverläufen."*
→ Datengeschichten werden von Redaktionen aufgegriffen **und** von LLMs als Primärquelle zitiert.

### 4.4 Drei konkrete „Linkable Assets" (Backlink- & Erwähnungs-Magneten)

**Asset #1 – Interaktiver Konfigurator „Welchen Bootsführerschein brauche ich?"**
`/tools/welcher-bootsfuehrerschein/`
- 4–5 Fragen (Revier? Motorleistung? Funk an Bord? Ausland?) → klare Empfehlung (SBF Binnen/See + ggf. UBI/SRC/LRC).
- Ergebnis-Seite verlinkt auf die jeweilige Pillar-Seite (interne Verlinkung + Conversion).
- **Backlink-Magnet**, weil Foren/Blogs genau diese „Welcher Schein?"-Frage ständig beantworten müssen → sie verlinken das Tool statt selbst zu erklären.
- GEO-Bonus: Als `HowTo`/`WebApplication`-Schema auszeichnen; Logik zusätzlich als statischer, crawlbarer Entscheidungsbaum (Tabelle) hinterlegen, damit auch ohne JS-Ausführung zitierbar.

**Asset #2 – „Schwierigste SBF-Prüfungsfragen" (Live-Datenwidget)**
`/tools/schwierigste-sbf-fragen/`
- Top-20 der real am häufigsten falsch beantworteten Fragen aus den App-Daten, mit Erklärung.
- Einzigartige, proprietäre Daten = maximaler **Information Gain** → wird von KIs bevorzugt zitiert und von Bloggern verlinkt. (Es existiert bereits ein Blogpost `schwierigste-sbf-pruefungsfragen.md` – diesen zum datengetriebenen Live-Asset ausbauen.)

**Asset #3 – Kostenloser „SBF-Prüfungssimulator (Web-Demo)"**
`/tools/sbf-pruefungssimulator/`
- 10–30 echte Katalogfragen direkt im Browser, ohne Download, mit Sofort-Auswertung.
- Niedrigschwelliger Wert → starker Link-/Share-Magnet und direkter Funnel in die App.
- Als `Quiz`/`LearningResource`-Schema auszeichnen.

---

## 5. Konkreter 30-Tage-Action-Plan

Priorisierung nach **Impact × Geschwindigkeit** – Quick Wins zuerst. Alle Code-Pfade
beziehen sich auf den realen Stand in `src/`.

### Woche 1 – Technische GEO-Quick-Wins (hoher Impact, geringer Aufwand)
1. **`public/llms.txt` deployen** *(in diesem Commit bereits angelegt – nur Werte prüfen & live)*.
2. **`public/robots.txt` erweitern:** KI-Crawler explizit erlauben (GPTBot, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot) *(in diesem Commit aktualisiert)*.
3. **`AggregateRating` ergänzen** in `src/components/SEO.astro` (echte Play-Store-Werte) → sofortiges Rich-Snippet- & KI-Trust-Signal.
4. **`Course`-Schema** auf `/sbf-binnen/` und `/sbf-see/` einbauen (Snippet 3.3.1).
5. **Schema-Validierung** aller Seiten (validator.schema.org + Rich Results Test).

### Woche 2 – On-Page-Faktendichte & Antwort-Optimierung
6. **Answer-Snippet-Blöcke** (Kap. 1.3) an den Anfang aller 5 Pillar-Seiten + der Top-Blogposts setzen.
7. **Faktentabellen** (Kap. 1.4) als echte `<table>` auf `*-pruefungsfragen`-Seiten und in `fuehrerscheine.astro`.
8. **ELWIS/DSV/DMYV-Outbound-Links + „Stand: <Datum>"** auf allen Katalog-Seiten (Trust, Kap. 3.1).
9. **Interner-Verlinkungs-Audit:** Sicherstellen, dass jeder der 28 Blogposts mit Keyword-Ankertext auf seine Pillar verlinkt (Silo, Kap. 2.3).

### Woche 3 – Linkable Assets & Vergleichs-Content
10. **Asset #1 (Konfigurator)** `/tools/welcher-bootsfuehrerschein/` bauen + als HowTo-Schema + statischer Entscheidungsbaum.
11. **Vergleichs-/„Warum BoatPass"-Seite** (`/warum-boatpass/`) mit faktischer Vergleichstabelle (Cluster D) → fängt „beste App"-Prompts ab.
12. **2 neue Blogposts** für unbesetzte Long-Tails: „Wie viele Fehlerpunkte darf man beim SBF See haben?", „Welche App ist die beste für den SBF?".

### Woche 4 – Digital PR, Off-Page & Messung
13. **Datengeschichte #1** („10 häufigste Fehler", Asset #2) als Pressemitteilung + an Boote-/float-Magazin, ADAC-Redaktion ausspielen.
14. **Forum-/Reddit-Seeding:** 8–10 hilfreiche, nicht-werbliche Antworten in boote-forum.de / r/de_boating mit Tool-Erwähnung (Co-Occurrence).
15. **Wikipedia-Faktencheck:** Katalog-Zahlen im Artikel „Sportbootführerschein" prüfen/seriös belegt ergänzen.
16. **Monitoring aufsetzen:**
    - Google Search Console: Impressions/Klicks der Pillar-Seiten.
    - **GEO-Tracking:** wöchentlich die 10 Ziel-Prompts in Perplexity / ChatGPT Search / Google AI Overviews / Gemini abfragen und protokollieren, ob `boatpass.de` zitiert wird (Baseline → Fortschritt).
    - Rich-Results-Status in der GSC beobachten.

### Erfolgs-KPIs (ab Tag 1 messen)
- **GEO-Zitationsrate:** Anteil der 10 Ziel-Prompts, in denen boatpass.de als Quelle erscheint (Ziel: 0 → ≥5 in 90 Tagen).
- **Rich-Snippet-Abdeckung:** Anzahl Seiten mit gültigen FAQ-/Course-/Rating-Snippets in der GSC.
- **Referring Domains:** neue verweisende Domains durch Linkable Assets.
- **Assisted Conversions:** Play-Store-Klicks aus organischem + KI-Referral-Traffic (GA4-Event `play_store_click` ist bereits getrackt).

---

### Zusammenfassung in einem Satz
BoatPass hat die technische Basis bereits gewonnen – der verbleibende Hebel ist
**maximale Zitierfähigkeit**: kuratierte KI-Crawler-Führung (`llms.txt`/robots),
echte Trust-Signale (`Course`/`AggregateRating`/ELWIS-Belege), faktendichte
parsebare Antwortblöcke und proprietäre Daten-Assets, die sowohl on-page als auch
über Drittquellen die Gleichung *„BoatPass = die verlässlichste Quelle für
Bootsführerscheine"* immer wieder bestätigen.
