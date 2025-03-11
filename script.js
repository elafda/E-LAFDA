// Function to create a room
function createRoom() {
    let realUsername = document.getElementById("realUsername").value.trim();
    if (realUsername === "") {
        alert("Please enter your real username!");
        return;
    }

    let roomId = Math.random().toString(36).substring(2, 8);
    let roomLink = `room.html?room=${roomId}&creator=${encodeURIComponent(realUsername)}`;

    localStorage.setItem(roomId, JSON.stringify({ creator: realUsername, messages: [] }));

    document.getElementById("roomLink").innerHTML = `Your room: <a href="${roomLink}" target="_blank">${roomLink}</a>`;
}

// Function to join a room
function joinRoom() {
    let anonUsername = document.getElementById("anonUsername").value.trim();
    if (anonUsername === "") {
        alert("Choose an anonymous username!");
        return;
    }

    localStorage.setItem("anonUsername", anonUsername);
    document.getElementById("chatBox").style.display = "block";
}

// Function to load the room
function loadRoom() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");
    let creator = params.get("creator");

    let roomData = JSON.parse(localStorage.getItem(roomId));

    if (!roomData) {
        document.body.innerHTML = "<h1>Room Not Found!</h1>";
        return;
    }

    document.getElementById("roomInfo").innerText = `Room ID: ${roomId} | Created by: ${creator}`;

    if (localStorage.getItem("anonUsername")) {
        document.getElementById("chatBox").style.display = "block";
    }

    if (localStorage.getItem("anonUsername") === creator) {
        document.getElementById("deleteRoomBtn").style.display = "block";
    }

    loadMessages(roomId);
}

// Function to send a message
function sendMessage() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");
    let anonUsername = localStorage.getItem("anonUsername");
    let message = document.getElementById("messageInput").value.trim();

    if (message === "") return;

    let roomData = JSON.parse(localStorage.getItem(roomId)) || { messages: [] };
    roomData.messages.push({ user: anonUsername, text: message });

    localStorage.setItem(roomId, JSON.stringify(roomData));

    document.getElementById("messageInput").value = "";
    loadMessages(roomId);
}

// Function to load messages
function loadMessages(roomId) {
    let roomData = JSON.parse(localStorage.getItem(roomId)) || { messages: [] };
    let messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    roomData.messages.forEach(msg => {
        let msgDiv = document.createElement("div");
        msgDiv.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
        messagesDiv.appendChild(msgDiv);
    });
}

// Function to delete room
function deleteRoom() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");

    localStorage.removeItem(roomId);
    alert("Room deleted!");
    window.location.href = "index.html";
}

// Load the room when `room.html` opens
if (window.location.pathname.includes("room.html")) {
    loadRoom();
}
