import {switchTab, closeModal, openModal, loginUser, registerUser, validateEmail, logoutUser} from './auth.js';
import { createTitleParticles, createBackgroundParticles } from './particles.js';
import { toggleMusic, setupHoverSounds, setVolume } from './music.js';
import { checkIfUserIsLoggedIn } from './utils.js';
import { setupLeaderboardModal } from './leaderboard.js';
import { initializeProfileModal, openProfileModal } from './profile.js';


document.addEventListener('DOMContentLoaded', () => {
    setupLeaderboardModal();
    initializeProfileModal();
});

// Initialize particles
createTitleParticles();
createBackgroundParticles();

// Music toggle
const musicToggle = document.querySelector('.music-toggle');
const backgroundMusic = document.getElementById('background-music');

setVolume(0.05);

if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
}

// Save music state when navigating away
window.addEventListener('beforeunload', () => {
    localStorage.setItem('musicPlaying', !backgroundMusic.paused);
});

// Setup hover sounds
setupHoverSounds(); 

// Modal handling
const loginTabButton = document.getElementById('loginTabButton');
const signupTabButton = document.getElementById('signupTabButton');
const closeButton = document.querySelector('.close');
const startButton = document.getElementById('startButton');

loginTabButton.addEventListener('click', () => switchTab('login'));
signupTabButton.addEventListener('click', () => switchTab('signup'));
closeButton.addEventListener('click', () => closeModal('auth'));

startButton.addEventListener('click', (event) => {
    event.preventDefault();
    const isLoggedIn = checkIfUserIsLoggedIn();
    if (isLoggedIn) {
        window.location.href = "setTime.html";
    } else {
        openModal('auth');
    }
});

// Check if user is logged in on page load
const isLoggedIn = checkIfUserIsLoggedIn();
if (isLoggedIn) {
    document.getElementById('profileButton').classList.remove('hidden');
    document.getElementById('logoutButton').classList.remove('hidden');
    document.getElementById('usernameDisplay').textContent = localStorage.getItem('username');
}

// Logout button click
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    document.getElementById('profileButton').classList.add('hidden');
    document.getElementById('logoutButton').classList.add('hidden');
    document.getElementById('usernameDisplay').textContent = '';
    logoutUser();
    alert('You have been logged out.');
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    await loginUser(); // Call without passing undefined values
});


// Signup form submission
document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const response = await registerUser(newUsername, email, newPassword); // ✅ Await the response

        console.log('Signup successful:', response);

        if (response && response.success) {
            alert(response.message);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', response.username);
            closeModal("auth");

            // Show profile and logout buttons
            document.getElementById("profileButton").classList.remove('hidden');
            document.getElementById("logoutButton").classList.remove('hidden');

            // Set username display
            const usernameDisplay = document.getElementById("usernameDisplay");
            if (usernameDisplay) {
                usernameDisplay.textContent = response.username;
            } else {
                console.error('usernameDisplay element not found');
            }
        } else {
            alert(`Registration failed: ${response.message}`);
        }
    } catch (error) {
        console.log('Signup failed:', error.message);
        alert(error.message);
    }
});

// Profile button click
document.getElementById('profileButton').addEventListener('click', (event) => {
    event.preventDefault();
    openProfileModal();
});
