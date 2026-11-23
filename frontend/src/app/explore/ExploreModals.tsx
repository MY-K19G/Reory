'use client';

import { Copy, X, Loader2, GitFork } from 'lucide-react';
import { CommunityCardCollection } from './types';
import { useI18n } from '@/lib/i18n';

interface CloneModalProps {
  cloneModalItem: CommunityCardCollection | null;
  onClose: () => void;
  cloneName: string;
  setCloneName: (name: string) => void;
  onConfirmClone: (item: CommunityCardCollection, name: string) => void;
  savingCollectionId: string | null;
}

export function CloneModal({
  cloneModalItem,
  onClose,
  cloneName,
  setCloneName,
  onConfirmClone,
  savingCollectionId,
}: CloneModalProps) {
  const { t } = useI18n();
  if (!cloneModalItem) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-slate-200/60 dark:border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #10b981, #34d399, #059669)' }}
        />

        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                boxShadow: '0 0 14px rgba(16,185,129,0.45)',
              }}
            >
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1e293b] dark:text-white">
                {t('cloneDeckTitle')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('cloningFrom')}{' '}
                <span className="font-semibold text-emerald-500">{cloneModalItem.title}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('nameYourClone')}
            </label>
            <input
              type="text"
              value={cloneName}
              onChange={(e) => setCloneName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && cloneName.trim()) {
                  onConfirmClone(cloneModalItem, cloneName);
                }
              }}
              autoFocus
              placeholder={t('cloneNamePlaceholder')}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 text-[#1e293b] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 outline-none transition-all"
              style={{
                boxShadow: cloneName.trim() ? '0 0 0 2px rgba(16,185,129,0.35)' : undefined,
              }}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-500/20">
            <Copy className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-snug">
              {t('cloneDescription')}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/8 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              disabled={!cloneName.trim() || savingCollectionId === cloneModalItem.id}
              onClick={() => onConfirmClone(cloneModalItem, cloneName)}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
              }}
            >
              {savingCollectionId === cloneModalItem.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('cloningInProgress')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('cloneDeckTitle')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ForkModalProps {
  forkModalItem: CommunityCardCollection | null;
  onClose: () => void;
  forkName: string;
  setForkName: (name: string) => void;
  onConfirmFork: (item: CommunityCardCollection, name: string) => void;
  forkingCollectionId: string | null;
}

export function ForkModal({
  forkModalItem,
  onClose,
  forkName,
  setForkName,
  onConfirmFork,
  forkingCollectionId,
}: ForkModalProps) {
  const { t } = useI18n();
  if (!forkModalItem) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-slate-200/60 dark:border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #d97706)' }}
        />

        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '0 0 14px rgba(245,158,11,0.45)',
              }}
            >
              <GitFork className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1e293b] dark:text-white">
                {t('forkDeckTitle')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('forkingFrom')}{' '}
                <span className="font-semibold text-amber-500">{forkModalItem.title}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('nameYourFork')}
            </label>
            <input
              type="text"
              value={forkName}
              onChange={(e) => setForkName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && forkName.trim()) {
                  onConfirmFork(forkModalItem, forkName);
                }
              }}
              autoFocus
              placeholder={t('forkNamePlaceholder')}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 text-[#1e293b] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 outline-none transition-all"
              style={{
                boxShadow: forkName.trim() ? '0 0 0 2px rgba(245,158,11,0.35)' : undefined,
              }}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-500/20">
            <GitFork className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">
              {t('forkDescription')}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/8 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              disabled={!forkName.trim() || forkingCollectionId === forkModalItem.id}
              onClick={() => onConfirmFork(forkModalItem, forkName)}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
              }}
            >
              {forkingCollectionId === forkModalItem.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('forkingInProgress')}</span>
                </>
              ) : (
                <>
                  <GitFork className="w-3.5 h-3.5" />
                  <span>{t('forkDeckTitle')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
