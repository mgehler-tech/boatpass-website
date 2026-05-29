# Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the BoatPass landing page to be modern, dynamic, and nautically themed — light background, navy/teal palette, animated hero, scroll-reveal effects.

**Architecture:** Each existing component is rewritten in-place. A new `TrustBar` component is added. All animations are CSS-only or vanilla JS `IntersectionObserver` — no additional libraries. The i18n strings for new UI copy are added to both `de.ts` and `en.ts` before the components that need them.

**Tech Stack:** Astro, Tailwind CSS v4, Inter (Google Fonts), Vanilla JS (IntersectionObserver)

**Design reference:** `docs/superpowers/specs/2026-05-29-website-redesign-design.md`

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/styles/global.css` | Modify | New color tokens, animation keyframes |
| `src/layouts/BaseLayout.astro` | Modify | Inter font weights 800+900 added |
| `src/i18n/de.ts` | Modify | New strings: hero, features, trust bar, how-it-works, pricing |
| `src/i18n/en.ts` | Modify | Same strings in English |
| `src/components/Header.astro` | Modify | Frosted glass, anchor logo, new nav CTA |
| `src/components/HeroSection.astro` | Modify | Full redesign: badge, gradient H1, phone mockup, wave, stats, orbs |
| `src/components/TrustBar.astro` | Create | 5 trust signals in a horizontal bar |
| `src/components/FeatureCards.astro` | Modify | 6 cards, hover top-border reveal, scroll-reveal |
| `src/components/HowItWorks.astro` | Modify | Blue-gradient bg, connecting line, scroll-reveal |
| `src/components/PricingSection.astro` | Modify | Featured dark card, glow, scroll-reveal |
| `src/pages/index.astro` | Modify | Add `<TrustBar>` between Hero and Features |

---

## Task 1: Design tokens & animation keyframes

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace global.css content**

```css
@import "tailwindcss";

@theme {
  --color-primary:    #0c5f9b;
  --color-navy:       #0a2647;
  --color-teal:       #0891b2;
  --color-background: #f7faff;
  --color-surface:    #ffffff;
  --color-text:       #0a1929;
  --color-muted:      #64748b;
  --color-success:    #4CAF82;
  --color-error:      #C0392B;
  --color-border:     rgba(12, 95, 155, 0.12);
  --font-family-sans: 'Inter', system-ui, sans-serif;
}

@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-family-sans);
  }
}

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-16px) rotate(-2deg); }
}

