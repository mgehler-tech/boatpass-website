export interface RegionFaq {
  q: string;
  a: string;
}

export interface Region {
  slug: string;
  slugEn: string;
  name: string;
  state: string;
  type: 'inland' | 'coastal' | 'both';
  priority: number;
  waters: string[];
  waterDescription: { de: string; en: string };
  examAuthority: string;
  specialRules?: { de: string; en: string };
  recommendedLicense: 'SBF Binnen' | 'SBF See' | 'SBF Binnen + See';
  whyThisRegion: { de: string; en: string };
  seoTitle: string;
  seoTitleEn: string;
  description: string;
  descriptionEn: string;
  faq: RegionFaq[];
  faqEn: RegionFaq[];
}

export const REGIONS: Region[] = [
  {
    slug: 'berlin',
    slugEn: 'berlin',
    name: 'Berlin',
    state: 'Berlin',
    type: 'inland',
    priority: 1,
    waters: ['Spree', 'Havel', 'Dahme', 'Wannsee', 'Müggelsee', 'Tegeler See', 'Seddinsee', 'Langer See'],
    waterDescription: {
      de: 'Berlin ist eine der wasserreichsten Städte Europas. Von den verzweigten Wasserstraßen der Spree über die weiten Ufer der Havel bis hin zu idyllischen Buchten am Wannsee oder Müggelsee – hier findest du unzählige Möglichkeiten, mit dem Boot unterwegs zu sein. Die Berliner Gewässer verbinden urbanes Flair mit Naturerlebnis.',
      en: 'Berlin is one of Europe\'s most water-rich cities. From the branching waterways of the Spree to the wide shores of the Havel and the idyllic bays of Wannsee and Müggelsee, the city offers countless opportunities to get out on the water, blending urban flair with nature.',
    },
    examAuthority: 'DSV/DMYV Prüfungsausschuss Berlin',
    specialRules: {
      de: 'Auf bestimmten Berliner Gewässern ist der SBF Binnen unter Segel für Segelboote mit mehr als 6 m² Segelfläche vorgeschrieben. Das betrifft die Untere-Havel-Wasserstraße (inkl. Pichelsdorfer Havel und Großer Wannsee), Teile der Spree-Oder-Wasserstraße (Müggelsee, Seddinsee, Langer See) sowie den Tegeler See.',
      en: 'On certain Berlin waters, the SBF Inland sailing endorsement is required for sailboats with more than 6 m² of sail area. This applies to the Lower Havel Waterway (incl. Pichelsdorf Havel and Großer Wannsee), parts of the Spree-Oder Waterway (Müggelsee, Seddinsee, Langer See) and Tegeler See.',
    },
    recommendedLicense: 'SBF Binnen',
    whyThisRegion: {
      de: 'Berlin bietet mit über 180 km schiffbaren Wasserstraßen und zahlreichen Seen eines der größten und vielfältigsten Binnenreviere Deutschlands – der SBF Binnen ist hier dein Schlüssel zu einem einzigartigen Freizeiterlebnis mitten in der Hauptstadt.',
      en: 'With over 180 km of navigable waterways and numerous lakes, Berlin offers one of Germany\'s largest and most diverse inland boating areas – the SBF Inland is your key to a unique leisure experience in the heart of the capital.',
    },
    seoTitle: 'Sportbootführerschein Berlin',
    seoTitleEn: 'Boating License Berlin',
    description: 'Sportbootführerschein in Berlin machen: Spree, Havel, Wannsee und mehr. Prüfungsorte, Segelschein-Pflicht und Vorbereitung mit der Boatpass-App.',
    descriptionEn: 'Get your boating license in Berlin: Spree, Havel, Wannsee and more. Exam locations, sailing endorsement rules and preparation with the Boatpass app.',
    faq: [
      { q: 'Brauche ich in Berlin den SBF Binnen oder See?', a: 'In Berlin brauchst du den SBF Binnen. Alle Berliner Gewässer – Spree, Havel, Dahme und die Seen – sind Binnengewässer. Den SBF See benötigst du hier nicht, er ist für Küsten- und Seegewässer gedacht.' },
      { q: 'Wo kann ich in Berlin die SBF-Prüfung ablegen?', a: 'Die Prüfung wird vom Prüfungsausschuss Berlin abgenommen, der in der Gartenfelder Straße 29–37 in Spandau (13599 Berlin) sitzt. Prüfungstermine finden regelmäßig statt.' },
      { q: 'Brauche ich in Berlin einen Segelschein?', a: 'Ja, auf bestimmten Berliner Gewässern ist der SBF Binnen unter Segel für Segelboote mit mehr als 6 m² Segelfläche vorgeschrieben – insbesondere auf der Havel (inkl. Wannsee), Müggelsee, Seddinsee und Tegeler See.' },
      { q: 'Welche Gewässer in Berlin darf ich mit dem SBF Binnen befahren?', a: 'Mit dem SBF Binnen darfst du alle Berliner Wasserstraßen und Seen befahren – darunter Spree, Havel, Dahme, Wannsee, Müggelsee, Tegeler See und zahlreiche Kanäle. Auch das angrenzende Brandenburger Seenland ist damit erreichbar.' },
    ],
    faqEn: [
      { q: 'Do I need the SBF Inland or Coastal in Berlin?', a: 'In Berlin you need the SBF Inland. All Berlin waters – Spree, Havel, Dahme and the lakes – are inland waterways. The SBF Coastal is not needed here.' },
      { q: 'Where can I take the boating exam in Berlin?', a: 'The exam is administered by the Prüfungsausschuss Berlin at Gartenfelder Straße 29–37 in Spandau (13599 Berlin). Exam dates are held regularly.' },
      { q: 'Do I need a sailing endorsement in Berlin?', a: 'Yes, on certain Berlin waters the SBF Inland sailing endorsement is required for sailboats with more than 6 m² of sail area – notably on the Havel (incl. Wannsee), Müggelsee, Seddinsee and Tegeler See.' },
      { q: 'Which waters in Berlin can I navigate with the SBF Inland?', a: 'With the SBF Inland you can navigate all Berlin waterways and lakes – including the Spree, Havel, Dahme, Wannsee, Müggelsee, Tegeler See and numerous canals. The adjacent Brandenburg lake district is also accessible.' },
    ],
  },
  {
    slug: 'hamburg',
    slugEn: 'hamburg',
    name: 'Hamburg',
    state: 'Hamburg',
    type: 'both',
    priority: 2,
    waters: ['Elbe', 'Alster', 'Bille', 'Dove-Elbe', 'Gose-Elbe', 'Fleete und Kanäle'],
    waterDescription: {
      de: 'Hamburg ist die Tor-zur-Welt-Stadt am Wasser: Die Elbe prägt das Stadtbild, und mit Alster, Bille und einem Netz aus Fleeten und Kanälen bietet die Hansestadt ein einzigartiges maritimes Revier. Besonders spannend: Hier findest du sowohl Binnen- als auch Seegewässer – vom ruhigen Alstervergnügen bis zur beeindruckenden Schifffahrt auf der Elbe.',
      en: 'Hamburg is the gateway city on the water: the Elbe shapes the cityscape, and with the Alster, Bille and a network of Fleete (canals), the Hanseatic city offers a unique maritime area. What makes it special: you\'ll find both inland and coastal waters here – from the calm Alster to the impressive shipping traffic on the Elbe.',
    },
    examAuthority: 'DSV Prüfungsausschuss Hamburg / DMYV Prüfungszentrum Bremen-Hamburg',
    specialRules: {
      de: 'Im Hamburger Hafengebiet (Elbarme zwischen Tinsdal und Oortkaten, Alster, Bille mit Kanälen und Fleeten) gelten sowohl SBF Binnen als auch SBF See – deutschlandweit einzigartig. Die Alster ist für private Motorboote gesperrt. Im Hafen gilt eine Höchstgeschwindigkeit von 22 km/h, auf Alster und Bille nur 8 km/h.',
      en: 'In Hamburg\'s harbour area (Elbe arms between Tinsdal and Oortkaten, Alster, Bille with canals and Fleete) both the SBF Inland and SBF Coastal are valid – unique in Germany. The Alster is closed to private motor boats. The harbour speed limit is 22 km/h; on the Alster and Bille only 8 km/h.',
    },
    recommendedLicense: 'SBF Binnen + See',
    whyThisRegion: {
      de: 'Hamburg vereint Binnen- und Seeschifffahrt wie keine andere deutsche Stadt – mit dem SBF erschließt du dir das gesamte Revier von der Alster bis zur Elbmündung.',
      en: 'Hamburg combines inland and coastal boating like no other German city – with the SBF you unlock the entire area from the Alster to the Elbe estuary.',
    },
    seoTitle: 'Sportbootführerschein Hamburg',
    seoTitleEn: 'Boating License Hamburg',
    description: 'Sportbootführerschein in Hamburg: Elbe, Alster und Hafen. Warum du beide Scheine brauchst, Prüfungsorte und Vorbereitung mit der Boatpass-App.',
    descriptionEn: 'Boating license in Hamburg: Elbe, Alster and harbour. Why you need both licenses, exam locations and preparation with the Boatpass app.',
    faq: [
      { q: 'Brauche ich in Hamburg den SBF Binnen oder See?', a: 'In Hamburg sind idealerweise beide Führerscheine sinnvoll. Im Hafengebiet (zwischen Oortkaten und Tinsdal) gelten sowohl SBF Binnen als auch SBF See. Für die Elbe Richtung Nordsee (ab Tinsdal) brauchst du den SBF See, für die Binnengewässer oberhalb Oortkaten den SBF Binnen.' },
      { q: 'Darf ich auf der Alster Motorboot fahren?', a: 'Nein, die Alster ist für private Motorboote gesperrt. Nur Trainerboote von Segel-, Ruder- und Kanuvereinen dürfen hier unter bestimmten Auflagen mit Motor fahren. Auf der Alster kannst du aber segeln, rudern und paddeln.' },
      { q: 'Welche Geschwindigkeitsbegrenzungen gelten in Hamburg?', a: 'Im Hamburger Hafen gilt eine Höchstgeschwindigkeit von 22 km/h. Auf der Alster und der Bille beträgt die Höchstgeschwindigkeit nur 8 km/h.' },
      { q: 'Wo kann ich in Hamburg die SBF-Prüfung ablegen?', a: 'In Hamburg gibt es zwei Prüfungsausschüsse: den DSV Prüfungsausschuss Hamburg und das DMYV Prüfungszentrum Bremen/Hamburg. Beide bieten regelmäßig Prüfungstermine an.' },
    ],
    faqEn: [
      { q: 'Do I need the SBF Inland or Coastal in Hamburg?', a: 'Ideally both. In the harbour area (between Oortkaten and Tinsdal) both the SBF Inland and Coastal are valid. For the Elbe towards the North Sea (from Tinsdal) you need the SBF Coastal; for inland waters above Oortkaten the SBF Inland.' },
      { q: 'Can I take a motor boat on the Alster?', a: 'No, the Alster is closed to private motor boats. Only trainer boats from sailing, rowing and canoe clubs may use engines under specific conditions. You can still sail, row and paddle on the Alster.' },
      { q: 'What speed limits apply in Hamburg?', a: 'The maximum speed in Hamburg\'s harbour is 22 km/h. On the Alster and Bille the limit is just 8 km/h.' },
      { q: 'Where can I take the boating exam in Hamburg?', a: 'Hamburg has two exam bodies: the DSV Prüfungsausschuss Hamburg and the DMYV Prüfungszentrum Bremen/Hamburg. Both offer regular exam dates.' },
    ],
  },
  {
    slug: 'muenchen',
    slugEn: 'munich',
    name: 'München',
    state: 'Bayern',
    type: 'inland',
    priority: 3,
    waters: ['Starnberger See', 'Ammersee', 'Chiemsee', 'Tegernsee', 'Wörthsee', 'Isar (nur nichtmotorisiert)'],
    waterDescription: {
      de: 'Rund um München laden die großen oberbayerischen Seen zum Bootfahren ein – allen voran der Starnberger See und der Ammersee. Motorboote sind hier allerdings streng reglementiert und nur mit Sondergenehmigung erlaubt. Die Isar selbst darf in München nur mit kleinen Fahrzeugen ohne eigenen Antrieb befahren werden.',
      en: 'Munich is surrounded by Upper Bavaria\'s great lakes – led by Lake Starnberg and Lake Ammersee. Motor boats are strictly regulated here and only allowed with special permits. The Isar river in Munich may only be used with small non-motorised craft such as canoes.',
    },
    examAuthority: 'Prüfungsausschuss München/Nürnberg (DMYV)',
    specialRules: {
      de: 'Auf dem Starnberger See und dem Ammersee ist die Anzahl zugelassener Motorboote mit Verbrennungsmotor streng limitiert (Starnberger See: ca. 255 private Genehmigungen). Die Wartezeiten für eine Genehmigung betragen bis zu 12 Jahre. Für Elektromotoren werden Genehmigungen unbefristet erteilt. Auf der Isar in München sind Motorboote verboten.',
      en: 'The number of motor boats with combustion engines is strictly limited on Lake Starnberg and Lake Ammersee (Lake Starnberg: approx. 255 private permits). Waiting times for a permit can reach up to 12 years. Electric motor permits are issued indefinitely. Motor boats are prohibited on the Isar in Munich.',
    },
    recommendedLicense: 'SBF Binnen',
    whyThisRegion: {
      de: 'Die oberbayerische Seenlandschaft rund um München bietet traumhafte Reviere – mit dem SBF Binnen bist du für den Starnberger See, Ammersee und Chiemsee bestens gerüstet.',
      en: 'Upper Bavaria\'s lake district around Munich offers stunning boating areas – with the SBF Inland you\'re well prepared for Lake Starnberg, Ammersee and Chiemsee.',
    },
    seoTitle: 'Sportbootführerschein München',
    seoTitleEn: 'Boating License Munich',
    description: 'Sportbootführerschein in München: Starnberger See, Ammersee und Chiemsee. Motorkontingente, Prüfungsorte und Vorbereitung mit der Boatpass-App.',
    descriptionEn: 'Boating license in Munich: Lake Starnberg, Ammersee and Chiemsee. Motor boat permits, exam locations and preparation with the Boatpass app.',
    faq: [
      { q: 'Brauche ich in München den SBF Binnen oder See?', a: 'Für die Seen rund um München (Starnberger See, Ammersee, Chiemsee) brauchst du den SBF Binnen. Den SBF See benötigst du nur, wenn du auch an der Küste fahren möchtest – was viele Münchner für den Urlaub machen.' },
      { q: 'Darf ich auf der Isar Motorboot fahren?', a: 'Nein, auf der Isar in München sind Motorboote nicht erlaubt. Die Isar darf nur mit kleinen Fahrzeugen ohne eigene Triebkraft befahren werden, etwa mit Kanus oder Schlauchbooten.' },
      { q: 'Warum gibt es Wartezeiten für Motorboote auf dem Starnberger See?', a: 'Die Anzahl der zugelassenen Motorboote mit Verbrennungsmotor ist auf dem Starnberger See und Ammersee aus Gründen des Wasser- und Naturschutzes streng limitiert. Die Wartezeiten für eine Genehmigung betragen aktuell bis zu 12 Jahre. Für Elektromotoren gibt es hingegen keine Kontingentierung.' },
      { q: 'Wo kann ich in München die SBF-Prüfung ablegen?', a: 'Die Prüfung wird vom Prüfungsausschuss München/Nürnberg abgenommen. Prüfungsorte sind u. a. am Ammersee, Starnberger See und Chiemsee.' },
    ],
    faqEn: [
      { q: 'Do I need the SBF Inland or Coastal near Munich?', a: 'For the lakes around Munich (Lake Starnberg, Ammersee, Chiemsee) you need the SBF Inland. The SBF Coastal is only needed if you also want to boat on coastal waters – which many Munich residents do for holidays.' },
      { q: 'Can I take a motor boat on the Isar?', a: 'No, motor boats are not allowed on the Isar in Munich. The river may only be used with small non-motorised craft such as canoes or inflatable boats.' },
      { q: 'Why are there waiting lists for motor boats on Lake Starnberg?', a: 'The number of combustion-engine motor boats is strictly limited on Lake Starnberg and Ammersee for environmental protection. Waiting times for a permit currently reach up to 12 years. Electric motors, however, are not subject to quotas.' },
      { q: 'Where can I take the boating exam near Munich?', a: 'The exam is administered by the Prüfungsausschuss München/Nürnberg. Exam locations include Lake Ammersee, Lake Starnberg and Chiemsee.' },
    ],
  },
  {
    slug: 'koeln',
    slugEn: 'cologne',
    name: 'Köln',
    state: 'Nordrhein-Westfalen',
    type: 'inland',
    priority: 4,
    waters: ['Rhein', 'Fühlinger See', 'Otto-Maigler-See', 'Rheinauhafen'],
    waterDescription: {
      de: 'Köln liegt direkt am Rhein, einer der meistbefahrenen Wasserstraßen Europas. Der Rhein verbindet Freizeitverkehr und Berufsschifffahrt und bietet ein anspruchsvolles, aber spannendes Revier für Sportbootfahrer. Im Kölner Umland findest du mit dem Fühlinger See und weiteren Seen ruhigere Gewässer für entspanntes Bootfahren.',
      en: 'Cologne sits directly on the Rhine, one of Europe\'s busiest waterways. The Rhine combines leisure and commercial shipping and offers a demanding but exciting area for recreational boaters. In the Cologne area, lakes like Fühlinger See provide calmer waters for relaxed boating.',
    },
    examAuthority: 'DSV Prüfungsausschuss Rhein-Ruhr / DMYV Prüfungszentrum NRW',
    specialRules: {
      de: 'Seit dem 1. April 2023 gilt auf dem Rhein die allgemeine Führerscheingrenze: SBF Binnen ab 15 PS (11,03 kW). Die frühere strengere 5-PS-Grenze auf dem Rhein wurde aufgehoben. Sportboote dürfen bis zu 20 m lang sein. Der Mindestabstand zu anderen Fahrzeugen und Personen im Wasser beträgt 10 Meter.',
      en: 'Since 1 April 2023, the standard license threshold applies on the Rhine: SBF Inland from 15 HP (11.03 kW). The previous stricter 5 HP limit on the Rhine was removed. Recreational boats may be up to 20 m long. The minimum distance to other vessels and people in the water is 10 metres.',
    },
    recommendedLicense: 'SBF Binnen',
    whyThisRegion: {
      de: 'Der Rhein bei Köln ist eines der anspruchsvollsten und aufregendsten Binnenreviere Deutschlands – mit dem SBF Binnen navigierst du sicher durch den Verkehr auf Europas wichtigster Wasserstraße.',
      en: 'The Rhine near Cologne is one of Germany\'s most demanding and exciting inland waterways – with the SBF Inland you navigate safely through traffic on Europe\'s most important waterway.',
    },
    seoTitle: 'Sportbootführerschein Köln',
    seoTitleEn: 'Boating License Cologne',
    description: 'Sportbootführerschein in Köln: Rhein befahren mit dem richtigen Schein. Neue Regeln seit 2023, Prüfungsorte und Vorbereitung mit der Boatpass-App.',
    descriptionEn: 'Boating license in Cologne: navigate the Rhine with the right license. Updated 2023 rules, exam locations and preparation with the Boatpass app.',
    faq: [
      { q: 'Ab wie viel PS brauche ich auf dem Rhein bei Köln einen Führerschein?', a: 'Seit April 2023 gilt die allgemeine Grenze von 15 PS (11,03 kW Verbrennungsmotor). Darunter darfst du führerscheinfrei auf dem Rhein fahren. Die frühere Sonderregelung von 5 PS auf dem Rhein wurde aufgehoben.' },
      { q: 'Gelten auf dem Rhein bei Köln besondere Regeln?', a: 'Seit dem 1. April 2023 gelten auf dem Rhein die gleichen Führerscheinregeln wie auf anderen Binnenschifffahrtsstraßen: SBF Binnen ab 15 PS, Boote bis 20 m Länge. Der Rhein ist eine stark befahrene Wasserstraße – du musst die Berufsschifffahrt beachten und darfst sie nicht behindern.' },
      { q: 'Wo kann ich in Köln die SBF-Prüfung ablegen?', a: 'Die Prüfung wird vom DSV Prüfungsausschuss Rhein-Ruhr abgenommen. Die Theorieprüfung findet in Köln meist im Bürgerzentrum Stollwerk oder im NOVOTEL statt, die praktische Prüfung auf dem Rhein im Rheinauhafen.' },
      { q: 'Brauche ich in Köln den SBF Binnen oder See?', a: 'In Köln brauchst du den SBF Binnen. Der Rhein ist eine Binnenschifffahrtsstraße. Den SBF See benötigst du erst für Küsten- und Seegewässer wie die Nord- oder Ostsee.' },
    ],
    faqEn: [
      { q: 'From how many HP do I need a license on the Rhine near Cologne?', a: 'Since April 2023, the general threshold of 15 HP (11.03 kW combustion engine) applies. Below that you may operate on the Rhine without a license. The previous special 5 HP rule on the Rhine was removed.' },
      { q: 'Are there special rules on the Rhine near Cologne?', a: 'Since 1 April 2023, the same licensing rules apply on the Rhine as on other inland waterways: SBF Inland from 15 HP, boats up to 20 m. The Rhine is a heavily trafficked waterway – you must respect commercial shipping.' },
      { q: 'Where are boating exams held in Cologne?', a: 'The exam is administered by the DSV Prüfungsausschuss Rhein-Ruhr. Theory exams in Cologne usually take place at Bürgerzentrum Stollwerk or NOVOTEL; practical exams on the Rhine at Rheinauhafen.' },
      { q: 'Do I need the SBF Inland or Coastal in Cologne?', a: 'In Cologne you need the SBF Inland. The Rhine is an inland waterway. The SBF Coastal is only needed for coastal and sea waters such as the North Sea or Baltic Sea.' },
    ],
  },
  {
    slug: 'rostock',
    slugEn: 'rostock',
    name: 'Rostock',
    state: 'Mecklenburg-Vorpommern',
    type: 'both',
    priority: 5,
    waters: ['Ostsee', 'Unterwarnow', 'Breitling', 'Warnemünde', 'Mecklenburgische Seenplatte'],
    waterDescription: {
      de: 'Rostock verbindet Fluss, Haff und offene Ostsee wie kaum eine andere Stadt. Die Warnow fließt mitten durch die Stadt und mündet bei Warnemünde in die Ostsee – hier kannst du vom Binnenrevier direkt aufs Meer wechseln. Die nahegelegene Mecklenburgische Seenplatte bietet zudem eines der größten zusammenhängenden Seengebiete Europas.',
      en: 'Rostock connects river, lagoon and open Baltic Sea like few other cities. The Warnow flows through the city centre and meets the Baltic at Warnemünde – here you can switch from inland waters directly to the sea. The nearby Mecklenburg Lake District is one of Europe\'s largest contiguous lake areas.',
    },
    examAuthority: 'DSV Prüfungsausschuss Mecklenburg-Vorpommern / Prüfungsausschuss Rostock',
    specialRules: {
      de: 'Die Unterwarnow (von der Schleuse am Mühlendamm bis Warnemünde) und der Breitling gelten als Küstengewässer – hier ist der SBF See erforderlich, nicht der SBF Binnen. Für die Ostsee gilt der SBF See in der 3-Seemeilen-Zone.',
      en: 'The Lower Warnow (from the lock at Mühlendamm to Warnemünde) and the Breitling count as coastal waters – the SBF Coastal is required here, not the SBF Inland. The SBF Coastal applies in the 3-nautical-mile zone on the Baltic.',
    },
    recommendedLicense: 'SBF Binnen + See',
    whyThisRegion: {
      de: 'Rostock ist das Tor zur Ostsee und zur Mecklenburgischen Seenplatte – mit dem SBF See erkundest du die Küste, und mit dem SBF Binnen erschließt du dir eines der schönsten Binnenreviere Europas.',
      en: 'Rostock is the gateway to the Baltic Sea and the Mecklenburg Lake District – with the SBF Coastal you explore the coast, and with the SBF Inland you unlock one of Europe\'s finest inland boating areas.',
    },
    seoTitle: 'Sportbootführerschein Rostock',
    seoTitleEn: 'Boating License Rostock',
    description: 'Sportbootführerschein in Rostock: Ostsee, Warnow und Seenplatte. Warum du beide Scheine brauchst, Prüfungstermine und Vorbereitung mit Boatpass.',
    descriptionEn: 'Boating license in Rostock: Baltic Sea, Warnow and Lake District. Why you need both licenses, exam dates and preparation with the Boatpass app.',
    faq: [
      { q: 'Brauche ich in Rostock den SBF Binnen oder See?', a: 'Für die Ostsee und die Küstengewässer (inkl. Unterwarnow und Breitling) brauchst du den SBF See. Für die Binnengewässer wie die Mecklenburgische Seenplatte brauchst du den SBF Binnen. Am besten machst du beide in Kombination.' },
      { q: 'Gilt der SBF Binnen auf der Warnow?', a: 'Achtung: Die Unterwarnow (von der Schleuse am Mühlendamm bis Warnemünde) und der Breitling gelten als Küstengewässer. Hier brauchst du den SBF See, nicht den SBF Binnen.' },
      { q: 'Wo kann ich in Rostock die SBF-Prüfung ablegen?', a: 'Die Prüfung wird vom DSV Prüfungsausschuss Mecklenburg-Vorpommern bzw. vom Prüfungsausschuss Rostock abgenommen. Die praktische Ausbildung findet auf der Unterwarnow und in Warnemünde auf der Ostsee statt.' },
      { q: 'Welche Gewässer kann ich von Rostock aus befahren?', a: 'Mit dem SBF See kannst du die Ostsee, die Unterwarnow und den Breitling befahren. Mit dem SBF Binnen erreichst du die Mecklenburgische Seenplatte – eines der größten zusammenhängenden Seengebiete Europas mit über 1.000 Seen.' },
    ],
    faqEn: [
      { q: 'Do I need the SBF Inland or Coastal in Rostock?', a: 'For the Baltic Sea and coastal waters (incl. Lower Warnow and Breitling) you need the SBF Coastal. For inland waters like the Mecklenburg Lake District you need the SBF Inland. Taking both in combination is recommended.' },
      { q: 'Does the SBF Inland apply on the Warnow?', a: 'Important: The Lower Warnow (from the lock at Mühlendamm to Warnemünde) and the Breitling count as coastal waters. You need the SBF Coastal here, not the SBF Inland.' },
      { q: 'Where can I take the boating exam in Rostock?', a: 'The exam is administered by the DSV Prüfungsausschuss Mecklenburg-Vorpommern or the Prüfungsausschuss Rostock. Practical training takes place on the Lower Warnow and at Warnemünde on the Baltic.' },
      { q: 'Which waters can I navigate from Rostock?', a: 'With the SBF Coastal you can navigate the Baltic Sea, the Lower Warnow and the Breitling. With the SBF Inland you can access the Mecklenburg Lake District – one of Europe\'s largest contiguous lake areas with over 1,000 lakes.' },
    ],
  },
  {
    slug: 'kiel',
    slugEn: 'kiel',
    name: 'Kiel',
    state: 'Schleswig-Holstein',
    type: 'coastal',
    priority: 6,
    waters: ['Ostsee', 'Kieler Förde', 'Kieler Bucht', 'Nord-Ostsee-Kanal', 'Schwentine'],
    waterDescription: {
      de: 'Kiel liegt direkt an der Ostsee und ist Heimat der weltberühmten Kieler Woche – einer der größten Segelregatten der Welt. Die Kieler Förde, die Kieler Bucht und der Nord-Ostsee-Kanal machen die Stadt zu einem der wichtigsten Wassersportreviere Deutschlands.',
      en: 'Kiel sits directly on the Baltic Sea and is home to the world-famous Kiel Week – one of the largest sailing regattas in the world. The Kiel Fjord, Kiel Bay and the Kiel Canal make the city one of Germany\'s most important watersports areas.',
    },
    examAuthority: 'DSV Prüfungsausschuss Kiel / DMYV Prüfungszentrum Schleswig-Holstein',
    specialRules: {
      de: 'Der Nord-Ostsee-Kanal ist eine Seeschifffahrtsstraße – SBF See erforderlich. Segeln ist auf dem NOK grundsätzlich verboten (Ausnahmen nur in bestimmten Bereichen). Höchstgeschwindigkeit: 12 km/h (6,5 Knoten). Befahrungsabgaben sind zu entrichten. Die Schwentine ist ein Binnengewässer (SBF Binnen).',
      en: 'The Kiel Canal is a maritime waterway – SBF Coastal required. Sailing is generally prohibited on the canal (exceptions only in specific areas). Speed limit: 12 km/h (6.5 knots). Transit fees apply. The Schwentine is an inland waterway (SBF Inland).',
    },
    recommendedLicense: 'SBF See',
    whyThisRegion: {
      de: 'Kiel ist das Segelmekka Deutschlands und Heimat der Kieler Woche – mit dem SBF See navigierst du sicher durch die Kieler Förde, über die Ostsee und durch den legendären Nord-Ostsee-Kanal.',
      en: 'Kiel is Germany\'s sailing mecca and home of Kiel Week – with the SBF Coastal you navigate safely through the Kiel Fjord, across the Baltic and through the legendary Kiel Canal.',
    },
    seoTitle: 'Sportbootführerschein Kiel',
    seoTitleEn: 'Boating License Kiel',
    description: 'Sportbootführerschein in Kiel: Ostsee, Kieler Förde und Nord-Ostsee-Kanal. Segelverbot auf dem NOK, Prüfungsorte und Vorbereitung mit Boatpass.',
    descriptionEn: 'Boating license in Kiel: Baltic Sea, Kiel Fjord and Kiel Canal. Sailing ban on the canal, exam locations and preparation with the Boatpass app.',
    faq: [
      { q: 'Welchen Führerschein brauche ich in Kiel?', a: 'In Kiel brauchst du primär den SBF See, denn die Kieler Förde, die Ostsee und der Nord-Ostsee-Kanal sind Seeschifffahrtsstraßen. Den SBF Binnen benötigst du zusätzlich, wenn du auch auf Binnengewässern wie der Schwentine fahren möchtest.' },
      { q: 'Darf ich auf dem Nord-Ostsee-Kanal segeln?', a: 'Nein, Segeln ist auf dem Nord-Ostsee-Kanal grundsätzlich verboten. Ausnahmen gelten nur in bestimmten Bereichen wie dem Schleusenhafen der alten Schleusen in Kiel-Holtenau.' },
      { q: 'Brauche ich für den Nord-Ostsee-Kanal einen Bootsführerschein?', a: 'Ja, der Nord-Ostsee-Kanal ist eine Seeschifffahrtsstraße. Für Motorboote ab 15 PS ist der SBF See vorgeschrieben. Außerdem fallen Befahrungsabgaben an, und die Höchstgeschwindigkeit beträgt 12 km/h (6,5 Knoten).' },
      { q: 'Wo kann ich in Kiel die SBF-Prüfung ablegen?', a: 'In Kiel gibt es den DSV Prüfungsausschuss Kiel (Soling 34, 24159 Kiel) und das DMYV Prüfungszentrum Schleswig-Holstein (Wittland 2–4, 24109 Kiel). Anmeldung mindestens 7 Tage vor dem Prüfungstermin.' },
    ],
    faqEn: [
      { q: 'Which license do I need in Kiel?', a: 'In Kiel you primarily need the SBF Coastal, as the Kiel Fjord, the Baltic Sea and the Kiel Canal are maritime waterways. The SBF Inland is additionally needed if you also want to navigate inland waters like the Schwentine.' },
      { q: 'Can I sail on the Kiel Canal?', a: 'No, sailing is generally prohibited on the Kiel Canal. Exceptions apply only in specific areas such as the lock harbour of the old locks in Kiel-Holtenau.' },
      { q: 'Do I need a license for the Kiel Canal?', a: 'Yes, the Kiel Canal is a maritime waterway. The SBF Coastal is required for motor boats above 15 HP. Transit fees also apply, and the speed limit is 12 km/h (6.5 knots).' },
      { q: 'Where can I take the boating exam in Kiel?', a: 'Kiel has the DSV Prüfungsausschuss Kiel (Soling 34, 24159 Kiel) and the DMYV Prüfungszentrum Schleswig-Holstein (Wittland 2–4, 24109 Kiel). Registration at least 7 days before the exam date.' },
    ],
  },
  {
    slug: 'duesseldorf',
    slugEn: 'dusseldorf',
    name: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    type: 'inland',
    priority: 7,
    waters: ['Rhein', 'Medienhafen', 'Unterbacher See (nur Segelboote)', 'Erft'],
    waterDescription: {
      de: 'Düsseldorf liegt am Rhein und bietet mit seinem Medienhafen und den Rheinpromenaden ein spannendes urbanes Bootsrevier. Der Rhein ist hier eine lebhafte Binnenschifffahrtsstraße mit Berufs- und Freizeitschifffahrt. Im Umland findest du mit dem Unterbacher See eine beliebte Freizeitanlage – dort allerdings nur für Segelboote und Tretboote, nicht für Motorboote.',
      en: 'Düsseldorf sits on the Rhine and, with its Medienhafen and Rhine promenades, offers an exciting urban boating area. The Rhine here is a lively inland waterway with commercial and leisure traffic. The Unterbacher See nearby is a popular leisure facility – but only for sailing boats and pedal boats, not motor boats.',
    },
    examAuthority: 'DMYV Prüfungszentrum NRW / DSV Prüfungsausschuss Rhein-Ruhr',
    specialRules: {
      de: 'Seit April 2023 gilt auf dem Rhein die allgemeine Grenze: SBF Binnen ab 15 PS (vorher 5 PS auf dem Rhein). Sportboote dürfen bis 20 m lang sein. Auf dem Unterbacher See sind Verbrennungsmotoren verboten; Hilfsmotoren an Segelbooten müssen elektrisch sein. Die praktische Prüfung findet am Medienhafen/Handelshafen auf dem Rhein statt.',
      en: 'Since April 2023, the standard threshold applies on the Rhine: SBF Inland from 15 HP (previously 5 HP on the Rhine). Boats up to 20 m are allowed. Combustion engines are prohibited on Unterbacher See; auxiliary engines on sailboats must be electric. The practical exam takes place at the Medienhafen/Handelshafen on the Rhine.',
    },
    recommendedLicense: 'SBF Binnen',
    whyThisRegion: {
      de: 'Düsseldorf vereint Großstadtflair und Rheinschifffahrt – mit dem SBF Binnen navigierst du sicher über eine der meistbefahrenen Wasserstraßen Europas, direkt vor der Skyline des Medienhafens.',
      en: 'Düsseldorf combines big-city flair with Rhine shipping – with the SBF Inland you navigate safely on one of Europe\'s busiest waterways, right in front of the Medienhafen skyline.',
    },
    seoTitle: 'Sportbootführerschein Düsseldorf',
    seoTitleEn: 'Boating License Dusseldorf',
    description: 'Sportbootführerschein in Düsseldorf: Rhein und Medienhafen. Neue 15-PS-Grenze seit 2023, Prüfungsorte und Vorbereitung mit der Boatpass-App.',
    descriptionEn: 'Boating license in Düsseldorf: Rhine and Medienhafen. Updated 15 HP threshold since 2023, exam locations and preparation with the Boatpass app.',
    faq: [
      { q: 'Ab wie viel PS brauche ich auf dem Rhein bei Düsseldorf einen Führerschein?', a: 'Seit April 2023 gilt auf dem Rhein die allgemeine Grenze: SBF Binnen ab 15 PS (11,03 kW Verbrennungsmotor). Die frühere Sonderregelung von 5 PS auf dem Rhein wurde aufgehoben.' },
      { q: 'Kann ich auf dem Unterbacher See Motorboot fahren?', a: 'Nein, auf dem Unterbacher See sind Verbrennungsmotoren verboten. Der See ist Segelbooten, Tretbooten und Paddelbooten vorbehalten. Hilfsmotoren an Segelbooten müssen elektrisch sein.' },
      { q: 'Wo kann ich in Düsseldorf die SBF-Prüfung ablegen?', a: 'Die Theorieprüfung des DMYV findet in Düsseldorf an der Cuxhavener Straße 6 statt. Die praktische Prüfung wird auf dem Rhein am Handelshafen abgenommen. Alternativ bietet der DSV Prüfungsausschuss Rhein-Ruhr ebenfalls Prüfungen in der Region an.' },
      { q: 'Brauche ich in Düsseldorf den SBF Binnen oder See?', a: 'In Düsseldorf brauchst du den SBF Binnen. Der Rhein ist eine Binnenschifffahrtsstraße. Den SBF See benötigst du nur für Küsten- und Seegewässer.' },
    ],
    faqEn: [
      { q: 'From how many HP do I need a license on the Rhine near Düsseldorf?', a: 'Since April 2023, the general threshold applies on the Rhine: SBF Inland from 15 HP (11.03 kW combustion engine). The previous special 5 HP rule on the Rhine was removed.' },
      { q: 'Can I use a motor boat on Unterbacher See?', a: 'No, combustion engines are prohibited on Unterbacher See. The lake is reserved for sailing boats, pedal boats and paddle boats. Auxiliary engines on sailboats must be electric.' },
      { q: 'Where can I take the boating exam in Düsseldorf?', a: 'The DMYV theory exam takes place at Cuxhavener Straße 6 in Düsseldorf. The practical exam is conducted on the Rhine at the Handelshafen. The DSV Prüfungsausschuss Rhein-Ruhr also offers exams in the region.' },
      { q: 'Do I need the SBF Inland or Coastal in Düsseldorf?', a: 'In Düsseldorf you need the SBF Inland. The Rhine is an inland waterway. The SBF Coastal is only needed for coastal and sea waters.' },
    ],
  },
  {
    slug: 'frankfurt',
    slugEn: 'frankfurt',
    name: 'Frankfurt am Main',
    state: 'Hessen',
    type: 'inland',
    priority: 8,
    waters: ['Main', 'Nidda', 'Offenbacher Hafen', 'Frankfurter Osthafen'],
    waterDescription: {
      de: 'Der Main ist das Herzgewässer Frankfurts – als Bundeswasserstraße verbindet er Berufs- und Freizeitschifffahrt mitten in der Stadt. Das Revier zwischen der Offenbacher und der Griesheimer Staustufe bietet ein ideales Übungsrevier mit wenig Wellen. Wer weiter fahren möchte, kann den Main über den Main-Donau-Kanal bis zur Donau befahren.',
      en: 'The Main is Frankfurt\'s core waterway – as a federal waterway it connects commercial and leisure shipping right through the city centre. The stretch between the Offenbach and Griesheim weirs offers an ideal practice area with calm water. Those wanting to go further can navigate the Main all the way to the Danube via the Main-Danube Canal.',
    },
    examAuthority: 'DSV Prüfungsausschuss Rhein-Mosel-Saar',
    specialRules: {
      de: 'Der Main ist durch Staustufen reguliert. Sportboote müssen die Schleusen nutzen und sich an die Schleusenordnung halten. Über den Main-Donau-Kanal ist der Main mit der Donau verbunden – eine der längsten Binnenwasserrouten Europas. Der zuständige Prüfungsausschuss ist der PA Rhein-Mosel-Saar (Theorieprüfung in Frankfurt-Fechenheim, Praxis am Hafen Mainkur).',
      en: 'The Main is regulated by weirs. Recreational boats must use the locks and follow lock regulations. Via the Main-Danube Canal, the Main connects to the Danube – one of Europe\'s longest inland waterway routes. The responsible exam committee is the PA Rhein-Mosel-Saar (theory exam in Frankfurt-Fechenheim, practical at Hafen Mainkur).',
    },
    recommendedLicense: 'SBF Binnen',
    whyThisRegion: {
      de: 'Frankfurt ist der ideale Ausgangspunkt für Touren auf dem Main – vom Stadtpanorama der Skyline bis zu malerischen Weinbergen am Untermain ist mit dem SBF Binnen alles erreichbar.',
      en: 'Frankfurt is the ideal starting point for tours on the Main – from the city skyline panorama to picturesque vineyards along the Lower Main, everything is accessible with the SBF Inland.',
    },
    seoTitle: 'Sportbootführerschein Frankfurt',
    seoTitleEn: 'Boating License Frankfurt',
    description: 'Sportbootführerschein in Frankfurt am Main: Flussrevier, Schleusen und Main-Donau-Kanal. Prüfungsorte und Vorbereitung mit der Boatpass-App.',
    descriptionEn: 'Boating license in Frankfurt am Main: river waters, locks and the Main-Danube Canal. Exam locations and preparation with the Boatpass app.',
    faq: [
      { q: 'Welchen Führerschein brauche ich auf dem Main?', a: 'Für den Main brauchst du den SBF Binnen. Er ist Pflicht ab 15 PS Motorleistung. Der Main ist eine Bundeswasserstraße mit Berufsschifffahrt.' },
      { q: 'Wo kann ich in Frankfurt die SBF-Prüfung ablegen?', a: 'Die Prüfung wird vom DSV Prüfungsausschuss Rhein-Mosel-Saar abgenommen. Die Theorieprüfung findet in Frankfurt-Fechenheim statt, die praktische Prüfung am Hafen Mainkur auf dem Main. Prüfungstermine finden in der Regel monatlich samstags statt.' },
      { q: 'Kann ich vom Main aus bis zur Donau fahren?', a: 'Ja, über den Main-Donau-Kanal ist der Main mit der Donau verbunden. Mit dem SBF Binnen kannst du diese gesamte Strecke befahren – eine der längsten Binnenwasserrouten Europas.' },
      { q: 'Ist der Main in Frankfurt ein gutes Übungsrevier?', a: 'Ja, der Main im Frankfurter Stadtgebiet (zwischen Offenbacher und Griesheimer Staustufe) gilt als ideales Übungsrevier: wenig Wellen, ausreichend Platz und moderate Strömung. Die praktische Ausbildung und Prüfung finden direkt auf dem Main statt.' },
    ],
    faqEn: [
      { q: 'Which license do I need on the River Main?', a: 'You need the SBF Inland for the Main. It is mandatory for engines above 15 HP. The Main is a federal waterway with commercial traffic.' },
      { q: 'Where are boating exams held in Frankfurt?', a: 'The exam is administered by the DSV Prüfungsausschuss Rhein-Mosel-Saar. Theory exams take place in Frankfurt-Fechenheim; practical exams at Hafen Mainkur on the Main. Exams are typically held monthly on Saturdays.' },
      { q: 'Can I navigate from the Main to the Danube?', a: 'Yes, the Main is connected to the Danube via the Main-Danube Canal. With the SBF Inland you can navigate this entire route – one of Europe\'s longest inland waterway routes.' },
      { q: 'Is the Main in Frankfurt a good practice area?', a: 'Yes, the Main in the Frankfurt city area (between the Offenbach and Griesheim weirs) is considered an ideal practice area: calm water, enough space and moderate current. Practical training and exams take place directly on the Main.' },
    ],
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getRegionBySlugEn(slugEn: string): Region | undefined {
  return REGIONS.find((r) => r.slugEn === slugEn);
}

export function getAllRegionSlugs(): string[] {
  return REGIONS.map((r) => r.slug);
}

export function getAllRegionSlugsEn(): string[] {
  return REGIONS.map((r) => r.slugEn);
}
