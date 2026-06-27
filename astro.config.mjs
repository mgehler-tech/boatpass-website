// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

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
        item.lastmod = new Date().toISOString();
        if (path === '/' || path === '') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (/^\/(sbf-binnen|sbf-see|sbf-kosten|sbf-pruefung-ablauf|sbf-binnen-pruefungsfragen|sbf-see-pruefungsfragen|fuehrerscheine|licenses)\/?$/.test(path)) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (/^\/(src|ubi|lrc|faq)\/?$/.test(path)) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (path.startsWith('/tools/')) {
          // Linkable Assets (Konfigurator etc.) – hoch priorisieren als Backlink-Magneten.
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