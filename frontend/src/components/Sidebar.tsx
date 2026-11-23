'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Home,
  Compass,
  Library,
  FolderPlus,
  PlusCircle,
  Bookmark,
  History,
  Settings,
  HelpCircle,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { fetchDecks } from '@/lib/api';
import { Deck } from '@/lib/types';
import { isFakeAvatar } from '@/components/UserAvatar';
import { NavItem } from './sidebar/types';
import { SidebarDeckSelector } from './sidebar/SidebarDeckSelector';
import { SidebarUserFooter } from './sidebar/SidebarUserFooter';
import { MobileFloatingBar } from './sidebar/MobileFloatingBar';
import { MobileMenuDrawer } from './sidebar/MobileMenuDrawer';
import { SidebarLoginModal } from './sidebar/SidebarLoginModal';
import { HelpModal } from '@/app/settings/modals/HelpModal';

export function Sidebar() {
  const pathname = usePathname();
  const { currentAccent } = useTheme();
  const { t } = useI18n();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<number | ''>('');
  const [isDeckDropdownOpen, setIsDeckDropdownOpen] = useState(false);

  // Authentication & Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const storedLogin = localStorage.getItem('duocard_is_logged_in');
      setIsLoggedIn(storedLogin === 'true');
      const savedName = localStorage.getItem('duocard_username');
      if (savedName) setUserName(savedName);
      const savedHandle = localStorage.getItem('duocard_handle');
      if (savedHandle) setUserHandle(savedHandle);
      const savedAvatar = localStorage.getItem('duocard_avatar');
      if (savedAvatar && !isFakeAvatar(savedAvatar)) {
        setUserAvatar(savedAvatar);
      } else {
        setUserAvatar('');
        if (savedAvatar && isFakeAvatar(savedAvatar)) {
          localStorage.removeItem('duocard_avatar');
        }
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('user_profile_updated', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('user_profile_updated', syncUser);
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = loginEmail.includes('@')
      ? loginEmail.split('@')[0]
      : loginEmail || 'User';
    const formattedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);
    setUserName(formattedName);
    localStorage.setItem('duocard_username', formattedName);
    localStorage.setItem('duocard_is_logged_in', 'true');
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    localStorage.setItem('duocard_is_logged_in', 'false');
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  const currentDeck = decks.find((d) => d.id === activeDeckId) || decks[0];

  useEffect(() => {
    const loadDecks = () => {
      fetchDecks().then((list) => {
        setDecks(list);
        if (list.length > 0) {
          const saved = localStorage.getItem('duocard_active_deck_id');
          if (saved && list.some((d) => String(d.id) === saved)) {
            setActiveDeckId(Number(saved));
          } else {
            setActiveDeckId(list[0].id);
            localStorage.setItem('duocard_active_deck_id', String(list[0].id));
          }
        }
      });
    };

    loadDecks();
    window.addEventListener('active_deck_changed', loadDecks);
    return () => window.removeEventListener('active_deck_changed', loadDecks);
  }, []);

  const mainNav: NavItem[] = [
    { id: 'home', label: t('home'), href: '/', icon: Home },
    { id: 'my-cards', label: t('myCollections'), href: '/my-cards', icon: Library },
    { id: 'explore', label: t('explore'), href: '/explore', icon: Compass },
    { id: 'collections', label: t('newCollection'), href: '/decks/create', icon: FolderPlus },
    { id: 'createCard', label: t('createCard'), href: '/decks/new', icon: PlusCircle },
  ];

  const secondaryNav: NavItem[] = [
    { id: 'history', label: t('history'), href: '/history', icon: History },
    { id: 'bookmarks', label: t('bookmarks'), href: '/bookmarks', icon: Bookmark },
    { id: 'settings', label: t('settings'), href: '/settings', icon: Settings },
    {
      id: 'help',
      label: t('helpSupport'),
      href: '#',
      icon: HelpCircle,
      onClick: () => setIsHelpModalOpen(true),
    },
  ];

  const searchParams = useSearchParams();
  const currentSearch = searchParams?.toString() ? `?${searchParams.toString()}` : '';

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileDrawerOpen(false);
  }

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('duocard_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('duocard_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleSelectDeck = (deckId: number) => {
    setActiveDeckId(deckId);
    localStorage.setItem('duocard_active_deck_id', String(deckId));
    window.dispatchEvent(new Event('active_deck_changed'));
  };

  return (
    <>
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside
        className={`${
          isCollapsed ? 'w-[72px] px-2.5 py-4' : 'w-60 p-4'
        } h-screen shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-200 dark:border-[#272727] bg-white dark:bg-[#0f0f0f] select-none sticky top-0 transition-[width,padding,background-color,border-color] duration-300 ease-in-out z-30`}
      >
        <div className="flex-1 min-h-0 flex flex-col space-y-4 overflow-y-auto overflow-x-hidden pr-0.5 scrollbar-none">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1 py-1 shrink-0">
            <Link
              href="/"
              className={`flex items-center gap-3 group shrink-0 ${isCollapsed ? 'justify-center mx-auto' : ''}`}
              title="Reory"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-400 via-slate-600 to-slate-800 dark:from-slate-600 dark:via-slate-400 dark:to-white p-[1.5px] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full bg-slate-900 dark:bg-[#1a1a1a] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-slate-400 -translate-x-0.5" />
                </div>
              </div>
              {!isCollapsed && (
                <span className="text-base font-bold text-slate-900 dark:text-white tracking-wide truncate transition-opacity duration-200">
                  Reory
                </span>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#272727] border border-transparent hover:border-slate-200 dark:hover:border-[#383838] transition-all cursor-pointer"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {isCollapsed && (
            <div className="flex justify-center shrink-0">
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#272727] border border-transparent hover:border-slate-200 dark:hover:border-[#383838] transition-all cursor-pointer"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Primary Navigation */}
          <nav className="space-y-1 shrink-0">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  style={
                    isActive
                      ? {
                          backgroundColor: currentAccent.primary,
                          boxShadow: `0 4px 12px ${currentAccent.ring}`,
                        }
                      : undefined
                  }
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f1f]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {isCollapsed && <span className="sr-only">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-[#272727] my-1 shrink-0" />

          {/* Secondary Navigation */}
          <nav className="space-y-1 shrink-0">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isHelp = item.id === 'help';
              const hasQuery = item.href.includes('?');
              const targetPath = hasQuery ? item.href.split('?')[0] : item.href;
              const targetSearch = hasQuery ? `?${item.href.split('?')[1]}` : '';

              const isActive = isHelp
                ? isHelpModalOpen
                : hasQuery
                ? pathname === targetPath && currentSearch === targetSearch
                : pathname === targetPath && (!currentSearch || currentSearch === '');

              const commonClassName = `flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
              } rounded-xl text-xs font-semibold transition-all group relative w-full cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f1f]'
              }`;

              const activeStyle = isActive
                ? {
                    backgroundColor: currentAccent.primary,
                    boxShadow: `0 4px 12px ${currentAccent.ring}`,
                  }
                : undefined;

              const content = (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {isCollapsed && <span className="sr-only">{item.label}</span>}
                </>
              );

              if (item.onClick) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    title={isCollapsed ? item.label : undefined}
                    style={activeStyle}
                    className={commonClassName}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  style={activeStyle}
                  className={commonClassName}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collection Selector */}
        <SidebarDeckSelector
          decks={decks}
          currentDeck={currentDeck}
          activeDeckId={activeDeckId}
          isCollapsed={isCollapsed}
          isDeckDropdownOpen={isDeckDropdownOpen}
          setIsDeckDropdownOpen={setIsDeckDropdownOpen}
          onSelectDeck={handleSelectDeck}
          t={t}
        />

        {/* User Profile Mini Footer */}
        <SidebarUserFooter
          isLoggedIn={isLoggedIn}
          isCollapsed={isCollapsed}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          userName={userName}
          userHandle={userHandle}
          userAvatar={userAvatar}
          pathname={pathname}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          currentAccentPrimary={currentAccent.primary}
          t={t}
        />
      </aside>

      {/* 2. MOBILE FLOATING GLASS BAR */}
      <MobileFloatingBar
        pathname={pathname}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        currentAccent={currentAccent}
        t={t}
      />

      {/* 3. MOBILE SLIDE-OVER FULL MENU DRAWER */}
      <MobileMenuDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        pathname={pathname}
        currentSearch={currentSearch}
        mainNav={mainNav}
        secondaryNav={secondaryNav}
        decks={decks}
        activeDeckId={activeDeckId}
        onSelectDeck={handleSelectDeck}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userHandle={userHandle}
        userAvatar={userAvatar}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        currentAccent={currentAccent}
        t={t}
      />

      {/* 4. FAST LOGIN / SIGN-IN MODAL */}
      <SidebarLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        showLoginPassword={showLoginPassword}
        setShowLoginPassword={setShowLoginPassword}
        onSubmit={handleLoginSubmit}
        currentAccentPrimary={currentAccent.primary}
        t={t}
      />

      {/* 5. STANDALONE HELP & SUPPORT MODAL (NO URL CHANGE) */}
      {isHelpModalOpen && (
        <div
          onClick={() => setIsHelpModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#2e2e2e] shadow-2xl p-6 space-y-5 relative max-h-[90vh] flex flex-col cursor-default"
          >
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                {t('helpSupport')}
              </h3>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HelpModal onClose={() => setIsHelpModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
