'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Flame } from 'lucide-react';

interface WordSkeletonLoaderProps {
  word: string;
  isComplete?: boolean;
  isWordOfTheDay?: boolean;
}

const REGULAR_STEPS = [
  'Analyzing phonetics & linguistic roots...',
  'Synthesizing "Understand the word" mental model...',
  'Curating natural sentences & word family...',
  'Connecting visual memory associations...',
];

const WOD_STEPS = [
  'Selecting today\'s featured vocabulary...',
  'Synthesizing Word of the Day mental model...',
  'Curating contextual sentences & cultural nuances...',
  'Polishing daily vocabulary flashcard...',
];

export function WordSkeletonLoader({
  word,
  isComplete = false,
  isWordOfTheDay = false,
}: WordSkeletonLoaderProps) {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = isWordOfTheDay ? WOD_STEPS : REGULAR_STEPS;

  useEffect(() => {
    // If complete, immediately animate to 100%
    if (isComplete) {
      setProgress(100);
      return;
    }

    // Steady organic monotonic progression: never loops back to 0
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92; // Holds at 92% until result arrives, never restarts
        const increment = Math.max(1, Math.floor((92 - prev) * 0.12));
        return Math.min(92, prev + increment);
      });
    }, 400);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isComplete, steps.length]);

  const displayProgress = isComplete ? 100 : progress;

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* ── 1. AI THINKING DYNAMIC BANNER ── */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-5 sm:p-6 shadow-xs border border-indigo-100/90 dark:border-indigo-900/40 relative overflow-hidden transition-colors">
        {/* Top subtle animated gradient beam */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
            isWordOfTheDay
              ? 'from-amber-400 via-orange-500 to-rose-500'
              : 'from-indigo-500 via-purple-500 to-pink-500'
          } animate-pulse`}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl ${
                isWordOfTheDay
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/40 text-amber-500 dark:text-amber-400'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100/80 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400'
              } border flex items-center justify-center shadow-2xs shrink-0`}
            >
              {isWordOfTheDay ? (
                <Flame className="w-5 h-5 animate-pulse text-amber-500 dark:text-amber-400" />
              ) : (
                <Sparkles className="w-5 h-5 animate-spin duration-1000" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isWordOfTheDay
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {isWordOfTheDay ? 'Creating Word of the Day' : 'AI Linguistic Intelligence'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-ping ${
                    isWordOfTheDay ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all duration-300">
                {displayProgress === 100
                  ? isWordOfTheDay
                    ? 'Finalizing today\'s featured word...'
                    : 'Finalizing word intelligence...'
                  : steps[stepIndex]}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-56 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-400">
              <span className="truncate mr-2">
                {isWordOfTheDay
                  ? word && word !== 'word'
                    ? `Curating Word of the Day: "${word}"`
                    : 'Generating Word of the Day...'
                  : `Generating "${word}"`}
              </span>
              <span
                className={`tabular-nums font-bold shrink-0 ${
                  isWordOfTheDay ? 'text-amber-500 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {displayProgress}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isWordOfTheDay
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. HERO WORD CARD SKELETON ── */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 dark:border-white/5 relative overflow-hidden transition-colors">
        <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-5 sm:gap-7">
          {/* Left Column Skeleton */}
          <div className="flex-1 min-w-0 space-y-3.5 w-full">
            {/* Word Title Shimmer */}
            <div className="h-9 w-40 sm:w-48 bg-slate-200/90 dark:bg-white/10 rounded-xl animate-shimmer" />

            {/* Phonetics & Speaker Shimmer */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="h-4 w-28 bg-slate-100 dark:bg-white/5 rounded-md animate-shimmer" />
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
            </div>

            {/* Part of Speech Pill Shimmer */}
            <div className="h-5 w-16 bg-slate-100 dark:bg-white/5 rounded-full animate-shimmer" />

            {/* Definition Lines Shimmer */}
            <div className="space-y-2 pt-1 max-w-md">
              <div className="h-3.5 w-full bg-slate-100 dark:bg-white/5 rounded-md animate-shimmer" />
              <div className="h-3.5 w-4/5 bg-slate-100 dark:bg-white/5 rounded-md animate-shimmer" />
            </div>

            {/* Action Buttons Shimmer */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="h-8 w-20 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-800/40 animate-shimmer" />
              <div className="h-8 w-20 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
              <div className="h-8 w-28 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
            </div>
          </div>

          {/* Right Column: Hero Image Shimmer */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/70 dark:from-[#252525] dark:to-[#1a1a1a] border border-slate-100 dark:border-white/5 shrink-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2 animate-shimmer">
            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Loading photo...</span>
          </div>
        </div>
      </div>

      {/* ── 3. TAB NAVIGATION SKELETON ── */}
      <div className="flex items-center gap-2 px-1 py-1.5">
        <div className="h-8 w-20 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
        <div className="h-8 w-24 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
        <div className="h-8 w-24 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
        <div className="h-8 w-20 rounded-full bg-slate-100 dark:bg-white/5 animate-shimmer" />
      </div>

      {/* ── 4. STACKED ACCORDION CARDS SKELETON ── */}
      <div className="space-y-3.5">
        {/* Card 1: Understand the word */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-white/5 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 animate-shimmer" />
              <div className="h-4 w-36 bg-slate-200 dark:bg-white/10 rounded-md animate-shimmer" />
            </div>
            <div className="w-4 h-4 bg-slate-100 dark:bg-white/5 rounded animate-shimmer" />
          </div>
          <div className="pl-11 space-y-2.5">
            <div className="h-3.5 w-3/4 bg-slate-100 dark:bg-white/5 rounded animate-shimmer" />
            <div className="h-14 w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl p-3 animate-shimmer" />
          </div>
        </div>

        {/* Card 2: Translation */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-white/5 space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 animate-shimmer" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-white/10 rounded-md animate-shimmer" />
            </div>
            <div className="h-6 w-24 bg-slate-100 dark:bg-white/5 rounded-full animate-shimmer" />
          </div>
          <div className="pl-11 pt-1 space-y-1.5">
            <div className="h-5 w-32 bg-slate-200 dark:bg-white/10 rounded animate-shimmer" />
            <div className="h-3.5 w-48 bg-slate-100 dark:bg-white/5 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
