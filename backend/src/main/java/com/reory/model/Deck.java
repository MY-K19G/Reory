package com.reory.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "decks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // URL friendly slug (e.g. "advanced-vocabulary")
    private String slug;

    @Column(length = 1000)
    private String description;

    // e.g. "Spanish", "Japanese", "German", "French"
    private String language;

    // e.g. "es", "ja", "de", "fr", "en"
    private String languageCode;

    // e.g. "Beginner (A1)", "Intermediate (B1)", "JLPT N5"
    private String level;

    // Visual theme / accent gradient tag
    private String color;

    // Emoji or icon name (e.g. "🇪🇸", "🍣", "🍺", "🥖")
    private String icon;

    // Comma-separated tags (e.g. "JLPT N5, Beginner, Vocabulary, Kanji")
    private String tags;

    // Cover image URL (Unsplash, Pexels, or custom)
    @Column(length = 1500)
    private String coverImage;

    @JsonProperty("isPublic")
    private boolean isPublic;

    @JsonProperty("public")
    public void setPublicAlternative(boolean isPublic) {
        this.isPublic = isPublic;
    }

    // Author of this deck (e.g. "Zen", "Mirai_JP", etc.)
    private String author;

    // GitHub-style Fork tracking
    private Long forkedFromDeckId;
    private String forkedFromTitle;
    private String forkedFromAuthor;

    // Clone tracking
    @Builder.Default
    @Column(name = "is_cloned")
    private Boolean isCloned = false;
    private Long clonedFromDeckId;
    private String clonedFromTitle;
    private String clonedFromAuthor;

    public boolean isCloned() {
        return Boolean.TRUE.equals(this.isCloned);
    }

    public void setIsCloned(Boolean isCloned) {
        this.isCloned = isCloned;
    }



    @Builder.Default
    private int forkCount = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<Card> cards = new ArrayList<>();
}
