/**
 * Zentrale Datenquelle für den Anbietervergleich auf den App-Landingpages.
 *
 * Alle fünf Vergleichsseiten (Hub, SBF See, SBF Binnen, Funkschein, kostenlos)
 * lesen ausschließlich hier. Keine Zahl darf in einer .astro-Datei stehen –
 * sonst driften die Seiten bei der nächsten Preisänderung auseinander.
 *
 * Stand der Erhebung: siehe DATA_AS_OF. Quellen sind die jeweiligen
 * Play-Store-Listings und Anbieter-Websites.
 */

export interface AppRating {
  score: number;
  ratings: number;
}

export type LicenseKey =
  | 'sbf-see'
  | 'sbf-binnen'
  | 'ubi'
  | 'src'
  | 'lrc'
  | 'sks'
  | 'bsp'
  | 'fkn';

export const LICENSE_LABELS: Record<LicenseKey, { de: string; en: string }> = {
  'sbf-see': { de: 'SBF See', en: 'SBF See (coastal)' },
  'sbf-binnen': { de: 'SBF Binnen', en: 'SBF Binnen (inland)' },
  ubi: { de: 'UBI', en: 'UBI' },
  src: { de: 'SRC', en: 'SRC' },
  lrc: { de: 'LRC', en: 'LRC' },
  sks: { de: 'SKS', en: 'SKS' },
  bsp: { de: 'Bodenseeschifferpatent', en: 'Lake Constance licence' },
  fkn: { de: 'FKN (Pyroschein)', en: 'FKN (pyrotechnics)' },
};

/** 'free' = dauerhaft kostenlos, 'freemium-onetime' = gratis + Einmalkauf, 'freemium-sub' = gratis + Abo */
export type PricingModel = 'free' | 'freemium-onetime' | 'freemium-sub';

export interface LearningApp {
  id: string;
  name: string;
  vendor: string;
  playUrl: string | null;
  appStoreUrl: string | null;
  website: string | null;
  /** Play-Store-Bewertung, null wenn nicht erhoben */
  rating: number | null;
  ratingCount: number | null;
  /** Play-Store-Downloadklasse, z. B. '100.000+' */
  downloads: string | null;
  licenses: LicenseKey[];
  pricingModel: PricingModel;
  /** Kurzform für die Tabellenspalte „Preis" */
  price: { de: string; en: string };
  /** true = alle Scheine in einer App, false = pro Schein eine eigene App */
  singleApp: boolean;
  offline: boolean | 'partial' | null;
  examSimulation: boolean | null;
  /** Unsere eigene App – löst den Transparenzhinweis aus */
  isOwn: boolean;
  summary: { de: string; en: string };
  bestFor: { de: string; en: string };
}

/** Stand der Wettbewerbsdaten. Wird auf allen Vergleichsseiten sichtbar ausgegeben. */
export const DATA_AS_OF = '2026-07-21';
export const DATA_AS_OF_LABEL = { de: '21. Juli 2026', en: '21 July 2026' };

