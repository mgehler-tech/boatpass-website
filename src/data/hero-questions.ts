/**
 * Je Schein eine echte Prüfungsfrage für den Hero der Startseite: Der Besucher
 * tippt eine Antwort an und sieht die Auflösung, wie sie die App zeigt.
 *
 * Herkunft:
 * - SBF Binnen und SBF See kommen aus den Katalogdaten der Website
 *   (data/catalog, erzeugt von scripts/sync-catalog.mjs), samt Abbildung.
 * - UBI, SRC und LRC sind wortgleich aus den Katalogdateien der Android-App
 *   übernommen (app/src/main/assets/ubi_2026.json, src_2018.json,
 *   lrc_2024.json; `source` nennt die Frage).
 *
 * Erklärung und Merkhilfe stehen hier vollständig und wortgleich wie in der
 * App (anders als in den Katalog-Hubs, die nur den Anriss zeigen): Der Hero
 * führt an fünf Fragen vor, wie die App jede Frage auflöst. Für SBF Binnen
 * und SBF See stammen beide Texte aus sbf_binnen_2023.json bzw.
 * sbf_see_2023.json der App, weil data/catalog nur den Anriss enthält.
 *
 * Einzige Abweichung vom Katalog: die Reihenfolge der Antworten. Amtlich steht
 * die richtige immer an erster Stelle; hier ist sie fest gemischt (`correct` =
 * Index der richtigen Antwort), damit nicht jede Frage mit „A" richtig ist.
 *
 * Bewusst andere Fragen als im Quiz des Lernwegs (data/quiz-questions.json):
 * Der Hero ist der Einstieg, das Quiz die Fortsetzung.
 */
import { question as catalogQuestion, type CatalogKey } from './catalog';

export type HeroLicence = 'binnen' | 'see' | 'ubi' | 'src' | 'lrc';

interface L {
  de: string;
  en: string;
}

export interface HeroQuestion {
  licence: HeroLicence;
  /** Nummer im amtlichen Katalog des Scheins. */
  number: number;
  /** Katalogdatei und Fragen-ID der App bzw. Katalog der Website. */
  source: string;
  question: L;
  answers: L[];
  correct: number;
  explanation: L;
  mnemonic: L;
  /** Bildpfad relativ zu src/assets/catalog/. */
  img?: string;
}

/** Katalogfrage der Website mit fest gemischten Antworten (0 = richtige). */
function fromCatalog(
  licence: 'binnen' | 'see',
  n: number,
  order: number[],
  app: { source: string; explanation: L; mnemonic: L },
): HeroQuestion {
  const q = catalogQuestion(licence as CatalogKey, n);
  // Der Anriss im Katalog ist der Anfang der App-Erklärung; weicht er ab,
  // gehört der Text hier nicht (mehr) zu dieser Frage.
  for (const l of ['de', 'en'] as const) {
    if (!app.explanation[l].startsWith(q.x[l])) throw new Error(`Erklärung passt nicht zum Katalog: ${licence} ${n} (${l})`);
  }
  return {
    licence,
    number: q.n,
    source: `data/catalog/${licence}.json · ${app.source}`,
    question: q.q,
    answers: order.map((i) => q.a[i]),
    correct: order.indexOf(0),
    explanation: app.explanation,
    mnemonic: app.mnemonic,
    img: q.img[0],
  };
}

