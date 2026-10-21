"""Schein-Finder (DE/EN) light-touch nach Spec Runde 3, 3.6.

Erst die Struktur (pgpage.py: PageHead, PageLayout narrow, Konverter), dann im
Inline-Skript nur Strings und Klassen: Pfeilzeichen → Inline-SVG-Chevron, Emoji und
Dreieck weg, Ergebniskarten auf .res-*-Klassen, Verlaufs-Button → h-btn; im
is:global-Style Festfarben → Tokens, Dark-Regeln entfallen. Logik, IDs und
.cfg-*-Hooks bleiben unangetastet.

Aufruf (Repo-Wurzel): python3 scripts/pg-migrate/pgfinder.py
"""
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PAGES = {
    'tools-finder': ROOT / 'src/pages/tools/welcher-bootsfuehrerschein.astro',
    'en-tools-finder': ROOT / 'src/pages/en/tools/which-boating-license.astro',
}

CHEV_PATH = 'm8.25 4.5 7.5 7.5-7.5 7.5'
CHEV_SVG = ('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + CHEV_PATH + '"/></svg>')
BULB_PATH = ('M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0'
             'm3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18')
BULB_SVG = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + BULB_PATH + '"/></svg>')

SCRIPT_REPS = [
    ("'</span><span class=\"cfg-opt-arrow\" aria-hidden=\"true\">→</span>'",
     "'</span><span class=\"cfg-opt-arrow\" aria-hidden=\"true\">' + CHEV + '</span>'"),
    # Der Konverter macht aus der Ergebnisliste im Skript bereits eine pg-faq; hier heißt sie res-list.
    ("html += '<div class=\"pg-faq\">';", "html += '<div class=\"res-list\">';"),
    ("'<div style=\"display:flex; align-items:flex-start; gap:12px;\">'", "'<div class=\"res-head\">'"),
    ("'<div style=\"min-width:0;\"><div style=\"font-size:12px; font-weight:700; color:#656B78; text-transform:uppercase; letter-spacing:0.5px;\">'",
     "'<div class=\"res-main\"><div class=\"res-cat\">'"),
    ("'<div style=\"font-size:20px; font-weight:900; color:#1A1F36; letter-spacing:-0.5px;\">'", "'<div class=\"res-name\">'"),
    ("'<div style=\"margin-left:auto; flex:0 0 auto;\">'", "'<div class=\"res-aside\">'"),
    ("'<div style=\"font-size:14px; color:#656B78; line-height:1.6; margin-top:8px;\">'", "'<div class=\"res-sub\">'"),
    ("'<span class=\"res-bundle-icon\" aria-hidden=\"true\">💡</span>'", "'<span class=\"res-bundle-icon\" aria-hidden=\"true\">' + BULB + '</span>'"),
    ("'<div style=\"margin-top:22px; display:flex; flex-wrap:wrap; gap:12px;\">'", "'<div class=\"res-actions\">'"),
    (" style=\"border:1.5px solid rgba(51,102,255,0.2); color:#3366FF; font-weight:700; font-size:15px; padding:14px 24px; border-radius:14px; cursor:pointer;\"", ""),
    ("'<p style=\"font-size:12.5px; color:#656B78; line-height:1.6; margin-top:14px;\">", "'<p class=\"res-note\">"),
]