/** Alphabetisch nach Name sortiert – BoatPass steht bewusst nicht an erster Stelle. */
export const LEARNING_APPS: LearningApp[] = [
  {
    id: 'boatpass',
    name: 'Boatpass',
    vendor: 'Boatpass',
    playUrl: 'https://play.google.com/store/apps/details?id=com.boatpass.app',
    appStoreUrl: null,
    website: 'https://boatpass.de/',
    rating: 5.0,
    ratingCount: 8,
    downloads: '10+',
    licenses: ['sbf-see', 'sbf-binnen', 'ubi', 'src', 'lrc'],
    pricingModel: 'freemium-onetime',
    price: { de: '0 € / 7,99–16,98 € einmalig', en: '€0 / €7.99–16.98 one-off' },
    singleApp: true,
    offline: true,
    examSimulation: true,
    isOwn: true,
    summary: {
      de: 'Deckt fünf Scheine – SBF See, SBF Binnen, UBI, SRC und LRC – in einer einzigen App ab. Freischaltung je Katalog per Einmalkauf, kein Abo. Mit Prüfungssimulation, Fehler-Training und Fortschritt nach Kategorie. Jung am Markt und entsprechend wenig bewertet.',
      en: 'Covers five licences – SBF See, SBF Binnen, UBI, SRC and LRC – in a single app. Each catalogue unlocks via one-off purchase, no subscription. Includes exam simulation, mistake training and per-category progress. New to the market and accordingly few ratings.',
    },
    bestFor: {
      de: 'Wer mehrere Scheine macht und kein Abo will.',
      en: 'Anyone taking several licences who does not want a subscription.',
    },
  },
  {
    id: 'bootspruefung',
    name: 'Bootspruefung.de',
    vendor: 'Bootspruefung.de',
    playUrl: 'https://play.google.com/store/apps/details?id=de.sbfbinnen.app',
    appStoreUrl: 'https://apps.apple.com/de/app/bootspruefung-de/id1118642913',
    website: 'https://www.bootspruefung.de/',
    rating: 4.9,
    ratingCount: 8880,
    downloads: '100.000+',
    licenses: ['sbf-see', 'sbf-binnen', 'bsp', 'ubi', 'src', 'lrc', 'fkn'],
    pricingModel: 'freemium-onetime',
    price: { de: 'Fragen gratis, Pro kostenpflichtig', en: 'Questions free, Pro paid' },
    singleApp: true,
    offline: 'partial',
    examSimulation: true,
    isOwn: false,
    summary: {
      de: 'Der Platzhirsch: seit 2013 am Markt, nach eigenen Angaben über 900.000 Kunden, die breiteste Scheinabdeckung im Test. Alle amtlichen Prüfungsfragen sind kostenlos nutzbar; Theorietexte, vollständige Offline-Nutzung und PDF-Downloads stecken in der Pro-Version. Der Lernfortschritt synchronisiert mit dem Onlinekurs der Website.',
      en: 'The market leader: on sale since 2013, over 900,000 customers by its own account, and the broadest licence coverage here. All official exam questions are free to use; theory texts, full offline use and PDF downloads sit behind Pro. Progress syncs with the website course.',
    },
    bestFor: {
      de: 'Wer die größte Auswahl an Scheinen und einen begleitenden Onlinekurs will.',
      en: 'Anyone wanting the widest licence coverage plus a companion online course.',
    },
  },
  {
    id: 'sailbyte',
    name: 'Sailbyte',
    vendor: 'Sailbyte',
    playUrl: 'https://play.google.com/store/apps/details?id=com.sbf_binnen_trainer',
    appStoreUrl: null,
    website: 'https://sailbyte.de/',
    rating: null,
    ratingCount: null,
    downloads: '3.000+',
    licenses: ['sbf-see', 'sbf-binnen', 'sks'],
    pricingModel: 'freemium-sub',
    price: { de: '4,79 € / Monat je App', en: '€4.79 / month per app' },
    singleApp: false,
    offline: 'partial',
    examSimulation: true,
    isOwn: false,
    summary: {
      de: 'Drei getrennte Apps für SBF See, SBF Binnen und SKS mit adaptivem Lernplan, Karteikarten und KI-Feedback. Premium läuft als monatlich kündbares Abo – je Schein ein eigenes. SBF See und Binnen sind offline nutzbar, SKS braucht eine Internetverbindung. Erklärungen zu den Antworten sind laut Anbieter in Arbeit.',
      en: 'Three separate apps for SBF See, SBF Binnen and SKS with an adaptive study plan, flashcards and AI feedback. Premium is a monthly subscription – one per licence. SBF See and Binnen work offline, SKS needs a connection. Answer explanations are announced as coming.',
    },
    bestFor: {
      de: 'Wer genau einen Schein macht und ein Abo akzeptiert.',
      en: 'Anyone taking exactly one licence who accepts a subscription.',
    },
  },
  {
    id: 'goritz-binnen',
    name: 'SBF Binnen',
    vendor: 'Ralf Goritz',
    playUrl: 'https://play.google.com/store/apps/details?id=de.goritz.android.binnen2',
    appStoreUrl: 'https://apps.apple.com/de/app/sbf-binnen/id540303206',
    website: 'https://sbf.goritz.de/',
    rating: 4.8,
    ratingCount: 567,
    downloads: '10.000+',
    licenses: ['sbf-binnen'],
    pricingModel: 'freemium-onetime',
    price: { de: 'Gratis-Version + Vollversion per In-App-Kauf', en: 'Free version + full version via in-app purchase' },
    singleApp: false,
    offline: true,
    examSimulation: true,
    isOwn: false,
    summary: {
      de: 'Die durchdachteste Lernmechanik im Feld: klassische Leitner-Lernboxen wahlweise automatisch oder manuell, dazu ein eigener Modus für unsichere Fragen. Enthält ein Lehrbuch mit Erklärung zu jeder Frage, Multiple-Choice-Tipps, alle Prüfungsknoten und eine Statistik zum Lernfortschritt. Läuft vollständig ohne Internetverbindung.',
      en: 'The most carefully built learning mechanic in this field: classic Leitner boxes either automatic or manual, plus a dedicated mode for questions you are unsure about. Includes a textbook explaining every question, multiple-choice tips, all exam knots and a progress statistic. Runs entirely without an internet connection.',
    },
    bestFor: {
      de: 'Wer den SBF Binnen wirklich verstehen statt auswendig lernen will.',
      en: 'Anyone who wants to understand SBF Binnen rather than memorise it.',
    },
  },
  {
    id: 'sbf-fragen',
    name: 'SBF-Fragen',
    vendor: 'Delius Klasing Verlag',
    playUrl: 'https://play.google.com/store/apps/details?id=de.deliusklasing.sbffragen2.app',
    appStoreUrl: 'https://apps.apple.com/de/app/sbf-fragen-bootsf%C3%BChrerschein/id1658976227',
    website: 'https://sbf-fragen.de/',
    rating: 4.7,
    ratingCount: 647,
    downloads: null,
    licenses: ['sbf-see', 'sbf-binnen', 'sks', 'bsp', 'ubi', 'src', 'lrc', 'fkn'],
    pricingModel: 'freemium-onetime',
    price: { de: 'Gratis eingeschränkt + In-App-Kauf je Schein', en: 'Limited free + in-app purchase per licence' },
    singleApp: true,
    offline: true,
    examSimulation: true,
    isOwn: false,
    summary: {
      de: 'Aus dem Delius-Klasing-Verlag, mit Karteikasten-System, Prüfungssimulation nach Original-Bögen, Offline-Lernen und Cloud-Sync über mehrere Geräte. Praktisch: Wer bereits einen Schein besitzt, bekommt nur die tatsächlich noch nötigen Fragen. Die kostenlose Version zeigt nur eine Auswahl des Katalogs.',
      en: 'From publisher Delius Klasing, with a spaced-repetition box, exam simulation on original papers, offline learning and cloud sync across devices. Neat touch: if you already hold a licence, you only get the questions you still need. The free version shows only a subset of the catalogue.',
    },
    bestFor: {
      de: 'Wer schon einen Schein hat und nur die Differenzfragen lernen will.',
      en: 'Anyone who already holds a licence and only needs the remaining questions.',
    },
  },
  {
    id: 'wimmer-binnen',
    name: 'Sportbootführerschein Binnen',
    vendor: 'Matthias Wimmer',
    playUrl: 'https://play.google.com/store/apps/details?id=eu.wimmerinformatik.sbfb',
    appStoreUrl: null,
    website: null,
    rating: 4.9,
    ratingCount: 772,
    downloads: '100.000+',
    licenses: ['sbf-binnen'],
    pricingModel: 'free',
    price: { de: 'Kostenlos', en: 'Free' },
    singleApp: false,
    offline: true,
    examSimulation: null,
    isOwn: false,
    summary: {
      de: 'Vollständig kostenlos, ohne Werbung, ohne Nutzertracking und ohne zusätzliche Berechtigungen. Der komplette amtliche Katalog – Basis-, Binnenerweiterungs- und Segelzusatzfragen – nach dem Karteikasten-Prinzip: Jede Frage muss fünfmal richtig beantwortet werden. Keine Erklärungstexte, kein Schnickschnack.',
      en: 'Completely free, no ads, no user tracking, no extra permissions. The full official catalogue – base, inland and sailing supplement questions – on a spaced-repetition principle: every question must be answered correctly five times. No explanations, no frills.',
    },
    bestFor: {
      de: 'Wer nur den SBF Binnen braucht und keinen Cent ausgeben will.',
      en: 'Anyone who only needs SBF Binnen and wants to spend nothing.',
    },
  },
  {
    id: 'wimmer-see',
    name: 'Sportbootführerschein See 2023',
    vendor: 'Matthias Wimmer',
    playUrl: 'https://play.google.com/store/apps/details?id=eu.wimmerinformatik.sbfs',
    appStoreUrl: null,
    website: null,
    rating: 4.8,
    ratingCount: 703,
    downloads: '100.000+',
    licenses: ['sbf-see'],
    pricingModel: 'free',
    price: { de: 'Kostenlos', en: 'Free' },
    singleApp: false,
    offline: true,
    examSimulation: null,
    isOwn: false,
    summary: {
      de: 'Das See-Pendant zur Binnen-App desselben Entwicklers: komplett kostenlos, werbefrei, ohne In-App-Käufe. Enthält den amtlichen Fragenkatalog SBF See nach dem gleichen Wiederholungsprinzip. Navigationsaufgaben und Kartenarbeit deckt sie nicht ab.',
      en: 'The coastal counterpart to the same developer’s inland app: entirely free, ad-free, no in-app purchases. Contains the official SBF See question catalogue on the same repetition principle. It does not cover navigation tasks or chartwork.',
    },
    bestFor: {
      de: 'Wer nur den SBF See braucht und nichts zahlen möchte.',
      en: 'Anyone who only needs SBF See and does not want to pay.',
    },
  },
];

