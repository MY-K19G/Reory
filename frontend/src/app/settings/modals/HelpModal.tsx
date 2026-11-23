'use client';

import React from 'react';
import { HelpCircle, Keyboard, BookOpen, ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Intro Header */}
      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3">
        <HelpCircle className="w-6 h-6 text-cyan-400 shrink-0" />
        <div>
          <span className="text-xs font-bold text-white block">
            {t('howReoryWorks')}
          </span>
          <span className="text-[11px] text-slate-300 block">
            {t('howReoryWorksDesc')}
          </span>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-2">
        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          {t('studyShortcuts')}
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
            <span className="text-slate-400">{t('flipFlashcard')}</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px] font-bold">Space</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
            <span className="text-slate-400">{t('audioPronounce')}</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px] font-bold">A / P</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
            <span className="text-slate-400">{t('rateCard1to4')}</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px] font-bold">1 – 4</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
            <span className="text-slate-400">{t('nextCard')}</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px] font-bold">&rarr;</kbd>
          </div>
        </div>
      </div>

      {/* Spaced Repetition explanation */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-2">
        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          {t('srsProgression')}
        </span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {t('srsProgressionDesc')}
        </p>
      </div>

      {/* GitHub Repository Card */}
      <a
        href="https://github.com/duocard-x"
        target="_blank"
        rel="noopener noreferrer"
        className="group p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all flex items-center justify-between block cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 group-hover:text-white transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              {t('openSourceGithub')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {t('githubRepoDesc')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
          <span>{t('viewOnGithub')}</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </a>

      {/* Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          {t('gotIt')}
        </button>
      </div>
    </div>
  );
};
