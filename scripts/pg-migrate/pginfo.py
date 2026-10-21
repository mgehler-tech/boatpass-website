"""Infoseiten (Impressum, Datenschutz, Nutzungsbedingungen, Über uns, Kontakt) auf den Rahmen
der Runde 3 (Plan 3b): Kopf-Block → PageHead, Hülle → PageLayout variant="narrow", Legal-Karten
und Texte → pg-Klassen. Zwei Modi: Inline-Werte (Impressum) und Stil-Konstanten
(`style={card}` in Datenschutz/Nutzungsbedingungen; die const-Zeilen entfallen). Die Regeln
liegen in src/styles/page.css (werden hier einmalig angehängt).

Aufruf (Repo-Wurzel): python3 scripts/pg-migrate/pginfo.py impressum en-legal
"""
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]

PAGES = {
    'impressum': dict(file='src/pages/impressum.astro', lang='de'),
    'en-legal': dict(file='src/pages/en/legal.astro', lang='en'),
    'datenschutz': dict(file='src/pages/datenschutz.astro', lang='de', consts=True),
    'en-privacy': dict(file='src/pages/en/privacy.astro', lang='en', consts=True),
    'nutzungsbedingungen': dict(file='src/pages/nutzungsbedingungen.astro', lang='de', consts=True),
    'en-terms': dict(file='src/pages/en/terms.astro', lang='en', consts=True),
    'ueber-uns': dict(file='src/pages/ueber-uns.astro', lang='de', about=True, cta=True),
    'en-about': dict(file='src/pages/en/about.astro', lang='en', about=True, cta=True),
    'kontakt': dict(file='src/pages/kontakt.astro', lang='de', contact=True),
    'en-contact': dict(file='src/pages/en/contact.astro', lang='en', contact=True),
    'faq': dict(file='src/pages/faq.astro', lang='de', faq=True, eyebrow='FAQ'),
    'en-faq': dict(file='src/pages/en/faq.astro', lang='en', faq=True, eyebrow='FAQ'),
}

# FAQ: Tailwind-Kopf → PageHead, Kategorie-Pillen → pg-chips, details → pg-faq-item mit Chevron (Spec 3.4)
FAQ = [
    (r'<nav aria-label="([^"]*)" class="flex flex-wrap gap-2 mb-12">', r'<nav aria-label="\1" class="pg-chips">'),
    (r'(<a\n\s*href=\{`#\$\{cat\.id\}`\}\n\s*)class="inline-flex [^"]*"', r'\1class="pg-chip"'),
    (r'<section id=\{cat\.id\} class="scroll-mt-24">', '<section id={cat.id} class="pg-section">'),
    (r'<h2 class="content-section-title mb-5">', '<h2 class="pg-h2">'),
    (r'<div class="space-y-4">', '<div class="pg-faq">'),
    (r'<details class="faq-item [^"]*">', '<details class="pg-faq-item">'),
    (r'<summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-text list-none">', '<summary class="pg-faq-q">'),
    (r'<h3 class="font-semibold text-base m-0">', '<h3>'),
    (r'<span class="text-primary ml-4 transition-transform group-open:rotate-180">▼</span>', '<Icon name="chevronRight" size={18} strokeWidth={2} />'),
    (r'<div class="faq-answer px-6 pb-6 text-gray-600 leading-relaxed" set:html=', '<div class="pg-faq-a pg-card-text" set:html='),
    # Links in den Antwort-Strings (Spec 3.4: Klassen direkt in den Daten)
    (r' style="color:#3366FF;[^"]*"', ' class="pg-inline-link"'),
]

