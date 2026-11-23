'use client';

import React, { useRef } from 'react';
import { Sparkles, Upload, Link as LinkIcon, Check } from 'lucide-react';
import { PRESET_AVATARS } from '@/components/UserAvatar';
import { useI18n } from '@/lib/i18n';

interface ProfileAvatarPickerProps {
  avatar: string;
  setAvatar: (avatar: string) => void;
  customAvatarUrl: string;
  setCustomAvatarUrl: (url: string) => void;
  avatarTab: 'notionist' | 'disk' | 'url';
  setAvatarTab: (tab: 'notionist' | 'disk' | 'url') => void;
  setErrorMsg: (msg: string) => void;
}

export const ProfileAvatarPicker: React.FC<ProfileAvatarPickerProps> = ({
  avatar,
  setAvatar,
  customAvatarUrl,
  setCustomAvatarUrl,
  avatarTab,
  setAvatarTab,
  setErrorMsg,
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDiskUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatar(base64);
        setCustomAvatarUrl('');
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-white/10 space-y-3 animate-in fade-in duration-200">
      {/* Tabs: Notionists Style vs Add From Disk vs Custom URL */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-black/40 rounded-xl">
        <button
          type="button"
          onClick={() => setAvatarTab('notionist')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            avatarTab === 'notionist'
              ? 'bg-white dark:bg-[#282828] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('notionistsStyle')}</span>
        </button>

        <button
          type="button"
          onClick={() => setAvatarTab('disk')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            avatarTab === 'disk'
              ? 'bg-white dark:bg-[#282828] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('addFromDisk')}</span>
        </button>

        <button
          type="button"
          onClick={() => setAvatarTab('url')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            avatarTab === 'url'
              ? 'bg-white dark:bg-[#282828] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
          title="Image URL"
        >
          <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">URL</span>
        </button>
      </div>

      {/* Option 1: Notionists Style Characters */}
      {avatarTab === 'notionist' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>{t('chooseNotionist')}</span>
            <span className="text-[10px] text-cyan-500 dark:text-cyan-400">{t('clickToSelect')}</span>
          </div>
          <div className="max-h-32 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10">
            {PRESET_AVATARS.map((presetUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAvatar(presetUrl);
                  setCustomAvatarUrl('');
                }}
                className={`aspect-square rounded-xl overflow-hidden ring-2 shrink-0 transition-all cursor-pointer ring-offset-1 dark:ring-offset-[#121212] ${
                  avatar === presetUrl && !customAvatarUrl
                    ? 'ring-cyan-400 scale-105 shadow-sm'
                    : 'ring-transparent hover:ring-slate-400 opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={presetUrl} alt={`Notionist preset ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Option 2: Add From Disk */}
      {avatarTab === 'disk' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleDiskUpload}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-cyan-400 dark:hover:border-cyan-400 bg-white/60 dark:bg-black/30 hover:bg-cyan-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {t('imageFromDisk')}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Supports PNG, JPG, JPEG, WebP, GIF, or SVG (max 5MB)
              </span>
            </div>
            <span className="mt-1 px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 text-[11px] font-bold group-hover:bg-cyan-400 transition-colors">
              {t('browseDiskFiles')}
            </span>
          </div>

          {avatar.startsWith('data:image/') && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Custom image loaded from disk
              </span>
              <button
                type="button"
                onClick={() => {
                  setAvatar(PRESET_AVATARS[0]);
                  setCustomAvatarUrl('');
                }}
                className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
              >
                {t('resetToNotionist')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Option 3: Custom Image URL */}
      {avatarTab === 'url' && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            Direct Image Web URL:
          </span>
          <input
            type="url"
            value={customAvatarUrl}
            onChange={(e) => setCustomAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono"
          />
        </div>
      )}
    </div>
  );
};
