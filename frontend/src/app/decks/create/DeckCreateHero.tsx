'use client';

import { useI18n } from '@/lib/i18n';

export function DeckCreateHero() {
  const { t } = useI18n();

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1f1f1f] shadow-xs border border-slate-100 dark:border-[#2e2e2e] min-h-[170px] sm:min-h-[190px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-[center_right] sm:bg-right opacity-95 dark:opacity-30 pointer-events-none transition-transform duration-700"
        style={{
          backgroundImage: `url('/pagoda-banner.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/90 dark:to-transparent w-full sm:w-3/5 pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-lg space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#192338] dark:text-white tracking-tight">
          {t('createNewDeckBtn')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed pt-0.5">
          {t('buildPersonalizedDeck')}
        </p>
      </div>

      <div className="absolute top-5 right-24 sm:right-32 hidden md:flex flex-col items-center pointer-events-none transform rotate-[-6deg]">
        <span className="text-xs font-bold text-accent-primary/80 dark:text-slate-300 font-serif italic tracking-wide">
          {t('newLanguageNewYou')}
        </span>
      </div>
    </div>
  );
}
