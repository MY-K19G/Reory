package com.reory.repository;

import com.reory.model.UserEncryptedKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEncryptedKeyRepository extends JpaRepository<UserEncryptedKey, Long> {
    Optional<UserEncryptedKey> findByUserIdentifier(String userIdentifier);
    void deleteByUserIdentifier(String userIdentifier);
}
