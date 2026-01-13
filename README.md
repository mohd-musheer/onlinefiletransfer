⚡ QuickShare
Secure Real-Time Chat & Anonymous File Sharing
QuickShare is a lightweight, browser-based communication tool designed for users who value privacy and speed. Connect directly with others in private or group rooms to chat and share files without the need for accounts or long-term data storage.

Live Demo: https://onlinefiletransfer.onrender.com


(Note: Initial loading may take a minute as the server wakes up from sleep mode.)

🌟 Key Features
No Signup Required: Start chatting instantly by just entering a name.

Browser-to-Browser: Real-time messaging and file sharing powered by Socket.io.

Dual Room Modes:

Private: Strictly limited to 2 participants for one-on-one confidentiality.

Group: Share a room code with multiple people for collaborative sessions.

Secure File Transfer: Supports multiple file uploads with progress indicators.

Automatic Data Purge: For maximum security, all shared data and files are automatically deleted from the server every 10 minutes.

Modern UI: Features a sleek "Poppins" font interface with Dark Mode support and real-time typing indicators.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (with Flexbox/Grid), JavaScript (Vanilla)

Real-Time Engine: Socket.io

Icons: FontAwesome

Backend: Node.js / Express (hosted on Render)

🚀 How to Use
Enter your Name: Pick a temporary alias to identify yourself in the chat.

Join or Create a Room:

Enter a unique Room Code.

Select Private for a 1-on-1 session or Group for more participants.

Chat & Share: * Type messages in the input bar.

Click the Upload icon to select and send files (Supports images, PDFs, videos, etc.).

Download: Click the download icon on any received file to save it to your device.

🔒 Security & Privacy
QuickShare is built with a "Privacy First" philosophy:

Transient Storage: The server acts as a temporary relay.

10-Minute TTL (Time-To-Live): Files are not hosted indefinitely. Our automated system wipes the 500MB server buffer every 10 minutes, ensuring your data doesn't leave a permanent digital footprint.



Anonymous: No IP logging or user tracking is implemented.