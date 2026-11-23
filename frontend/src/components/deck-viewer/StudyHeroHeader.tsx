'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, TrendingUp, Award, GitFork, Copy } from 'lucide-react';
import { Deck } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface StudyHeroHeaderProps {
  apiDeck: Deck | null;
  deckCoverImage?: string;
  preset: any;
  langPair: string;
  cleanDescription: string;
  activeTab: 'cards' | 'progress' | 'statistics';
  setActiveTab: (tab: 'cards' | 'progress' | 'statistics') => void;
}

export const StudyHeroHeader: React.FC<StudyHeroHeaderProps> = ({

  apiDeck,
  deckCoverImage,
  preset,
  langPair,
  cleanDescription,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useI18n();
  const activeTags = apiDeck
    ? apiDeck.tags
      ? apiDeck.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []
    : preset.tags;

  // Extract author and origin details if deck is forked or cloned
  const rawDesc = apiDeck?.description || preset?.description || '';
  const forkAuthorMatch = rawDesc.match(/forked from @([^\s•]+)/i);
  const cloneAuthorMatch = rawDesc.match(/cloned from @([^\s•]+)/i);
  const originalTitleMatch = rawDesc.match(/Original:\s*"([^"]+)"/i);

  const title = apiDeck?.title || preset?.title || '';
  const isForked = Boolean(
    apiDeck?.forkedFromTitle ||
      (apiDeck as any)?.forkOrigin ||
      forkAuthorMatch ||
      title.toLowerCase().includes('(fork)')
  );
  const isCloned = Boolean(
    (apiDeck as any)?.isCloned ||
      (apiDeck as any)?.cloneOrigin ||
      cloneAuthorMatch ||
      title.toLowerCase().includes('(clone)')
  );

  const defaultAuthor =
    (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || 'You';

  const forkedAuthor =
    (apiDeck as any)?.forkedFromAuthor ||
    (apiDeck as any)?.forkAuthor ||
    forkAuthorMatch?.[1] ||
    (isForked ? defaultAuthor : undefined);

  const clonedAuthor =
    (apiDeck as any)?.clonedFromAuthor ||
    (apiDeck as any)?.cloneAuthor ||
    cloneAuthorMatch?.[1] ||
    (isCloned ? defaultAuthor : undefined);

  const originTitle =
    originalTitleMatch?.[1] ||
    apiDeck?.forkedFromTitle ||
    title.replace(/\s*\((?:Fork|Clone)\)/i, '');

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-100 dark:border-[#2e2e2e] bg-white dark:bg-[#1f1f1f] transition-colors">
      {/* Panoramic background image on the right with smooth horizontal fade */}
      {deckCoverImage && (
        <div className="absolute inset-y-0 right-0 w-3/5 sm:w-1/2 lg:w-3/5 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deckCoverImage}
            alt={preset.title}
            loading="lazy"
            decoding="async"
            suppressHydrationWarning
            className="w-full h-full object-cover object-right opacity-90 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/85 dark:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/50 dark:to-transparent" />
        </div>
      )}

      {/* Main Hero Content Area */}
      <div className="relative z-10 p-6 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Thumbnail Icon Box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-[#2e2e2e] shadow-sm bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              {deckCoverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={deckCoverImage}
                  alt={apiDeck?.title || preset.title}
                  suppressHydrationWarning
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-400">
                  {apiDeck?.title ? apiDeck.title.charAt(0).toUpperCase() : '📚'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {/* Title & Language Pair Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] dark:text-white tracking-tight">
                  {apiDeck?.title || preset.title}
                </h1>
                <span className="text-[11px] font-semibold text-accent-primary dark:text-slate-200 bg-accent-primary/10 dark:bg-[#282828] px-2.5 py-0.5 rounded-full border border-[#ea7a54]/20/80 dark:border-[#383838]">
                  {langPair}
                </span>
              </div>

              {/* Attribution Badge (Forked / Cloned) */}
              {isForked ? (
                <div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(90deg, rgba(251,191,36,0.18) 0%, rgba(245,158,11,0.12) 100%)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      color: '#d97706',
                    }}
                  >
                    <GitFork className="w-3 h-3 shrink-0" />
                    <span>
                      forked from{' '}
                      {forkedAuthor ? <span className="font-bold">@{forkedAuthor}/</span> : null}
                      <span className="font-medium">{originTitle}</span>
                    </span>
                  </div>
                </div>
              ) : isCloned ? (
                <div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(90deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.12) 100%)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      color: '#059669',
                    }}
                  >
                    <Copy className="w-3 h-3 shrink-0" />
                    <span>
                      cloned from{' '}
                      {clonedAuthor ? <span className="font-bold">@{clonedAuthor}/</span> : null}
                      <span className="font-medium">{originTitle}</span>
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Description */}
              {cleanDescription && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl line-clamp-2 leading-relaxed">
                  {cleanDescription}
                </p>
              )}

              {/* Topic Tag Pills */}
              {activeTags && activeTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/explore?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-0.5 rounded-full bg-slate-100/90 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 hover:text-accent-primary dark:text-slate-300 dark:hover:text-white border border-transparent hover:border-slate-200 dark:border-[#2e2e2e] dark:hover:border-white/15 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                      title={`Search "${tag}" in Explore`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Integrated Section Tabs (Cards, Progress, Statistics) */}
        <div className="flex items-center gap-8 pt-4 border-t border-slate-100/80 dark:border-[#2e2e2e] -mx-6 -mb-6 px-6 sm:-mx-7 sm:-mb-7 sm:px-7">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'cards'
                ? 'text-accent-primary dark:text-[#f59e7e] border-b-2 border-accent-primary dark:border-[#f59e7e]'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('cardsTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'progress'
                ? 'text-accent-primary dark:text-[#f59e7e] border-b-2 border-accent-primary dark:border-[#f59e7e]'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('progressTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('statistics')}
            className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'statistics'
                ? 'text-accent-primary dark:text-[#f59e7e] border-b-2 border-accent-primary dark:border-[#f59e7e]'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{t('statisticsTab')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
