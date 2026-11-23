'use client';

import React from 'react';
import { Lightbulb, Quote, Volume2, Clock, Shuffle, Sparkles } from 'lucide-react';
import { WordDetails } from '@/lib/types';

interface WordDetailsAccordionProps {
  details: WordDetails;
  targetLanguage: string;
  nativeLangCode: string;
  openSections: Record<string, boolean>;
  currentTranslation: {
    main: string;
    sub: string;
  };
  onToggleSection: (section: 'simpleMeaning' | 'exampleSentences') => void;
  onPronounce: (text?: string, langCode?: string) => void;
}

export function WordDetailsAccordion({
  details,
  targetLanguage,
  nativeLangCode,
  openSections,
  currentTranslation,
  onToggleSection,
  onPronounce,
}: WordDetailsAccordionProps) {
  return (
    <div className="space-y-3.5">
      {/* ── CARD 1: Understand the word ── */}
      <div id="section-meaning" className="scroll-mt-16 bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] transition-all">
        <div
          onClick={() => onToggleSection('simpleMeaning')}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white">Understand the word</h2>
          </div>
          <button
            type="button"
            className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className={`inline-block transition-transform duration-200 text-xs ${openSections.simpleMeaning ? 'rotate-0' : '-rotate-90'}`}>
              ▼
            </span>
          </button>
        </div>

        {openSections.simpleMeaning && (
          <div className="pt-3 pl-11 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                What does it really mean?
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                {details.understandRealMeaning ||
                  details.simpleMeaning ||
                  details.meaning ||
                  'A feeling of calm and peace when there is no stress or worry.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f9fe] dark:bg-[#282828] border border-accent-subtle dark:border-[#383838] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-primary dark:text-slate-200">
                <Lightbulb className="w-3.5 h-3.5 text-accent-primary dark:text-slate-200" />
                <span>Think of it as:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic">
                {details.understandMentalModel ||
                  (details.simpleMeaning || details.meaning
                    ? `“${details.simpleMeaning || details.meaning}”`
                    : `“A foundational vocabulary concept in ${targetLanguage}.”`)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: Translation ── */}
      <div id="section-translation" className="scroll-mt-16 bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0">
              <span className="text-base">🌐</span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white">Translation</h2>
          </div>
        </div>

        <div className="pt-2.5 pl-11 space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="text-base sm:text-lg font-bold text-[#141b2d] dark:text-white">
              {currentTranslation.main}
            </p>
            <button
              type="button"
              onClick={() => onPronounce(currentTranslation.main, nativeLangCode || 'en')}
              className="w-6 h-6 rounded-full text-slate-400 hover:text-accent-primary dark:hover:text-cyan-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Listen to translation"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {currentTranslation.sub && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentTranslation.sub}
            </p>
          )}
        </div>
      </div>

      {/* ── CARD 3: Example Sentences ── */}
      <div id="section-examples" className="scroll-mt-16 bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] transition-all">
        <div
          onClick={() => onToggleSection('exampleSentences')}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0">
              <Quote className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white">Example Sentences</h2>
          </div>
          <button
            type="button"
            className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className={`inline-block transition-transform duration-200 text-xs ${openSections.exampleSentences ? 'rotate-0' : '-rotate-90'}`}>
              ▼
            </span>
          </button>
        </div>

        {openSections.exampleSentences && (
          <div className="pt-2.5 pl-11 space-y-3">
            {(() => {
              const primary = details.exampleSentences?.[0];
              const sentenceText =
                typeof primary === 'string'
                  ? primary
                  : primary?.sentence || `She experienced the essence of ${details.word}.`;
              const translationText =
                typeof primary === 'object' ? primary?.translation : undefined;

              return (
                <div className="space-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                      {sentenceText}
                    </p>
                    <button
                      type="button"
                      onClick={() => onPronounce(sentenceText)}
                      className="w-6 h-6 rounded-full text-slate-400 hover:text-accent-primary dark:hover:text-indigo-400 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Listen"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {translationText && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {translationText}
                    </p>
                  )}
                </div>
              );
            })()}

            {details.exampleSentences && details.exampleSentences.length > 1 && (
              <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-0.5">
                {(() => {
                  const extra = details.exampleSentences[1];
                  const eng = typeof extra === 'string' ? extra : extra.sentence;
                  const trans = typeof extra === 'object' ? extra.translation : undefined;
                  return (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                          {eng}
                        </p>
                        <button
                          type="button"
                          onClick={() => onPronounce(eng)}
                          className="w-6 h-6 rounded-full text-slate-400 hover:text-accent-primary dark:hover:text-indigo-400 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {trans && <p className="text-xs text-slate-500 dark:text-slate-400">{trans}</p>}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 4: Word Forms & Grammar ── */}
      <div id="section-grammar" className="scroll-mt-16 bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-3 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white">Word family</h2>
        </div>
        <div className="pl-11">
          {details.wordForms && details.wordForms.length > 1 ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-[#383838]">
                <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Base Form</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{details.word}</span>
              </div>
              {details.wordForms[1] && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-[#383838]">
                  <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Related Form / Plural</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{details.wordForms[1]}</span>
                </div>
              )}
              {details.wordForms[2] && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-[#383838]">
                  <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Derivative / Adjective</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{details.wordForms[2]}</span>
                </div>
              )}
              {details.wordForms[3] && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-[#383838]">
                  <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Additional Form</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{details.wordForms[3]}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-[#383838] inline-block text-xs">
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Base Form</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{details.word}</span>
            </div>
          )}
        </div>
        {details.etymology && (
          <div className="pl-11 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-800 dark:text-white">Etymology:</strong> {details.etymology}
          </div>
        )}
      </div>

      {/* ── CARD 5: Synonyms & Antonyms ── */}
      <div id="section-synonyms" className="scroll-mt-16 bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-3 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0">
            <Shuffle className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white">Synonyms &amp; Antonyms</h2>
        </div>
        <div className="pl-11 space-y-2.5">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">Synonyms</p>
            <div className="flex flex-wrap gap-2">
              {(details.synonyms?.length
                ? details.synonyms
                : ['calmness', 'peace', 'tranquility', 'stillness', 'quietude']
              ).map((syn, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-accent-subtle border border-accent-subtle text-accent-primary font-semibold text-xs transition-all hover:scale-[1.02]"
                >
                  {typeof syn === 'string' ? syn : syn.word}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">Antonyms</p>
            <div className="flex flex-wrap gap-2">
              {(details.antonyms?.length
                ? details.antonyms
                : ['chaos', 'disturbance', 'agitation', 'turmoil', 'anxiety']
              ).map((ant, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 text-rose-700 dark:text-rose-300 font-semibold text-xs transition-all hover:scale-[1.02]"
                >
                  {typeof ant === 'string' ? ant : ant.word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 6: AI Deep Explanation ── */}
      <div id="section-ai-explanation" className="scroll-mt-16 bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-2 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white">AI Deep Linguistics</h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent-subtle text-accent-primary border border-accent-subtle">
            Nuance
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed pl-11 font-normal">
          {details.aiExplanation ||
            `${details.word} represents not just an external quiet, but a steadfast mental state of composure and clarity that shields against outer chaos.`}
        </p>
      </div>
    </div>
  );
}
