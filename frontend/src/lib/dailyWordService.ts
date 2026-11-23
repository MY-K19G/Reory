import { WordDetails } from './types';

export interface DailyWordRecord {
  date: string; // YYYY-MM-DD
  word: string;
  targetLanguage: string;
  nativeLanguage: string;
  data: WordDetails;
  timestamp: number;
}

const STORAGE_KEY = 'duocard_word_of_the_day';
const CACHE_WORDS_KEY = 'duocard_cached_words_dict';

// Language-specific curated daily words (the language the user wants to learn)
export const LANGUAGE_DAILY_WORD_POOLS: Record<string, string[]> = {
  English: [
    'serenity', 'resilience', 'ephemeral', 'solitude', 'wanderlust',
    'luminescence', 'authenticity', 'compassion', 'eloquence', 'harmony',
    'nostalgia', 'persistence', 'tranquility', 'gratitude', 'zenith',
    'clarity', 'euphoria', 'courage', 'mindfulness', 'serendipity'
  ],
  Hebrew: [
    'שלום',      // Shalom (Peace/Hello)
    'תקווה',     // Tikva (Hope)
    'שמחה',      // Simcha (Joy)
    'אהבה',      // Ahava (Love)
    'סבלנות',    // Savlanut (Patience)
    'אומץ',      // Ometz (Courage)
    'חכמה',      // Chochma (Wisdom)
    'שלווה',     // Shalva (Serenity)
    'ידידות',    // Yedidut (Friendship)
    'אור',       // Or (Light)
    'חירות',     // Cheirut (Freedom)
    'ברכה',      // Bracha (Blessing)
    'הודיה',     // Hodayah (Gratitude)
    'השראה',     // Hashra'ah (Inspiration)
  ],
  French: [
    'sérénité', 'résilience', 'éphémère', 'solitude', 'harmonie',
    'courage', 'nostalgie', 'bienveillance', 'lueur', 'espérance',
    'clarté', 'gratitude', 'audace', 'douceur', 'tranquillité'
  ],
  Japanese: [
    '平穏',      // Heion (Serenity/Peace)
    '希望',      // Kibou (Hope)
    '勇気',      // Yuuki (Courage)
    '優しさ',    // Yasashisa (Kindness)
    '木漏れ日',  // Komorebi (Sunlight through trees)
    '一期一会',  // Ichigo Ichie (Treasure every encounter)
    '感謝',      // Kansha (Gratitude)
    '情熱',      // Jounetsu (Passion)
    '忍耐',      // Nintai (Patience)
    '調和',      // Chouwa (Harmony)
  ],
  Spanish: [
    'serenidad', 'resiliencia', 'esperanza', 'valentía', 'gratitud',
    'armonía', 'claridad', 'nostalgia', 'paciencia', 'bondad'
  ],
  German: [
    'Gelassenheit', 'Wanderlust', 'Zuversicht', 'Geborgenheit', 'Fernweh',
    'Einklang', 'Mut', 'Hoffnung', 'Dankbarkeit', 'Klarheit'
  ],
  Italian: [
    'serenità', 'resilienza', 'speranza', 'coraggio', 'gratitudine',
    'armonia', 'meraviglia', 'tranquillità', 'passione', 'dolcezza'
  ],
  Korean: [
    '평온',      // Pyeong-on (Serenity)
    '희망',      // Huimang (Hope)
    '용기',      // Yong-gi (Courage)
    '행복',      // Haengbok (Happiness)
    '감사',      // Gamsa (Gratitude)
    '인내',      // Innae (Patience)
  ],
  Russian: [
    'спокойствие', 'надежда', 'мужество', 'доброта', 'гармония',
    'вдохновение', 'ясность', 'благодарность', 'радость'
  ],
  Hindi: [
    'शांति',     // Shaanti (Peace/Serenity)
    'साहस',     // Saahas (Courage)
    'आशा',      // Aasha (Hope)
    'सहानुभूति', // Sahanubhuti (Empathy)
    'धैर्य',     // Dhairya (Patience)
    'आनंद',     // Anand (Joy)
  ],
};

export const DAILY_WORD_POOL = LANGUAGE_DAILY_WORD_POOLS.English;

/**
 * Returns today's date in YYYY-MM-DD local format
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Pick today's curated fallback word based on target collection language and day-of-year
 */
