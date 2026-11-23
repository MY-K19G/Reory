'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { fetchDecks } from '@/lib/api';
import { getDeckLanguagePair } from '@/lib/deckLanguages';
import { useI18n } from '@/lib/i18n';
import { BookmarkedCardItem, BookmarkedDeckItem } from './types';
import { BookmarksHeader } from './BookmarksHeader';
import { BookmarksToolbar } from './BookmarksToolbar';
import { BookmarkedCardsSection } from './BookmarkedCardsSection';
import { BookmarkedDecksSection } from './BookmarkedDecksSection';
import { BookmarksRecentDecks } from './BookmarksRecentDecks';

export default function BookmarksPage() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'cards' | 'decks'>('cards');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingWordId, setPlayingWordId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cards, setCards] = useState<BookmarkedCardItem[]>([]);
  const [decks, setDecks] = useState<BookmarkedDeckItem[]>([]);

  // Close tag dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real data from backend
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const realDecks = await fetchDecks();

        // Check stored favorites/bookmarks from localStorage
        let storedFavDecks: (string | number)[] | null = null;
        let storedBookmarkedCards: (string | number)[] | null = null;
        try {
          const rawFavs = localStorage.getItem('duocard_favorite_decks');
          if (rawFavs) storedFavDecks = JSON.parse(rawFavs);
          const rawCards = localStorage.getItem('duocard_bookmarked_cards');
          if (rawCards) storedBookmarkedCards = JSON.parse(rawCards);
        } catch {}

        const SCENIC_COVERS = [
          'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&auto=format&fit=crop&q=80',
        ];

        const mappedDecks: BookmarkedDeckItem[] = realDecks.map((d, index) => {
          const pair = getDeckLanguagePair({
            title: d.title,
            language: d.language,
            description: d.description,
          });

          let cover = d.coverImage;
          if (!cover && d.description) {
            const match = d.description.match(/\[Cover:\s*([^\]]+)\]/i);
            if (match && match[1]) cover = match[1].trim();
          }
          if (!cover) {
            cover = SCENIC_COVERS[index % SCENIC_COVERS.length];
          }

          const isFav = Array.isArray(storedFavDecks) ? storedFavDecks.includes(d.id) : false;

          return {
            id: d.id,
            title: d.title,
            targetLang: pair.targetLang,
            targetFlag: pair.targetFlag,
            cardCount: d.cards?.length || 0,
            lastStudied: 'Recently',
            coverImage: cover,
            isFavorite: isFav,
          };
        });

        // Extract real cards from decks
        const extractedCards: BookmarkedCardItem[] = [];
        realDecks.forEach((d) => {
          const pair = getDeckLanguagePair({
            title: d.title,
            language: d.language,
            description: d.description,
          });

          if (Array.isArray(d.cards)) {
            d.cards.forEach((card, idx) => {
              let parsedTags: string[] = [];
              if (card.tags) {
                parsedTags = card.tags
                  .split(/[,;]/)
                  .map((t) => t.trim())
                  .filter(Boolean);
              }

              const cardId = card.id || `card-${d.id}-${idx}`;
              const isBm = Array.isArray(storedBookmarkedCards) ? storedBookmarkedCards.includes(cardId) : false;

              extractedCards.push({
                id: cardId,
                word: card.frontWord,
                reading: card.phonetic,
                translation: card.backTranslation,
                deckTitle: d.title,
                deckId: d.id,
                language: pair.targetLang,
                languageFlag: pair.targetFlag,
                isBookmarked: isBm,
                bookmarkedAt: card.lastReviewedAt ? t('reviewedRecently') : t('savedInDeck'),
                tags: parsedTags.length > 0 ? parsedTags : [pair.targetLang],
                exampleSentence: card.exampleSentence || undefined,
              });
            });
          }
        });

        setDecks(mappedDecks);
        setCards(extractedCards);
      } catch (err) {
        console.error('Failed to load bookmarks data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [t]);

  // Play audio pronunciation
  const playWordAudio = (word: string, lang: string, id: string | number) => {
    setPlayingWordId(id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      const l = lang.toLowerCase();
      utterance.lang = l.includes('korean')
        ? 'ko-KR'
        : l.includes('japan')
        ? 'ja-JP'
        : l.includes('french')
        ? 'fr-FR'
        : l.includes('spanish')
        ? 'es-ES'
        : l.includes('german')
        ? 'de-DE'
        : l.includes('chinese')
        ? 'zh-CN'
        : 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingWordId(null);
      utterance.onerror = () => setPlayingWordId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingWordId(null), 800);
    }
  };

  const toggleCardBookmark = (id: string | number) => {
    setCards((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c));
      try {
        const bookmarkedIds = updated.filter((c) => c.isBookmarked).map((c) => c.id);
        localStorage.setItem('duocard_bookmarked_cards', JSON.stringify(bookmarkedIds));
      } catch {}
      return updated;
    });
  };

  const toggleDeckBookmark = (id: string | number) => {
    setDecks((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
      try {
        const favoriteIds = updated.filter((d) => d.isFavorite).map((d) => d.id);
        localStorage.setItem('duocard_favorite_decks', JSON.stringify(favoriteIds));
      } catch {}
      return updated;
    });
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllSelectedTags = () => {
    setSelectedTags([]);
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [cards]);

  const filteredDropdownTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return allTags;
    return allTags.filter((t) =>
      t.toLowerCase().includes(tagSearchQuery.toLowerCase().trim())
    );
  }, [allTags, tagSearchQuery]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return cards.filter((card) => {
      if (!card.isBookmarked) return false;
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((st) => card.tags?.includes(st));
        if (!hasMatchingTag) return false;
      }
      if (!q) return true;
      return (
        card.word.toLowerCase().includes(q) ||
        (card.reading && card.reading.toLowerCase().includes(q)) ||
        card.translation.toLowerCase().includes(q) ||
        card.deckTitle.toLowerCase().includes(q)
      );
    });
  }, [cards, searchQuery, selectedTags]);

  const filteredDecks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return decks.filter((deck) => {
      if (!deck.isFavorite) return false;
      if (!q) return true;
      return (
        deck.title.toLowerCase().includes(q) ||
        deck.targetLang.toLowerCase().includes(q)
      );
    });
  }, [decks, searchQuery]);

  const bookmarkedCardsCount = useMemo(() => cards.filter((c) => c.isBookmarked).length, [cards]);
  const bookmarkedDecksCount = useMemo(() => decks.filter((d) => d.isFavorite).length, [decks]);
  const firstDeckId = useMemo(() => {
    const fav = decks.find((d) => d.isFavorite);
    return fav ? fav.id : (decks[0]?.id ?? null);
  }, [decks]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <BookmarksHeader
          bookmarkedCardsCount={bookmarkedCardsCount}
          bookmarkedDecksCount={bookmarkedDecksCount}
          allTagsCount={allTags.length}
          firstDeckId={firstDeckId}
        />

        <BookmarksToolbar
          subTab={subTab}
          setSubTab={setSubTab}
          cardsCount={bookmarkedCardsCount}
          decksCount={bookmarkedDecksCount}
          allTags={allTags}
          selectedTags={selectedTags}
          tagSearchQuery={tagSearchQuery}
          setTagSearchQuery={setTagSearchQuery}
          isTagDropdownOpen={isTagDropdownOpen}
          setIsTagDropdownOpen={setIsTagDropdownOpen}
          tagDropdownRef={tagDropdownRef}
          toggleTagSelection={toggleTagSelection}
          clearAllSelectedTags={clearAllSelectedTags}
          filteredDropdownTags={filteredDropdownTags}
          cards={cards}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {isLoading ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-accent-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium">{t('loadingBookmarks')}</p>
          </div>
        ) : subTab === 'cards' ? (
          <BookmarkedCardsSection
            cards={filteredCards}
            viewMode={viewMode}
            playingWordId={playingWordId}
            onPlayWordAudio={playWordAudio}
            onToggleCardBookmark={toggleCardBookmark}
          />
        ) : (
          <BookmarkedDecksSection
            decks={filteredDecks}
            viewMode={viewMode}
            onToggleDeckBookmark={toggleDeckBookmark}
          />
        )}

        <BookmarksRecentDecks decks={decks} />
      </div>
    </div>
  );
}
