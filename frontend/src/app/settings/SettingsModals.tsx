'use client';

import React from 'react';
import {
  X,
  User,
  Lock,
  Shield,
  HelpCircle,
  Target,
  Calendar,
  Key,
  Image as ImageIcon,
  Globe2,
  Download,
  Upload,
  Check,
  Trash2,
} from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { LanguageItem } from '@/lib/languages';
import { SUPPORTED_APP_LANGUAGES, AppLanguage, useI18n } from '@/lib/i18n';
import { StorageMode } from '@/lib/crypto';
import { Deck } from '@/lib/types';
import { DetailItemConfig } from '@/lib/cardDetailSettings';
import { AccentOption } from '@/lib/theme';
import { SettingsModalType } from './types';
import { GeminiKeyModal } from './modals/GeminiKeyModal';
import { PexelsKeyModal } from './modals/PexelsKeyModal';
import { ExportDataModal } from './modals/ExportDataModal';
import { ExportFormatType } from './exportImportUtils';
import { ImportDataModal } from './modals/ImportDataModal';
import { ProfileModal } from './modals/ProfileModal';
import { PasswordModal } from './modals/PasswordModal';
import { DailyGoalModal } from './modals/DailyGoalModal';
import { ReviewScheduleModal } from './modals/ReviewScheduleModal';
import { PrivacyModal } from './modals/PrivacyModal';
import { HelpModal } from './modals/HelpModal';
import { DeleteAccountModal } from './modals/DeleteAccountModal';

export interface SettingsModalsProps {
  activeModal: SettingsModalType;
  setActiveModal: (m: SettingsModalType) => void;
  currentAccent: AccentOption;
  userName: string;
  setUserName: (n: string) => void;
  userEmail: string;
  setUserEmail: (e: string) => void;
  dailyGoal: number;
  setDailyGoal: (g: number) => void;
  reviewSchedule: string;
  setReviewSchedule: (s: string) => void;
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
  pexelsKey: string;
  setPexelsKey: (k: string) => void;
  pexelsStorageMode: StorageMode;
  setPexelsStorageMode: (m: StorageMode) => void;
  handleSave: () => void;
  appLanguage: string;
  setAppLanguage: (l: AppLanguage) => void;
  handleSelectAll: (enable: boolean) => void;
  enabledCount: number;
  activeCategoryFilter: 'all' | 'core' | 'linguistics' | 'ai' | 'practice';
  setActiveCategoryFilter: (c: 'all' | 'core' | 'linguistics' | 'ai' | 'practice') => void;
  categoriesList: ('core' | 'linguistics' | 'ai' | 'practice')[];
  filteredItems: DetailItemConfig[];
  renderCheckboxItem: (item: DetailItemConfig) => React.ReactNode;
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
}

