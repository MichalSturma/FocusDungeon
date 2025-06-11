// userStats.js - Complete updated version with all stats display

// Import required modules
import { playSound } from './music.js';
import { userData, getLevelInfo } from './celebrationModal.js';

// Stats variables
let userStats = {
    totalFocusTime: 0, // in seconds
    sessionsCompleted: 0,
    longestStreak: 0,
    dailyGoal: 10, // Default daily goal in minutes
    dailyProgress: 0, // Today's focus minutes
    lastActiveDate: null,
    achievements: [],
    dailyGoalsMet: 0 // Track how many times daily goal was met
};

// Achievement definitions
const achievements = [
    { id: 'first_focus', name: 'First Focus', description: 'Complete your first focus session', icon: '🏆', earned: false },
    { id: 'streak_3', name: 'Focus Warrior', description: 'Maintain a 3-day focus streak', icon: '🔥', earned: false },
    { id: 'streak_7', name: 'Focus Master', description: 'Maintain a 7-day focus streak', icon: '⚡', earned: false },
    { id: 'hour_1', name: 'Hour Power', description: 'Complete a total of 1 hour of focus time', icon: '⏱️', earned: false },
    { id: 'sessions_10', name: 'Dedication', description: 'Complete 10 focus sessions', icon: '🧠', earned: false },
    { id: 'daily_goal', name: 'Goal Crusher', description: 'Meet your daily focus goal 5 times', icon: '🎯', earned: false }
];

// Initialize stats
export function initializeStats() {
    loadStats();
    updateDailyProgress();
    setupStatsPanelListeners();
}

// Record a completed session
// In userStats.js, modify the recordSession function:
export function recordSession(durationSeconds, isComplete) {
    // Update total focus time
    userStats.totalFocusTime += durationSeconds;

    // Update sessions completed if fully completed
    if (isComplete) {
        userStats.sessionsCompleted++;
    }

    // Update daily progress
    const minutesCompleted = Math.floor(durationSeconds / 60);
    userStats.dailyProgress += minutesCompleted;

    // Streak calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    if (!userStats.lastActiveDate) {
        // First session ever
        userStats.currentStreak = 1;
        userStats.lastActiveDate = todayStr;
    } else if (userStats.lastActiveDate !== todayStr) {
        // Check if consecutive day
        const lastDate = new Date(userStats.lastActiveDate);
        lastDate.setDate(lastDate.getDate() + 1);
        const nextDayStr = lastDate.toISOString().split('T')[0];

        if (todayStr === nextDayStr) {
            // Consecutive day
            userStats.currentStreak = (userStats.currentStreak || 0) + 1;
        } else {
            // Broken streak
            userStats.currentStreak = 1;
        }
        userStats.lastActiveDate = todayStr;
    }

    // Update longest streak if needed
    if (userData.streak > userStats.longestStreak) {
        userStats.longestStreak = userData.streak;
    }

    // Rest of your existing code...
    checkAchievements();
    saveStats();
    updateStatsPanel();
    checkDailyGoal();

    return userStats;
}

// Update streak data
export function updateStreak(currentStreak) {
    // Update longest streak if current streak is longer
    if (currentStreak > userStats.longestStreak) {
        userStats.longestStreak = currentStreak;
    }

    // Check for streak achievements
    checkAchievements();

    // Save stats
    saveStats();
}

// Reset daily progress if it's a new day
function updateDailyProgress() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const todayStr = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    if (!userStats.lastActiveDate || userStats.lastActiveDate !== todayStr) {
        // It's a new day, reset daily progress
        userStats.dailyProgress = 0;
        userStats.lastActiveDate = todayStr;
        saveStats();
    }
}

