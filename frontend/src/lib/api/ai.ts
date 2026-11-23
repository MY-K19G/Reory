import { AiGeneratedCard } from '../types';

export async function callGeminiDirectly(
  word: string,
  targetLanguage: string,
  nativeLanguage: string,
  apiKey: string
): Promise<AiGeneratedCard> {
  const prompt = `You are an expert language teacher and lexicographer.
Target Word: "${word}"
Target Language to Learn: ${targetLanguage}
User's Native Language: ${nativeLanguage}

CRITICAL INSTRUCTIONS:
1. Provide GENUINE dictionary definitions and substantive meanings in ${nativeLanguage}. Do NOT write generic sentences like "A vocabulary word in..." or tautological placeholders.
2. "standardMeaning": Provide the actual, thorough dictionary definition explaining what the object/concept/action really is in ${nativeLanguage} (e.g. for "Mouse", explain that it is a small rodent animal or a handheld computer cursor pointing device).
3. "simpleMeaning": Provide a short, everyday plain explanation in ${nativeLanguage} (e.g. for "Mouse": "चूहा (छोटा जानवर) या कंप्यूटर का माउस यंत्र").
4. "backTranslation": Provide the accurate natural translation in ${nativeLanguage} (e.g. "चूहा / कंप्यूटर माउस").
5. "exampleSentences": Provide 2 REAL, authentic, realistic example sentences demonstrating "${word}" naturally in ${targetLanguage}, each with an accurate translation in ${nativeLanguage}.

Return ONLY a raw valid JSON object without markdown fences, with these exact keys:
{
  "frontWord": "${word}",
  "phonetic": "/IPA transcription/",
  "partOfSpeech": "noun | verb | adjective | phrase",
  "backTranslation": "Accurate, natural translation in ${nativeLanguage}",
  "standardMeaning": "Genuine substantive definition in ${nativeLanguage}",
  "simpleMeaning": "Clear, concise everyday meaning in ${nativeLanguage}",
  "understandRealMeaning": "A conversational, intuitive explanation of what ${word} really means in ${nativeLanguage}",
  "understandMentalModel": "A memorable mental model quote or relatable thought bubble in ${nativeLanguage}",
  "exampleSentences": [
    {
      "sentence": "A natural sentence in ${targetLanguage} using ${word}",
      "translation": "Translation of the sentence in ${nativeLanguage}",
      "pronunciation": "Phonetic transcription or romanized pronunciation of the sentence"
    },
    {
      "sentence": "A second natural sentence in ${targetLanguage} using ${word}",
      "translation": "Translation of the sentence in ${nativeLanguage}",
      "pronunciation": "Phonetic transcription or romanized pronunciation of the sentence"
    }
  ],
  "exampleSentence": "A primary natural sentence in ${targetLanguage} using ${word}",
  "exampleTranslation": "Translation of the sentence in ${nativeLanguage}",
  "hint": "Useful memory hook or mnemonic in ${nativeLanguage}",
  "difficulty": "Easy",
  "frequencyRank": "Top 500 Most Common Words",
  "synonyms": [
    { "word": "closest exact synonym", "strength": "strong" },
    { "word": "frequent contextual synonym", "strength": "moderate" },
    { "word": "looser related synonym", "strength": "weak" }
  ],
  "antonyms": [
    { "word": "direct exact opposite", "strength": "strong" },
    { "word": "indirect or contextual opposite", "strength": "moderate" }
  ],
  "wordForms": ["e.g. noun form", "plural form", "verb forms", "adjective form"],
  "etymology": "Concise origin or root of the word in ${nativeLanguage}",
  "commonPhrases": ["common phrase or idiom 1 in ${targetLanguage}", "common phrase 2 in ${targetLanguage}"],
  "relatedWords": ["related word 1", "related word 2", "related word 3"],
  "quiz": {
    "question": "A clear multiple choice question in ${nativeLanguage} testing understanding of ${word}",
    "options": [
      "Correct meaning in ${nativeLanguage}",
      "Plausible wrong option 1 in ${nativeLanguage}",
      "Plausible wrong option 2 in ${nativeLanguage}",
      "Plausible wrong option 3 in ${nativeLanguage}"
    ],
    "correctAnswer": "The exact correct option matching above",
    "explanation": "Educational explanation in ${nativeLanguage}"
  }
}
CRITICAL: For "synonyms" and "antonyms", provide items as objects with "word" and "strength" ("strong" for direct/exact match, "moderate" for common contextual, "weak" for loose/distant). Also include authentic wordForms, etymology, commonPhrases, and relatedWords.`;

  const userSelectedModel =
    typeof window !== 'undefined'
      ? localStorage.getItem('duocard_gemini_model') || 'gemini-3.5-flash-lite'
      : 'gemini-3.5-flash-lite';

  const models = Array.from(
    new Set([
      userSelectedModel,
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.8-flash',
    ])
  );
  let lastError: unknown = null;

  console.log(`[DuoCard AI] Attempting card generation with user-selected model: "${userSelectedModel}" (fallback list: ${models.join(', ')})`);

  for (const model of models) {
    try {
      console.log(`[DuoCard AI] Sending request to Google Gemini model: ${model}`);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      if (res.ok) {
        console.log(`[DuoCard AI] Successfully generated card content using Gemini model: ${model}`);
        const json = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          const firstEx =
            Array.isArray(parsed.exampleSentences) && parsed.exampleSentences.length > 0
              ? typeof parsed.exampleSentences[0] === 'object'
                ? parsed.exampleSentences[0].sentence
                : parsed.exampleSentences[0]
              : parsed.exampleSentence || '';
          const firstExTrans =
            Array.isArray(parsed.exampleSentences) && parsed.exampleSentences.length > 0
              ? typeof parsed.exampleSentences[0] === 'object'
                ? parsed.exampleSentences[0].translation
                : ''
              : parsed.exampleTranslation || '';

          return {
            frontWord: word,
            phonetic: parsed.phonetic || '',
            partOfSpeech: parsed.partOfSpeech || 'vocabulary',
            backTranslation: parsed.backTranslation || '',
            exampleSentence: firstEx,
            exampleTranslation: firstExTrans,
            exampleSentences:
              parsed.exampleSentences || (firstEx ? [{ sentence: firstEx, translation: firstExTrans }] : []),
            hint: parsed.hint || parsed.simpleMeaning || '',
            tags: `${targetLanguage.toLowerCase()};ai`,
            imageUrl: '',
            explanation: parsed.explanation || '',
            synonyms: parsed.synonyms || [],
            antonyms: parsed.antonyms || [],
            wordForms: parsed.wordForms || [],
            etymology: parsed.etymology || '',
            commonPhrases: parsed.commonPhrases || [],
            relatedWords: parsed.relatedWords || [],
            difficulty: parsed.difficulty || undefined,
            frequencyRank: parsed.frequencyRank || '',
            standardMeaning: parsed.standardMeaning || '',
            simpleMeaning: parsed.simpleMeaning || '',
            understandRealMeaning:
              parsed.understandRealMeaning || parsed.simpleMeaning || parsed.standardMeaning || '',
            understandMentalModel: parsed.understandMentalModel || '',
            quiz: parsed.quiz,
          };
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `Gemini API error: ${res.status}`;
        console.warn(`[DuoCard AI] Model "${model}" failed (HTTP ${res.status}): ${errMsg}`);
        lastError = new Error(errMsg);
      }
    } catch (e) {
      console.warn(`[DuoCard AI] Error calling model "${model}":`, e);
      lastError = e;
    }
  }

  throw lastError || new Error('Failed to generate with Gemini AI');
}

export async function generateCardWithAi(
  word: string,
  targetLanguage: string,
  nativeLanguage: string = 'English',
  customApiKey?: string
): Promise<AiGeneratedCard> {
  const userKey =
    customApiKey?.trim() ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('duocard_gemini_key')?.trim() || ''
      : '');

  if (!userKey) {
    throw new Error('Please enter your Gemini API key in Settings > Gemini AI to generate cards.');
  }

  // Direct client-side AI call using user-provided key from UI (Zero-Knowledge BYOK)
  return await callGeminiDirectly(word, targetLanguage, nativeLanguage, userKey);
}
