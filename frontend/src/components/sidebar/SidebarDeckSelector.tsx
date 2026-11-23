'use client';

import React from 'react';
import Link from 'next/link';
import { Library, Plus, ChevronDown, Check } from 'lucide-react';
import { Deck } from '@/lib/types';
import { DeckIcon } from '@/components/DeckIcon';
import { FlagIcon } from '@/components/FlagIcon';
import { getDeckLanguagePair } from '@/lib/deckLanguages';

interface SidebarDeckSelectorProps {
  decks: Deck[];
  currentDeck: Deck | undefined;
  activeDeckId: number | '';
  isCollapsed: boolean;
  isDeckDropdownOpen: boolean;
  setIsDeckDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectDeck: (id: number) => void;
  t: (key: string) => string;
}

export function SidebarDeckSelector({
  decks,
  currentDeck,
  activeDeckId,
  isCollapsed,
  isDeckDropdownOpen,
  setIsDeckDropdownOpen,
  onSelectDeck,
  t,
}: SidebarDeckSelectorProps) {
  return (
    <div
      className={`border-t border-slate-200 dark:border-[#272727] ${
        isCollapsed ? 'pt-2.5 pb-1' : 'pt-3 pb-1'
      } space-y-2 relative shrink-0`}
    >
      {!isCollapsed && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-slate-100 dark:bg-[#272727] border border-slate-200 dark:border-[#383838] flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Library className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10.5px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              {t('activeDeck')}
            </span>
          </div>
          <Link
            href="/decks/create"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#272727] hover:bg-slate-200 dark:hover:bg-[#383838] border border-slate-200 dark:border-[#383838] px-2 py-0.5 rounded-lg transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>{t('new')}</span>
          </Link>
        </div>
      )}

      {/* Custom Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDeckDropdownOpen((prev) => !prev)}
          title={isCollapsed && currentDeck ? `Collection: ${currentDeck.title}` : undefined}
          className={`w-full flex items-center ${
            isCollapsed
              ? 'justify-center p-1.5 my-1.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-[#383838] hover:bg-slate-100 dark:hover:bg-[#252525]'
              : 'justify-between gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#181818] hover:bg-slate-100 dark:hover:bg-[#222222] shadow-xs'
          } transition-all cursor-pointer text-left group ${
            isDeckDropdownOpen && !isCollapsed
              ? 'bg-slate-100 dark:bg-[#272727] border-slate-300 dark:border-[#484848] ring-2 ring-slate-200 dark:ring-white/10'
              : ''
          } ${
            isDeckDropdownOpen && isCollapsed
              ? 'bg-slate-100 dark:bg-[#272727] border-slate-300 dark:border-[#484848]'
              : ''
          }`}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 flex-1'}`}>
            <div
              className={`w-8 h-8 rounded-xl ${
                isCollapsed
                  ? 'bg-white dark:bg-[#222222] border border-slate-200/80 dark:border-[#333333] shadow-xs'
                  : 'bg-white dark:bg-[#272727] border border-slate-200 dark:border-[#383838] shadow-2xs'
              } flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}
            >
              {currentDeck ? (
                <DeckIcon icon={currentDeck.icon} />
              ) : (
                <Library className="w-4 h-4 text-slate-500 dark:text-slate-300" />
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {currentDeck ? currentDeck.title : t('selectCollection')}
                </div>
                {currentDeck && (() => {
                  const pair = getDeckLanguagePair(currentDeck);
                  return (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 font-medium mt-0.5">
                      <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200">
                        <FlagIcon code={pair.targetFlag} size="sm" />
                        <span>{pair.targetLang}</span>
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 font-bold">&rarr;</span>
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <FlagIcon code={pair.nativeFlag} size="sm" />
                        <span>{pair.nativeLang}</span>
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                      <span className="shrink-0">{currentDeck.cards?.length || 0} cards</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 shrink-0 ${
                isDeckDropdownOpen ? 'rotate-180 text-slate-700 dark:text-white' : ''
              }`}
            />
          )}
        </button>

        {/* Floating Popover Options */}
        {isDeckDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDeckDropdownOpen(false)} />

            <div
              className={`absolute ${
                isCollapsed ? 'left-full ml-3 bottom-0 w-72' : 'left-0 right-0 bottom-full mb-2'
              } z-50 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#333333] shadow-xl p-1.5 space-y-1 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150`}
            >
              <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-[#2e2e2e]">
                <span>{t('collections')}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#272727] text-slate-600 dark:text-slate-400">
                  {decks.length}
                </span>
              </div>

              {decks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">{t('noCollectionsSearch')}</div>
              ) : (
                decks.map((deck) => {
                  const isSelected = deck.id === activeDeckId;
                  const pair = getDeckLanguagePair(deck);
                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => {
                        onSelectDeck(deck.id);
                        setIsDeckDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-[#2f2f2f] text-slate-900 dark:text-white font-semibold ring-1 ring-slate-300 dark:ring-white/10'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#272727]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 border ${
                            isSelected
                              ? 'bg-white dark:bg-[#383838] border-slate-300 dark:border-[#484848]'
                              : 'bg-slate-50 dark:bg-[#272727] border-slate-200 dark:border-[#333333]'
                          }`}
                        >
                          <DeckIcon icon={deck.icon} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{deck.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200">
                              <FlagIcon code={pair.targetFlag} size="sm" />
                              <span>{pair.targetLang}</span>
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-bold">&rarr;</span>
                            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <FlagIcon code={pair.nativeFlag} size="sm" />
                              <span>{pair.nativeLang}</span>
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                            <span className="shrink-0">{deck.cards?.length || 0} cards</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-accent-primary dark:text-white shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
