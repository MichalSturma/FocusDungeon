import { recordSession } from './userStats.js';

// Timer state variables
let isSetupMode = true;
let isFocusMode = false;
let isPaused = false;
let timerId = null;
let totalTime = 0;
let remainingTime = 0;
let startTime = 0;
let pauseStartTime = 0;
let totalPausedTime = 0;

// XP calculation constants
const XP_PER_MINUTE = 30; // Base XP per minute
const COMPLETION_BONUS_MULTIPLIER = 0.5; // 50% bonus for full completion
const MIN_XP_AWARD = 15; // Minimum XP award even for very short sessions

// Import functions from music.js and celebrationModal.js
import { playArrowSound, playSound } from './music.js';
import { showCelebrationModal } from './celebrationModal.js';

// Function to adjust the time (minutes and hours only)
export function adjustTime(amount) {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');

    let hours = parseInt(hoursElement.textContent);
    let minutes = parseInt(minutesElement.textContent);

    // Adjust minutes
    minutes += amount;

    // Handle rollover for minutes and hours
    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
    } else if (minutes < 0) {
        hours -= Math.ceil(Math.abs(minutes) / 60);
        minutes = 60 + (minutes % 60);
    }

    // Handle hours overflow
    if (hours >= 100) {
        hours = 0;
    } else if (hours < 0) {
        hours = 99;
    }

    // Pad the values with leading zeros
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
}

// Start focus mode timer
export function startFocus() {
    const hours = parseInt(document.getElementById('hours').textContent);
    const minutes = parseInt(document.getElementById('minutes').textContent);
    const seconds = parseInt(document.getElementById('seconds').textContent || '0');

    // Calculate total seconds
    totalTime = (hours * 60 * 60) + (minutes * 60) + seconds;
    remainingTime = totalTime;
    startTime = Date.now();
    totalPausedTime = 0;

    // Switch to focus mode
    document.querySelector('.timer-container').classList.add('hidden');
    document.getElementById('startFocusButton').classList.add('hidden');
    document.getElementById('focus-mode').classList.remove('hidden');

    // Update the focus display
    updateFocusDisplay(hours, minutes, seconds);

    // Start the timer
    isFocusMode = true;
    isPaused = false;
    document.querySelector('.focus-display').classList.add('active');

    // Play a start sound
    playSound('sounds/button.mp3');

    // Start the countdown
    startCountdown();
}

// Update the focus mode display
function updateFocusDisplay(hours, minutes, seconds) {
    document.getElementById('focus-hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('focus-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('focus-seconds').textContent = seconds.toString().padStart(2, '0');
}

// Function to update the dino's position
function updateDinoPosition(progressPercent) {
    const dino = document.getElementById('dino');
    const progressBar = document.querySelector('.progress-bar');
    const progressBarWidth = progressBar.offsetWidth;

    // Calculate the dino's position based on progress
    const dinoPosition = (progressPercent / 100) * progressBarWidth;

    // Position the dino at the end of the blue progress bar
    dino.style.left = `${dinoPosition - dino.offsetWidth + 12}px`;
}

// Start the countdown timer
function startCountdown() {
    timerId = setInterval(() => {
        if (!isPaused) {
            // Calculate elapsed time (accounting for paused time)
            const elapsedSeconds = Math.floor((Date.now() - startTime - totalPausedTime) / 1000);
            remainingTime = Math.max(0, totalTime - elapsedSeconds);

            // Update the display
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;

            updateFocusDisplay(hours, minutes, seconds);

            // Update progress bar
            const progressPercent = ((totalTime - remainingTime) / totalTime) * 100;
            document.getElementById('timer-progress').style.width = `${progressPercent}%`;

            // Update dino position
            updateDinoPosition(progressPercent);

            // Check if timer is complete
            if (remainingTime <= 0) {
                timerComplete();
            }
        }
    }, 1000); // Update every second
}

// Pause or resume the timer
export function togglePause() {
    isPaused = !isPaused;

    // Update the pause button text
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = isPaused ? 'RESUME' : 'PAUSE';

    // Toggle the pulsing animation
    if (isPaused) {
        document.querySelector('.focus-display').classList.remove('active');
        pauseStartTime = Date.now(); // Record when we paused
    } else {
        document.querySelector('.focus-display').classList.add('active');
        // Add the paused time to our total
        totalPausedTime += (Date.now() - pauseStartTime);
    }

    // Play a pause/resume sound
    playSound('sounds/button.mp3');
}

// Calculate XP based on time and completion
export function calculateXP(timeInSeconds, completionPercent) {
    // Base XP calculation (30 XP per minute)
    let xp = Math.floor((timeInSeconds / 60) * XP_PER_MINUTE);
    
    // Add completion bonus (up to 50% more)
    const completionBonus = Math.floor(xp * COMPLETION_BONUS_MULTIPLIER * (completionPercent / 100));
    xp += completionBonus;
    
    // Ensure minimum XP award
    return Math.max(xp, MIN_XP_AWARD);
}

// Format time for display (HH:MM:SS)
export function formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Reset the timer
export function resetTimer(showModal = false) {
    // Clear the interval
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }

    // If we should show the modal (for partial completion)
    if (showModal && totalTime > 0) {
        const elapsedTime = totalTime - remainingTime;
        const completionPercent = Math.min(100, Math.round((elapsedTime / totalTime) * 100));

        if (elapsedTime > 10) {
            const xpEarned = calculateXP(elapsedTime, completionPercent);
            recordSession(elapsedTime, false); // Add this line
            showCelebrationModal(xpEarned, elapsedTime, completionPercent, false);
        }
    }

    // Reset mode states
    isFocusMode = false;
    isPaused = false;

    // Switch back to setup mode
    document.querySelector('.timer-container').classList.remove('hidden');
    document.getElementById('startFocusButton').classList.remove('hidden');
    document.getElementById('focus-mode').classList.add('hidden');

    // Reset the progress bar
    document.getElementById('timer-progress').style.width = '0';

    // Remove the active animation
    document.querySelector('.focus-display').classList.remove('active');

    // Play a reset sound
    playSound('sounds/button.mp3');
}

// Timer complete function
function timerComplete() {
    // Clear the interval
    clearInterval(timerId);
    timerId = null;

    // Set display to zeros
    updateFocusDisplay(0, 0, 0);

    // Set progress to 100%
    document.getElementById('timer-progress').style.width = '100%';

    // Stop the pulsing animation
    document.querySelector('.focus-display').classList.remove('active');

    // Play a completion sound
    playSound('sounds/level-up.mp3');

    // Show celebration modal instead of alert
    recordSession(totalTime, true);
    const xpEarned = calculateXP(totalTime, 100);
    showCelebrationModal(xpEarned, totalTime, 100, true);
}

// Long-press functionality with delay
export function setupLongPress(button, amount) {
    let intervalId;
    let timeoutId;

    const startAdjusting = () => {
        // Adjust once immediately
        adjustTime(amount);
        playArrowSound();

        // Set a delay before starting the long press
        timeoutId = setTimeout(() => {
            intervalId = setInterval(() => adjustTime(amount), 100); // Adjust every 100ms
        }, 500); // 500ms delay before long press starts
    };

    const stopAdjusting = () => {
        clearTimeout(timeoutId); // Clear the delay timeout
        clearInterval(intervalId); // Clear the interval
    };

    button.addEventListener('mousedown', startAdjusting);
    button.addEventListener('mouseup', stopAdjusting);
    button.addEventListener('mouseleave', stopAdjusting);

    // For touch devices
    button.addEventListener('touchstart', startAdjusting);
    button.addEventListener('touchend', stopAdjusting);
}