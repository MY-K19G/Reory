export interface BookmarkedCardItem {
  id: string | number;
  word: string;
  reading?: string;
  translation: string;
  deckTitle: string;
  deckId: string | number;
  language: string;
  languageFlag: string;
  isBookmarked: boolean;
  bookmarkedAt: string;
  tags?: string[];
  exampleSentence?: string;
}

export interface BookmarkedDeckItem {
  id: string | number;
  title: string;
  targetLang: string;
  targetFlag: string;
  cardCount: number;
  lastStudied: string;
  coverImage: string;
  isFavorite: boolean;
}