// Modify the checkAchievements function to show notifications
function checkAchievements() {
    let newAchievements = [];

    // First focus session
    if (!hasAchievement('first_focus') && userStats.sessionsCompleted >= 1) {
        newAchievements.push(unlockAchievement('first_focus'));
    }

    // Streak achievements
    if (!hasAchievement('streak_3') && userStats.longestStreak >= 3) {
        newAchievements.push(unlockAchievement('streak_3'));
    }

    if (!hasAchievement('streak_7') && userStats.longestStreak >= 7) {
        newAchievements.push(unlockAchievement('streak_7'));
    }

    // Total time achievement
    if (!hasAchievement('hour_1') && userStats.totalFocusTime >= 3600) {
        newAchievements.push(unlockAchievement('hour_1'));
    }

    // Sessions completed achievement
    if (!hasAchievement('sessions_10') && userStats.sessionsCompleted >= 10) {
        newAchievements.push(unlockAchievement('sessions_10'));
    }

    // Daily goal achievement
    if (!hasAchievement('daily_goal') && userStats.dailyGoalsMet >= 5) {
        newAchievements.push(unlockAchievement('daily_goal'));
    }

    // Show achievement notification if any new achievements
    if (newAchievements.length > 0) {
        showAchievementNotification(newAchievements);
    }
}

// Check if user has a specific achievement
function hasAchievement(achievementId) {
    return userStats.achievements.includes(achievementId);
}

// Unlock a new achievement
function unlockAchievement(achievementId) {
    if (!hasAchievement(achievementId)) {
        userStats.achievements.push(achievementId);
        saveStats();
    }

    // Find achievement details
    return achievements.find(a => a.id === achievementId);
}