# Kontakt: Status-Boxen (display bleibt am Skript), Selbsthilfe-Abschnitt; Formular und sein Skript unangetastet
CONTACT = [
    (r'(<div id="success-msg"[^>]*?) style="display:none; [^"]*"', r'\1 class="pg-notice pg-notice--ok" style="display:none;"'),
    (r'(<div id="error-msg"[^>]*?) style="display:none; [^"]*"', r'\1 class="pg-notice pg-notice--error" style="display:none;"'),
    (r'<section style="margin-top:56px;">', '<section class="pg-section">'),
    (r'<h2 style="font-size:22px; font-weight:900; letter-spacing:-0\.02em; color:#1A1F36; margin-bottom:8px;">', '<h2 class="pg-h2">'),
    (r'<p style="font-size:15px; color:#656B78; margin-bottom:24px;">', '<p class="pg-p">'),
    (r'<div style="display:grid; gap:16px;">', '<div class="pg-faq">'),
    (r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.12\); border-radius:12px; padding:20px 24px;">', '<div class="pg-faq-item">'),
    (r'<h3 style="font-size:16px; font-weight:800; color:#1A1F36; margin-bottom:6px;">', '<h3 class="pg-h3">'),
    (r'<p style="font-size:15px; line-height:1\.6; color:#4B5563; margin:0;">', '<p class="pg-card-text">'),
]

ICON = '<Icon name="chevronRight" size={16} strokeWidth={2.25} />'

# Inline-Werte der Impressum-Seiten → Klassen (Spec Runde 3, 3.4 „Legal-Karten")
INLINE = [
    (r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.1\); border-radius:20px; padding:32px;(?: margin-bottom:16px;)?">', '<div class="pg-card pg-card--legal">'),
    (r'<h2 style="font-size:13px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">', '<h2 class="pg-card-label">'),
    (r'<p style="font-size:1[56]px; font-weight:700; color:#1A1F36; margin-bottom:4px;">', '<p class="pg-p pg-p--sm pg-strong">'),
    (r'<p style="font-size:15px; color:#4B5563; line-height:1\.7;(?: margin-(?:top|bottom):\d+px;)?">', '<p class="pg-p pg-p--sm">'),
    (r' style="font-size:15px; color:#3366FF; text-decoration:none; font-weight:500;"', ' class="pg-inline-link"'),
    (r' style="color:#3366FF; text-decoration:none; font-weight:[56]00;"', ' class="pg-inline-link"'),
    (r' style="color:#3366FF; text-decoration:underline;"', ' class="pg-inline-link"'),
    (r'<strong style="color:#1A1F36;">', '<strong>'),
    (r'<h2 class="content-section-title" style="margin-bottom:16px;">', '<h2 class="pg-h2 pg-h2--sm">'),
]

# Über uns: Porträt-Karte, Bild in der Karte, Schlagwörter, Versprechen-Liste (Spec 3.4)
ABOUT = [
    (r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.1\); border-radius:20px; overflow:hidden; margin-bottom:16px;">', '<div class="pg-card pg-card--legal pg-portrait">'),
    (r'\n(\s*)style="display:block; width:100%; height:380px; object-fit:cover; object-position:center 22%;"\n', '\n'),
    (r'<div style="padding:32px;">', '<div class="pg-portrait-body">'),
    (r'<div style="font-size:20px; font-weight:800; color:#1A1F36; margin-bottom:4px;">([^<]*)</div>', r'<p class="pg-card-title pg-card-title--lg">\1</p>'),
    (r'<div style="font-size:13px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">([^<]*)</div>', r'<p class="pg-card-label">\1</p>'),
    (r'<p style="font-size:16px; color:#4B5563; line-height:1\.7; margin:0;">', '<p class="pg-p">'),
    (r'<div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:20px;">', '<div class="pg-pills">'),
    (r'<span style="font-size:12px; font-weight:700; background:rgba\(51,102,255,0\.08\); color:#3366FF; border:1px solid rgba\(51,102,255,0\.15\); padding:3px 10px; border-radius:100px;">', '<span class="pg-pill">'),
    (r'\n(\s*)style="display:block; width:100%; height:240px; object-fit:cover; object-position:center 35%; border-radius:12px; margin-bottom:20px;"\n', r'\n\1class="pg-card-img"\n'),
    (r'<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px;">', '<ul class="pg-checks">'),
    (r'<li style="display:flex; align-items:flex-start; gap:12px; font-size:15px; color:#4B5563; line-height:1\.6;">', '<li class="pg-check">'),
    (r'<span style="color:#3366FF; font-weight:700; flex-shrink:0;">✓</span>', '<span class="pg-check-mark">✓</span>'),
]

