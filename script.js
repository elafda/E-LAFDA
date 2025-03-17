// script.js (for index.html)
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
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  async function createRoom() {
    const realUsername = document.getElementById('realUsername').value;
    if (!realUsername) {
      alert('Please enter your username');
      return;
    }
  
    const roomId = generateRoomId();
    const roomLink = `${window.location.origin}/room.html?id=${roomId}`;
    const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24h expiration
  
    try {
      await db.collection('rooms').doc(roomId).set({
        realUsername,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: expirationTime,
        active: true,
        messages: []
      });
  
      const linkDisplay = document.getElementById('roomLink');
      linkDisplay.innerHTML = `
        <p>Room created! Share this link:</p>
        <a href="${roomLink}" target="_blank">${roomLink}</a>
        <button onclick="copyLink('${roomLink}')">Copy Link</button>
        <div id="countdown"></div>
      `;
  
      startCountdown(expirationTime, document.getElementById('countdown'));
    } catch (error) {
      console.error('Error creating room:', error);
    }
  }
  
  function generateRoomId() {
    return 'room-' + Math.random().toString(36).substr(2, 9);
  }
  
  function copyLink(link) {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  }
  
  function startCountdown(expirationTime, element) {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = expirationTime - now;
  
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      element.innerHTML = `Link expires in: ${hours}h ${minutes}m ${seconds}s`;
  
      if (distance < 0) {
        clearInterval(timer);
        element.innerHTML = "LINK EXPIRED";
      }
    }, 1000);
  }
  
