'use client';

import React from 'react';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { VocabCardItem, AccentTheme } from './dashboardTypes';
import { useI18n } from '@/lib/i18n';

interface RecentCardsSectionProps {
  cards: VocabCardItem[];
  categories?: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  currentAccent: AccentTheme;
}

export const RecentCardsSection: React.FC<RecentCardsSectionProps> = ({
  cards,
  categories,
  selectedCategory,
  onSelectCategory,
  currentAccent,
}) => {
  const { t } = useI18n();

  const effectiveCategories =
    categories && categories.length > 0
      ? categories
      : ['All', ...Array.from(new Set(cards.map((c) => c.category).filter(Boolean)))];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#192338] dark:text-white tracking-tight">
            {t('recentFlashcards')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('recentFlashcardsSubtitle')}
          </p>
        </div>

        {/* Category Filter Pills */}
        {effectiveCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {effectiveCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              const displayLabel = cat === 'All' ? t('all') : cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  style={
                    isActive
                      ? {
                        backgroundColor: currentAccent.primary,
                        borderColor: currentAccent.primary,
                        color: '#ffffff',
                      }
                      : undefined
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${isActive
                    ? 'shadow-xs'
                    : 'bg-white dark:bg-[#1f1f1f] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-[#2e2e2e] hover:border-slate-300 dark:hover:border-[#3d3d3d]'
                    }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/70 dark:border-[#2e2e2e] p-8 sm:p-10 text-center space-y-3">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {t('noFlashcardsYet')}
          </p>
          <Link
            href="/decks/create"
            style={{ backgroundColor: currentAccent.primary }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity"
          >
            {t('createNewDeckBtn')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/study/${card.deckId}`}
              className="rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/70 dark:border-[#2e2e2e] p-2.5 space-y-2.5 hover:border-slate-300 dark:hover:border-[#383838] transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Card Cover Image */}
                <div className="relative h-24 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.frontWord}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  {/* Category / Part of Speech badge on top of image */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md border ${card.tagColor}`}>
                      {card.partOfSpeech || card.category}
                    </span>
                  </div>
                </div>

                {/* Word & Details */}
                <div className="space-y-1">
                  {/* Language Pair Direction (e.g. Japanese -> English) */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-[#282828] border border-slate-200/60 dark:border-[#383838]">
                      <FlagIcon code={card.sourceFlag} size="sm" />
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {card.sourceLang}
                      </span>
                      <span className="text-slate-300 dark:text-slate-500 text-[10px]">&rarr;</span>
                      <FlagIcon code={card.targetFlag} size="sm" />
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {card.targetLang}
                      </span>
                    </div>
                    <MoreHorizontal className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>

                  {/* Exact Target Word */}
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate pt-0.5">
                    {card.frontWord}
                  </h3>

                  {/* Phonetic / Reading */}
                  {card.phonetic ? (
                    <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 truncate">
                      [{card.phonetic}]
                    </p>
                  ) : null}

                  {/* Translation / Meaning */}
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                    {card.backTranslation}
                  </p>
                </div>
              </div>

              {/* Card footer indicator */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#2a2a2a] flex items-center justify-between text-[10px] text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-[9px] text-slate-400 dark:text-slate-500">
                  {card.category}
                </span>
                <span
                  style={{ color: currentAccent.primary }}
                  className="font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                >
                  {t('studyWithArrow')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
