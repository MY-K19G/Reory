'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { BookmarkedDeckItem } from './types';

interface BookmarksRecentDecksProps {
  decks: BookmarkedDeckItem[];
}

export function BookmarksRecentDecks({ decks }: BookmarksRecentDecksProps) {
  const router = useRouter();
  const { t } = useI18n();

  if (decks.length === 0) return null;

  return (
    <div className="mt-8 bg-white dark:bg-[#1f1f1f] rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100/90 dark:border-[#2e2e2e] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Label */}
      <div className="text-xs font-bold text-[#1e293b] dark:text-white shrink-0">{t('recentlyViewed')}</div>

      {/* Items Row */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 flex-1 min-w-0">
        {decks.slice(0, 4).map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/study/${item.id}`)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            {/* Thumbnail Circle */}
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-[#383838] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Text info */}
            <div>
              <div className="text-xs font-bold text-[#1e293b] dark:text-slate-200 transition-colors leading-tight truncate max-w-[150px]">
                {item.title}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                {item.cardCount} {t('cards')} &bull; {item.lastStudied}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick arrow */}
      <button
        type="button"
        onClick={() => router.push('/history?tab=decks')}
        className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#282828] hover:bg-slate-100 dark:hover:bg-[#333333] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title={t('viewRecentDecksInHistory')}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
