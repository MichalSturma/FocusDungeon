import { toggleMusic, setupHoverSounds, setVolume, setSoundVolume } from './music.js';
import { createBackgroundParticles } from './particles.js';
import { initializeEventListeners } from './eventHandlers.js';
import { adjustTime, startFocus, togglePause, resetTimer, setupLongPress } from './timerLogic.js';
import { showResetTimeModal, setupResetModalListeners, setupOptionsModalListeners } from './resetModal.js';
import { setupStatsPanelListeners, initializeStats } from './userStats.js';

// Make volume functions available globally
window.setVolume = setVolume;
window.setSoundVolume = setSoundVolume;

// Set initial volume for music and sound effects
setVolume(0.05); // Initial music volume
setSoundVolume(0.5); // Initial sound effects volume

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Pass necessary functions to initializeEventListeners
    initializeEventListeners({
        adjustTime,
        startFocus,
        togglePause,
        resetTimer,
        showResetTimeModal,
        setupResetModalListeners,
        setupOptionsModalListeners,
        setupLongPress
    });

    initializeStats();
    setupStatsPanelListeners();

    // Initialize music toggle
    const musicToggle = document.querySelector('.music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }

    // Setup hover sounds
    setupHoverSounds();

    // Initialize particles
    createBackgroundParticles();
});