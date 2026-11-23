'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Play, Clock, CheckCircle2, AlertCircle, Flame } from 'lucide-react';
import { Stats } from '@/lib/types';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { RecentDeckItem } from './types';

interface HistoryHeaderStatsProps {
  currentAccent: AccentOption;
  recentDecks: RecentDeckItem[];
  liveStats: Stats | null;
  totalCardsCount: number;
  needsReviewCount: number;
  masteredCount: number;
}

export const HistoryHeaderStats: React.FC<HistoryHeaderStatsProps> = ({
  currentAccent,
  recentDecks,
  liveStats,
  totalCardsCount,
  needsReviewCount,
  masteredCount,
}) => {
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
        <span className="text-slate-700 dark:text-slate-200">{t('history')}</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('learningActivityRecents')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
            {t('studyHistoryActivity')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {t('historySubtitle')}
          </p>
        </div>

        {/* Quick Resume CTA Banner */}
        <Link
          href={recentDecks.length > 0 ? `/study/${recentDecks[0].id}` : '/study/1'}
          style={{ backgroundColor: currentAccent.primary }}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{t('resumeDailyPractice')}</span>
        </Link>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('reviewed')}</span>
            <Clock className="w-4 h-4 text-accent-primary" />
          </div>
          <div className="text-2xl font-black text-[#1e293b] dark:text-white">
            {liveStats?.totalReviews !== undefined ? liveStats.totalReviews : totalCardsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('cards')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('mastered')}</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {liveStats?.masteredCards !== undefined ? liveStats.masteredCards : masteredCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {liveStats?.retentionRate !== undefined ? `${liveStats.retentionRate}%` : '85%'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('needsPractice')}</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{needsReviewCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('cards')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('activeDeck')}</span>
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">
            {liveStats?.streakDays !== undefined ? `${liveStats.streakDays}` : '1'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('study')}</p>
        </div>
      </div>
    </>
  );
};
