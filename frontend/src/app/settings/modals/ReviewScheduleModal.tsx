'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Check } from 'lucide-react';

interface ReviewScheduleModalProps {
  reviewSchedule: string;
  setReviewSchedule: (s: string) => void;
  onClose: () => void;
}

const SCHEDULE_OPTIONS = [
  {
    id: 'Spaced Repetition',
    name: 'Spaced Repetition (SM-2)',
    desc: 'Scientific memory decay intervals (1d, 3d, 6d, 14d+). Highest retention.',
    tag: 'Recommended',
  },
  {
    id: 'Morning Routine',
    name: 'Morning Routine (8:00 AM)',
    desc: 'Daily morning review batch before your workday starts.',
    tag: 'Focus',
  },
  {
    id: 'Evening Review',
    name: 'Evening Wind-down (8:30 PM)',
    desc: 'Reinforce what you learned right before sleep for memory consolidation.',
    tag: 'Consolidation',
  },
  {
    id: 'Weekend Sprint',
    name: 'Weekend Sprints',
    desc: 'Intense batch sessions on Saturday and Sunday with lighter weekday drills.',
    tag: 'Flexible',
  },
];

export const ReviewScheduleModal: React.FC<ReviewScheduleModalProps> = ({
  reviewSchedule,
  setReviewSchedule,
  onClose,
}) => {
  const { t } = useI18n();
  const [selected, setSelected] = useState(reviewSchedule || 'Spaced Repetition');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setReviewSchedule(selected);
    try {
      localStorage.setItem('duocard_review_schedule', selected);
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          {t('reviewScheduleUpdated')}
        </div>
      )}

      <p className="text-xs text-slate-400">
        {t('reviewScheduleSubtitle')}
      </p>

      <div className="space-y-2.5">
        {SCHEDULE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                  : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{opt.id === 'Spaced Repetition' ? t('spacedRepetitionSm2') : opt.id === 'Morning Routine' ? t('morningRoutine') : opt.id === 'Evening Review' ? t('eveningWindDown') : t('weekendSprints')}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-200 dark:bg-white/5 text-slate-400'
                      }`}
                  >
                    {opt.tag === 'Recommended' ? t('recommended') : opt.tag === 'Focus' ? t('focus') : opt.tag === 'Consolidation' ? t('consolidation') : t('flexible')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{opt.id === 'Spaced Repetition' ? t('spacedRepetitionDesc') : opt.id === 'Morning Routine' ? t('morningRoutineDesc') : opt.id === 'Evening Review' ? t('eveningWindDownDesc') : t('weekendSprintsDesc')}</p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-400'
                  }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          {t('applySchedule')}
        </button>
      </div>
    </div>
  );
};
