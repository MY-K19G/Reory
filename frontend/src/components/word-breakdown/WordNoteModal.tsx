'use client';

import React from 'react';
import { FileText, X, Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface WordNoteModalProps {
  isOpen: boolean;
  word: string;
  note: string;
  onChangeNote: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function WordNoteModal({
  isOpen,
  word,
  note,
  onChangeNote,
  onClose,
  onSave,
}: WordNoteModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Add Note for &ldquo;{word}&rdquo;
              </h3>
              <p className="text-[11px] text-slate-400">
                Custom mnemonic, memory aid, or example
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {t('studyNoteHint')}
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="e.g. Remember: related to euphoria / state of extreme happiness..."
            autoFocus
            className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#252525] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-accent-primary resize-none leading-relaxed"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-accent-primary text-white shadow-sm hover:opacity-90 active:scale-95 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('saveNoteAndAdd')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
