export const de = {
  nav: {
    blog: 'Blog',
    faq: 'FAQ',
    about: 'Über uns',
    contact: 'Kontakt',
    getApp: 'App laden',
  },
  hero: {
    badge: 'Offizieller DMYV-Fragenkatalog 2025/2026',
    headline1: 'Der schnellste',
    headline2: 'Weg zum',
    headlineAccent: 'SBF Binnen.',
    subline: 'Lern mit dem offiziellen Fragenkatalog — 3 Lernmodi, sofortiges Feedback, Prüfungssimulation. Kein Abo. Einmal zahlen, fertig.',
    cta: 'Kostenlos im Play Store',
    ctaSecondary: 'Features ansehen',
    stat1Num: '400+',
    stat1Label: 'Prüfungsfragen',
    stat2Num: '3',
    stat2Label: 'Lernmodi',
    stat3Num: '4,99 €',
    stat3Label: 'Einmalkauf',
    phoneGreeting: 'Guten Morgen ☀️',
    phonePlanTitle: 'Dein Lernplan',
    phoneCard1: 'Lernen',
    phoneCard1Sub: 'Kategorie wählen',
    phoneCard2: 'Prüfungsmodus',
    phoneCard2Sub: '30 Fragen · 45 Min',
    phoneCard3: 'Fehler-Training',
    phoneCard3Sub: '12 offene Fehler',
  },
  trust: {
    catalog: 'Offizieller ELWIS-Fragenkatalog',
    current: 'Stand August 2023 (aktuell gültig)',
    oneTime: 'Einmalkauf — kein Abo',
    languages: 'Deutsch & Englisch',
    darkMode: 'Dark Mode',
  },
  features: {
    chip: 'Features',
    title: 'Drei Wege zum Bestehen',
    subtitle: 'Lernmodus, Prüfungssimulation und gezieltes Fehler-Training — alles in einer App.',
    learn: {
      title: 'Lernmodus',
      desc: 'Fragen nach Kategorie, Sofortfeedback mit Erklärung. Navigation, Schifffahrtsrecht, Sicherheit, Wetterkunde und mehr.',
    },
    exam: {
      title: 'Prüfungssimulation',
      desc: 'Echte Prüfungsbedingungen: 30 Fragen, Zeitlimit, Bestehensgrenze. Feedback erst am Ende — wie beim Original.',
    },
    training: {
      title: 'Fehler-Training',
      desc: 'Trainiere gezielt deine Schwächen. Nur falsch beantwortete Fragen — kein Zeitverschwenden.',
    },
    progress: {
      title: 'Fortschritt & Statistik',
      desc: 'Ringdiagramm, Trefferquote je Kategorie, Lernzeit — du siehst immer genau, wo du stehst.',
    },
    darkMode: {
      title: 'Dark Mode & 2 Sprachen',
      desc: 'Augenschonendes Lernen am Abend. Vollständig auf Deutsch und Englisch verfügbar.',
    },
    catalog: {
      title: 'Offizieller Katalog',
      desc: '400+ Fragen aus dem offiziellen ELWIS-Katalog Binnen, Stand 01.08.2023. Exakt die Fragen der echten Prüfung.',
    },
  },
  howItWorks: {
    chip: 'So geht\'s',
    title: 'In 3 Schritten zur Prüfung',
    step1: 'App herunterladen',
    step1Desc: 'Kostenlos im Google Play Store. Sofort loslegen — kein Account nötig.',
    step2: 'Lernen & trainieren',
    step2Desc: 'Lernmodus, Prüfungssimulation oder Fehler-Training — du wählst deinen Weg.',
    step3: 'Prüfung bestehen',
    step3Desc: 'Mit dem offiziellen Fragenkatalog bestens vorbereitet in die echte Prüfung.',
  },
  pricing: {
    chip: 'Preise',
    title: 'Einmal zahlen. Für immer lernen.',
    subtitle: 'Kein Abo. Kein Risiko. Einmalkauf via Google Play.',
    free: 'Free',
    freeSub: 'Für immer kostenlos',
    premium: 'Premium',
    premiumSub: 'Einmalzahlung — kein Abo',
    popular: 'Beliebt',
    price: '€ 4,99',
    priceFree: '€ 0',
    cta: 'Kostenlos starten',
    ctaPremium: 'Jetzt freischalten',
    freeFeatures: ['20–30 Prüfungsfragen', '1–2 Kategorien', 'Lernmodus (Basis)'],
    premiumFeatures: ['400+ Prüfungsfragen', 'Alle Kategorien', 'Prüfungsmodus', 'Fehler-Training', 'Statistiken & Fortschritt', 'Dark Mode · DE & EN'],
  },
  blog: {
    title: 'Tipps & Wissenswertes',
    readMore: 'Weiterlesen',
    allArticles: 'Alle Artikel',
    minRead: 'Min. Lesezeit',
  },
  footer: {
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    contact: 'Kontakt',
    switchLang: 'English',
  },
  faq: {
    title: 'Häufige Fragen',
    subtitle: 'Alles rund um den Sportbootführerschein und die App',
  },
  about: {
    title: 'Über Boatpass',
  },
  contact: {
    title: 'Kontakt',
    name: 'Dein Name',
    email: 'E-Mail-Adresse',
    message: 'Deine Nachricht',
    send: 'Absenden',
    success: 'Nachricht gesendet! Wir melden uns bald.',
  },
} as const;

type Stringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? Stringify<U>[]
  : { [K in keyof T]: Stringify<T[K]> };

export type Translations = Stringify<typeof de>;
