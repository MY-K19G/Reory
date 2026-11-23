'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';

interface ActivityHeroProps {
  totalReviews: number;
  totalXp: number;
  totalTimeMinutes: number;
}

export const ActivityHero: React.FC<ActivityHeroProps> = ({
  totalReviews,
  totalXp,
  totalTimeMinutes,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Learning Activity Log</span>
            </h1>
            <p className="text-xs text-slate-400">
              Track your daily review sessions, unlocked achievements, and deck expansions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cards Practiced
            </span>
            <span className="text-xl font-black text-white mt-0.5 block">
              {totalReviews}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
            SRS
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              XP Earned
            </span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              +{totalXp}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            XP
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Time Invested
            </span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {totalTimeMinutes} Min
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            ⏱
          </div>
        </div>
      </div>
    </>
  );
};
