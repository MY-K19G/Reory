export interface Card {
  id: number;
  frontWord: string;
  phonetic?: string;
  partOfSpeech?: string;
  backTranslation: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  hint?: string;
  imageUrl?: string;
  tags?: string;
  metadata?: string;
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: string;
  lastReviewedAt?: string;
  status: 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  userIdentifier?: string;
  createdAt?: string;
}

export interface Deck {
  id: number;
  title: string;
  slug?: string;
  description: string;
  language: string;
  languageCode: string;
  level: string;
  color: string;
  icon: string;
  tags?: string;
  coverImage?: string;
  isPublic: boolean;
  createdAt: string;
  cards?: Card[];
  author?: string;
  forkedFromDeckId?: number;
  forkedFromTitle?: string;
  forkedFromAuthor?: string;
  isCloned?: boolean;
  clonedFromDeckId?: number;
  clonedFromTitle?: string;
  clonedFromAuthor?: string;
  forkCount?: number;
  totalReviews?: number;
  updatedAt?: string;
}

export interface Stats {
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  totalReviews: number;
  reviewsToday: number;
  streakDays: number;
  retentionRate: number;
  reviewActivity?: Array<{ date: string; count: number }>;
}

export interface WordQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExampleSentenceItem {
  sentence: string;
  translation?: string;
  pronunciation?: string;
}

export interface WeightedWordItem {
  word: string;
  strength: 'strong' | 'moderate' | 'weak'; // 'strong' = exact/direct match, 'moderate' = related/contextual, 'weak' = loose/distant
}

export interface WordDetails {
  word: string;
  meaning: string;
  simpleMeaning: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleSentences: (string | ExampleSentenceItem)[];
  synonyms: (string | WeightedWordItem)[];
  antonyms: (string | WeightedWordItem)[];
  wordForms: string[];
  etymology: string;
  commonPhrases: string[];
  aiExplanation: string;
  images: string[];
  pexelsPhotos?: Array<{
    id: number;
    url: string;
    photographer: string;
    photographerUrl?: string;
    src: string;
    alt: string;
  }>;
  translation: string;
  relatedWords: string[];
  quiz?: WordQuizQuestion;
  learningStats?: {
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    masteryScore?: number;
    frequencyRank?: string;
    suggestedInterval?: string;
  };
  understandRealMeaning?: string;
  understandMentalModel?: string;
}

export interface AiGeneratedCard {
  frontWord: string;
  phonetic: string;
  partOfSpeech: string;
  backTranslation: string;
  exampleSentence: string;
  exampleTranslation: string;
  exampleSentences?: (string | ExampleSentenceItem)[];
  hint: string;
  tags: string;
  imageUrl: string;
  explanation?: string;
  synonyms?: (string | WeightedWordItem)[];
  antonyms?: (string | WeightedWordItem)[];
  wordForms?: string[];
  etymology?: string;
  commonPhrases?: string[];
  relatedWords?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  frequencyRank?: string;
  standardMeaning?: string;
  simpleMeaning?: string;
  understandRealMeaning?: string;
  understandMentalModel?: string;
  quiz?: WordQuizQuestion;
}

