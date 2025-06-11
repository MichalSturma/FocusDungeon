import { playSound } from './music.js';
import { setupCelebrationModalListeners } from './celebrationModal.js';

// Function to update the range input track color
function updateRangeInputStyle(rangeInput) {
    const value = (rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
    rangeInput.style.setProperty('--range-percent', `${value}%`);
}

// Initialize event listeners for the application
export function initializeEventListeners(functions) {
    const {
        adjustTime,
        startFocus,
        togglePause,
        resetTimer,
        showResetTimeModal,
        setupResetModalListeners,
        setupOptionsModalListeners,
        setupLongPress
    } = functions;

    // Add event listeners for the arrows
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');

    if (leftArrow && rightArrow) {
        setupLongPress(leftArrow, -1); // Decrease minutes on long press
        setupLongPress(rightArrow, 1); // Increase minutes on long press
    }

    // Add event listener for the start focus button
    const startFocusButton = document.getElementById('startFocusButton');
    if (startFocusButton) {
        startFocusButton.addEventListener('click', function(event) {
            event.preventDefault();
            startFocus();
        });
    }

    // Add event listeners for focus mode controls
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.addEventListener('click', function(event) {
            event.preventDefault();
            togglePause();
        });
    }

    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', function(event) {
            event.preventDefault();
            showResetTimeModal(); // Show the reset confirmation modal
        });
    }

    // Setup the reset modal listeners
    setupResetModalListeners(resetTimer);
    
    // Setup the options modal listeners
    setupOptionsModalListeners();
    
    // Setup the celebration modal listeners
    setupCelebrationModalListeners();

    // Setup options event listeners
    setupOptionsListeners();
}

// Setup option controls (sliders, dropdowns, etc.)
function setupOptionsListeners() {
    // Exit to Main Menu
    const exitButton = document.getElementById('exit-button');
    if (exitButton) {
        exitButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Music Volume Control
    const musicVolumeSlider = document.getElementById('music-volume');
    if (musicVolumeSlider) {
        musicVolumeSlider.addEventListener('input', function(event) {
            const volume = event.target.value;
            window.setVolume(volume);
            updateRangeInputStyle(event.target);
        });
        // Initialize slider style
        updateRangeInputStyle(musicVolumeSlider);
    }

    // Sound Volume Control
    const soundVolumeSlider = document.getElementById('sound-volume');
    if (soundVolumeSlider) {
        soundVolumeSlider.addEventListener('input', function(event) {
            const volume = event.target.value;
            window.setSoundVolume(volume);
            updateRangeInputStyle(event.target);
        });
        // Initialize slider style
        updateRangeInputStyle(soundVolumeSlider);
    }

    // Background Choice
    const backgroundChoice = document.getElementById('background-choice');
    if (backgroundChoice) {
        backgroundChoice.addEventListener('change', function(event) {
            const background = event.target.value;

            // Check if the selected value already includes the file extension
            if (!background.endsWith('.png') && !background.endsWith('.gif')) {
                // If not, assume it's a PNG by default
                document.body.style.backgroundImage = `url('images/${background}.png')`;
            } else {
                // If it includes an extension, use it as-is
                document.body.style.backgroundImage = `url('images/${background}')`;
            }
        });
    }

    // Music Choice
    const musicChoice = document.getElementById('music-choice');
    if (musicChoice) {
        musicChoice.addEventListener('change', function(event) {
            const music = event.target.value;
            const audio = document.getElementById('background-music');
            audio.src = `sounds/${music}.mp3`;
            audio.play();
        });
    }

    // Add event listeners to all range inputs
    document.querySelectorAll('.option-row input[type="range"]').forEach(rangeInput => {
        // Update the track color when the input value changes
        rangeInput.addEventListener('input', () => {
            updateRangeInputStyle(rangeInput);
        });

        // Initialize the track color when the page loads
        updateRangeInputStyle(rangeInput);
    });
}

