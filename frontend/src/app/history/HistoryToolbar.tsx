'use client';

import React from 'react';
import { Clock, FolderClosed, Search, LayoutGrid, List } from 'lucide-react';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface HistoryToolbarProps {
  subTab: 'cards' | 'decks';
  setSubTab: (tab: 'cards' | 'decks') => void;
  cardsCount: number;
  decksCount: number;
  historyFilter: 'all' | 'again' | 'mastered';
  setHistoryFilter: (filter: 'all' | 'again' | 'mastered') => void;
  needsReviewCount: number;
  masteredCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  currentAccent: AccentOption;
}

export const HistoryToolbar: React.FC<HistoryToolbarProps> = ({
  subTab,
  setSubTab,
  cardsCount,
  decksCount,
  historyFilter,
  setHistoryFilter,
  needsReviewCount,
  masteredCount,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  currentAccent,
}) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2.5 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xs">
      {/* Segment Toggle */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#101010] border border-slate-200/50 dark:border-white/5 shrink-0">
        <button
          type="button"
          onClick={() => setSubTab('cards')}
          style={subTab === 'cards' ? { backgroundColor: currentAccent.primary, color: '#ffffff' } : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'cards'
              ? 'shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t('recentCards')} ({cardsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('decks')}
          style={subTab === 'decks' ? { backgroundColor: currentAccent.primary, color: '#ffffff' } : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'decks'
              ? 'shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderClosed className="w-3.5 h-3.5" />
          <span>{t('recentDecks')} ({decksCount})</span>
        </button>
      </div>

      {/* Cards Status Filter Pills */}
      {subTab === 'cards' && (
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
            {t('status')}:
          </span>
          <button
            type="button"
            onClick={() => setHistoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              historyFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-slate-100 dark:bg-[#252525] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('all')} ({cardsCount})
          </button>
          <button
            type="button"
            onClick={() => setHistoryFilter('again')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              historyFilter === 'again'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {t('needsReview')} ({needsReviewCount})
          </button>
          <button
            type="button"
            onClick={() => setHistoryFilter('mastered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              historyFilter === 'mastered'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t('mastered')} ({masteredCount})
          </button>
        </div>
      )}

      {/* Search & Layout Toggle */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 md:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchHistoryPlaceholder')}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#202020] border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-accent-primary"
          />
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-[#202020] border border-slate-200/70 dark:border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={viewMode === 'grid' ? { backgroundColor: currentAccent.subtleBg, color: currentAccent.primary } : undefined}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? '' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            style={viewMode === 'list' ? { backgroundColor: currentAccent.subtleBg, color: currentAccent.primary } : undefined}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' ? '' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
