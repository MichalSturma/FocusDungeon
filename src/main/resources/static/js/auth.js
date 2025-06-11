import { fetchUserStats, updateUI, fetchUserIdAndStore } from './utils.js';

export function switchTab(tab) {
    console.log('Switching to tab:', tab);
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tabs button').forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(`${tab}Form`).classList.add('active');
    document.getElementById(`${tab}TabButton`).classList.add('active');
}

export function closeModal(modalType) {
    console.log('Closing modal:', modalType);
    const modal = document.getElementById(`${modalType}Modal`);
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function openModal(modalType) {
    console.log('Opening modal:', modalType);
    const modal = document.getElementById(`${modalType}Modal`);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

export async function registerUser(username, email, password) {
    try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Registration failed: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error connecting to server:", error);
        throw error;
    }
}

export async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("❌ Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("token", result.token);
            await fetchUserIdAndStore();
            await fetchUserStats();
            closeModal("auth");
            updateUI();
        } else {
            alert("❌ Login failed: " + result.message);
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("❌ Error connecting to server.");
    }
}

export function logoutUser() {
    localStorage.clear();
    updateUI();
    window.location.href = "index.html";
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}