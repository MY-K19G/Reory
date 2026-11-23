'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Code,
  FileSpreadsheet,
  FolderArchive,
  FileText,
  Check,
  Download,
} from 'lucide-react';
import { Deck } from '@/lib/types';
import { ExportFormatType } from '../exportImportUtils';

interface ExportDataModalProps {
  exportFormats: ExportFormatType[];
  toggleExportFormat: (f: ExportFormatType) => void;
  selectedDeckIds: number[];
  handleSelectAllDecks: (select: boolean) => void;
  toggleDeckSelection: (id: number) => void;
  availableDecks: Deck[];
  includeSettings: boolean;
  setIncludeSettings: (inc: boolean) => void;
  isExporting: boolean;
  handleExecuteExport: () => void;
  onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  exportFormats,
  toggleExportFormat,
  selectedDeckIds,
  handleSelectAllDecks,
  toggleDeckSelection,
  availableDecks,
  includeSettings,
  setIncludeSettings,
  isExporting,
  handleExecuteExport,
  onClose,
}) => {
  const { t } = useI18n();
  return (
              <div className="space-y-5 overflow-y-auto pr-1 flex-1">
                {/* Format selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 block">
                      {t('chooseExportFormat')}
                    </label>
                    <span className="text-[11px] text-blue-400 font-semibold">
                      {exportFormats.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        id: 'json' as ExportFormatType,
                        name: 'JSON',
                        desc: 'Full data & stats',
                        icon: Code,
                        color: 'text-indigo-400',
                        badge: '.json',
                      },
                      {
                        id: 'csv' as ExportFormatType,
                        name: 'CSV Sheet',
                        desc: 'Excel / Sheets',
                        icon: FileSpreadsheet,
                        color: 'text-emerald-400',
                        badge: '.csv',
                      },
                      {
                        id: 'anki' as ExportFormatType,
                        name: 'Anki TXT',
                        desc: 'Direct flashcard import',
                        icon: FolderArchive,
                        color: 'text-cyan-400',
                        badge: '.txt',
                      },
                      {
                        id: 'txt' as ExportFormatType,
                        name: 'TSV / Text',
                        desc: 'Tab delimited',
                        icon: FileText,
                        color: 'text-amber-400',
                        badge: '.tsv',
                      },
                    ].map((fmt) => {
                      const Icon = fmt.icon;
                      const isSelected = exportFormats.includes(fmt.id);
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => toggleExportFormat(fmt.id)}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-500/15 border-blue-500/40 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/40'
                              : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-slate-100/60 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : fmt.color}`} />
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                {fmt.badge}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-blue-500 text-slate-950 font-bold'
                                    : 'border border-white/15 bg-white/5'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              {fmt.name}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                              {fmt.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collection / Deck selection */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block">
                        {t('selectCollectionsChosen')} ({selectedDeckIds.length} / {availableDecks.length})
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {t('chooseDecksToInclude')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAllDecks(true)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        {t('selectAll')}
                      </button>
                      <span className="text-white/20">&bull;</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllDecks(false)}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        {t('deselectAll')}
                      </button>
                    </div>
                  </div>

                  {availableDecks.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
                      {t('noCollectionsInLibraryYet')}
                    </div>
                  ) : (
                    <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                      {availableDecks.map((deck) => {
                        const isSelected = selectedDeckIds.includes(deck.id);
                        const cardCount = deck.cards?.length || 0;
                        return (
                          <div
                            key={deck.id}
                            onClick={() => toggleDeckSelection(deck.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none group ${
                              isSelected
                                ? 'bg-blue-500/10 border-blue-500/30 text-white'
                                : 'bg-[#080a10] border-white/5 text-slate-400 hover:bg-white/[0.03] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/30'
                                    : 'border border-white/10 bg-slate-900 group-hover:border-white/20'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>

                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-200 transition-colors truncate">
                                  {deck.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {deck.language || 'General'} &bull; {deck.level || 'All levels'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-300">
                                {cardCount} {cardCount === 1 ? 'card' : 'cards'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Additional export options */}
                {exportFormats.includes('json') && (
                  <div
                    onClick={() => setIncludeSettings(!includeSettings)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-slate-100/60 dark:hover:bg-white/5 cursor-pointer select-none transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">
                        {t('includePreferencesConfig')}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {t('saveDailyGoalsLanguagesToggles')}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                        includeSettings
                          ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/30'
                          : 'border border-white/10 bg-slate-900'
                      }`}
                    >
                      {includeSettings && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    {selectedDeckIds.length}{' '}
                    {selectedDeckIds.length === 1 ? 'collection' : 'collections'} &bull; {exportFormats.length} {exportFormats.length === 1 ? 'format' : 'formats'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onClose()}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="button"
                      disabled={selectedDeckIds.length === 0 || exportFormats.length === 0 || isExporting}
                      onClick={handleExecuteExport}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {isExporting ? 'Exporting...' : `Export (${selectedDeckIds.length})`}
                    </button>
                  </div>
                </div>
              </div>

  );
};
