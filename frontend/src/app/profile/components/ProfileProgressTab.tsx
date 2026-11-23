'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { AccentOption } from '@/lib/theme';
import { Deck } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface ProfileProgressTabProps {
  currentAccent: AccentOption;
  targetLang?: string;
  currentLevel?: string;
  streakDays?: number;
  decks?: Deck[];
}

const getLanguageFlagCode = (langName: string): string => {
  const l = (langName || '').trim().toLowerCase();
  if (l === 'japanese' || l === 'ja') return 'jp';
  if (l === 'korean' || l === 'ko') return 'kr';
  if (l === 'spanish' || l === 'es') return 'es';
  if (l === 'french' || l === 'fr') return 'fr';
  if (l === 'german' || l === 'de') return 'de';
  if (l === 'chinese' || l === 'zh' || l === 'cn') return 'cn';
  if (l === 'italian' || l === 'it') return 'it';
  if (
    l === 'hindi' ||
    l === 'hi' ||
    l === 'odia' ||
    l === 'bengali' ||
    l === 'tamil' ||
    l === 'telugu' ||
    l === 'marathi' ||
    l === 'gujarati' ||
    l === 'kannada' ||
    l === 'malayalam' ||
    l === 'punjabi'
  ) {
    return 'in';
  }
  if (l === 'russian' || l === 'ru') return 'ru';
  if (l === 'portuguese' || l === 'pt') return 'pt';
  if (l === 'arabic' || l === 'ar') return 'sa';
  return 'us';
};

