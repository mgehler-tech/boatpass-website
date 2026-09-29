/**
 * Beispielfrage für den Hero der Startseite – zum direkten Ausprobieren.
 *
 * Frage, Antworten, Erklärung und Merkhilfe sind wortgleich aus der App
 * übernommen (siehe die Screenshots `app.screenshot.3.de.png` bzw.
 * `app.screenshot.3.en.png`). Nichts umformulieren: Die Frage soll genau das
 * zeigen, was man in der App bekommt. Die Reihenfolge der Antworten ist
 * gemischt, damit die richtige nicht zufällig an erster Stelle steht.
 */
export interface SampleQuestion {
  /** Kleine Zeile über der Frage, z. B. Kategorie. */
  label: string;
  question: string;
  answers: { text: string; correct?: boolean }[];
  explanation: string;
  mnemonic: string;
}

export const SAMPLE_QUESTION: Record<'de' | 'en', SampleQuestion> = {
  de: {
    label: 'Beispielfrage aus der App',
    question: 'Welches Fahrzeug führt am Bug einen roten Wimpel?',
    answers: [
      { text: 'Ein Fahrzeug, das brennbare Stoffe geladen hat.' },
      { text: 'Ein Fahrzeug mit Vorrang beim Schleusen.', correct: true },
      { text: 'Ein Fahrzeug, das explosive Stoffe geladen hat.' },
      { text: 'Ein Fahrzeug mit Vorrang beim Be- und Entladen.' },
    ],
    explanation:
      'Ein roter Wimpel am Bug zeigt an: Dieses Fahrzeug hat von der zuständigen Behörde einen Vorrang beim Schleusen erhalten. Es fährt bevorzugt in die Schleuse ein, andere müssen warten.',
    mnemonic: 'Roter Wimpel am Bug = Schleusenvorrang. Rot geht vor – aber nur mit Behördenerlaubnis.',
  },
  en: {
    label: 'Sample question from the app · Sailing',
    question: 'How should a sail be trimmed in strong winds?',
    answers: [
      { text: 'It should be trimmed full.' },
      { text: 'The sheets must be hauled in tight.' },
      { text: 'The sail should be trimmed flat.', correct: true },
      { text: 'The sheets must be eased.' },
    ],
    explanation:
      'In strong winds the sail must be trimmed flat to reduce heel and decrease wind pressure. A full sail in strong winds leads to excessive heel and loss of control.',
    mnemonic: 'Strong wind: sail flat. Less belly = less heel = more control.',
  },
};
