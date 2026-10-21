"""Fahrschul-Übersicht und Städte-Template (DE/EN) auf den Rahmen der Runde 3 (Plan 3a, Task 5).

Erst pgpage.py (Kopf, Spalte, Konverter), dann die seitenspezifischen Muster: Info-Kasten mit
Icon, Städtekarten (EN-Klassen auf die DE-Namen), Schulkarten (.pg-school*), Google-Maps-Kasten
als .pg-banner, Kennzahlen-Karten, Zeilenliste, Store-Button, Style-Blöcke raus. Die Regeln
für .city-* und .pg-school* liegen tokenisiert in src/styles/page.css (werden hier einmalig
angehängt).

Aufruf (Repo-Wurzel): python3 scripts/pg-migrate/pgschools.py
"""
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PAGES = {
    'fahrschulen': ROOT / 'src/pages/bootsfahrschulen/index.astro',
    'en-boat-schools': ROOT / 'src/pages/en/boat-schools/index.astro',
    'fahrschulen-stadt': ROOT / 'src/pages/bootsfahrschulen/[city].astro',
    'en-boat-schools-city': ROOT / 'src/pages/en/boat-schools/[city].astro',
}
CHEV = '<Icon name="chevronRight" size={16} strokeWidth={2.25} />'
CHEV_BTN = '<Icon name="chevronRight" size={16} strokeWidth={2.25} class="h-btn-arrow" />'
BULB = '<span class="pg-row-icon"><Icon name="lightbulb" size={20} strokeWidth={1.75} /></span>'

FACTS = {
    'de': """// Kennzahlen der Seitenleiste, wörtlich aus den Stadtdaten (Spec Runde 3, 3.3).
const cityFacts = [
  { k: 'Bundesland', v: city.state },
  { k: 'Gewässer', v: city.waterways.de },
  { k: 'Benötigter Schein', v: licenceLabel(city.variant) },
  ...(city.schools.length ? [{ k: 'Bootsfahrschulen vor Ort', v: `${city.schools.length}` }] : []),
];

""",
    'en': """// Sidebar facts, taken verbatim from the city data (spec round 3, 3.3).
const cityFacts = [
  { k: 'State', v: city.state },
  { k: 'Waterways', v: city.waterways.en },
  { k: 'Licence required', v: licenceTypes.map(l => l.name).join(' & ') },
  ...(city.schools.length ? [{ k: 'Boat schools listed', v: `${city.schools.length}` }] : []),
];

""",
}

CSS_MARK = '/* ── Fahrschulen (Runde 3a, Task 5)'
CSS = """
/* ── Fahrschulen (Runde 3a, Task 5): Städtekarten, Schulkarten, Link-Karten ── */
@media (min-width: 560px) { .pg-cards--2 { grid-template-columns: repeat(2, 1fr); } }
a.pg-card { display: block; text-decoration: none; transition: border-color 0.2s var(--h-ease), transform 0.2s var(--h-ease); }
a.pg-card:hover { border-color: var(--h-line-2); transform: translateY(-2px); }
.pg-card-more { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; font: 700 14px/1.4 var(--h-sans); color: var(--h-blue-ink); }
.city-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.city-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 26px;
  border: 1px solid var(--h-line);
  border-radius: var(--h-r);
  background: var(--h-card);
  text-decoration: none;
  transition: transform 0.2s var(--h-ease), border-color 0.2s var(--h-ease), box-shadow 0.2s var(--h-ease);
}
.city-card:hover {
  transform: translateY(-3px);
  border-color: var(--h-line-2);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--h-ink) 10%, transparent);
}
.city-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  border-radius: 14px;
  background: var(--h-blue-wash);
  color: var(--h-blue-ink);
}
.city-name {
  margin: 0 0 10px;
  font-family: var(--h-display);
  font-stretch: 84%;
  font-weight: 720;
  font-size: 22px;
  letter-spacing: -0.01em;
  color: var(--h-ink);
}
.city-card .pg-pill { margin-bottom: 12px; }
.city-waterways { flex-grow: 1; margin: 0 0 18px; font-size: 15px; line-height: 1.6; color: var(--h-muted); }
.city-link { display: inline-flex; align-items: center; gap: 6px; font: 700 14px/1.4 var(--h-sans); color: var(--h-blue-ink); }
.city-link svg { transition: transform 0.35s var(--h-ease); }
.city-card:hover .city-link svg { transform: translateX(4px); }
.pg-schools { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.pg-school { padding: 20px 22px; border: 1px solid var(--h-line); border-radius: var(--h-r); background: var(--h-card); }
.pg-school-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
.pg-school-head .pg-row-icon { margin-top: 2px; }
.pg-school-head .pg-card-title { margin-bottom: 2px; }
.pg-school-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.pg-school-actions { display: flex; flex-wrap: wrap; gap: 10px; }
/* Website- und Telefon-Link bleiben mind. 44 px hohe Tap-Flächen (WCAG 2.5.5). */
.pg-school-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 16px;
  border: 1px solid var(--h-line-2);
  border-radius: var(--h-r-sm);
  background: var(--h-card);
  font: 600 14px/1.4 var(--h-sans);
  color: var(--h-blue-ink);
  text-decoration: none;
  transition: background 0.15s var(--h-ease), border-color 0.15s var(--h-ease);
}
.pg-school-link:hover { background: var(--h-blue-wash); border-color: var(--h-blue); }
.pg-school-link--muted { color: var(--h-text); }
.pg-school-link--muted:hover { background: var(--h-paper-2); border-color: var(--h-line-2); }
@media (prefers-reduced-motion: reduce) { .city-card, .city-link svg, a.pg-card { transition: none; } }
"""


