'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Achievement } from '../types';

interface ProfileAchievementsTabProps {
  achievements: Achievement[];
  t: (key: string) => string;
}

export function ProfileAchievementsTab({ achievements, t }: ProfileAchievementsTabProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-4 transition-colors animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {t('badgesAchievements')}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('badgesDesc')}
          </p>
        </div>
        <Link
          href="/profile/achievements"
          className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{t('viewAllBadges')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 transition-all group"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm mb-2 transition-transform group-hover:scale-110 ${ach.iconBg}`}
            >
              {ach.icon}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {ach.title}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {ach.subtitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
