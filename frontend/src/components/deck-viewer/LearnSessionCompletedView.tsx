'use client';

import React from 'react';
import { Award } from 'lucide-react';

interface LearnSessionCompletedViewProps {
  totalCards: number;
  sessionStats: { again: number; hard: number; good: number; easy: number };
  onStudyAgain: () => void;
  onClose: () => void;
}

export const LearnSessionCompletedView: React.FC<LearnSessionCompletedViewProps> = ({
  totalCards,
  sessionStats,
  onStudyAgain,
  onClose,
}) => {
  return (
    <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-300 p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
        <Award className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Session Completed! 🎉</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Great focus! You reviewed all {totalCards} cards in this deck.
        </p>
      </div>

      {/* Session Metrics */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-lg font-black text-rose-500 dark:text-rose-400 block">{sessionStats.again}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Again</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-lg font-black text-amber-500 dark:text-amber-400 block">{sessionStats.hard}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Hard</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-lg font-black text-blue-500 dark:text-blue-400 block">{sessionStats.good}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Good</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-lg font-black text-emerald-500 dark:text-emerald-400 block">{sessionStats.easy}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Easy</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onStudyAgain}
          className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition cursor-pointer"
        >
          Study Again
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl bg-accent-primary hover:opacity-90 text-white font-bold text-xs transition cursor-pointer shadow-lg"
        >
          Back to Deck
        </button>
      </div>
    </div>
  );
};
