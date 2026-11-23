package com.reory.repository;

import com.reory.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByDeckId(Long deckId);
    List<Card> findByFrontWordIgnoreCase(String frontWord);

    // Cards due for review (nextReviewDate <= now) or unreviewed (repetitions == 0)
    @Query("SELECT c FROM Card c WHERE c.deck.id = :deckId AND (c.nextReviewDate <= :now OR c.repetitions = 0) ORDER BY c.repetitions ASC, c.nextReviewDate ASC")
    List<Card> findDueCardsForDeck(@Param("deckId") Long deckId, @Param("now") LocalDateTime now);

    long countByStatus(String status);
    long countByRepetitionsGreaterThan(int repetitions);
}
