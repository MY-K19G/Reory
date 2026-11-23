package com.reory.service;

import com.reory.model.Card;
import com.reory.model.ReviewLog;
import com.reory.repository.CardRepository;
import com.reory.repository.ReviewLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm Implementation.
 * 
 * Grades:
 * 1: Again (Forgot / Complete blackout)
 * 2: Hard (Recalled with serious difficulty)
 * 3: Good (Recalled with hesitation or minor effort)
 * 4: Easy (Perfect recall, immediate response)
 */
@Service
@RequiredArgsConstructor
public class SrsService {

    private final CardRepository cardRepository;
    private final ReviewLogRepository reviewLogRepository;

    @Transactional
    public Card reviewCard(Long cardId, int grade) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));

        int prevInterval = card.getIntervalDays();
        double prevEF = card.getEaseFactor();

        int repetitions = card.getRepetitions();
        double ef = prevEF;
        int interval;

        // Grade mapping to SM-2 0-5 scale:
        // 1 (Again) -> 1
        // 2 (Hard)  -> 3
        // 3 (Good)  -> 4
        // 4 (Easy)  -> 5
        int sm2Grade = switch (grade) {
            case 1 -> 1;
            case 2 -> 3;
            case 3 -> 4;
            case 4 -> 5;
            default -> 3;
        };

        if (sm2Grade >= 3) {
            // Correct response
            if (repetitions == 0) {
                interval = 1; // 1 day
            } else if (repetitions == 1) {
                interval = (grade == 2) ? 3 : 6; // 3 or 6 days
            } else {
                interval = (int) Math.round(prevInterval * ef);
            }
            repetitions++;

            if (interval > 21) {
                card.setStatus("MASTERED");
            } else {
                card.setStatus("REVIEW");
            }
        } else {
            // Incorrect response / Again
            repetitions = 0;
            interval = 1;
            card.setStatus("LEARNING");
        }

        // Calculate new Easiness Factor (EF') = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        ef = ef + (0.1 - (5 - sm2Grade) * (0.08 + (5 - sm2Grade) * 0.02));
        if (ef < 1.3) {
            ef = 1.3; // Min threshold
        }

        card.setRepetitions(repetitions);
        card.setEaseFactor(Math.round(ef * 100.0) / 100.0);
        card.setIntervalDays(interval);
        card.setLastReviewedAt(LocalDateTime.now());
        card.setNextReviewDate(LocalDateTime.now().plusDays(interval));

        Card savedCard = cardRepository.save(card);

        // Record review log
        ReviewLog log = ReviewLog.builder()
                .cardId(savedCard.getId())
                .deckId(savedCard.getDeck().getId())
                .grade(grade)
                .previousInterval(prevInterval)
                .newInterval(interval)
                .previousEaseFactor(prevEF)
                .newEaseFactor(savedCard.getEaseFactor())
                .reviewedAt(LocalDateTime.now())
                .build();
        reviewLogRepository.save(log);

        return savedCard;
    }
}
