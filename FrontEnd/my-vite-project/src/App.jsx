// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Components/Home';
// import ChatPage from './Components/ChatPage';
// import { io } from 'socket.io-client';

// const App = () => {
//   const socket = io('https://talksphere-1.onrender.com'); // Adjust your server URL as needed

//   return (
//     <Router basename="/"> {/* Add basename prop */}
//       <Routes>
//         <Route path="/" element={<Home socket={socket} />} />
//         <Route path="/chat" element={<ChatPage socket={socket} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// // src/App.jsx - Updated without react-hot-toast
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { io } from 'socket.io-client';

// // Pages (use your actual filenames/exports)
// import LandingPage from './pages/Landing';
// import SignupPage from './pages/SignUp';
// import LoginPage from './pages/Login';
// import ChatPage from './Components/ChatPage';

// // You can drive this from an env var in Vite: VITE_API_BASE_URL=http://localhost:3000
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// const [token, setToken] = useState(() => localStorage.getItem('token'));
// const [socket, setSocket] = useState(null);


// // Material-UI theme
// const theme = createTheme({
//   palette: {
//     primary: { main: '#1976d2' },
//     secondary: { main: '#dc004e' },
//     background: { default: '#f5f5f5' },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h4: { fontWeight: 600 },
//     h5: { fontWeight: 600 },
//   },
//   components: {
//     MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
//     MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
//   },
// });

// const Loader = () => (
//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       fontSize: '18px',
//       fontFamily: 'Roboto, sans-serif',
//     }}
//   >
//     🚀 Loading TalkSphere...
//   </div>
// );

// const App = () => {
//   const [socket, setSocket] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Initialize auth + socket once on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');

//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);

//         // Create socket instance and clean up this exact instance on unmount
//         const s = io(API_BASE_URL, { auth: { token } });
//         setSocket(s);

//         s.on('connect', () => console.log('✅ Connected to server:', s.id));
//         s.on('disconnect', (reason) => console.log('❌ Disconnected:', reason));
//         s.on('connect_error', (err) => console.error('🔥 Socket error:', err));

//         return () => {
//           s.disconnect();
//         };
//       } catch (e) {
//         console.error('Invalid user data in localStorage:', e);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//     }
//   };

//   // Route guards
//   const ProtectedRoute = ({ children }) => {
//     if (isLoading) return <Loader />;
//     return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
//   };

//   const PublicRoute = ({ children }) => {
//     if (isLoading) return <Loader />;
//     return localStorage.getItem('token') ? <Navigate to="/chat" replace /> : children;
//   };

//   if (isLoading) {
//     return (
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <Loader />
//       </ThemeProvider>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <Routes>
//           {/* Public */}
//           <Route
//             path="/"
//             element={
//               <PublicRoute>
//                 <LandingPage />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               <PublicRoute>
//                 <SignupPage />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <LoginPage />
//               </PublicRoute>
//             }
//           />

//           {/* Protected */}
//           <Route
//             path="/chat"
//             element={
//               <ProtectedRoute>
//                 <ChatPage socket={socket} user={user} onLogout={handleLogout} />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// };

// // export default App;
// // src/App.jsx
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { io } from 'socket.io-client';

// import LandingPage from './pages/Landing';
// import SignupPage from './pages/SignUp';
// import LoginPage from './pages/Login';
// import ChatPage from './Components/ChatPage';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
// const theme = createTheme({});

// export default function App() {
//   // Auth state
//   const [token, setToken] = useState(() => localStorage.getItem('token'));
//   const [user, setUser] = useState(() => {
//     try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
//   });

//   // Live socket instance passed to children
//   const [socket, setSocket] = useState(null);

//   // Create / teardown socket whenever token changes
//   useEffect(() => {
//     // no auth → ensure no client is alive
//     if (!token) {
//       setSocket((s) => { s?.disconnect?.(); return null; });
//       return;
//     }

//     // build authenticated client (single instance)
//     const s = io(API_BASE_URL, {
//       auth: { token },
//       transports: ['websocket'],          // stabilize local dev
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 500,
//       reconnectionDelayMax: 2000,
//     });

