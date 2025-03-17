// Toggle Sidebar Menu
function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
    } else {
        sidebar.style.left = "0px";
    }
}

// Generate Anonymous Link
function generateLink() {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    let uniqueID = Math.random().toString(36).substring(2, 10);
    let anonymousLink = `msg.html?user=${encodeURIComponent(username)}&id=${uniqueID}`;

    document.getElementById("linkOutput").innerHTML = `
        <p>Your Anonymous Link:</p>
        <a href="${anonymousLink}" target="_blank">${window.location.origin}/${anonymousLink}</a>
    `;
}

// Send Anonymous Message
function sendMessage() {
    let message = document.getElementById("messageBox").value.trim();
    if (message === "") {
        alert("Message cannot be empty!");
        return;
    }

    document.getElementById("status").innerText = "Message sent successfully!";
    document.getElementById("messageBox").value = "";
}
