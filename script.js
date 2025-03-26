// Function to generate an anonymous link
function generateLink() {
    let username = document.getElementById("username").value.trim();
    
    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    // Check if a link already exists
    let storedData = JSON.parse(localStorage.getItem("lafdaLink"));
    
    if (storedData && new Date().getTime() < storedData.expiry) {
        alert("You can only generate one link every 24 hours!");
        return;
    }

    // Generate a new unique link
    let uniqueID = Math.random().toString(36).substring(2, 10);
    let expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    let anonymousLink = `msg.html?user=${encodeURIComponent(username)}&id=${uniqueID}`;

    // Store link details in localStorage
    localStorage.setItem("lafdaLink", JSON.stringify({ link: anonymousLink, expiry: expiryTime }));

    // Display the link
    document.getElementById("linkOutput").innerHTML = `
        <p>Your Anonymous Link (expires in 24 hours):</p>
        <a href="${anonymousLink}" target="_blank">${window.location.origin}/${anonymousLink}</a>
        <p id="countdown"></p>
    `;

    // Start countdown
    startCountdown(expiryTime);
}

// Function to start the countdown timer
function startCountdown(expiryTime) {
    let countdownElement = document.getElementById("countdown");

    function updateTimer() {
        let now = new Date().getTime();
        let timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
            countdownElement.innerHTML = "Link expired!";
            localStorage.removeItem("lafdaLink"); // Remove expired link
            return;
        }

        let hours = Math.floor(timeLeft / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `Expires in: ${hours}h ${minutes}m ${seconds}s`;

        setTimeout(updateTimer, 1000);
    }

    updateTimer();
}

// Check if a valid link already exists on page load
document.addEventListener("DOMContentLoaded", function () {
    let storedData = JSON.parse(localStorage.getItem("lafdaLink"));

    if (storedData && new Date().getTime() < storedData.expiry) {
        document.getElementById("linkOutput").innerHTML = `
            <p>Your Active Link (expires in 24 hours):</p>
            <a href="${storedData.link}" target="_blank">${window.location.origin}/${storedData.link}</a>
            <p id="countdown"></p>
        `;
        startCountdown(storedData.expiry);
    }
});
