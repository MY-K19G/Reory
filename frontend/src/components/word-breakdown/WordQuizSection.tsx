'use client';

import React from 'react';
import { HelpCircle, RotateCcw, Check, X, Award } from 'lucide-react';
import { WordQuizQuestion } from '@/lib/types';

interface WordQuizSectionProps {
  quiz: WordQuizQuestion & { answer?: string };
  selectedOption: string | null;
  quizSubmitted: boolean;
  onSelectOption: (option: string) => void;
  onResetQuiz: () => void;
}

export function WordQuizSection({
  quiz,
  selectedOption,
  quizSubmitted,
  onSelectOption,
  onResetQuiz,
}: WordQuizSectionProps) {
  const correctAnswer = quiz.correctAnswer || quiz.answer;

  return (
    <div
      id="section-quiz"
      className="scroll-mt-16 bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-xs border border-slate-100 dark:border-[#2a2a2a] space-y-4 transition-all relative overflow-hidden"
    >
      {/* Header with Quiz badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0 shadow-2xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white leading-none">
              Memory Checkpoint
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Test your recall</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent-subtle text-accent-primary border border-accent-subtle">
            Question 1/1
          </span>
          {quizSubmitted && (
            <button
              type="button"
              onClick={onResetQuiz}
              className="p-1 rounded-lg text-slate-400 hover:text-accent-primary hover:bg-accent-subtle transition-colors cursor-pointer"
              title="Try again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
          {quiz.question}
        </p>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {(quiz.options || []).map((opt: string, i: number) => {
          const isChosen = selectedOption === opt;
          const isCorrect = opt === correctAnswer;

          let btnStyle =
            'bg-slate-50 dark:bg-[#252525] border-slate-200/80 dark:border-[#383838] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2e2e2e]';

          if (quizSubmitted) {
            if (isCorrect) {
              btnStyle =
                'bg-emerald-500/15 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/30';
            } else if (isChosen && !isCorrect) {
              btnStyle =
                'bg-rose-500/15 border-rose-500/50 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/30';
            } else {
              btnStyle = 'opacity-40 bg-slate-50 dark:bg-[#202020] border-transparent text-slate-400';
            }
          } else if (isChosen) {
            btnStyle =
              'bg-accent-primary/10 border-accent-primary text-accent-primary dark:text-white ring-2 ring-accent-primary/20';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={quizSubmitted}
              onClick={() => onSelectOption(opt)}
              className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-md bg-black/5 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="truncate">{opt}</span>
              </div>
              {quizSubmitted && isCorrect && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0 text-xs font-bold">
                  <span>Correct</span>
                  <Check className="w-4 h-4" />
                </div>
              )}
              {quizSubmitted && isChosen && !isCorrect && (
                <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 shrink-0 text-xs font-bold">
                  <span>Incorrect</span>
                  <X className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Instant feedback footer */}
      {quizSubmitted && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1 duration-200 ${
            selectedOption === correctAnswer
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 shrink-0" />
            <span>
              {selectedOption === correctAnswer
                ? 'Great job! You answered correctly.'
                : `Not quite. Correct answer: ${correctAnswer}`}
            </span>
          </div>
          <button
            type="button"
            onClick={onResetQuiz}
            className="font-bold underline cursor-pointer hover:opacity-80 shrink-0 ml-2"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
