package com.reory.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cardId;
    private Long deckId;

    // Grade: 1 (Again / Don't Know), 2 (Hard / Almost), 3 (Good / Recalled), 4 (Easy / Mastered)
    private int grade;

    private int previousInterval;
    private int newInterval;

    private double previousEaseFactor;
    private double newEaseFactor;

    @Builder.Default
    private LocalDateTime reviewedAt = LocalDateTime.now();
}
