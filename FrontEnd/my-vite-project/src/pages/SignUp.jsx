// // src/pages/SignupPage.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Avatar,
//   Alert,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
//   Snackbar,
// } from '@mui/material';
// import {
//   PhotoCamera,
//   Visibility,
//   VisibilityOff,
//   Person as PersonIcon,
//   ArrowBack,
// } from '@mui/icons-material';

// import { api } from '../lib/api';
// import { fileToBase64 } from '../utils/fileToBase64';
// import { withTimeout } from '../utils/withTimout';

// const SignupPage = ({ onSignup }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Snackbar (replaces react-hot-toast)
//   const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
//   const openSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
//   const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//     if (error) setError('');
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfilePhoto(file);
//       // Preview for UI only
//       const reader = new FileReader();
//       reader.onload = (ev) => setPhotoPreview(ev.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Upload via JSON + base64 (Option A)
//   const uploadProfilePhoto = async (file) => {
//     if (!file) return null;
//     try {
//       const base64 = await fileToBase64(file); // data:image/...;base64,xxxx
//       const res = await api.post('/api/upload', {
//         file: base64,
//         fileName: file.name || `profile_${Date.now()}.jpg`,
//       });
//       // Use the optimized thumbnail if you prefer smaller images in chat UI:
//       return res.data.photoUrl || res.data.thumbnailUrl || null;
//     } catch (err) {
//       console.error('Error uploading photo:', err);
//       openSnack(err?.response?.data?.message || 'Failed to upload photo', 'error');
//       return null;
//     }
//   };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (isLoading) return;

//   setError('');

//   const username = String(formData.username || '').trim().toLowerCase();
//   const email = String(formData.email || '').trim().toLowerCase();
//   const password = formData.password;

//   if (password !== formData.confirmPassword) {
//     setError('Passwords do not match');
//     return;
//   }
//   if (password.length < 6) {
//     setError('Password must be at least 6 characters');
//     return;
//   }

//   setIsLoading(true);
//   try {
//     // 1) Register (only blocking step)
//     const reg = await api.post('/api/auth/register', { username, email, password });

//     const token = reg?.data?.accessToken;
//     const baseUser = reg?.data?.user || {};

//     // 2) Notify App component to update state
//     onSignup({ accessToken: token, user: baseUser });

//     // 3) Fire‑and‑forget photo upload + profile update (never block UI)
//     if (profilePhoto) {
//       (async () => {
//         try {
//           const base64 = await fileToBase64(profilePhoto);
//           const up = await api.post('/api/upload', {
//             file: base64,
//             fileName: profilePhoto.name || 'avatar.jpg',
//           });
//           const photoUrl = up.data.photoUrl || up.data.thumbnailUrl || null;
//           if (photoUrl) {
//             await api.put(
//               '/api/users/profile',
//               { photoUrl },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//             // Also update the user in localStorage after photo upload
//             localStorage.setItem('user', JSON.stringify({ ...baseUser, photoUrl }));
//           }
//         } catch (e) {
//           openSnack('Profile photo update skipped', 'warning');
//         }
//       })();
//     }

//     openSnack('Account created successfully! Welcome to TalkSphere!', 'success');

//     // 4) Navigation is now handled by the App component's state change
//   } catch (err) {
//     const status = err?.response?.status;
//     const msg = err?.response?.data?.message;

//     if (status === 409) {
//       setError(msg || 'User already exists');
//       openSnack(msg || 'User already exists', 'warning');
//     } else {
//       setError(msg || 'Registration failed. Please try again.');
//       openSnack(msg || 'Registration failed. Please try again.', 'error');
//     }
//   } finally {
//     setIsLoading(false); // always stop spinner
//   }
// };

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
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', top: 20, left: 20 }}>
//               <ArrowBack />
//             </IconButton>
//             <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
//               Join TalkSphere
//             </Typography>
//             <Typography variant="body1" sx={{ color: '#666' }}>
//               Create your account and start connecting
//             </Typography>
//           </Box>