def sub(s, pattern, repl, count=0, flags=0, expect=None, name=''):
    s, n = re.subn(pattern, repl, s, count=count, flags=flags)
    if expect is not None:
        assert n == expect, (name or pattern[:50], n)
    return s


def common(s, lang):
    """Muster, die Übersicht und Städte-Template teilen."""
    # Info-Kasten (EN: gap 16px mit Buch-Icon; DE-Übersicht ohne Icon, der Konverter kennt gap 18px)
    s = sub(s, r'<div style="display:flex; align-items:flex-start; gap:16px; background:white; border:1px solid rgba\(51,102,255,0\.18\); border-left:4px solid #3366FF; border-radius:16px; padding:24px 26px; margin-bottom:\d+px;">',
            '<div class="pg-answer pg-answer--icon">')
    s = sub(s, r'<span style="flex-shrink:0; margin-top:2px;"><Icon name="book" size=\{22\}(?: stroke="#3366FF")? strokeWidth=\{1\.75\} /></span>', BULB)
    s = sub(s, r'(<div class="pg-answer pg-answer--icon">\n)(\s*)<div>\n', lambda m: f'{m.group(1)}{m.group(2)}{BULB}\n{m.group(2)}<div class="pg-answer-body">\n')
    s = sub(s, r'(<div class="pg-answer pg-answer--icon">\n\s*' + re.escape(BULB) + r'\n\s*)<div>\n', r'\1<div class="pg-answer-body">\n')
    s = sub(s, r'<div style="font-size:12px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">([^<]*)</div>', r'<p class="pg-answer-label">\1</p>')
    # Fließtext des Kastens wie auf der EN-Seite (der Konverter macht aus margin:0 eine pg-note)
    s = sub(s, r'(<p class="pg-answer-label">[^\n]*\n\s*)<p class="pg-note">', r'\1<p class="pg-card-text">')
    s = sub(s, r'<div style="font-size:14px; font-weight:700; color:#1A1F36; margin-bottom:6px;">([^<]*)</div>', r'<p class="pg-card-title">\1</p>')
    s = sub(s, r'<p style="font-size:15px; color:#(?:4B5563|656B78); line-height:1\.(?:7|65); margin:0;">', '<p class="pg-card-text">')
    # Einleitungen der Abschnitte
    s = sub(s, r'<p style="font-size:16px; color:#(?:4B5563|656B78); line-height:1\.\d+; margin-bottom:\d+px;">', '<p class="pg-p">')
    # Icon-Farben kommen aus der Kachel (currentColor)
    s = s.replace(' stroke="#3366FF"', '').replace(' stroke="currentColor"', '')
    # FAQ-Karten des Templates
    s = s.replace('<div class="faq-item">', '<div class="pg-faq-item">')
    # Seiten-Style-Block entfällt (Regeln tokenisiert in page.css)
    s = sub(s, r'\n<style>\n.*?\n</style>\n', '\n', count=1, flags=re.S)
    return s


