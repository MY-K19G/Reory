import React from 'react';

export type AchievementCategory = 'all' | 'streaks' | 'learning' | 'mastery' | 'community';

export interface AchievementDetail {
  id: string;
  title: string;
  category: 'streaks' | 'learning' | 'mastery' | 'community';
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  description: string;
  requirement: string;
  currentProgress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  icon: React.ReactNode;
  themeColor: string;
  badgeBg: string;
  borderGlow: string;
}
