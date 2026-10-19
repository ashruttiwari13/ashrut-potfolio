import { UISettings } from '@/types';

export const DEFAULT_UI_SETTINGS: UISettings = {
  theme: 'pastel',
  density: 'medium',
  spacing: 'comfortable',
  reducedMotion: false,
};

const STORAGE_KEY = 'ashrut_portfolio_ui_settings';

export function getInitialUISettings(): UISettings {
  if (typeof window === 'undefined') {
    return DEFAULT_UI_SETTINGS;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        theme: ['pastel', 'dark', 'sunset'].includes(parsed.theme) ? parsed.theme : 'pastel',
        density: ['small', 'medium', 'large'].includes(parsed.density) ? parsed.density : 'medium',
        spacing: ['compact', 'comfortable'].includes(parsed.spacing) ? parsed.spacing : 'comfortable',
        reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
      };
    }

    // Detect user OS reduced-motion preference as initial default if not previously saved
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    return {
      ...DEFAULT_UI_SETTINGS,
      reducedMotion: prefersReducedMotion,
    };
  } catch (err) {
    console.warn('Could not read UI settings from localStorage:', err);
    return DEFAULT_UI_SETTINGS;
  }
}

export function saveUISettings(settings: UISettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not save UI settings to localStorage:', err);
  }
}

export function applyUISettingsToDOM(settings: UISettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.setAttribute('data-theme', settings.theme);
  root.setAttribute('data-density', settings.density);
  root.setAttribute('data-spacing', settings.spacing);
  root.setAttribute('data-reduced-motion', String(settings.reducedMotion));
}
