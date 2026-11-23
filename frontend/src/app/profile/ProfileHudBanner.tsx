'use client';

import React from 'react';
import { Camera, Clock, Edit3 } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { COUNTRY_CODE_BY_NAME } from '@/lib/countries';
import { AccentOption } from '@/lib/theme';
import { UserAvatar } from '@/components/UserAvatar';
import { useI18n } from '@/lib/i18n';

interface ProfileHudBannerProps {
  bannerImage: string;
  bannerPosition: string;
  bannerZoom?: number;
  avatarImage: string;
  name: string;
  handle: string;
  bio: string;
  joinedDate: string;
  country: string;
  currentAccent: AccentOption;
  onOpenEditModal: () => void;
}

export const ProfileHudBanner: React.FC<ProfileHudBannerProps> = ({
  bannerImage,
  bannerPosition,
  bannerZoom = 100,
  avatarImage,
  name,
  handle,
  bio,
  joinedDate,
  country,
  currentAccent,
  onOpenEditModal,
}) => {
  const { t } = useI18n();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[200px] sm:min-h-[220px] group">
      {/* Full panoramic backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('${bannerImage}')`,
            backgroundPosition: bannerPosition.includes(' ') ? bannerPosition : `center ${bannerPosition}`,
            transform: bannerZoom !== 100 ? `scale(${bannerZoom / 100})` : undefined,
            transformOrigin: bannerPosition.includes(' ') ? bannerPosition : `center ${bannerPosition}`,
          }}
        />
      </div>
      {/* Multi-directional gradient overlay: strong bottom + moderate left */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080a10]/95 via-[#080a10]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080a10]/70 via-transparent to-transparent pointer-events-none" />

      {/* Quick Change Banner Button on Hover (Top-Right) */}
      <button
        type="button"
        onClick={onOpenEditModal}
        className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg hover:scale-105"
        title="Change background banner"
      >
        <Camera className="w-3.5 h-3.5" />
        <span>{t('changeCover')}</span>
      </button>

      {/* Content: avatar left, info centre-left, button bottom-right */}
      <div className="relative z-10 flex items-end justify-between gap-4 p-5 sm:p-7 h-full min-h-[200px] sm:min-h-[220px]">
        {/* Left: Avatar + Profile Info */}
        <div className="flex items-end gap-4 sm:gap-5">
          {/* Large Avatar with accent ring + green online dot */}
          <div className="relative shrink-0 group/avatar">
            <div
              className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full p-[2.5px] shadow-xl overflow-hidden"
              style={{ backgroundColor: currentAccent.primary }}
            >
              <UserAvatar
                avatar={avatarImage}
                name={name}
                size="2xl"
                className="w-full h-full"
              />
            </div>
            {/* Quick avatar edit overlay on hover */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
              title="Change profile picture"
            >
              <Camera className="w-5 h-5 drop-shadow" />
            </button>
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#080a10] shadow-sm pointer-events-none" />
          </div>

          {/* Name, handle, bio, meta */}
          <div className="space-y-1 pb-0.5">
            {/* Name + verified badge */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                {name || 'Your Name'}
              </h1>
              {/* Verified checkmark */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm shrink-0"
                style={{ backgroundColor: currentAccent.primary }}
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              </div>
            </div>

            {/* @handle */}
            <p className="text-[13px] font-semibold text-slate-300">@{handle || 'username'}</p>

            {/* Bio with inline edit icon */}
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-slate-300 font-normal leading-snug">
                {bio || t('noBio')}
              </p>
              <button
                type="button"
                onClick={onOpenEditModal}
                className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                title="Edit bio"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            {/* Joined date + Country pills */}
            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{joinedDate}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                <FlagIcon
                  code={COUNTRY_CODE_BY_NAME[country.toLowerCase()] || 'in'}
                  size="sm"
                />
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit Profile button */}
        <button
          type="button"
          onClick={onOpenEditModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/35 text-xs font-semibold text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 self-end shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t('editProfile')}</span>
        </button>
      </div>
    </div>
  );
};
