'use client';

import React from 'react';
import {
  Bookmark,
  FolderClosed,
  Filter,
  ChevronDown,
  X,
  Check,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { BookmarkedCardItem } from './types';
import { useI18n } from '@/lib/i18n';

interface BookmarksToolbarProps {
  subTab: 'cards' | 'decks';
  setSubTab: (tab: 'cards' | 'decks') => void;
  cardsCount: number;
  decksCount: number;
  allTags: string[];
  selectedTags: string[];
  tagSearchQuery: string;
  setTagSearchQuery: (q: string) => void;
  isTagDropdownOpen: boolean;
  setIsTagDropdownOpen: (open: boolean) => void;
  tagDropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleTagSelection: (tag: string) => void;
  clearAllSelectedTags: () => void;
  filteredDropdownTags: string[];
  cards: BookmarkedCardItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export function BookmarksToolbar({
  subTab,
  setSubTab,
  cardsCount,
  decksCount,
  allTags,
  selectedTags,
  tagSearchQuery,
  setTagSearchQuery,
  isTagDropdownOpen,
  setIsTagDropdownOpen,
  tagDropdownRef,
  toggleTagSelection,
  clearAllSelectedTags,
  filteredDropdownTags,
  cards,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}: BookmarksToolbarProps) {
  const { currentAccent } = useTheme();
  const { t } = useI18n();

  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of cards) {
      if (card.tags) {
        for (const tag of card.tags) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      }
    }
    return counts;
  }, [cards]);

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2.5 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xs">
      {/* Segment Toggle */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#101010] border border-slate-200/50 dark:border-white/5 shrink-0">
        <button
          type="button"
          onClick={() => setSubTab('cards')}
          style={subTab === 'cards' ? { backgroundColor: currentAccent.primary, color: '#ffffff' } : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'cards'
              ? 'shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{t('cards')} ({cardsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('decks')}
          style={subTab === 'decks' ? { backgroundColor: currentAccent.primary, color: '#ffffff' } : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'decks'
              ? 'shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderClosed className="w-3.5 h-3.5" />
          <span>{t('decks')} ({decksCount})</span>
        </button>
      </div>

      {/* Searchable Multi-Select Tag Filter Dropdown */}
      {subTab === 'cards' && (
        <div className="relative flex-1 min-w-[220px] max-w-md" ref={tagDropdownRef}>
          <div
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#202020] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all select-none shadow-2xs"
          >
            <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {selectedTags.length === 0 ? (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                  {t('allTags')} ({allTags.length})
                </span>
              ) : (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-black">
                    {selectedTags.length} {t('selected')}
                  </span>
                  {selectedTags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-200"
                    >
                      #{tag}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTagSelection(tag);
                        }}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  {selectedTags.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-bold">
                      +{selectedTags.length - 2} {t('more')}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllSelectedTags();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
                  title={t('clearTags')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isTagDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isTagDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-full max-w-sm rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/90 dark:border-[#2e2e2e] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  placeholder={t('filterTagsPlaceholder')}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-accent-primary"
                  autoFocus
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredDropdownTags.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    {t('noMatchingTags')}
                  </div>
                ) : (
                  filteredDropdownTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <div
                        key={tag}
                        onClick={() => toggleTagSelection(tag)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#252525]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-black'
                                : 'border-slate-300 dark:border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">#{tag}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal ml-2">
                          {tagCounts[tag] || 0}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & Layout Toggle */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 md:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchBookmarksPlaceholder')}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#202020] border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-accent-primary"
          />
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-[#202020] border border-slate-200/70 dark:border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={viewMode === 'grid' ? { backgroundColor: currentAccent.subtleBg, color: currentAccent.primary } : undefined}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? '' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title={t('gridView')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            style={viewMode === 'list' ? { backgroundColor: currentAccent.subtleBg, color: currentAccent.primary } : undefined}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' ? '' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title={t('listView')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
