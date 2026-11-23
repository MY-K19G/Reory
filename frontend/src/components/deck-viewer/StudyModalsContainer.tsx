'use client';

import React from 'react';
import { updateDeck, deleteDeck } from '@/lib/api';
import { Deck } from '@/lib/types';
import { ShareDeckModal, ExportDeckModal, ArchiveDeckModal, RemoveCardsModal } from './StudyModals';
import { DeckSettingsModal } from './DeckSettingsModal';
import { Flashcard } from './types';

interface StudyModalsContainerProps {
  isShareModalOpen: boolean;
  setIsShareModalOpen: (val: boolean) => void;
  isPublicState: boolean;
  setIsPublicState: (val: boolean) => void;
  apiDeck: Deck | null;
  setApiDeck: React.Dispatch<React.SetStateAction<Deck | null>>;
  shareCopied: boolean;
  setShareCopied: (val: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (val: boolean) => void;
  deckId: string;
  dailyNewCards: number;
  setDailyNewCards: (val: number) => void;
  reviewOrder: 'srs' | 'random' | 'oldest';
  setReviewOrder: (val: 'srs' | 'random' | 'oldest') => void;
  cramMode: boolean;
  setCramMode: (val: boolean) => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (val: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (val: number) => void;
  cardOrientation: 'term-first' | 'meaning-first' | 'audio-only';
  setCardOrientation: (val: 'term-first' | 'meaning-first' | 'audio-only') => void;
  showRomaji: boolean;
  setShowRomaji: (val: boolean) => void;
  showExamples: boolean;
  setShowExamples: (val: boolean) => void;
  showMnemonics: boolean;
  setShowMnemonics: (val: boolean) => void;
  mcqOptionsCount: number;
  allowForking: boolean;
  deckTitleInput: string;
  deckDescInput: string;
  isSavingSettings: boolean;
  setIsSavingSettings: (val: boolean) => void;
  router: any;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (val: boolean) => void;
  handleExportJson: () => void;
  handleExportCsv: () => void;
  isArchiveModalOpen: boolean;
  setIsArchiveModalOpen: (val: boolean) => void;
  isArchived: boolean;
  handleToggleArchive: () => void;
  isRemoveCardModalOpen: boolean;
  setIsRemoveCardModalOpen: (val: boolean) => void;
  displayCards: Flashcard[];
  deleteCard: (id: number) => Promise<any>;
  setApiCards: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const StudyModalsContainer: React.FC<StudyModalsContainerProps> = ({
  isShareModalOpen,
  setIsShareModalOpen,
  isPublicState,
  setIsPublicState,
  apiDeck,
  setApiDeck,
  shareCopied,
  setShareCopied,
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  deckId,
  dailyNewCards,
  setDailyNewCards,
  reviewOrder,
  setReviewOrder,
  cramMode,
  setCramMode,
  autoPlayAudio,
  setAutoPlayAudio,
  ttsSpeed,
  setTtsSpeed,
  cardOrientation,
  setCardOrientation,
  showRomaji,
  setShowRomaji,
  showExamples,
  setShowExamples,
  showMnemonics,
  setShowMnemonics,
  mcqOptionsCount,
  allowForking,
  deckTitleInput,
  deckDescInput,
  isSavingSettings,
  setIsSavingSettings,
  router,
  isExportModalOpen,
  setIsExportModalOpen,
  handleExportJson,
  handleExportCsv,
  isArchiveModalOpen,
  setIsArchiveModalOpen,
  isArchived,
  handleToggleArchive,
  isRemoveCardModalOpen,
  setIsRemoveCardModalOpen,
  displayCards,
  deleteCard,
  setApiCards,
  setCurrentCardIndex,
}) => {
  return (
    <>
      <ShareDeckModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isPublicState={isPublicState}
        onTogglePublic={async () => {
          const nextVal = !isPublicState;
          setIsPublicState(nextVal);
          if (apiDeck?.id) {
            try {
              const updated = await updateDeck(apiDeck.id, {
                isPublic: nextVal,
                ...({ public: nextVal } as any),
              });
              setApiDeck((prev) => (prev ? { ...prev, isPublic: nextVal } : updated));
            } catch (err) {
              console.error('Failed to toggle public state:', err);
              setIsPublicState(!nextVal);
            }
          }
        }}
        shareCopied={shareCopied}
        onCopyLink={() => {
          if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
          }
        }}
      />

      <DeckSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        apiDeck={apiDeck}
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
        isPublicState={isPublicState}
        isSavingSettings={isSavingSettings}
        onSaveSettings={async () => {
          try {
            localStorage.setItem(
              `duocard_deck_settings_${deckId}`,
              JSON.stringify({
                dailyNewCards,
                reviewOrder,
                cardOrientation,
                autoPlayAudio,
                ttsSpeed,
                showRomaji,
                showExamples,
                showMnemonics,
                cramMode,
                mcqOptionsCount,
                allowForking,
              })
            );
          } catch (e) {
            console.warn('Failed saving deck settings to storage:', e);
          }

          if (apiDeck?.id) {
            setIsSavingSettings(true);
            try {
              const updated = await updateDeck(apiDeck.id, {
                title: deckTitleInput.trim(),
                description: deckDescInput.trim(),
                isPublic: isPublicState,
              });
              setApiDeck(updated);
            } catch (err) {
              console.error('Failed to update deck settings:', err);
            } finally {
              setIsSavingSettings(false);
            }
          }
          setIsSettingsModalOpen(false);
        }}
        onDeleteDeck={async () => {
          if (!apiDeck?.id) return;
          if (confirm(`Are you sure you want to delete the deck "${apiDeck.title}"? This will permanently remove all cards in this deck.`)) {
            try {
              await deleteDeck(apiDeck.id);
              localStorage.removeItem(`duocard_deck_settings_${deckId}`);
              window.dispatchEvent(new Event('active_deck_changed'));
              router.push('/my-cards');
            } catch (e) {
              console.error('Failed to delete deck:', e);
              alert('Could not delete deck. Please try again.');
            }
          }
        }}
      />

      <ExportDeckModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
      />

      <ArchiveDeckModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        isArchived={isArchived}
        onConfirmArchive={handleToggleArchive}
      />

      <RemoveCardsModal
        isOpen={isRemoveCardModalOpen}
        onClose={() => setIsRemoveCardModalOpen(false)}
        cards={displayCards}
        onDeleteCard={async (cardId) => {
          await deleteCard(cardId);
          setApiCards((prev) => {
            const updated = prev.filter((c) => c.id !== cardId);
            setCurrentCardIndex((curr) => Math.max(0, Math.min(curr, updated.length - 1)));
            return updated;
          });
          setApiDeck((prev) => {
            if (!prev || !prev.cards) return prev;
            return {
              ...prev,
              cards: prev.cards.filter((c) => c.id !== cardId),
            };
          });
        }}
        onBatchDeleteCards={async (cardIds) => {
          await Promise.allSettled(cardIds.map((id) => deleteCard(id)));
          const idSet = new Set(cardIds);
          setApiCards((prev) => {
            const updated = prev.filter((c) => !idSet.has(c.id));
            setCurrentCardIndex((curr) => Math.max(0, Math.min(curr, updated.length - 1)));
            return updated;
          });
          setApiDeck((prev) => {
            if (!prev || !prev.cards) return prev;
            return {
              ...prev,
              cards: prev.cards.filter((c) => !idSet.has(c.id)),
            };
          });
        }}
      />
    </>
  );
};