@keyframes wave {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.animate-fade-up          { animation: fadeUp 0.7s ease forwards; opacity: 0; }
.animate-fade-up.delay-1  { animation-delay: 0.1s; }
.animate-fade-up.delay-2  { animation-delay: 0.25s; }
.animate-fade-up.delay-3  { animation-delay: 0.4s; }
.animate-fade-up.delay-4  { animation-delay: 0.55s; }
.animate-fade-up.delay-5  { animation-delay: 0.7s; }

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-blink { animation: blink 2s ease-in-out infinite; }

.gradient-text {
  background: linear-gradient(135deg, #0c5f9b 0%, #0891b2 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

.gradient-bg {
  background: linear-gradient(135deg, #0a2647, #0c5f9b);
}
```

- [ ] **Step 2: Verify dev server compiles without error**

```bash
npm run dev
```

Expected: No CSS errors in terminal.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: update design tokens and add animation keyframes"
```

---

## Task 2: Update font weights in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Update the Google Fonts link to include 800 and 900 weights**

Find line:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

Replace with:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "style: add Inter 800/900 font weights"
```

---

## Task 3: Add new i18n strings

**Files:**
- Modify: `src/i18n/de.ts`
- Modify: `src/i18n/en.ts`

- [ ] **Step 1: Update `src/i18n/de.ts`**

Replace the `hero`, `features`, `howItWorks`, and `pricing` keys with:

```ts
  hero: {
    badge: 'Offizieller DMYV-Fragenkatalog 2025/2026',
    headline1: 'Der schnellste',
    headline2: 'Weg zum',
    headlineAccent: 'SBF Binnen.',
    subline: 'Lern mit dem offiziellen Fragenkatalog — 3 Lernmodi, sofortiges Feedback, Prüfungssimulation. Kein Abo. Einmal zahlen, fertig.',
    cta: 'Kostenlos im Play Store',
    ctaSecondary: 'Features ansehen',
    stat1Num: '400+',
    stat1Label: 'Prüfungsfragen',
    stat2Num: '3',
    stat2Label: 'Lernmodi',
    stat3Num: '4,99 €',
    stat3Label: 'Einmalkauf',
    phoneGreeting: 'Guten Morgen ☀️',
    phonePlanTitle: 'Dein Lernplan',
    phoneCard1: 'Lernen',
    phoneCard1Sub: 'Kategorie wählen',
    phoneCard2: 'Prüfungsmodus',
    phoneCard2Sub: '30 Fragen · 45 Min',
    phoneCard3: 'Fehler-Training',
    phoneCard3Sub: '12 offene Fehler',
  },
  trust: {
    catalog: 'Offizieller ELWIS-Fragenkatalog',
    current: 'Stand August 2023 (aktuell gültig)',
    oneTime: 'Einmalkauf — kein Abo',
    languages: 'Deutsch & Englisch',
    darkMode: 'Dark Mode',
  },
  features: {
    chip: 'Features',
    title: 'Drei Wege zum Bestehen',
    subtitle: 'Lernmodus, Prüfungssimulation und gezieltes Fehler-Training — alles in einer App.',
    learn: {
      title: 'Lernmodus',
      desc: 'Fragen nach Kategorie, Sofortfeedback mit Erklärung. Navigation, Schifffahrtsrecht, Sicherheit, Wetterkunde und mehr.',
    },
    exam: {
      title: 'Prüfungssimulation',
      desc: 'Echte Prüfungsbedingungen: 30 Fragen, Zeitlimit, Bestehensgrenze. Feedback erst am Ende — wie beim Original.',
    },
    training: {
      title: 'Fehler-Training',
      desc: 'Trainiere gezielt deine Schwächen. Nur falsch beantwortete Fragen — kein Zeitverschwenden.',
    },
    progress: {
      title: 'Fortschritt & Statistik',
      desc: 'Ringdiagramm, Trefferquote je Kategorie, Lernzeit — du siehst immer genau, wo du stehst.',
    },
    darkMode: {
      title: 'Dark Mode & 2 Sprachen',
      desc: 'Augenschonendes Lernen am Abend. Vollständig auf Deutsch und Englisch verfügbar.',
    },
    catalog: {
      title: 'Offizieller Katalog',
      desc: '400+ Fragen aus dem offiziellen ELWIS-Katalog Binnen, Stand 01.08.2023. Exakt die Fragen der echten Prüfung.',
    },
  },
  howItWorks: {
    chip: 'So geht\'s',
    title: 'In 3 Schritten zur Prüfung',
    step1: 'App herunterladen',
    step1Desc: 'Kostenlos im Google Play Store. Sofort loslegen — kein Account nötig.',
    step2: 'Lernen & trainieren',
    step2Desc: 'Lernmodus, Prüfungssimulation oder Fehler-Training — du wählst deinen Weg.',
    step3: 'Prüfung bestehen',
    step3Desc: 'Mit dem offiziellen Fragenkatalog bestens vorbereitet in die echte Prüfung.',
  },
  pricing: {
    chip: 'Preise',
    title: 'Einmal zahlen. Für immer lernen.',
    subtitle: 'Kein Abo. Kein Risiko. Einmalkauf via Google Play.',
    free: 'Free',
    freeSub: 'Für immer kostenlos',
    premium: 'Premium',
    premiumSub: 'Einmalzahlung — kein Abo',
    popular: 'Beliebt',
    price: '€ 4,99',
    priceFree: '€ 0',
    cta: 'Kostenlos starten',
    ctaPremium: 'Jetzt freischalten',
    freeFeatures: ['20–30 Prüfungsfragen', '1–2 Kategorien', 'Lernmodus (Basis)'],
    premiumFeatures: ['400+ Prüfungsfragen', 'Alle Kategorien', 'Prüfungsmodus', 'Fehler-Training', 'Statistiken & Fortschritt', 'Dark Mode · DE & EN'],
  },
```

- [ ] **Step 2: Update `src/i18n/en.ts`** — same keys in English:

```ts
  hero: {
    badge: 'Official DMYV Question Catalog 2025/2026',
    headline1: 'The fastest way',
    headline2: 'to get your',
    headlineAccent: 'Boating License.',
    subline: 'Study with the official question catalog — 3 learning modes, instant feedback, exam simulation. No subscription. Pay once, done.',
    cta: 'Free on Google Play',
    ctaSecondary: 'See features',
    stat1Num: '400+',
    stat1Label: 'Exam questions',
    stat2Num: '3',
    stat2Label: 'Learning modes',
    stat3Num: '€4.99',
    stat3Label: 'One-time purchase',
    phoneGreeting: 'Good morning ☀️',
    phonePlanTitle: 'Your study plan',
    phoneCard1: 'Study',
    phoneCard1Sub: 'Choose category',
    phoneCard2: 'Exam mode',
    phoneCard2Sub: '30 questions · 45 min',
    phoneCard3: 'Error training',
    phoneCard3Sub: '12 open errors',
  },
  trust: {
    catalog: 'Official ELWIS question catalog',
    current: 'As of August 2023 (currently valid)',
    oneTime: 'One-time purchase — no subscription',
    languages: 'German & English',
    darkMode: 'Dark mode',
  },
  features: {
    chip: 'Features',
    title: 'Three ways to pass',
    subtitle: 'Study mode, exam simulation, and targeted error training — all in one app.',
    learn: {
      title: 'Study mode',
      desc: 'Questions by category with instant feedback and explanations. Navigation, maritime law, safety, weather, and more.',
    },
    exam: {
      title: 'Exam simulation',
      desc: 'Real exam conditions: 30 questions, time limit, pass threshold. Feedback only at the end — just like the real thing.',
    },
    training: {
      title: 'Error training',
      desc: 'Train your weak spots specifically. Only incorrectly answered questions — no time wasted on what you already know.',
    },
    progress: {
      title: 'Progress & statistics',
      desc: 'Ring chart, accuracy per category, study time — you always know exactly where you stand.',
    },
    darkMode: {
      title: 'Dark mode & 2 languages',
      desc: 'Easy on the eyes for evening study. Fully available in German and English.',
    },
    catalog: {
      title: 'Official catalog',
      desc: '400+ questions from the official ELWIS inland catalog, as of 01.08.2023. Exactly the questions from the real exam.',
    },
  },
  howItWorks: {
    chip: 'How it works',
    title: 'Pass in 3 steps',
    step1: 'Download the app',
    step1Desc: 'Free on Google Play Store. Start immediately — no account needed.',
    step2: 'Study & train',
    step2Desc: 'Study mode, exam simulation, or error training — you choose your path.',
    step3: 'Pass the exam',
    step3Desc: 'Perfectly prepared with the official question catalog for the real exam.',
  },
  pricing: {
    chip: 'Pricing',
    title: 'Pay once. Study forever.',
    subtitle: 'No subscription. No risk. One-time purchase via Google Play.',
    free: 'Free',
    freeSub: 'Free forever',
    premium: 'Premium',
    premiumSub: 'One-time payment — no subscription',
    popular: 'Popular',
    price: '€4.99',
    priceFree: '€0',
    cta: 'Start for free',
    ctaPremium: 'Unlock now',
    freeFeatures: ['20–30 exam questions', '1–2 categories', 'Study mode (basic)'],
    premiumFeatures: ['400+ exam questions', 'All categories', 'Exam simulation', 'Error training', 'Statistics & progress', 'Dark mode · DE & EN'],
  },
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/de.ts src/i18n/en.ts
git commit -m "i18n: add new strings for redesigned sections"
```

---

## Task 4: Redesign Header

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Replace Header.astro entirely**

```astro
---
import { useTranslations, getLocalizedPath } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.boatpass.app';
---

<header class="fixed top-0 left-0 right-0 z-50 border-b" style="background: rgba(247,250,255,0.85); backdrop-filter: blur(20px); border-color: rgba(12,95,155,0.12);">
  <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

    <!-- Logo -->
    <a href={getLocalizedPath(lang, '/')} class="flex items-center gap-2 text-xl font-black" style="color: #0a2647; letter-spacing: -0.5px;">
      <span style="font-size: 1.1rem;">⚓</span>
      boat<span style="color: #0891b2;">pass</span>
    </a>

    <!-- Links -->
    <div class="hidden md:flex items-center gap-8">
      <a href="#features" class="text-sm font-medium transition-colors" style="color: #64748b;" onmouseover="this.style.color='#0a2647'" onmouseout="this.style.color='#64748b'">
        {lang === 'de' ? 'Features' : 'Features'}
      </a>
      <a href="#pricing" class="text-sm font-medium transition-colors" style="color: #64748b;" onmouseover="this.style.color='#0a2647'" onmouseout="this.style.color='#64748b'">
        {lang === 'de' ? 'Preise' : 'Pricing'}
      </a>
      <a href={getLocalizedPath(lang, '/blog/')} class="text-sm font-medium transition-colors" style="color: #64748b;" onmouseover="this.style.color='#0a2647'" onmouseout="this.style.color='#64748b'">
        {t.nav.blog}
      </a>
      <a href={getLocalizedPath(lang, '/faq/')} class="text-sm font-medium transition-colors" style="color: #64748b;" onmouseover="this.style.color='#0a2647'" onmouseout="this.style.color='#64748b'">
        {t.nav.faq}
      </a>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <a href={lang === 'de' ? '/en/' : '/'} class="text-sm font-medium" style="color: #64748b;">
        {t.footer.switchLang}
      </a>
      <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
        class="hidden md:inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-full"
        style="background: linear-gradient(135deg, #0a2647, #0c5f9b); box-shadow: 0 4px 14px rgba(10,38,71,0.25);">
        {t.nav.getApp}
      </a>
    </div>
  </nav>
</header>
```

- [ ] **Step 2: Check in browser** — nav should be frosted glass, ⚓ logo visible, "pass" in teal.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: redesign header with frosted glass and anchor logo"
```

---

## Task 5: Redesign HeroSection

**Files:**
- Modify: `src/components/HeroSection.astro`

- [ ] **Step 1: Replace HeroSection.astro entirely**

```astro
---
import { useTranslations } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.boatpass.app';
---

<section style="position:relative; min-height:100vh; display:flex; align-items:center; padding: 100px 0 0; overflow:hidden; background:#f7faff;">

  <!-- Background orbs -->
  <div style="position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(8,145,178,0.09),transparent 70%); top:-80px; right:-60px; pointer-events:none;"></div>
  <div style="position:absolute; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(12,95,155,0.07),transparent 70%); bottom:120px; right:300px; pointer-events:none;"></div>

  <!-- Dot grid -->
  <div style="position:absolute; inset:0; background-image:radial-gradient(rgba(12,95,155,0.12) 1px,transparent 1px); background-size:32px 32px; mask-image:radial-gradient(ellipse 80% 80% at 65% 40%,black 0%,transparent 70%); pointer-events:none;"></div>

  <!-- Content grid -->
  <div class="max-w-6xl mx-auto px-6 w-full" style="display:grid; grid-template-columns:1fr auto; align-items:center; gap:60px; position:relative; z-index:2;">

    <!-- Left: text -->
    <div style="max-width:580px;">

      <!-- Badge -->
      <div class="animate-fade-up" style="display:inline-flex; align-items:center; gap:8px; background:rgba(8,145,178,0.08); border:1px solid rgba(8,145,178,0.2); color:#0891b2; font-size:12px; font-weight:700; padding:6px 14px; border-radius:100px; margin-bottom:28px;">
        <span class="animate-blink" style="width:6px;height:6px;background:#0891b2;border-radius:50%;display:inline-block;"></span>
        {t.hero.badge}
      </div>

      <!-- H1 -->
      <h1 class="animate-fade-up delay-1" style="font-size:clamp(44px,6vw,64px); font-weight:900; line-height:1.0; letter-spacing:-3px; color:#0a2647; margin-bottom:22px;">
        {t.hero.headline1}<br>
        {t.hero.headline2}<br>
        <span class="gradient-text">{t.hero.headlineAccent}</span>
      </h1>

      <!-- Subline -->
      <p class="animate-fade-up delay-2" style="font-size:18px; color:#64748b; line-height:1.65; margin-bottom:40px; max-width:460px;">
        {t.hero.subline}
      </p>

      <!-- CTAs -->
      <div class="animate-fade-up delay-3" style="display:flex; gap:14px; align-items:center; margin-bottom:52px; flex-wrap:wrap;">
        <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
          class="cta-primary"
          style="display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg,#0a2647,#0c5f9b); color:white; font-weight:700; font-size:15px; padding:14px 28px; border-radius:14px; text-decoration:none; box-shadow:0 8px 24px rgba(10,38,71,0.2); transition:transform 0.2s,box-shadow 0.2s;">
          ▶ &nbsp;{t.hero.cta}
        </a>
        <a href="#features"
          style="color:#0c5f9b; font-size:15px; font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px;">
          {t.hero.ctaSecondary} →
        </a>
      </div>

      <!-- Stats -->
      <div class="animate-fade-up delay-4" style="display:flex; gap:36px; padding-top:36px; border-top:1px solid rgba(12,95,155,0.12);">
        <div>
          <div style="font-size:26px; font-weight:900; letter-spacing:-1px; color:#0a2647;">{t.hero.stat1Num}</div>
          <div style="font-size:13px; color:#64748b; margin-top:2px;">{t.hero.stat1Label}</div>
        </div>
        <div>
          <div style="font-size:26px; font-weight:900; letter-spacing:-1px; color:#0a2647;">{t.hero.stat2Num}</div>
          <div style="font-size:13px; color:#64748b; margin-top:2px;">{t.hero.stat2Label}</div>
        </div>
        <div>
          <div style="font-size:26px; font-weight:900; letter-spacing:-1px; color:#0a2647;">{t.hero.stat3Num}</div>
          <div style="font-size:13px; color:#64748b; margin-top:2px;">{t.hero.stat3Label}</div>
        </div>
      </div>
    </div>

    <!-- Right: phone mockup -->
    <div class="animate-fade-up delay-3 animate-float" style="position:relative; flex-shrink:0;">
      <!-- Glow -->
      <div style="position:absolute; width:280px; height:280px; background:radial-gradient(circle,rgba(8,145,178,0.18),transparent 70%); bottom:-40px; left:50%; transform:translateX(-50%); filter:blur(20px); pointer-events:none;"></div>
      <!-- Shadow -->
      <div style="position:absolute; bottom:-16px; left:50%; transform:translateX(-50%); width:180px; height:24px; background:radial-gradient(ellipse,rgba(10,38,71,0.18),transparent 70%); filter:blur(8px);"></div>

      <!-- Phone frame -->
      <div style="position:relative; width:260px; background:linear-gradient(145deg,#1a2744,#0e1b35); border-radius:44px; padding:12px; box-shadow:0 0 0 1px rgba(255,255,255,0.08),0 40px 80px rgba(10,38,71,0.3),inset 0 1px 0 rgba(255,255,255,0.06);">
        <!-- Notch -->
        <div style="width:90px; height:24px; background:#0e1b35; border-radius:0 0 16px 16px; margin:0 auto; position:relative; z-index:2;"></div>
        <!-- Screen -->
        <div style="background:linear-gradient(160deg,#0f2140 0%,#071529 100%); border-radius:34px; overflow:hidden; padding:20px 16px 24px; margin-top:-4px;">
          <div style="font-size:11px; color:rgba(255,255,255,0.4); margin-bottom:3px;">{t.hero.phoneGreeting}</div>
          <div style="font-size:16px; font-weight:800; color:white; margin-bottom:18px; letter-spacing:-0.3px;">{t.hero.phonePlanTitle}</div>

          <!-- Progress ring -->
          <div style="display:flex; justify-content:center; margin-bottom:18px;">
            <div style="width:100px; height:100px; border-radius:50%; background:conic-gradient(#0891b2 72%, rgba(255,255,255,0.07) 0); display:flex; align-items:center; justify-content:center;">
              <div style="width:76px; height:76px; background:#071529; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <div style="font-size:17px; font-weight:900; color:white;">216</div>
                <div style="font-size:9px; color:rgba(255,255,255,0.35);">{lang === 'de' ? 'von 300' : 'of 300'}</div>
              </div>
            </div>
          </div>

          <!-- Cards -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:10px 12px; display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:9px; background:rgba(8,145,178,0.15); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0;">📚</div>
              <div>
                <div style="font-size:12px; font-weight:700; color:white;">{t.hero.phoneCard1}</div>
                <div style="font-size:10px; color:rgba(255,255,255,0.35);">{t.hero.phoneCard1Sub}</div>
              </div>
            </div>
            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:10px 12px; display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:9px; background:rgba(12,95,155,0.15); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0;">📝</div>
              <div>
                <div style="font-size:12px; font-weight:700; color:white;">{t.hero.phoneCard2}</div>
                <div style="font-size:10px; color:rgba(255,255,255,0.35);">{t.hero.phoneCard2Sub}</div>
              </div>
            </div>
            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(8,145,178,0.3); border-radius:14px; padding:10px 12px; display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:9px; background:rgba(239,68,68,0.15); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0;">🎯</div>
              <div>
                <div style="font-size:12px; font-weight:700; color:white;">{t.hero.phoneCard3}</div>
                <div style="font-size:10px; color:rgba(255,255,255,0.35);">{t.hero.phoneCard3Sub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Wave bottom -->
  <div style="position:absolute; bottom:-2px; left:0; right:0; height:80px; overflow:hidden; pointer-events:none;">
    <svg style="width:200%; height:100%; animation:wave 12s linear infinite;" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
      <path d="M1440,40 C1680,80 1920,0 2160,40 C2400,80 2640,0 2880,40 L2880,80 L1440,80 Z" fill="white"/>
    </svg>
  </div>
</section>

<style>
  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(10,38,71,0.28) !important;
  }
  @media (max-width: 768px) {
    section > div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }
    .animate-float {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Verify in browser** — hero loads with fade-up animations, wave at bottom, phone floats.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.astro
git commit -m "feat: redesign hero with gradient headline, phone mockup, wave animation"
```

---

## Task 6: Create TrustBar component

**Files:**
- Create: `src/components/TrustBar.astro`

- [ ] **Step 1: Create the file**

```astro
---
import { useTranslations } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);

const items = [
  { icon: '⚓', label: t.trust.catalog },
  { icon: '✅', label: t.trust.current },
  { icon: '💳', label: t.trust.oneTime },
  { icon: '🇩🇪', label: t.trust.languages },
  { icon: '🌙', label: t.trust.darkMode },
];
---

<div style="background:white; border-top:1px solid rgba(12,95,155,0.12); border-bottom:1px solid rgba(12,95,155,0.12); padding:20px 24px;">
  <div class="max-w-6xl mx-auto" style="display:flex; align-items:center; justify-content:center; gap:40px; flex-wrap:wrap;">
    {items.map(item => (
      <div class="trust-item" style="display:flex; align-items:center; gap:10px; font-size:14px; font-weight:600; color:#0a2647;">
        <span style="font-size:18px;">{item.icon}</span>
        {item.label}
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Add TrustBar to `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection.astro';
import TrustBar from '../components/TrustBar.astro';
import FeatureCards from '../components/FeatureCards.astro';
import HowItWorks from '../components/HowItWorks.astro';
import PricingSection from '../components/PricingSection.astro';
import BlogTeaser from '../components/BlogTeaser.astro';
---

<BaseLayout
  title="SBF Lernapp"
  description="Lerne für den Sportbootführerschein mit offiziellen Prüfungsfragen, Prüfungssimulation und Fehler-Training. Kostenlos starten."
  lang="de"
>
  <HeroSection lang="de" />
  <TrustBar lang="de" />
  <FeatureCards lang="de" />
  <HowItWorks lang="de" />
  <PricingSection lang="de" />
  <BlogTeaser lang="de" />
</BaseLayout>
```

- [ ] **Step 3: Check in browser** — 5 trust items appear in a horizontal row between hero and features.

- [ ] **Step 4: Commit**

```bash
git add src/components/TrustBar.astro src/pages/index.astro
git commit -m "feat: add TrustBar component with 5 trust signals"
```

---

## Task 7: Redesign FeatureCards

**Files:**
- Modify: `src/components/FeatureCards.astro`

- [ ] **Step 1: Replace FeatureCards.astro entirely**

```astro
---
import { useTranslations } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);

const features = [
  { icon: '📚', title: t.features.learn.title, desc: t.features.learn.desc },
  { icon: '📝', title: t.features.exam.title, desc: t.features.exam.desc },
  { icon: '🎯', title: t.features.training.title, desc: t.features.training.desc },
  { icon: '📊', title: t.features.progress.title, desc: t.features.progress.desc },
  { icon: '🌙', title: t.features.darkMode.title, desc: t.features.darkMode.desc },
  { icon: '⚓', title: t.features.catalog.title, desc: t.features.catalog.desc },
];
---

<section id="features" class="max-w-6xl mx-auto px-6 py-24">
  <div class="reveal-item" style="opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease;">
    <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(8,145,178,0.08); border:1px solid rgba(8,145,178,0.2); color:#0891b2; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 12px; border-radius:100px; margin-bottom:16px;">
      ⚡ {t.features.chip}
    </div>
    <h2 style="font-size:42px; font-weight:900; letter-spacing:-2px; color:#0a2647; line-height:1.1; margin-bottom:14px;">{t.features.title}</h2>
    <p style="font-size:16px; color:#64748b; max-width:440px; line-height:1.65; margin-bottom:56px;">{t.features.subtitle}</p>
  </div>

  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;" class="feat-grid">
    {features.map(f => (
      <div class="feat-card reveal-item" style="background:white; border:1px solid rgba(12,95,155,0.12); border-radius:20px; padding:28px; position:relative; overflow:hidden; opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease;">
        <div class="feat-top-line" style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#0c5f9b,#0891b2); transform:scaleX(0); transform-origin:left; transition:transform 0.3s ease; border-radius:3px 3px 0 0;"></div>
        <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,rgba(8,145,178,0.1),rgba(12,95,155,0.08)); display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:20px;">
          {f.icon}
        </div>
        <h3 style="font-size:17px; font-weight:800; color:#0a2647; margin-bottom:10px; letter-spacing:-0.2px;">{f.title}</h3>
        <p style="font-size:14px; color:#64748b; line-height:1.65;">{f.desc}</p>
      </div>
    ))}
  </div>
</section>

<style>
  .feat-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 20px 40px rgba(10,38,71,0.1);
    border-color: rgba(12,95,155,0.2) !important;
  }
  .feat-card:hover .feat-top-line {
    transform: scaleX(1) !important;
  }
  @media (max-width: 900px) {
    .feat-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
  @media (max-width: 600px) {
    .feat-grid { grid-template-columns: 1fr !important; }
  }
</style>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = '1';
        (e.target as HTMLElement).style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#features .reveal-item').forEach(el => observer.observe(el));
</script>
```

- [ ] **Step 2: Verify** — 6 cards render, hover reveals top gradient line, cards fade in on scroll.

- [ ] **Step 3: Commit**

```bash
git add src/components/FeatureCards.astro
git commit -m "feat: redesign feature cards with hover reveal and scroll animation"
```

---

## Task 8: Redesign HowItWorks

**Files:**
- Modify: `src/components/HowItWorks.astro`

- [ ] **Step 1: Replace HowItWorks.astro entirely**

```astro
---
import { useTranslations } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);

const steps = [
  { num: '1', label: t.howItWorks.step1, desc: t.howItWorks.step1Desc },
  { num: '2', label: t.howItWorks.step2, desc: t.howItWorks.step2Desc },
  { num: '3', label: t.howItWorks.step3, desc: t.howItWorks.step3Desc },
];
---

<section style="background:linear-gradient(160deg,#f0f7ff 0%,#e8f4fd 100%); padding:100px 24px;" id="how-it-works">
  <div class="max-w-6xl mx-auto">

    <div class="reveal-item" style="opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease; margin-bottom:60px;">
      <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(8,145,178,0.08); border:1px solid rgba(8,145,178,0.2); color:#0891b2; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 12px; border-radius:100px; margin-bottom:16px;">
        🧭 {t.howItWorks.chip}
      </div>
      <h2 style="font-size:42px; font-weight:900; letter-spacing:-2px; color:#0a2647; line-height:1.1;">{t.howItWorks.title}</h2>
    </div>

    <div style="display:flex; gap:0; position:relative; max-width:900px;" class="steps-row">
      <!-- Connecting line -->
      <div style="position:absolute; top:28px; left:56px; right:56px; height:2px; background:linear-gradient(90deg,#0c5f9b,#0891b2); opacity:0.2;"></div>

      {steps.map(step => (
        <div class="reveal-item" style="flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; padding:0 24px; opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease;">
          <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#0a2647,#0c5f9b); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; color:white; margin-bottom:20px; position:relative; z-index:1; box-shadow:0 8px 20px rgba(10,38,71,0.2);">
            {step.num}
          </div>
          <div style="font-size:16px; font-weight:800; color:#0a2647; margin-bottom:8px;">{step.label}</div>
          <div style="font-size:14px; color:#64748b; line-height:1.6;">{step.desc}</div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  @media (max-width: 640px) {
    .steps-row { flex-direction: column !important; align-items: flex-start !important; }
    .steps-row > div[style*="position:absolute"] { display: none; }
  }
</style>

<script>
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = '1';
        (e.target as HTMLElement).style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#how-it-works .reveal-item').forEach(el => obs.observe(el));
</script>
```

- [ ] **Step 2: Verify** — light blue background section, 3 numbered steps with connecting line.

- [ ] **Step 3: Commit**

```bash
git add src/components/HowItWorks.astro
git commit -m "feat: redesign how-it-works with gradient bg and connecting step line"
```

---

## Task 9: Redesign PricingSection

**Files:**
- Modify: `src/components/PricingSection.astro`

- [ ] **Step 1: Replace PricingSection.astro entirely**

```astro
---
import { useTranslations } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.boatpass.app';
---

<section id="pricing" style="padding:100px 24px; text-align:center;">
  <div class="max-w-6xl mx-auto">

    <div class="reveal-item" style="opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease; margin-bottom:56px;">
      <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(8,145,178,0.08); border:1px solid rgba(8,145,178,0.2); color:#0891b2; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 12px; border-radius:100px; margin-bottom:16px;">
        💳 {t.pricing.chip}
      </div>
      <h2 style="font-size:42px; font-weight:900; letter-spacing:-2px; color:#0a2647; line-height:1.1; margin-bottom:14px; max-width:600px; margin-left:auto; margin-right:auto;">{t.pricing.title}</h2>
      <p style="font-size:16px; color:#64748b;">{t.pricing.subtitle}</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:760px; margin:0 auto;" class="pricing-grid">

      <!-- Free -->
      <div class="reveal-item" style="text-align:left; padding:36px; border-radius:24px; border:1px solid rgba(12,95,155,0.12); background:white; opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease;">
        <div style="font-size:13px; font-weight:600; color:#64748b; margin-bottom:8px;">{t.pricing.free}</div>
        <div style="font-size:52px; font-weight:900; letter-spacing:-2px; color:#0a2647; margin-bottom:4px;">{t.pricing.priceFree}</div>
        <div style="font-size:13px; color:#64748b; margin-bottom:28px;">{t.pricing.freeSub}</div>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:12px; margin-bottom:32px;">
          {t.pricing.freeFeatures.map(f => (
            <li style="display:flex; align-items:center; gap:10px; font-size:14px; color:#0a1929;">
              <span style="color:#0891b2; font-weight:800;">✓</span> {f}
            </li>
          ))}
        </ul>
        <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
          style="display:block; text-align:center; padding:14px; border-radius:14px; font-size:15px; font-weight:700; text-decoration:none; border:2px solid rgba(12,95,155,0.2); color:#0a2647;">
          {t.pricing.cta}
        </a>
      </div>

      <!-- Premium -->
      <div class="reveal-item" style="text-align:left; padding:36px; border-radius:24px; background:linear-gradient(145deg,#0a2647 0%,#0d3562 100%); border:1px solid #0c5f9b; position:relative; overflow:hidden; box-shadow:0 20px 60px rgba(10,38,71,0.2); opacity:0; transform:translateY(24px); transition:opacity 0.6s ease,transform 0.6s ease;">
        <!-- Orb -->
        <div style="position:absolute; top:-60px; right:-60px; width:200px; height:200px; border-radius:50%; background:radial-gradient(circle,rgba(8,145,178,0.3),transparent 70%); pointer-events:none;"></div>
        <!-- Badge -->
        <div style="position:absolute; top:20px; right:20px; background:linear-gradient(135deg,#0891b2,#0c5f9b); font-size:11px; font-weight:700; color:white; padding:4px 12px; border-radius:100px;">
          {t.pricing.popular}
        </div>
        <div style="font-size:13px; font-weight:600; color:rgba(255,255,255,0.5); margin-bottom:8px;">{t.pricing.premium}</div>
        <div style="font-size:52px; font-weight:900; letter-spacing:-2px; color:white; margin-bottom:4px;">{t.pricing.price}</div>
        <div style="font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:28px;">{t.pricing.premiumSub}</div>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:12px; margin-bottom:32px;">
          {t.pricing.premiumFeatures.map(f => (
            <li style="display:flex; align-items:center; gap:10px; font-size:14px; color:rgba(255,255,255,0.85);">
              <span style="color:#38bdf8; font-weight:800;">✓</span> {f}
            </li>
          ))}
        </ul>
        <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
          style="display:block; text-align:center; padding:14px; border-radius:14px; font-size:15px; font-weight:700; text-decoration:none; background:linear-gradient(135deg,#0891b2,#0c5f9b); color:white; box-shadow:0 6px 20px rgba(8,145,178,0.3);">
          {t.pricing.ctaPremium}
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  @media (max-width: 640px) {
    .pricing-grid { grid-template-columns: 1fr !important; }
  }
</style>

<script>
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = '1';
        (e.target as HTMLElement).style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#pricing .reveal-item').forEach(el => obs.observe(el));
</script>
```

- [ ] **Step 2: Verify** — free card (white) + premium card (dark navy, glow), scroll-reveal both cards.

- [ ] **Step 3: Commit**

```bash
git add src/components/PricingSection.astro
git commit -m "feat: redesign pricing with featured dark premium card and glow"
```

---

## Task 10: Update Footer

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Update brand colors in footer to match new palette**

Change line:
```html
<span class="text-lg font-bold text-primary">Boatpass</span>
```
to:
```html
<span class="text-lg font-black" style="color:#0a2647;">⚓ boat<span style="color:#0891b2;">pass</span></span>
```

Change the footer background class from `bg-gray-50` to match new style:
```html
<footer style="background:#f0f7ff; border-top:1px solid rgba(12,95,155,0.12);" class="mt-24">
```

- [ ] **Step 2: Verify** — footer logo matches nav logo style.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "style: update footer logo and background to match new palette"
```

---

## Task 11: Final review & build check

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: No errors. Check terminal for any TypeScript or missing-key errors from the i18n changes.

- [ ] **Step 2: If i18n TypeScript errors appear**

The `Translations` type in `src/i18n/de.ts` is inferred from the `de` object. If `en.ts` is missing a key that `de.ts` has, TypeScript will error. Fix by ensuring `en.ts` has every key from `de.ts`.

- [ ] **Step 3: Spot-check the English route**

Open `http://localhost:4321/en/` — verify all text renders in English (no missing key errors shown as `undefined`).

- [ ] **Step 4: Mobile check**

Resize browser to 375px. Verify:
- Hero: single column, phone mockup hidden
- Features: 1-column grid
- Pricing: 1-column grid
- Steps: vertical layout

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: website redesign complete — light nautical modern"
```
