// room.js (for room.html)
const firebaseConfig = {
    apiKey: "AIzaSyBPpZ-SA5lVYCauRkVOzqDA6MjKB7OQodI",
    authDomain: "e-lafda-2a24c.firebaseapp.com",
    projectId: "e-lafda-2a24c",
    storageBucket: "e-lafda-2a24c.firebasestorage.app",
    messagingSenderId: "263237488063",
    appId: "1:263237488063:web:70db3731e500a9e9c6250a",
    measurementId: "G-H53HVJ9BX6"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id');
let anonymousUserId = generateAnonymousId();

function generateAnonymousId() {
  return 'anon-' + Math.random().toString(36).substr(2, 9);
}

async function checkRoomValidity() {
  const roomDoc = await db.collection('rooms').doc(roomId).get();
  if (!roomDoc.exists || !roomDoc.data().active || roomDoc.data().expiresAt < Date.now()) {
    document.getElementById('chatContainer').innerHTML = `
      <h2>Room Expired or Invalid</h2>
      <p>This debate room is no longer available</p>
    `;
    return false;
  }
  return true;
}

function initChat() {
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const messagesContainer = document.getElementById('messages');

  // Real-time listener for messages
  db.collection('rooms').doc(roomId).collection('messages')
    .orderBy('timestamp')
    .onSnapshot(snapshot => {
      messagesContainer.innerHTML = '';
      snapshot.forEach(doc => {
        const message = doc.data();
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
          <span class="anon-id">${message.anonymousId}</span>
          <p>${message.text}</p>
          <span class="timestamp">${new Date(message.timestamp?.toDate()).toLocaleTimeString()}</span>
        `;
        messagesContainer.appendChild(messageElement);
      });
    });

  sendButton.addEventListener('click', async () => {
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    try {
      await db.collection('rooms').doc(roomId).collection('messages').add({
        text: messageText,
        anonymousId: anonymousUserId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      messageInput.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
}

// Social Sharing Functions
function shareToWhatsApp() {
  const message = `Join the anonymous debate: ${window.location.href}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
}

function shareToTwitter() {
  const text = `Join this anonymous debate room! ${window.location.href}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
}

function shareToInstagram() {
  alert('Copy the link and paste in your Instagram story: ' + window.location.href);
}

// Initialize room
(async () => {
  const isValid = await checkRoomValidity();
  if (isValid) {
    initChat();
    document.getElementById('shareButtons').style.display = 'flex';
  }
})();