/** Reihenfolge wie t.hero.licenses: Binnen, See, UBI, SRC, LRC. */
export const HERO_QUESTIONS: HeroQuestion[] = [
  // Tafelzeichen A.12: Fahrverbot für Fahrzeuge mit Maschinenantrieb.
  fromCatalog('binnen', 157, [2, 0, 3, 1], {
    source: 'sbf_binnen_2023.json · 2023_157',
    explanation: {
      de: 'Das Zeichen A.12 verbietet die Fahrt für jedes Fahrzeug mit Maschinenantrieb. Andere Antriebsarten, insbesondere Segel- und Muskelkraft, werden von diesem Zeichen nicht erfasst.',
      en: 'Sign A.12 prohibits navigation by power-driven vessels. Other means of propulsion, in particular sail and muscle power, are not covered by this sign.',
    },
    mnemonic: {
      de: 'Durchgestrichener Propeller: Maschinenantrieb verboten; Segel- und Muskelkraft erfasst dieses Zeichen nicht.',
      en: 'Crossed-out propeller: prohibited for power-driven vessels; sail and muscle power are not covered.',
    },
  }),
  // Tonne B.10: Mitte von Schifffahrtswegen.
  fromCatalog('see', 190, [2, 1, 3, 0], {
    source: 'sbf_see_2023.json · sbf_see_2023_190',
    explanation: {
      de: 'Zeichen B.10 kennzeichnet die Zufahrt zu einem Fahrwasser von See aus oder die Mitte eines Schifffahrtswegs. Der Körper trägt rote und weiße senkrechte Streifen; mögliche Formen sind Kugeltonne, Leuchttonne, Spierentonne oder Stange. Ein vorhandenes Toppzeichen ist ein roter Ball, ein vorhandenes Feuer ist ein weißes Gleichtaktfeuer (Iso) oder ein weißes unterbrochenes Feuer (Oc). Das Zeichen kann auf beiden Seiten passiert werden, sofern Verkehrslage und Tiefen es zulassen.',
      en: 'Mark B.10 indicates the seaward approach to a fairway or the centre of a navigable channel. Its body has red and white vertical stripes and may be a spherical buoy, light buoy, spar buoy or beacon. If fitted, the topmark is a single red sphere and the light is white with an isophase or occulting characteristic. It may be passed on either side when traffic and depth permit.',
    },
    mnemonic: {
      de: 'Rot-weiß senkrecht; roter Ball; weißes Gleichtaktfeuer (Iso) oder unterbrochenes Feuer (Oc): Zufahrt oder Mitte des Schifffahrtswegs.',
      en: 'Red-and-white vertical stripes, red sphere, white isophase (Iso) or occulting (Oc): approach or mid-channel mark.',
    },
  }),
  {
    licence: 'ubi',
    number: 111,
    source: 'ubi_2026.json · ubi_2023_111',
    question: {
      de: 'Wie heißt das Notzeichen im Sprechfunk?',
      en: 'What is the distress signal in radiotelephone?',
    },
    answers: [
      { de: 'PAN PAN', en: 'PAN PAN' },
      { de: 'SOS', en: 'SOS' },
      { de: 'MAYDAY', en: 'MAYDAY' },
      { de: 'SECURITE', en: 'SECURITE' },
    ],
    correct: 2,
    explanation: {
      de: 'Das Notzeichen im Sprechfunk ist MAYDAY (vom franz. „m’aider“ = helft mir). PAN PAN steht für Dringlichkeit, SECURITE für Sicherheit; SOS ist das Morse-Notzeichen, nicht das gesprochene.',
      en: 'The distress signal in voice radio is MAYDAY (from French “m’aider” = help me). PAN PAN signals urgency, SECURITE safety; SOS is the Morse distress signal, not the spoken one.',
    },
    mnemonic: {
      de: 'Drei Stufen, drei Wörter: MAYDAY = Not, PAN PAN = Dringlichkeit, SECURITE = Sicherheit.',
      en: 'Three levels, three words: MAYDAY = distress, PAN PAN = urgency, SECURITE = safety.',
    },
  },
  {
    licence: 'src',
    number: 58,
    source: 'src_2018.json · src_2018_58',
    question: {
      de: 'Auf welchem UKW-Kanal erfolgt die Alarmierung mittels DSC?',
      en: 'On which VHF channel does alerting by DSC take place?',
    },
    answers: [
      { de: 'Kanal 16', en: 'Channel 16' },
      { de: 'Kanal 70', en: 'Channel 70' },
      { de: 'Kanal 06', en: 'Channel 06' },
      { de: 'Kanal 10', en: 'Channel 10' },
    ],
    correct: 1,
    explanation: {
      de: 'Die DSC-Alarmierung erfolgt auf UKW-Kanal 70 – dem reinen DSC-Kanal, der ständig überwacht wird. Der gesprochene Notruf dagegen läuft auf Kanal 16.',
      en: 'DSC alerting takes place on VHF channel 70 – the DSC-only channel that is monitored continuously. The spoken distress call, by contrast, is on channel 16.',
    },
    mnemonic: {
      de: 'DSC = Kanal 70; Sprechfunk-Notruf = Kanal 16.',
      en: 'DSC = channel 70; voice distress = channel 16.',
    },
  },
  {
    licence: 'lrc',
    number: 55,
    source: 'lrc_2024.json · lrc_2024_55',
    question: {
      de: 'Wie sind die Satelliten des Inmarsat-Systems positioniert?',
      en: 'How are the satellites of the Inmarsat system positioned?',
    },
    answers: [
      { de: 'Geostationär', en: 'Geostationary' },
      { de: 'Polumlaufend', en: 'Polar-orbiting' },
      { de: 'Polumlaufend und geostationär', en: 'Polar-orbiting and geostationary' },
      { de: 'Exzentrisch', en: 'Eccentric' },
    ],
    correct: 0,
    explanation: {
      de: 'Die Inmarsat-Satelliten sind geostationär: Sie stehen in rund 36 000 km Höhe scheinbar fest über einem Punkt der Erde und decken so jeweils ein großes, gleichbleibendes Seegebiet ab.',
      en: 'The Inmarsat satellites are geostationary: at roughly 36,000 km altitude they appear to stay fixed above one point on earth and thus each cover a large, constant sea area.',
    },
    mnemonic: {
      de: 'Inmarsat-Satelliten sind geostationär: scheinbar fest über dem Äquator (~36 000 km Höhe).',
      en: 'Inmarsat satellites are geostationary: apparently fixed above the equator (~36,000 km altitude).',
    },
  },
];
