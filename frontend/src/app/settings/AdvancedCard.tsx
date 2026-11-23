'use client';

import React from 'react';
import { Download, Upload, Trash2, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { SettingsModalType } from './types';

interface AdvancedCardProps {
  onOpenModal: (modal: SettingsModalType) => void;
  onResetImportState: () => void;
}

export const AdvancedCard: React.FC<AdvancedCardProps> = ({
  onOpenModal,
  onResetImportState,
}) => {
  const { t } = useI18n();

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-2.5">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        {t('advancedSection')}
      </h2>

      <div className="divide-y divide-slate-100 dark:divide-[#2e2e2e] rounded-2xl bg-slate-50/50 dark:bg-[#282828]/50 border border-slate-200/70 dark:border-[#2e2e2e] overflow-hidden">
        {/* Export Data */}
        <button
          type="button"
          onClick={() => onOpenModal('exportData')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-300 transition-colors block">
                {t('exportData')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('exportDataDesc')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Import Data */}
        <button
          type="button"
          onClick={() => {
            onResetImportState();
            onOpenModal('importData');
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-300 transition-colors block">
                {t('importData')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('importDataDesc')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Delete Account */}
        <button
          type="button"
          onClick={() => onOpenModal('deleteAccount')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-rose-500/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 group-hover:text-rose-300 transition-colors block">
                {t('deleteAccount')}
              </span>
              <span className="text-[11px] text-rose-400/70 block">
                {t('deleteAccountDesc')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};
