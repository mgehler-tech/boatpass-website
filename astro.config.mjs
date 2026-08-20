// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://boatpass.de';
const OUT_DIR = fileURLToPath(new URL('./dist/', import.meta.url));

// Sprachcodes exakt so, wie die `i18n`-Option der Sitemap sie ausgibt.
/** @type {Record<string, string | undefined>} */
const SITEMAP_LOCALE = { de: 'de-DE', en: 'en-US' };

// Die `i18n`-Option paart DE/EN allein über den Pfad (`/x` <-> `/en/x`) und
// findet deshalb kein Gegenstück, sobald der Slug übersetzt ist
// (`/blog/seekarte-lesen-lernen/` <-> `/en/blog/reading-nautical-charts/`).
// Ergebnis: nur 14 von 200 URLs bekamen hreflang-Alternates in der Sitemap.
// Das gerenderte HTML kennt die Paarung bereits (SEO.astro, `altUrl`) – von
// dort übernommen, können Sitemap und Seiten-Markup nicht auseinanderlaufen.
/** @param {string} url */
function alternatesFromHtml(url) {
  const pathname = url.startsWith(SITE) ? url.slice(SITE.length) : url;
  const file = join(OUT_DIR, pathname.replace(/^\//, ''), 'index.html');
  if (!existsSync(file)) return undefined;

  const links = [];
  for (const [tag] of readFileSync(file, 'utf8').matchAll(/<link\s[^>]*rel="alternate"[^>]*>/g)) {
    const lang = tag.match(/hreflang="([^"]+)"/)?.[1];
    const href = tag.match(/href="([^"]+)"/)?.[1];
    const locale = lang && SITEMAP_LOCALE[lang];
    if (locale && href) links.push({ lang: locale, url: href });
  }
  // Erst ab zwei Sprachversionen ist es ein hreflang-Cluster. Seiten ohne
  // Gegenstück (`hasAlternate={false}`) bleiben bewusst ohne Alternates.
  return links.length > 1 ? links : undefined;
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
        const links = alternatesFromHtml(url);
        if (links) item.links = links;
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
        return item;
      },
    }),
  ]
});