import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import { io } from "socket.io-client";

let socket = io("http://localhost:3000", {
  transports: ['websocket'],
  upgrade: false
});

const ChatFooter = ({ setMessages }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioMessage, setAudioMessage] = useState(null); // Store audio message

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    if ((message.trim() || file || audioMessage) && sessionStorage.getItem('userName')) {
      let mediaUrl = null;
  
      if (file) {
        const formData = new FormData();
        formData.append('profilePhoto', file);
  
        try {
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            const result = await response.json();
            mediaUrl = result.photoUrl; // This is the server's file URL
          } else {
            console.error('Error uploading file');
          }
        } catch (error) {
          console.error('File upload failed:', error);
        }
      }
  
      const newMessage = {
        text: message.trim() || null,
        name: sessionStorage.getItem('userName'),
        id: uuidv4(),
        socketID: socket.id,
        mediaUrl,  // Use the URL returned by the server
        audio: audioMessage || null,  // Send audio message if available
      };
  
      socket.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      setFile(null);
      setAudioMessage(null);
    }
  };
  

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    } else {
      console.log("No file selected.");
    }
  };

  const handleAudioRecording = () => {
    if (isRecording) {
      console.log("Stopping recording...");
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      console.log("Starting recording...");
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          let audioChunks = [];

          recorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
            console.log("Audio chunk received:", event.data);
          };

          recorder.onstop = () => {
            console.log("Recording stopped, processing audio...");
            const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' });
            const fileReader = new FileReader();

            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = () => {
              const base64String = fileReader.result;
              console.log("Audio processed:", base64String);
              setAudioMessage(base64String); // Store audio message in state
            };

            audioChunks = []; // Reset after sending
            console.log("Audio chunks reset.");
          };

          recorder.start();
          console.log("Recording started.");
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error capturing audio:", error);
        });
    }
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <label className="attach__btn">
          Attach
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*, video/*"
            style={{ display: 'none' }} 
          />
        </label>
        {file && <span className="file-name">{file.name}</span>}

         {/* Audio recording button */}
         <button className="audioBtn" type="button" onClick={handleAudioRecording}>
            {isRecording ? 'Stop Recording' : 'Record Audio'}
         </button>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
