'use client';

import React from 'react';
import { Search, X, Share2 } from 'lucide-react';

interface ExploreHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: 'all' | 'trending' | 'popular' | 'new' | 'following';
  setActiveTab: (tab: 'all' | 'trending' | 'popular' | 'new' | 'following') => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  onOpenPublishModal: () => void;
  currentAccent: {
    primary: string;
  };
  t: (key: string) => string;
}

export function ExploreHeader({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  activeTag,
  setActiveTag,
  onOpenPublishModal,
  currentAccent,
  t,
}: ExploreHeaderProps) {
  const tabs = [
    { id: 'all', label: t('all') },
    { id: 'trending', label: t('trending') },
    { id: 'popular', label: t('popular') },
    { id: 'new', label: t('new') },
    { id: 'following', label: t('following') },
  ] as const;

  return (
    <>
      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1f1f1f] shadow-xs border border-slate-100 dark:border-[#2e2e2e] min-h-[190px] sm:min-h-[220px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-[center_right] sm:bg-right opacity-95 dark:opacity-30 pointer-events-none transition-transform duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/90 dark:to-transparent w-full sm:w-3/5" />

        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-xl space-y-2">
          <span
            className="text-xs font-bold uppercase tracking-wider block"
            style={{ color: currentAccent.primary }}
          >
            {t('community')}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#192338] dark:text-white tracking-tight leading-tight">
            {t('exploreHeroTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed pt-0.5">
            {t('exploreHeroSubtitle')}
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('exploreSearchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id && !activeTag;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActiveTag(null);
                  }}
                  style={isSelected ? { backgroundColor: currentAccent.primary } : undefined}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'text-white shadow-sm'
                      : 'bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#282828] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-[#2e2e2e] shadow-2xs'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPublishModal}
          style={{ backgroundColor: currentAccent.primary }}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto hover:opacity-90 active:scale-95 shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>{t('publishDeck')}</span>
        </button>
      </div>
    </>
  );
}
