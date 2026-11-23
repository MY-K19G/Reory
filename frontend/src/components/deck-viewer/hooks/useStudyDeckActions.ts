'use client';

import { useState } from 'react';
import { Deck, WordDetails } from '@/lib/types';
import { Flashcard, DeckCollectionPreset } from '../types';
import { exportDeckAsJson, exportDeckAsCsv, fetchOrGenerateWordDetails } from '../studyHelpers';
import { getWordFromCache } from '@/lib/dailyWordService';
import confetti from 'canvas-confetti';

interface UseStudyDeckProps {
  deckId: string | number | null;
  apiDeck: Deck | null;
  displayCards: Flashcard[];
  rawCards: Flashcard[];
  currentCard?: Flashcard;
  preset: DeckCollectionPreset;
}

export function useStudyDeckActions({
  deckId,
  apiDeck,
  displayCards,
  rawCards,
  currentCard: initialCard,
  preset,
}: UseStudyDeckProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quick Actions & Modals State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isRemoveCardModalOpen, setIsRemoveCardModalOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentArchived = JSON.parse(localStorage.getItem('duocard_archived_decks') || '[]');
      const currentId = String(apiDeck?.id || deckId || '');
      return currentArchived.includes(currentId);
    } catch {
      return false;
    }
  });
  const [shareCopied, setShareCopied] = useState(false);
  const [isPublicState, setIsPublicState] = useState(false);

  // Word intelligence modal state
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [selectedWordDetails, setSelectedWordDetails] = useState<WordDetails | null>(null);
  const [loadingWordDetails, setLoadingWordDetails] = useState(false);

  // Full-Screen Dedicated Learn Session State
  const [isLearnSessionOpen, setIsLearnSessionOpen] = useState(false);

  const activeCard = displayCards[currentCardIndex] || rawCards[currentCardIndex] || initialCard;

  // Word cover cache lookup via useMemo
  const wordCoverMap = {
    ...(activeCard?.word
      ? (() => {
          if (activeCard.imageUrl) return { [activeCard.word]: activeCard.imageUrl };

          const targetLang = apiDeck?.language?.split(' → ')[0] || preset.sourceLang || 'English';
          const nativeLang = apiDeck?.language?.split(' → ')[1] || preset.targetLang || 'Hindi';
          const cached = getWordFromCache(activeCard.word, targetLang, nativeLang);
          const coverUrl =
            cached?.pexelsPhotos?.[0]?.src ||
            cached?.images?.[0] ||
            null;
          return coverUrl ? { [activeCard.word]: coverUrl } : {};
        })()
      : {}),
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1 < displayCards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 >= 0 ? prev - 1 : displayCards.length - 1));
  };

  const playVoice = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = (preset.sourceLang || apiDeck?.language?.split(' → ')[0] || 'en').toLowerCase();
    utterance.lang = targetLang.includes('japan') ? 'ja-JP' : targetLang.includes('hindi') ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartStudySession = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  const handleExportJson = () => {
    exportDeckAsJson(
      apiDeck?.title || preset.title,
      apiDeck?.description || preset.description,
      apiDeck?.language || preset.languagePair,
      displayCards
    );
    setIsExportModalOpen(false);
  };

  const handleExportCsv = () => {
    exportDeckAsCsv(apiDeck?.title || preset.title, displayCards);
    setIsExportModalOpen(false);
  };

  const handleToggleArchive = () => {
    try {
      const currentArchived = JSON.parse(localStorage.getItem('duocard_archived_decks') || '[]');
      const currentId = String(apiDeck?.id || deckId || '');
      let nextList: string[];
      if (currentArchived.includes(currentId)) {
        nextList = currentArchived.filter((id: string) => id !== currentId);
        setIsArchived(false);
      } else {
        nextList = [...currentArchived, currentId];
        setIsArchived(true);
      }
      localStorage.setItem('duocard_archived_decks', JSON.stringify(nextList));
    } catch {
      // ignore
    }
    setIsArchiveModalOpen(false);
  };

  const handleShowDetails = async () => {
    if (!activeCard) return;
    setLoadingWordDetails(true);
    try {
      const targetLang = preset.sourceLang || apiDeck?.language?.split(' → ')[0] || 'English';
      const nativeLang = preset.targetLang || apiDeck?.language?.split(' → ')[1] || 'Hindi';
      const details = await fetchOrGenerateWordDetails(activeCard.word, String(deckId ?? ''), targetLang, nativeLang, activeCard);
      if (details) {
        setSelectedWordDetails(details);
        setShowWordDetails(true);
      }
    } catch (e) {
      console.error('Failed to load word details', e);
    } finally {
      setLoadingWordDetails(false);
    }
  };

  return {
    currentCardIndex,
    setCurrentCardIndex,
    isFlipped,
    setIsFlipped,
    isSaved,
    setIsSaved,
    isPlayingAudio,
    isShareModalOpen,
    setIsShareModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    isRemoveCardModalOpen,
    setIsRemoveCardModalOpen,
    isArchived,
    shareCopied,
    setShareCopied,
    isPublicState,
    setIsPublicState,
    showWordDetails,
    setShowWordDetails,
    selectedWordDetails,
    loadingWordDetails,
    isLearnSessionOpen,
    setIsLearnSessionOpen,
    wordCoverMap,
    handleNext,
    handlePrev,
    playVoice,
    handleStartStudySession,
    handleExportJson,
    handleExportCsv,
    handleToggleArchive,
    handleShowDetails,
  };
}
