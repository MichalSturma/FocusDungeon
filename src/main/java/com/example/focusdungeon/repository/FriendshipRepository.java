package com.example.focusdungeon.repository;

import com.example.focusdungeon.model.Friendship;
import com.example.focusdungeon.model.User;
import com.example.focusdungeon.model.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByUserAndStatus(User user, FriendshipStatus status);
    Optional<Friendship> findByUserAndFriend(User user, User friend);
    List<Friendship> findByUserAndStatusOrFriendAndStatus(User user, FriendshipStatus status1, User friend, FriendshipStatus status2);
    List<Friendship> findByFriendAndStatus(User friend, FriendshipStatus status);
}