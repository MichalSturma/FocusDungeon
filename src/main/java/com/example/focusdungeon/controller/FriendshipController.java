package com.example.focusdungeon.controller;

import com.example.focusdungeon.model.Friendship;
import com.example.focusdungeon.model.User;
import com.example.focusdungeon.service.FriendshipService;
import com.example.focusdungeon.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {
    private final FriendshipService friendshipService;
    private final UserService userService;

    public FriendshipController(FriendshipService friendshipService, UserService userService) {
        this.friendshipService = friendshipService;
        this.userService = userService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(@RequestParam String friendUsername, Principal principal) {
        String myUsername = principal.getName();
        if (myUsername.equals(friendUsername)) {
            return ResponseEntity.badRequest().body("Nemůžeš si poslat žádost sám sobě.");
        }
        var friendOpt = userService.findUserByUsername(friendUsername);
        if (friendOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Uživatel nenalezen.");
        }
        User friend = friendOpt.get();
        User me = userService.findUserByUsername(myUsername).orElseThrow();
        friendshipService.sendFriendRequest(me, friend);
        return ResponseEntity.ok(Map.of("success", true, "message", "Žádost odeslána"));
    }

    // RESTful endpoint pro přijmutí/odmítnutí žádosti
    @PutMapping("/requests/{id}")
    public ResponseEntity<?> respondToFriendRequest(
            @PathVariable int id,
            @RequestParam String action,
            Principal principal) {
        User currentUser = userService.findUserByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if ("accept".equalsIgnoreCase(action)) {
            return ResponseEntity.ok(friendshipService.acceptFriendRequest(id, currentUser));
        } else if ("reject".equalsIgnoreCase(action)) {
            return ResponseEntity.ok(friendshipService.rejectFriendRequest(id, currentUser));
        } else {
            return ResponseEntity.badRequest().body("Invalid action");
        }
    }

    @GetMapping
    public List<Friendship> getFriends(Principal principal) {
        int userId = getUserIdFromPrincipal(principal).intValue();
        User user = userService.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return friendshipService.getFriends(user);
    }

    @GetMapping("/requests")
    public List<Friendship> getPendingRequests(Principal principal) {
        User user = userService.findUserByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + principal.getName()));
        return friendshipService.getPendingRequests(user);
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        String username = principal.getName();
        return userService.findUserByUsername(username)
                .map(user -> (long) user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> removeFriend(Principal principal, @PathVariable int friendId) {
        User user = userService.findUserByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        friendshipService.removeFriendship(user, friendId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}