# Stil-Konstanten der Rechtstexte → Klassen (Konstante, nicht Attributwert)
CONSTS = [
    (r'<div style=\{card\}>', '<div class="pg-card pg-card--legal">'),
    (r'<div style=\{num\}>([^<]*)</div>', r'<p class="pg-card-label pg-card-label--muted">\1</p>'),
    (r'<h2 style=\{h2\}>', '<h2 class="pg-h2 pg-h2--sm">'),
    (r'<p style=\{(?:p|pNext|pGap)\}>', '<p class="pg-p pg-p--sm">'),
    (r'<p style=\{`\$\{p\} margin-bottom:16px;`\}>', '<p class="pg-p pg-p--sm">'),
    (r'<strong style=\{strong\}>', '<strong>'),
    (r' style=\{link\}', ' class="pg-inline-link"'),
    (r'<div style=\{meta\}>', '<div class="pg-meta">'),
    (r'<div style=\{divider\}>\n(\s*)<span style=\{dividerLabel\}>([^<]*)</span>\n\s*<div style=\{dividerLine\}></div>\n\s*</div>',
     r'<div class="pg-divider"><span class="pg-divider-label">\2</span></div>'),
    (r'<div style="display:flex; flex-direction:column; gap:10px;(?: margin-bottom:16px;)?">', '<div class="pg-kvs">'),
    (r'<div style=\{row\}>', '<div class="pg-kv">'),
    (r'<span style=\{rowName\}', '<span class="pg-kv-k"'),
    (r'<span style=\{rowText\}', '<span class="pg-kv-v"'),
    # Aufzählungen mit Punkt bzw. Haken (Textzeichen bleiben, Spec 3.4)
    (r'<div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">', '<div class="pg-bullets">'),
    (r'<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">', '<div class="pg-bullets pg-bullets--before">'),
    (r'<div style="display:flex; align-items:(?:flex-start|center); gap:10px;">', '<div class="pg-bullet">'),
    (r'<span style="color:#3366FF; font-size:14px; flex-shrink:0;(?: margin-top:2px;)?">', '<span class="pg-bullet-mark">'),
    (r'<span style="font-size:14px; color:#4B5563;">', '<span class="pg-bullet-text">'),
    # Kleingedrucktes
    (r'<p style="font-size:14px; color:#656B78; line-height:1\.7; margin-top:16px;">', '<p class="pg-note pg-note--after">'),
    (r'<p style="font-size:14px; color:#656B78;(?: line-height:1\.7;| margin-bottom:8px;)?">', '<p class="pg-note">'),
]
CONST_NAMES = 'card|num|h2|p|pNext|pGap|strong|link|meta|divider|dividerLabel|dividerLine|row|rowName|rowText'

HEADER = re.compile(
    r'    <!-- Header -->\n    <div style="margin-bottom:48px;">\n'
    r'      <div style="[^"]*">\n\s*(?P<eyebrow>.*?)\n\s*</div>\n'
    r'      <h1 style="[^"]*">(?P<h1>.*?)</h1>\n'
    r'      <p style="[^"]*">(?P<lede>.*?)</p>\n'
    r'    </div>\n\n?', re.S)
WRAPPER_RE = re.compile(r'  <div style="max-width:(?:720|600)px; margin:0 auto; padding:80px 24px 120px;">\n')

