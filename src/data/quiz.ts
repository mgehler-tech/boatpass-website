/**
 * Zehn echte Fragen aus der Boatpass-App für das „Probier's aus"-Quiz auf der
 * Startseite (Lernweg, Etappe 02).
 *
 * Herkunft: quiz-questions.json ist wortgleich aus den Katalog-Dateien der
 * Android-App übernommen (app/src/main/assets/…, Feld `catalog` + `id` je
 * Frage) – Frage, Antworten, Erklärung und Merkhilfe auf Deutsch und Englisch.
 * Nichts davon ist für die Website umformuliert.
 *
 * Einzige Abweichung vom Katalog: die Reihenfolge der Antworten. Im amtlichen
 * Katalog steht die richtige Antwort immer an erster Stelle; die App mischt
 * sie. Hier ist die Reihenfolge fest vorgegeben (`correct` = Index der
 * richtigen Antwort), damit nicht jede Frage mit „A" richtig ist.
 *
 * Auswahl: nur Fragen ohne Abbildung und ohne Navigationsaufgabe, quer über
 * die Scheine (SBF Binnen, gemeinsame Basisfragen, SBF See, SRC, UBI).
 */
import questions from './quiz-questions.json';

export type QuizLicence = 'binnen' | 'see' | 'basis' | 'src' | 'ubi';

interface Localized {
  de: string;
  en: string;
}

export interface QuizQuestion {
  id: string;
  catalog: string;
  licence: QuizLicence;
  question: Localized;
  answers: Localized[];
  correct: number;
  explanation: Localized;
  mnemonic: Localized;
}

export const QUIZ_QUESTIONS = questions as QuizQuestion[];

export const QUIZ_LICENCE_LABELS: Record<QuizLicence, Localized> = {
  binnen: { de: 'SBF Binnen', en: 'SBF Inland' },
  see: { de: 'SBF See', en: 'SBF Coastal' },
  basis: { de: 'SBF Binnen & See', en: 'SBF Inland & Coastal' },
  src: { de: 'SRC', en: 'SRC' },
  ubi: { de: 'UBI', en: 'UBI' },
};
