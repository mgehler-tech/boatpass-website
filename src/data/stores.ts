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

export function formatPrice(cents: number, lang: Lang): string {
  const value = (cents / 100).toFixed(2);
  return lang === 'de' ? `${value.replace('.', ',')} €` : `€${value}`;
}

const STORE_NAME: Record<Platform, Record<Lang, string>> = {
  android: { de: 'bei Google Play', en: 'on Google Play' },
  ios: { de: 'im App Store', en: 'on the App Store' },
};

/** Formatierter Preis eines Produkts auf einer Plattform, z. B. „8,99 €". */
export function storePrice(key: ProductKey, platform: Platform, lang: Lang): string {
  const cents = PRICES[key][platform];
  if (cents === null) throw new Error(`${key} ist auf ${platform} nicht erhältlich`);
  return formatPrice(cents, lang);
}

/** true, wenn ein Produkt in beiden Stores gleich viel kostet. */
export function samePrice(key: ProductKey): boolean {
  const { android, ios } = PRICES[key];
  return android !== null && android === ios;
}

/**
 * Preis für Fließtext: identische Preise einmal, abweichende mit Store,
 * z. B. „7,99 € bei Google Play bzw. 8,99 € im App Store".
 */
export function priceText(key: ProductKey, lang: Lang): string {
  if (samePrice(key)) return storePrice(key, 'android', lang);
  const parts = (['android', 'ios'] as const)
    .filter((p) => PRICES[key][p] !== null)
    .map((p) => `${storePrice(key, p, lang)} ${STORE_NAME[p][lang]}`);
  return parts.join(lang === 'de' ? ' bzw. ' : ' or ');
}

/** Niedrigster Kaufpreis der genannten Produkte über beide Stores – für „ab"-Angaben. */
export function minPrice(keys: ProductKey[], lang: Lang): string {
  const all = keys.flatMap((k) => [PRICES[k].android, PRICES[k].ios]).filter((v): v is number => v !== null);
  return formatPrice(Math.min(...all), lang);
}

/** Höchster Kaufpreis der genannten Produkte über beide Stores. */
export function maxPrice(keys: ProductKey[], lang: Lang): string {
  const all = keys.flatMap((k) => [PRICES[k].android, PRICES[k].ios]).filter((v): v is number => v !== null);
  return formatPrice(Math.max(...all), lang);
}

export const ALL_PRODUCTS = Object.keys(PRICES) as ProductKey[];

/** Ersparnis eines Pakets gegenüber den Einzelkäufen auf einer Plattform (Cent). */
export function bundleSaving(bundle: ProductKey, parts: ProductKey[], platform: Platform): number {
  const total = parts.reduce((sum, k) => sum + (PRICES[k][platform] ?? 0), 0);
  return total - (PRICES[bundle][platform] ?? total);
}

/**
 * Preishinweis (PAngV) für die Geräte-Variante `platform`: welche Preise gelten
 * und was im jeweils anderen Store anders kostet, inkl. iOS-Funk-Paket.
 */
export function priceNote(platform: Platform, lang: Lang): string {
  const de = lang === 'de';
  const diffKeys = (['ubi', 'src', 'lrc', 'bundleSbf'] as ProductKey[]).filter((k) => !samePrice(k));
  const diffNames: Partial<Record<ProductKey, string>> = {
    ubi: 'UBI', src: 'SRC', lrc: 'LRC',
    bundleSbf: de ? 'Paket Binnen + See' : 'Inland + Coastal bundle',
  };
  const listFor = (p: Platform) => diffKeys.map((k) => `${diffNames[k]} ${storePrice(k, p, lang)}`).join(', ');
  const funkBundle = storePrice('bundleFunk', 'ios', lang);
  if (platform === 'android') {
    return de
      ? `Preise inkl. MwSt. bei Google Play (Android). Im App Store (iPhone & iPad) gelten teils andere Preise: ${listFor('ios')}; zusätzlich gibt es dort das Funk-Paket (UBI + SRC + LRC) für ${funkBundle}. Stand: ${PRICES_AS_OF.de}.`
      : `Prices incl. VAT on Google Play (Android). Some prices differ on the App Store (iPhone & iPad): ${listFor('ios')}; there is also a radio bundle (UBI + SRC + LRC) for ${funkBundle}. As of ${PRICES_AS_OF.en}.`;
  }
  return de
    ? `Preise inkl. MwSt. im App Store (iPhone & iPad), dazu das Funk-Paket (UBI + SRC + LRC) für ${funkBundle}. Bei Google Play (Android) gelten teils andere Preise: ${listFor('android')}. Stand: ${PRICES_AS_OF.de}.`
    : `Prices incl. VAT on the App Store (iPhone & iPad), plus a radio bundle (UBI + SRC + LRC) for ${funkBundle}. Some prices differ on Google Play (Android): ${listFor('android')}. As of ${PRICES_AS_OF.en}.`;
}

/** schema.org-Offers je Store, z. B. für Product/Course-Markup. */
export function schemaOffers(key: ProductKey) {
  return (['android', 'ios'] as const)
    .filter((p) => PRICES[key][p] !== null)
    .map((p) => ({
      '@type': 'Offer',
      price: ((PRICES[key][p] as number) / 100).toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: p === 'android' ? PLAY_STORE_URL : APP_STORE_URL,
      seller: { '@type': 'Organization', name: p === 'android' ? 'Google Play' : 'App Store' },
    }));
}
