'use client';

import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { AccentOption } from '@/lib/theme';
import { AchievementDetail } from './types';

interface AchievementModalProps {
  selectedAchievement: AchievementDetail | null;
  onClose: () => void;
  currentAccent: AccentOption;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  selectedAchievement,
  onClose,
  currentAccent,
}) => {
  if (!selectedAchievement) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#161922] dark:bg-[#14161f] border border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 ${selectedAchievement.badgeBg}`}
          >
            {selectedAchievement.icon}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {selectedAchievement.tier} Tier
              </span>
              <span className="text-xs font-bold text-amber-400">
                +{selectedAchievement.xpReward} XP
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {selectedAchievement.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Overview &amp; Lore
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {selectedAchievement.description}
          </p>
        </div>

        {/* Progress Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Objective</span>
            <span className="text-white font-mono">
              {selectedAchievement.currentProgress} / {selectedAchievement.maxProgress} (
              {Math.min(
                100,
                Math.round(
                  (selectedAchievement.currentProgress / selectedAchievement.maxProgress) * 100
                )
              )}
              %)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (selectedAchievement.currentProgress / selectedAchievement.maxProgress) * 100
                  )
                )}%`,
                backgroundColor: selectedAchievement.themeColor,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Requirement: {selectedAchievement.requirement}
          </p>
        </div>

        {/* Bottom Status & Close */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-xs font-semibold">
            {selectedAchievement.unlocked ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Unlocked &amp; Claimed</span>
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>In Progress</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ backgroundColor: currentAccent.primary }}
            className="px-5 py-2 rounded-full text-xs font-bold text-white shadow-md hover:opacity-90 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
