'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';

interface AchievementHeroProps {
  unlockedCount: number;
  totalCount: number;
  totalXpEarned: number;
  completionPercentage: number;
}

export const AchievementHero: React.FC<AchievementHeroProps> = ({
  unlockedCount,
  totalCount,
  totalXpEarned,
  completionPercentage,
}) => {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-[#161922] dark:bg-[#14161f] border border-white/10 shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30"
          style={{
            backgroundImage: `url('/profile/footer-banner.jpg')`,
            backgroundPosition: 'right 35%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1017] via-[#0d1017]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Milestones &amp; Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Your Achievements
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Every card reviewed, streak maintained, and deck created brings you closer to ultimate fluency. Unlock rewards and show off your progress!
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-5 sm:gap-7 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0">
          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {unlockedCount}<span className="text-slate-500 text-base font-normal">/{totalCount}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">Unlocked</span>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {totalXpEarned.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">XP Earned</span>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">
              {completionPercentage}%
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">Mastery</span>
          </div>
        </div>
      </div>
    </>
  );
};
