// ✅ Firebase Configuration (Replace with actual values from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBPpZ-SA5lVYCauRkVOzqDA6MjKB7OQodI",
  authDomain: "e-lafda-2a24c.firebaseapp.com",
  projectId: "e-lafda-2a24c",
  storageBucket: "e-lafda-2a24c.firebasestorage.app",
  messagingSenderId: "263237488063",
  appId: "1:263237488063:web:70db3731e500a9e9c6250a",
  measurementId: "G-H53HVJ9BX6"
};

// ✅ Ensure Firebase is initialized before Firestore
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ✅ Initialize Firestore
const db = firebase.firestore();

// ✅ Function to create a room
function createRoom() {
    let realUsername = document.getElementById("realUsername").value.trim();
    if (realUsername === "") {
        alert("Please enter your real username!");
        return;
    }

    let roomId = Math.random().toString(36).substring(2, 8);
    let roomLink = `room.html?room=${roomId}`;

    console.log("Creating room:", roomId); // Debugging output

    // ✅ Save room in Firestore and ensure it updates the UI
    db.collection("rooms").doc(roomId).set({
        creator: realUsername,
        messages: []
    }).then(() => {
        console.log("Room created successfully! Room ID:", roomId);
        document.getElementById("roomLink").innerHTML = 
            `Your room: <a href="${roomLink}" target="_blank">${roomLink}</a>`;
    }).catch(error => {
        console.error("Error creating room:", error);
        alert("⚠️ Failed to create room. Check Firestore rules.");
    });
}

// ✅ Function to join a room
function joinRoom() {
    let anonUsername = document.getElementById("anonUsername").value.trim();
    if (anonUsername === "") {
        alert("Choose an anonymous username!");
        return;
    }

    localStorage.setItem("anonUsername", anonUsername);
    document.getElementById("chatBox").style.display = "block";
}

// ✅ Function to load the room
function loadRoom() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");

    db.collection("rooms").doc(roomId).get().then(doc => {
        if (doc.exists) {
            let roomData = doc.data();
            document.getElementById("roomInfo").innerText = `Room ID: ${roomId} | Created by: ${roomData.creator}`;
        } else {
            document.body.innerHTML = "<h1>⚠️ Room Not Found!</h1>";
        }
    }).catch(error => {
        console.error("Error fetching room:", error);
        alert("⚠️ Could not load room.");
    });
}

// ✅ Function to send a message
function sendMessage() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");
    let anonUsername = localStorage.getItem("anonUsername");
    let message = document.getElementById("messageInput").value.trim();

    if (message === "") return;

    db.collection("rooms").doc(roomId).update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            user: anonUsername,
            text: message,
            timestamp: new Date().toLocaleString()
        })
    }).then(() => {
        document.getElementById("messageInput").value = "";
    }).catch(error => {
        console.error("Error sending message:", error);
        alert("⚠️ Could not send message.");
    });
}

// ✅ Function to load messages in real-time
function loadMessages(roomId) {
    db.collection("rooms").doc(roomId).onSnapshot(doc => {
        let messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML = "";

        if (doc.exists) {
            let roomData = doc.data();
            roomData.messages.forEach(msg => {
                let msgDiv = document.createElement("div");
                msgDiv.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
                messagesDiv.appendChild(msgDiv);
            });
        }
    });
}

// ✅ Function to delete room (Only creator)
function deleteRoom() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");

    db.collection("rooms").doc(roomId).delete().then(() => {
        alert("Room deleted!");
        window.location.href = "index.html";
    }).catch(error => {
        console.error("Error deleting room:", error);
        alert("⚠️ Could not delete room.");
    });
}

// ✅ Ensure the room loads when `room.html` is opened
if (window.location.pathname.includes("room.html")) {
    loadRoom();
}
