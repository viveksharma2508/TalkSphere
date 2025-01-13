import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import MicIcon from '@mui/icons-material/Mic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

const ChatFooter = ({ socket, setMessages }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioMessage, setAudioMessage] = useState(null);

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
            mediaUrl = result.photoUrl;
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
        mediaUrl,
        audio: audioMessage || null,
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
    }
  };

  const handleAudioRecording = () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          let audioChunks = [];

          recorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' });
            const fileReader = new FileReader();

            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = () => {
              setAudioMessage(fileReader.result);
            };

            audioChunks = [];
          };

          recorder.start();
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
          <UploadFileOutlinedIcon style={{ fontSize: 35 }} />
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*, video/*"
            style={{ display: 'none' }}
          />
        </label>
        {file && <span className="file-name">{file.name}</span>}

        <button type="button" onClick={handleAudioRecording} className="audioBtn">
          {isRecording ? <GraphicEqIcon style={{ fontSize: 30 }} /> : <MicIcon style={{ fontSize: 30 }} />}
        </button>

        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" className="sendBtn" variant="filled" endIcon={<SendIcon style={{ fontSize: 30 }} />} />
      </form>
    </div>
  );
};

export default ChatFooter;
