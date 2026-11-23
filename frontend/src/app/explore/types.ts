export interface WordChip {
  word: string;
  meaning: string;
  image?: string;
}

export interface CommunityCardCollection {
  id: string;
  backendDeckId?: number;
  author: {
    name: string;
    avatar: string;
    collectionsCount?: number;
    isVerified?: boolean;
  };
  timeAgo: string;
  coverImage: string;
  title: string;
  description: string;
  tags: string[];
  cards: WordChip[];
  totalCards: number;
  overflowImage?: string;
  views: number;
  saves: number;
  likes: number;
  forks: number;
  clones?: number;
  isSaved?: boolean;
  isLiked?: boolean;
  isForked?: boolean;
  icon?: string;
  createdAt?: string;
}

export interface TrendingItem {
  rank: number;
  title: string;
  saves: string;
  image: string;
}

export interface TopContributor {
  name: string;
  avatar: string;
  collections: number;
  isFollowing?: boolean;
}

export const INITIAL_COMMUNITY_COLLECTIONS: CommunityCardCollection[] = [];

export const TRENDING_COLLECTIONS: TrendingItem[] = [];

export const TOP_CONTRIBUTORS: TopContributor[] = [];

export const POPULAR_TAGS: string[] = [];
