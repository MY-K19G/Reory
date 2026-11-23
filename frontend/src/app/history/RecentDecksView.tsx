'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { RecentDeckItem } from './types';

interface RecentDecksViewProps {
  decks: RecentDeckItem[];
  viewMode: 'grid' | 'list';
  currentAccent: AccentOption;
}

export const RecentDecksView: React.FC<RecentDecksViewProps> = ({
  decks,
  viewMode,
  currentAccent,
}) => {
  const router = useRouter();
  const { t } = useI18n();

  if (decks.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] space-y-3">
        <Search className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          {t('noDecksInHistory')}
        </h3>
        <p className="text-xs text-slate-400">
          {t('changeSearchTerm')}
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => router.push(`/study/${deck.id}`)}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xs border border-slate-100 dark:border-[#2e2e2e] flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={deck.coverImage}
                alt={deck.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                {deck.cardCount} {t('cardsCount') || 'cards'}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1e293b] dark:text-white group-hover:text-accent-primary dark:group-hover:text-white transition-colors line-clamp-1">
                  {deck.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FlagIcon code={deck.targetFlag} className="w-3.5 h-3.5" />
                  <span>{deck.targetLang}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100/80 dark:border-white/5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{t('masteryLabel')}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{deck.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-[#252525] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${deck.progressPercent}%`,
                      backgroundColor: currentAccent.primary,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{t('studiedAgo')} {deck.lastStudied}</span>
                  <span
                    style={{ color: currentAccent.primary }}
                    className="font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                  >
                    {t('practiceBtn')} <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* List view */
  return (
    <div className="space-y-2">
      {decks.map((deck) => (
        <div
          key={deck.id}
          onClick={() => router.push(`/study/${deck.id}`)}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#2e2e2e] shadow-xs hover:border-slate-200 dark:hover:border-[#383838] transition-all flex items-center justify-between gap-4 group cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={deck.coverImage} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white group-hover:text-accent-primary dark:group-hover:text-white transition-colors truncate">
                {deck.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <FlagIcon code={deck.targetFlag} className="w-3.5 h-3.5" />
                <span>{deck.targetLang}</span>
                <span>&bull;</span>
                <span>{deck.cardCount} {t('cardsCount') || 'cards'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs text-slate-400 hidden sm:inline">{t('studiedAgo')} {deck.lastStudied}</span>
            <button
              type="button"
              style={{ backgroundColor: currentAccent.subtleBg, color: currentAccent.primary }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all group-hover:scale-105 flex items-center gap-1"
            >
              <span>{t('resumeBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
