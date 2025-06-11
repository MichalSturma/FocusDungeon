// UserBoostDto.java
package com.example.focusdungeon.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserBoostDto {
    private int id;
    private String boostType;
    private double boostValue;
    private LocalDateTime expirationTime;
}