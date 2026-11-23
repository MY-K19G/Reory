'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Library, Plus, Compass, Menu } from 'lucide-react';

interface MobileFloatingBarProps {
  pathname: string;
  isMobileDrawerOpen: boolean;
  onOpenMobileDrawer: () => void;
  currentAccent: {
    primary: string;
  };
  t: (key: string) => string;
}

export function MobileFloatingBar({
  pathname,
  isMobileDrawerOpen,
  onOpenMobileDrawer,
  currentAccent,
  t,
}: MobileFloatingBarProps) {
  return (
    <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 flex items-center justify-between px-3 py-2 rounded-2xl bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#272727] shadow-xl shadow-black/10 dark:shadow-2xl dark:shadow-black/80 ring-1 ring-black/5 dark:ring-white/5">
      <Link
        href="/"
        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
          pathname === '/'
            ? 'text-slate-900 dark:text-white scale-105 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9.5px] font-semibold tracking-tight">{t('home')}</span>
      </Link>

      <Link
        href="/my-cards"
        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
          pathname === '/my-cards'
            ? 'text-accent-primary dark:text-[#f59e7e] scale-105 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Library className="w-5 h-5" />
        <span className="text-[9.5px] font-semibold tracking-tight">{t('collections')}</span>
      </Link>

      {/* Center Create Action Pill */}
      <Link
        href="/decks/create"
        style={{
          backgroundColor: currentAccent.primary,
          boxShadow: `0 4px 16px ${currentAccent.primary}40`,
        }}
        className="flex items-center justify-center w-11 h-11 rounded-2xl shadow-lg -translate-y-2 active:scale-95 transition-all"
        title="Create Flashcard Deck"
      >
        <Plus className="w-5 h-5 text-white stroke-[3]" />
      </Link>

      <Link
        href="/explore"
        style={pathname === '/explore' ? { color: currentAccent.primary } : undefined}
        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
          pathname === '/explore'
            ? 'scale-105 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[9.5px] font-semibold tracking-tight">{t('explore')}</span>
      </Link>

      {/* Menu drawer trigger */}
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        style={isMobileDrawerOpen ? { color: currentAccent.primary } : undefined}
        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all cursor-pointer ${
          isMobileDrawerOpen
            ? 'font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-[9.5px] font-semibold tracking-tight">Menu</span>
      </button>
    </div>
  );
}