export const ProfileProgressTab: React.FC<ProfileProgressTabProps> = ({
  currentAccent,
  targetLang: propLang,
  currentLevel: propLevel,
  streakDays = 0,
  decks = [],
}) => {
  const { t } = useI18n();

  // 1. Group actual user decks by language
  const languageGroups = React.useMemo(() => {
    const map = new Map<
      string,
      {
        language: string;
        level: string;
        configuredLevel?: string;
        totalCards: number;
        masteredCards: number;
        dueCards: number;
        deckCount: number;
      }
    >();

    const now = new Date();

    const calculateDynamicLevel = (total: number, mastered: number, configuredLevel?: string): string => {
      // If user has manually configured higher level, respect it
      const configClean = (configuredLevel || '').trim().toLowerCase();
      if (configClean.includes('advanced') || configClean.includes('c1') || configClean.includes('c2')) {
        return 'Advanced';
      }
      if (configClean.includes('intermediate') || configClean.includes('b1') || configClean.includes('b2')) {
        return 'Intermediate';
      }

      // Dynamic calculation according to real learning activity
      const pct = total > 0 ? (mastered / total) * 100 : 0;
      if (mastered >= 80 || (total >= 100 && pct >= 75)) {
        return 'Advanced';
      }
      if (mastered >= 15 || (total >= 15 && pct >= 40) || pct >= 50) {
        return 'Intermediate';
      }
      return 'Beginner';
    };

    decks.forEach((deck) => {
      const rawLang = deck.language?.trim();
      const lang = rawLang || 'General';
      const existing = map.get(lang) || {
        language: lang,
        level: 'Beginner',
        configuredLevel: deck.level,
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        deckCount: 0,
      };

      const deckTotalCards = deck.cards?.length || 0;
      const deckMastered =
        deck.cards?.filter((c) => c.status === 'MASTERED')?.length || 0;
      const deckDue =
        deck.cards?.filter((c) => {
          if (c.status === 'REVIEW') return true;
          if (c.nextReviewDate) {
            return new Date(c.nextReviewDate) <= now;
          }
          return false;
        })?.length || 0;

      existing.totalCards += deckTotalCards;
      existing.masteredCards += deckMastered;
      existing.dueCards += deckDue;
      existing.deckCount += 1;
      if (deck.level && !existing.configuredLevel) {
        existing.configuredLevel = deck.level;
      }

      map.set(lang, existing);
    });

    return Array.from(map.values()).map((g) => ({
      ...g,
      level: calculateDynamicLevel(g.totalCards, g.masteredCards, g.configuredLevel),
    }));
  }, [decks]);

  // Overall totals across all user decks
  const overallTotalCards = React.useMemo(() => {
    return decks.reduce((acc, d) => acc + (d.cards?.length || 0), 0);
  }, [decks]);

  const overallMasteredCards = React.useMemo(() => {
    return decks.reduce(
      (acc, d) =>
        acc + (d.cards?.filter((c) => c.status === 'MASTERED')?.length || 0),
      0
    );
  }, [decks]);

  const overallPercentage = React.useMemo(() => {
    if (overallTotalCards === 0) return 0;
    return Math.min(100, Math.round((overallMasteredCards / overallTotalCards) * 100));
  }, [overallTotalCards, overallMasteredCards]);

  // Primary active language displayed in radial summary
  const primaryLang =
    languageGroups.length > 0
      ? languageGroups[0].language
      : propLang && propLang.toLowerCase() !== 'japanese'
      ? propLang
      : 'No Active Language';

  const primaryLevel =
    languageGroups.length > 0 ? languageGroups[0].level : propLevel || 'Beginner';

  const [dailyGoal, setDailyGoal] = React.useState('10 cards');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGoal = localStorage.getItem('duocard_daily_goal');
      if (savedGoal) setDailyGoal(`${savedGoal} cards`);
      // Clean up stale mock/fake target language in localStorage if user only has other languages
      if (languageGroups.length > 0 && languageGroups[0].language) {
        const curLocal = localStorage.getItem('duocard_target_lang');
        if (
          curLocal &&
          curLocal.toLowerCase() === 'japanese' &&
          !languageGroups.some((g) => g.language.toLowerCase() === 'japanese')
        ) {
          localStorage.setItem('duocard_target_lang', languageGroups[0].language);
        }
      }
    }
  }, [languageGroups]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-5 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {t('languageMasteryProgress')}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t('realtimeRetentionDesc')}
            </p>
          </div>
          <Link
            href="/my-cards"
            className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <span>{t('viewLibrary')}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
          {/* Radial Progress Donut + Overview Stats (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  stroke={currentAccent.primary}
                  strokeWidth="3.4"
                  strokeDasharray={`${overallPercentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {overallPercentage}%
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                  {primaryLang}
                  <br />
                  {t('mastery')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-3 border-t border-slate-200/60 dark:border-white/10 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{t('target')}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {primaryLang}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{t('level')}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {primaryLevel}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{t('dailyGoal')}</span>
                <span className="text-xs font-bold text-emerald-500 truncate block">
                  {dailyGoal}
                </span>
              </div>
            </div>
          </div>

          {/* Real Language Cards with Detailed Breakdown (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            {languageGroups.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('noFlashcardDecksYet')}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('startBuildingLibraryDesc')}
                </p>
                <div className="pt-2">
                  <Link
                    href="/decks/new"
                    className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: currentAccent.primary }}
                  >
                    {t('createYourFirstDeck')}
                  </Link>
                </div>
              </div>
            ) : (
              languageGroups.map((group) => {
                const groupPercentage =
                  group.totalCards === 0
                    ? 0
                    : Math.min(
                        100,
                        Math.round((group.masteredCards / group.totalCards) * 100)
                      );
                const flag = getLanguageFlagCode(group.language);

                return (
                  <div
                    key={group.language}
                    className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/70 dark:hover:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FlagIcon code={flag} size="sm" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {group.language}
                        </span>
                        <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 truncate">
                          {group.level}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden md:inline">
                          ({group.deckCount} {group.deckCount === 1 ? 'deck' : 'decks'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-right shrink-0">
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          {streakDays}d {t('streak').toLowerCase()}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {groupPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${groupPercentage}%`,
                          backgroundColor: currentAccent.primary,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <div className="flex items-center gap-3">
                        <span>
                          <strong className="text-slate-800 dark:text-slate-200 font-bold">
                            {group.totalCards}
                          </strong>{' '}
                          {t('cards').toLowerCase()}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-emerald-500 font-bold">
                            {group.masteredCards}
                          </strong>{' '}
                          {t('mastered').toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={
                            group.dueCards > 0
                              ? 'text-amber-500 font-semibold'
                              : 'text-slate-400 font-normal'
                          }
                        >
                          {group.dueCards} {t('dueToday')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
