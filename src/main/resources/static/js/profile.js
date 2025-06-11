// profile.js
import { openModal, closeModal, showToast } from './auth.js';
import { fetchUserStats, fetchFriendsList, sendFriendRequest, respondToFriendRequest, fetchFriendRequests } from './utils.js';

/*
 * LEVEL PROGRESSION SYSTEM
 *
 * The leveling system uses a progressive XP requirement where each level requires
 * more XP than the previous one. The formula follows these rules:
 *
 * 1. BASE_XP = 100 (XP needed to reach level 2 from level 1)
 * 2. GROWTH_RATE = 1.2 (Each subsequent level requires 20% more XP than the previous)
 *
 * Level Calculation:
 * - Level 1: 0 XP
 * - Level 2: 100 XP (BASE_XP)
 * - Level 3: 220 XP (100 + 120)
 * - Level 4: 364 XP (100 + 120 + 144)
 * - Level 5: 530 XP (100 + 120 + 144 + 166)
 * - And so on...
 *
 * Mathematical Formulas:
 *
 * 1. Calculate level from XP:
 *    - Start with BASE_XP (100)
 *    - While XP >= total accumulated XP for next level:
 *      - Increase level
 *      - Add XP needed for next level (previous * GROWTH_RATE)
 *
 * 2. Calculate total XP needed for a specific level:
 *    - For level N, sum XP requirements from level 2 to N:
 *      Total XP = Σ (BASE_XP * GROWTH_RATE^(n-2)) from n=2 to N
 *
 * Example Progression:
 * Level | XP Needed (for level) | Total XP Needed
 * ------|-----------------------|----------------
 *   1   |          0            |        0
 *   2   |         100           |       100
 *   3   |         120           |       220
 *   4   |         144           |       364
 *   5   |         173           |       537
 *   6   |         208           |       745
 *   7   |         250           |       995
 *   8   |         300           |      1295
 *   9   |         360           |      1655
 *  10   |         432           |      2087
 *
 * Note: All XP values are rounded to integers for display purposes.
 */

// DOM Elements
let avatarModal;
let avatarGrid;
let profileAvatar;
let avatarEditOverlay;
let profileModal;
let profileUsername;
let levelBadge;
let currentLevel;
let currentXP;
let nextLevelXP;
let xpProgress;
let totalSessions;
let totalTime;
let currentStreak;
let longestStreak;
let joinDate;
let bioContent;
let bioEdit;
let editBioBtn;
let saveBioBtn;
let cancelBioBtn;
let addFriendBtn;
let friendRequestsBtn;
let friendsContainer;
let noFriendsPlaceholder;
let requestsBadge;
let inventoryItems = [];
let activeBoosts = [];

// State
let friends = [];
let pendingRequests = [];

// XP and Level Calculations
// XP and Level Calculations (DO NOT CHANGE THESE)
function calculateLevelFromXP(xp) {
    const BASE_XP = 100;
    const GROWTH_RATE = 1.2;

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
    const BASE_XP = 100;
    const GROWTH_RATE = 1.2;

    if (level <= 1) return 0;

    let totalXp = 0;
    let xpNeeded = BASE_XP;

    for (let i = 2; i <= level; i++) {
        totalXp += xpNeeded;
        xpNeeded = Math.floor(xpNeeded * GROWTH_RATE);
    }

    return totalXp;
}

function getLevelInfo(xp) {
    const level = calculateLevelFromXP(xp);
    const xpForCurrentLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);

    return {
        level,
        xp,
        xpForCurrentLevel,
        xpForNextLevel,
        xpToNextLevel: xpForNextLevel - xp
    };
}

