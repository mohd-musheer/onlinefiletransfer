// --- ui.js ---
import { formatFileSize, getFileIcon } from './utils.js';

// --- DOM Elements ---
export const DOM = {
    screens: {
        name: document.getElementById('name-screen'),
        home: document.getElementById('home-screen'),
        chat: document.getElementById('chat-screen')
    },
    nameForm: document.getElementById('name-form'),
    nameInput: document.getElementById('name-input'),
    welcomeMessage: document.getElementById('welcome-message'),
    joinPrivateForm: document.getElementById('join-private-form'),
    privateRoomIdInput: document.getElementById('private-room-id-input'),
    joinGroupForm: document.getElementById('join-group-form'),
    groupRoomIdInput: document.getElementById('group-room-id-input'),
    errorMessage: document.getElementById('error-message'),
    roomCodeDisplay: document.getElementById('room-code-display'),
    messagesArea: document.getElementById('messages-area'),
    messageForm: document.getElementById('message-form'),
    messageInput: document.getElementById('message-input'),
    fileInput: document.getElementById('file-input'),
    typingIndicator: document.getElementById('typing-indicator'),
    themeToggle: document.getElementById('theme-toggle'),
    clearChatBtn: document.getElementById('clear-chat-btn'),
    toastContainer: document.getElementById('toast-container'),
    loadingOverlay: document.getElementById('loading-overlay')
};

// --- Show/Hide Screens ---
export const showScreen = (screenName) => {
    Object.values(DOM.screens).forEach(screen => screen.classList.add('hidden'));
    DOM.screens[screenName].classList.remove('hidden');
};

export const showLoading = () => DOM.loadingOverlay.classList.remove('hidden');
export const hideLoading = () => DOM.loadingOverlay.classList.add('hidden');

// --- Toast Notifications ---
export const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// --- Chat Display Logic ---
export const scrollToBottom = () => DOM.messagesArea.scrollTop = DOM.messagesArea.scrollHeight;

export const displayNotification = (text) => {
    const div = document.createElement('div');
    div.classList.add('notification');
    div.textContent = text;
    DOM.messagesArea.appendChild(div);
    scrollToBottom();
};

export const displayMessage = ({ message, messageId, senderName }, isSent, messageObserver = null) => {
    const div = document.createElement('div');
    div.id = messageId;
    div.classList.add('message', isSent ? 'sent' : 'received');
    const statusIcon = isSent ? `<div class="message-status"><i class="fas fa-check"></i></div>` : '';
    div.innerHTML = `
        <p class="sender-name">${senderName}</p>
        <div class="message-bubble">
            <span>${message}</span>
            ${statusIcon}
        </div>
    `;
    DOM.messagesArea.appendChild(div);

    if (!isSent && messageObserver) {
        messageObserver.observe(div);
    }
    scrollToBottom();
};

export const displayFile = ({ originalname, mimetype, size, path, senderName }, isSent, BACKEND_URL) => {
    const fileLink = `${BACKEND_URL}${path}`;
    const div = document.createElement('div');
    div.classList.add('message', isSent ? 'sent' : 'received');

    div.innerHTML = `
        <p class="sender-name">${senderName}</p>
        <div class="message-bubble">
            <div class="file-message">
                <i class="file-icon ${getFileIcon(mimetype)}"></i>
                <div class="file-info">
                    <p title="${originalname}">${originalname}</p>
                    <span class="file-size">${formatFileSize(size)}</span>
                </div>
                <a href="#" data-url="${fileLink}" data-filename="${originalname}" class="download-btn" title="Download">
                    <img src="download.svg" alt="Download" style="width: 20px; height: 20px;">
                </a>
            </div>
        </div>`;
    DOM.messagesArea.appendChild(div);
    scrollToBottom();
};

export const updateTypingIndicator = (isTyping, senderName) => {
    DOM.typingIndicator.textContent = isTyping ? `${senderName} is typing...` : '';
};

export const markMessageAsRead = (messageId) => {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        const statusIcon = messageEl.querySelector('.message-status i');
        if (statusIcon) {
            statusIcon.classList.remove('fa-check');
            statusIcon.classList.add('fa-check-double', 'read');
        }
    }
};
