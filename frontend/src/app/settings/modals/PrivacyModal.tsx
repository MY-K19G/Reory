'use client';

import React from 'react';
import { ShieldCheck, HardDrive, Lock } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <span className="text-xs font-bold text-white block">Client-Side Architecture</span>
          <span className="text-[11px] text-slate-300 block">
            Your personal notes, cards, and keys are stored locally on your device by default.
          </span>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            BYOK Zero-Knowledge
          </div>
          <p className="text-[11px] text-slate-400">
            When you provide your Google Gemini API key, it is never transmitted to any third-party analytics. Calls are routed strictly between your browser and Google endpoints.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            Data Ownership & Portability
          </div>
          <p className="text-[11px] text-slate-400">
            You can export your complete vocabulary database and flashcard collections at any time as JSON, CSV, or Anki-compatible TXT files under Advanced Settings.
          </p>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
