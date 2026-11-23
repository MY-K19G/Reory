package com.reory.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private String handle;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String avatar;

    private String displayName;

    private String targetLang;

    private String nativeLang;

    private String country;

    private String level;

    private Integer dailyGoalCards;

    private String bio;

    @Column(length = 2000)
    private String banner;

    private String bannerPosition;

    @Column(columnDefinition = "TEXT")
    private String favoriteDecks; // JSON array of deck IDs e.g. ["1","2"]

    @Column(columnDefinition = "TEXT")
    private String archivedDecks; // JSON array of deck IDs e.g. ["3"]

    @Column(columnDefinition = "TEXT")
    private String cardDetailSettings; // JSON object of card visibility toggles

    private String themeMode; // "dark" | "light" | "system"

    private String accentColor; // e.g. "emerald", "indigo", "cyan"

    private String appLanguage; // e.g. "en", "hi", "es"

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
