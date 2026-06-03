import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number(),
    lang: z.enum(['de', 'en']),
    author: z.string().default('Marius Gehler'),
    /** Slug des Artikels in der jeweils anderen Sprache (für hreflang DE↔EN). */
    altSlug: z.string().optional(),
  }),
});

export const collections = { blog };