//           {/* Profile Photo Upload */}
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <input type="file" id="profilePhoto" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
//             <label htmlFor="profilePhoto">
//               <Avatar
//                 sx={{
//                   width: 100,
//                   height: 100,
//                   mx: 'auto',
//                   mb: 2,
//                   cursor: 'pointer',
//                   border: '4px solid #1976d2',
//                   '&:hover': { transform: 'scale(1.05)' },
//                   transition: 'transform 0.2s ease',
//                 }}
//                 src={photoPreview || undefined}
//               >
//                 {!photoPreview && <PhotoCamera sx={{ fontSize: 40 }} />}
//               </Avatar>
//             </label>
//             <Typography variant="body2" color="textSecondary">
//               {profilePhoto ? profilePhoto.name : 'Click to add profile photo (optional)'}
//             </Typography>
//           </Box>

//           {/* Form */}
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               inputProps={{ minLength: 3 }}
//               sx={{ mb: 2 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonIcon sx={{ color: '#666' }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <TextField
//               fullWidth
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={handleChange}
//               required
//               inputProps={{ minLength: 6 }}
//               sx={{ mb: 2 }}
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

//             <TextField
//               fullWidth
//               label="Confirm Password"
//               name="confirmPassword"
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               sx={{ mb: 3 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowConfirmPassword((s) => !s)}>
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {error && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               size="large"
//               disabled={isLoading || !formData.username || !formData.email || !formData.password}
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
//               {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
//             </Button>

//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="body2" color="textSecondary">
//                 Already have an account?{' '}
//                 <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
//                   Sign In
//                 </Link>
//               </Typography>
//             </Box>
//           </form>
//         </Paper>
//       </Container>

//       {/* Snackbar for success/error messages */}
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

// export default SignupPage;


// // src/pages/SignupPage.jsx
// import React, { useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Box, Container, Paper, TextField, Button, Typography, Avatar, Alert,
//   CircularProgress, IconButton, InputAdornment, Snackbar
// } from '@mui/material';
// import { PhotoCamera, Visibility, VisibilityOff, Person as PersonIcon, ArrowBack } from '@mui/icons-material';
// import { api } from '../lib/api';
// import { fileToBase64 } from '../utils/fileToBase64';

// const SignupPage = ({ onSignup }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

//   // Re-entrancy guard for submit (sync)
//   const submittingRef = useRef(false);

//   const openSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
//   const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//     if (error) setError('');
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfilePhoto(file);
//       const reader = new FileReader();
//       reader.onload = (ev) => setPhotoPreview(ev.target.result);
//       reader.readAsDataURL(file);
//     }
//   };
// // JSON + Base64 (strip prefix)

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   e.stopPropagation();

//   if (submittingRef.current) return;
//   submittingRef.current = true;

//   if (isLoading) { submittingRef.current = false; return; }
//   setError('');

//   const username = String(formData.username || '').trim().toLowerCase();
//   const email = String(formData.email || '').trim().toLowerCase();
//   const password = formData.password;

//   if (password !== formData.confirmPassword) {
//     setError('Passwords do not match');
//     submittingRef.current = false;
//     return;
//   }
//   if (password.length < 6) {
//     setError('Password must be at least 6 characters');
//     submittingRef.current = false;
//     return;
//   }

//   setIsLoading(true);
//   try {
//     // 1) Register user
//     const reg = await api.post('/api/auth/register', { username, email, password });
//     const token = reg?.data?.accessToken;
//     let baseUser = reg?.data?.user || {};

//     // 2) If a photo is selected, upload and attach to profile BEFORE lifting state
//     if (profilePhoto && token) {
//       try {
//         const photoUrl = await uploadProfilePhoto(profilePhoto, token); // pass token here
//         if (photoUrl) {
//           await api.put(
//             '/api/users/profile',
//             { photoUrl },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           baseUser = { ...baseUser, photoUrl };
//           localStorage.setItem('user', JSON.stringify(baseUser));
//         }
//       } catch {
//         openSnack('Profile photo update skipped', 'warning');
//       }
//     }

//     // 3) Lift state up (with up-to-date user so UI shows avatar immediately)
//     onSignup?.({ accessToken: token, user: baseUser });

//     openSnack('Account created successfully! Welcome to TalkSphere!', 'success');
//   } catch (err) {
//     const status = err?.response?.status;
//     const msg = err?.response?.data?.message;
//     if (status === 409) {
//       setError(msg || 'User already exists');
//       openSnack(msg || 'User already exists', 'warning');
//     } else {
//       setError(msg || 'Registration failed. Please try again.');
//       openSnack(msg || 'Registration failed. Please try again.', 'error');
//     }
//   } finally {
//     setIsLoading(false);
//     submittingRef.current = false;
//     }
//   }

    
// //    const uploadProfilePhoto = async (file, token) => {
// //   if (!file) return null;

// //   const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
// //   if (!allowedTypes.includes(file.type)) {
// //     throw new Error("Only PNG and JPG images are allowed");
// //   }

// //   // Check file size (5MB limit)
// //   const maxSize = 5 * 1024 * 1024;
// //   if (file.size > maxSize) {
// //     throw new Error("File size must be less than 5MB");
// //   }

// //   try {
// //     console.log("Converting file to base64:", file.name);
    
// //     // Convert file to base64
// //     const base64 = await fileToBase64(file);
    
// //     console.log("Uploading to ImageKit...");
    
// //     // Send as JSON with base64 data (matching your server expectation)
// //     const response = await api.post("/api/upload", {
// //       file: base64, // base64 string with data:image/jpeg;base64,... prefix
// //       fileName: file.name
// //     }, {
// //       headers: {
// //         "Content-Type": "application/json",
// //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //       },
// //     });

// //     console.log("Upload response:", response.data);
    
// //     const data = response?.data || {};
    
// //     // Your server returns photoUrl and thumbnailUrl
// //     return data.photoUrl || data.thumbnailUrl || data.url || null;
    
// //   } catch (error) {
// //     console.error("Upload error:", error.response?.data || error.message);
// //     throw new Error(error.response?.data?.message || "File upload failed");
// //   }
// // };

// // keep: const uploadProfilePhoto = async (file, token) => {
// const uploadProfilePhoto = async (file, token) => {
//   if (!file) return null;

//   const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
//   if (!allowedTypes.includes(file.type)) throw new Error("Only PNG and JPG images are allowed");

//   const maxSize = 5 * 1024 * 1024;
//   if (file.size > maxSize) throw new Error("File size must be less than 5MB");

//   try {
//     // Convert file to base64 and strip data URL prefix if server expects raw base64
//     const base64WithPrefix = await fileToBase64(file);
//     const base64 = base64WithPrefix.replace(/^data:.+;base64,/, ""); // remove "data:image/...;base64," prefix

//     const response = await api.post(
//       "/api/upload",
//       {
//         file: base64,    // raw base64 only; if server expects the prefix, use base64WithPrefix instead
//         fileName: file.name
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       }
//     );

//     const data = response?.data || {};
//     return data.photoUrl || data.thumbnailUrl || data.url || null;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "File upload failed");
//   }
// };

//     if (password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       submittingRef.current = false;
//       return;
//     }
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       submittingRef.current = false;
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // 1) Register user
//       const reg = await api.post('/api/auth/register', { username, email, password });
//       const token = reg?.data?.accessToken;
//       const baseUser = reg?.data?.user || {};

//       // 2) Lift state up
//       onSignup?.({ accessToken: token, user: baseUser });

//       // 3) Fire-and-forget avatar upload
//       if (profilePhoto && token) {
//         (async () => {
//           try {
//             const photoUrl = await uploadProfilePhoto(profilePhoto);
//             if (photoUrl) {
//               await api.put(
//                 '/api/users/profile',
//                 { photoUrl },
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//               localStorage.setItem('user', JSON.stringify({ ...baseUser, photoUrl }));
//             }
//           } catch {
//             openSnack('Profile photo update skipped', 'warning');
//           }
//         })();
//       }

//       openSnack('Account created successfully! Welcome to TalkSphere!', 'success');
//       // Navigation is handled by App via onSignup
//     } catch (err) {
//       const status = err?.response?.status;
//       const msg = err?.response?.data?.message;
//       if (status === 409) {
//         setError(msg || 'User already exists');
//         openSnack(msg || 'User already exists', 'warning');
//       } else {
//         setError(msg || 'Registration failed. Please try again.');
//         openSnack(msg || 'Registration failed. Please try again.', 'error');
//       }
//     } finally {
//       setIsLoading(false);
//       submittingRef.current = false;
//     }
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', py: 4 }}>
//       <Container maxWidth="sm">
//         <Paper elevation={24} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'relative' }}>
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', top: 20, left: 20 }}>
//               <ArrowBack />
//             </IconButton>
//             <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>Join TalkSphere</Typography>
//             <Typography variant="body1" sx={{ color: '#666' }}>Create your account and start connecting</Typography>
//           </Box>

//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <input type="file" id="profilePhoto" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
//             <label htmlFor="profilePhoto">
//               <Avatar
//                 sx={{
//                   width: 100, height: 100, mx: 'auto', mb: 2, cursor: 'pointer',
//                   border: '4px solid #1976d2',
//                   '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease',
//                 }}
//                 src={photoPreview || undefined}
//               >
//                 {!photoPreview && <PhotoCamera sx={{ fontSize: 40 }} />}
//               </Avatar>
//             </label>
//             <Typography variant="body2" color="textSecondary">
//               {profilePhoto ? profilePhoto.name : 'Click to add profile photo (optional)'}
//             </Typography>
//           </Box>

//           {/* Prevent browser auto-submit shenanigans */}
//           <form onSubmit={handleSubmit} autoComplete="off">
//             <TextField
//               fullWidth label="Username" name="username" value={formData.username}
//               onChange={handleChange} required inputProps={{ minLength: 3, autoComplete: 'off' }}
//               sx={{ mb: 2 }}
//               InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: '#666' }} /></InputAdornment>) }}
//             />

//             <TextField
//               fullWidth label="Email" name="email" type="email" value={formData.email}
//               onChange={handleChange} required sx={{ mb: 2 }} inputProps={{ autoComplete: 'off' }}
//             />

//             <TextField
//               fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
//               value={formData.password} onChange={handleChange} required inputProps={{ minLength: 6, autoComplete: 'new-password' }}
//               sx={{ mb: 2 }}
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

//             <TextField
//               fullWidth label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
//               value={formData.confirmPassword} onChange={handleChange} required inputProps={{ autoComplete: 'new-password' }}
//               sx={{ mb: 3 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowConfirmPassword((s) => !s)}>
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//             <Button
//               type="submit" fullWidth variant="contained" size="large"
//               disabled={isLoading || !formData.username || !formData.email || !formData.password}
//               sx={{
//                 mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold',
//                 background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                 '&:hover': { background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(25,118,210,0.3)' },
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
//             </Button>

//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="body2" color="textSecondary">
//                 Already have an account?{' '}
//                 <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
//                   Sign In
//                 </Link>
//               </Typography>
//             </Box>
//           </form>
//         </Paper>
//       </Container>

//       <Snackbar open={snack.open} autoHideDuration={3500} onClose={closeSnack} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
//         <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
//           {snack.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default SignupPage;



// src/pages/SignupPage.jsx
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, TextField, Button, Typography, Avatar, Alert,
  CircularProgress, IconButton, InputAdornment, Snackbar
} from '@mui/material';
import { PhotoCamera, Visibility, VisibilityOff, Person as PersonIcon, ArrowBack } from '@mui/icons-material';
import { api } from '../lib/api';
import { fileToBase64 } from '../utils/fileToBase64';

