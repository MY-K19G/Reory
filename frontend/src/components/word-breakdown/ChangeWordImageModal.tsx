'use client';

import React, { useState } from 'react';
import { Search, Image as ImageIcon, X, Check, Loader2, Sparkles, ExternalLink, RotateCcw } from 'lucide-react';
import { fetchPexelsPhotos, PexelsPhoto } from '@/lib/pexelsService';

interface ChangeWordImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  currentImage: string;
  onSelectImage: (newImageUrl: string) => void;
  onResetImage?: () => void;
  hasCustomImage?: boolean;
}

export function ChangeWordImageModal({
  isOpen,
  onClose,
  word,
  currentImage,
  onSelectImage,
  onResetImage,
  hasCustomImage,
}: ChangeWordImageModalProps) {
  const [query, setQuery] = useState(word || '');
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await fetchPexelsPhotos(q, undefined, 12);
      setPhotos(results);
    } catch (err) {
      console.warn('Failed to search photos:', err);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#181818] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Change Contextual Image
              </h3>
              <p className="text-[11px] text-slate-400">
                Search high-resolution photos for &ldquo;{word}&rdquo;
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onResetImage && (
              <button
                type="button"
                onClick={() => {
                  onResetImage();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 dark:border-white/10"
                title="Reset to original default image"
              >
                <RotateCcw className="w-3.5 h-3.5 text-accent-primary" />
                <span>Reset to Default</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & URL Input Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search better image keywords (e.g. curiosity, thinking, explore)..."
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-accent-primary hover:opacity-90 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Search</span>
            </button>
            {onResetImage && (
              <button
                type="button"
                onClick={() => {
                  onResetImage();
                  onClose();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border border-slate-200/80 dark:border-white/10"
                title="Reset to default image"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Reset</span>
              </button>
            )}
          </form>

          {/* Quick Keyword Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Try:</span>
            {['curiosity', 'discovery', 'mind', 'learning'].map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  setQuery(kw);
                  fetchPexelsPhotos(kw, undefined, 12).then(setPhotos);
                  setHasSearched(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Search Results Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Available Photos
              </span>
              {photos.length > 0 && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  Powered by Pexels <ExternalLink className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-accent-primary" />
                <p className="text-xs">Finding contextual photos...</p>
              </div>
            ) : photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {photos.map((photo) => {
                  const srcUrl = photo.src.large || photo.src.medium || photo.src.original;
                  const isCurrent = currentImage === srcUrl;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => {
                        onSelectImage(srcUrl);
                        onClose();
                      }}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                        isCurrent
                          ? 'border-accent-primary ring-2 ring-accent-primary/20'
                          : 'border-transparent hover:border-accent-primary/50'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src.small || photo.src.medium}
                        alt={photo.alt || word}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-2 py-1 rounded-md bg-white/90 text-slate-900 text-[10px] font-bold shadow-xs">
                          Select
                        </span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                        <p className="text-[9px] text-white/90 truncate font-medium">
                          {photo.photographer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : hasSearched ? (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                No photos found for &ldquo;{query}&rdquo;. Try another search term or paste an image URL below.
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                Click &ldquo;Search&rdquo; or one of the tags above to browse contextual images.
              </div>
            )}
          </div>

          {/* Paste Custom Image URL */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Or Paste Any Image URL
            </span>
            <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <button
                type="submit"
                disabled={!customUrl.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 shrink-0"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
