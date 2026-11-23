'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { FileUp, AlertCircle, Check, Loader2, Upload } from 'lucide-react';
import { ALL_GEMINI_LANGUAGES } from '@/lib/languages';
import { Deck } from '@/lib/types';

interface ImportDataModalProps {
  importFile: File | null;
  importPreviewCount: number | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  importTargetDeckId: string;
  setImportTargetDeckId: (id: string) => void;
  importNewDeckTitle: string;
  setImportNewDeckTitle: (t: string) => void;
  importNewDeckLang: string;
  setImportNewDeckLang: (l: string) => void;
  importError: string | null;
  importSuccessMessage: string | null;
  isImporting: boolean;
  handleExecuteImport: () => void;
  availableDecks: Deck[];
  onClose: () => void;
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
  importFile,
  importPreviewCount,
  handleFileSelect,
  importTargetDeckId,
  setImportTargetDeckId,
  importNewDeckTitle,
  setImportNewDeckTitle,
  importNewDeckLang,
  setImportNewDeckLang,
  importError,
  importSuccessMessage,
  isImporting,
  handleExecuteImport,
  availableDecks,
  onClose,
}) => {
  const { t } = useI18n();
  return (
              <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                {/* File Upload Drop Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {t('uploadFlashcardsFile')}
                  </label>
                  <label
                    htmlFor="import-file-input"
                    className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      importFile
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-white/10 hover:border-emerald-500/30 bg-white/[0.02] hover:bg-slate-100/60 dark:hover:bg-white/5'
                    }`}
                  >
                    <input
                      id="import-file-input"
                      type="file"
                      accept=".json,.csv,.txt,.tsv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                      <FileUp className="w-5 h-5" />
                    </div>

                    {importFile ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-300 block">
                          {importFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {(importFile.size / 1024).toFixed(1)} KB &bull;{' '}
                          {importPreviewCount !== null
                            ? `~${importPreviewCount} cards detected`
                            : 'Valid format'}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-semibold underline pt-1 block">
                          Click to choose a different file
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white block">
                          Choose a file or drag &amp; drop
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {t('supportsFormats')}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* {t('importDestination')} Options */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Import Destination
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImportTargetDeckId('new')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        importTargetDeckId === 'new'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">
                        {t('createNewCollection')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t('organizeImportedDedicated')}
                      </div>
                    </button>

                    <button
                      type="button"
                      disabled={availableDecks.length === 0}
                      onClick={() => {
                        if (availableDecks.length > 0) {
                          setImportTargetDeckId(String(availableDecks[0].id));
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        importTargetDeckId !== 'new'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">
                        {t('addToExistingCollection')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t('appendNewVocabularyCurrent')}
                      </div>
                    </button>
                  </div>

                  {/* If New Collection */}
                  {importTargetDeckId === 'new' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400 block">
                          {t('collectionTitle')}
                        </label>
                        <input
                          type="text"
                          value={importNewDeckTitle}
                          onChange={(e) => setImportNewDeckTitle(e.target.value)}
                          placeholder="e.g. Spanish Essentials"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400 block">
                          {t('language')}
                        </label>
                        <select
                          value={importNewDeckLang}
                          onChange={(e) => setImportNewDeckLang(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                        >
                          {ALL_GEMINI_LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.name}>
                              {lang.defaultIcon} {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* If Existing Collection */
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400 block">
                        Select Existing Collection
                      </label>
                      <select
                        value={importTargetDeckId}
                        onChange={(e) => setImportTargetDeckId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                      >
                        {availableDecks.map((d) => (
                          <option key={d.id} value={String(d.id)}>
                            {d.title} ({d.cards?.length || 0} cards) - {d.language}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {importError && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {importSuccessMessage && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                    <span>{importSuccessMessage}</span>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    {importPreviewCount !== null ? `Ready: ~${importPreviewCount} cards` : t('awaitingFile')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onClose()}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {t('close')}
                    </button>
                    <button
                      type="button"
                      disabled={!importFile || isImporting}
                      onClick={handleExecuteImport}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Importing Cards...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>{t('startImport')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
  );
};
