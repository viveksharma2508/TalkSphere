import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, socket, onLeave }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
  try { socket?.emit?.('users:leave'); } catch {}
  onLeave?.();                         // clears token and disconnects in App
  navigate('/login', { replace: true });
}; // [3][2]


  // Clean up blob URLs only
  useEffect(() => {
    return () => {
      messages.forEach((m) => {
        if (m?.attachmentUrl && typeof m.attachmentUrl === 'string' && m.attachmentUrl.startsWith('blob:')) {
          URL.revokeObjectURL(m.attachmentUrl);
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
        {messages.map((message) => (
          <div className="message__chats" key={message.id || message._id}>
            <div className="message__info">
              <p className="sender__name">{message.name || message.sender?.username}</p>
            </div>

            <div className={(message.name || message.sender?.username) === (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : sessionStorage.getItem('userName')) ? 'message__sender' : 'message__recipient'}>
              {(message.content || message.text) && <p>{message.content || message.text}</p>}

              {message.attachmentUrl && (
                <>
                  {/\.(mp4|mov|webm)$/i.test(message.attachmentUrl) ? (
                    <video src={message.attachmentUrl} controls className="chat-media" />
                  ) : (
                    <img src={message.attachmentUrl} alt="media" className="chat-media" />
                  )}
                </>
              )}

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
        ))}
      </div>
    </>
  );
};

export default ChatBody;

