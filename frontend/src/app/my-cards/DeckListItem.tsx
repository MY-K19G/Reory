'use client';

import React from 'react';
import {
  ArrowRight,
  GitFork,
  Copy,
  Share2,
  Star,
  MoreHorizontal,
  Plus,
  Archive,
  Trash2,
} from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { useI18n } from '@/lib/i18n';
import { CuratedDeckItem } from './types';

interface DeckListItemProps {
  deck: CuratedDeckItem;
  onClick: () => void;
  openMenuDeckId: string | number | null;
  onToggleMenu: (id: string | number) => void;
  onAddCard: (deckId: number | string) => void;
  onDeleteDeck: (e: React.MouseEvent, deck: CuratedDeckItem) => void;
  onToggleFavorite: (id: string | number) => void;
  archivedIds: string[];
  onArchive?: (e: React.MouseEvent, deck: CuratedDeckItem) => void;
  onUnarchive: (e: React.MouseEvent, deck: CuratedDeckItem) => void;
}

export function DeckListItem({
  deck,
  onClick,
  openMenuDeckId,
  onToggleMenu,
  onAddCard,
  onDeleteDeck,
  onToggleFavorite,
  archivedIds,
  onArchive,
  onUnarchive,
}: DeckListItemProps) {
  const { t } = useI18n();
  const isDeckArchived =
    archivedIds.includes(String(deck.id)) ||
    (deck.hasRealDeckId ? archivedIds.includes(String(deck.hasRealDeckId)) : false);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-3.5 sm:p-4 shadow-xs border flex items-center justify-between gap-4 hover:shadow-md transition-all duration-200 group cursor-pointer ${
        isDeckArchived
          ? 'bg-slate-100/70 dark:bg-[#161616] border-slate-300/80 dark:border-slate-800 opacity-80 hover:opacity-100 grayscale hover:grayscale-0'
          : 'bg-white dark:bg-[#1f1f1f] border-slate-100/90 dark:border-[#2e2e2e]'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deck.coverImage}
            alt={deck.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1e293b] dark:text-white group-hover:text-[#ea7a54] dark:group-hover:text-slate-300 truncate transition-colors">
              {deck.title}
            </h3>
            {isDeckArchived && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  color: '#e2e8f0',
                }}
              >
                <Archive className="w-2.5 h-2.5 text-slate-300" />
                <span>{t('archivedUpper')}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <FlagIcon code={deck.targetFlag} size="sm" />
              <span className="dark:text-slate-300">{deck.targetLang}</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 stroke-[2.5]" />
            <span className="flex items-center gap-1">
              <FlagIcon code={deck.nativeFlag} size="sm" />
              <span className="dark:text-slate-300">{deck.nativeLang}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className="text-slate-400">{deck.cardCount} {t('cards')}</span>
            {deck.forkedFromTitle && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ml-0.5"
                style={{
                  background: 'linear-gradient(90deg, rgba(251,191,36,0.18) 0%, rgba(245,158,11,0.12) 100%)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#b45309',
                  boxShadow: '0 0 6px rgba(245,158,11,0.2)',
                }}
              >
                <GitFork className="w-2.5 h-2.5" />
                <span>
                  forked from {deck.forkedFromAuthor ? `@${deck.forkedFromAuthor}/` : ''}
                  {deck.forkedFromTitle}
                </span>
              </span>
            )}
            {deck.isCloned && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ml-0.5"
                style={{
                  background: 'linear-gradient(90deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.12) 100%)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#065f46',
                  boxShadow: '0 0 6px rgba(16,185,129,0.2)',
                }}
              >
                <Copy className="w-2.5 h-2.5" />
                <span>
                  cloned from{' '}
                  {(deck.clonedFromAuthor || deck.cloneOrigin) ? `@${deck.clonedFromAuthor || deck.cloneOrigin}/` : ''}
                  {deck.clonedFromTitle || deck.title}
                </span>
              </span>
            )}
            {deck.isPublic && !deck.forkedFromTitle && !deck.isCloned && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ml-0.5"
                style={{
                  background: 'linear-gradient(90deg, rgba(59,130,246,0.18) 0%, rgba(37,99,235,0.12) 100%)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#1d4ed8',
                  boxShadow: '0 0 6px rgba(59,130,246,0.2)',
                }}
              >
                <Share2 className="w-2.5 h-2.5" />
                <span>shared to explore</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {isDeckArchived ? (
          <button
            type="button"
            onClick={(e) => onUnarchive(e, deck)}
            className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors cursor-pointer"
            title="Restore deck to active library"
          >
            {t('unarchiveDeck')}
          </button>
        ) : null}
        <span className="text-xs text-slate-400 hidden sm:inline">{deck.timeAgo}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(deck.id);
          }}
          className="p-1.5 rounded-full text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <Star
            className={`w-4 h-4 ${
              deck.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        </button>

        {/* 3-dot options menu */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu(deck.id);
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={t('deckOptions')}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {openMenuDeckId === deck.id && (
            <div
              className="absolute right-0 top-8 w-48 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(deck.id);
                  onToggleMenu(deck.id);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <Star className={`w-3.5 h-3.5 ${deck.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                <span>{deck.isFavorite ? 'Remove Bookmark' : 'Bookmark Deck'}</span>
              </button>
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
      </div>
    </div>
  );
}
