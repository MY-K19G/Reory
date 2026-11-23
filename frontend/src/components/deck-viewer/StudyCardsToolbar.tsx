'use client';

import React from 'react';
import {
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Search,
  Filter,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Flashcard } from './types';

interface StudyCardsToolbarProps {
  viewMode: 'single' | 'grid';
  setViewMode: (val: 'single' | 'grid') => void;
  displayCards: Flashcard[];
  currentCardIndex: number;
  handlePrev: () => void;
  handleNext: () => void;
  cardCategoryFilter: string;
  setCardCategoryFilter: (cat: string) => void;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  allCardTags: string[];
  isSearchInputOpen: boolean;
  setIsSearchInputOpen: (val: boolean) => void;
  cardSearchQuery: string;
  setCardSearchQuery: (q: string) => void;
  cardSortOrder: 'default' | 'alpha' | 'alpha-desc';
  setCardSortOrder: (order: 'default' | 'alpha' | 'alpha-desc') => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  setCurrentCardIndex: (updater: number | ((curr: number) => number)) => void;
}

export function StudyCardsToolbar({
  viewMode,
  setViewMode,
  displayCards,
  currentCardIndex,
  handlePrev,
  handleNext,
  cardCategoryFilter,
  setCardCategoryFilter,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  allCardTags,
  isSearchInputOpen,
  setIsSearchInputOpen,
  cardSearchQuery,
  setCardSearchQuery,
  cardSortOrder,
  setCardSortOrder,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  setCurrentCardIndex,
}: StudyCardsToolbarProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left toggles & pager */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center p-1 bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] rounded-xl text-slate-400 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'single'
                ? 'text-accent-primary dark:text-cyan-400 bg-slate-100 dark:bg-white/10 font-bold'
                : 'hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Single card view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'text-accent-primary dark:text-cyan-400 bg-slate-100 dark:bg-white/10 font-bold'
                : 'hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Grid overview"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xs text-xs font-bold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={handlePrev}
            disabled={displayCards.length === 0}
            className="p-0.5 rounded hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Previous card"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
          </button>
          <span className="px-1 text-slate-600 dark:text-slate-300 font-semibold tracking-wide">
            {displayCards.length === 0 ? 0 : currentCardIndex + 1} / {displayCards.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={displayCards.length === 0}
            className="p-0.5 rounded hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Next card"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
          </button>
        </div>
      </div>

      {/* Right filters: All Cards dropdown, Search, Filter, Sort/Swap */}
      <div className="flex items-center gap-2 relative">
        {/* Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCategoryDropdownOpen((prev) => !prev);
              setIsSortDropdownOpen(false);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[90px]">{cardCategoryFilter === 'All' ? 'All Cards' : cardCategoryFilter}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Tag
              </div>
              <button
                type="button"
                onClick={() => {
                  setCardCategoryFilter('All');
                  setCurrentCardIndex(0);
                  setIsCategoryDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer ${
                  cardCategoryFilter === 'All' ? 'text-accent-primary font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{t('allCards')}</span>
                {cardCategoryFilter === 'All' && <Check className="w-3.5 h-3.5 text-accent-primary" />}
              </button>
              {allCardTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setCardCategoryFilter(tag);
                    setCurrentCardIndex(0);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer ${
                    cardCategoryFilter.toLowerCase() === tag.toLowerCase()
                      ? 'text-accent-primary font-bold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{tag}</span>
                  {cardCategoryFilter.toLowerCase() === tag.toLowerCase() && (
                    <Check className="w-3.5 h-3.5 text-accent-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative flex items-center">
          {isSearchInputOpen ? (
            <div className="flex items-center gap-1 bg-white dark:bg-[#1f1f1f] border border-accent-primary/60 dark:border-cyan-500/60 rounded-xl px-2.5 py-1 shadow-xs animate-in fade-in duration-150">
              <Search className="w-3.5 h-3.5 text-accent-primary dark:text-cyan-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder={t('searchWordPlaceholder')}
                value={cardSearchQuery}
                onChange={(e) => {
                  setCardSearchQuery(e.target.value);
                  setCurrentCardIndex(0);
                }}
                className="w-24 sm:w-32 text-xs bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  setCardSearchQuery('');
                  setIsSearchInputOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchInputOpen(true)}
              className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xs text-slate-500 dark:text-slate-300 hover:text-accent-primary dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Search cards"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Indicator button */}
        <button
          type="button"
          onClick={() => {
            const nextTag = cardCategoryFilter === 'All' && allCardTags[0] ? allCardTags[0] : 'All';
            setCardCategoryFilter(nextTag);
            setCurrentCardIndex(0);
          }}
          className={`p-2 rounded-xl border shadow-2xs transition-colors cursor-pointer ${
            cardCategoryFilter !== 'All'
              ? 'bg-accent-primary/10 border-accent-primary/40 text-accent-primary dark:text-cyan-400'
              : 'bg-white dark:bg-[#1f1f1f] border-slate-200/80 dark:border-[#2e2e2e] text-slate-500 dark:text-slate-300 hover:text-accent-primary hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
          title={cardCategoryFilter !== 'All' ? `Filtered by ${cardCategoryFilter}` : 'Filter'}
        >
          <Filter className="w-3.5 h-3.5" />
        </button>

        {/* Sort Order Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSortDropdownOpen((prev) => !prev);
              setIsCategoryDropdownOpen(false);
            }}
            className={`p-2 rounded-xl border shadow-2xs transition-colors cursor-pointer ${
              cardSortOrder !== 'default'
                ? 'bg-accent-primary/10 border-accent-primary/40 text-accent-primary dark:text-cyan-400'
                : 'bg-white dark:bg-[#1f1f1f] border-slate-200/80 dark:border-[#2e2e2e] text-slate-500 dark:text-slate-300 hover:text-accent-primary hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
            title="Sort cards"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sort Order
              </div>
              <button
                type="button"
                onClick={() => {
                  setCardSortOrder('default');
                  setIsSortDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer ${
                  cardSortOrder === 'default' ? 'text-accent-primary font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>Default Order</span>
                {cardSortOrder === 'default' && <Check className="w-3.5 h-3.5 text-accent-primary" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCardSortOrder('alpha');
                  setIsSortDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer ${
                  cardSortOrder === 'alpha' ? 'text-accent-primary font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{t('aToZAlphabetical')}</span>
                {cardSortOrder === 'alpha' && <Check className="w-3.5 h-3.5 text-accent-primary" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCardSortOrder('alpha-desc');
                  setIsSortDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer ${
                  cardSortOrder === 'alpha-desc' ? 'text-accent-primary font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{t('zToAReverse')}</span>
                {cardSortOrder === 'alpha-desc' && <Check className="w-3.5 h-3.5 text-accent-primary" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
