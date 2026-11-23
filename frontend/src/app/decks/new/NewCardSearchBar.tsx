'use client';

import React from 'react';
import { Search, X, Clock, RotateCcw, Mic } from 'lucide-react';
import { RECENT_SEARCH_SUGGESTIONS } from './constants';
import { useI18n } from '@/lib/i18n';

interface NewCardSearchBarProps {
  wordInput: string;
  setWordInput: (val: string) => void;
  onSearch: (word: string) => void;
  historyOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  historyRef: React.RefObject<HTMLDivElement | null>;
  isListening: boolean;
  onVoiceInput: () => void;
}

export function NewCardSearchBar({
  wordInput,
  setWordInput,
  onSearch,
  historyOpen,
  setHistoryOpen,
  historyRef,
  isListening,
  onVoiceInput,
}: NewCardSearchBarProps) {
  const { t } = useI18n();

  return (
    <div className="relative">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-full px-4 py-2.5 sm:py-3 shadow-xs border border-slate-200/80 dark:border-[#303030] flex items-center gap-2.5 sm:gap-3 transition-all focus-within:border-[#ea7a54] dark:focus-within:border-[#555] focus-within:shadow-md">
        {/* Magnifying Search Icon */}
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-0.5" />

        {/* Input Field */}
        <input
          type="text"
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && wordInput.trim()) {
              e.preventDefault();
              onSearch(wordInput);
            }
          }}
          placeholder={t('searchWordPlaceholder')}
          className="flex-1 bg-transparent text-xs sm:text-sm font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none min-w-0"
        />

        {/* Clear Input if text exists */}
        {wordInput && (
          <button
            type="button"
            onClick={() => setWordInput('')}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right Group: Clock/History Icon, Mic/Audio Icon */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0" ref={historyRef}>
          {/* History / Clock Icon Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Recent searches"
            >
              <Clock className="w-4 h-4" />
            </button>

            {historyOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#282828] rounded-2xl shadow-xl border border-slate-100 dark:border-[#383838] py-2 z-40 animate-in fade-in zoom-in-95">
                <p className="px-3.5 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Recent Words
                </p>
                {RECENT_SEARCH_SUGGESTIONS.length > 0 ? (
                  RECENT_SEARCH_SUGGESTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        setWordInput(w);
                        onSearch(w);
                        setHistoryOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 capitalize cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>{w}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3.5 py-1.5 text-xs text-slate-400">No recent searches</p>
                )}
              </div>
            )}
          </div>

          {/* Mic / Voice Speech-to-Text Input Button */}
          <button
            type="button"
            onClick={onVoiceInput}
            disabled={isListening}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-200'
                : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
            title={isListening ? 'Listening... Speak now' : 'Search by Voice'}
            aria-label="Voice Search"
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
