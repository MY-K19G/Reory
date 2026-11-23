'use client';

import {
  ChevronDown,
  LayoutGrid,
  List,
  Check,
} from 'lucide-react';
import { AllFolderIcon } from '@/components/AllFolderIcon';
import { MyDeckFolderIcon } from '@/components/MyDeckFolderIcon';
import { SharedFolderIcon } from '@/components/SharedFolderIcon';
import { FavoriteFolderIcon } from '@/components/FavoriteFolderIcon';
import { ForkFolderIcon } from '@/components/ForkFolderIcon';
import { ClonedFolderIcon } from '@/components/ClonedFolderIcon';
import { ArchivedFolderIcon } from '@/components/ArchivedFolderIcon';
import { useI18n } from '@/lib/i18n';
import { CuratedDeckItem } from './types';

interface MyCardsToolbarProps {
  activeTab: 'all' | 'my' | 'shared' | 'favorites' | 'forked' | 'cloned' | 'archived';
  onSelectTab: (tab: 'all' | 'my' | 'shared' | 'favorites' | 'forked' | 'cloned' | 'archived') => void;
  displayDecks: CuratedDeckItem[];
  archivedIds: string[];
  currentAccent: any;
  sortOption: 'lastModified' | 'alphabetical' | 'cards';
  setSortOption: (opt: 'lastModified' | 'alphabetical' | 'cards') => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (open: boolean | ((p: boolean) => boolean)) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export function MyCardsToolbar({
  activeTab,
  onSelectTab,
  displayDecks,
  archivedIds,
  currentAccent,
  sortOption,
  setSortOption,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  viewMode,
  setViewMode,
}: MyCardsToolbarProps) {
  const { t } = useI18n();

  const isArchived = (deck: CuratedDeckItem) =>
    archivedIds.includes(String(deck.id)) ||
    (deck.hasRealDeckId ? archivedIds.includes(String(deck.hasRealDeckId)) : false);

  const activeDecks = displayDecks.filter((d) => !isArchived(d));
  const archivedCount = displayDecks.filter(isArchived).length;
  const allCount = activeDecks.length;
  const myCount = activeDecks.filter((d) => d.category === 'my' || d.hasRealDeckId).length;
  const sharedCount = activeDecks.filter((d) => d.category === 'shared' || Boolean(d.isPublic)).length;
  const favoritesCount = activeDecks.filter((d) => d.isFavorite).length;
  const forkedCount = activeDecks.filter((d) =>
    Boolean(d.forkedFromTitle || d.title.toLowerCase().includes('(fork)'))
  ).length;
  const clonedCount = activeDecks.filter((d) =>
    Boolean(d.isCloned || d.cloneOrigin || d.title.toLowerCase().includes('(clone)'))
  ).length;

  const tabs = [
    { id: 'all', label: t('allDecks'), count: allCount },
    { id: 'my', label: t('myDecksTab'), count: myCount },
    { id: 'shared', label: t('sharedTab'), count: sharedCount },
    { id: 'favorites', label: t('favoritesTab'), count: favoritesCount },
    { id: 'forked', label: t('forkedTab'), count: forkedCount },
    { id: 'cloned', label: t('clonedTab'), count: clonedCount },
    { id: 'archived', label: t('archivedTab'), count: archivedCount },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              style={isSelected ? { backgroundColor: currentAccent.primary } : undefined}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-[#2e2e2e] shadow-2xs'
              }`}
            >
              {tab.id === 'all' ? (
                <AllFolderIcon className="w-4 h-4 shrink-0" primaryColor={isSelected ? '#ffffff' : currentAccent.primary} />
              ) : tab.id === 'my' ? (
                <MyDeckFolderIcon className="w-4 h-4 shrink-0" />
              ) : tab.id === 'shared' ? (
                <SharedFolderIcon className="w-4 h-4 shrink-0" />
              ) : tab.id === 'favorites' ? (
                <FavoriteFolderIcon className="w-4 h-4 shrink-0" />
              ) : tab.id === 'forked' ? (
                <ForkFolderIcon className="w-4 h-4 shrink-0" />
              ) : tab.id === 'cloned' ? (
                <ClonedFolderIcon className="w-4 h-4 shrink-0" />
              ) : (
                <ArchivedFolderIcon className="w-4 h-4 shrink-0" />
              )}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsSortDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] border border-slate-200/70 dark:border-[#2e2e2e] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">
              {sortOption === 'lastModified'
                ? t('lastModified')
                : sortOption === 'alphabetical'
                ? t('alphabetical')
                : t('mostCards')}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                isSortDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isSortDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsSortDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#333333] shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('sortDecksBy')}
                </div>
                {(
                  [
                    { id: 'lastModified', label: t('lastModified') },
                    { id: 'alphabetical', label: t('alphabetical') },
                    { id: 'cards', label: t('cardCountHighest') },
                  ] as const
                ).map((opt) => {
                  const isCurrent = sortOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortOption(opt.id);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-accent-primary" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-white dark:bg-[#1f1f1f] border border-slate-200/70 dark:border-[#2e2e2e] rounded-full shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
