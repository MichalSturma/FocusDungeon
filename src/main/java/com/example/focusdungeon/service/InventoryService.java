package com.example.focusdungeon.service;

import com.example.focusdungeon.model.*;
import com.example.focusdungeon.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserInventoryRepository userInventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Transactional
    public List<UserInventory> getUserInventory(Long userId) {
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userInventoryRepository.findByUser(user);
    }

    @Transactional
    public void checkAndAddNewItems(Long userId) {
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserStats userStats = userStatsRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User stats not found"));

        List<Item> unlockedItems = itemRepository.findByUnlockXpLessThanEqual(userStats.getXp());

        for (Item item : unlockedItems) {
            Optional<UserInventory> existing = userInventoryRepository.findByUserAndItem(user, item);

            if (existing.isEmpty()) {
                UserInventory newInventory = new UserInventory();
                newInventory.setUser(user);
                newInventory.setItem(item);
                newInventory.setQuantity(1);
                newInventory.setEquipped(false);
                userInventoryRepository.save(newInventory);
            }
        }
    }

    @Transactional
    public void useItem(int userId, int itemId) {
        // Fetch the inventory item
        UserInventory inventory = userInventoryRepository.findByUserIdAndItemId(userId, itemId)
                .orElseThrow(() -> new RuntimeException("Item not found in inventory"));

        // Check if the item is consumable and has enough quantity
        if (inventory.getQuantity() <= 0) {
            throw new RuntimeException("No items left to use");
        }

        // Handle consumable items
        if (inventory.getItem().isConsumable()) {
            inventory.setQuantity(inventory.getQuantity() - 1); // Reduce quantity
            userInventoryRepository.save(inventory); // Save inventory update

            // Apply item effect (e.g., XP Booster)
            if ("XP Booster".equalsIgnoreCase(inventory.getItem().getName())) {
                UserBoost boost = new UserBoost();
                boost.setUser(inventory.getUser());
                boost.setBoostType("XP_BOOST");
                boost.setBoostValue(inventory.getItem().getEffectValue() / 100.0); // Convert percentage
                boost.setExpirationTime(LocalDateTime.now().plusDays(3)); // Set expiration time
                userBoostRepository.save(boost); // Save boost
            }
        } else {
            // Handle non-consumable items (e.g., toggle equipped state)
            inventory.setEquipped(!inventory.isEquipped());
            userInventoryRepository.save(inventory);
        }
    }

    @Autowired
    private UserBoostRepository userBoostRepository;

    private void applyItemEffect(User user, Item item) {
        UserStats stats = userStatsRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User stats not found"));

        switch (item.getName()) {
            case "XP Booster":
                applyXpBoost(user, item);
                break;
            // Add more cases as needed
            default:
                // Default effect if any
                break;
        }

        userStatsRepository.save(stats);
    }

    private void applyXpBoost(User user, Item item) {
        UserBoost boost = new UserBoost();
        boost.setUser(user);
        boost.setBoostType("XP_BOOST");
        boost.setBoostValue(0.5); // 50% boost
        boost.setExpirationTime(LocalDateTime.now().plusDays(3)); // 3 days duration

        userBoostRepository.save(boost);
    }

    // Add to InventoryService.java
    @Transactional
    public List<UserBoost> getActiveBoosts(Long userId) {
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        return userBoostRepository.findByUserAndExpirationTimeAfter(user, now);
    }

    // Add this method to check active boosts
    public double getXpMultiplier(Long userId) {
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        List<UserBoost> activeBoosts = userBoostRepository.findByUserAndBoostTypeAndExpirationTimeAfter(
                user, "XP_BOOST", now);

        if (!activeBoosts.isEmpty()) {
            // Assuming we take the highest boost if multiple are active
            return 1.0 + activeBoosts.stream()
                    .mapToDouble(UserBoost::getBoostValue)
                    .max()
                    .orElse(0.0);
        }
        return 1.0;
    }

}