// music.js

// Global sound volume setting
window.soundVolume = 0.5; // Default sound effects volume

// Global variable to store the current music volume
let musicVolume = 0.05;
let soundVolume = 0.5;

// Toggle music play/pause
export function toggleMusic() {
    const audio = document.getElementById('background-music');
    const musicToggle = document.querySelector('.music-toggle');

    if (audio.paused) {
        audio.play();
        musicToggle.textContent = '⏸';
    } else {
        audio.pause();
        musicToggle.textContent = '▶';
    }
}

// Set music volume
export function setVolume(volume) {
    const audio = document.getElementById('background-music');
    audio.volume = volume;
    musicVolume = volume;
}

// Set sound effect volume
export function setSoundVolume(volume) {
    soundVolume = volume;
}

// Play arrow sound
export function playArrowSound() {
    playSound('sounds/arrow.mp3');
}

// Setup hover sounds on buttons
export function setupHoverSounds() {
    const buttons = document.querySelectorAll('button, .arrow, .modal-option');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            playSound('sounds/button.mp3');
        });
    });
}

// Play a sound effect
export function playSound(soundPath) {
    const sound = new Audio(soundPath);
    sound.volume = soundVolume;
    sound.currentTime = 0;
    sound.play().catch(error => {
        console.log("Error playing sound:", error);
    });
}