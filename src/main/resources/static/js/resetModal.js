// Import playSound from music.js
import { playSound } from './music.js';

// Function to show the reset time confirmation modal
export function showResetTimeModal() {
    document.getElementById('reset-time-modal').classList.remove('hidden');
}

// Function to hide the reset time confirmation modal
export function hideResetTimeModal() {
    document.getElementById('reset-time-modal').classList.add('hidden');
}

// Confirm reset timer - now with partial XP option
export function setupResetModalListeners(resetTimer) {
    document.getElementById('confirm-reset').addEventListener('click', function() {
        playSound('sounds/button.mp3'); // Play a sound
        hideResetTimeModal();
        resetTimer(true); // Call resetTimer with true to show the celebration modal with partial XP
    });

    document.getElementById('cancel-reset').addEventListener('click', function() {
        playSound('sounds/button.mp3'); // Play a sound
        hideResetTimeModal();
    });
}

// Function to show the options modal
export function showOptionsModal() {
    document.getElementById('options-modal').classList.remove('hidden');
}

// Function to hide the options modal
export function hideOptionsModal() {
    document.getElementById('options-modal').classList.add('hidden');
}

// Setup options modal listeners
export function setupOptionsModalListeners() {
    // Open Options Modal
    document.getElementById('open-options-modal').addEventListener('click', function(event) {
        event.preventDefault();
        console.log("Options button clicked!"); 
        showOptionsModal();
    });

    // Close Options Modal
    document.querySelector('.modal .close').addEventListener('click', function() {
        hideOptionsModal();
    });
}