// Show achievement notification
function showAchievementNotification(newAchievements) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';

    const achievementInfo = newAchievements[0]; // Show first new achievement

    notification.innerHTML = `
        <div class="achievement-icon">${achievementInfo.icon}</div>
        <div class="achievement-text">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievementInfo.name}</div>
            <div class="achievement-desc">${achievementInfo.description}</div>
        </div>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Play achievement sound
    playSound('sounds/achievement.mp3');

    // Remove after animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();

            // Show next achievement if there are more
            if (newAchievements.length > 1) {
                showAchievementNotification(newAchievements.slice(1));
            }
        }, 500);
    }, 4000);
}

// Set daily goal
export function setDailyGoal(minutes) {
    userStats.dailyGoal = minutes;
    saveStats();
}

// Get progress toward daily goal as percentage
export function getDailyGoalProgress() {
    return Math.min(100, Math.round((userStats.dailyProgress / userStats.dailyGoal) * 100));
}

// Get user stats
export function getStats() {
    return userStats;
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('focusDungeonStats', JSON.stringify(userStats));
}

// Load stats from localStorage
function loadStats() {
    try {
        // Try to use mock stats first
        let savedStats = localStorage.getItem('focusDungeonStats');

        // But if that's empty, fallback to the real backend data
        if (!savedStats) {
            savedStats = localStorage.getItem('userStats');
        }

        if (savedStats) {
            const parsedStats = JSON.parse(savedStats);
            userStats = {
                ...userStats,
                ...parsedStats
            };
        }
    } catch (e) {
        console.error("Error loading user stats:", e);
    }
}


// Function to show the stats panel
export function showStatsPanel() {
    document.getElementById('stats-panel').classList.add('open');
    updateStatsPanel(); // Update the panel content
}

// Function to hide the stats panel
export function hideStatsPanel() {
    document.getElementById('stats-panel').classList.remove('open');
}

function updateStatsPanel() {
    // Get stats from all possible sources
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const focusStats = JSON.parse(localStorage.getItem('focusDungeonStats') || '{}');
    const dungeonUserData = JSON.parse(localStorage.getItem('focusDungeonUserData') || '{}');

    // Consolidate stats with priority to celebration modal's data
    const stats = {
        totalFocusTime: dungeonUserData.totalFocusTime ||
            focusStats.totalFocusTime ||
            userStats.totalFocusTime ||
            0,
        sessionsCompleted: dungeonUserData.sessionsCompleted ||
            focusStats.sessionsCompleted ||
            userStats.sessionsCompleted ||
            0,
        dailyProgress: userStats.dailyProgress || 0,
        dailyGoal: userStats.dailyGoal || 25 // Default 25 minute goal
    };

    // Get current XP from the most reliable source
    const currentXP = dungeonUserData.xp || userStats.xp || 0;
    const levelInfo = getLevelInfo(currentXP);

    // Debug log to verify values
    console.log('Level Progress Debug:', {
        currentXP,
        level: levelInfo.level,
        xpForCurrentLevel: levelInfo.xpForCurrentLevel,
        xpForNextLevel: levelInfo.xpForNextLevel,
        xpInCurrentLevel: currentXP - levelInfo.xpForCurrentLevel,
        levelRange: levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel,
        progressPercent: ((currentXP - levelInfo.xpForCurrentLevel) /
            (levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel)) * 100
    });

    // Update all stat displays
    updateStatDisplay('total-focus-time', formatTime(stats.totalFocusTime));
    updateStatDisplay('sessions-completed', stats.sessionsCompleted);
    updateStatDisplay('longest-streak', `${dungeonUserData.streak || userStats.streak || 0} days`);

    // Update daily goal progress
    const progressPercent = getDailyGoalProgress();
    updateStatDisplay('daily-goal-progress',
        `${stats.dailyProgress}/${stats.dailyGoal} min (${progressPercent}%)`);
    updateStatDisplay('daily-goal-percent', `${progressPercent}%`);

    // Update progress bars
    updateProgressBar('daily-progress-bar', progressPercent);

    // Calculate level progress
    const levelProgress = ((currentXP - levelInfo.xpForCurrentLevel) /
        (levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel)) * 100;
    updateProgressBar('level-progress-bar-stats', Math.min(100, levelProgress));

    // Update level displays
    updateStatDisplay('current-level-stats', levelInfo.level);
    updateStatDisplay('next-level-stats', levelInfo.level + 1);

    // Update achievements display
    updateAchievementsDisplay();
}

// Helper function to update a stat display
function updateStatDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Helper function to update a progress bar
function updateProgressBar(elementId, percent) {
    const element = document.getElementById(elementId);
    if (element) {
        // Ensure we don't exceed 100% or go below 0%
        const clampedPercent = Math.min(100, Math.max(0, percent));
        element.style.width = `${clampedPercent}%`;

        // Debug log
        console.log(`Updating ${elementId} to ${clampedPercent}%`);
    } else {
        console.error(`Progress bar element not found: ${elementId}`);
    }
}

// Format time in seconds to hh:mm:ss
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update achievements display
function updateAchievementsDisplay() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = '';

    if (userStats.achievements.length === 0) {
        container.innerHTML = '<div class="no-achievements">No achievements earned yet!</div>';
        return;
    }

    userStats.achievements.forEach(achievementId => {
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-badge';
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
            container.appendChild(achievementElement);
        }
    });
}

// Add event listeners for the stats panel
export function setupStatsPanelListeners() {
    // Open stats panel
    document.getElementById('stats-button').addEventListener('click', () => {
        playSound('sounds/button.mp3');
        showStatsPanel();
    });

    // Close stats panel
    document.getElementById('stats-close').addEventListener('click', () => {
        playSound('sounds/button.mp3');
        hideStatsPanel();
    });
}

// Function to check daily goal progress
export function checkDailyGoal() {
    const progressPercent = getDailyGoalProgress();
    if (progressPercent >= 100) {
        // Only count as met if it's the first time today
        const today = new Date().toISOString().split('T')[0];
        if (userStats.lastActiveDate === today && !userStats.dailyGoalMetToday) {
            userStats.dailyGoalsMet++;
            userStats.dailyGoalMetToday = true;
            saveStats();

            showAchievementNotification([{
                icon: '🎯',
                name: 'Daily Goal Met!',
                description: 'You completed your focus goal for today!'
            }]);
        }
    }
}