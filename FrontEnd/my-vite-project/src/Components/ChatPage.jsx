
// src/Components/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { getMessages } from '../lib/api';

const ChatPage = ({ socket, user, onLogout }) => {
  const [users, setUsers] = useState([]);     // active others
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchedMessages = await getMessages(token);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  // Attach socket listeners once socket exists
  useEffect(() => {
    if (!socket) return;

    const onMessage = (data) => {
      setMessages((prev) => {
        const id = data.id || data._id || data.tempId;
        if (id && prev.some(m => (m.id || m._id || m.tempId) === id)) return prev;
        return [...prev, data];
      });
    };

    const onUsers = (list) => setUsers(Array.isArray(list) ? list : []);

    socket.on('message', onMessage);
    socket.on('users:update', onUsers);
    socket.emit?.('users:list'); // optional: fetch initial users

    return () => {
      socket.off('message', onMessage);
      socket.off('users:update', onUsers);
    };
  }, [socket]);

  // Guard UI until both are ready
  if (!socket) return <div className="chat">Connecting…</div>;
  if (!user)   return <div className="chat">Loading account…</div>;

  return (
    <div className="chat">
      <ChatBar socket={socket} user={user} users={users} onLogout={onLogout} />
      <div className="chat__main">
        <ChatBody messages={messages} socket={socket} user={user} onLeave={onLogout} />
        <ChatFooter socket={socket} user={user} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default ChatPage;
