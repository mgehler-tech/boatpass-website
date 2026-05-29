# BoatPass Website Redesign — Design Spec

**Datum:** 2026-05-29  
**Status:** Approved  
**Ziel:** Moderneres, dynamischeres Design — hell, nautisch, vertrauenswürdig. Inspiriert von Revolut/Linear/Vercel, aber für Sportbootführerschein-Zielgruppe adaptiert.

---

## 1. Design-Tokens

### Farben

| Token | Wert | Verwendung |
|-------|------|------------|
| `--navy` | `#0a2647` | Headlines, Nav-Logo, CTA-Primär |
| `--blue` | `#0c5f9b` | Gradient-Ende, Links |
| `--teal` | `#0891b2` | Gradient-Start, Badge, Akzent |
| `--bg` | `#f7faff` | Seitenhintergrund |
| `--surface` | `#ffffff` | Cards, Nav |
| `--text` | `#0a1929` | Fließtext |
| `--muted` | `#64748b` | Subtexte, Labels |
| `--border` | `rgba(12,95,155,0.12)` | Card-Rahmen, Divider |

**Kein Dark Mode auf der Website** (die App hat Dark Mode, die Website nicht).

### Typografie

- **Schrift:** Inter (900/800/700/600/500/400)
- **Hero H1:** 64px, weight 900, letter-spacing -3px, line-height 1.0
- **Section H2:** 42px, weight 900, letter-spacing -2px
- **Card H3:** 17–18px, weight 800
- **Body:** 16–18px, weight 400–500, color `--muted`
- **Labels/Badges:** 12px, weight 700, UPPERCASE, letter-spacing 1px

### Gradient

Primärgradient (Buttons, Akzente, Heading-Span): `linear-gradient(135deg, #0c5f9b → #0891b2)`  
Hero-Headline-Akzent: animierter `gradientShift` (background-size 200%, 4s loop)

---

## 2. Navigation

- **Position:** Fixed, top, full-width
- **Background:** `rgba(247,250,255,0.85)` + `backdrop-filter: blur(20px)`
- **Border:** 1px bottom, `var(--border)`
- **Höhe:** 64px, padding 0 48px
- **Logo:** ⚓ + "boat**pass**" (teal für "pass")
- **Links:** Features · Preise · Blog · (Sprache DE/EN)
- **CTA:** "Jetzt testen" — Pill-Button, navy→blue Gradient, Schatten

---

## 3. Hero-Sektion

### Layout
Split-Grid: Text links (max 580px), Phone-Mockup rechts — `grid-template-columns: 1fr auto`.

### Hintergrund
- Radiale Gradienten (Orbs) in Blau/Teal, sehr dezent (opacity 0.08–0.10)
- Dot-Grid-Overlay per SVG-Hintergrund, rechts ausgeblendet per `mask-image`
- **Wave-Animation** am unteren Hero-Rand: SVG-Welle, endlos scrollend (`animation: wave 12s linear infinite`)

### Text-Content
1. **Badge** (animierter blinkender Dot + Text): "Offizieller DMYV-Fragenkatalog 2025/2026"
2. **H1** (3 Zeilen): "Der schnellste Weg zum **SBF Binnen.**" — letzter Span mit Gradient-Text-Animation
3. **Subline:** 18px, muted
4. **CTA-Gruppe:** Primär-Button (Play Store) + Ghost-Link ("Features ansehen →")
5. **Stats-Row** (getrennt durch border-top): 400+ Prüfungsfragen · 3 Lernmodi · 4,99 €

### Animationen (Einblenden beim Laden)
Alle Elemente: `fadeUp` (opacity 0→1, translateY 32px→0), gestaffelt:
- Badge: delay 0s
- H1: delay 0.1s
- Subline: delay 0.25s
- CTA: delay 0.4s
- Stats: delay 0.55s
- Phone: delay 0.4s

### Phone-Mockup
- Dark-Navy Rahmen (simuliert Android-Phone)
- **Float-Animation:** `translateY 0 ↔ -16px`, 6s loop (sanft, wie auf Wasser)
- **Glow:** Radialer blauer Lichtschein unter dem Phone (`blur: 20px`)
- **Inhalt:** App-Screenshot-Platzhalter (später durch echten Screenshot ersetzt)
- Zeigt: Begrüßung, Fortschrittsring (216/300), 3 Karten (Lernen, Prüfung, Fehler-Training)

