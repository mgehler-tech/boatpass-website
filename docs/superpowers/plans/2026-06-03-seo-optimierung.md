# SEO-Optimierung Boatpass — Schritt-für-Schritt-Plan

Stand: 2026-06-03. Basis: Google SEO Starter Guide + Ist-Analyse der Codebase.
Fundament (Canonical, hreflang, Sitemap, Schema, OG, alt-Texte) ist bereits stark.
Dieser Plan deckt nur die **echten Lücken** ab, priorisiert nach Wirkung.

---

## Phase 1 — Quick Wins (technisch, sofort umsetzbar)

### Schritt 1.1: Platzhalter-Links aus der Navigation entfernen
**Problem:** `src/components/Header.astro:47-48` enthält zwei tote `href="#"`
(Bodenseeschifferpatent, LRC – „bald").
**Tun:**
- Links durch nicht-klickbares `<span>` mit „bald"-Badge ersetzen (oder ganz ausblenden).
- Prüfen, ob die gleichen Platzhalter im Footer existieren → dort identisch behandeln.
**Verify:** `grep -rn 'href="#"' src/` → 0 Treffer.

### Schritt 1.2: Eigene OG-Bilder pro Blog-Artikel
**Problem:** `src/pages/blog/[slug].astro` übergibt kein `ogImage`; `image`-Feld im
Schema (`src/content.config.ts:11`) wird von 0 Artikeln genutzt → alle teilen
generisches `og-image.png`.
**Tun:**
1. Pro Artikel ein OG-Bild (1200×630) unter `public/images/blog/<slug>.png` anlegen
   (Übergangslösung: bestehendes `og-image.png` als Fallback belassen).
2. `image:`-Frontmatter in jedem Artikel (`src/content/blog/de|en/*.md`) setzen.
3. In `src/pages/blog/[slug].astro` **und** `src/pages/en/blog/[slug].astro`
   `ogImage={post.data.image}` an `BlogLayout` durchreichen.
4. `BlogLayout.astro` → `BaseLayout` → `SEO.astro`: `ogImage`-Prop durchschleifen
   (Pfad ist bereits vorhanden, nur Wert übergeben).
**Verify:** `npm run build`, dann im `dist/blog/<slug>/index.html` prüfen, dass
`og:image` auf das artikelspezifische Bild zeigt.

---

## Phase 2 — Rich Results (größter Sicht-Effekt, braucht echte Daten)

### Schritt 2.1: `aggregateRating` ins MobileApplication-Schema
**Problem:** `src/components/SEO.astro:85` (MobileApplication) hat `offers`, aber
keine Bewertung → keine Sterne im Suchergebnis.
**Voraussetzung:** ECHTE Play-Store-Zahlen (Schnitt + Anzahl). Erfundene Werte
verstoßen gegen Google-Policy → würden zu manueller Maßnahme führen.
**Tun:**
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "<echter Schnitt>",
  "ratingCount": "<echte Anzahl>",
  "bestRating": "5"
}
```
in das MobileApplication-Objekt einfügen.
**Verify:** Rich Results Test (search.google.com/test/rich-results) → MobileApp
mit Rating erkannt, keine Fehler.

---

## Phase 3 — Internationalisierung (mittelfristig)

### Schritt 3.1: Blog-hreflang DE↔EN reaktivieren
**Problem:** `src/layouts/BlogLayout.astro:57` setzt `hasAlternate={false}`, obwohl
EN-Übersetzungen existieren. Slugs unterscheiden sich
(`5-tipps-sbf-bestehen` ↔ `5-tips-pass-sbf`) → kein automatisches 1:1-Mapping.
**Tun:**
1. Feld `altSlug: z.string().optional()` ins Blog-Schema (`content.config.ts`)
   aufnehmen — verweist auf den Slug der Übersetzung.
2. In jedem Artikel-Frontmatter `altSlug` der jeweiligen Gegensprache setzen.
3. In `BlogLayout.astro` aus `altSlug` die korrekte alternative URL bauen und
   `hasAlternate={true}` + die URL an `SEO.astro` übergeben
   (ggf. `SEO.astro` um optionales `altUrlOverride`-Prop erweitern, da die
   aktuelle Pfad-Heuristik bei abweichenden Slugs nicht greift).
**Verify:** `dist/blog/<slug>/index.html` enthält korrektes
`<link rel="alternate" hreflang="en" ...>` auf die existierende EN-URL (und umgekehrt).

---

## Phase 4 — Redaktionell / laufend (kein Code)

### Schritt 4.1: Frische-Signale pflegen
- Bei inhaltlicher Aktualisierung eines Artikels echtes `dateModified` setzen
  (aktuell `dateModified == datePublished` in `BlogLayout.astro:23`).
  Optional: Frontmatter-Feld `updated:` ergänzen und im Article-Schema nutzen.
- Alle Artikel tragen aktuell `2026-05-29` → bei Überarbeitung nachziehen.

### Schritt 4.2: Titel/Snippets schärfen
- Page-`<title>` der Landingpages: wichtigstes Keyword vorne, eindeutig pro Seite.
- Meta-Descriptions: kurz, einzigartig, mit konkretem Nutzenversprechen.

---

## NICHT TUN (laut Google-Leitfaden Mythen — Aufwand sparen)
- Meta-Keywords, Keyword-Stuffing in Domain/URL
- Mindest-/Maximal-Textlänge erzwingen
- „Ideale" Anzahl/Reihenfolge von Überschriften
- E-E-A-T als „Ranking-Faktor" behandeln
- Angst vor Duplicate-Content-„Strafe" (Canonical reicht)
- FAQPage-Schema-Ausbau für Rich Results — Google zeigt FAQ-Rich-Results seit
  2023 nur noch für Behörden/Health. Bestehendes Schema belassen, nicht ausbauen.

---

## Empfohlene Reihenfolge
1. **Phase 1** (1.1 + 1.2) — sofort, rein technisch, kein externer Input nötig.
2. **Phase 2** — sobald Play-Store-Zahlen vorliegen.
3. **Phase 3** — wenn internationale Reichweite priorisiert wird.
4. **Phase 4** — laufend.

Nach jeder Phase: `npm run build` + Push.
