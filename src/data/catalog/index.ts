/**
 * Amtliche Fragenkataloge SBF Binnen und SBF See als Website-Daten
 * (Prüfungsfragen-Hubs, Themenseiten, Fragebogen).
 *
 * Herkunft: basis.json, binnen.json, see.json und sheets.json erzeugt
 * scripts/sync-catalog.mjs aus den Katalogdateien der Android-App. Frage und
 * Antworten auf Deutsch sind der amtliche Wortlaut (ELWIS, gültig seit
 * 01.08.2023, mit dem Katalog abgeglichen), Antwort a ist wie im Katalog
 * immer die richtige. Englisch und Erklärungen sind Boatpass-Texte; von den
 * Erklärungen steht hier nur der Anriss, der Rest und die Merkhilfen sind in
 * der App.
 *
 * Die Themen gibt es im amtlichen Katalog nicht (dort nur Basisfragen,
 * spezifische Fragen und Segelfragen). Sie sind eine redaktionelle Gliederung
 * dieser Website nach Nummernbereichen, damit jede Seite ein klares Thema hat.
 */
import basisData from './basis.json' with { type: 'json' };
import binnenData from './binnen.json' with { type: 'json' };
import seeData from './see.json' with { type: 'json' };
import sheetsData from './sheets.json' with { type: 'json' };

export type Lang = 'de' | 'en';
export type CatalogKey = 'basis' | 'binnen' | 'see';
interface L { de: string; en: string }

export interface CatalogQuestion {
  n: number;
  section: string;
  q: L;
  /** Vier Antworten, die erste ist die richtige (amtliche Reihenfolge). */
  a: L[];
  /** Anriss der Boatpass-Erklärung (erster Satz); der Rest steht nur in der App. */
  x: L;
  /** Die Erklärung geht in der App weiter. */
  more: boolean;
  /** In der App gibt es eine Merkhilfe zu dieser Frage. */
  mn: boolean;
  /** Bildpfade relativ zu src/assets/catalog/. */
  img: string[];
}

export const QUESTIONS: Record<CatalogKey, CatalogQuestion[]> = {
  basis: basisData as CatalogQuestion[],
  binnen: binnenData as CatalogQuestion[],
  see: seeData as CatalogQuestion[],
};

/** Amtliche Fragebögen (Verteilung der Fragen, VkBl. 2012 S. 224/225): je Bogen die Fragennummern. */
export const SHEETS = sheetsData as { binnenMotor: number[][]; binnenSegelErgaenzung: number[][]; see: number[][] };

export function question(catalog: CatalogKey, n: number): CatalogQuestion {
  const q = QUESTIONS[catalog].find(x => x.n === n);
  if (!q) throw new Error(`Frage ${catalog} ${n} fehlt`);
  return q;
}

const range = (...parts: (number | [number, number])[]) =>
  parts.flatMap(p => (Array.isArray(p) ? Array.from({ length: p[1] - p[0] + 1 }, (_, i) => p[0] + i) : [p]));

export interface Topic {
  key: string;
  slug: L;
  title: L;
  /** Einleitung über den Fragen: was das Thema abdeckt, worauf es ankommt. */
  intro: L;
  numbers: number[];
}

