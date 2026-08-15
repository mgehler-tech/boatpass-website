/**
 * Punkt-Indikatoren für die Wisch-Reihen auf schmalen Screens.
 *
 * Erwartet eine Reihe mit `data-snap-row` und einen Container mit
 * `data-snap-dots`, der auf dieselbe ID zeigt. Die Punkte entstehen zur
 * Laufzeit – ohne JavaScript bleibt die Reihe eine ganz normale, seitlich
 * scrollbare Liste, nur eben ohne Positionsanzeige.
 *
 * Beobachtet wird innerhalb der Reihe (root = die Reihe selbst), nicht im
 * Viewport: Sonst würde beim vertikalen Scrollen der Seite mitgezählt.
 */
export function initSnapDots(rowSelector = '[data-snap-row]'): void {
  const rows = document.querySelectorAll<HTMLElement>(rowSelector);

  rows.forEach(row => {
    const id = row.dataset.snapRow;
    if (!id) return;

    const dotsHost = document.querySelector<HTMLElement>(`[data-snap-dots="${id}"]`);
    const items = Array.from(row.querySelectorAll<HTMLElement>('.snap-item'));
    if (!dotsHost || items.length < 2) return;

    // Die Reihe per Tastatur ansteuerbar machen – sonst kommt man ohne Maus
    // oder Touch nicht an die hinteren Karten.
    row.tabIndex = 0;
    row.setAttribute('role', 'group');

    const dots = items.map((item, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'snap-dot';
      dot.setAttribute('aria-label', `${i + 1} von ${items.length}`);
      dot.addEventListener('click', () => {
        item.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      });
      dotsHost.appendChild(dot);
      return dot;
    });

    const setActive = (index: number) => {
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
    };
    setActive(0);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = items.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        });
      },
      { root: row, threshold: 0.6 }
    );

    items.forEach(item => observer.observe(item));
  });
}
