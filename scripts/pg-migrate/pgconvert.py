"""Stellt eine Lizenzseite von Inline-Styles auf das pg-Vokabular um (Spec Runde 2, 5.3).

Aufruf: python3 pgconvert.py <datei.astro> <lang>
Druckt am Ende alle verbleibenden style="…"-Zeilen zur Kontrolle.
"""
import re
import sys
import pathlib

path = pathlib.Path(sys.argv[1])
lang = sys.argv[2] if len(sys.argv) > 2 else 'de'
s = path.read_text()
n0 = s.count('style="')

ICON = '<Icon name="chevronRight" size={16} strokeWidth={2.25} />'


def sub(pattern, repl, flags=0, count=0):
    global s
    s, n = re.subn(pattern, repl, s, count=count, flags=flags)
    return n


# Abschnitte und Überschriften
sub(r'<section style="margin-bottom:\d+px;">', '<section class="pg-section">')
sub(r'<section style="margin-top:48px; padding-top:32px; border-top:1px solid rgba\(51,102,255,0\.(?:08|1)\);">', '<section class="pg-section pg-section--related">')
sub(r'<h2 class="content-section-title" style="margin-bottom:\d+px;">', '<h2 class="pg-h2">')
sub(r'<h2 class="content-section-title">', '<h2 class="pg-h2">')
sub(r'<h3 style="font-size:16px; font-weight:700; color:#1A1F36; margin-bottom:16px;">([^<]*)</h3>', r'<h2 class="pg-h2 pg-h2--sm">\1</h2>')
sub(r'<h2 style="font-size:16px; font-weight:700; color:#1A1F36; margin-bottom:16px;">([^<]*)</h2>', r'<h2 class="pg-h2 pg-h2--sm">\1</h2>')

# Weiterführende Links: div.related-links → ul.pg-related
def related(m):
    body = m.group(1)
    body = re.sub(r'<a href="([^"]+)" style="color:#3366FF; text-decoration:none; font-size:15px;">(?:→|&rarr;)\s*(.*?)</a>',
                  lambda a: f'<li><a href="{a.group(1)}">{a.group(2)}{ICON}</a></li>', body)
    return '<ul class="pg-related">' + body + '</ul>'
sub(r'<div class="related-links">(.*?)</div>', related, flags=re.S)

# Antwort-Kasten
sub(r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.18\); border-left:4px solid #3366FF; border-radius:16px; padding:24px 26px;">', '<div class="pg-answer">')
sub(r'<div style="font-size:12px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">([^<]*)</div>', r'<p class="pg-answer-label">\1</p>')
sub(r'<p style="font-size:17px; color:#1A1F36; line-height:1\.7; margin:0; font-weight:600;">', '<p class="pg-answer-text">')

# Fließtext
sub(r'<p style="font-size:16px; color:#4B5563; line-height:1\.75;(?: margin-bottom:\d+px;)?">', '<p class="pg-p">')
sub(r'<p style="font-size:16px; color:#656B78; line-height:1\.6(?:5)?;(?: margin-bottom:\d+px;)?">', '<p class="pg-p">')
sub(r'<p style="font-size:15px; color:#656B78; line-height:1\.7;(?: margin-bottom:\d+px;)?">', '<p class="pg-note">')
sub(r'<p style="font-size:15px; color:#4B5563; line-height:1\.7;(?: margin-bottom:\d+px;)?">', '<p class="pg-note">')
sub(r'<p style="font-size:14px; color:#656B78; line-height:1\.6; margin-top:-8px; margin-bottom:20px;">', '<p class="pg-note pg-note--sm">')
sub(r' style="color:#3366FF; text-decoration:underline;"', ' class="pg-inline-link"')
sub(r' style="color:inherit; text-decoration:underline;"', ' class="pg-card-link"')

# Kennzahlen-Raster (Prüfungsaufbau)
sub(r'<div class="exam-facts-grid"(?: style="margin-bottom:\d+px;")?>', '<div class="pg-cards pg-cards--4">')
sub(r'<div style="font-size:13px; font-weight:700; color:#3366FF; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">(.*?)</div>', r'<p class="pg-card-label">\1</p>')
sub(r'<div style="font-size:15px; color:#4B5563; line-height:1\.6;">(.*?)</div>', r'<p class="pg-card-text">\1</p>')

