'use client';

import React from 'react';
import { Search, X, ChevronDown, Check, Plus } from 'lucide-react';
import { Icon } from '@iconify/react';
import { CATEGORIES } from '../constants';

interface DeckCategorySelectorProps {
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
  currentAccent: {
    primary: string;
    ring?: string;
  };
  t: (key: string) => string;
}

export function DeckCategorySelector({
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
  currentAccent,
  t,
}: DeckCategorySelectorProps) {
  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t('category')}</label>
        {selectedCategory && (
          <span className="text-[10px] text-slate-400">
            {t('selected')}:{' '}
            <strong className="text-accent-primary dark:text-white font-bold">{selectedCategory}</strong>
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.filter((c) => c.id !== 'Custom').map((cat) => {
          const IconComp = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setIsAddingCustomCategory(false);
              }}
              style={
                isSelected
                  ? {
                      backgroundColor: currentAccent.primary,
                      color: '#ffffff',
                      boxShadow: `0 3px 12px ${currentAccent.ring || 'rgba(0,0,0,0.15)'}`,
                    }
                  : undefined
              }
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'border border-transparent ring-2 ring-white/20'
                  : 'bg-white dark:bg-[#282828] hover:bg-slate-50 dark:hover:bg-[#333] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#383838] shadow-2xs hover:border-slate-300'
              }`}
            >
              <IconComp
                className={`w-3.5 h-3.5 transition-colors ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span>{cat.label}</span>
              {isSelected && <Check className="w-3 h-3 text-white ml-0.5 stroke-[3]" />}
            </button>
          );
        })}

        {/* Custom categories */}
        {customCategories.map((catItem) => {
          const isSelected = selectedCategory === catItem.name;
          const iconName = catItem.icon || 'bi-tag';
          return (
            <div
              key={catItem.name}
              style={
                isSelected
                  ? {
                      backgroundColor: currentAccent.primary,
                      color: '#ffffff',
                      boxShadow: `0 3px 12px ${currentAccent.ring || 'rgba(0,0,0,0.15)'}`,
                    }
                  : undefined
              }
              className={`inline-flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 rounded-full text-xs font-bold transition-all ${
                isSelected
                  ? 'border border-transparent ring-2 ring-white/20 text-white'
                  : 'bg-white dark:bg-[#282828] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#383838] shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedCategory(catItem.name)}
                className="inline-flex items-center gap-1.5 cursor-pointer"
              >
                {iconName.startsWith('bi-') ? (
                  <i className={`bi ${iconName} text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                ) : (
                  <Icon icon={iconName} className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                )}
                <span>{catItem.name}</span>
                {isSelected && <Check className="w-3 h-3 text-white ml-0.5 stroke-[3]" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCustomCategory(catItem.name);
                }}
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer ml-0.5 ${
                  isSelected
                    ? 'text-white/80 hover:text-white hover:bg-white/20'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
                }`}
                title="Remove custom category"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Inline Custom Category Creator */}
        {isAddingCustomCategory ? (
          <div className="relative inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full bg-white dark:bg-[#282828] border-2 border-accent-primary shadow-xs animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#383838] text-accent-primary flex items-center gap-0.5 transition-colors cursor-pointer"
              title="Choose category icon from Iconify"
            >
              {selectedCategoryIcon.startsWith('bi-') ? (
                <i className={`bi ${selectedCategoryIcon} text-base`} />
              ) : (
                <Icon icon={selectedCategoryIcon || 'solar:tag-bold'} className="w-4 h-4" />
              )}
              <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
            </button>

            {isIconPickerOpen && (
              <div
                ref={iconPickerRef}
                className="absolute left-0 top-full mt-2 w-72 sm:w-80 p-3 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200/90 dark:border-[#383838] shadow-2xl z-50 animate-in fade-in zoom-in-95"
              >
                <div className="space-y-2 mb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                      Iconify Icon Source
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsIconPickerOpen(false)}
                      className="w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-[#333] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      placeholder="Search 200,000+ icons..."
                      autoFocus
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#333] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto pr-1 grid grid-cols-6 gap-1.5 scrollbar-thin">
                  {isIconifyLoading ? (
                    <div className="col-span-6 py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px]">Searching Iconify...</span>
                    </div>
                  ) : (
                    iconifyIcons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryIcon(iconName);
                          setIsIconPickerOpen(false);
                        }}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group ${
                          selectedCategoryIcon === iconName
                            ? 'bg-accent-primary text-white shadow-xs'
                            : 'hover:bg-slate-100 dark:hover:bg-[#2c2c2c] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon icon={iconName} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <input
              type="text"
              value={customCategoryInput}
              onChange={(e) => setCustomCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomCategory();
                } else if (e.key === 'Escape') {
                  setIsAddingCustomCategory(false);
                  setIsIconPickerOpen(false);
                  setCustomCategoryInput('');
                }
              }}
              placeholder="Category name..."
              autoFocus
              className="bg-transparent border-none text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none w-24 sm:w-32 py-1"
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              disabled={!customCategoryInput.trim()}
              className="px-2.5 py-1 rounded-full bg-accent-primary text-white text-[11px] font-bold hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCustomCategory(false);
                setIsIconPickerOpen(false);
                setCustomCategoryInput('');
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsAddingCustomCategory(true);
              setSelectedCategoryIcon('bi-tag');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer bg-white dark:bg-[#282828] hover:bg-slate-50 dark:hover:bg-[#333] text-accent-primary dark:text-accent-primary border border-dashed border-accent-primary/40 hover:border-accent-primary shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom</span>
          </button>
        )}
      </div>
    </div>
  );
}
