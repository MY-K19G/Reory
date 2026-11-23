'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchDeckById, fetchStudyQueue, submitCardReview, deleteCard } from '@/lib/api';
import { Deck, Card } from '@/lib/types';
import { parseDeckIdFromSlug, slugifyDeck, getDeckLanguagePair } from '@/lib/deckLanguages';
import { useI18n } from '@/lib/i18n';

import { Flashcard, DeckCollectionPreset } from './types';
import { StudyProgressTab } from './StudyProgressTab';
import { StudyStatisticsTab } from './StudyStatisticsTab';
import { StudySidebar } from './StudySidebar';
import { LearnSessionModal } from './LearnSessionModal';
import { StudyModalsContainer } from './StudyModalsContainer';
import { StudyHeroHeader } from './StudyHeroHeader';
import { StudyCardsTab } from './StudyCardsTab';
import { useStudyDeckActions } from './hooks/useStudyDeckActions';
import { EditCardModal } from './EditCardModal';

const WordIntelligenceModal = dynamic(
  () => import('./WordIntelligenceModal').then((mod) => mod.WordIntelligenceModal),
  { ssr: false }
);

export default function DeckStudyView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const params = useParams();
  const rawParam = (params?.deckId as string) || (params?.deckSlug as string) || '1';
  const deckId = parseDeckIdFromSlug(rawParam);

  const [activeTab, setActiveTab] = useState<'cards' | 'progress' | 'statistics'>('cards');

  // Cards View Toolbar State
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [cardCategoryFilter, setCardCategoryFilter] = useState<string>('All');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [cardSearchQuery, setCardSearchQuery] = useState('');
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [cardSortOrder, setCardSortOrder] = useState<'default' | 'alpha' | 'alpha-desc'>('default');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);

  // Deck settings state (loaded lazily from localStorage)
  const [dailyNewCards, setDailyNewCards] = useState<number>(() => {
    if (typeof window === 'undefined') return 10;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.dailyNewCards !== undefined) return p.dailyNewCards;
      }
    } catch {
      // ignore
    }
    return 10;
  });
  const [reviewOrder, setReviewOrder] = useState<'srs' | 'random' | 'oldest'>(() => {
    if (typeof window === 'undefined') return 'srs';
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.reviewOrder !== undefined) return p.reviewOrder;
      }
    } catch {
      // ignore
    }
    return 'srs';
  });
  const [cardOrientation, setCardOrientation] = useState<'term-first' | 'meaning-first' | 'audio-only'>(() => {
    if (typeof window === 'undefined') return 'term-first';
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.cardOrientation !== undefined) return p.cardOrientation;
      }
    } catch {
      // ignore
    }
    return 'term-first';
  });
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.autoPlayAudio !== undefined) return p.autoPlayAudio;
      }
    } catch {
      // ignore
    }
    return true;
  });
  const [ttsSpeed, setTtsSpeed] = useState<number>(() => {
    if (typeof window === 'undefined') return 1.0;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.ttsSpeed !== undefined) return p.ttsSpeed;
      }
    } catch {
      // ignore
    }
    return 1.0;
  });
  const [showRomaji, setShowRomaji] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.showRomaji !== undefined) return p.showRomaji;
      }
    } catch {
      // ignore
    }
    return true;
  });
  const [showExamples, setShowExamples] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.showExamples !== undefined) return p.showExamples;
      }
    } catch {
      // ignore
    }
    return true;
  });
  const [showMnemonics, setShowMnemonics] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.showMnemonics !== undefined) return p.showMnemonics;
      }
    } catch {
      // ignore
    }
    return true;
  });
  const [cramMode, setCramMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.cramMode !== undefined) return p.cramMode;
      }
    } catch {
      // ignore
    }
    return false;
  });
  const [mcqOptionsCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 4;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.mcqOptionsCount !== undefined) return p.mcqOptionsCount;
      }
    } catch {
      // ignore
    }
    return 4;
  });
  const [allowForking] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const s = localStorage.getItem(`duocard_deck_settings_${deckId}`);
      if (s) {
        const p = JSON.parse(s);
        if (p.allowForking !== undefined) return p.allowForking;
      }
    } catch {
      // ignore
    }
    return true;
  });
  const [deckTitleInput, setDeckTitleInput] = useState('');
  const [deckDescInput, setDeckDescInput] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Backend integration state
  const [apiDeck, setApiDeck] = useState<Deck | null>(null);
  const [apiCards, setApiCards] = useState<Card[]>([]);

  // User profile & covers
  const [savedCover, setSavedCover] = useState<string>('');
  const [userProfile] = useState<{ name: string; avatar: string }>(() => {
    if (typeof window === 'undefined') return { name: 'Learner', avatar: '' };
    const uName = localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name') || 'Learner';
    const rawAv = localStorage.getItem('duocard_avatar');
    const uAvatar = rawAv && rawAv !== '/profile/avatar.jpg' ? rawAv : '';
    return { name: uName, avatar: uAvatar };
  });

  // Dynamic deck preset
  const preset: DeckCollectionPreset = useMemo(() => {
    const pair = apiDeck ? getDeckLanguagePair(apiDeck) : { targetLang: 'English', nativeLang: 'Hindi' };
    return {
      id: String(deckId || '0'),
      title: apiDeck?.title || 'Deck',
      languagePair: apiDeck ? `${pair.targetLang} → ${pair.nativeLang}` : 'English → Hindi',
      sourceLang: pair.targetLang,
      targetLang: pair.nativeLang,
      author: {
        name: userProfile.name,
        avatar: userProfile.avatar,
      },
      createdOn: apiDeck?.createdAt
        ? new Date(apiDeck.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recently',
      lastUpdated: 'Today',
      totalCards: apiDeck?.cards ? apiDeck.cards.length : 0,
      description: apiDeck?.description || '',
      tags: apiDeck?.tags ? apiDeck.tags.split(',').map((t) => t.trim()) : [],
      bannerImage: apiDeck?.coverImage || '',
      thumbnailImage: apiDeck?.coverImage || '',
      progress: {
        percent: 0,
        cardsLearned: 0,
        newCount: 0,
        reviewCount: 0,
        masteredCount: 0,
      },
      cards: [],
    };
  }, [deckId, apiDeck, userProfile]);

  useEffect(() => {
    if (!deckId) return;

    fetchDeckById(deckId)
      .then((deckData: Deck) => {
        if (deckData) {
          setApiDeck(deckData);
          setDeckTitleInput(deckData.title || '');
          setDeckDescInput(deckData.description || '');

          fetchStudyQueue(deckData.id)
            .then((queueData) => {
              if (queueData && queueData.length > 0) {
                setApiCards(queueData);
              } else if (deckData?.cards && deckData.cards.length > 0) {
                setApiCards(deckData.cards);
              }
            })
            .catch(() => {
              if (deckData?.cards && deckData.cards.length > 0) {
                setApiCards(deckData.cards);
              }
            });

          const parentId = (deckData as { clonedFromDeckId?: number; forkedFromDeckId?: number }).clonedFromDeckId || deckData.forkedFromDeckId;
          const currentHasCover = deckData.coverImage || (deckData.description && /\[Cover:\s*[^\]]+\]/i.test(deckData.description));
          if (parentId && !currentHasCover) {
            try {
              const covers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
              if (covers[String(parentId)] && !covers[String(deckData.id)]) {
                covers[String(deckData.id)] = covers[String(parentId)];
                localStorage.setItem('duocard_deck_covers', JSON.stringify(covers));
                setSavedCover(covers[String(parentId)]);
              } else if (!covers[String(deckData.id)]) {
                fetchDeckById(parentId).then((parentDeck) => {
                  if (parentDeck) {
                    let parentCoverUrl = parentDeck.coverImage;
                    if (!parentCoverUrl && parentDeck.description) {
                      const match = parentDeck.description.match(/\[Cover:\s*([^\]]+)\]/i);
                      if (match && match[1]) parentCoverUrl = match[1].trim();
                    }
                    if (parentCoverUrl) {
                      const updatedCovers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
                      updatedCovers[String(deckData.id)] = parentCoverUrl;
                      localStorage.setItem('duocard_deck_covers', JSON.stringify(updatedCovers));
                      setSavedCover(parentCoverUrl);
                    }
                  }
                }).catch(() => {});
              }
            } catch {
              // ignore
            }
          }

          if (deckData.title && typeof window !== 'undefined') {
            const friendlySlug = slugifyDeck(deckData.id, deckData.title);
            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;
            const prefix = currentPath.includes('/fork')
              ? '/fork'
              : currentPath.includes('/cloned')
              ? '/cloned'
              : currentPath.includes('/archived')
              ? '/archived'
              : '/study';

            if (!currentPath.endsWith(`/${friendlySlug}`)) {
              window.history.replaceState(null, '', `${prefix}/${friendlySlug}${currentSearch}`);
            }
          }
        }
      })
      .catch((err: unknown) => {
        console.log('Using curated deck showcase:', err);
        setDeckTitleInput(preset.title);
        setDeckDescInput(preset.description);
      });

  }, [deckId, preset.title, preset.description]);

  // Raw source cards mapped from api or fallback
  const rawCards: Flashcard[] = useMemo(() => {
    return apiCards.length > 0
      ? apiCards.map((c) => ({
          id: c.id,
          word: c.frontWord,
          reading: c.phonetic || c.frontWord,
          translation: c.backTranslation,
          tags: (() => {
            if (!c.tags) return [c.partOfSpeech || 'Word'];
            return c.tags
              .split(/[,;]+/)
              .map((t) => t.trim())
              .filter((t) => t && t.toLowerCase() !== 'custom')
              .map((t) => (t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t));
          })(),
          exampleOriginal: c.exampleSentence || `Learning "${c.frontWord}" in context.`,
          exampleReading: c.phonetic || '',
          exampleTranslation: c.exampleTranslation || c.backTranslation,
          audioDuration: '0:02',
          imageUrl: c.imageUrl || undefined,
          hint: c.hint || '',
          partOfSpeech: c.partOfSpeech || (c.tags ? c.tags.split(',')[0].trim() : 'Word'),
          metadata: c.metadata,
          status: c.status,
          repetitions: c.repetitions,
          easeFactor: c.easeFactor,
          intervalDays: c.intervalDays,
        }))
      : preset.cards;
  }, [apiCards, preset.cards]);

  const allCardTags = useMemo(() => {
    const set = new Set<string>();
    rawCards.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [rawCards]);

  const displayCards: Flashcard[] = useMemo(() => {
    let list = [...rawCards];

    if (cardCategoryFilter !== 'All') {
      list = list.filter((c) => c.tags.some((t) => t.toLowerCase() === cardCategoryFilter.toLowerCase()));
    }

    if (cardSearchQuery.trim()) {
      const q = cardSearchQuery.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.word.toLowerCase().includes(q) ||
          c.translation.toLowerCase().includes(q) ||
          (c.reading && c.reading.toLowerCase().includes(q))
      );
    }

    if (cardSortOrder === 'alpha') {
      list.sort((a, b) => a.word.localeCompare(b.word));
    } else if (cardSortOrder === 'alpha-desc') {
      list.sort((a, b) => b.word.localeCompare(a.word));
    }

    return list;
  }, [rawCards, cardCategoryFilter, cardSearchQuery, cardSortOrder]);

  const totalCards = apiCards.length > 0 ? apiCards.length : (apiDeck?.cards ? apiDeck.cards.length : preset.totalCards);

  const actions = useStudyDeckActions({
    deckId,
    apiDeck,
    displayCards,
    rawCards,
    currentCard: displayCards[0] || rawCards[0],
    preset,
  });

  // URL Query Sync for Learn Session (?session=learn)
  useEffect(() => {
    const sessionParam = searchParams.get('session');
    if (sessionParam === 'learn') {
      actions.setIsLearnSessionOpen(true);
    } else if (sessionParam === null && actions.isLearnSessionOpen) {
      // If user navigated back in browser history
      actions.setIsLearnSessionOpen(false);
    }
  }, [searchParams]);

  // Multi-tab synchronization via BroadcastChannel & storage events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(`duocard_deck_session_${deckId}`);
      channel.onmessage = (event) => {
        if (event.data?.type === 'SESSION_START') {
          actions.setIsLearnSessionOpen(true);
        } else if (event.data?.type === 'SESSION_CLOSE') {
          actions.setIsLearnSessionOpen(false);
        }
      };
    } catch {
      // BroadcastChannel fallback if unsupported
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `duocard_learn_session_active_${deckId}`) {
        if (e.newValue === 'true') {
          actions.setIsLearnSessionOpen(true);
        } else if (e.newValue === 'false') {
          actions.setIsLearnSessionOpen(false);
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [deckId, actions]);

  const handleStartLearnSession = () => {
    actions.setIsLearnSessionOpen(true);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('session', 'learn');
        window.history.pushState(null, '', url.toString());

        // Notify other tabs
        localStorage.setItem(`duocard_learn_session_active_${deckId}`, 'true');
        const channel = new BroadcastChannel(`duocard_deck_session_${deckId}`);
        channel.postMessage({ type: 'SESSION_START', timestamp: Date.now() });
        channel.close();
      } catch {
        // ignore
      }
    }
  };

  const handleCloseLearnSession = () => {
    actions.setIsLearnSessionOpen(false);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('session');
        window.history.pushState(null, '', url.toString());

        // Notify other tabs
        localStorage.setItem(`duocard_learn_session_active_${deckId}`, 'false');
        const channel = new BroadcastChannel(`duocard_deck_session_${deckId}`);
        channel.postMessage({ type: 'SESSION_CLOSE', timestamp: Date.now() });
        channel.close();
      } catch {
        // ignore
      }
    }
  };

  const currentCard = displayCards[actions.currentCardIndex] || displayCards[0] || rawCards[0];

  const rawDescription = apiDeck?.description || preset.description || '';
  const cleanDescription = rawDescription
    .replace(/\[Cover:\s*[^\]]+\]/gi, '')
    .replace(/\[CoverPos:\s*[^\]]+\]/gi, '')
    .replace(/\[Native:\s*[^\]]+\]/gi, '')
    .trim();

  const deckCoverImage = useMemo(() => {
    const coverMatch = rawDescription.match(/\[Cover:\s*([^\]]+)\]/i);
    if (coverMatch && coverMatch[1]) {
      return coverMatch[1].trim();
    }
    if (apiDeck?.coverImage) {
      return apiDeck.coverImage;
    }
    if (savedCover) {
      return savedCover;
    }
    return preset.bannerImage || preset.thumbnailImage || '';
  }, [rawDescription, apiDeck, savedCover, preset.bannerImage, preset.thumbnailImage]);

  const langPair = apiDeck
    ? (() => {
        const p = getDeckLanguagePair(apiDeck);
        return `${p.targetLang} → ${p.nativeLang}`;
      })()
    : preset.languagePair;

  const deckLanguage = apiDeck
    ? getDeckLanguagePair(apiDeck)
    : (() => {
        const parts = preset.languagePair.split(' → ');
        return { targetLang: parts[0] || '', nativeLang: parts[1] || '' };
      })();

  const progressStats = useMemo(() => {
    const cards = apiCards.length > 0 ? apiCards : (apiDeck?.cards && apiDeck.cards.length > 0 ? apiDeck.cards : []);
    if (cards.length === 0) {
      return {
        totalCards: displayCards.length,
        cardsLearned: 0,
        newCount: displayCards.length,
        reviewCount: 0,
        masteredCount: 0,
        percent: 0,
        newPct: 100,
        reviewPct: 0,
        masteredPct: 0,
        createdOn: apiDeck?.createdAt ? new Date(apiDeck.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : preset.createdOn,
      };
    }

    let mastered = 0;
    let learning = 0;
    let fresh = 0;
    cards.forEach((c) => {
      if (c.status === 'MASTERED') mastered++;
      else if (c.status === 'LEARNING' || c.status === 'REVIEW') learning++;
      else fresh++;
    });
    const total = cards.length;
    const learned = mastered + learning;
    const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
    return {
      totalCards: total,
      cardsLearned: learned,
      newCount: fresh,
      reviewCount: learning,
      masteredCount: mastered,
      percent,
      newPct: total > 0 ? Math.round((fresh / total) * 100) : 0,
      reviewPct: total > 0 ? Math.round((learning / total) * 100) : 0,
      masteredPct: total > 0 ? Math.round((mastered / total) * 100) : 0,
      createdOn: apiDeck?.createdAt ? new Date(apiDeck.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : preset.createdOn,
    };
  }, [apiDeck, apiCards, displayCards.length, preset.createdOn]);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-4 sm:pb-5 lg:pb-6 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto pb-2 space-y-4">
        <div className="flex items-center gap-3.5 text-xs sm:text-sm flex-wrap">
          <Link
            href="/my-cards"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xs text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer font-medium hover:shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 stroke-[2.2]" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">{t('backToCollections')}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <StudyHeroHeader
              apiDeck={apiDeck}
              preset={preset}
              deckCoverImage={deckCoverImage}
              langPair={langPair}
              cleanDescription={cleanDescription}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {activeTab === 'cards' && (
              <StudyCardsTab
                onEditCard={() => setIsEditCardModalOpen(true)}
                viewMode={viewMode}
                setViewMode={setViewMode}
                displayCards={displayCards}
                currentCardIndex={actions.currentCardIndex}
                setCurrentCardIndex={actions.setCurrentCardIndex}
                handlePrev={actions.handlePrev}
                handleNext={actions.handleNext}
                cardCategoryFilter={cardCategoryFilter}
                setCardCategoryFilter={setCardCategoryFilter}
                isCategoryDropdownOpen={isCategoryDropdownOpen}
                setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
                allCardTags={allCardTags}
                isSearchInputOpen={isSearchInputOpen}
                setIsSearchInputOpen={setIsSearchInputOpen}
                cardSearchQuery={cardSearchQuery}
                setCardSearchQuery={setCardSearchQuery}
                cardSortOrder={cardSortOrder}
                setCardSortOrder={setCardSortOrder}
                isSortDropdownOpen={isSortDropdownOpen}
                setIsSortDropdownOpen={setIsSortDropdownOpen}
                currentCard={currentCard}
                deckId={deckId}
                wordCoverMap={actions.wordCoverMap}
                selectedWordDetails={actions.selectedWordDetails}
                cardOrientation={cardOrientation}
                deckLanguage={deckLanguage}
                isFlipped={actions.isFlipped}
                setIsFlipped={actions.setIsFlipped}
                playVoice={actions.playVoice}
                isPlayingAudio={actions.isPlayingAudio}
                handleShowDetails={actions.handleShowDetails}
                loadingWordDetails={actions.loadingWordDetails}
                isSaved={actions.isSaved}
                setIsSaved={actions.setIsSaved}
                showRomaji={showRomaji}
                showMnemonics={showMnemonics}
                showExamples={showExamples}
              />
            )}

            {activeTab === 'progress' && (
              <StudyProgressTab
                progress={progressStats}
                totalCards={totalCards}
                onPracticeWeak={handleStartLearnSession}
              />
            )}

            {activeTab === 'statistics' && (
              <StudyStatisticsTab
                cards={apiCards.length > 0 ? apiCards : (apiDeck?.cards || [])}
                totalCards={totalCards}
                deckId={deckId}
              />
            )}
          </div>

          <StudySidebar
            apiDeck={apiDeck}
            deckId={deckId}
            preset={preset}
            langPair={langPair}
            totalCards={totalCards}
            progressStats={progressStats}
            isArchived={actions.isArchived}
            onStartLearning={handleStartLearnSession}
            onPracticeQuiz={() => {
              const friendlySlug = apiDeck?.title ? slugifyDeck(apiDeck.id, apiDeck.title) : String(deckId);
              router.push(`/quiz/${friendlySlug}`);
            }}
            onAddCards={() => {
              const targetId = apiDeck?.id || deckId;
              router.push(`/decks/new?deckId=${targetId}`);
            }}
            onRemoveCards={() => actions.setIsRemoveCardModalOpen(true)}
            onEditDeck={() => {
              const targetId = apiDeck?.id || deckId;
              router.push(`/decks/create?id=${targetId}`);
            }}
            onShareDeck={() => actions.setIsShareModalOpen(true)}
            onOpenSettings={() => actions.setIsSettingsModalOpen(true)}
            onExportDeck={() => actions.setIsExportModalOpen(true)}
            onToggleArchiveModal={() => actions.setIsArchiveModalOpen(true)}
          />
        </div>
      </div>

      <WordIntelligenceModal
        isOpen={actions.showWordDetails}
        onClose={() => actions.setShowWordDetails(false)}
        selectedWordDetails={actions.selectedWordDetails}
        loadingWordDetails={actions.loadingWordDetails}
        targetLang={deckLanguage.targetLang}
        nativeLang={deckLanguage.nativeLang}
        cardId={currentCard?.id}
        onImageUpdated={(newImg) => {
          if (currentCard?.id) {
            setApiCards((prev) =>
              prev.map((c) => (c.id === currentCard.id ? { ...c, imageUrl: newImg } : c))
            );
          }
        }}
      />

      <StudyModalsContainer
        isShareModalOpen={actions.isShareModalOpen}
        setIsShareModalOpen={actions.setIsShareModalOpen}
        isPublicState={actions.isPublicState}
        setIsPublicState={actions.setIsPublicState}
        apiDeck={apiDeck}
        setApiDeck={setApiDeck}
        shareCopied={actions.shareCopied}
        setShareCopied={actions.setShareCopied}
        isSettingsModalOpen={actions.isSettingsModalOpen}
        setIsSettingsModalOpen={actions.setIsSettingsModalOpen}
        deckId={deckId}
        dailyNewCards={dailyNewCards}
        setDailyNewCards={setDailyNewCards}
        reviewOrder={reviewOrder}
        setReviewOrder={setReviewOrder}
        cramMode={cramMode}
        setCramMode={setCramMode}
        autoPlayAudio={autoPlayAudio}
        setAutoPlayAudio={setAutoPlayAudio}
        ttsSpeed={ttsSpeed}
        setTtsSpeed={setTtsSpeed}
        cardOrientation={cardOrientation}
        setCardOrientation={setCardOrientation}
        showRomaji={showRomaji}
        setShowRomaji={setShowRomaji}
        showExamples={showExamples}
        setShowExamples={setShowExamples}
        showMnemonics={showMnemonics}
        setShowMnemonics={setShowMnemonics}
        mcqOptionsCount={mcqOptionsCount}
        allowForking={allowForking}
        deckTitleInput={deckTitleInput}
        deckDescInput={deckDescInput}
        isSavingSettings={isSavingSettings}
        setIsSavingSettings={setIsSavingSettings}
        router={router}
        isExportModalOpen={actions.isExportModalOpen}
        setIsExportModalOpen={actions.setIsExportModalOpen}
        handleExportJson={actions.handleExportJson}
        handleExportCsv={actions.handleExportCsv}
        isArchiveModalOpen={actions.isArchiveModalOpen}
        setIsArchiveModalOpen={actions.setIsArchiveModalOpen}
        isArchived={actions.isArchived}
        handleToggleArchive={actions.handleToggleArchive}
        isRemoveCardModalOpen={actions.isRemoveCardModalOpen}
        setIsRemoveCardModalOpen={actions.setIsRemoveCardModalOpen}
        displayCards={displayCards}
        deleteCard={deleteCard}
        setApiCards={setApiCards}
        setCurrentCardIndex={actions.setCurrentCardIndex}
      />

      <LearnSessionModal
        isOpen={actions.isLearnSessionOpen}
        onClose={handleCloseLearnSession}
        apiDeck={apiDeck}
        preset={preset}
        deckId={deckId}
        sessionCards={displayCards.length > 0 ? displayCards : rawCards}
        autoPlayAudio={autoPlayAudio}
        setAutoPlayAudio={setAutoPlayAudio}
        ttsSpeed={ttsSpeed}
        setTtsSpeed={setTtsSpeed}
        cardOrientation={cardOrientation}
        setCardOrientation={setCardOrientation}
        showRomaji={showRomaji}
        setShowRomaji={setShowRomaji}
        showExamples={showExamples}
        setShowExamples={setShowExamples}
        showMnemonics={showMnemonics}
        cramMode={cramMode}
        dailyNewCards={dailyNewCards}
        reviewOrder={reviewOrder}
        mcqOptionsCount={mcqOptionsCount}
        allowForking={allowForking}
        deckLanguage={deckLanguage}
        onStartStudySession={actions.handleStartStudySession}
        onSubmitCardReview={submitCardReview}
      />

      <EditCardModal
        isOpen={isEditCardModalOpen}
        onClose={() => setIsEditCardModalOpen(false)}
        card={currentCard}
        onCardUpdated={(updatedFlashcard) => {
          setApiCards((prev) =>
            prev.map((c) =>
              c.id === updatedFlashcard.id
                ? {
                    ...c,
                    frontWord: updatedFlashcard.word,
                    backTranslation: updatedFlashcard.translation,
                    phonetic: updatedFlashcard.reading,
                    exampleSentence: updatedFlashcard.exampleOriginal,
                    exampleTranslation: updatedFlashcard.exampleTranslation,
                    hint: updatedFlashcard.hint,
                  }
                : c
            )
          );
        }}
      />
    </div>
  );
}
