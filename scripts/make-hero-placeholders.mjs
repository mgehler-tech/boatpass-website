#!/usr/bin/env node
/**
 * Platzhalter für die Hero-Fotos, bis die echten Aufnahmen vorliegen
 * (Spec docs/superpowers/specs/2026-10-17-premium-polish-design.md, Anhang A).
 * Erzeugt dieselbe ruhige Fläche, die der Hero sonst als Fallback zeigen
 * würde: Verlauf von Papier-2 nach Papier mit einem weichen Lichtfleck
 * oben links. Die echten Fotos ersetzen die Dateien 1:1 (gleiche Namen);
 * das Skript bleibt zum Regenerieren.
 *
 *   node scripts/make-hero-placeholders.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'src/assets/images/hero');

const svg = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E6ECF5"/>
      <stop offset="1" stop-color="#F0F4FA"/>
    </linearGradient>
    <radialGradient id="light" cx="0.22" cy="0.18" r="0.55">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#paper)"/>
  <rect width="${w}" height="${h}" fill="url(#light)"/>
</svg>`;

const files = [
  ['water-day.jpg', 2400, 3200],
  ['water-day-wide.jpg', 2400, 1350],
];

await mkdir(outDir, { recursive: true });
for (const [name, w, h] of files) {
  await sharp(Buffer.from(svg(w, h))).jpeg({ quality: 82 }).toFile(resolve(outDir, name));
  console.log(`wrote ${name} (${w}x${h})`);
}
