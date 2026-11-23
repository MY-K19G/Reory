'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import bn from '@/locales/bn.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import mr from '@/locales/mr.json';
import gu from '@/locales/gu.json';
import kn from '@/locales/kn.json';
import ml from '@/locales/ml.json';
import pa from '@/locales/pa.json';
import or from '@/locales/or.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';
import ja from '@/locales/ja.json';
import ru from '@/locales/ru.json';
import zh from '@/locales/zh.json';

export type AppLanguage =
  | 'en'
  | 'hi'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'ru'
  | 'zh';

export interface AppLanguageConfig {
  code: AppLanguage;
  name: string;
  nativeName: string;
  countryCode: string;
}

export const SUPPORTED_APP_LANGUAGES: AppLanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', countryCode: 'US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', countryCode: 'IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', countryCode: 'IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', countryCode: 'IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', countryCode: 'IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', countryCode: 'IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', countryCode: 'IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', countryCode: 'IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', countryCode: 'IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', countryCode: 'IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', countryCode: 'IN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', countryCode: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', countryCode: 'DE' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', countryCode: 'JP' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', countryCode: 'RU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', countryCode: 'CN' },
];

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en,
  hi,
  bn,
  ta,
  te,
  mr,
  gu,
  kn,
  ml,
  pa,
  or,
  es,
  fr,
  de,
  ja,
  ru,
  zh,
};

interface I18nContextType {
  appLanguage: AppLanguage;
  setAppLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  appLanguage: 'en',
  setAppLanguage: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [appLanguage, setAppLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    const handleSync = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('duocard_app_language') as AppLanguage;
        if (saved && TRANSLATIONS[saved]) {
          setAppLanguageState(saved);
        }
      }
    };
    handleSync();
    window.addEventListener('storage', handleSync);
    window.addEventListener('app_language_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('app_language_changed', handleSync);
    };
  }, []);

  const setAppLanguage = (lang: AppLanguage) => {
    setAppLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('duocard_app_language', lang);
      window.dispatchEvent(new Event('app_language_changed'));
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[appLanguage]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ appLanguage, setAppLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