/** Alle Apps, die den angegebenen Schein abdecken – Reihenfolge bleibt alphabetisch. */
export function appsForLicense(license: LicenseKey): LearningApp[] {
  return LEARNING_APPS.filter((app) => app.licenses.includes(license));
}

/** Apps, die dauerhaft ohne Bezahlung nutzbar sind. */
export function freeApps(): LearningApp[] {
  return LEARNING_APPS.filter((app) => app.pricingModel === 'free');
}

export function appById(id: string): LearningApp {
  const app = LEARNING_APPS.find((a) => a.id === id);
  if (!app) throw new Error(`Unbekannte App-ID: ${id}`);
  return app;
}

/**
 * Boatpass-Rating für die MobileApplication-Schema der Startseite.
 * Manuell gepflegt statt per Live-Scraping (Google liefert Play-Store-Ratings
 * an Datacenter-/CI-IPs wie GitHub Actions nicht zuverlässig aus – Stand DATA_AS_OF).
 */
export function getBoatpassRating(): AppRating | null {
  const app = appById('boatpass');
  if (!app.rating || !app.ratingCount) return null;
  return { score: app.rating, ratings: app.ratingCount };
}

/** JSON-LD SoftwareApplication für eine App. aggregateRating nur, wenn Bewertungen vorliegen. */
export function softwareApplicationSchema(app: LearningApp, lang: 'de' | 'en') {
  const os = [app.playUrl ? 'Android' : null, app.appStoreUrl ? 'iOS' : null]
    .filter(Boolean)
    .join(', ');

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: 'EducationalApplication',
    operatingSystem: os,
    ...(app.playUrl ? { downloadUrl: app.playUrl } : {}),
    ...(app.website ? { url: app.website } : {}),
    author: { '@type': 'Organization', name: app.vendor },
    description: app.summary[lang],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: app.pricingModel === 'free' ? '0' : '0',
      description: app.price[lang],
    },
    ...(app.rating && app.ratingCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: app.rating.toFixed(1),
            ratingCount: String(app.ratingCount),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };
}
