import gplay from 'google-play-scraper';

export interface AppRating {
  score: number;
  ratings: number;
}

export async function getPlayStoreRating(appId = 'com.boatpass.app'): Promise<AppRating> {
  try {
    const app = await gplay.app({ appId, throttle: 1 });
    return {
      score: Math.round((app.score ?? 0) * 10) / 10,
      ratings: app.ratings ?? 0,
    };
  } catch {
    return { score: 0, ratings: 0 };
  }
}
