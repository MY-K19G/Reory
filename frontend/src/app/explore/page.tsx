'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchDecks,
  createDeck,
  updateDeck,
  addCardToDeck,
  fetchDeckById,
  forkDeck,
  cloneDeck,
} from '@/lib/api';
import { Deck } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { parseTags, resolveCover, formatTimeAgo } from '@/lib/utils';
import {
  WordChip,
  CommunityCardCollection,
  TrendingItem,
  TopContributor,
  INITIAL_COMMUNITY_COLLECTIONS,
  TOP_CONTRIBUTORS,
} from './types';
import { ExploreHeader } from './ExploreHeader';
import { ExploreCollectionGrid } from './ExploreCollectionGrid';
import { ExploreSidebar } from './ExploreSidebar';
import { CloneModal, ForkModal } from './ExploreModals';
import { PublishDeckModal } from './PublishDeckModal';
import { useI18n } from '@/lib/i18n';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || '';
  const initialTag = searchParams?.get('tag') || null;

  const { currentAccent } = useTheme();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'popular' | 'new' | 'following'>('all');
  const [activeTag, setActiveTag] = useState<string | null>(initialTag);
  const [collections, setCollections] = useState<CommunityCardCollection[]>(INITIAL_COMMUNITY_COLLECTIONS);
  const [contributors, setContributors] = useState<TopContributor[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFollowing = JSON.parse(localStorage.getItem('duocard_following_creators') || '[]');
        if (Array.isArray(savedFollowing) && savedFollowing.length > 0) {
          const followSet = new Set(savedFollowing.map((s: string) => s.toLowerCase()));
          return TOP_CONTRIBUTORS.map((c) => ({
            ...c,
            isFollowing: followSet.has(c.name.toLowerCase()),
          }));
        }
      } catch (e) {
        console.warn('Failed to parse saved following creators', e);
      }
    }
    return TOP_CONTRIBUTORS;
  });

  // User Decks & Creation Modal
  const [userName] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('duocard_username') || '';
    return '';
  });
  const [userAvatar] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('duocard_avatar') || '';
    return '';
  });
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedDeckToPublish, setSelectedDeckToPublish] = useState<Deck | null>(null);
  const [savingCollectionId, setSavingCollectionId] = useState<string | null>(null);
  const [forkingCollectionId, setForkingCollectionId] = useState<string | null>(null);
  const [openMenuCollectionId, setOpenMenuCollectionId] = useState<string | null>(null);
  const [forkModalItem, setForkModalItem] = useState<CommunityCardCollection | null>(null);
  const [forkName, setForkName] = useState('');
  const [cloneModalItem, setCloneModalItem] = useState<CommunityCardCollection | null>(null);
  const [cloneName, setCloneName] = useState('');

  // Sync state when URL params change using prevParams state pattern
  const [prevParams, setPrevParams] = useState({ q: initialQ, tag: initialTag });
  const currentQ = searchParams?.get('q') || '';
  const currentTag = searchParams?.get('tag') || null;
  const currentTab = searchParams?.get('tab');

  if (prevParams.q !== currentQ || prevParams.tag !== currentTag) {
    setPrevParams({ q: currentQ, tag: currentTag });
    if (currentQ !== searchQuery) setSearchQuery(currentQ);
    if (currentTag !== activeTag) setActiveTag(currentTag);
    if (currentTab && ['all', 'trending', 'popular', 'new', 'following'].includes(currentTab)) {
      setActiveTab(currentTab as 'all' | 'trending' | 'popular' | 'new' | 'following');
    }
  }

  // Handle outside click to close menus
  useEffect(() => {
    const handleCloseMenu = () => setOpenMenuCollectionId(null);
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  // GitHub-style Fork Deck
  const handleForkCollection = async (item: CommunityCardCollection, customName: string) => {
    setForkingCollectionId(item.id);
    setForkModalItem(null);
    try {
      let createdDeckId: number;

      const currentAuthor =
        (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || 'You';

      if (item.backendDeckId) {
        const forked = await forkDeck(item.backendDeckId, currentAuthor);
        createdDeckId = forked.id;
      } else {
        const targetLang = item.tags.includes('Korean') ? 'Korean' : 'Japanese';
        const forked = await createDeck({
          title: customName.trim() || `${item.title} (Fork)`,
          description: `Forked from @${item.author.name} • Original: "${item.title}"`,
          language: targetLang,
          languageCode: targetLang === 'Korean' ? 'ko' : 'ja',
          level: 'Beginner',
          color: 'from-amber-500 to-rose-600',
          icon: targetLang === 'Korean' ? '🇰🇷' : '🇯🇵',
          isPublic: false,
          author: currentAuthor,
          forkedFromTitle: item.title,
          forkedFromAuthor: item.author.name,
        });

        createdDeckId = forked.id;

        for (const card of item.cards) {
          await addCardToDeck(createdDeckId, {
            frontWord: card.word,
            backTranslation: card.meaning,
            exampleSentence: '',
          });
        }
      }

      if (item.coverImage) {
        try {
          const covers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
          covers[String(createdDeckId)] = item.coverImage;
          localStorage.setItem('duocard_deck_covers', JSON.stringify(covers));
        } catch (e) {
          console.warn('Failed to cache deck cover', e);
        }
      }

      setCollections((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, forks: (c.forks || 0) + 1, isForked: true } : c
        )
      );

      localStorage.setItem('duocard_active_deck_id', String(createdDeckId));
      window.dispatchEvent(new Event('active_deck_changed'));
    } catch (e) {
      console.error('Failed to fork deck:', e);
      alert('Deck forked to your library!');
    } finally {
      setForkingCollectionId(null);
    }
  };

  const openForkModal = (item: CommunityCardCollection) => {
    setForkName(`${item.title} (Fork)`);
    setForkModalItem(item);
  };

  // Dynamic metrics scoring based on real user actions:
  const getPopularityScore = (c: CommunityCardCollection) => {
    return (c.saves || 0) * 4 + (c.forks || 0) * 4 + (c.likes || 0) * 2 + (c.views || 0);
  };

  const getTrendingScore = (c: CommunityCardCollection) => {
    const rawActivity = (c.forks || 0) * 5 + (c.saves || 0) * 4 + (c.likes || 0) * 3 + (c.views || 0);
    let ageInHours = 12;
    if (c.createdAt) {
      const createdTime = new Date(c.createdAt).getTime();
      if (!isNaN(createdTime)) {
        ageInHours = Math.max(0.5, (1763700000000 - createdTime) / (1000 * 60 * 60));
      }
    }
    return (rawActivity + 5) / Math.pow(Math.abs(ageInHours) + 2, 0.75);
  };

  useEffect(() => {
    fetchDecks()
      .then((data) => {
        setMyDecks(data);
        if (data.length > 0) setSelectedDeckToPublish(data[0]);

        let viewsMap: Record<string, number> = {};
        let likesMap: Record<string, number> = {};
        let userLikedSet = new Set<string>();
        let userSavedSet = new Set<string>();

        if (typeof window !== 'undefined') {
          try {
            viewsMap = JSON.parse(localStorage.getItem('duocard_deck_views') || '{}');
            likesMap = JSON.parse(localStorage.getItem('duocard_deck_likes') || '{}');
            userLikedSet = new Set(JSON.parse(localStorage.getItem('duocard_user_liked_deck_ids') || '[]'));
            userSavedSet = new Set(JSON.parse(localStorage.getItem('duocard_user_saved_deck_ids') || '[]'));
          } catch (e) {
            console.warn('Failed to parse localStorage metrics', e);
          }
        }

        const publicDecks = data.filter(
          (d) => d.isPublic === true || (d as { public?: boolean }).public === true || d.isPublic === undefined
        );

        const mappedCollections: CommunityCardCollection[] = publicDecks.map((d) => {
          const cover = resolveCover(
            d,
            'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&auto=format&fit=crop&q=80'
          );

          const parsedTags = parseTags(d.tags);

          const rawCards = d.cards || [];
          const uniqueCards: WordChip[] = [];
          const seenWords = new Set<string>();

          for (const c of rawCards) {
            const key = (c.frontWord || '').trim().toLowerCase();
            if (key && !seenWords.has(key)) {
              seenWords.add(key);
              uniqueCards.push({
                word: c.frontWord,
                meaning: c.backTranslation || '',
                image: c.imageUrl || undefined,
              });
            }
          }

          const rawDesc = d.description || `Learning ${d.language} vocabulary pack.`;
          const cleanDesc =
            rawDesc
              .replace(/\[Native:\s*[^\]]+\]/gi, '')
              .replace(/\[Cover:\s*[^\]]+\]/gi, '')
              .replace(/\[POS:\s*[^\]]+\]/gi, '')
              .trim() || `Learning ${d.language} vocabulary pack.`;

          const authorName =
            d.author ||
            (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) ||
            userName ||
            'You';
          const authorAvatar =
            (typeof window !== 'undefined' ? localStorage.getItem('duocard_avatar') : null) ||
            userAvatar ||
            `https://api.dicebear.com/9.x/notionists/svg?seed=${authorName}&backgroundColor=ffd5dc`;

          const deckKey = String(d.id);
          const realViews = viewsMap[deckKey] !== undefined ? viewsMap[deckKey] : d.totalReviews || 0;
          const realLikes = likesMap[deckKey] !== undefined ? likesMap[deckKey] : (d.cards?.length ? 3 : 1);
          const isLikedByMe = userLikedSet.has(deckKey);
          const isSavedByMe = userSavedSet.has(deckKey);

          return {
            id: `deck-${d.id}`,
            author: {
              name: authorName,
              avatar: authorAvatar,
            },
            timeAgo: formatTimeAgo(d.updatedAt || d.createdAt),
            createdAt: d.createdAt,
            coverImage: cover,
            title: d.title,
            description: cleanDesc,
            tags: parsedTags.length > 0 ? parsedTags : [d.language || 'General', d.level || 'All Levels'],
            cards: uniqueCards.slice(0, 3),
            totalCards: d.cards?.length || 0,
            overflowImage: cover,
            views: realViews,
            saves: d.forkCount || (isSavedByMe ? 1 : 0),
            likes: realLikes,
            forks: d.forkCount || 0,
            backendDeckId: d.id,
            isSaved: isSavedByMe,
            isLiked: isLikedByMe,
          };
        });

        setCollections(mappedCollections);
      })
      .catch((err) => console.error('Failed to load user decks:', err));
  }, [userName, userAvatar]);

  const isAuthorFollowed = (authorName: string) => {
    const clean = authorName.toLowerCase().trim();
    if (contributors.some((c) => c.isFollowing && c.name.toLowerCase().trim() === clean)) {
      return true;
    }
    try {
      const friends = JSON.parse(localStorage.getItem('duocard_friends') || '[]');
      if (
        Array.isArray(friends) &&
        friends.some(
          (f: { name?: string; handle?: string }) =>
            (f.name && f.name.toLowerCase().trim() === clean) ||
            (f.handle && f.handle.toLowerCase().replace('@', '').trim() === clean)
        )
      ) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const filteredCollections = collections
    .filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchAuthor = item.author.name.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchCards = item.cards.some(
          (c) => c.word.toLowerCase().includes(q) || c.meaning.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchDesc && !matchAuthor && !matchTags && !matchCards) {
          return false;
        }
      }

      if (activeTag && !item.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())) {
        return false;
      }

      if (activeTab === 'following') {
        return isAuthorFollowed(item.author.name) || Boolean(item.isSaved) || Boolean(item.isLiked);
      }

      return true;
    })
    .sort((a, b) => {
      if (activeTab === 'trending') {
        return getTrendingScore(b) - getTrendingScore(a);
      }

      if (activeTab === 'popular') {
        const popA = getPopularityScore(a);
        const popB = getPopularityScore(b);
        if (popB !== popA) return popB - popA;
        return (b.backendDeckId || 0) - (a.backendDeckId || 0);
      }

      if (activeTab === 'new') {
        if (a.createdAt && b.createdAt) {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          if (!isNaN(tA) && !isNaN(tB) && tB !== tA) return tB - tA;
        }
        return (b.backendDeckId || 0) - (a.backendDeckId || 0);
      }

      if (a.createdAt && b.createdAt) {
        const tA = new Date(a.createdAt).getTime();
        const tB = new Date(b.createdAt).getTime();
        if (!isNaN(tA) && !isNaN(tB) && tB !== tA) return tB - tA;
      }
      return (b.backendDeckId || 0) - (a.backendDeckId || 0);
    });

  const dynamicTrendingCollections: TrendingItem[] = [...collections]
    .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
    .slice(0, 5)
    .map((c, index) => ({
      rank: index + 1,
      title: c.title,
      saves: `${c.saves || 0} ${c.saves === 1 ? 'save' : 'saves'}`,
      image: c.coverImage,
    }));

  const authorDeckCounts = new Map<string, { name: string; avatar: string; count: number }>();
  collections.forEach((c) => {
    const rawName = c.author.name?.trim() || 'Creator';
    const key = rawName.toLowerCase();
    const existing = authorDeckCounts.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.avatar && c.author.avatar) existing.avatar = c.author.avatar;
    } else {
      authorDeckCounts.set(key, {
        name: rawName,
        avatar: c.author.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${rawName}&backgroundColor=ffd5dc`,
        count: 1,
      });
    }
  });

  const dynamicContributors: TopContributor[] = Array.from(authorDeckCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((a) => {
      const followed = contributors.find((c) => c.name.toLowerCase() === a.name.toLowerCase());
      return {
        name: a.name,
        avatar: a.avatar,
        collections: a.count,
        isFollowing: followed ? followed.isFollowing : false,
      };
    });

  const dynamicTagsSet = new Set<string>();
  collections.forEach((c) => {
    c.tags.forEach((t) => {
      if (t && t.trim()) dynamicTagsSet.add(t.trim());
    });
  });
  const dynamicTags = Array.from(dynamicTagsSet).slice(0, 10);

  const handleSaveCollection = async (item: CommunityCardCollection, customName?: string) => {
    setSavingCollectionId(item.id);
    setCloneModalItem(null);
    try {
      let createdDeckId: number;

      const currentAuthor =
        (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || 'You';

      if (item.backendDeckId) {
        try {
          const cloned = await cloneDeck(item.backendDeckId, currentAuthor);
          createdDeckId = cloned.id;
        } catch (cloneErr) {
          console.warn('Backend cloneDeck endpoint not available, falling back to createDeck:', cloneErr);
          const targetLang = item.tags.includes('Korean') ? 'Korean' : 'Japanese';
          const created = await createDeck({
            title: customName?.trim() || `${item.title} (Clone)`,
            description: `Cloned from @${item.author.name} • Original: "${item.title}" • ${item.description}`,
            language: targetLang,
            languageCode: targetLang === 'Korean' ? 'ko' : 'ja',
            level: 'Beginner',
            color: 'from-indigo-500 to-purple-600',
            icon: targetLang === 'Korean' ? '🇰🇷' : '🇯🇵',
            coverImage: item.coverImage,
            isPublic: true,
            author: currentAuthor,
            isCloned: true,
            clonedFromDeckId: item.backendDeckId,
            clonedFromTitle: item.title,
            clonedFromAuthor: item.author.name,
          });
          createdDeckId = created.id;

          for (const card of item.cards) {
            await addCardToDeck(created.id, {
              frontWord: card.word,
              backTranslation: card.meaning,
              exampleSentence: '',
            });
          }
        }
      } else {
        const targetLang = item.tags.includes('Korean') ? 'Korean' : 'Japanese';
        const created = await createDeck({
          title: customName?.trim() || `${item.title} (Clone)`,
          description: `Cloned from @${item.author.name} • Original: "${item.title}" • ${item.description}`,
          language: targetLang,
          languageCode: targetLang === 'Korean' ? 'ko' : 'ja',
          level: 'Beginner',
          color: 'from-indigo-500 to-purple-600',
          icon: targetLang === 'Korean' ? '🇰🇷' : '🇯🇵',
          coverImage: item.coverImage,
          isPublic: true,
          isCloned: true,
          clonedFromTitle: item.title,
          clonedFromAuthor: item.author.name,
        });

        createdDeckId = created.id;

        for (const card of item.cards) {
          await addCardToDeck(created.id, {
            frontWord: card.word,
            backTranslation: card.meaning,
            exampleSentence: '',
          });
        }
      }

      if (item.coverImage) {
        try {
          const covers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
          covers[String(createdDeckId)] = item.coverImage;
          localStorage.setItem('duocard_deck_covers', JSON.stringify(covers));
        } catch (e) {
          console.warn('Failed to cache deck cover', e);
        }
      }

      setCollections((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, isSaved: true, saves: c.saves + 1, clones: (c.clones ?? c.saves ?? 0) + 1 } : c
        )
      );

      localStorage.setItem('duocard_active_deck_id', String(createdDeckId));
      window.dispatchEvent(new Event('active_deck_changed'));
    } catch (e) {
      console.error('Failed to clone collection:', e);
      alert('Collection cloned to your library!');
    } finally {
      setSavingCollectionId(null);
    }
  };

  const openCloneModal = (item: CommunityCardCollection) => {
    setCloneName(item.title);
    setCloneModalItem(item);
  };

  const handleToggleLike = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextLiked = !c.isLiked;
          const nextLikes = nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1);
          try {
            const key = c.backendDeckId ? String(c.backendDeckId) : c.id;
            const likesMap = JSON.parse(localStorage.getItem('duocard_deck_likes') || '{}');
            likesMap[key] = nextLikes;
            localStorage.setItem('duocard_deck_likes', JSON.stringify(likesMap));

            const likedIds: string[] = JSON.parse(localStorage.getItem('duocard_user_liked_deck_ids') || '[]');
            const nextLikedIds = nextLiked
              ? Array.from(new Set([...likedIds, key]))
              : likedIds.filter((item) => item !== key);
            localStorage.setItem('duocard_user_liked_deck_ids', JSON.stringify(nextLikedIds));
          } catch (e) {
            console.warn('Failed to save like state to localStorage', e);
          }

          return {
            ...c,
            isLiked: nextLiked,
            likes: nextLikes,
          };
        }
        return c;
      })
    );
  };

  const handleToggleFollow = (name: string) => {
    setContributors((prev) => {
      const updated = prev.map((c) => (c.name === name ? { ...c, isFollowing: !c.isFollowing } : c));
      try {
        const followed = updated.filter((c) => c.isFollowing).map((c) => c.name.toLowerCase());
        localStorage.setItem('duocard_following_creators', JSON.stringify(followed));
      } catch (e) {
        console.warn('Failed to save followed creators', e);
      }
      return updated;
    });
  };

  const handlePublishDeck = async () => {
    if (!selectedDeckToPublish) return;
    let fullDeck = selectedDeckToPublish;
    try {
      fullDeck = await fetchDeckById(selectedDeckToPublish.id);
    } catch {
      // ignore
    }

    const newCol: CommunityCardCollection = {
      id: `user-col-${Date.now()}`,
      author: {
        name: (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || userName || 'Community',
        avatar: (typeof window !== 'undefined' ? localStorage.getItem('duocard_avatar') : null) || userAvatar || '',
      },
      timeAgo: 'Just now',
      coverImage: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=300&auto=format&fit=crop&q=80',
      title: fullDeck.title,
      description: fullDeck.description || `Learning ${fullDeck.language} vocabulary pack.`,
      tags: [fullDeck.language || 'Language', 'Community'],
      cards: (fullDeck.cards || []).slice(0, 3).map((c) => ({
        word: c.frontWord,
        meaning: c.backTranslation || 'meaning',
      })),
      totalCards: fullDeck.cards?.length || 10,
      overflowImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&auto=format&fit=crop&q=80',
      views: 1,
      saves: 1,
      likes: 1,
      forks: 0,
      backendDeckId: fullDeck.id,
    };

    try {
      await updateDeck(fullDeck.id, { isPublic: true });
    } catch (err) {
      console.error('Failed to update deck public status:', err);
    }

    setCollections([newCol, ...collections]);
    setIsPublishModalOpen(false);
  };

  const handleClickCard = (col: CommunityCardCollection) => {
    if (col.backendDeckId) {
      try {
        const viewsMap = JSON.parse(localStorage.getItem('duocard_deck_views') || '{}');
        const key = String(col.backendDeckId);
        viewsMap[key] = (Number(viewsMap[key]) || 0) + 1;
        localStorage.setItem('duocard_deck_views', JSON.stringify(viewsMap));
        setCollections((prev) =>
          prev.map((item) =>
            item.backendDeckId === col.backendDeckId ? { ...item, views: item.views + 1 } : item
          )
        );
      } catch (e) {
        console.warn('Failed to increment views', e);
      }
      router.push(`/study/${col.backendDeckId}`);
    } else {
      router.push(`/explore/${col.id}`);
    }
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1440px] mx-auto space-y-7 pb-16">
        <ExploreHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
          currentAccent={currentAccent}
          t={t}
        />

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* GRID */}
          <div className="lg:col-span-8 xl:col-span-9">
            <ExploreCollectionGrid
              filteredCollections={filteredCollections}
              totalCollectionsCount={collections.length}
              searchQuery={searchQuery}
              activeTab={activeTab}
              activeTag={activeTag}
              openMenuCollectionId={openMenuCollectionId}
              forkingCollectionId={forkingCollectionId}
              savingCollectionId={savingCollectionId}
              onResetFilters={() => {
                setSearchQuery('');
                setActiveTab('all');
                setActiveTag(null);
              }}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
              onClickCard={handleClickCard}
              onToggleMenu={(id) => setOpenMenuCollectionId((prev) => (prev === id ? null : id))}
              onOpenForkModal={openForkModal}
              onOpenCloneModal={openCloneModal}
              onToggleLike={handleToggleLike}
              currentAccent={currentAccent}
              t={t}
            />
          </div>

          {/* SIDEBAR - 100% Dynamic Real Deck Tracking */}
          <ExploreSidebar
            trendingCollections={dynamicTrendingCollections}
            onSelectTrending={(item) => {
              const matched = collections.find((c) => c.title.toLowerCase().trim() === item.title.toLowerCase().trim());
              if (matched) {
                openCloneModal(matched);
              } else {
                setSearchQuery(item.title);
              }
            }}
            contributors={dynamicContributors}
            onToggleFollow={handleToggleFollow}
            popularTags={dynamicTags}
            activeTag={activeTag}
            onSelectTag={(tag) => setActiveTag(activeTag === tag ? null : tag)}
            currentAccent={currentAccent}
          />
        </div>

        {/* MODALS */}
        <CloneModal
          cloneModalItem={cloneModalItem}
          onClose={() => setCloneModalItem(null)}
          cloneName={cloneName}
          setCloneName={setCloneName}
          onConfirmClone={handleSaveCollection}
          savingCollectionId={savingCollectionId}
        />

        <ForkModal
          forkModalItem={forkModalItem}
          onClose={() => setForkModalItem(null)}
          forkName={forkName}
          setForkName={setForkName}
          onConfirmFork={handleForkCollection}
          forkingCollectionId={forkingCollectionId}
        />

        <PublishDeckModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          myDecks={myDecks}
          selectedDeckToPublish={selectedDeckToPublish}
          setSelectedDeckToPublish={setSelectedDeckToPublish}
          onPublish={handlePublishDeck}
        />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading explore...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
