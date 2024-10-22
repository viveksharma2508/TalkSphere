import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import { io } from "socket.io-client";
import { Button } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import MicIcon from '@mui/icons-material/Mic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';


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
      <label className="attach__btn" style={{ cursor: 'pointer', textAlign: 'center' }}>
          <UploadFileOutlinedIcon style={{ fontSize: 35, color: '#00000', marginTop:'10px' }} /> 
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*, video/*"
            style={{ display: 'none' }} 
          />
        </label>
        {file && <span className="file-name">{file.name}</span>}

        {/* Audio recording button */}
        {/* Audio recording button */}
        <button
          className="audioBtn"
          type="button"
          onClick={handleAudioRecording}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }} // Remove default button styles
        >
          {isRecording ? (
            <GraphicEqIcon style={{ color: '#000000', fontSize: 30 }} /> // When recording, show GraphicEqIcon
          ) : (
            <MicIcon style={{ color: '#000000', fontSize: 30 }} /> // Default, show MicIcon
          )}
        </button>

        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
         <Button type="submit" className="sendBtn" variant="filled" endIcon={<SendIcon style = {{color :"#0b57d0", fontSize: 30}}/>}></Button>
      </form>
    </div>
  );
};

export default ChatFooter;
