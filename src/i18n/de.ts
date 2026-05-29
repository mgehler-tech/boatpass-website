export const de = {
  nav: {
    blog: 'Blog',
    faq: 'FAQ',
    about: 'Über uns',
    contact: 'Kontakt',
    getApp: 'App laden',
  },
  hero: {
    headline: 'Der schnellste Weg zum Sportbootführerschein',
    subline: 'Lerne mit offiziellen Prüfungsfragen, simuliere die echte Prüfung und bestehe beim ersten Versuch.',
    cta: 'Kostenlos starten',
    ctaSecondary: 'Mehr erfahren',
  },
  features: {
    title: 'Alles was du brauchst',
    learn: {
      title: 'Lernmodus',
      desc: 'Lerne Fragen mit sofortigem Feedback und verständlichen Erklärungen.',
    },
    exam: {
      title: 'Prüfungssimulation',
      desc: 'Simuliere die echte Prüfung unter realistischen Bedingungen.',
    },
    training: {
      title: 'Fehler-Training',
      desc: 'Fokussiere dich auf schwache Kategorien und trainiere gezielt.',
    },
  },
  howItWorks: {
    title: 'So funktioniert\'s',
    step1: 'App laden',
    step2: 'Kategorie wählen',
    step3: 'Prüfung bestehen',
  },
  pricing: {
    title: 'Einfache Preisgestaltung',
    free: 'Kostenlos',
    premium: 'Premium',
    price: 'Einmalig 4,99 €',
    cta: 'Jetzt kostenlos starten',
    freeFeatures: ['20 Übungsfragen', 'Lernmodus', '1 Kategorie'],
    premiumFeatures: ['Alle 400+ Fragen', 'Prüfungssimulation', 'Fehler-Training', 'Alle Kategorien', 'Statistiken'],
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
