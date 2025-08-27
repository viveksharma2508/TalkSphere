
// src/Components/ChatBar.jsx
import React, { useEffect, useState } from 'react';
import StyledAvatar from '../Styles/StyledAvatar';

const normalize = (u) => ({
  _id: u?._id || u?.userId || null,
  socketID: u?.socketID || u?.socketId || null,
  username: u?.username || u?.userName || '',
  photoUrl: u?.photoURL || u?.photoUrl || u?.profilePhotoUrl || u?.profilePhoto || u?.avatar || u?.url || u?.thumbnail || null,
  filePath: u?.filePath || u?.imagePath || u?.image || null,
});

const uniqBy = (arr) => {
  const map = new Map();
  for (const raw of (arr || [])) {
    if (!raw) continue;
    const u = normalize(raw);
    const key = u._id || u.socketID || u.username;
    if (!key) continue;
    if (!map.has(key)) map.set(key, u);
  }
  return [...map.values()];
};

const resolveAvatar = (u) => {
  return (
    u?.photoURL ||
    u?.photoUrl ||
    u?.profilePhotoUrl ||
    u?.profilePhoto ||
    u?.avatar ||
    u?.filePath ||
    u?.imagePath ||
    u?.image ||
    u?.url ||
    u?.thumbnail ||
    null
  );
};

export default function ChatBar({ socket, user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!socket || !user) return;

    // Send your own presence
    const socketData = {
      userName: user.username,
      profilePhotoUrl: user.photoURL || user.photoUrl || user.profilePhotoUrl || user.profilePhoto || null,
      filePath: user.filePath || null,
    };
    socket.emit('newUser', socketData);

    // Update on users list
    const onUpdate = (list) => {
      setUsers(uniqBy(list));
    };
    const onNewUserResponse = (list) => {
      setUsers(uniqBy(list));
    };

    socket.off('users:update', onUpdate).on('users:update', onUpdate);
    socket.off('newUserResponse', onNewUserResponse).on('newUserResponse', onNewUserResponse);

    // Ask server for current active users
    socket.emit('users:list');

    return () => {
      socket.off('users:update', onUpdate);
      socket.off('newUserResponse', onNewUserResponse);
    };
  }, [socket, user]);

  // Normalize and filter out yourself
  const others = (users || [])
    .filter(Boolean)
    .map(normalize)
    .filter((u) => (u._id ? u._id !== user?._id : u.username !== user?.username));

  const youAvatar = resolveAvatar(user);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div className="user__info current-user">
        <StyledAvatar 
          profilePhotoUrl={youAvatar} 
          userName={user?.username || 'You'} 
        />
        <p>{user?.username || 'You'} (You)</p>
      </div>

      <h4 className="chat__header">ACTIVE USERS</h4>
      <div className="chat__users">
        {others.length ? (
          others.map((u, i) => {
            const otherAvatar = resolveAvatar(u);
            return (
              <div
                key={u._id || u.socketID || `${u.username || 'user'}-${i}`}
                className="user__info"
              >
                <StyledAvatar
                  profilePhotoUrl={otherAvatar}
                  userName={u?.username || 'User'}
                />
                <p>{u?.username || 'User'}</p>
              </div>
            );
          })
        ) : (
          <p>No active users</p>
        )}
      </div>
    </div>
  );
}
