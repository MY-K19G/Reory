'use client';

import React from 'react';
import {
  MoreHorizontal,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Archive,
  GitFork,
  Copy,
  Share2,
  Bookmark,
  Star,
} from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { ForkFolderIcon } from '@/components/ForkFolderIcon';
import { ClonedFolderIcon } from '@/components/ClonedFolderIcon';
import { ArchivedFolderIcon } from '@/components/ArchivedFolderIcon';
import { FavoriteFolderIcon } from '@/components/FavoriteFolderIcon';
import { SharedFolderIcon } from '@/components/SharedFolderIcon';
import { MyDeckFolderIcon } from '@/components/MyDeckFolderIcon';
import { useI18n } from '@/lib/i18n';
import { CuratedDeckItem } from './types';

interface DeckCardItemProps {
  deck: CuratedDeckItem;
  onClick: () => void;
  openMenuDeckId: string | number | null;
  onToggleMenu: (id: string | number) => void;
  onAddCard: (deckId: number | string) => void;
  onDeleteDeck: (e: React.MouseEvent, deck: CuratedDeckItem) => void;
  onToggleFavorite?: (id: string | number) => void;
  archivedIds: string[];
  currentAccent: any;
  onArchive?: (e: React.MouseEvent, deck: CuratedDeckItem) => void;
  onUnarchive?: (e: React.MouseEvent, deck: CuratedDeckItem) => void;
}

