export interface BoatSchool {
  name: string;
  address: string;
  website: string;
  phone?: string;
  licenses: string[];
}

export interface BoatSchoolCity {
  slug: string;
  name: string;
  state: string;
  variant: 'coastal' | 'inland' | 'both';
  waterways: { de: string; en: string };
  intro: { de: string; en: string };
  examInfo: { de: string; en: string };
  mapsQuery: string;
  schools: BoatSchool[];
  faq: { q: { de: string; en: string }; a: { de: string; en: string } }[];
}

export const cities: BoatSchoolCity[] = [
  {
    slug: 'berlin',
    name: 'Berlin',
    state: 'Berlin',
    variant: 'inland',
    waterways: {
      de: 'Spree, Havel, Dahme, Müggelsee, Wannsee und zahlreiche Kanäle',
      en: 'Spree, Havel, Dahme, Müggelsee, Wannsee and numerous canals',
    },
    intro: {
      de: 'Berlin ist eine der wasserreichsten Städte Europas. Über 180 Kilometer Wasserstraßen, Dutzende Seen und ein dichtes Kanalnetz machen die Hauptstadt zu einem erstklassigen Revier für Motorboot- und Segelfahrer. Der Sportbootführerschein Binnen ist hier ab 15 PS Pflicht.',
      en: 'Berlin is one of Europe\'s most water-rich cities. Over 180 kilometres of waterways, dozens of lakes and a dense canal network make the capital an excellent area for motorboat and sailing enthusiasts. The inland boat licence is required here for engines above 15 HP.',
    },
    examInfo: {
      de: 'Prüfungen finden regelmäßig beim DMYV und DSV in Berlin statt, unter anderem in Köpenick und Spandau.',
      en: 'Exams are held regularly by the DMYV and DSV in Berlin, including locations in Köpenick and Spandau.',
    },
    mapsQuery: 'Bootsfahrschule Berlin',
    schools: [
      { name: 'Bootsfahrschule Berlin', address: 'An der Havelschanze, 13587 Berlin-Spandau', website: 'https://bootsfahrschule.berlin/', phone: '030 86437089', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'Skili Wassersport Berlin', address: 'Berlin-Spandau', website: 'https://skili.berlin/', licenses: ['SBF Binnen', 'SBF See', 'UBI', 'SRC'] },
      { name: 'Bootsschule Röllinghoff', address: 'Berlin-Köpenick', website: 'https://www.bootsschule-berlin.de/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Bootsschulung Berlin', address: 'Berlin-Köpenick, an der Dahme', website: 'https://bootsschulung.de/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Nautik Bootsfahrschule', address: 'Am Pichelssee 19, 13595 Berlin-Spandau', website: 'https://www.motorbootfuehrerschein-berlin-brandenburg.de/', phone: '030 6920695', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
    ],
    faq: [
      {
        q: { de: 'Wie viele Bootsfahrschulen gibt es in Berlin?', en: 'How many boat schools are there in Berlin?' },
        a: { de: 'In Berlin gibt es über 20 Bootsfahrschulen, verteilt auf Bezirke wie Köpenick, Spandau, Charlottenburg und Treptow – jeweils in der Nähe von Gewässern.', en: 'Berlin has over 20 boat schools, spread across districts like Köpenick, Spandau, Charlottenburg and Treptow – each near waterways.' },
      },
      {
        q: { de: 'Was kostet der Bootsführerschein in Berlin?', en: 'How much does a boat licence cost in Berlin?' },
        a: { de: 'Die Prüfungsgebühren betragen rund 130 € (Binnen) bzw. 148 € (See). Mit Fahrschule und Praxisstunden rechne mit insgesamt 400–700 €. Die Theorie kannst du mit BoatPass für 9,99 € eigenständig lernen.', en: 'Exam fees are around €130 (inland) or €148 (coastal). Including a school and practical lessons, expect €400–700 total. You can study the theory independently with BoatPass for €9.99.' },
      },
      {
        q: { de: 'Welcher Bootsführerschein ist für Berliner Gewässer nötig?', en: 'Which boat licence is needed for Berlin\'s waterways?' },
        a: { de: 'Für Spree, Havel und Berliner Seen brauchst du den SBF Binnen ab 15 PS. Wer auch an Nord- oder Ostsee fahren möchte, benötigt zusätzlich den SBF See.', en: 'For the Spree, Havel and Berlin\'s lakes you need the SBF Inland licence above 15 HP. If you also want to sail on the North or Baltic Sea, you\'ll additionally need the SBF Coastal licence.' },
      },
    ],
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    state: 'Hamburg',
    variant: 'both',
    waterways: {
      de: 'Elbe, Alster, Bille, Dove Elbe, Hamburger Hafen und Nordsee-Zugang',
      en: 'Elbe, Alster, Bille, Dove Elbe, Hamburg harbour and North Sea access',
    },
    intro: {
      de: 'Hamburg verbindet Binnengewässer und Seefahrt wie kaum eine andere Stadt. Auf der Alster segeln Hunderte Boote, über die Elbe erreicht man direkt die Nordsee. In Hamburgs zahlreichen Bootsfahrschulen kannst du sowohl den SBF Binnen als auch den SBF See machen.',
      en: 'Hamburg connects inland waterways and seafaring like few other cities. Hundreds of boats sail on the Alster, and the Elbe provides direct access to the North Sea. In Hamburg\'s numerous boat schools, you can take both the inland and coastal boat licence.',
    },
    examInfo: {
      de: 'Der DMYV und DSV bieten regelmäßig Prüfungen in Hamburg an, unter anderem am Jungfernstieg und in Hamburg-Harburg.',
      en: 'The DMYV and DSV offer regular exams in Hamburg, including locations at Jungfernstieg and Hamburg-Harburg.',
    },
    mapsQuery: 'Bootsfahrschule Hamburg',
    schools: [
      { name: 'Mobile Bootsfahrschule Hamburg', address: 'Schwarzenbergstr. 95, 21073 Hamburg', website: 'https://www.mobile-bootsfahrschule.de/schulungsort-hamburg/', licenses: ['SBF Binnen', 'SBF See', 'SKS', 'SRC', 'UBI'] },
      { name: 'Yachtschule Meridian', address: 'Hamburg-Rothenburgsort, an den Elbbrücken', website: 'https://yachtschule-meridian.de/', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
      { name: 'Sportbootschule Nautilus', address: 'Hamburg', website: 'https://www.sportbootschule-nautilus.de/', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI', 'LRC'] },
      { name: 'Yachtschule Buhlheller', address: 'Hamburg-Zentrum', website: 'https://buhlheller-yachting.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
    ],
    faq: [
      {
        q: { de: 'Brauche ich in Hamburg den SBF Binnen oder SBF See?', en: 'Do I need the SBF Inland or Coastal licence in Hamburg?' },
        a: { de: 'Für die Alster und Binnengewässer brauchst du den SBF Binnen. Für Elbe ab dem Hamburger Hafen Richtung Nordsee gilt der SBF See. Viele Hamburger machen direkt beide Scheine.', en: 'For the Alster and inland waterways you need the SBF Inland. For the Elbe from Hamburg harbour towards the North Sea, the SBF Coastal applies. Many people in Hamburg get both licences.' },
      },
      {
        q: { de: 'Was kostet der Bootsführerschein in Hamburg?', en: 'How much does a boat licence cost in Hamburg?' },
        a: { de: 'Die Prüfungsgebühren liegen bei ca. 130–148 €. Mit Fahrschule und Praxis kommst du auf 500–800 € pro Schein. Die Theorie lernst du mit BoatPass eigenständig für 9,99 € pro Katalog.', en: 'Exam fees are around €130–148. With a school and practical lessons, expect €500–800 per licence. Study the theory independently with BoatPass for €9.99 per catalogue.' },
      },
    ],
  },
  {
    slug: 'muenchen',
    name: 'München',
    state: 'Bayern',
    variant: 'inland',
    waterways: {
      de: 'Isar, Ammersee, Starnberger See, Chiemsee, Tegernsee und Bodensee-Nähe',
      en: 'Isar, Ammersee, Starnberger See, Chiemsee, Tegernsee and near Lake Constance',
    },
    intro: {
      de: 'München und Oberbayern bieten mit Ammersee, Starnberger See, Chiemsee und Tegernsee einige der schönsten Binnenreviere Deutschlands. Die Isar selbst ist nicht schiffbar, doch die umliegenden Seen sind ein Paradies für Motorboot- und Segelbegeisterte.',
      en: 'Munich and Upper Bavaria offer some of Germany\'s most beautiful inland waterways with Ammersee, Starnberger See, Chiemsee and Tegernsee. The Isar itself is not navigable, but the surrounding lakes are a paradise for motorboat and sailing enthusiasts.',
    },
    examInfo: {
      de: 'Prüfungen finden regelmäßig in München und Umgebung statt, oft direkt an den Seen (z. B. Ammersee, Starnberger See).',
      en: 'Exams are held regularly in Munich and surrounding areas, often directly at the lakes (e.g. Ammersee, Starnberger See).',
    },
    mapsQuery: 'Bootsfahrschule München',
    schools: [
      { name: 'Motorbootschule München', address: 'München / Starnberg', website: 'https://www.motorbootschule.com/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'ONWATER Bootsschule', address: 'München / Chiemsee', website: 'https://www.onwater.de/standorte/chiemsee', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Tokon Yachtschule', address: 'München', website: 'https://tokon-yachtschule.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'Weiss-Blau Segelschule', address: 'München', website: 'https://www.weiss-blau.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
    ],
    faq: [
      {
        q: { de: 'Kann ich mit dem Münchner Bootsführerschein auch am Chiemsee fahren?', en: 'Can I use my Munich boat licence on Chiemsee as well?' },
        a: { de: 'Ja, der SBF Binnen gilt auf allen deutschen Binnengewässern – also auch am Chiemsee, Ammersee, Starnberger See und allen anderen bayerischen Seen.', en: 'Yes, the SBF Inland licence is valid on all German inland waterways – including Chiemsee, Ammersee, Starnberger See and all other Bavarian lakes.' },
      },
      {
        q: { de: 'Was kostet der Bootsführerschein in München?', en: 'How much does a boat licence cost in Munich?' },
        a: { de: 'Prüfungsgebühren: ca. 130 € (Binnen). Fahrschulkurse in München kosten meist 400–600 €. Spare bei der Theorie mit BoatPass für 9,99 € pro Katalog.', en: 'Exam fees: approx. €130 (inland). Boat school courses in Munich typically cost €400–600. Save on theory with BoatPass for €9.99 per catalogue.' },
      },
    ],
  },
  {
    slug: 'koeln',
    name: 'Köln',
    state: 'Nordrhein-Westfalen',
    variant: 'inland',
    waterways: {
      de: 'Rhein, zahlreiche Altarme, Fühlinger See und angrenzende Kanäle',
      en: 'Rhine, numerous old arms, Fühlinger See and adjacent canals',
    },
    intro: {
      de: 'Der Rhein ist eine der meistbefahrenen Wasserstraßen Europas – und Köln liegt mittendrin. Bootsfahrschulen in Köln bieten Ausbildung am Rhein und auf umliegenden Seen. Der SBF Binnen ist hier Pflicht ab 15 PS.',
      en: 'The Rhine is one of Europe\'s busiest waterways – and Cologne sits right in the middle. Boat schools in Cologne offer training on the Rhine and surrounding lakes. The inland boat licence is required here above 15 HP.',
    },
    examInfo: {
      de: 'DMYV- und DSV-Prüfungen finden regelmäßig in Köln und Umgebung statt.',
      en: 'DMYV and DSV exams are held regularly in Cologne and the surrounding area.',
    },
    mapsQuery: 'Bootsfahrschule Köln',
    schools: [
      { name: 'Segeln macht Spaß', address: 'Rheinauhafen, Köln', website: 'https://segeln-macht-spass.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'PRIME YACHTING', address: 'Aachener Str. 1049, 50858 Köln', website: 'https://prime-yachting.de/standorte/sportbootschule-koeln/', phone: '0221 42353624', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
      { name: 'nautiCLUB Bootsschule', address: 'Köln-Sülz / Rodenkirchen', website: 'https://nauticlub.de/standorte/bootsfuehrerschein-koeln/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Bootsführerschein NRW', address: 'Höninger Weg 115, 50969 Köln', website: 'https://www.bootsfuehrerschein-nrw.de/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Darf ich auf dem Rhein bei Köln ohne Führerschein fahren?', en: 'Can I navigate the Rhine near Cologne without a licence?' },
        a: { de: 'Nur mit Booten unter 15 PS. Ab 15 PS ist der SBF Binnen Pflicht. Der Rhein ist eine stark befahrene Wasserstraße – Erfahrung und Kenntnisse sind hier besonders wichtig.', en: 'Only with boats under 15 HP. Above 15 HP, the SBF Inland licence is required. The Rhine is a heavily trafficked waterway – experience and knowledge are especially important here.' },
      },
      {
        q: { de: 'Was kostet der Bootsführerschein in Köln?', en: 'How much does a boat licence cost in Cologne?' },
        a: { de: 'Prüfungsgebühren: ca. 130 €. Bootsfahrschulen in Köln verlangen für den kompletten Kurs meist 450–650 €. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €130. Boat schools in Cologne typically charge €450–650 for a full course. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'duesseldorf',
    name: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    variant: 'inland',
    waterways: {
      de: 'Rhein, Unterbacher See, Elbsee und Benrather Schlossweiher',
      en: 'Rhine, Unterbacher See, Elbsee and Benrather Schlossweiher',
    },
    intro: {
      de: 'Düsseldorf ist als Standort der boot – der weltweit größten Wassersportmesse – ein Zentrum der Bootsszene. Der Rhein und umliegende Seen bieten vielfältige Möglichkeiten zum Bootfahren. Zahlreiche Fahrschulen bereiten hier auf den SBF Binnen vor.',
      en: 'Düsseldorf, home of boot – the world\'s largest water sports fair – is a centre of the boating scene. The Rhine and surrounding lakes offer diverse boating opportunities. Numerous schools prepare students for the inland boat licence here.',
    },
    examInfo: {
      de: 'Prüfungen werden regelmäßig in Düsseldorf angeboten, oft in Verbindung mit Fahrschulen am Rhein.',
      en: 'Exams are offered regularly in Düsseldorf, often in conjunction with boat schools on the Rhine.',
    },
    mapsQuery: 'Bootsfahrschule Düsseldorf',
    schools: [
      { name: 'ONWATER Bootsschule', address: 'Medienhafen, Düsseldorf', website: 'https://www.onwater.de/standorte/d%C3%BCsseldorf', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'nautiCLUB Düsseldorf', address: 'Düsseldorf-Zentrum / Medienhafen', website: 'https://nauticlub.de/standorte/bootsfuehrerschein-duesseldorf/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Bootsschule Bothe', address: 'Düsseldorf', website: 'https://bootsschulebothe.de/bootsfuehrerschein-duesseldorf/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Bootstrainer Düsseldorf', address: 'Düsseldorf', website: 'https://www.bootstrainer.de/', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der Bootsführerschein in Düsseldorf?', en: 'How much does a boat licence cost in Düsseldorf?' },
        a: { de: 'Prüfungsgebühren: ca. 130 €. Mit Fahrschule und Praxis rechne mit 450–700 € insgesamt. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €130. Including a school and practical lessons, expect €450–700 total. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'frankfurt',
    name: 'Frankfurt am Main',
    state: 'Hessen',
    variant: 'inland',
    waterways: {
      de: 'Main, Nidda und Verbindung zum Rhein-Main-Donau-Kanal',
      en: 'Main, Nidda and connection to the Rhine-Main-Danube Canal',
    },
    intro: {
      de: 'Frankfurt liegt direkt am Main, der eine der wichtigsten Binnenwasserstraßen Deutschlands ist. Über den Rhein-Main-Donau-Kanal ist Frankfurt mit einem europaweiten Wasserstraßennetz verbunden. Der SBF Binnen ist hier ab 15 PS Pflicht.',
      en: 'Frankfurt sits directly on the Main, one of Germany\'s most important inland waterways. Via the Rhine-Main-Danube Canal, Frankfurt is connected to a Europe-wide waterway network. The inland boat licence is required here above 15 HP.',
    },
    examInfo: {
      de: 'Prüfungen finden regelmäßig in Frankfurt und Umgebung statt.',
      en: 'Exams are held regularly in Frankfurt and the surrounding area.',
    },
    mapsQuery: 'Bootsfahrschule Frankfurt am Main',
    schools: [
      { name: 'Aquafun Bootsschule Frankfurt', address: 'Frankfurt-Fechenheim, am Main', website: 'https://www.aquafun.de/bootsschulen/frankfurt/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Segel-Center Frankfurt', address: 'Frankfurt am Main', website: 'https://www.segel-center-frankfurt.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'Boot-Fahrschulteam', address: 'Frankfurter Westhafen', website: 'https://www.boot-fahrschulteam.com/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Sportbootschule Steiner', address: 'Maintal bei Frankfurt', website: 'https://sportbootschule-steiner.de/bootsfuehrerschein-frankfurt/', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der Bootsführerschein in Frankfurt?', en: 'How much does a boat licence cost in Frankfurt?' },
        a: { de: 'Prüfungsgebühren: ca. 130 €. Fahrschulen in Frankfurt verlangen meist 450–650 € für den Kurs. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €130. Schools in Frankfurt typically charge €450–650 for a course. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    state: 'Baden-Württemberg',
    variant: 'inland',
    waterways: {
      de: 'Neckar, Max-Eyth-See, Bodensee in Tagesreichweite',
      en: 'Neckar, Max-Eyth-See, Lake Constance within day-trip reach',
    },
    intro: {
      de: 'Stuttgart liegt am Neckar und ist Ausgangspunkt für Touren zum Bodensee – einem der beliebtesten Binnenreviere Deutschlands. Bootsfahrschulen in Stuttgart bieten Kurse für SBF Binnen, oft auch mit Praxisausbildung am Bodensee.',
      en: 'Stuttgart sits on the Neckar and is a starting point for trips to Lake Constance – one of Germany\'s most popular inland waterways. Boat schools in Stuttgart offer inland licence courses, often with practical training at Lake Constance.',
    },
    examInfo: {
      de: 'Prüfungen werden in Stuttgart und am Bodensee angeboten.',
      en: 'Exams are offered in Stuttgart and at Lake Constance.',
    },
    mapsQuery: 'Bootsfahrschule Stuttgart',
    schools: [
      { name: 'Sportbootschule Kolumbus', address: 'Stuttgart / Bad Cannstatt / Besigheim', website: 'https://www.sportbootschule-kolumbus.de/standorte/bootsfuehrerschein-stuttgart', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
      { name: 'Sportbootschule Atlantik', address: 'Stuttgart / Esslingen / Ludwigsburg', website: 'https://www.sportbootschule-atlantik.de/', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
      { name: 'Sportboot Service Stuttgart', address: 'Stuttgart', website: 'https://www.boot-online.net/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Brauche ich für den Bodensee ein extra Patent?', en: 'Do I need a special licence for Lake Constance?' },
        a: { de: 'Ja, für den Bodensee gilt ein eigenes Patentsystem. Ab 6 PS (4,41 kW) brauchst du das Bodenseeschifferpatent. Der SBF Binnen allein reicht dort nicht aus.', en: 'Yes, Lake Constance has its own licence system. Above 6 HP (4.41 kW) you need the Bodensee boating patent. The SBF Inland alone is not sufficient there.' },
      },
    ],
  },
  {
    slug: 'kiel',
    name: 'Kiel',
    state: 'Schleswig-Holstein',
    variant: 'coastal',
    waterways: {
      de: 'Kieler Förde, Ostsee, Nord-Ostsee-Kanal und Kieler Bucht',
      en: 'Kiel Fjord, Baltic Sea, Kiel Canal and Kiel Bay',
    },
    intro: {
      de: 'Kiel ist Deutschlands Segelhauptstadt – die Kieler Woche ist das größte Segelevent der Welt. Die Kieler Förde und der Nord-Ostsee-Kanal bieten beste Bedingungen für den SBF See. Zahlreiche Fahrschulen bilden hier für die Küstengewässer aus.',
      en: 'Kiel is Germany\'s sailing capital – Kiel Week is the world\'s largest sailing event. The Kiel Fjord and the Kiel Canal offer ideal conditions for the coastal boat licence. Numerous schools train students for coastal waters here.',
    },
    examInfo: {
      de: 'Der DMYV bietet regelmäßig Prüfungen in Kiel an, sowohl für SBF See als auch für Funkzeugnisse.',
      en: 'The DMYV offers regular exams in Kiel, both for the coastal boat licence and radio certificates.',
    },
    mapsQuery: 'Bootsfahrschule Kiel',
    schools: [
      { name: 'Sportbootschule Mielke', address: 'Kiel', website: 'https://www.sportbootschule-mielke.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS', 'SRC', 'UBI'] },
      { name: 'Ostseewassersport Poseidon', address: 'Kiel', website: 'https://www.ostseewassersport.de/ausbildung-in-kiel/', licenses: ['SBF Binnen', 'SBF See', 'SRC'] },
      { name: 'Bootsfahrschule Dietz', address: 'Kiel', website: 'https://yachtcharter-dietz.de/bootsfuehrerschein-kurse-in-kiel/', licenses: ['SBF Binnen', 'SBF See', 'SKS', 'SRC', 'UBI'] },
      { name: 'Sportbootschule Kiel', address: 'Kiel', website: 'https://www.sportbootschule-kiel.eu/', licenses: ['SBF Binnen', 'SBF See', 'SRC'] },
      { name: 'WSS Zwischen den Meeren', address: 'Kiel', website: 'https://wss-zwischen-den-meeren.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS', 'SRC', 'UBI', 'LRC'] },
    ],
    faq: [
      {
        q: { de: 'Welchen Führerschein brauche ich für die Kieler Förde?', en: 'Which licence do I need for Kiel Fjord?' },
        a: { de: 'Für die Kieler Förde und die Ostsee brauchst du den SBF See. Viele Fahrschulen in Kiel bieten auch gleich das SRC-Funkzeugnis mit an.', en: 'For Kiel Fjord and the Baltic Sea, you need the SBF Coastal licence. Many boat schools in Kiel also offer the SRC radio certificate as part of their courses.' },
      },
    ],
  },
  {
    slug: 'rostock',
    name: 'Rostock',
    state: 'Mecklenburg-Vorpommern',
    variant: 'coastal',
    waterways: {
      de: 'Ostsee, Warnow, Warnemünde und Zugang zur Mecklenburgischen Seenplatte',
      en: 'Baltic Sea, Warnow, Warnemünde and access to the Mecklenburg Lake District',
    },
    intro: {
      de: 'Rostock mit dem Seebad Warnemünde ist das Tor zur Ostsee in Mecklenburg-Vorpommern. Die Stadt bietet ideale Bedingungen für den SBF See und über die Warnow auch Zugang zum Binnenschifffahrtsnetz der Mecklenburgischen Seenplatte.',
      en: 'Rostock with its seaside resort Warnemünde is the gateway to the Baltic Sea in Mecklenburg-Vorpommern. The city offers ideal conditions for the coastal boat licence and via the Warnow, access to the inland waterway network of the Mecklenburg Lake District.',
    },
    examInfo: {
      de: 'Prüfungen finden regelmäßig in Rostock und Warnemünde statt.',
      en: 'Exams are held regularly in Rostock and Warnemünde.',
    },
    mapsQuery: 'Bootsfahrschule Rostock',
    schools: [
      { name: 'Baltic Sport Warnemünde', address: 'Am Strom 69, 18119 Rostock-Warnemünde', website: 'https://www.balticsport.de/', phone: '0381 5108488', licenses: ['SBF Binnen', 'SBF See', 'SKS', 'SRC', 'UBI'] },
      { name: 'Wasport Bootsfahrschule', address: 'Hundsburgallee 8, 18106 Rostock', website: 'https://www.wasport.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'Renós Bootsschule / Wasser360', address: 'Rostock-Gehlsdorf', website: 'https://www.wasser360.de/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der SBF See in Rostock?', en: 'How much does the SBF Coastal cost in Rostock?' },
        a: { de: 'Prüfungsgebühren: ca. 148 €. Fahrschulen in Rostock bieten Komplettkurse ab 500 €. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €148. Boat schools in Rostock offer complete courses from €500. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'bremen',
    name: 'Bremen',
    state: 'Bremen',
    variant: 'both',
    waterways: {
      de: 'Weser, Lesum, Werdersee und Zugang zur Nordsee über Bremerhaven',
      en: 'Weser, Lesum, Werdersee and North Sea access via Bremerhaven',
    },
    intro: {
      de: 'Bremen liegt an der Weser und ist über Bremerhaven direkt mit der Nordsee verbunden. Die Hansestadt bietet Ausbildung für SBF Binnen und SBF See – ideal für alle, die sowohl auf Binnengewässern als auch auf See fahren möchten.',
      en: 'Bremen sits on the Weser and is directly connected to the North Sea via Bremerhaven. The Hanseatic city offers training for both inland and coastal boat licences – ideal for those who want to navigate both inland waters and the sea.',
    },
    examInfo: {
      de: 'Prüfungen werden in Bremen und Bremerhaven angeboten.',
      en: 'Exams are offered in Bremen and Bremerhaven.',
    },
    mapsQuery: 'Bootsfahrschule Bremen',
    schools: [
      { name: 'Bremer Segelschule', address: 'Landrat-Christians-Str. 99, 28779 Bremen', website: 'https://www.bremer-segelschule.de/', phone: '0421 601655', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'BOOTSAUSBILDUNG.com', address: 'Bremen', website: 'https://www.bootsausbildung.com/', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
      { name: 'Bootsfahrschule Dietz', address: 'Bremen / Bremerhaven', website: 'https://www.bootsfahrschule-dietz.de/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der Bootsführerschein in Bremen?', en: 'How much does a boat licence cost in Bremen?' },
        a: { de: 'Prüfungsgebühren: ca. 130–148 €. Mit Fahrschule und Praxis rechne mit 450–700 €. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €130–148. Including a school and practical lessons, expect €450–700. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'hannover',
    name: 'Hannover',
    state: 'Niedersachsen',
    variant: 'inland',
    waterways: {
      de: 'Mittellandkanal, Maschsee, Steinhuder Meer und Leine',
      en: 'Mittelland Canal, Maschsee, Steinhuder Meer and Leine',
    },
    intro: {
      de: 'Hannover liegt am Mittellandkanal – der längsten künstlichen Wasserstraße Deutschlands. Das Steinhuder Meer, Niedersachsens größter See, ist nur 30 km entfernt. Die Region bietet abwechslungsreiche Reviere für den SBF Binnen.',
      en: 'Hanover sits on the Mittelland Canal – Germany\'s longest artificial waterway. The Steinhuder Meer, Lower Saxony\'s largest lake, is only 30 km away. The region offers diverse areas for the inland boat licence.',
    },
    examInfo: {
      de: 'Prüfungen finden regelmäßig in Hannover statt.',
      en: 'Exams are held regularly in Hanover.',
    },
    mapsQuery: 'Bootsfahrschule Hannover',
    schools: [
      { name: 'Bootsfahrschule Hannover', address: 'Werftstraße 19, 30163 Hannover', website: 'https://www.bootsfahrschule-hannover.de/', phone: '0511 2625544', licenses: ['SBF Binnen', 'SBF See', 'SRC', 'UBI'] },
      { name: 'Yachtfahrschule Hannover', address: 'Hannover', website: 'https://www.yachtfahrschule.de/', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'Bootsfahrschule Yachthafen', address: 'Steinhuder Meer, Hannover Region', website: 'https://www.bootsfahrschule-yachthafen.de/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der Bootsführerschein in Hannover?', en: 'How much does a boat licence cost in Hanover?' },
        a: { de: 'Prüfungsgebühren: ca. 130 €. Fahrschulen in Hannover bieten Kurse ab ca. 400 €. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €130. Schools in Hanover offer courses from approx. €400. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'dresden',
    name: 'Dresden',
    state: 'Sachsen',
    variant: 'inland',
    waterways: {
      de: 'Elbe, Talsperre Malter, Talsperre Pöhl und Sächsische Schweiz',
      en: 'Elbe, Malter Reservoir, Pöhl Reservoir and Saxon Switzerland',
    },
    intro: {
      de: 'Dresden liegt an der Elbe und ist Ausgangspunkt für Touren durch die Sächsische Schweiz. Die Talsperren der Umgebung bieten zusätzliche Reviere für Motorboot- und Segelausbildung. Der SBF Binnen ist ab 15 PS Pflicht.',
      en: 'Dresden sits on the Elbe and is a starting point for tours through Saxon Switzerland. The surrounding reservoirs offer additional areas for motorboat and sailing training. The inland boat licence is required above 15 HP.',
    },
    examInfo: {
      de: 'DMYV-Prüfungen finden regelmäßig in Dresden statt.',
      en: 'DMYV exams are held regularly in Dresden.',
    },
    mapsQuery: 'Bootsfahrschule Dresden',
    schools: [
      { name: 'Yachtschule Dresden', address: 'Tharandter Str. 45a, 01159 Dresden', website: 'https://www.yachtschule-dresden.de/', phone: '0351 4272888', licenses: ['SBF Binnen', 'SBF See', 'SKS'] },
      { name: 'Skipper Akademie Dresden', address: 'Dresden', website: 'https://www.skipper-akademie.de/', licenses: ['SBF Binnen', 'SBF See', 'SRC'] },
      { name: 'Bootsschule Dresden', address: 'Dresden', website: 'https://www.bootsschule-dresden.de/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der Bootsführerschein in Dresden?', en: 'How much does a boat licence cost in Dresden?' },
        a: { de: 'Prüfungsgebühren: ca. 130 €. Fahrschulen in Dresden bieten Kurse ab ca. 400 €. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €130. Schools in Dresden offer courses from approx. €400. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
  {
    slug: 'luebeck',
    name: 'Lübeck',
    state: 'Schleswig-Holstein',
    variant: 'coastal',
    waterways: {
      de: 'Trave, Lübecker Bucht, Ostsee und Elbe-Lübeck-Kanal',
      en: 'Trave, Lübeck Bay, Baltic Sea and Elbe-Lübeck Canal',
    },
    intro: {
      de: 'Lübeck liegt an der Trave mit direktem Zugang zur Ostsee über Travemünde. Der Elbe-Lübeck-Kanal verbindet die Hansestadt mit dem Binnenwasserstraßennetz. Für die Ostsee brauchst du den SBF See.',
      en: 'Lübeck sits on the Trave with direct access to the Baltic Sea via Travemünde. The Elbe-Lübeck Canal connects the Hanseatic city to the inland waterway network. For the Baltic Sea, you need the coastal boat licence.',
    },
    examInfo: {
      de: 'Prüfungen werden in Lübeck und Travemünde angeboten.',
      en: 'Exams are offered in Lübeck and Travemünde.',
    },
    mapsQuery: 'Bootsfahrschule Lübeck',
    schools: [
      { name: 'Wasserfahrschule Travemünde', address: 'Travemünde, 23570 Lübeck', website: 'https://www.wasserfahrschule-travemuende.de/', phone: '04502 880033', licenses: ['SBF Binnen', 'SBF See', 'SKS', 'SRC'] },
      { name: 'Aquafun Bootsschule Lübeck', address: 'Lübeck', website: 'https://www.aquafun-luebeck.de/', licenses: ['SBF Binnen', 'SBF See'] },
      { name: 'Bootsfahrschule Dietz Lübeck', address: 'Lübeck / Travemünde', website: 'https://www.bootsfahrschule-dietz.de/', licenses: ['SBF Binnen', 'SBF See'] },
    ],
    faq: [
      {
        q: { de: 'Was kostet der SBF See in Lübeck?', en: 'How much does the SBF Coastal cost in Lübeck?' },
        a: { de: 'Prüfungsgebühren: ca. 148 €. Fahrschulen in Lübeck bieten Komplettkurse ab ca. 500 €. Die Theorie lernst du mit BoatPass für 9,99 €.', en: 'Exam fees: approx. €148. Schools in Lübeck offer complete courses from approx. €500. Study the theory with BoatPass for €9.99.' },
      },
    ],
  },
];

export function getCityBySlug(slug: string): BoatSchoolCity | undefined {
  return cities.find(c => c.slug === slug);
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}
