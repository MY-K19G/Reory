import React, { useState, useEffect } from 'react';
import { X, Bookmark } from 'lucide-react';
import { fetchPexelsPhotoById } from '@/lib/pexelsService';

interface WordImageViewerModalProps {
  isOpen: boolean;
  imageSrc: string;
  word: string;
  caption?: string;
  photographer?: string;
  photographerUrl?: string;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
}

export function WordImageViewerModal({
  isOpen,
  imageSrc,
  word,
  caption,
  photographer,
  photographerUrl,
  isSaved,
  onClose,
  onToggleSave,
}: WordImageViewerModalProps) {
  const [liveCaption, setLiveCaption] = useState<string | undefined>(caption);
  const [livePhotographer, setLivePhotographer] = useState<string | undefined>(photographer);
  const [livePhotographerUrl, setLivePhotographerUrl] = useState<string | undefined>(photographerUrl);

  // Sync with incoming props
  useEffect(() => {
    setLiveCaption(caption);
    setLivePhotographer(photographer);
    setLivePhotographerUrl(photographerUrl);
  }, [caption, photographer, photographerUrl]);

  // If caption is missing or is just a fallback ("Deck Contributor" or word itself), fetch real details from Pexels by ID
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const isPlaceholder =
      !liveCaption ||
      liveCaption.toLowerCase() === word.toLowerCase() ||
      !livePhotographer ||
      livePhotographer === 'Deck Contributor';

    if (isPlaceholder && imageSrc.includes('pexels.com')) {
      const match = imageSrc.match(/\/photos\/(\d+)\//);
      if (match && match[1]) {
        fetchPexelsPhotoById(match[1])
          .then((photo) => {
            if (photo) {
              if (photo.alt) setLiveCaption(photo.alt);
              if (photo.photographer) setLivePhotographer(photo.photographer);
              if (photo.photographer_url) setLivePhotographerUrl(photo.photographer_url);
            }
          })
          .catch(() => {
            // ignore network error
          });
      }
    }
  }, [isOpen, imageSrc, liveCaption, livePhotographer, word]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Controls */}
        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-white px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold capitalize">{word}</span>
            <span className="text-xs text-white/60">Visual Reference</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSave}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors cursor-pointer"
              title={isSaved ? 'Saved to bookmarks' : 'Save word'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-amber-300' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors cursor-pointer"
              title="Close image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Image container */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/50 max-h-[76vh] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={liveCaption || word}
            className="w-full h-full max-h-[76vh] object-contain"
          />
        </div>

        {/* Single line caption / photo quote from Pexels */}
        {(liveCaption || livePhotographer) && (
          <div className="mt-3 px-5 py-2 rounded-full bg-[#111111]/90 backdrop-blur-md border border-white/10 text-center max-w-2xl flex items-center justify-center gap-2 text-xs text-white/80 shadow-lg animate-in fade-in">
            {liveCaption && (
              <span className="italic font-light">
                &ldquo;{liveCaption}&rdquo;
              </span>
            )}
            {livePhotographer && (
              <span className="text-[11px] text-white/50 shrink-0">
                photo by{' '}
                {livePhotographerUrl ? (
                  <a
                    href={livePhotographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white underline transition-colors"
                  >
                    {livePhotographer}
                  </a>
                ) : (
                  <span className="underline text-white/80">{livePhotographer}</span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
