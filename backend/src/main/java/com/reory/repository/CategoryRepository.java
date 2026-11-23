package com.reory.repository;

import com.reory.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserIdentifierOrderByNameAsc(String userIdentifier);

    Optional<Category> findByUserIdentifierAndNameIgnoreCase(String userIdentifier, String name);

    boolean existsByUserIdentifierAndNameIgnoreCase(String userIdentifier, String name);

    void deleteByUserIdentifierAndNameIgnoreCase(String userIdentifier, String name);

    void deleteByUserIdentifier(String userIdentifier);
}
