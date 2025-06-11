// particles.js

// Function to create title particles
export function createTitleParticles() {
    const particlesContainer = document.querySelector('.particles');
    const numParticles = 30;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particlesContainer.appendChild(particle);
    }
}

// Function to create background particles
export function createBackgroundParticles() {
    const backgroundParticlesContainer = document.querySelector('.background-particles');
    const numParticlesLayer1 = 50; // First layer (Soft Blue)
    const numParticlesLayer2 = 70; // Second layer (Light Gray-Blue)
    const numParticlesLayer3 = 40; // Third layer (Pastel Blue)

    // First layer of particles
    for (let i = 0; i < numParticlesLayer1; i++) {
        const particle = document.createElement('div');
        particle.classList.add('background-particle', 'layer-1');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        backgroundParticlesContainer.appendChild(particle);
    }

    // Second layer of particles
    for (let i = 0; i < numParticlesLayer2; i++) {
        const particle = document.createElement('div');
        particle.classList.add('background-particle', 'layer-2');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 12}s`;
        backgroundParticlesContainer.appendChild(particle);
    }

    // Third layer of particles
    for (let i = 0; i < numParticlesLayer3; i++) {
        const particle = document.createElement('div');
        particle.classList.add('background-particle', 'layer-3');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        backgroundParticlesContainer.appendChild(particle);
    }
}