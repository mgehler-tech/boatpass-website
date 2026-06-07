# Freemium Model Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aktualisiere Website-Texte und Pricing-Layout um das neue Free/Paid-Modell korrekt darzustellen: globales Tageslimit (15 Fragen/Tag über alle Kataloge), alle Kataloge antestbar, klar kommunizierte Pro-Features pro Katalog.

**Architecture:** Nur i18n-Dateien (de.ts + en.ts) und PricingSection.astro werden geändert. Die SBF-See- und UBI-Karten bekommen eine Mini-Feature-Liste. Kein neues JS, keine neuen Komponenten.

**Tech Stack:** Astro, TypeScript i18n, inline CSS

---

## Dateien

| Datei | Änderung |
|---|---|
| `src/i18n/de.ts` | pricing-Texte für neues Modell aktualisieren |
| `src/i18n/en.ts` | pricing-Texte (EN) aktualisieren |
| `src/components/PricingSection.astro` | SBF-See + UBI Karten um Feature-Liste + Free-Badge erweitern; SBF-Binnen-Card freeFeatures/paidFeatures aktualisieren |

---

## Task 1: i18n Deutsch — neues Modell

**Dateien:**
- Modify: `src/i18n/de.ts` (pricing-Block, Zeilen 77–108)

Was sich ändert und warum:
- `catalog1Tagline`: war "15 Fragen täglich gratis — dann entscheiden" → jetzt klar machen, dass das Limit **global** gilt
- `freeFeatures`: Fehler-Training rein (bleibt gratis); "erkunden" → "alle Kataloge antestbar"
- `paidFeatures`: "Prüfungsmodus" → "Prüfungssimulation"; "Fragen-Browser" neu hinzufügen
- `catalog2Desc`: "kein kostenloser Testzugang" entfernen → jetzt antestbar
- `catalog3Desc`: "nicht im SBF-Bundle" hinzufügen
- `modelHint`: globales Limit betonen
- `paidLabel`: bleibt, passt zum Binnen-Kartenheader
- Neue Keys für SBF-See + UBI Mini-Feature-Liste: `seePaidFeatures`, `ubiPaidFeatures`
- Neuer Key `freeTrialNote` für Badge auf SBF-See + UBI
- `bundleName`: "SBF-Bundle" (präziser)
- `bundleDesc`: UBI-Ausschluss klarstellen

- [ ] **Step 1: pricing-Block in de.ts ersetzen**

Ersetze den kompletten `pricing`-Block (Zeilen 77–108) mit:

```typescript
  pricing: {
    chip: 'Preise',
    title: 'Kostenlos starten. Nur zahlen, was du brauchst.',
    subtitle: 'Teste alle Kataloge kostenlos — 15 Fragen täglich über alle Kataloge. Kaufe nur, was du wirklich brauchst.',
    modelHint: '15 Fragen/Tag über alle Kataloge · kein Abo · jederzeit erweiterbar',
    available: 'Verfügbar',
    price: '€ 6,99',
    ctaFree: 'Kostenlos starten',
    ctaUnlock: 'Vollzugang freischalten',
    ctaStore: 'Im Play Store öffnen',
    catalog1Name: 'SBF Binnen',
    catalog1Tagline: '15 Fragen täglich gratis — für alle Kataloge zusammen',
    freeLabel: 'Kostenlos',
    paidLabel: '€ 6,99 Einmalkauf',
    freeFeatures: ['15 Lernfragen/Tag (alle Kataloge)', 'Alle Kataloge antestbar', 'Fehler-Training inklusive'],
    paidFeatures: ['♾️ Unbegrenzte Lernfragen', '📝 Prüfungssimulation', '📖 Fragen-Browser'],
    catalog2Name: 'SBF See',
    catalog2Desc: 'Offizieller ELWIS-Fragenkatalog See · alle Kategorien · im Tageslimit testbar',
    seePaidFeatures: ['♾️ Unbegrenzte Lernfragen', '📝 Prüfungssimulation', '📖 Fragen-Browser'],
    catalog3Name: 'UBI Sprechfunk',
    catalog3Desc: 'UKW-Sprechfunkzeugnis Binnen · offizieller Fragenkatalog',
    ubiPaidFeatures: ['♾️ Unbegrenzte Lernfragen', '📝 Prüfungssimulation', '📖 Fragen-Browser'],
    ubiPrice: '€ 5,99',
    freeTrialNote: 'Im Tageslimit testbar',
    ubiOnlyNote: 'Nur einzeln · nicht im Bundle',
    bundleLabel: 'Spar-Tipp',
    bundleName: 'SBF-Bundle',
    bundleDesc: 'SBF Binnen + SBF See — beide Kataloge in einem Kauf · UBI nicht enthalten',
    bundlePrice: '€ 11,99',
    bundleSave: 'Spare 2,00 €',
    bundleCta: 'Paket freischalten',
    soon1: 'Bodenseeschifferpatent',
    soon2: 'SRC — Kurzstreckenzeugnis',
    soon3: 'LRC — Langstreckenzeugnis',
    soonLabel: 'Bald verfügbar',
  },
```

