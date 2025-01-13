import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import ChatPage from './Components/ChatPage';
import { io } from 'socket.io-client';

const App = () => {
  const socket = io('http://localhost:3000'); // Adjust your server URL as needed

  return (
    <Router basename="/"> {/* Add basename prop */}
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/chat" element={<ChatPage socket={socket} />} />
      </Routes>
    </Router>
  );
};

export default App;