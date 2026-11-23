'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, Zap, Play } from 'lucide-react';
import { DeckIcon } from '@/components/DeckIcon';
import { FlagIcon } from '@/components/FlagIcon';
import { Deck, AccentTheme } from './dashboardTypes';
import { useI18n } from '@/lib/i18n';

interface CollectionsCarouselProps {
  decks: Deck[];
  loading: boolean;
  currentAccent: AccentTheme;
  scrollRowRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (direction: 'left' | 'right') => void;
  getFlagCode: (lang?: string) => string;
}

const SCENIC_COVERS = [
  'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=500&auto=format&fit=crop&q=80', // Fuji
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&auto=format&fit=crop&q=80', // Italy
  'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&auto=format&fit=crop&q=80', // Korea
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&auto=format&fit=crop&q=80', // China
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&auto=format&fit=crop&q=80', // Tokyo
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&auto=format&fit=crop&q=80', // Santorini
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=500&auto=format&fit=crop&q=80', // Temple
];

export const CollectionsCarouselSection: React.FC<CollectionsCarouselProps> = ({
  decks,
  loading,
  currentAccent,
  scrollRowRef,
  onScroll,
  getFlagCode,
}) => {
  const { t } = useI18n();

  return (
    <section className="space-y-4 pt-4 border-t border-slate-200/70 dark:border-[#272727]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#192338] dark:text-white tracking-tight">
            {t('yourCollections')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('collectionsSubtitle')}
          </p>
        </div>

        {/* Right Controls: Left/Right Navigation Arrows + New Collection Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1f1f1f] p-1 rounded-xl border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs">
            <button
              type="button"
              onClick={() => onScroll('left')}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onScroll('right')}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/decks/create"
            style={{
              backgroundColor: currentAccent.subtleBg,
              borderColor: currentAccent.border,
              color: currentAccent.primary,
            }}
            className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('newCollection')}
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 overflow-hidden py-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[320px] shrink-0 h-72 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] animate-pulse"
            />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-[#333] bg-white/50 dark:bg-[#1f1f1f]/50 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('noCollectionsSearch')}</p>
          <Link
            href="/decks/create"
            style={{ color: currentAccent.primary }}
            className="text-xs font-bold hover:underline inline-block"
          >
            {t('createANewCollection')}
          </Link>
        </div>
      ) : (
        <div
          ref={scrollRowRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {decks.map((deck, idx) => {
            const cardCount = deck.cards ? deck.cards.length : 0;
            const coverImage = SCENIC_COVERS[idx % SCENIC_COVERS.length];
            const targetFlag = getFlagCode(deck.language);

            return (
              <div
                key={deck.id}
                style={{ scrollSnapAlign: 'start' }}
                className="w-[280px] sm:w-[320px] shrink-0 bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-200/70 dark:border-[#2e2e2e] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Header / Scenic Cover Image */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={deck.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Card Count Pill */}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-mono border border-white/15">
                    {cardCount} {t('cardsCount')}
                  </span>

                  {/* Level badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-white/20">
                    {deck.level || t('beginner')}
                  </span>
                </div>

                {/* Overlapping Deck Icon */}
                <div className="relative px-4 -mt-4 z-10 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838] shadow-md flex items-center justify-center text-lg text-slate-800 dark:text-white">
                    <DeckIcon icon={deck.icon} />
                  </div>
                  {/* Language Flag Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#282828] border border-slate-200/60 dark:border-[#383838] text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <FlagIcon code={targetFlag} size="sm" />
                    <span>{deck.language}</span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-1">
                      {deck.title}
                    </h3>
                    {deck.description ? (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {deck.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-1">
                        {t('spacedRepetitionCollection')}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-[#2a2a2a]">
                    <Link
                      href={`/quiz/${deck.id}`}
                      className="flex-1 py-1.5 px-2.5 rounded-xl text-center text-xs font-semibold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#333] border border-slate-200 dark:border-[#383838] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{t('quiz')}</span>
                    </Link>
                    <Link
                      href={`/study/${deck.id}`}
                      style={{ backgroundColor: currentAccent.primary }}
                      className="flex-1 py-1.5 px-2.5 rounded-xl text-center text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t('study')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
