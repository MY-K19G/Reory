'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { FriendUser, Achievement, ActivityItem } from './types';
import { OtherUserProgressTab } from './components/OtherUserProgressTab';
import { OtherUserDecksTab } from './components/OtherUserDecksTab';
import { OtherUserAchievementsTab } from './components/OtherUserAchievementsTab';
import { OtherUserActivityTab } from './components/OtherUserActivityTab';
import { OtherUserHeroHeader } from './components/OtherUserHeroHeader';
import { OtherUserStreakCard } from './components/OtherUserStreakCard';

interface OtherUserProfileViewProps {
  selectedViewUser: FriendUser;
  onBack: () => void;
  isFollowed: boolean;
  onToggleFollow: (user: FriendUser) => void;
  onOpenChat: (user: FriendUser) => void;
  currentAccent: AccentOption;
  achievements: Achievement[];
  recentActivities: ActivityItem[];
}

export const OtherUserProfileView: React.FC<OtherUserProfileViewProps> = ({
  selectedViewUser,
  onBack,
  isFollowed,
  onToggleFollow,
  onOpenChat,
  currentAccent,
  achievements,
  recentActivities,
}) => {
  const { t } = useI18n();
  const [viewingUserSubmenu, setViewingUserSubmenu] = useState<'progress' | 'decks' | 'achievements' | 'activity'>('progress');

  const userSharedDecks = selectedViewUser.sharedDecks && selectedViewUser.sharedDecks.length > 0
    ? selectedViewUser.sharedDecks
    : [
        {
          title: `${selectedViewUser.lang} Core Vocabulary`,
          count: 65,
          cover: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=300&auto=format&fit=crop&q=80',
        },
      ];

  const handleToggleFollow = () => onToggleFollow(selectedViewUser);
  const handleOpenChat = () => {
    onBack();
    onOpenChat(selectedViewUser);
  };

  return (
    <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-4 pb-12">
        {/* Top Return / Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to My Profile</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Viewing Public Profile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* 1. FULL-WIDTH HERO PROFILE HUD BANNER FOR OTHER USER */}
        <OtherUserHeroHeader
          selectedViewUser={selectedViewUser}
          isFollowed={isFollowed}
          onToggleFollow={handleToggleFollow}
          onOpenChat={handleOpenChat}
          currentAccent={currentAccent}
        />

        {/* 2. LEARNING STREAK HEATMAP CARD FOR OTHER USER */}
        <OtherUserStreakCard
          selectedViewUser={selectedViewUser}
          currentAccent={currentAccent}
        />

        {/* 3. SUBMENU NAVIGATION BAR FOR OTHER USER */}
        <div className="space-y-3.5">
          <div className="border-b border-slate-200 dark:border-white/10 px-1">
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
              {[
                { id: 'progress' as const, label: `${selectedViewUser.name}'s Learning Progress` },
                { id: 'decks' as const, label: `${selectedViewUser.name}'s Decks` },
                { id: 'achievements' as const, label: 'Achievements' },
                { id: 'activity' as const, label: 'Recent Activity' },
              ].map((tab) => {
                const isActive = viewingUserSubmenu === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewingUserSubmenu(tab.id)}
                    className={`group relative py-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-slate-900 dark:text-white font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive ? (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                        style={{ backgroundColor: currentAccent.primary }}
                      />
                    ) : (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-white/20 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENT: 1. LEARNING PROGRESS */}
          {viewingUserSubmenu === 'progress' && (
            <OtherUserProgressTab
              selectedViewUser={selectedViewUser}
              currentAccent={currentAccent}
            />
          )}

          {/* TAB CONTENT: 2. PUBLIC SHARED DECKS */}
          {viewingUserSubmenu === 'decks' && (
            <OtherUserDecksTab
              selectedViewUser={selectedViewUser}
              userSharedDecks={userSharedDecks}
            />
          )}

          {/* TAB CONTENT: 3. ACHIEVEMENTS */}
          {viewingUserSubmenu === 'achievements' && (
            <OtherUserAchievementsTab
              selectedViewUser={selectedViewUser}
              achievements={achievements}
            />
          )}

          {/* TAB CONTENT: 4. RECENT ACTIVITY */}
          {viewingUserSubmenu === 'activity' && (
            <OtherUserActivityTab
              selectedViewUser={selectedViewUser}
              recentActivities={recentActivities}
            />
          )}

          {/* Panoramic Footer Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-[#161922] dark:bg-[#14161f] border border-white/10 shadow-lg min-h-[105px] flex items-center p-4 sm:p-5">
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
              style={{
                backgroundImage: `url('/profile/footer-banner.jpg')`,
                backgroundPosition: 'right 30%',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1017] via-[#0d1017]/85 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-1.5 max-w-md">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {t('betterEveryday')}
              </h2>
              <p className="text-[11px] text-slate-300 font-normal">
                {t('betterEverydayDesc')}
              </p>
              <div className="pt-0.5">
                <Link
                  href="/explore"
                  style={{ backgroundColor: currentAccent.primary }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  <span>{t('exploreDecksBtn')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
