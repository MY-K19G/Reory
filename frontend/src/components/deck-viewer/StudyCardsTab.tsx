'use client';

import React from 'react';
import Link from 'next/link';
import {
  Volume2,
  Bookmark,
  Info,
  Loader2,
  Sparkles,
  ArrowLeft,
  RotateCw,
  Plus,
  BookOpen,
  Headphones,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { Flashcard } from './types';
import { WordDetails } from '@/lib/types';
import { StudyCardsToolbar } from './StudyCardsToolbar';

interface StudyCardsTabProps {
  onEditCard?: () => void;
  viewMode: 'single' | 'grid';
  setViewMode: (val: 'single' | 'grid') => void;
  displayCards: Flashcard[];
  currentCardIndex: number;
  setCurrentCardIndex: (updater: number | ((curr: number) => number)) => void;
  handlePrev: () => void;
  handleNext: () => void;
  cardCategoryFilter: string;
  setCardCategoryFilter: (cat: string) => void;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  allCardTags: string[];
  isSearchInputOpen: boolean;
  setIsSearchInputOpen: (val: boolean) => void;
  cardSearchQuery: string;
  setCardSearchQuery: (q: string) => void;
  cardSortOrder: 'default' | 'alpha' | 'alpha-desc';
  setCardSortOrder: (order: 'default' | 'alpha' | 'alpha-desc') => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  currentCard: Flashcard | null;
  deckId: string;
  wordCoverMap: Record<string, string>;
  selectedWordDetails: WordDetails | null;
  cardOrientation: string;
  deckLanguage: { targetLang: string; nativeLang: string };
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  playVoice: (word: string) => void;
  isPlayingAudio: boolean;
  handleShowDetails: () => void;
  loadingWordDetails: boolean;
  isSaved: boolean;
  setIsSaved: (val: boolean) => void;
  showRomaji: boolean;
  showMnemonics: boolean;
  showExamples: boolean;
}

export const StudyCardsTab: React.FC<StudyCardsTabProps> = ({
  onEditCard,
  viewMode,
  setViewMode,
  displayCards,
  currentCardIndex,
  setCurrentCardIndex,
  handlePrev,
  handleNext,
  cardCategoryFilter,
  setCardCategoryFilter,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  allCardTags,
  isSearchInputOpen,
  setIsSearchInputOpen,
  cardSearchQuery,
  setCardSearchQuery,
  cardSortOrder,
  setCardSortOrder,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  currentCard,
  deckId,
  wordCoverMap,
  selectedWordDetails,
  cardOrientation,
  deckLanguage,
  isFlipped,
  setIsFlipped,
  playVoice,
  isPlayingAudio,
  handleShowDetails,
  loadingWordDetails,
  isSaved,
  setIsSaved,
  showRomaji,
  showMnemonics,
  showExamples,
}) => {
  return (
    <div className="space-y-4">
      {/* Viewer Control Bar */}
      <StudyCardsToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        displayCards={displayCards}
        currentCardIndex={currentCardIndex}
        handlePrev={handlePrev}
        handleNext={handleNext}
        cardCategoryFilter={cardCategoryFilter}
        setCardCategoryFilter={setCardCategoryFilter}
        isCategoryDropdownOpen={isCategoryDropdownOpen}
        setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
        allCardTags={allCardTags}
        isSearchInputOpen={isSearchInputOpen}
        setIsSearchInputOpen={setIsSearchInputOpen}
        cardSearchQuery={cardSearchQuery}
        setCardSearchQuery={setCardSearchQuery}
        cardSortOrder={cardSortOrder}
        setCardSortOrder={setCardSortOrder}
        isSortDropdownOpen={isSortDropdownOpen}
        setIsSortDropdownOpen={setIsSortDropdownOpen}
        setCurrentCardIndex={setCurrentCardIndex}
      />

      {/* View Mode: Single Big Flashcard OR All Cards Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {displayCards.map((c, idx) => (
            <div
              key={c.id || idx}
              onClick={() => {
                setCurrentCardIndex(idx);
                setViewMode('single');
              }}
              className="p-4 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs hover:border-accent-primary/60 dark:hover:border-cyan-500/60 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                  {(!c.status || c.status === 'NEW' || (c.repetitions || 0) === 0) ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      NEW
                    </span>
                  ) : c.status === 'MASTERED' ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      MASTERED
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      LEARNING
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {c.tags.slice(0, 1).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-primary/10 text-accent-primary dark:text-cyan-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-accent-primary dark:group-hover:text-cyan-400 transition-colors">
                {c.word}
              </h4>
              {c.reading && c.reading !== c.word && (
                <p className="text-[11px] text-slate-400 font-medium">/{c.reading}/</p>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {c.translation}
              </p>
            </div>
          ))}
          {displayCards.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs">
              No cards match &ldquo;{cardSearchQuery}&rdquo; {cardCategoryFilter !== 'All' ? `in ${cardCategoryFilter}` : ''}.
            </div>
          )}
        </div>
      ) : !currentCard ? (
        <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-10 sm:p-14 text-center border border-slate-100 dark:border-[#2e2e2e] shadow-xs flex flex-col items-center justify-center space-y-4 min-h-[360px]">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">This deck is currently empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              There are no cards in this deck yet. Add cards manually or use AI to generate vocabulary.
            </p>
          </div>
          <Link
            href={`/decks/new?deckId=${deckId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary hover:opacity-90 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Card</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Big Interactive Flashcard */}
          <div className="relative bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-9 shadow-sm border border-slate-100 dark:border-[#2e2e2e] min-h-[380px] flex flex-col justify-between overflow-hidden group transition-colors">
            {/* Word Cover illustration */}
            {(() => {
              const activeCoverImage =
                currentCard?.imageUrl ||
                (selectedWordDetails && currentCard?.word && selectedWordDetails.word.toLowerCase() === currentCard.word.toLowerCase()
                  ? (selectedWordDetails.pexelsPhotos?.[0]?.src || selectedWordDetails.images?.[0])
                  : null) ||
                (currentCard?.word && wordCoverMap[currentCard.word]) ||
                'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&auto=format&fit=crop&q=80';

              return (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, transparent 18%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.85) 60%, black 75%)',
                    maskImage:
                      'linear-gradient(to right, transparent 0%, transparent 18%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.85) 60%, black 75%)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={activeCoverImage}
                    src={activeCoverImage}
                    alt={`${currentCard.word} cover`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-right opacity-90 dark:opacity-40 transition-opacity duration-500"
                  />
                </div>
              );
            })()}

            {/* Card Header: Language badge, status badge, speaker audio & bookmark */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md">
                  {cardOrientation === 'meaning-first' && !isFlipped
                    ? (deckLanguage.nativeLang || 'English')
                    : (deckLanguage.targetLang || 'Japanese')}
                </span>

                {/* Card Learning Status Badge */}
                {(!currentCard.status || currentCard.status === 'NEW' || (currentCard.repetitions || 0) === 0) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    New
                  </span>
                ) : currentCard.status === 'MASTERED' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Mastered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Learning
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => playVoice(currentCard.word)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-[#5551f3] dark:bg-cyan-500 text-white'
                      : 'text-slate-400 hover:text-accent-primary dark:hover:text-cyan-400 hover:bg-accent-primary/10 dark:hover:bg-white/10'
                  }`}
                  title="Pronounce word"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShowDetails}
                  disabled={loadingWordDetails}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/15 text-slate-600 dark:text-slate-200 text-xs font-medium tracking-tight transition-all cursor-pointer backdrop-blur-xs border border-slate-200/60 dark:border-white/5 shadow-2xs"
                  title="Word Details & Notes"
                >
                  {loadingWordDetails ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500 dark:text-slate-300" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  )}
                  <span>Word Details & Notes</span>
                </button>

                {onEditCard && (
                  <button
                    type="button"
                    onClick={onEditCard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/15 text-slate-600 dark:text-slate-200 text-xs font-medium tracking-tight transition-all cursor-pointer backdrop-blur-xs border border-slate-200/60 dark:border-white/5 shadow-2xs"
                    title="Edit Note"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Edit Note</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-2xs border ${
                    isSaved
                      ? 'bg-[#eef2fe] dark:bg-cyan-500/20 border-[#5551f3]/30 dark:border-cyan-400/40 text-accent-primary dark:text-cyan-400'
                      : 'bg-white/85 dark:bg-[#282828]/85 hover:bg-white dark:hover:bg-[#333] border-slate-200/90 dark:border-[#383838] text-slate-600 dark:text-slate-200 hover:text-accent-primary dark:hover:text-cyan-400'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save card'}
                >
                  <Bookmark
                    className={`w-4 h-4 transition-transform ${
                      isSaved
                        ? 'fill-[#5551f3] text-accent-primary dark:fill-cyan-400 dark:text-cyan-400 scale-105'
                        : 'text-slate-600 dark:text-slate-200'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Card Center: Dynamic Content */}
            <div className="relative z-10 space-y-2.5 my-5">
              {cardOrientation === 'audio-only' && !isFlipped ? (
                <div className="py-4 space-y-3 text-left">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                    <Headphones className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Listening Mode</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                    Listen to the word & recall the meaning
                  </h2>
                  <button
                    type="button"
                    onClick={() => playVoice(currentCard.word)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio Prompt</span>
                  </button>
                </div>
              ) : cardOrientation === 'meaning-first' && !isFlipped ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recall Target Word:
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] dark:text-white tracking-tight">
                    {currentCard.translation}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">Click flip below to reveal the word & reading</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] dark:text-white tracking-tight">
                    {currentCard.word}
                  </h2>
                  {showRomaji && currentCard.reading && (
                    <p className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-400">
                      {currentCard.reading}
                    </p>
                  )}
                  {(isFlipped || cardOrientation !== 'meaning-first') && (
                    <p className="text-base sm:text-lg font-bold text-[#1e293b] dark:text-slate-100 pt-0.5">
                      {currentCard.translation}
                    </p>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentCard.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-0.5 rounded-full bg-accent-primary/10 dark:bg-white/10 text-accent-primary dark:text-slate-200 text-xs font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Mnemonics - only show if card has an explicit hint added */}
              {showMnemonics && Boolean(currentCard.hint && currentCard.hint.trim()) && (
                <div className="pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Memory Hint: &ldquo;{currentCard.hint}&rdquo;</span>
                  </div>
                </div>
              )}
            </div>

            {/* Example Sentence Box */}
            {showExamples && (
              <div className="relative z-10 rounded-2xl bg-white/75 dark:bg-[#282828]/80 backdrop-blur-[2px] border border-slate-100/90 dark:border-[#2e2e2e] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-accent-primary dark:text-white" />
                    <span>Example</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white leading-snug">
                    {currentCard.exampleOriginal}
                  </p>
                  {showRomaji && currentCard.exampleReading && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                      {currentCard.exampleReading}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">
                    {currentCard.exampleTranslation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => playVoice(currentCard.exampleOriginal)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#eef2fe] dark:bg-[#282828] hover:bg-[#e4ebfd] dark:hover:bg-cyan-500/25 text-accent-primary dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer self-start sm:self-center shrink-0"
                >
                  <Volume2 className="w-4 h-4 fill-[#5551f3] dark:fill-cyan-400" />
                  <span>{currentCard.audioDuration}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Navigation Toolbar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-[#2e2e2e] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex-1" />

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-primary dark:bg-accent-primary hover:opacity-90 dark:hover:opacity-90 text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
