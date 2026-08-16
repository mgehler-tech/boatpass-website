export const de = {
  nav: {
    blog: 'Blog',
    faq: 'FAQ',
    about: 'Über uns',
    contact: 'Kontakt',
    getApp: 'App laden',
  },
  hero: {
    // "Offizielle Lizenzen" war sachlich falsch: Boatpass vergibt keine
    // Lizenzen, amtlich sind die Fragenkataloge.
    badge: 'Amtlicher ELWIS-Katalog',
    // Die H1 nennt den Hauptsuchbegriff und bleibt konstant. Vorher tauschte
    // ein Intervall alle 2,5 s das letzte Wort ("SBF Binnen." / "SBF See." …),
    // wodurch weder "Sportbootführerschein" darin vorkam noch die Überschrift
    // für Screenreader stabil war. Die Rotation sitzt jetzt in `licenses`.
    headline1: 'Der schnellste',
    headline2: 'Weg zum',
    // Enthält nach "Sportboot" ein weiches Trennzeichen (U+00AD, unsichtbar).
    // Das Wort ist rund 11 px breit je Schriftgrößen-Pixel und passt ab 1024 px
    // Viewport nicht mehr in die Textspalte. Ohne vorgegebene Trennstelle greift
    // die globale h1-Regel `overflow-wrap: break-word` und trennt mitten im Wort
    // ("Sportbootführersche/in."). `hyphens: auto` genügt nicht, weil es vom
    // Trennwörterbuch des Browsers abhängt, das nicht überall vorhanden ist.
    headlineAccent: 'Sportboot­führerschein.',
    licenses: ['SBF Binnen', 'SBF See', 'UBI', 'SRC', 'LRC'],
    subline: 'Lern mit dem offiziellen Fragenkatalog – 3 Lernmodi, sofortiges Feedback, Prüfungssimulation. Kostenlos starten, kein Account nötig.',
    cta: 'Kostenlos im Play Store',
    ctaIos: 'iOS-App kommt bald',
    stat1Num: 'Offiziell',
    stat1Label: 'Lizenzen',
    stat2Num: '3',
    stat2Label: 'Lernmodi',
    stat3Num: 'Kostenlos',
    stat3Label: 'starten',
    phoneGreeting: 'Guten Morgen',
    phonePlanTitle: 'Dein Lernplan',
    phoneCard1: 'Lernen',
    phoneCard1Sub: 'Kategorie wählen',
    phoneCard2: 'Prüfungsmodus',
    phoneCard2Sub: '30 Fragen · 45 Min',
    phoneCard3: 'Fehlertraining',
    phoneCard3Sub: '12 offene Fehler',
  },
  trust: {
    catalog: 'Offizieller Fragenkatalog',
    current: 'Updates bei Katalog-Änderungen',
    oneTime: 'Kostenlos starten – kein Account',
    languages: 'Zweisprachig: DE & EN',
  },
  features: {
    chip: 'Features',
    title: 'Drei Wege zum Bestehen',
    subtitle: 'Lernmodus, Prüfungssimulation und gezieltes Fehlertraining – alles in einer App.',
    learn: {
      title: 'Lernmodus',
      desc: 'Fragen nach Kategorie, Sofortfeedback mit Erklärung. Navigation, Schifffahrtsrecht, Sicherheit, Wetterkunde und mehr.',
    },
    exam: {
      title: 'Prüfungssimulation',
      desc: 'Echte Prüfungsbedingungen: Zeitlimit, Bestehensgrenze, Feedback erst am Ende – genau wie in der echten Prüfung.',
    },
    training: {
      title: 'Fehlertraining',
      desc: 'Trainiere gezielt deine Schwächen – nur falsch beantwortete Fragen. Mit Trefferquote je Kategorie und Lernstatistik siehst du jederzeit, wo du stehst.',
    },
  },
  // Drei echte App-Screens statt Icon-Karten. Die Beschreibungen nennen
  // bewusst Zahlen, die auf der jeweiligen Aufnahme auch zu sehen sind –
  // sonst widerspricht der Text dem Bild daneben.
  steps: {
    title: 'Wie du lernst',
    subtitle: 'Verstehen, messen, prüfen – die drei Bereiche, in denen du dich bewegst.',
    items: [
      {
        eyebrow: 'Frage verstehen',
        title: 'Erklärung statt richtig/falsch',
        desc: 'Zu jeder Antwort steht da, warum sie stimmt – dazu eine Merkhilfe, die den Satz für die Prüfung festklopft.',
      },
      {
        eyebrow: 'Schwächen sehen',
        title: 'Das Logbuch zeigt, wo es hakt',
        desc: 'Fortschritt je Kategorie: 19 von 124 im Schifffahrtsrecht, 3 von 28 bei Signalen. Du siehst sofort, was noch fehlt.',
      },
      {
        eyebrow: 'Prüfung simulieren',
        title: 'Amtlicher Bogen oder Zufallsprüfung',
        desc: '37 Fragen in 45 Minuten unter echten Bedingungen. Die Formkurve zeigt, ob du stabil über der Bestehensgrenze liegst.',
      },
    ],
  },
  founder: {
    eyebrow: 'Persönlich entwickelt',
    title: 'Hi, ich bin Marius.',
    role: 'Gründer & Entwickler von BoatPass',
    intro: 'Ich entwickle BoatPass selbst und pflege die amtlichen ELWIS-Fragen direkt in die App ein. Wenn du mir schreibst, landet deine Nachricht direkt bei mir.',
    chip1: 'Amtliche Fragen',
    chip2: 'Persönlicher Support',
    cta: 'Warum ich BoatPass gebaut habe',
    imageAlt: 'Marius Gehler, Entwickler von Boatpass, am Ruder eines Segelboots',
  },
  pricing: {
    chip: 'Preise',
    title: 'Kostenlos starten. Nur zahlen, was du brauchst.',
    subtitle: 'Teste alle Lizenzen kostenlos – 15 Fragen täglich über alle Lizenzen. Kaufe nur, was du wirklich brauchst.',
    available: 'Verfügbar',
    price: '€ 9,99',
    ctaFree: 'Kostenlos starten',
    ctaUnlock: 'Vollzugang freischalten',
    ctaStore: 'Im Play Store öffnen',
    questionsUnit: 'Fragen',
    themesUnit: 'Themengebiete',
    // Free-vs-Paid-Gegenüberstellung – einmal zentral vor den Lizenz-Karten
    freeLabel: 'Kostenlos',
    freeFeatures: ['15 Lernfragen/Tag (alle Lizenzen)', 'Alle Lizenzen antestbar'],
    compareFreeSub: 'Ohne Account und ohne Zahlungsdaten',
    comparePaidLabel: 'Vollzugang',
    comparePaidSub: 'Einmal zahlen · kein Abo',
    comparePaidBadge: 'Empfohlen',
    comparePaidPrice: 'ab € 7,99 pro Lizenz',
    comparePaidFeatures: ['Unbegrenzt lernen statt 15 Fragen am Tag', 'Unbegrenzte Prüfungssimulationen'],
    catalog1Name: 'SBF Binnen',
    catalog1Tagline: 'Die Einstiegslizenz für Binnengewässer',
    catalog1Questions: '300',
    // 8, nicht 7: Die 300 Fragen sind der Katalog inkl. Segel-Geltungsbereich
    // (253 Motor + 47 Segel). Dazu gehören 8 Kategorien – "Segeln" ist die achte.
    // 7 Kategorien gelten nur für den Umfang ohne Segeln, dann sind es 253 Fragen.
    catalog1Themes: '8',
    catalog1Note: 'Mit Vorkenntnissen lernst du weniger – die App passt sich an',
    catalog2Name: 'SBF See',
    catalog2Desc: 'Die Lizenz für Küsten- und Seegewässer',
    catalog2Questions: '420',
    catalog2Themes: '7',
    catalog2Highlight: 'inkl. 15 Navigationsaufgaben à 9 Fragen',
    catalog2Note: 'Mit Vorkenntnissen (z.B. SBF Binnen) lernst du weniger',
    catalog3Name: 'UBI Sprechfunk',
    catalog3Desc: 'UKW-Sprechfunkzeugnis Binnen · offizieller Fragenkatalog',
    catalog3Questions: '130',
    catalog3Themes: '5',
    catalog3Highlight: 'Binnenfunk inkl. ATIS',
    ubiPrice: '€ 7,99',
    lrcName: 'LRC Seefunk',
    lrcDesc: 'Langstreckenfunkzeugnis (Seefunk) · offizieller Fragenkatalog',
    lrcQuestions: '76',
    lrcThemes: '6',
    lrcHighlight: 'Satellitenfunk & Seenot-Englisch',
    lrcPrice: '€ 9,99',
    srcName: 'SRC Seefunk',
    srcDesc: 'Kurzstreckenzeugnis (Seefunk Küste) · offizieller Fragenkatalog',
    srcQuestions: '180',
    srcThemes: '5',
    srcHighlight: 'DSC-Notrufverfahren (Küste)',
    srcPrice: '€ 7,99',
    freeTrialNote: 'Im Tageslimit testbar',
    ubiOnlyNote: 'Nur einzeln · nicht im Bundle',
    bundleLabel: 'Spar-Tipp',
    bundleName: 'SBF-Bundle',
    bundleDesc: 'SBF Binnen + SBF See – beide Lizenzen in einem Kauf',
    bundlePrice: '€ 16,98',
    bundleSave: 'Spare € 3,00',
    bundleCta: 'Paket freischalten',
    soon1: 'Bodenseeschifferpatent',
    soonLabel: 'Bald verfügbar',
    // Redesign der Preis-Sektion (Startseite) – Header, SBF-Karten, Funk, Katalog-Hinweis
    v2Chip: 'Amtliche Fragenkataloge',
    v2Title: 'Wähle deine Lizenz',
    v2Subtitle: 'Alle Fragen stammen aus dem amtlichen Katalog in der für 2026 gültigen Fassung. Ändert sich der Katalog, kommen die neuen Fragen ohne Zusatzkosten in die App.',
    v2MetaCatalogs: 'Aktuelle Kataloge',
    v2MetaValid: 'Gültig für alle Prüfungen 2026',
    guaranteeTitle: 'Wenn sich der Katalog ändert',
    guaranteeText: 'Dann kommen die neuen Fragen ohne Zusatzkosten in die App.',
    sbfHeading: 'SBF – Sportbootführerscheine',
    cardFeatures: ['Amtlicher Fragenkatalog', 'Erklärung & Merkhilfe zu jeder Frage', 'Prüfungssimulation', 'Offline lernen'],
    bundleFeatures: ['Alles aus Binnen', 'Alles aus See', 'inkl. 15 Navigationsaufgaben', 'Offline lernen'],
    popular: 'Beliebteste Wahl',
    bundleInclusive: '720 Fragen aus beiden Katalogen',
    funkHeading: 'Funkscheine',
    funkSubtitle: 'Einzeln freischaltbar – auch ohne Sportbootführerschein.',
    funkMore: 'Mehr erfahren',
    noteTitle: 'Hinweis zu den Katalogdaten',
    sourceTitle: 'Offizielle Quelle',
    // Was in jedem Kauf steckt – einmal zentral statt in jeder Karte wiederholt
    proofText: 'Amtlicher ELWIS-Katalog, Stand 2026 – bei jeder Katalog-Änderung aktualisieren wir automatisch.',
    proofCta: 'Alle Kataloge & Quellen ansehen',
    trustPay: 'Sicher bezahlen',
    trustPaySub: 'über Google Play',
    trustRatingSub: 'bei Google',
    trustNoSub: 'Kein Abo',
    trustNoSubSub: 'Einmalkauf je Katalog',
  },
  catalogSources: {
    chip: 'Amtliche Quellen',
    title: 'Womit du lernst, kannst du nachprüfen.',
    intro: 'Für jede Lizenz steht hier der amtliche Fragenkatalog, seine gültige Fassung und der direkte Link zur Quelle bei ELWIS. Prüf es selbst nach.',
    colLicense: 'Lizenz',
    colCatalog: 'Amtlicher Fragenkatalog',
    colStand: 'Amtliche Fassung',
    colSource: 'Offizielle Quelle',
    sourceCta: 'Bei ELWIS ansehen',
    singleTitle: 'Womit du hier lernst – die amtliche Quelle',
    binnenCat: 'Fragen- und Antwortenkatalog · Binnenschifffahrtsstraßen',
    binnenStand: 'gültig seit 01.08.2023',
    seeCat: 'Fragen- und Antwortenkatalog · Seeschifffahrtsstraßen',
    seeStand: 'gültig seit 01.08.2023',
    srcCat: 'Fragenkatalog SRC · Seefunk (Küste)',
    srcStand: 'gültig seit 01.10.2018',
    lrcCat: 'Fragenkatalog LRC · Seefunk (weltweit)',
    lrcStand: 'gültig seit 01.02.2024',
    ubiCat: 'Fragenkatalog UBI · UKW-Sprechfunk Binnen',
    ubiStand: 'gültig seit 01.10.2018',
    ubiNext: 'Neufassung ab 01.10.2026',
    validityNote: 'Das Datum zeigt, seit wann die jeweilige amtliche Fassung gilt – nicht das Alter der Fragen. Alle hier gelisteten Kataloge sind für das Prüfungsjahr 2026 maßgeblich. Kommt eine neue Fassung heraus, bauen wir sie automatisch ein.',
    issuerNote: 'Alle Kataloge werden im Auftrag des Bundesministeriums für Digitales und Verkehr (BMDV) bzw. der Wasserstraßen- und Schifffahrtsverwaltung des Bundes über ELWIS veröffentlicht. Rechtsverbindlich ist allein die Bekanntmachung im Verkehrsblatt.',
    pageStandLabel: 'Stand dieser Übersicht',
    disclaimer: 'Maßgeblich ist immer die amtliche Veröffentlichung – die verlinkten ELWIS-Seiten zeigen stets die aktuell gültige Fassung.',
  },
  blog: {
    eyebrow: 'Ratgeber',
    title: 'Tipps & Wissenswertes',
    readMore: 'Weiterlesen',
    allArticles: 'Alle Artikel',
    minRead: 'Min. Lesezeit',
  },
  footer: {
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    terms: 'Nutzungsbedingungen',
    contact: 'Kontakt',
  },
  faq: {
    title: 'Häufige Fragen',
    subtitle: 'Alles rund um den Sportbootführerschein und die App',
  },
  about: {
    title: 'Über BoatPass',
  },
  contact: {
    title: 'Kontakt',
    name: 'Dein Name',
    email: 'E-Mail-Adresse',
    message: 'Deine Nachricht',
    send: 'Absenden',
    success: 'Nachricht gesendet! Wir melden uns bald.',
  },
  ctaBanner: {
    title: 'Bereit für deine Prüfung?',
    subtitle: '15 Fragen am Tag über alle Lizenzen, ohne Account und ohne Zahlungsdaten.',
    cta: 'Kostenlos im Play Store',
  },
  blogInlineCta: {
    title: 'Lieber am Handy lernen?',
    subtitle: 'Der amtliche Fragenkatalog mit Erklärung zu jeder Antwort, kostenlos zum Testen.',
    cta: 'App ansehen',
  },
} as const;

type Stringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? Stringify<U>[]
  : { [K in keyof T]: Stringify<T[K]> };

export type Translations = Stringify<typeof de>;