---

## 4. Trust-Bar

Direkt unter Hero, weiß, border-top + border-bottom.  
5 Trust-Signale horizontal (flex, gap 48px):
- ⚓ Offizieller ELWIS-Fragenkatalog
- ✅ Stand August 2023 (aktuell gültig)
- 💳 Einmalkauf — kein Abo
- 🇩🇪 Deutsch & Englisch
- 🌙 Dark Mode

---

## 5. Feature-Sektion

- **Label-Chip** (pill, teal): "⚡ Features"
- **H2:** "Drei Wege zum Bestehen"
- **Grid:** 3×2, gap 16px
- **Cards:** weiß, `border-radius: 20px`, border `var(--border)`, Schatten auf Hover + `translateY(-4px)`
- **Top-Border-Reveal:** 3px Gradient-Linie (blue→teal), `scaleX(0→1)` beim Hover via CSS `::after`
- **Scroll-Animation:** `IntersectionObserver` — jede Card blendet beim Einrollen ein (opacity 0→1 + translateY 24px→0, 0.6s ease)

6 Features:
1. 📚 Lernmodus
2. 📝 Prüfungssimulation
3. 🎯 Fehler-Training
4. 📊 Fortschritt & Statistik
5. 🌙 Dark Mode & 2 Sprachen
6. ⚓ Offizieller Katalog

---

## 6. How-It-Works-Sektion

- **Hintergrund:** Helles Blau-Gradient (`#f0f7ff → #e8f4fd`)
- **3 Steps horizontal** mit connecting line (Gradient, opacity 0.2)
- Jeder Step: nummerierter Kreis (navy→blue Gradient, box-shadow Glow) + Label + Beschreibung
- **Scroll-Animation:** gleiche IntersectionObserver-Logik wie Feature-Cards

Schritte:
1. App herunterladen (Play Store, kostenlos)
2. Lernen & trainieren (Modus wählen)
3. Prüfung bestehen

---

## 7. Pricing-Sektion

- Zentrierter Header
- **2-Spalten Grid** (max 760px), gap 16px

**Free-Card:** weiß, border, €0, 3 Features, Ghost-Button  
**Premium-Card:** Navy→Dunkelblau Gradient, Glow-Schatten, "Beliebt"-Tag, €4,99, 6 Features, Teal-Button  
- Radiales Licht-Orb im Hintergrund der Premium-Card (pseudo-element)
- Scroll-Animation wie Feature-Cards

---

## 8. Animationen — Übersicht

| Animation | Element | Details |
|-----------|---------|---------|
| `fadeUp` | Hero-Elemente | opacity+translateY, gestaffelt 0–0.7s |
| `float` | Phone-Mockup | Y -16px ↔ 0, 6s loop |
| `wave` | Hero-Bottom-SVG | translateX -50%, 12s loop |
| `gradientShift` | H1-Gradient-Span | bg-position 0%↔100%, 4s loop |
| `blink` | Badge-Dot | opacity 1↔0.4, 2s loop |
| `scrollReveal` | Cards, Steps, Trust-Items | IntersectionObserver, 0.6s ease |

---

## 9. Technische Umsetzung

- **Framework:** Astro (bestehendes Projekt)
- **Styling:** Tailwind CSS v4 + Inline-Styles wo nötig für komplexe Animationen
- **Fonts:** Inter via Google Fonts (bereits in Projekt vorhanden)
- **Animationen:** CSS-only + minimales Vanilla JS (`IntersectionObserver`) — kein Animation-Framework
- **i18n:** Bestehende `useTranslations`-Logik beibehalten; neue Strings ergänzen
- **App-Screenshot:** Platzhalter bleibt bis echter Screenshot geliefert wird
- **Responsive:** Mobile-first, bei <768px: single-column, Phone-Mockup unterhalb Hero-Text

---

## 10. Was sich NICHT ändert

- URL-Struktur, Seitenstruktur (`index.astro`, Subpages)
- i18n-Architektur
- Blog-Bereich
- Footer-Struktur
- SEO-Komponente
