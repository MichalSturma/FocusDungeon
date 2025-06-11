// UserBoost.java
package com.example.focusdungeon.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "user_boosts")
public class UserBoost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String boostType; // "XP_BOOST", etc.
    private double boostValue; // 0.5 for 50% boost
    private LocalDateTime expirationTime;
}