'use client';

import Link from 'next/link';
import { Share2, X, Plus, CheckCircle2 } from 'lucide-react';
import { Deck } from '@/lib/types';

interface PublishDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  myDecks: Deck[];
  selectedDeckToPublish: Deck | null;
  setSelectedDeckToPublish: (deck: Deck) => void;
  onPublish: () => void;
}

export function PublishDeckModal({
  isOpen,
  onClose,
  myDecks,
  selectedDeckToPublish,
  setSelectedDeckToPublish,
  onPublish,
}: PublishDeckModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-[#2e2e2e] p-6 space-y-5 shadow-2xl cursor-default"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-accent-primary/10 dark:bg-[#282828] border border-accent-subtle dark:border-[#383838] text-accent-primary dark:text-white flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1e293b] dark:text-white">Share Deck</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publish your vocabulary deck for learners worldwide.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {myDecks.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">No decks found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create flashcards first with our AI generator to share them with the community.
            </p>
            <Link
              href="/decks/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-primary dark:bg-white text-white dark:text-black font-bold text-xs"
            >
              <Plus className="w-4 h-4" /> Generate Word
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                Select Deck to Publish
              </label>
              <select
                value={selectedDeckToPublish?.id || myDecks[0]?.id}
                onChange={(e) => {
                  const found = myDecks.find((d) => d.id === Number(e.target.value));
                  if (found) setSelectedDeckToPublish(found);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838] text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 cursor-pointer"
              >
                {myDecks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.icon} {d.title} ({d.cards?.length || 0} cards) - {d.language}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-accent-primary/10 dark:bg-[#282828] border border-accent-subtle dark:border-[#383838] text-xs text-indigo-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-primary dark:text-white shrink-0" />
              <span>
                Your collection will immediately appear on the Explore page with interactive card chips and 1-click clone support.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#2e2e2e]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onPublish}
                className="px-5 py-2 rounded-full bg-accent-primary dark:bg-white hover:opacity-90 dark:hover:bg-slate-200 text-white dark:text-black font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Publish Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
