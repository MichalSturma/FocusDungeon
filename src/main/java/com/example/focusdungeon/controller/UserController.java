package com.example.focusdungeon.controller;

import com.example.focusdungeon.model.User;
import com.example.focusdungeon.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}/bio")
    public ResponseEntity<?> updateBio(@PathVariable int userId, @RequestBody Map<String, String> request, Principal principal) {
        String bio = request.get("bio");

        // Authorization check (optional)
        if (!isAuthorized(principal, userId)) {
            return ResponseEntity.status(403).body("Unauthorized to update this user's bio");
        }

        try {
            userService.updateBio(userId, bio);
            return ResponseEntity.ok(Map.of("success", true, "message", "Bio updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Failed to update bio"));
        }
    }
    @GetMapping("/{userId}/bio")
    public ResponseEntity<?> getBio(@PathVariable int userId, Principal principal) {
        // Authorization check (optional)
        if (!isAuthorized(principal, userId)) {
            return ResponseEntity.status(403).body("Unauthorized to access this user's bio");
        }

        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(Map.of("bio", user.getBio()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Failed to fetch bio"));
        }
    }

    private boolean isAuthorized(Principal principal, int userId) {
        // Implement authorization logic (e.g., check if principal.getName() matches userId)
        return true; // Placeholder
    }

    // UserController.java
    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        return userService.findUserByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }


}