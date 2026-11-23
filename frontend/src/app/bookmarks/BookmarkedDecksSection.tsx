'use client';

import { useI18n } from '@/lib/i18n';

import { useRouter } from 'next/navigation';
import { Star, ArrowRight, FolderClosed } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { useTheme } from '@/lib/theme';
import { BookmarkedDeckItem } from './types';

interface BookmarkedDecksSectionProps {
  decks: BookmarkedDeckItem[];
  viewMode: 'grid' | 'list';
  onToggleDeckBookmark: (id: string | number) => void;
}

export function BookmarkedDecksSection({
  decks,
  viewMode,
  onToggleDeckBookmark,
}: BookmarkedDecksSectionProps) {
  const router = useRouter();
  const { currentAccent } = useTheme();
  const { t } = useI18n();

  if (decks.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] space-y-3">
        <FolderClosed className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No bookmarked decks</h3>
        <p className="text-xs text-slate-400">Bookmark decks in My Decks or Deck View to see them here.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => router.push(`/study/${deck.id}`)}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#2e2e2e] shadow-xs hover:border-slate-200 dark:hover:border-[#383838] transition-all flex items-center justify-between gap-4 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deck.coverImage} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>

              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#1e293b] dark:text-white group-hover:text-accent-primary dark:group-hover:text-white transition-colors truncate">
                  {deck.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  <FlagIcon code={deck.targetFlag} className="w-3.5 h-3.5" />
                  <span>{deck.targetLang}</span>
                  <span>&bull;</span>
                  <span>{deck.cardCount} {t('cards')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDeckBookmark(deck.id);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-amber-400 transition-colors"
                title={t('removeBookmark')}
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </button>
              <button
                type="button"
                style={{ backgroundColor: currentAccent.subtleBg, color: currentAccent.primary }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all group-hover:scale-105 flex items-center gap-1"
              >
                <span>{t('study')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {decks.map((deck) => (
        <div
          key={deck.id}
          onClick={() => router.push(`/study/${deck.id}`)}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-100 dark:border-[#2e2e2e] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer flex flex-col justify-between"
        >
          <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={deck.coverImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDeckBookmark(deck.id);
              }}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-amber-400 hover:scale-110 transition-transform"
              title={t('removeBookmark')}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <FlagIcon code={deck.targetFlag} className="w-3.5 h-3.5" />
              <span>{deck.targetLang}</span>
            </div>
            <h4 className="text-sm font-bold text-[#1e293b] dark:text-white group-hover:text-accent-primary dark:group-hover:text-white transition-colors truncate">
              {deck.title}
            </h4>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>{deck.cardCount} {t('cards')}</span>
              <span className="text-accent-primary dark:text-cyan-400 font-bold flex items-center gap-1">
                <span>{t('study')}</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