const SignupPage = ({ onSignup }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Re-entrancy guard for submit (sync)
  const submittingRef = useRef(false);

  const openSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Fixed upload function
  const uploadProfilePhoto = async (file, token) => {
    if (!file) return null;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PNG and JPG images are allowed");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    try {
      console.log("Converting file to base64:", file.name);
      
      // Convert file to base64 - keep the full data URL as your server expects it
      const base64WithPrefix = await fileToBase64(file);
      
      console.log("Uploading to ImageKit...");
      
      const response = await api.post("/api/upload", {
        file: base64WithPrefix, // Send with data:image/...;base64, prefix
        fileName: file.name
      }, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log("Upload response:", response.data);
      
      const data = response?.data || {};
      return data.photoUrl || data.thumbnailUrl || data.url || null;
      
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "File upload failed");
    }
  };

  // Fixed handleSubmit function
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   e.stopPropagation();

//   // Hard guard (prevents ultra-fast double invoke)
//   if (submittingRef.current) return;
//   submittingRef.current = true;

//   if (isLoading) { 
//     submittingRef.current = false; 
//     return; 
//   }
  
//   setError('');

//   const username = String(formData.username || '').trim().toLowerCase();
//   const email = String(formData.email || '').trim().toLowerCase();
//   const password = formData.password;

