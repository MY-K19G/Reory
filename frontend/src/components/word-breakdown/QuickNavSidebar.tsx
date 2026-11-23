'use client';

import React from 'react';
import { Lightbulb, Quote, Clock, Sparkles, Shuffle, BookOpen, ArrowUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface QuickNavSidebarProps {
  isScrolled: boolean;
  activeTab: 'meaning' | 'examples' | 'grammar' | 'more';
  sideMoreOpen: boolean;
  sideMoreDropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggleSideMore: () => void;
  onScrollToSection: (id: string, tab: 'meaning' | 'examples' | 'grammar' | 'more') => void;
  onScrollToTop: () => void;
}

export function QuickNavSidebar({
  isScrolled,
  activeTab,
  sideMoreOpen,
  sideMoreDropdownRef,
  onToggleSideMore,
  onScrollToSection,
  onScrollToTop,
}: QuickNavSidebarProps) {
  const { t } = useI18n();

  if (!isScrolled) return null;

  return (
    <aside
      aria-label="Section quick navigation"
      className="fixed right-3 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 p-1.5 bg-white/95 dark:bg-[#1f1f1f]/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-[#2e2e2e] animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {/* Section: Meaning */}
      <button
        type="button"
        onClick={() => onScrollToSection('section-meaning', 'meaning')}
        className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer ${
          activeTab === 'meaning'
            ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white font-bold shadow-2xs'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5'
        }`}
        title={t('meaning')}
      >
        <Lightbulb className="w-4 h-4" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
          {t('meaning')}
        </span>
      </button>

      {/* Section: Examples */}
      <button
        type="button"
        onClick={() => onScrollToSection('section-examples', 'examples')}
        className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer ${
          activeTab === 'examples'
            ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white font-bold shadow-2xs'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5'
        }`}
        title={t('examples')}
      >
        <Quote className="w-4 h-4" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
          {t('examples')}
        </span>
      </button>

      {/* Section: Grammar */}
      <button
        type="button"
        onClick={() => onScrollToSection('section-grammar', 'grammar')}
        className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer ${
          activeTab === 'grammar'
            ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white font-bold shadow-2xs'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5'
        }`}
        title={t('grammar')}
      >
        <Clock className="w-4 h-4" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
          {t('grammar')}
        </span>
      </button>

      {/* Section: More (with flyout submenu) */}
      <div className="relative" ref={sideMoreDropdownRef}>
        <button
          type="button"
          onClick={onToggleSideMore}
          className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer ${
            activeTab === 'more'
              ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white font-bold shadow-2xs'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5'
          }`}
          title={t('moreInsights')}
        >
          <Sparkles className="w-4 h-4" />
          <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
            {t('moreDetails')}
          </span>
        </button>

        {sideMoreOpen && (
          <div className="absolute right-full mr-3 bottom-0 w-48 bg-white dark:bg-[#282828] rounded-2xl shadow-xl border border-slate-100 dark:border-[#383838] py-1.5 z-50 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => onScrollToSection('section-synonyms', 'more')}
              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-500 dark:text-[#f59e7e]" />
              {t('synonymsAntonyms')}
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection('section-ai-explanation', 'more')}
              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              {t('aiDeepExplanation')}
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection('section-quiz', 'more')}
              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              {t('spacedQuiz')}
            </button>
          </div>
        )}
      </div>

      {/* Subtle separator */}
      <div className="w-5 h-[1px] bg-slate-200 dark:bg-white/10 my-0.5" />

      {/* Quick Back to Top */}
      <button
        type="button"
        onClick={onScrollToTop}
        className="group relative flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-accent-primary dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
        title={t('backToTop')}
      >
        <ArrowUp className="w-3.5 h-3.5" />
        <span className="absolute right-full mr-2.5 px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
          {t('top')}
        </span>
      </button>
    </aside>
  );
}