# (Modus, Marker, Regeln): der Block kommt erst mit der ersten Seite seines Modus nach page.css.
CSS_BLOCKS = [
    (None, '/* ── Infoseiten (Runde 3b)', """
/* ── Infoseiten (Runde 3b): Legal-Karten, Meta, Trenner, Schlüssel-Wert, Hinweise, Chips, Akkordeon, Porträt ── */
.pg-card--legal { padding: 28px; }
.pg-main > .pg-card--legal + .pg-card--legal { margin-top: 16px; }
.pg-card--legal .pg-card-label { margin-bottom: 14px; }
.pg-card-label--muted { color: var(--h-muted); }
.pg-p--sm { font-size: 15px; line-height: 1.65; }
.pg-strong { margin-bottom: 4px; font-weight: 700; color: var(--h-ink); }
.pg-meta { padding: 14px 16px; border-radius: var(--h-r-sm); background: var(--h-blue-wash); font-size: 13px; line-height: 1.6; color: var(--h-text); }
.pg-divider { display: flex; align-items: center; gap: 12px; margin: 8px 0 16px; }
.pg-divider::after { content: ""; flex: 1; height: 1px; background: var(--h-line); }
.pg-divider-label { font: 600 12px/1.4 var(--h-sans); letter-spacing: 0.08em; text-transform: uppercase; color: var(--h-muted); white-space: nowrap; }
.pg-kv { display: grid; grid-template-columns: minmax(120px, 170px) 1fr; gap: 4px 16px; padding: 10px 0; border-top: 1px solid var(--h-line); }
.pg-kv:last-child { border-bottom: 1px solid var(--h-line); }
.pg-kv-k { margin: 0; font: 650 14px/1.5 var(--h-sans); color: var(--h-ink); }
.pg-kv-v { margin: 0; font-size: 14px; line-height: 1.6; color: var(--h-text); }
@media (max-width: 479px) { .pg-kv { grid-template-columns: 1fr; } }
.pg-notice { padding: 14px 16px; border-radius: var(--h-r-sm); font-size: 15px; line-height: 1.55; }
.pg-notice--ok { background: var(--h-stbd-wash); color: var(--h-stbd-ink); }
.pg-notice--error { background: var(--h-port-wash); color: var(--h-port-ink); }
.pg-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pg-chip {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--h-line-2);
  border-radius: var(--h-r-pill);
  background: var(--h-card);
  font: 600 14px/1 var(--h-sans);
  color: var(--h-text);
  text-decoration: none;
  transition: border-color 0.15s var(--h-ease), color 0.15s var(--h-ease);
}
.pg-chip:hover { border-color: var(--h-blue); color: var(--h-blue-ink); }
details.pg-faq-item { padding: 0; }
.pg-faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  cursor: pointer;
  list-style: none;
  font: 650 16px/1.4 var(--h-sans);
  color: var(--h-ink);
}
.pg-faq-q::-webkit-details-marker { display: none; }
.pg-faq-q svg { flex-shrink: 0; color: var(--h-blue-ink); transition: transform 0.25s var(--h-ease); }
details[open] > .pg-faq-q svg { transform: rotate(90deg); }
.pg-faq-a { padding: 0 22px 20px; }
.pg-portrait { padding: 0; overflow: hidden; }
.pg-portrait img { display: block; width: 100%; height: 380px; object-fit: cover; }
.pg-portrait-body { padding: 20px 24px; }
@media (prefers-reduced-motion: reduce) { .pg-faq-q svg, .pg-chip { transition: none; } }
"""),
    ('consts', '/* ── Rechtstexte (Runde 3b, Task 2)', """
/* ── Rechtstexte (Runde 3b, Task 2): Meta-Box, Schlüssel-Wert-Listen, Aufzählungen, Trenner in der Spalte ── */
.pg-meta { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
.pg-main > .pg-card--legal + .pg-divider { margin-top: 32px; }
.pg-main > .pg-divider + .pg-card--legal { margin-top: 0; }
.pg-kvs { display: flex; flex-direction: column; }
.pg-bullets { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.pg-bullets--before { margin: 0 0 20px; }
.pg-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.6; color: var(--h-text); }
.pg-bullet-mark { flex-shrink: 0; color: var(--h-blue-ink); }
.pg-note + .pg-note { margin-top: 8px; }
.pg-card--legal .pg-note { font-size: 14px; }
"""),
    ('about', '/* ── Über uns (Runde 3b, Task 3)', """
/* ── Über uns (Runde 3b, Task 3): Porträt, Bild in der Karte, Schlagwörter, Versprechen ── */
.pg-portrait img { object-position: center 22%; }
.pg-card-title--lg { font-size: 20px; margin-bottom: 4px; }
.pg-card-img { display: block; width: 100%; height: 240px; margin-bottom: 20px; border-radius: var(--h-r-sm); object-fit: cover; object-position: center 35%; }
.pg-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.pg-checks { display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 0; list-style: none; }
.pg-check { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; line-height: 1.6; color: var(--h-text); }
.pg-check-mark { flex-shrink: 0; font-weight: 700; color: var(--h-blue-ink); }
"""),
    ('contact', '/* ── Kontakt (Runde 3b, Task 4)', """
/* ── Kontakt (Runde 3b, Task 4): Status-Boxen vor dem Formular ohne Spaltenabstand ── */
.pg-main > .pg-notice + .pg-notice, .pg-main > .pg-notice + form { margin-top: 0; }
.pg-notice--error { margin-bottom: 16px; }
"""),
    ('faq', '/* ── FAQ (Runde 3b, Task 5)', """
/* ── FAQ (Runde 3b, Task 5): Sprungmarken, Frage als Überschrift im Akkordeon, Antwort-Inhalte ── */
.pg-section[id] { scroll-margin-top: 96px; }
.pg-faq-q > h3 { margin: 0; font: inherit; color: inherit; }
.pg-faq-a p + p, .pg-faq-a ul, .pg-faq-a ol { margin-top: 10px; }
.pg-faq-a a { color: var(--h-blue-ink); text-decoration: underline; text-underline-offset: 3px; }
"""),
]


