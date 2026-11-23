'use client';

import React from 'react';
import {
  Share2,
  X,
  Check,
  Copy,
  Globe,
  Download,
  FileText,
  Archive,
  Trash2,
  Loader2,
  Search,
} from 'lucide-react';
import { Flashcard } from './types';

// ======================== SHARE MODAL ========================
interface ShareDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPublicState: boolean;
  onTogglePublic: () => void;
  shareCopied: boolean;
  onCopyLink: () => void;
}

export const ShareDeckModal: React.FC<ShareDeckModalProps> = ({
  isOpen,
  onClose,
  isPublicState,
  onTogglePublic,
  shareCopied,
  onCopyLink,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2e2e2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Share Deck</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share this deck with others or to Explore</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Copy URL Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
              Deck Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838] text-slate-700 dark:text-slate-200 select-all"
              />
              <button
                type="button"
                onClick={onCopyLink}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 cursor-pointer shrink-0"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Public on Explore Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200/70 dark:border-[#333333] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Publish to Explore</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isPublicState
                    ? 'Visible to the community on Explore page'
                    : 'Currently private to your library only'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onTogglePublic}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isPublicState ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-[#444] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333333] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== EXPORT MODAL ========================
interface ExportDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
}

export const ExportDeckModal: React.FC<ExportDeckModalProps> = ({
  isOpen,
  onClose,
  onExportJson,
  onExportCsv,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2e2e2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Deck</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download flashcards for backup or external study</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div
            onClick={onExportJson}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-[#333333] hover:border-cyan-500 dark:hover:border-cyan-400 bg-slate-50/60 dark:bg-[#252525] hover:bg-cyan-50/20 dark:hover:bg-cyan-500/5 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  JSON Format (.json)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Complete deck metadata, audio durations, and example sentences.
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
          </div>

          <div
            onClick={onExportCsv}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-[#333333] hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50/60 dark:bg-[#252525] hover:bg-emerald-50/20 dark:hover:bg-emerald-500/5 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  CSV Spreadsheet (.csv)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Standard comma-separated format compatible with Excel and Anki.
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333333] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== ARCHIVE MODAL ========================
interface ArchiveDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArchived: boolean;
  onConfirmArchive: () => void;
}

export const ArchiveDeckModal: React.FC<ArchiveDeckModalProps> = ({
  isOpen,
  onClose,
  isArchived,
  onConfirmArchive,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] p-6 space-y-4 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-1">
          <Archive className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isArchived ? 'Unarchive this deck?' : 'Archive this deck?'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {isArchived
              ? 'This deck will be returned to your active learning collections.'
              : 'Archiving hides the deck from your everyday study queues while preserving all your cards and progress.'}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333333] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmArchive}
            className="flex-1 py-2.5 rounded-full text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md cursor-pointer transition-colors"
          >
            {isArchived ? 'Yes, Unarchive' : 'Yes, Archive'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== REMOVE CARDS MODAL ========================
interface RemoveCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Flashcard[];
  onDeleteCard: (cardId: number) => Promise<void>;
  onBatchDeleteCards: (cardIds: number[]) => Promise<void>;
}

export const RemoveCardsModal: React.FC<RemoveCardsModalProps> = ({
  isOpen,
  onClose,
  cards,
  onDeleteCard,
  onBatchDeleteCards,
}) => {
  const [removeSearch, setRemoveSearch] = React.useState('');
  const [selectedCards, setSelectedCards] = React.useState<Set<number>>(new Set());
  const [cardToRemove, setCardToRemove] = React.useState<Flashcard | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const filteredCards = cards.filter((card) => {
    if (!removeSearch.trim()) return true;
    const q = removeSearch.toLowerCase();
    return (
      card.word.toLowerCase().includes(q) ||
      (card.translation && card.translation.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] p-6 space-y-4 shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2a2a2a] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Remove Cards from Deck
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cards.length} {cards.length === 1 ? 'card' : 'cards'} in this collection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Banner if a card is selected for removal */}
        {cardToRemove && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Delete &ldquo;{cardToRemove.word}&rdquo;?
                </span>
                <p className="text-[11px] text-rose-600/80 dark:text-rose-400 mt-0.5">
                  This will permanently remove this flashcard from your deck.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setCardToRemove(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#2a2a2a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (!cardToRemove) return;
                  setIsDeleting(true);
                  try {
                    await onDeleteCard(cardToRemove.id);
                    setCardToRemove(null);
                  } catch (err) {
                    console.error('Failed to delete card:', err);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Bar & Select All / Batch Action Controls */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search card by word or translation..."
              value={removeSearch}
              onChange={(e) => setRemoveSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
            />
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={
                  cards.length > 0 &&
                  cards.every((c) => selectedCards.has(c.id))
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCards(new Set(cards.map((c) => c.id)));
                  } else {
                    setSelectedCards(new Set());
                  }
                }}
                className="w-4 h-4 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
              />
              <span>Select All ({cards.length})</span>
            </label>

            {selectedCards.size > 0 && (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                {selectedCards.size} selected
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px] max-h-[380px]">
          {filteredCards.map((card, idx) => {
            const isChecked = selectedCards.has(card.id);
            const isSelectedForSingleDelete = cardToRemove?.id === card.id;
            return (
              <div
                key={card.id || `card-${idx}`}
                onClick={() => {
                  setSelectedCards((prev) => {
                    const next = new Set(prev);
                    if (next.has(card.id)) next.delete(card.id);
                    else next.add(card.id);
                    return next;
                  });
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-rose-400 dark:border-rose-700 bg-rose-50/70 dark:bg-rose-950/25 shadow-xs'
                    : isSelectedForSingleDelete
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/15'
                    : 'border-slate-100 dark:border-[#2a2a2a] bg-slate-50/50 dark:bg-[#242424] hover:border-slate-300 dark:hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedCards((prev) => {
                        const next = new Set(prev);
                        if (next.has(card.id)) next.delete(card.id);
                        else next.add(card.id);
                        return next;
                      });
                    }}
                    className="w-4 h-4 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {card.word}
                      </span>
                      {card.reading && card.reading !== card.word && (
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          /{card.reading}/
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {card.translation || 'No translation provided'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardToRemove(card);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                  title={`Remove "${card.word}"`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {cards.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              This deck currently has no cards to remove.
            </div>
          )}
        </div>

        {/* Footer with Batch Delete & Close Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#2a2a2a]">
          <div>
            {selectedCards.size > 0 ? (
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (selectedCards.size === 0) return;
                  const count = selectedCards.size;
                  if (!confirm(`Are you sure you want to delete ${count} selected ${count === 1 ? 'card' : 'cards'}?`)) {
                    return;
                  }

                  setIsDeleting(true);
                  try {
                    await onBatchDeleteCards(Array.from(selectedCards));
                    setSelectedCards(new Set());
                  } catch (err) {
                    console.error('Batch deletion error:', err);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Selected ({selectedCards.size})</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">
                Select cards above to delete in bulk
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCards(new Set());
              onClose();
            }}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333333] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
