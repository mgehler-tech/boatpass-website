/**
 * Hell/Dunkel-Umschalter (Header, auf allen Seiten und Breiten).
 *
 * Der Zustand liegt als Klasse `dark` am <html> und in localStorage `theme`;
 * das Inline-Skript im BaseLayout stellt ihn vor dem ersten Paint wieder her.
 * Alle Umschalter auf der Seite zeigen immer denselben Zustand.
 */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function choices(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('button.theme-choice[data-theme-set]'));
}

function syncThemeToggles(): void {
  const isDark = document.documentElement.classList.contains('dark');
  for (const btn of choices()) {
    const active = (btn.dataset.themeSet === 'dark') === isDark;
    btn.setAttribute('aria-pressed', String(active));
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* privater Modus o. ä.: Zustand gilt dann nur für diese Seite */
  }
  syncThemeToggles();
}

export function initThemeToggles(): void {
  for (const btn of choices()) {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeSet === 'dark' ? 'dark' : 'light'));
  }
  syncThemeToggles();
}
