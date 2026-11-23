'use client';

import { Lock, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface DeckVisibilityStepProps {
  visibility: 'Private' | 'Public';
  setVisibility: (val: 'Private' | 'Public') => void;
  saving: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function DeckVisibilityStep({
  visibility,
  setVisibility,
  saving,
  isEditing,
  onCancel,
  onSubmit,
}: DeckVisibilityStepProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full text-white bg-accent-primary font-bold text-xs flex items-center justify-center shrink-0">
            4
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1e293b] dark:text-white">{t('deckVisibility')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('deckVisibilityDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Private Option */}
          <button
            type="button"
            onClick={() => setVisibility('Private')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              visibility === 'Private'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent shadow-md'
                : 'bg-slate-50 dark:bg-[#282828] border-slate-200/80 dark:border-[#383838] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-[#484848]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                visibility === 'Private'
                  ? 'bg-white/15 dark:bg-black/10 text-white dark:text-black'
                  : 'bg-slate-200/70 dark:bg-[#333] text-slate-600 dark:text-slate-400'
              }`}
            >
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold">{t('privateDeck')}</span>
                {visibility === 'Private' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                )}
              </div>
              <p
                className={`text-[11px] mt-1 leading-relaxed ${
                  visibility === 'Private'
                    ? 'text-slate-300 dark:text-slate-600'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t('privateDeckDesc')}
              </p>
            </div>
          </button>

          {/* Public Option */}
          <button
            type="button"
            onClick={() => setVisibility('Public')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              visibility === 'Public'
                ? 'bg-emerald-600 text-white border-transparent shadow-md'
                : 'bg-slate-50 dark:bg-[#282828] border-slate-200/80 dark:border-[#383838] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-[#484848]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                visibility === 'Public'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/70 dark:bg-[#333] text-slate-600 dark:text-slate-400'
              }`}
            >
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold">{t('publicDeck')}</span>
                {visibility === 'Public' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <p
                className={`text-[11px] mt-1 leading-relaxed ${
                  visibility === 'Public' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t('publicDeckDesc')}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-full bg-white dark:bg-[#121626] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/70 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
        >
          {t('cancel')}
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent-primary dark:bg-accent-primary hover:opacity-90 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{saving ? t('creating') : isEditing ? t('updateDeck') : t('createNewDeckBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
