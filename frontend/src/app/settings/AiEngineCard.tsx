'use client';

import React from 'react';
import { Key, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { StorageMode } from '@/lib/crypto';
import { useI18n } from '@/lib/i18n';
import { SettingsModalType } from './types';

interface AiEngineCardProps {
  onOpenModal: (modal: SettingsModalType) => void;
  apiKey: string;
  apiStorageMode: StorageMode;
  pexelsKey: string;
  pexelsStorageMode?: StorageMode;
}

export const AiEngineCard: React.FC<AiEngineCardProps> = ({
  onOpenModal,
  apiKey,
  apiStorageMode,
  pexelsKey,
  pexelsStorageMode = 'local',
}) => {
  const { t } = useI18n();

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-2.5">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
        {t('aiEnginesSection')}
      </h2>

      <div className="divide-y divide-slate-100 dark:divide-[#2e2e2e] rounded-2xl bg-slate-50/50 dark:bg-[#282828]/50 border border-slate-200/70 dark:border-[#2e2e2e] overflow-hidden">
        {/* Google Gemini AI Engine */}
        <button
          type="button"
          onClick={() => onOpenModal('geminiKey')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-300 transition-colors block">
                {t('geminiTitle')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {apiKey
                  ? apiStorageMode === 'cloud'
                    ? 'Encrypted Cloud Sync (AES-256)'
                    : 'Saved locally in this browser'
                  : t('geminiDescShort')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                apiKey
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {apiKey ? (apiStorageMode === 'cloud' ? 'Cloud Sync' : 'Local Only') : t('activeFreeApi')}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Pexels Visual Intelligence */}
        <button
          type="button"
          onClick={() => onOpenModal('pexelsKey')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-300 transition-colors block">
                {t('pexelsImageApiShort')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {pexelsKey
                  ? pexelsStorageMode === 'cloud'
                    ? 'Encrypted Cloud Sync (AES-256)'
                    : 'Saved locally in this browser'
                  : t('pexelsDescShort')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                pexelsKey
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
              }`}
            >
              {pexelsKey ? (pexelsStorageMode === 'cloud' ? 'Cloud Sync' : 'Local Only') : t('optional')}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </div>
    </div>
  );
};