export const TOPICS: Record<CatalogKey, Topic[]> = {
  basis: [
    {
      key: 'grundbegriffe',
      slug: { de: 'grundbegriffe-lichter-schallsignale', en: 'basics-lights-sound-signals' },
      title: { de: 'Grundbegriffe, Lichter & Schallsignale', en: 'Basics, lights & sound signals' },
      intro: {
        de: 'Wer ist Schiffsführer, wann ist ein Fahrzeug in Fahrt, wie lang ist ein kurzer Ton? Hier stehen die Grundbegriffe, auf denen beide Scheine aufbauen, dazu die ersten Lichter- und Ausweichfragen.',
        en: 'Who is the skipper, when is a vessel under way, how long is a short blast? These are the basics both licences build on, plus the first questions on lights and giving way.',
      },
      numbers: range([1, 16]),
    },
    {
      key: 'zeichen',
      slug: { de: 'tafel-und-schifffahrtszeichen', en: 'signboards-and-navigation-signs' },
      title: { de: 'Tafel- und Schifffahrtszeichen', en: 'Signboards & navigation signs' },
      intro: {
        de: 'Verbots-, Gebots- und Hinweiszeichen sowie Lichter an Brücken und Schleusen. Fast jede Frage hat eine Abbildung: Präg dir Form und Farbe ein, nicht nur den Text.',
        en: 'Prohibition, mandatory and information signs plus lights at bridges and locks. Almost every question has a picture: memorise shape and colour, not just the wording.',
      },
      numbers: range([17, 30]),
    },
    {
      key: 'fahrpraxis',
      slug: { de: 'umwelt-fahrpraxis-antrieb', en: 'environment-boat-handling-propulsion' },
      title: { de: 'Umwelt, Fahrpraxis & Antrieb', en: 'Environment, boat handling & propulsion' },
      intro: {
        de: 'Rücksicht auf Natur und große Schiffe, Anlegen, Ankern und die Wirkung des Propellers. Die Fragen zum Radeffekt hängen zusammen: Wer einmal verstanden hat, wohin das Heck beim Rückwärtsfahren zieht, beantwortet alle richtig.',
        en: 'Consideration for nature and large ships, berthing, anchoring and how the propeller acts. The prop-walk questions belong together: once you understand where the stern swings when going astern, you get all of them right.',
      },
      numbers: range([31, 48], 50, 51, [58, 61]),
    },
    {
      key: 'motor',
      slug: { de: 'motor-und-tanken', en: 'engine-and-refuelling' },
      title: { de: 'Motor & Tanken', en: 'Engine & refuelling' },
      intro: {
        de: 'Tanken, Kontrolllampen, Überhitzung und typische Störungen am Motor. Die Antworten folgen meist der Logik einer Fehlersuche: erst die naheliegende Ursache, dann die nächste.',
        en: 'Refuelling, warning lights, overheating and typical engine faults. The answers usually follow troubleshooting logic: first the obvious cause, then the next one.',
      },
      numbers: range(49, [52, 57]),
    },
    {
      key: 'sicherheit',
      slug: { de: 'sicherheit-gas-brand-notfall', en: 'safety-gas-fire-emergencies' },
      title: { de: 'Sicherheit: Gas, Brand & Notfall', en: 'Safety: gas, fire & emergencies' },
      intro: {
        de: 'Flüssiggas an Bord, Feuerlöscher, Rettungsmittel, Verhalten nach einem Zusammenstoß und wann Notsignale erlaubt sind. Hier geht es um Situationen, in denen es auf dem Wasser wirklich ernst wird.',
        en: 'LPG on board, fire extinguishers, life-saving equipment, what to do after a collision and when distress signals are allowed. These are the situations where things get serious on the water.',
      },
      numbers: range([62, 72]),
    },
  ],
  binnen: [
    {
      key: 'recht',
      slug: { de: 'recht-fuehrerschein-wassersport', en: 'law-licence-water-sports' },
      title: { de: 'Recht, Führerschein & Wassersport', en: 'Law, licence & water sports' },
      intro: {
        de: 'Für welche Boote der Schein gilt, wo die Verkehrsregeln stehen, wer das Ruder übernehmen darf, Kennzeichen und Register sowie die Regeln für Wasserski und Wassermotorräder. Viel Paragrafenwissen, aber mit klaren Zahlen, die sich gut lernen lassen.',
        en: 'Which boats the licence covers, where the traffic rules are, who may take the helm, registration marks and the rules for water-skiing and personal watercraft. Lots of regulations, but with clear figures that are easy to learn.',
      },
      numbers: range([73, 86], 173, 214, [221, 236], 252),
    },
    {
      key: 'fahrwasser',
      slug: { de: 'fahrwasser-betonnung-hochwasser', en: 'fairway-buoyage-high-water' },
      title: { de: 'Fahrwasser, Betonnung & Hochwasser', en: 'Fairway, buoyage & high water' },
      intro: {
        de: 'Fahrwasser und Fahrrinne, rechtes und linkes Ufer, Berg- und Talfahrt, rote und grüne Tonnen sowie die Hochwassermarken. Der Schlüssel ist die Fließrichtung: Auf Flüssen werden die Ufer mit Blick zu Tal benannt.',
        en: 'Fairway and channel, right and left bank, upstream and downstream, red and green buoys and the high-water marks. The key is the direction of flow: on rivers, banks are named looking downstream.',
      },
      numbers: range([87, 103], 218, [237, 242]),
    },
    {
      key: 'lichter',
      slug: { de: 'lichter-und-sichtzeichen', en: 'lights-and-day-signals' },
      title: { de: 'Lichter & Sichtzeichen', en: 'Lights & day signals' },
      intro: {
        de: 'Welche Lichter und Tagzeichen ein Fahrzeug führt, verrät, was es ist und wie du dich verhalten musst: Fähren, Schubverbände, blaue Lichter, Stillliegende und Kleinfahrzeuge. Lern zuerst die Lichter des eigenen Boots, dann die Sonderfälle der Berufsschifffahrt.',
        en: 'The lights and day signals a vessel shows tell you what it is and how to behave: ferries, pushed convoys, blue lights, stationary vessels and small craft. Learn your own boat’s lights first, then the special cases of commercial shipping.',
      },
      numbers: range([104, 106], [120, 139], [145, 155], 171, 178, 196, [246, 249]),
    },
    {
      key: 'zeichen',
      slug: { de: 'tafelzeichen-bruecken-schleusen', en: 'signboards-bridges-locks' },
      title: { de: 'Tafelzeichen, Brücken & Schleusen', en: 'Signboards, bridges & locks' },
      intro: {
        de: 'Liegestellen, Durchfahrtsöffnungen an Brücken, Wehre, Schleusenlichter und die Reihenfolge beim Schleusen. Die meisten Fragen zeigen ein Zeichen. Faustregel: Tafeln mit rotem Rand verbieten, gebieten oder schränken ein, blaue Hinweiszeichen informieren.',
        en: 'Berths, bridge openings, weirs, lock lights and the order of entry into a lock. Most questions show a sign. Rule of thumb: boards with a red border prohibit, require or restrict, blue information signs inform.',
      },
      numbers: range([107, 119], [156, 158], 172, [198, 204], [243, 245]),
    },
    {
      key: 'schall',
      slug: { de: 'schallsignale-und-notsignale', en: 'sound-and-distress-signals' },
      title: { de: 'Schallsignale & Notsignale', en: 'Sound & distress signals' },
      intro: {
        de: 'Ein langer Ton, vier kurze, fünf kurze, Folgen sehr kurzer Töne und Notsignale. Die Signale sind kurz, aber leicht zu verwechseln. Lern sie in Paaren: Was bedeutet das Signal, und wann musst du es selbst geben?',
        en: 'One long blast, four short, five short, series of very short blasts and distress signals. The signals are short but easy to mix up. Learn them in pairs: what does the signal mean, and when do you have to give it yourself?',
      },
      numbers: range([159, 170], [210, 212], 250, 251),
    },
    {
      key: 'ausweichen',
      slug: { de: 'ausweichregeln-und-begegnen', en: 'right-of-way-and-meeting' },
      title: { de: 'Ausweichregeln & Begegnen', en: 'Right of way & meeting' },
      intro: {
        de: 'Wer weicht wem aus? Segler untereinander, Kleinfahrzeuge gegenüber der Berufsschifffahrt, Überholen und Sog. Viele Fragen beschreiben eine Situation: Zeichne sie dir auf, bevor du antwortest.',
        en: 'Who gives way to whom? Sailing craft among themselves, small craft versus commercial vessels, overtaking and suction. Many questions describe a situation: sketch it before you answer.',
      },
      numbers: range([140, 144], [174, 177], [179, 195], 197),
    },
    {
      key: 'wetter',
      slug: { de: 'wetter-umwelt-sicherheit', en: 'weather-environment-safety' },
      title: { de: 'Wetter, Umwelt & Sicherheit', en: 'Weather, environment & safety' },
      intro: {
        de: 'Unsichtiges Wetter, Luftdruck, Sturmwarnung, Radar, Landstrom, Abfälle und Antifouling. Ein kleines, gemischtes Themengebiet mit Fragen, die sich gut mit gesundem Menschenverstand beantworten lassen.',
        en: 'Restricted visibility, air pressure, storm warnings, radar, shore power, waste and antifouling. A small, mixed topic with questions that common sense goes a long way to answer.',
      },
      numbers: range([205, 209], 213, [215, 217], 219, 220, 253),
    },
    {
      key: 'segeln',
      slug: { de: 'segeln', en: 'sailing' },
      title: { de: 'Segeln', en: 'Sailing' },
      intro: {
        de: 'Die 47 spezifischen Segelfragen für den Geltungsbereich unter Segel: Bootstypen und Stabilität, Segel und Trimm, wahrer und scheinbarer Wind, Manöver und Notfälle wie Ruder- oder Wantbruch. Nur für Prüflinge, die auch unter Segel fahren wollen.',
        en: 'The 47 specific sailing questions for the sailing endorsement: boat types and stability, sails and trim, true and apparent wind, manoeuvres and emergencies such as a broken rudder or shroud. Only for candidates who also want to sail.',
      },
      numbers: range([254, 300]),
    },
  ],
  see: [
    {
      key: 'recht',
      slug: { de: 'recht-und-grundregeln', en: 'law-and-basic-rules' },
      title: { de: 'Recht & Grundregeln', en: 'Law & basic rules' },
      intro: {
        de: 'Wo KVR und Seeschifffahrtsstraßen-Ordnung gelten, seemännische Sorgfalt, das Manöver des letzten Augenblicks, manövrierunfähig und manövrierbehindert. Diese Begriffe tauchen in vielen anderen Fragen wieder auf, deshalb lohnt es sich, sie zuerst zu lernen.',
        en: 'Where the COLREGs and the German sea waterways regulations apply, seamanlike care, action by the stand-on vessel, not under command and restricted in her ability to manoeuvre. These terms come up in many other questions, so they are worth learning first.',
      },
      numbers: range([73, 90], 152, 153, 158),
    },
    {
      key: 'lichter',
      slug: { de: 'lichter-und-signalkoerper', en: 'lights-and-shapes' },
      title: { de: 'Lichter & Signalkörper', en: 'Lights & shapes' },
      intro: {
        de: 'Welches Fahrzeug führt diese Lichter? Fischer, Schleppverbände, Ankerlieger und manövrierunfähige Fahrzeuge bei Nacht, dazu die Signalkörper bei Tag. Fast jede Frage hat ein Bild, und die Lichterbilder sind ein großer Block im Katalog.',
        en: 'Which vessel shows these lights? Fishing vessels, tows, vessels at anchor and vessels not under command at night, plus the shapes by day. Almost every question has a picture, and the light pictures are a large block in the catalogue.',
      },
      numbers: range([91, 115], 159, 160),
    },
    {
      key: 'schall',
      slug: { de: 'schallsignale-verminderte-sicht', en: 'sound-signals-restricted-visibility' },
      title: { de: 'Schallsignale & verminderte Sicht', en: 'Sound signals & restricted visibility' },
      intro: {
        de: 'Nebelsignale, Manöversignale, das allgemeine Gefahr- und Warnsignal und das Verhalten bei verminderter Sicht. Merk dir die Signale als Rhythmus (lang, kurz, kurz), dann lassen sich die Antworten leicht unterscheiden.',
        en: 'Fog signals, manoeuvring signals, the general danger and warning signal and conduct in restricted visibility. Remember the signals as a rhythm (long, short, short), then the answers are easy to tell apart.',
      },
      numbers: range([116, 124], 140, 141, [161, 164], 178, 186, 188, 271),
    },
    {
      key: 'ausweichen',
      slug: { de: 'ausweichregeln-verkehrstrennung', en: 'right-of-way-traffic-separation' },
      title: { de: 'Ausweichregeln & Verkehrstrennung', en: 'Right of way & traffic separation' },
      intro: {
        de: 'Kollisionsgefahr erkennen, wer ausweicht und wer Kurs hält, Segler gegen Segler, Verkehrstrennungsgebiete und das Verhalten im Fahrwasser. Die Regeln folgen einer Rangfolge: Wer weniger manövrieren kann, hat Vorrang.',
        en: 'Recognising risk of collision, who gives way and who stands on, sail versus sail, traffic separation schemes and conduct in the fairway. The rules follow a hierarchy: the less manoeuvrable vessel has priority.',
      },
      numbers: range([125, 139], [142, 151], 154, 155, [165, 168]),
    },
    {
      key: 'zeichen',
      slug: { de: 'fahrwasser-und-schifffahrtszeichen', en: 'fairways-and-navigation-marks' },
      title: { de: 'Fahrwasser & Schifffahrtszeichen', en: 'Fairways & navigation marks' },
      intro: {
        de: 'Steuerbord- und Backbordseite des Fahrwassers, Tonnen und Kardinalzeichen, Sichtzeichen, Sperrgebiete, Ankerverbote und der Nord-Ostsee-Kanal. Wer das Betonnungssystem einmal verstanden hat, braucht für viele Fragen nur noch Farbe und Toppzeichen.',
        en: 'Starboard and port side of the fairway, buoys and cardinal marks, visual signals, restricted areas, anchoring bans and the Kiel Canal. Once you understand the buoyage system, colour and topmark are enough for many questions.',
      },
      numbers: range(156, 157, [169, 177], [179, 185], 187, [189, 203], 208, 260),
    },
    {
      key: 'feuer',
      slug: { de: 'leuchtfeuer', en: 'lights-and-lighthouses' },
      title: { de: 'Leuchtfeuer', en: 'Navigation lights & lighthouses' },
      intro: {
        de: 'Kennungen von Leuchttonnen, Leit-, Richt- und Quermarkenfeuer, Blink-, Blitz-, Funkel- und Gleichtaktfeuer. Die Abkürzungen wie Fl, Oc und Q stehen so auch in der Seekarte.',
        en: 'Characteristics of lit buoys, leading, directional and cross-mark lights, flashing, quick and isophase lights. Abbreviations such as Fl, Oc and Q appear exactly like this on the chart.',
      },
      numbers: range([204, 207], [209, 215], [220, 224]),
    },
    {
      key: 'natur',
      slug: { de: 'naturschutz-und-umwelt', en: 'nature-conservation-and-environment' },
      title: { de: 'Naturschutz & Umwelt', en: 'Nature conservation & environment' },
      intro: {
        de: 'Naturschutzgebiete und Nationalparke im Wattenmeer, Seehundbänke, die Nordsee-Befahrensverordnung und die Reinhaltung der Gewässer. Ein kleines Themengebiet mit festen Zahlen, die sich gut lernen lassen.',
        en: 'Nature reserves and national parks in the Wadden Sea, seal banks, the North Sea navigation regulation and keeping the water clean. A small topic with fixed figures that are easy to learn.',
      },
      numbers: range([216, 219], [225, 230]),
    },
    {
      key: 'navigation',
      slug: { de: 'seekarte-navigation-gezeiten', en: 'charts-navigation-tides' },
      title: { de: 'Seekarte, Navigation & Gezeiten', en: 'Charts, navigation & tides' },
      intro: {
        de: 'Nautische Veröffentlichungen, Seekarte, Seemeile und Knoten, Kompass, Peilung, Strom- und Windversetzung, AIS sowie Ebbe, Flut und Tidenhub. Diese Grundlagen brauchst du auch für die Navigationsaufgabe.',
        en: 'Nautical publications, charts, nautical mile and knot, compass, bearings, current and leeway, AIS and ebb, flood and tidal range. You also need these basics for the chartwork task.',
      },
      numbers: range([231, 255], 272, 273),
    },
    {
      key: 'wetter',
      slug: { de: 'wetter', en: 'weather' },
      title: { de: 'Wetter', en: 'Weather' },
      intro: {
        de: 'Beaufort-Skala, Isobaren, Luftdruck und Wetterkarte, Starkwind- und Sturmwarnung und die Begriffe aus dem amtlichen Wetterbericht. Wenige Fragen, aber wichtig für jede Törnplanung.',
        en: 'The Beaufort scale, isobars, air pressure and weather maps, strong-wind and gale warnings and the terms used in official forecasts. Few questions, but important for every passage plan.',
      },
      numbers: range([261, 270]),
    },
    {
      key: 'sicherheit',
      slug: { de: 'seemannschaft-sicherheit-notsignale', en: 'seamanship-safety-distress-signals' },
      title: { de: 'Seemannschaft, Sicherheit & Notsignale', en: 'Seamanship, safety & distress signals' },
      intro: {
        de: 'Schleppen bei Seegang, Sicherheitsmaßnahmen vor schwerem Wetter, Mensch über Bord, Kentern und die Not- und Flaggensignale. Hier geht es um die Lagen, in denen auf See schnell gehandelt werden muss.',
        en: 'Towing in a seaway, safety measures before heavy weather, man overboard, capsizing and distress and flag signals. These are the situations at sea where you have to act fast.',
      },
      numbers: range([256, 259], [274, 285]),
    },
  ],
};

