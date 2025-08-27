import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const photoUrl = await uploadProfilePhoto(profilePhoto);

    if (photoUrl) {
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('profilePhotoUrl', photoUrl);

      socket.emit('newUser', {
        userName,
        profilePhotoUrl: photoUrl,
        socketID: socket.id,
      });

      navigate('/chat');
    } else {
      console.error('Failed to upload profile photo');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const uploadProfilePhoto = async (file) => {
    if (!file) return 'default-profile.jpg';

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await fetch('https://localhost:3000.com/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.photoUrl;
      } else {
        const errorText = await response.text();
        console.error('Unexpected response format:', errorText);
        return 'default-profile.jpg';
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      return 'default-profile.jpg';
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://c4.wallpaperflare.com/wallpaper/946/379/721/artwork-landscape-mountains-forest-wallpaper-preview.jpg)', // Replace with your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: '#f0f4f8',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Sign in to Open Chat
        </Typography>

        <TextField
          variant="outlined"
          required
          fullWidth
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          inputProps={{ minLength: 6 }}
          sx={{ marginBottom: '20px' }}
        />

        <label htmlFor="profilePhoto" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }}>
          <Avatar sx={{ marginRight: '10px', bgcolor: 'primary.main' }}>
            <PhotoCamera />
          </Avatar>
          <span>{profilePhoto ? profilePhoto.name : 'Add Profile Photo'}</span>
        </label>
        <input
          type="file"
          name="profilePhoto"
          id="profilePhoto"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }} // Hide the default file input
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={userName.length < 6}
          sx={{ marginTop: '20px' }}
        >
          SIGN IN
        </Button>
      </Container>
    </Box>
  );
};

export default Home;