export function getTodaysCuratedWord(
  targetLanguage: string = 'English',
  dateStr: string = getTodayDateString()
): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((dateObj.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  // Find pool matching target language
  const matchedKey = Object.keys(LANGUAGE_DAILY_WORD_POOLS).find(
    (k) => k.toLowerCase() === targetLanguage.trim().toLowerCase()
  );
  const pool = matchedKey ? LANGUAGE_DAILY_WORD_POOLS[matchedKey] : LANGUAGE_DAILY_WORD_POOLS.English;
  const index = Math.abs(dayOfYear) % pool.length;
  return pool[index];
}

/**
 * Suggest a dynamic, thoughtful Word of the Day using Gemini AI.
 * Prompt asks for a rich, beautiful, authentic vocabulary word in the target language.
 */
export async function suggestDailyWordWithAi(
  targetLanguage: string = 'English',
  _nativeLanguage: string = 'English',
  apiKey?: string
): Promise<string | null> {
  const effectiveKey =
    apiKey?.trim() ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('duocard_gemini_key') || ''
      : '');

  if (!effectiveKey) return null;

  const todayStr = getTodayDateString();
  const prompt = `Act as an expert linguist and lexicographer.
Suggest ONE inspiring, culturally rich, or beautiful "Word of the Day" in ${targetLanguage} suitable for language learners.
Today's reference date is ${todayStr}.
Requirements:
1. Provide ONLY the target word itself, with no extra punctuation, markdown, numbers, or quotes.
2. The word MUST be in ${targetLanguage}.
3. Example output: "serendipity" or "resilience" (if English) or "平穏" (if Japanese) or "שלום" (if Hebrew).
Word:`;

  const userModel = typeof window !== 'undefined'
    ? localStorage.getItem('duocard_gemini_model') || 'gemini-3.5-flash-lite'
    : 'gemini-3.5-flash-lite';

  const models = Array.from(new Set([
    userModel,
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.6-flash',
  ]));

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleaned = text.replace(/[*_"`'’]/g, '').trim().split('\n')[0].trim();
          if (cleaned.length >= 2 && cleaned.length <= 40) {
            return cleaned;
          }
        }
      }
    } catch {
      // Continue to next model if failed
    }
  }

  return null;
}

/**
 * Get saved today's word from localStorage if already fetched for today
 */
export function getSavedTodayWord(
  targetLanguage: string = 'English',
  nativeLanguage: string = 'English'
): WordDetails | null {
  if (typeof window === 'undefined') return null;
  try {
    const today = getTodayDateString();
    const pairKey = `${STORAGE_KEY}_${targetLanguage.toLowerCase()}_${nativeLanguage.toLowerCase()}`;
    const pairRaw = localStorage.getItem(pairKey);
    if (pairRaw) {
      const pairRecord: DailyWordRecord = JSON.parse(pairRaw);
      if (
        pairRecord &&
        pairRecord.date === today &&
        pairRecord.data &&
        pairRecord.targetLanguage.toLowerCase() === targetLanguage.toLowerCase() &&
        pairRecord.nativeLanguage.toLowerCase() === nativeLanguage.toLowerCase()
      ) {
        return pairRecord.data;
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const record: DailyWordRecord = JSON.parse(raw);

    // Check if it matches today's date, target language, AND native language
    if (
      record &&
      record.date === today &&
      record.data &&
      record.targetLanguage.toLowerCase() === targetLanguage.toLowerCase() &&
      record.nativeLanguage.toLowerCase() === nativeLanguage.toLowerCase()
    ) {
      return record.data;
    }
  } catch (err) {
    console.warn('Failed to parse saved today word:', err);
  }
  return null;
}

/**
 * Save today's fetched word into localStorage so it never fetches again today
 */
export function saveTodayWord(
  word: string,
  targetLanguage: string,
  nativeLanguage: string,
  data: WordDetails
): void {
  if (typeof window === 'undefined') return;
  try {
    const record: DailyWordRecord = {
      date: getTodayDateString(),
      word: word.toLowerCase(),
      targetLanguage,
      nativeLanguage,
      data,
      timestamp: Date.now(),
    };
    const pairKey = `${STORAGE_KEY}_${targetLanguage.toLowerCase()}_${nativeLanguage.toLowerCase()}`;
    localStorage.setItem(pairKey, JSON.stringify(record));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    saveWordToCache(word, targetLanguage, nativeLanguage, data);
  } catch (err) {
    console.warn('Failed to save today word to localStorage:', err);
  }
}

/**
 * Generic word cache for any fetched words:
 * Saves AI responses so looking up words or switching back doesn't re-trigger Gemini/API
 */
export function getWordFromCache(
  word: string,
  targetLanguage: string,
  nativeLanguage: string
): WordDetails | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_WORDS_KEY);
    if (!raw) return null;
    const cache: Record<string, WordDetails> = JSON.parse(raw);
    const key = `${word.trim().toLowerCase()}_${targetLanguage.toLowerCase()}_${nativeLanguage.toLowerCase()}`;
    return cache[key] || null;
  } catch {
    return null;
  }
}

export function saveWordToCache(
  word: string,
  targetLanguage: string,
  nativeLanguage: string,
  data: WordDetails
): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CACHE_WORDS_KEY);
    const cache: Record<string, WordDetails> = raw ? JSON.parse(raw) : {};
    const key = `${word.trim().toLowerCase()}_${targetLanguage.toLowerCase()}_${nativeLanguage.toLowerCase()}`;
    cache[key] = data;

    // Prune cache if it gets too large (> 60 words)
    const keys = Object.keys(cache);
    if (keys.length > 60) {
      delete cache[keys[0]];
    }
    localStorage.setItem(CACHE_WORDS_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to save word to cache:', err);
  }
}
