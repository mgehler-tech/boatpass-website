/**
 * Echte Rezensionen zur Boatpass-App aus Google Play und dem App Store.
 *
 * Regeln für diese Datei:
 *
 * 1. `text` wird wortgleich aus der Play Console bzw. dem App Store übernommen – einschließlich
 *    Kleinschreibung, Tippfehlern und Emojis. Kürzungen nur am Ende und nur
 *    mit "…" gekennzeichnet. Nichts umformulieren, nichts glätten.
 * 1a. `excerpt` ist die auf der Startseite angezeigte Kurzfassung. Sie
 *    enthält nur die aussagekräftigsten Passagen, damit die Karten kompakt
 *    bleiben. Auch hier gilt: Wörter bleiben wortgleich, ausgelassene Stellen
 *    werden mit "…" markiert – niemals umformulieren. Fehlt `excerpt`, wird
 *    der volle `text` gezeigt.
 * 2. `name` ist auf Vorname plus Initial gekürzt. Die vollen Anzeigenamen
 *    stehen öffentlich im Play Store, die Kurzform ist aber datensparsamer.
 *    Im App Store schreiben die meisten unter einem Spitznamen – der bleibt
 *    wie angezeigt (angehängte Ziffernfolgen weggelassen).
 * 3. Keine Profilbilder übernehmen. Die Startseite (home/HomeReviews.astro)
 *    zeigt bewusst gar keine Avatare, nur Name, Datum und Sterne. `initials`
 *    bleibt für andere Darstellungen erhalten.
 * 4. `passed` nur setzen, wenn die Person das Bestehen selbst geschrieben hat.
 *
 * 5. `store` sagt, woher die Rezension stammt. Die Startseite nennt die
 *    Quelle an jeder Karte.
 *
 * Weder Google Play noch der App Store vergeben öffentliche Permalinks auf
 * einzelne Rezensionen; verlinkbar ist nur das Listing. Deshalb kein `url`-Feld.
 */

export type ReviewStore = 'play' | 'ios';

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
  /** Herkunft: Google Play oder App Store. */
  store: ReviewStore;
}

/** Stand der Erhebung (Play Console und App Store). */
export const REVIEWS_AS_OF = '2026-10-23';

