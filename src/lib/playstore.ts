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
      {
        // Ohne Browser-UA liefern Datacenter-IPs (z.B. GitHub Actions) teils eine
        // abweichende/bot-gedrosselte Seite ohne das eingebettete JSON-LD.
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        },
      },
    );
    if (!res.ok) {
      console.warn(`[playstore] HTTP ${res.status} für ${appId}`);
      return { score: 0, ratings: 0 };
    }

    const html = await res.text();
    const match = html.match(
      /<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/,
    );
    if (!match) {
      console.warn(`[playstore] kein ld+json-Block gefunden für ${appId} (Länge: ${html.length})`);
      return { score: 0, ratings: 0 };
    }

    const data = JSON.parse(match[1]);
    const rating = data?.aggregateRating;
    const score = Number(rating?.ratingValue);
    const ratings = Number(rating?.ratingCount);
    if (!Number.isFinite(score) || !Number.isFinite(ratings)) {
      console.warn(`[playstore] aggregateRating fehlt/ungültig für ${appId}: ${JSON.stringify(rating)}`);
      return { score: 0, ratings: 0 };
    }

    return { score: Math.round(score * 10) / 10, ratings };
  } catch (err) {
    console.warn(`[playstore] Fetch fehlgeschlagen für ${appId}:`, err);
    return { score: 0, ratings: 0 };
  }
}
