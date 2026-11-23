'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FolderPlus, Compass } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { fetchDecks, generateCardWithAi, addCardToDeck, createDeck } from '@/lib/api';
import { Deck, AiGeneratedCard, WordDetails } from '@/lib/types';
import { getDeckLanguagePair, slugifyDeck } from '@/lib/deckLanguages';
import { WordTreeBreakdown } from '@/components/WordTreeBreakdown';
import { fetchWordIntelligence } from '@/lib/wordTreeService';
import { WordSkeletonLoader } from '@/components/WordSkeletonLoader';
import {
  getSavedTodayWord,
  saveTodayWord,
  getWordFromCache,
  saveWordToCache,
  getTodaysCuratedWord,
  suggestDailyWordWithAi,
} from '@/lib/dailyWordService';
import { DEFAULT_SERENITY_WORD } from './constants';
import { NewCardSearchBar } from './NewCardSearchBar';

export default function NewCardPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { currentAccent } = useTheme();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [decksLoading, setDecksLoading] = useState(true);
  const [selectedDeckId, setSelectedDeckId] = useState<number | ''>('');

  // Default languages matching reference mockup (learning English, native Japanese)
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [nativeLanguage, setNativeLanguage] = useState('Japanese');

  // Search input and state
  const [wordInput, setWordInput] = useState('');
  const [activeGeneratingWord, setActiveGeneratingWord] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [wordTree, setWordTree] = useState<WordDetails | null>(null);
  const [isWordOfTheDay, setIsWordOfTheDay] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isListening, setIsListening] = useState(false);
  const requestSeq = useRef(0);
  const historyRef = useRef<HTMLDivElement>(null);

  // Web Speech API Voice Recognition
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = targetLanguage.toLowerCase().startsWith('en') ? 'en-US' : 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const spokenWord = event.results?.[0]?.[0]?.transcript?.trim();
        setIsListening(false);
        if (spokenWord) {
          const cleaned = spokenWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
          setWordInput(cleaned);
          handleGenerateAi(cleaned);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition exception:', e);
      setIsListening(false);
    }
  };

  // Close history dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setHistoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Initial Load & Deck Language Synchronization
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryDeckId = urlParams.get('deckId');
    const urlLang = urlParams.get('lang');

    const syncDeck = (deckList: Deck[]) => {
      setDecks(deckList);
      setDecksLoading(false);
      if (deckList.length === 0) return;

      const activeSaved = localStorage.getItem('duocard_active_deck_id');
      const found = queryDeckId
        ? deckList.find((d) => d.id === Number(queryDeckId))
        : activeSaved
          ? deckList.find((d) => String(d.id) === activeSaved)
          : deckList[0];

      if (found) {
        setSelectedDeckId(found.id);
        const pair = getDeckLanguagePair(found);
        const deckLang = found.language || pair.targetLang || 'English';
        const defaultNative = urlLang || pair.nativeLang || 'Japanese';

        setTargetLanguage(deckLang);
        setNativeLanguage(defaultNative);
        localStorage.setItem('duocard_last_native_lang', defaultNative);

        // Check if today's word is already saved in localStorage for this collection language!
        const savedToday = getSavedTodayWord(deckLang, defaultNative);
        if (savedToday) {
          setWordTree(savedToday);
          setIsWordOfTheDay(true);
        } else {
          // AI-First Hybrid with Cache: Try AI suggestion first, fallback to curated pool
          loadAiFirstDailyWord(deckLang, defaultNative);
        }
      }
    };

    fetchDecks().then(syncDeck);

    // Listen to collection switches from the sidebar
    const handleActiveDeckChanged = () => {
      fetchDecks().then((freshDecks) => {
        const activeSaved = localStorage.getItem('duocard_active_deck_id');
        const currentFound = freshDecks.find((d) => String(d.id) === activeSaved) || freshDecks[0];
        if (currentFound) {
          setSelectedDeckId(currentFound.id);
          const pair = getDeckLanguagePair(currentFound);
          const deckLang = currentFound.language || pair.targetLang || 'English';
          const defaultNative = pair.nativeLang || 'Japanese';

          setTargetLanguage(deckLang);
          setNativeLanguage(defaultNative);
          localStorage.setItem('duocard_last_native_lang', defaultNative);

          if (wordInput.trim()) {
            handleGenerateAi(wordInput.trim(), deckLang, defaultNative);
          } else {
            // Load or fetch today's word in the new collection language!
            const savedToday = getSavedTodayWord(deckLang, defaultNative);
            if (savedToday) {
              setWordTree(savedToday);
              setIsWordOfTheDay(true);
            } else {
              loadAiFirstDailyWord(deckLang, defaultNative);
            }
          }
        }
      });
    };

    window.addEventListener('active_deck_changed', handleActiveDeckChanged);

    const savedKey = localStorage.getItem('duocard_gemini_key') || '';
    setApiKey(savedKey);

    return () => {
      window.removeEventListener('active_deck_changed', handleActiveDeckChanged);
    };
  }, []);

  const loadAiFirstDailyWord = async (deckLang: string, defaultNative: string) => {
    // 1. Check if cached for today
    const cachedToday = getSavedTodayWord(deckLang, defaultNative);
    if (cachedToday) {
      setWordTree(cachedToday);
      setIsWordOfTheDay(true);
      return;
    }

    // 2. Try AI-suggested Word of the Day dynamically
    let wordToFetch: string | null = null;
    try {
      wordToFetch = await suggestDailyWordWithAi(deckLang, defaultNative, apiKey);
    } catch {
      wordToFetch = null;
    }

    // 3. Graceful Curated Fallback if AI is offline or key missing
    if (!wordToFetch) {
      wordToFetch = getTodaysCuratedWord(deckLang);
    }

    handleGenerateAi(wordToFetch, deckLang, defaultNative, true);
  };

  const handleGenerateAi = async (
    searchWord: string,
    overrideTarget?: string,
    overrideNative?: string,
    forcedIsDailyWord?: boolean
  ) => {
    const targetWord = searchWord.trim();
    if (!targetWord || targetWord.length < 2) return;

    const targetLangToUse = overrideTarget || targetLanguage;
    const nativeLangToUse = overrideNative || nativeLanguage;

    const todayWordName = getTodaysCuratedWord(targetLangToUse);
    const savedToday = getSavedTodayWord(targetLangToUse, nativeLangToUse);
    const isToday = Boolean(
      forcedIsDailyWord ||
      (savedToday && savedToday.word.toLowerCase() === targetWord.toLowerCase()) ||
      targetWord.toLowerCase() === todayWordName.toLowerCase()
    );
    setIsWordOfTheDay(isToday);

    // 1. Check local cache first so it doesn't have to be fetched again and again!
    const cached = isToday
      ? getSavedTodayWord(targetLangToUse, nativeLangToUse) || getWordFromCache(targetWord, targetLangToUse, nativeLangToUse)
      : getWordFromCache(targetWord, targetLangToUse, nativeLangToUse);

    if (cached) {
      setWordTree(cached);
      setLoadingAi(false);
      return;
    }

    const thisRequestId = ++requestSeq.current;
    setActiveGeneratingWord(targetWord);
    setLoadingAi(true);
    try {
      let data: AiGeneratedCard | null = null;
      try {
        data = await generateCardWithAi(targetWord, targetLangToUse, nativeLangToUse, apiKey);
      } catch (geminiErr) {
        console.warn('AI generation error:', geminiErr);
      }

      if (thisRequestId !== requestSeq.current) return;

      if (data) {
        const tree = await fetchWordIntelligence(targetWord, targetLangToUse, nativeLangToUse, data);
        if (thisRequestId !== requestSeq.current) return;
        setWordTree(tree);

        // Save somewhere (localStorage) so we don't fetch it again!
        saveWordToCache(targetWord, targetLangToUse, nativeLangToUse, tree);
        if (isToday) {
          saveTodayWord(targetWord, targetLangToUse, nativeLangToUse, tree);
        }
      } else {
        // High quality fallback in the requested collection language
        const fallbackTree: WordDetails = {
            word: targetWord,
            pronunciation: `${targetWord.toLowerCase()}`,
            partOfSpeech: 'noun',
            meaning: `The definition, usage, and meaning of "${targetWord}" when learning ${targetLangToUse}.`,
            simpleMeaning: `Core essence of "${targetWord}" in ${nativeLangToUse}.`,
            understandRealMeaning: `"${targetWord}" is an essential vocabulary term in ${targetLangToUse}. Understanding its cultural nuances and context helps you master natural conversations.`,
            understandMentalModel: `“Think of ${targetWord} as a foundational building block when communicating in ${targetLangToUse}.”`,
            translation: `${targetWord} (${nativeLangToUse})`,
            images: ['/lingua-bg.jpg'],
            exampleSentences: [
              {
                sentence: `Learning "${targetWord}" helps build confidence in ${targetLangToUse}.`,
                translation: `Understanding and using "${targetWord}" in context.`,
              },
            ],
            synonyms: ['vocabulary', 'expression', 'phrase'],
            antonyms: [],
            wordForms: [targetWord],
            etymology: `Etymology and origins of "${targetWord}" in ${targetLangToUse}.`,
            commonPhrases: [`use ${targetWord}`, `learn ${targetWord}`],
            aiExplanation: `Comprehensive guide to "${targetWord}" in ${targetLangToUse} explained for ${nativeLangToUse} speakers.`,
            relatedWords: [targetWord],
            quiz: {
              question: `What is the role of "${targetWord}" in ${targetLangToUse}?`,
              options: [
                `Essential vocabulary term in ${targetLangToUse}`,
                `Plausible distractor 1`,
                `Plausible distractor 2`,
                `Plausible distractor 3`,
              ],
              correctAnswer: `Essential vocabulary term in ${targetLangToUse}`,
              explanation: `"${targetWord}" is a key word in ${targetLangToUse}.`,
            },
          };

        setWordTree(fallbackTree);
        saveWordToCache(targetWord, targetLangToUse, nativeLangToUse, fallbackTree);
        if (isToday) {
          saveTodayWord(targetWord, targetLangToUse, nativeLangToUse, fallbackTree);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      if (thisRequestId === requestSeq.current) {
        setLoadingComplete(true);
        setTimeout(() => {
          if (thisRequestId === requestSeq.current) {
            setLoadingAi(false);
            setLoadingComplete(false);
          }
        }, 320);
      }
    }
  };

  const handleSaveCard = async () => {
    if (!wordTree) return;

    setSaving(true);
    try {
      let deckIdToUse = selectedDeckId;
      if (!deckIdToUse) {
        const found = decks.find((d) => d.language.toLowerCase() === targetLanguage.toLowerCase());
        if (found) {
          deckIdToUse = found.id;
        } else {
          const newDeck = await createDeck({
            title: `${targetLanguage} Vocabulary`,
            description: `Vocabulary collection for ${targetLanguage}`,
            language: targetLanguage,
            languageCode: 'en',
            level: 'General',
            color: 'from-indigo-500 to-purple-600',
            icon: '📚',
            isPublic: true,
          });
          deckIdToUse = newDeck.id;
          setDecks((prev) => [...prev, newDeck]);
        }
        setSelectedDeckId(deckIdToUse);
      }

      const customNote = localStorage.getItem(`duocard_word_note_${wordTree.word.toLowerCase()}`);
      const finalHint = (customNote || wordTree.simpleMeaning || (wordTree as any).hint || '').slice(0, 450);

      const customImage = localStorage.getItem(`duocard_draft_image_${wordTree.word.toLowerCase()}`) ||
        localStorage.getItem(`duocard_word_image_${wordTree.word.toLowerCase()}`);
      const finalImage = customImage || wordTree.pexelsPhotos?.[0]?.src || wordTree.images?.[0] || '';

      const createdCard = await addCardToDeck(deckIdToUse, {
        frontWord: wordTree.word,
        phonetic: (wordTree.pronunciation || '').slice(0, 255),
        partOfSpeech: (wordTree.partOfSpeech || 'noun').slice(0, 50),
        backTranslation: (wordTree.translation || wordTree.meaning).slice(0, 950),
        exampleSentence: (
          (typeof wordTree.exampleSentences?.[0] === 'object'
            ? wordTree.exampleSentences[0].sentence
            : wordTree.exampleSentences?.[0]) || ''
        ).slice(0, 950),
        exampleTranslation: (
          (typeof wordTree.exampleSentences?.[0] === 'object'
            ? wordTree.exampleSentences[0].translation
            : '') || ''
        ).slice(0, 950),
        hint: finalHint,
        imageUrl: finalImage,
        tags: [wordTree.partOfSpeech || 'Word', targetLanguage].filter(Boolean).join(', '),
        metadata: JSON.stringify({
          quiz: wordTree.quiz || null,
          photoCaption: wordTree.pexelsPhotos?.[0]?.alt || '',
          photographer: wordTree.pexelsPhotos?.[0]?.photographer || '',
          photographerUrl: wordTree.pexelsPhotos?.[0]?.photographerUrl || '',
          synonyms: wordTree.synonyms || [],
          antonyms: wordTree.antonyms || [],
          wordForms: wordTree.wordForms || [],
          etymology: wordTree.etymology || '',
          understandRealMeaning: wordTree.understandRealMeaning || '',
          understandMentalModel: wordTree.understandMentalModel || '',
        }),
      });

      if (createdCard?.id && finalImage) {
        localStorage.setItem(`duocard_card_img_${createdCard.id}`, finalImage);
      }

      localStorage.setItem('duocard_active_deck_id', String(deckIdToUse));
      window.dispatchEvent(new Event('active_deck_changed'));
      const activeDeckObj = decks.find((d) => d.id === deckIdToUse);
      const friendlySlug = activeDeckObj?.title ? slugifyDeck(deckIdToUse, activeDeckObj.title) : String(deckIdToUse);
      router.push(`/study/${friendlySlug}`);
    } catch (err: any) {
      console.error('Failed to save card:', err);
      alert(`Card saved locally.`);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectLanguage = (lang: string) => {
    setNativeLanguage(lang);
    localStorage.setItem('duocard_last_native_lang', lang);
    if (wordTree && wordTree.word) {
      handleGenerateAi(wordTree.word, targetLanguage, lang);
    }
  };

  return (
    <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-6 pt-2 pb-16">
        {/* Top Search Bar */}
        <NewCardSearchBar
          wordInput={wordInput}
          setWordInput={setWordInput}
          onSearch={handleGenerateAi}
          historyOpen={historyOpen}
          setHistoryOpen={setHistoryOpen}
          historyRef={historyRef}
          isListening={isListening}
          onVoiceInput={handleVoiceInput}
        />

        {/* Premium AI Skeleton & Progress Loader during Search */}
        {loadingAi && (
          <WordSkeletonLoader
            word={activeGeneratingWord || wordInput.trim() || 'word'}
            isComplete={loadingComplete}
            isWordOfTheDay={isWordOfTheDay}
          />
        )}

        {/* Empty Decks Alert Banner & Action */}
        {!decksLoading && decks.length === 0 && !loadingAi && !wordTree && (
          <div className="rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-white/10 p-8 sm:p-12 text-center space-y-5 shadow-xl max-w-xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 dark:text-amber-400 shadow-lg shadow-amber-500/10">
              <FolderPlus className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('noDecksTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                {t('noDecksDesc')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/decks/create"
                style={{ backgroundColor: currentAccent.primary }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-white text-xs font-bold shadow-lg shadow-accent-primary/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>{t('createFirstDeckBtn')}</span>
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{t('orExploreDecks')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Word Details Breakdown */}
        {wordTree && !loadingAi && (
          <WordTreeBreakdown
            details={wordTree}
            targetLanguage={targetLanguage}
            nativeLanguage={nativeLanguage}
            isWordOfTheDay={isWordOfTheDay}
            onSave={handleSaveCard}
            saving={saving}
            onBackToSearch={() => {
              setWordInput('');
              const saved = getSavedTodayWord(targetLanguage, nativeLanguage);
              setWordTree(saved || DEFAULT_SERENITY_WORD);
              setIsWordOfTheDay(true);
            }}
            onSelectLanguage={handleSelectLanguage}
            showActionButtons={true}
            onImageUpdated={(newImg) => {
              setWordTree((prev) => {
                if (!prev) return prev;
                const updatedPhotos = prev.pexelsPhotos && prev.pexelsPhotos.length > 0
                  ? [{ ...prev.pexelsPhotos[0], src: newImg }, ...prev.pexelsPhotos.slice(1)]
                  : [{ id: Date.now(), url: newImg, photographer: 'Custom', src: newImg, alt: prev.word }];
                return {
                  ...prev,
                  images: [newImg, ...(prev.images || [])],
                  pexelsPhotos: updatedPhotos,
                };
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
