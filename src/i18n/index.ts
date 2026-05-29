import { de } from './de';
import { en } from './en';

export type Lang = 'de' | 'en';

const translations = { de, en };

export function useTranslations(lang: Lang) {
  return translations[lang];
}

export function getLangFromUrl(url: URL): Lang {
  const [, firstSegment] = url.pathname.split('/');
  if (firstSegment === 'en') return 'en';
  return 'de';
}

export function getLocalizedPath(lang: Lang, path: string): string {
  if (lang === 'de') return path;
  return `/en${path}`;
}
