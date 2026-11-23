package com.reory.repository;

import com.reory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameIgnoreCase(String username);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByHandleIgnoreCase(String handle);
    Optional<User> findByUsernameIgnoreCaseOrEmailIgnoreCase(String username, String email);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByHandleIgnoreCase(String handle);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(COALESCE(u.handle, '')) = LOWER(:handle) OR LOWER(u.username) = LOWER(:handle)")
    boolean isHandleTaken(@Param("handle") String handle);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE (LOWER(COALESCE(u.handle, '')) = LOWER(:handle) OR LOWER(u.username) = LOWER(:handle)) AND LOWER(u.username) != LOWER(:excludeUsername)")
    boolean isHandleTakenByOther(@Param("handle") String handle, @Param("excludeUsername") String excludeUsername);
}
