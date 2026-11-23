package com.reory.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class GeminiAiService {

    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String geminiModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Data
    @Builder
    public static class GeneratedCardData {
        private String frontWord;
        private String phonetic;
        private String partOfSpeech;
        private String backTranslation;
        private String exampleSentence;
        private String exampleTranslation;
        private String hint;
        private String tags;
        private String imageUrl;
        private String explanation;
        private List<String> synonyms;
        private String difficulty; // e.g. "Easy", "Medium", "Hard", or "Beginner (A1)"
        private String frequencyRank; // e.g. "Top 100", "Top 500", "Top 1,000"
        private String standardMeaning;
        private String simpleMeaning;
        private List<String> wordForms;
        private String etymology;
        private List<String> commonPhrases;
        private List<String> relatedWords;
    }

    public GeneratedCardData generateCardContent(String word, String targetLanguage, String nativeLanguage, String userApiKey, String userModel) {
        String targetLang = (targetLanguage != null && !targetLanguage.trim().isEmpty()) ? targetLanguage : "Hebrew";
        String nativeLang = (nativeLanguage != null && !nativeLanguage.trim().isEmpty()) ? nativeLanguage : "English";

        try {
            // Google Gemini - Accept API key entered by the user via the UI
            String key = (userApiKey != null) ? userApiKey.trim() : "";
            if (key.isEmpty()) {
                throw new IllegalStateException("Gemini API key is required. Please enter your Gemini API key in Settings > Gemini AI.");
            }
            return callGeminiApi(word, targetLang, nativeLang, key, userModel);
        } catch (Exception e) {
            System.err.println("Gemini API call failed! Reason: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Gemini AI card generation failed: " + e.getMessage(), e);
        }
    }

    public GeneratedCardData generateCardContent(String word, String targetLanguage, String nativeLanguage, String userApiKey) {
        return generateCardContent(word, targetLanguage, nativeLanguage, userApiKey, null);
    }

    private GeneratedCardData callGeminiApi(String word, String targetLang, String nativeLang, String key, String model) throws Exception {
        String activeModel = (model != null && !model.trim().isEmpty()) ? model.trim() : "gemini-2.5-flash-lite";
        System.out.println("[GeminiAiService] Calling Google Gemini API with model: " + activeModel + " for word: " + word);
        String endpoint = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                activeModel, key
        );

        String prompt = buildPrompt(word, targetLang, nativeLang);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));
        requestBody.put("contents", Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                return parseAiJsonResponse(text, word);
            }
        }
        throw new RuntimeException("Gemini returned empty response: " + response.getStatusCode());
    }

    private String buildPrompt(String word, String targetLang, String nativeLang) {
        return String.format(
                "You are an expert language teacher and lexicographer. The student's native language is %s and they are learning %s.\n" +
                "For the vocabulary word or phrase: '%s', return ONLY a valid JSON object (no markdown quotes, no extra text) with the following fields:\n" +
                "{\n" +
                "  \"frontWord\": \"%s\",\n" +
                "  \"phonetic\": \"phonetic pronunciation or transliteration/romaji\",\n" +
                "  \"partOfSpeech\": \"noun / verb / adjective / phrase etc.\",\n" +
                "  \"backTranslation\": \"accurate translation in %s\",\n" +
                "  \"standardMeaning\": \"genuine dictionary definition explaining the real object, action, or concept in %s (do NOT say 'A vocabulary word in...' or repeat the word tautologically)\",\n" +
                "  \"simpleMeaning\": \"clear everyday practical meaning in %s explaining what it actually is\",\n" +
                "  \"exampleSentence\": \"a realistic natural context sentence in %s using this word\",\n" +
                "  \"exampleTranslation\": \"translation of the example sentence in %s\",\n" +
                "  \"hint\": \"a mnemonic or memory tip in %s\",\n" +
                "  \"tags\": \"comma-separated category tags\",\n" +
                "  \"explanation\": \"A 2-3 sentence cultural and contextual explanation of how the word is used, formatted for a language learner\",\n" +
                "  \"synonyms\": [\"synonym1 (transliteration) - meaning\", \"synonym2 (transliteration) - meaning\"],\n" +
                "  \"wordForms\": [\"inflections, plurals, tenses, or grammatical forms in %s\"],\n" +
                "  \"etymology\": \"concise historical or linguistic origin in %s\",\n" +
                "  \"commonPhrases\": [\"useful collocations or idioms using this word in %s\"],\n" +
                "  \"relatedWords\": [\"conceptually related words in %s\"],\n" +
                "  \"difficulty\": \"Easy, Medium, or Hard based on %s language complexity (A1-A2 = Easy, B1-B2 = Medium, C1-C2 = Hard)\",\n" +
                "  \"frequencyRank\": \"Real frequency rank estimate in %s (e.g. 'Top 100', 'Top 500', 'Top 1,000', 'Top 5,000', or 'Top 10,000+')\",\n" +
                "  \"imageKeyword\": \"one or two english keywords representing the concept for photo search\"\n" +
                "}",
                nativeLang, targetLang, word, word, nativeLang, nativeLang, nativeLang, targetLang, nativeLang, nativeLang, targetLang, targetLang, nativeLang, targetLang, targetLang, targetLang, targetLang
        );
    }

    private GeneratedCardData parseAiJsonResponse(String rawText, String word) throws Exception {
        String text = rawText.replaceAll("(?s)```json\\s*(.*?)\\s*```", "$1")
                             .replaceAll("(?s)```\\s*(.*?)\\s*```", "$1").trim();

        JsonNode parsed = objectMapper.readTree(text);
        List<String> synonymsList = new ArrayList<>();
        if (parsed.has("synonyms") && parsed.path("synonyms").isArray()) {
            for (JsonNode item : parsed.path("synonyms")) {
                synonymsList.add(item.asText());
            }
        }

        List<String> wordFormsList = new ArrayList<>();
        if (parsed.has("wordForms") && parsed.path("wordForms").isArray()) {
            for (JsonNode item : parsed.path("wordForms")) {
                wordFormsList.add(item.asText());
            }
        }

        List<String> commonPhrasesList = new ArrayList<>();
        if (parsed.has("commonPhrases") && parsed.path("commonPhrases").isArray()) {
            for (JsonNode item : parsed.path("commonPhrases")) {
                commonPhrasesList.add(item.asText());
            }
        }

        List<String> relatedWordsList = new ArrayList<>();
        if (parsed.has("relatedWords") && parsed.path("relatedWords").isArray()) {
            for (JsonNode item : parsed.path("relatedWords")) {
                relatedWordsList.add(item.asText());
            }
        }

        String rawDiff = parsed.path("difficulty").asText("Medium");
        String cleanDiff = "Medium";
        if (rawDiff.toLowerCase().contains("easy") || rawDiff.toLowerCase().contains("a1") || rawDiff.toLowerCase().contains("a2")) {
            cleanDiff = "Easy";
        } else if (rawDiff.toLowerCase().contains("hard") || rawDiff.toLowerCase().contains("c1") || rawDiff.toLowerCase().contains("c2")) {
            cleanDiff = "Hard";
        }

        String rawRank = parsed.path("frequencyRank").asText("");
        if (rawRank.isEmpty()) {
            rawRank = "Top 1,000";
        }
        if (!rawRank.toLowerCase().contains("top") && !rawRank.startsWith("#")) {
            rawRank = "Top " + rawRank;
        }
        if (!rawRank.toLowerCase().contains("words")) {
            rawRank = rawRank + " Used Words";
        }

        String standardMeaning = parsed.path("standardMeaning").asText("");
        String simpleMeaning = parsed.path("simpleMeaning").asText("");
        String etymology = parsed.path("etymology").asText("");

        return GeneratedCardData.builder()
                .frontWord(parsed.path("frontWord").asText(word))
                .phonetic(parsed.path("phonetic").asText(""))
                .partOfSpeech(parsed.path("partOfSpeech").asText("vocabulary"))
                .backTranslation(parsed.path("backTranslation").asText("Translation"))
                .exampleSentence(parsed.path("exampleSentence").asText(""))
                .exampleTranslation(parsed.path("exampleTranslation").asText(""))
                .hint(parsed.path("hint").asText("Focus on context and repeat daily."))
                .tags(parsed.path("tags").asText("vocabulary"))
                .explanation(parsed.path("explanation").asText("Commonly used in everyday conversation."))
                .synonyms(synonymsList)
                .wordForms(wordFormsList)
                .etymology(etymology)
                .commonPhrases(commonPhrasesList)
                .relatedWords(relatedWordsList)
                .difficulty(cleanDiff)
                .frequencyRank(rawRank)
                .standardMeaning(standardMeaning)
                .simpleMeaning(simpleMeaning)
                .imageUrl(String.format("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80&sig=%d", Math.abs(word.hashCode() % 1000)))
                .build();
    }

    private String getLanguageCode(String langName) {
        if (langName == null) return "en";
        String lower = langName.toLowerCase().trim();
        Map<String, String> map = new HashMap<>();
        map.put("english", "en");
        map.put("hindi", "hi");
        map.put("spanish", "es");
        map.put("hebrew", "he");
        map.put("french", "fr");
        map.put("german", "de");
        map.put("japanese", "ja");
        map.put("chinese", "zh-CN");
        map.put("chinese (simplified)", "zh-CN");
        map.put("chinese (traditional)", "zh-TW");
        map.put("italian", "it");
        map.put("portuguese", "pt");
        map.put("russian", "ru");
        map.put("korean", "ko");
        map.put("arabic", "ar");
        map.put("turkish", "tr");
        map.put("dutch", "nl");
        map.put("polish", "pl");
        map.put("swedish", "sv");
        map.put("greek", "el");
        map.put("vietnamese", "vi");
        map.put("thai", "th");
        map.put("indonesian", "id");
        map.put("bengali", "bn");
        map.put("tamil", "ta");
        map.put("telugu", "te");
        map.put("marathi", "mr");
        map.put("urdu", "ur");
        map.put("gujarati", "gu");
        return map.getOrDefault(lower, lower);
    }
}
