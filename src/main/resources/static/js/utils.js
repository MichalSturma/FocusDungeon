// utils.js

// Function to check if the user is logged in
export function checkIfUserIsLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Is user logged in?', isLoggedIn);
    return isLoggedIn;
}
export function updateUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const usernameDisplay = document.getElementById("usernameDisplay");
    const profileButton = document.getElementById("profileButton");
    const logoutButton = document.getElementById("logoutButton");

    if (isLoggedIn) {
        profileButton.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        if (usernameDisplay) {
            usernameDisplay.textContent = localStorage.getItem("username");
        }
    } else {
        profileButton.classList.add("hidden");
        logoutButton.classList.add("hidden");
        if (usernameDisplay) {
            usernameDisplay.textContent = "";
        }
    }
}

//Moc nevím kam to dát tak si to pak dej kam myslíš :)) - Iveta:TODO
export async function fetchUserStats() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error("❌ Nelze načíst statistiky – userId není v localStorage!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/user/stats/${userId}`);
        if (!response.ok) throw new Error("❌ Chyba při načítání uživatelských statistik!");

        const userStats = await response.json();

        console.log("📡 Data přijatá z API:", userStats);

        // ✅ Uložení kompletních statistik
        localStorage.setItem("userStats", JSON.stringify(userStats));

        // ✅ Přetvoření dat pro focusDungeonUserData
        const focusDungeonData = {
            xp: userStats.xp,
            level: userStats.level,
            streak: userStats.longestStreak,
            xpNextLevel: 500, // Můžeš přidat dynamický výpočet
            lastCompletionDate: new Date().toISOString().split("T")[0], // Aktuální datum
            totalFocusTime: userStats.totalFocusTime || 0
        };

        // ✅ Uložení dat pro Focus Dungeon
        localStorage.setItem("focusDungeonUserData", JSON.stringify(focusDungeonData));

        console.log("📦 Uložené userStats v localStorage:", localStorage.getItem("userStats"));
        console.log("🏰 Uložené focusDungeonUserData v localStorage:", localStorage.getItem("focusDungeonUserData"));

    } catch (error) {
        console.error("❌ Error fetching user stats:", error);
    }
}



export async function updateUserStats(xp, level, totalFocusTime, longestStreak) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Cannot update stats - missing token!");
        return;
    }

    try {
        // First check for active XP boosts
        const boostResponse = await fetch(`http://localhost:8080/api/inventory/boosts/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        let xpMultiplier = 1.0;

        if (boostResponse.ok) {
            const boosts = await boostResponse.json();
            const xpBoosts = boosts.filter(boost => boost.boostType === "XP_BOOST");

            if (xpBoosts.length > 0) {
                // Find the highest XP boost value
                const highestBoost = Math.max(...xpBoosts.map(boost => boost.boostValue));
                xpMultiplier = 1.0 + highestBoost;
                console.log(`Applying XP boost: ${highestBoost * 100}% multiplier`);
            }
        }

        // Apply the multiplier to the XP
        const boostedXp = xp * xpMultiplier;
        console.log(`Original XP: ${xp}, Boosted XP: ${boostedXp}`);

        // Send the updated stats with boosted XP
        const response = await fetch(`http://localhost:8080/api/user/stats/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                xp: boostedXp,
                level,
                totalFocusTime,
                longestStreak
            }),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Error updating stats: ${errorMsg}`);
        }

        console.log("Stats successfully updated!", await response.json());
        await fetchUserStats();
    } catch (error) {
        console.error("Error updating stats:", error);
    }
}
export async function fetchUserIdAndStore() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch user ID");

        const userData = await response.json();
        localStorage.setItem("userId", userData.id); // ✅ Uložíme ID
        console.log("Uživatelské ID načteno:", userData.id);
    } catch (error) {
        console.error("Chyba při načítání ID uživatele:", error);
    }

}

// utils.js - Add these new functions

// Příklad pro získání přátel
export async function fetchFriendsList() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/friends", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch friends list");
    }
    return await response.json();
}

// utils.js
export async function sendFriendRequest(friendUsername) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/friends/request?friendUsername=" + encodeURIComponent(friendUsername), {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if (!response.ok) {
        throw new Error("Failed to send friend request");
    }
    if (response.ok) {
        console.log("Friend request sent successfully to " + friendUsername);
    }
    return await response.json();
}


export async function respondToFriendRequest(requestId, accept) {
    const token = localStorage.getItem('token');
    const action = accept ? 'accept' : 'reject';

    const response = await fetch(`http://localhost:8080/api/friends/requests/${requestId}?action=${action}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Error('Failed to respond to friend request');
    }
    return await response.json();
}

export async function fetchFriendRequests() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/friends/requests", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch friend requests");
    }
    return await response.json();
}







