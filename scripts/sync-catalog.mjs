#!/usr/bin/env node
/**
 * Übernimmt die amtlichen Fragenkataloge SBF Binnen und SBF See aus der
 * Android-App in die Website (Prüfungsfragen-Hubs).
 *
 *   node scripts/sync-catalog.mjs [Pfad zu app/src/main/assets]
 *
 * Standardpfad: ~/AndroidStudioProjects/SBFLernApp/app/src/main/assets
 *
 * Was übernommen wird:
 * - Frage und vier Antworten (DE amtlich, EN Boatpass-Übersetzung),
 *   Antwort a ist wie im amtlichen Katalog immer die richtige.
 * - Von der Boatpass-Erklärung nur der Anriss (erster Satz, DE/EN). Der Rest
 *   der Erklärung steht nur in der App und gelangt nicht in die Website.
 * - Abbildungen, verkleinert auf höchstens 800 px als WebP.
 * - Die amtlichen Fragebögen (Verteilung der Fragen, VkBl. 2012 S. 224/225).
 *
 * Was bewusst NICHT übernommen wird: der Rest der Erklärungen, die Merkhilfen
 * und die Navigationsaufgaben (Fragen 286–300 SBF See). Das bleibt in der App.
 *
 * Wortlaut: Die App-Texte wurden am 23.10.2026 mit den ELWIS-Seiten
 * abgeglichen. Wo die App vom amtlichen Text abweicht, setzt OFFICIAL_DE unten
 * den ELWIS-Wortlaut ein. Offensichtliche Schreibfehler im amtlichen Text
 * (z. B. „wärend“, „Schallsinale“) bleiben so berichtigt, wie die App sie hat.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = process.argv[2] ?? join(homedir(), 'AndroidStudioProjects/SBFLernApp/app/src/main/assets');
const DATA_OUT = join(ROOT, 'src/data/catalog');
const IMG_OUT = join(ROOT, 'src/assets/catalog');

/**
 * Amtlicher Wortlaut dort, wo die App abweicht (ELWIS, Stand 01.08.2023).
 * Schlüssel: `${katalog}:${nummer}`; Felder q (Frage) bzw. a/b/c/d (Antworten).
 * Die Schallsignal-Symbole in Klammern geben die Grafik des Katalogs wieder.
 */
const OFFICIAL_DE = {
  'see:118': {
    q: 'Welche Fahrzeuge geben bei verminderter Sicht mindestens alle zwei Minuten drei aufeinander folgende Töne mit der Pfeife, und zwar lang, kurz, kurz (– • •)?',
  },
  'see:225': {
    q: 'Wie hat man sich beim Befahren von Naturschutzgebieten und Nationalparken zu verhalten?',
  },
};

/** Einzelne Wortersetzungen (App-Text → amtlicher Text). */
const OFFICIAL_REPLACE = {
  'binnen:75': [['einer begangener Ordnungswidrigkeit', 'einer begangenen Ordnungswidrigkeit']],
  'see:119': [
    ['im Anschluss an das Signal (– • •)', 'im Anschluss an das Signal: lang, kurz, kurz (– • •)'],
    ['mit der Pfeife (– • • •)?', 'mit der Pfeife, und zwar: lang, kurz, kurz, kurz (– • • •)?'],
  ],
  'see:120': [
    ['mit der Pfeife (– • •)', 'mit der Pfeife, und zwar lang, kurz, kurz (– • •)'],
    ['mit der Pfeife (– – •)', 'mit der Pfeife, und zwar lang, lang, kurz (– – •)'],
    ['Mit der Pfeife (• – •)', 'Mit der Pfeife kurz, lang, kurz (• – •)'],
  ],
  'see:121': [
    ['mit der Pfeife (– • •)', 'mit der Pfeife, und zwar lang, kurz, kurz (– • •).'],
    ['mit der Pfeife (– – •)', 'mit der Pfeife, und zwar lang, lang, kurz (– – •).'],
    ['Mit der Pfeife (• – •)', 'Mit der Pfeife kurz, lang, kurz (• – •).'],
  ],
  'see:124': [
    ['mit der Pfeife (– • •)', 'mit der Pfeife, und zwar lang, kurz, kurz (– • •).'],
    ['mit der Pfeife (– – •)', 'mit der Pfeife, und zwar lang, lang, kurz (– – •).'],
    ['Mit der Pfeife (• – •)', 'Mit der Pfeife kurz, lang, kurz (• – •).'],
  ],
  'see:142': [['Trennzone/ Trennlinie', 'Trennzone/Trennlinie']],
  'see:234': [['Seekarte INT1', 'Seekarte INT 1']],
};

function load(file) {
  return JSON.parse(readFileSync(join(ASSETS, file), 'utf8'));
}

function applyOfficial(key, q) {
  const o = OFFICIAL_DE[key];
  if (o?.q) q.q.de = o.q;
  for (const [from, to] of OFFICIAL_REPLACE[key] ?? []) {
    let hit = false;
    for (const t of [q.q, ...q.a]) {
      if (t.de.includes(from)) { t.de = t.de.split(from).join(to); hit = true; }
    }
    if (!hit) throw new Error(`${key}: Ersetzung „${from}“ nicht gefunden – App-Text geändert?`);
  }
}

/** Abkürzungen, hinter denen kein Satz endet. */
const ABBREV = /(?:\b(?:z|d|u|v|o|s|bzw|ca|Nr|Abs|Std|Min|Sek|max|min|ggf|evtl|inkl|etc|vgl|bspw|i|e|al|St|kn|sm|sog|usw|Ziff|Art|Kap|ff|Tel|e\.g|i\.e|approx|no|para|cf|vs)\.)$/i;

