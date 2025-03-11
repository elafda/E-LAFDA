// Function to generate unique link
function generateLafdaLink() {
    let storedLink = localStorage.getItem("lafdaLink");
    let storedExpiry = localStorage.getItem("lafdaExpiry");

    if (storedLink && storedExpiry && Date.now() < storedExpiry) {
        alert("You already have an active link! Please wait until it expires.");
        return;
    }

    let username = document.getElementById("username").value.trim();
    username = username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    if (username === "") {
        alert("Please enter a valid username!");
        return;
    }

    let randomId = Math.random().toString(36).substring(2, 8);
    let lafdaLink = `msg.html?user=${username}-${randomId}`;  // FIXED LINK FORMAT
    let expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    localStorage.setItem("lafdaLink", lafdaLink);
    localStorage.setItem("lafdaExpiry", expiryTime);
    localStorage.setItem("lafdaUser", username);

    displayLafdaLink(lafdaLink, expiryTime);
}

// Function to check stored link and start countdown
function checkStoredLafdaLink() {
    let storedLink = localStorage.getItem("lafdaLink");
    let storedExpiry = localStorage.getItem("lafdaExpiry");

    if (storedLink && storedExpiry && Date.now() < storedExpiry) {
        displayLafdaLink(storedLink, storedExpiry);
    } else {
        clearStoredLafdaLink();
    }
}

// Function to display the link and start countdown
function displayLafdaLink(link, expiryTime) {
    document.getElementById("lafdaLink").innerHTML = `
        <strong>Your Anonymous Link:</strong> 
        <a href="${link}" target="_blank">${link}</a>
        <p id="countdown"></p>
    `;

    startCountdown(expiryTime);
}

// Countdown Timer
function startCountdown(expiryTime) {
    function updateCountdown() {
        let now = Date.now();
        let timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
            document.getElementById("lafdaLink").innerHTML = "Your link has expired! Generate a new one.";
            clearStoredLafdaLink();
            clearInterval(timer);
            return;
        }

        let hours = Math.floor(timeLeft / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerText = `Expires in: ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    let timer = setInterval(updateCountdown, 1000);
}

// Function to clear stored link after expiration
function clearStoredLafdaLink() {
    localStorage.removeItem("lafdaLink");
    localStorage.removeItem("lafdaExpiry");
    localStorage.removeItem("lafdaUser");
}

// Function to submit a message
function submitMessage() {
    let params = new URLSearchParams(window.location.search);
    let user = params.get("user");
    let message = document.getElementById("messageBox").value.trim();

    if (message === "") {
        alert("Message cannot be empty!");
        return;
    }

    let messages = JSON.parse(localStorage.getItem("lafdaMessages")) || [];
    let timestamp = new Date().toLocaleString();

    messages.push({ user, message, timestamp });
    localStorage.setItem("lafdaMessages", JSON.stringify(messages));

    document.getElementById("confirmation").innerHTML = "✅ Message Sent!";
    document.getElementById("messageBox").value = "";
}

// Function to load messages on index.html
function loadMessages() {
    let storedUser = localStorage.getItem("lafdaUser");
    let messages = JSON.parse(localStorage.getItem("lafdaMessages")) || [];
    let filteredMessages = messages.filter(msg => msg.user === storedUser);
    let messageList = document.getElementById("messagesList");

    messageList.innerHTML = ""; // Clear old messages

    if (filteredMessages.length === 0) {
        messageList.innerHTML = "<p>No messages yet.</p>";
        return;
    }

    filteredMessages.forEach(msg => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${msg.timestamp}:</strong> ${msg.message}`;
        messageList.appendChild(li);
    });
}

// Run checks on page load
window.onload = function() {
    checkStoredLafdaLink();
    if (document.getElementById("messagesList")) {
        loadMessages();
    }
};
