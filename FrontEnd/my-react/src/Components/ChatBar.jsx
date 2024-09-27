import React, { useEffect, useState } from 'react';

const ChatBar = ({ socket }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('newUserResponse', (data) => {
            console.log('New user data received:', data);
            setUsers(data);
        });

        return () => {
            socket.off('newUserResponse');
        };
    }, [socket]);

    const currentUser = sessionStorage.getItem('userName')?.trim();
    const currentUserProfile = sessionStorage.getItem('profilePhotoUrl');

    console.log('Current User:', currentUser);
    console.log('Current User Profile URL:', currentUserProfile);
    console.log('All Active Users:', users);

    // Filter out the current user from the active users
    const filteredUsers = users.filter(user => user.userName.trim() !== currentUser);
    console.log('Filtered users for display:', filteredUsers);

    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>
            <div>
                <h4 className="chat__header">ACTIVE USERS</h4>
                <div className="chat__users">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.socketID} className="user__info">
                                <img
                                    src={user.profilePhotoUrl || '/default-profile.png'}
                                    alt={`${user.userName}'s profile`}
                                    className="user__photo"
                                />
                                <p>{user.userName}</p>
                            </div>
                        ))
                    ) : (
                        <p>No active users</p>
                    )}

                    {currentUser && (
                        <div className="user__info current-user">
                            <img
                                src={currentUserProfile || '/default-profile.png'}
                                alt="Your Profile"
                                className="user__photo"
                            />
                            <p>{currentUser} (You)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
