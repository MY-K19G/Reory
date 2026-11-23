'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { Deck, Stats, VocabCardItem } from './dashboard/dashboardTypes';
import { DashboardHeroSection } from './dashboard/DashboardHeroSection';
import { RecentCardsSection } from './dashboard/RecentCardsSection';
import { CollectionsCarouselSection } from './dashboard/CollectionsCarouselSection';
import { DashboardSidebar } from './dashboard/DashboardSidebar';

export interface DashboardViewProps {
  decks?: Deck[];
  stats?: Stats | null;
  loading?: boolean;
}

export function DashboardView({
  decks: propDecks,
  stats: propStats,
  loading: propLoading,
}: DashboardViewProps) {
  const [decks, setDecks] = useState<Deck[]>(propDecks || []);
  const [stats, setStats] = useState<Stats | null>(propStats || null);
  const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : propDecks === undefined);
  const [selectedWordCategory, setSelectedWordCategory] = useState<string>('All');
  const collectionsRowRef = useRef<HTMLDivElement>(null);

  const { currentAccent } = useTheme();

  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const searchLang = searchParams?.get('lang') || '';

  useEffect(() => {
    if (propDecks) setDecks(propDecks);
    if (propStats !== undefined) setStats(propStats);
    if (propLoading !== undefined) setLoading(propLoading);
  }, [propDecks, propStats, propLoading]);

  useEffect(() => {
    if (propDecks !== undefined) return;
    async function loadData() {
      try {
        const [decksRes, statsRes] = await Promise.all([
          fetch('/api/decks'),
          fetch('/api/user/stats'),
        ]);

        if (decksRes.ok) {
          const decksData = await decksRes.json();
          setDecks(decksData);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [propDecks]);

  const filteredDecks = decks.filter((deck) => {
    const matchesQuery =
      deck.title.toLowerCase().includes(query.toLowerCase()) ||
      deck.description?.toLowerCase().includes(query.toLowerCase());
    const matchesLang = !searchLang || deck.language.toLowerCase() === searchLang.toLowerCase();
    return matchesQuery && matchesLang;
  });

  const scrollCollections = (direction: 'left' | 'right') => {
    if (collectionsRowRef.current) {
      const scrollAmount = 340;
      collectionsRowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getFlagCode = (lang?: string) => {
    if (!lang) return 'US';
    const l = lang.toLowerCase();
    if (l.includes('jap') || l === 'ja') return 'JP';
    if (l.includes('span') || l === 'es') return 'ES';
    if (l.includes('french') || l === 'fr') return 'FR';
    if (l.includes('ger') || l === 'de') return 'DE';
    if (l.includes('chin') || l === 'zh') return 'CN';
    if (l.includes('kor') || l === 'ko') return 'KR';
    if (l.includes('ita') || l === 'it') return 'IT';
    if (l.includes('rus') || l === 'ru') return 'RU';
    return 'US';
  };

  // Extract real flashcards from user's real decks (no fake data)
  const realFlashcards: VocabCardItem[] = [];
  decks.forEach((deck) => {
    const rawCards = deck.cards || [];
    rawCards.forEach((c) => {
      let cardImg = c.imageUrl;
      if (!cardImg && deck.coverImage) cardImg = deck.coverImage;
      if (!cardImg) {
        cardImg = 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=500&auto=format&fit=crop&q=80';
      }

      const category = deck.level || deck.language || 'General';
      const sourceLang = deck.language || 'English';
      const sourceFlag = getFlagCode(deck.language);

      realFlashcards.push({
        id: `card-${c.id}`,
        deckId: deck.id,
        frontWord: c.frontWord,
        phonetic: c.phonetic || '',
        backTranslation: c.backTranslation,
        partOfSpeech: c.partOfSpeech || 'Word',
        category,
        sourceLang,
        sourceFlag,
        targetLang: 'English',
        targetFlag: 'GB',
        image: cardImg,
        tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      });
    });
  });

  const dynamicCategories = ['All', ...Array.from(new Set(realFlashcards.map((c) => c.category).filter(Boolean)))];

  const filteredRecentCards =
    selectedWordCategory === 'All'
      ? realFlashcards
      : realFlashcards.filter((c: VocabCardItem) => c.category === selectedWordCategory);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Top Welcome / Daily Progress Banner */}
      <DashboardHeroSection currentAccent={currentAccent} />

      {/* Main Grid: Left 2-column Content + Right Sidebar */}
      <div className="flex flex-col xl:flex-row items-start gap-6 sm:gap-8">
        <div className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0">
          {/* RECENT FLASHCARDS SECTION */}
          <RecentCardsSection
            cards={filteredRecentCards}
            categories={dynamicCategories}
            selectedCategory={selectedWordCategory}
            onSelectCategory={setSelectedWordCategory}
            currentAccent={currentAccent}
          />

          {/* YOUR LANGUAGE COLLECTIONS & SRS VOCABULARY SECTION */}
          <CollectionsCarouselSection
            decks={filteredDecks}
            loading={loading}
            currentAccent={currentAccent}
            scrollRowRef={collectionsRowRef}
            onScroll={scrollCollections}
            getFlagCode={getFlagCode}
          />
        </div>

        {/* RIGHT SIDEBAR WIDGETS */}
        <DashboardSidebar stats={stats} decksCount={decks.length} />
      </div>
    </div>
  );
}

export default DashboardView;
