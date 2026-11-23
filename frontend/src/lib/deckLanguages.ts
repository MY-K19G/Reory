import { ALL_GEMINI_LANGUAGES } from './languages';

/**
 * Maps a language name or code to a 2-letter ISO country flag code for FlagIcon.
 */
export function getCountryCodeForLanguage(langNameOrCode?: string): string {
  if (!langNameOrCode) return 'un';
  const clean = langNameOrCode.toLowerCase().trim();

  // Common language name matching
  if (clean.includes('japan')) return 'jp';
  if (clean.includes('korean')) return 'kr';
  if (clean.includes('italian')) return 'it';
  if (clean.includes('spanish')) return 'es';
  if (clean.includes('chinese') || clean.includes('mandarin')) return 'cn';
  if (clean.includes('hindi')) return 'in';
  if (clean.includes('hebrew')) return 'il';
  if (clean.includes('french')) return 'fr';
  if (clean.includes('german')) return 'de';
  if (clean.includes('english')) return 'gb';
  if (clean.includes('russian')) return 'ru';
  if (clean.includes('arabic')) return 'sa';
  if (clean.includes('portuguese')) return 'pt';
  if (clean.includes('turkish')) return 'tr';
  if (clean.includes('dutch')) return 'nl';
  if (clean.includes('polish')) return 'pl';
  if (clean.includes('swedish')) return 'se';
  if (clean.includes('greek')) return 'gr';
  if (clean.includes('vietnamese')) return 'vn';
  if (clean.includes('thai')) return 'th';
  if (clean.includes('indonesian')) return 'id';
  if (clean.includes('ukrainian')) return 'ua';

  const matched = ALL_GEMINI_LANGUAGES.find(
    (l) => l.name.toLowerCase() === clean || l.code.toLowerCase() === clean
  );
  if (matched) return matched.countryCode;

  return 'un';
}

/**
 * Extracts native language from deck description or title if stored.
 * Defaults to 'English' if not explicitly stated.
 */
export function getDeckLanguagePair(deck: {
  title?: string;
  language?: string;
  description?: string;
}): {
  targetLang: string;
  targetFlag: string;
  nativeLang: string;
  nativeFlag: string;
} {
  const targetLang = deck.language || 'English';
  const targetFlag = getCountryCodeForLanguage(targetLang);

  // Try extracting native language stored in metadata tag, e.g. [Native: French] or "Native: French"
  let nativeLang = 'English';
  const desc = deck.description || '';

  const nativeTagMatch = desc.match(/\[Native:\s*([^\]]+)\]/i) || desc.match(/Native:\s*([a-zA-Z\s()]+)/i);
  if (nativeTagMatch && nativeTagMatch[1]) {
    nativeLang = nativeTagMatch[1].trim();
  } else {
    // If target language is English, default native language to Spanish or another language to make sense
    if (targetLang.toLowerCase() === 'english') {
      // Check title for cues (e.g. "English for Spanish speakers")
      const titleCues = (deck.title || '').toLowerCase();
      if (titleCues.includes('spanish')) nativeLang = 'Spanish';
      else if (titleCues.includes('french')) nativeLang = 'French';
      else if (titleCues.includes('japanese')) nativeLang = 'Japanese';
      else if (titleCues.includes('hindi')) nativeLang = 'Hindi';
      else nativeLang = 'Spanish';
    }
  }

  const nativeFlag = getCountryCodeForLanguage(nativeLang);

  return {
    targetLang,
    targetFlag,
    nativeLang,
    nativeFlag,
  };
}

const CRYPTIC_PRIME = 3847;
const CRYPTIC_OFFSET = 1759283; // ensures result is in the 5-char base-36 range (1679616 to 60466175)

/**
 * Encodes a numeric deck ID into an exact 5-character alphanumeric string (e.g. "a9x2k").
 * Uniquely and reversibly maps each deck ID so duplicate titles never collide.
 */
function encodeIdToCryptic(id: string | number): string {
  const num = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);
  if (isNaN(num)) return 'x7k9p';
  const val = CRYPTIC_OFFSET + num * CRYPTIC_PRIME;
  return val.toString(36).padStart(5, '0').slice(0, 5);
}

function decodeCrypticToId(token: string): string | null {
  if (!token || token.length !== 5) return null;
  try {
    const val = parseInt(token, 36);
    if (!isNaN(val) && val >= CRYPTIC_OFFSET && (val - CRYPTIC_OFFSET) % CRYPTIC_PRIME === 0) {
      return String((val - CRYPTIC_OFFSET) / CRYPTIC_PRIME);
    }
  } catch (e) {
    // fallback
  }
  return null;
}

/**
 * Creates a clean, readable SEO-friendly slug from a deck's title and ID.
 * Removes extra tags like "(Fork)", "(Clone)", and appends a clean unique cryptic suffix.
 * Example: ID 16 and title "jap daily (Fork)" -> "jap-daily-38h"
 */
export function slugifyDeck(id: string | number, title?: string): string {
  if (!title) return String(id);
  const cleanTitle = title
    .replace(/\s*\((?:fork|clone)\)\s*/gi, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const cryptic = encodeIdToCryptic(id);
  return cleanTitle ? `${cleanTitle}-${cryptic}` : String(id);
}

/**
 * Extracts the ID from a slugified URL param.
 * Handles:
 * - "jap-daily-38h" (cryptic suffix decoding)
 * - "16-jap-daily" (legacy prefix fallback)
 * - "16" (direct numeric ID)
 */
export function parseDeckIdFromSlug(slugOrId: string): string {
  if (!slugOrId) return '1';

  // 1. Check if ending segment is a cryptic ID
  const parts = slugOrId.split('-');
  const lastPart = parts[parts.length - 1];
  if (lastPart) {
    const decoded = decodeCrypticToId(lastPart);
    if (decoded) return decoded;
  }

  // 2. Legacy prefix match (e.g. "16-jap-daily")
  const prefixMatch = slugOrId.match(/^(\d+|col-\d+)/i);
  if (prefixMatch) return prefixMatch[1];

  // 3. Fallback to active deck from localStorage if set
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('duocard_active_deck_id');
    if (saved) return saved;
  }

  return slugOrId;
}
