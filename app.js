// --- app.js ---
import { forceDownload } from './utils.js';
import {
    DOM, showScreen, showToast,
    displayMessage, showLoading, hideLoading
} from './ui.js';
import {
    socket, initializeSocketEvents, setRoomState,
    getCurrentRoomId, uploadFile
} from './socket.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let username = null;
    let typingTimeout = null;
    let messageObserver = null;

    // --- Init Socket Events ---
    initializeSocketEvents();

    // --- Intersection Observer for Read Receipts ---
    messageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const messageEl = entry.target;
                const messageId = messageEl.id;
                if (messageEl.classList.contains('received') && !messageEl.dataset.seen) {
                    socket.emit('message-seen', { roomId: getCurrentRoomId(), messageId });
                    messageEl.dataset.seen = 'true';
                    messageObserver.unobserve(messageEl);
                }
            }
        });
    }, { threshold: 0.8 });

    // Inform socket about our observer so it can pass to incoming messages
    socket.on('join-success', (joinedRoomId) => {
        setRoomState(joinedRoomId, messageObserver);
    });

    // --- Theme Init ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        DOM.themeToggle.checked = true;
    }
    DOM.themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', DOM.themeToggle.checked ? 'dark' : 'light');
    });

    // --- Event Listeners ---
    DOM.nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        username = DOM.nameInput.value.trim();
        if (username) {
            DOM.welcomeMessage.textContent = `Welcome, ${username}!`;
            showScreen('home');
        }
    });

    const joinRoom = (roomId, type) => {
        if (roomId) {
            DOM.errorMessage.classList.add('hidden');
            showLoading(); // Show loader when attempting connection
            setTimeout(() => { // small delay for visual feedback if connection is instant
                socket.emit('join-room', { roomId, username, roomType: type });
            }, 300);
        }
    };

    DOM.joinPrivateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        joinRoom(DOM.privateRoomIdInput.value.trim(), 'private');
    });

    DOM.joinGroupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        joinRoom(DOM.groupRoomIdInput.value.trim(), 'group');
    });

    DOM.messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = DOM.messageInput.value.trim();
        const roomId = getCurrentRoomId();
        if (message && roomId) {
            const messageId = `msg-${Date.now()}`;
            displayMessage({ message, messageId, senderName: 'You' }, true);
            socket.emit('chat-message', { roomId, message, messageId });
            DOM.messageInput.value = '';
            socket.emit('typing', { roomId, isTyping: false });
        }
    });

    DOM.fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            for (const file of files) {
                uploadFile(file);
            }
        }
        e.target.value = '';
    });

    DOM.messageInput.addEventListener('input', () => {
        const roomId = getCurrentRoomId();
        if (roomId) {
            clearTimeout(typingTimeout);
            socket.emit('typing', { roomId, isTyping: true });
            typingTimeout = setTimeout(() => socket.emit('typing', { roomId, isTyping: false }), 2000);
        }
    });

    // Delegate clicks for downloads
    DOM.messagesArea.addEventListener('click', (e) => {
        const downloadBtn = e.target.closest('.download-btn');
        if (downloadBtn) {
            e.preventDefault();
            const url = downloadBtn.dataset.url;
            const filename = downloadBtn.dataset.filename;
            forceDownload(url, filename, showToast);
        }
    });

    DOM.clearChatBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear the chat history locally?")) {
            DOM.messagesArea.innerHTML = '';
            showToast('Chat cleared locally.', 'success');
        }
    });

    // --- Initial Setup ---
    hideLoading();
    showScreen('name');
});
