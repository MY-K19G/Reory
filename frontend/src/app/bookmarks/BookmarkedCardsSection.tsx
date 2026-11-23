'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { Volume2, Star, ArrowRight } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { BookmarkedCardItem } from './types';

interface BookmarkedCardsSectionProps {
  cards: BookmarkedCardItem[];
  viewMode: 'grid' | 'list';
  playingWordId: string | number | null;
  onPlayWordAudio: (word: string, lang: string, id: string | number) => void;
  onToggleCardBookmark: (id: string | number) => void;
}

export function BookmarkedCardsSection({
  cards,
  viewMode,
  playingWordId,
  onPlayWordAudio,
  onToggleCardBookmark,
}: BookmarkedCardsSectionProps) {
  const { t } = useI18n();
  if (cards.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">{t('noBookmarkedCards')}</h3>
        <p className="text-xs text-slate-400">{t('noBookmarkedCardsDesc')}</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#2e2e2e] shadow-xs hover:border-slate-200 dark:hover:border-[#383838] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <button
                type="button"
                onClick={() => onPlayWordAudio(card.word, card.language, card.id)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#252525] text-slate-500 dark:text-slate-300 hover:text-accent-primary shrink-0 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#1e293b] dark:text-white leading-tight">
                    {card.word}
                  </span>
                  {card.reading && (
                    <span className="text-xs text-slate-400 font-medium">({card.reading})</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {card.translation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <Link
                href={`/study/${card.deckId}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#252525] text-[11px] font-semibold text-slate-600 dark:text-slate-300"
              >
                <FlagIcon code={card.languageFlag} className="w-3 h-3" />
                <span>{card.deckTitle}</span>
              </Link>

              <button
                type="button"
                onClick={() => onToggleCardBookmark(card.id)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-amber-400 transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </button>

              <Link
                href={`/study/${card.deckId}`}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-accent-primary"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#2e2e2e] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 group"
        >
          {/* Header: Deck origin & Star button */}
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/study/${card.deckId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#303030] text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors truncate max-w-[70%]"
              title={card.deckTitle}
            >
              <FlagIcon code={card.languageFlag} className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{card.deckTitle}</span>
            </Link>

            <button
              type="button"
              onClick={() => onToggleCardBookmark(card.id)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-amber-400 transition-colors cursor-pointer"
              title={t('removeBookmark')}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </button>
          </div>

          {/* Word & Pronunciation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black text-[#1e293b] dark:text-white leading-tight">
                {card.word}
              </h3>
              <button
                type="button"
                onClick={() => onPlayWordAudio(card.word, card.language, card.id)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  playingWordId === card.id
                    ? 'bg-accent-primary text-white scale-110'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
                title={t('listenPronunciation')}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {card.reading && (
              <p className="text-xs font-medium text-slate-400">{card.reading}</p>
            )}
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 pt-1 leading-snug">
              {card.translation}
            </p>
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {card.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] font-semibold text-slate-500 dark:text-slate-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Example sentence */}
          {card.exampleSentence && (
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
              &ldquo;{card.exampleSentence}&rdquo;
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{card.bookmarkedAt}</span>
            <Link
              href={`/study/${card.deckId}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-primary dark:text-cyan-400 hover:underline"
            >
              <span>{t('study')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
