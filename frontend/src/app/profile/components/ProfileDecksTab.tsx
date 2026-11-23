'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface ProfileDecksTabProps {
  displayDecks: any[];
  currentAccent: AccentOption;
}

export const ProfileDecksTab: React.FC<ProfileDecksTabProps> = ({
  displayDecks,
  currentAccent,
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-4 transition-colors animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {t('myDecks')}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('profileDecksDesc')}
          </p>
        </div>
        <Link
          href="/my-cards"
          className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <span>{t('viewAllInLibrary')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Square Deck Cards Grid */}
      {displayDecks.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('noDecksCreatedYet')}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            {t('startBuildingLibraryDesc')}
          </p>
          <Link
            href="/decks/new"
            className="mt-3.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: currentAccent.primary }}
          >
            {t('createYourFirstDeck')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-1">
          {displayDecks.map((deck: any) => {
            const percentage = deck.percentage || 0;
            const cardCount = deck.cards?.length || 0;
            const coverImage =
              deck.coverImage ||
              deck.cover ||
              'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&auto=format&fit=crop&q=80';

            return (
              <Link
                key={deck.id}
                href={`/study/${deck.id}`}
                className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-slate-200/60 dark:border-white/5 hover:border-accent-primary/30 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Square-proportioned Cover Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={deck.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top badge */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                      {cardCount} {t('cards').toLowerCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <h3 className="text-xs font-bold text-white truncate drop-shadow-sm">
                      {deck.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>{t('mastery')}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: currentAccent.primary,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