export function DeckCardItem({
  deck,
  onClick,
  openMenuDeckId,
  onToggleMenu,
  onAddCard,
  onDeleteDeck,
  onToggleFavorite,
  archivedIds,
  currentAccent,
  onArchive,
  onUnarchive,
}: DeckCardItemProps) {
  const { t } = useI18n();
  const isDeckArchived =
    archivedIds.includes(String(deck.id)) ||
    (deck.hasRealDeckId ? archivedIds.includes(String(deck.hasRealDeckId)) : false);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer relative ${
        openMenuDeckId === deck.id ? 'z-40' : 'z-10'
      } ${
        isDeckArchived
          ? 'bg-slate-100/70 dark:bg-[#161616] border-slate-300/80 dark:border-slate-800 opacity-80 hover:opacity-100 grayscale hover:grayscale-0'
          : 'bg-white dark:bg-[#1f1f1f] border-slate-100 dark:border-[#2e2e2e]'
      }`}
    >
      {/* Top right action buttons: Bookmark toggle + 3-dots Options Menu */}
      <div className="absolute top-2 right-2 z-40 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(deck.id);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
              deck.isFavorite
                ? 'bg-amber-400 text-white'
                : deck.isMinimalHeader
                ? 'bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/60 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300'
                : 'bg-black/40 hover:bg-black/65 backdrop-blur-md text-white/90 hover:text-white'
            }`}
            title={deck.isFavorite ? 'Remove Bookmark' : 'Bookmark Deck'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${deck.isFavorite ? 'fill-white' : ''}`} />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(deck.id);
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer ${
            deck.isMinimalHeader
              ? 'bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/60 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 shadow-2xs'
              : 'bg-black/40 hover:bg-black/65 backdrop-blur-md text-white'
          }`}
          title={t('deckOptions')}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>

        {openMenuDeckId === deck.id && (
          <div
            className="absolute right-0 top-8 w-48 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(deck.id);
                  onToggleMenu(deck.id);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <Bookmark className={`w-3.5 h-3.5 ${deck.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                <span>{deck.isFavorite ? 'Remove Bookmark' : 'Bookmark Deck'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddCard(deck.hasRealDeckId || '');
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('addCard')}</span>
            </button>
            {isDeckArchived ? (
              <button
                type="button"
                onClick={(e) => onUnarchive && onUnarchive(e, deck)}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <Archive className="w-3.5 h-3.5 text-sky-500" />
                <span>{t('unarchiveDeck')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => onArchive && onArchive(e, deck)}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('archiveDeck')}</span>
              </button>
            )}
            <div className="my-1 border-t border-slate-100 dark:border-white/5" />
            <button
              type="button"
              onClick={(e) => onDeleteDeck(e, deck)}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('deleteDeck')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Half */}
      {deck.isMinimalHeader ? (
        <div className="relative h-28 sm:h-32 w-full rounded-t-2xl bg-gradient-to-br from-[#f1f6f4] via-[#f7faf8] to-[#edf4f0] dark:from-[#252525] dark:via-[#202020] dark:to-[#1a1a1a] flex items-center justify-center overflow-hidden border-b border-slate-100/60 dark:border-white/5">
          <div className="flex items-center gap-3 text-emerald-800/25 dark:text-emerald-400/20">
            <Layers className="w-7 h-7 stroke-[1.5]" />
            <Sparkles className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>
      ) : (
        <div className="relative h-28 sm:h-32 w-full rounded-t-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deck.coverImage} alt={deck.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Ribbon Badge */}
      {isDeckArchived ? (
        <div
          className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-md tracking-wider uppercase"
          style={{
            background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.4)',
            color: '#e2e8f0',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.35)',
          }}
        >
          <Archive className="w-3 h-3 text-slate-300" />
          <span>ARCHIVED</span>
        </div>
      ) : deck.forkedFromTitle ? (
        <div
          className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-lg tracking-wide badge-fork"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.92) 0%, rgba(217,119,6,0.9) 100%)',
            border: '1px solid rgba(251,191,36,0.6)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}
        >
          <GitFork className="w-3 h-3" />
          <span>FORK</span>
        </div>
      ) : deck.isCloned ? (
        <div
          className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-lg tracking-wide badge-cloned"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.92) 0%, rgba(5,150,105,0.9) 100%)',
            border: '1px solid rgba(52,211,153,0.6)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Copy className="w-3 h-3" />
          <span>CLONED</span>
        </div>
      ) : deck.isPublic ? (
        <div
          className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-lg tracking-wide"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.92) 0%, rgba(37,99,235,0.9) 100%)',
            border: '1px solid rgba(147,197,253,0.6)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Share2 className="w-3 h-3" />
          <span>SHARED</span>
        </div>
      ) : null}

      {/* Overlapping Category Icon */}
      <div className="absolute top-[112px] sm:top-[128px] left-3.5 -translate-y-1/2 z-20 pointer-events-none">
        <div
          className="w-7 h-7 flex items-center justify-center"
          style={{
            color: currentAccent.primary,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
          }}
        >
          {deck.forkedFromTitle ? (
            <ForkFolderIcon className="w-5 h-5 drop-shadow-sm" />
          ) : deck.isCloned ? (
            <ClonedFolderIcon className="w-5 h-5 drop-shadow-sm" />
          ) : isDeckArchived ? (
            <ArchivedFolderIcon className="w-5 h-5 drop-shadow-sm" />
          ) : deck.isFavorite ? (
            <FavoriteFolderIcon className="w-5 h-5 drop-shadow-sm" />
          ) : deck.isPublic ? (
            <SharedFolderIcon className="w-5 h-5 drop-shadow-sm" />
          ) : (
            <MyDeckFolderIcon className="w-5 h-5 drop-shadow-sm" />
          )}
        </div>
      </div>

      {/* Bottom Half */}
      <div className="p-3.5 sm:p-4 space-y-2.5">
        <div>
          <h3 className="font-bold text-sm text-[#1e293b] dark:text-white transition-colors truncate">
            {deck.title}
          </h3>
          {deck.forkedFromTitle ? (
            <div
              className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold truncate max-w-full"
              style={{
                background: 'linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.1) 100%)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#d97706',
              }}
            >
              <GitFork className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">
                forked from{' '}
                {deck.forkedFromAuthor ? <span className="font-bold">@{deck.forkedFromAuthor}/</span> : null}
                <span className="font-medium">{deck.forkedFromTitle}</span>
              </span>
            </div>
          ) : deck.isCloned ? (
            <div
              className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold truncate max-w-full"
              style={{
                background: 'linear-gradient(90deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.1) 100%)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#059669',
              }}
            >
              <Copy className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">
                cloned from{' '}
                {(deck.clonedFromAuthor || deck.cloneOrigin) ? (
                  <span className="font-bold">@{deck.clonedFromAuthor || deck.cloneOrigin}/</span>
                ) : null}
                <span className="font-medium">{deck.clonedFromTitle || deck.title}</span>
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <FlagIcon code={deck.targetFlag} size="sm" />
            <span className="font-medium text-slate-600 dark:text-slate-300">{deck.targetLang}</span>
          </div>
          <span className="font-bold text-slate-500 dark:text-slate-400">{deck.cardCount} {t('cards')}</span>
        </div>
      </div>
    </div>
  );
}
