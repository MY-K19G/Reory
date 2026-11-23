'use client';

import React from 'react';
import Link from 'next/link';
import { FriendUser } from '../types';

interface OtherUserDecksTabProps {
  selectedViewUser: FriendUser;
  userSharedDecks: Array<{
    title: string;
    count: number;
    cover: string;
  }>;
}

export const OtherUserDecksTab: React.FC<OtherUserDecksTabProps> = ({
  selectedViewUser,
  userSharedDecks,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-lg space-y-4 transition-colors animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {selectedViewUser.name}&apos;s Public Decks
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Explore and study vocabulary decks created by {selectedViewUser.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-1">
        {userSharedDecks.map((deck, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-slate-200/60 dark:border-white/5 hover:border-cyan-500/30 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img
                src={deck.cover}
                alt={deck.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                  {deck.count} cards
                </span>
              </div>
              <div className="absolute bottom-2 left-2.5 right-2.5">
                <h4 className="text-xs font-bold text-white truncate drop-shadow-sm">
                  {deck.title}
                </h4>
              </div>
            </div>

            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium">Public Collection</span>
                <span className="font-bold text-cyan-500">{deck.count} cards</span>
              </div>
              <Link
                href="/explore"
                className="w-full py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold text-center transition-colors block"
              >
                Explore & Practice
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
