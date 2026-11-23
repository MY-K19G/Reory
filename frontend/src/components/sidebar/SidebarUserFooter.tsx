'use client';

import React from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, LogIn, MoreVertical } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';

interface SidebarUserFooterProps {
  isLoggedIn: boolean;
  isCollapsed: boolean;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  userHandle: string;
  userAvatar: string;
  pathname: string;
  onOpenLoginModal: () => void;
  onLogout: (e: React.MouseEvent) => void;
  currentAccentPrimary: string;
  t: (key: string) => string;
}

export function SidebarUserFooter({
  isLoggedIn,
  isCollapsed,
  isUserMenuOpen,
  setIsUserMenuOpen,
  userName,
  userHandle,
  userAvatar,
  pathname,
  onOpenLoginModal,
  onLogout,
  currentAccentPrimary,
  t,
}: SidebarUserFooterProps) {
  return (
    <div className="pt-2 shrink-0 relative">
      {isLoggedIn ? (
        <div className="relative">
          <div
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'
            } rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer group ${
              pathname === '/profile'
                ? 'bg-slate-100 dark:bg-[#1f1f1f] ring-1 ring-slate-200 dark:ring-white/10'
                : ''
            }`}
            title={isCollapsed ? userName || 'Account' : undefined}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <div
                className="w-8 h-8 rounded-full p-[1.5px] shrink-0 overflow-hidden"
                style={{ backgroundColor: currentAccentPrimary }}
              >
                <UserAvatar
                  avatar={userAvatar}
                  name={userName}
                  size="md"
                  className="w-full h-full"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors truncate">
                    {userName || t('myProfile')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {userHandle ? `@${userHandle}` : t('account')}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen((prev) => !prev);
                }}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User Dropdown Options Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute bottom-full mb-2 left-0 right-0 sm:w-48 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2e2e2e] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>View Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </Link>
              <div className="my-1 border-t border-slate-100 dark:border-white/5" />
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenLoginModal}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'gap-2 px-3.5 py-2.5'
          } rounded-xl font-bold text-xs text-white shadow-md transition-all cursor-pointer`}
          style={{ backgroundColor: currentAccentPrimary }}
          title={isCollapsed ? 'Log In' : undefined}
        >
          <LogIn className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Log In</span>}
        </button>
      )}
    </div>
  );
}
