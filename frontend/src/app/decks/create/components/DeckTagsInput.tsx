'use client';

import React from 'react';
import { X } from 'lucide-react';

interface DeckTagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: (val: string) => void;
  t: (key: string) => string;
}

export function DeckTagsInput({
  tags,
  setTags,
  tagInput,
  setTagInput,
  t,
}: DeckTagsInputProps) {
  const addTag = (raw: string) => {
    const clean = raw.trim().replace(/^,+|,+$/g, '');
    if (clean && !tags.some((item) => item.toLowerCase() === clean.toLowerCase())) {
      setTags((prev) => [...prev, clean]);
    }
    setTagInput('');
  };

  return (
    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#2e2e2e]">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {t('tags')} ({t('optional')})
          </label>
          <p className="text-[11px] text-slate-400">
            {t('tagsPlaceholder')}
          </p>
        </div>
        {tags.length > 0 && (
          <span className="text-[10px] text-slate-400 font-mono">
            {tags.length} {t('tags')}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838] focus-within:border-accent-primary transition-colors min-h-[46px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 dark:bg-accent-primary/20 text-accent-primary dark:text-[#f89b7b] border border-accent-primary/20 animate-in fade-in zoom-in-95"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
              className="hover:text-accent-primary/70 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
              e.preventDefault();
              addTag(tagInput);
            } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
              setTags((prev) => prev.slice(0, -1));
            }
          }}
          placeholder={tags.length === 0 ? t('tagsPlaceholder') : '+ ...'}
          className="flex-1 min-w-[160px] bg-transparent border-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none px-1 py-1"
        />

        {tagInput.trim() && (
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            className="px-2.5 py-1 rounded-full bg-accent-primary text-white text-[11px] font-bold hover:opacity-90 transition-all cursor-pointer shrink-0"
          >
            +
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10.5px] font-medium text-slate-400 mr-1">{t('popularSuggestions')}</span>
        {[
          'Beginner',
          'Vocabulary',
          'Grammar',
          'Kanji',
          'JLPT N5',
          'Phrases',
          'Conversation',
          'Travel',
          'Business',
          'Daily Life',
        ]
          .filter((suggested) => !tags.some((item) => item.toLowerCase() === suggested.toLowerCase()))
          .slice(0, 7)
          .map((suggested) => (
            <button
              key={suggested}
              type="button"
              onClick={() => setTags((prev) => [...prev, suggested])}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
              + {suggested}
            </button>
          ))}
      </div>
    </div>
  );
}
