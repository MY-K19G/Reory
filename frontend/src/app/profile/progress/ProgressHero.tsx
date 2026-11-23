'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain } from 'lucide-react';
import { AccentOption } from '@/lib/theme';

interface ProgressHeroProps {
  overallPercentage: number;
  averageRetention: number;
  totalHoursAll: number;
  currentAccent: AccentOption;
}

export const ProgressHero: React.FC<ProgressHeroProps> = ({
  overallPercentage,
  averageRetention,
  totalHoursAll,
  currentAccent,
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
            backgroundImage: `url('/profile/hero-banner.jpg')`,
            backgroundPosition: 'center 35%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1017] via-[#0d1017]/90 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
            <Brain className="w-3.5 h-3.5" />
            <span>Spaced Repetition &amp; Memory Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            My Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Detailed breakdown of your card retention, study velocity, vocabulary mastery, and language milestones across all collections.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-5 sm:gap-7 bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0">
          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {overallPercentage}%
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">Total Mastery</span>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {averageRetention}%
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">Recall Accuracy</span>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black" style={{ color: currentAccent.primary }}>
              {totalHoursAll}h
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">Total Study Time</span>
          </div>
        </div>
      </div>
    </>
  );
};
