'use client';

import React, { useEffect, useState } from 'react';
import { BarChart2, Clock, Sparkles, Award, Flame, Zap, Trophy, Target, ArrowRight } from 'lucide-react';
import { Card } from '@/lib/types';
import { getDeckQuizStats, fetchDeckQuizStatsFromApi, DeckQuizStats } from '@/lib/quizStatsService';
import { InfoTooltip } from './InfoTooltip';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface StudyStatisticsTabProps {
  cards?: Card[];
  totalCards?: number;
  deckId?: string | number;
}

export const StudyStatisticsTab: React.FC<StudyStatisticsTabProps> = ({
  cards = [],
  totalCards = 0,
  deckId,
}) => {
  const { t } = useI18n();
  const [quizStats, setQuizStats] = useState<DeckQuizStats | null>(null);

  useEffect(() => {
    if (!deckId) return;
    // 1. Instant display from local storage
    const cached = getDeckQuizStats(deckId);
    if (cached) setQuizStats(cached);

    // 2. Fetch fresh stats from backend database
    fetchDeckQuizStatsFromApi(deckId).then((serverStats) => {
      if (serverStats) setQuizStats(serverStats);
    });

    const handleUpdate = () => {
      fetchDeckQuizStatsFromApi(deckId).then((serverStats) => {
        if (serverStats) {
          setQuizStats(serverStats);
        } else {
          setQuizStats(getDeckQuizStats(deckId));
        }
      });
    };

    window.addEventListener('duocard_quiz_stats_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('duocard_quiz_stats_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [deckId]);

  const total = totalCards || cards.length;
  const masteredCards = cards.filter((c) => c.status === 'MASTERED').length;
  const reviewedCards = cards.filter((c) => (c.repetitions || 0) > 0);
  
  // Real retention/mastery rate
  const masteryRate = total > 0 ? Math.round((masteredCards / total) * 100) : 0;
  
  // Flashcard recall accuracy based on easeFactor and status
  const cardReps = cards.reduce((acc, c) => acc + (c.repetitions || 0), 0);
  const rawCardAccuracy =
    reviewedCards.length > 0
      ? Math.min(
          100,
          Math.max(
            50,
            Math.round(
              reviewedCards.reduce((acc, c) => acc + (c.easeFactor ? (c.easeFactor / 2.5) * 85 : 80), 0) /
                reviewedCards.length
            )
          )
        )
      : cardReps > 0
      ? 85
      : 0;

  // Integrated Accuracy (Flashcard Reviews + Quiz Questions)
  const quizAnswers = quizStats?.totalQuestionsAnswered || 0;
  const quizCorrect = quizStats?.totalCorrect || 0;
  const quizAccuracy = quizAnswers > 0 ? Math.round((quizCorrect / quizAnswers) * 100) : 0;

  let combinedAccuracy = rawCardAccuracy;
  if (cardReps > 0 && quizAnswers > 0) {
    // Weighted combination
    combinedAccuracy = Math.round(
      (rawCardAccuracy * cardReps + quizAccuracy * quizAnswers) / (cardReps + quizAnswers)
    );
  } else if (quizAnswers > 0) {
    combinedAccuracy = quizAccuracy;
  }

  // Combined Total Reviews (Flashcard reps + Quiz questions answered)
  const totalReviewsCount = cardReps + quizAnswers;

  // Review breakdown for cards
  const easyCount = cards.filter((c) => (c.easeFactor || 2.5) >= 2.5 && (c.repetitions || 0) > 0).length;
  const goodCount = cards.filter((c) => (c.easeFactor || 2.5) >= 2.1 && (c.easeFactor || 2.5) < 2.5 && (c.repetitions || 0) > 0).length;
  const hardCount = cards.filter((c) => (c.easeFactor || 2.5) < 2.1 && (c.repetitions || 0) > 0).length;
  const againCount = cards.filter((c) => c.status === 'LEARNING' && (c.repetitions || 0) > 0 && (c.intervalDays || 0) <= 1).length;

  const totalGraded = easyCount + goodCount + hardCount + againCount;
  const easyPct = totalGraded > 0 ? Math.round((easyCount / totalGraded) * 100) : 0;
  const goodPct = totalGraded > 0 ? Math.round((goodCount / totalGraded) * 100) : 0;
  const hardPct = totalGraded > 0 ? Math.round((hardCount / totalGraded) * 100) : 0;
  const againPct = totalGraded > 0 ? Math.max(0, 100 - easyPct - goodPct - hardPct) : 0;

  // Combined Time: Flashcard SRS (3.5s avg) + Quiz actual elapsed seconds
  const cardSeconds = cardReps * 3.5;
  const quizSeconds = quizStats?.totalTimeSeconds || 0;
  const totalSeconds = cardSeconds + quizSeconds;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const timeFormatted =
    totalSeconds === 0
      ? '0m'
      : hours > 0
      ? `${hours}h ${minutes}m`
      : `${Math.max(1, minutes)}m`;

  const hasActivity = totalReviewsCount > 0;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Statistics Overview Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#2e2e2e]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-primary dark:text-[#f59e7e]">
                {t('deckAnalytics')}
              </span>
              <InfoTooltip
                title={t('deckAnalytics')}
                description={t('infoDeckAnalyticsDesc')}
                howToAchieve={t('infoDeckAnalyticsHow')}
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] dark:text-white mt-0.5">
              {t('studySessionStatistics')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('studySessionStatsDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{hasActivity ? t('active') : t('noReviewsYet')}</span>
            </span>
          </div>
        </div>

        {/* 4 Stats Highlights (Combined Flashcard + Quiz) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('accuracy')}</span>
                <InfoTooltip
                  title={t('infoAccuracyTitle')}
                  description={t('infoAccuracyDesc')}
                  howToAchieve={t('infoAccuracyHow')}
                />
              </div>
              <BarChart2 className="w-4 h-4 text-accent-primary" />
            </div>
            <div className="text-2xl font-black text-[#1e293b] dark:text-white">{combinedAccuracy}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {hasActivity
                ? quizAnswers > 0 && cardReps > 0
                  ? t('srsAndQuizCombined')
                  : quizAnswers > 0
                  ? t('quizDrillAccuracy')
                  : t('firstAttemptRecall')
                : t('notEnoughData')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('totalTime')}</span>
                <InfoTooltip
                  title={t('infoTotalTimeTitle')}
                  description={t('infoTotalTimeDesc')}
                  howToAchieve={t('infoTotalTimeHow')}
                />
              </div>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-[#1e293b] dark:text-white">{timeFormatted}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('studiedAndQuizTime')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('totalReviews')}</span>
                <InfoTooltip
                  title={t('infoTotalReviewsTitle')}
                  description={t('infoTotalReviewsDesc')}
                  howToAchieve={t('infoTotalReviewsHow')}
                />
              </div>
              <Sparkles className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[#1e293b] dark:text-white">{totalReviewsCount}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {quizAnswers > 0
                ? t('cardsAndQuizCounts').replace('{cards}', String(cardReps)).replace('{quiz}', String(quizAnswers))
                : t('cardReviewsLogged')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('masteryRate')}</span>
                <InfoTooltip
                  title={t('infoMasteryRateTitle')}
                  description={t('infoMasteryRateDesc')}
                  howToAchieve={t('infoMasteryRateHow')}
                />
              </div>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{masteryRate}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('longTermRetention')}</p>
          </div>
        </div>
      </div>

      {/* Practice Quiz Performance Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">
                  {t('practiceQuizPerformance')}
                </h3>
                <InfoTooltip
                  title={t('infoQuizDrillsTitle')}
                  description={t('infoQuizDrillsDesc')}
                  howToAchieve={t('infoQuizDrillsHow')}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {t('practiceQuizPerformanceDesc')}
              </p>
            </div>
          </div>
          {deckId && (
            <Link
              href={`/quiz/${deckId}`}
              className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline"
            >
              {t('takeQuiz')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {quizStats && quizStats.totalAttempts > 0 ? (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold uppercase">{t('quizzesCompleted')}</span>
                    <InfoTooltip
                      title={t('infoQuizzesCompletedTitle')}
                      description={t('infoQuizzesCompletedDesc')}
                      howToAchieve={t('infoQuizzesCompletedHow')}
                    />
                  </div>
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-300">
                  {quizStats.totalAttempts}
                </div>
                <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
                  {t('questionsSolved').replace('{count}', String(quizStats.totalQuestionsAnswered))}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold uppercase">{t('quizAccuracy')}</span>
                    <InfoTooltip
                      title={t('infoQuizAccuracyTitle')}
                      description={t('infoQuizAccuracyDesc')}
                      howToAchieve={t('infoQuizAccuracyHow')}
                    />
                  </div>
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-300">
                  {quizAccuracy}%
                </div>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
                  {t('correctOutOfTotal').replace('{correct}', String(quizStats.totalCorrect)).replace('{total}', String(quizStats.totalQuestionsAnswered))}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
                <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold uppercase">{t('bestScore')}</span>
                    <InfoTooltip
                      title={t('infoBestScoreTitle')}
                      description={t('infoBestScoreDesc')}
                      howToAchieve={t('infoBestScoreHow')}
                    />
                  </div>
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-blue-600 dark:text-blue-300">
                  {quizStats.bestAccuracy}%
                </div>
                <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80">
                  {t('bestDrillCorrect').replace('{count}', String(quizStats.bestScore))}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30">
                <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold uppercase">{t('quizTime')}</span>
                    <InfoTooltip
                      title={t('infoQuizTimeTitle')}
                      description={t('infoQuizTimeDesc')}
                      howToAchieve={t('infoQuizTimeHow')}
                    />
                  </div>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-300">
                  {quizSeconds >= 60 ? `${Math.floor(quizSeconds / 60)}m ${quizSeconds % 60}s` : `${quizSeconds}s`}
                </div>
                <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80">
                  {t('totalTimeInDrills')}
                </span>
              </div>
            </div>

            {/* Latest Quiz Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-slate-200">{t('lastQuizDrill')}:</span>
                {quizStats.lastQuiz ? (
                  <span className="text-slate-600 dark:text-slate-400">
                    {t('scoredQuizSummary')
                      .replace('{score}', String(quizStats.lastQuiz.score))
                      .replace('{total}', String(quizStats.lastQuiz.totalQuestions))
                      .replace('{acc}', String(quizStats.lastQuiz.accuracy))
                      .replace('{seconds}', String(quizStats.lastQuiz.timeSeconds))}
                  </span>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400">
                    {t('latestSessionRecorded')}
                  </span>
                )}
              </div>
              {quizStats.lastPlayedAt && (
                <span className="text-[11px] text-slate-400">
                  {new Date(quizStats.lastPlayedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(quizStats.lastPlayedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('noPracticeQuizzesYet')}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('takeQuizPrompt')}
              </p>
            </div>
            {deckId && (
              <Link
                href={`/quiz/${deckId}`}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {t('startPracticeQuiz')}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Accuracy by Difficulty Breakdown (Flashcard Recall) */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">
            {t('recallGradeBreakdown')}
          </h3>
          <InfoTooltip
            title={t('recallGradeBreakdown')}
            description={t('infoRecallGradeDesc')}
            howToAchieve={t('infoRecallGradeHow')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{t('easyFast')}</span>
              <InfoTooltip
                title={t('infoEasyGradeTitle')}
                description={t('infoEasyGradeDesc')}
                howToAchieve={t('infoEasyGradeHow')}
              />
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-300">
              {totalGraded > 0 ? `${easyPct}%` : '0%'}
            </div>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
              {t('cardsWithPct').replace('{count}', String(easyCount)).replace('{pct}', String(easyPct))}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{t('good')}</span>
              <InfoTooltip
                title={t('infoGoodGradeTitle')}
                description={t('infoGoodGradeDesc')}
                howToAchieve={t('infoGoodGradeHow')}
              />
            </div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-300">
              {totalGraded > 0 ? `${goodPct}%` : '0%'}
            </div>
            <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80">
              {t('cardsWithPct').replace('{count}', String(goodCount)).replace('{pct}', String(goodPct))}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{t('hard')}</span>
              <InfoTooltip
                title={t('infoHardGradeTitle')}
                description={t('infoHardGradeDesc')}
                howToAchieve={t('infoHardGradeHow')}
              />
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-300">
              {totalGraded > 0 ? `${hardPct}%` : '0%'}
            </div>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
              {t('cardsWithPct').replace('{count}', String(hardCount)).replace('{pct}', String(hardPct))}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400">{t('againFailed')}</span>
              <InfoTooltip
                title={t('infoAgainGradeTitle')}
                description={t('infoAgainGradeDesc')}
                howToAchieve={t('infoAgainGradeHow')}
              />
            </div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-300">
              {totalGraded > 0 ? `${againPct}%` : '0%'}
            </div>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80">
              {t('cardsWithPct').replace('{count}', String(againCount)).replace('{pct}', String(againPct))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
