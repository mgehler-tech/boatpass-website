import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /**
     * Kurzform des Titels für das <title>-Tag. Der H1-Titel darf länger und
     * erzählerischer sein; Google schneidet die SERP-Anzeige aber bei ~60 Zeichen ab
     * – inklusive des Suffixes " | Boatpass" (11 Zeichen). Also: max. 47 Zeichen.
     * Nur setzen, wenn `title` zu lang ist; sonst wird `title` verwendet.
     */
    seoTitle: z.string().max(47).optional(),
    description: z.string(),
    date: z.date(),
    /** Datum der letzten inhaltlichen Aktualisierung (Frische-Signal für dateModified). */
    updated: z.date().optional(),
    image: z.string().optional(),
    /** Alt-Text für das Hero-Bild (siehe BlogLayout). Nur nötig, wenn `image` gesetzt ist. */
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number(),
    lang: z.enum(['de', 'en']),
    author: z.string().default('Marius Gehler'),
    /** Slug des Artikels in der jeweils anderen Sprache (für hreflang DE↔EN). */
    altSlug: z.string().optional(),
    /**
     * Optionale FAQ-Paare für FAQPage-JSON-LD (siehe BlogLayout). Die Fragen und
     * Antworten müssen den im Artikel sichtbaren Inhalt widerspiegeln – nur so ist
     * das Rich-Result-Schema Google-konform. Frage/Antwort als Klartext (kein Markdown).
     */
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
    /**
     * Optionale Schritt-für-Schritt-Anleitung für HowTo-JSON-LD (siehe BlogLayout).
     * Nur setzen, wenn der Artikel einen einzelnen, klar abgegrenzten Ablauf beschreibt;
     * die Schritte müssen den im Artikel sichtbaren Inhalt widerspiegeln.
     */
    howTo: z
      .object({
        name: z.string(),
        description: z.string(),
        steps: z.array(
          z.object({
            name: z.string(),
            text: z.string(),
          }),
        ),
      })
      .optional(),
  }),
});

export const collections = { blog };