// Initialize profile modal elements
export function initializeProfileModal() {
    // Basic elements
    profileAvatar = document.getElementById('profileAvatar');
    avatarEditOverlay = document.querySelector('.avatar-edit-overlay');
    avatarModal = document.getElementById('avatarModal');
    avatarGrid = document.getElementById('avatarGrid');
    profileModal = document.getElementById('profileModal');
    profileUsername = document.getElementById('profileUsername');
    levelBadge = document.getElementById('levelBadge');
    currentLevel = document.getElementById('currentLevel');
    currentXP = document.getElementById('currentXP');
    nextLevelXP = document.getElementById('nextLevelXP');
    xpProgress = document.getElementById('xpProgress');
    totalSessions = document.getElementById('totalSessions');
    totalTime = document.getElementById('totalTime');
    currentStreak = document.getElementById('currentStreak');
    longestStreak = document.getElementById('longestStreak');
    joinDate = document.getElementById('joinDate');

    initializeAvatar();

    setupInventoryFunctionality();

    // Bio elements
    bioContent = document.getElementById('bioContent');
    bioEdit = document.getElementById('bioEdit');
    editBioBtn = document.getElementById('editBioBtn');
    saveBioBtn = document.getElementById('saveBioBtn');
    cancelBioBtn = document.getElementById('cancelBioBtn');

    // Friends elements
    addFriendBtn = document.getElementById('addFriendBtn');
    friendRequestsBtn = document.getElementById('friendRequestsBtn');
    friendsContainer = document.getElementById('friendsContainer');
    noFriendsPlaceholder = document.querySelector('.no-friends');
    requestsBadge = friendRequestsBtn.querySelector('.badge');

    // Close button
    const closeButton = profileModal.querySelector('.close');
    closeButton.addEventListener('click', () => closeModal('profile'));

    // Setup avatar edit functionality
    setupAvatarEditing();

    // Tab switching
    setupTabNavigation();

    // Bio editing
    setupBioEditing();

    // Friends functionality
    setupFriendsFunctionality();
}

function initializeAvatar() {
    // Try multiple storage keys for backward compatibility
    const avatarPath = localStorage.getItem('userAvatarPath') ||
        localStorage.getItem('avatarPath') ||
        'images/avatars/avatar1.jpg'; // Default avatar path

    if (avatarPath) {
        // Add cache busting to prevent stale images
        profileAvatar.src = `${avatarPath}?${Date.now()}`;

        // Fallback in case image fails to load
        profileAvatar.onerror = () => {
            profileAvatar.src = 'images/avatars/avatar1.jpg';
            localStorage.setItem('userAvatarPath', 'images/avatars/avatar1.jpg');
        };
    }
}

const profilePictures = [
    { src: 'images/avatars/avatar1.jpg', requiredXP: 0 },   // Default profile picture
    { src: 'images/avatars/avatar2.png', requiredXP: 500 },
    { src: 'images/avatars/avatar3.jpg', requiredXP: 1000 },
    { src: 'images/avatars/avatar4.png', requiredXP: 2000 },
    { src: 'images/avatars/avatar5.png', requiredXP: 3000 },
    { src: 'images/avatars/avatar6.jpg', requiredXP: 5000 },
];

function setupAvatarEditing() {
    const avatarContainer = document.querySelector('.avatar-container');
    avatarContainer.addEventListener('click', openAvatarModal);

    const closeButton = avatarModal.querySelector('.close');
    closeButton.addEventListener('click', () => closeModal('avatar'));
}

async function openAvatarModal() {
    try {
        const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
        const currentXP = userStats.xp || 0;

        renderProfilePictures(currentXP);
        openModal('avatar');
    } catch (error) {
        console.error('Error opening avatar modal:', error);
        showToast('Failed to load avatar options');
    }
}

