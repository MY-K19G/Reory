import { addCardToDeck, createDeck, fetchDecks } from '@/lib/api';
import { CardDetailSettings } from '@/lib/cardDetailSettings';

export function escapeCsv(val: string): string {
  const escaped = (val || '').replace(/"/g, '""');
  return `"${escaped}"`;
}

export function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type ExportFormatType = 'json' | 'csv' | 'txt' | 'anki';

export interface ExportDataOptions {
  exportFormats: ExportFormatType[];
  selectedDeckIds: number[];
  availableDecks: any[];
  includeSettings: boolean;
  themeMode: string;
  dailyGoal: number;
  reviewSchedule: string;
  notificationsEnabled: boolean;
  selectedNativeLangName: string;
  selectedTargetLangName: string;
  detailSettings: CardDetailSettings;
}

export function generateExportData(options: ExportDataOptions) {
  const {
    exportFormats,
    selectedDeckIds,
    availableDecks,
    includeSettings,
    themeMode,
    dailyGoal,
    reviewSchedule,
    notificationsEnabled,
    selectedNativeLangName,
    selectedTargetLangName,
    detailSettings,
  } = options;

  const chosenDecks = availableDecks.filter((d: any) => selectedDeckIds.includes(d.id));
  const timestamp = new Date().toISOString().split('T')[0];

  const formatsToExport = exportFormats && exportFormats.length > 0 ? exportFormats : ['json' as ExportFormatType];

  formatsToExport.forEach((exportFormat, idx) => {
    // Stagger downloads slightly if multiple formats are triggered to avoid browser suppression
    setTimeout(() => {
      if (exportFormat === 'json') {
        const payload: any = {
          exportVersion: '1.0',
          exportedAt: new Date().toISOString(),
          format: 'json',
          totalDecks: chosenDecks.length,
          totalCards: chosenDecks.reduce((acc: number, d: any) => acc + (d.cards?.length || 0), 0),
          decks: chosenDecks,
        };

        if (includeSettings) {
          payload.settings = {
            theme: themeMode,
            dailyGoal,
            reviewSchedule,
            notificationsEnabled,
            nativeLanguage: selectedNativeLangName,
            targetLanguage: selectedTargetLangName,
            cardDetailSettings: detailSettings,
          };
        }

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `reory-export-${timestamp}.json`);
      } else if (exportFormat === 'csv') {
        const headers = [
          'Collection',
          'Front (Word)',
          'Phonetic',
          'Part of Speech',
          'Back (Translation)',
          'Example Sentence',
          'Example Translation',
          'Hint',
          'Status',
          'Repetitions',
        ];

        const rows: string[] = [headers.join(',')];

        chosenDecks.forEach((deck: any) => {
          (deck.cards || []).forEach((card: any) => {
            const row = [
              escapeCsv(deck.title),
              escapeCsv(card.frontWord),
              escapeCsv(card.phonetic || ''),
              escapeCsv(card.partOfSpeech || ''),
              escapeCsv(card.backTranslation),
              escapeCsv(card.exampleSentence || ''),
              escapeCsv(card.exampleTranslation || ''),
              escapeCsv(card.hint || ''),
              escapeCsv(card.status || 'NEW'),
              escapeCsv(String(card.repetitions || 0)),
            ];
            rows.push(row.join(','));
          });
        });

        const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `reory-export-${timestamp}.csv`);
      } else if (exportFormat === 'anki' || exportFormat === 'txt') {
        const lines: string[] = [];

        if (exportFormat === 'anki') {
          lines.push('#separator:tab');
          lines.push('#html:true');
          lines.push('#tags column:4');
        }

        chosenDecks.forEach((deck: any) => {
          (deck.cards || []).forEach((card: any) => {
            const front = (card.frontWord || '').trim();
            const back = [
              card.phonetic ? `<small style="color:#888;">[${card.phonetic}]</small>` : '',
              card.partOfSpeech ? `<em>(${card.partOfSpeech})</em>` : '',
              card.backTranslation ? `<div><b>${card.backTranslation}</b></div>` : '',
              card.exampleSentence ? `<blockquote style="margin-top:6px;font-size:0.9em;color:#aaa;">${card.exampleSentence}${card.exampleTranslation ? `<br/><small>${card.exampleTranslation}</small>` : ''}</blockquote>` : '',
            ]
              .filter(Boolean)
              .join(' ');

            const extra = card.hint ? `Hint: ${card.hint}` : '';
            const deckTag = deck.title.replace(/\s+/g, '_');

            lines.push([front, back, extra, deckTag].join('\t'));
          });
        });

        const extension = exportFormat === 'anki' ? 'txt' : 'tsv';
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
        downloadBlob(blob, `reory-${exportFormat}-export-${timestamp}.${extension}`);
      }
    }, idx * 250);
  });
}

