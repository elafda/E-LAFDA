// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyCOIIAJ7hRSCS5Lh-rFApUI_0jn0gHdcFI",
    authDomain: "elafda-com.firebaseapp.com",
    projectId: "elafda-com",
    storageBucket: "elafda-com.firebasestorage.app",
    messagingSenderId: "887958270328",
    appId: "1:887958270328:web:5e8395470a7e4a3017188d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Toggle Sidebar Menu (For index.html)
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
