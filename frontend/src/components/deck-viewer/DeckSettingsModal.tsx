'use client';

import React from 'react';
import {
  Settings,
  X,
  Repeat,
  Headphones,
  Eye,
  Volume2,
  Clock,
  RotateCw,
  Zap,
  Flame,
  Trash2,
  Check,
} from 'lucide-react';
import { Deck } from '@/lib/types';

interface DeckSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiDeck: Deck | null;
  deckId: string | number;
  dailyNewCards: number;
  setDailyNewCards: (n: number) => void;
  reviewOrder: 'srs' | 'random' | 'oldest';
  setReviewOrder: (order: 'srs' | 'random' | 'oldest') => void;
  cramMode: boolean;
  setCramMode: (val: boolean) => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (val: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (speed: number) => void;
  cardOrientation: 'term-first' | 'meaning-first' | 'audio-only';
  setCardOrientation: (val: 'term-first' | 'meaning-first' | 'audio-only') => void;
  showRomaji: boolean;
  setShowRomaji: (val: boolean) => void;
  showExamples: boolean;
  setShowExamples: (val: boolean) => void;
  showMnemonics: boolean;
  setShowMnemonics: (val: boolean) => void;
  mcqOptionsCount: number;
  allowForking: boolean;
  deckTitleInput: string;
  deckDescInput: string;
  isPublicState: boolean;
  isSavingSettings: boolean;
  onSaveSettings: () => Promise<void>;
  onDeleteDeck: () => Promise<void>;
}

export const DeckSettingsModal: React.FC<DeckSettingsModalProps> = ({
  isOpen,
  onClose,
  dailyNewCards,
  setDailyNewCards,
  reviewOrder,
  setReviewOrder,
  cramMode,
  setCramMode,
  autoPlayAudio,
  setAutoPlayAudio,
  ttsSpeed,
  setTtsSpeed,
  cardOrientation,
  setCardOrientation,
  showRomaji,
  setShowRomaji,
  showExamples,
  setShowExamples,
  showMnemonics,
  setShowMnemonics,
  isSavingSettings,
  onSaveSettings,
  onDeleteDeck,
}) => {
  const [deckSettingsTab, setDeckSettingsTab] = React.useState<'study' | 'audio' | 'display'>('study');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 dark:border-[#2e2e2e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Deck Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure study algorithm, audio &amp; card display</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categorized Settings Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 dark:border-[#2e2e2e] bg-slate-50/50 dark:bg-[#1a1a1a]/50 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setDeckSettingsTab('study')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              deckSettingsTab === 'study'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Study &amp; SRS</span>
          </button>
          <button
            type="button"
            onClick={() => setDeckSettingsTab('audio')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              deckSettingsTab === 'audio'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>
          <button
            type="button"
            onClick={() => setDeckSettingsTab('display')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              deckSettingsTab === 'display'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Display</span>
          </button>
        </div>

        {/* Scrollable Settings Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* TAB 1: STUDY & SRS */}
          {deckSettingsTab === 'study' && (
            <div className="space-y-5">
              {/* Daily Target */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Daily New Cards Target
                  </label>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {dailyNewCards} cards / day
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  How many unstudied cards should be added into your review queue each session.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[5, 10, 20, 30].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDailyNewCards(n)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        dailyNewCards === n
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {n} Cards
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Queue Order */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#2e2e2e]">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Card Review Order
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewOrder('srs')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      reviewOrder === 'srs'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Smart SRS</span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-80">Prioritizes due &amp; weak cards</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewOrder('random')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      reviewOrder === 'random'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Shuffle</span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-80">Randomize deck order</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewOrder('oldest')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      reviewOrder === 'oldest'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Oldest</span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-80">Review oldest added first</p>
                  </button>
                </div>
              </div>

              {/* Cram Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838]">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>Cram / Test Prep Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Practice without altering spaced repetition decay intervals or ease factors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCramMode(!cramMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    cramMode ? 'bg-orange-500' : 'bg-slate-300 dark:bg-[#404040]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      cramMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO */}
          {deckSettingsTab === 'audio' && (
            <div className="space-y-5">
              {/* Auto-Play Sound */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838]">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto-play Pronunciation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatically speak word aloud whenever flipping or moving to a card.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    autoPlayAudio ? 'bg-amber-500' : 'bg-slate-300 dark:bg-[#404040]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoPlayAudio ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* TTS Speech Rate */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Voice Playback Speed
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Adjust speech rate to help catch subtle nuances in pronunciation.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: '0.75x (Slower)', val: 0.75 },
                    { label: '1.0x (Normal)', val: 1.0 },
                    { label: '1.25x (Faster)', val: 1.25 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setTtsSpeed(item.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        ttsSpeed === item.val
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DISPLAY */}
          {deckSettingsTab === 'display' && (
            <div className="space-y-5">
              {/* Card Front Orientation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Card Front Orientation
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Choose which side is shown as the question prompt.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'term-first', label: 'Term First', desc: 'Front word → Meaning' },
                    { id: 'meaning-first', label: 'Meaning First', desc: 'Recall target word' },
                    { id: 'audio-only', label: 'Audio Only', desc: 'Listening comprehension' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCardOrientation(item.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        cardOrientation === item.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-50 dark:bg-[#282828] border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Romaji / Reading */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838]">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">
                    Show Romaji &amp; Pronunciation Phonetics
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Display furigana / romaji / IPA on card back.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRomaji(!showRomaji)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    showRomaji ? 'bg-amber-500' : 'bg-slate-300 dark:bg-[#404040]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showRomaji ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle Example Sentences */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838]">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">
                    Show Example Sentences
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Show context sentences when reviewing cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExamples(!showExamples)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    showExamples ? 'bg-amber-500' : 'bg-slate-300 dark:bg-[#404040]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showExamples ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle Mnemonics */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838]">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">
                    Show Memory Mnemonics &amp; Notes
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Reveal memory aids and custom learner notes on card back.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMnemonics(!showMnemonics)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    showMnemonics ? 'bg-amber-500' : 'bg-slate-300 dark:bg-[#404040]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showMnemonics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-[#2e2e2e] bg-slate-50/50 dark:bg-[#1a1a1a]/50 shrink-0">
          <button
            type="button"
            onClick={onDeleteDeck}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
            title="Delete this deck permanently"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Deck</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSavingSettings}
              onClick={onSaveSettings}
              className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs shadow-xs hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSavingSettings ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
