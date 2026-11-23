'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Award,
  Flame,
  BarChart2,
  Clock,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { fetchDeckById } from '@/lib/api';
import { Deck } from '@/lib/types';
import { ExploreDeckDetails, Flashcard } from './types';
import { DeckFlashcardViewer } from './DeckFlashcardViewer';
import { DeckSidebarDetails } from './DeckSidebarDetails';

export default function ExploreDeckDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.id as string) || '';

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'cards' | 'progress' | 'statistics'>('cards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (!rawId) {
      setLoading(false);
      setError('Deck ID was not specified.');
      return;
    }

    setLoading(true);
    setError(null);

    // Extract deck ID if slugified (e.g., "11-spanish-deck" -> "11" or "deck-11" -> "11")
    const cleanId = rawId.replace(/^deck-/, '').split('-')[0];

    fetchDeckById(cleanId)
      .then((data) => {
        if (!data || !data.id) {
          setError(`Deck #${cleanId} was not found or has been removed.`);
          setDeck(null);
        } else {
          setDeck(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching deck:', err);
        setError(`Unable to load deck #${cleanId}. Please check your connection or verify if this deck exists.`);
        setDeck(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rawId]);

  const playVoice = (text: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 text-accent-primary animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Loading Deck Details...</h2>
        <p className="text-xs text-slate-400 mt-1">Fetching collection data from the database.</p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Deck Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {error || 'This collection could not be loaded because it does not exist in the database.'}
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary text-white font-semibold text-xs shadow-md shadow-accent-primary/20 hover:opacity-90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  // Parse deck data dynamically
  const authorName =
    (typeof window !== 'undefined'
      ? localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name')
      : null) || 'Learner';
  const rawAuthorAv = typeof window !== 'undefined' ? localStorage.getItem('duocard_avatar') : null;
  const authorAvatar = rawAuthorAv && rawAuthorAv !== '/profile/avatar.jpg' ? rawAuthorAv : '';

  let cover = deck.coverImage;
  if (!cover && deck.description) {
    const match = deck.description.match(/\[Cover:\s*([^\]]+)\]/i);
    if (match && match[1]) cover = match[1].trim();
  }
  if (!cover) {
    cover = 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop&q=80';
  }

  const cleanDescription = (deck.description || `Explore ${deck.title} vocabulary pack.`)
    .replace(/\[Native:\s*[^\]]+\]/gi, '')
    .replace(/\[Cover:\s*[^\]]+\]/gi, '')
    .replace(/\[POS:\s*[^\]]+\]/gi, '')
    .trim();

  const parsedTags = deck.tags
    ? deck.tags.split(/[,;]/).map((t) => t.trim()).filter(Boolean)
    : [deck.language || 'Language', deck.level || 'General'];

  const deckCards: Flashcard[] = (deck.cards || []).map((c) => ({
    id: c.id,
    word: c.frontWord,
    reading: c.phonetic || c.frontWord,
    translation: c.backTranslation,
    tags: c.tags ? c.tags.split(/[,;]/).map((t) => t.trim()).filter(Boolean) : [c.partOfSpeech || 'Word'],
    exampleOriginal: c.exampleSentence || `${c.frontWord} を勉強しています。`,
    exampleReading: c.phonetic || '',
    exampleTranslation: c.exampleTranslation || c.backTranslation,
    audioDuration: '0:02',
  }));

  const collection: ExploreDeckDetails = {
    id: String(deck.id),
    title: deck.title,
    languagePair: deck.language || 'English → Target',
    sourceLang: deck.language?.split(' → ')[0] || 'English',
    targetLang: deck.language?.split(' → ')[1] || 'Target',
    author: {
      name: authorName,
      avatar: authorAvatar,
    },
    createdOn: deck.createdAt
      ? new Date(deck.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Recently',
    lastUpdated: 'Recently',
    totalCards: deckCards.length,
    description: cleanDescription,
    tags: parsedTags,
    bannerImage: cover,
    thumbnailImage: cover,
    progress: {
      percent: 0,
      cardsLearned: 0,
      newCount: deckCards.length,
      reviewCount: 0,
      masteredCount: 0,
    },
    cards: deckCards,
  };

  const fallbackCard: Flashcard = {
    id: 0,
    word: '',
    reading: '',
    translation: '',
    tags: [],
    exampleOriginal: '',
    exampleReading: '',
    exampleTranslation: '',
    audioDuration: '0:00',
  };
  const currentCard = collection.cards[currentCardIndex] || collection.cards[0] || fallbackCard;

  const handleNext = () => {
    if (collection.cards.length === 0) return;
    setCurrentCardIndex((prev) => (prev + 1) % collection.cards.length);
  };

  const handlePrev = () => {
    if (collection.cards.length === 0) return;
    setCurrentCardIndex((prev) => (prev - 1 + collection.cards.length) % collection.cards.length);
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-4 sm:pb-5 lg:pb-6 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1440px] mx-auto pb-2 space-y-4">
        {/* TOP BREADCRUMB */}
        <div className="flex items-center gap-3.5 text-xs sm:text-sm flex-wrap">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xs text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer font-medium hover:shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 stroke-[2.2]" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">Back to Collections</span>
          </Link>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT SECTION */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* HERO CARD */}
            <div className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-100 dark:border-[#2e2e2e] bg-white dark:bg-[#1f1f1f]">
              <div className="absolute inset-y-0 right-0 w-3/5 sm:w-1/2 lg:w-3/5 overflow-hidden pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collection.bannerImage}
                  alt={collection.title}
                  className="w-full h-full object-cover object-right opacity-95 dark:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/90 dark:to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-[#1f1f1f] dark:via-[#1f1f1f]/50 dark:to-transparent" />
              </div>

              <div className="relative z-10 p-6 sm:p-7 space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-[#2e2e2e] shadow-sm bg-slate-100 dark:bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={collection.thumbnailImage}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
                          {collection.title}
                        </h1>
                        <span className="text-[11px] font-semibold text-accent-primary dark:text-slate-200 bg-accent-primary/10 dark:bg-[#282828] px-2.5 py-0.5 rounded-full border border-[#ea7a54]/20/80 dark:border-[#383838]">
                          {collection.languagePair}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl line-clamp-2 leading-relaxed">
                        {collection.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {collection.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/explore?q=${encodeURIComponent(tag)}`}
                            className="px-3 py-0.5 rounded-full bg-slate-100/90 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 hover:text-accent-primary dark:text-slate-300 dark:hover:text-white border border-transparent hover:border-slate-200 dark:border-[#2e2e2e] dark:hover:border-white/15 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Tabs */}
                <div className="flex items-center gap-8 pt-4 border-t border-slate-100/80 dark:border-[#2e2e2e] -mx-6 -mb-6 px-6 sm:-mx-7 sm:-mb-7 sm:px-7">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cards')}
                    className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative cursor-pointer ${activeTab === 'cards'
                        ? 'text-accent-primary dark:text-[#f59e7e] border-b-2 border-[#5551f3] dark:border-[#f59e7e]'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('progress')}
                    className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative cursor-pointer ${activeTab === 'progress'
                        ? 'text-accent-primary dark:text-[#f59e7e] border-b-2 border-[#5551f3] dark:border-[#f59e7e]'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Progress</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('statistics')}
                    className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative cursor-pointer ${activeTab === 'statistics'
                        ? 'text-accent-primary dark:text-[#f59e7e] border-b-2 border-[#5551f3] dark:border-[#f59e7e]'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Statistics</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TAB: CARDS */}
            {activeTab === 'cards' && (
              <DeckFlashcardViewer
                currentCard={currentCard}
                currentCardIndex={currentCardIndex}
                totalCards={collection.cards.length}
                sourceLang={collection.sourceLang}
                onPrev={handlePrev}
                onNext={handleNext}
                playVoice={playVoice}
                isPlayingAudio={isPlayingAudio}
                isSaved={isSaved}
                onToggleSaved={() => setIsSaved(!isSaved)}
              />
            )}

            {/* TAB: PROGRESS */}
            {activeTab === 'progress' && (
              <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2e2e2e]">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-primary dark:text-[#f59e7e]">
                      Learning Breakdown
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] dark:text-white mt-0.5">
                      SRS Memory Stage Distribution
                    </h2>
                  </div>
                  <span className="text-xl font-black text-accent-primary dark:text-[#f59e7e]">
                    {collection.progress.percent}%
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-300">
                        New Vocabulary ({collection.progress.newCount} cards)
                      </span>
                      <span className="text-slate-400">82%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-300">
                        In Review &amp; Learning ({collection.progress.reviewCount} cards)
                      </span>
                      <span className="text-slate-400">14%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[14%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-300">
                        Mastered &amp; Retained ({collection.progress.masteredCount} cards)
                      </span>
                      <span className="text-slate-400">10%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[10%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: STATISTICS */}
            {activeTab === 'statistics' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[#2e2e2e] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#2e2e2e]">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-accent-primary dark:text-[#f59e7e]">
                        Deck Analytics
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] dark:text-white mt-0.5">
                        Study Session Statistics
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>5 Days Streak</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Accuracy</span>
                        <BarChart2 className="w-4 h-4 text-accent-primary" />
                      </div>
                      <div className="text-2xl font-black text-[#1e293b] dark:text-white">88%</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">First-attempt recall</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Total Time</span>
                        <Clock className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-black text-[#1e293b] dark:text-white">1h 45m</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Studied across sessions</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Avg Response</span>
                        <Sparkles className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div className="text-2xl font-black text-[#1e293b] dark:text-white">3.2s</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Per card flip</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Mastery Rate</span>
                        <Award className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92%</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Long-term retention</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <DeckSidebarDetails
            collection={collection}
            onStudy={() => router.push(`/study/${deck.id}`)}
            onPracticeQuiz={() => router.push(`/quiz/${deck.id}`)}
            onShare={() => {
              if (navigator.share) {
                navigator.share({ title: collection.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
