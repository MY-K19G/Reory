export interface CardDetailSettings {
  showMeaning: boolean;
  showSimpleMeaning: boolean;
  showPronunciation: boolean;
  showPartOfSpeech: boolean;
  showExampleSentences: boolean;
  showSynonyms: boolean;
  showAntonyms: boolean;
  showWordForms: boolean;
  showEtymology: boolean;
  showCommonPhrases: boolean;
  showAiExplanation: boolean;
  showImages: boolean;
  showTranslation: boolean;
  showRelatedWords: boolean;
  showQuiz: boolean;
}

export const DEFAULT_CARD_DETAIL_SETTINGS: CardDetailSettings = {
  showMeaning: true,
  showSimpleMeaning: true,
  showPronunciation: true,
  showPartOfSpeech: true,
  showExampleSentences: true,
  showSynonyms: true,
  showAntonyms: true,
  showWordForms: true,
  showEtymology: true,
  showCommonPhrases: true,
  showAiExplanation: true,
  showImages: true,
  showTranslation: true,
  showRelatedWords: true,
  showQuiz: true,
};

export interface DetailItemConfig {
  key: keyof CardDetailSettings;
  label: string;
  description: string;
  iconName: string;
  category: 'core' | 'linguistics' | 'ai' | 'practice';
}

export const CARD_DETAIL_ITEMS: DetailItemConfig[] = [
  {
    key: 'showMeaning',
    label: 'Meaning',
    description: 'Comprehensive standard dictionary definition',
    iconName: 'BookOpen',
    category: 'core',
  },
  {
    key: 'showSimpleMeaning',
    label: 'Simple Meaning',
    description: 'Direct, conversational plain-text meaning',
    iconName: 'FileText',
    category: 'core',
  },
  {
    key: 'showTranslation',
    label: 'Translation',
    description: 'Real-time translated meaning in your selected native tongue',
    iconName: 'Languages',
    category: 'core',
  },
  {
    key: 'showPronunciation',
    label: 'Pronunciation',
    description: 'Phonetic IPA guide + instant interactive 🔊 audio playback',
    iconName: 'Volume2',
    category: 'linguistics',
  },
  {
    key: 'showPartOfSpeech',
    label: 'Part of Speech',
    description: 'Noun, verb, adjective, interjection, etc.',
    iconName: 'Layers',
    category: 'linguistics',
  },
  {
    key: 'showExampleSentences',
    label: 'Example Sentences',
    description: 'Numbered real-world contextual sample sentences',
    iconName: 'Quote',
    category: 'core',
  },
  {
    key: 'showSynonyms',
    label: 'Synonyms',
    description: 'Tagged similar words & equivalent expressions',
    iconName: 'Shuffle',
    category: 'linguistics',
  },
  {
    key: 'showAntonyms',
    label: 'Antonyms',
    description: 'Direct opposites & antonym tags',
    iconName: 'ArrowRightLeft',
    category: 'linguistics',
  },
  {
    key: 'showWordForms',
    label: 'Word Forms',
    description: 'Base form, plurals, 3rd person, -ing, past tenses',
    iconName: 'Clock',
    category: 'linguistics',
  },
  {
    key: 'showEtymology',
    label: 'Etymology',
    description: 'Historical origin & linguistic root breakdown',
    iconName: 'Compass',
    category: 'linguistics',
  },
  {
    key: 'showCommonPhrases',
    label: 'Common Phrases',
    description: 'Everyday idioms & standard usage collocations',
    iconName: 'Sparkles',
    category: 'ai',
  },
  {
    key: 'showAiExplanation',
    label: 'AI Explanation',
    description: 'Deep context, nuance, and memory advice',
    iconName: 'Sparkles',
    category: 'ai',
  },
  {
    key: 'showImages',
    label: 'Images',
    description: 'Curated photo illustrations connected to the concept',
    iconName: 'ImageIcon',
    category: 'ai',
  },
  {
    key: 'showRelatedWords',
    label: 'Related Words',
    description: 'Semantic concepts & related topic terms',
    iconName: 'Layers',
    category: 'linguistics',
  },
  {
    key: 'showQuiz',
    label: 'Quiz',
    description: 'Interactive multiple-choice recall question with instant answer checking',
    iconName: 'HelpCircle',
    category: 'practice',
  },
];

export function getStoredCardDetailSettings(): CardDetailSettings {
  if (typeof window === 'undefined') return DEFAULT_CARD_DETAIL_SETTINGS;
  try {
    const raw = localStorage.getItem('duocard_card_detail_settings');
    if (!raw) return DEFAULT_CARD_DETAIL_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CARD_DETAIL_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_CARD_DETAIL_SETTINGS;
  }
}

export function saveStoredCardDetailSettings(settings: CardDetailSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('duocard_card_detail_settings', JSON.stringify(settings));
}
