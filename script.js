import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://e-lafda-2a24c-default-rtdb.asia-southeast1.firebasedatabase.app/" // Replace "xyz" with your actual Firebase Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const generateLinkBtn = document.getElementById("generateLinkBtn");
    const usernameInput = document.getElementById("username");
    const generatedLink = document.getElementById("generatedLink");
    const countdownContainer = document.getElementById("countdownContainer");
    const countdownDisplay = document.getElementById("countdown");

    // Generate Anonymous Link
    if (generateLinkBtn) {
        generateLinkBtn.addEventListener("click", () => {
            const username = usernameInput.value.trim();
            if (username === "") {
                alert("Please enter a username.");
                return;
            }

            const uniqueLink = `${window.location.origin}/msg.html?user=${encodeURIComponent(username)}`;
            generatedLink.innerHTML = `<a href="${uniqueLink}" target="_blank">${uniqueLink}</a>`;

            // Show countdown timer
            countdownContainer.classList.remove("hidden");
            startCountdown(24 * 60 * 60); // 24 hours
        });
    }

    // Countdown Timer
    function startCountdown(durationInSeconds) {
        let timeLeft = durationInSeconds;

        function updateTimer() {
            if (timeLeft <= 0) {
                countdownDisplay.textContent = "⛔ Link expired!";
                generatedLink.innerHTML = ""; // Remove link after expiry
                return;
            }

            let hours = Math.floor(timeLeft / 3600);
            let minutes = Math.floor((timeLeft % 3600) / 60);
            let seconds = timeLeft % 60;
            countdownDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
            timeLeft--;
            setTimeout(updateTimer, 1000);
        }

        updateTimer();
    }

    // Handle messages on msg.html
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (userParam && document.getElementById("userDisplay")) {
        document.getElementById("userDisplay").textContent = userParam;
        
        const sendMessageBtn = document.getElementById("sendMessageBtn");
        const messageInput = document.getElementById("messageInput");

        sendMessageBtn.addEventListener("click", () => {
            const message = messageInput.value.trim();
            if (message === "") {
                alert("Please enter a message.");
                return;
            }

            // Save message to Firebase Realtime Database
            push(ref(db, `messages/${userParam}`), {
                text: message,
                timestamp: Date.now()
            });

            // Change screen to "Sent"
            document.body.innerHTML = "<div class='container'><h1>✅ Sent!</h1></div>";
        });
    }
});
