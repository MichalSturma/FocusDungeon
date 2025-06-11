package com.example.focusdungeon.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInventoryDto {
    private int id;
    private int quantity;
    private boolean equipped;
    private ItemDto item;

    @Getter
    @Setter
    public static class ItemDto {
        private int id;
        private String name;
        private String description;
        private String imagePath;
        private int unlockXp;
        private boolean consumable;
        private int effectValue;
    }
}