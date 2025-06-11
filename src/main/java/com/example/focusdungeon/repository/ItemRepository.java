// ItemRepository.java
package com.example.focusdungeon.repository;

import com.example.focusdungeon.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByUnlockXpLessThanEqual(int xp);
}