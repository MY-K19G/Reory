'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { AccentOption } from '@/lib/theme';
import { ActivityItem } from '../types';

interface ProfileActivityTabProps {
  recentActivities: ActivityItem[];
  currentAccent?: AccentOption;
}

export const ProfileActivityTab: React.FC<ProfileActivityTabProps> = ({
  recentActivities,
  currentAccent,
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-4 transition-colors animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {t('recentActivity')}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('recentActivityDesc')}
          </p>
        </div>
        <Link
          href="/profile/activity"
          className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <span>{t('viewFullLog')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity Log Style: Clean unified list with single-line rows or empty state */}
      {recentActivities.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('noActivityRecordedYet')}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            {t('noActivityRecordedDesc')}
          </p>
          <Link
            href="/explore"
            className="mt-3.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: currentAccent?.primary || '#3b82f6' }}
          >
            {t('exploreDecksAndPractice')}
          </Link>
        </div>
      ) : (
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
                <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap sm:flex-nowrap">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {act.title}
                  </span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {act.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {act.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