def migrate_faq(s, cfg, prefix, base_import):
    """FAQ-Seiten tragen einen Tailwind-Kopf statt des Header-Blocks; Hülle, Kopf und Abschnittsliste eigens."""
    m = re.search(r'  <div class="max-w-3xl mx-auto px-4 pt-24 pb-16">\n'
                  r'    <h1 class="section-display-title mb-4">(?P<h1>.*?)</h1>\n'
                  r'    <p class="faq-subtitle[^"]*">(?P<lede>.*?)</p>\n\n?', s, re.S)
    if m:
        head = f"""  <!-- Seitenkopf und schmale Spalte (Spec Runde 3, 3.1/3.5) -->
  <PageHead
    lang="{cfg['lang']}"
    eyebrow="{cfg['eyebrow']}"
    lede="{text_only(m.group('lede'))}"
  >
    {m.group('h1').strip()}
  </PageHead>

  <PageLayout variant="narrow">
"""
        s = s[:m.start()] + head + s[m.end():]
        # Abschnitte direkt in die Spalte (Abstand aus .pg-main > * + *), Hülle und Stapel-Div schließen
        s, n = re.subn(r'    <div class="space-y-12">\n(\s*\{categories\.map)', r'\1', s, count=1)
        assert n == 1, 'faq stack'
        s, n = re.subn(r'\n      \)\)\}\n    </div>\n  </div>\n</BaseLayout>', '\n    ))}\n  </PageLayout>\n</BaseLayout>', s, count=1)
        assert n == 1, 'faq close'
        s, n = re.subn(r'\n<style is:global>\n.*?\n</style>\n', '\n', s, count=1, flags=re.S)
        assert n == 1, 'faq style'
        extra = f"import DisplayFontPreload from '{prefix}components/page/DisplayFontPreload.astro';\n"
        extra += ''.join(f"import {n} from '{prefix}components/page/{n}.astro';\n" for n in ['PageHead', 'PageLayout'])
        extra += f"import Icon from '{prefix}components/Icon.astro';\n"
        s = s.replace(base_import, base_import + extra, 1)
        m2 = re.search(r'<BaseLayout\b[^>]*>\n', s)
        s = s[:m2.end()] + '  <DisplayFontPreload slot="head" />\n' + s[m2.end():]
    for pat, repl in FAQ:
        s = re.sub(pat, repl, s)
    return s


def text_only(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html)).strip().replace('"', '&quot;')


