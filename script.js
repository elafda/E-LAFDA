import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// 🔥 Firebase Configuration - Replace with your actual database URL
const firebaseConfig = {
    databaseURL: "https://e-lafda-2a24c-default-rtdb.asia-southeast1.firebasedatabase.app/" // Updated URL
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("✅ Firebase Initialized");

// 📌 DOM Elements
const generateLinkBtn = document.getElementById("generateLinkBtn");
const usernameInput = document.getElementById("username");
const generatedLink = document.getElementById("generatedLink");
const countdownContainer = document.getElementById("countdownContainer");
const countdownDisplay = document.getElementById("countdown");

if (!generateLinkBtn || !usernameInput || !generatedLink) {
    console.error("❌ Missing elements in index.html");
}

// 🎯 Generate and Store Link in Firebase
generateLinkBtn.addEventListener("click", async () => {
    console.log("✅ Generate Link Button Clicked!");

    const username = usernameInput.value.trim();
    if (username === "") {
        alert("❌ Please enter a username.");
        return;
    }

    const uniqueLink = `${window.location.origin}/msg.html?user=${encodeURIComponent(username)}`;
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    // ✅ Store in Firebase
    try {
        await set(ref(db, `links/${username}`), {
            link: uniqueLink,
            expiresAt: expirationTime
        });

        generatedLink.innerHTML = `<a href="${uniqueLink}" target="_blank">${uniqueLink}</a>`;
        generatedLink.style.display = "block"; // Show the generated link

        console.log("✅ Generated Link:", uniqueLink);

        // ✅ Store expiration time in localStorage & start countdown
        localStorage.setItem("expirationTime", expirationTime);
        countdownContainer.classList.remove("hidden");
        startCountdown(expirationTime);
    } catch (error) {
        console.error("❌ Firebase Error:", error);
    }
});

// ⏳ Countdown Timer - Prevent Reset on Refresh
function startCountdown(expirationTime) {
    function updateTimer() {
        let timeLeft = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));

        if (timeLeft <= 0) {
            countdownDisplay.textContent = "⛔ Link expired!";
            generatedLink.innerHTML = "";
            return;
        }

        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        countdownDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;

        setTimeout(updateTimer, 1000);
    }

    updateTimer();
}

// 🔄 Retrieve Expired Links on Page Load
window.addEventListener("load", async () => {
    const expirationTime = localStorage.getItem("expirationTime");

    if (expirationTime && Date.now() < expirationTime) {
        countdownContainer.classList.remove("hidden");
        startCountdown(expirationTime);
    }
});