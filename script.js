import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/esm-browser/v4.js';

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
const db = getFirestore(app);

const generateLinkBtn = document.getElementById('generateLinkBtn');
const linkContainer = document.getElementById('linkContainer');
const anonymousLink = document.getElementById('anonymousLink');
const messageContainer = document.getElementById('messageContainer');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const messageList = document.getElementById('messageList');
const messageIcon = document.getElementById('messageIcon');

// Generate a unique identifier for the user
let userId = uuidv4();

// Generate the anonymous link
generateLinkBtn.addEventListener('click', () => {
    const link = `${window.location.origin}/message.html?id=${userId}`;
    anonymousLink.textContent = link;
    linkContainer.classList.remove('hidden');
    messageContainer.classList.remove('hidden');
});

// Send anonymous message
sendMessageBtn.addEventListener('click', async () => {
    const message = messageInput.value;
    if (message) {
        try {
            await addDoc(collection(db, 'anon_messages'), {
                message: message,
                timestamp: new Date(),
                userId: userId // Store the userId with the message
            });
            messageInput.value = ''; // Clear the input
            alert("Message sent!");
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Error sending message.");
        }
    } else {
        alert("Please enter a message.");
    }
});

// Load messages for the user
async function loadMessages() {
    const q = query(collection(db, 'anon_messages'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        const li = document.createElement('li');
        li.textContent = `${messageData.message} (Received at: ${messageData.timestamp.toDate().toLocaleString()})`;
        messageList.appendChild(li);
    });
}

// Show messages when the message icon is clicked
messageIcon.addEventListener('click', () => {
    messages.classList.toggle('hidden');
    if (!messages.classList.contains('hidden')) {
        loadMessages();
    }
});