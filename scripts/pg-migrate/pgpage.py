"""Stellt eine Inhaltsseite strukturell auf PageHead/PageLayout/PageFacts um und
ruft danach den Regex-Konverter (pgconvert.py) für die Abschnitte auf.

Aufruf (aus der Repo-Wurzel): python3 scripts/pg-migrate/pgpage.py <seitenschluessel> [...]
Die Seitenkonfiguration steht unten in PAGES; Seiten aus Runde 2b bleiben als Beleg stehen.
"""
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]  # Repo-Wurzel (scripts/pg-migrate/..)

PAGES = {
    'sbf-see': dict(
        file='src/pages/sbf-see.astro', lang='de', eyebrow='Sportbootführerschein See',
        h1='SBF See lernen –<br />die smarte Lernapp',
        lede='Bereite dich mit dem offiziellen ELWIS-Fragenkatalog auf die SBF-See-Prüfung vor. Inklusive Navigationsprüfung – mit Prüfungssimulation und gezieltem Fehlertraining.',
        title='Auf einen Blick', product='sbfSee',
        facts=[('Theorieprüfung', '39 Fragen · 60 Min'), ('Navigationsaufgabe', '9 Fragen, mind. 7 richtig'),
               ('Bestehensgrenze', '5 von 7 Basis, 18 von 23 spezifisch'), ('Prüfungsgebühr 2026', '148,38 €'), ('Mindestalter', '16 Jahre')],
    ),
    'en-sbf-inland': dict(
        file='src/pages/en/sbf-inland.astro', lang='en', eyebrow='Inland Boating License',
        h1='Learn SBF Inland –<br />the smart study app',
        lede='Prepare for the SBF Inland exam with the official ELWIS question catalog. 3 learning modes, exam simulation and targeted mistake training – start for free.',
        title='At a glance', product='sbfBinnen',
        facts=[('Question catalogue', '253+ questions'), ('Theory exam', '30 questions · 45 min'),
               ('Pass mark', '5 of 7 basic, 18 of 23 specific'), ('Exam fee 2026', '€130.78'), ('Minimum age', '16 years')],
    ),
    'en-sbf-coastal': dict(
        file='src/pages/en/sbf-coastal.astro', lang='en', eyebrow='Coastal Boating License',
        h1='Learn SBF Coastal –<br />the smart study app',
        lede='Prepare for the SBF Coastal exam with the official ELWIS question catalog. Including the navigation exam – with exam simulation and targeted mistake training.',
        title='At a glance', product='sbfSee',
        facts=[('Theory exam', '39 questions · 60 min'), ('Navigation task', '9 questions, at least 7 correct'),
               ('Pass mark', '5 of 7 basic, 18 of 23 specific'), ('Exam fee 2026', '€148.38'), ('Minimum age', '16 years')],
        practice=('navigation', 'navPoints'),
    ),
    'ubi': dict(
        file='src/pages/ubi.astro', lang='de', eyebrow='UKW-Sprechfunkzeugnis Binnen',
        h1='UBI lernen –<br />alles zum Sprechfunkzeugnis',
        lede='Das UKW-Sprechfunkzeugnis für Binnenschifffahrt (UBI) ist Pflicht für jeden, der Funk an Bord bedienen will. Hier erfährst du alles zur Prüfung – und wie dich das Boatpass UBI-Modul optimal vorbereitet.',
        cta_label='Jetzt UBI lernen in der App', badge=('Boatpass UBI-Modul – jetzt verfügbar · einmalig', 'ubi'),
        title='Auf einen Blick', product='ubi',
        facts=[('Fragenkatalog', '130 Fragen'), ('Theorie', '60 Min, bestanden ab 17 richtig'), ('Prüfungsform', 'Schriftlich + praktisch (DSV)'),
               ('Prüfungsgebühr', '108,71 €'), ('Mindestalter', '15 Jahre')],
    ),
    'src': dict(
        file='src/pages/src.astro', lang='de', eyebrow='Short Range Certificate · Seefunk Küste',
        h1='SRC lernen –<br />Kurzstreckenzeugnis Seefunk',
        lede='Das Short Range Certificate (SRC) ist das meistgenutzte Seefunkzeugnis der Sportschifffahrt – Pflicht für jeden, der eine UKW-Seefunkanlage mit DSC im Küstenbereich bedient.',
        cta_label='Jetzt SRC lernen in der App', badge=('Boatpass SRC-Modul – jetzt verfügbar · einmalig', 'src'),
        title='Auf einen Blick', product='src',
        facts=[('Fragenkatalog', '180 Fragen'), ('Theorie', '30 Min, bestanden ab 19 richtig'), ('Praxis', 'Bedienung am DSC-Funkgerät'),
               ('Prüfungsgebühr', '127,88 €'), ('Mindestalter', '15 Jahre')],
    ),
    'lrc': dict(
        file='src/pages/lrc.astro', lang='de', eyebrow='Long Range Certificate · Seefunk weltweit',
        h1='LRC lernen –<br />Allgemeines Funkbetriebszeugnis',
        lede='Das Long Range Certificate (LRC) ist das höchste Seefunkzeugnis der Sportschifffahrt – gültig für UKW, Grenz- und Kurzwelle sowie Satellitenfunk in allen Seegebieten weltweit.',
        cta_label='Jetzt LRC lernen in der App', badge=('Boatpass LRC-Modul – jetzt verfügbar · einmalig', 'lrc'),
        title='Auf einen Blick', product='lrc',
        facts=[('Fragenkatalog', '76 Fragen'), ('Theorie', '20 Min, bestanden ab 11 richtig'), ('Praxis', 'Bedienung GMDSS-Geräte'),
               ('Prüfungsgebühr', 'ca. 188–207 €'), ('Mindestalter', '18 Jahre (Antrag)')],
    ),
    'en-ubi': dict(
        file='src/pages/en/ubi.astro', lang='en', eyebrow='VHF Radio Certificate (Inland)',
        h1='Learn UBI –<br />everything about the radio certificate',
        lede="The VHF radio certificate for inland navigation (UBI) is mandatory for anyone who wants to operate a radio on board. Here you'll find everything about the exam – and how the Boatpass UBI module prepares you optimally.",
        cta_label='Start learning UBI in the app', badge=('Boatpass UBI module – now available · one-time', 'ubi'),
        title='At a glance', product='ubi',
        facts=[('Question catalogue', '130 questions'), ('Theory', '60 min, pass from 17 correct'), ('Exam format', 'Written + practical (DSV)'),
               ('Exam fee', '€108.71'), ('Minimum age', '15 years')],
        practice=('radio', 'radioPoints'),
    ),
    'en-src': dict(
        file='src/pages/en/src.astro', lang='en', eyebrow='Short Range Certificate · Coastal Marine Radio',
        h1='Learn SRC –<br />Short Range Certificate',
        lede='The Short Range Certificate (SRC) is the most widely used marine radio certificate in recreational boating – mandatory for anyone who operates a VHF marine radio with DSC in the coastal area.',
        cta_label='Start learning SRC in the app', badge=('Boatpass SRC module – now available · one-time', 'src'),
        title='At a glance', product='src',
        facts=[('Question catalogue', '180 questions'), ('Theory', '30 min, pass from 19 correct'), ('Practical', 'Operating the DSC radio'),
               ('Exam fee', '€127.88'), ('Minimum age', '15 years')],
        practice=('radio', 'radioPoints'),
    ),
    'en-lrc': dict(
        file='src/pages/en/lrc.astro', lang='en', eyebrow='Long Range Certificate · Worldwide Marine Radio',
        h1="Learn LRC –<br />General Operator's Certificate",
        lede='The Long Range Certificate (LRC) is the highest marine radio certificate in recreational boating – valid for VHF, MF/HF and satellite radio in all sea areas worldwide.',
        cta_label='Start learning LRC in the app', badge=('Boatpass LRC module – now available · one-time', 'lrc'),
        title='At a glance', product='lrc',
        facts=[('Question catalogue', '76 questions'), ('Theory', '20 min, pass from 11 correct'), ('Practical', 'Operating GMDSS equipment'),
               ('Exam fee', 'approx. €188–207'), ('Minimum age', '18 years (application)')],
        practice=('radio', 'radioPoints'),
    ),
    # ── Runde 3a ──
    'sbf-kosten': dict(
        file='src/pages/sbf-kosten.astro', lang='de', eyebrow='SBF Kosten',
        h1='Was kostet der<br />Sportbootführerschein?',
        lede='Prüfungsgebühren, Kurs, Praxis und Lernmaterial – hier siehst du alle Kostenpunkte für SBF Binnen, SBF See und die Kombination im Überblick. Plus: wie du clever sparst.',
        cta_label='Theorie ab 9,99 € lernen', title='Auf einen Blick', product='sbfBinnen', price_from=True,
        facts=[('Prüfungsgebühr Binnen', '130,78 €'), ('Prüfungsgebühr See', '148,38 €'), ('Kombi-Prüfung', '178,61 €'),
               ('Vorbereitungskurs', 'ca. 340–400 € aufwärts'), ('Theorie mit Boatpass', 'ab 9,99 €')],
    ),
    'en-sbf-costs': dict(
        file='src/pages/en/sbf-costs.astro', lang='en', eyebrow='SBF Costs',
        h1='What does the<br />boating license cost?',
        lede='Exam fees, course, practice and study material – here you see all the cost items for SBF Inland, SBF Coastal and the combination at a glance. Plus: how to save smartly.',
        cta_label='Learn theory from €9.99', title='At a glance', product='sbfBinnen', price_from=True,
        facts=[('Exam fee Inland', '€130.78'), ('Exam fee Coastal', '€148.38'), ('Combined exam', '€178.61'),
               ('Preparation course', 'approx. €340–400 upwards'), ('Theory with Boatpass', 'from €9.99')],
    ),
    'fuehrerscheine': dict(
        file='src/pages/fuehrerscheine.astro', lang='de', eyebrow='Alle Lizenzen',
        h1='Welche Lizenz<br />passt zu dir?',
        lede='Ob Binnengewässer oder Küste, Motorboot oder Funk an Bord – hier findest du die richtige Lizenz und alles, was du für die Vorbereitung wissen musst.',
        wide=True, cta=False,
    ),
    'en-licenses': dict(
        file='src/pages/en/licenses.astro', lang='en', eyebrow='All Licenses',
        h1='Which license<br />fits you?',
        lede='Inland waters or coast, motorboat or radio on board – find the right license here and everything you need to know to prepare.',
        wide=True, cta=False,
    ),
}

