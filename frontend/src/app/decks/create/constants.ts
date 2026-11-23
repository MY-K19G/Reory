import { BookOpen, Plane, Briefcase, GraduationCap, Utensils, Plus } from 'lucide-react';
import emojilib from 'emojilib';
import { ALL_GEMINI_LANGUAGES } from '@/lib/languages';

export const CATEGORIES = [
  { id: 'General', label: 'General', icon: BookOpen },
  { id: 'Travel', label: 'Travel', icon: Plane },
  { id: 'Business', label: 'Business', icon: Briefcase },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
  { id: 'Food', label: 'Food', icon: Utensils },
  { id: 'Custom', label: 'Custom', icon: Plus },
];

export const ALL_SYSTEM_EMOJIS: string[] = Object.keys(emojilib);

export function formatKeywordToName(keyword: string): string {
  return keyword
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getEmojiName(emoji: string): string {
  const langMatch = ALL_GEMINI_LANGUAGES.find((l) => l.defaultIcon === emoji);
  if (langMatch) return `${langMatch.name} Flag`;

  const keywords = emojilib[emoji];
  if (keywords && keywords.length > 0) {
    return formatKeywordToName(keywords[0]);
  }
  return 'Emoji';
}

export const CURATED_COVER_PRESETS = [
  { id: 'japan-pagoda', title: 'Japan Pagoda', url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&auto=format&fit=crop&q=80', lang: 'Japanese', category: 'Travel' },
  { id: 'fuji-cherry', title: 'Mount Fuji', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80', lang: 'Japanese', category: 'General' },
  { id: 'tokyo-shibuya', title: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80', lang: 'Japanese', category: 'Business' },
  { id: 'korea-seoul', title: 'Seoul Palace', url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&auto=format&fit=crop&q=80', lang: 'Korean', category: 'Travel' },
  { id: 'paris-eiffel', title: 'Paris Romance', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80', lang: 'French', category: 'Travel' },
  { id: 'italy-coast', title: 'Amalfi Coast', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80', lang: 'Italian', category: 'Travel' },
  { id: 'spain-madrid', title: 'Spain Sunset', url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&auto=format&fit=crop&q=80', lang: 'Spanish', category: 'General' },
  { id: 'germany-berlin', title: 'Germany Castle', url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&auto=format&fit=crop&q=80', lang: 'German', category: 'Travel' },
  { id: 'china-wall', title: 'Great Wall', url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&auto=format&fit=crop&q=80', lang: 'Chinese', category: 'Travel' },
  { id: 'london-bigben', title: 'London Town', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80', lang: 'English', category: 'General' },
  { id: 'india-taj', title: 'Taj Mahal', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80', lang: 'Hindi', category: 'Travel' },
  { id: 'arabic-dubai', title: 'Desert Oasis', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80', lang: 'Arabic', category: 'Travel' },
  { id: 'study-books', title: 'Library Study', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80', lang: 'General', category: 'Academic' },
  { id: 'food-culinary', title: 'Culinary Cooking', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80', lang: 'General', category: 'Food' },
  { id: 'business-work', title: 'Modern Workspace', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80', lang: 'General', category: 'Business' },
];

export const EMOJI_SETS: Record<string, string[]> = {
  study: [
    '📚', '📖', '📕', '📗', '📘', '📙', '📓', '📒', '📃', '📜',
    '📄', '📰', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '💡',
    '🎓', '🎯', '🧠', '⭐', '🔥', '⚡', '🚀', '🏆', '🥇', '🥈',
    '🥉', '🎖️', '🏅', '🎗️', '🔍', '🔎', '🔖', '🏷️', '📌', '📍',
    '📎', '📏', '📐', '✂️', '💬', '💭', '🗣️', '🎧', '🎙️', '🔔',
    '📅', '📆', '🗓️', '🗂️', '📂', '📁', '🗃️', '⏰', '⏱️', '⏳',
  ],
  flags: [
    '🇯🇵', '🇺🇸', '🇬🇧', '🇪🇸', '🇫🇷', '🇩🇪', '🇮🇹', '🇨🇳', '🇰🇷', '🇧🇷',
    '🇷🇺', '🇮🇳', '🇦🇺', '🇨🇦', '🇲🇽', '🇵🇹', '🇳🇱', '🇸🇪', '🇳🇴', '🇩🇰',
    '🇫🇮', '🇵🇱', '🇬🇷', '🇹🇷', '🇸🇦', '🇦🇪', '🇪🇬', '🇿🇦', '🇮🇩', '🇻🇳',
    '🇹🇭', '🇵🇭', '🇲🇾', '🇸🇬', '🇳🇿', '🇮🇪', '🇨🇭', '🇦🇹', '🇺🇦', '🇮🇱',
    '🇦🇷', '🇨🇱', '🇨🇴', '🇵🇪', '🇵🇰', '🇧🇩', '🇳🇬', '🇰🇪', '🇲🇦', '🇮🇷',
    '🇨🇿', '🇭🇺', '🇷🇴', '🇧🇬', '🇭🇷', '🇷🇸', '🇸🇰', '🇸🇮', '🇪🇪', '🇱🇻',
  ],
  food: [
    '☕', '🍵', '🧋', '🥛', '🍼', '🍶', '🍺', '🍻', '🍷', '🥂',
    '🍸', '🍹', '🧉', '🍾', '🍕', '🍔', '🍟', '🌭', '🥪', '🌮',
    '🌯', '🥙', '🧆', '🍳', '🥘', '🍲', '🍜', '🍝', '🍣', '🍱',
    '🍛', '🍙', '🍚', '🍘', '🍥', '🍡', '🍢', '🥟', '🍤', '🥐',
    '🥯', '🍞', '🥖', '🥨', '🧀', '🥗', '🍿', '🧈', '🥫', '🍧',
    '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫',
    '🍩', '🍪', '🍯', '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇',
    '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🥑',
  ],
  travel: [
    '✈️', '🛫', '🛬', '🚀', '🛸', '🚂', '🚆', '🚄', '🚅', '🚇',
    '🚊', '🚝', '🚞', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓',
    '🚕', '🚗', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲',
    '🛴', '🛹', '⛵', '🚤', '🚢', '🛳️', '⛴️', '🛥️', '⚓', '⛽',
    '🏖️', '🏝️', '🏕️', '⛺', '🏔️', '⛰️', '🗻', '🌋', '🏛️', '🗼',
    '🗽', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '🗺️', '🧭', '🌍',
    '🌎', '🌏', '🌅', '🌄', '🌠', '🌌', '🏙️', '🌃', '🌉', '🌇',
  ],
  nature: [
    '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '💐', '🍀', '🌿', '🌱',
    '🌴', '🌳', '🌲', '🍃', '🍂', '🍁', '🍄', '🌾', '🌊', '☀️',
    '⛅', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '☃️', '🌬️', '🌪️',
    '🌈', '⭐', '🌟', '✨', '🪐', '🌙', '🌛', '🌕', '🔥', '💧',
    '🐾', '🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐵',
    '🦉', '🦅', '🦆', '🦜', '🦚', '🦋', '🐝', '🐞', '🐢', '🐬',
    '🐳', '🐋', '🦈', '🐙', '🦀', '🦞', '🦐', '🐠', '🐟', '🦕',
  ],
  fun: [
    '🎮', '🕹️', '🎲', '🧩', '🃏', '♟️', '🎨', '🎬', '🎭', '🎪',
    '🎤', '🎧', '🎼', '🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🥁',
    '🎷', '🪗', '🪘', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐',
    '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🥊', '🥋', '⛳', '🏹',
    '🎣', '🤿', '⛷️', '🏂', '🏋️', '🤸', '🧗', '🚵', '🏇', '🏆',
    '❤️', '💖', '💝', '🎉', '🎊', '🎈', '🪄', '💎', '👑', '🔑',
  ],
  tech: [
    '💻', '🖥️', '🖨️', '⌨️', '🖱️', '📱', '📲', '☎️', '📞', '📟',
    '📠', '🔋', '🔌', '📡', '💾', '💿', '📀', '🎥', '📷', '📸',
    '📹', '📼', '📻', '📺', '📽️', '🕹️', '🧭', '⏱️', '⏲️', '📡',
    '💡', '🔦', '🏮', '🪔', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩',
    '⚙️', '🗜️', '🔬', '🔭', '🧪', '🧫', '🧬', '💉', '🩹', '🩺',
  ],
  objects: [
    '📦', '📫', '📪', '📬', '📭', '📮', '📯', '📜', '🏷️', '✉️',
    '📩', '📨', '💌', '🎁', '🎈', '🛍️', '🛒', '👓', '🕶️', '🥽',
    '🌂', '☂️', '💼', '👜', '👛', '🎒', '🧳', '🧵', '🧶', '🧷',
    '🧹', '🧺', '🧻', '🧼', '🧽', '🪣', '🔑', '🗝️', '🚪', '🪑',
  ],
  symbols: [
    '💡', '⚡', '✨', '🔥', '💥', '💢', '💫', '💬', '💭', '🗯️',
    '💤', '💯', '💢', '♨️', '🛑', '⛔', '🚫', '⚠️', '🚸', '🔰',
    '♻️', '❇️', '✳️', '✅', '✔️', '☑️', '❌', '❎', '❓', '❔',
    '❗', '❕', '➕', '➖', '➗', '✖️', '💲', '💱', '©️', '®️',
    '™️', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤',
  ],
};
