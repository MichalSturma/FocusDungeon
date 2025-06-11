package com.example.focusdungeon.controller;

import com.example.focusdungeon.model.UserStats;
import com.example.focusdungeon.service.UserStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/stats")
@Validated
public class UserStatsController {

    private final UserStatsService userStatsService;

    public UserStatsController(UserStatsService userStatsService) {
        this.userStatsService = userStatsService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserStats(@PathVariable int userId) {
        Optional<UserStats> stats = userStatsService.getUserStats(userId);
        if (stats.isEmpty()) {
            // Log or provide additional context
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(stats.get());
    }



    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserStats(
            @PathVariable int userId,
            @RequestBody UserStats newStats,
            Principal principal) {
        // Authorization check (if needed)
        if (!isAuthorized(principal, userId)) {
            return ResponseEntity.status(403).body("Unauthorized to update this user's stats");
        }

        try {
            UserStats updatedStats = userStatsService.updateUserStats(userId, newStats);
            return ResponseEntity.ok(updatedStats);
        } catch (RuntimeException e) {
            // Log the exception and return a more descriptive error
            return ResponseEntity.status(500).body("An error occurred while updating user stats");
        }
    }

    private boolean isAuthorized(Principal principal, int userId) {
        // Implement authorization logic (e.g., check if principal.getName() matches userId)
        return true; // Placeholder
    }
}