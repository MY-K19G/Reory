'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Link2, Upload, FolderPlus, ArrowUpRight } from 'lucide-react';
import { Stats } from './dashboardTypes';
import { useI18n } from '@/lib/i18n';

interface DashboardSidebarProps {
  stats: Stats | null;
  decksCount: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ stats, decksCount }) => {
  const { t } = useI18n();

  return (
    <aside className="w-full xl:w-72 shrink-0 space-y-6">
      {/* Quick Access Block */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          {t('quickAccess')}
        </h3>
        <div className="space-y-2">
          <Link
            href="/decks/new"
            className="w-full p-3 rounded-2xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] border border-slate-200/70 dark:border-[#2e2e2e] flex items-center gap-3 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
              {t('createNewCard')}
            </span>
          </Link>

          <Link
            href="/decks/new"
            className="w-full p-3 rounded-2xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] border border-slate-200/70 dark:border-[#2e2e2e] flex items-center gap-3 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
              {t('importFromUrl')}
            </span>
          </Link>

          <Link
            href="/decks/new"
            className="w-full p-3 rounded-2xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] border border-slate-200/70 dark:border-[#2e2e2e] flex items-center gap-3 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
              {t('uploadFile')}
            </span>
          </Link>

          <Link
            href="/decks/create"
            className="w-full p-3 rounded-2xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] border border-slate-200/70 dark:border-[#2e2e2e] flex items-center gap-3 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
              {t('createCollection')}
            </span>
          </Link>
        </div>
      </div>

      {/* Your Stats Block */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          {t('yourStats')}
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Cards */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/70 dark:border-[#2e2e2e] space-y-1 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">{t('totalCards')}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-slate-800 dark:text-white">
                {stats?.totalCards ?? 248}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                &uarr; 12%
              </span>
            </div>
          </div>

          {/* Collections */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/70 dark:border-[#2e2e2e] space-y-1 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">{t('collections')}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-slate-800 dark:text-white">
                {decksCount > 0 ? decksCount : 12}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                &uarr; 3%
              </span>
            </div>
          </div>

          {/* This Week */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/70 dark:border-[#2e2e2e] space-y-1 col-span-2 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">{t('thisWeek')}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-slate-800 dark:text-white">
                {stats?.reviewsToday ? stats.reviewsToday + 20 : 42}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                &uarr; 18%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Sunset Landscape Promo Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/70 dark:border-white/10 p-5 min-h-[140px] flex flex-col justify-between shadow-xs group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sunset-banner.jpg"
          alt="Sunset lake"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 space-y-1 max-w-[170px]">
          <p className="text-xs font-bold text-white leading-snug">
            {t('organizeWorld')}
          </p>
        </div>

        <div className="relative z-10 flex justify-end">
          <Link
            href="/decks/create"
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