export interface CatalogMeta {
  /** Name des Scheins, wie die Website ihn schreibt. */
  name: L;
  /** Hub-Seite (bestehende Übersichtsseite). */
  hub: L;
  /** Amtliche Abschnittsseiten bei ELWIS, die diese Fragen enthalten. */
  elwis: { label: L; url: string }[];
}

const ELWIS = 'https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine';

export const CATALOGS: Record<CatalogKey, CatalogMeta> = {
  basis: {
    name: { de: 'SBF Binnen & See', en: 'SBF Inland & Coastal' },
    hub: { de: '/sbf-basisfragen/', en: '/en/sbf-basic-questions/' },
    elwis: [
      { label: { de: 'Basisfragen (Katalog Binnen)', en: 'Basic questions (Inland catalogue)' }, url: `${ELWIS}/Fragenkatalog-Binnen/Basisfragen/Basisfragen-node.html` },
      { label: { de: 'Basisfragen (Katalog See)', en: 'Basic questions (Coastal catalogue)' }, url: `${ELWIS}/Fragenkatalog-See/Basisfragen/Basisfragen-node.html` },
    ],
  },
  binnen: {
    name: { de: 'SBF Binnen', en: 'SBF Inland' },
    hub: { de: '/sbf-binnen-pruefungsfragen/', en: '/en/sbf-inland-exam-questions/' },
    elwis: [
      { label: { de: 'Spezifische Fragen Binnen', en: 'Specific questions Inland' }, url: `${ELWIS}/Fragenkatalog-Binnen/Spezifische-Fragen-Binnen/Spezifische-Fragen-Binnen-node.html` },
      { label: { de: 'Spezifische Fragen Segeln', en: 'Specific questions Sailing' }, url: `${ELWIS}/Fragenkatalog-Binnen/Spezifische-Fragen-Segeln/Spezifische-Fragen-Segeln-node.html` },
    ],
  },
  see: {
    name: { de: 'SBF See', en: 'SBF Coastal' },
    hub: { de: '/sbf-see-pruefungsfragen/', en: '/en/sbf-coastal-exam-questions/' },
    elwis: [
      { label: { de: 'Spezifische Fragen See', en: 'Specific questions Coastal' }, url: `${ELWIS}/Fragenkatalog-See/Spezifische-Fragen-See/Spezifische-Fragen-See-node.html` },
    ],
  },
};

