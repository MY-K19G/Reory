'use client';

import {
  BookOpen,
  Layers,
  Calendar,
  Clock,
  BarChart2,
  Play,
  RotateCw,
  Share2,
} from 'lucide-react';
import { ExploreDeckDetails } from './types';
import { UserAvatar } from '@/components/UserAvatar';

interface DeckSidebarDetailsProps {
  collection: ExploreDeckDetails;
  onStudy: () => void;
  onPracticeQuiz: () => void;
  onShare: () => void;
}

export function DeckSidebarDetails({
  collection,
  onStudy,
  onPracticeQuiz,
  onShare,
}: DeckSidebarDetailsProps) {
  return (
    <div className="lg:col-span-4 xl:col-span-3 space-y-4 w-full max-w-[320px]">
      {/* 1. Deck Details Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/10 dark:bg-[#282828] text-accent-primary dark:text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">Deck Details</h3>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-accent-primary dark:text-white hover:underline cursor-pointer"
          >
            Edit
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3">
            <Layers className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Language Pair</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {collection.languagePair}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Total Cards</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {collection.totalCards} cards
              </span>
            </div>
          </div>

          {(() => {
            let authorName = collection.author.name;
            let authorAvatar = collection.author.avatar;
            if (typeof window !== 'undefined') {
              const savedUser =
                localStorage.getItem('duocard_username') ||
                localStorage.getItem('duocard_user_name');
              const savedAvatar = localStorage.getItem('duocard_avatar');
              if (savedUser && (authorName === 'You' || !authorName)) {
                authorName = savedUser;
              }
              if (savedAvatar && savedAvatar !== '/profile/avatar.jpg') {
                authorAvatar = savedAvatar;
              } else if (authorAvatar === '/profile/avatar.jpg') {
                authorAvatar = '';
              }
            }
            return (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5 border border-slate-200 dark:border-white/10">
                  <UserAvatar
                    avatar={authorAvatar}
                    name={authorName}
                    size="xs"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Created By</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {authorName.startsWith('@') ? authorName : `@${authorName}`}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Created On</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {collection.createdOn}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Last Updated</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {collection.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Study Progress Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">Study Progress</h3>
          </div>
          <span className="text-xs font-black text-accent-primary dark:text-[#f59e7e]">
            {collection.progress.percent}%
          </span>
        </div>

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-accent-primary rounded-full transition-all duration-500"
              style={{ width: `${collection.progress.percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{collection.progress.cardsLearned} cards learned</span>
            <span>{collection.totalCards - collection.progress.cardsLearned} remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-white/5">
            <span className="block text-xs font-black text-slate-700 dark:text-slate-200">
              {collection.progress.newCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">New</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-white/5">
            <span className="block text-xs font-black text-amber-500 dark:text-amber-400">
              {collection.progress.reviewCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Review</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-100 dark:border-white/5">
            <span className="block text-xs font-black text-emerald-500 dark:text-emerald-400">
              {collection.progress.masteredCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Mastered</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-5 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 dark:border-[#2e2e2e]">
          Quick Actions
        </h3>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onStudy}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-accent-primary hover:opacity-95 text-white font-bold text-xs shadow-md shadow-accent-primary/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Study This Deck</span>
          </button>

          <button
            type="button"
            onClick={onPracticeQuiz}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white dark:bg-[#282828] hover:bg-slate-50 dark:hover:bg-[#333] border border-slate-200/80 dark:border-[#383838] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Practice Quiz</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white dark:bg-[#282828] hover:bg-slate-50 dark:hover:bg-[#333] border border-slate-200/80 dark:border-[#383838] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share Deck</span>
          </button>
        </div>
      </div>
    </div>
  );
}
