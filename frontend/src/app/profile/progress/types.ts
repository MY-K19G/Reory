export interface LanguageStat {
  id: string;
  name: string;
  flagCode: string;
  level: string;
  totalCards: number;
  learnedCards: number;
  retentionRate: number;
  studyTimeHours: number;
  activeStreakDays: number;
  categories: {
    name: string;
    progress: number;
    cards: number;
  }[];
}

export interface WeeklyStudyItem {
  day: string;
  cards: number;
  minutes: number;
  accuracy: number;
}
