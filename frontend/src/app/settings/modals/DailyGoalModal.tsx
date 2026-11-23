'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Check } from 'lucide-react';

interface DailyGoalModalProps {
  dailyGoal: number;
  setDailyGoal: (g: number) => void;
  onClose: () => void;
}

const PRESET_GOALS = [
  { cards: 10, label: 'Casual', time: '5 min/day', desc: 'Light & steady habit' },
  { cards: 20, label: 'Regular', time: '10 min/day', desc: 'Recommended balance' },
  { cards: 40, label: 'Serious', time: '20 min/day', desc: 'Accelerated retention' },
  { cards: 60, label: 'Intense', time: '30+ min/day', desc: 'Immersion & mastery' },
];

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  dailyGoal,
  setDailyGoal,
  onClose,
}) => {
  const { t } = useI18n();
  const [selectedGoal, setSelectedGoal] = useState<number>(dailyGoal || 40);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setDailyGoal(selectedGoal);
    try {
      localStorage.setItem('duocard_daily_goal', String(selectedGoal));
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
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          {t('dailyGoalSaved')}
        </div>
      )}

      <p className="text-xs text-slate-400">
        {t('dailyGoalSubtitle')}
      </p>

      {/* Preset cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {PRESET_GOALS.map((preset) => {
          const isSelected = selectedGoal === preset.cards;
          return (
            <button
              key={preset.cards}
              type="button"
              onClick={() => setSelectedGoal(preset.cards)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{preset.label === 'Casual' ? t('casual') : preset.label === 'Regular' ? t('regular') : preset.label === 'Serious' ? t('serious') : t('intense')}</span>
                <span className="text-xs font-extrabold text-emerald-400">{preset.cards}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 block">{preset.time}</span>
              <span className="text-[10px] text-slate-500 block">{preset.label === 'Casual' ? t('lightHabit') : preset.label === 'Regular' ? t('recommendedBalance') : preset.label === 'Serious' ? t('acceleratedRetention') : t('immersionMastery')}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Slider */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('customDailyCards')}</span>
          <span className="text-xs font-black text-emerald-400">{selectedGoal} {t('cardsPerDay')}</span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
          <span>5 cards</span>
          <span>50 cards</span>
          <span>100 cards</span>
        </div>
      </div>

      {/* Action Footer */}
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
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          {t('saveGoal')}
        </button>
      </div>
    </div>
  );
};
