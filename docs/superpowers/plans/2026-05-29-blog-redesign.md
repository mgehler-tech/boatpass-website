# Blog Redesign & Content Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign blog cards to Option C (Modern Tiles with featured + compact cards) and rewrite all 5 DE + 4 EN articles with accurate, research-backed content from official sources (ELWIS/DMYV).

**Architecture:** BlogCard.astro gets a `featured` boolean prop — featured renders full-width with top gradient bar, compact renders with a small icon-box. Blog index and teaser both use this split. Articles are rewritten as standalone `.md` files with real facts.

**Tech Stack:** Astro 5, Tailwind CSS v4, Markdown (content), TypeScript

**Key Facts for Articles (verified from ELWIS/DMYV/official sources):**
- Theorie SBF Binnen: 30 Fragen, 45 Min — aufgeteilt in 7 Basisfragen (mind. 5/7 richtig) + 23 spezifische Binnenfragen (mind. 18/23 richtig) — BEIDE Teile müssen separat bestanden werden
- Prüfungsgebühr DMYV: ~131 € Binnen, ~148 € See, ~179 € See+Binnen Kombi (Stand 05/2026)
- Kurskosten typisch: ~265–299 € Binnen, ~370 € See → Gesamt ca. 400–430 €
- Mindestalter: 16 Jahre für Binnenschifffahrtsstraßen (mit Antriebsmaschine)
- Führerscheinfreiheit: bis 11,03 kW (15 PS) Verbrennungsmotor oder 7,5 kW Elektromotor
- Lernzeit: SBF Binnen realistisch 2–4 Wochen bei 30–45 Min/Tag
- Häufigste Fehler: Knoten (#1 Fehlerquelle Praxis), Lichterführung/Schallzeichen, zu späte Anmeldung

---

## File Map

| File | Action | Reason |
|---|---|---|
| `src/components/BlogCard.astro` | Modify | Add `featured` prop, two visual modes |
| `src/components/BlogTeaser.astro` | Modify | Use featured first card + compact rest |
| `src/pages/blog/index.astro` | Modify | Featured + compact grid layout |
| `src/pages/en/blog/index.astro` | Modify | Same for EN |
| `src/layouts/BlogLayout.astro` | Modify | Better article header + CTA styling |
| `src/content/blog/de/5-tipps-sbf-bestehen.md` | Rewrite | Thin content → substantive guide |
| `src/content/blog/de/haeufigste-fehler-sbf.md` | Rewrite | Add specific nautical facts |
| `src/content/blog/de/sbf-binnen-vs-see.md` | Rewrite | Fix wrong data, add costs |
| `src/content/blog/de/sbf-pruefung-alles-wissenswerte.md` | Rewrite | Fix wrong exam details |
| `src/content/blog/de/sbf-vorbereitung-wie-lange.md` | Rewrite | Add concrete plan + methods |
| `src/content/blog/en/5-tips-pass-sbf.md` | Rewrite | EN equivalent |
| `src/content/blog/en/most-common-sbf-mistakes.md` | Rewrite | EN equivalent |
| `src/content/blog/en/sbf-inland-vs-coastal.md` | Rewrite | EN equivalent |
| `src/content/blog/en/sbf-exam-everything-you-need-to-know.md` | Rewrite | EN equivalent |
| `src/content/blog/en/sbf-preparation-how-long.md` | Rewrite | EN equivalent |

---

## Task 1: BlogCard Component — Two Visual Modes

**Files:**
- Modify: `src/components/BlogCard.astro`

- [ ] **Schritt 1: BlogCard komplett ersetzen**

Replace the entire file with:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
  lang: 'de' | 'en';
  featured?: boolean;
}

const { post, lang, featured = false } = Astro.props;
const { title, description, date, readingTime, tags } = post.data;
const slug = post.id.replace(`${lang}/`, '');
const href = lang === 'de' ? `/blog/${slug}/` : `/en/blog/${slug}/`;
const formattedDate = date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
  year: 'numeric', month: 'short', day: 'numeric'
});

const categoryIcons: Record<string, string> = {
  'Tipps': '💡', 'Prüfung': '📋', 'Binnen': '🌊', 'See': '⛵',
  'Vorbereitung': '📚', 'Vergleich': '⚖️', 'Leitfaden': '🗺️',
  'Tips': '💡', 'Exam': '📋', 'Preparation': '📚', 'Guide': '🗺️',
};
const secondTag = tags[1] ?? tags[0];
const icon = categoryIcons[secondTag] ?? '⚓';
---

{featured ? (
  <a href={href} class="blog-featured group" aria-label={title}>
    <div class="blog-featured-bar"></div>
    <div class="blog-featured-body">
      <div class="blog-tags">
        {tags.slice(0, 2).map(tag => (
          <span class="blog-tag">{tag}</span>
        ))}
      </div>
      <h3 class="blog-featured-title group-hover:text-primary transition-colors">{title}</h3>
      <p class="blog-featured-desc">{description}</p>
      <div class="blog-featured-footer">
        <span class="blog-meta">{formattedDate}</span>
        <span class="blog-cta">{readingTime} {lang === 'de' ? 'Min lesen' : 'min read'} →</span>
      </div>
    </div>
  </a>
) : (
  <a href={href} class="blog-compact group" aria-label={title}>
    <div class="blog-icon">{icon}</div>
    <div class="blog-compact-body">
      <div class="blog-compact-cat">{secondTag} · {readingTime} {lang === 'de' ? 'Min' : 'min'}</div>
      <h3 class="blog-compact-title group-hover:text-primary transition-colors">{title}</h3>
    </div>
  </a>
)}

