"""Infoseiten (Impressum, Datenschutz, Nutzungsbedingungen, Über uns, Kontakt) auf den Rahmen
der Runde 3 (Plan 3b): Kopf-Block → PageHead, Hülle → PageLayout variant="narrow", Legal-Karten
und Texte → pg-Klassen. Zwei Modi: Inline-Werte (Impressum) und Stil-Konstanten
(`style={card}` in Datenschutz/Nutzungsbedingungen, Task 2). Die Regeln liegen in
src/styles/page.css (werden hier einmalig angehängt).

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
}

# Inline-Werte der Impressum-Seiten → Klassen (Spec Runde 3, 3.4 „Legal-Karten")
INLINE = [
    (r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.1\); border-radius:20px; padding:32px;(?: margin-bottom:16px;)?">', '<div class="pg-card pg-card--legal">'),
    (r'<h2 style="font-size:13px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">', '<h2 class="pg-card-label">'),
    (r'<p style="font-size:16px; font-weight:700; color:#1A1F36; margin-bottom:4px;">', '<p class="pg-p pg-p--sm pg-strong">'),
    (r'<p style="font-size:15px; color:#4B5563; line-height:1\.7;(?: margin-top:8px;)?">', '<p class="pg-p pg-p--sm">'),
    (r' style="font-size:15px; color:#3366FF; text-decoration:none; font-weight:500;"', ' class="pg-inline-link"'),
    (r' style="color:#3366FF; text-decoration:none; font-weight:500;"', ' class="pg-inline-link"'),
    (r'<strong style="color:#1A1F36;">', '<strong>'),
]

HEADER = re.compile(
    r'    <!-- Header -->\n    <div style="margin-bottom:48px;">\n'
    r'      <div style="[^"]*">\n\s*(?P<eyebrow>.*?)\n\s*</div>\n'
    r'      <h1 style="[^"]*">(?P<h1>.*?)</h1>\n'
    r'      <p style="[^"]*">(?P<lede>.*?)</p>\n'
    r'    </div>\n\n?', re.S)
WRAPPER = '  <div style="max-width:720px; margin:0 auto; padding:80px 24px 120px;">\n'

CSS_MARK = '/* ── Infoseiten (Runde 3b)'
CSS = """
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
"""


def text_only(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html)).strip().replace('"', '&quot;')


def migrate(key):
    cfg = PAGES[key]
    path = ROOT / cfg['file']
    s = path.read_text()
    prefix = '../../' if cfg['lang'] == 'en' else '../'
    base_import = f"import BaseLayout from '{prefix}layouts/BaseLayout.astro';\n"
    assert base_import in s, 'base import'

    if WRAPPER in s:
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
        assert s.count(WRAPPER) == 1, 'wrapper'
        s = s.replace(WRAPPER, head, 1)
        s, n = re.subn(r"\n  </div>\n\n?</BaseLayout>", "\n  </PageLayout>\n</BaseLayout>", s, count=1)
        assert n == 1, 'close'
        extra = f"import DisplayFontPreload from '{prefix}components/page/DisplayFontPreload.astro';\n"
        extra += ''.join(f"import {n} from '{prefix}components/page/{n}.astro';\n" for n in ['PageHead', 'PageLayout'])
        s = s.replace(base_import, base_import + extra, 1)
        m2 = re.search(r'<BaseLayout\b[^>]*>\n', s)
        assert m2, 'BaseLayout tag'
        s = s[:m2.end()] + '  <DisplayFontPreload slot="head" />\n' + s[m2.end():]

    for pat, repl in INLINE:
        s = re.sub(pat, repl, s)
    path.write_text(s)
    left = [l.strip()[:140] for l in s.splitlines() if 'style=' in l]
    print(f'{path.name}: {len(left)} Zeilen mit style verbleiben')
    for l in left:
        print('  LEFT:', l)


def ensure_css():
    css = ROOT / 'src/styles/page.css'
    t = css.read_text()
    if CSS_MARK not in t:
        css.write_text(t.rstrip('\n') + '\n' + CSS)
        print('page.css: Infoseiten-Regeln angehängt')


if __name__ == '__main__':
    for key in sys.argv[1:] or list(PAGES):
        migrate(key)
    ensure_css()