def migrate(key):
    cfg = PAGES[key]
    path = ROOT / cfg['file']
    s = path.read_text()
    prefix = '../../' if cfg['lang'] == 'en' else '../'
    base_import = f"import BaseLayout from '{prefix}layouts/BaseLayout.astro';\n"
    assert base_import in s, 'base import'

    if WRAPPER_RE.search(s):
        m = HEADER.search(s)
        assert m, 'header block'
        eyebrow = cfg.get('eyebrow') or m.group('eyebrow').strip()
        h1 = cfg.get('h1') or m.group('h1').strip()
        lede = cfg.get('lede') or text_only(m.group('lede'))
        cta = '\n    cta' if cfg.get('cta') else ''
        head = f"""  <!-- Seitenkopf und schmale Spalte (Spec Runde 3, 3.1/3.5) -->
  <PageHead
    lang="{cfg['lang']}"
    eyebrow="{eyebrow}"
    lede="{lede}"{cta}
  >
    {h1}
  </PageHead>

  <PageLayout variant="narrow">
"""
        s = s[:m.start()] + s[m.end():]
        s, n = WRAPPER_RE.subn(lambda _: head, s, count=1)
        assert n == 1, 'wrapper'
        s, n = re.subn(r"\n  </div>\n\n?</BaseLayout>", "\n  </PageLayout>\n</BaseLayout>", s, count=1)
        assert n == 1, 'close'
        extra = f"import DisplayFontPreload from '{prefix}components/page/DisplayFontPreload.astro';\n"
        extra += ''.join(f"import {n} from '{prefix}components/page/{n}.astro';\n" for n in ['PageHead', 'PageLayout'])
        s = s.replace(base_import, base_import + extra, 1)
        m2 = re.search(r'<BaseLayout\b[^>]*>\n', s)
        assert m2, 'BaseLayout tag'
        s = s[:m2.end()] + '  <DisplayFontPreload slot="head" />\n' + s[m2.end():]

    if cfg.get('consts'):
        for pat, repl in CONSTS:
            s = re.sub(pat, repl, s)
        # Externer Link mit Pfeil (Datenschutz: Plausible) → PageLink external
        s = re.sub(r'<a href="([^"]+)" target="_blank" rel="noopener noreferrer"\n\s*style="display:inline-flex;[^"]*">\n\s*([^<\n]*?)\s*→\n\s*</a>',
                   lambda m: f'<PageLink lang="{cfg["lang"]}" href="{m.group(1)}" external class="pg-link--spaced">{m.group(2)}</PageLink>', s)
        if '<PageLink' in s and 'PageLink.astro' not in s:
            s = s.replace(base_import, base_import + f"import PageLink from '{prefix}components/page/PageLink.astro';\n", 1)
        # Stil-Konstanten samt Kommentar entfernen
        s = re.sub(rf'^const (?:{CONST_NAMES}) = .*;\n', '', s, flags=re.M)
        s = re.sub(r'^// Wiederkehrende Stile[^\n]*\n', '', s, flags=re.M)
        s = re.sub(r'^// (?:Recurring|Shared) styles[^\n]*\n', '', s, flags=re.M)
        s = re.sub(r"(import [^\n]*;\n)\n+---", r'\1---', s, count=1)
    if cfg.get('about'):
        for pat, repl in ABOUT:
            s = re.sub(pat, repl, s)
    if cfg.get('contact'):
        for pat, repl in CONTACT:
            s = re.sub(pat, repl, s)
    if cfg.get('faq'):
        s = migrate_faq(s, cfg, prefix, base_import)
    for pat, repl in INLINE:
        s = re.sub(pat, repl, s)
    path.write_text(s)
    left = [l.strip()[:140] for l in s.splitlines() if 'style=' in l]
    print(f'{path.name}: {len(left)} Zeilen mit style verbleiben')
    for l in left:
        print('  LEFT:', l)


def ensure_css(modes):
    css = ROOT / 'src/styles/page.css'
    t = css.read_text()
    for mode, mark, block in CSS_BLOCKS:
        if (mode is None or mode in modes) and mark not in t:
            t = t.rstrip('\n') + '\n' + block
            print(f'page.css: Block „{mark[6:]}“ angehängt')
    css.write_text(t)


if __name__ == '__main__':
    keys = sys.argv[1:] or list(PAGES)
    for key in keys:
        migrate(key)
    ensure_css({m for k in keys for m in ('consts', 'about', 'contact', 'faq') if PAGES[k].get(m)})
