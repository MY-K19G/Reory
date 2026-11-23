'use client';

import {
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown,
  Volume2,
  Bookmark,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { Flashcard } from './types';

interface DeckFlashcardViewerProps {
  currentCard: Flashcard;
  currentCardIndex: number;
  totalCards: number;
  sourceLang: string;
  onPrev: () => void;
  onNext: () => void;
  playVoice: (text: string) => void;
  isPlayingAudio: boolean;
  isSaved: boolean;
  onToggleSaved: () => void;
}

export function DeckFlashcardViewer({
  currentCard,
  currentCardIndex,
  totalCards,
  sourceLang,
  onPrev,
  onNext,
  playVoice,
  isPlayingAudio,
  isSaved,
  onToggleSaved,
}: DeckFlashcardViewerProps) {
  return (
    <div className="space-y-4">
      {/* Viewer Control Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] rounded-xl text-slate-400 shadow-2xs">
            <button
              type="button"
              className="p-1 rounded-lg text-accent-primary dark:text-white transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 rounded-lg hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xs text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={onPrev}
              className="p-0.5 rounded hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Previous card"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" />
            </button>
            <span className="px-1 text-slate-600 dark:text-slate-300 font-semibold tracking-wide">
              {currentCardIndex + 1} / {totalCards}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="p-0.5 rounded hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Next card"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span>All Cards</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/80 dark:border-[#2e2e2e] text-slate-500 dark:text-slate-400 shadow-2xs transition-colors cursor-pointer"
            title="Search cards"
          >
            <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/80 dark:border-[#2e2e2e] text-slate-500 dark:text-slate-400 shadow-2xs transition-colors cursor-pointer"
            title="Filter cards"
          >
            <Filter className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/80 dark:border-[#2e2e2e] text-slate-500 dark:text-slate-400 shadow-2xs transition-colors cursor-pointer"
            title="Sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Big Interactive Flashcard */}
      <div className="relative bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-9 shadow-sm border border-slate-100 dark:border-[#2e2e2e] min-h-[380px] flex flex-col justify-between overflow-hidden group">
        <div className="absolute right-0 top-0 bottom-0 w-[54%] overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&auto=format&fit=crop&q=80"
            alt="Scenic Mount Fuji"
            className="w-full h-full object-cover object-right opacity-80 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-35% to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/85 dark:via-35% dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 dark:from-[#1f1f1f] dark:via-transparent dark:to-[#1f1f1f]/40" />
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md">
              {sourceLang}
            </span>
            <button
              type="button"
              onClick={() => playVoice(currentCard.word)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#5551f3] text-white'
                  : 'text-slate-400 hover:text-accent-primary dark:hover:text-cyan-400 hover:bg-accent-primary/10 dark:hover:bg-white/5'
              }`}
              title="Pronounce word"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              onClick={onToggleSaved}
              className="p-1 rounded-md hover:text-accent-primary dark:hover:text-cyan-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isSaved ? 'fill-[#5551f3] dark:fill-cyan-400 text-accent-primary dark:text-white' : 'text-slate-400'
                }`}
              />
            </button>
            <button type="button" className="p-1 rounded-md hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Center: Main Script, Reading & Translation */}
        <div className="relative z-10 space-y-3 my-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] dark:text-white tracking-tight">
            {currentCard.word}
          </h2>
          <p className="text-sm font-medium text-slate-400">{currentCard.reading}</p>
          <p className="text-lg font-bold text-[#1e293b] dark:text-slate-100 pt-1">
            {currentCard.translation}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {currentCard.tags.map((t) => (
              <span
                key={t}
                className="px-3.5 py-1 rounded-full bg-accent-primary/10 dark:bg-[#282828] text-accent-primary dark:text-slate-200 border border-transparent dark:border-cyan-500/20 text-xs font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Example Sentence Box */}
        <div className="relative z-10 rounded-2xl bg-white/75 dark:bg-[#282828]/80 backdrop-blur-[2px] border border-slate-100/90 dark:border-[#2e2e2e] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-accent-primary dark:text-white" />
              <span>Example</span>
            </div>
            <p className="text-base font-bold text-[#1e293b] dark:text-white">
              {currentCard.exampleOriginal}
            </p>
            <p className="text-xs text-slate-400 font-medium">{currentCard.exampleReading}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {currentCard.exampleTranslation}
            </p>
          </div>

          <button
            type="button"
            onClick={() => playVoice(currentCard.exampleOriginal)}
            className="self-end sm:self-center p-2 rounded-full text-slate-400 hover:text-accent-primary dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
            title="Pronounce example sentence"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
