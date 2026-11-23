'use client';

import { useState, useRef, useEffect } from 'react';
import { FlagIcon } from './FlagIcon';
import { ChevronDown, Check, Search } from 'lucide-react';
import { LanguageItem } from '@/lib/languages';

interface CustomLanguageSelectProps {
  label: string;
  labelColor?: 'cyan' | 'indigo';
  options: LanguageItem[];
  value: LanguageItem;
  disabledLanguage?: string; // Language name to exclude/disable to prevent choosing the same language
  onChange: (val: LanguageItem) => void;
  className?: string;
}

export function CustomLanguageSelect({
  label,
  labelColor = 'cyan',
  options,
  value,
  disabledLanguage,
  onChange,
  className = '',
}: CustomLanguageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorStyles =
    labelColor === 'cyan'
      ? {
          dot: 'bg-cyan-500 dark:bg-cyan-400',
          label: 'text-cyan-600 dark:text-cyan-400',
          border: 'border-cyan-500/30 dark:border-cyan-500/40 focus-within:border-cyan-500 dark:focus-within:border-cyan-300',
          activeBg: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 font-bold',
          chevron: 'text-cyan-600 dark:text-cyan-400',
        }
      : {
          dot: 'bg-indigo-500 dark:bg-indigo-400',
          label: 'text-indigo-600 dark:text-indigo-300',
          border: 'border-indigo-500/30 dark:border-indigo-500/40 focus-within:border-indigo-500 dark:focus-within:border-indigo-300',
          activeBg: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-200 font-bold',
          chevron: 'text-indigo-600 dark:text-indigo-400',
        };

  const filteredOptions = options
    .filter((opt) => opt.name.toLowerCase() !== (disabledLanguage || '').toLowerCase())
    .filter((opt) => opt.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`space-y-2 relative ${className}`} ref={dropdownRef}>
      <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${colorStyles.label}`}>
        <span className={`w-2 h-2 rounded-full inline-block ${colorStyles.dot}`}></span>
        {label}
      </label>

      {/* Select Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border ${colorStyles.border} text-slate-900 dark:text-white font-bold text-sm flex items-center justify-between transition-all hover:bg-slate-200/80 dark:hover:bg-slate-800 shadow-xs cursor-pointer`}
      >
        <div className="flex items-center gap-3">
          <FlagIcon code={value.countryCode} size="md" />
          <span className="text-sm font-bold tracking-wide">{value.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 ${colorStyles.chevron} transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Menu with Flag on EVERY Option + Search Input */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-2xl p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Options List with Flag Icon */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">No language matched</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.name === value.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? colorStyles.activeBg
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FlagIcon code={opt.countryCode} size="md" />
                      <span className="font-semibold text-sm">{opt.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 stroke-[3]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
