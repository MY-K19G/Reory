export interface StudiedCardItem {
  id: string | number;
  word: string;
  reading?: string;
  translation: string;
  deckTitle: string;
  deckId: string | number;
  language: string;
  languageFlag: string;
  reviewedAt: string;
  status: 'again' | 'hard' | 'good' | 'easy';
  accuracyPercent: number;
  exampleSentence?: string;
}

export interface RecentDeckItem {
  id: string | number;
  title: string;
  targetLang: string;
  targetFlag: string;
  cardCount: number;
  lastStudied: string;
  coverImage: string;
  progressPercent: number;
}