STYLE_REPS = [
    # Längere Muster zuerst, damit die kürzeren (color:#1A1F36) sie nicht vorher zerlegen.
    (' border-left:4px solid #3366FF;', ''),
    ('border-left-color:#1A1F36;', 'border-color:var(--h-line-2);'),
    ('background:#fff', 'background:var(--h-card)'),
    ('color:#1A1F36', 'color:var(--h-ink)'),
    ('color:#656B78', 'color:var(--h-muted)'),
    ('color:#3366FF', 'color:var(--h-blue-ink)'),
    ('color:#fff', 'color:#fff'),  # Weiß auf Blau bleibt (Pfeilkreis im Hover)
    ('border-color:#3366FF', 'border-color:var(--h-blue)'),
    ('background:#3366FF', 'background:var(--h-blue)'),
    ('background:linear-gradient(90deg,#3366FF,#5B8CFF)', 'background:var(--h-blue)'),
    ('border:1px solid rgba(51,102,255,0.12);', 'border:1px solid var(--h-line);'),      # .cfg-card
    ('border:1.5px solid rgba(51,102,255,0.14);', 'border:1.5px solid var(--h-line);'),  # .cfg-opt
    # Reihenfolge: erst die Bundle-Box (Hintergrund + Rahmen), dann der einzelne Rahmen der Karte.
    ('background:rgba(51,102,255,0.06); border:1px solid rgba(51,102,255,0.16);', 'background:var(--h-blue-wash);'),
    ('border:1px solid rgba(51,102,255,0.16);', 'border:1px solid var(--h-line);'),
    ('background:rgba(26,31,54,0.05);', 'background:var(--h-paper-2); border:1px solid var(--h-line);'),
    ('.cfg-restart-btn { background: white; }',
     '.cfg-restart-btn { display:inline-flex; align-items:center; min-height:40px; padding:0 16px; background:var(--h-card); border:1.5px solid var(--h-line-2); '
     'color:var(--h-blue-ink); font-weight:700; font-size:14px; border-radius:var(--h-r-pill); cursor:pointer; }\n'
     '    .cfg-restart-btn:hover { border-color:var(--h-blue); }'),
]

# Entscheidungstabelle: Astro-Ausdruck in der Zeile, erste Zelle fett → Zeilenkopf
TABLE_REPS = [
    ("<tr style={`border-top:1px solid rgba(51,102,255,0.08);${i % 2 ? ' background:rgba(26,31,54,0.02);' : ''}`}>", '<tr>'),
]

NEW_STYLE = """
    /* Ergebnis und Pfeile auf Tokens (Runde 3, 3.6); Logik unverändert. */
    .res-eyebrow { margin:0 0 12px; }
    .res-list { display:flex; flex-direction:column; gap:14px; }
    .res-head { display:flex; align-items:flex-start; gap:12px; }
    .res-main { min-width:0; }
    .res-cat { font-size:12px; font-weight:700; color:var(--h-muted); text-transform:uppercase; letter-spacing:.5px; }
    .res-name { font-family:var(--h-display); font-stretch:84%; font-weight:720; font-size:22px; letter-spacing:-.01em; color:var(--h-ink); }
    .res-aside { margin-left:auto; flex:0 0 auto; }
    .res-sub { font-size:14px; color:var(--h-muted); line-height:1.6; margin-top:8px; }
    .res-learn { display:inline-flex; align-items:center; gap:6px; }
    .res-learn svg, .cfg-opt-arrow svg, .cfg-back-arrow svg { display:block; }
    .cfg-back-arrow svg { transform:rotate(180deg); }
    .res-bundle-icon { display:flex; color:var(--h-blue-ink); }
    .res-actions { margin-top:22px; display:flex; flex-wrap:wrap; align-items:center; gap:12px; }
    .res-note { font-size:12.5px; color:var(--h-muted); line-height:1.6; margin-top:14px; }
"""


