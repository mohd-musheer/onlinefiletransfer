document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT: Replace with your Render backend URL ---
    const BACKEND_URL = 'https://backendchat-yzbp.onrender.com';
    const socket = io(BACKEND_URL);

    // --- State Variables ---
    let username = null;
    let currentRoomId = null;
    let typingTimeout = null;

    // --- DOM Elements ---
    const screens = {
        name: document.getElementById('name-screen'),
        home: document.getElementById('home-screen'),
        chat: document.getElementById('chat-screen')
    };
    const nameForm = document.getElementById('name-form');
    const nameInput = document.getElementById('name-input');
    const welcomeMessage = document.getElementById('welcome-message');
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomForm = document.getElementById('join-room-form');
    const roomIdInput = document.getElementById('room-id-input');
    const errorMessage = document.getElementById('error-message');
    const roomCodeDisplay = document.getElementById('room-code-display');
    const messagesArea = document.getElementById('messages-area');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');

    // --- Screen Management ---
    const showScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    };

    // --- Theme Switcher ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
    });

    // --- Event Listeners ---
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        username = nameInput.value.trim();
        if (username) {
            welcomeMessage.textContent = `Welcome, ${username}!`;
            showScreen('home');
        }
    });

    createRoomBtn.addEventListener('click', () => {
        socket.emit('create-room', username);
    });

    joinRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomId = roomIdInput.value.trim();
        if (roomId) {
            socket.emit('join-room', { roomId, username });
        }
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            displayMessage({ message, senderName: 'You' }, true);
            socket.emit('chat-message', { roomId: currentRoomId, message });
            messageInput.value = '';
            socket.emit('typing', { roomId: currentRoomId, isTyping: false });
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
        }
        e.target.value = '';
    });

    messageInput.addEventListener('input', () => {
        clearTimeout(typingTimeout);
        socket.emit('typing', { roomId: currentRoomId, isTyping: true });
        typingTimeout = setTimeout(() => {
            socket.emit('typing', { roomId: currentRoomId, isTyping: false });
        }, 2000);
    });

    // --- Socket.IO Event Handlers ---
    socket.on('room-created', (roomId) => {
        currentRoomId = roomId;
        roomCodeDisplay.textContent = roomId;
        showScreen('chat');
        displayNotification(`Room created. Share this code: ${roomId}`);
    });

    socket.on('join-success', () => {
        currentRoomId = roomIdInput.value.trim();
        roomCodeDisplay.textContent = currentRoomId;
        showScreen('chat');
    });

    socket.on('room-full', () => {
        errorMessage.textContent = 'This room is full (2 people max).';
        errorMessage.classList.remove('hidden');
    });

    socket.on('user-joined', (joinedUsername) => {
        displayNotification(`${joinedUsername} has joined the chat.`);
    });

    socket.on('user-left', (leftUsername) => {
        displayNotification(`${leftUsername} has left the chat.`);
    });
    
    socket.on('chat-message', (data) => displayMessage(data, false));

    socket.on('file-shared', (fileData) => {
        const tempMessage = document.getElementById(fileData.tempId);
        if (tempMessage) {
            tempMessage.remove();
        }
        displayFile(fileData, fileData.senderId === socket.id);
    });

    socket.on('typing', ({ senderName, isTyping }) => {
        typingIndicator.textContent = isTyping ? `${senderName} is typing...` : '';
    });

    // --- Helper Functions ---
    const scrollToBottom = () => messagesArea.scrollTop = messagesArea.scrollHeight;

    const displayNotification = (text) => {
        const div = document.createElement('div');
        div.classList.add('notification');
        div.textContent = text;
        messagesArea.appendChild(div);
        scrollToBottom();
    };

    const displayMessage = ({ message, senderName }, isSent) => {
        const div = document.createElement('div');
        div.classList.add('message', isSent ? 'sent' : 'received');
        div.innerHTML = `
            <p class="sender-name">${senderName}</p>
            <div class="message-bubble">${message}</div>
        `;
        messagesArea.appendChild(div);
        scrollToBottom();
    };

    const displayFile = ({ originalname, mimetype, size, path, senderName }, isSent) => {
        const fileLink = `${BACKEND_URL}${path}`;
        const div = document.createElement('div');
        div.classList.add('message', isSent ? 'sent' : 'received');
        div.innerHTML = `
            <p class="sender-name">${senderName}</p>
            <div class="message-bubble">
                <div class="file-message">
                    <i class="file-icon ${getFileIcon(mimetype)}"></i>
                    <div class="file-info">
                        <p>${originalname}</p>
                        <span class="file-size">${formatFileSize(size)}</span>
                    </div>
                    <a href="${fileLink}" target="_blank" download="${originalname}" class="download-btn" title="Download">
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            </div>`;
        messagesArea.appendChild(div);
        scrollToBottom();
    };

    const uploadFile = async (file) => {
        const tempId = `temp-${Date.now()}`;
        const div = document.createElement('div');
        div.id = tempId;
        div.classList.add('message', 'sent');
        div.innerHTML = `
            <p class="sender-name">You</p>
            <div class="message-bubble">
                <div class="file-message">
                    <div class="loader"></div>
                    <div class="file-info">
                        <p>Uploading ${file.name}...</p>
                    </div>
                </div>
            </div>`;
        messagesArea.appendChild(div);
        scrollToBottom();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', currentRoomId);
        formData.append('senderId', socket.id);
        formData.append('tempId', tempId);

        try {
            await fetch(`${BACKEND_URL}/upload`, { method: 'POST', body: formData });
        } catch (error) {
            console.error('File upload failed:', error);
            const tempMessage = document.getElementById(tempId);
            if (tempMessage) tempMessage.remove();
            displayMessage({ message: '⚠️ File upload failed.', senderName: 'Error' }, true);
        }
    };
    
    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return 'fa-solid fa-file-image';
        if (mimeType.startsWith('video/')) return 'fa-solid fa-file-video';
        if (mimeType === 'application/pdf') return 'fa-solid fa-file-pdf';
        if (mimeType.startsWith('audio/')) return 'fa-solid fa-file-audio';
        return 'fa-solid fa-file';
    };
    
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // --- Initial Setup ---
    showScreen('name');
});
