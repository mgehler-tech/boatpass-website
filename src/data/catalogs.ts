/**
 * Amtliche Fragenkataloge je Lizenz: kanonische ELWIS-Seiten, die stets die
 * gültige Fassung zeigen (amtlich verifiziert, Stand Juni 2026). Katalog-
 * Bezeichnung und Fassung stehen in den Übersetzungen (`catalogSources`).
 *
 * Eine Quelle für die Katalog-Übersicht der Lizenzseiten (CatalogSources)
 * und die Preistafel der Startseite (PricingSection).
 */
export type LicenseKey = 'binnen' | 'see' | 'src' | 'lrc' | 'ubi';

export const CATALOG_URLS: Record<LicenseKey, string> = {
  binnen: 'https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-Binnen/Fragenkatalog-Binnen-neu-node.html',
  see: 'https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-See/Fragenkatalog-See-neu-node.html',
  src: 'https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Fragenkatalog-SRC-2018.html',
  lrc: 'https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Fragenkatalog-LRC-2018.html',
  ubi: 'https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Sprechfunkzeugnisse-node.html',
};