- [ ] **Step 2: Build prüfen**

```bash
cd /Users/mariusgehler/boatpass-website && npm run build 2>&1 | tail -20
```

Erwartetes Ergebnis: TypeScript-Fehler in en.ts (neue Keys fehlen) — das ist erwartet, wir fixen das in Task 2.

---

## Task 2: i18n Englisch — neues Modell

**Dateien:**
- Modify: `src/i18n/en.ts` (pricing-Block, Zeilen 79–110)

- [ ] **Step 1: pricing-Block in en.ts ersetzen**

Ersetze den kompletten `pricing`-Block (Zeilen 79–110) mit:

```typescript
  pricing: {
    chip: 'Pricing',
    title: 'Start free. Pay only for what you need.',
    subtitle: 'Try all catalogs for free — 15 questions daily across all catalogs. Buy only what you actually need.',
    modelHint: '15 questions/day across all catalogs · no subscription · expand anytime',
    available: 'Available',
    price: '€6.99',
    ctaFree: 'Start for free',
    ctaUnlock: 'Unlock full access',
    ctaStore: 'Open in Play Store',
    catalog1Name: 'SBF Binnen',
    catalog1Tagline: '15 questions daily for free — shared across all catalogs',
    freeLabel: 'Free',
    paidLabel: '€6.99 one-time',
    freeFeatures: ['15 questions/day (all catalogs)', 'Try all catalogs for free', 'Error training included'],
    paidFeatures: ['♾️ Unlimited study questions', '📝 Exam simulation', '📖 Question browser'],
    catalog2Name: 'SBF See',
    catalog2Desc: 'Official ELWIS question catalog · all categories · try within daily limit',
    seePaidFeatures: ['♾️ Unlimited study questions', '📝 Exam simulation', '📖 Question browser'],
    catalog3Name: 'UBI radio certificate',
    catalog3Desc: 'UKW radio certificate (inland) · official question catalog',
    ubiPaidFeatures: ['♾️ Unlimited study questions', '📝 Exam simulation', '📖 Question browser'],
    ubiPrice: '€5.99',
    freeTrialNote: 'Try within daily limit',
    ubiOnlyNote: 'Individual only · not in bundle',
    bundleLabel: 'Best value',
    bundleName: 'SBF Bundle',
    bundleDesc: 'SBF Binnen + SBF See — both catalogs in one purchase · UBI not included',
    bundlePrice: '€11.99',
    bundleSave: 'Save €2.00',
    bundleCta: 'Unlock bundle',
    soon1: 'Bodenseeschifferpatent',
    soon2: 'SRC — Short Range Certificate',
    soon3: 'LRC — Long Range Certificate',
    soonLabel: 'Coming soon',
  },
```

- [ ] **Step 2: Build prüfen**

```bash
cd /Users/mariusgehler/boatpass-website && npm run build 2>&1 | tail -20
```

Erwartetes Ergebnis: Build schlägt fehl, weil PricingSection.astro die neuen Keys noch nicht nutzt und TypeScript-Fehler für fehlende Keys meldet — das wird in Task 3 behoben.

Falls nur Astro-Fehler (kein TS): weiter zu Task 3.

---

## Task 3: PricingSection.astro — SBF-See- und UBI-Karten aktualisieren

**Dateien:**
- Modify: `src/components/PricingSection.astro`

Ziel: Die SBF-See- und UBI-Karten bekommen:
1. Ein "Im Tageslimit testbar"-Badge (grün, klein)
2. Eine Mini-Feature-Liste (was der Kauf freischaltet)
3. UBI-Karte: "Nur einzeln"-Badge
4. `catalog2Desc` / `catalog3Desc` zeigen die aktualisierten Texte (kein Code-Änderung nötig, i18n liefert das)

- [ ] **Step 1: SBF-See-Karte aktualisieren**

Ersetze den Inhalt der SBF-See-Karte (aktuell Zeilen 107–122 in PricingSection.astro):

