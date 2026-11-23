'use client';

import React from 'react';
import { Users, Search, MessageSquare, UserPlus } from 'lucide-react';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { FriendUser } from '../types';

interface ProfileFriendsTabProps {
  friendsList: FriendUser[];
  currentAccent: AccentOption;
  setIsSearchModalOpen: (val: boolean) => void;
  setSelectedViewUser: (user: FriendUser) => void;
  setActiveChatFriend: (user: FriendUser) => void;
}

export const ProfileFriendsTab: React.FC<ProfileFriendsTabProps> = ({
  friendsList,
  currentAccent,
  setIsSearchModalOpen,
  setSelectedViewUser,
  setActiveChatFriend,
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-4 transition-colors animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            {t('friendsAndStudyPartners')}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('friendsDesc')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="text-[11px] font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: currentAccent.primary }}
        >
          <Search className="w-3.5 h-3.5" />
          <span>{t('searchUsers')}</span>
        </button>
      </div>

      {/* Friends Grid or Empty State */}
      {friendsList.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('noStudyPartnersYet')}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            {t('noStudyPartnersDesc')}
          </p>
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            style={{ backgroundColor: currentAccent.primary }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('searchAndAddPartners')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3.5 pt-1">
          {friendsList.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedViewUser(friend)}
              className="relative flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/60 dark:border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
              title={`View ${friend.name}'s profile`}
            >
              {/* Status Indicator */}
              <span
                className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#161922] ${
                  friend.status === 'online'
                    ? 'bg-emerald-400'
                    : friend.status === 'studying'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-slate-400'
                }`}
                title={friend.status}
              />

              {/* Avatar */}
              <div className="relative mb-2.5">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200/60 dark:border-white/10 group-hover:scale-105 transition-transform shadow-sm"
                />
              </div>

              <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate w-full group-hover:text-cyan-400 transition-colors">
                {friend.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate w-full">
                {friend.lang} • {friend.streak}
              </span>

              {/* Actions: View Profile & Chat */}
              <div className="mt-3 flex items-center gap-1.5 w-full justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedViewUser(friend);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  {t('profile')}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChatFriend(friend);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>{t('chat')}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Friend / Search User Card */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.04] border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-cyan-400/50 transition-all group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#10121a] border border-slate-300 dark:border-white/15 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400 transition-all mb-2.5">
              <UserPlus className="w-6 h-6 text-slate-400 dark:text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {t('findFriends')}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {t('searchUsername')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
