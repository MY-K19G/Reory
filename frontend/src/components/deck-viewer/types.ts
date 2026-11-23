export interface Flashcard {
  id: number;
  word: string;
  reading: string;
  translation: string;
  tags: string[];
  exampleOriginal: string;
  exampleReading: string;
  exampleTranslation: string;
  audioDuration: string;
  imageUrl?: string;
  hint?: string;
  partOfSpeech?: string;
  metadata?: string;
  status?: 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';
  repetitions?: number;
  easeFactor?: number;
  intervalDays?: number;
}

export interface DeckCollectionPreset {
  id: string;
  title: string;
  languagePair: string;
  sourceLang: string;
  targetLang: string;
  author: {
    name: string;
    avatar: string;
  };
  createdOn: string;
  lastUpdated: string;
  totalCards: number;
  description: string;
  tags: string[];
  bannerImage: string;
  thumbnailImage: string;
  progress: {
    percent: number;
    cardsLearned: number;
    newCount: number;
    reviewCount: number;
    masteredCount: number;
  };
  cards: Flashcard[];
}