def light_touch(path: pathlib.Path):
    s = path.read_text()
    # Statischer Zurück-Pfeil
    s, n = re.subn(r'<span class="cfg-back-arrow">←</span>', '<span class="cfg-back-arrow" aria-hidden="true">' + CHEV_SVG + '</span>', s)
    assert n == 1, 'back arrow'
    # Tabelle: Zeilen ohne Inline-Stil, erste Zelle als Zeilenkopf
    for old, new in TABLE_REPS:  # der Konverter kennt den Astro-Ausdruck inzwischen selbst
        s = s.replace(old, new)
    # Abschnitte mit margin-top (der Konverter kennt nur margin-bottom)
    s = re.sub(r'<section style="margin-top:\d+px;">', '<section class="pg-section">', s)
    s = re.sub(r'<section style="margin-top:\d+px; padding-top:32px; border-top:1px solid rgba\(51,102,255,0\.08\);">', '<section class="pg-section pg-section--related">', s)
    s, n = re.subn(r'<td style="padding:13px 16px; font-weight:600; color:#1A1F36;">(\{row\.\w+\})</td>', r'<th scope="row">\1</th>', s)
    assert n == 1, 'row head'
    s = s.replace('<td style="padding:13px 16px; color:#4B5563;">', '<td>')
    # Ergebnis-Container: Abstand kommt aus der Spalte, display bleibt am Skript
    s = s.replace('<div id="cfg-result" style="display:none; margin-top:24px;" tabindex="-1">', '<div id="cfg-result" style="display:none;" tabindex="-1">')
    # Skript: Konstanten direkt nach dem öffnenden Tag des Konfigurator-Skripts
    m = re.search(r'\n  <script is:inline define:vars=\{\{[^}]*\}\}>\n', s)
    assert m, 'script tag'
    consts = ("    // Inline-SVG statt Pfeil-/Emoji-Zeichen (Spec Runde 3, 3.6); Pfade wie in src/icons.ts.\n"
              "    var CHEV = '" + CHEV_SVG + "';\n"
              "    var CHEV_BTN = CHEV.replace('<svg ', '<svg class=\"h-btn-arrow\" ');\n"
              "    var BULB = '" + BULB_SVG + "';\n")
    s = s[:m.end()] + consts + s[m.end():]
    for old, new in SCRIPT_REPS:
        assert old in s, ('script', old[:50])
        s = s.replace(old, new)
    s, n = re.subn(r"'<div style=\"font-size:13px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;\">([^<']*)</div>'",
                   "'<p class=\"pg-eyebrow res-eyebrow\">\\1</p>'", s)
    assert n == 1, 'result eyebrow'
    s, n = re.subn(r"'<span class=\"res-learn\">([^<']*?)\s*→</span>'", "'<span class=\"res-learn\">\\1' + CHEV + '</span>'", s)
    assert n == 1, 'learn link'
    s, n = re.subn(r" style=\"display:inline-flex; align-items:center; gap:8px; background:linear-gradient\(135deg,#1A1F36,#3366FF\); color:white; font-weight:700; font-size:15px; padding:14px 26px; border-radius:14px; text-decoration:none;\">▶&nbsp;([^<']*)</a>'",
                   " class=\"h-btn h-btn--sm\">\\1' + CHEV_BTN + '</a>'", s)
    assert n == 1, 'store button'
    # Style-Block: Tokens, Dark-Regeln raus, neue Regeln rein
    a = s.index('<style is:global>')
    b = s.index('</style>', a)
    style = s[a:b]
    for old, new in STYLE_REPS:
        style = style.replace(old, new)
    style = re.sub(r'\n[^\n]*html\.dark[^{]*\{[^}]*\}', '', style)
    style = re.sub(r'\n\s*/\*[^*]*(?:Dark Mode|Broad catch)[^*]*\*/', '', style)
    style = re.sub(r'\n{3,}', '\n\n', style)
    style = style.rstrip() + '\n' + NEW_STYLE + '  '
    s = s[:a] + style + s[b:]
    path.write_text(s)
    left = [l.strip()[:120] for l in s.splitlines()
            if re.search(r'#1A1F36|#3366FF|#656B78|#fff\b|(?:background|color):\s*white|[→▶▼←💡]', l) and 'ld+json' not in l and 'color:#fff' not in l]
    print(f'{path.name}: light-touch ok; verbleibende Treffer (Farben/Zeichen): {len(left)}')
    for l in left[:12]:
        print('  LEFT:', l)


if __name__ == '__main__':
    keys = sys.argv[1:] or list(PAGES)
    out = subprocess.run([sys.executable, str(HERE / 'pgpage.py'), *keys], capture_output=True, text=True)
    print(out.stdout.strip())
    if out.returncode:
        print(out.stderr)
        sys.exit(1)
    for k in keys:
        light_touch(PAGES[k])
