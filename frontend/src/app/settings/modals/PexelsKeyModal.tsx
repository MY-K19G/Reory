'use client';

import React from 'react';
import {
  ShieldCheck,
  HardDrive,
  Cloud,
  ExternalLink,
  KeyRound,
  Image as ImageIcon,
} from 'lucide-react';
import { StorageMode } from '@/lib/crypto';
import { useI18n } from '@/lib/i18n';

interface PexelsKeyModalProps {
  pexelsStorageMode: StorageMode;
  setPexelsStorageMode: (m: StorageMode) => void;
  pexelsKey: string;
  setPexelsKey: (k: string) => void;
  secretPassphrase: string;
  setSecretPassphrase: (p: string) => void;
  handleSave: () => void;
  onClose: () => void;
}

export const PexelsKeyModal: React.FC<PexelsKeyModalProps> = ({
  pexelsStorageMode,
  setPexelsStorageMode,
  pexelsKey,
  setPexelsKey,
  secretPassphrase,
  setSecretPassphrase,
  handleSave,
  onClose,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Zero-Knowledge Privacy Guarantee */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            Zero-Knowledge Photo Privacy
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          Your personal Pexels API key powers context photos for flashcards. With Encrypted Cloud, it is secured with client-side AES-256 encryption.
        </p>
      </div>

      {/* Storage Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {t('chooseKeyStorage')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPexelsStorageMode('local')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              pexelsStorageMode === 'local'
                ? 'bg-emerald-500/15 border-emerald-500/40 shadow-xs'
                : 'bg-slate-100/50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <HardDrive className={`w-3.5 h-3.5 ${pexelsStorageMode === 'local' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t('localOnly')}</span>
              </div>
              {pexelsStorageMode === 'local' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                  {t('selected')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              Key stays strictly in this browser.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPexelsStorageMode('cloud')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              pexelsStorageMode === 'cloud'
                ? 'bg-emerald-500/15 border-emerald-500/40 shadow-xs'
                : 'bg-slate-100/50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Cloud className={`w-3.5 h-3.5 ${pexelsStorageMode === 'cloud' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t('encryptedCloud')}</span>
              </div>
              {pexelsStorageMode === 'cloud' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                  {t('selected')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              AES-256 encrypted sync to your cloud database.
            </p>
          </button>
        </div>
      </div>

      {/* Free Quotas */}
      <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Pexels Free API Quota</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">200 requests/hour • 20,000 requests/month</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded-full">
          Free Tier
        </span>
      </div>

      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('pexelsKeyLabel')}
          </label>
          <a
            href="https://www.pexels.com/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            {t('getFreeKey')} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <input
          type="password"
          value={pexelsKey}
          onChange={(e) => setPexelsKey(e.target.value)}
          placeholder={t('pexelsKeyPlaceholder')}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Optional Passphrase for Cloud Sync */}
      {pexelsStorageMode === 'cloud' && (
        <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <label className="text-xs font-bold text-slate-800 dark:text-white">
              {t('encryptionPassphrase')}
            </label>
          </div>
          <input
            type="password"
            value={secretPassphrase}
            onChange={(e) => setSecretPassphrase(e.target.value)}
            placeholder={t('passphrasePlaceholder')}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
          />
          <p className="text-[10px] text-slate-400">
            {t('passphraseDesc')}
          </p>
        </div>
      )}

      {/* Footer Controls */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {pexelsKey.trim()
            ? `Key Active (${pexelsKey.slice(0, 4)}...${pexelsKey.slice(-4)})`
            : 'No personal key saved'}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {t('close')}
          </button>
          <button
            type="button"
            onClick={() => {
              handleSave();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            {t('saveKey')}
          </button>
        </div>
      </div>
    </div>
  );
};