# Karten-Raster (Ablauf, Kosten, Geltung, Wer braucht es)
sub(r'<div style="display:grid; grid-template-columns:repeat\(auto-fit,minmax\(\d+px,1fr\)\); gap:16px;(?: margin-bottom:\d+px;)?">', '<div class="pg-cards pg-cards--3">')
sub(r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.1[02]?\); border-radius:16px; padding:2\dpx;">', '<div class="pg-card">')
sub(r'<div style="font-weight:700; color:#1A1F36; margin-bottom:6px;">(.*?)</div>', r'<p class="pg-card-title">\1</p>')
sub(r'<div style="font-size:15px; color:#656B78; line-height:1\.65;">(.*?)</div>', r'<p class="pg-card-text">\1</p>')
sub(r'<div style="font-size:22px; font-weight:900; color:#1A1F36;">(.*?)</div>', r'<p class="pg-kpi">\1</p>')
sub(r'<div style="font-size:22px; font-weight:900; color:#3366FF;">(.*?)</div>', r'<p class="pg-kpi pg-kpi--accent">\1</p>')
sub(r'<div style="font-size:14px; color:#656B78; line-height:1\.55; margin-top:4px;">(.*?)</div>', r'<p class="pg-card-text">\1</p>')

# Textlinks mit Pfeil → PageLink
sub(r'<a href="([^"]+)" style="display:inline-flex; align-items:center; gap:8px;( margin-top:18px;)? color:#3366FF; font-weight:700; font-size:15px; text-decoration:none;">(.*?)\s*(?:→|&rarr;)</a>',
    lambda m: f'<PageLink lang="{lang}" href="{m.group(1)}"{" class=\"pg-link--spaced\"" if m.group(2) else ""}>{m.group(3)}</PageLink>')

# Tabelle (Lizenzseiten: Vergleich; Runde 3: Kosten-/Entscheidungstabellen mit Zebra)
sub(r'<div style="overflow-x:auto;">', '<div class="pg-table">')
sub(r'<tr style="border-top:1px solid rgba\(51,102,255,0\.08\);(?: background:rgba\(26,31,54,0\.02\);)?">', '<tr>')
# erste Zelle einer Zeile wird Zeilenkopf
sub(r'(<tr>\s*)<td style="padding:13px 16px; color:#374151;">(.*?)</td>', r'\1<th scope="row">\2</th>')
sub(r'<td style="padding:13px 16px; color:#374151;">', '<td>')
sub(r'<p style="font-size:16px; color:#4B5563; line-height:1\.75; margin-top:\d+px;">', '<p class="pg-p">')
sub(r'<p style="font-size:15px; color:#656B78; line-height:1\.7; margin-top:\d+px;">', '<p class="pg-note pg-note--after">')
sub(r'<p style="font-size:14px; color:#656B78; line-height:1\.6; margin-top:\d+px;">', '<p class="pg-note pg-note--sm pg-note--after">')
# Info-Box mit Icon (Fahrschul-Übersicht)
sub(r'<div style="display:flex; align-items:flex-start; gap:18px; background:white; border:1px solid rgba\(51,102,255,0\.18\); border-left:4px solid #3366FF; border-radius:16px; padding:24px 26px;[^"]*">', '<div class="pg-answer pg-answer--icon">')
sub(r'<table style="[^"]*">', '<table>')
sub(r'<tr style="background:rgba\(26,31,54,0\.04\);">', '<tr>')
sub(r'<th style="[^"]*">', '<th scope="col">')
sub(r'<tr style=\{`[^`]*`\}>', '<tr>')
sub(r'<td style="padding:13px 18px; font-weight:600; color:#1A1F36;">(.*?)</td>', r'<th scope="row">\1</th>')
sub(r'<td style="padding:13px 18px; color:#4B5563;">', '<td>')

# FAQ
sub(r'<div style="display:flex; flex-direction:column; gap:14px;">', '<div class="pg-faq">')
sub(r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.08\); border-radius:16px; padding:22px;">', '<div class="pg-faq-item">')
sub(r'<h3 style="font-size:16px; font-weight:700; color:#1A1F36; margin-bottom:8px;">', '<h3 class="pg-h3">')
sub(r'<div style="font-size:15px; color:#656B78; line-height:1\.7;">(.*?)</div>', r'<p class="pg-card-text">\1</p>')