function renderActiveBoosts() {
    const boostsContainer = document.getElementById('activeBoostsContainer');
    if (!boostsContainer) return;

    boostsContainer.innerHTML = '';

    if (activeBoosts.length === 0) {
        boostsContainer.innerHTML = '<div class="no-boosts">No active boosts</div>';
        return;
    }

    activeBoosts.forEach(boost => {
        const boostElement = document.createElement('div');
        boostElement.className = 'active-boost';

        const expiration = new Date(boost.expirationTime);
        const now = new Date();
        const remainingHours = Math.max(0, Math.floor((expiration - now) / (1000 * 60 * 60)));

        boostElement.innerHTML = `
            <div class="boost-icon">⚡</div>
            <div class="boost-info">
                <div class="boost-name">${boost.boostType.replace('_', ' ')}</div>
                <div class="boost-value">+${(boost.boostValue * 100).toFixed(0)}%</div>
            </div>
            <div class="boost-time">${remainingHours}h remaining</div>
        `;

        boostsContainer.appendChild(boostElement);
    });
}


function renderProfilePictures(currentXP) {
    avatarGrid.innerHTML = '';

    profilePictures.forEach(picture => {
        const pictureElement = document.createElement('div');
        pictureElement.className = 'avatar-option-container';
        pictureElement.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${picture.src}" alt="Avatar" class="avatar-option">
                ${currentXP < picture.requiredXP ? `
                <div class="lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <div class="xp-requirement">${picture.requiredXP} XP</div>
                </div>
                ` : ''}
            </div>
        `;

        if (currentXP >= picture.requiredXP) {
            pictureElement.addEventListener('click', () => selectAvatar(picture.src));
        }

        avatarGrid.appendChild(pictureElement);
    });
}

async function selectAvatar(avatarPath) {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // First verify the image exists
        await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => reject(new Error('Image failed to load'));
            img.src = avatarPath;
        });

        // Update the avatar with cache busting
        const timestamp = Date.now();
        const cacheBustedPath = `${avatarPath}?${timestamp}`;

        // Update all avatar displays
        document.querySelectorAll('.profile-avatar, #profileAvatar').forEach(avatar => {
            avatar.src = cacheBustedPath;
        });

        // Store the path (without cache busting)
        localStorage.setItem('userAvatarPath', avatarPath);
        localStorage.setItem('avatarLastUpdated', timestamp.toString());

        // Sync with server if available
        if (userId && token) {
            await fetch(`/api/users/${userId}/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ avatarPath })
            });
        }

        closeModal('avatar');
        showToast('Avatar updated successfully!');
    } catch (error) {
        console.error('Error updating avatar:', error);
        showToast('Failed to update avatar: ' + error.message);
        // Revert to default on error
        profileAvatar.src = 'images/avatars/avatar1.jpg';
    }
}

function setupBioEditing() {
    editBioBtn.addEventListener('click', () => {
        bioContent.classList.add('hidden');
        bioEdit.classList.remove('hidden');
        editBioBtn.classList.add('hidden');
        saveBioBtn.classList.remove('hidden');
        cancelBioBtn.classList.remove('hidden');

        bioEdit.value = bioContent.textContent.trim() === "This user hasn't written a bio yet."
            ? ""
            : bioContent.textContent;
        bioEdit.focus();
    });

    saveBioBtn.addEventListener('click', async () => {
        const newBio = bioEdit.value.trim();

        try {
            await saveBioToServer(newBio);
            bioContent.textContent = newBio || "This user hasn't written a bio yet.";
            resetBioEditingUI();
            showToast('Bio updated successfully!');
        } catch (error) {
            console.error('Error saving bio:', error);
            showToast('Failed to update bio. Please try again.');
        }
    });

    cancelBioBtn.addEventListener('click', resetBioEditingUI);
}

function resetBioEditingUI() {
    bioContent.classList.remove('hidden');
    bioEdit.classList.add('hidden');
    editBioBtn.classList.remove('hidden');
    saveBioBtn.classList.add('hidden');
    cancelBioBtn.classList.add('hidden');
}

