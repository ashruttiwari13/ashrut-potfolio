'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundFX } from '@/lib/soundEffects';

export type AppTheme = 'panda' | 'cat';

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  isPanda: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'panda',
  toggleTheme: () => {},
  setTheme: () => {},
  isPanda: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('panda');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('site_theme') as AppTheme | null;
      if (saved === 'panda' || saved === 'cat') {
        setThemeState(saved);
        applyThemeClass(saved);
      } else {
        applyThemeClass('panda');
      }
    } catch {
      applyThemeClass('panda');
    }
  }, []);

  const applyThemeClass = (t: AppTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('theme-panda', 'theme-cat');
    root.classList.add(`theme-${t}`);
    document.body.classList.remove('theme-panda', 'theme-cat');
    document.body.classList.add(`theme-${t}`);

    const faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (faviconLink) {
      faviconLink.href = t === 'panda' ? '/favicon.svg' : '/favicon.svg';
    }
  };

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('site_theme', newTheme);
    } catch {}
    applyThemeClass(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    soundFX.playClick(760);
    setThemeState((prev) => {
      const next = prev === 'panda' ? 'cat' : 'panda';
      try {
        localStorage.setItem('site_theme', next);
      } catch {}
      applyThemeClass(next);
      return next;
    });
  }, []);

  const isPanda = theme === 'panda';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isPanda }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