# Zeilenlisten (Kategorien, So hilft Boatpass)
sub(r'<div style="display:flex; flex-direction:column; gap:1\dpx;">', '<div class="pg-rows">')
sub(r'<div style="display:flex; align-items:center; gap:14px; background:white; border:1px solid rgba\(0,0,0,0\.07\); border-radius:14px; padding:14px 18px;">', '<div class="pg-row">')
sub(r'<div style="display:flex; align-items:flex-start; gap:16px; background:white; border:1px solid rgba\(51,102,255,0\.(?:08|10?|12)\); border-radius:16px; padding:20px;">', '<div class="pg-row">')
sub(r'<span style=\{`width:40px;[^`]*`\}>', '<span class="pg-row-icon">')
sub(r'<span style="width:40px; height:40px; border-radius:1[12]px; background:rgba\(51,102,255,0\.08\); display:flex; align-items:center; justify-content:center; flex-shrink:0;">', '<span class="pg-row-icon">')
sub(r' stroke=\{c\.color\}', '')
sub(r' stroke="#3366FF"', '')
sub(r'<div style="flex:1; min-width:0;">', '<div class="pg-row-body">')
sub(r'<div style="font-size:14px; font-weight:700; color:#1A1F36; line-height:1\.3;">(.*?)</div>', r'<p class="pg-row-title">\1</p>')
sub(r'<div style="font-size:12px; color:#656B78; line-height:1\.4; margin-top:2px;">(.*?)</div>', r'<p class="pg-row-text">\1</p>')
sub(r'<span style="font-size:12px; font-weight:700; color:#656B78; background:rgba\(0,0,0,0\.04\); border:1px solid rgba\(0,0,0,0\.07\); border-radius:100px; padding:3px 10px; flex-shrink:0; white-space:nowrap;">', '<span class="pg-pill">')
sub(r'<div style="font-weight:700; color:#1A1F36; margin-bottom:4px;">(.*?)</div>', r'<p class="pg-row-title">\1</p>')
sub(r'<div style="font-size:15px; color:#656B78; line-height:1\.6;">(.*?)</div>', r'<p class="pg-row-text">\1</p>')
sub(r'<div>(\s*<p class="pg-row-title">)', r'<div class="pg-row-body">\1')

# Funkseiten: Wer-braucht-es-Zeilen
sub(r'<div style="display:flex; align-items:flex-start; gap:14px; background:white; border:1px solid rgba\(51,102,255,0\.1\); border-radius:14px; padding:18px;">', '<div class="pg-row">')
sub(r'<div style="font-weight:700; color:#1A1F36; margin-bottom:3px; font-size:14px;">(.*?)</div>', r'<p class="pg-row-title">\1</p>')
sub(r'<div style="font-size:14px; color:#4B5563; line-height:1\.6;">(.*?)</div>', r'<p class="pg-row-text">\1</p>')
sub(r'<div>(\s*<p class="pg-row-title">)', r'<div class="pg-row-body">\1')

# Funkseiten: Gebührenliste
sub(r'<div style="background:white; border:1px solid rgba\(51,102,255,0\.12\); border-radius:16px; overflow:hidden;">', '<div class="pg-fees">')
sub(r'<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:18px 24px;(?: border-bottom:1px solid rgba\(51,102,255,0\.08\);)?">', '<div class="pg-fee">')
sub(r'<div style="display:flex; justify-content:space-between; align-items:center; gap:16px; padding:20px 24px; background:rgba\(51,102,255,0\.05\);">', '<div class="pg-fee pg-fee--total">')
sub(r'<div style="font-size:15px; font-weight:700; color:#1A1F36; margin-bottom:2px;">(.*?)</div>', r'<p class="pg-fee-label">\1</p>')
sub(r'<div style="font-size:15px; font-weight:800; color:#1A1F36;">(.*?)</div>', r'<p class="pg-fee-label">\1</p>')
sub(r'<div style="font-size:13px; color:#656B78; line-height:1\.5;">(.*?)</div>', r'<p class="pg-fee-desc">\1</p>')
sub(r'<div style="font-size:16px; font-weight:800; color:#1A1F36; white-space:nowrap;">(.*?)</div>', r'<p class="pg-fee-price h-num">\1</p>')
sub(r'<div style="font-size:20px; font-weight:900; color:#3366FF; white-space:nowrap;">(.*?)</div>', r'<p class="pg-fee-price pg-fee-price--accent h-num">\1</p>')
sub(r'<p style="font-size:13px; color:#656B78; line-height:1\.6; margin-top:12px;">', '<p class="pg-note pg-note--sm pg-note--after">')
sub(r'<p style="font-size:14px; color:#656B78; margin-top:12px; line-height:1\.6;">', '<p class="pg-note pg-note--after">')
sub(r'<p style="font-size:15px; color:#4B5563; line-height:1\.7; margin:0;">', '<p class="pg-note">')
sub(r'<section style="padding-top:32px; border-top:1px solid rgba\(51,102,255,0\.1\);">', '<section class="pg-section pg-section--related">')

# Funkseiten: Vergleichskarten
sub(r'<div style="background:white; border:2px solid rgba\(51,102,255,0\.2\); border-radius:16px; padding:24px;">', '<div class="pg-card pg-card--current">')
sub(r'<div style="background:white; border:2px solid rgba\(51,102,255,0\.12\); border-radius:16px; padding:24px;">', '<div class="pg-card">')
sub(r'<div style="font-weight:800; color:#1A1F36; margin-bottom:4px;">(.*?)</div>', r'<p class="pg-card-title">\1</p>')
sub(r'<div style="font-size:13px; color:#3366FF; margin-bottom:12px;">(.*?)</div>', r'<p class="pg-card-sub">\1</p>')
sub(r'<ul style="list-style:none; padding:0; margin:0; font-size:14px; color:#4B5563; line-height:1\.8;">', '<ul class="pg-checklist">')
sub(r' style="color:#3366FF; text-decoration:none;"', ' class="pg-inline-link"')

