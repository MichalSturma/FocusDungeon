package com.example.focusdungeon.service;

import com.example.focusdungeon.model.Friendship;
import com.example.focusdungeon.model.FriendshipStatus;
import com.example.focusdungeon.model.User;
import com.example.focusdungeon.repository.FriendshipRepository;
import com.example.focusdungeon.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    public Friendship sendFriendRequest(User from, User to) {
        // Zkontroluj, zda už přátelství existuje
        if (friendshipRepository.findByUserAndFriend(from, to).isPresent() ||
                friendshipRepository.findByUserAndFriend(to, from).isPresent()) {
            throw new IllegalStateException("Friendship already exists or pending");
        }

        Friendship friendship = new Friendship();
        friendship.setUser(from);
        friendship.setFriend(to);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(LocalDateTime.now());
        return friendshipRepository.save(friendship);
    }


    // FriendshipService.java
    public List<Friendship> getFriends(User user) {
        return friendshipRepository.findByUserAndStatusOrFriendAndStatus(
                user, FriendshipStatus.ACCEPTED, user, FriendshipStatus.ACCEPTED
        );
    }

    public List<Friendship> getPendingRequests(User user) {
        return friendshipRepository.findByFriendAndStatus(user, FriendshipStatus.PENDING);
    }

    public Friendship acceptFriendRequest(int friendshipId, User currentUser) {
        Friendship friendship = friendshipRepository.findById((long) friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        if (friendship.getFriend().getId() != currentUser.getId()) {
            throw new SecurityException("You are not authorized to accept this request");
        }
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    public Friendship rejectFriendRequest(int friendshipId, User currentUser) {
        Friendship friendship = friendshipRepository.findById((long) friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        if (friendship.getFriend().getId() != currentUser.getId()) {
            throw new SecurityException("You are not authorized to reject this request");
        }
        friendship.setStatus(FriendshipStatus.REJECTED);
        return friendshipRepository.save(friendship);
    }

    public void removeFriendship(User user, int friendId) {
        friendshipRepository.findByUserAndFriend(user, userRepository.findById(friendId).orElseThrow())
                .ifPresent(friendshipRepository::delete);
        friendshipRepository.findByUserAndFriend(userRepository.findById(friendId).orElseThrow(), user)
                .ifPresent(friendshipRepository::delete);
    }
}