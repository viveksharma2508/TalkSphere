import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (data) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === data.id)) {
          console.log('Received message:', data);
          return [...prevMessages, data];
        }
        return prevMessages;
      });
    });

    // Cleanup listener on unmount
    return () => {
      socket.off('message');
    };
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody messages={messages} />
        <ChatFooter socket={socket} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default ChatPage;



