'use client';

import React from 'react';
import { DeckIcon } from '@/components/DeckIcon';
import { useI18n } from '@/lib/i18n';
import { DeckIconPickerPopover } from './components/DeckIconPickerPopover';
import { DeckCategorySelector } from './components/DeckCategorySelector';
import { DeckTagsInput } from './components/DeckTagsInput';

interface DeckDetailsStepProps {
  deckName: string;
  setDeckName: (val: string) => void;
  deckIcon: string;
  setDeckIcon: (icon: string) => void;
  isDeckIconPickerOpen: boolean;
  setIsDeckIconPickerOpen: (open: boolean | ((p: boolean) => boolean)) => void;
  deckIconSearch: string;
  setDeckIconSearch: (s: string) => void;
  deckIconTab: string;
  setDeckIconTab: (tab: string) => void;
  hoveredDeckEmoji: string | null;
  setHoveredDeckEmoji: (emoji: string | null) => void;
  deckIconPickerRef: React.RefObject<HTMLDivElement | null>;
  deckChipsScrollRef: React.RefObject<HTMLDivElement | null>;
  description: string;
  setDescription: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  customCategories: { name: string; icon: string }[];
  isAddingCustomCategory: boolean;
  setIsAddingCustomCategory: (val: boolean) => void;
  customCategoryInput: string;
  setCustomCategoryInput: (val: string) => void;
  selectedCategoryIcon: string;
  setSelectedCategoryIcon: (icon: string) => void;
  isIconPickerOpen: boolean;
  setIsIconPickerOpen: (open: boolean) => void;
  iconSearch: string;
  setIconSearch: (s: string) => void;
  iconifyIcons: string[];
  isIconifyLoading: boolean;
  iconPickerRef: React.RefObject<HTMLDivElement | null>;
  handleAddCustomCategory: () => void;
  handleDeleteCustomCategory: (name: string) => void;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: (val: string) => void;
  currentAccent: {
    primary: string;
    ring?: string;
  };
}

export function DeckDetailsStep({
  deckName,
  setDeckName,
  deckIcon,
  setDeckIcon,
  isDeckIconPickerOpen,
  setIsDeckIconPickerOpen,
  deckIconSearch,
  setDeckIconSearch,
  deckIconTab,
  setDeckIconTab,
  hoveredDeckEmoji,
  setHoveredDeckEmoji,
  deckIconPickerRef,
  deckChipsScrollRef,
  description,
  setDescription,
  selectedCategory,
  setSelectedCategory,
  customCategories,
  isAddingCustomCategory,
  setIsAddingCustomCategory,
  customCategoryInput,
  setCustomCategoryInput,
  selectedCategoryIcon,
  setSelectedCategoryIcon,
  isIconPickerOpen,
  setIsIconPickerOpen,
  iconSearch,
  setIconSearch,
  iconifyIcons,
  isIconifyLoading,
  iconPickerRef,
  handleAddCustomCategory,
  handleDeleteCustomCategory,
  tags,
  setTags,
  tagInput,
  setTagInput,
  currentAccent,
}: DeckDetailsStepProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 dark:border-[#2e2e2e] space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full text-white bg-accent-primary font-bold text-xs flex items-center justify-center shrink-0">
          2
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1e293b] dark:text-white">{t('deckDetails')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('deckDetailsDesc')}
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {/* Deck Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t('deckName') || 'Deck Name'}</label>
          <div className="relative">
            <input
              type="text"
              value={deckName}
              maxLength={50}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder={t('deckNamePlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838] text-xs sm:text-sm font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-accent-primary dark:focus:border-slate-500 transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-mono">
              {deckName.length}/50
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t('descriptionOptional')}</label>
          <div className="relative">
            <textarea
              rows={2}
              value={description}
              maxLength={200}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#282828] border border-slate-200/80 dark:border-[#383838] text-xs sm:text-sm font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-accent-primary dark:focus:border-slate-500 transition-colors resize-none"
            />
            <span className="absolute right-3.5 bottom-3 text-[11px] text-slate-400 font-mono">
              {description.length}/200
            </span>
          </div>
        </div>

        {/* Category Pills Row */}
        <DeckCategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          customCategories={customCategories}
          isAddingCustomCategory={isAddingCustomCategory}
          setIsAddingCustomCategory={setIsAddingCustomCategory}
          customCategoryInput={customCategoryInput}
          setCustomCategoryInput={setCustomCategoryInput}
          selectedCategoryIcon={selectedCategoryIcon}
          setSelectedCategoryIcon={setSelectedCategoryIcon}
          isIconPickerOpen={isIconPickerOpen}
          setIsIconPickerOpen={setIsIconPickerOpen}
          iconSearch={iconSearch}
          setIconSearch={setIconSearch}
          iconifyIcons={iconifyIcons}
          isIconifyLoading={isIconifyLoading}
          iconPickerRef={iconPickerRef}
          handleAddCustomCategory={handleAddCustomCategory}
          handleDeleteCustomCategory={handleDeleteCustomCategory}
          currentAccent={currentAccent}
          t={t}
        />

        {/* Topic Tags Input Section */}
        <DeckTagsInput
          tags={tags}
          setTags={setTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          t={t}
        />
      </div>
    </div>
  );
}
