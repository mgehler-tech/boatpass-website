#!/usr/bin/env node
/**
 * Blog-Autopilot: erzeugt einen neuen, hochwertigen SBF-Blogpost (DE + EN gepaart)
 * über die Anthropic-API und schreibt ihn ins Repo. Aufgerufen aus der GitHub Action.
 *
 * Ablauf:
 *   1. Playbook + Themen-Backlog lesen, vorhandene Slugs sammeln (keine Dopplung)
 *   2. Anthropic-API mit strukturiertem Output aufrufen (garantiert parsebares JSON)
 *   3. DE- und EN-Markdown mit schema-konformem Frontmatter schreiben
 *   4. Gewähltes Thema in der Backlog abhaken
 *
 * Benötigt: ANTHROPIC_API_KEY (Env). Optional: BLOG_MODEL (Default claude-opus-4-8).
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DE_DIR = join(ROOT, 'src/content/blog/de');
const EN_DIR = join(ROOT, 'src/content/blog/en');
const PLAYBOOK = join(ROOT, 'docs/blog-automation/playbook.md');
const BACKLOG = join(ROOT, 'docs/blog-automation/topic-backlog.md');

const MODEL = process.env.BLOG_MODEL || 'claude-opus-4-8';
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('FEHLER: ANTHROPIC_API_KEY ist nicht gesetzt.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const playbook = readFileSync(PLAYBOOK, 'utf8');
const backlog = readFileSync(BACKLOG, 'utf8');

const existingDe = readdirSync(DE_DIR).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));
const existingEn = readdirSync(EN_DIR).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));

// Offene Backlog-Themen (Zeilen mit "- [ ]")
const openTopics = backlog
  .split('\n')
  .filter(l => /^\s*-\s*\[\s\]\s+/.test(l))
  .map(l => l.replace(/^\s*-\s*\[\s\]\s+/, '').trim());

if (openTopics.length === 0) {
  console.error('FEHLER: Keine offenen Themen in der Backlog. Bitte topic-backlog.md ergänzen.');
  process.exit(1);
}

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    topic_chosen: { type: 'string', description: 'Das exakt aus der offenen Backlog gewählte Thema (wortgleich).' },
    slug_de: { type: 'string', description: 'Dateiname-Slug DE: kleinbuchstaben, bindestriche, keine Umlaute (ae/oe/ue/ss).' },
    slug_en: { type: 'string', description: 'Dateiname-Slug EN: kleinbuchstaben, bindestriche.' },
    title_de: { type: 'string' },
    title_en: { type: 'string' },
    description_de: { type: 'string', description: '140-160 Zeichen, Haupt-Keyword enthalten.' },
    description_en: { type: 'string' },
    tags_de: { type: 'array', items: { type: 'string' }, description: 'Aus Bestand: Vorbereitung oder Prüfungswissen.' },
    tags_en: { type: 'array', items: { type: 'string' }, description: 'EN-Pendant: Exam Knowledge bzw. passend.' },
    reading_time: { type: 'integer', description: 'Lesezeit in Minuten (ca. Wörter/200).' },
    body_de: { type: 'string', description: 'Markdown-Body DE OHNE Frontmatter. Beginnt mit Einleitungsabsatz, dann ## Abschnitte, endet mit ## Fazit inkl. Boatpass-App-CTA.' },
    body_en: { type: 'string', description: 'Markdown-Body EN OHNE Frontmatter.' },
  },
  required: [
    'topic_chosen', 'slug_de', 'slug_en', 'title_de', 'title_en',
    'description_de', 'description_en', 'tags_de', 'tags_en', 'reading_time',
    'body_de', 'body_en',
  ],
};

const userPrompt = `Du schreibst einen neuen Blogpost für boatpass.de (Sportbootführerschein-Thema), DE + EN gepaart.

== PLAYBOOK (verbindliche Anleitung für Stil, Aufbau, Frontmatter, interne Links, CTA) ==
${playbook}

== OFFENE THEMEN (wähle GENAU EINES, am besten das oberste) ==
${openTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

== BEREITS VORHANDENE SLUGS (NICHT thematisch doppeln) ==
DE: ${existingDe.join(', ')}
EN: ${existingEn.join(', ')}

Anforderungen:
- Wähle das oberste offene Thema, das thematisch nicht schon abgedeckt ist; gib es in topic_chosen WORTGLEICH zurück.
- Schreibe je ~1500-2000 Wörter, ehrlicher Mehrwert, "du"-Ansprache (DE) bzw. "you" (EN), korrekte Fachbegriffe, keine erfundenen Zahlen.
- Struktur: Einleitung -> mehrere ## Abschnitte (bei Bedarf ###) -> ## Fazit.
- Baue 1-3 interne Markdown-Links zu passenden eigenen Seiten ein (z. B. /sbf-binnen/, /sbf-see/, /sbf-kosten/, /sbf-pruefung-ablauf/, /faq/) und am Ende einen natürlichen Hinweis auf die Boatpass-App (offizieller ELWIS-Fragenkatalog, Prüfungsmodus).
- body_de und body_en enthalten KEIN Frontmatter (das setzt das Skript) und beginnen direkt mit dem Einleitungsabsatz.
- tags_de aus {Vorbereitung, Prüfungswissen}; tags_en das jeweilige EN-Pendant.
- Slugs: keine Umlaute (ae/oe/ue/ss), kleinbuchstaben, bindestriche.`;

console.log(`Generiere Blogpost mit Modell ${MODEL} ...`);

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema },
    },
    messages: [{ role: 'user', content: userPrompt }],
  }),
});

if (!res.ok) {
  console.error(`FEHLER: Anthropic-API ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}

const data = await res.json();
if (data.stop_reason === 'refusal') {
  console.error('FEHLER: Modell hat die Anfrage abgelehnt.');
  process.exit(1);
}
const textBlock = (data.content || []).find(b => b.type === 'text');
if (!textBlock) {
  console.error('FEHLER: Keine Textantwort erhalten.', JSON.stringify(data).slice(0, 500));
  process.exit(1);
}

let post;
try {
  post = JSON.parse(textBlock.text);
} catch (e) {
  console.error('FEHLER: Antwort ist kein gültiges JSON.', e.message);
  console.error(textBlock.text.slice(0, 500));
  process.exit(1);
}

// Slugs gegen Dopplung absichern
if (existingDe.includes(post.slug_de) || existingEn.includes(post.slug_en)) {
  console.error(`FEHLER: Slug existiert bereits (de: ${post.slug_de}, en: ${post.slug_en}).`);
  process.exit(1);
}

const yamlList = arr => '[' + arr.map(t => JSON.stringify(t)).join(', ') + ']';
const esc = s => String(s).replace(/"/g, '\\"');

const frontmatter = (lang, p) => `---
title: "${esc(lang === 'de' ? p.title_de : p.title_en)}"
description: "${esc(lang === 'de' ? p.description_de : p.description_en)}"
date: ${today}
tags: ${yamlList(lang === 'de' ? p.tags_de : p.tags_en)}
readingTime: ${p.reading_time}
lang: ${lang}
author: "Marius Gehler"
altSlug: "${lang === 'de' ? p.slug_en : p.slug_de}"
---

`;

writeFileSync(join(DE_DIR, `${post.slug_de}.md`), frontmatter('de', post) + post.body_de.trim() + '\n');
writeFileSync(join(EN_DIR, `${post.slug_en}.md`), frontmatter('en', post) + post.body_en.trim() + '\n');

// Backlog: gewähltes Thema abhaken
const lines = backlog.split('\n');
let marked = false;
const norm = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
for (let i = 0; i < lines.length; i++) {
  if (/^\s*-\s*\[\s\]\s+/.test(lines[i])) {
    const topic = lines[i].replace(/^\s*-\s*\[\s\]\s+/, '').trim();
    if (norm(topic) === norm(post.topic_chosen)) {
      lines[i] = `- [x] ${topic} (${today}, de: ${post.slug_de}, en: ${post.slug_en})`;
      marked = true;
      break;
    }
  }
}
if (!marked) {
  // Fallback: erstes offenes Thema abhaken
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*-\s*\[\s\]\s+/.test(lines[i])) {
      const topic = lines[i].replace(/^\s*-\s*\[\s\]\s+/, '').trim();
      lines[i] = `- [x] ${topic} (${today}, de: ${post.slug_de}, en: ${post.slug_en})`;
      break;
    }
  }
}
writeFileSync(BACKLOG, lines.join('\n'));

console.log(`OK: "${post.title_de}"`);
console.log(`  DE: src/content/blog/de/${post.slug_de}.md`);
console.log(`  EN: src/content/blog/en/${post.slug_en}.md`);
// Für die GitHub Action als Commit-Message nutzbar
console.log(`COMMIT_TITLE=feat(blog): ${post.title_de}`);