async function saveBioToServer(bio) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/user/${userId}/bio`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio })
    });

    if (!response.ok) {
        throw new Error('Failed to save bio');
    }

    localStorage.setItem('userBio', bio);
}

function setupFriendsFunctionality() {
    addFriendBtn.addEventListener('click', openAddFriendModal);
    friendRequestsBtn.addEventListener('click', openFriendRequestsModal);
}

async function loadFriendsList() {
    try {
        let friendships = await fetchFriendsList();
        let userId = Number(localStorage.getItem('userId'));
        friends = friendships.map(f => f.user.id === userId ? f.friend : f.user);
        renderFriendsList();
        updateFriendsListUI();
    } catch (error) {
        console.error('Error loading friends list:', error);
        showToast('Failed to load friends list');
    }
}

function renderFriendsList() {
    friendsContainer.innerHTML = '';

    if (friends.length === 0) {
        noFriendsPlaceholder.classList.remove('hidden');
        return;
    }

    friends.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        friendCard.innerHTML = `
            <img src="${friend.avatar || 'images/profile.jpg'}" alt="${friend.username}" class="friend-avatar">
            <h4 class="friend-name">${friend.username}</h4>
            <div class="friend-level">Lvl. ${friend.level || 1}</div>
            <div class="friend-actions">
                <button class="btn-message" data-userid="${friend.id}">MSG</button>
                <button class="btn-remove" data-userid="${friend.id}">REMOVE</button>
            </div>
        `;
        friendsContainer.appendChild(friendCard);
    });

    document.querySelectorAll('.btn-message').forEach(btn => {
        btn.addEventListener('click', () => startChat(btn.dataset.userid));
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFriend(btn.dataset.userid));
    });
}

async function openAddFriendModal() {
    const friendUsername = prompt('Enter your friend\'s username:');
    if (!friendUsername) return;
    try {
        await sendFriendRequest(friendUsername);
        alert('Friend request sent successfully!');
        showToast('Request sent!');

        if (document.querySelector('.profile-tab[data-tab="friends"]').classList.contains('active')) {
            await loadFriendsList();
        }
    } catch (error) {
        alert('Failed to send request: ' + error.message);
        showToast('Failed to send request: ' + error.message);
    }
}

async function removeFriend(friendId) {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/api/friends/${friendId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove friend');
        }

        await loadFriendsList();
        showToast('Friend removed successfully');
    } catch (error) {
        console.error('Error removing friend:', error);
        showToast('Failed to remove friend');
    }
}

function startChat(userId) {
    showToast(`Opening chat with user ${userId}`);
}

function updateFriendsListUI() {
    noFriendsPlaceholder.classList.toggle('hidden', friends.length > 0);
}

function updateRequestsBadge() {
    requestsBadge.textContent = pendingRequests.length;
    requestsBadge.style.display = pendingRequests.length > 0 ? 'inline-block' : 'none';
}

// In profile.js, modify the openProfileModal function:
export async function openProfileModal() {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            throw new Error('User ID or token is missing from localStorage');
        }

        await Promise.all([
            fetchUserStats(),
            loadFriendsList(),
            checkPendingRequests(),
            loadInventory()
        ]);

        const response = await fetch(`http://localhost:8080/api/user/${userId}/bio`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bio');
        }

        const data = await response.json();
        const bio = data.bio || "This user hasn't written a bio yet.";

        // Get stats from all possible sources
        const userStats = JSON.parse(localStorage.getItem('userStats') || {});
        const focusStats = JSON.parse(localStorage.getItem('focusDungeonStats') || '{}');
        const dungeonUserData = JSON.parse(localStorage.getItem('focusDungeonUserData') || '{}');

        // Use XP from userStats (your original source)
        const currentXP = userStats.xp || 0;
        const currentXPElement = document.getElementById('currentXP');
        const levelInfo = getLevelInfo(currentXP);

        // Get other stats from focusStats if available (use nullish coalescing)
        const sessions = focusStats.sessionsCompleted ?? userStats.sessionsCompleted ?? 0;
        const totalFocusSeconds = dungeonUserData.totalFocusTime ||
            focusStats.totalFocusTime ||
            userStats.totalFocusTime ||
            0;
        const currentStreakValue = dungeonUserData.streak ||
            focusStats.currentStreak ||
            userStats.currentStreak ||
            0;
        const longestStreakValue = focusStats.longestStreak ||
            userStats.longestStreak ||
            0;

        // Update profile info
        profileUsername.textContent = localStorage.getItem('username');
        joinDate.textContent = localStorage.getItem('joinDate') || new Date().toLocaleDateString();
        bioContent.textContent = bio;

        // Update stats with calculated level info
        currentLevel.textContent = levelInfo.level;
        levelBadge.textContent = levelInfo.level;
        currentXPElement.textContent = currentXP;
        nextLevelXP.textContent = levelInfo.xpForNextLevel;

        // Calculate XP percentage correctly
        const xpPercentage = ((currentXP - levelInfo.xpForCurrentLevel) /
            (levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel)) * 100;
        xpProgress.style.width = `${Math.min(100, xpPercentage)}%`;

        // Update session stats
        totalSessions.textContent = sessions;
        totalTime.textContent = formatTime(totalFocusSeconds);
        currentStreak.textContent = currentStreakValue;
        longestStreak.textContent = longestStreakValue;

        openModal('profile');
    } catch (error) {
        console.error('Error opening profile modal:', error);
        showToast('Failed to load profile data');
    }
}