ICON = '<Icon name="chevronRight" size={16} strokeWidth={2.25} />'


def overview(s):
    """Führerschein-Übersicht: Finder-Banner, Lizenzkarten-Links, Seiten-Styles."""
    def banner(m):
        body = m.group(2)
        g = lambda pat: (re.search(pat, body, re.S) or [None, ''])[1].strip()
        eyebrow = g(r'margin-bottom:6px;">(.*?)</div>')
        title = g(r'line-height:1\.2;">(.*?)</div>')
        sub = g(r'margin-top:6px;">(.*?)</div>')
        cta = g(r'white-space:nowrap;">(.*?)\s*(?:→|&rarr;)</span>')
        assert eyebrow and title and sub and cta, 'banner parts'
        return f"""    <a href="{m.group(1)}" class="pg-banner">
      <span class="pg-banner-text">
        <span class="pg-eyebrow">{eyebrow}</span>
        <span class="pg-banner-title">{title}</span>
        <span class="pg-banner-sub">{sub}</span>
      </span>
      <span class="h-btn h-btn--sm pg-banner-cta">{cta}<Icon name="chevronRight" size={{16}} strokeWidth={{2.25}} class="h-btn-arrow" /></span>
    </a>
"""
    s, n = re.subn(r'    <a href="([^"]+)" class="finder-banner" style="[^"]*">\n(.*?)\n    </a>\n', banner, s, count=1, flags=re.S)
    assert n == 1, 'banner'
    s = re.sub(r'<div class="license-link">([^<]*?)\s*(?:→|&rarr;)</div>', lambda m: f'<div class="license-link">{m.group(1)}{ICON}</div>', s)
    s = s.replace(' stroke="#3366FF"', '')
    s, n = re.subn(r'<section style="margin-top:48px;">', '<section class="pg-section">', s)
    # Seiten-Styles entfallen; die Lizenzkarten-Regeln liegen tokenisiert in page.css.
    s, n = re.subn(r'\n<style>\n.*?\n</style>\n', '\n', s, count=1, flags=re.S)
    assert n == 1, 'style block'
    return s


