'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Settings, Volume2, Headphones } from 'lucide-react';
import { speakWord } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { Flashcard } from './types';
import { Deck } from '@/lib/types';
import { LearnSessionCompletedView } from './LearnSessionCompletedView';
import { LearnSessionSettingsModal } from './LearnSessionSettingsModal';

interface LearnSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiDeck: Deck | null;
  preset: { title?: string; sourceLang?: string };
  deckId: string | number;
  sessionCards: Flashcard[];
  autoPlayAudio: boolean;
  setAutoPlayAudio: (val: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (val: number) => void;
  cardOrientation: 'term-first' | 'meaning-first' | 'audio-only';
  setCardOrientation: (val: 'term-first' | 'meaning-first' | 'audio-only') => void;
  showRomaji: boolean;
  setShowRomaji: (val: boolean) => void;
  showExamples: boolean;
  setShowExamples: (val: boolean) => void;
  showMnemonics: boolean;
  cramMode: boolean;
  dailyNewCards: number;
  reviewOrder: string;
  mcqOptionsCount: number;
  allowForking: boolean;
  deckLanguage: { targetLang: string; nativeLang: string };
  onStartStudySession: () => void;
  onSubmitCardReview: (cardId: number, grade: number) => Promise<unknown>;
}

export const LearnSessionModal: React.FC<LearnSessionModalProps> = ({
  isOpen,
  onClose,
  apiDeck,
  preset,
  deckId,
  sessionCards,
  autoPlayAudio,
  setAutoPlayAudio,
  ttsSpeed,
  setTtsSpeed,
  cardOrientation,
  setCardOrientation,
  showRomaji,
  setShowRomaji,
  showExamples,
  setShowExamples,
  showMnemonics,
  cramMode,
  dailyNewCards,
  reviewOrder,
  mcqOptionsCount,
  allowForking,
  deckLanguage,
  onStartStudySession,
  onSubmitCardReview,
}) => {
  const { t } = useI18n();
  const [sessionCardIndex, setSessionCardIndex] = useState(() => {
    // Restore card position from URL on initial mount
    if (typeof window === 'undefined') return 0;
    try {
      const params = new URLSearchParams(window.location.search);
      const cardParam = params.get('card');
      if (cardParam) {
        const idx = parseInt(cardParam, 10) - 1; // URL is 1-based, state is 0-based
        if (!isNaN(idx) && idx >= 0) return idx;
      }
    } catch { /* ignore */ }
    return 0;
  });
  const [isSessionCardFlipped, setIsSessionCardFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [isSessionSettingsOpen, setIsSessionSettingsOpen] = useState(false);

  const currentSessionCard = sessionCards[sessionCardIndex] || sessionCards[0];

  // Sync card position to URL whenever sessionCardIndex changes
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('session', 'learn');
      url.searchParams.set('card', String(sessionCardIndex + 1)); // 1-based in URL
      window.history.replaceState(null, '', url.toString());
    } catch { /* ignore */ }
  }, [sessionCardIndex, isOpen]);

  // When session completes, update URL to show completed state
  useEffect(() => {
    if (!isOpen || !sessionCompleted || typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('session', 'learn');
      url.searchParams.set('card', 'done');
      window.history.replaceState(null, '', url.toString());
    } catch { /* ignore */ }
  }, [sessionCompleted, isOpen]);

  const handleStudyAgain = () => {
    setSessionCardIndex(0);
    setIsSessionCardFlipped(false);
    setSessionCompleted(false);
    setSessionStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  const handleRating = React.useCallback(
    (tier: { grade: number; key: 'again' | 'hard' | 'good' | 'easy' }) => {
      setSessionStats((prev) => ({ ...prev, [tier.key]: prev[tier.key] + 1 }));

      if (!currentSessionCard) return;

      try {
        const historyKey = 'duocard_study_history';
        const existingHistory: Array<{ word: string }> = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const now = Date.now();
        const newEntry = {
          id: `hist-${now}-${currentSessionCard.id}`,
          cardId: currentSessionCard.id,
          word: currentSessionCard.word,
          reading: currentSessionCard.reading,
          translation: currentSessionCard.translation,
          deckTitle: apiDeck?.title || preset.title,
          deckId: apiDeck?.id || deckId,
          language: apiDeck?.language || preset.sourceLang || 'Japanese',
          status: tier.key,
          timestamp: now,
          exampleSentence: currentSessionCard.exampleOriginal,
        };
        const updated = [newEntry, ...existingHistory.filter((h) => h.word !== currentSessionCard.word)].slice(0, 100);
        localStorage.setItem(historyKey, JSON.stringify(updated));

        // Also record to duocard_review_logs with date for heatmap and streak
        const todayDateStr = new Date().toISOString().split('T')[0];
        const existingLogs: Array<{ date: string; count: number; deckTitle?: string }> = JSON.parse(
          localStorage.getItem('duocard_review_logs') || '[]'
        );
        const dayIndex = existingLogs.findIndex((l) => l.date === todayDateStr);
        if (dayIndex >= 0) {
          existingLogs[dayIndex].count = (existingLogs[dayIndex].count || 0) + 1;
        } else {
          existingLogs.push({ date: todayDateStr, count: 1, deckTitle: apiDeck?.title || preset.title });
        }
        localStorage.setItem('duocard_review_logs', JSON.stringify(existingLogs));
      } catch (e) {
        console.warn('Could not record study history', e);
      }

      if (typeof currentSessionCard.id === 'number' && currentSessionCard.id > 0) {
        onSubmitCardReview(currentSessionCard.id, tier.grade).catch((err) =>
          console.warn('Backend review sync skipped:', err)
        );
      }

      if (sessionCardIndex + 1 < sessionCards.length) {
        setSessionCardIndex((prev) => prev + 1);
        setIsSessionCardFlipped(false);
      } else {
        setSessionCompleted(true);
        onStartStudySession();
      }
    },
    [apiDeck, preset, deckId, currentSessionCard, sessionCardIndex, sessionCards.length, onSubmitCardReview, onStartStudySession]
  );

  if (!isOpen) return null;

  const progressPct =
    sessionCards.length > 0
      ? Math.round(((sessionCardIndex + (sessionCompleted ? 1 : 0)) / sessionCards.length) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc] dark:bg-slate-950/95 text-slate-800 dark:text-white backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Bar: Progress, Title & Exit */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 shrink-0 bg-white/80 dark:bg-transparent">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Exit Study Session"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{apiDeck?.title || preset.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary border border-accent-primary/25 font-bold">
                Focus Study
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Card {Math.min(sessionCardIndex + 1, sessionCards.length)} of {sessionCards.length}
            </p>
          </div>
        </div>

        {/* Progress Bar & Percent */}
        <div className="flex items-center gap-4">
          <div className="w-32 sm:w-48 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">
            {progressPct}%
          </span>
          <button
            type="button"
            onClick={() => setIsSessionSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Study Session Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Center Area: Card or Session Complete */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        {sessionCompleted ? (
          <LearnSessionCompletedView
            totalCards={sessionCards.length}
            sessionStats={sessionStats}
            onStudyAgain={handleStudyAgain}
            onClose={onClose}
          />
        ) : currentSessionCard ? (
          <div className="w-full max-w-xl space-y-6">
            <div
              onClick={() => {
                setIsSessionCardFlipped(!isSessionCardFlipped);
                if (!isSessionCardFlipped && autoPlayAudio) {
                  speakWord(currentSessionCard.word, deckLanguage.targetLang || 'ja');
                }
              }}
              className="perspective-1000 w-full min-h-[380px] sm:min-h-[420px] cursor-pointer select-none group"
            >
              <div
                className={`relative w-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 preserve-3d ease-out ${
                  isSessionCardFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-[#18181b] border border-slate-200/90 dark:border-white/10 p-8 flex flex-col justify-between shadow-xl dark:shadow-2xl backface-hidden group-hover:border-accent-primary/60 transition-colors">
                  {/* Top Card Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Question Prompt
                    </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentSessionCard.word, deckLanguage.targetLang || 'ja');
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  title="Pronounce word"
                >
                  <Volume2 className="w-5 h-5 text-accent-primary" />
                </button>
              </div>

                  {/* Front Center Content */}
                  <div className="text-center py-8 space-y-4 my-auto">
                    {cardOrientation === 'audio-only' ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center mx-auto animate-pulse">
                          <Headphones className="w-8 h-8" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Listen carefully and recall the word</p>
                      </div>
                    ) : cardOrientation === 'meaning-first' ? (
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                          {currentSessionCard.translation}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Recall the target word</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                          {currentSessionCard.word}
                        </p>
                        {showRomaji && currentSessionCard.reading && currentSessionCard.reading !== currentSessionCard.word && (
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                            {currentSessionCard.reading}
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold pt-4 group-hover:text-accent-primary transition-colors">
                      Click or press Space to reveal answer
                    </p>
                  </div>

                  {/* Bottom Helper Hint */}
                  <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    {t('tapCardToFlip')}
                  </div>
                </div>

                {/* BACK FACE (Rotated 180deg) */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-[#18181b] border border-slate-200/90 dark:border-white/10 p-8 flex flex-col justify-between shadow-xl dark:shadow-2xl backface-hidden rotate-y-180 group-hover:border-accent-primary/60 transition-colors">
                  {/* Top Card Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Answer Side
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentSessionCard.word, deckLanguage.targetLang || 'ja');
                      }}
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                      title="Pronounce word"
                    >
                      <Volume2 className="w-5 h-5 text-accent-primary" />
                    </button>
                  </div>

                  {/* Back Center Content */}
                  <div className="text-center py-6 space-y-4 my-auto">
                    <div>
                      <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        {currentSessionCard.word}
                      </p>
                      {showRomaji && currentSessionCard.reading && (
                        <p className="text-sm font-semibold text-accent-primary mt-1">
                          {currentSessionCard.reading}
                        </p>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-white/5 border border-emerald-200 dark:border-white/10 max-w-sm mx-auto shadow-2xs">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {currentSessionCard.translation}
                      </p>
                    </div>

                    {showExamples && currentSessionCard.exampleOriginal && (
                      <div className="pt-1 text-left max-w-sm mx-auto text-xs space-y-1 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/5">
                        <p className="text-slate-700 dark:text-slate-200 italic">&ldquo;{currentSessionCard.exampleOriginal}&rdquo;</p>
                        {currentSessionCard.exampleTranslation && (
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{currentSessionCard.exampleTranslation}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Helper Hint */}
                  <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Rate recall difficulty below to schedule next review
                  </div>
                </div>
              </div>
            </div>

            {/* SRS Answer / Rating Buttons: Visible after Flip */}
            {isSessionCardFlipped ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 animate-in fade-in duration-200">
                {[
                  { grade: 1, label: t('srsRatingAgain'), sub: t('min1'), key: 'again' as const, bg: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300' },
                  { grade: 2, label: t('srsRatingHard'), sub: t('day1'), key: 'hard' as const, bg: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-300' },
                  { grade: 3, label: t('srsRatingGood'), sub: t('days3'), key: 'good' as const, bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300' },
                  { grade: 4, label: t('srsRatingEasy'), sub: t('days7'), key: 'easy' as const, bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300' },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => handleRating(tier)}
                    className={`py-3 px-2 rounded-2xl border font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition-all active:scale-95 shadow-2xs ${tier.bg}`}
                  >
                    <span>{tier.label}</span>
                    <span className="text-[10px] opacity-75 font-normal">{tier.sub}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSessionCardFlipped(true);
                  if (autoPlayAudio) {
                    speakWord(currentSessionCard.word, deckLanguage.targetLang || 'ja');
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/10 dark:hover:bg-white/15 dark:text-white font-bold text-xs transition cursor-pointer text-center shadow-md active:scale-[0.99]"
              >
                Show Answer (Space)
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* In-Session Quick Preferences Modal */}
      <LearnSessionSettingsModal
        isOpen={isSessionSettingsOpen}
        onClose={() => setIsSessionSettingsOpen(false)}
        deckId={deckId}
        dailyNewCards={dailyNewCards}
        reviewOrder={reviewOrder}
        cardOrientation={cardOrientation}
        setCardOrientation={setCardOrientation}
        autoPlayAudio={autoPlayAudio}
        setAutoPlayAudio={setAutoPlayAudio}
        ttsSpeed={ttsSpeed}
        setTtsSpeed={setTtsSpeed}
        showRomaji={showRomaji}
        setShowRomaji={setShowRomaji}
        showExamples={showExamples}
        setShowExamples={setShowExamples}
        showMnemonics={showMnemonics}
        cramMode={cramMode}
        mcqOptionsCount={mcqOptionsCount}
        allowForking={allowForking}
      />
    </div>
  );
};
