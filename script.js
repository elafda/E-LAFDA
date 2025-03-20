import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPpZ-SA5lVYCauRkVOzqDA6MjKB7OQodI",
    authDomain: "e-lafda-2a24c.firebaseapp.com",
    projectId: "e-lafda-2a24c",
    storageBucket: "e-lafda-2a24c.firebasestorage.app",
    messagingSenderId: "263237488063",
    appId: "1:263237488063:web:70db3731e500a9e9c6250a",
    measurementId: "G-H53HVJ9BX6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Store Firestore globally for other scripts
window.firebaseDB = db;

// Toggle Sidebar Menu
window.toggleMenu = function () {
    let sidebar = document.getElementById("sidebar");
    sidebar.style.left = (sidebar.style.left === "0px" || sidebar.style.left === "") ? "-250px" : "0px";
}

// Generate Anonymous Link
window.generateLink = function () {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    let uniqueID = Math.random().toString(36).substring(2, 10);
    let anonymousLink = `msg.html?user=${encodeURIComponent(username)}&id=${uniqueID}`;

    document.getElementById("linkOutput").innerHTML = `
        <p>Your Anonymous Link:</p>
        <a href="${anonymousLink}" target="_blank">${anonymousLink}</a>
    `;
}

// Send Message (For `msg.html`)
window.sendMessage = async function () {
    let message = document.getElementById("messageBox").value.trim();
    if (message === "") {
        alert("Message cannot be empty!");
        return;
    }

    let username = new URLSearchParams(window.location.search).get("user") || "Anonymous";

    try {
        // Attempt to add the message to Firestore
        await addDoc(collection(db, "messages"), {
            username: username,
            message: message,
            timestamp: serverTimestamp()
        });
        // If successful, update the status
        document.getElementById("status").innerText = "✅ Message sent!";
        document.getElementById("messageBox").value = "";
    } catch (error) {
        // If there is an error, log it and update the status
        console.error("Error sending message:", error);
        document.getElementById("status").innerText = "❌ Error sending message!";
    }
};