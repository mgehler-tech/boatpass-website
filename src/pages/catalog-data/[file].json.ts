/**
 * Daten für den Fragebogen im Browser (components/catalog/PracticeTest):
 * Fragen und Antworten einer Sprache ohne Erklärungen, die amtlichen
 * Fragebögen, Bild-URLs und der Link zur Frage auf ihrer Themenseite.
 * Wird erst beim Start eines Bogens geladen, damit die Seite selbst leicht bleibt.
 *
 *   /catalog-data/binnen-de.json, binnen-en.json, see-de.json, see-en.json
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { QUESTIONS, SHEETS, questionUrl, figureWidth, type CatalogKey, type Lang } from '../../data/catalog';

export const getStaticPaths = (() =>
  (['binnen', 'see'] as const).flatMap(catalog =>
    (['de', 'en'] as const).map(lang => ({ params: { file: `${catalog}-${lang}` }, props: { catalog, lang } })),
  )) satisfies GetStaticPaths;

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/catalog/**/*.webp', { eager: true });

async function pack(catalog: CatalogKey, lang: Lang, part: string) {
  return Promise.all(
    QUESTIONS[catalog].map(async q => ({
      n: q.n,
      part: part === 'spec' && q.section === 'segeln' ? 'segeln' : part,
      q: q.q[lang],
      a: q.a.map(x => x[lang]),
      img: await Promise.all(
        q.img.map(async p => {
          const src = images[`/src/assets/catalog/${p}`].default;
          const width = figureWidth(src.width, src.height);
          const out = await getImage({ src, width, densities: [1, 2] });
          return { src: out.src, srcset: out.srcSet.attribute, w: out.attributes.width, h: out.attributes.height };
        }),
      ),
      url: questionUrl(catalog, q.n, lang),
    })),
  );
}

export const GET: APIRoute = async ({ props }) => {
  const { catalog, lang } = props as { catalog: 'binnen' | 'see'; lang: Lang };
  const basis = await pack('basis', lang, 'basis');
  const spec = await pack(catalog, lang, 'spec');
  const body = {
    sheets: catalog === 'binnen' ? SHEETS.binnenMotor : SHEETS.see,
    segelSheets: catalog === 'binnen' ? SHEETS.binnenSegelErgaenzung : undefined,
    questions: [...basis, ...spec],
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
