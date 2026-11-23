'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export type AccentColor = 'orange' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';

export interface AccentOption {
  id: AccentColor;
  label: string;
  primary: string;       // main button / active pill bg
  hover: string;         // button hover
  lightText: string;     // highlight text / badge text
  subtleBg: string;      // 10-15% opacity bg
  border: string;        // 20-30% opacity border
  ring: string;          // focus ring
}

export const ACCENT_OPTIONS: Record<AccentColor, AccentOption> = {
  orange: {
    id: 'orange',
    label: 'Warm Apricot',
    primary: '#ea7a54',
    hover: '#f28a66',
    lightText: '#f59e7e',
    subtleBg: 'rgba(234, 122, 84, 0.12)',
    border: 'rgba(234, 122, 84, 0.28)',
    ring: 'rgba(234, 122, 84, 0.4)',
  },
  indigo: {
    id: 'indigo',
    label: 'Classic Indigo',
    primary: '#5551f3',
    hover: '#4940e7',
    lightText: '#818cf8',
    subtleBg: 'rgba(85, 81, 243, 0.12)',
    border: 'rgba(85, 81, 243, 0.28)',
    ring: 'rgba(85, 81, 243, 0.4)',
  },
  emerald: {
    id: 'emerald',
    label: 'Sage Emerald',
    primary: '#10b981',
    hover: '#059669',
    lightText: '#34d399',
    subtleBg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.28)',
    ring: 'rgba(16, 185, 129, 0.4)',
  },
  rose: {
    id: 'rose',
    label: 'Sunset Rose',
    primary: '#f43f5e',
    hover: '#e11d48',
    lightText: '#fb7185',
    subtleBg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.28)',
    ring: 'rgba(244, 63, 94, 0.4)',
  },
  amber: {
    id: 'amber',
    label: 'Golden Amber',
    primary: '#f59e0b',
    hover: '#d97706',
    lightText: '#fbbf24',
    subtleBg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.28)',
    ring: 'rgba(245, 158, 11, 0.4)',
  },
  cyan: {
    id: 'cyan',
    label: 'Electric Cyan',
    primary: '#06b6d4',
    hover: '#0891b2',
    lightText: '#22d3ee',
    subtleBg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.28)',
    ring: 'rgba(6, 182, 212, 0.4)',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  accent: AccentColor;
  currentAccent: AccentOption;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  accent: 'orange',
  currentAccent: ACCENT_OPTIONS.orange,
  setTheme: () => {},
  setAccent: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [accent, setAccentState] = useState<AccentColor>('orange');

  // Load initial theme and accent from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('duocard_theme_mode') as ThemeMode | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setThemeState(savedTheme);
    } else {
      setThemeState('system');
    }

    const savedAccent = localStorage.getItem('duocard_accent_color') as AccentColor | null;
    if (savedAccent && ACCENT_OPTIONS[savedAccent]) {
      setAccentState(savedAccent);
    }
  }, []);

  // Update resolved theme, document classes and CSS custom variables
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      setResolvedTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  // Apply accent CSS custom properties to :root whenever accent changes
  useEffect(() => {
    const root = document.documentElement;
    const opt = ACCENT_OPTIONS[accent] || ACCENT_OPTIONS.orange;

    root.style.setProperty('--accent-primary', opt.primary);
    root.style.setProperty('--accent-hover', opt.hover);
    root.style.setProperty('--accent-light', opt.lightText);
    root.style.setProperty('--accent-subtle', opt.subtleBg);
    root.style.setProperty('--accent-border', opt.border);
    root.style.setProperty('--accent-ring', opt.ring);
  }, [accent]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('duocard_theme_mode', newTheme);
    window.dispatchEvent(new Event('theme_changed'));
  };

  const setAccent = (newAccent: AccentColor) => {
    if (!ACCENT_OPTIONS[newAccent]) return;
    setAccentState(newAccent);
    localStorage.setItem('duocard_accent_color', newAccent);
    window.dispatchEvent(new Event('accent_changed'));
  };

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const currentAccent = ACCENT_OPTIONS[accent] || ACCENT_OPTIONS.orange;

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, accent, currentAccent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
