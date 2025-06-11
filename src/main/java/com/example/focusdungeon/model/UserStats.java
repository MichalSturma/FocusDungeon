package com.example.focusdungeon.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.util.Map;

@Entity
@Getter
@Setter
@Table(name = "user_stats")
public class UserStats {

    @Id
    private int id; // ID je současně FK na tabulku users

    @OneToOne
    @MapsId  // ID je převzato z User
    @JoinColumn(name = "user_id")  // FK propojení s users.id
    private User user;

    private int xp;
    private long totalFocusTime;
    private int longestStreak;
}

