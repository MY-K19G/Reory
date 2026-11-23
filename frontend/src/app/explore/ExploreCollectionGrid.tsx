'use client';

import React from 'react';
import { Search, FolderPlus, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CommunityCardCollection } from './types';
import { CollectionCard } from './CollectionCard';

interface ExploreCollectionGridProps {
  filteredCollections: CommunityCardCollection[];
  totalCollectionsCount: number;
  searchQuery: string;
  activeTab: string;
  activeTag: string | null;
  openMenuCollectionId: string | null;
  forkingCollectionId: string | null;
  savingCollectionId: string | null;
  onResetFilters: () => void;
  onOpenPublishModal: () => void;
  onClickCard: (col: CommunityCardCollection) => void;
  onToggleMenu: (id: string) => void;
  onOpenForkModal: (item: CommunityCardCollection) => void;
  onOpenCloneModal: (item: CommunityCardCollection) => void;
  onToggleLike: (id: string) => void;
  currentAccent: {
    primary: string;
    subtleBg: string;
  };
  t: (key: string) => string;
}

export function ExploreCollectionGrid({
  filteredCollections,
  totalCollectionsCount,
  searchQuery,
  activeTab,
  activeTag,
  openMenuCollectionId,
  forkingCollectionId,
  savingCollectionId,
  onResetFilters,
  onOpenPublishModal,
  onClickCard,
  onToggleMenu,
  onOpenForkModal,
  onOpenCloneModal,
  onToggleLike,
  currentAccent,
  t,
}: ExploreCollectionGridProps) {
  if (filteredCollections.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-10 sm:p-14 text-center border border-slate-200/80 dark:border-[#2e2e2e] space-y-4">
        <div
          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-1"
          style={{ backgroundColor: currentAccent.subtleBg, color: currentAccent.primary }}
        >
          {searchQuery ? <Search className="w-7 h-7" /> : <FolderPlus className="w-7 h-7" />}
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          {searchQuery ? t('noMatchingCollections') : t('noCollectionsFound')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {searchQuery
            ? `We couldn't find any collections matching "${searchQuery}". Try another search term or reset filters.`
            : activeTab === 'following'
            ? 'You are not following any creators yet. Follow top contributors from the sidebar or like collections to see them here!'
            : activeTab === 'trending'
            ? 'No trending collections found matching your criteria. Check out all collections or reset filters!'
            : activeTab !== 'all'
            ? `There are no collections in the "${activeTab}" tab yet.`
            : t('firstToShareDeck')}
        </p>
        {searchQuery || activeTag || activeTab !== 'all' ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333333] cursor-pointer transition-colors"
          >
            {t('resetFilters')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenPublishModal}
            style={{ backgroundColor: currentAccent.primary }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white text-xs font-semibold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('shareDeck')}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCollections.map((col) => (
          <CollectionCard
            key={col.id}
            collection={col}
            onClickCard={() => onClickCard(col)}
            openMenuCollectionId={openMenuCollectionId}
            onToggleMenu={onToggleMenu}
            onOpenForkModal={onOpenForkModal}
            onOpenCloneModal={onOpenCloneModal}
            forkingCollectionId={forkingCollectionId}
            savingCollectionId={savingCollectionId}
            onToggleLike={onToggleLike}
          />
        ))}
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing 1 to {filteredCollections.length} of {totalCollectionsCount} collections
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#2e2e2e] opacity-50 cursor-not-allowed text-slate-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold"
          >
            1
          </button>
          <button
            type="button"
            className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#2e2e2e] hover:bg-slate-50 dark:hover:bg-[#282828] cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