/**
 * Anriss einer Erklärung: der erste vollständige Satz (mindestens 50 Zeichen,
 * sonst auch der zweite). Ist er länger als 200 Zeichen, wird an einer
 * Wortgrenze gekürzt. `cut` sagt, ob danach noch Text folgt.
 */
function teaser(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  let end = -1;
  const re = /[.!?](?=\s+[„"A-ZÄÖÜ0-9(])/g;
  for (let m; (m = re.exec(t)); ) {
    if (ABBREV.test(t.slice(0, m.index + 1))) continue;
    if (m.index + 1 < 50) continue;
    end = m.index + 1;
    break;
  }
  let out = end === -1 ? t : t.slice(0, end);
  if (out.length > 200) {
    out = out.slice(0, 190).replace(/[\s,;:–-]+\S*$/, '') + ' …';
  }
  return { text: out, cut: out.length < t.length };
}

const usedImages = new Map(); // Ziel → Quelle

function mapQuestion(raw, catalog, imgFolder, imgList) {
  const answers = [...raw.answers].sort((x, y) => x.id.localeCompare(y.id));
  if (answers.length !== 4 || raw.correct_answer_id !== 'a') {
    throw new Error(`${catalog}:${raw.number}: erwartet 4 Antworten mit a richtig`);
  }
  const images = [];
  for (const name of imgList) {
    const src = join(ASSETS, imgFolder, name);
    if (!existsSync(src)) continue;
    const target = `${catalog === 'see' ? 'see' : 'binnen'}/${name.replace(/\.png$/, '.webp')}`;
    usedImages.set(target, src);
    images.push(target);
  }
  const q = {
    n: raw.number,
    section: raw.section,
    q: { de: raw.text.de.trim(), en: raw.text.en.trim() },
    a: answers.map(x => ({ de: x.text.de.trim(), en: x.text.en.trim() })),
    x: { de: teaser(raw.explanation?.de ?? '').text, en: teaser(raw.explanation?.en ?? '').text },
    /** Erklärung geht in der App weiter. */
    more: teaser(raw.explanation?.de ?? '').cut || teaser(raw.explanation?.en ?? '').cut,
    /** Zu dieser Frage gibt es in der App eine Merkhilfe. */
    mn: Boolean(raw.mnemonic?.de?.trim()),
    img: images,
  };
  if (!q.x.de || !q.x.en) throw new Error(`${catalog}:${raw.number}: Erklärung fehlt`);
  applyOfficial(`${catalog}:${raw.number}`, q);
  return q;
}

/** Bildnamen wie in der App: N.png, N.1.png, N.2.png … */
function imageNames(folderFiles, number) {
  const names = [];
  if (folderFiles.has(`${number}.png`)) names.push(`${number}.png`);
  for (let i = 1; folderFiles.has(`${number}.${i}.png`); i++) names.push(`${number}.${i}.png`);
  return names;
}

const binnenFiles = new Set(readdirSync(join(ASSETS, 'sbf_binnen_images')));
const seeFiles = new Set(readdirSync(join(ASSETS, 'sbf_see_images')));

const basisRaw = load('sbf_basis.json');
const binnenRaw = load('sbf_binnen_2023.json');
const seeRaw = load('sbf_see_2023.json');

const basis = basisRaw.questions
  .map(x => mapQuestion(x, 'basis', 'sbf_binnen_images', imageNames(binnenFiles, x.number)))
  .sort((x, y) => x.n - y.n);
const binnen = binnenRaw.questions
  .map(x => mapQuestion(x, 'binnen', 'sbf_binnen_images', imageNames(binnenFiles, x.number)))
  .sort((x, y) => x.n - y.n);
const see = seeRaw.questions
  .filter(x => x.section === 'see') // Navigationsaufgaben bleiben in der App
  .map(x => mapQuestion(x, 'see', 'sbf_see_images', imageNames(seeFiles, x.number)))
  .sort((x, y) => x.n - y.n);

const expect = (name, list, from, to) => {
  const nums = list.map(x => x.n);
  const ok = nums.length === to - from + 1 && nums.every((n, i) => n === from + i);
  if (!ok) throw new Error(`${name}: Nummern ${from}–${to} erwartet, erhalten ${nums.length}`);
};
expect('basis', basis, 1, 72);
expect('binnen', binnen, 73, 300);
expect('see', see, 73, 285);

const sheets = {
  // Fragebogen 1–15 unter Antriebsmaschine (je 30 Fragen) und Ergänzungsbogen Segeln (je 7)
  binnenMotor: load('exam_sheets_motor.json'),
  binnenSegelErgaenzung: load('exam_sheets_ergaenzung.json'),
  see: load('exam_sheets_see.json'),
};
for (const [k, list] of Object.entries(sheets)) {
  if (list.length !== 15) throw new Error(`Fragebögen ${k}: 15 erwartet`);
}

mkdirSync(DATA_OUT, { recursive: true });
const write = (file, data) => writeFileSync(join(DATA_OUT, file), JSON.stringify(data, null, 0) + '\n');
write('basis.json', basis);
write('binnen.json', binnen);
write('see.json', see);
write('sheets.json', Object.fromEntries(Object.entries(sheets).map(([k, v]) => [k, v.map(s => s.questionNumbers)])));

rmSync(IMG_OUT, { recursive: true, force: true });
for (const [target, src] of usedImages) {
  const out = join(IMG_OUT, target);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(src).resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toFile(out);
}

console.log(`Basis ${basis.length}, Binnen ${binnen.length}, See ${see.length} Fragen, ${usedImages.size} Bilder.`);
