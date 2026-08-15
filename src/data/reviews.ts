/**
 * Echte Google-Play-Rezensionen zur Boatpass-App.
 *
 * Regeln für diese Datei:
 *
 * 1. `text` wird wortgleich aus der Play Console übernommen – einschließlich
 *    Kleinschreibung, Tippfehlern und Emojis. Kürzungen nur am Ende und nur
 *    mit "…" gekennzeichnet. Nichts umformulieren, nichts glätten.
 * 1a. `excerpt` ist die auf der Startseite angezeigte Kurzfassung. Sie
 *    enthält nur die aussagekräftigsten Passagen, damit die Karten kompakt
 *    bleiben. Auch hier gilt: Wörter bleiben wortgleich, ausgelassene Stellen
 *    werden mit "…" markiert – niemals umformulieren. Fehlt `excerpt`, wird
 *    der volle `text` gezeigt.
 * 2. `name` ist auf Vorname plus Initial gekürzt. Die vollen Anzeigenamen
 *    stehen öffentlich im Play Store, die Kurzform ist aber datensparsamer.
 * 3. Keine Profilbilder übernehmen – die Sektion zeigt Buchstaben-Kreise,
 *    wie der Play Store sie bei Nutzern ohne Bild selbst verwendet.
 * 4. `passed` nur setzen, wenn die Person das Bestehen selbst geschrieben hat.
 *
 * Google Play vergibt keine Permalinks auf einzelne Rezensionen; verlinkbar
 * ist ausschließlich das Listing. Deshalb gibt es hier kein `url`-Feld.
 */

export interface Review {
  /** Wortgleicher Rezensionstext ohne umschließende Anführungszeichen. */
  text: string;
  /**
   * Auf der Startseite gezeigte Kurzfassung. Nur die Kernpassagen, Wörter
   * wortgleich, Auslassungen mit "…". Ohne Angabe wird `text` gezeigt.
   */
  excerpt?: string;
  /** Vorname + Initial, z. B. "Daniel K." */
  name: string;
  /** Initialen für den Buchstaben-Kreis. */
  initials: string;
  /** ISO-Datum der Rezension. */
  date: string;
  /** Sternzahl 1–5. */
  stars: number;
  /** Nur wenn die Person das Bestehen selbst erwähnt hat. */
  passed?: string;
}

/** Stand der Erhebung aus der Play Console. */
export const REVIEWS_AS_OF = '2026-08-15';

/**
 * Auswahl für die Startseite. Bewusst vier Stimmen, die jeweils etwas
 * anderes belegen: bestandene Prüfung, Qualität der Erklärungen, Lernalltag,
 * Preis und Zweisprachigkeit.
 */
export const REVIEWS_DE: Review[] = [
  {
    text: 'Klare Empfehlung! Mit boatpass konnte ich mich in kurzer Zeit optimal auf den SBF Binnen Motor vorbereiten und hab die Prüfung beim ersten Versuch erfolgreich bestanden. 😊 Die Fragen sind gut aufgebaut und das Lernen macht Spaß 👍',
    excerpt: 'Klare Empfehlung! Mit boatpass konnte ich mich in kurzer Zeit optimal auf den SBF Binnen Motor vorbereiten und hab die Prüfung beim ersten Versuch erfolgreich bestanden. 😊',
    name: 'Daniel K.',
    initials: 'DK',
    date: '2026-07-18',
    stars: 5,
    passed: 'SBF Binnen bestanden',
  },
  {
    text: 'Sehr gute App um für den bootsführerschein zu üben. Mit Prüfungsfragen und anschaulichen Grafiken. Sehr gute Erklärungen wenn eine Antwort falsch war. Ich kann diese App sehr empfehlen für jeden der vorhat einen Bootsführerschein zu machen…',
    excerpt: 'Sehr gute App um für den bootsführerschein zu üben. … Sehr gute Erklärungen wenn eine Antwort falsch war. Ich kann diese App sehr empfehlen…',
    name: 'Kevin R.',
    initials: 'KR',
    date: '2026-07-31',
    stars: 5,
  },
  {
    text: 'Für mich war die App ein Gamechanger und der entscheidende Faktor, um den Bootsführerschein endlich in Angriff zu nehmen. Statt stundenlang in einem dicken Lehrbuch zu lesen, lerne ich einfach täglich ein paar Minuten – und plötzlich macht die ganze Theorie sogar Spaß.',
    excerpt: 'Für mich war die App ein Gamechanger … Statt stundenlang in einem dicken Lehrbuch zu lesen, lerne ich einfach täglich ein paar Minuten – und plötzlich macht die ganze Theorie sogar Spaß.',
    name: 'Daniel G.',
    initials: 'DG',
    date: '2026-08-01',
    stars: 5,
  },
  {
    text: 'Günstiger als die anderen Apps und sehr modernes Design im Vergleich zu den anderen Apps. Auch auf englisch.',
    name: 'Kristina G.',
    initials: 'KG',
    date: '2026-08-02',
    stars: 5,
  },
];

/** Datum im Format "18. Juli 2026". */
export function formatReviewDate(iso: string): string {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()}. ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
