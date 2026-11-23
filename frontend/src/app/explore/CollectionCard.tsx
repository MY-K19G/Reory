'use client';

import {
  MoreHorizontal,
  GitFork,
  Copy,
  Check,
  Eye,
  Bookmark,
  Heart,
  Loader2,
} from 'lucide-react';
import { CommunityCardCollection } from './types';
import { UserAvatar } from '@/components/UserAvatar';

interface CollectionCardProps {
  collection: CommunityCardCollection;
  onClickCard: () => void;
  openMenuCollectionId: string | null;
  onToggleMenu: (id: string) => void;
  onOpenForkModal: (col: CommunityCardCollection) => void;
  onOpenCloneModal: (col: CommunityCardCollection) => void;
  forkingCollectionId: string | null;
  savingCollectionId: string | null;
  onToggleLike: (id: string) => void;
}

export function CollectionCard({
  collection: col,
  onClickCard,
  openMenuCollectionId,
  onToggleMenu,
  onOpenForkModal,
  onOpenCloneModal,
  forkingCollectionId,
  savingCollectionId,
  onToggleLike,
}: CollectionCardProps) {
  return (
    <div
      onClick={onClickCard}
      className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100/90 dark:border-[#2e2e2e] flex flex-col justify-between space-y-3.5 hover:shadow-md transition-all duration-300 relative group cursor-pointer hover:-translate-y-0.5"
    >
      {/* Top Section */}
      <div className="space-y-3">
        <div className="relative h-20 w-full rounded-2xl bg-slate-900 flex items-center justify-between px-3 shadow-2xs group-hover:shadow-xs transition-all">
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={col.coverImage}
              alt={col.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />
          </div>

          {/* Three-dots menu */}
          <div className="absolute top-2.5 right-2.5 z-30">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu(col.id);
              }}
              className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 shadow-2xs transition-colors cursor-pointer"
              title="Options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {openMenuCollectionId === col.id && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 w-44 rounded-2xl bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333333] shadow-xl py-1.5 z-40 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  onClick={() => onOpenForkModal(col)}
                  disabled={forkingCollectionId === col.id}
                  className="w-full px-3.5 py-2 flex items-center justify-between text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer group/item"
                >
                  <div className="flex items-center gap-2">
                    {forkingCollectionId === col.id ? (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    ) : (
                      <GitFork className="w-4 h-4 text-amber-500 group-hover/item:scale-110 transition-transform" />
                    )}
                    <span>{col.isForked ? 'Forked ✓' : 'Fork Deck'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{col.forks || 0}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCloneModal(col)}
                  disabled={savingCollectionId === col.id}
                  className="w-full px-3.5 py-2 flex items-center justify-between text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer group/item"
                >
                  <div className="flex items-center gap-2">
                    {col.isSaved ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-emerald-500 group-hover/item:scale-110 transition-transform" />
                    )}
                    <span>{col.isSaved ? 'Cloned ✓' : 'Clone Deck'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {col.clones ?? col.saves ?? 0}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Author Profile */}
          <div className="relative z-10 flex items-center gap-2.5 max-w-[80%]">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-white/80 shadow-md bg-slate-800">
              <UserAvatar
                avatar={col.author.avatar}
                name={col.author.name}
                size="md"
                className="w-full h-full"
              />
            </div>
            <div className="min-w-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <div className="text-xs font-black text-white leading-tight truncate tracking-tight">
                {col.author.name}
              </div>
              <span className="text-[10px] text-white/90 font-semibold block truncate">
                {col.timeAgo}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-black text-[#1e293b] dark:text-white tracking-tight line-clamp-1">
            {col.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-normal line-clamp-2 mt-1 leading-relaxed">
            {col.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {col.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-accent-primary/10 dark:bg-cyan-500/10 text-accent-primary dark:text-cyan-300 border border-transparent dark:border-cyan-500/20 text-[11px] font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Cards preview */}
        {col.cards && col.cards.length > 0 && (
          <div className="grid grid-cols-4 gap-2 pt-1.5">
            {(col.totalCards > 4 ? col.cards.slice(0, 3) : col.cards.slice(0, 4)).map((card, idx) => {
              const bgImage = card.image || null;
              return (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden aspect-[4/5] border border-slate-200/80 dark:border-[#383838] bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-end text-center p-2 group/card select-none shadow-xs transition-all hover:shadow-md"
                >
                  {bgImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bgImage}
                      alt={card.word}
                      className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover/card:via-black/60 group-hover/card:from-black/90 transition-all duration-300 pointer-events-none" />
                  <div className="relative z-10 w-full flex flex-col items-center transition-all duration-300">
                    <span className="font-bold text-xs sm:text-[13px] text-white tracking-tight drop-shadow-md w-full truncate">
                      {card.word}
                    </span>
                    {card.meaning && (
                      <div className="max-h-0 opacity-0 group-hover/card:max-h-12 group-hover/card:opacity-100 transition-all duration-300 overflow-hidden flex flex-col items-center w-full">
                        <span className="text-[10px] sm:text-[11px] text-amber-200 dark:text-cyan-200 font-semibold leading-tight drop-shadow-sm pt-0.5 w-full break-words line-clamp-2">
                          {card.meaning}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {col.totalCards > 4 && (
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] border border-slate-200/80 dark:border-[#383838] bg-slate-900 flex items-center justify-center group/overflow select-none shadow-xs transition-all hover:shadow-md">
                {col.overflowImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={col.overflowImage}
                    alt="More cards"
                    className="absolute inset-0 w-full h-full object-cover group-hover/overflow:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/60 group-hover/overflow:bg-black/75 transition-colors duration-300 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
                  <span className="text-white font-black text-sm sm:text-base drop-shadow-md tracking-tight">
                    +{col.totalCards - 3}
                  </span>
                  <span className="text-[9px] font-semibold text-white/80 uppercase tracking-wider mt-0.5 opacity-0 group-hover/overflow:opacity-100 transition-opacity duration-200">
                    View All
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="pt-2 border-t border-slate-100/80 dark:border-[#2e2e2e] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-medium text-slate-400 dark:text-slate-400" title={`${col.views || 0} views`}>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{col.views ? (col.views >= 1000 ? `${(col.views / 1000).toFixed(1)}k` : col.views) : '0'}</span>
          </div>

          <div className="flex items-center gap-1 font-medium" title={`${col.saves} saves`}>
            <Bookmark className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
            <span>{col.saves}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(col.id);
            }}
            className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${
              col.isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
            }`}
            title={`${col.likes} likes`}
          >
            <Heart className={`w-3.5 h-3.5 ${col.isLiked ? 'fill-rose-500' : ''}`} />
            <span>{col.likes}</span>
          </button>

          <div
            className="flex items-center gap-1 font-medium text-slate-400 dark:text-slate-400"
            title={`${col.clones ?? col.saves ?? 0} clones`}
          >
            <Copy className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>{col.clones ?? col.saves ?? 0}</span>
          </div>

          <div
            className="flex items-center gap-1 font-medium text-slate-400 dark:text-slate-400"
            title={`${col.forks || 0} forks`}
          >
            <GitFork className="w-3.5 h-3.5 text-amber-500/80" />
            <span>{col.forks || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
