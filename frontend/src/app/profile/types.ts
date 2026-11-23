import React from 'react';

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  unlocked: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  icon: React.ReactNode;
  iconBg: string;
}

export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner?: string;
  bio?: string;
  joinedDate?: string;
  cardsLearned?: number;
  level?: string;
  streak: string;
  lang: string;
  country: string;
  isFollowing: boolean;
  status?: 'online' | 'studying' | 'offline';
  sharedDecks?: { title: string; count: number; cover: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}
