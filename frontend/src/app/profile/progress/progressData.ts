import { LanguageStat, WeeklyStudyItem } from './types';

export const DETAILED_LANGUAGES: LanguageStat[] = [
  {
    id: 'ja',
    name: 'Japanese',
    flagCode: 'jp',
    level: 'Intermediate (N3)',
    totalCards: 762,
    learnedCards: 521,
    retentionRate: 91.4,
    studyTimeHours: 32.4,
    activeStreakDays: 12,
    categories: [
      { name: 'Core Kanji & Radicals', progress: 84, cards: 180 },
      { name: 'Travel & Dining Vocabulary', progress: 76, cards: 145 },
      { name: 'Anime & Pop Culture Expressions', progress: 62, cards: 96 },
      { name: 'JLPT N3 Grammar Words', progress: 54, cards: 100 },
    ],
  },
  {
    id: 'en',
    name: 'English',
    flagCode: 'us',
    level: 'Advanced (C1)',
    totalCards: 498,
    learnedCards: 210,
    retentionRate: 94.8,
    studyTimeHours: 11.2,
    activeStreakDays: 8,
    categories: [
      { name: 'Business & Formal Idioms', progress: 58, cards: 120 },
      { name: 'Academic & Science Lexicon', progress: 45, cards: 150 },
      { name: 'Slang & Modern Expressions', progress: 32, cards: 90 },
    ],
  },
  {
    id: 'es',
    name: 'Spanish',
    flagCode: 'es',
    level: 'Elementary (A2)',
    totalCards: 310,
    learnedCards: 56,
    retentionRate: 86.2,
    studyTimeHours: 4.9,
    activeStreakDays: 3,
    categories: [
      { name: 'Essential Verbs & Tenses', progress: 28, cards: 95 },
      { name: 'Common Travel Phrases', progress: 22, cards: 85 },
      { name: 'Daily Conversation Basics', progress: 14, cards: 130 },
    ],
  },
];

export const WEEKLY_STUDY_DATA: WeeklyStudyItem[] = [
  { day: 'Mon', cards: 42, minutes: 28, accuracy: 92 },
  { day: 'Tue', cards: 58, minutes: 36, accuracy: 89 },
  { day: 'Wed', cards: 75, minutes: 48, accuracy: 94 },
  { day: 'Thu', cards: 32, minutes: 20, accuracy: 88 },
  { day: 'Fri', cards: 94, minutes: 58, accuracy: 96 },
  { day: 'Sat', cards: 88, minutes: 52, accuracy: 93 },
  { day: 'Sun', cards: 64, minutes: 40, accuracy: 91 },
];
