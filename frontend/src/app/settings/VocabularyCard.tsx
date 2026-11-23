'use client';

import React from 'react';
import { Sliders, Globe2, ChevronRight } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { SUPPORTED_APP_LANGUAGES, useI18n } from '@/lib/i18n';
import { SettingsModalType } from './types';

interface VocabularyCardProps {
  onOpenModal: (modal: SettingsModalType) => void;
  enabledCount: number;
  appLanguage: string;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  onOpenModal,
  enabledCount,
  appLanguage,
}) => {
  const { t } = useI18n();

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-2.5">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        {t('vocabularySection')}
      </h2>

      <div className="divide-y divide-slate-100 dark:divide-[#2e2e2e] rounded-2xl bg-slate-50/50 dark:bg-[#282828]/50 border border-slate-200/70 dark:border-[#2e2e2e] overflow-hidden">
        {/* Card Auto-Fill Details Checklist */}
        <button
          type="button"
          onClick={() => onOpenModal('wordChecklist')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-purple-300 transition-colors block">
                {t('checklistLabel')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {t('checklistDescShort')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400">{enabledCount} / 16 {t('activeLabel')}</span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Application UI Language Grid Modal */}
        <button
          type="button"
          onClick={() => onOpenModal('appLanguages')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-300 transition-colors block">
                {t('appInterfaceLanguages')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {SUPPORTED_APP_LANGUAGES.find((l) => l.code === appLanguage)?.name || 'English'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FlagIcon
              code={SUPPORTED_APP_LANGUAGES.find((l) => l.code === appLanguage)?.countryCode || 'us'}
              size="sm"
            />
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </div>
    </div>
  );
};
