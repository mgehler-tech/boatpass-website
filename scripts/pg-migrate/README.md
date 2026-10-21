# pg-migrate: Inhaltsseiten auf den Rahmen der Premium-Politur umstellen

Werkzeuge aus den Runden 2b und 3 (Specs unter `docs/superpowers/specs/`). Sie stellen eine
Seite mit altem Inline-Style-Aufbau auf `PageHead`, `PageLayout`, `PageFacts` und das
`pg-`-Vokabular aus `src/styles/page.css` um. Nicht Teil des Builds (liegt außerhalb von
`src/` und `public/`).

## Aufruf (aus der Repo-Wurzel)

```bash
python3 scripts/pg-migrate/pgpage.py sbf-kosten en-sbf-costs
```

`pgpage.py` ersetzt Hero und Inhaltshülle nach der Konfiguration in `PAGES` (Eyebrow, H1,
Lede, Store-Button, Kennzahlen, Variante) und ruft danach `pgconvert.py` für die Abschnitte
auf. `pgconvert.py <datei> <lang>` lässt sich auch allein nutzen; es druckt am Ende alle
verbleibenden `style="…"`-Zeilen. Neue Muster gehören in den Konverter, nicht per Hand in
die Seite, damit die nächste Seite davon profitiert.

## Schein-Finder (Runde 3, 3.6)

```bash
python3 scripts/pg-migrate/pgfinder.py            # beide Finder-Seiten
python3 scripts/pg-migrate/pgfinder.py tools-finder
```

`pgfinder.py` ruft erst `pgpage.py` (Kopf, schmale Spalte, Konverter) und greift dann nur
Strings und Klassen im Inline-Skript an: Pfeil- und Emoji-Zeichen werden Inline-SVG
(`CHEV`, `BULB`), die Ergebniskarten bekommen `.res-*`-Klassen, der Verlaufs-Button wird
`a.h-btn.h-btn--sm`; im `is:global`-Block werden Festfarben zu Tokens und die
`html.dark`-Regeln entfernt. Fragenfolge, Ergebnislogik, IDs, `.cfg-opt` und `data-*`
bleiben unangetastet. Der Lauf ist einmalig gedacht (nach dem Umbau findet er seine
Muster nicht mehr und bricht ab).

## Fahrschulen (Runde 3a, Task 5)

```bash
python3 scripts/pg-migrate/pgschools.py            # Übersicht und Städte-Template, DE und EN
```

`pgschools.py` ruft `pgpage.py` für die vier Seiten auf (Übersicht `wide`, Städte-Template
`read` mit `raw=True` und `facts_expr='cityFacts'`, die Konstante kommt ins Frontmatter) und
ersetzt danach die seitenspezifischen Muster: Info-Kasten mit Glühbirne, Städtekarten
(`.city-*`, EN-Klassen auf die DE-Namen), Schulkarten (`.pg-school*`, Website/Telefon bleiben
44 px hohe Flächen), Google-Maps-Kasten als `.pg-banner`, Kennzahlen als `.pg-kpi`, Zeilenliste
als `.pg-rows`. Die Regeln dafür hängt der Lauf einmalig an `src/styles/page.css` an. Der Lauf
ist wiederholbar (zweiter Durchlauf ändert nichts).

## Infoseiten (Runde 3b)

```bash
python3 scripts/pg-migrate/pginfo.py impressum en-legal
```

`pginfo.py` liest den Kopf-Block der Infoseiten (Pille, H1, Intro) aus und ersetzt ihn durch
`PageHead`, die 720-px-Hülle durch `PageLayout variant="narrow"`; Legal-Karten, Labels,
Absätze und Links werden Klassen (`pg-card--legal`, `pg-card-label`, `pg-p--sm`, `pg-strong`,
`pg-inline-link`). Die Regeln für Legal-Karten, `pg-meta`, `pg-divider`, `pg-kv`, `pg-notice`,
`pg-chips`, FAQ-Akkordeon und `pg-portrait` hängt der erste Lauf an `src/styles/page.css` an.
Die Lede landet als Text im `PageHead` (Auszeichnungen wie `<strong>` entfallen dort).

## Grenzen

- Regex auf exakte Inline-Werte: ein abweichender Wert (anderes `padding`, andere Opazität)
  bleibt als Rest stehen und wird gemeldet.
- Stil-Konstanten (`style={card}`) und Tailwind-Utilities werden nicht erfasst (dafür
  `pginfo.py`, Runde 3b).
- Seiten in Unterordnern (`tools/`) brauchen in `PAGES` ein `prefix` für die Importpfade,
  Seiten mit anderer Inhaltshülle ein `marker` und ein `close`-Muster.
- Kennzahlen (`facts`) müssen wörtlich aus dem Seitentext stammen (Spec Runde 3, 3.3).
