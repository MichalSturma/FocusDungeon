import { playSound } from './music.js';
import { resetTimer } from './timerLogic.js';
import { updateUserStats } from './utils.js';

// Constants for level progression (aligned with profile.js)
const BASE_XP = 100;
const GROWTH_RATE = 1.2;

// Mock user data (would be stored/loaded in a real app)
export let userData = {
    xp: 0,
    level: 1,
    streak: 0,
    totalFocusTime: 0,
    lastCompletionDate: null
};

export function resetUserStats() {
    console.log("🔄 Resetování uživatelských statistik...");

    Object.assign(userData, {
        xp: 0,
        level: 1,
        streak: 0,
        totalFocusTime: 0,
        lastCompletionDate: null
    });

    saveUserData();
    console.log("✅ Uživatelské statistiky resetovány.");
}

// Calculate level from XP (aligned with profile.js)
function calculateLevelFromXP(xp) {
    if (xp < BASE_XP) return 1;

    let level = 1;
    let xpNeeded = BASE_XP;
    let totalXpNeeded = BASE_XP;

    while (xp >= totalXpNeeded) {
        level++;
        xpNeeded = Math.floor(xpNeeded * GROWTH_RATE);
        totalXpNeeded += xpNeeded;
    }

    return level;
}

// Calculate total XP needed for a specific level (aligned with profile.js)
function getXPForLevel(level) {
    if (level <= 1) return 0;

    let totalXp = 0;
    let xpNeeded = BASE_XP;

    for (let i = 2; i <= level; i++) {
        totalXp += xpNeeded;
        xpNeeded = Math.floor(xpNeeded * GROWTH_RATE);
    }

    return totalXp;
}

// Get level info (xp for current level, next level, etc.)
// Get level info (xp for current level, next level, etc.)
export function getLevelInfo(xp) {
    const level = calculateLevelFromXP(xp);
    const xpForCurrentLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);

    return {
        level,
        currentXP: xp,  // The user's actual current XP
        xpForCurrentLevel,  // Total XP needed to reach current level
        xpForNextLevel,    // Total XP needed to reach next level
        xpNeededForNextLevel: xpForNextLevel - xpForCurrentLevel, // XP between current and next level
        xpToNextLevel: xpForNextLevel - xp  // XP remaining to next level
    };
}

// Show the celebration modal with XP reward
export function showCelebrationModal(xpEarned, timeInSeconds, completionPercent, isComplete) {
    const adjustedXP = Math.floor(xpEarned * (completionPercent / 100));

    // Update user data first
    userData.xp += adjustedXP;
    const currentXP = userData.xp;

    // Get level info with updated XP
    const levelInfo = getLevelInfo(currentXP);
    userData.level = levelInfo.level;

    document.getElementById('xp-to-next-level').textContent =
        `${levelInfo.currentXP}/${levelInfo.xpNeededForNextLevel}`;

    // Update UI elements - use the correct XP values
    document.getElementById('xp-earned').textContent = adjustedXP;
    document.getElementById('current-level').textContent = userData.level;
    document.getElementById('next-level').textContent = userData.level + 1;
    document.getElementById('focus-streak').textContent = userData.streak;
    document.getElementById('current-xp').textContent = currentXP;

    // Fix the XP display - use xpForNextLevel from levelInfo
    document.getElementById('xp-to-next-level').textContent =
        `${currentXP}/${levelInfo.xpForNextLevel}`;

    const levelProgress = ((userData.xp - levelInfo.xpForCurrentLevel) /
        (levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel)) * 100;
    // Set celebration message
    const messageElement = document.getElementById('celebration-message');
    if (isComplete) {
        messageElement.textContent = "Congratulations, brave adventurer! You've completed your focus quest!";
    } else {
        if (completionPercent < 30) {
            messageElement.textContent = "Every journey begins with small steps. You'll conquer more next time!";
        } else if (completionPercent < 70) {
            messageElement.textContent = "Good effort! You've made progress on your quest. Keep going!";
        } else {
            messageElement.textContent = "Impressive focus! You were so close to completing the quest!";
        }
    }

    // Show modal
    document.getElementById('celebration-modal').classList.remove('hidden');

    // Play sound
    if (isComplete) {
        playSound('sounds/victory.mp3');
    } else {
        playSound('sounds/partial-complete.mp3');
    }

    // Animate progress bar
    setTimeout(() => {
        document.getElementById('level-progress-bar').style.width = `${levelProgress}%`;
    }, 300);
}

// Hide the celebration modal
export function hideCelebrationModal() {
    document.getElementById('celebration-modal').classList.add('hidden');
    // Reset the timer UI completely after hiding the modal
    resetTimer(false);
}

// Update user data with new XP
function updateUserData(xpEarned) {
    // Add XP
    userData.xp += xpEarned;

    // Check for level up
    while (userData.xp >= userData.xpToNextLevel) {
        userData.level++;
        userData.xpToNextLevel = calculateXPForNextLevel(userData.level);
    }

    // Update streak based on date (check if it's a new day)
    updateStreak();

    // Save user data (in a real app)
    saveUserData();
}


// Check if it's a new day to update streak
function updateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const todayStr = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    if (!userData.lastCompletionDate) {
        // First time completing a focus session
        userData.lastCompletionDate = todayStr;
        userData.streak = 1;
    } else if (userData.lastCompletionDate !== todayStr) {
        // Check if this is a consecutive day
        const lastDate = new Date(userData.lastCompletionDate + 'T00:00:00');
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            // Consecutive day, increase streak
            userData.streak++;
        } else if (lastDate < yesterday) {
            // More than one day gap, reset streak
            userData.streak = 1;
        }
        // Update last completion date
        userData.lastCompletionDate = todayStr;
    }
    // If it's the same day, do nothing (streak remains the same)
}

// Calculate XP required for the next level (exponential growth with higher base and steeper curve)
function calculateXPForNextLevel(level) {
    // Increased base XP from 200 to 500
    // Increased growth factor from 1.5 to 1.8 for steeper progression
    return Math.floor(500 * Math.pow(1.8, level - 1));
}

// Get minimum XP for current level
export function getLevelMinXP(level) {
    if (level <= 1) return 0;
    return Math.floor(500 * Math.pow(1.8, level - 2));
}

// Save user data (mock implementation)
function saveUserData() {
    // In a real app, this would save to localStorage or a server
    console.log("Saving user data:", userData);
    localStorage.setItem('focusDungeonUserData', JSON.stringify(userData));
}

// Load user data on module initialization
function loadUserData() {
    try {
        const savedData = localStorage.getItem('focusDungeonUserData');
        if (savedData) {
            userData = JSON.parse(savedData);
            
            // Make sure the level progression formula is applied consistently
            // This ensures any changes to the formula affect existing users properly
            userData.xpToNextLevel = calculateXPForNextLevel(userData.level);
        }
    } catch (e) {
        console.error("Error loading user data:", e);
    }
}

// Setup event listeners
export function setupCelebrationModalListeners() {
    // Continue button
    document.getElementById('continue-button').addEventListener('click', () => {
        playSound('sounds/button.mp3');
        hideCelebrationModal();
    });
    
    // Also close on overlay click
    document.querySelector('#celebration-modal .modal-overlay').addEventListener('click', () => {
        hideCelebrationModal();
    });
    
    // Load user data on initialization
    loadUserData();
}