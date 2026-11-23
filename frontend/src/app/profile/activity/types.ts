import React from 'react';

export type ActivityType = 'all' | 'study' | 'deck' | 'achievement' | 'mastery';

export interface ActivityDetail {
  id: string;
  type: 'study' | 'deck' | 'achievement' | 'mastery';
  title: string;
  subtitle: string;
  deckTitle?: string;
  language: string;
  langCode: string;
  timestamp: string;
  formattedDate: string;
  timeAgo: string;
  durationMinutes?: number;
  cardsReviewed?: number;
  accuracyRate?: number;
  xpEarned: number;
  icon: React.ReactNode;
  iconBg: string;
  details?: string;
  badgeName?: string;
}
