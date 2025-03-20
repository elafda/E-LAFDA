import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOIIAJ7hRSCS5Lh-rFApUI_0jn0gHdcFI",
    authDomain: "elafda-com.firebaseapp.com",
    projectId: "elafda-com",
    storageBucket: "elafda-com.firebasestorage.app",
    messagingSenderId: "887958270328",
    appId: "1:887958270328:web:5e8395470a7e4a3017188d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Store Firestore globally for other scripts
window.firebaseDB = db;

// Toggle Sidebar Menu
window.toggleMenu = function () {
    let sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
}

// Generate Anonymous Link
window.generateLink = function () {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    let uniqueID = Math.random().toString(36).substring(2, 10);
    let anonymousLink = `${window.location.origin}/msg.html?user=${encodeURIComponent(username)}&id=${uniqueID}`;

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
        await addDoc(collection(db, "messages"), {
            username: username,
            message: message,
            timestamp: serverTimestamp()
        });
        document.getElementById("status").innerText = "✅ Message sent!";
        document.getElementById("messageBox").value = "";
    } catch (error) {
        console.error("Error sending message:", error);
        document.getElementById("status").innerText = "❌ Error sending message!";
    }
};
