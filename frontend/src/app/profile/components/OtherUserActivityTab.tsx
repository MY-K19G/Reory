'use client';

import React from 'react';
import { ActivityItem } from '../types';

interface OtherUserActivityTabProps {
  selectedViewUser: { name: string };
  recentActivities: ActivityItem[];
}

export const OtherUserActivityTab: React.FC<OtherUserActivityTabProps> = ({
  selectedViewUser,
  recentActivities,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-4 transition-colors animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Activity
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedViewUser.name}&apos;s latest completed study sessions
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden divide-y divide-slate-200/60 dark:divide-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        {recentActivities.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${act.iconBg}`}
              >
                {act.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {act.title}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {act.subtitle}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 ml-3">
              {act.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
