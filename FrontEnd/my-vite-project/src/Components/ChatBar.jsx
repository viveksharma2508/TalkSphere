// import React, { useEffect, useState } from 'react';
// import StyledAvatar from '../Styles/StyledAvatar';

// const ChatBar = ({ socket }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Listen for the updated user list from the server
//     socket.on('newUserResponse', (data) => {
//       console.log('Received user list from server:', data);
//       setUsers(data);
//     });

//     return () => {
//       socket.off('newUserResponse');
//     };
//   }, [socket]);

//   const currentUser = sessionStorage.getItem('userName')?.trim();
//   const currentUserProfile = sessionStorage.getItem('profilePhotoUrl');

//   // Filter out the current user from the active users
//   const filteredUsers = users.filter((user) => user.userName.trim() !== currentUser);

//   return (
//     <div className="chat__sidebar">
//       <h2>Open Chat</h2>
//       <div>
//         <h4 className="chat__header">ACTIVE USERS</h4>
//         <div className="chat__users">
//           {/* Render all active users except the current user */}
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <div key={user.socketID} className="user__info">
//                 <StyledAvatar
//                   profilePhotoUrl={user.profilePhotoUrl}
//                   userName={user.userName}
//                 />
//                 <p>{user.userName}</p>
//               </div>
//             ))
//           ) : (
//             <p>No active users</p>
//           )}

//           {/* Render the current user */}
//           {currentUser && (
//             <div className="user__info current-user">
//               <StyledAvatar
//                 profilePhotoUrl={currentUserProfile}
//                 userName={currentUser}
//               />
//               <p>{currentUser} (You)</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBar;



import React, { useEffect, useState } from 'react';
import StyledAvatar from '../Styles/StyledAvatar';

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Emit newUser event when component mounts
    const userName = sessionStorage.getItem('userName');
    const profilePhotoUrl = sessionStorage.getItem('profilePhotoUrl');
    
    if (userName) {
      socket.emit('newUser', { userName, profilePhotoUrl });
      console.log('Emitted newUser event:', { userName, profilePhotoUrl });
    }

    // Listen for updated user list
    socket.on('newUserResponse', (data) => {
      console.log('Received newUserResponse event:', data);
      setUsers(data);
    });

    return () => {
      socket.off('newUserResponse');
    };
  }, [socket]);

  const currentUser = sessionStorage.getItem('userName')?.trim();
  const currentUserProfile = sessionStorage.getItem('profilePhotoUrl');

  // Debugging: Log the current user and the user list before filtering
  console.log('Current user:', currentUser);
  console.log('Users array before filter:', users);

  // Filter out the current user from the active users
  const filteredUsers = users.filter((user) => user.userName.trim() !== currentUser);

  // Debugging: Log the filtered user list
  console.log('Filtered users:', filteredUsers);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {/* Render all active users except the current user */}
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

          {/* Render the current user */}
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
