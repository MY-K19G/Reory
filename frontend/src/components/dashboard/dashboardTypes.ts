import { Deck, Stats } from '@/lib/types';
import { AccentOption } from '@/lib/theme';

export type { Deck, Stats };
export type AccentTheme = AccentOption;

export interface VocabCardItem {
  id: string;
  deckId: number;
  frontWord: string;
  phonetic: string;
  backTranslation: string;
  partOfSpeech: string;
  category: string;
  sourceLang: string;
  sourceFlag: string;
  targetLang: string;
  targetFlag: string;
  image: string;
  tagColor: string;
}

export const RECENT_STUDIED_WORDS: VocabCardItem[] = [];
