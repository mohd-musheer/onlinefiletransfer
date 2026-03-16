# ⚡ QuickShare

**Secure Real-Time Chat & Anonymous File Sharing**

QuickShare is a lightweight, browser-based communication tool designed for users who value privacy, speed, and beautiful design. Connect directly with others in private or group rooms to chat and share files without the need for accounts or long-term data storage.

**Live:** [https://quickshare.work.gd](https://quickshare.work.gd)    

---

## 🌟 Key Features

*   **No Signup Required**: Start chatting instantly by just entering a name.
*   **Browser-to-Browser**: Real-time messaging and file sharing powered by Socket.io.
*   **Dual Room Modes**:
    *   **Private**: Strictly limited to 2 participants for one-on-one confidentiality.
    *   **Group**: Share a room code with multiple people for collaborative sessions.
*   **Secure File Transfer**: Supports multiple file uploads with progress indicators and automatic file-type icons.
*   **Clear Chat**: Instantly clear your local chat history with a single click.
*   **Toast Notifications**: Beautiful, non-intrusive alerts for system events and file downloads.
*   **Automatic Data Purge**: For maximum security, all shared data and files are automatically deleted from the server every 10 minutes.
*   **Premium Modern UI**: Features a sleek UI with glassmorphism, smooth animations, "Poppins" typography, and Dark Mode support.

---

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3 (Modern Variables, Flexbox), Vanilla JavaScript
*   **Real-Time Engine**: Socket.io
*   **Icons**: FontAwesome 6 (Vector Icons)
*   **Backend**: Node.js / Express (Hosted on Render)

---

## 🚀 How to Use

1.  **Enter your Name**: Pick a temporary alias to identify yourself in the chat.
2.  **Join or Create a Room**:
    *   Enter a unique Room Code.
    *   Select **Private** for a 1-on-1 session or **Group** for more participants.
3.  **Chat & Share**:
    *   Type messages in the input bar.
    *   Click the **Paperclip icon** to select and send files (Supports images, PDFs, videos, etc.).
4.  **Download**: Click the download icon on any received file to save it to your device.
5.  **Clear Chat**: Click the Trash icon in the header to clear your view.

---

## 🔒 Security & Privacy

QuickShare is built with a "Privacy First" philosophy:

*   **Transient Storage**: The server acts as a temporary relay.
*   **10-Minute TTL (Time-To-Live)**: Files are not hosted indefinitely. Our automated system wipes the server buffer every 10 minutes, ensuring your data doesn't leave a permanent digital footprint.
*   **Anonymous**: No IP logging or user tracking is implemented.