def migrate(key):
    cfg = PAGES[key]
    path = ROOT / cfg['file']
    s = path.read_text()
    prefix = '../../' if cfg['lang'] == 'en' else '../'
    wide = cfg.get('wide', False)

    # Display-Schrift vorladen (idempotent; Runde 2b: DisplayFontPreload im head-Slot)
    base_import = f"import BaseLayout from '{prefix}layouts/BaseLayout.astro';\n"
    assert base_import in s, 'base import'
    if 'DisplayFontPreload' not in s:
        s = s.replace(base_import, base_import + f"import DisplayFontPreload from '{prefix}components/page/DisplayFontPreload.astro';\n", 1)
        m = re.search(r'<BaseLayout\b[^>]*>\n', s)
        assert m, 'BaseLayout tag'
        s = s[:m.end()] + '  <DisplayFontPreload slot="head" />\n' + s[m.end():]

    if '  <!-- Hero -->\n' not in s:
        # Struktur schon umgestellt (zweiter Lauf): nur Preload sichern und den Konverter laufen lassen.
        path.write_text(s)
        out = subprocess.run([sys.executable, str(HERE / 'pgconvert.py'), str(path), cfg['lang']], capture_output=True, text=True)
        print(out.stdout.strip())
        return

    # Kopf + Beginn der Lesespalte
    start = s.index('  <!-- Hero -->\n')
    marker = ('  <div style="max-width:1000px; margin:0 auto; padding:60px 24px 80px;">\n' if wide
              else '  <div style="max-width:800px; margin:0 auto; padding:60px 24px 100px;">\n')
    end = s.index(marker) + len(marker)
    label_attr = f'\n    ctaLabel="{cfg["cta_label"]}"' if cfg.get('cta_label') else ''
    badge = ''
    if cfg.get('badge'):
        text, product = cfg['badge']
        badge = f'\n    <span slot="badge">{text}&nbsp;<PlatformPrice product="{product}" lang="{cfg["lang"]}" /></span>'
    cta_attr = '' if cfg.get('cta') is False else '\n    cta'
    head = f"""  <!-- Seitenkopf und {'breite Spalte' if wide else 'Lesespalte'} (Spec Runde 2, 5.3) -->
  <PageHead
    lang="{cfg['lang']}"
    eyebrow="{cfg['eyebrow']}"
    lede="{cfg['lede']}"{label_attr}{cta_attr}
  >
    {cfg['h1']}{badge}
  </PageHead>

"""
    if wide:
        head += '  <PageLayout variant="wide">\n'
    elif cfg.get('narrow'):
        head += '  <PageLayout variant="narrow">\n'
    else:
        facts = ',\n'.join(f"        {{ k: '{k}', v: '{v}' }}" for k, v in cfg['facts'])
        from_attr = '\n      from' if cfg.get('price_from') else ''
        head += f"""  <PageLayout>
    <PageFacts
      slot="aside"
      lang="{cfg['lang']}"
      title="{cfg['title']}"
      product="{cfg['product']}"{from_attr}
      items={{[
{facts},
      ]}}
    />
"""
    s = s[:start] + head + s[end:]
    if wide:
        s = overview(s)

    # Ende der Lesespalte
    s, n = re.subn(r"\n  </div>\n\n?</BaseLayout>", "\n  </PageLayout>\n</BaseLayout>", s, count=1)
    assert n == 1, 'close'

    # Imports
    base_import = f"import BaseLayout from '{prefix}layouts/BaseLayout.astro';\n"
    assert base_import in s, 'base import'
    extra = ''.join(f"import {n} from '{prefix}components/page/{n}.astro';\n" for n in ['PageHead', 'PageLayout', 'PageFacts', 'PageLink'])
    s = s.replace(base_import, base_import + extra, 1)

    # EN: Inline-Praxisblock durch die Komponente ersetzen
    if cfg.get('practice'):
        variant, data = cfg['practice']
        n_before = len(s)
        s, n = re.subn(r"    <!-- Practice bridge:[^\n]*\n    <section style=\"margin-bottom:48px;\">.*?\n    </section>\n",
                       f'    <PracticeBridge variant="{variant}" lang="en" />\n', s, count=1, flags=re.S)
        assert n == 1, 'practice block'
        s, n = re.subn(rf"const {data}: \{{ icon: IconName; title: string; desc: string \}}\[\] = \[\n(?:.*\n)*?\];\n\n?", '', s, count=1)
        assert n == 1, 'practice data'
        if 'PracticeBridge.astro' not in s:
            s = s.replace(base_import, base_import + f"import PracticeBridge from '{prefix}components/PracticeBridge.astro';\n", 1)

    path.write_text(s)
    out = subprocess.run([sys.executable, str(HERE / 'pgconvert.py'), str(path), cfg['lang']], capture_output=True, text=True)
    print(out.stdout.strip())
    if out.returncode:
        print(out.stderr)


for key in sys.argv[1:] or PAGES:
    migrate(key)
