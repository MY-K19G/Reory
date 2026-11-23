'use client';

import React from 'react';
import { Check, Clock, MessageSquare } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { COUNTRY_CODE_BY_NAME } from '@/lib/countries';
import { AccentOption } from '@/lib/theme';
import { FriendUser } from '../types';

interface OtherUserHeroHeaderProps {
  selectedViewUser: FriendUser;
  isFollowed: boolean;
  onToggleFollow: () => void;
  onOpenChat: () => void;
  currentAccent: AccentOption;
}

export const OtherUserHeroHeader: React.FC<OtherUserHeroHeaderProps> = ({
  selectedViewUser,
  isFollowed,
  onToggleFollow,
  onOpenChat,
  currentAccent,
}) => {
  const userBanner =
    selectedViewUser.banner ||
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[200px] sm:min-h-[220px] group">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-300"
        style={{
          backgroundImage: `url('${userBanner}')`,
          backgroundPosition: 'center 35%',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080a10]/95 via-[#080a10]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080a10]/70 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-end justify-between gap-4 p-5 sm:p-7 h-full min-h-[200px] sm:min-h-[220px]">
        {/* Left: Avatar + Profile Info */}
        <div className="flex items-end gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div
              className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full p-[2.5px] shadow-xl overflow-hidden"
              style={{ backgroundColor: currentAccent.primary }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedViewUser.avatar}
                alt={selectedViewUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Status Indicator Dot */}
            <span
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#080a10] shadow-sm ${
                selectedViewUser.status === 'online'
                  ? 'bg-emerald-400'
                  : selectedViewUser.status === 'studying'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
          </div>

          {/* Name, handle, bio, meta */}
          <div className="space-y-1 pb-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                {selectedViewUser.name}
              </h1>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm shrink-0"
                style={{ backgroundColor: currentAccent.primary }}
              >
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
            </div>

            <p className="text-[13px] font-semibold text-slate-300">
              @{selectedViewUser.username}
            </p>

            <div className="flex items-center gap-1.5">
              <p className="text-xs text-slate-300 font-normal leading-snug">
                {selectedViewUser.bio || 'Language learner expanding vocabulary every single day!'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedViewUser.joinedDate || 'Joined 2025'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                <FlagIcon
                  code={COUNTRY_CODE_BY_NAME[selectedViewUser.country.toLowerCase()] || 'jp'}
                  size="sm"
                />
                <span>{selectedViewUser.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Follow & Chat Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end">
          <button
            type="button"
            onClick={onToggleFollow}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
              isFollowed
                ? 'bg-white/15 hover:bg-rose-500/20 text-white hover:text-rose-300 border border-white/20'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isFollowed ? 'Following' : '+ Follow'}
          </button>

          <button
            type="button"
            onClick={onOpenChat}
            className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
