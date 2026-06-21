import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

// Alle Blog-Artikel (DE + EN) als Quelle. Key = post.id, z.B. "de/5-tipps-sbf-bestehen".
const posts = await getCollection('blog');
const pages = Object.fromEntries(posts.map((p) => [p.id, p.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description:
      page.lang === 'de'
        ? 'Sportbootführerschein einfach lernen – Boatpass'
        : 'Learn your boating licence the easy way – Boatpass',
    bgGradient: [
      [26, 31, 54], // #1A1F36 dunkles Navy
      [51, 102, 255], // #3366FF Brand-Blau
    ],
    border: {
      color: [51, 102, 255],
      width: 18,
      side: 'inline-start',
    },
    padding: 70,
    font: {
      title: {
        color: [255, 255, 255],
        size: 62,
        weight: 'Bold',
        lineHeight: 1.15,
        families: ['Inter'],
      },
      description: {
        color: [200, 214, 245],
        size: 28,
        weight: 'Medium',
        families: ['Inter'],
      },
    },
    fonts: ['./src/assets/fonts/Inter.ttf'],
    format: 'PNG',
  }),
});
