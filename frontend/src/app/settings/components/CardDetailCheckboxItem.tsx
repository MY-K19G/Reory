'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { DetailItemConfig, CardDetailSettings } from '@/lib/cardDetailSettings';

const ITEM_LABEL_KEYS: Record<string, string> = {
  showMeaning: 'detailMeaning',
  showSimpleMeaning: 'detailSimpleMeaning',
  showTranslation: 'detailTranslation',
  showPronunciation: 'detailPronunciation',
  showPartOfSpeech: 'detailPartOfSpeech',
  showExampleSentences: 'detailExampleSentences',
  showSynonyms: 'detailSynonyms',
  showAntonyms: 'detailAntonyms',
  showWordForms: 'detailWordForms',
  showEtymology: 'detailEtymology',
  showCommonPhrases: 'detailCommonPhrases',
  showAiExplanation: 'detailAiExplanation',
  showImages: 'detailImages',
  showRelatedWords: 'detailRelatedWords',
  showQuiz: 'detailQuiz',
};

const ITEM_DESC_KEYS: Record<string, string> = {
  showMeaning: 'detailMeaningDesc',
  showSimpleMeaning: 'detailSimpleMeaningDesc',
  showTranslation: 'detailTranslationDesc',
  showPronunciation: 'detailPronunciationDesc',
  showPartOfSpeech: 'detailPartOfSpeechDesc',
  showExampleSentences: 'detailExampleSentencesDesc',
  showSynonyms: 'detailSynonymsDesc',
  showAntonyms: 'detailAntonymsDesc',
  showWordForms: 'detailWordFormsDesc',
  showEtymology: 'detailEtymologyDesc',
  showCommonPhrases: 'detailCommonPhrasesDesc',
  showAiExplanation: 'detailAiExplanationDesc',
  showImages: 'detailImagesDesc',
  showRelatedWords: 'detailRelatedWordsDesc',
  showQuiz: 'detailQuizDesc',
};

const CATEGORY_NAME_KEYS: Record<string, string> = {
  all: 'categoryAll',
  core: 'categoryCore',
  linguistics: 'categoryLinguistics',
  ai: 'categoryAi',
  practice: 'categoryPractice',
};

interface CardDetailCheckboxItemProps {
  item: DetailItemConfig;
  isChecked: boolean;
  onToggle: (key: keyof CardDetailSettings) => void;
  t: (key: string) => string;
}

export function CardDetailCheckboxItem({
  item,
  isChecked,
  onToggle,
  t,
}: CardDetailCheckboxItemProps) {
  return (
    <div
      onClick={() => onToggle(item.key)}
      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none group ${
        isChecked
          ? 'bg-cyan-500/10 border-cyan-500/30 shadow-sm shadow-cyan-950/40'
          : 'bg-slate-50 dark:bg-[#080a10] border-slate-200 dark:border-white/5 opacity-80 dark:opacity-60 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-white/[0.03]'
      }`}
    >
      <div className="pt-0.5">
        <div
          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
            isChecked
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 group-hover:scale-105'
              : 'border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-900 group-hover:border-slate-400 dark:group-hover:border-white/20'
          }`}
        >
          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-white tracking-wide group-hover:text-cyan-200 transition-colors">
            {t(ITEM_LABEL_KEYS[item.key]) || item.label}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400">
            {t(CATEGORY_NAME_KEYS[item.category]) || item.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
          {t(ITEM_DESC_KEYS[item.key]) || item.description}
        </p>
      </div>
    </div>
  );
}
