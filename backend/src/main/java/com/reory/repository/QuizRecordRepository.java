package com.reory.repository;

import com.reory.model.QuizRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRecordRepository extends JpaRepository<QuizRecord, Long> {
    List<QuizRecord> findByDeckIdOrderByCompletedAtDesc(Long deckId);
    long countByDeckId(Long deckId);
}
