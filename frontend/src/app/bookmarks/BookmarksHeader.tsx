'use client';

import Link from 'next/link';
import { Home, ChevronRight, BookOpen, Star, FolderClosed, Sparkles } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface BookmarksHeaderProps {
  bookmarkedCardsCount: number;
  bookmarkedDecksCount: number;
  allTagsCount: number;
  firstDeckId?: string | number | null;
}

export function BookmarksHeader({
  bookmarkedCardsCount,
  bookmarkedDecksCount,
  allTagsCount,
  firstDeckId,
}: BookmarksHeaderProps) {
  const { currentAccent } = useTheme();
  const { t } = useI18n();

  return (
    <>
      {/* 1. BREADCRUMB & HEADER */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-slate-700 dark:hover:text-white transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>{t('home')}</span>
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 dark:text-slate-200">{t('bookmarks')}</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('savedWordsCollections')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
            {t('bookmarkedVocabulary')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {t('bookmarksSubtitle')}
          </p>
        </div>

        {/* Quick Study CTA Banner */}
        <Link
          href={firstDeckId ? `/study/${firstDeckId}` : '/explore'}
          style={{ backgroundColor: currentAccent.primary }}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('study')}</span>
        </Link>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('bookmarks')}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-[#1e293b] dark:text-white">
            {bookmarkedCardsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('cards')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('decks')}</span>
            <FolderClosed className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#1e293b] dark:text-white">
            {bookmarkedDecksCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('decks')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-purple-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('allTags')}</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{allTagsCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('allTags')}</p>
        </div>
      </div>
    </>
  );
}
