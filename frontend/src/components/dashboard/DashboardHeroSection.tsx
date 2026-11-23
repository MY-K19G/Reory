'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AccentTheme } from './dashboardTypes';
import { useI18n } from '@/lib/i18n';

interface DashboardHeroSectionProps {
  currentAccent: AccentTheme;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
}

export const DashboardHeroSection: React.FC<DashboardHeroSectionProps> = ({
  currentAccent,
}) => {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden transition-colors">
      <div className="space-y-3 max-w-xl z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#192338] dark:text-white tracking-tight leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          {t('heroSubtitle')}
        </p>
      </div>

      {/* Right Hero Visual Card */}
      <div className="w-full lg:w-80 shrink-0 relative z-10">
        <div className="rounded-2xl p-5 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-[#192338] dark:to-slate-900 text-slate-800 dark:text-white shadow-xs dark:shadow-xl relative overflow-hidden border border-slate-200/80 dark:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-accent-primary/5 dark:bg-white/5 blur-2xl pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                {t('aiFlashcardGen')}
              </span>
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 dark:text-slate-300 font-medium">{t('readyBoostRetention')}</p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{t('createSmartCards1Click')}</h3>
            </div>

            <Link
              href="/decks/new"
              style={{ backgroundColor: currentAccent.primary }}
              className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t('generateFlashcards')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
