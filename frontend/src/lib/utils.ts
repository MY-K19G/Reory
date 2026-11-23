// src/lib/utils.ts
export const parseTags = (tags?: string | null): string[] => {
  if (!tags) return [];
  return tags.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
};

export const resolveCover = (deck: any, defaultCover: string): string => {
  let cover = deck.coverImage;
  if (!cover && deck.description) {
    const match = deck.description.match(/\[Cover:\s*([^\]]+)\]/i);
    if (match && match[1]) cover = match[1].trim();
  }
  return cover || defaultCover;
};

export const formatTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return 'Recently';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Recently';
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  } catch {
    return 'Recently';
  }
};

// History module utilities
export const DEFAULT_DECK_COVER =
  'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=500&auto=format&fit=crop&q=80';

export const resolveDeckCover = (deck: any, fallback = DEFAULT_DECK_COVER): string => {
  return resolveCover(deck, fallback);
};

import { getCountryCodeForLanguage } from '@/lib/deckLanguages';
export const countryFlagForLang = (lang: string): string =>
  getCountryCodeForLanguage(lang ?? 'English');
