'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  ChevronDown,
} from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { SUPPORTED_APP_LANGUAGES, AppLanguage, useI18n } from '@/lib/i18n';
import { AccentOption, AccentColor, ACCENT_OPTIONS } from '@/lib/theme';

interface AppearanceCardProps {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  accent: AccentColor;
  setAccent: (color: AccentColor) => void;
  currentAccent: AccentOption;
  appLanguage: string;
  setAppLanguage: (lang: AppLanguage) => void;
  isLangDropdownOpen: boolean;
  setIsLangDropdownOpen: (open: boolean) => void;
}


const ACCENT_NAME_KEYS: Record<AccentColor, string> = {
  orange: 'accentWarm',
  indigo: 'accentClassic',
  emerald: 'accentSage',
  rose: 'accentSunset',
  amber: 'accentGolden',
  cyan: 'accentElectric',
};

const ACCENT_FULL_NAME_KEYS: Record<AccentColor, string> = {
  orange: 'accentWarmOrange',
  indigo: 'accentClassicIndigo',
  emerald: 'accentSageEmerald',
  rose: 'accentSunsetRose',
  amber: 'accentGoldenAmber',
  cyan: 'accentElectricCyan',
};

export const AppearanceCard: React.FC<AppearanceCardProps> = ({
  themeMode,
  setThemeMode,
  accent,
  setAccent,
  currentAccent,
  appLanguage,
  setAppLanguage,
  isLangDropdownOpen,
  setIsLangDropdownOpen,
}) => {
  const { t } = useI18n();

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-2.5 relative z-30">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        {t('appearanceSection')}
      </h2>

      <div className="divide-y divide-slate-100 dark:divide-[#2e2e2e] rounded-2xl bg-slate-50/50 dark:bg-[#282828]/50 border border-slate-200/70 dark:border-[#2e2e2e] overflow-visible relative">
        {/* Theme Toggle */}
        <div className="p-3.5 flex items-center justify-between gap-2 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white block">{t('theme')}</span>
            <span className="text-[11px] text-slate-400 block">{t('themeDesc')}</span>
          </div>

          {/* Segmented Pill Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2e2e2e] rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setThemeMode('light');
                localStorage.setItem('duocard_theme_mode', 'light');
              }}
              style={themeMode === 'light' ? { backgroundColor: currentAccent.primary } : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t('light')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setThemeMode('dark');
                localStorage.setItem('duocard_theme_mode', 'dark');
              }}
              style={themeMode === 'dark' ? { backgroundColor: currentAccent.primary } : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t('dark')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setThemeMode('system');
                localStorage.setItem('duocard_theme_mode', 'system');
              }}
              style={themeMode === 'system' ? { backgroundColor: currentAccent.primary } : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                themeMode === 'system'
                  ? 'text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t('system')}</span>
            </button>
          </div>
        </div>

        {/* Accent Color Palette Selector */}
        <div className="p-3.5 space-y-2 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                {t('accentColor')}
              </span>
              <span className="text-[11px] text-slate-400 block">{t('accentColorDesc')}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {t(ACCENT_FULL_NAME_KEYS[accent]) || currentAccent.label}
            </span>
          </div>

          {/* Color Swatch Circles */}
          <div className="grid grid-cols-6 gap-2 pt-1">
            {(Object.keys(ACCENT_OPTIONS) as AccentColor[]).map((key) => {
              const opt = ACCENT_OPTIONS[key];
              const isSelected = accent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAccent(key)}
                  title={opt.label}
                  className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-[#181818] border-slate-300 dark:border-white/20 ring-2 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-white/5'
                  }`}
                  style={isSelected ? { borderColor: opt.primary, boxShadow: `0 0 0 2px ${opt.ring}` } : undefined}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                    style={{ backgroundColor: opt.primary }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span
                    className={`text-[10px] font-semibold truncate w-full text-center ${
                      isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t(ACCENT_NAME_KEYS[key]) || opt.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Dropdown with Flag and System Language */}
        <div className="p-3.5 space-y-2 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors relative z-40">
          <label className="text-xs font-bold text-slate-800 dark:text-white block">{t('language')}</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#2e2e2e] text-slate-800 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#ea7a54] flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <FlagIcon
                  code={
                    SUPPORTED_APP_LANGUAGES.find((l) => l.code === appLanguage)?.countryCode || 'US'
                  }
                  size="sm"
                />
                <span className="truncate">
                  {SUPPORTED_APP_LANGUAGES.find((l) => l.code === appLanguage)?.name || 'English'}{' '}
                  <span className="text-slate-400 font-normal">
                    ({SUPPORTED_APP_LANGUAGES.find((l) => l.code === appLanguage)?.nativeName || 'English'})
                  </span>
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                  isLangDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#0c0e17] border border-white/15 shadow-2xl overflow-hidden py-1 divide-y divide-white/5 max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        const navLang = navigator.language?.split('-')[0] as any;
                        const match = SUPPORTED_APP_LANGUAGES.find((l) => l.code === navLang);
                        setAppLanguage(match ? match.code : 'en');
                      }
                      setIsLangDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span>{t('systemLanguage')}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">Auto</span>
                  </button>

                  {SUPPORTED_APP_LANGUAGES.map((lang) => {
                    const isSelected = appLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setAppLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 text-cyan-300'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FlagIcon code={lang.countryCode} size="sm" />
                          <span>
                            {lang.name}{' '}
                            <span className="text-slate-500 text-[11px] font-normal">
                              ({lang.nativeName})
                            </span>
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
