package com.example.focusdungeon.service;

import com.example.focusdungeon.model.User;
import com.example.focusdungeon.model.UserStats;
import com.example.focusdungeon.repository.UserRepository;
import com.example.focusdungeon.repository.UserStatsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserStatsService {
    private final UserStatsRepository userStatsRepository;
    private final UserRepository userRepository;

    public UserStatsService(UserStatsRepository userStatsRepository, UserRepository userRepository) {
        this.userStatsRepository = userStatsRepository;
        this.userRepository = userRepository;
    }

    public UserStats updateUserStats(int userId, UserStats newStats) {
        // ✅ Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ User not found!"));

        // ✅ Check if the user has stats
        UserStats stats = userStatsRepository.findByUser(user)
                .orElseGet(() -> {
                    System.out.println("⚠ User stats do not exist. Creating new...");
                    UserStats newUserStats = new UserStats();
                    newUserStats.setUser(user);
                    newUserStats.setXp(0);
                    newUserStats.setTotalFocusTime(0);
                    newUserStats.setLongestStreak(0);
                    return userStatsRepository.save(newUserStats);
                });

        // ✅ Update stats
        stats.setXp(newStats.getXp());
        stats.setTotalFocusTime(newStats.getTotalFocusTime());
        stats.setLongestStreak(newStats.getLongestStreak());

        return userStatsRepository.save(stats);
    }

    public Optional<UserStats> getUserStats(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ User not found!"));
        return userStatsRepository.findByUser(user);
    }

    public List<UserStats> getAllUsersSortedByXp() {
        return userStatsRepository.findAll()
                .stream()
                .sorted((u1, u2) -> Integer.compare(u2.getXp(), u1.getXp()))
                .collect(Collectors.toList());
    }
}