export interface AppRating {
  score: number;
  ratings: number;
}

/**
 * Play-Store-Detailseiten betten selbst ein SoftwareApplication-JSON-LD mit
 * aggregateRating ein – zuverlässiger als das Parsen der internen Seiten-JSONs,
 * auf dem frühere Scraper-Bibliotheken aufbauten (brach nach Google-Änderungen
 * lautlos, lieferte nur noch leere Felder statt eines Fehlers).
 */
export async function getPlayStoreRating(appId = 'com.boatpass.app'): Promise<AppRating> {
  try {
    const res = await fetch(
      `https://play.google.com/store/apps/details?id=${appId}&hl=de`,
    );
    if (!res.ok) return { score: 0, ratings: 0 };

    const html = await res.text();
    const match = html.match(
      /<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/,
    );
    if (!match) return { score: 0, ratings: 0 };

    const data = JSON.parse(match[1]);
    const rating = data?.aggregateRating;
    const score = Number(rating?.ratingValue);
    const ratings = Number(rating?.ratingCount);
    if (!Number.isFinite(score) || !Number.isFinite(ratings)) {
      return { score: 0, ratings: 0 };
    }

    return { score: Math.round(score * 10) / 10, ratings };
  } catch {
    return { score: 0, ratings: 0 };
  }
}
