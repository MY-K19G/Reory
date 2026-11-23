package com.reory.controller;

import com.reory.model.Card;
import com.reory.model.Category;
import com.reory.model.Deck;
import com.reory.repository.CategoryRepository;
import com.reory.service.DeckService;
import com.reory.service.SrsService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.reory.model.User;
import com.reory.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final DeckService deckService;
    private final SrsService srsService;
    private final com.reory.service.GeminiAiService geminiAiService;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final com.reory.repository.DeckRepository deckRepository;
    private final com.reory.repository.UserEncryptedKeyRepository userEncryptedKeyRepository;

    // --- Authentication & User Management ---
    @Data
    public static class SignUpRequest {
        private String username;
        private String email;
        private String password;
        private String displayName;
    }

    @Data
    public static class LoginRequest {
        private String usernameOrEmail;
        private String password;
    }

    @Data
    public static class ForgotPasswordRequest {
        private String emailOrUsername;
        private String newPassword;
    }

    @Data
    public static class DeleteAccountRequest {
        private String usernameOrEmail;
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest req) {
        if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        String username = req.getUsername().trim();
        String email = req.getEmail().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken"));
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "An account with this email already exists"));
        }

        String displayName = (req.getDisplayName() != null && !req.getDisplayName().trim().isEmpty())
                ? req.getDisplayName().trim()
                : username;

        User user = User.builder()
                .username(username)
                .email(email)
                .password(req.getPassword() != null ? req.getPassword() : "")
                .displayName(displayName)
                .avatar(null)
                .build();

        User saved = userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "id", saved.getId(),
                "username", saved.getUsername(),
                "email", saved.getEmail(),
                "displayName", saved.getDisplayName()
        ));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.getUsernameOrEmail() == null || req.getUsernameOrEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email is required"));
        }

        String identifier = req.getUsernameOrEmail().trim();
        Optional<User> userOpt = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "No account found with this username or email. Please sign up."));
        }

        User user = userOpt.get();
        // Check password if configured
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (req.getPassword() == null || !user.getPassword().equals(req.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid password credentials"));
            }
        }

        Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("email", user.getEmail());
        resp.put("displayName", user.getDisplayName() != null ? user.getDisplayName() : user.getUsername());
        String avatarVal = user.getAvatar();
        if (avatarVal != null && !avatarVal.trim().isEmpty() && !"/profile/avatar.jpg".equals(avatarVal.trim())) {
            resp.put("avatar", avatarVal);
        } else {
            resp.put("avatar", null);
        }
        if (user.getTargetLang() != null) resp.put("targetLang", user.getTargetLang());
        if (user.getNativeLang() != null) resp.put("nativeLang", user.getNativeLang());
        if (user.getCountry() != null) resp.put("country", user.getCountry());
        if (user.getLevel() != null) resp.put("level", user.getLevel());
        if (user.getDailyGoalCards() != null) resp.put("dailyGoalCards", user.getDailyGoalCards());
        if (user.getBio() != null) resp.put("bio", user.getBio());
        if (user.getHandle() != null) resp.put("handle", user.getHandle());
        if (user.getBanner() != null) resp.put("banner", user.getBanner());
        if (user.getBannerPosition() != null) resp.put("bannerPosition", user.getBannerPosition());
        if (user.getFavoriteDecks() != null) resp.put("favoriteDecks", user.getFavoriteDecks());
        if (user.getArchivedDecks() != null) resp.put("archivedDecks", user.getArchivedDecks());
        if (user.getCardDetailSettings() != null) resp.put("cardDetailSettings", user.getCardDetailSettings());
        if (user.getThemeMode() != null) resp.put("themeMode", user.getThemeMode());
        if (user.getAccentColor() != null) resp.put("accentColor", user.getAccentColor());
        if (user.getAppLanguage() != null) resp.put("appLanguage", user.getAppLanguage());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/auth/check-handle")
    public ResponseEntity<?> checkHandle(
            @RequestParam("handle") String handle,
            @RequestParam(value = "currentUsername", required = false) String currentUsername) {
        if (handle == null || handle.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("available", false, "error", "Handle cannot be empty"));
        }
        String cleanHandle = handle.trim().replace("@", "");
        if (cleanHandle.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("available", false, "error", "Handle cannot be empty"));
        }

        String exclude = (currentUsername != null && !currentUsername.trim().isEmpty())
                ? currentUsername.trim()
                : null;

        boolean isTaken = (exclude != null)
                ? userRepository.isHandleTakenByOther(cleanHandle, exclude)
                : userRepository.isHandleTaken(cleanHandle);
        if (isTaken) {
            return ResponseEntity.ok(Map.of(
                    "available", false,
                    "handle", cleanHandle,
                    "error", "Handle @" + cleanHandle + " is already taken"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "available", true,
                "handle", cleanHandle,
                "message", "Handle is available"
        ));
    }

    @Data
    public static class PreferencesRequest {
        private String usernameOrEmail;
        private String handle;
        private String targetLang;
        private String nativeLang;
        private String country;
        private String level;
        private Integer dailyGoalCards;
        private String bio;
        private String displayName;
        private String avatar;
        private String banner;
        private String bannerPosition;
        private String favoriteDecks;
        private String archivedDecks;
        private String cardDetailSettings;
        private String themeMode;
        private String accentColor;
        private String appLanguage;
    }

    @PostMapping("/auth/preferences")
    public ResponseEntity<?> updatePreferences(@RequestBody PreferencesRequest req) {
        if (req.getUsernameOrEmail() == null || req.getUsernameOrEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email is required"));
        }

        String identifier = req.getUsernameOrEmail().trim();
        Optional<User> userOpt = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (req.getHandle() != null && !req.getHandle().trim().isEmpty()) {
            String cleanHandle = req.getHandle().trim().replace("@", "");
            boolean isTaken = userRepository.isHandleTakenByOther(cleanHandle, user.getUsername());
            if (isTaken) {
                return ResponseEntity.badRequest().body(Map.of("error", "Handle @" + cleanHandle + " is already taken"));
            }
            user.setHandle(cleanHandle);
        }
        if (req.getTargetLang() != null) user.setTargetLang(req.getTargetLang().trim());
        if (req.getNativeLang() != null) user.setNativeLang(req.getNativeLang().trim());
        if (req.getCountry() != null) user.setCountry(req.getCountry().trim());
        if (req.getLevel() != null) user.setLevel(req.getLevel().trim());
        if (req.getDailyGoalCards() != null) user.setDailyGoalCards(req.getDailyGoalCards());
        if (req.getBio() != null) user.setBio(req.getBio().trim());
        if (req.getDisplayName() != null && !req.getDisplayName().trim().isEmpty()) {
            user.setDisplayName(req.getDisplayName().trim());
        }
        if (req.getBanner() != null && !req.getBanner().trim().isEmpty()) {
            user.setBanner(req.getBanner().trim());
        }
        if (req.getBannerPosition() != null && !req.getBannerPosition().trim().isEmpty()) {
            user.setBannerPosition(req.getBannerPosition().trim());
        }
        if (req.getFavoriteDecks() != null) user.setFavoriteDecks(req.getFavoriteDecks());
        if (req.getArchivedDecks() != null) user.setArchivedDecks(req.getArchivedDecks());
        if (req.getCardDetailSettings() != null) user.setCardDetailSettings(req.getCardDetailSettings());
        if (req.getThemeMode() != null) user.setThemeMode(req.getThemeMode());
        if (req.getAccentColor() != null) user.setAccentColor(req.getAccentColor());
        if (req.getAppLanguage() != null) user.setAppLanguage(req.getAppLanguage());

        if (req.getAvatar() != null) {
            String trimmedAv = req.getAvatar().trim();
            if (trimmedAv.isEmpty() || "/profile/avatar.jpg".equals(trimmedAv)) {
                user.setAvatar(null);
            } else {
                user.setAvatar(trimmedAv);
            }
        }

        User saved = userRepository.save(user);
        Map<String, Object> respMap = new java.util.HashMap<>();
        respMap.put("message", "Preferences updated successfully");
        respMap.put("username", saved.getUsername());
        respMap.put("handle", saved.getHandle() != null ? saved.getHandle() : "");
        respMap.put("targetLang", saved.getTargetLang() != null ? saved.getTargetLang() : "");
        respMap.put("nativeLang", saved.getNativeLang() != null ? saved.getNativeLang() : "");
        respMap.put("country", saved.getCountry() != null ? saved.getCountry() : "");
        respMap.put("level", saved.getLevel() != null ? saved.getLevel() : "");
        respMap.put("dailyGoalCards", saved.getDailyGoalCards() != null ? saved.getDailyGoalCards() : 10);
        if (saved.getBanner() != null) respMap.put("banner", saved.getBanner());
        if (saved.getBannerPosition() != null) respMap.put("bannerPosition", saved.getBannerPosition());
        if (saved.getFavoriteDecks() != null) respMap.put("favoriteDecks", saved.getFavoriteDecks());
        if (saved.getArchivedDecks() != null) respMap.put("archivedDecks", saved.getArchivedDecks());
        if (saved.getCardDetailSettings() != null) respMap.put("cardDetailSettings", saved.getCardDetailSettings());
        if (saved.getThemeMode() != null) respMap.put("themeMode", saved.getThemeMode());
        if (saved.getAccentColor() != null) respMap.put("accentColor", saved.getAccentColor());
        if (saved.getAppLanguage() != null) respMap.put("appLanguage", saved.getAppLanguage());
        return ResponseEntity.ok(respMap);
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        if (req.getEmailOrUsername() == null || req.getEmailOrUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email is required"));
        }
        if (req.getNewPassword() == null || req.getNewPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
        }

        String identifier = req.getEmailOrUsername().trim();
        Optional<User> userOpt = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "No user found with that username or email"));
        }

        User user = userOpt.get();
        user.setPassword(req.getNewPassword().trim());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Password reset successfully. You can now log in with your new password.",
                "username", user.getUsername()
        ));
    }

    @PostMapping("/auth/delete-account")
    @Transactional
    public ResponseEntity<?> deleteAccount(@RequestBody DeleteAccountRequest req) {
        if (req.getUsernameOrEmail() == null || req.getUsernameOrEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email is required"));
        }

        String identifier = req.getUsernameOrEmail().trim();
        Optional<User> userOpt = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                categoryRepository.deleteByUserIdentifier(user.getUsername());
                categoryRepository.deleteByUserIdentifier(user.getEmail());
            } catch (Exception ignored) {}

            try {
                deckRepository.deleteByAuthorIgnoreCase(user.getUsername());
            } catch (Exception ignored) {}

            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "Account successfully deleted"));
        }

        return ResponseEntity.ok(Map.of("message", "Account processed"));
    }

    // --- User Custom Categories ---
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getUserCategories(
            @RequestParam(defaultValue = "default_user") String user) {
        return ResponseEntity.ok(categoryRepository.findByUserIdentifierOrderByNameAsc(user.trim()));
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createOrGetCategory(
            @RequestBody Category category,
            @RequestParam(defaultValue = "default_user") String user) {
        String trimmedName = category.getName() != null ? category.getName().trim() : "";
        if (trimmedName.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String effectiveUser = (category.getUserIdentifier() != null && !category.getUserIdentifier().trim().isEmpty())
                ? category.getUserIdentifier().trim()
                : user.trim();

        // Check if duplicate category already exists for this user (case-insensitive)
        Optional<Category> existing = categoryRepository.findByUserIdentifierAndNameIgnoreCase(effectiveUser, trimmedName);
        if (existing.isPresent()) {
            Category cat = existing.get();
            // Update icon if provided
            if (category.getIcon() != null && !category.getIcon().trim().isEmpty()) {
                cat.setIcon(category.getIcon().trim());
                categoryRepository.save(cat);
            }
            return ResponseEntity.ok(cat);
        }

        Category newCat = Category.builder()
                .name(trimmedName)
                .icon(category.getIcon() != null && !category.getIcon().trim().isEmpty() ? category.getIcon().trim() : "bi-tag")
                .userIdentifier(effectiveUser)
                .build();
        return ResponseEntity.ok(categoryRepository.save(newCat));
    }

    @Transactional
    @DeleteMapping("/categories")
    public ResponseEntity<Void> deleteCategory(
            @RequestParam String name,
            @RequestParam(defaultValue = "default_user") String user) {
        categoryRepository.deleteByUserIdentifierAndNameIgnoreCase(user.trim(), name.trim());
        return ResponseEntity.noContent().build();
    }

    // --- AI Vocabulary Generation with Gemini ---
    @Data
    public static class AiGenerateRequest {
        private String word;
        private String targetLanguage; // Language to learn (e.g. Hebrew, Spanish, Japanese)
        private String nativeLanguage; // User's native tongue (e.g. English, French, Hindi)
        private String apiKey;         // Optional custom user key from frontend settings
        private String model;          // Selected Gemini model from user settings in UI
    }

    @PostMapping("/ai/generate-card")
    public ResponseEntity<com.reory.service.GeminiAiService.GeneratedCardData> generateCard(@RequestBody AiGenerateRequest request) {
        String targetLang = (request.getTargetLanguage() != null && !request.getTargetLanguage().isEmpty()) ? request.getTargetLanguage() : "Spanish";
        String nativeLang = (request.getNativeLanguage() != null && !request.getNativeLanguage().isEmpty()) ? request.getNativeLanguage() : "English";
        return ResponseEntity.ok(geminiAiService.generateCardContent(request.getWord(), targetLang, nativeLang, request.getApiKey(), request.getModel()));
    }

    // --- Decks ---
    @GetMapping("/decks")
    public ResponseEntity<List<Deck>> getAllDecks(@RequestParam(value = "author", required = false) String author) {
        return ResponseEntity.ok(deckService.getAllDecks(author));
    }

    @GetMapping("/decks/{id}")
    public ResponseEntity<Deck> getDeckById(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    @GetMapping({"/decks/@{author}/{slug}", "/decks/by-slug"})
    public ResponseEntity<Deck> getDeckByAuthorAndSlug(
            @PathVariable(value = "author", required = false) String author,
            @PathVariable(value = "slug", required = false) String slug,
            @RequestParam(value = "author", required = false) String paramAuthor,
            @RequestParam(value = "slug", required = false) String paramSlug) {
        String effectiveAuthor = author != null ? author : (paramAuthor != null ? paramAuthor : "user");
        String effectiveSlug = slug != null ? slug : paramSlug;
        return ResponseEntity.ok(deckService.getDeckByAuthorAndSlug(effectiveAuthor, effectiveSlug));
    }

    @PostMapping("/decks")
    public ResponseEntity<Deck> createDeck(@RequestBody Deck deck) {
        return ResponseEntity.ok(deckService.createDeck(deck));
    }

    @PutMapping("/decks/{id}")
    public ResponseEntity<Deck> updateDeck(@PathVariable Long id, @RequestBody Deck deck) {
        return ResponseEntity.ok(deckService.updateDeck(id, deck));
    }

    @DeleteMapping("/decks/{id}")
    public ResponseEntity<Void> deleteDeck(@PathVariable Long id) {
        deckService.deleteDeck(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/decks/{id}/fork")
    public ResponseEntity<Deck> forkDeck(
            @PathVariable Long id,
            @RequestParam(value = "author", required = false) String author) {
        return ResponseEntity.ok(deckService.forkDeck(id, author));
    }

    @PostMapping("/decks/{id}/clone")
    public ResponseEntity<Deck> cloneDeck(
            @PathVariable Long id,
            @RequestParam(value = "author", required = false) String author) {
        return ResponseEntity.ok(deckService.cloneDeck(id, author));
    }

    // --- Specialized Deck Category Endpoints (Fork, Cloned, Archived) ---
    @GetMapping("/decks/fork/{id}")
    public ResponseEntity<Deck> getForkedDeckById(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    @GetMapping("/decks/cloned/{id}")
    public ResponseEntity<Deck> getClonedDeckById(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    @GetMapping("/decks/archived/{id}")
    public ResponseEntity<Deck> getArchivedDeckById(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    // --- Cards & Study Session ---
    @GetMapping("/decks/{id}/study")
    public ResponseEntity<List<Card>> getDeckStudyQueue(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getStudyQueue(id));
    }

    @GetMapping({"/decks/fork/{id}/study", "/decks/cloned/{id}/study", "/decks/archived/{id}/study"})
    public ResponseEntity<List<Card>> getSpecializedDeckStudyQueue(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getStudyQueue(id));
    }

    @PostMapping("/decks/{id}/cards")
    public ResponseEntity<Card> addCardToDeck(@PathVariable Long id, @RequestBody Card card) {
        return ResponseEntity.ok(deckService.addCardToDeck(id, card));
    }

    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        deckService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/cards/{id}")
    public ResponseEntity<Card> updateCard(@PathVariable Long id, @RequestBody Card card) {
        return ResponseEntity.ok(deckService.updateCard(id, card));
    }

    @PutMapping("/cards/by-word/image")
    public ResponseEntity<Map<String, Object>> updateCardImageByWord(@RequestBody Map<String, String> payload) {
        String word = payload.get("word");
        String imageUrl = payload.get("imageUrl");
        int updatedCount = deckService.updateCardImageByWord(word, imageUrl);
        Map<String, Object> response = new HashMap<>();
        response.put("updatedCount", updatedCount);
        response.put("word", word);
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/decks/{id}/quiz")
    public ResponseEntity<Map<String, Object>> recordQuiz(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        int score = payload.get("score") != null ? ((Number) payload.get("score")).intValue() : 0;
        int totalQuestions = payload.get("totalQuestions") != null ? ((Number) payload.get("totalQuestions")).intValue() : 0;
        int timeSeconds = payload.get("timeSeconds") != null ? ((Number) payload.get("timeSeconds")).intValue() : 0;
        deckService.recordQuiz(id, score, totalQuestions, timeSeconds);
        return ResponseEntity.ok(deckService.getDeckQuizStats(id));
    }

    @GetMapping("/decks/{id}/quiz/stats")
    public ResponseEntity<Map<String, Object>> getDeckQuizStats(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getDeckQuizStats(id));
    }

    @Data
    public static class ReviewRequest {
        private int grade; // 1: Again, 2: Hard, 3: Good, 4: Easy
    }

    @PostMapping("/cards/{id}/review")
    public ResponseEntity<Card> reviewCard(@PathVariable Long id, @RequestBody ReviewRequest request) {
        Card updated = srsService.reviewCard(id, request.getGrade());
        return ResponseEntity.ok(updated);
    }

    // --- Global Stats ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(deckService.getOverallStats());
    }

    // --- Zero-Knowledge Encrypted Key Sync Endpoints ---
    @Data
    public static class EncryptedKeySyncRequest {
        private String userIdentifier;
        private String ciphertext;
        private String iv;
        private String salt;
        private String pexelsCiphertext;
        private String pexelsIv;
        private String pexelsSalt;
        private int version;
        private String preferredModel;
    }

    @PostMapping("/sync/key")
    @Transactional
    public ResponseEntity<?> saveEncryptedKey(@RequestBody EncryptedKeySyncRequest req) {
        if (req.getUserIdentifier() == null || req.getUserIdentifier().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User identifier is required"));
        }

        com.reory.model.UserEncryptedKey key = userEncryptedKeyRepository
                .findByUserIdentifier(req.getUserIdentifier().trim())
                .orElse(new com.reory.model.UserEncryptedKey());

        key.setUserIdentifier(req.getUserIdentifier().trim());
        if (req.getCiphertext() != null) key.setCiphertext(req.getCiphertext());
        if (req.getIv() != null) key.setIv(req.getIv());
        if (req.getSalt() != null) key.setSalt(req.getSalt());

        if (req.getPexelsCiphertext() != null) key.setPexelsCiphertext(req.getPexelsCiphertext());
        if (req.getPexelsIv() != null) key.setPexelsIv(req.getPexelsIv());
        if (req.getPexelsSalt() != null) key.setPexelsSalt(req.getPexelsSalt());

        key.setVersion(req.getVersion() > 0 ? req.getVersion() : 1);
        if (req.getPreferredModel() != null && !req.getPreferredModel().trim().isEmpty()) {
            key.setPreferredModel(req.getPreferredModel().trim());
        }
        key.setUpdatedAt(java.time.LocalDateTime.now());

        userEncryptedKeyRepository.save(key);
        return ResponseEntity.ok(Map.of("success", true, "message", "Encrypted key saved to cloud database"));
    }

    @GetMapping("/sync/key")
    public ResponseEntity<?> getEncryptedKey(@RequestParam String userIdentifier) {
        if (userIdentifier == null || userIdentifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userIdentifier query param required"));
        }
        return userEncryptedKeyRepository.findByUserIdentifier(userIdentifier.trim())
                .map(k -> {
                    Map<String, Object> resp = new java.util.HashMap<>();
                    if (k.getCiphertext() != null) resp.put("ciphertext", k.getCiphertext());
                    if (k.getIv() != null) resp.put("iv", k.getIv());
                    if (k.getSalt() != null) resp.put("salt", k.getSalt());
                    if (k.getPexelsCiphertext() != null) resp.put("pexelsCiphertext", k.getPexelsCiphertext());
                    if (k.getPexelsIv() != null) resp.put("pexelsIv", k.getPexelsIv());
                    if (k.getPexelsSalt() != null) resp.put("pexelsSalt", k.getPexelsSalt());
                    resp.put("version", k.getVersion());
                    resp.put("preferredModel", k.getPreferredModel() != null ? k.getPreferredModel() : "gemini-3.5-flash-lite");
                    resp.put("updatedAt", k.getUpdatedAt().toString());
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/sync/key")
    @Transactional
    public ResponseEntity<?> deleteEncryptedKey(@RequestParam String userIdentifier) {
        if (userIdentifier != null && !userIdentifier.trim().isEmpty()) {
            userEncryptedKeyRepository.deleteByUserIdentifier(userIdentifier.trim());
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Encrypted key removed from cloud database"));
    }
}
