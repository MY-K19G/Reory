'use client';

import React from 'react';
import { Sparkles, Target, CheckCircle2, Clock, Award } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { useI18n } from '@/lib/i18n';

export interface ProgressStats {
  totalCards: number;
  cardsLearned: number;
  newCount: number;
  reviewCount: number;
  masteredCount: number;
  percent: number;
  newPct?: number;
  reviewPct?: number;
  masteredPct?: number;
  createdOn?: string;
}

interface StudyProgressTabProps {
  progress: ProgressStats;
  totalCards: number;
  onPracticeWeak: () => void;
}

export const StudyProgressTab: React.FC<StudyProgressTabProps> = ({
  progress,
  totalCards,
  onPracticeWeak,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Overview Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#2e2e2e]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-primary dark:text-[#f59e7e]">
                {t('deckMastery')}
              </span>
              <InfoTooltip
                title={t('deckMastery')}
                description={t('infoDeckMasteryDesc')}
                howToAchieve={t('infoDeckMasteryHow')}
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] dark:text-white mt-0.5">
              {t('learningProgressBreakdown') || 'Learning Progress Breakdown'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('deckMasteryDesc')}
            </p>
          </div>

          <button
            type="button"
            onClick={onPracticeWeak}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('practiceWeakCards')}</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('overall')}</span>
                <InfoTooltip
                  title={t('infoOverallProgressTitle')}
                  description={t('infoOverallProgressDesc')}
                  howToAchieve={t('infoOverallProgressHow')}
                />
              </div>
              <Target className="w-4 h-4 text-accent-primary" />
            </div>
            <div className="text-2xl font-black text-[#1e293b] dark:text-white">{progress.percent}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('totalDeckCompletion')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('learned')}</span>
                <InfoTooltip
                  title={t('infoLearnedCardsTitle')}
                  description={t('infoLearnedCardsDesc')}
                  howToAchieve={t('infoLearnedCardsHow')}
                />
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {progress.cardsLearned}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('ofTotalCards').replace('{count}', String(totalCards))}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('reviewDue')}</span>
                <InfoTooltip
                  title={t('infoReviewDueTitle')}
                  description={t('infoReviewDueDesc')}
                  howToAchieve={t('infoReviewDueHow')}
                />
              </div>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {progress.reviewCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('cardsScheduled')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{t('mastered')}</span>
                <InfoTooltip
                  title={t('infoMasteredCardsTitle')}
                  description={t('infoMasteredCardsDesc')}
                  howToAchieve={t('infoMasteredCardsHow')}
                />
              </div>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500">
              {progress.masteredCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('matureMemoryStage')}</p>
          </div>
        </div>
      </div>

      {/* SRS Retention Stages */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">
            {t('spacedRepetitionStages')}
          </h3>
          <InfoTooltip
            title={t('infoSpacedStagesTitle')}
            description={t('infoSpacedStagesDesc')}
            howToAchieve={t('infoSpacedStagesHow')}
          />
        </div>

        {(() => {
          const total = totalCards || (progress.newCount + progress.reviewCount + progress.masteredCount);
          const newPct = total > 0 ? Math.round((progress.newCount / total) * 100) : 0;
          const reviewPct = total > 0 ? Math.round((progress.reviewCount / total) * 100) : 0;
          const masteredPct = total > 0 ? Math.round((progress.masteredCount / total) * 100) : 0;

          return (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t('newUnseen')} ({progress.newCount} {t('cardsUnit')})
                    </span>
                    <InfoTooltip
                      title={t('infoNewUnseenTitle')}
                      description={t('infoNewUnseenDesc')}
                      howToAchieve={t('infoNewUnseenHow')}
                    />
                  </div>
                  <span className="text-slate-400">{newPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${newPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t('learningAndReviewing')} ({progress.reviewCount} {t('cardsUnit')})
                    </span>
                    <InfoTooltip
                      title={t('infoLearningReviewingTitle')}
                      description={t('infoLearningReviewingDesc')}
                      howToAchieve={t('infoLearningReviewingHow')}
                    />
                  </div>
                  <span className="text-slate-400">{reviewPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${reviewPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t('masteredAndRetained')} ({progress.masteredCount} {t('cardsUnit')})
                    </span>
                    <InfoTooltip
                      title={t('infoMasteredRetainedTitle')}
                      description={t('infoMasteredRetainedDesc')}
                      howToAchieve={t('infoMasteredRetainedHow')}
                    />
                  </div>
                  <span className="text-slate-400">{masteredPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${masteredPct}%` }} />
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