//     s.on('connect', () => console.log('✅ Connected', s.id));
//     s.on('connect_error', (e) => console.log('🔥 connect_error:', e.message, e.description, e.context));
//     s.on('disconnect', (r) => console.log('❌ Disconnected', r));
//     setSocket(s);

//     // cleanup on token change/unmount
//     return () => {
//       try { s.offAny?.(); s.removeAllListeners?.(); } catch {}
//       s.disconnect();
//     };
//   }, [token]); // token-scoped per official React integration approach

//   // Called by LoginPage
//   const handleLogin = ({ accessToken, user: u }) => {
//   const normalized = {
//     ...u,
//     // Prefer absolute ImageKit URL fields returned by your API
//     photoUrl: u.photoUrl || u.profilePhotoUrl || u.url || u.thumbnail || null,
//     // Keep filePath if your API only stores relative paths
//     filePath: u.filePath || null,
//   };
//   localStorage.setItem('token', accessToken);
//   localStorage.setItem('user', JSON.stringify(normalized));
//   setUser(normalized);
//   setToken(accessToken);
// };


//   // Called by ChatBody/ChatBar (leave/logout)
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     setToken(null); // triggers socket teardown (no recreate on login route)
//   };

//   // Guards based on in-memory token (avoids stale localStorage race)
//   const ProtectedRoute = ({ children }) => token ? children : <Navigate to="/login" replace />;
//   const PublicRoute    = ({ children }) => token ? <Navigate to="/chat" replace /> : children;

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <Routes>
//           <Route path="/"       element={<PublicRoute><LandingPage /></PublicRoute>} />
//           <Route path="/signup" element={<PublicRoute><SignupPage onSignup={handleLogin} /></PublicRoute>} />
//           <Route path="/login"  element={<PublicRoute><LoginPage onLogin={handleLogin} /></PublicRoute>} />
//           <Route path="/chat"   element={
//             <ProtectedRoute>
//               <ChatPage socket={socket} user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           } />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client';
import LandingPage from './pages/Landing';
import SignupPage from './pages/SignUp';
import LoginPage from './pages/Login';
import ChatPage from './Components/ChatPage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const theme = createTheme({});

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [socket, setSocket] = useState(null);

  // App.jsx (after login/signup)
const handleLogin = ({ accessToken, user: u }) => {
  const normalized = {
    ...u,
    // Prefer absolute URL from backend upload response
    photoUrl: u.photoUrl || u.profilePhotoUrl || u.url || u.thumbnail || null, // [3]
    // Keep filePath if backend only stores a relative path
    filePath: u.filePath || null,
  };
  localStorage.setItem('token', accessToken);
  localStorage.setItem('user', JSON.stringify(normalized));
  setUser(normalized);
  setToken(accessToken);
  console.log('App normalized user', normalized); // should show photoUrl or filePath
};




  // Logout wired from ChatBody/ChatBar
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // Token-scoped socket lifecycle
  useEffect(() => {
    if (!token) { setSocket(s => { s?.disconnect?.(); return null; }); return; }
    const s = io(API_BASE_URL, { auth: { token } });
    s.on('connect', () => console.log('✅ Connected', s.id));
    s.on('connect_error', (e) => console.log('🔥 connect_error:', e.message));
    s.on('disconnect', (r) => console.log('❌ Disconnected', r));
    setSocket(s);
    return () => s.disconnect();
  }, [token]);

  const Protected = ({ children }) => token ? children : <Navigate to="/login" replace />;
  const Public    = ({ children }) => token ? <Navigate to="/chat" replace /> : children;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/"       element={<Public><LandingPage /></Public>} />
          <Route path="/signup" element={<Public><SignupPage onSignupDone={handleLogin} /></Public>} />
          <Route path="/login"  element={<Public><LoginPage onLogin={handleLogin} /></Public>} /> {/* Pass the prop directly in element per RRv6 */} {/* [31] */}
          <Route path="/chat"   element={<Protected><ChatPage socket={socket} user={user} onLogout={handleLogout} /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
