'use client';

import React from 'react';
import { Info, X, Loader2 } from 'lucide-react';
import { WordTreeBreakdown } from '@/components/WordTreeBreakdown';
import { WordDetails } from '@/lib/types';

interface WordIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWordDetails: WordDetails | null;
  loadingWordDetails: boolean;
  targetLang: string;
  nativeLang: string;
  cardId?: number | string;
  onImageUpdated?: (newImageUrl: string) => void;
}

export const WordIntelligenceModal: React.FC<WordIntelligenceModalProps> = ({
  isOpen,
  onClose,
  selectedWordDetails,
  loadingWordDetails,
  targetLang,
  nativeLang,
  cardId,
  onImageUpdated,
}) => {
  if (!isOpen || !selectedWordDetails) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Title and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shrink-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/10 dark:bg-white/10 flex items-center justify-center text-accent-primary dark:text-cyan-400">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">Word Intelligence</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400">Comprehensive meaning, examples, grammar &amp; breakdown</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loadingWordDetails ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent-primary dark:text-cyan-400" />
              <p className="text-sm font-medium text-slate-500">Loading word intelligence…</p>
            </div>
          ) : (
            <WordTreeBreakdown
              details={selectedWordDetails}
              targetLanguage={targetLang}
              nativeLanguage={nativeLang}
              cardId={cardId}
              onImageUpdated={onImageUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};
