'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import {
  CardDetailSettings,
  DEFAULT_CARD_DETAIL_SETTINGS,
  getStoredCardDetailSettings,
  saveStoredCardDetailSettings,
  DetailItemConfig,
} from '@/lib/cardDetailSettings';
import { ByokStorage, StorageMode } from '@/lib/crypto';
import { ALL_GEMINI_LANGUAGES, LanguageItem } from '@/lib/languages';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { fetchDecks } from '@/lib/api';
import { Deck } from '@/lib/types';
import { SettingsModalType } from './types';
import { AccountCard } from './AccountCard';
import { VocabularyCard } from './VocabularyCard';
import { LearningCard } from './LearningCard';
import { AppearanceCard } from './AppearanceCard';
import { AiEngineCard } from './AiEngineCard';
import { AdvancedCard } from './AdvancedCard';
import { SettingsModals } from './SettingsModals';
import { CardDetailCheckboxItem } from './components/CardDetailCheckboxItem';
import { useSettingsManager } from './hooks/useSettingsManager';

type SettingsCategory = 'core' | 'linguistics' | 'ai' | 'practice';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appLanguage, setAppLanguage, t } = useI18n();
  const { theme: themeMode, setTheme: setThemeMode, accent, setAccent, currentAccent } = useTheme();
  
  // API & BYOK States
  const [apiKey, setApiKey] = useState(() => (typeof window !== 'undefined' ? ByokStorage.getPlainKey() : ''));
  const [pexelsKey, setPexelsKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('duocard_pexels_key') || '' : ''));
  const [apiStorageMode, setApiStorageMode] = useState<StorageMode>(() => (typeof window !== 'undefined' ? ByokStorage.getMode() : 'local'));
  const [pexelsStorageMode, setPexelsStorageMode] = useState<StorageMode>(() => {
    if (typeof window === 'undefined') return 'local';
    return (localStorage.getItem('duocard_pexels_storage_mode') as StorageMode) || 'local';
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => (typeof window !== 'undefined' ? ByokStorage.getModel() : 'gemini-3.5-flash-lite'));
  const [showApiKey, setShowApiKey] = useState(false);
  const [secretPassphrase, setSecretPassphrase] = useState('');
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  // Languages
  const [selectedTargetLang] = useState<LanguageItem>(() => {
    if (typeof window === 'undefined') return ALL_GEMINI_LANGUAGES.find((l) => l.name === 'Hebrew') || ALL_GEMINI_LANGUAGES[0];
    const saved = localStorage.getItem('duocard_learning_lang') || localStorage.getItem('duocard_target_lang') || 'Hebrew';
    return ALL_GEMINI_LANGUAGES.find((l) => l.name.toLowerCase() === saved.toLowerCase()) || ALL_GEMINI_LANGUAGES[0];
  });
  const [selectedNativeLang] = useState<LanguageItem>(() => {
    if (typeof window === 'undefined') return ALL_GEMINI_LANGUAGES.find((l) => l.name === 'English') || ALL_GEMINI_LANGUAGES[1];
    const saved = localStorage.getItem('duocard_native_lang') || 'English';
    return ALL_GEMINI_LANGUAGES.find((l) => l.name.toLowerCase() === saved.toLowerCase()) || ALL_GEMINI_LANGUAGES[1];
  });

  // Settings
  const [detailSettings, setDetailSettings] = useState<CardDetailSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_CARD_DETAIL_SETTINGS;
    return getStoredCardDetailSettings();
  });
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    if (typeof window === 'undefined') return 40;
    const saved = localStorage.getItem('duocard_daily_goal');
    return saved ? Number(saved) : 40;
  });
  const [reviewSchedule, setReviewSchedule] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Spaced Repetition';
    return localStorage.getItem('duocard_review_schedule') || 'Spaced Repetition';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name');
    return saved && !['Verizon Kert', 'Learner', 'Alex Morgan'].includes(saved) ? saved : '';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('duocard_email');
    return saved && !['verizon.kert@polyglot.io'].includes(saved.toLowerCase()) ? saved : '';
  });
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Modal handlers
  const [activeModal, setActiveModal] = useState<SettingsModalType>(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam === 'privacy' || modalParam === 'help') {
      return modalParam;
    }
    return null;
  });

  // Keep activeModal in sync whenever URL searchParams change (e.g. clicking Help & Support from sidebar)
  useEffect(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam === 'privacy' || modalParam === 'help') {
      setActiveModal(modalParam);
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    const key = ByokStorage.getPlainKey();
    setApiKey(key);
    setApiStorageMode(ByokStorage.getMode());
    setSelectedModel(ByokStorage.getModel());

    const savedPexels = localStorage.getItem('duocard_pexels_key') || '';
    setPexelsKey(savedPexels);
    const savedPexelsMode = (localStorage.getItem('duocard_pexels_storage_mode') as StorageMode) || 'local';
    setPexelsStorageMode(savedPexelsMode);

    setTestResult(null);
    setActiveModal(null);

    // If modal was opened via ?modal=..., remove it from URL so reopening works cleanly
    if (searchParams.get('modal')) {
      router.replace('/settings');
    }
  };

  const [availableDecks, setAvailableDecks] = useState<Deck[]>([]);

  useEffect(() => {
    fetchDecks()
      .then((decks) => {
        if (decks && Array.isArray(decks)) {
          setAvailableDecks(decks);
        }
      })
      .catch((err) => {
        console.error('Failed to load decks for export:', err);
      });
  }, []);

  const manager = useSettingsManager({
    selectedNativeLang,
    selectedTargetLang,
    detailSettings,
    setDetailSettings,
    themeMode,
    dailyGoal,
    setDailyGoal,
    reviewSchedule,
    setReviewSchedule,
    notificationsEnabled,
    availableDecks,
    setAvailableDecks,
    setActiveModal,
  });

  const handleSaveApiKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      ByokStorage.clearAll();
      setApiKey('');
      return;
    }

    if (apiStorageMode === 'cloud') {
      const pass = secretPassphrase.trim() || 'duocard-default-salt';
      await ByokStorage.saveEncryptedCloud(trimmed, pass, selectedModel);
      ByokStorage.setModel(selectedModel);
    } else {
      ByokStorage.saveLocal(trimmed);
      ByokStorage.setModel(selectedModel);
    }
  };

  const handleTestApiKey = async () => {
    setTestingKey(true);
    setTestResult(null);
    const result = await ByokStorage.testGeminiKey(apiKey, selectedModel);
    setTestingKey(false);
    setTestResult(result);
  };

  const handleClearApiKey = () => {
    ByokStorage.clearAll();
    setApiKey('');
    setTestResult(null);
  };

  const handleSave = async () => {
    if (apiKey.trim()) {
      handleSaveApiKey();
    } else {
      ByokStorage.clearAll();
    }
    const trimmedPexels = pexelsKey.trim();
    localStorage.setItem('duocard_pexels_key', trimmedPexels);
    localStorage.setItem('duocard_pexels_storage_mode', pexelsStorageMode);
    if (pexelsStorageMode === 'cloud' && trimmedPexels) {
      const pass = secretPassphrase.trim() || 'duocard-default-salt';
      try {
        const { encryptApiKey } = await import('@/lib/crypto');
        const pexelsPayload = await encryptApiKey(trimmedPexels, pass);
        const userIdentifier = localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username') || 'default_user';
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        await fetch(`${apiBase}/sync/key`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userIdentifier,
            pexelsCiphertext: pexelsPayload.ciphertext,
            pexelsIv: pexelsPayload.iv,
            pexelsSalt: pexelsPayload.salt,
          }),
        });
      } catch (err) {
        console.warn('Could not sync encrypted Pexels key to cloud backend:', err);
      }
    }
    localStorage.setItem('duocard_native_lang', selectedNativeLang.name);
    localStorage.setItem('duocard_learning_lang', selectedTargetLang.name);
    localStorage.setItem('duocard_target_lang', selectedTargetLang.name);
    saveStoredCardDetailSettings(detailSettings);

    // Sync preferences directly to PostgreSQL database
    const userIdentifier = localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username');
    if (userIdentifier) {
      try {
        const { savePreferences: apiSavePreferences } = await import('@/lib/api');
        await apiSavePreferences({
          usernameOrEmail: userIdentifier,
          targetLang: selectedTargetLang.name,
          nativeLang: selectedNativeLang.name,
          dailyGoalCards: dailyGoal,
          cardDetailSettings: JSON.stringify(detailSettings),
          themeMode: themeMode,
        });
      } catch (e) {
        console.warn('Could not sync settings to database:', e);
      }
    }
  };

  const categoriesList: SettingsCategory[] = ['core', 'linguistics', 'ai', 'practice'];

  function renderCheckboxItem(item: DetailItemConfig) {
    return (
      <CardDetailCheckboxItem
        key={item.key}
        item={item}
        isChecked={Boolean(detailSettings[item.key])}
        onToggle={manager.handleToggle}
        t={t}
      />
    );
  }

  return (
    <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('backToCollections')}
          </Link>
          <span className="text-xs text-slate-500 font-mono">Reory &bull; Preferences</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#192338] dark:text-white tracking-tight flex items-center gap-2.5">
            {t('settings')}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            {t('settingsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="space-y-5">
            <AccountCard
              onOpenModal={(m) => setActiveModal(m)}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
            />

            <VocabularyCard
              onOpenModal={(m) => setActiveModal(m)}
              enabledCount={manager.enabledCount}
              appLanguage={appLanguage}
            />

            <LearningCard
              onOpenModal={(m) => setActiveModal(m)}
              dailyGoal={dailyGoal}
              reviewSchedule={reviewSchedule}
            />
          </div>

          <div className="space-y-5">
            <AppearanceCard
              themeMode={themeMode}
              setThemeMode={setThemeMode}
              accent={accent}
              setAccent={setAccent}
              currentAccent={currentAccent}
              appLanguage={appLanguage}
              setAppLanguage={setAppLanguage}
              isLangDropdownOpen={isLangDropdownOpen}
              setIsLangDropdownOpen={setIsLangDropdownOpen}
            />

            <AiEngineCard
              onOpenModal={(m) => setActiveModal(m)}
              apiKey={apiKey}
              apiStorageMode={apiStorageMode}
              pexelsKey={pexelsKey}
              pexelsStorageMode={pexelsStorageMode}
            />

            <AdvancedCard
              onOpenModal={(m) => setActiveModal(m)}
              onResetImportState={() => {
                manager.setImportFile(null);
                manager.setImportError(null);
                manager.setImportSuccessMessage(null);
                manager.setImportPreviewCount(null);
              }}
            />
          </div>
        </div>

        <SettingsModals
          activeModal={activeModal}
          setActiveModal={(m) => { if (m === null) handleCloseModal(); else setActiveModal(m); }}
          currentAccent={currentAccent}
          userName={userName}
          setUserName={setUserName}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          dailyGoal={dailyGoal}
          setDailyGoal={setDailyGoal}
          reviewSchedule={reviewSchedule}
          setReviewSchedule={setReviewSchedule}
          apiStorageMode={apiStorageMode}
          setApiStorageMode={setApiStorageMode}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          showApiKey={showApiKey}
          setShowApiKey={setShowApiKey}
          apiKey={apiKey}
          setApiKey={setApiKey}
          secretPassphrase={secretPassphrase}
          setSecretPassphrase={setSecretPassphrase}
          testingKey={testingKey}
          testResult={testResult}
          setTestResult={setTestResult}
          handleTestApiKey={handleTestApiKey}
          handleClearApiKey={handleClearApiKey}
          handleSaveApiKey={handleSaveApiKey}
          pexelsKey={pexelsKey}
          setPexelsKey={setPexelsKey}
          pexelsStorageMode={pexelsStorageMode}
          setPexelsStorageMode={setPexelsStorageMode}
          handleSave={handleSave}
          appLanguage={appLanguage}
          setAppLanguage={setAppLanguage}
          handleSelectAll={manager.handleSelectAll}
          enabledCount={manager.enabledCount}
          activeCategoryFilter={manager.activeCategoryFilter}
          setActiveCategoryFilter={manager.setActiveCategoryFilter}
          categoriesList={categoriesList}
          filteredItems={manager.filteredItems}
          renderCheckboxItem={renderCheckboxItem}
          exportFormats={manager.exportFormats}
          toggleExportFormat={manager.toggleExportFormat}
          selectedDeckIds={manager.selectedDeckIds}
          handleSelectAllDecks={manager.handleSelectAllDecks}
          toggleDeckSelection={manager.toggleDeckSelection}
          availableDecks={availableDecks}
          includeSettings={manager.includeSettings}
          setIncludeSettings={manager.setIncludeSettings}
          isExporting={manager.isExporting}
          handleExecuteExport={manager.handleExecuteExport}
          importFile={manager.importFile}
          importPreviewCount={manager.importPreviewCount}
          handleFileSelect={manager.handleFileSelect}
          importTargetDeckId={manager.importTargetDeckId}
          setImportTargetDeckId={manager.setImportTargetDeckId}
          importNewDeckTitle={manager.importNewDeckTitle}
          setImportNewDeckTitle={manager.setImportNewDeckTitle}
          importNewDeckLang={manager.importNewDeckLang}
          setImportNewDeckLang={manager.setImportNewDeckLang}
          importError={manager.importError}
          importSuccessMessage={manager.importSuccessMessage}
          isImporting={manager.isImporting}
          handleExecuteImport={manager.handleExecuteImport}
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] p-8 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
