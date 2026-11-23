'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { fetchDeckById, speakWord } from '@/lib/api';
import { Deck, Card } from '@/lib/types';
import { parseDeckIdFromSlug } from '@/lib/deckLanguages';
import { ChevronLeft, Zap, CheckCircle2, XCircle, Trophy, Volume2, ArrowRight, Pause, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { recordQuizCompletion } from '@/lib/quizStatsService';

interface QuizQuestion {
  card: Card;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export function getCachedCardQuiz(
  word: string,
  targetLang?: string,
  nativeLang?: string
): { question: string; options: string[]; correctAnswer: string; explanation?: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('duocard_cached_words_dict');
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const lowerWord = word.trim().toLowerCase();
    const tLang = (targetLang || '').trim().toLowerCase();
    const nLang = (nativeLang || '').trim().toLowerCase();

    // 1. Try exact match: word_targetLang_nativeLang
    if (tLang && nLang) {
      const exactKey = `${lowerWord}_${tLang}_${nLang}`;
      if (cache[exactKey]?.quiz?.question && Array.isArray(cache[exactKey]?.quiz?.options)) {
        return cache[exactKey].quiz;
      }
    }

    // 2. Try match with native language suffix
    for (const key of Object.keys(cache)) {
      if (
        key.startsWith(`${lowerWord}_`) &&
        (!nLang || key.endsWith(`_${nLang}`)) &&
        cache[key]?.quiz?.question &&
        Array.isArray(cache[key]?.quiz?.options)
      ) {
        return cache[key].quiz;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export default function QuizPage() {
  const params = useParams();
  const rawParam = (params?.deckId as string) || (params?.deckSlug as string) || '';
  const deckId = parseDeckIdFromSlug(rawParam);
  const router = useRouter();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Restore card position from URL on mount
    if (typeof window === 'undefined') return 0;
    try {
      const params = new URLSearchParams(window.location.search);
      const cardParam = params.get('card');
      if (cardParam) {
        const idx = parseInt(cardParam, 10) - 1; // URL is 1-based
        if (!isNaN(idx) && idx >= 0) return idx;
      }
    } catch { /* ignore */ }
    return 0;
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Countdown timer after answer selection
  const COUNTDOWN_DURATION = 2500; // 2.5 seconds
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState(100); // 100 -> 0
  const [isPaused, setIsPaused] = useState(false);
  const remainingMsRef = useRef<number>(COUNTDOWN_DURATION);
  const lastTickTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Track quiz session start time
  const quizStartTimeRef = useRef<number>(Date.now());
  const statsRecordedRef = useRef<boolean>(false);

  const handleFinishQuiz = useCallback((finalScore: number) => {
    setFinished(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
    if (!statsRecordedRef.current && deckId) {
      statsRecordedRef.current = true;
      const elapsedSec = Math.max(1, Math.round((Date.now() - quizStartTimeRef.current) / 1000));
      recordQuizCompletion(deckId as string, finalScore, questions.length, elapsedSec);
    }
  }, [deckId, questions.length]);

  useEffect(() => {
    if (!countdownActive) return;

    if (isPaused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTickTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;
      remainingMsRef.current = Math.max(0, remainingMsRef.current - delta);

      const progress = (remainingMsRef.current / COUNTDOWN_DURATION) * 100;
      setCountdownProgress(progress);

      if (remainingMsRef.current > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Countdown finished — advance to next question
        setCountdownActive(false);
        setIsPaused(false);
        setCountdownProgress(100);
        remainingMsRef.current = COUNTDOWN_DURATION;
        if (currentIndex + 1 < questions.length) {
          setSelectedOption(null);
          setCurrentIndex((i) => i + 1);
        } else {
          handleFinishQuiz(score);
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [countdownActive, isPaused, currentIndex, questions.length, handleFinishQuiz, score]);

  const countdownSecondsLeft = Math.ceil((countdownProgress / 100) * (COUNTDOWN_DURATION / 1000));

  // Sync current question index to URL
  useEffect(() => {
    if (typeof window === 'undefined' || questions.length === 0) return;
    try {
      const url = new URL(window.location.href);
      if (finished) {
        url.searchParams.set('card', 'done');
      } else {
        url.searchParams.set('card', String(currentIndex + 1)); // 1-based in URL
      }
      window.history.replaceState(null, '', url.toString());
    } catch { /* ignore */ }
  }, [currentIndex, finished, questions.length]);

  useEffect(() => {
    if (!deckId) return;
    fetchDeckById(deckId)
      .then((deckData) => {
        setDeck(deckData);
        if (deckData.cards && deckData.cards.length >= 2) {
          // Parse deck language pair (e.g. "English → Hindi" or "English")
          const langParts = (deckData.language || '').split('→').map((s) => s.trim());
          const targetLang = langParts[0] || 'English';
          const nativeLang = langParts[1] || 'Hindi';

          // Helper to shuffle options randomly
          const shuffleArray = <T,>(arr: T[]): T[] => {
            const copy = [...arr];
            for (let i = copy.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
          };

          // Generate questions with Memory Checkpoint style
          const generated: QuizQuestion[] = deckData.cards.map((card) => {
            // 1. First check if card.metadata in the database has the quiz saved permanently!
            if (card.metadata) {
              try {
                const parsed = JSON.parse(card.metadata);
                if (parsed.quiz && parsed.quiz.question && Array.isArray(parsed.quiz.options)) {
                  return {
                    card,
                    questionText: parsed.quiz.question,
                    options: shuffleArray(parsed.quiz.options),
                    correctAnswer: parsed.quiz.correctAnswer,
                    explanation: parsed.quiz.explanation,
                  };
                }
              } catch {
                // ignore
              }
            }

            // 2. Second check: check if AI generated quiz exists in local word cache for THIS language pair
            const cachedQuiz = getCachedCardQuiz(card.frontWord, targetLang, nativeLang);
            if (cachedQuiz && cachedQuiz.options.length >= 2) {
              return {
                card,
                questionText: cachedQuiz.question,
                options: shuffleArray(cachedQuiz.options),
                correctAnswer: cachedQuiz.correctAnswer,
                explanation: cachedQuiz.explanation,
              };
            }

            // 3. Fallback: generate high-quality contextual distractors from other cards in this deck
            const otherCards = deckData.cards!.filter((c) => c.id !== card.id);
            const shuffledOthers = shuffleArray(otherCards);
            const distractors = shuffledOthers.slice(0, 3).map((c) => c.backTranslation);
            const options = shuffleArray([...distractors, card.backTranslation]);

            // Build contextual question prompt in native language
            const isHindi = nativeLang.toLowerCase().includes('hindi');
            const questionText = isHindi
              ? `यदि किसी वाक्य या संदर्भ में “${card.frontWord}” का प्रयोग होता है, तो उसका सही अर्थ क्या है?`
              : `What is the correct meaning of "${card.frontWord}"?`;

            return {
              card,
              questionText,
              options,
              correctAnswer: card.backTranslation,
            };
          });
          setQuestions(generated);
        }
      })
      .catch((err) => console.error('Failed to load quiz:', err))
      .finally(() => setLoading(false));
  }, [deckId]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null || !currentQ) return;
    setSelectedOption(opt);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    // Start the visible countdown timer
    setIsPaused(false);
    remainingMsRef.current = COUNTDOWN_DURATION;
    setCountdownProgress(100);
    setCountdownActive(true);
  };

  const handleTogglePause = () => {
    setIsPaused((p) => !p);
  };

  const handleSkipCountdown = () => {
    cancelAnimationFrame(rafRef.current);
    setCountdownActive(false);
    setIsPaused(false);
    setCountdownProgress(100);
    remainingMsRef.current = COUNTDOWN_DURATION;
    if (currentIndex + 1 < questions.length) {
      setSelectedOption(null);
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinishQuiz(score);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Generating speed quiz drill...</p>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="w-full min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-4xl shadow-xl">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Finished!</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              You scored <span className="font-extrabold text-amber-500">{score}</span> out of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> ({accuracy}%)
            </p>

          </div>
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/10 cursor-pointer transition-colors"
            >
              Back to Deck
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setScore(0);
                quizStartTimeRef.current = Date.now();
                statsRecordedRef.current = false;
                setFinished(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:opacity-95 cursor-pointer transition-opacity"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="w-full min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Need at least 2 cards in this deck to play a quiz.</p>
          <button onClick={() => router.back()} className="text-accent-primary font-semibold text-xs hover:underline cursor-pointer">
            Return to Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header bar */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Quit Quiz
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" /> Practice Quiz
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-white/5 px-2.5 py-1 rounded-full">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Memory Checkpoint Quiz Container */}
        <div className="bg-white dark:bg-[#15171c] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-[#262833] space-y-6 transition-all">
          {/* Header with Memory Checkpoint Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Memory Checkpoint
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Test your recall</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                Question {currentIndex + 1}/{questions.length}
              </span>
              <button
                type="button"
                onClick={() => speakWord(currentQ.card.frontWord, deck?.languageCode)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                title="Pronounce word"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.questionText}
            </p>
          </div>

          {/* 2-Column Answer Options Grid (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              const isChosen = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle =
                'bg-slate-50 dark:bg-[#1e2029] border-slate-200 dark:border-[#2d303d] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#252834]';
              let badgeStyle = 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/40';
                  badgeStyle = 'bg-emerald-500 text-white';
                } else if (isChosen && !isCorrect) {
                  btnStyle =
                    'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/40';
                  badgeStyle = 'bg-rose-500 text-white';
                } else {
                  btnStyle = 'opacity-40 bg-slate-50 dark:bg-[#181920] border-transparent text-slate-400';
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 ml-auto" />
                  )}
                  {selectedOption !== null && isChosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if available when answered */}
          {selectedOption !== null && currentQ.explanation && (
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in">
              <span className="font-bold text-slate-800 dark:text-white mr-1.5">Note:</span>
              {currentQ.explanation}
            </div>
          )}

          {/* Countdown Timer Bar — visible after selecting an answer */}
          {selectedOption !== null && countdownActive && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${
                    selectedOption === currentQ.correctAnswer
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {selectedOption === currentQ.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Next in {countdownSecondsLeft}s</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                    title={isPaused ? "Resume timer" : "Pause timer"}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipCountdown}
                    className="flex items-center gap-1 text-[11px] font-bold text-accent-primary hover:text-accent-primary/80 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-accent-primary/5"
                  >
                    Skip <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-none ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                      : 'bg-gradient-to-r from-rose-400 to-rose-500'
                  }`}
                  style={{ width: `${countdownProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
