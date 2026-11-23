'use client';

import React from 'react';
import { Settings, X, Volume2 } from 'lucide-react';

interface LearnSessionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string | number;
  dailyNewCards: number;
  reviewOrder: string;
  cardOrientation: 'term-first' | 'meaning-first' | 'audio-only';
  setCardOrientation: (val: 'term-first' | 'meaning-first' | 'audio-only') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (val: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (val: number) => void;
  showRomaji: boolean;
  setShowRomaji: (val: boolean) => void;
  showExamples: boolean;
  setShowExamples: (val: boolean) => void;
  showMnemonics: boolean;
  cramMode: boolean;
  mcqOptionsCount: number;
  allowForking: boolean;
}

export const LearnSessionSettingsModal: React.FC<LearnSessionSettingsModalProps> = ({
  isOpen,
  onClose,
  deckId,
  dailyNewCards,
  reviewOrder,
  cardOrientation,
  setCardOrientation,
  autoPlayAudio,
  setAutoPlayAudio,
  ttsSpeed,
  setTtsSpeed,
  showRomaji,
  setShowRomaji,
  showExamples,
  setShowExamples,
  showMnemonics,
  cramMode,
  mcqOptionsCount,
  allowForking,
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem(
        `duocard_deck_settings_${deckId}`,
        JSON.stringify({
          dailyNewCards,
          reviewOrder,
          cardOrientation,
          autoPlayAudio,
          ttsSpeed,
          showRomaji,
          showExamples,
          showMnemonics,
          cramMode,
          mcqOptionsCount,
          allowForking,
        })
      );
    } catch (e) {
      console.warn('Failed saving settings:', e);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200/90 dark:border-[#2e2e2e] shadow-2xl p-6 space-y-5 text-slate-800 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2e2e2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Study Preferences</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">In-session controls for this study player</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Options */}
        <div className="space-y-4">
          {/* 1. Orientation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              Front Card Orientation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'term-first' as const, label: 'Term First' },
                { id: 'meaning-first' as const, label: 'Meaning' },
                { id: 'audio-only' as const, label: 'Audio Only' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCardOrientation(item.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    cardOrientation === item.id
                      ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                      : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Auto-Play Audio */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838]">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-accent-primary" /> Auto-play audio on flip
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Pronounce card when revealed</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                autoPlayAudio ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-[#404040]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  autoPlayAudio ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 3. Audio Speed */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              Pronunciation Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '0.75x Slow', val: 0.75 },
                { label: '1.0x Normal', val: 1.0 },
                { label: '1.25x Fast', val: 1.25 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setTtsSpeed(item.val)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    ttsSpeed === item.val
                      ? 'bg-accent-primary text-white border-accent-primary shadow-2xs'
                      : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Display Toggles: Romaji & Examples */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838]">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Show Romaji / Phonetics
              </span>
              <button
                type="button"
                onClick={() => setShowRomaji(!showRomaji)}
                className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  showRomaji ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-[#404040]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showRomaji ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838]">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Show Context Examples
              </span>
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  showExamples ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-[#404040]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showExamples ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Done button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
