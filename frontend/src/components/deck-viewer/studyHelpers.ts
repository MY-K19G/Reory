import {
  fetchWordDetailsFromBackend,
  generateCardWithAi,
  addCardToDeck,
} from '@/lib/api';
import { WordDetails } from '@/lib/types';
import { fetchWordIntelligence } from '@/lib/wordTreeService';
import { getWordFromCache, saveWordToCache } from '@/lib/dailyWordService';
import { fetchPexelsPhotoById } from '@/lib/pexelsService';
import { Flashcard } from './types';

export function exportDeckAsJson(
  title: string,
  description: string,
  language: string,
  displayCards: Flashcard[]
) {
  const deckToExport = {
    title,
    description,
    language,
    totalCards: displayCards.length,
    exportedAt: new Date().toISOString(),
    cards: displayCards.map((c) => ({
      word: c.word,
      reading: c.reading,
      translation: c.translation,
      tags: c.tags,
      exampleOriginal: c.exampleOriginal,
      exampleTranslation: c.exampleTranslation,
    })),
  };

  const blob = new Blob([JSON.stringify(deckToExport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-deck.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportDeckAsCsv(
  title: string,
  displayCards: Flashcard[]
) {
  const headers = ['Word', 'Reading / Phonetic', 'Translation', 'Tags', 'Example Sentence', 'Example Translation'];
  const rows = displayCards.map((c) => [
    `"${c.word.replace(/"/g, '""')}"`,
    `"${c.reading.replace(/"/g, '""')}"`,
    `"${c.translation.replace(/"/g, '""')}"`,
    `"${(c.tags || []).join('; ')}"`,
    `"${(c.exampleOriginal || '').replace(/"/g, '""')}"`,
    `"${(c.exampleTranslation || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-deck.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function fetchOrGenerateWordDetails(
  word: string,
  deckId: string,
  targetLang: string,
  nativeLang: string,
  existingCard?: Flashcard
): Promise<WordDetails | null> {
  // 1. If we already have the card from the database with translation, construct WordDetails directly without calling AI!
  if (existingCard && existingCard.translation) {
    let parsedMeta: any = null;
    if (existingCard.metadata) {
      try {
        parsedMeta = JSON.parse(existingCard.metadata);
      } catch {
        // ignore
      }
    }

    const directFromDb: WordDetails = {
      word: existingCard.word,
      meaning: existingCard.translation,
      simpleMeaning: existingCard.translation,
      pronunciation: existingCard.reading || '',
      partOfSpeech: existingCard.partOfSpeech || (existingCard.tags?.[0] || 'word'),
      exampleSentences: existingCard.exampleOriginal
        ? [
            {
              sentence: existingCard.exampleOriginal,
              translation: existingCard.exampleTranslation || '',
              pronunciation: existingCard.exampleReading || '',
            },
          ]
        : [],
      synonyms: parsedMeta?.synonyms || [],
      antonyms: parsedMeta?.antonyms || [],
      wordForms: parsedMeta?.wordForms?.length ? parsedMeta.wordForms : [existingCard.word],
      etymology: parsedMeta?.etymology || '',
      commonPhrases: [],
      aiExplanation: '',
      images: existingCard.imageUrl ? [existingCard.imageUrl] : [],
      pexelsPhotos: existingCard.imageUrl
        ? [
            {
              id: 1,
              url: existingCard.imageUrl,
              photographer: parsedMeta?.photographer || 'Deck Contributor',
              photographerUrl: parsedMeta?.photographerUrl || '',
              src: existingCard.imageUrl,
              alt: parsedMeta?.photoCaption || existingCard.word,
            },
          ]
        : [],
      translation: existingCard.translation,
      relatedWords: [],
      understandRealMeaning: parsedMeta?.understandRealMeaning || existingCard.translation,
      understandMentalModel: parsedMeta?.understandMentalModel || `“${existingCard.word}”: ${existingCard.translation}`,
      quiz: parsedMeta?.quiz || undefined,
    };

    saveWordToCache(word, targetLang, nativeLang, directFromDb);

    // If card has a Pexels photo URL and metadata didn't have photo details, fetch in background
    if (
      existingCard.imageUrl &&
      existingCard.imageUrl.includes('pexels.com') &&
      (!parsedMeta || !parsedMeta.photoCaption)
    ) {
      const match = existingCard.imageUrl.match(/\/photos\/(\d+)\//);
      if (match && match[1]) {
        fetchPexelsPhotoById(match[1])
          .then((photo) => {
            if (photo) {
              directFromDb.pexelsPhotos = [
                {
                  id: photo.id,
                  url: photo.url,
                  photographer: photo.photographer,
                  photographerUrl: photo.photographer_url,
                  src: existingCard.imageUrl || '',
                  alt: photo.alt || existingCard.word || '',
                },
              ];
              saveWordToCache(word, targetLang, nativeLang, directFromDb);
            }
          })
          .catch(() => {
            // ignore network error
          });
      }
    }

    return directFromDb;
  }

  // 2. Check local word cache
  const cached = getWordFromCache(word, targetLang, nativeLang);
  if (cached) return cached;

  // 3. Check backend word details endpoint
  const backendDetails = await fetchWordDetailsFromBackend(deckId, word, targetLang, nativeLang);
  if (backendDetails) {
    saveWordToCache(word, targetLang, nativeLang, backendDetails);
    return backendDetails;
  }

  // 4. Generate with AI only as a last resort if card is brand new and not yet in database
  const aiCard = await generateCardWithAi(word, targetLang, nativeLang);
  const details = await fetchWordIntelligence(word, targetLang, nativeLang, aiCard);
  saveWordToCache(word, targetLang, nativeLang, details);

  // 5. Persist to deck
  await addCardToDeck(deckId, {
    frontWord: details.word,
    phonetic: details.pronunciation,
    partOfSpeech: details.partOfSpeech,
    backTranslation: details.translation,
    exampleSentence:
      typeof details.exampleSentences[0] === 'string'
        ? (details.exampleSentences[0] as string)
        : (details.exampleSentences[0] as any)?.sentence || '',
    exampleTranslation:
      typeof details.exampleSentences[0] === 'string'
        ? ''
        : (details.exampleSentences[0] as any)?.translation || '',
    hint: details.meaning,
    tags: details.partOfSpeech,
  });

  return details;
}
