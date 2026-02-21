// --- socket.js ---
import {
    showScreen, showToast, DOM,
    displayNotification, displayMessage, displayFile,
    updateTypingIndicator, markMessageAsRead,
    scrollToBottom, hideLoading
} from './ui.js';

export const BACKEND_URL = 'https://backendchat-xngc.onrender.com';
export const socket = io(BACKEND_URL);

// Will be set by app.js
let currentRoomId = null;
let messageObserver = null;

export const setRoomState = (roomId, observer) => {
    currentRoomId = roomId;
    messageObserver = observer;
};

export const initializeSocketEvents = () => {
    socket.on('join-success', (joinedRoomId) => {
        hideLoading();
        currentRoomId = joinedRoomId;
        DOM.roomCodeDisplay.textContent = joinedRoomId;
        showScreen('chat');
        showToast(`Successfully joined room: ${joinedRoomId}`, 'success');

        // Setup observer if a function was passed from app (we can emit an event or just do it in app.js, for simplicity app will do it if we pass a callback, but we can also just expose currentRoomId)
    });

    socket.on('room-full', () => {
        hideLoading();
        DOM.errorMessage.textContent = 'This private room is full (2 people max).';
        DOM.errorMessage.classList.remove('hidden');
        showToast('Room is full!', 'error');
    });

    socket.on('room-type-mismatch', ({ existingType, attemptedType }) => {
        hideLoading();
        DOM.errorMessage.textContent = `Error: This is a ${existingType} room. You tried to join as ${attemptedType}.`;
        DOM.errorMessage.classList.remove('hidden');
        showToast('Room type mismatch.', 'error');
    });

    socket.on('user-joined', (joinedUsername) => {
        displayNotification(`${joinedUsername} has joined the chat.`);
        showToast(`${joinedUsername} joined`, 'info');
    });

    socket.on('user-left', (leftUsername) => {
        displayNotification(`${leftUsername || 'The other user'} has left the chat.`);
        showToast(`${leftUsername || 'User'} left`, 'info');
    });

    socket.on('chat-message', (data) => displayMessage(data, false, messageObserver));

    socket.on('typing', ({ senderName, isTyping }) => {
        updateTypingIndicator(isTyping, senderName);
    });

    socket.on('file-shared', (fileData) => {
        const tempMessage = document.getElementById(fileData.tempId);
        if (tempMessage) tempMessage.remove();
        displayFile(fileData, fileData.senderId === socket.id, BACKEND_URL);
        if (fileData.senderId !== socket.id) {
            showToast(`New file received: ${fileData.originalname}`, 'success');
        }
    });

    socket.on('read-receipt', (messageId) => {
        markMessageAsRead(messageId);
    });
};

export const uploadFile = async (file, fileSenderId) => {
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
    DOM.messagesArea.appendChild(div);
    scrollToBottom();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', currentRoomId);
    formData.append('senderId', socket.id);
    formData.append('tempId', tempId);

    try {
        const resp = await fetch(`${BACKEND_URL}/upload`, { method: 'POST', body: formData });
        if (!resp.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('File upload failed:', error);
        if (document.getElementById(tempId)) document.getElementById(tempId).remove();
        displayMessage({ message: `⚠️ ${file.name} upload failed.`, messageId: `err-${Date.now()}`, senderName: 'Error' }, true);
        showToast('Upload failed', 'error');
    }
};

export const getCurrentRoomId = () => currentRoomId;
