// UserBoostRepository.java
package com.example.focusdungeon.repository;

import com.example.focusdungeon.model.User;
import com.example.focusdungeon.model.UserBoost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserBoostRepository extends JpaRepository<UserBoost, Integer> {
    List<UserBoost> findByUserAndBoostTypeAndExpirationTimeAfter(User user, String boostType, LocalDateTime now);
    // Add this method to UserBoostRepository
    List<UserBoost> findByUserAndExpirationTimeAfter(User user, LocalDateTime now);
}