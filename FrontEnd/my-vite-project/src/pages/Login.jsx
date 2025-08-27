// // src/pages/LoginPage.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Alert,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
//   Divider,
//   Snackbar,
// } from '@mui/material';
// import {
//   Visibility,
//   VisibilityOff,
//   Email as EmailIcon,
//   ArrowBack,
//   Login as LoginIcon,
// } from '@mui/icons-material';
// import axios from 'axios';

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Snackbar state (replaces react-hot-toast)
//   const [snack, setSnack] = useState({
//     open: false,
//     message: '',
//     severity: 'success', // 'success' | 'error' | 'info' | 'warning'
//   });

//   const openSnack = (message, severity = 'success') =>
//     setSnack({ open: true, message, severity });
//   const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:3000/api/auth/login', formData);

//       if (response.data?.success) {
//         // Store token and user data
//         localStorage.setItem('token', response.data.accessToken);
//         localStorage.setItem('user', JSON.stringify(response.data.user));

//         openSnack(`Welcome back, ${response.data.user.username}!`, 'success');
//         setTimeout(() => navigate('/chat'), 1000);
//       } else {
//         openSnack('Login failed. Please try again.', 'error');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
//       setError(errorMessage);
//       openSnack(errorMessage, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Demo login function
//   const handleDemoLogin = async () => {
//     setIsLoading(true);
//     try {
//       const demoCredentials = {
//         email: 'demo@talksphere.com',
//         password: 'demo123',
//       };

//       const response = await axios.post('http://localhost:3000/api/auth/login', demoCredentials);

//       if (response.data?.success) {
//         localStorage.setItem('token', response.data.accessToken);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//         openSnack('Demo login successful!', 'success');
//         setTimeout(() => navigate('/chat'), 1000);
//       } else {
//         openSnack('Demo account not available. Please create an account.', 'error');
//       }
//     } catch (err) {
//       openSnack('Demo account not available. Please create an account.', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         py: 4,
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={24}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             background: 'rgba(255,255,255,0.95)',
//             backdropFilter: 'blur(10px)',
//             position: 'relative',
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ textAlign: 'center', mb: 4 }}>
//             <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', top: 20, left: 20 }}>
//               <ArrowBack />
//             </IconButton>

//             <LoginIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
//             <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
//               Welcome Back
//             </Typography>
//             <Typography variant="body1" sx={{ color: '#666' }}>
//               Sign in to continue to TalkSphere
//             </Typography>
//           </Box>

//           {/* Form */}
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               sx={{ mb: 3 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <EmailIcon sx={{ color: '#666' }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={handleChange}
//               required
//               sx={{ mb: 3 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPassword((s) => !s)}>
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               size="large"
//               disabled={isLoading || !formData.email || !formData.password}
//               sx={{
//                 mb: 2,
//                 py: 1.5,
//                 fontSize: '1.1rem',
//                 fontWeight: 'bold',
//                 background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                 '&:hover': {
//                   background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
//                   transform: 'translateY(-2px)',
//                   boxShadow: '0 8px 25px rgba(25,118,210,0.3)',
//                 },
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
//             </Button>

//             <Divider sx={{ my: 2 }}>
//               <Typography variant="body2" color="textSecondary">
//                 OR
//               </Typography>
//             </Divider>

//             <Button
//               fullWidth
//               variant="outlined"
//               size="large"
//               onClick={handleDemoLogin}
//               disabled={isLoading}
//               sx={{
//                 mb: 3,
//                 py: 1.5,
//                 fontSize: '1rem',
//                 borderColor: '#1976d2',
//                 color: '#1976d2',
//                 '&:hover': {
//                   borderColor: '#1565c0',
//                   backgroundColor: 'rgba(25,118,210,0.04)',
//                 },
//               }}
//             >
//               Try Demo Account
//             </Button>

//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="body2" color="textSecondary">
//                 Don&apos;t have an account?{' '}
//                 <Link
//                   to="/signup"
//                   style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}
//                 >
//                   Create Account
//                 </Link>
//               </Typography>
//             </Box>
//           </form>
//         </Paper>
//       </Container>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snack.open}
//         autoHideDuration={3500}
//         onClose={closeSnack}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
//           {snack.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default LoginPage;


// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, TextField, Button, Typography, Alert,
  CircularProgress, IconButton, InputAdornment, Divider, Snackbar,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email as EmailIcon, ArrowBack, Login as LoginIcon,
} from '@mui/icons-material';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const openSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const finalizeLogin = (payload) => {
  // Merge backend user data with localStorage photoUrl
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const mergedUser = {
    ...payload.user,
    // Use localStorage photoUrl if backend doesn't have it
    photoUrl: payload.user.photoUrl || localUser.photoUrl,
    photoURL: payload.user.photoURL || localUser.photoURL || localUser.photoUrl,
    filePath: payload.user.filePath || localUser.filePath || localUser.photoUrl
  };
  
  console.log('Merged user data:', mergedUser);
  
  onLogin?.({ accessToken: payload.accessToken, user: mergedUser });
  navigate('/chat', { replace: true });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData);
      if (res.data?.success) {
        openSnack(`Welcome back, ${res.data.user.username}!`, 'success');
        finalizeLogin({ accessToken: res.data.accessToken, user: res.data.user });
      } else {
        openSnack('Login failed. Please try again.', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      openSnack(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email: 'demo@talksphere.com',
        password: 'demo123',
      });
      if (res.data?.success) {
        openSnack('Demo login successful!', 'success');
        finalizeLogin({ accessToken: res.data.accessToken, user: res.data.user });
      } else {
        openSnack('Demo account not available. Please create an account.', 'error');
      }
    } catch {
      openSnack('Demo account not available. Please create an account.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', top: 20, left: 20 }}>
              <ArrowBack />
            </IconButton>
            <LoginIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>Welcome Back</Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>Sign in to continue to TalkSphere</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" name="email" type="email" value={formData.email}
              onChange={handleChange} required sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange} required sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={isLoading || !formData.email || !formData.password}
              sx={{
                mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': { background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(25,118,210,0.3)' },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">OR</Typography>
            </Divider>

            <Button
              fullWidth variant="outlined" size="large" onClick={handleDemoLogin} disabled={isLoading}
              sx={{ mb: 3, py: 1.5, fontSize: '1rem', borderColor: '#1976d2', color: '#1976d2',
                '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25,118,210,0.04)' },
              }}
            >
              Try Demo Account
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don&apos;t have an account?{' '}
                <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                  Create Account
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={closeSnack} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