def overview(s, lang):
    if lang == 'en':
        for old, new in [('school-grid', 'city-grid'), ('school-card', 'city-card'), ('school-icon', 'city-icon'),
                         ('school-title', 'city-name'), ('school-tag', 'city-tag'), ('school-desc', 'city-waterways'), ('school-link', 'city-link')]:
            s = s.replace(f'class="{old}"', f'class="{new}"')
    s = s.replace('<span class="city-tag">', '<span class="pg-pill">')
    s = sub(s, r'<div class="city-link">([^<]*?)\s*&rarr;</div>', r'<div class="city-link">\1' + CHEV + '</div>')
    return s


def city(s, lang):
    # Kennzahlen-Konstante vor dem Schema (licenceLabel ist gehoistet, licenceTypes steht davor)
    if 'const cityFacts' not in s:
        s = s.replace('const breadcrumbSchema = {', FACTS[lang] + 'const breadcrumbSchema = {', 1)
    # Google-Maps-Kasten → pg-banner (der Konverter hat flex:1 bereits zu pg-row-body gemacht)
    s = sub(s, r'''<a href=\{mapsSearchUrl\(city\.mapsQuery\)\} target="_blank" rel="noopener noreferrer" class="maps-cta">
\s*<div(?: style="flex:1; min-width:0;"| class="pg-row-body")>
\s*<div style="[^"]*">([^<]*)</div>
\s*<div style="[^"]*">([^<]*)</div>
\s*<div style="[^"]*">([^<]*)</div>
\s*</div>
\s*<span style="[^"]*">([^<]*?)\s*&rarr;</span>
\s*</a>''',
            lambda m: f'''<a href={{mapsSearchUrl(city.mapsQuery)}} target="_blank" rel="noopener noreferrer" class="pg-banner">
        <span class="pg-banner-text">
          <span class="pg-eyebrow">{m.group(1)}</span>
          <span class="pg-banner-title">{m.group(2)}</span>
          <span class="pg-banner-sub">{m.group(3)}</span>
        </span>
        <span class="h-btn h-btn--sm pg-banner-cta">{m.group(4)}{CHEV_BTN}</span>
      </a>''')
    # Schulkarten
    for old, new in [('<div class="school-list">', '<div class="pg-schools">'), ('<div class="school-card">', '<div class="pg-school">'),
                     ('<div class="school-header">', '<div class="pg-school-head">'), ('<span class="school-icon">', '<span class="pg-row-icon pg-row-icon--sm">'),
                     ('<h3 class="school-name">', '<h3 class="pg-card-title">'), ('<p class="school-address">', '<p class="pg-row-text">'),
                     ('<div class="school-licenses">', '<div class="pg-school-tags">'), ('<span class="school-license-tag">', '<span class="pg-pill">'),
                     ('<div class="school-actions">', '<div class="pg-school-actions">'),
                     ('class="school-link school-link-secondary"', 'class="pg-school-link pg-school-link--muted"'), ('class="school-link"', 'class="pg-school-link"')]:
        s = s.replace(old, new)
    # Karten-Raster (der Konverter setzt pauschal pg-cards--3; hier sind es Paare, nur die EN-Prüfung hat drei)
    s = s.replace('<div class="pg-cards pg-cards--3">', '<div class="pg-cards pg-cards--2">')
    if lang == 'en':
        s = sub(s, r'(<!-- Exams -->.*?)<div class="pg-cards pg-cards--2">', r'\1<div class="pg-cards pg-cards--3">', count=1, flags=re.S, expect=1, name='exam cards')
    s = s.replace('<a href={l.href} class="info-card" style="text-decoration:none;">', '<a href={l.href} class="pg-card">')
    s = s.replace('<div class="info-card">', '<div class="pg-card">')
    s = sub(s, r'<div style="font-weight:700; color:#1A1F36; margin-bottom:6px;">([^<]*)</div>', r'<p class="pg-card-title">\1</p>')
    s = sub(s, r'<div style="font-size:15px; color:#656B78; line-height:1\.65;">([^<]*)</div>', r'<p class="pg-card-text">\1</p>')
    s = sub(s, r'<div style="font-size:14px; font-weight:700; color:#3366FF; margin-top:10px;">([^<]*?)\s*&rarr;</div>', r'<span class="pg-card-more">\1' + CHEV + '</span>')
    # DE: Lizenz-Links als Liste
    s = sub(s, r'<div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:18px;">\n(\s*)\{licenceLinks\(city\.variant\)\.map\(link => \(\n\s*<a href=\{link\.href\} style="[^"]*">\{link\.label\} &rarr;</a>\n(\s*)\)\)\}\n\s*</div>',
            lambda m: f'<ul class="pg-related">\n{m.group(1)}{{licenceLinks(city.variant).map(link => (\n{m.group(1)}  <li><a href={{link.href}}>{{link.label}}{CHEV}</a></li>\n{m.group(2)}))}}\n{m.group(2)[:-2]}</ul>')
    # Kennzahlen-Karten der Prüfung (DE)
    s = sub(s, r'<div style="font-size:22px; font-weight:900; color:#1A1F36;">(.*?)</div>', r'<p class="pg-kpi">\1</p>', flags=re.S)
    s = sub(s, r'<div style="font-size:22px; font-weight:900; color:#3366FF;">(.*?)</div>', r'<p class="pg-kpi pg-kpi--accent">\1</p>', flags=re.S)
    s = sub(s, r'<div style="font-size:14px; color:#656B78; line-height:1\.55; margin-top:4px;">(.*?)</div>', r'<p class="pg-card-text">\1</p>', flags=re.S)
    # Zeilenliste der Theorie (DE)
    s = s.replace('<div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">', '<div class="pg-rows">')
    s = sub(s, r'<div style="display:flex; align-items:flex-start; gap:16px; background:white; border:1px solid rgba\(51,102,255,0\.1\); border-radius:16px; padding:20px;">', '<div class="pg-row">')
    s = sub(s, r'<span style="width:40px; height:40px; border-radius:11px; background:rgba\(51,102,255,0\.08\); display:flex; align-items:center; justify-content:center; flex-shrink:0;">', '<span class="pg-row-icon">')
    s = sub(s, r'(<span class="pg-row-icon">\n\s*<Icon name=\{f\.icon\}[^\n]*\n\s*</span>\n\s*)<div>\n', r'\1<div class="pg-row-body">\n')
    s = sub(s, r'<div class="pg-row-title">([^<]*)</div>', r'<p class="pg-row-title">\1</p>')
    s = sub(s, r'<div class="pg-card-text">([^<]*)</div>', r'<p class="pg-card-text">\1</p>')
    # Store-Button im Inhalt → kompakter Button (der Kopf trägt den Haupt-Button)
    s = sub(s, r'<a href=\{playStoreUrl\} target="_blank" rel="noopener noreferrer"\n\s*style="[^"]*">\n\s*&#9654;&nbsp;([^\n<]*?)\s*\n\s*</a>',
            lambda m: f'<a href={{playStoreUrl}} target="_blank" rel="noopener noreferrer" class="h-btn h-btn--sm">{m.group(1)}{CHEV_BTN}</a>')
    return s


def run(keys):
    out = subprocess.run([sys.executable, str(HERE / 'pgpage.py'), *keys], capture_output=True, text=True)
    print(out.stdout.strip())
    if out.returncode:
        print(out.stderr)
        sys.exit(1)
    for k in keys:
        path = PAGES[k]
        lang = 'en' if k.startswith('en-') else 'de'
        s = path.read_text()
        s = common(s, lang)
        s = city(s, lang) if 'city' in k or 'stadt' in k else overview(s, lang)
        path.write_text(s)
        left = [l.strip()[:140] for l in s.splitlines() if 'style=' in l and 'ld+json' not in l]
        print(f'{path.name}: {len(left)} Zeilen mit style verbleiben')
        for l in left:
            print('  LEFT:', l)
    css = ROOT / 'src/styles/page.css'
    t = css.read_text()
    if CSS_MARK not in t:
        css.write_text(t.rstrip('\n') + '\n' + CSS)
        print('page.css: Fahrschul-Regeln angehängt')


if __name__ == '__main__':
    run(sys.argv[1:] or list(PAGES))
