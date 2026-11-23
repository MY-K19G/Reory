package com.reory.repository;

import com.reory.model.ReviewLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReviewLogRepository extends JpaRepository<ReviewLog, Long> {
    List<ReviewLog> findByDeckId(Long deckId);
    
    @Query("SELECT COUNT(DISTINCT CAST(r.reviewedAt AS date)) FROM ReviewLog r WHERE r.reviewedAt >= :since")
    Long countActiveDaysSince(LocalDateTime since);

    @Query("SELECT CAST(r.reviewedAt AS date) as reviewDate, COUNT(r.id) as reviewCount FROM ReviewLog r GROUP BY CAST(r.reviewedAt AS date) ORDER BY reviewDate ASC")
    List<Object[]> findActivityGroupedByDate();
}
