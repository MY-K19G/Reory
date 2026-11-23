// High-performance pronunciation engine with instant Web Audio + Google TTS fallback
let cachedVoices: SpeechSynthesisVoice[] = [];
let currentAudio: HTMLAudioElement | null = null;

if (typeof window !== 'undefined') {
  if ('speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

export function speakWord(text: string, langCode: string = 'en') {
  if (typeof window === 'undefined' || !text.trim()) return;

  const cleanText = text.trim();
  const normalizedLang = (langCode || 'en').toLowerCase();

  // Try high-speed direct HTML5 audio stream first for short words/sentences (< 200 chars)
  try {
    if (cleanText.length < 200) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${encodeURIComponent(normalizedLang)}&client=tw-ob`;
      const audio = new Audio(ttsUrl);
      currentAudio = audio;

      audio.playbackRate = 1.0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          speakWithSpeechSynthesis(cleanText, normalizedLang);
        });
        return;
      }
    }
  } catch {
    // Fall back to Web Speech API
  }

  speakWithSpeechSynthesis(cleanText, normalizedLang);
}

function speakWithSpeechSynthesis(text: string, langCode: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const codeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    ja: 'ja-JP',
    de: 'de-DE',
    fr: 'fr-FR',
    it: 'it-IT',
    hi: 'hi-IN',
    ru: 'ru-RU',
    ko: 'ko-KR',
    zh: 'zh-CN',
    'zh-tw': 'zh-TW',
    pt: 'pt-PT',
    'pt-br': 'pt-BR',
    ar: 'ar-SA',
    tr: 'tr-TR',
    nl: 'nl-NL',
    pl: 'pl-PL',
    sv: 'sv-SE',
    el: 'el-GR',
    vi: 'vi-VN',
    th: 'th-TH',
    id: 'id-ID',
    uk: 'uk-UA',
    he: 'he-IL',
    bn: 'bn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    ur: 'ur-PK',
  };

  const targetBcp47 = codeMap[langCode.toLowerCase()] || langCode;
  utterance.lang = targetBcp47;
  utterance.rate = 1.0;

  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  const prefix = targetBcp47.split('-')[0].toLowerCase();
  const matchedVoice =
    cachedVoices.find((v) => v.lang.toLowerCase() === targetBcp47.toLowerCase()) ||
    cachedVoices.find((v) => v.lang.toLowerCase().startsWith(prefix));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}
