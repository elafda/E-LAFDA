// Import Firestore functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to send a message
async function sendMessage() {
    let message = document.getElementById("messageBox").value.trim();

    if (message === "") {
        alert("Message cannot be empty!");
        return;
    }

    try {
        // Add a new document to the 'messages' collection
        await addDoc(collection(db, "messages"), {
            message: message, // Store the message content
            timestamp: serverTimestamp() // Automatically set the timestamp
        });
        document.getElementById("status").innerText = "✅ Message sent!";
        document.getElementById("messageBox").value = ""; // Clear the message box
    } catch (error) {
        console.error("Error sending message:", error);
        document.getElementById("status").innerText = "❌ Error sending message!";
    }
}

// Function to display received messages
function displayReceivedMessages() {
    const q = query(collection(db, "messages")); // Retrieve all messages
    onSnapshot(q, (snapshot) => {
        let messages = snapshot.docs.map(doc => `<p>📩 ${doc.data().message}</p>`).join("");
        document.getElementById("receivedMessages").innerHTML = messages || "No messages received yet.";
    });
}

// Call this function when the page loads to display messages
document.addEventListener("DOMContentLoaded", displayReceivedMessages);

// Toggle Messages Panel
window.toggleMessagesPanel = function () {
    const panel = document.getElementById("messagesPanel");
    if (panel.style.right === "0px") {
        panel.style.right = "-400px"; // Hide the panel
    } else {
        panel.style.right = "0px"; // Show the panel
    }
}