export interface CuratedDeckItem {
  id: number | string;
  title: string;
  targetLang: string;
  targetFlag: string;
  nativeLang: string;
  nativeFlag: string;
  cardCount: number;
  timeAgo: string;
  updatedAt?: string;
  coverImage: string;
  isFavorite?: boolean;
  category?: 'my' | 'shared' | 'favorites';
  hasRealDeckId?: number;
  isMinimalHeader?: boolean;
  forkedFromTitle?: string;
  forkedFromAuthor?: string;
  forkedFromDeckId?: number;
  isCloned?: boolean;
  cloneOrigin?: string;
  clonedFromTitle?: string;
  clonedFromAuthor?: string;
  clonedFromDeckId?: number;
  isPublic?: boolean;
}

export const SCENIC_COVERS = [
  'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=500&auto=format&fit=crop&q=80',
];
