'use client';

import React, { useState } from 'react';

const NOTIONISTS_SEEDS = [
  'Mira', 'Luna', 'Sophia', 'Chloe', 'Zoe', 'Aria', 'Maya', 'Elena',
  'Lily', 'Emma', 'Bella', 'Ruby', 'Mia', 'Grace', 'Alice', 'Sarah',
  'Amelia', 'Hannah', 'Isabella', 'Olivia', 'Ava', 'Emily', 'Nora', 'Eva',
  'Stella', 'Penelope', 'Victoria', 'Sadie', 'Naomi', 'Claire', 'Anna', 'Kira',
  'Tara', 'Daisy', 'Hazel', 'Ivy', 'Willow', 'Harper', 'Sienna', 'Piper'
];

export const DICEBEAR_BG_COLORS = ['b6e3f4', 'c0aede', 'ffd5dc', 'd1d4f9', 'ffdfbf', 'c1f0d0', 'fbe2b5', 'e2d9f3'];

// All 40 curated Notionists characters available in profile preferences
export const PRESET_AVATARS: string[] = NOTIONISTS_SEEDS.map(
  (seed, idx) =>
    `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${DICEBEAR_BG_COLORS[idx % DICEBEAR_BG_COLORS.length]}`
);

export function getDiceBearAvatar(seed: string, bgColor?: string): string {
  const cleanSeed = encodeURIComponent((seed || 'Learner').trim());
  const bg = bgColor || 'b6e3f4';
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${cleanSeed}&backgroundColor=${bg}`;
}

// Checks if an avatar URL is a legacy fake dummy photo that should not be used
export function isFakeAvatar(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed === '/profile/avatar.jpg') return true;
  // Filter out any legacy unsplash human face photos
  if (trimmed.includes('photo-1535713875002')) return true;
  if (trimmed.includes('photo-1580489944761')) return true;
  if (trimmed.includes('photo-1570295999919')) return true;
  if (trimmed.includes('photo-1534528741775')) return true;
  if (trimmed.includes('photo-1507003211169')) return true;
  if (trimmed.includes('photo-1494790108377')) return true;
  if (trimmed.includes('unsplash.com')) return true;
  return false;
}

interface UserAvatarProps {
  avatar?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  shape?: 'circle' | 'rounded';
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm font-bold',
  xl: 'w-13 h-13 text-base font-extrabold',
  '2xl': 'w-16 h-16 text-xl font-black',
};

// Distinct pastel-vibrant gradient palettes based on initial character (fallback)
const GRADIENT_PALETTES = [
  'from-orange-500 to-amber-500',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-indigo-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-emerald-600',
  'from-blue-500 to-cyan-600',
];

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name,
  size = 'md',
  className = '',
  shape = 'circle',
}) => {
  const [imgError, setImgError] = useState(false);

  const cleanName = (name || 'User').trim();
  const initial = cleanName.charAt(0).toUpperCase() || 'U';

  const charCode = cleanName.charCodeAt(0) || 0;
  const gradient = GRADIENT_PALETTES[charCode % GRADIENT_PALETTES.length];
  const defaultBg = DICEBEAR_BG_COLORS[charCode % DICEBEAR_BG_COLORS.length];

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  // Determine avatar image source: user's custom avatar or DiceBear Notionists avatar for their name
  const effectiveAvatar = (!isFakeAvatar(avatar) && avatar) ? avatar : getDiceBearAvatar(cleanName, defaultBg);

  if (!imgError && effectiveAvatar) {
    return (
      <img
        src={effectiveAvatar}
        alt={cleanName}
        onError={() => setImgError(true)}
        className={`${sizeClass} ${shapeClass} object-cover shrink-0 ${className}`}
      />
    );
  }

  // Graceful offline/network error fallback to initials monogram
  return (
    <div
      className={`${sizeClass} ${shapeClass} bg-gradient-to-tr ${gradient} text-white font-extrabold flex items-center justify-center shrink-0 select-none shadow-xs tracking-wide ${className}`}
      title={cleanName}
    >
      {initial}
    </div>
  );
};
