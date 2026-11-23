'use client';

import React from 'react';
import Link from 'next/link';
import { FlagIcon } from '@/components/FlagIcon';
import { AccentOption } from '@/lib/theme';
import { ActivityDetail } from './types';

interface ActivityModalProps {
  selectedActivity: ActivityDetail | null;
  onClose: () => void;
  currentAccent: AccentOption;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  selectedActivity,
  onClose,
  currentAccent,
}) => {
  if (!selectedActivity) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#181a24] border border-white/15 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 cursor-default relative"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${selectedActivity.iconBg}`}>
              {selectedActivity.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">
                {selectedActivity.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <FlagIcon code={selectedActivity.langCode} size="sm" />
                <span>{selectedActivity.language}</span>
                <span>•</span>
                <span>{selectedActivity.formattedDate}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Info */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5 text-xs">
          <div className="text-slate-300 leading-relaxed">
            {selectedActivity.details || selectedActivity.subtitle}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">XP Awarded</span>
              <span className="font-bold text-amber-400 text-sm">+{selectedActivity.xpEarned} XP</span>
            </div>
            {selectedActivity.durationMinutes && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-white text-sm">{selectedActivity.durationMinutes} Minutes</span>
              </div>
            )}
            {selectedActivity.cardsReviewed && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Cards Covered</span>
                <span className="font-bold text-white text-sm">{selectedActivity.cardsReviewed} Cards</span>
              </div>
            )}
            {selectedActivity.accuracyRate && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Accuracy Rate</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedActivity.accuracyRate}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal footer button */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>
          {selectedActivity.deckTitle && (
            <Link
              href="/my-cards"
              onClick={onClose}
              style={{ backgroundColor: currentAccent.primary }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 transition-all"
            >
              View Deck
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