# Funkseiten: getönte Hinweiskästen (Prüfungsthemen, Seefunkzeugnis-Hinweis)
sub(r'<div style="background:rgba\(51,102,255,0\.05\); border:1px solid rgba\(51,102,255,0\.15\); border-radius:14px; padding:20px;(?: margin-bottom:16px;)?">', '<div class="pg-card pg-card--soft">')
sub(r'<div style="display:flex; align-items:flex-start; gap:12px; background:rgba\(16,185,129,0\.07\); border:1px solid rgba\(16,185,129,0\.25\); border-radius:14px;[^"]*">', '<div class="pg-card pg-card--note pg-card--hint">')
sub(r'<span style="flex-shrink:0; margin-top:1px;">', '<span class="pg-row-icon pg-row-icon--hint">')
sub(r' stroke="#047857"', '')
sub(r'<strong style="color:#(?:1A1F36|047857);">', '<strong>')

# Funkseiten: Modul-Kasten (Verlauf) → ruhige Deep-Karte .pg-cta
NEWTAB = '(öffnet in neuem Tab)' if lang == 'de' else '(opens in new tab)'


def module(m):
    body = m.group(1)
    g = lambda pat: (re.search(pat, body, re.S) or [None, ''])[1].strip()
    eyebrow = g(r'<div style="font-size:13px; font-weight:700; color:rgba\(255,255,255,0\.7\); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">(.*?)</div>')
    h2 = g(r'<h2 style="font-size:24px; font-weight:800; color:white; margin-bottom:12px;">(.*?)</h2>')
    p = g(r'<p style="font-size:15px; color:rgba\(255,255,255,0\.8\); line-height:1\.7; margin-bottom:20px;">(.*?)</p>').replace('<strong style="color:white;">', '<strong>')
    price = g(r'<span style="font-size:40px; font-weight:900; color:white; letter-spacing:-1\.5px;">(.*?)</span>')
    unit = g(r'<span style="font-size:14px; color:rgba\(255,255,255,0\.7\); font-weight:500;">(.*?)</span>')
    btn = g(r'(?:▶|&#9654;)&nbsp;([^<]*)')
    assert eyebrow and h2 and p and price and btn, 'module parts'
    return f"""    <section class="pg-section">
      <div class="pg-cta">
        <div class="pg-cta-text">
          <p class="pg-eyebrow">{eyebrow}</p>
          <h2 class="pg-h2">{h2}</h2>
          <p class="pg-p">{p}</p>
        </div>
        <div class="pg-cta-buy">
          <p class="pg-cta-price"><span class="h-num">{price}</span> <span class="pg-cta-unit">{unit}</span></p>
          <a class="h-btn h-btn--sm" href={{playStoreUrl}} target="_blank" rel="noopener noreferrer" data-cta-position="page-module">
            {btn}
            <Icon name="chevronRight" size={{16}} strokeWidth={{2.25}} class="h-btn-arrow" />
            <span class="sr-only h-off-desktop">{NEWTAB}</span>
          </a>
        </div>
      </div>
    </section>
"""
sub(r'    <section style="margin-bottom:48px; background:linear-gradient\(135deg,#3366FF,#1A44D4\)[^\n]*\n(.*?)\n    </section>\n', module, flags=re.S)

# Karten-Raster mit vier Karten → vier Spalten
pos = 0
while True:
    i = s.find('<div class="pg-cards pg-cards--3">', pos)
    if i < 0:
        break
    j = s.find('\n    </section>', i)
    seg = s[i:j if j > 0 else len(s)]
    nxt = seg.find('<div class="pg-cards', 1)
    if nxt > 0:
        seg = seg[:nxt]
    if seg.count('<div class="pg-card">') == 4:
        s = s[:i] + '<div class="pg-cards pg-cards--4">' + s[i + len('<div class="pg-cards pg-cards--3">'):]
    pos = i + 10

# Kategorie-Daten ohne Einzelfarben
sub(r", color: '[^']*', bg: '[^']*'", '')
sub(r'; color: string; bg: string', '')

path.write_text(s)
left = [l.strip()[:150] for l in s.splitlines() if 'style="' in l or 'style={' in l]
print(f'{path.name}: {n0} inline styles vorher, {len(left)} Zeilen mit style danach')
for l in left:
    print('  LEFT:', l)
