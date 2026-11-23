'use client';

import { useState, useMemo } from 'react';
import {
  CardDetailSettings,
  CARD_DETAIL_ITEMS,
  saveStoredCardDetailSettings,
} from '@/lib/cardDetailSettings';
import { ExportFormatType, generateExportData, executeImport } from '../exportImportUtils';
import { Deck } from '@/lib/types';
import { LanguageItem } from '@/lib/languages';

interface UseSettingsManagerProps {
  selectedNativeLang: LanguageItem;
  selectedTargetLang: LanguageItem;
  detailSettings: CardDetailSettings;
  setDetailSettings: React.Dispatch<React.SetStateAction<CardDetailSettings>>;
  themeMode: string;
  dailyGoal: number;
  setDailyGoal: (val: number) => void;
  reviewSchedule: string;
  setReviewSchedule: (val: string) => void;
  notificationsEnabled: boolean;
  availableDecks: Deck[];
  setAvailableDecks: (decks: Deck[]) => void;
  setActiveModal: (modal: null) => void;
}

export function useSettingsManager({
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
}: UseSettingsManagerProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'core' | 'linguistics' | 'ai' | 'practice'>('all');

  // Export State
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);
  const [exportFormats, setExportFormats] = useState<ExportFormatType[]>(['json']);
  const [includeSettings, setIncludeSettings] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importTargetDeckId, setImportTargetDeckId] = useState<string>('new');
  const [importNewDeckTitle, setImportNewDeckTitle] = useState('');
  const [importNewDeckLang, setImportNewDeckLang] = useState('Spanish');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [importPreviewCount, setImportPreviewCount] = useState<number | null>(null);
  const [importFileFormat, setImportFileFormat] = useState<string>('');

  const toggleExportFormat = (fmt: ExportFormatType) => {
    setExportFormats((prev) => (prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]));
  };

  const handleToggle = (key: keyof CardDetailSettings) => {
    setDetailSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveStoredCardDetailSettings(updated);
      return updated;
    });
  };

  const handleSelectAll = (enable: boolean) => {
    const updated = { ...detailSettings };
    (Object.keys(updated) as Array<keyof CardDetailSettings>).forEach((k) => {
      updated[k] = enable;
    });
    setDetailSettings(updated);
    saveStoredCardDetailSettings(updated);
  };

  const enabledCount = useMemo(
    () => Object.values(detailSettings).filter(Boolean).length,
    [detailSettings]
  );

  const filteredItems = useMemo(() => {
    if (activeCategoryFilter === 'all') return CARD_DETAIL_ITEMS;
    return CARD_DETAIL_ITEMS.filter((item) => item.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  const toggleDeckSelection = (deckId: number) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId) ? prev.filter((id) => id !== deckId) : [...prev, deckId]
    );
  };

  const handleSelectAllDecks = (select: boolean) => {
    if (select) {
      setSelectedDeckIds(availableDecks.map((d) => d.id));
    } else {
      setSelectedDeckIds([]);
    }
  };

  const handleExecuteExport = () => {
    try {
      setIsExporting(true);
      generateExportData({
        exportFormats,
        selectedDeckIds,
        availableDecks,
        includeSettings,
        themeMode,
        dailyGoal,
        reviewSchedule,
        notificationsEnabled,
        selectedNativeLangName: selectedNativeLang.name,
        selectedTargetLangName: selectedTargetLang.name,
        detailSettings,
      });

      setTimeout(() => {
        setIsExporting(false);
        setActiveModal(null);
      }, 400);
    } catch (e) {
      console.error('Export error:', e);
      setIsExporting(false);
      alert('Failed to generate export file. Please try again.');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportError(null);
    setImportSuccessMessage(null);

    const name = file.name.toLowerCase();
    let format = 'unknown';
    if (name.endsWith('.json')) format = 'json';
    else if (name.endsWith('.csv')) format = 'csv';
    else if (name.endsWith('.txt') || name.endsWith('.tsv')) format = 'txt';
    setImportFileFormat(format);

    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setImportNewDeckTitle(formattedTitle);

    try {
      const text = await file.text();
      if (format === 'json') {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.decks)) {
          const totalCards = parsed.decks.reduce(
            (acc: number, d: { cards?: unknown[] }) => acc + (d.cards?.length || 0),
            0
          );
          setImportPreviewCount(totalCards);
        } else if (Array.isArray(parsed)) {
          setImportPreviewCount(parsed.length);
        } else if (parsed.cards && Array.isArray(parsed.cards)) {
          setImportPreviewCount(parsed.cards.length);
        } else {
          setImportPreviewCount(null);
        }
      } else if (format === 'csv') {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const count = lines.length > 1 ? lines.length - 1 : lines.length;
        setImportPreviewCount(count);
      } else if (format === 'txt') {
        const lines = text
          .split(/\r?\n/)
          .filter((l) => l.trim().length > 0 && !l.startsWith('#'));
        setImportPreviewCount(lines.length);
      }
    } catch {
      setImportPreviewCount(null);
    }
  };

  const handleExecuteImport = async () => {
    if (!importFile) {
      setImportError('Please select a file to import.');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccessMessage(null);

    try {
      const res = await executeImport({
        importFile,
        importFileFormat,
        importTargetDeckId,
        importNewDeckTitle,
        importNewDeckLang,
        detailSettings,
        setDetailSettings,
        saveStoredCardDetailSettings,
        setDailyGoal,
        setReviewSchedule,
        setAvailableDecks,
      });

      setImportSuccessMessage(
        `Successfully imported ${res.cardsCount} ${res.cardsCount === 1 ? 'card' : 'cards'}${
          res.decksCount > 0 ? ` across ${res.decksCount} collection(s)` : ''
        }!`
      );
      setImportFile(null);
      setImportPreviewCount(null);
    } catch (err: unknown) {
      console.error('Import failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to parse and import data. Please check file format.';
      setImportError(msg);
    } finally {
      setIsImporting(false);
    }
  };

  return {
    activeCategoryFilter,
    setActiveCategoryFilter,
    enabledCount,
    filteredItems,
    handleToggle,
    handleSelectAll,
    selectedDeckIds,
    setSelectedDeckIds,
    exportFormats,
    toggleExportFormat,
    includeSettings,
    setIncludeSettings,
    isExporting,
    toggleDeckSelection,
    handleSelectAllDecks,
    handleExecuteExport,
    importFile,
    setImportFile,
    importTargetDeckId,
    setImportTargetDeckId,
    importNewDeckTitle,
    setImportNewDeckTitle,
    importNewDeckLang,
    setImportNewDeckLang,
    isImporting,
    importError,
    setImportError,
    importSuccessMessage,
    setImportSuccessMessage,
    importPreviewCount,
    setImportPreviewCount,
    handleFileSelect,
    handleExecuteImport,
  };
}
