'use client';

import { Flame, Crown, Tag } from 'lucide-react';
import { TrendingItem, TopContributor } from './types';
import { useI18n } from '@/lib/i18n';

interface ExploreSidebarProps {
  trendingCollections: TrendingItem[];
  onSelectTrending: (item: TrendingItem) => void;
  contributors: TopContributor[];
  onToggleFollow: (name: string) => void;
  popularTags: string[];
  activeTag: string | null;
  onSelectTag: (tag: string) => void;
  currentAccent: {
    primary: string;
    subtleBg?: string;
    border?: string;
  };
}

export function ExploreSidebar({
  trendingCollections,
  onSelectTrending,
  contributors,
  onToggleFollow,
  popularTags,
  activeTag,
  onSelectTag,
  currentAccent,
}: ExploreSidebarProps) {
  const { t } = useI18n();

  return (
    <div className="lg:col-span-4 xl:col-span-3 space-y-5">
      {/* CARD 1: Trending Collections */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100/90 dark:border-[#2e2e2e] space-y-3.5">
        <div className="flex items-center gap-2 text-accent-primary dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
          <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-[#1e293b] dark:text-white">{t('trendingCollections')}</span>
        </div>

        <div className="space-y-2.5 pt-0.5">
          {trendingCollections.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
              No trending decks yet. Create and share decks to see them trend here!
            </p>
          ) : (
            trendingCollections.map((item) => (
              <div
                key={item.rank}
                onClick={() => onSelectTrending(item)}
                className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#282828] transition-colors cursor-pointer group"
              >
                <span className="font-bold text-xs text-slate-400 dark:text-slate-500 w-3 text-center">
                  {item.rank}
                </span>

                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-[#383838] bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1e293b] dark:text-slate-200 group-hover:text-accent-primary dark:group-hover:text-white truncate transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                    {item.saves}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CARD 2: Top Contributors */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100/90 dark:border-[#2e2e2e] space-y-3.5">
        <div className="flex items-center gap-2 text-accent-primary dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
          <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-[#1e293b] dark:text-white">{t('topContributors')}</span>
        </div>

        <div className="space-y-3 pt-0.5">
          {contributors.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
              No creators yet. Share your decks to become the top contributor!
            </p>
          ) : (
            contributors.map((user) => (
              <div key={user.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-[#383838]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1e293b] dark:text-slate-200 truncate">
                      {user.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 block truncate">
                      {user.collections} {user.collections === 1 ? 'collection' : 'collections'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleFollow(user.name)}
                  style={user.isFollowing ? { backgroundColor: currentAccent.primary } : undefined}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                    user.isFollowing
                      ? 'text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#282828] hover:bg-slate-200 dark:hover:bg-[#333333] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {user.isFollowing ? t('following') : t('follow')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CARD 3: Popular Tags */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100/90 dark:border-[#2e2e2e] space-y-3">
        <div className="flex items-center gap-2 text-accent-primary dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
          <Tag className="w-4 h-4 text-accent-primary" />
          <span className="text-[#1e293b] dark:text-white">{t('popularTags')}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {popularTags.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-2 text-center w-full">
              No tags yet
            </p>
          ) : (
            popularTags.map((tag) => {
              const isTagSelected = activeTag?.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(tag)}
                  style={isTagSelected ? { backgroundColor: currentAccent.primary } : undefined}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isTagSelected
                      ? 'text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-[#282828] hover:bg-slate-100 dark:hover:bg-[#333333] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-[#383838]'
                  }`}
                >
                  #{tag}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
