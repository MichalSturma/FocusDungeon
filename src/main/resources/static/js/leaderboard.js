// leaderboard.js
import { fetchUserIdAndStore, checkIfUserIsLoggedIn } from './utils.js';

const BASE_XP = 100;
const GROWTH_RATE = 1.2;

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

// Fetch leaderboard data from your existing endpoint
export async function fetchLeaderboardData(type = 'world') {
    try {
        const response = await fetch(`/leaderboard${type === 'friends' ? '?friends=true' : ''}`);

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        return data.map(userStats => {
            const xp = userStats.xp || 0;
            return {
                username: userStats.user?.username || 'Unknown',
                xp: xp,
                level: calculateLevelFromXP(xp),
                // Use currentStreak instead of streak if available
                longestStreak: userStats.currentStreak || userStats.streak || 0
            };
        }).filter(user => user.xp > 0);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

// Render leaderboard data (without header row)
export function renderLeaderboard(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p class="no-data">No data available</p>';
        return;
    }

    // Sort by XP descending (highest first)
    data.sort((a, b) => b.xp - a.xx);

    data.forEach((user, index) => {
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        const row = document.createElement('div');
        row.className = `leaderboard-row ${rankClass}`;

        row.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="username">${user.username}</div>
            <div class="level">Lvl ${user.level}</div>
            <div class="xp">${user.xp.toLocaleString()} XP</div>
            <div class="streak">${user.longestStreak} days</div>
        `;

        container.appendChild(row);
    });
}

// Switch between world and friends leaderboards
export function switchLeaderboardTab(tab) {
    // Hide friends tab if not logged in
    const friendsTab = document.getElementById('friendsTab');
    if (friendsTab) {
        friendsTab.style.display = checkIfUserIsLoggedIn() ? '' : 'none';
    }

    document.querySelectorAll('.leaderboard-tab').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.leaderboard-content').forEach(content => {
        content.classList.add('hidden');
    });

    document.getElementById(`${tab}Tab`).classList.add('active');
    document.getElementById(`${tab}Leaderboard`).classList.remove('hidden');
}

// Initialize leaderboard with auto-refresh
let refreshInterval;
export async function initLeaderboard() {
    try {
        // Hide friends tab if not logged in
        const isLoggedIn = checkIfUserIsLoggedIn();
        document.getElementById('friendsTab').style.display = isLoggedIn ? '' : 'none';

        if (isLoggedIn) {
            await fetchUserIdAndStore();
        }

        // Initial load
        await refreshLeaderboard();

        // Set up auto-refresh every 30 seconds
        clearInterval(refreshInterval);
        refreshInterval = setInterval(refreshLeaderboard, 30000);

        // Tab switching
        document.getElementById('worldTab').addEventListener('click', async () => {
            switchLeaderboardTab('world');
            await refreshLeaderboard();
        });

        document.getElementById('friendsTab').addEventListener('click', async () => {
            switchLeaderboardTab('friends');
            await refreshLeaderboard();
        });

        // Set active tab
        const hash = window.location.hash;
        if (hash === '#friends' && isLoggedIn) {
            switchLeaderboardTab('friends');
        } else {
            switchLeaderboardTab('world');
        }

    } catch (error) {
        console.error('Leaderboard initialization error:', error);
    }
}

// Refresh leaderboard data
async function refreshLeaderboard() {
    console.log('Refreshing leaderboard data...');
    try {
        const activeTab = document.querySelector('.leaderboard-tab.active').id.replace('Tab', '');
        const data = await fetchLeaderboardData(activeTab);
        renderLeaderboard(data, `${activeTab}LeaderboardContent`);
    } catch (error) {
        console.error('Error refreshing leaderboard:', error);
    }
}

// Setup leaderboard modal
export function setupLeaderboardModal() {
    const leaderboardLink = document.querySelector('a[href="leaderboard.html"]');
    if (leaderboardLink) {
        leaderboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('leaderboard-modal').classList.remove('hidden');
            initLeaderboard();
        });
    }

    document.querySelector('#leaderboard-modal .close').addEventListener('click', () => {
        document.getElementById('leaderboard-modal').classList.add('hidden');
        clearInterval(refreshInterval);
    });
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(refreshInterval);
});