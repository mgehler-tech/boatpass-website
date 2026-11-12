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
 * Von der Boatpass-Erklärung steht hier wie in den Katalog-Hubs nur der
 * Anriss (erster Satz); der Rest und die Merkhilfe bleiben in der App.
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
  /** Bildpfad relativ zu src/assets/catalog/. */
  img?: string;
}

/** Katalogfrage der Website mit fest gemischten Antworten (0 = richtige). */
function fromCatalog(licence: 'binnen' | 'see', n: number, order: number[]): HeroQuestion {
  const q = catalogQuestion(licence as CatalogKey, n);
  return {
    licence,
    number: q.n,
    source: `data/catalog/${licence}.json`,
    question: q.q,
    answers: order.map((i) => q.a[i]),
    correct: order.indexOf(0),
    explanation: q.x,
    img: q.img[0],
  };
}

/** Reihenfolge wie t.hero.licenses: Binnen, See, UBI, SRC, LRC. */
export const HERO_QUESTIONS: HeroQuestion[] = [
  // Tafelzeichen A.12: Fahrverbot für Fahrzeuge mit Maschinenantrieb.
  fromCatalog('binnen', 157, [2, 0, 3, 1]),
  // Tonne B.10: Mitte von Schifffahrtswegen.
  fromCatalog('see', 190, [2, 1, 3, 0]),
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
      de: 'Das Notzeichen im Sprechfunk ist MAYDAY (vom franz. „m’aider“ = helft mir).',
      en: 'The distress signal in voice radio is MAYDAY (from French “m’aider” = help me).',
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
      de: 'Die DSC-Alarmierung erfolgt auf UKW-Kanal 70 – dem reinen DSC-Kanal, der ständig überwacht wird.',
      en: 'DSC alerting takes place on VHF channel 70 – the DSC-only channel that is monitored continuously.',
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
  },
];
