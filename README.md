

# TalkSphere - Real-time Chat Application

**TalkSphere** is a feature-rich chat application enabling real-time communication using WebSockets. Built with modern web technologies, it supports media uploads (images, videos, and audio), message storage, and user profiles with custom avatars.

## Key Features:
- **Real-Time Messaging:** Using Socket.io to enable seamless real-time chat between multiple users.
- **Media Support:** Users can send images, videos, and audio messages in the chat. 
- **File Uploads:** Users can upload profile photos and media attachments in messages, handled by Multer on the backend.
- **Audio Recording:** Includes an in-browser audio recording feature for sending voice messages directly in the chat.
- **User Profiles:** Each user can join the chat with a custom username and avatar.
- **Responsive Design:** The UI is built to be user-friendly and adapts across various devices.
- **Secure Communication:** Security measures are in place to ensure data integrity, though additional layers (e.g., encryption) can be integrated for full production deployment.

## Tech Stack:
- **Frontend:** React.js (Vite)
- **Backend:** Node.js with Express
- **Real-Time Communication:** Socket.io
- **Database:** MongoDB (to store usernames and messages)
- **File Handling:** Multer for file uploads
- **Styling:** Bootstrap for a clean and responsive UI design

## Setup Instructions:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/viveksharma2508/talksphere.git
   cd talksphere
   ```

2. **Install dependencies:**
   - For the frontend:
     ```bash
     cd client
     npm install
     ```
   - For the backend:
     ```bash
     cd server
     npm install
     ```

3. **Configure the backend:**
   - Add your MongoDB URI in the `server/.env` file:
     ```bash
     MONGO_URI=mongodb://localhost:27017/talksphere
     ```

4. **Run the app:**
   - **Frontend (Vite server):**
     ```bash
     cd client
     npm run dev
     ```
   - **Backend (Node.js server):**
     ```bash
     cd server
     npm start
     ```

5. **Open the app:**
   Navigate to `http://localhost:5173` in your browser to start chatting.

## Functionalities

### 1. Real-Time Chat
Messages are exchanged in real-time using Socket.io, ensuring that all connected users see messages instantly.

### 2. Media and File Uploads
Users can send images, videos, and audio clips directly in the chat. For example, a user can upload a `.jpg`, `.jpg`, `.mp4`, or even record audio messages.

- **Images & Videos:**
  ![Image Example](./ScreenShots/Screenshot%20(172).jpg)
  ![Video Example](./ScreenShots/Screenshot%20(174).jpg)

- **Audio Recording:**
  The app provides an option for in-browser audio recording. Users can start and stop recording, and the message gets transmitted in `.ogg` format.
  
  ![Audio Example](./screenshots/audio-example.jpg)

### 3. User Profiles
Upon joining, users can choose a username and optionally upload a profile photo.


### 4. Audio Recording Feature
Users can record audio directly in the chat interface. Once the recording is stopped, the message is sent as an audio file.
  
![Audio Recording Example](![Chat Layout](./ScreenShots/Screenshot%20(173).jpg))

### 5. Leave Chat
Users can leave the chat anytime by clicking the 'Leave Chat' button, which also clears session data.

## Issues Fixed:
- **Media Upload Error:** Fixed `Security Error` related to uploading blobs.
- **WebSocket Communication:** Debugged WebSocket issues where messages were not displaying correctly.
- **Undefined Variables:** Addressed cases where `currentUser` or `userName` was undefined, resulting in chat display issues.



## How to Contribute:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## Contact Information:
For any questions, suggestions, or issues, feel free to open an issue or reach out directly on GitHub.

---