/**
 * Auswahl für die Startseite. Bewusst mehrere Stimmen, die jeweils etwas
 * anderes belegen: bestandene Prüfung, Qualität der Erklärungen, Lernalltag,
 * Preis und Zweisprachigkeit, Merkhilfen und Abgrenzung zur Konkurrenz.
 * Beide Stores gemischt, die Startseite ordnet sie abwechselnd an.
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
    store: 'play',
  },
  {
    text: 'Für mich war die App ein Gamechanger und der entscheidende Faktor, um den Bootsführerschein endlich in Angriff zu nehmen. Statt stundenlang in einem dicken Lehrbuch zu lesen, lerne ich einfach täglich ein paar Minuten – und plötzlich macht die ganze Theorie sogar Spaß.',
    excerpt: 'Für mich war die App ein Gamechanger … Statt stundenlang in einem dicken Lehrbuch zu lesen, lerne ich einfach täglich ein paar Minuten – und plötzlich macht die ganze Theorie sogar Spaß.',
    name: 'Daniel G.',
    initials: 'DG',
    date: '2026-08-01',
    stars: 5,
    store: 'play',
  },
  {
    text: 'Günstiger als die anderen Apps und sehr modernes Design im Vergleich zu den anderen Apps. Auch auf englisch.',
    name: 'Kristina G.',
    initials: 'KG',
    date: '2026-08-02',
    stars: 5,
    store: 'play',
  },
  {
    text: 'Geile App hab meine SBF See nun endlich ! Hat Spaß gemacht zu lernen damit',
    name: 'Sofie R.',
    initials: 'SR',
    date: '2026-08-02',
    stars: 5,
    passed: 'SBF See bestanden',
    store: 'play',
  },
  {
    text: 'Sehr übersichtliche App zur Vorbereitung auf die SBF-Theorie, vor allem die Merkhilfen und kurzen Erklärungen beim Fragenkatalog sind sehr hilfreich und heben die App deutlich von der Konkurrenz ab! Bei mir funktioniert auch der Dark-Mode einwandfrei. Würde mich freuen, wenn es bald auch noch eine SKS-Version gäbe!',
    excerpt: 'Sehr übersichtliche App zur Vorbereitung auf die SBF-Theorie, vor allem die Merkhilfen und kurzen Erklärungen beim Fragenkatalog sind sehr hilfreich und heben die App deutlich von der Konkurrenz ab!',
    name: 'Fe L.',
    initials: 'FL',
    date: '2026-08-18',
    stars: 5,
    store: 'play',
  },
  {
    text: 'Normalerweise schreibe ich keine Rezensionen, aber dadurch, dass die App jetzt auch im App Store ist, wollte ich einfach eine schreiben. Ich lerne gerade für den SBF Binnen Motor und Segel und habe BoatPass vorher schon auf meinem alten Android-Handy genutzt. Die App hilft mir enorm: Alles ist einfach aufbereitet, man hat viele Möglichkeiten zu üben und die Erklärungen und Merkhilfen bei falschen Antworten sorgen dafür, dass der Stoff wirklich hängen bleibt. Umso mehr freue ich mich, dass ich jetzt auch auf dem iPhone weiterlernen kann, klare Empfehlung!',
    excerpt: 'Die App hilft mir enorm: Alles ist einfach aufbereitet, … die Erklärungen und Merkhilfen bei falschen Antworten sorgen dafür, dass der Stoff wirklich hängen bleibt.',
    name: 'mrclo_',
    initials: 'M',
    date: '2026-10-13',
    stars: 5,
    store: 'ios',
  },
  {
    text: 'Andere Apps haben Fragen die teilweise viel zu einfach sind. Hier werden richtige prufungsfragen gestellt. So fühle ich mich deutlich besser vorbereitet',
    name: 'nicolas',
    initials: 'N',
    date: '2026-10-15',
    stars: 5,
    store: 'ios',
  },
  {
    text: 'Ich lerne gerade für meinen Bootsführerschein Binnen und bin absolut begeistert von Boatpass. Der integrierte Lernplan ist mega gut aufgebaut und führt einen Schritt für Schritt durch alle Themen. Zusammen mit den genialen Erklärungen versteht man die Hintergründe sofort, statt nur stumpf auswendig zu lernen. Absolut empfehlenswert für die Prüfungsvorbereitung!',
    excerpt: 'Der integrierte Lernplan ist mega gut aufgebaut und führt einen Schritt für Schritt durch alle Themen. Zusammen mit den genialen Erklärungen versteht man die Hintergründe sofort, statt nur stumpf auswendig zu lernen.',
    name: 'SelSkipper',
    initials: 'S',
    date: '2026-10-15',
    stars: 5,
    store: 'ios',
  },
  {
    text: 'Ich nutze die App aktuell zur Vorbereitung auf den SBF Binnen und bin absolut überzeugt. Sie ist super übersichtlich gestaltet und deckt alle relevanten Prüfungsfragen ab. Teure Kursgebühren kann man sich damit sparen! Besonders stark finde ich die Lernfunktionen: Man kann gezielt nach Themen lernen oder gezielt die Fragen wiederholen, die man falsch beantwortet hat. Durch das tägliche Fragenziel bleibt man diszipliniert und ist pünktlich zur Prüfung fit. Die verständlichen Erklärungen und Merkhilfen machen das Lernen zusätzlich effektiver.',
    excerpt: 'Sie ist super übersichtlich gestaltet und deckt alle relevanten Prüfungsfragen ab. Teure Kursgebühren kann man sich damit sparen!',
    name: 'DB_Navigator',
    initials: 'D',
    date: '2026-10-17',
    stars: 5,
    store: 'ios',
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
