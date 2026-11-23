'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Edit3, MapPin, Image as ImageIcon, Upload, Move, RotateCcw } from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';
import { AccentOption } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftName: string;
  setDraftName: (name: string) => void;
  draftHandle: string;
  setDraftHandle: (handle: string) => void;
  draftCountry: string;
  setDraftCountry: (country: string) => void;
  draftBio: string;
  setDraftBio: (bio: string) => void;
  draftBanner: string;
  setDraftBanner: (banner: string) => void;
  draftBannerPosition: string;
  setDraftBannerPosition: (pos: string) => void;
  draftBannerZoom?: number;
  setDraftBannerZoom?: (zoom: number | ((prev: number) => number)) => void;
  bannerInputMode: 'presets' | 'url' | 'upload';
  setBannerInputMode: (mode: 'presets' | 'url' | 'upload') => void;
  currentAccent: AccentOption;
  onSave: (e: React.FormEvent) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  draftName,
  setDraftName,
  draftHandle,
  setDraftHandle,
  draftCountry,
  setDraftCountry,
  draftBio,
  setDraftBio,
  draftBanner,
  setDraftBanner,
  draftBannerPosition,
  setDraftBannerPosition,
  draftBannerZoom = 100,
  setDraftBannerZoom,
  bannerInputMode,
  setBannerInputMode,
  currentAccent,
  onSave,
}) => {
  const { t } = useI18n();
  // Parse X and Y from position string
  const parsePos = (pos: string) => {
    if (!pos) return { x: 50, y: 50 };
    const parts = pos.trim().split(/\s+/);
    if (parts.length === 1) {
      const v = parts[0];
      if (v === 'top') return { x: 50, y: 0 };
      if (v === 'bottom') return { x: 50, y: 100 };
      if (v === 'center') return { x: 50, y: 50 };
      const n = parseFloat(v);
      return { x: 50, y: isNaN(n) ? 50 : Math.max(0, Math.min(100, n)) };
    }
    const parseP = (p: string) => {
      if (p === 'left' || p === 'top') return 0;
      if (p === 'right' || p === 'bottom') return 100;
      if (p === 'center') return 50;
      const n = parseFloat(p);
      return isNaN(n) ? 50 : Math.max(0, Math.min(100, n));
    };
    return { x: parseP(parts[0]), y: parseP(parts[1]) };
  };

  const { x: posX, y: posY } = parsePos(draftBannerPosition);

  const bannerPreviewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  // Wheel to zoom on preview
  useEffect(() => {
    const el = bannerPreviewRef.current;
    if (!el || !setDraftBannerZoom) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      setDraftBannerZoom((prev) => Math.min(200, Math.max(100, (prev || 100) + delta)));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [setDraftBannerZoom]);

  // Window drag listeners for smooth dragging in all directions (left, right, top, bottom)
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !bannerPreviewRef.current) return;
      const rect = bannerPreviewRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      const newX = Math.round(Math.min(100, Math.max(0, dragStartRef.current.startX - percentDeltaX)));
      const newY = Math.round(Math.min(100, Math.max(0, dragStartRef.current.startY - percentDeltaY)));

      setDraftBannerPosition(`${newX}% ${newY}%`);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setDraftBannerPosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-[#181a24] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-cyan-400" />
            {t('editProfileDetails')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          {/* Display Name, Handle & Country / Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {t('displayName')}
              </label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
                placeholder={t('enterYourName')}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {t('usernameHandle')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  @
                </span>
                <input
                  type="text"
                  value={draftHandle}
                  onChange={(e) => setDraftHandle(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {t('locationCountry')} ({ALL_COUNTRIES.length})
            </label>
            <select
              value={draftCountry}
              onChange={(e) => setDraftCountry(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0f1118] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="" className="bg-[#181a24] text-slate-400">{t('selectCountry')}</option>
              {ALL_COUNTRIES.map((c) => (
                <option key={c.code} value={c.name} className="bg-[#181a24] text-white py-1">
                  {c.name} ({c.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t('bio')}
            </label>
            <input
              type="text"
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
              placeholder={t('tellUsAboutYourself')}
            />
          </div>

          {/* Banner / Cover Background Customization */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                {t('profileCoverBackground')}
              </label>
              {/* Mode switch */}
              <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/10 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setBannerInputMode('presets')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    bannerInputMode === 'presets' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('presets')}
                </button>
                <button
                  type="button"
                  onClick={() => setBannerInputMode('url')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    bannerInputMode === 'url' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('url')}
                </button>
                <button
                  type="button"
                  onClick={() => setBannerInputMode('upload')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    bannerInputMode === 'upload' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('upload')}
                </button>
              </div>
            </div>

            {/* Banner Live Interactive Draggable Preview */}
            <div
              ref={bannerPreviewRef}
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                e.preventDefault();
                setIsDragging(true);
                dragStartRef.current = {
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  startX: posX,
                  startY: posY,
                };
              }}
              className={`relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner select-none group ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              title={`${t('dragMouseToMove')} (${draftBannerZoom || 100}%)`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draftBanner}
                alt="Banner Preview"
                draggable={false}
                style={{
                  objectPosition: `${posX}% ${posY}%`,
                  transform: (draftBannerZoom || 100) !== 100 ? `scale(${(draftBannerZoom || 100) / 100})` : undefined,
                  transformOrigin: `${posX}% ${posY}%`,
                }}
                className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Top-Left Pill Badge: Drag mouse to move • Scroll to zoom */}
              <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20 shadow-md">
                  <Move className="w-3 h-3 text-cyan-400" />
                  <span>{t('dragMouseToMove')} ({draftBannerZoom || 100}%)</span>
                </span>
              </div>

              {/* Top-Right Reset Button */}
              {((posX !== 50 || posY !== 50) || (draftBannerZoom && draftBannerZoom !== 100)) && (
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDraftBannerPosition('50% 50%');
                      setDraftBannerZoom?.(100);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 hover:bg-black/90 text-slate-200 hover:text-white backdrop-blur-md border border-white/20 transition cursor-pointer shadow-md"
                    title="Reset position and zoom to center"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    {t('reset')}
                  </button>
                </div>
              )}

              {/* Bottom Info: Position coordinates */}
              <span className="absolute bottom-2 left-2.5 text-[10px] text-white/80 font-medium z-10 pointer-events-none">
                {t('position')}: {posX}% X &bull; {posY}% Y
              </span>
            </div>

            {/* Mode: Preset Thumbnails */}
            {bannerInputMode === 'presets' && (
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { name: 'Kyoto Pagoda', url: '/profile/hero-banner.jpg' },
                  { name: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80' },
                  { name: 'Fuji Autumn', url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop&q=80' },
                  { name: 'Shibuya Night', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80' },
                  { name: 'Seoul Lights', url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop&q=80' },
                  { name: 'Torii Sunset', url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&auto=format&fit=crop&q=80' },
                  { name: 'Bamboo Forest', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80' },
                  { name: 'Cherry Blossom', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80' },
                ].map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setDraftBanner(preset.url)}
                    className={`relative h-12 rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                      draftBanner === preset.url
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-[0.98]'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                    title={preset.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white truncate px-1 py-0.5 text-center">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Mode: Image URL Input */}
            {bannerInputMode === 'url' && (
              <div className="space-y-1.5 pt-1">
                <input
                  type="url"
                  value={draftBanner}
                  onChange={(e) => setDraftBanner(e.target.value)}
                  placeholder={t('pasteImageUrl')}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[10px] text-slate-400">
                  {t('enterWebImageUrl')}
                </p>
              </div>
            )}

            {/* Mode: Local File Upload */}
            {bannerInputMode === 'upload' && (
              <div className="pt-1">
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-white/20 hover:border-cyan-400/60 rounded-2xl cursor-pointer bg-black/30 hover:bg-black/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <p className="text-xs text-slate-300 font-semibold">
                      {t('clickToUploadBg')}
                    </p>
                    <p className="text-[10px] text-slate-500">{t('pngJpgWebp')}</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (typeof event.target?.result === 'string') {
                            setDraftBanner(event.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              style={{ backgroundColor: currentAccent.primary }}
              className="px-5 py-2 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-90 cursor-pointer transition-transform hover:scale-105"
            >
              {t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};