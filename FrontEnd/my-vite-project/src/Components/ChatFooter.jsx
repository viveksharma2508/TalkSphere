
// src/Components/ChatFooter.jsx
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  IconButton,
  Tooltip,
  InputBase,
  Paper,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import MicIcon from '@mui/icons-material/Mic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const fileToBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function ChatFooter({ socket, user, setMessages }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioMessage, setAudioMessage] = useState(null);
  const fileInputRef = useRef(null);

  const disabled = !user || !socket?.connected || (!message.trim() && !file && !audioMessage);

  const handleFileChange = (e) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAudioRecording = async () => {
    if (isRecording) {
      mediaRecorder?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      setMediaRecorder(rec);
      let chunks = [];
      rec.ondataavailable = (ev) => chunks.push(ev.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg' });
        const r = new FileReader();
        r.onloadend = () => setAudioMessage(r.result);
        r.readAsDataURL(blob);
        chunks = [];
      };
      rec.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Audio capture failed:', e);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    if (!socket?.connected || !user) return;
    if (!message.trim() && !file && !audioMessage) return;

    // upload (best-effort)
    let attachmentUrl = null;
    try {
      if (file) {
        const b64 = await fileToBase64(file);
        const up = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: b64, fileName: file.name || 'upload' }),
        });
        if (up.ok) {
          const data = await up.json();
          attachmentUrl = data.photoUrl || data.thumbnailUrl || null;
        }
      }
    } catch (e) {
      console.warn('Upload failed (non-blocking):', e.message);
    }

    const msg = {
      id: uuidv4(),
      text: message.trim() || null,
      attachmentUrl,
      audio: audioMessage || null,
      senderId: user._id,
      sender: { _id: user._id, username: user.username, photoUrl: user.photoUrl || null },
      createdAt: new Date().toISOString(),
    };

    // optimistic UI
    setMessages((prev) => [...prev, msg]);
    socket.emit('message', msg);

    setMessage('');
    clearFile();
    setAudioMessage(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat__footer">
      <Paper
        component="form"
        onSubmit={handleSendMessage}
        elevation={0}
        className="footer__bar"
        sx={{
          display: 'grid',
          gridTemplateColumns: '40px 40px 1fr 44px',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderRadius: 2,
          border: '1px solid #e9e3d6',
          backgroundColor: '#fff',
        }}
      >
        {/* Upload */}
        <Tooltip title={file ? 'Change file' : 'Attach'}>
          <IconButton
            size="small"
            className="icon-btn"
            onClick={() => fileInputRef.current?.click()}
            sx={{ width: 40, height: 40, borderRadius: 1.25 }}
          >
            <UploadFileOutlinedIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Mic / Recording */}
        <Tooltip title={isRecording ? 'Stop recording' : 'Record voice'}>
          <IconButton
            size="small"
            className="icon-btn"
            onClick={handleAudioRecording}
            color={isRecording ? 'error' : 'default'}
            sx={{ width: 40, height: 40, borderRadius: 1.25 }}
          >
            {isRecording ? <GraphicEqIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>

        {/* Message input + file chip inline */}
        <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {file && (
            <Chip
              size="small"
              color="default"
              label={file.name}
              onDelete={clearFile}
              deleteIcon={<CloseIcon />}
              sx={{ maxWidth: 220 }}
            />
          )}
          <InputBase
            placeholder="Write message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            className="message"
            sx={{
              flex: 1,
              px: 1.5,
              py: 1,
              border: '1px solid #e9e3d6',
              borderRadius: 1.25,
            }}
          />
        </div>

        {/* Send */}
        <Tooltip title="Send">
          <span>
            <IconButton
              type="submit"
              disabled={disabled}
              color="primary"
              sx={{
                width: 44,
                height: 40,
                borderRadius: 1.25,
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>
    </div>
  );
}