/** Amtliche Übersichtsseiten der Kataloge bei ELWIS. */
export const ELWIS_CATALOG_URL = {
  binnen: `${ELWIS}/Fragenkatalog-Binnen/Fragenkatalog-Binnen-node.html`,
  see: `${ELWIS}/Fragenkatalog-See/Fragenkatalog-See-node.html`,
};

/** Bekanntmachungen der geltenden Fassung (BMDV, 28.04.2023, in Kraft 01.08.2023). */
export const ELWIS_CHANGE_NOTICE = {
  binnen: `${ELWIS}/Aenderung-Fragen-Katalog-Binnen.pdf?__blob=publicationFile`,
  see: `${ELWIS}/Aenderung-Fragen-Katalog-See.pdf?__blob=publicationFile`,
};

/** Bekanntmachung der Verteilung der Fragen auf die Fragebögen (VkBl. 2012). */
export const ELWIS_SHEETS_URL = {
  binnen: `${ELWIS}/Fragenverteilung-Binnen.pdf?__blob=publicationFile`,
  see: `${ELWIS}/Fragenverteilung-See.pdf?__blob=publicationFile`,
};

export const CATALOG_VALID_FROM: L = { de: '01.08.2023', en: '1 August 2023' };

export function topicUrl(catalog: CatalogKey, topic: Topic, lang: Lang): string {
  if (catalog === 'basis') return `${CATALOGS.basis.hub[lang]}#${topic.slug[lang]}`;
  return `${CATALOGS[catalog].hub[lang]}${topic.slug[lang]}/`;
}

