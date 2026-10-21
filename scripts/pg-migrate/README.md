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

## Grenzen

- Regex auf exakte Inline-Werte: ein abweichender Wert (anderes `padding`, andere Opazität)
  bleibt als Rest stehen und wird gemeldet.
- Stil-Konstanten (`style={card}`) und Tailwind-Utilities werden nicht erfasst (dafür
  `pginfo.py`, Runde 3b).
- Skripte, die Markup zur Laufzeit erzeugen (Schein-Finder), bleiben Handarbeit.
- Kennzahlen (`facts`) müssen wörtlich aus dem Seitentext stammen (Spec Runde 3, 3.3).