//   // Validation
//   if (password !== formData.confirmPassword) {
//     setError('Passwords do not match');
//     submittingRef.current = false;
//     return;
//   }
//   if (password.length < 6) {
//     setError('Password must be at least 6 characters');
//     submittingRef.current = false;
//     return;
//   }

//   setIsLoading(true);
//   try {
//     console.log('Step 1: Registering user...');
    
//     // 1) Register user
//     const reg = await api.post('/api/auth/register', { username, email, password });
//     const token = reg?.data?.accessToken;
//     let baseUser = reg?.data?.user || {};

//     console.log('Registration successful:', { token: !!token, baseUser });

//     // 2) Upload profile photo and update user profile BEFORE lifting state
//     if (profilePhoto && token) {
//       try {
//         console.log('Step 2: Uploading profile photo...');
        
//         const photoUrl = await uploadProfilePhoto(profilePhoto, token);
        
//         if (photoUrl) {
//           console.log('Step 3: Updating user profile with photo URL...', { photoUrl });
          
//           try {
//             const updateResponse = await api.put('/api/users/profile', { photoUrl }, {
//               headers: { Authorization: `Bearer ${token}` },
//               timeout: 30000 // 30 seconds timeout
//             });
            
//             console.log('Profile update response:', updateResponse.data);
            