export interface ExecuteImportOptions {
  importFile: File;
  importFileFormat: string;
  importTargetDeckId: string;
  importNewDeckTitle: string;
  importNewDeckLang: string;
  detailSettings: CardDetailSettings;
  setDetailSettings: (val: any) => void;
  saveStoredCardDetailSettings: (val: any) => void;
  setDailyGoal: (val: number) => void;
  setReviewSchedule: (val: string) => void;
  setAvailableDecks: (val: any[]) => void;
}

export async function executeImport(options: ExecuteImportOptions): Promise<{ cardsCount: number; decksCount: number }> {
  const {
    importFile,
    importFileFormat,
    importTargetDeckId,
    importNewDeckTitle,
    importNewDeckLang,
    setDetailSettings,
    saveStoredCardDetailSettings,
    setDailyGoal,
    setReviewSchedule,
    setAvailableDecks,
  } = options;

  const text = await importFile.text();
  let importedCardsCount = 0;
  let importedDecksCount = 0;

  if (importFileFormat === 'json') {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed.decks)) {
      for (const d of parsed.decks) {
        const created = await createDeck({
          title: d.title || 'Imported Collection',
          language: d.language || importNewDeckLang || 'General',
          description: d.description || `Imported collection with ${d.cards?.length || 0} cards`,
          level: d.level || 'Beginner',
          icon: d.icon || '📁',
        });
        importedDecksCount++;

        if (Array.isArray(d.cards)) {
          for (const c of d.cards) {
            if (!c.frontWord || !c.backTranslation) continue;
            await addCardToDeck(created.id, {
              frontWord: c.frontWord,
              backTranslation: c.backTranslation,
              exampleSentence: c.exampleSentence || '',
              exampleTranslation: c.exampleTranslation || '',
              phonetic: c.phonetic || '',
              partOfSpeech: c.partOfSpeech || '',
              hint: c.hint || '',
            });
            importedCardsCount++;
          }
        }
      }

      if (parsed.settings) {
        if (parsed.settings.cardDetailSettings) {
          setDetailSettings(parsed.settings.cardDetailSettings);
          saveStoredCardDetailSettings(parsed.settings.cardDetailSettings);
        }
        if (parsed.settings.dailyGoal) {
          setDailyGoal(parsed.settings.dailyGoal);
          localStorage.setItem('duocard_daily_goal', String(parsed.settings.dailyGoal));
        }
        if (parsed.settings.reviewSchedule) {
          setReviewSchedule(parsed.settings.reviewSchedule);
          localStorage.setItem('duocard_review_schedule', parsed.settings.reviewSchedule);
        }
      }
    } else {
      const rawCards: any[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.cards)
        ? parsed.cards
        : [];

      let targetDeckId: number;
      if (importTargetDeckId === 'new') {
        const newDeck = await createDeck({
          title: importNewDeckTitle.trim() || 'Imported Vocabulary',
          language: importNewDeckLang,
          description: `Imported on ${new Date().toLocaleDateString()}`,
          level: 'Beginner',
          icon: '📁',
        });
        targetDeckId = newDeck.id;
        importedDecksCount++;
      } else {
        targetDeckId = Number(importTargetDeckId);
      }

      for (const c of rawCards) {
        const front = c.frontWord || c.front || c.word || c.term || '';
        const back = c.backTranslation || c.back || c.translation || c.meaning || '';
        if (!front || !back) continue;

        await addCardToDeck(targetDeckId, {
          frontWord: String(front).trim(),
          backTranslation: String(back).trim(),
          exampleSentence: c.exampleSentence || c.example || '',
          exampleTranslation: c.exampleTranslation || '',
          phonetic: c.phonetic || '',
          partOfSpeech: c.partOfSpeech || '',
          hint: c.hint || '',
        });
        importedCardsCount++;
      }
    }
  } else if (importFileFormat === 'csv') {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) throw new Error('CSV file is empty');

    let targetDeckId: number;
    if (importTargetDeckId === 'new') {
      const newDeck = await createDeck({
        title: importNewDeckTitle.trim() || 'Imported Vocabulary',
        language: importNewDeckLang,
        description: `Imported from CSV on ${new Date().toLocaleDateString()}`,
        level: 'Beginner',
        icon: '📁',
      });
      targetDeckId = newDeck.id;
      importedDecksCount++;
    } else {
      targetDeckId = Number(importTargetDeckId);
    }

    const firstLine = lines[0].toLowerCase();
    const hasHeader =
      firstLine.includes('front') ||
      firstLine.includes('word') ||
      firstLine.includes('back') ||
      firstLine.includes('translation') ||
      firstLine.includes('collection');

    const dataLines = hasHeader ? lines.slice(1) : lines;

    for (const line of dataLines) {
      const cols = parseCsvLine(line);
      if (cols.length < 2) continue;

      let front = '';
      let back = '';
      let phonetic = '';
      let partOfSpeech = '';
      let example = '';

      if (cols.length >= 5 && cols[0].length > 0 && !hasHeader) {
        front = cols[0];
        back = cols[1];
      } else if (hasHeader && firstLine.startsWith('collection')) {
        front = cols[1] || '';
        phonetic = cols[2] || '';
        partOfSpeech = cols[3] || '';
        back = cols[4] || '';
        example = cols[5] || '';
      } else {
        front = cols[0] || '';
        back = cols[1] || '';
        if (cols[2]) example = cols[2];
      }

      if (!front.trim() || !back.trim()) continue;

      await addCardToDeck(targetDeckId, {
        frontWord: front.trim(),
        backTranslation: back.trim(),
        phonetic,
        partOfSpeech,
        exampleSentence: example,
      });
      importedCardsCount++;
    }
  } else if (importFileFormat === 'txt') {
    const lines = text
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0 && !l.startsWith('#'));

    let targetDeckId: number;
    if (importTargetDeckId === 'new') {
      const newDeck = await createDeck({
        title: importNewDeckTitle.trim() || 'Imported Anki Deck',
        language: importNewDeckLang,
        description: `Imported from Anki / TSV file on ${new Date().toLocaleDateString()}`,
        level: 'Beginner',
        icon: '📁',
      });
      targetDeckId = newDeck.id;
      importedDecksCount++;
    } else {
      targetDeckId = Number(importTargetDeckId);
    }

    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length < 2) continue;

      const front = parts[0].replace(/<[^>]*>/g, '').trim();
      const backRaw = parts[1] || '';
      const back = backRaw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

      if (!front || !back) continue;

      await addCardToDeck(targetDeckId, {
        frontWord: front,
        backTranslation: back,
        hint: parts[2] ? parts[2].replace(/Hint:\s*/i, '').trim() : '',
      });
      importedCardsCount++;
    }
  }

  const freshDecks = await fetchDecks();
  setAvailableDecks(freshDecks);

  return { cardsCount: importedCardsCount, decksCount: importedDecksCount };
}
