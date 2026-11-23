'use client';

import React from 'react';
import Link from 'next/link';
import { X, Check, User, LogOut, LogIn } from 'lucide-react';
import { Deck } from '@/lib/types';
import { DeckIcon } from '@/components/DeckIcon';
import { FlagIcon } from '@/components/FlagIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { getDeckLanguagePair } from '@/lib/deckLanguages';
import { NavItem } from './types';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  currentSearch: string;
  mainNav: NavItem[];
  secondaryNav: NavItem[];
  decks: Deck[];
  activeDeckId: number | '';
  onSelectDeck: (id: number) => void;
  isLoggedIn: boolean;
  userName: string;
  userHandle: string;
  userAvatar: string;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  currentAccent: {
    primary: string;
    subtleBg: string;
    border: string;
  };
  t: (key: string) => string;
}

export function MobileMenuDrawer({
  isOpen,
  onClose,
  pathname,
  currentSearch,
  mainNav,
  secondaryNav,
  decks,
  activeDeckId,
  onSelectDeck,
  isLoggedIn,
  userName,
  userHandle,
  userAvatar,
  onOpenLoginModal,
  onLogout,
  currentAccent,
  t,
}: MobileMenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer sheet from left */}
      <div className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-[#090b11] border-r border-slate-200 dark:border-white/10 shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
        <div className="space-y-5 overflow-y-auto flex-1 pr-1">
          {/* Drawer Top Branding */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-slate-900 dark:bg-[#080a10] flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 -translate-x-0.5" />
                </div>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                Reory
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
              Navigation
            </span>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  style={
                    isActive
                      ? {
                          backgroundColor: currentAccent.primary,
                        }
                      : undefined
                  }
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="space-y-1 border-t border-white/5 pt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
              Personal &amp; Tools
            </span>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const hasQuery = item.href.includes('?');
              const targetPath = hasQuery ? item.href.split('?')[0] : item.href;
              const targetSearch = hasQuery ? `?${item.href.split('?')[1]}` : '';

              const isActive = hasQuery
                ? pathname === targetPath && currentSearch === targetSearch
                : pathname === targetPath && (!currentSearch || currentSearch === '');
              const content = (
                <>
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </>
              );

              const className = `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`;

              const style = isActive
                ? {
                    backgroundColor: currentAccent.primary,
                  }
                : undefined;

              if (item.onClick) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      item.onClick?.();
                    }}
                    style={style}
                    className={className}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  style={style}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Quick Collection Switcher in Drawer */}
          <div className="border-t border-white/5 pt-3 space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {t('activeDeck')}
              </span>
              <Link
                href="/decks/create"
                onClick={onClose}
                style={{ color: currentAccent.primary }}
                className="text-[10px] font-semibold hover:underline"
              >
                + {t('new')}
              </Link>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {decks.map((deck) => {
                const isSelected = deck.id === activeDeckId;
                const pair = getDeckLanguagePair(deck);
                return (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => {
                      onSelectDeck(deck.id);
                      onClose();
                    }}
                    style={
                      isSelected
                        ? {
                            backgroundColor: currentAccent.subtleBg,
                            color: currentAccent.primary,
                            borderColor: currentAccent.border,
                          }
                        : undefined
                    }
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                      isSelected
                        ? 'font-semibold border'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <DeckIcon icon={deck.icon} />
                      <div className="min-w-0">
                        <span className="truncate block font-semibold">{deck.title}</span>
                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <span className="inline-flex items-center gap-0.5 text-slate-200">
                            <FlagIcon code={pair.targetFlag} size="sm" />
                            <span>{pair.targetLang}</span>
                          </span>
                          <span className="text-slate-500 font-bold">&rarr;</span>
                          <span className="inline-flex items-center gap-0.5 text-slate-400">
                            <FlagIcon code={pair.nativeFlag} size="sm" />
                            <span>{pair.nativeLang}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5 shrink-0 ml-2"
                        style={{ color: currentAccent.primary }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer User Footer / Login */}
        <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full p-[1.5px] shrink-0 overflow-hidden"
                  style={{ backgroundColor: currentAccent.primary }}
                >
                  <UserAvatar
                    avatar={userAvatar}
                    name={userName}
                    size="md"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{userName || 'My Profile'}</div>
                  <div className="text-[10px] text-slate-400">
                    {userHandle ? `@${userHandle}` : 'Account'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Profile"
                >
                  <User className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLoginModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: currentAccent.primary }}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
