package com.example.focusdungeon.repository;

import com.example.focusdungeon.model.UserStats;
import com.example.focusdungeon.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUser(User user);
}
