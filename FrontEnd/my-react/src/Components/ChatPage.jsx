import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { io } from 'socket.io-client';

const ChatPage = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        // Listen for incoming messages
        newSocket.on('message', (data) => {
            setMessages((prevMessages) => {
                // Prevent adding duplicate messages based on unique id
                if (!prevMessages.some(msg => msg.id === data.id)) {
                    console.log('Received message:', data);
                    return [...prevMessages, data];
                }
                return prevMessages;
            });
        });

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <div className="chat">
            {socket ? <ChatBar socket={socket} /> : <p>Connecting...</p>}
            <div className="chat__main">
                <ChatBody messages={messages} />
                <ChatFooter socket={socket} setMessages={setMessages} />
            </div>
        </div>
    );
};

export default ChatPage;
