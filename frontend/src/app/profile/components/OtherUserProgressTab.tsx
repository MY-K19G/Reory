'use client';

import React from 'react';
import { FlagIcon } from '@/components/FlagIcon';
import { COUNTRY_CODE_BY_NAME } from '@/lib/countries';
import { AccentOption } from '@/lib/theme';
import { FriendUser } from '../types';

interface OtherUserProgressTabProps {
  selectedViewUser: FriendUser;
  currentAccent: AccentOption;
}

export const OtherUserProgressTab: React.FC<OtherUserProgressTabProps> = ({
  selectedViewUser,
  currentAccent,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-5 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Language Mastery & Active Deck Progress
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time retention calculations across active languages
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  stroke={currentAccent.primary}
                  strokeWidth="3.4"
                  strokeDasharray="72, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">72%</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                  Overall<br />Mastery
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-3 border-t border-slate-200/60 dark:border-white/10 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Active</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">2 Langs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Studied</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedViewUser.cardsLearned || 840} cards</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Accuracy</span>
                <span className="text-xs font-bold text-emerald-500">94.8%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {[
              {
                lang: selectedViewUser.lang,
                flag: COUNTRY_CODE_BY_NAME[selectedViewUser.country.toLowerCase()] || 'jp',
                level: `${selectedViewUser.level || 'Intermediate'} Proficiency`,
                pct: 74,
                learned: selectedViewUser.cardsLearned || 640,
                total: 850,
                mastered: Math.round((selectedViewUser.cardsLearned || 640) * 0.7),
                reviewDue: 18,
                accentColor: currentAccent.primary,
                badgeBg: 'bg-amber-500/10 text-amber-500',
                streak: selectedViewUser.streak,
              },
              {
                lang: 'English',
                flag: 'us',
                level: 'Advanced Fluency',
                pct: 55,
                learned: 320,
                total: 580,
                mastered: 210,
                reviewDue: 12,
                accentColor: '#6366f1',
                badgeBg: 'bg-indigo-500/10 text-indigo-400',
                streak: '14d streak',
              },
            ].map((l) => (
              <div
                key={l.lang}
                className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/70 dark:hover:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FlagIcon code={l.flag} size="sm" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {l.lang}
                    </span>
                    <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-md ${l.badgeBg} truncate`}>
                      {l.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      {l.streak}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {l.pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${l.pct}%`, backgroundColor: l.accentColor }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <div className="flex items-center gap-3">
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{l.learned}</strong> / {l.total} cards
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-emerald-500 font-bold">{l.mastered}</strong> mastered
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 font-semibold">{l.reviewDue} due today</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