<style>
  /* Featured */
  .blog-featured {
    display: block;
    background: white;
    border: 1px solid rgba(12,95,155,0.12);
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .blog-featured:hover {
    box-shadow: 0 12px 40px rgba(10,38,71,0.1);
    border-color: rgba(12,95,155,0.22);
  }
  .blog-featured-bar {
    height: 3px;
    background: linear-gradient(90deg, #0a2647, #0891b2);
  }
  .blog-featured-body {
    padding: 28px 28px 24px;
  }
  .blog-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
  }
  .blog-tag {
    font-size: 11px;
    font-weight: 700;
    background: rgba(8,145,178,0.08);
    color: #0891b2;
    border: 1px solid rgba(8,145,178,0.18);
    padding: 2px 9px;
    border-radius: 100px;
  }
  .blog-featured-title {
    font-size: 20px;
    font-weight: 900;
    color: #0a2647;
    letter-spacing: -0.3px;
    line-height: 1.25;
    margin-bottom: 10px;
  }
  .blog-featured-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .blog-featured-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .blog-meta { font-size: 12px; color: #94a3b8; }
  .blog-cta { font-size: 13px; font-weight: 700; color: #0891b2; }

  /* Compact */
  .blog-compact {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    background: white;
    border: 1px solid rgba(12,95,155,0.10);
    border-radius: 16px;
    padding: 20px;
    text-decoration: none;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .blog-compact:hover {
    box-shadow: 0 8px 24px rgba(10,38,71,0.08);
    border-color: rgba(12,95,155,0.2);
  }
  .blog-icon {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: linear-gradient(135deg, #0a2647, #0891b2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .blog-compact-body { flex: 1; min-width: 0; }
  .blog-compact-cat {
    font-size: 11px;
    font-weight: 700;
    color: #0891b2;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .blog-compact-title {
    font-size: 14px;
    font-weight: 800;
    color: #0a2647;
    line-height: 1.35;
  }
</style>
```

- [ ] **Schritt 2: Build prüfen**

```bash
npm run build 2>&1 | grep -E "(error|Error|built|Complete)"
```

Expected: `22 page(s) built` with no errors.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/BlogCard.astro
git commit -m "feat: BlogCard featured + compact variants"
```

---

## Task 2: Blog Index + Teaser — Modern Tiles Layout

**Files:**
- Modify: `src/components/BlogTeaser.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/en/blog/index.astro`

- [ ] **Schritt 1: BlogTeaser.astro ersetzen**

```astro
---
import { getCollection } from 'astro:content';
import BlogCard from './BlogCard.astro';
import { useTranslations, getLocalizedPath } from '../i18n/index';

interface Props {
  lang: 'de' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);

const allPosts = await getCollection('blog', entry => entry.data.lang === lang);
const posts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);

const [featured, ...rest] = posts;
---

<section class="max-w-6xl mx-auto px-4 py-20">
  <div class="flex items-center justify-between mb-10">
    <h2 class="text-3xl font-bold text-text">{t.blog.title}</h2>
    <a href={getLocalizedPath(lang, '/blog/')} class="text-primary font-semibold text-sm hover:underline">
      {t.blog.allArticles} →
    </a>
  </div>

  <div class="blog-teaser-grid">
    {featured && <BlogCard post={featured} lang={lang} featured={true} />}
    <div class="blog-teaser-compact">
      {rest.map(post => <BlogCard post={post} lang={lang} featured={false} />)}
    </div>
  </div>
</section>

<style>
  .blog-teaser-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
  }
  .blog-teaser-compact {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @media (max-width: 768px) {
    .blog-teaser-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Schritt 2: Blog DE index ersetzen**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/BlogCard.astro';

const posts = (await getCollection('blog', entry => entry.data.lang === 'de'))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const [featured, ...rest] = posts;
---

<BaseLayout
  title="Blog – Tipps zum Sportbootführerschein"
  description="Tipps, Guides und Wissenswertes rund um den SBF, die Prüfung und das Bootfahren in Deutschland."
  lang="de"
>
  <div class="max-w-6xl mx-auto px-4 py-16">
    <div style="margin-bottom:48px;">
      <h1 style="font-size:42px; font-weight:900; letter-spacing:-2px; color:#0a2647; margin-bottom:10px;">Blog</h1>
      <p style="font-size:18px; color:#64748b;">Tipps, Guides und Wissenswertes rund um den Sportbootführerschein</p>
    </div>

    <div class="blog-index-grid">
      {featured && <BlogCard post={featured} lang="de" featured={true} />}
      <div class="blog-index-compact">
        {rest.map(post => <BlogCard post={post} lang="de" featured={false} />)}
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .blog-index-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
  }
  .blog-index-compact {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @media (max-width: 768px) {
    .blog-index-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Schritt 3: Blog EN index ersetzen**

Same as step 2 but `lang="en"` and translated strings:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import BlogCard from '../../../components/BlogCard.astro';

const posts = (await getCollection('blog', entry => entry.data.lang === 'en'))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const [featured, ...rest] = posts;
---

<BaseLayout
  title="Blog – Boating License Tips"
  description="Tips, guides and knowledge about the SBF boating exam in Germany."
  lang="en"
>
  <div class="max-w-6xl mx-auto px-4 py-16">
    <div style="margin-bottom:48px;">
      <h1 style="font-size:42px; font-weight:900; letter-spacing:-2px; color:#0a2647; margin-bottom:10px;">Blog</h1>
      <p style="font-size:18px; color:#64748b;">Tips, guides and knowledge about the German boating license</p>
    </div>

    <div class="blog-index-grid">
      {featured && <BlogCard post={featured} lang="en" featured={true} />}
      <div class="blog-index-compact">
        {rest.map(post => <BlogCard post={post} lang="en" featured={false} />)}
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .blog-index-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
  }
  .blog-index-compact {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @media (max-width: 768px) {
    .blog-index-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Schritt 4: Build prüfen**

```bash
npm run build 2>&1 | grep -E "(error|Error|built|Complete)"
```

Expected: no errors.

- [ ] **Schritt 5: Commit**

```bash
git add src/components/BlogTeaser.astro src/pages/blog/index.astro src/pages/en/blog/index.astro
git commit -m "feat: blog index modern tiles layout"
```

---

## Task 3: BlogLayout — Verbessertes Artikel-Layout

**Files:**
- Modify: `src/layouts/BlogLayout.astro`

- [ ] **Schritt 1: BlogLayout.astro ersetzen**

```astro
---
import BaseLayout from './BaseLayout.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
  lang: 'de' | 'en';
}

const { post, lang } = Astro.props;
const { title, description, date, readingTime, tags } = post.data;
const formattedDate = date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.boatpass.app';
---

<BaseLayout title={title} description={description} lang={lang} type="article">
  <article class="max-w-2xl mx-auto px-4 py-16">

    <!-- Back link -->
    <a href={lang === 'de' ? '/blog/' : '/en/blog/'}
      style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#0891b2; text-decoration:none; margin-bottom:36px;">
      ← {lang === 'de' ? 'Alle Artikel' : 'All articles'}
    </a>

    <!-- Header -->
    <header style="margin-bottom:40px;">
      <div style="display:flex; gap:6px; margin-bottom:16px;">
        {tags.map(tag => (
          <span style="font-size:11px; font-weight:700; background:rgba(8,145,178,0.08); color:#0891b2; border:1px solid rgba(8,145,178,0.18); padding:3px 10px; border-radius:100px;">{tag}</span>
        ))}
      </div>
      <h1 style="font-size:clamp(26px,4vw,38px); font-weight:900; letter-spacing:-1px; color:#0a2647; line-height:1.2; margin-bottom:16px;">{title}</h1>
      <div style="display:flex; align-items:center; gap:16px; padding-bottom:24px; border-bottom:1px solid rgba(12,95,155,0.1);">
        <span style="font-size:13px; color:#94a3b8;">{formattedDate}</span>
        <span style="width:3px; height:3px; border-radius:50%; background:#cbd5e1;"></span>
        <span style="font-size:13px; color:#94a3b8;">{readingTime} {lang === 'de' ? 'Min. Lesezeit' : 'min read'}</span>
      </div>
    </header>

    <!-- Content -->
    <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-navy prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-navy prose-a:text-primary prose-li:text-slate-600">
      <slot />
    </div>

    <!-- CTA -->
    <div style="margin-top:64px; padding:40px; background:linear-gradient(135deg,#0a2647,#0d3562); border-radius:24px; text-align:center; position:relative; overflow:hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(8,145,178,0.3),transparent 70%);pointer-events:none;"></div>
      <h2 style="font-size:22px; font-weight:900; color:white; margin-bottom:10px; letter-spacing:-0.3px;">
        {lang === 'de' ? 'Jetzt kostenlos mit dem Lernen starten' : 'Start learning for free now'}
      </h2>
      <p style="font-size:14px; color:rgba(255,255,255,0.55); margin-bottom:24px; max-width:360px; margin-left:auto; margin-right:auto; line-height:1.6;">
        {lang === 'de'
          ? '15 Fragen täglich kostenlos — offizieller ELWIS-Fragenkatalog, Prüfungsmodus & Fehler-Training.'
          : '15 questions daily for free — official ELWIS catalog, exam simulation & error training.'}
      </p>
      <a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
        style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#0891b2,#0c5f9b); color:white; font-weight:700; font-size:15px; padding:13px 28px; border-radius:14px; text-decoration:none; box-shadow:0 6px 20px rgba(8,145,178,0.3);">
        ▶&nbsp;{lang === 'de' ? 'App kostenlos laden' : 'Download app for free'}
      </a>
    </div>

  </article>
</BaseLayout>
```

- [ ] **Schritt 2: Build prüfen**

```bash
npm run build 2>&1 | grep -E "(error|Error|built|Complete)"
```

- [ ] **Schritt 3: Commit**

```bash
git add src/layouts/BlogLayout.astro
git commit -m "feat: blog article layout redesign with navy CTA"
```

---

## Task 4: DE Artikel — 5 Tipps SBF bestehen (Vollständig neu)

**Files:**
- Modify: `src/content/blog/de/5-tipps-sbf-bestehen.md`

- [ ] **Schritt 1: Artikel vollständig ersetzen**

```markdown
---
title: "Mit diesen 5 Tipps besteht du die SBF-Prüfung beim ersten Versuch"
description: "Fünf konkrete Tipps für die optimale SBF-Prüfungsvorbereitung – mit echten Fakten zu Prüfungsaufbau, Lernmethoden und dem richtigen Timing."
date: 2026-05-29
tags: ["SBF", "Tipps", "Prüfung", "Vorbereitung"]
readingTime: 7
lang: de
---

Der Sportbootführerschein (SBF) ist kein Hexenwerk – aber ohne die richtige Strategie kann die Prüfung trotzdem schief gehen. Diese fünf Tipps basieren auf dem, was Kandidaten wirklich stolpern lässt.

## Tipp 1: Verstehe den Prüfungsaufbau – er ist wichtiger als du denkst

Die SBF-Binnen-Theorieprüfung besteht aus **30 Fragen in 45 Minuten** – aber sie ist in zwei Blöcke aufgeteilt, die du **separat** bestehen musst:

- **7 Basisfragen** – du brauchst mindestens **5 richtige** Antworten
- **23 spezifische Binnenfragen** – du brauchst mindestens **18 richtige** Antworten

Das bedeutet: Selbst wenn du insgesamt genug Punkte hast, kannst du durchfallen, wenn du einen der beiden Blöcke nicht schaffst. Wer das nicht weiß, lernt vielleicht zu ungleichmäßig.

**Was das für dein Lernen bedeutet:** Achte darauf, dass du sowohl in den Basisfragen (allgemeine Grundlagen) als auch in den Binnenfragen (Navigation, Schifffahrtsrecht, Sicherheit auf Binnengewässern) sicher bist. Eine Schwäche in einem Block kann nicht durch Stärken im anderen ausgeglichen werden.

## Tipp 2: Übe unter echten Prüfungsbedingungen

Die meisten Kandidaten lernen die Fragen – aber üben nie unter echten Bedingungen. In der Prüfung gibt es ein **Zeitlimit von 45 Minuten**, und du bekommst **kein sofortiges Feedback**, ob deine Antwort richtig war.

Wer das nicht kennt, kann nervös werden und Flüchtigkeitsfehler machen – auch bei Fragen, die er eigentlich sicher beherrscht.

**Was funktioniert:** Absolviere mindestens **3–5 vollständige Probeprüfungen** unter realen Bedingungen – ohne Pausen, ohne Nachschlagen. Der Prüfungsmodus der Boatpass-App simuliert genau diese Situation: 30 Fragen, 45 Minuten, Feedback erst am Ende.

## Tipp 3: Trainiere gezielt deine Schwächen, nicht deine Stärken

Ein häufiger Fehler: Immer wieder Fragen üben, die man schon kann. Das fühlt sich gut an, bringt aber wenig. Das Gehirn lernt am effektivsten durch das **Konfrontieren mit Fehlern**.

Die Kategorien, die bei SBF-Kandidaten am häufigsten Probleme machen:

- **Lichterführung** – welches Licht zeigt welches Boot bei Nacht oder eingeschränkter Sicht? Rotes Licht = Backbord, grünes Licht = Steuerbord, weißes Licht = Heck. Diese Regeln klingen einfach, werden aber unter Prüfungsdruck oft verwechselt.
- **Schallzeichen** – ein kurzer Ton bedeutet "ich weiche nach Steuerbord aus", zwei kurze Töne bedeuten "ich weiche nach Backbord aus". In der Prüfung kommen Varianten, die täuschend ähnlich wirken.
- **Ausweich- und Vorfahrtsregeln** – wer muss ausweichen? Segelboote vor Motorbooten? Das stimmt nur teilweise – ein Motorboot, das einen engen Kanal durchfährt, hat andere Rechte als eines auf offener See.

**Was funktioniert:** Nutze ein System, das dir zeigt, welche Fragen du wiederholt falsch beantwortest, und bringe dir diese gezielt erneut. Das Fehler-Training in der Boatpass-App macht genau das automatisch.

## Tipp 4: Lerne täglich statt in Blöcken

**30 Minuten täglich schlagen 4 Stunden am Wochenende.** Das ist keine Faustregel, sondern Neurologie: Das Gehirn verarbeitet und konsolidiert neues Wissen hauptsächlich im Schlaf. Wer einmal pro Woche paukt, vergisst den Stoff bis zur nächsten Session fast vollständig.

Ein realistischer Zeitplan für den SBF Binnen:

| Lerntyp | Tägliche Zeit | Dauer bis Prüfung |
|---|---|---|
| Schnelllerner | 45–60 Min | 2–3 Wochen |
| Normaler Lerner | 30 Min | 4–5 Wochen |
| Gelegenheitslerner | 20 Min | 6–8 Wochen |

**Tipp:** Nutze die täglichen 15-Fragen der Boatpass-App als Aufwärmung – auch wenn du nur 10 Minuten Zeit hast. Regelmäßigkeit schlägt Intensität.

## Tipp 5: Buche den Prüfungstermin früh – bevor du bereit bist

Das klingt kontraproduktiv, ist aber psychologisch entscheidend: **Eine konkrete Deadline motiviert**. Prüfungstermine beim DMYV oder bei anerkannten Vereinen können Wochen im Voraus ausgebucht sein – wer zu lange wartet, hat plötzlich keine Wahl mehr beim Termin.

**Wie du vorgehst:**
1. Prüfe die Prüfungstermine in deiner Region auf der Website des zuständigen DMYV-Prüfungsausschusses
2. Buche einen Termin **4–6 Wochen** vor deinem geplanten Lernabschluss
3. Plane Theorie, Praxis und Knotenprüfung – alle drei können oft am gleichen Tag abgelegt werden

Die Prüfungsgebühr beim DMYV liegt für den SBF Binnen aktuell bei ca. **131 €** (Stand 05/2026). Dazu kommen Kursgebühren, falls du eine Bootsschule nutzt (ca. 265–299 €). Gesamtkosten also ca. 400–430 €.

## Fazit

Mit dem richtigen Prüfungsverständnis, regelmäßigem Lernen und gezieltem Schwächentraining ist der SBF Binnen gut zu schaffen – auch ohne Vorwissen. Starte kostenlos mit der Boatpass-App: 15 Fragen täglich, offizieller ELWIS-Fragenkatalog, Fehler-Training inklusive.
```

- [ ] **Schritt 2: Commit**

```bash
git add src/content/blog/de/5-tipps-sbf-bestehen.md
git commit -m "content: 5-tipps-sbf-bestehen vollständig überarbeitet"
```

---

## Task 5: DE Artikel — Häufigste Fehler (Vollständig neu)

**Files:**
- Modify: `src/content/blog/de/haeufigste-fehler-sbf.md`

- [ ] **Schritt 1: Artikel vollständig ersetzen**

```markdown
---
title: "Die häufigsten Fehler bei der SBF-Prüfung – und wie du sie vermeidest"
description: "Diese konkreten Fehler machen die meisten SBF-Kandidaten beim Bootsführerschein – in der Theorie, der Praxis und bei der Vorbereitung."
date: 2026-05-29
tags: ["SBF", "Prüfung", "Fehler", "Tipps"]
readingTime: 8
lang: de
---

Jedes Jahr fallen viele SBF-Kandidaten bei der Prüfung durch – obwohl sie sich vorbereitet haben. Meistens stecken dieselben Fehler dahinter. Hier sind die häufigsten davon, konkret und mit Lösungen.

## Fehler 1: Lichterführung und Schallzeichen nur oberflächlich lernen

Das ist die **häufigste Fehlerquelle in der Theorieprüfung**. Lichterführung und Schallzeichen sind komplex, weil viele Details ähnlich wirken, aber unterschiedliche Bedeutungen haben.

**Lichterführung – was du wissen musst:**
- Rotes Seitenlicht = **Backbord** (linke Seite)
- Grünes Seitenlicht = **Steuerbord** (rechte Seite)
- Weißes Hecklicht = Heck
- Weißes Topplicht = Fahrt voraus (nur bei Motorbooten)

Wenn du von vorne auf ein anderes Boot blickst und **grünes Licht siehst**, kommst du von der Steuerbordseite des anderen Bootes – du musst **ausweichen**. Siehst du **rotes Licht**, hat das andere Boot Vorfahrt – du bist kurshaltendes Fahrzeug.

**Schallzeichen – was du wissen musst:**
- Ein kurzer Ton (·): "Ich weiche nach **Steuerbord** aus"
- Zwei kurze Töne (··): "Ich weiche nach **Backbord** aus"
- Drei kurze Töne (···): "Meine Maschine läuft rückwärts"
- Fünf kurze Töne (·····): Warnsignal bei Gefahr

**Lösung:** Lerne diese Regeln nicht auswendig, sondern verstehe die Logik dahinter. Übe mit Bildern und Diagrammen. Die Boatpass-App zeigt Schwachstellen automatisch öfter – Lichterführung sollte in deiner persönlichen Fehlerstatistik auf unter 20% Fehlerquote kommen.

## Fehler 2: Auswendiglernen statt Verstehen

Die Prüfungsfragen können leicht anders formuliert sein als beim Lernen – wer nur auswendig lernt, stolpert bei der kleinsten Variante. Das gilt besonders für **Ausweich- und Vorfahrtsregeln**:

- Ein Segelboot hat **nicht** immer Vorfahrt vor einem Motorboot. Ein Segelboot, das seine Maschine eingeschaltet hat, gilt als Motorboot.
- Auf engen Fahrwassern gelten besondere Regeln – tiefgehende Fahrzeuge haben unter Umständen Vorrang.
- Berufsschifffahrt hat auf Bundeswasserstraßen grundsätzlich Vorrang vor Sportbooten.

**Lösung:** Lies bei jeder falsch beantworteten Frage die Erklärung durch. In der Boatpass-App ist jede Frage mit einer Erklärung versehen, die den Hintergrund erklärt – nicht nur die richtige Antwort zeigt.

## Fehler 3: Knoten vernachlässigen – der häufigste Fehler in der Praxis

Knoten sind die **Nummer-1-Fehlerquelle bei der praktischen Prüfung**. Viele Kandidaten üben sie kurz vor der Prüfung und denken, sie sitzen. Unter Prüfungsdruck, mit zitternden Händen, ist das plötzlich eine andere Geschichte.

Die wichtigsten Knoten für die SBF-Prüfung:
- **Palstek** – die "Rettungsschlinge", unverzichtbar
- **Webleinstek** – zum Befestigen an einem Poller
- **Achtknoten** – Stoppknoten, verhindert das Durchrutschen

**Lösung:** Übe Knoten täglich – nicht einmal pro Woche. Fünf Minuten täglich reichen, um einen Knoten "in den Händen zu haben". Übe bis du ihn blind und ohne Nachdenken knoten kannst. Kaufe dir ein kurzes Seilstück und leg es auf den Schreibtisch.

## Fehler 4: Prüfungssimulation überspringen

Viele lernen die Fragen einzeln – aber üben nie, **30 Fragen in 45 Minuten** unter Zeitdruck zu beantworten. In der echten Prüfung gibt es außerdem kein direktes Feedback, ob du richtig lagst. Wer das nicht kennt, kann nervös werden und Flüchtigkeitsfehler machen.

Die Prüfung läuft so ab:
1. **Theorieprüfung** – schriftlicher Bogen, 30 Multiple-Choice-Fragen, 45 Minuten, kein Hilfsmittel
2. **Knotenprüfung** – du musst die vorgeschriebenen Knoten korrekt und zügig vorführen
3. **Praktische Prüfung** – Fahren auf dem Wasser, Manöver demonstrieren (Anlegen, Ablegen, Boje-über-Bord)

**Lösung:** Absolviere mindestens drei vollständige Probeprüfungen, bevor du zur echten Prüfung gehst. Nutze den Prüfungsmodus der App – er simuliert exakt die Prüfungsbedingungen, inklusive Zeitlimit und Feedback erst am Ende.

## Fehler 5: Zu spät anmelden

Prüfungstermine beim DMYV und bei anerkannten Prüfungsausschüssen sind oft **Wochen oder Monate im Voraus ausgebucht** – besonders in der Frühjahrssaison (März–Mai) und vor dem Sommer. Wer wartet, bis er "bereit" ist, und dann erst schaut, kann plötzlich keinen Termin in den nächsten 8 Wochen finden.

**Lösung:**
1. Geh auf die Website des DMYV-Prüfungsausschusses in deiner Region
2. Prüfe Termine und Fristen – die Anmeldung muss oft **7 Tage vorher** mit Prüfungsgebühr eingehen
3. Buche früh – der Termin motiviert und gibt dir eine konkrete Deadline

Die offizielle Prüfungsgebühr für den SBF Binnen liegt beim DMYV aktuell bei ca. **131 €** (Stand 05/2026).

## Fehler 6: Die Führerscheinpflicht falsch verstehen

Viele glauben, man brauche für "kleine Boote" keinen Führerschein. Das stimmt – aber nur bis zu einer **Motorleistung von 11,03 kW (entspricht 15 PS)** bei Verbrennungsmotoren bzw. 7,5 kW bei Elektromotoren. Wer mit einem stärkeren Boot ohne Führerschein fährt, riskiert Bußgeld und Versicherungsprobleme.

Das Mindestalter für das selbstständige Führen eines Motorboots auf Binnenschifffahrtsstraßen beträgt **16 Jahre**.

## Fazit

Die meisten Durchfaller scheitern nicht am fehlenden Wissen, sondern an vermeidbaren Fehlern: zu oberflächlichem Lernen der schwierigen Kategorien, fehlendem Prüfungstraining und schlechtem Timing. Wer diese Fallen kennt, ist deutlich besser vorbereitet.
```

- [ ] **Schritt 2: Commit**

```bash
git add src/content/blog/de/haeufigste-fehler-sbf.md
git commit -m "content: haeufigste-fehler-sbf vollständig überarbeitet"
```

---

## Task 6: DE Artikel — SBF Binnen vs. SBF See (Vollständig neu)

**Files:**
- Modify: `src/content/blog/de/sbf-binnen-vs-see.md`

- [ ] **Schritt 1: Artikel vollständig ersetzen**

```markdown
---
title: "SBF Binnen vs. SBF See – Was ist der Unterschied?"
description: "Welchen Sportbootführerschein brauchst du? Geltungsbereich, Prüfungsunterschiede, Kosten und der Kombinations-Tipp der die meisten Geld spart."
date: 2026-05-29
tags: ["SBF", "Binnen", "See", "Vergleich"]
readingTime: 7
lang: de
---

Wenn du anfängst, dich mit dem Sportbootführerschein zu beschäftigen, stößt du schnell auf die entscheidende Frage: Binnen oder See? Beide Scheine berechtigen zum Führen von Motorbooten – aber auf unterschiedlichen Gewässern. Hier ist alles, was du wissen musst.

## Was erlaubt dir welcher Schein?

### SBF Binnen

Der SBF Binnen gilt auf allen **deutschen Binnenschifffahrtsstraßen** – also auf Flüssen, Kanälen und Seen, die offiziell als Bundeswasserstraßen eingestuft sind. Dazu gehören:

- Rhein, Elbe, Mosel, Donau, Weser, Oder
- Havel, Spree, Müritz, Chiemsee
- Nord-Ostsee-Kanal, Elbe-Lübeck-Kanal
- Masurische Seen (Polen – hier gelten jedoch polnische Regeln)

**Für wen:** Wer hauptsächlich in Deutschland auf Binnengewässern fahren möchte – Hausboottörns, Flussreisen, Seen in Brandenburg oder Bayern.

### SBF See

Der SBF See gilt auf den deutschen **Seeschifffahrtsstraßen** – also auf Küstengewässern an Nord- und Ostsee sowie auf Küstengewässern international (Mittelmeer, Adria, Atlantik-Küste).

- Nordsee: Wattenmeer, Helgoland
- Ostsee: Kieler Förde, Rügen, Usedom
- International: Kroatische Küste, Griechische Inseln, Mallorca

**Für wen:** Wer Küstenurlaub mit dem eigenen Boot plant oder Charterboote in Küstengebieten mieten möchte.

> **Wichtig:** Die beiden Scheine gelten **nicht füreinander**. Wer nur den SBF Binnen hat, darf nicht auf Seeschifffahrtsstraßen fahren – und umgekehrt.

## Unterschiede in der Prüfung

| | SBF Binnen | SBF See |
|---|---|---|
| Theorieprüfung | 30 Fragen, 45 Min | 30 Fragen + 9 Navigationsaufgaben, 60 Min |
| Bestehensgrenze | 5/7 Basis + 18/23 spezifisch | 5/7 Basis + 18/23 spezifisch |
| Schwerpunkte | Fahrregeln, Lichterführung, Schallzeichen, Binnenwasserstraßen | Navigation, Seekartenarbeit, Seerecht, Gezeiten |
| Praktische Prüfung | Ja | Ja (auf Küstengewässer) |
| Knotenprüfung | Ja | Ja |

Der **wesentliche Unterschied**: Der SBF See beinhaltet eine schriftliche **Navigationsaufgabe** – du musst Kurse auf einer Seekarte einzeichnen, Peilungen berechnen und mit dem Kompass umgehen. Das erfordert zusätzliches Üben und macht die SBF-See-Prüfung anspruchsvoller.

## Kosten im Vergleich

| | SBF Binnen | SBF See | Kombi (See + Binnen) |
|---|---|---|---|
| Prüfungsgebühr DMYV | ca. 131 € | ca. 148 € | ca. 179 € |
| Kurs (typisch) | ca. 265–299 € | ca. 370 € | ca. 470 € |
| **Gesamt** | **ca. 400–430 €** | **ca. 520 €** | **ca. 650 €** |

*(Quelle: DMYV, Nautigo Bootsschule, Stand 05/2026 – Preise je nach Prüfungsausschuss und Anbieter variabel)*

### Der Kombinations-Tipp

Wenn du langfristig beide Scheine machen willst: Mach sie **zusammen**. Bei einer Kombiprüfung (beide an einem Tag) zahlst du nur **179 €** Prüfungsgebühr statt 279 € (131 + 148 €) einzeln – eine Ersparnis von 100 € allein bei der Prüfungsgebühr.

Empfehlung der meisten Bootsschulen: Beginne mit dem **SBF See** (schwieriger), danach fällt der SBF Binnen erheblich leichter, weil die Basisfragen (72 Fragen, die für beide Scheine gleich sind) bereits geübt sind.

## Welchen soll ich zuerst machen?

**Nur auf Binnengewässern in Deutschland fahren?** → SBF Binnen reicht

**Küstenurlaub in Kroatien, Griechenland oder Ostsee planen?** → SBF See

**Langfristig beides wollen?** → Mach die Kombiprüfung, spar dir die 100 € und die Doppelvorbereitung

**Noch unsicher, welche Gewässer?** → Starte mit SBF Binnen (günstiger, einfacher) und ergänze später den SBF See

## Fazit

Der wichtigste Unterschied ist der Geltungsbereich: Binnen für Flüsse und Seen in Deutschland, See für Küstengewässer national und international. Wer langfristig flexibel sein will, sollte die Kombiprüfung in Betracht ziehen – sie ist günstiger als beide Scheine separat.
```

- [ ] **Schritt 2: Commit**

```bash
git add src/content/blog/de/sbf-binnen-vs-see.md
git commit -m "content: sbf-binnen-vs-see vollständig überarbeitet mit korrekten Fakten"
```

---

## Task 7: DE Artikel — SBF Prüfung: Alles Wissenswerte (Vollständig neu)

**Files:**
- Modify: `src/content/blog/de/sbf-pruefung-alles-wissenswerte.md`

- [ ] **Schritt 1: Artikel vollständig ersetzen**

```markdown
---
title: "SBF Prüfung: Alles was du wissen musst"
description: "Vollständiger Leitfaden zur SBF-Theorieprüfung: korrekter Prüfungsaufbau, Bestehensgrenze, Ablauf, Kosten und Vorbereitung."
date: 2026-05-29
tags: ["SBF", "Prüfung", "Leitfaden"]
readingTime: 9
lang: de
---

Der Sportbootführerschein (SBF) ist die offizielle Fahrerlaubnis für Sportboote in Deutschland. Diese Seite erklärt dir **alles**, was du vor der Prüfung wissen musst – mit korrekten Daten aus den offiziellen ELWIS- und DMYV-Regelwerken.

## Wann brauchst du einen Bootsführerschein?

Auf Bundeswasserstraßen besteht **Führerscheinpflicht** für alle Boote mit mehr als **11,03 kW (15 PS) Motorleistung** bei Verbrennungsmotoren. Bei Elektromotoren liegt die Grenze bei **7,5 kW**. Wer ein schwächeres Boot fährt, braucht keinen Schein – aber er muss trotzdem die Verkehrsregeln kennen.

Das **Mindestalter** für das selbstständige Führen eines Motorboots auf Binnenschifffahrtsstraßen beträgt **16 Jahre**.

## Die drei Teile der SBF-Prüfung

Die Prüfung besteht aus drei Teilen, die alle bestanden werden müssen:

### 1. Theorieprüfung

**Format:** Multiple Choice, 30 Fragen, 45 Minuten  
**Katalog:** Offizieller ELWIS-Fragenkatalog (Hrsg.: Generaldirektion Wasserstraßen und Schifffahrt)

Die 30 Fragen sind in zwei Blöcke aufgeteilt, die **separat bestanden** werden müssen:

| Block | Anzahl Fragen | Mindestpunktzahl |
|---|---|---|
| Basisfragen (allgemeine Grundlagen) | 7 | mind. **5 Punkte** |
| Spezifische Binnenfragen | 23 | mind. **18 Punkte** |
| **Gesamt** | **30** | **mind. 23 Punkte** |

> **Achtung:** Beide Blöcke müssen die Mindestpunktzahl **separat** erreichen. 5 Punkte in den Basisfragen UND 18 Punkte in den Binnenfragen sind beide Pflicht – man kann das eine nicht mit dem anderen ausgleichen.

**Die Prüfungsthemen umfassen:**
- **Navigation** – Fahrregeln, Verkehrszeichen, Lichterführung, Schallzeichen
- **Schifffahrtsrecht** – Kollisionsverhütungsregeln, Vorfahrt, Ausweichregeln
- **Seemannschaft** – Manöver, Ankertechnik, Sicherheitsausrüstung
- **Wetterkunde** – Wetterlagen, Sturmsignale, Gefahrensituationen
- **Motorenkunde** – Antrieb, Kraftstoffarten, Wartung
- **Sicherheit** – Notsignale, Rettungsausrüstung, Verhalten bei Notfällen

### 2. Knotenprüfung

Du musst mehrere Seemannsknoten korrekt vorführen. Die wichtigsten:
- **Palstek** – zum Bilden einer festen Schlinge
- **Webleinstek** – zum Befestigen an einem Poller oder Pfahl
- **Achtknoten** – Stoppknoten
- **Kreuzknoten** – zum Verbinden zweier Leinen

Die Knotenprüfung ist kein Bonus – sie ist ein eigenständiger Prüfungsteil. Wer die Knoten nicht beherrscht, kann an dieser Stelle scheitern. Knoten sind die **häufigste Fehlerquelle** in der praktischen SBF-Prüfung.

### 3. Praktische Prüfung (auf dem Wasser)

Du musst ein Boot selbstständig führen und mehrere Manöver demonstrieren:
- Anlegen und Ablegen (an einem Steg, Boje oder in einer Box)
- Kurshalten und Steuern
- **Boje-über-Bord-Manöver** (Person-über-Bord-Rettung)
- Ankern und Aufnehmen des Ankers
- Rückwärtsfahren

## Wie meldest du dich an?

1. Suche den DMYV-Prüfungsausschuss in deiner Region (Liste auf dmyv.de)
2. Fülle das Anmeldeformular aus und reiche es mit den erforderlichen Dokumenten ein
3. Zahle die Prüfungsgebühr – sie muss laut DMYV **mindestens 7 Tage vor der Prüfung** auf dem Konto des Prüfungsausschusses eingegangen sein
4. Bringe am Prüfungstag mit: **Personalausweis** und **Prüfungszulassung**

**Wichtig:** Vergessene Dokumente können dazu führen, dass du an der Prüfung nicht teilnehmen darfst – oder im schlimmsten Fall, dass die Prüfung als nicht bestanden gewertet wird.

## Was kostet der SBF?

| Posten | SBF Binnen | SBF See |
|---|---|---|
| Prüfungsgebühr (DMYV) | ca. 131 € | ca. 148 € |
| Kursgebühr (Bootsschule) | ca. 265–299 € | ca. 370 € |
| **Gesamt** | **ca. 400–430 €** | **ca. 520 €** |

*(Stand 05/2026 – Preise je nach Prüfungsausschuss und Region variabel)*

**Spartipp:** Wer beide Scheine machen will, spart mit der **Kombiprüfung**: Prüfungsgebühr nur ca. 179 € statt 279 € (131 + 148 €) einzeln.

## Wie lange dauert die Vorbereitung?

Für den SBF Binnen sind bei täglichem Lernen von 30–45 Minuten **3–6 Wochen** realistisch. Kandidaten ohne Vorwissen brauchen etwas länger für die nautischen Kategorien. Die Knotenprüfung erfordert tägliches Üben – am besten mit einem kurzen Seilstück auf dem Schreibtisch.

## Fazit

Die SBF-Prüfung ist machbar – wenn du weißt, worauf es ankommt. Der häufigste Fehler ist, den Prüfungsaufbau nicht zu kennen und dann an einem der beiden Pflichtblöcke zu scheitern. Starte mit der Boatpass-App: 15 Fragen täglich kostenlos, offizieller ELWIS-Katalog, Prüfungsmodus inklusive.
```

- [ ] **Schritt 2: Commit**

```bash
git add src/content/blog/de/sbf-pruefung-alles-wissenswerte.md
git commit -m "content: sbf-pruefung-alles-wissenswerte vollständig überarbeitet"
```

---

## Task 8: DE Artikel — Vorbereitung wie lange (Vollständig neu)

**Files:**
- Modify: `src/content/blog/de/sbf-vorbereitung-wie-lange.md`

- [ ] **Schritt 1: Artikel vollständig ersetzen**

```markdown
---
title: "Wie lange dauert die Vorbereitung auf den SBF?"
description: "Realistische Zeitplanung für den Sportbootführerschein – mit konkreten Wochenplänen für verschiedene Lerntypen und den Kategorien, die am meisten Zeit kosten."
date: 2026-05-29
tags: ["SBF", "Vorbereitung", "Zeitplan"]
readingTime: 6
lang: de
---

Eine der häufigsten Fragen vor dem SBF: Wie lange muss ich eigentlich lernen? Die ehrliche Antwort: Es hängt stark von deinem Vorwissen und deiner Lerndisziplin ab. Hier sind realistische Schätzungen für verschiedene Lerntypen – ohne Beschönigung.

## Die kurze Antwort: 3–6 Wochen bei 30 Minuten täglich

Das gilt für den **SBF Binnen mit Antriebsmaschine** (der häufigste Führerschein). Wer täglich 30–45 Minuten lernt, ist realistisch in 3–6 Wochen prüfungsbereit. Schnelle Lerner mit technischem Vorwissen schaffen es in 2–3 Wochen, Gelegenheitslerner brauchen 6–8 Wochen.

> Wichtig: Das gilt nur für die **Theorie**. Die praktische Prüfung (Fahren auf dem Wasser) erfordert separate Übungseinheiten auf einem Boot – das ist nicht durch App-Lernen ersetzbar.

## Lernpläne nach Lerntyp

### Schnelllerner – 2–3 Wochen

**Voraussetzung:** Technisches Vorwissen (z.B. Segelkurs, Motorradführerschein, technischer Beruf), gute Konzentrationsfähigkeit.

| Woche | Fokus | Tägliche Zeit |
|---|---|---|
| 1 | Alle Kategorien einmal durch, Basisfragen sichern | 45–60 Min |
| 2 | Schwachstellen gezielt wiederholen, erste Probeprüfungen | 45–60 Min |
| 3 (opt.) | Prüfungssimulationen, Knoten täglich üben | 30 Min |

**Was hilft:** Direkt mit den schwierigen Kategorien beginnen (Lichterführung, Schallzeichen, Ausweichregeln) und die einfacheren (Sicherheitsausrüstung, Motorenkunde) am Schluss.

### Normaler Lerner – 4–5 Wochen

**Voraussetzung:** Kein Vorwissen nötig, 30 Minuten täglich sind realistisch einplanbar.

| Woche | Fokus |
|---|---|
| 1 | Navigation und Fahrregeln (größtes Lernvolumen) |
| 2 | Lichterführung und Schallzeichen (schwierigste Kategorie) |
| 3 | Seemannschaft und Motorenkunde |
| 4 | Wetterkunde und Sicherheit |
| 5 | Probeprüfungen, Schwachstellen schließen |

### Gelegenheitslerner – 6–8 Wochen

**Voraussetzung:** Lernt 3–4x pro Woche, Alltag lässt nicht täglich Zeit zu.

Strecke das oben genannte Programm auf 6–8 Wochen. Der Schlüssel: **Mindestens 3x pro Woche** lernen. Wer länger als 3–4 Tage Pause macht, vergisst signifikante Teile des Stoffs.

## Was kostet die meiste Zeit?

Erfahrungsgemäß sind das die drei zeitintensivsten Bereiche:

### 1. Lichterführung (ca. 30–40% der Lernzeit)

Welches Boot zeigt welches Licht, in welcher Situation? Das klingt einfach, aber die Variationen sind zahlreich: Motorboote in Fahrt, ankernde Boote, Segelboote, Schlepper, Fischereifahrzeuge – jedes hat andere Vorschriften. Dazu kommen Nacht- und Nebelsituationen.

**Tipp:** Lerne Lichterführung mit Bildern, nicht mit Text. Die ELWIS-Symbole sind eindeutig – visualisiere jede Situation.

### 2. Schifffahrtsrecht und Ausweichregeln (ca. 20–30% der Lernzeit)

Wer weicht wem aus? Wann hast du Vorfahrt, wann nicht? Die Regeln klingen logisch, aber die Prüfungsfragen fragen gezielt nach Randsituationen: enge Fahrwasser, Überholsituationen, Begegnung mit Berufsschifffahrt.

### 3. Seemannschaft und Knoten (praktisch)

Knoten lassen sich nicht durch Lesen lernen – nur durch Üben. Kaufe dir ein 1-Meter-Seilstück und leg es auf den Schreibtisch. **Fünf Minuten täglich** reichen, um Palstek, Webleinstek und Achtknoten zuverlässig zu beherrschen.

## Warum täglich lernen wichtiger ist als lange Einheiten

Das Gehirn konsolidiert neues Wissen vor allem **im Schlaf**. Wer vier Stunden am Wochenende lernt, profitiert weniger als jemand, der täglich 30 Minuten lernt – weil das zweite Modell dem Gehirn mehrere Schlafnächte zum Verarbeiten gibt.

**Konkret:** 30 Minuten täglich × 30 Tage = 15 Stunden Lernzeit. Das ist realistisch für den SBF Binnen. Verteilt auf 5 Wochenenden mit je 3 Stunden = ebenfalls 15 Stunden – aber mit erheblich weniger Behaltenseffekt.

## Der richtige Zeitpunkt für die Prüfungsanmeldung

Buche den Prüfungstermin **vor** dem Ende deiner Lernphase. Eine konkrete Deadline motiviert und verhindert das endlose Verschieben. Prüfungstermine beim DMYV sind oft 4–8 Wochen im Voraus ausgebucht – besonders im Frühjahr.

**Empfehlung:** Melde dich an, wenn du ungefähr 60–70% des Stoffs beherrschst. Der Prüfungstermin gibt dir dann die nötige Motivation, die restlichen 30–40% zu lernen.

## Fazit

Für den SBF Binnen sind bei realistischem Lernaufwand **4–5 Wochen** für die meisten Kandidaten ausreichend. Der Schlüssel ist Regelmäßigkeit, nicht Intensität. Starte heute mit 15 Fragen in der Boatpass-App – kostenlos, offizieller ELWIS-Katalog, Fehler-Tracking inklusive.
```

- [ ] **Schritt 2: Commit**

```bash
git add src/content/blog/de/sbf-vorbereitung-wie-lange.md
git commit -m "content: sbf-vorbereitung-wie-lange vollständig überarbeitet"
```

---

## Task 9: EN Artikel — Alle 4 englischen Artikel (Vollständig neu)

**Files:**
- Modify: `src/content/blog/en/5-tips-pass-sbf.md`
- Modify: `src/content/blog/en/most-common-sbf-mistakes.md`
- Modify: `src/content/blog/en/sbf-inland-vs-coastal.md`
- Modify: `src/content/blog/en/sbf-exam-everything-you-need-to-know.md`
- Modify: `src/content/blog/en/sbf-preparation-how-long.md`

- [ ] **Schritt 1: 5-tips-pass-sbf.md ersetzen**

```markdown
---
title: "5 Tips to Pass Your German Boating License Exam First Try"
description: "Five concrete strategies for the SBF exam – with real facts about the exam format, scoring, and the most effective preparation methods."
date: 2026-05-29
tags: ["SBF", "Tips", "Exam", "Preparation"]
readingTime: 7
lang: en
---

The German boating license (Sportbootführerschein, SBF) is achievable for anyone – but the wrong preparation strategy can lead to failure even with enough study time. Here are five concrete tips that make the real difference.

## Tip 1: Understand the exam structure – it matters more than you think

The SBF Inland (Binnen) theory exam consists of **30 questions in 45 minutes** – but it's split into two blocks that you must pass **separately**:

- **7 base questions** – you need at least **5 correct** answers
- **23 specific inland questions** – you need at least **18 correct** answers

This means: Even if your total score looks fine, you can fail if one block falls below the threshold. You cannot compensate a weak block with a strong one.

**What this means for your study plan:** Ensure you're solid in both base questions (general nautical fundamentals) and inland-specific questions (navigation rules, light signals, waterway signs). Track both separately when doing practice runs.

## Tip 2: Practice under real exam conditions

Most candidates study individual questions – but never practice answering **30 questions in 45 minutes** without immediate feedback. That's exactly what the real exam feels like.

Without this practice, test anxiety and time pressure can cause errors on questions you actually know.

**What works:** Complete at least **3–5 full mock exams** before your real test – timed, no help, no pausing. The exam mode in the Boatpass app simulates exactly this: 30 questions, 45 minutes, feedback only at the end.

## Tip 3: Train your weak spots, not your strengths

A common mistake: studying questions you already know. It feels productive but delivers little. Your brain learns most effectively from **confronting mistakes**.

The categories that cause the most trouble for SBF candidates:

- **Light signals (Lichterführung)** – Red = port side, green = starboard, white = stern. These rules seem simple but are frequently confused under pressure.
- **Sound signals (Schallzeichen)** – One short blast = "I'm altering course to starboard." Two short blasts = "I'm altering course to port." These are tested with variants that look nearly identical.
- **Right-of-way rules** – Sailboats don't always have right of way. A sailboat with its engine on is treated as a motor vessel. Commercial shipping has priority on federal waterways.

**What works:** Use a system that tracks which questions you get wrong repeatedly and shows them more often. The Boatpass error training does this automatically.

## Tip 4: Study daily, not in blocks

**30 minutes daily beats 4 hours on the weekend.** Your brain consolidates new information during sleep – multiple sleep cycles across a week are far more effective than one long session.

Realistic timelines for SBF Inland:

| Learning type | Daily time | Time to exam |
|---|---|---|
| Fast learner | 45–60 min | 2–3 weeks |
| Average learner | 30 min | 4–5 weeks |
| Casual learner | 20 min | 6–8 weeks |

Use the Boatpass app's daily 15 free questions as a warm-up – even on days when you only have 10 minutes.

## Tip 5: Book your exam slot early – before you feel ready

Exam slots with DMYV (the official licensing authority) and recognized clubs fill up weeks in advance – especially in spring (March–May) before the boating season. If you wait until you feel "ready," you may find no slots available for 8 weeks.

**How to approach it:**
1. Find the DMYV exam committee website for your region
2. Check available dates and registration deadlines (payment must arrive at least 7 days before the exam)
3. Book when you're roughly 60–70% prepared – the deadline will motivate you to cover the rest

The official exam fee for SBF Inland (DMYV) is currently around **€131** (as of 05/2026). Add course fees of approximately €265–299 for a total of around €400–430.

## Summary

With the right exam structure knowledge, daily practice, and targeted weak-spot training, the SBF is achievable for anyone – even without prior nautical knowledge. Start for free with the Boatpass app: 15 questions daily, official ELWIS catalog, error training included.
```

- [ ] **Schritt 2: most-common-sbf-mistakes.md ersetzen**

```markdown
---
title: "Most Common Mistakes in the German Boating License Exam"
description: "The specific mistakes that cause most SBF candidates to fail – in theory, practical, and knot sections – and how to avoid them."
date: 2026-05-29
tags: ["SBF", "Exam", "Mistakes", "Tips"]
readingTime: 8
lang: en
---

Many SBF candidates fail not because they didn't study, but because of avoidable, specific mistakes. Here are the most common ones, with concrete solutions.

## Mistake 1: Learning light signals and sound signals superficially

This is the **most common failure point in the theory exam**. Light and sound signals have many variations that look similar but have different meanings.

**Light signals – what you need to know:**
- Red sidelight = **port** (left side)
- Green sidelight = **starboard** (right side)
- White stern light = rear
- White masthead light = vessel under engine power

When you see **green light** on an approaching vessel, you're on their starboard side – you must **give way**. When you see **red light**, they must give way to you.

**Sound signals – what you need to know:**
- One short blast (·): "I am altering my course to **starboard**"
- Two short blasts (··): "I am altering my course to **port**"
- Three short blasts (···): "My engines are going astern"
- Five short blasts (·····): Warning signal – danger

**Solution:** Don't memorize these as lists – understand the logic. The Boatpass app automatically shows your weakest categories more often. Aim for under 20% error rate on light signals before your exam.

## Mistake 2: Memorizing answers instead of understanding rules

Exam questions can be phrased differently than practice questions. Candidates who only memorize trip over variants. This is especially common with right-of-way rules:

- A sailboat under engine power is treated as a **motor vessel** – it does NOT have right of way over other motor vessels
- Commercial shipping has priority on German federal waterways
- Special rules apply in narrow channels

**Solution:** For every question you get wrong, read the explanation – not just the correct answer. The Boatpass app provides explanations for every question.

## Mistake 3: Neglecting knots – the #1 failure in the practical exam

Knots are the **number one failure point in the practical SBF exam**. Candidates practice them once or twice and assume they're fine – then under exam pressure, with nervous hands, things fall apart.

Required knots include:
- **Bowline (Palstek)** – creates a fixed loop, essential for mooring
- **Cleat hitch (Webleinstek)** – attaches a line to a cleat or bollard
- **Figure-eight (Achtknoten)** – stopper knot
- **Square knot (Kreuzknoten)** – joins two lines

**Solution:** Practice knots daily. Five minutes with a short piece of rope is enough. Practice until you can tie them without thinking. Put a rope on your desk next to your keyboard.

## Mistake 4: Skipping full exam simulations

Studying questions individually doesn't prepare you for the actual exam experience: **30 questions, 45 minutes, no feedback until the end**.

The actual exam has three parts:
1. **Theory exam** – written multiple choice, 30 questions, 45 minutes
2. **Knot exam** – demonstrate required knots correctly and quickly
3. **Practical exam** – maneuvers on the water: docking, undocking, man-overboard drill

**Solution:** Complete at least three full mock exams before your real one. Use exam mode in the app – it replicates the real conditions exactly.

## Mistake 5: Registering too late

DMYV exam slots fill up weeks in advance – especially March through June before boating season. Candidates who wait until they feel "ready" often can't find a slot for 8 weeks.

**Solution:**
1. Check the DMYV exam committee website for your region
2. Register **4–6 weeks** before your planned study completion
3. Note: exam fees must arrive at least 7 days before the exam

The official exam fee for SBF Inland is approximately **€131** (as of 05/2026).

## Mistake 6: Misunderstanding license requirements

Many believe small boats don't need a license. True – but only up to **11.03 kW (15 HP)** for combustion engines or **7.5 kW** for electric motors. Driving a more powerful boat without a license risks fines and insurance problems.

The minimum age to independently operate a motorboat on German inland waterways is **16 years**.

## Summary

Most failures come from avoidable, specific gaps: superficial knowledge of light and sound signals, lack of exam simulation practice, and underestimating knots. Knowing these failure points puts you significantly ahead.
```

- [ ] **Schritt 3: sbf-inland-vs-coastal.md ersetzen**

```markdown
---
title: "SBF Inland vs. SBF Coastal – What's the Difference?"
description: "Which German boating license do you need? Coverage, exam differences, costs, and why combining both licenses is cheaper than doing them separately."
date: 2026-05-29
tags: ["SBF", "Inland", "Coastal", "Comparison"]
readingTime: 7
lang: en
---

When you start researching the German boating license, you'll quickly hit the key question: inland (Binnen) or coastal (See)? Both licenses cover motorboats – but on different waters. Here's everything you need to decide.

## What does each license cover?

### SBF Inland (Binnen)

Valid on all German **inland waterways** – rivers, canals, and lakes officially classified as federal waterways:

- Rhine, Elbe, Mosel, Danube, Weser
- Havel, Spree, Müritz, Chiemsee
- Nord-Ostsee-Kanal, Elbe-Lübeck-Kanal

**Best for:** Houseboat trips in Germany, river cruising, lakes in Brandenburg or Bavaria.

### SBF Coastal (See)

Valid on German **coastal waterways** and coastal waters internationally:

- North Sea: Wadden Sea, Helgoland
- Baltic Sea: Kiel Fjord, Rügen, Usedom
- International: Croatian coast, Greek islands, Mallorca

**Best for:** Coastal sailing holidays, chartering boats in Mediterranean or Baltic destinations.

> **Important:** The two licenses do **not** substitute for each other. SBF Inland only covers inland waterways; SBF Coastal only covers coastal waters.

## Exam differences

| | SBF Inland | SBF Coastal |
|---|---|---|
| Theory | 30 questions, 45 min | 30 questions + 9 navigation tasks, 60 min |
| Pass threshold | 5/7 base + 18/23 specific | 5/7 base + 18/23 specific |
| Key topics | Waterway rules, light signals, sound signals | Chart navigation, compass work, tidal calculations |
| Practical exam | Yes | Yes (on coastal waters) |

The **key difference**: SBF Coastal includes a **written navigation task** – you plot courses on a nautical chart and work with compass bearings. This makes the coastal exam significantly more demanding than the inland exam.

## Cost comparison

| | SBF Inland | SBF Coastal | Combined |
|---|---|---|---|
| DMYV exam fee | ~€131 | ~€148 | ~€179 |
| Course fee (typical) | ~€265–299 | ~€370 | ~€470 |
| **Total** | **~€400–430** | **~€520** | **~€650** |

*(Source: DMYV, Nautigo, as of 05/2026 – prices vary by exam committee and provider)*

### The combination tip

If you want both licenses long-term: **do them together**. A combined exam costs only ~€179 in exam fees instead of ~€279 (€131 + €148) separately – saving €100 on the exam fee alone.

Most instructors recommend starting with **SBF Coastal** (harder), then the inland exam becomes much easier – because the 72 base questions that appear in both exams are already well-practiced.

## Which should you get?

**Only planning to boat on German inland waterways?** → SBF Inland is sufficient

**Planning coastal holidays in Croatia, Greece, or the Baltic?** → SBF Coastal

**Want flexibility for both?** → Combined exam saves money and preparation time

**Still unsure?** → Start with SBF Inland (cheaper, easier) and add coastal later

## Summary

The key difference is coverage: inland for German rivers and lakes, coastal for sea and international waters. Anyone planning to boat flexibly long-term should consider the combined exam – it's cheaper than taking them separately.
```

- [ ] **Schritt 4: sbf-exam-everything-you-need-to-know.md ersetzen**

```markdown
---
title: "SBF Exam: Everything You Need to Know"
description: "Complete guide to the German boating license exam: correct exam structure, pass thresholds, what to bring, costs, and how to register."
date: 2026-05-29
tags: ["SBF", "Exam", "Guide"]
readingTime: 9
lang: en
---

The German Sportbootführerschein (SBF) is the official license for operating motorboats in Germany. This guide covers everything you need to know before your exam – with accurate data from official ELWIS and DMYV sources.

## When do you need a boating license?

On German federal waterways, a license is **required** for boats with more than **11.03 kW (15 HP)** engine output (combustion engines) or **7.5 kW** (electric motors). Smaller boats don't require a license, but operators must still follow all traffic rules.

The **minimum age** to independently operate a motorboat on German inland waterways is **16 years**.

## The three parts of the SBF exam

All three parts must be passed:

### 1. Theory exam

**Format:** Multiple choice, 30 questions, 45 minutes  
**Source:** Official ELWIS question catalog (published by Generaldirektion Wasserstraßen und Schifffahrt)

The 30 questions are split into two blocks that must **each** be passed separately:

| Block | Questions | Minimum score |
|---|---|---|
| Base questions (general fundamentals) | 7 | at least **5 points** |
| Specific inland questions | 23 | at least **18 points** |
| **Total** | **30** | **at least 23 points** |

> **Critical:** Both blocks must reach their individual minimum. A strong score in one block cannot compensate for a weak score in the other.

**Topics covered:**
- **Navigation** – waterway rules, signs, light signals, sound signals
- **Maritime law** – collision avoidance rules, right of way
- **Seamanship** – maneuvers, anchoring, safety equipment
- **Weather** – weather patterns, storm signals, risk situations
- **Engine knowledge** – propulsion, fuel types, basic maintenance
- **Safety** – distress signals, rescue equipment, emergency procedures

### 2. Knot exam

You must correctly demonstrate several sailor's knots. The most important:
- **Bowline (Palstek)** – creates a fixed non-slipping loop
- **Cleat hitch (Webleinstek)** – attaches line to a cleat or bollard
- **Figure-eight knot (Achtknoten)** – stopper knot
- **Square knot (Kreuzknoten)** – joins two lines of equal thickness

The knot exam is a **standalone exam section** – not just a formality. Knots are the most common failure point in the practical SBF exam.

### 3. Practical exam (on the water)

You must independently operate a boat and demonstrate several maneuvers:
- Docking and undocking (at a jetty, buoy, or in a berth)
- Course keeping and steering
- **Man-overboard drill** (recovering a floating object)
- Anchoring and weighing anchor
- Reversing

## How to register

1. Find the DMYV exam committee for your region (list at dmyv.de)
2. Complete the registration form and submit required documents
3. Pay the exam fee – it must arrive at least **7 days before the exam**
4. Bring on exam day: **ID document** and **exam admission notice**

**Critical:** Forgotten documents can result in being unable to take the exam, or the exam being marked as failed.

## What does it cost?

| Item | SBF Inland | SBF Coastal |
|---|---|---|
| Exam fee (DMYV) | ~€131 | ~€148 |
| Course fee (typical) | ~€265–299 | ~€370 |
| **Total** | **~€400–430** | **~€520** |

*(As of 05/2026 – prices vary by exam committee and region)*

**Money-saving tip:** If you want both licenses, the **combined exam** costs only ~€179 in exam fees instead of ~€279 separately.

## How long does preparation take?

For SBF Inland, studying 30–45 minutes daily, **3–6 weeks** is realistic for most candidates. Candidates without prior nautical knowledge need extra time for the light signals and right-of-way rules categories. Knot practice requires daily physical repetition – no app can replace tying actual knots.

## Summary

The SBF exam is very achievable – if you know the structure. The most common failure reason: not knowing that the two theory blocks must each be passed separately. Start with the Boatpass app: 15 questions daily for free, official ELWIS catalog, full exam simulation included.
```

- [ ] **Schritt 5: sbf-preparation-how-long.md ersetzen**

```markdown
---
title: "How Long Does It Take to Prepare for the SBF Exam?"
description: "Realistic preparation timelines for the German boating license – with concrete weekly plans for different learning types and the categories that take the most time."
date: 2026-05-29
tags: ["SBF", "Preparation", "Study Plan"]
readingTime: 6
lang: en
---

One of the most common questions before starting SBF prep: how long do I actually need to study? The honest answer depends on your prior knowledge and daily consistency. Here are realistic estimates – without sugarcoating.

## Short answer: 3–6 weeks at 30 minutes daily

This applies to **SBF Inland (Binnen) for motor vessels** – the most common license. Studying 30–45 minutes daily, most candidates are exam-ready in 3–6 weeks. Fast learners with technical background can be ready in 2–3 weeks; casual learners may need 6–8 weeks.

> Note: This is for **theory only**. The practical exam (driving a boat on the water) requires separate on-water practice sessions – no app can substitute for that.

## Study plans by learning type

### Fast learner – 2–3 weeks

**Prerequisites:** Technical background (e.g., sailing experience, driver's license, engineering), good concentration.

| Week | Focus | Daily time |
|---|---|---|
| 1 | Cover all categories once, secure base questions | 45–60 min |
| 2 | Target weak spots, first full mock exams | 45–60 min |
| 3 (optional) | Exam simulations, daily knot practice | 30 min |

**Tip:** Start with the hardest categories (light signals, sound signals, right-of-way rules) and leave the easier ones (safety equipment, basic engine knowledge) for last.

### Average learner – 4–5 weeks

**Prerequisites:** No prior knowledge needed, 30 minutes daily is realistic.

| Week | Focus |
|---|---|
| 1 | Navigation and waterway rules (largest content volume) |
| 2 | Light signals and sound signals (hardest category) |
| 3 | Seamanship and engine knowledge |
| 4 | Weather and safety |
| 5 | Mock exams, close remaining gaps |

### Casual learner – 6–8 weeks

**Prerequisites:** Studies 3–4 times per week, daily time not always available.

Spread the above plan across 6–8 weeks. The key: study **at least 3 times per week**. Longer gaps than 3–4 days cause significant forgetting of recent material.

## What takes the most time?

### 1. Light signals (~30–40% of study time)

Which vessel shows which light, in which situation? The combinations are numerous: motorboats underway, anchored vessels, sailboats, tugboats, fishing vessels – each has different requirements. Add night and reduced-visibility scenarios.

**Tip:** Study light signals with visual diagrams, not text descriptions. The ELWIS symbols are unambiguous – visualize each scenario.

### 2. Right-of-way rules (~20–30% of study time)

Who gives way to whom? When do you have right of way? The rules seem logical but exam questions specifically target edge cases: narrow channels, overtaking situations, encountering commercial shipping.

### 3. Seamanship and knots (practical)

Knots cannot be learned by reading – only by physical practice. Buy a 1-meter piece of rope and put it on your desk. **Five minutes daily** is enough to reliably master the bowline, cleat hitch, and figure-eight knot.

## Why daily practice beats long sessions

The brain consolidates new information primarily **during sleep**. Someone who studies four hours on the weekend benefits less than someone who studies 30 minutes daily – because the daily schedule gives the brain multiple sleep cycles to process the material.

**Concretely:** 30 minutes daily × 30 days = 15 hours of study. Spread across 5 weekends at 3 hours each = also 15 hours – but with significantly lower retention.

## When to book your exam slot

Book your exam date **before** you finish your study plan. A concrete deadline motivates and prevents endless postponement. DMYV exam slots fill up 4–8 weeks in advance – especially in spring.

**Recommendation:** Register when you've covered roughly 60–70% of the material. The exam date will motivate you to complete the rest.

## Summary

For SBF Inland, **4–5 weeks** at 30 minutes daily is realistic for most candidates without prior knowledge. The key is consistency, not intensity. Start today with 15 free questions in the Boatpass app – official ELWIS catalog, error tracking, exam simulation included.
```

- [ ] **Schritt 6: Build prüfen**

```bash
npm run build 2>&1 | grep -E "(error|Error|built|Complete)"
```

Expected: `22 page(s) built` with no errors.

- [ ] **Schritt 7: Commit**

```bash
git add src/content/blog/en/
git commit -m "content: alle EN Blogartikel vollständig überarbeitet"
```

---

## Task 10: Finaler Build + DE Artikel Commit

- [ ] **Schritt 1: Finaler Build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `22 page(s) built in X.XXs` — `Complete!`

- [ ] **Schritt 2: Gesamtkommit**

```bash
git add -A
git status
git commit -m "feat: blog redesign + alle Artikel vollständig überarbeitet mit verifizierten ELWIS/DMYV-Fakten"
```

---

## Self-Review

**Spec coverage check:**
- ✅ BlogCard featured + compact: Task 1
- ✅ Blog index Modern Tiles layout: Task 2
- ✅ EN blog index: Task 2 Schritt 3
- ✅ BlogLayout: Task 3
- ✅ Alle 5 DE Artikel: Tasks 4–8
- ✅ Alle 4 EN Artikel (5. Artikel sbf-preparation-how-long.md fehlt in Dateiliste → in Task 9 enthalten): Task 9
- ✅ Verifiziete Fakten (ELWIS-Bestehensgrenze 5/7+18/23, DMYV-Gebühren, Mindestalter, Führerscheinfreiheit): In allen Artikeln eingebaut

**Placeholder scan:** Keine "TBD", "TODO" oder unvollständigen Abschnitte gefunden.

**Type consistency:** `featured` prop in BlogCard, `featured={true}` / `featured={false}` in allen aufrufenden Dateien — konsistent.