```astro
        <!-- SBF See -->
        <div class="reveal-item catalog-card" style="opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease; background:white; border:1px solid rgba(51,102,255,0.10); flex:1; box-shadow:0 8px 30px rgba(26,31,54,0.03);">
          <div style="text-align:left;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
              <div style="font-size:11px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px;">{t.pricing.available}</div>
              <div style="font-size:11px; font-weight:600; color:#059669; background:#ECFDF5; border:1px solid #A7F3D0; padding:3px 9px; border-radius:100px;">{t.pricing.freeTrialNote}</div>
            </div>
            <div style="font-size:24px; font-weight:900; color:#1A1F36; margin-bottom:6px; letter-spacing:-0.3px;">{t.pricing.catalog2Name}</div>
            <div style="font-size:14px; color:#6B7280; margin-bottom:16px; line-height:1.5;">{t.pricing.catalog2Desc}</div>
            <div style="margin-bottom:16px;">
              {t.pricing.seePaidFeatures.map(f => (
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:7px;">
                  <span style="font-size:12px; color:#4B5563;">{f}</span>
                </div>
              ))}
            </div>
            <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:20px;">
              <span style="font-size:36px; font-weight:900; color:#1A1F36; letter-spacing:-1.5px;">{t.pricing.price}</span>
              <span style="font-size:13px; color:#6B7280; font-weight:500;">{lang === 'de' ? 'Einmalkauf' : 'one-time'}</span>
            </div>
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
              class="cta-see-btn"
              style="display:block; text-align:center; padding:12px; border-radius:12px; font-size:14px; font-weight:700; text-decoration:none; border:1px solid rgba(51,102,255,0.15); color:#1A1F36; background:white;">
              {t.pricing.ctaStore}
            </a>
          </div>
        </div>
```

- [ ] **Step 2: UBI-Karte aktualisieren**

Ersetze den Inhalt der UBI-Karte (aktuell Zeilen 124–140 in PricingSection.astro):

```astro
        <!-- UBI Sprechfunk -->
        <div class="reveal-item catalog-card" style="opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease; background:white; border:1px solid rgba(51,102,255,0.10); flex:1; box-shadow:0 8px 30px rgba(26,31,54,0.03);">
          <div style="text-align:left;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
              <div style="font-size:11px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px;">{t.pricing.available}</div>
              <div style="font-size:11px; font-weight:600; color:#6B7280; background:#F9FAFB; border:1px solid #E5E7EB; padding:3px 9px; border-radius:100px;">{t.pricing.ubiOnlyNote}</div>
            </div>
            <div style="font-size:24px; font-weight:900; color:#1A1F36; margin-bottom:6px; letter-spacing:-0.3px;">{t.pricing.catalog3Name}</div>
            <div style="font-size:14px; color:#6B7280; margin-bottom:16px; line-height:1.5;">{t.pricing.catalog3Desc}</div>
            <div style="margin-bottom:16px;">
              {t.pricing.ubiPaidFeatures.map(f => (
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:7px;">
                  <span style="font-size:12px; color:#4B5563;">{f}</span>
                </div>
              ))}
            </div>
            <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:20px;">
              <span style="font-size:36px; font-weight:900; color:#1A1F36; letter-spacing:-1.5px;">{t.pricing.ubiPrice}</span>
              <span style="font-size:13px; color:#6B7280; font-weight:500;">{lang === 'de' ? 'Einmalkauf' : 'one-time'}</span>
            </div>
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
              class="cta-see-btn"
              style="display:block; text-align:center; padding:12px; border-radius:12px; font-size:14px; font-weight:700; text-decoration:none; border:1px solid rgba(51,102,255,0.15); color:#1A1F36; background:white;">
              {t.pricing.ctaStore}
            </a>
          </div>
        </div>
```

- [ ] **Step 3: Build prüfen und sicherstellen dass keine TS-Fehler**

```bash
cd /Users/mariusgehler/boatpass-website && npm run build 2>&1 | tail -30
```

Erwartetes Ergebnis: `✓ Completed` ohne Fehler.

- [ ] **Step 4: Commit**

```bash
cd /Users/mariusgehler/boatpass-website && git add src/i18n/de.ts src/i18n/en.ts src/components/PricingSection.astro && git commit -m "feat: neues Free/Paid-Modell — globales Tageslimit, alle Kataloge antestbar, SBF-Bundle"
```

- [ ] **Step 5: Push**

```bash
cd /Users/mariusgehler/boatpass-website && git push
```

---

## Selbst-Review: Spec vs. Plan

| Anforderung | Abgedeckt |
|---|---|
| Gratis = 15 Fragen/Tag global | ✅ `catalog1Tagline`, `modelHint`, `freeFeatures[0]`, `subtitle` |
| Harte erste-30-Sperre entfällt (website-seitig kommunizieren) | ✅ alte Sperre war nie auf Website — kein Handlungsbedarf |
| Alle Kataloge antestbar (SBF-See-Sperre weg) | ✅ `catalog2Desc` ohne "kein kostenloser Testzugang", `freeTrialNote`-Badge |
| Kauf schaltet pro Katalog frei: Unbegrenzt + Prüfungssim + Fragen-Browser | ✅ `paidFeatures`, `seePaidFeatures`, `ubiPaidFeatures` |
| Fehler-Training bleibt gratis | ✅ `freeFeatures[2]` |
| SBF Binnen €6,99 | ✅ `price` |
| SBF See €6,99 | ✅ `price` (gleiche Variable) |
| UBI €5,99 | ✅ `ubiPrice` |
| Bundle (Binnen + See) €11,99 | ✅ `bundlePrice` |
| UBI nicht im Bundle | ✅ `ubiOnlyNote`, `bundleDesc` |
| Bundle-Name "SBF-Bundle" | ✅ `bundleName` |