//             // Update baseUser object with photo URL
//             baseUser = { 
//               ...baseUser, 
//               photoUrl,
//               photoURL: photoUrl,
//               profilePhotoUrl: photoUrl
//             };
            
//             console.log('Photo upload and profile update successful:', baseUser);
//             openSnack('Account created with profile photo!', 'success');
//           } catch (updateError) {
//             console.error('Profile update failed:', updateError);
            
//             // Still proceed with signup but without photo in profile
//             if (updateError.code === 'ECONNABORTED') {
//               console.warn('Profile update timed out');
//               openSnack('Account created! Photo uploaded but profile update timed out.', 'warning');
//             } else {
//               console.warn('Profile update failed');
//               openSnack('Account created! Photo uploaded but profile update failed.', 'warning');
//             }
//           }
//         } else {
//           console.warn('Photo upload returned no URL');
//           openSnack('Account created, but photo upload failed', 'warning');
//         }
//       } catch (photoError) {
//         console.error('Photo upload failed:', photoError);
//         openSnack('Account created, but photo upload failed: ' + photoError.message, 'warning');
//       }
//     } else {
//       openSnack('Account created successfully! Welcome to TalkSphere!', 'success');
//     }

//     // 3) Save to localStorage
//     localStorage.setItem('user', JSON.stringify(baseUser));
//     localStorage.setItem('token', token);

//     // 4) Lift state up with final user data
//     onSignup?.({ accessToken: token, user: baseUser });

//   } catch (err) {
//     console.error('Signup error:', err);
//     const status = err?.response?.status;
//     const msg = err?.response?.data?.message;
    
