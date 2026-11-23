'use client';

import React from 'react';
import { Target, Calendar, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { SettingsModalType } from './types';

interface LearningCardProps {
  onOpenModal: (modal: SettingsModalType) => void;
  dailyGoal: number;
  reviewSchedule: string;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  onOpenModal,
  dailyGoal,
  reviewSchedule,
}) => {
  const { t } = useI18n();

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-2.5">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        {t('learningSection')}
      </h2>

      <div className="divide-y divide-slate-100 dark:divide-[#2e2e2e] rounded-2xl bg-slate-50/50 dark:bg-[#282828]/50 border border-slate-200/70 dark:border-[#2e2e2e] overflow-hidden">
        {/* Daily Goal */}
        <button
          type="button"
          onClick={() => onOpenModal('dailyGoal')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-300 transition-colors block">
                {t('dailyGoal')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('dailyGoalDesc')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400">{dailyGoal} {t('cardsUnit')}</span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Review Schedule */}
        <button
          type="button"
          onClick={() => onOpenModal('reviewSchedule')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-cyan-300 transition-colors block">
                {t('reviewSchedule')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('reviewScheduleDesc')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">{reviewSchedule}</span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </div>
    </div>
  );
};
