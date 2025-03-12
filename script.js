const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Function to create a room
function createRoom() {
    let realUsername = document.getElementById("realUsername").value.trim();
    if (realUsername === "") {
        alert("Please enter your real username!");
        return;
    }

    let roomId = Math.random().toString(36).substring(2, 8);
    let roomLink = `room.html?room=${roomId}`;

    db.collection("rooms").doc(roomId).set({
        creator: realUsername,
        messages: []
    }).then(() => {
        document.getElementById("roomLink").innerHTML = 
            `Your room: <a href="${roomLink}" target="_blank">${roomLink}</a>`;
    }).catch(error => {
        alert("⚠️ Failed to create room. Check Firestore rules.");
    });
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

    db.collection("rooms").doc(roomId).get().then(doc => {
        if (doc.exists) {
            let roomData = doc.data();
            document.getElementById("roomInfo").innerText = `Room ID: ${roomId} | Created by: ${roomData.creator}`;
            loadMessages(roomId); // Now loads messages in real-time
        } else {
            document.body.innerHTML = "<h1>⚠️ Room Not Found!</h1>";
        }
    }).catch(error => {
        alert("⚠️ Could not load room.");
    });
}

// Function to send a message
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
        alert("⚠️ Could not send message.");
    });
}

// Function to load messages in real-time
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

// Function to delete room (Only creator)
function deleteRoom() {
    let params = new URLSearchParams(window.location.search);
    let roomId = params.get("room");

    db.collection("rooms").doc(roomId).get().then(doc => {
        if (doc.exists) {
            let creator = doc.data().creator;
            let realUsername = prompt("Enter your real username to confirm deletion:");

            if (realUsername !== creator) {
                alert("⚠️ Only the creator can delete this room!");
                return;
            }

            db.collection("rooms").doc(roomId).delete().then(() => {
                alert("Room deleted!");
                window.location.href = "index.html";
            }).catch(error => {
                alert("⚠️ Could not delete room.");
            });
        }
    });
}

if (window.location.pathname.includes("room.html")) {
    loadRoom();
}