//     if (status === 409) {
//       setError(msg || 'User already exists');
//       openSnack(msg || 'User already exists', 'warning');
//     } else if (err.code === 'ECONNABORTED') {
//       setError('Request timed out. Please try again.');
//       openSnack('Request timed out. Please try again.', 'error');
//     } else {
//       setError(msg || 'Registration failed. Please try again.');
//       openSnack(msg || 'Registration failed. Please try again.', 'error');
//     }
//   } finally {
//     setIsLoading(false);
//     submittingRef.current = false;
//   }
// };
// Corrected handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Your existing validation and setup code...
  if (submittingRef.current || isLoading) {
    submittingRef.current = false;
    return;
  }
  submittingRef.current = true;
  setError('');

  const { username, email, password, confirmPassword } = formData;
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    submittingRef.current = false;
    return;
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    submittingRef.current = false;
    return;
  }
  setIsLoading(true);

  try {
    // Step 1: Register the user
    console.log('Step 1: Registering user...');
    const regResponse = await api.post('/api/auth/register', { username, email, password });
    const { accessToken: token, user: baseUser } = regResponse.data;

    console.log('Registration successful. User ID:', baseUser._id);

    let updatedUser = { ...baseUser };

    // Step 2: Upload the photo and await the update
    if (profilePhoto && token) {
      try {
        console.log('Step 2: Uploading profile photo...');
        const uploadResponse = await api.post("/api/upload", {
          file: await fileToBase64(profilePhoto),
          fileName: profilePhoto.name,
        });

        const { photoUrl, thumbnailUrl, fileId } = uploadResponse.data;
        
        console.log('Photo uploaded. Step 3: Updating database with URL...');

        // CRITICAL: Await the profile update API call
        const updateResponse = await api.put(
          '/api/users/profile',
          { photoUrl, filePath: fileId, thumbnailUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Use the data from the server's response, which now includes the photo URL
        updatedUser = updateResponse.data.user;
        
        console.log('Profile update confirmed by server:', updatedUser);
        openSnack('Account created with profile photo!', 'success');

      } catch (photoError) {
        console.error('Photo upload or profile update failed:', photoError);
        openSnack('Account created, but photo upload failed', 'warning');
      }
    } else {
      openSnack('Account created successfully! Welcome to TalkSphere!', 'success');
    }

    // Step 4: Finalize by saving the confirmed data
    console.log('Saving final user data to localStorage:', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('token', token);

    // Call the parent handler with the correct, fully updated user object
    onSignup?.({ accessToken: token, user: updatedUser });

  } catch (err) {
    console.error('Signup error:', err.response?.data?.message || err.message);
    const msg = err.response?.data?.message || 'Registration failed. Please try again.';
    setError(msg);
    openSnack(msg, 'error');
  } finally {
    setIsLoading(false);
    submittingRef.current = false;
  }
};

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', top: 20, left: 20 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>Join TalkSphere</Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>Create your account and start connecting</Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <input type="file" id="profilePhoto" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            <label htmlFor="profilePhoto">
              <Avatar
                sx={{
                  width: 100, height: 100, mx: 'auto', mb: 2, cursor: 'pointer',
                  border: '4px solid #1976d2',
                  '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease',
                }}
                src={photoPreview || undefined}
              >
                {!photoPreview && <PhotoCamera sx={{ fontSize: 40 }} />}
              </Avatar>
            </label>
            <Typography variant="body2" color="textSecondary">
              {profilePhoto ? profilePhoto.name : 'Click to add profile photo (optional)'}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              fullWidth label="Username" name="username" value={formData.username}
              onChange={handleChange} required inputProps={{ minLength: 3, autoComplete: 'off' }}
              sx={{ mb: 2 }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: '#666' }} /></InputAdornment>) }}
            />

            <TextField
              fullWidth label="Email" name="email" type="email" value={formData.email}
              onChange={handleChange} required sx={{ mb: 2 }} inputProps={{ autoComplete: 'off' }}
            />

            <TextField
              fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange} required inputProps={{ minLength: 6, autoComplete: 'new-password' }}
              sx={{ mb: 2 }}
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

            <TextField
              fullWidth label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword} onChange={handleChange} required inputProps={{ autoComplete: 'new-password' }}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((s) => !s)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={isLoading || !formData.username || !formData.email || !formData.password}
              sx={{
                mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': { background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(25,118,210,0.3)' },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                  Sign In
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

export default SignupPage;