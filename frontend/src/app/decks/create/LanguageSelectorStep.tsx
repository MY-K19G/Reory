'use client';

import React from 'react';
import { ChevronDown, Search, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { LanguageItem } from '@/lib/languages';
import { useI18n } from '@/lib/i18n';

interface LanguageSelectorStepProps {
  targetLang: LanguageItem;
  nativeLang: LanguageItem;
  targetDropdownOpen: boolean;
  setTargetDropdownOpen: (open: boolean) => void;
  nativeDropdownOpen: boolean;
  setNativeDropdownOpen: (open: boolean) => void;
  targetSearch: string;
  setTargetSearch: (s: string) => void;
  nativeSearch: string;
  setNativeSearch: (s: string) => void;
  targetDropdownRef: React.RefObject<HTMLDivElement | null>;
  nativeDropdownRef: React.RefObject<HTMLDivElement | null>;
  filteredTargetLangs: LanguageItem[];
  filteredNativeLangs: LanguageItem[];
  handleSelectTargetLang: (lang: LanguageItem) => void;
  handleSelectNativeLang: (lang: LanguageItem) => void;
  handleSwapLanguages: () => void;
  languageError: string | null;
}

export function LanguageSelectorStep({
  targetLang,
  nativeLang,
  targetDropdownOpen,
  setTargetDropdownOpen,
  nativeDropdownOpen,
  setNativeDropdownOpen,
  targetSearch,
  setTargetSearch,
  nativeSearch,
  setNativeSearch,
  targetDropdownRef,
  nativeDropdownRef,
  filteredTargetLangs,
  filteredNativeLangs,
  handleSelectTargetLang,
  handleSelectNativeLang,
  handleSwapLanguages,
  languageError,
}: LanguageSelectorStepProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full text-white bg-accent-primary font-bold text-xs flex items-center justify-center shrink-0">
          1
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1e293b] dark:text-white">{t('chooseLanguages')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('chooseLanguagesDesc')}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5 sm:gap-4 pt-1">
        {/* Learn Language Box */}
        <div className="flex-1 relative" ref={targetDropdownRef}>
          <div className="p-3.5 rounded-2xl bg-[#f8f9fe] dark:bg-[#282828] border border-slate-200/70 dark:border-[#383838] hover:border-accent-primary dark:hover:border-slate-500 transition-colors space-y-1.5 cursor-pointer">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>{t('learnLanguage')}</span>
              <span className="text-[10px] uppercase font-bold text-accent-primary/70 dark:text-slate-300 tracking-wider">
                {t('targetLanguage')}
              </span>
            </div>

            <div
              onClick={() => setTargetDropdownOpen(!targetDropdownOpen)}
              className="flex items-center justify-between pt-0.5"
            >
              <div className="flex items-center gap-2.5">
                <FlagIcon code={targetLang.countryCode} size="md" />
                <div>
                  <div className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">
                    {targetLang.name}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {targetLang.code.toUpperCase()}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {targetDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#282828] rounded-2xl shadow-xl border border-slate-100 dark:border-[#383838] p-2 z-40 animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={targetSearch}
                  onChange={(e) => setTargetSearch(e.target.value)}
                  placeholder={t('searchLanguagesPlaceholder')}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#383838] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div className="space-y-0.5">
                {filteredTargetLangs.map((l) => {
                  const isCurrentTarget = targetLang.name === l.name;
                  return (
                    <button
                      key={l.name}
                      type="button"
                      onClick={() => handleSelectTargetLang(l)}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-[#333] transition-colors ${
                        isCurrentTarget
                          ? 'bg-accent-primary/10 dark:bg-[#383838] text-accent-primary dark:text-white'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FlagIcon code={l.countryCode} size="sm" />
                        <span>{l.name}</span>
                      </div>
                      {isCurrentTarget && <Check className="w-3.5 h-3.5 text-accent-primary dark:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Swap Button in center */}
        <button
          type="button"
          onClick={handleSwapLanguages}
          className="w-9 h-9 rounded-full bg-white dark:bg-[#282828] hover:bg-slate-50 dark:hover:bg-[#333] border border-slate-200/80 dark:border-[#383838] text-slate-400 hover:text-accent-primary dark:hover:text-white shadow-2xs flex items-center justify-center self-center transition-colors cursor-pointer shrink-0"
          title={t('swapLanguages')}
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* Native Language Box */}
        <div className="flex-1 relative" ref={nativeDropdownRef}>
          <div className="p-3.5 rounded-2xl bg-[#f8f9fe] dark:bg-[#282828] border border-slate-200/70 dark:border-[#383838] hover:border-accent-primary dark:hover:border-slate-500 transition-colors space-y-1.5 cursor-pointer">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>{t('nativeLanguage')}</span>
              <span className="text-[10px] uppercase font-bold text-accent-primary/70 dark:text-slate-300 tracking-wider">
                {t('yourLanguage')}
              </span>
            </div>

            <div
              onClick={() => setNativeDropdownOpen(!nativeDropdownOpen)}
              className="flex items-center justify-between pt-0.5"
            >
              <div className="flex items-center gap-2.5">
                <FlagIcon code={nativeLang.countryCode} size="md" />
                <div>
                  <div className="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">
                    {nativeLang.name}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {nativeLang.code.toUpperCase()}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {nativeDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#282828] rounded-2xl shadow-xl border border-slate-100 dark:border-[#383838] p-2 z-40 animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nativeSearch}
                  onChange={(e) => setNativeSearch(e.target.value)}
                  placeholder={t('searchLanguagesPlaceholder')}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#383838] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div className="space-y-0.5">
                {filteredNativeLangs.map((l) => {
                  const isCurrentNative = nativeLang.name === l.name;
                  return (
                    <button
                      key={l.name}
                      type="button"
                      onClick={() => handleSelectNativeLang(l)}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-[#333] transition-colors ${
                        isCurrentNative
                          ? 'bg-accent-primary/10 dark:bg-[#383838] text-accent-primary dark:text-white'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FlagIcon code={l.countryCode} size="sm" />
                        <span>{l.name}</span>
                      </div>
                      {isCurrentNative && <Check className="w-3.5 h-3.5 text-accent-primary dark:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {languageError && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{languageError}</span>
        </div>
      )}
    </div>
  );
}
