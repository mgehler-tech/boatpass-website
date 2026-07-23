#!/usr/bin/env node
/**
 * Wertet den GSC-Report (aus fetch-gsc-data.mjs) deterministisch aus und schreibt
 * docs/seo-automation/gsc-findings.md. Bewusst KEIN LLM: Die Auswertung ist reine
 * Rechnerei, und ein deterministisches Ergebnis macht `git diff` zwischen den Wochen
 * aussagekräftig – man sieht, was sich real verändert hat, statt neu formulierter Prosa.
 *
 * Env:
 *   GSC_REPORT   – Pfad zum JSON-Report   (Default: /tmp/gsc-report.json)
 *   GSC_FINDINGS – Zielpfad des Markdown   (Default: docs/seo-automation/gsc-findings.md)
 *
 * Verändert NIE Titel, Meta-Descriptions oder Seiteninhalte – nur das Findings-Doku.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const REPORT = process.env.GSC_REPORT || '/tmp/gsc-report.json';
const OUTPUT = process.env.GSC_FINDINGS || 'docs/seo-automation/gsc-findings.md';

const r = JSON.parse(readFileSync(REPORT, 'utf8'));
const strip = (u) => u.replace('https://boatpass.de', '');
const sum = (a, k) => a.reduce((s, x) => s + (x[k] || 0), 0);
const num = (n, d = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

// --- Kennzahlen Gesamt -------------------------------------------------------
const clicksNow = sum(r.pages, 'clicks');
const clicksPrev = sum(r.prevPages, 'clicks');
const imprNow = sum(r.pages, 'impressions');
const imprPrev = sum(r.prevPages, 'impressions');
const ctrNow = imprNow ? (clicksNow / imprNow) * 100 : 0;
const pct = (now, prev) => (prev ? `${now >= prev ? '+' : ''}${num(((now - prev) / prev) * 100)} %` : '—');

// --- A) Striking Distance: Seiten Position 5–20 mit relevanten Impressionen ---
const pages = r.pages.map((x) => ({
  u: strip(x.keys[0]),
  i: x.impressions,
  c: x.clicks,
  pos: x.position,
  ctr: x.impressions ? (x.clicks / x.impressions) * 100 : 0,
}));
const striking = pages
  .filter((x) => x.pos >= 5 && x.pos <= 20 && x.i >= 80)
  .sort((a, b) => a.pos - b.pos);

// Top-Query je Striking-Distance-Seite (aus queryPage), für konkrete Maßnahme
const topQueryFor = {};
for (const row of r.queryPage || []) {
  const [q, u] = row.keys;
  const key = strip(u);
  if (!striking.some((s) => s.u === key)) continue;
  const cur = topQueryFor[key];
  if (!cur || row.impressions > cur.i) topQueryFor[key] = { q, i: row.impressions, pos: row.position };
}

// --- B) CTR-Schwächen: gute Position, aber CTR unter Positions-Erwartung ------
const expectedCtr = (pos) => (pos <= 3 ? 15 : pos <= 10 ? 4 : pos <= 20 ? 1.5 : 0.5);
const ctrGaps = pages
  .filter((x) => x.i >= 100 && x.pos <= 20 && x.ctr < expectedCtr(x.pos) * 0.5)
  .sort((a, b) => b.i - a.i)
  .slice(0, 8);

// --- C) Bewegungen ggü. Vorperiode (Seiten) ----------------------------------
const prevImpr = {};
for (const x of r.prevPages) prevImpr[strip(x.keys[0])] = x.impressions;
const movers = pages
  .map((x) => ({ ...x, prev: prevImpr[x.u] ?? 0, delta: x.i - (prevImpr[x.u] ?? 0) }))
  .filter((x) => Math.abs(x.delta) >= 40 && x.i >= 60);
const risers = [...movers].sort((a, b) => b.delta - a.delta).slice(0, 6);
const fallers = [...movers].sort((a, b) => a.delta - b.delta).filter((x) => x.delta < 0).slice(0, 5);

// --- D) Themen-Chancen: Queries mit Impressionen, aber schwacher Position -----
const queryChances = r.queries
  .filter((q) => q.impressions >= 8 && q.position > 20 && q.clicks === 0)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 12);

// --- Markdown ---------------------------------------------------------------
const t = (n) => (n === 1 ? '' : 'n');
const rows = (arr, fn) => arr.map(fn).join('\n');

const md = `# GSC-Findings – automatisch erzeugt

> Deterministisch aus Search-Console-Daten von \`scripts/analyze-gsc-data.mjs\`.
> **Kein LLM, keine automatischen Code-Änderungen.** Die Bewertung und jede
> Umsetzung passieren manuell – so bleibt der \`git diff\` zwischen den Wochen lesbar.

- **Erzeugt:** ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
- **Zeitraum:** ${r.period.startDate} bis ${r.period.endDate}
- **Vorperiode:** ${r.previousPeriod.startDate} bis ${r.previousPeriod.endDate}

## Kennzahlen

| Metrik | Aktuell | Vorperiode | Δ |
|---|--:|--:|--:|
| Klicks | ${num(clicksNow)} | ${num(clicksPrev)} | ${pct(clicksNow, clicksPrev)} |
| Impressionen | ${num(imprNow)} | ${num(imprPrev)} | ${pct(imprNow, imprPrev)} |
| CTR gesamt | ${num(ctrNow, 2)} % | ${num(imprPrev ? (clicksPrev / imprPrev) * 100 : 0, 2)} % | — |
| Seiten mit Impressionen | ${r.pages.length} | ${r.prevPages.length} | — |

## A) Striking Distance (Position 5–20, ≥ 80 Impressionen)

Rankings knapp vor Seite 1 – der ertragreichste Hebel. „Top-Query" ist die stärkste
Suchanfrage, über die die Seite gefunden wird.

${striking.length ? `| Seite | Pos | Impr. | Klicks | CTR | Top-Query (Pos) |
|---|--:|--:|--:|--:|---|
${rows(striking, (x) => {
  const tq = topQueryFor[x.u];
  return `| \`${x.u}\` | ${num(x.pos, 1)} | ${num(x.i)} | ${x.c} | ${num(x.ctr, 1)} % | ${tq ? `${tq.q} (${num(tq.pos, 0)})` : '—'} |`;
})}` : '_Keine Seite in diesem Fenster._'}

## B) CTR-Schwächen (gute Position, zu wenig Klicks)

CTR unter der Hälfte des Positions-Erwartungswerts. Ursache meist schwacher Title/Snippet
– **oder** ein breiter, unpassender Long-Tail. Vor jeder Maßnahme prüfen, welches von beidem.

${ctrGaps.length ? `| Seite | Pos | Impr. | CTR | Erwartet |
|---|--:|--:|--:|--:|
${rows(ctrGaps, (x) => `| \`${x.u}\` | ${num(x.pos, 1)} | ${num(x.i)} | ${num(x.ctr, 2)} % | ~${num(expectedCtr(x.pos), 0)} % |`)}` : '_Keine auffälligen Lücken._'}

## C) Bewegungen ggü. Vorperiode

**Aufsteiger:**
${risers.length ? rows(risers, (x) => `- \`${x.u}\`: ${num(x.prev)} → ${num(x.i)} Impr. (${x.delta >= 0 ? '+' : ''}${num(x.delta)})`) : '_keine_'}

**Verlierer:**
${fallers.length ? rows(fallers, (x) => `- \`${x.u}\`: ${num(x.prev)} → ${num(x.i)} Impr. (${num(x.delta)})`) : '_keine_'}

## D) Themen-Chancen (Query mit Nachfrage, Position > 20, 0 Klicks)

Kandidaten für neue oder vertiefte Inhalte – Rohmaterial für den Blog-Autopilot.

${queryChances.length ? `| Query | Impr. | Pos |
|---|--:|--:|
${rows(queryChances, (q) => `| ${q.keys[0]} | ${num(q.impressions)} | ${num(q.position, 0)} |`)}` : '_keine_'}

---

_Nächster Lauf: automatisch montags. Rohreport als Workflow-Artefakt \`gsc-report\` angehängt._
`;

writeFileSync(OUTPUT, md);
console.log(
  `Findings geschrieben: ${OUTPUT} — ${striking.length} Striking-Distance, ${ctrGaps.length} CTR-Lücken, ${queryChances.length} Themen-Chancen.`,
);
