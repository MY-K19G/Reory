package com.reory.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long deckId;

    private int score;

    private int totalQuestions;

    private int accuracy; // Percentage (e.g. 85)

    private int timeSeconds;

    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}
