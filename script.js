document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (userParam && document.getElementById("userDisplay")) {
        document.getElementById("userDisplay").textContent = userParam;
        
        const sendMessageBtn = document.getElementById("sendMessageBtn");
        const messageInput = document.getElementById("messageInput");
        const statusMessage = document.getElementById("statusMessage");

        sendMessageBtn.addEventListener("click", () => {
            const message = messageInput.value.trim();
            if (message === "") {
                alert("Please enter a message.");
                return;
            }

            // Placeholder for Firebase (Replace with actual Firebase logic)
            console.log(`Message sent to ${userParam}: ${message}`);

            messageInput.value = "";
            statusMessage.textContent = "✅ Message sent anonymously!";
        });
    }
});

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
    if (userParam) {
        document.getElementById("userDisplay").textContent = userParam;
        
        const sendMessageBtn = document.getElementById("sendMessageBtn");
        const messageInput = document.getElementById("messageInput");
        const statusMessage = document.getElementById("statusMessage");

        sendMessageBtn.addEventListener("click", () => {
            const message = messageInput.value.trim();
            if (message === "") {
                alert("Please enter a message.");
                return;
            }

            // Placeholder for Firebase (You will replace this later)
            console.log(`Message sent to ${userParam}: ${message}`);

            messageInput.value = "";
            statusMessage.textContent = "✅ Message sent anonymously!";
        });
    }
});