export function practiceUrl(catalog: 'binnen' | 'see', lang: Lang): string {
  return `${CATALOGS[catalog].hub[lang]}${lang === 'de' ? 'fragebogen' : 'practice-test'}/`;
}

/** Fragen eines Themas in Katalogreihenfolge. */
export function topicQuestions(catalog: CatalogKey, topic: Topic): CatalogQuestion[] {
  return topic.numbers.map(n => question(catalog, n));
}

/** Anzeigebreite eines Katalogbilds: höchstens 320 px breit und 240 px hoch, nie größer als das Original. */
export function figureWidth(width: number, height: number): number {
  return Math.min(width, 320, Math.round((240 * width) / height));
}

/** Anker einer Frage auf ihrer Themenseite. */
export function questionAnchor(n: number, lang: Lang): string {
  return `${lang === 'de' ? 'frage' : 'question'}-${n}`;
}

/** Wo eine Frage steht (Seite + Anker), z. B. für Links aus dem Fragebogen. */
export function questionUrl(catalog: CatalogKey, n: number, lang: Lang): string {
  const topic = TOPICS[catalog].find(t => t.numbers.includes(n));
  if (!topic) throw new Error(`Frage ${catalog} ${n} ohne Thema`);
  const base = catalog === 'basis' ? CATALOGS.basis.hub[lang] : `${CATALOGS[catalog].hub[lang]}${topic.slug[lang]}/`;
  return `${base}#${questionAnchor(n, lang)}`;
}

// Selbstprüfung beim Build: jede Frage genau einem Thema zugeordnet.
for (const key of Object.keys(TOPICS) as CatalogKey[]) {
  const seen = new Map<number, string>();
  for (const t of TOPICS[key]) {
    for (const n of t.numbers) {
      if (seen.has(n)) throw new Error(`${key} ${n}: in ${seen.get(n)} und ${t.key}`);
      seen.set(n, t.key);
    }
  }
  const missing = QUESTIONS[key].filter(q => !seen.has(q.n)).map(q => q.n);
  if (missing.length || seen.size !== QUESTIONS[key].length) {
    throw new Error(`${key}: ohne Thema ${missing.join(', ')}`);
  }
}
