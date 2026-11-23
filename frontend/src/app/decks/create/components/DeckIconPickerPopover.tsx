'use client';

import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { DeckIcon } from '@/components/DeckIcon';
import { ALL_SYSTEM_EMOJIS, EMOJI_SETS, getEmojiName } from '../constants';

interface DeckIconPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  deckIcon: string;
  onSelectEmoji: (emoji: string) => void;
  deckIconSearch: string;
  setDeckIconSearch: (s: string) => void;
  deckIconTab: string;
  setDeckIconTab: (tab: string) => void;
  hoveredDeckEmoji: string | null;
  setHoveredDeckEmoji: (emoji: string | null) => void;
  deckChipsScrollRef: React.RefObject<HTMLDivElement | null>;
}

export function DeckIconPickerPopover({
  isOpen,
  onClose,
  deckIcon,
  onSelectEmoji,
  deckIconSearch,
  setDeckIconSearch,
  deckIconTab,
  setDeckIconTab,
  hoveredDeckEmoji,
  setHoveredDeckEmoji,
  deckChipsScrollRef,
}: DeckIconPickerPopoverProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 top-full mt-2 w-80 sm:w-88 p-3 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200/90 dark:border-[#383838] shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-2.5">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-[#2f2f2f]">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          Emoji Icon Source
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-[#333] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={deckIconSearch}
          onChange={(e) => setDeckIconSearch(e.target.value)}
          placeholder="Search emoji or type any emoji..."
          autoFocus
          className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#333] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-accent-primary"
        />
        {deckIconSearch && (
          <button
            type="button"
            onClick={() => setDeckIconSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category Chips */}
      <div className="relative flex items-center group/deckchips">
        <button
          type="button"
          onClick={() => {
            if (deckChipsScrollRef.current) {
              deckChipsScrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
            }
          }}
          className="w-5 h-5 rounded-full bg-slate-200/80 dark:bg-[#2c2c2c] hover:bg-slate-300 dark:hover:bg-[#383838] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mr-1 cursor-pointer transition-colors shadow-2xs"
          title="Scroll left"
        >
          <ChevronDown className="w-3 h-3 rotate-90" />
        </button>

        <div
          ref={deckChipsScrollRef}
          onWheel={(e) => {
            if (deckChipsScrollRef.current) {
              e.preventDefault();
              deckChipsScrollRef.current.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
            }
          }}
          className="flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth select-none cursor-grab active:cursor-grabbing text-[10px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full"
        >
          {[
            { id: 'all', label: 'all ✨' },
            { id: 'study', label: 'study 📚' },
            { id: 'flags', label: 'flags 🎌' },
            { id: 'food', label: 'food 🍣' },
            { id: 'travel', label: 'travel ✈️' },
            { id: 'nature', label: 'nature 🌸' },
            { id: 'fun', label: 'fun 🎮' },
            { id: 'tech', label: 'tech 💻' },
            { id: 'objects', label: 'objects 📦' },
            { id: 'symbols', label: 'symbols 💡' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setDeckIconTab(cat.id);
                setDeckIconSearch('');
              }}
              className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors shrink-0 font-medium ${
                deckIconTab === cat.id
                  ? 'bg-accent-primary text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-[#282828] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#353535]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (deckChipsScrollRef.current) {
              deckChipsScrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
            }
          }}
          className="w-5 h-5 rounded-full bg-slate-200/80 dark:bg-[#2c2c2c] hover:bg-slate-300 dark:hover:bg-[#383838] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 ml-1 cursor-pointer transition-colors shadow-2xs"
          title="Scroll right"
        >
          <ChevronDown className="w-3 h-3 -rotate-90" />
        </button>
      </div>

      {/* Emoji Grid */}
      <div className="max-h-60 overflow-y-auto pr-1 scrollbar-thin">
        {(() => {
          let emojisToShow: string[] = [];
          if (deckIconTab === 'all') {
            emojisToShow = ALL_SYSTEM_EMOJIS;
          } else {
            emojisToShow = EMOJI_SETS[deckIconTab] || EMOJI_SETS.study;
          }

          if (deckIconSearch.trim()) {
            const query = deckIconSearch.trim().toLowerCase();
            const matches = ALL_SYSTEM_EMOJIS.filter((e) => {
              if (e.includes(query)) return true;
              return false;
            });
            emojisToShow = matches.length > 0 ? matches : [deckIconSearch.trim()];
          }

          return (
            <div
              className="grid grid-cols-6 gap-1.5 p-0.5"
              onMouseLeave={() => setHoveredDeckEmoji(null)}
            >
              {emojisToShow.map((emoji, idx) => {
                const isSelected = deckIcon === emoji;
                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setHoveredDeckEmoji(emoji)}
                    onClick={() => {
                      onSelectEmoji(emoji);
                      onClose();
                    }}
                    className={`h-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent-primary text-white scale-110 shadow-md ring-2 ring-accent-primary/40'
                        : 'hover:bg-slate-100 dark:hover:bg-[#2f2f2f] hover:scale-115 active:scale-95'
                    }`}
                  >
                    <DeckIcon icon={emoji} />
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Footer Info: Hovered Name preview */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#2f2f2f] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        {hoveredDeckEmoji ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm shrink-0">
              <DeckIcon icon={hoveredDeckEmoji} />
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {getEmojiName(hoveredDeckEmoji)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0">
            <span>Selected:</span>
            <span className="inline-flex items-center justify-center text-sm">
              <DeckIcon icon={deckIcon} />
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[150px]">
              {getEmojiName(deckIcon)}
            </span>
          </div>
        )}
        <span className="text-[10px] text-slate-400 font-mono shrink-0">emoji</span>
      </div>
    </div>
  );
}
