// Curated Bootstrap Icons collection categorized with tags for searching
export interface BootstrapIconItem {
  name: string;      // bi-star, bi-book, etc.
  label: string;     // Star, Book, etc.
  category: string;  // General, Education, Nature, Media, etc.
  tags: string[];    // keywords for search
}

export const BOOTSTRAP_ICONS_COLLECTION: BootstrapIconItem[] = [
  // General & Basics
  { name: 'bi-tag', label: 'Tag', category: 'General', tags: ['label', 'price', 'mark', 'badge'] },
  { name: 'bi-bookmark', label: 'Bookmark', category: 'General', tags: ['save', 'ribbon', 'favorite'] },
  { name: 'bi-star', label: 'Star', category: 'General', tags: ['rate', 'favorite', 'badge', 'top'] },
  { name: 'bi-heart', label: 'Heart', category: 'General', tags: ['love', 'like', 'health'] },
  { name: 'bi-fire', label: 'Fire', category: 'General', tags: ['flame', 'hot', 'streak', 'burn'] },
  { name: 'bi-lightning', label: 'Lightning', category: 'General', tags: ['bolt', 'zap', 'fast', 'power', 'speed'] },
  { name: 'bi-lightbulb', label: 'Lightbulb', category: 'General', tags: ['idea', 'tip', 'solution', 'bright'] },
  { name: 'bi-trophy', label: 'Trophy', category: 'General', tags: ['award', 'winner', 'cup', 'achievement'] },
  { name: 'bi-award', label: 'Award', category: 'General', tags: ['medal', 'prize', 'winner'] },
  { name: 'bi-gem', label: 'Gem', category: 'General', tags: ['diamond', 'jewel', 'premium', 'rare'] },
  { name: 'bi-pin', label: 'Pin', category: 'General', tags: ['tack', 'attach', 'location'] },
  { name: 'bi-flag', label: 'Flag', category: 'General', tags: ['country', 'mark', 'nation', 'goal'] },
  { name: 'bi-bell', label: 'Bell', category: 'General', tags: ['alarm', 'notice', 'notification'] },
  { name: 'bi-shield-check', label: 'Shield', category: 'General', tags: ['secure', 'protect', 'safety', 'verified'] },
  { name: 'bi-key', label: 'Key', category: 'General', tags: ['lock', 'access', 'secret', 'password'] },

  // Education & Learning
  { name: 'bi-book', label: 'Book', category: 'Learning', tags: ['read', 'study', 'pages', 'novel'] },
  { name: 'bi-journal-text', label: 'Journal', category: 'Learning', tags: ['notes', 'diary', 'notebook', 'write'] },
  { name: 'bi-mortarboard', label: 'Graduation', category: 'Learning', tags: ['cap', 'school', 'university', 'degree', 'academic'] },
  { name: 'bi-translate', label: 'Translate', category: 'Learning', tags: ['language', 'words', 'speak', 'vocab'] },
  { name: 'bi-chat-dots', label: 'Chat', category: 'Learning', tags: ['conversation', 'dialogue', 'speech', 'message'] },
  { name: 'bi-pencil', label: 'Pencil', category: 'Learning', tags: ['write', 'draw', 'edit', 'draft'] },
  { name: 'bi-card-text', label: 'Flashcard', category: 'Learning', tags: ['card', 'deck', 'study', 'memorize'] },
  { name: 'bi-backpack', label: 'Backpack', category: 'Learning', tags: ['school', 'bag', 'travel', 'study'] },
  { name: 'bi-patch-question', label: 'Quiz', category: 'Learning', tags: ['question', 'exam', 'test', 'help'] },
  { name: 'bi-spellcheck', label: 'Spelling', category: 'Learning', tags: ['grammar', 'words', 'check', 'correct'] },

  // Travel, Geography & Transportation
  { name: 'bi-globe-americas', label: 'Globe', category: 'Travel', tags: ['earth', 'world', 'planet', 'map'] },
  { name: 'bi-compass', label: 'Compass', category: 'Travel', tags: ['direction', 'navigate', 'explore'] },
  { name: 'bi-airplane', label: 'Airplane', category: 'Travel', tags: ['flight', 'fly', 'plane', 'airport', 'vacation'] },
  { name: 'bi-train-front', label: 'Train', category: 'Travel', tags: ['rail', 'commute', 'metro', 'subway'] },
  { name: 'bi-car-front', label: 'Car', category: 'Travel', tags: ['drive', 'auto', 'vehicle', 'road'] },
  { name: 'bi-bicycle', label: 'Bicycle', category: 'Travel', tags: ['bike', 'cycle', 'ride', 'sport'] },
  { name: 'bi-luggage', label: 'Luggage', category: 'Travel', tags: ['suitcase', 'bag', 'trip', 'hotel'] },
  { name: 'bi-map', label: 'Map', category: 'Travel', tags: ['route', 'location', 'guide'] },
  { name: 'bi-geo-alt', label: 'Location', category: 'Travel', tags: ['pin', 'place', 'gps', 'spot'] },
  { name: 'bi-building', label: 'Building', category: 'Travel', tags: ['city', 'tower', 'architecture', 'urban'] },

  // Business, Work & Tech
  { name: 'bi-briefcase', label: 'Briefcase', category: 'Business', tags: ['work', 'job', 'office', 'career'] },
  { name: 'bi-laptop', label: 'Laptop', category: 'Business', tags: ['computer', 'tech', 'pc', 'work'] },
  { name: 'bi-code-slash', label: 'Coding', category: 'Business', tags: ['dev', 'program', 'software', 'tech'] },
  { name: 'bi-graph-up-arrow', label: 'Analytics', category: 'Business', tags: ['chart', 'growth', 'finance', 'stats'] },
  { name: 'bi-cash-coin', label: 'Money', category: 'Business', tags: ['finance', 'cash', 'coin', 'currency', 'dollar'] },
  { name: 'bi-credit-card', label: 'Payment', category: 'Business', tags: ['card', 'buy', 'bank'] },
  { name: 'bi-cpu', label: 'AI / CPU', category: 'Business', tags: ['chip', 'processor', 'tech', 'hardware'] },
  { name: 'bi-send', label: 'Send', category: 'Business', tags: ['paperplane', 'message', 'share'] },

  // Food, Drinks & Lifestyle
  { name: 'bi-cup-hot', label: 'Coffee', category: 'Lifestyle', tags: ['tea', 'cafe', 'drink', 'morning', 'mug'] },
  { name: 'bi-egg-fried', label: 'Food', category: 'Lifestyle', tags: ['cooking', 'meal', 'breakfast', 'dish'] },
  { name: 'bi-cup-straw', label: 'Drink', category: 'Lifestyle', tags: ['juice', 'soda', 'beverage', 'bar'] },
  { name: 'bi-cake2', label: 'Cake', category: 'Lifestyle', tags: ['birthday', 'sweet', 'dessert', 'celebrate'] },
  { name: 'bi-cart', label: 'Shopping', category: 'Lifestyle', tags: ['store', 'market', 'buy', 'groceries'] },

  // Arts, Entertainment & Media
  { name: 'bi-music-note-beamed', label: 'Music', category: 'Media', tags: ['song', 'melody', 'audio', 'sound'] },
  { name: 'bi-headphones', label: 'Audio', category: 'Media', tags: ['listen', 'podcast', 'sound', 'music'] },
  { name: 'bi-camera', label: 'Camera', category: 'Media', tags: ['photo', 'picture', 'shot'] },
  { name: 'bi-film', label: 'Film', category: 'Media', tags: ['movie', 'cinema', 'video', 'watch'] },
  { name: 'bi-controller', label: 'Gaming', category: 'Media', tags: ['game', 'play', 'console', 'joystick'] },
  { name: 'bi-palette', label: 'Art', category: 'Media', tags: ['paint', 'color', 'design', 'drawing'] },

  // Health, Nature & Sports
  { name: 'bi-activity', label: 'Pulse', category: 'Health', tags: ['health', 'fitness', 'heartbeat', 'medical'] },
  { name: 'bi-sun', label: 'Sun', category: 'Nature', tags: ['weather', 'day', 'warm', 'summer'] },
  { name: 'bi-moon-stars', label: 'Night', category: 'Nature', tags: ['moon', 'sleep', 'evening', 'dark'] },
  { name: 'bi-tree', label: 'Tree', category: 'Nature', tags: ['forest', 'plant', 'nature', 'wood'] },
  { name: 'bi-flower1', label: 'Flower', category: 'Nature', tags: ['spring', 'blossom', 'garden', 'flora'] },
  { name: 'bi-emoji-smile', label: 'Smile', category: 'Emotions', tags: ['happy', 'fun', 'face', 'cheerful'] },
  { name: 'bi-emoji-sunglasses', label: 'Cool', category: 'Emotions', tags: ['awesome', 'shades', 'sun'] },
];
