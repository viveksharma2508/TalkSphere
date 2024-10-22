import React, { useEffect, useState } from 'react';
import StyledAvatar from '../Styles/StyledAvatar';

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

    // Filter out the current user from the active users
    const filteredUsers = users.filter(user => user.userName.trim() !== currentUser);

    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>
            <div>
                <h4 className="chat__header">ACTIVE USERS</h4>
                <div className="chat__users">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.socketID} className="user__info">
                                <StyledAvatar 
                                    profilePhotoUrl={user.profilePhotoUrl} 
                                    userName={user.userName}
                                />
                                <p>{user.userName}</p>
                            </div>
                        ))
                    ) : (
                        <p>No active users</p>
                    )}

                    {currentUser && (
                        <div className="user__info current-user">
                            <StyledAvatar 
                                profilePhotoUrl={currentUserProfile} 
                                userName={currentUser}
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
