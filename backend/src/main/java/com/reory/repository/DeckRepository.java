package com.reory.repository;

import com.reory.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByLanguageIgnoreCase(String language);
    List<Deck> findByAuthorIgnoreCase(String author);
    long countByForkedFromDeckId(Long forkedFromDeckId);
    long countByClonedFromDeckId(Long clonedFromDeckId);
    void deleteByAuthorIgnoreCase(String author);
    java.util.Optional<Deck> findByAuthorIgnoreCaseAndSlugIgnoreCase(String author, String slug);
    java.util.Optional<Deck> findFirstBySlugIgnoreCase(String slug);
}