async function checkPendingRequests() {
    try {
        pendingRequests = await fetchFriendRequests();
        updateRequestsBadge();
    } catch (error) {
        console.error('Error checking friend requests:', error);
    }
}

function calculateXPPercentage(currentXP, nextLevelXP) {
    if (nextLevelXP === 0) return 100;
    return Math.min(100, ((currentXP - getXPForLevel(calculateLevelFromXP(currentXP))) / (nextLevelXP - getXPForLevel(calculateLevelFromXP(currentXP))) * 100));
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
        return `${minutes}m${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
}

async function openFriendRequestsModal() {
    try {
        pendingRequests = await fetchFriendRequests();
        renderFriendRequests();
        openModal('friendRequests');

        const friendRequestsModal = document.getElementById('friendRequestsModal');
        const closeButton = friendRequestsModal.querySelector('.close');
        closeButton.addEventListener('click', () => closeModal('friendRequests'));
    } catch (error) {
        console.error('Error loading friend requests:', error);
        showToast('Failed to load friend requests');
    }
}

function renderFriendRequests() {
    const container = document.getElementById('requestsContainer');
    container.innerHTML = '';

    if (pendingRequests.length === 0) {
        container.innerHTML = '<div class="no-requests">You have no pending friend requests.</div>';
        return;
    }

    pendingRequests.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';
        requestCard.innerHTML = `
            <div class="request-user">
                <img src="${request.user.avatar || 'images/profile.jpg'}" 
                     alt="${request.user.username}" 
                     class="request-avatar">
                <div class="request-info">
                    <h4>${request.user.username}</h4>
                    <span>Level ${request.user.level || 1}</span>
                </div>
            </div>
            <div class="request-actions">
                <button class="request-btn accept" data-requestid="${request.id}">ACCEPT</button>
                <button class="request-btn decline" data-requestid="${request.id}">DECLINE</button>
            </div>
        `;

        container.appendChild(requestCard);
    });

    document.querySelectorAll('.request-btn.accept').forEach(btn => {
        btn.addEventListener('click', () => handleRequestResponse(btn.dataset.requestid, true));
    });

    document.querySelectorAll('.request-btn.decline').forEach(btn => {
        btn.addEventListener('click', () => handleRequestResponse(btn.dataset.requestid, false));
    });
}

async function handleRequestResponse(requestId, accept) {
    try {
        await respondToFriendRequest(requestId, accept);
        pendingRequests = pendingRequests.filter(req => req.id !== Number(requestId));
        renderFriendRequests();
        updateRequestsBadge();

        if (accept && document.querySelector('.profile-tab[data-tab="friends"]').classList.contains('active')) {
            await loadFriendsList();
        }

        showToast(`Friend request ${accept ? 'accepted' : 'declined'}`);
    } catch (error) {
        console.error('Error handling friend request:', error);
        showToast('Failed to process request');
    }
}

function setupInventoryFunctionality() {
    const inventoryTab = document.querySelector('.profile-tab[data-tab="inventory"]');
    inventoryTab.addEventListener('click', () => {
        loadInventory();
    });
}

async function loadInventory() {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            throw new Error('User not authenticated');
        }

        const [inventoryResponse, boostsResponse] = await Promise.all([
            fetch(`http://localhost:8080/api/inventory/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`http://localhost:8080/api/inventory/boosts/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        if (!inventoryResponse.ok || !boostsResponse.ok) {
            throw new Error(`HTTP error! status: ${inventoryResponse.status}, ${boostsResponse.status}`);
        }

        inventoryItems = await inventoryResponse.json();
        activeBoosts = await boostsResponse.json();

        renderInventory();
        renderActiveBoosts();
    } catch (error) {
        console.error('Failed to load inventory:', error);
        showToast('Failed to load inventory');
        inventoryItems = [];
        activeBoosts = [];
        renderInventory();
    }
}

