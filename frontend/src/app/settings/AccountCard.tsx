'use client';

import React from 'react';
import { User, Lock, Bell, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { SettingsModalType } from './types';

interface AccountCardProps {
  onOpenModal: (modal: SettingsModalType) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  onOpenModal,
  notificationsEnabled,
  onToggleNotifications,
}) => {
  const { t } = useI18n();

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-2.5">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        {t('accountSection')}
      </h2>

      <div className="divide-y divide-slate-100 dark:divide-[#2e2e2e] rounded-2xl bg-slate-50/50 dark:bg-[#282828]/50 border border-slate-200/70 dark:border-[#2e2e2e] overflow-hidden">
        {/* Profile */}
        <button
          type="button"
          onClick={() => onOpenModal('profile')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-cyan-300 transition-colors block">
                {t('profile')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('profileDesc')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Change Password */}
        <button
          type="button"
          onClick={() => onOpenModal('password')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-300 transition-colors block">
                {t('changePassword')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('changePasswordDesc')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">
                {t('notifications')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('notificationsDesc')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleNotifications}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              notificationsEnabled ? 'bg-cyan-400' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                notificationsEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
