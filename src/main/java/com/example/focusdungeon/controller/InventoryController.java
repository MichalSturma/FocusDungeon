package com.example.focusdungeon.controller;

import com.example.focusdungeon.dto.UserBoostDto;
import com.example.focusdungeon.dto.UserInventoryDto;
import com.example.focusdungeon.model.UserBoost;
import com.example.focusdungeon.model.UserInventory;
import com.example.focusdungeon.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserInventoryDto>> getUserInventory(@PathVariable int userId) {
        inventoryService.checkAndAddNewItems(Long.valueOf(userId));
        List<UserInventory> inventory = inventoryService.getUserInventory(Long.valueOf(userId));

        // Convert to DTO
        List<UserInventoryDto> response = inventory.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private UserInventoryDto convertToDto(UserInventory userInventory) {
        UserInventoryDto dto = new UserInventoryDto();
        dto.setId(userInventory.getId());
        dto.setQuantity(userInventory.getQuantity());
        dto.setEquipped(userInventory.isEquipped());

        if (userInventory.getItem() != null) {
            UserInventoryDto.ItemDto itemDto = new UserInventoryDto.ItemDto();
            itemDto.setId(userInventory.getItem().getId());
            itemDto.setName(userInventory.getItem().getName());
            itemDto.setDescription(userInventory.getItem().getDescription());
            itemDto.setImagePath(userInventory.getItem().getImagePath());
            itemDto.setUnlockXp(userInventory.getItem().getUnlockXp());
            itemDto.setConsumable(userInventory.getItem().isConsumable());
            itemDto.setEffectValue(userInventory.getItem().getEffectValue());
            dto.setItem(itemDto);
        }

        return dto;
    }

    @PostMapping("/use/{userId}/{itemId}")
    public ResponseEntity<?> useItem(@PathVariable int userId, @PathVariable int itemId) {
        try {
            inventoryService.useItem(userId, itemId); // No need to call intValue() on userId
            return ResponseEntity.ok(Map.of("success", true, "message", "Item used successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/boosts/{userId}")
    public ResponseEntity<List<UserBoostDto>> getActiveBoosts(@PathVariable int userId) {
        List<UserBoost> boosts = inventoryService.getActiveBoosts(Long.valueOf(userId));

        List<UserBoostDto> response = boosts.stream()
                .map(boost -> {
                    UserBoostDto dto = new UserBoostDto();
                    dto.setId(boost.getId());
                    dto.setBoostType(boost.getBoostType());
                    dto.setBoostValue(boost.getBoostValue());
                    dto.setExpirationTime(boost.getExpirationTime());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}