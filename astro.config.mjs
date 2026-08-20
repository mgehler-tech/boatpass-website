// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// @astrojs/sitemap erkennt hreflang-Alternates zwischen DE/EN nur automatisch, wenn der
// Pfad nach dem `/en`-Präfix identisch ist (z. B. /faq/ <-> /en/faq/). Bei abweichenden
// Slugs – allen 62+62 Blogartikeln sowie den unten gelisteten Kernseiten, siehe deren
// `altUrl`-Prop in src/pages/**/*.astro – blieb die xhtml:link-Annotation in der Sitemap
// bisher leer, obwohl die Seiten selbst korrekte <link rel="alternate" hreflang>-Tags im
// <head> haben. Diese Map spiegelt exakt die dort hinterlegten altUrl-Werte, damit die
// Sitemap dasselbe DE/EN-Mapping trägt wie die Seiten selbst.
function loadBlogAltSlugMap() {
  const map = new Map();
  for (const lang of ['de', 'en']) {
    const dir = path.join(rootDir, 'src/content/blog', lang);
    for (const file of fs.readdirSync(dir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const slug = file.replace(/\.mdx?$/, '');
      const frontmatter = fs.readFileSync(path.join(dir, file), 'utf8');
      const match = frontmatter.match(/^altSlug:\s*"?([^"\n]+)"?\s*$/m);
      if (!match) continue;
      const altSlug = match[1].trim();
      const selfPath = lang === 'de' ? `/blog/${slug}/` : `/en/blog/${slug}/`;
      const altPath = lang === 'de' ? `/en/blog/${altSlug}/` : `/blog/${altSlug}/`;
      map.set(selfPath, altPath);
    }
  }
  return map;
}

// Kernseiten mit abweichendem DE/EN-Slug (identisch zur `altUrl`-Prop der jeweiligen Seite).
const CORE_PAGE_PAIRS = [
  ['/kontakt/', '/en/contact/'],
  ['/datenschutz/', '/en/privacy/'],
  ['/ueber-uns/', '/en/about/'],
  ['/nutzungsbedingungen/', '/en/terms/'],
  ['/impressum/', '/en/legal/'],
  ['/fuehrerscheine/', '/en/licenses/'],
  ['/sbf-app-kostenlos/', '/en/sbf-app-free/'],
  ['/funkschein-app/', '/en/radio-certificate-app/'],
  ['/sbf-see-app/', '/en/sbf-coastal-app/'],
  ['/sbf-binnen-app/', '/en/sbf-inland-app/'],
  ['/sbf-binnen/', '/en/sbf-inland/'],
  ['/sbf-see/', '/en/sbf-coastal/'],
  ['/sbf-kosten/', '/en/sbf-costs/'],
  ['/sbf-pruefung-ablauf/', '/en/sbf-exam/'],
  ['/sbf-binnen-pruefungsfragen/', '/en/sbf-inland-exam-questions/'],
  ['/sbf-see-pruefungsfragen/', '/en/sbf-coastal-exam-questions/'],
  ['/tools/welcher-bootsfuehrerschein/', '/en/tools/which-boating-license/'],
  ['/bootsfahrschulen/', '/en/boat-schools/'],
];

const blogAltSlugMap = loadBlogAltSlugMap();
const altPathMap = new Map(CORE_PAGE_PAIRS.flatMap(([de, en]) => [[de, en], [en, de]]));

// /bootsfahrschulen/{stadt}/ <-> /en/boat-schools/{stadt}/ – gleicher Städte-Slug in
// beiden Sprachen, nur der Segmentname davor unterscheidet sich.
/** @param {string} pagePath */
function cityAltPath(pagePath) {
  let m = pagePath.match(/^\/bootsfahrschulen\/([^/]+)\/$/);
  if (m) return `/en/boat-schools/${m[1]}/`;
  m = pagePath.match(/^\/en\/boat-schools\/([^/]+)\/$/);
  if (m) return `/bootsfahrschulen/${m[1]}/`;
  return undefined;
}

/** @param {string} pagePath */
function findAltPath(pagePath) {
  return blogAltSlugMap.get(pagePath) ?? altPathMap.get(pagePath) ?? cityAltPath(pagePath);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://boatpass.de',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-DE', en: 'en-US' },
      },
      // Crawl-Priorisierung: Geld-/Pillar-Seiten höher, rechtliche Seiten niedriger.
      // Hilft Google, das Crawl-Budget auf die ranking-relevanten Seiten zu lenken.
      serialize(item) {
        const url = item.url;
        const path = url.replace('https://boatpass.de', '').replace('/en', '');
        // Kein künstliches lastmod: `new Date()` bei jedem Build würde Google
        // signalisieren, dass sich alle Seiten ständig ändern – ein unglaubwürdiges
        // Freshness-Signal, das das Vertrauen in die Sitemap untergräbt. Lieber gar
        // kein lastmod als ein falsches.
        if (path === '/' || path === '') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (/^\/(sbf-binnen|sbf-see|sbf-kosten|sbf-pruefung-ablauf|sbf-binnen-pruefungsfragen|sbf-see-pruefungsfragen|fuehrerscheine|licenses)\/?$/.test(path)) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (/^\/(src|ubi|lrc|faq)\/?$/.test(path)) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (path.startsWith('/tools/') || path.startsWith('/bootsfahrschulen') || path.startsWith('/boat-schools')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (path.startsWith('/blog')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (/^\/(impressum|datenschutz|privacy|legal|kontakt|contact|ueber-uns|about|404)\/?$/.test(path)) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        } else {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }

        // xhtml:link-hreflang ergänzen, wenn @astrojs/sitemap wegen abweichender
        // DE/EN-Slugs keine automatische Zuordnung finden konnte (siehe findAltPath oben).
        if (!item.links) {
          const fullPath = url.replace('https://boatpass.de', '') || '/';
          const altPath = findAltPath(fullPath);
          if (altPath) {
            const selfLang = fullPath.startsWith('/en/') ? 'en-US' : 'de-DE';
            const altLang = selfLang === 'de-DE' ? 'en-US' : 'de-DE';
            item.links = [
              { url, lang: selfLang },
              { url: `https://boatpass.de${altPath}`, lang: altLang },
            ];
          }
        }

        return item;
      },
    }),
  ]
});