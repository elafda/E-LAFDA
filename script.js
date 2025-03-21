import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// 🔥 Firebase Configuration - Replace with your actual config
const firebaseConfig = {
    databaseURL: "https://e-lafda-2a24c-default-rtdb.asia-southeast1.firebasedatabase.app/" // Replace with your actual Firebase Realtime Database URL
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JavaScript Loaded Successfully!");

    const generateLinkBtn = document.getElementById("generateLinkBtn");
    const usernameInput = document.getElementById("username");
    const generatedLink = document.getElementById("generatedLink");
    const countdownContainer = document.getElementById("countdownContainer");
    const countdownDisplay = document.getElementById("countdown");

    if (!generateLinkBtn || !usernameInput || !generatedLink) {
        console.error("❌ One or more elements missing! Check index.html.");
        return;
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
            generatedLink.style.display = "block";

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

    // 📩 Handle Messages on msg.html
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (userParam && document.getElementById("userDisplay")) {
        document.getElementById("userDisplay").textContent = userParam;

        const sendMessageBtn = document.getElementById("sendMessageBtn");
        const messageInput = document.getElementById("messageInput");
        const messageContainer = document.getElementById("messageContainer");

        // ✅ Send Message
        sendMessageBtn.addEventListener("click", async () => {
            const message = messageInput.value.trim();
            if (message === "") {
                alert("❌ Please enter a message.");
                return;
            }

            try {
                await push(ref(db, `messages/${userParam}`), {
                    text: message,
                    timestamp: Date.now()
                });

                document.body.innerHTML = "<div class='container'><h1>✅ Message Sent!</h1></div>";
            } catch (error) {
                console.error("❌ Error sending message:", error);
            }
        });

        // ✅ Retrieve Messages
        onValue(ref(db, `messages/${userParam}`), (snapshot) => {
            const messages = snapshot.val();
            if (messages) {
                let messageList = Object.values(messages).map(msg => `<p>${msg.text}</p>`).join("");
                messageContainer.innerHTML = messageList;
            }
        });
    }
});
