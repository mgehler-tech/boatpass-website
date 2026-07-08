import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    /** Datum der letzten inhaltlichen Aktualisierung (Frische-Signal für dateModified). */
    updated: z.date().optional(),
    image: z.string().optional(),
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
  }),
});

export const collections = { blog };
