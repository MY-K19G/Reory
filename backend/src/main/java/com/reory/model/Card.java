package com.reory.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Front: Word or phrase in target language (e.g., "la manzana", "食べる")
    @Column(nullable = false)
    private String frontWord;

    // Phonetic/Pronunciation/Romaji/IPA (e.g., "lah mahn-SAH-nah", "taberu")
    private String phonetic;

    // Part of speech (noun, verb, adjective, phrase)
    private String partOfSpeech;

    // Back: Translation/Meaning in user's native tongue (e.g., "Apple", "To eat")
    @Column(nullable = false, length = 1000)
    private String backTranslation;

    // Context example sentence in target language
    @Column(length = 1000)
    private String exampleSentence;

    // Context example translation
    @Column(length = 1000)
    private String exampleTranslation;

    // Optional hint or mnemonic note
    @Column(length = 500)
    private String hint;

    // Optional image URL or illustration badge
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Tags & metadata (JSON wordTree, comma separated tags)
    @Column(columnDefinition = "TEXT")
    private String tags;

    // Rich AI metadata: quiz, photo caption, photographer, synonyms, etc. (JSON formatted)
    @Column(columnDefinition = "TEXT")
    private String metadata;

    // --- Spaced Repetition System (SM-2 parameters) ---
    // Repetition counter
    @Builder.Default
    private int repetitions = 0;

    // Easiness factor (defaults to 2.5 in SM-2)
    @Builder.Default
    private double easeFactor = 2.5;

    // Current review interval in days
    @Builder.Default
    private int intervalDays = 0;

    // Next due date for review
    @Builder.Default
    private LocalDateTime nextReviewDate = LocalDateTime.now();

    // Last time reviewed
    private LocalDateTime lastReviewedAt;

    // State: NEW, LEARNING, REVIEW, MASTERED
    @Builder.Default
    private String status = "NEW";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    @JsonBackReference
    private Deck deck;
}
