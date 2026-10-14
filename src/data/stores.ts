/**
 * Zentrale Store-Links und Preise der BoatPass-Apps (Android + iOS).
 *
 * Keine Store-URL und kein Preis darf hart in einer .astro-Datei stehen –
 * sonst driften Seiten bei der nächsten Preisänderung auseinander, und eine
 * falsche Preisangabe ist wettbewerbsrechtlich angreifbar (PAngV/UWG).
 *
 * Preise je Plattform: Apple erlaubt nur feste Preisstufen, deshalb weichen
 * einzelne Preise zwischen Google Play und App Store ab. Stand: siehe PRICES_AS_OF.
 * Quelle iOS: In-App-Käufe auf https://apps.apple.com/de/app/boatpass/id6797036145
 */

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.boatpass.app';
export const APP_STORE_ID = '6797036145';
export const APP_STORE_URL = `https://apps.apple.com/de/app/boatpass/id${APP_STORE_ID}`;
/** Ohne Länderkürzel leitet Apple auf die Storefront der Besucher:innen weiter. */
export const APP_STORE_URL_INTL = `https://apps.apple.com/app/boatpass/id${APP_STORE_ID}`;

export type Lang = 'de' | 'en';
export type Platform = 'android' | 'ios';

export const appStoreUrl = (lang: Lang) => (lang === 'de' ? APP_STORE_URL : APP_STORE_URL_INTL);

/** Geräteweiche: leitet je nach Gerät in den passenden Store (Ziel für QR-Codes, Social, Flyer). */
export const smartAppPath = (lang: Lang) => (lang === 'de' ? '/app/' : '/en/app/');

export const storeBadge = {
  play: {
    de: { src: '/images/google-play-badge-1_de_.png', alt: 'Jetzt bei Google Play' },
    en: { src: '/images/google-play-badge-2_en_.png', alt: 'Get it on Google Play' },
  },
  ios: {
    de: { src: '/images/app-store-badge-de.svg', alt: 'Laden im App Store' },
    en: { src: '/images/app-store-badge-en.svg', alt: 'Download on the App Store' },
  },
} as const;

export const PRICES_AS_OF = { de: 'Oktober 2026', en: 'October 2026' };

export type ProductKey = 'sbfBinnen' | 'sbfSee' | 'ubi' | 'src' | 'lrc' | 'bundleSbf' | 'bundleFunk';

/** Preise in Cent inkl. MwSt. `null` = auf dieser Plattform nicht erhältlich. */
export const PRICES: Record<ProductKey, Record<Platform, number | null>> = {
  sbfBinnen: { android: 999, ios: 999 },
  sbfSee: { android: 999, ios: 999 },
  ubi: { android: 799, ios: 899 },
  src: { android: 799, ios: 899 },
  lrc: { android: 999, ios: 799 },
  bundleSbf: { android: 1698, ios: 1699 },
  bundleFunk: { android: null, ios: 1799 },
};

export const PLATFORM_LABEL: Record<Platform, Record<Lang, string>> = {
  android: { de: 'Android', en: 'Android' },
  ios: { de: 'iPhone & iPad', en: 'iPhone & iPad' },
};

export function formatPrice(cents: number, lang: Lang): string {
  const value = (cents / 100).toFixed(2);
  return lang === 'de' ? `${value.replace('.', ',')} €` : `€${value}`;
}

/**
 * Preis für Fließtext: identische Preise einmal, abweichende je Plattform,
 * z. B. „7,99 € (Android) · 8,99 € (iPhone & iPad)".
 */
export function priceText(key: ProductKey, lang: Lang): string {
  const { android, ios } = PRICES[key];
  if (android !== null && ios !== null && android === ios) return formatPrice(android, lang);
  return (['android', 'ios'] as const)
    .filter((p) => PRICES[key][p] !== null)
    .map((p) => `${formatPrice(PRICES[key][p] as number, lang)} (${PLATFORM_LABEL[p][lang]})`)
    .join(' · ');
}

/** Niedrigster und höchster Kaufpreis über beide Stores – für „ab"-Angaben. */
export function priceRange(): { min: number; max: number } {
  const all = Object.values(PRICES).flatMap((p) => [p.android, p.ios]).filter((v): v is number => v !== null);
  return { min: Math.min(...all), max: Math.max(...all) };
}
