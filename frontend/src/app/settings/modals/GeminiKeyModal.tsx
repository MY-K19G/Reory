'use client';

import React from 'react';
import {
  ShieldCheck,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  EyeOff,
  Eye,
  KeyRound,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { StorageMode } from '@/lib/crypto';
import { useI18n } from '@/lib/i18n';

interface GeminiKeyModalProps {
  apiStorageMode: StorageMode;
  setApiStorageMode: (m: StorageMode) => void;
  showApiKey: boolean;
  setShowApiKey: (s: boolean) => void;
  apiKey: string;
  setApiKey: (k: string) => void;
  selectedModel?: string;
  setSelectedModel?: (m: string) => void;
  secretPassphrase: string;
  setSecretPassphrase: (p: string) => void;
  testingKey: boolean;
  testResult: { success?: boolean; message?: string } | null;
  setTestResult: (r: { success?: boolean; message?: string } | null) => void;
  handleTestApiKey: () => void;
  handleClearApiKey: () => void;
  handleSaveApiKey: () => Promise<void>;
  onClose: () => void;
}

export const GEMINI_AVAILABLE_MODELS = [
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash Lite',
    tag: 'Highest Daily Quota (500/day)',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rpm: '15 RPM',
    rpd: '500 RPD',
    tpm: '250K TPM',
    desc: 'High throughput flash-lite model with 500 requests/day, ideal for heavy flashcard generation and fast study sessions.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'High Quota (500/day)',
    tagColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    rpm: '15 RPM',
    rpd: '500 RPD',
    tpm: '250K TPM',
    desc: 'Fast, cost-efficient model providing 500 daily requests for regular study routines.',
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    tag: 'High Performance',
    tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    rpm: '5 RPM',
    rpd: '20 RPD',
    tpm: '250K TPM',
    desc: 'Cutting-edge fast reasoning model engineered for real-time lexical explanations.',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tag: 'Latest Frontier',
    tagColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    rpm: '5 RPM',
    rpd: '20 RPD',
    tpm: '250K TPM',
    desc: 'Next-generation frontier flash model with ultra-sharp reasoning and multilingual vocabulary capabilities.',
  },
];

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  apiStorageMode,
  setApiStorageMode,
  showApiKey,
  setShowApiKey,
  apiKey,
  setApiKey,
  selectedModel = 'gemini-3.5-flash-lite',
  setSelectedModel,
  secretPassphrase,
  setSecretPassphrase,
  testingKey,
  testResult,
  setTestResult,
  handleTestApiKey,
  handleClearApiKey,
  handleSaveApiKey,
  onClose,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Transparency & Security Trust Banner */}
      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            {t('zeroKnowledgeGuarantee')}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('zeroKnowledgeDesc')}
        </p>
      </div>

      {/* Storage Mode Selector (Local Only vs Encrypted Cloud Sync) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {t('chooseKeyStorage')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Option 1: Local Only */}
          <button
            type="button"
            onClick={() => setApiStorageMode('local')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              apiStorageMode === 'local'
                ? 'bg-emerald-500/15 border-emerald-500/40 shadow-xs'
                : 'bg-slate-100/50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <HardDrive className={`w-3.5 h-3.5 ${apiStorageMode === 'local' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t('localOnly')}</span>
              </div>
              {apiStorageMode === 'local' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                  {t('selected')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              {t('localOnlyDesc')}
            </p>
          </button>

          {/* Option 2: Encrypted Cloud Sync */}
          <button
            type="button"
            onClick={() => setApiStorageMode('cloud')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              apiStorageMode === 'cloud'
                ? 'bg-indigo-500/15 border-indigo-500/40 shadow-xs'
                : 'bg-slate-100/50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Cloud className={`w-3.5 h-3.5 ${apiStorageMode === 'cloud' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t('encryptedCloud')}</span>
              </div>
              {apiStorageMode === 'cloud' && (
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded-md">
                  {t('selected')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              {t('encryptedCloudDesc')}
            </p>
          </button>
        </div>

        {/* Advantages & Disadvantages Card based on selection */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 text-[11px] space-y-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            {apiStorageMode === 'local'
              ? t('localOnlyProsCons')
              : t('encryptedCloudProsCons')}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Advantages */}
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {t('advantages')}
              </span>
              <ul className="text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {apiStorageMode === 'local' ? (
                  <>
                    <li><strong>{t('zeroTrustTitle')}</strong> {t('zeroTrustDesc')}</li>
                    <li><strong>{t('zeroLeakTitle')}</strong> {t('zeroLeakDesc')}</li>
                    <li><strong>{t('noPassphraseTitle')}</strong> {t('noPassphraseDesc')}</li>
                  </>
                ) : (
                  <>
                    <li><strong>{t('crossDeviceTitle')}</strong> {t('crossDeviceDesc')}</li>
                    <li><strong>{t('noReentryTitle')}</strong> {t('noReentryDesc')}</li>
                    <li><strong>{t('zeroKnowledgeTitle')}</strong> {t('zeroKnowledgeBulletDesc')}</li>
                  </>
                )}
              </ul>
            </div>

            {/* Disadvantages */}
            <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {t('disadvantages')}
              </span>
              <ul className="text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {apiStorageMode === 'local' ? (
                  <>
                    <li><strong>{t('deviceSpecificTitle')}</strong> {t('deviceSpecificDesc')}</li>
                    <li><strong>{t('cacheClearingTitle')}</strong> {t('cacheClearingDesc')}</li>
                  </>
                ) : (
                  <>
                    <li><strong>{t('requiresPassphraseTitle')}</strong> {t('requiresPassphraseDesc')}</li>
                    <li><strong>{t('encryptedPayloadTitle')}</strong> {t('encryptedPayloadDesc')}</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection & Rate Limit Specifications */}
      <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Choose Gemini AI Model</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Free Tier Quotas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
          {GEMINI_AVAILABLE_MODELS.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  if (setSelectedModel) setSelectedModel(model.id);
                  setTestResult(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-500/15 border-indigo-500/50 shadow-xs ring-1 ring-indigo-500/40'
                    : 'bg-white/60 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {model.name}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${model.tagColor}`}>
                      {model.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {model.rpm} • {model.rpd}
                    </span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-slate-400 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {model.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* API Key Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('geminiApiKey')}
          </label>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            {t('getFreeKey')} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setTestResult(null);
            }}
            placeholder="AIzaSy..."
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Optional Passphrase for Cloud Sync */}
      {apiStorageMode === 'cloud' && (
        <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-xs font-bold text-slate-800 dark:text-white">
              {t('encryptionPassphrase')}
            </label>
          </div>
          <input
            type="password"
            value={secretPassphrase}
            onChange={(e) => setSecretPassphrase(e.target.value)}
            placeholder={t('passphrasePlaceholder')}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
          />
          <p className="text-[10px] text-slate-400">
            {t('passphraseDesc')}
          </p>
        </div>
      )}

      {/* Test Connection Button & Status */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleTestApiKey}
          disabled={testingKey || !apiKey.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white disabled:opacity-50 transition-colors cursor-pointer"
        >
          {testingKey ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t('testingKeyStatus')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('testConnection')}</span>
            </>
          )}
        </button>

        {apiKey.trim() && (
          <button
            type="button"
            onClick={handleClearApiKey}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            {t('removeKey')}
          </button>
        )}
      </div>

      {/* Live Test Feedback Banner */}
      {testResult && (
        <div
          className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
            testResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold">
              {testResult.success ? t('verificationSuccessful') : t('verificationFailed')}
            </div>
            <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
              {testResult.message}
            </div>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {apiKey.trim()
            ? `${t('keyActive')} (${apiKey.slice(0, 4)}...${apiKey.slice(-4)})`
            : t('noPersonalKeySaved')}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={async () => {
              await handleSaveApiKey();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            {t('saveConfiguration')}
          </button>
        </div>
      </div>
    </div>
  );
};
