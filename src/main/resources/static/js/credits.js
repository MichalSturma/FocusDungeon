// Credits Page JavaScript
import { createBackgroundParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeCreditsPage();
});

function initializeCreditsPage() {
    // Initialize background particles
    createBackgroundParticles();

    // Setup header particles
    createHeaderParticles();

    // Setup music
    setupCreditsMusic();

    // Setup hover sounds
    setupCreditHoverSounds();

    // Setup smooth animations
    setupScrollAnimations();
}

// Header Particles
function createHeaderParticles() {
    const container = document.querySelector('.credits-particles');
    if (!container) return;

    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'credit-particle';

        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';

        container.appendChild(particle);
    }
}

// Music Control
function setupCreditsMusic() {
    const musicToggle = document.querySelector('.music-toggle');
    const creditsMusic = document.getElementById('credits-music');

    if (!musicToggle || !creditsMusic) return;

    let isPlaying = false;

    // Set volume
    creditsMusic.volume = 0.3;

    // Auto-play music when page loads
    window.addEventListener('load', () => {
        creditsMusic.play().then(() => {
            isPlaying = true;
            musicToggle.textContent = '♪';
        }).catch(e => {
            console.log('Autoplay prevented:', e);
            musicToggle.textContent = '♫';
        });
    });

    // Toggle music on click
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            creditsMusic.pause();
            musicToggle.textContent = '♫';
            isPlaying = false;
        } else {
            creditsMusic.play();
            musicToggle.textContent = '♪';
            isPlaying = true;
        }
    });

    // Save music state
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('creditsMusic', !creditsMusic.paused);
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all credit sections
    document.querySelectorAll('.credit-section').forEach(section => {
        observer.observe(section);
    });
}

// Smooth page transitions
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.addEventListener('click', (e) => {
        e.preventDefault();

        // Fade out effect
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    });
}

// Hover sound effects
function setupCreditHoverSounds() {
    const hoverSound = new Audio('sounds/button.mp3');
    hoverSound.volume = 0.3;
    let lastPlayTime = 0;

    // Select all hoverable elements
    const hoverElements = document.querySelectorAll(
        '.team-member, .credit-item, .back-button, .music-toggle'
    );

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const now = Date.now();
            if (now - lastPlayTime > 100) { // 100ms cooldown between sounds
                hoverSound.currentTime = 0;
                hoverSound.play().catch(e => console.log("Sound play prevented:", e));
                lastPlayTime = now;
            }
        });
    });
}