import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('profilePhotoUrl');
    navigate('/');
  };

  // Clean up blob URLs when the component unmounts or messages change
  useEffect(() => {
    return () => {
      messages.forEach(message => {
        if (message.mediaUrl) {
          URL.revokeObjectURL(message.mediaUrl);
        }
      });
    };
  }, [messages]);

  return (
    <>
      <header className="chat__mainHeader">
        <p>Hangout with Friends</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) => {
          const profilePhotoUrl = message.profilePhotoUrl || 'default-profile.jpg';
          return (
            <div className="message__chats" key={message.id}>
              <div className="message__info">
                <p className="sender__name">{message.name}</p>
              </div>

              <div className={message.name === sessionStorage.getItem('userName') ? "message__sender" : "message__recipient"}>
                <p>{message.text}</p>
                
                {/* Handle media (image or video) */}
                {message.mediaUrl && (
                  <>
                    {message.mediaUrl.endsWith('.mp4') || message.mediaUrl.endsWith('.mov') ? (
                      <video src={message.mediaUrl} controls className="chat-media"></video>
                    ) : (
                      <img src={message.mediaUrl} alt="media" className="chat-media" />
                    )}
                  </>
                )}
                
                {/* Handle audio messages */}
                {message.audio && (
                  <div className="message__audio">
                    <audio controls>
                      <source src={message.audio} type="audio/ogg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChatBody;