export const SettingsModals: React.FC<SettingsModalsProps> = ({
  activeModal,
  setActiveModal,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  dailyGoal,
  setDailyGoal,
  reviewSchedule,
  setReviewSchedule,
  apiStorageMode,
  setApiStorageMode,
  showApiKey,
  setShowApiKey,
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  secretPassphrase,
  setSecretPassphrase,
  testingKey,
  testResult,
  setTestResult,
  handleTestApiKey,
  handleClearApiKey,
  handleSaveApiKey,
  pexelsKey,
  setPexelsKey,
  pexelsStorageMode,
  setPexelsStorageMode,
  handleSave,
  appLanguage,
  setAppLanguage,
  handleSelectAll,
  enabledCount,
  activeCategoryFilter,
  setActiveCategoryFilter,
  categoriesList,
  filteredItems,
  renderCheckboxItem,
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
}) => {
  const { t } = useI18n();
  if (!activeModal) return null;

  return (

    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${activeModal === 'wordChecklist' || activeModal === 'exportData' || activeModal === 'importData' || activeModal === 'geminiKey' ? 'max-w-xl' : 'max-w-md'} rounded-3xl bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#2e2e2e] shadow-2xl p-6 space-y-5 relative max-h-[90vh] flex flex-col cursor-default`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {activeModal === 'profile' && (
              <>
                <User className="w-5 h-5 text-cyan-400" />
                {t('profileDetails')}
              </>
            )}
            {activeModal === 'password' && (
              <>
                <Lock className="w-5 h-5 text-indigo-400" />
                {t('changePassword')}
              </>
            )}
            {activeModal === 'privacy' && (
              <>
                <Shield className="w-5 h-5 text-emerald-400" />
                {t('privacySecurity')}
              </>
            )}
            {activeModal === 'help' && (
              <>
                <HelpCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                {t('helpSupport')}
              </>
            )}
            {activeModal === 'dailyGoal' && (
              <>
                <Target className="w-5 h-5 text-emerald-400" />
                {t('dailyLearningGoal')}
              </>
            )}
            {activeModal === 'reviewSchedule' && (
              <>
                <Calendar className="w-5 h-5 text-cyan-400" />
                {t('reviewSchedule')}
              </>
            )}
            {activeModal === 'geminiKey' && (
              <>
                <Key className="w-5 h-5 text-amber-400" />
                {t('geminiAiConfig')}
              </>
            )}
            {activeModal === 'pexelsKey' && (
              <>
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                {t('pexelsImageApi')}
              </>
            )}
            
            {activeModal === 'appLanguages' && (
              <>
                <Globe2 className="w-5 h-5 text-indigo-400" />
                {t('interfaceLanguageModal')}
              </>
            )}
            {activeModal === 'wordChecklist' && (
              <>
                <Check className="w-5 h-5 text-purple-400" />
                {t('wordChecklistModal')}
              </>
            )}
            {activeModal === 'exportData' && (
              <>
                <Download className="w-5 h-5 text-blue-400" />
                {t('exportFlashcardsModal')}
              </>
            )}
            {activeModal === 'importData' && (
              <>
                <Upload className="w-5 h-5 text-indigo-400" />
                {t('importFlashcardsModal')}
              </>
            )}
            {activeModal === 'deleteAccount' && (
              <>
                <Trash2 className="w-5 h-5 text-rose-500" />
                {t('deleteAccount')}
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeModal === 'profile' && (
          <ProfileModal
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'password' && (
          <PasswordModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'dailyGoal' && (
          <DailyGoalModal
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'reviewSchedule' && (
          <ReviewScheduleModal
            reviewSchedule={reviewSchedule}
            setReviewSchedule={setReviewSchedule}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'privacy' && (
          <PrivacyModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'help' && (
          <HelpModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'geminiKey' && (
          <GeminiKeyModal
            apiStorageMode={apiStorageMode}
            setApiStorageMode={setApiStorageMode}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            apiKey={apiKey}
            setApiKey={setApiKey}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            secretPassphrase={secretPassphrase}
            setSecretPassphrase={setSecretPassphrase}
            testingKey={testingKey}
            testResult={testResult}
            setTestResult={setTestResult}
            handleTestApiKey={handleTestApiKey}
            handleClearApiKey={handleClearApiKey}
            handleSaveApiKey={handleSaveApiKey}
            onClose={() => setActiveModal(null)}
          />
        )}
        {/* PEXELS KEY MODAL */}
        {activeModal === 'pexelsKey' && (
          <PexelsKeyModal
            pexelsStorageMode={pexelsStorageMode}
            setPexelsStorageMode={setPexelsStorageMode}
            pexelsKey={pexelsKey}
            setPexelsKey={setPexelsKey}
            secretPassphrase={secretPassphrase}
            setSecretPassphrase={setSecretPassphrase}
            handleSave={handleSave}
            onClose={() => setActiveModal(null)}
          />
        )}

        {/* APPLICATION UI LANGUAGES MODAL */}
        {activeModal === 'appLanguages' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              {t('selectInterfaceLanguage')}
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {SUPPORTED_APP_LANGUAGES.map((lang) => {
                const isSelected = appLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setAppLanguage(lang.code);
                      setActiveModal(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${isSelected
                        ? 'bg-indigo-500/20 border-indigo-400/50 text-white'
                        : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06]'
                      }`}
                  >
                    <FlagIcon code={lang.countryCode} size="sm" />
                    <div className="truncate flex-1 min-w-0">
                      <span className="block text-xs font-bold truncate">{lang.name}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{lang.nativeName}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 16 WORD DETAILS CHECKLIST MODAL */}
        {activeModal === 'wordChecklist' && (
          <div className="space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t('selectAll')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  {t('deselectAll')}
                </button>
              </div>
              <span className="text-xs text-cyan-400 font-bold">{enabledCount} / 16 {t('activeLabel')}</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${activeCategoryFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
              >
                {t('categoryAll')}
              </button>
              {categoriesList.map((catKey) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setActiveCategoryFilter(catKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${activeCategoryFilter === catKey
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                >
                  {catKey === 'core'
                    ? 'Core'
                    : catKey === 'linguistics'
                      ? 'Linguistics'
                      : catKey === 'ai'
                        ? 'AI'
                        : 'Practice'}
                </button>
              ))}
            </div>

            {/* Checklist items list */}
            <div className="overflow-y-auto space-y-2 pr-1 max-h-[340px]">
              {filteredItems.map((item) => renderCheckboxItem(item))}
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
              >
                {t('done')}
              </button>
            </div>
          </div>
        )}

        {/* 10. Export Data Modal */}
        {activeModal === 'exportData' && (
          <ExportDataModal
            exportFormats={exportFormats}
            toggleExportFormat={toggleExportFormat}
            selectedDeckIds={selectedDeckIds}
            handleSelectAllDecks={handleSelectAllDecks}
            toggleDeckSelection={toggleDeckSelection}
            availableDecks={availableDecks}
            includeSettings={includeSettings}
            setIncludeSettings={setIncludeSettings}
            isExporting={isExporting}
            handleExecuteExport={handleExecuteExport}
            onClose={() => setActiveModal(null)}
          />
        )}
        {/* 11. Import Data Modal */}
        {activeModal === 'importData' && (
          <ImportDataModal
            importFile={importFile}
            importPreviewCount={importPreviewCount}
            handleFileSelect={handleFileSelect}
            importTargetDeckId={importTargetDeckId}
            setImportTargetDeckId={setImportTargetDeckId}
            importNewDeckTitle={importNewDeckTitle}
            setImportNewDeckTitle={setImportNewDeckTitle}
            importNewDeckLang={importNewDeckLang}
            setImportNewDeckLang={setImportNewDeckLang}
            importError={importError}
            importSuccessMessage={importSuccessMessage}
            isImporting={isImporting}
            handleExecuteImport={handleExecuteImport}
            availableDecks={availableDecks}
            onClose={() => setActiveModal(null)}
          />
        )}

        {/* 12. Delete Account Modal */}
        {activeModal === 'deleteAccount' && (
          <DeleteAccountModal
            userName={userName}
            userEmail={userEmail}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </div>
  );
};
