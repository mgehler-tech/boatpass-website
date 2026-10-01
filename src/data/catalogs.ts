/**
 * Amtliche Fragenkataloge je Lizenz – eine Quelle für die Startseite
 * (HomeCatalogs) und die Lizenzseiten (CatalogSources).
 *
 * Lizenz-Namen, Stände und ELWIS-Links sind amtlich verifiziert (Stand Juni 2026).
 * Verlinkt sind die kanonischen ELWIS-Seiten, die stets die gültige Fassung zeigen.
 * Die Texte (Katalog-Bezeichnung, "gültig seit") kommen aus i18n/catalogSources.
 */
import { useTranslations, type Lang } from '../i18n/index';

export type CatalogKey = 'binnen' | 'see' | 'src' | 'lrc' | 'ubi';

export interface CatalogRow {
  key: CatalogKey;
  license: string;
  catalog: string;
  stand: string;
  next?: string;
  url: string;
}

export function catalogRows(lang: Lang): CatalogRow[] {
  const cs = useTranslations(lang).catalogSources;
  return [
    { key: 'binnen', license: 'SBF Binnen', catalog: cs.binnenCat, stand: cs.binnenStand, url: 'https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-Binnen/Fragenkatalog-Binnen-neu-node.html' },
    { key: 'see', license: 'SBF See', catalog: cs.seeCat, stand: cs.seeStand, url: 'https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-See/Fragenkatalog-See-neu-node.html' },
    { key: 'src', license: 'SRC', catalog: cs.srcCat, stand: cs.srcStand, url: 'https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Fragenkatalog-SRC-2018.html' },
    { key: 'lrc', license: 'LRC', catalog: cs.lrcCat, stand: cs.lrcStand, url: 'https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Fragenkatalog-LRC-2018.html' },
    { key: 'ubi', license: 'UBI', catalog: cs.ubiCat, stand: cs.ubiStand, next: cs.ubiNext, url: 'https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Sprechfunkzeugnisse-node.html' },
  ];
}

/**
 * "Stand dieser Übersicht" – wird beim Build aus dem aktuellen Datum gesetzt,
 * so ist die Angabe bei jedem Deploy ehrlich aktuell.
 */
export function catalogPageStand(lang: Lang, now = new Date()): string {
  const months = lang === 'de'
    ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}
