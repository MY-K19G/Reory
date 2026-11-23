'use client';

import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { AchievementDetail } from './types';

interface AchievementCardProps {
  item: AchievementDetail;
  onClick: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ item, onClick }) => {
  const progressPercent = Math.min(
    100,
    Math.round((item.currentProgress / item.maxProgress) * 100)
  );

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-5 sm:p-6 bg-[#161922] dark:bg-[#14161f] border transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl ${
        item.unlocked
          ? `${item.borderGlow} hover:border-white/30`
          : 'border-white/5 opacity-75 hover:opacity-100 hover:border-white/20'
      }`}
    >
      {/* Top Row: Icon Badge + Tier & XP Pill */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-13 h-13 rounded-2xl flex items-center justify-center border shadow-inner ${item.badgeBg}`}
          >
            {item.icon}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                item.tier === 'Diamond'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : item.tier === 'Gold'
                  ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                  : item.tier === 'Silver'
                  ? 'bg-slate-300/10 text-slate-300 border-slate-300/30'
                  : 'bg-amber-700/10 text-amber-500 border-amber-700/30'
              }`}
            >
              {item.tier}
            </span>
            <span className="text-[11px] font-bold text-amber-400">
              +{item.xpReward} XP
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              {item.title}
            </h3>
            {item.unlocked && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & State */}
      <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>{item.unlocked ? 'Mastered' : 'Progress'}</span>
          <span className="font-mono text-white">
            {item.currentProgress} / {item.maxProgress}
          </span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: item.themeColor,
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-500 truncate max-w-[170px]">
            {item.unlocked ? item.unlockedAt : item.requirement}
          </span>
          {!item.unlocked && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
