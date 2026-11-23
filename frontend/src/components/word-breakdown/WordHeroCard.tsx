'use client';

import React from 'react';
import {
  Volume2,
  Bookmark,
  Share2,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Copy,
  ArrowRight,
  Maximize2,
  FileText,
  Camera,
  RotateCcw,
} from 'lucide-react';
import { WordDetails } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface WordHeroCardProps {
  details: WordDetails;
  targetLanguage: string;
  isWordOfTheDay?: boolean;
  heroImage: string;
  isSaved: boolean;
  saving?: boolean;
  copied: boolean;
  shared: boolean;
  deckDropdownOpen: boolean;
  actionsDropdownOpen: boolean;
  deckDropdownRef: React.RefObject<HTMLDivElement | null>;
  actionsDropdownRef: React.RefObject<HTMLDivElement | null>;
  onPronounce: (text?: string, langCode?: string) => void;
  onSave?: () => void;
  onShare: () => void;
  onCopyWord: () => void;
  onToggleDeckDropdown: () => void;
  onToggleActionsDropdown: () => void;
  onOpenNoteModal: () => void;
  onOpenImageViewer: () => void;
  onBackToSearch?: () => void;
  onToggleBookmark: () => void;
  showActionButtons?: boolean;
  onChangeImage?: () => void;
  onResetImage?: () => void;
  hasCustomImage?: boolean;
}

export function WordHeroCard({
  details,
  targetLanguage,
  isWordOfTheDay,
  heroImage,
  isSaved,
  saving,
  copied,
  shared,
  deckDropdownOpen,
  actionsDropdownOpen,
  deckDropdownRef,
  actionsDropdownRef,
  onPronounce,
  onSave,
  onShare,
  onCopyWord,
  onToggleDeckDropdown,
  onToggleActionsDropdown,
  onOpenNoteModal,
  onOpenImageViewer,
  onBackToSearch,
  onToggleBookmark,
  showActionButtons = false,
  onChangeImage,
  onResetImage,
  hasCustomImage,
}: WordHeroCardProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 dark:border-[#2e2e2e] relative overflow-visible">
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* Left Column: Word details, phonetics, badge, def, action buttons */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Word Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight lowercase leading-none">
            {details.word}
          </h1>

          {/* Pronunciation & Audio */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal">
              /{details.pronunciation ? details.pronunciation.replace(/^\/|\/$/g, '') : "sə'ren.ɪ.ti"}/
            </span>
            <button
              type="button"
              onClick={() => onPronounce()}
              className="w-6 h-6 rounded-full text-slate-400 hover:text-accent-primary dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Listen to pronunciation"
              aria-label="Listen"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Part of Speech, Word of the Day & Language Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block px-3 py-0.5 rounded-full bg-accent-primary/10 dark:bg-[#2e2e2e] text-accent-primary dark:text-slate-200 font-semibold text-xs border border-transparent dark:border-[#3a3a3a]">
              {details.partOfSpeech || 'noun'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20">
              <span className="capitalize">{targetLanguage}</span>
            </span>
            {isWordOfTheDay && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 shadow-xs animate-in fade-in">
                <span>✨</span>
                <span>Word of the Day</span>
              </span>
            )}
          </div>

          {/* Concise Definition */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md font-normal">
            {details.meaning || details.simpleMeaning || 'The state of being calm, peaceful, and untroubled.'}
          </p>

          {/* Action Buttons Row - Only enabled on /decks/new */}
          {showActionButtons && (
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {/* Save Button */}
              <button
                type="button"
                onClick={() => {
                  if (onSave) onSave();
                }}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-accent-primary dark:bg-accent-primary dark:text-white dark:hover:opacity-90 hover:opacity-90 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{saving ? 'Saving…' : isSaved ? t('saved') : t('save')}</span>
              </button>

              {/* Share Button (Outlined pill) */}
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-white dark:bg-[#282828] border border-slate-200 dark:border-[#383838] hover:bg-slate-50 dark:hover:bg-[#333] text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{shared ? 'Copied!' : 'Share'}</span>
              </button>

              {/* Add to deck with Down Arrow Dropdown (Add Note option) */}
              <div className="relative inline-flex items-center" ref={deckDropdownRef}>
                <div className="inline-flex items-center rounded-full bg-white dark:bg-[#282828] border border-slate-200 dark:border-[#383838] hover:bg-slate-50 dark:hover:bg-[#333] shadow-2xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSave) onSave();
                    }}
                    className="inline-flex items-center gap-1.5 pl-3.5 sm:pl-4 pr-2 py-2 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-[#3a3a3a] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{t('addToDeck')}</span>
                  </button>

                  {/* Down arrow dropdown trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDeckDropdown();
                    }}
                    className="px-2 py-2 border-l border-slate-200 dark:border-[#383838] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                    title="More deck options"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        deckDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {deckDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-slate-200 dark:border-[#2e2e2e] py-1.5 z-40 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={onOpenNoteModal}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#252525] flex items-center gap-2.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      <div>
                        <span>Add note</span>
                        <p className="text-[10px] font-normal text-slate-400">Personal mnemonic or study hint</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleDeckDropdown();
                        if (onSave) onSave();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#252525] flex items-center gap-2.5 cursor-pointer border-t border-slate-100 dark:border-white/5"
                    >
                      <Plus className="w-4 h-4 text-accent-primary" />
                      <div>
                        <span>Quick add</span>
                        <p className="text-[10px] font-normal text-slate-400">Add directly to active deck</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* More Actions Button (...) */}
              <div className="relative" ref={actionsDropdownRef}>
                <button
                  type="button"
                  onClick={onToggleActionsDropdown}
                  className="w-8 h-8 rounded-full bg-white dark:bg-[#282828] border border-slate-200 dark:border-[#383838] hover:bg-slate-50 dark:hover:bg-[#333] text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {actionsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#0c0f1d] rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 py-1.5 z-30 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={onCopyWord}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      {copied ? 'Copied to clipboard' : 'Copy word text'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onPronounce()}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                      Play pronunciation
                    </button>
                    {onBackToSearch && (
                      <button
                        type="button"
                        onClick={onBackToSearch}
                        className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-white/10"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        Search another word
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Hero Image with Top-Right Bookmark Icon */}
        <div
          onClick={onOpenImageViewer}
          className="w-full sm:w-44 sm:h-36 md:w-52 md:h-40 max-w-[240px] aspect-4/3 rounded-2xl overflow-hidden relative shrink-0 shadow-xs border border-slate-100 dark:border-white/10 bg-slate-100 dark:bg-slate-900 group cursor-pointer"
          title="Click to view full image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={details.word}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="p-2 rounded-full bg-black/40 text-white backdrop-blur-xs shadow-sm">
              <Maximize2 className="w-4 h-4" />
            </span>
          </div>
          {/* Action buttons on Image (Change & Reset) */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
            {onChangeImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeImage();
                }}
                className="px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center gap-1 text-[11px] font-semibold text-white shadow-xs transition-colors cursor-pointer"
                title="Search & change image"
              >
                <Camera className="w-3 h-3" />
                <span>Change</span>
              </button>
            )}
            {onResetImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onResetImage();
                }}
                className="px-2 py-1 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur-md flex items-center gap-1 text-[11px] font-semibold text-white/90 hover:text-white shadow-xs transition-colors cursor-pointer"
                title="Reset to default original image"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Top-Right Bookmark Icon inside image matching reference */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 shadow-xs transition-colors cursor-pointer"
            title={isSaved ? 'Bookmarked' : 'Bookmark this word'}
          >
            <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current text-amber-300' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
