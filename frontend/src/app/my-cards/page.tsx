'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ArrowRight, FolderClosed } from 'lucide-react';
import { fetchDecks, deleteDeck } from '@/lib/api';
import { useTheme } from '@/lib/theme';
import { getDeckLanguagePair, slugifyDeck } from '@/lib/deckLanguages';
import { useI18n } from '@/lib/i18n';
import { CuratedDeckItem, SCENIC_COVERS } from './types';
import { resolveCover, formatTimeAgo } from '@/lib/utils';
import { MyCardsToolbar } from './MyCardsToolbar';
import { DeckCardItem } from './DeckCardItem';
import { DeckListItem } from './DeckListItem';

function MyCollectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentAccent } = useTheme();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<
    'all' | 'my' | 'shared' | 'favorites' | 'forked' | 'cloned' | 'archived'
  >('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'lastModified' | 'alphabetical' | 'cards'>('lastModified');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [searchQuery] = useState('');
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [openMenuDeckId, setOpenMenuDeckId] = useState<string | number | null>(null);

  // Close card 3-dot dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuDeckId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const refreshArchivedIds = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('duocard_archived_decks') || '[]');
      setArchivedIds(Array.isArray(stored) ? stored : []);
    } catch {
      setArchivedIds([]);
    }
  };

  useEffect(() => {
    refreshArchivedIds();
    const handleStorage = () => refreshArchivedIds();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'history') {
      router.replace('/history');
      return;
    }
    if (tabParam === 'bookmarks') {
      router.replace('/bookmarks');
      return;
    }
    if (
      tabParam === 'my' ||
      tabParam === 'shared' ||
      tabParam === 'favorites' ||
      tabParam === 'forked' ||
      tabParam === 'cloned' ||
      tabParam === 'archived' ||
      tabParam === 'all'
    ) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams, router]);

  const [displayDecks, setDisplayDecks] = useState<CuratedDeckItem[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(true);

  const loadUserDecks = () => {
    setLoadingDecks(true);
    const currentUser = typeof window !== 'undefined'
      ? (localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name') || '').trim()
      : '';
    fetchDecks(currentUser || undefined)
      .then((realDecks) => {
        // Double check filtering client-side in case deck author has '@' or matches current user
        const normalizedCurrentUser = currentUser.replace(/^@+/, '').toLowerCase();
        const userDecks = normalizedCurrentUser
          ? realDecks.filter((d) => {
              if (!d.author) return true; // Legacy/unassigned decks belong to default
              const deckAuthor = d.author.replace(/^@+/, '').toLowerCase().trim();
              return (
                deckAuthor === normalizedCurrentUser ||
                deckAuthor === 'you' ||
                deckAuthor === 'user' ||
                deckAuthor === 'learner'
              );
            })
          : realDecks;

        const savedCovers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
        const favoritesList = JSON.parse(localStorage.getItem('duocard_favorite_decks') || '[]');

        const converted: CuratedDeckItem[] = userDecks.map((d, idx) => {
          const pair = getDeckLanguagePair(d);
          const rawDesc = d.description || '';

          const forkAuthorMatch = rawDesc.match(/forked from @([^\s•]+)/i);
          const cloneAuthorMatch = rawDesc.match(/cloned from @([^\s•]+)/i);
          const originalTitleMatch = rawDesc.match(/Original:\s*"([^"]+)"/i);

          const isForkedDeck = Boolean(
            (d as any).forkedFromTitle ||
              (d as any).fork_origin ||
              (d as any).forkOrigin ||
              forkAuthorMatch ||
              d.title.toLowerCase().includes('(fork)')
          );

          const isClonedDeck = Boolean(
            (d as any).isCloned ||
              (d as any).clone_origin ||
              (d as any).cloneOrigin ||
              cloneAuthorMatch ||
              d.title.toLowerCase().includes('(clone)')
          );

          // Look up original parent deck in realDecks to resolve author and cover if not explicitly stored
          const parentForkDeck = d.forkedFromDeckId
            ? realDecks.find((p) => p.id === d.forkedFromDeckId)
            : realDecks.find(
                (p) =>
                  p.id !== d.id &&
                  p.title.trim().toLowerCase() ===
                    (d.forkedFromTitle || d.title.replace(/\s*\(fork\)/i, '')).trim().toLowerCase()
              );

          const parentCloneDeck = (d as any).clonedFromDeckId
            ? realDecks.find((p) => p.id === (d as any).clonedFromDeckId)
            : realDecks.find(
                (p) =>
                  p.id !== d.id &&
                  p.title.trim().toLowerCase() ===
                    ((d as any).clonedFromTitle || d.title.replace(/\s*\(clone\)/i, '')).trim().toLowerCase()
              );

          const parentCover =
            (parentCloneDeck && (savedCovers[String(parentCloneDeck.id)] || parentCloneDeck.coverImage)) ||
            (parentForkDeck && (savedCovers[String(parentForkDeck.id)] || parentForkDeck.coverImage)) ||
            '';

          const fallbackCover =
            savedCovers[String(d.id)] ||
            resolveCover(d, parentCover || SCENIC_COVERS[idx % SCENIC_COVERS.length]);

          const defaultAuthor =
            (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || 'You';

          const forkedFromAuthor =
            (d as any).forkedFromAuthor ||
            (d as any).forkAuthor ||
            forkAuthorMatch?.[1] ||
            parentForkDeck?.author ||
            (isForkedDeck ? defaultAuthor : undefined);

          const clonedFromAuthor =
            (d as any).clonedFromAuthor ||
            (d as any).cloneAuthor ||
            cloneAuthorMatch?.[1] ||
            parentCloneDeck?.author ||
            (isClonedDeck ? defaultAuthor : undefined);

          const originalTitleFromDesc = originalTitleMatch?.[1];

          // Only assign forkedFromTitle if it's genuinely a forked deck and NOT a cloned deck
          const resolvedForkedTitle =
            !isClonedDeck && isForkedDeck
              ? (d as any).forkedFromTitle ||
                (forkAuthorMatch ? originalTitleFromDesc : undefined) ||
                d.title.replace(/\s*\(fork\)/i, '')
              : undefined;

          const resolvedClonedTitle =
            isClonedDeck
              ? (d as any).clonedFromTitle ||
                originalTitleFromDesc ||
                d.title.replace(/\s*\(clone\)/i, '')
              : undefined;

          return {
            id: d.id,
            hasRealDeckId: d.id,
            title: d.title,
            targetLang: pair.targetLang,
            targetFlag: pair.targetFlag,
            nativeLang: pair.nativeLang,
            nativeFlag: pair.nativeFlag,
            cardCount: d.cards?.length || 0,
            timeAgo: (d as any).updated_at
              ? formatTimeAgo((d as any).updated_at)
              : (d as any).created_at
              ? formatTimeAgo((d as any).created_at)
              : 'Recently',
            updatedAt: (d as any).updated_at || (d as any).created_at,
            coverImage: fallbackCover,
            category: 'my',
            isFavorite: favoritesList.includes(d.id),
            isMinimalHeader: false,
            forkedFromTitle: resolvedForkedTitle,
            forkedFromAuthor: !isClonedDeck ? forkedFromAuthor : undefined,
            isCloned: isClonedDeck,
            clonedFromTitle: resolvedClonedTitle,
            clonedFromAuthor: isClonedDeck ? clonedFromAuthor : undefined,
            isPublic: d.isPublic || (d as any).public,
          };
        });

        setDisplayDecks(converted);
      })
      .catch((err) => {
        console.error('Failed to load user decks:', err);
      })
      .finally(() => {
        setLoadingDecks(false);
      });
  };

  useEffect(() => {
    loadUserDecks();
  }, []);

  const syncUserListToDb = async (field: 'favoriteDecks' | 'archivedDecks', jsonStr: string) => {
    const userIdentifier = typeof window !== 'undefined'
      ? localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username')
      : null;
    if (!userIdentifier) return;
    try {
      const { savePreferences: apiSavePreferences } = await import('@/lib/api');
      await apiSavePreferences({
        usernameOrEmail: userIdentifier,
        [field]: jsonStr,
      });
    } catch {}
  };

  const toggleFavorite = (deckId: number | string) => {
    setDisplayDecks((prev) =>
      prev.map((d) => (d.id === deckId ? { ...d, isFavorite: !d.isFavorite } : d))
    );
    try {
      const favoritesList = JSON.parse(localStorage.getItem('duocard_favorite_decks') || '[]');
      const idNum = Number(deckId);
      let updated: number[];
      if (favoritesList.includes(idNum)) {
        updated = favoritesList.filter((item: number) => item !== idNum);
      } else {
        updated = [...favoritesList, idNum];
      }
      const jsonStr = JSON.stringify(updated);
      localStorage.setItem('duocard_favorite_decks', jsonStr);
      syncUserListToDb('favoriteDecks', jsonStr);
    } catch {}
  };

  const parseDeckRecency = (deck: CuratedDeckItem): number => {
    if (deck.updatedAt) {
      const t = Date.parse(deck.updatedAt);
      if (!isNaN(t)) return t;
    }
    const t = Date.parse(deck.timeAgo);
    if (!isNaN(t)) return t;
    return typeof deck.id === 'number' ? deck.id : 0;
  };

  const filteredDecks = useMemo(() => {
    const list = displayDecks.filter((deck) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = deck.title.toLowerCase().includes(q);
        const matchLang =
          deck.targetLang.toLowerCase().includes(q) || deck.nativeLang.toLowerCase().includes(q);
        if (!matchTitle && !matchLang) return false;
      }

      const isDeckArchived =
        archivedIds.includes(String(deck.id)) ||
        (deck.hasRealDeckId ? archivedIds.includes(String(deck.hasRealDeckId)) : false);

      if (activeTab === 'archived') {
        return isDeckArchived;
      }

      if (isDeckArchived) return false;

      if (activeTab === 'my') return deck.category === 'my' || deck.hasRealDeckId;
      if (activeTab === 'shared') return deck.category === 'shared' || Boolean(deck.isPublic);
      if (activeTab === 'favorites') return deck.isFavorite;
      if (activeTab === 'forked') {
        return Boolean(deck.forkedFromTitle || deck.title.toLowerCase().includes('(fork)'));
      }
      if (activeTab === 'cloned') {
        return Boolean(deck.isCloned || deck.cloneOrigin || deck.title.toLowerCase().includes('(clone)'));
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      }
      if (sortOption === 'cards') {
        return (b.cardCount || 0) - (a.cardCount || 0);
      }
      return parseDeckRecency(b) - parseDeckRecency(a);
    });
  }, [displayDecks, activeTab, searchQuery, sortOption, archivedIds]);

  const handleDeckClick = (deck: CuratedDeckItem) => {
    if (deck.hasRealDeckId) {
      localStorage.setItem('duocard_active_deck_id', String(deck.hasRealDeckId));
      const friendlySlug = slugifyDeck(deck.hasRealDeckId, deck.title);
      const isDeckArchived =
        archivedIds.includes(String(deck.id)) ||
        (deck.hasRealDeckId ? archivedIds.includes(String(deck.hasRealDeckId)) : false);

      if (isDeckArchived) {
        router.push(`/archived/${friendlySlug}`);
      } else if (deck.forkedFromTitle) {
        router.push(`/fork/${friendlySlug}`);
      } else if (deck.isCloned) {
        router.push(`/cloned/${friendlySlug}`);
      } else {
        router.push(`/study/${friendlySlug}`);
      }
    } else {
      router.push(`/decks/new?lang=${encodeURIComponent(deck.targetLang)}`);
    }
  };

  const handleArchiveDeck = (e: React.MouseEvent, deck: CuratedDeckItem) => {
    e.stopPropagation();
    setOpenMenuDeckId(null);
    const idStr = String(deck.hasRealDeckId || deck.id);
    if (!archivedIds.includes(idStr)) {
      const updated = [...archivedIds, idStr];
      const jsonStr = JSON.stringify(updated);
      localStorage.setItem('duocard_archived_decks', jsonStr);
      setArchivedIds(updated);
      syncUserListToDb('archivedDecks', jsonStr);
    }
  };

  const handleUnarchiveDeck = (e: React.MouseEvent, deck: CuratedDeckItem) => {
    e.stopPropagation();
    setOpenMenuDeckId(null);
    const idStr = String(deck.hasRealDeckId || deck.id);
    const updated = archivedIds.filter((item) => item !== idStr);
    const jsonStr = JSON.stringify(updated);
    localStorage.setItem('duocard_archived_decks', jsonStr);
    setArchivedIds(updated);
    syncUserListToDb('archivedDecks', jsonStr);
  };

  const handleDeleteDeck = async (e: React.MouseEvent, deck: CuratedDeckItem) => {
    e.stopPropagation();
    setOpenMenuDeckId(null);
    if (!confirm(`Are you sure you want to remove the deck "${deck.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      if (deck.hasRealDeckId) {
        await deleteDeck(deck.hasRealDeckId);
      }
      setDisplayDecks((prev) =>
        prev.filter((d) => d.id !== deck.id && d.hasRealDeckId !== deck.hasRealDeckId)
      );
      window.dispatchEvent(new Event('active_deck_changed'));
    } catch (err) {
      console.error('Failed to delete deck:', err);
      alert('Could not remove deck. Please try again.');
    }
  };

  return (
    <div className="flex-1 min-h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col space-y-6 pb-2">
        {/* HEADER ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              {t('myLibrary')} &bull;{' '}
              {activeTab === 'forked'
                ? t('forkedUpper')
                : activeTab === 'cloned'
                ? t('clonedUpper')
                : activeTab === 'archived'
                ? t('archivedUpper')
                : activeTab === 'favorites'
                ? t('favoritesUpper')
                : activeTab === 'shared'
                ? t('sharedUpper')
                : activeTab === 'my'
                ? t('myDecksUpper')
                : t('allDecksUpper')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
              {activeTab === 'forked'
                ? t('forkedDecks')
                : activeTab === 'cloned'
                ? t('clonedDecks')
                : activeTab === 'archived'
                ? t('archivedDecks')
                : activeTab === 'favorites'
                ? t('favoriteDecks')
                : activeTab === 'shared'
                ? t('sharedDecks')
                : activeTab === 'my'
                ? t('myCreatedDecks')
                : t('allLearningDecks')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
              {activeTab === 'all'
                ? t('allDecksDesc')
                : activeTab === 'my'
                ? t('myDecksDesc')
                : activeTab === 'shared'
                ? t('sharedDecksDesc')
                : activeTab === 'favorites'
                ? t('favoriteDecksDesc')
                : activeTab === 'forked'
                ? t('forkedDecksDesc')
                : activeTab === 'cloned'
                ? t('clonedDecksDesc')
                : activeTab === 'archived'
                ? t('archivedDecksDesc')
                : t('generalDecksDesc')}
            </p>
          </div>

          <Link
            href="/decks/create"
            className="flex-1 max-w-md bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] hover:border-slate-200 dark:hover:border-white/20 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:scale-125 transition-transform"
              style={{ backgroundColor: currentAccent.subtleBg }}
            />

            <div className="flex items-center gap-4 relative z-10">
              <div
                className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0"
                style={{ backgroundColor: currentAccent.primary }}
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#1e293b] dark:text-white transition-colors">
                  {t('createNewDeckBtn')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
                  {t('startNewDeckSubtitle')}
                </p>
              </div>
            </div>

            <div
              className="w-9 h-9 rounded-full text-white shadow-2xs flex items-center justify-center shrink-0 transition-all"
              style={{ backgroundColor: currentAccent.primary }}
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* TOOLBAR */}
        <MyCardsToolbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'all') router.push('/my-cards');
            else router.push(`/my-cards?tab=${tab}`);
          }}
          displayDecks={displayDecks}
          archivedIds={archivedIds}
          currentAccent={currentAccent}
          sortOption={sortOption}
          setSortOption={setSortOption}
          isSortDropdownOpen={isSortDropdownOpen}
          setIsSortDropdownOpen={setIsSortDropdownOpen}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* DECKS VIEW */}
        {loadingDecks ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-8 h-8 border-3 border-accent-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-400">{t('loadingCollections')}</p>
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#1f1f1f] rounded-3xl border border-slate-100 dark:border-[#2e2e2e] shadow-xs p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
              <FolderClosed className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                {activeTab === 'archived'
                  ? t('noArchivedDecks')
                  : activeTab === 'forked'
                  ? t('noForkedDecks')
                  : activeTab === 'cloned'
                  ? t('noClonedDecks')
                  : activeTab === 'favorites'
                  ? t('noFavoriteDecks')
                  : activeTab === 'shared'
                  ? t('noSharedDecks')
                  : t('noDecksCollection')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {activeTab === 'archived'
                  ? t('archivedDecksEmptyDesc')
                  : activeTab === 'forked'
                  ? t('forkedDecksEmptyDesc')
                  : activeTab === 'cloned'
                  ? t('clonedDecksEmptyDesc')
                  : t('generalDecksEmptyDesc')}
              </p>
            </div>
            <Link
              href="/decks/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary hover:opacity-90 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createNewDeckBtn')}</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredDecks.map((deck) => (
              <DeckCardItem
                key={deck.id}
                deck={deck}
                onClick={() => handleDeckClick(deck)}
                openMenuDeckId={openMenuDeckId}
                onToggleMenu={(id) => setOpenMenuDeckId((prev) => (prev === id ? null : id))}
                onAddCard={(deckId) => router.push(`/decks/new?deckId=${deckId}`)}
                onDeleteDeck={handleDeleteDeck}
                onToggleFavorite={toggleFavorite}
                archivedIds={archivedIds}
                currentAccent={currentAccent}
                onArchive={handleArchiveDeck}
                onUnarchive={handleUnarchiveDeck}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDecks.map((deck) => (
              <DeckListItem
                key={deck.id}
                deck={deck}
                onClick={() => handleDeckClick(deck)}
                openMenuDeckId={openMenuDeckId}
                onToggleMenu={(id) => setOpenMenuDeckId((prev) => (prev === id ? null : id))}
                onAddCard={(deckId) => router.push(`/decks/new?deckId=${deckId}`)}
                onDeleteDeck={handleDeleteDeck}
                onToggleFavorite={toggleFavorite}
                archivedIds={archivedIds}
                onArchive={handleArchiveDeck}
                onUnarchive={handleUnarchiveDeck}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyCardsPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-xs text-slate-400">Loading library...</div>}
    >
      <MyCollectionsContent />
    </Suspense>
  );
}