function renderInventory() {
    const container = document.getElementById('inventoryContainer');
    container.innerHTML = '';

    const validItems = inventoryItems.filter(item => item && item.quantity > 0);

    if (!validItems.length) {
        container.innerHTML = `
            <div class="no-items">
                <img src="images/empty-inventory.jpg" alt="Empty inventory" class="empty-icon">
                <p>No items in inventory</p>
                <small>Complete tasks to earn rewards!</small>
            </div>
        `;
        return;
    }

    validItems.forEach(item => {
        if (!item || !item.item) return;

        const itemCard = document.createElement('div');
        itemCard.className = `item-card ${item.equipped ? 'item-equipped' : ''}`;

        const isActiveBoost = activeBoosts.some(
            boost => boost.boostType === item.item.name.toUpperCase().replace(' ', '_')
        );

        if (isActiveBoost) {
            itemCard.classList.add('item-active-boost');
        }

        updateItemCard(itemCard, item);
        container.appendChild(itemCard);
    });
}

function updateItemCard(card, item) {
    card.innerHTML = `
        <img src="${item.item.imagePath || 'images/items/default.png'}" 
             alt="${item.item.name}" 
             class="item-image"
             onerror="this.src='images/items/default.png'">
        <div class="item-name">${item.item.name}</div>
        ${item.quantity > 1 ? `<div class="item-quantity">${item.quantity}</div>` : ''}
        ${item.equipped ? '<div class="equipped-badge">EQUIPPED</div>' : ''}
    `;

    card.addEventListener('click', () => handleItemUse(item));
}

async function useItem(itemId) {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/api/inventory/use/${userId}/${itemId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to use item');
        }

        const contentLength = response.headers.get('Content-Length');
        if (contentLength && parseInt(contentLength) > 0) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Failed to use item:', error);
        throw error;
    }
}

function setupTabNavigation() {
    const tabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            const activeContent = document.getElementById(`${tabId}-tab`);
            if (activeContent) {
                activeContent.classList.add('active');

                if (tabId === 'inventory') {
                    loadInventory();
                }
            }
        });
    });
}

async function handleItemUse(item) {
    if (item.quantity <= 0) {
        showToast('No items left to use');
        return;
    }

    if (item.item.id === 6) {
        try {
            const result = await useItem(item.item.id);
            showToast(`+${(item.item.effectValue * 100).toFixed(0)}% XP boost activated!`);
            await loadInventory();
        } catch (error) {
            console.error('Failed to use item:', error);
            showToast(error.message || 'Failed to use item');
        }
    } else {
        showToast('This item cannot be used');
    }
}