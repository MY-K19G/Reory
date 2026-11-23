'use client';

import React from 'react';
import {
  BookOpen,
  Layers,
  Calendar,
  Clock,
  Play,
  Zap,
  Plus,
  Trash2,
  Edit3,
  Share2,
  Settings,
  Upload,
  Archive,
  Info,
  Bookmark,
  Star,
} from 'lucide-react';
import { Deck } from '@/lib/types';
import { UserAvatar, isFakeAvatar } from '@/components/UserAvatar';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

interface StudySidebarProps {
  apiDeck: Deck | null;
  deckId?: string | number;
  preset: any;
  langPair: string;
  totalCards: number;
  progressStats: {
    percent: number;
    cardsLearned: number;
    totalCards: number;
    newCount: number;
    reviewCount: number;
    masteredCount: number;
    newPct: number;
    reviewPct: number;
    masteredPct: number;
    createdOn: string;
  };
  isArchived: boolean;
  onStartLearning: () => void;
  onPracticeQuiz: () => void;
  onAddCards: () => void;
  onRemoveCards: () => void;
  onEditDeck: () => void;
  onShareDeck: () => void;
  onOpenSettings: () => void;
  onExportDeck: () => void;
  onToggleArchiveModal: () => void;
}

export const StudySidebar: React.FC<StudySidebarProps> = ({
  apiDeck,
  deckId,
  preset,
  langPair,
  totalCards,
  progressStats,
  isArchived,
  onStartLearning,
  onPracticeQuiz,
  onAddCards,
  onRemoveCards,
  onEditDeck,
  onShareDeck,
  onOpenSettings,
  onExportDeck,
  onToggleArchiveModal,
}) => {
  const { t } = useI18n();
  const { currentAccent } = useTheme();

  return (
    <div className="lg:col-span-4 xl:col-span-3 space-y-4 w-full max-w-[320px]">
      {/* 1. Deck Details Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2">
            <div
              style={{
                backgroundColor: currentAccent.subtleBg,
                color: currentAccent.primary,
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">
              {t('deckDetails')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onEditDeck}
            style={{ color: currentAccent.primary }}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            {t('edit')}
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Language Pair */}
          <div className="flex items-start gap-3">
            <Layers className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">{t('languagePair')}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{langPair}</span>
            </div>
          </div>

          {/* Total Cards */}
          <div className="flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">{t('totalCardsLabel')}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {totalCards} {t('cardsCount') || 'cards'}
              </span>
            </div>
          </div>

          {/* Created By */}
          {(() => {
            let authorName = preset.author.name;
            let authorAvatar = preset.author.avatar;
            if (typeof window !== 'undefined') {
              const savedUser =
                localStorage.getItem('duocard_username') ||
                localStorage.getItem('duocard_user_name');
              const savedAvatar = localStorage.getItem('duocard_avatar');
              if (savedUser && (authorName === 'You' || !authorName)) {
                authorName = savedUser;
              }
              if (savedAvatar && !isFakeAvatar(savedAvatar)) {
                authorAvatar = savedAvatar;
              } else if (isFakeAvatar(authorAvatar)) {
                authorAvatar = '';
              }
            }
            return (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5">
                  <UserAvatar
                    avatar={authorAvatar}
                    name={authorName}
                    size="xs"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{t('createdBy')}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{authorName}</span>
                </div>
              </div>
            );
          })()}

          {/* Created On */}
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">{t('createdOn')}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{progressStats.createdOn}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">{t('lastUpdated')}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {apiDeck ? t('today') : preset.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Study Progress Card matching Donut & Progress Bars */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">
          {t('studyProgress')}
        </h3>

        {/* Radial Donut Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                style={{ stroke: currentAccent.primary }}
                className="transition-all duration-500"
                strokeDasharray={`${progressStats.percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#1e293b] dark:text-white">
              {progressStats.percent}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {progressStats.cardsLearned} / {progressStats.totalCards}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">{t('cardsLearned')}</span>
          </div>
        </div>

        {/* Progress Breakdown Bars */}
        <div className="space-y-2.5 pt-1 text-xs">
          {/* New */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-[70px]">
              <span
                style={{ backgroundColor: currentAccent.primary }}
                className="w-2 h-2 rounded-full"
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {t('statusNew')}
              </span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">{progressStats.newCount}</span>
            <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressStats.newPct}%`, backgroundColor: currentAccent.primary }}
                className="h-full rounded-full transition-all duration-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold w-7 text-right">{progressStats.newPct}%</span>
          </div>

          {/* Review */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-[70px]">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {t('statusReview')}
              </span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">{progressStats.reviewCount}</span>
            <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressStats.reviewPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold w-7 text-right">{progressStats.reviewPct}%</span>
          </div>

          {/* Mastered */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-[70px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {t('statusMastered')}
              </span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">{progressStats.masteredCount}</span>
            <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressStats.masteredPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold w-7 text-right">{progressStats.masteredPct}%</span>
          </div>
        </div>

        {/* Study & Quiz Action Buttons */}
        <div className="pt-2 space-y-2.5 border-t border-slate-100 dark:border-[#2e2e2e]">
          <button
            type="button"
            onClick={onStartLearning}
            style={{
              backgroundColor: currentAccent.primary,
              boxShadow: `0 8px 20px -4px ${currentAccent.ring}`,
            }}
            className="w-full py-3.5 px-4 rounded-2xl text-white font-black text-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
            <span className="tracking-wide text-white drop-shadow-xs">
              {t('startLearning')}
            </span>
          </button>

          <button
            type="button"
            onClick={onPracticeQuiz}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#282828] dark:hover:bg-[#323232] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-[#383838] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{t('practiceQuiz')}</span>
          </button>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-3 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t('quickActions')}
        </h3>
        <div className="space-y-1">
          {(() => {
            const currentDeckId = apiDeck?.id || deckId;
            const [isBookmarked, setIsBookmarked] = React.useState(() => {
              if (typeof window === 'undefined' || !currentDeckId) return false;
              try {
                const favs = JSON.parse(localStorage.getItem('duocard_favorite_decks') || '[]');
                return Array.isArray(favs) && favs.map(String).includes(String(currentDeckId));
              } catch {
                return false;
              }
            });

            React.useEffect(() => {
              if (typeof window === 'undefined' || !currentDeckId) return;
              try {
                const favs = JSON.parse(localStorage.getItem('duocard_favorite_decks') || '[]');
                setIsBookmarked(Array.isArray(favs) && favs.map(String).includes(String(currentDeckId)));
              } catch {}
            }, [currentDeckId]);

            const handleToggleBookmark = async () => {
              if (!currentDeckId) return;
              try {
                const favs = JSON.parse(localStorage.getItem('duocard_favorite_decks') || '[]');
                const strId = String(currentDeckId);
                const numId = Number(currentDeckId);
                let updated: (string | number)[];
                if (favs.map(String).includes(strId)) {
                  updated = favs.filter((item: string | number) => String(item) !== strId);
                  setIsBookmarked(false);
                } else {
                  updated = [...favs, isNaN(numId) ? strId : numId];
                  setIsBookmarked(true);
                }
                const jsonStr = JSON.stringify(updated);
                localStorage.setItem('duocard_favorite_decks', jsonStr);
                const userIdentifier = localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username');
                if (userIdentifier) {
                  const { savePreferences: apiSavePreferences } = await import('@/lib/api');
                  await apiSavePreferences({
                    usernameOrEmail: userIdentifier,
                    favoriteDecks: jsonStr,
                  });
                }
                window.dispatchEvent(new Event('duocard_bookmarks_updated'));
              } catch (err) {
                console.warn('Could not toggle deck bookmark:', err);
              }
            };

            return (
              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isBookmarked
                    ? 'text-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-accent-primary dark:hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark Deck'}</span>
              </button>
            );
          })()}
          <button
            type="button"
            onClick={onAddCards}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-accent-primary dark:hover:text-white transition-colors cursor-pointer text-left"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>{t('addCards')}</span>
          </button>
          <button
            type="button"
            onClick={onRemoveCards}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer text-left"
          >
            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
            <span>{t('removeCards')}</span>
          </button>
          <button
            type="button"
            onClick={onEditDeck}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-accent-primary dark:hover:text-white transition-colors cursor-pointer text-left"
          >
            <Edit3 className="w-4 h-4 text-slate-400" />
            <span>{t('editDeck')}</span>
          </button>
          <button
            type="button"
            onClick={onShareDeck}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-accent-primary dark:hover:text-white transition-colors cursor-pointer text-left"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>{t('shareDeckBtn')}</span>
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-accent-primary dark:hover:text-white transition-colors cursor-pointer text-left"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>{t('deckSettings')}</span>
          </button>
        </div>
      </div>

      {/* 4. More Options */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-3 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t('moreOptions')}
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={onExportDeck}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-accent-primary dark:hover:text-white transition-colors cursor-pointer text-left"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>{t('exportDeck')}</span>
          </button>
          <div className="flex items-center justify-between group/archive w-full rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors pr-2">
            <button
              type="button"
              onClick={onToggleArchiveModal}
              className="flex-1 flex items-center gap-3 p-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer text-left"
            >
              <Archive className={`w-4 h-4 ${isArchived ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>{isArchived ? t('unarchiveDeck') : t('archiveDeck')}</span>
            </button>

            <div className="relative group/info">
              <button
                type="button"
                aria-label={t('whatIsArchiveTitle')}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleArchiveModal();
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              <div className="absolute right-0 bottom-full mb-2 w-56 p-2.5 rounded-xl bg-slate-900/95 dark:bg-[#282828] text-white text-[11px] font-normal leading-relaxed shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover/info:opacity-100 group-hover/info:pointer-events-auto transition-all duration-200 z-50">
                <div className="font-bold text-amber-400 mb-0.5 flex items-center gap-1">
                  <span>{t('whatIsArchiveTitle')}</span>
                </div>
                {t('whatIsArchiveDesc')}
                <div className="absolute right-2 top-full w-2 h-2 bg-slate-900/95 dark:bg-[#282828] rotate-45 border-r border-b border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
