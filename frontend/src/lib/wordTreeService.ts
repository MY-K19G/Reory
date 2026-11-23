import { WordDetails, AiGeneratedCard } from './types';
import { fetchPexelsPhotos } from './pexelsService';

export async function fetchWordIntelligence(
  word: string,
  _targetLanguage: string = 'English',
  nativeLanguage: string = 'Hindi',
  geminiData?: AiGeneratedCard | null,
  pexelsApiKey?: string
): Promise<WordDetails> {
  const trimmed = word.trim();

  // ONLY USE AI: Strictly extract data from AI response without heuristic fallbacks
  const translation = geminiData?.backTranslation?.trim() || '';
  const pronunciation = geminiData?.phonetic || '';
  const meaning = geminiData?.standardMeaning || geminiData?.hint || '';
  const simpleMeaning = geminiData?.simpleMeaning || '';
  const partOfSpeech = geminiData?.partOfSpeech || '';
  const rawExamples = geminiData?.exampleSentences || [];
  const exampleSentences: (string | { sentence: string; translation?: string })[] = [];
  if (Array.isArray(rawExamples) && rawExamples.length > 0) {
    exampleSentences.push(...rawExamples);
  } else if (geminiData?.exampleSentence) {
    exampleSentences.push({
      sentence: geminiData.exampleSentence,
      translation: geminiData.exampleTranslation,
    });
  }
  const synonyms: (string | import('./types').WeightedWordItem)[] =
    geminiData?.synonyms && geminiData.synonyms.length > 0 ? [...geminiData.synonyms] : [];
  const antonyms: (string | import('./types').WeightedWordItem)[] =
    geminiData?.antonyms && geminiData.antonyms.length > 0 ? [...geminiData.antonyms] : [];

  // Word Forms (AI generated genuine conjugations/plurals/derivatives)
  const wordForms: string[] = geminiData?.wordForms && geminiData.wordForms.length > 0 ? [...geminiData.wordForms] : [];

  // Etymology & Common phrases (AI generated)
  const etymology = geminiData?.etymology || '';
  const commonPhrases: string[] = geminiData?.commonPhrases && geminiData.commonPhrases.length > 0 ? [...geminiData.commonPhrases] : [];
  const relatedWords: string[] = geminiData?.relatedWords && geminiData.relatedWords.length > 0 ? [...geminiData.relatedWords] : [];

  // AI Cultural & Memory Explanation
  const aiExplanation = geminiData?.explanation || '';

  // Authentic Images from Pexels API
  let images: string[] = [];
  let pexelsPhotos: Array<{
    id: number;
    url: string;
    photographer: string;
    photographerUrl?: string;
    src: string;
    alt: string;
  }> = [];

  try {
    const photos = await fetchPexelsPhotos(trimmed, pexelsApiKey, 3);
    if (photos && photos.length > 0) {
      images = photos.map((p) => p.src.medium || p.src.large || p.src.original);
      pexelsPhotos = photos.map((p) => ({
        id: p.id,
        url: p.url,
        photographer: p.photographer,
        photographerUrl: p.photographer_url,
        src: p.src.medium || p.src.large,
        alt: p.alt || trimmed,
      }));
    }
  } catch (err) {
    console.warn('Pexels photo fetch notice:', err);
  }

  // Interactive Quiz (AI Generated)
  const quiz = geminiData?.quiz || (translation ? {
    question: `What is the accurate translation of "${trimmed}" in ${nativeLanguage}?`,
    options: [
      translation,
      ...synonyms.slice(0, 3).map((s: any) => (typeof s === 'string' ? s : s?.word || '')),
    ],
    correctAnswer: translation,
    explanation: `"${trimmed}" translates to "${translation}" in ${nativeLanguage}.`,
  } : undefined);

  // Learning Statistics: ONLY from AI, NO fallback length heuristics
  const learningStats = {
    difficulty: geminiData?.difficulty,
    masteryScore: geminiData?.difficulty === 'Easy' ? 90 : geminiData?.difficulty === 'Medium' ? 75 : geminiData?.difficulty === 'Hard' ? 55 : 70,
    frequencyRank: geminiData?.frequencyRank || '',
    suggestedInterval: geminiData?.difficulty === 'Easy' ? 'Every 3 days (SM-2)' : geminiData?.difficulty ? 'Every 1 day (SM-2)' : '',
  };

  return {
    word: trimmed,
    meaning,
    simpleMeaning,
    pronunciation,
    partOfSpeech,
    exampleSentences: exampleSentences.slice(0, 3),
    synonyms: synonyms.slice(0, 6),
    antonyms: antonyms.slice(0, 6),
    wordForms,
    etymology,
    commonPhrases,
    aiExplanation,
    images,
    pexelsPhotos,
    translation,
    relatedWords,
    quiz,
    learningStats,
    understandRealMeaning: geminiData?.understandRealMeaning || simpleMeaning || meaning,
    understandMentalModel: geminiData?.understandMentalModel || '',
  };
}
