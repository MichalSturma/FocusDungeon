package com.example.focusdungeon.repository;

import com.example.focusdungeon.model.Item;
import com.example.focusdungeon.model.User;
import com.example.focusdungeon.model.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserInventoryRepository extends JpaRepository<UserInventory, Integer> {
    List<UserInventory> findByUser(User user);
    Optional<UserInventory> findByUserAndItem(User user, Item item);
    Optional<UserInventory> findByUserIdAndItemId(int userId, int itemId);
}