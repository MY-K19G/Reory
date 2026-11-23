'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Loader2 } from 'lucide-react';
import { Flashcard } from './types';
import { updateCard } from '@/lib/api';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Flashcard | undefined;
  onCardUpdated: (updatedCard: Flashcard) => void;
}

export function EditCardModal({ isOpen, onClose, card, onCardUpdated }: EditCardModalProps) {
  const [hint, setHint] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setHint(card.hint || '');
      setError(null);
    }
  }, [card, isOpen]);

  if (!isOpen || !card) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updated = await updateCard(card.id, {
        frontWord: card.word,
        backTranslation: card.translation,
        phonetic: card.reading || '',
        exampleSentence: card.exampleOriginal || '',
        exampleTranslation: card.exampleTranslation || '',
        hint: hint.trim(),
      });

      const updatedFlashcard: Flashcard = {
        ...card,
        hint: updated.hint || '',
      };

      onCardUpdated(updatedFlashcard);
      onClose();
    } catch (err: unknown) {
      console.error('Failed to update card:', err);
      setError('Failed to update card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Edit Note</h3>
              <p className="text-xs text-slate-400">Add or edit your personal memory hint for &ldquo;{card.word}&rdquo;</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Word preview banner */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#282828] border border-slate-200/60 dark:border-[#383838] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Word</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{card.word}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Translation</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{card.translation}</span>
            </div>
          </div>

          {/* Memory Hint / Note ONLY */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Note / Memory Hint <span className="text-[10px] text-slate-400 font-normal">(Leave empty to hide completely)</span>
            </label>
            <textarea
              rows={4}
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Write your note or memory clue here... If left empty, it will be hidden."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#282828] border border-slate-200 dark:border-[#383838] text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:border-accent-primary resize-none"
              autoFocus
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#2f2f2f] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#282828] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-primary hover:opacity-95 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
