package com.example.focusdungeon.controller;

import com.example.focusdungeon.service.UserStatsService;
import com.example.focusdungeon.model.UserStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LeaderboardController {

    @Autowired
    private UserStatsService userStatsService;

    @GetMapping("/leaderboard")
    public List<UserStats> getLeaderboard() {
        return userStatsService.getAllUsersSortedByXp();
    }
}