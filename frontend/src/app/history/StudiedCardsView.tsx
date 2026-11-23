'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, Clock, ArrowRight, Search } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { StudiedCardItem } from './types';

interface StudiedCardsViewProps {
  cards: StudiedCardItem[];
  viewMode: 'grid' | 'list';
  playingWordId: string | number | null;
  playWordAudio: (word: string, lang: string, id: string | number) => void;
  currentAccent: AccentOption;
}

export const StudiedCardsView: React.FC<StudiedCardsViewProps> = ({
  cards,
  viewMode,
  playingWordId,
  playWordAudio,
  currentAccent,
}) => {
  const { t } = useI18n();

  if (cards.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] space-y-3">
        <Search className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          {t('noStudyHistory')}
        </h3>
        <p className="text-xs text-slate-400">
          {t('startStudySessionPrompt')}
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#2e2e2e] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 group"
          >
            {/* Header: Deck info & Status Badge */}
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/study/${card.deckId}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#333] text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors truncate max-w-[65%]"
                title={card.deckTitle}
              >
                <FlagIcon code={card.languageFlag} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{card.deckTitle}</span>
              </Link>

              {/* SRS Status Badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                  card.status === 'again'
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                    : card.status === 'hard'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                    : card.status === 'good'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                }`}
              >
                {card.status === 'again' ? `🔴 ${t('srsAgain')}` : card.status === 'hard' ? `🟠 ${t('srsHard')}` : card.status === 'good' ? `🔵 ${t('srsGood')}` : `🟢 ${t('srsMastered')}`}
              </span>
            </div>

            {/* Card Center: Word & Reading */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-black text-[#1e293b] dark:text-white leading-tight">
                  {card.word}
                </h3>
                <button
                  type="button"
                  onClick={() => playWordAudio(card.word, card.language, card.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    playingWordId === card.id
                      ? 'bg-accent-primary text-white scale-110'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              {card.reading && (
                <p className="text-xs font-medium text-slate-400 dark:text-slate-400">
                  {card.reading}
                </p>
              )}
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 pt-1 leading-snug">
                {card.translation}
              </p>
            </div>

            {/* Example sentence */}
            {card.exampleSentence && (
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                &ldquo;{card.exampleSentence}&rdquo;
              </div>
            )}

            {/* Footer: Reviewed Time & Action Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{card.reviewedAt}</span>
              </span>
              <Link
                href={`/study/${card.deckId}`}
                style={{ color: currentAccent.primary }}
                className="inline-flex items-center gap-1 text-[11px] font-bold hover:underline"
              >
                <span>{t('studyAction')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* List view */
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
              onClick={() => playWordAudio(card.word, card.language, card.id)}
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

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                card.status === 'again'
                  ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                  : card.status === 'hard'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : card.status === 'good'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {card.status === 'again' ? t('srsAgain') : card.status === 'hard' ? t('srsHard') : card.status === 'good' ? t('srsGood') : t('srsMastered')}
            </span>

            <span className="text-xs text-slate-400 hidden md:inline">{card.reviewedAt}</span>

            <Link
              href={`/study/${card.deckId}`}
              style={{ color: currentAccent.primary }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
