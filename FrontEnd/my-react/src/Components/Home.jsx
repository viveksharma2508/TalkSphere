import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        socketID: socket.id 
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
      const response = await fetch('http://localhost:3000/upload', {
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
    <form className='home__container' onSubmit={handleSubmit}>
      <h2>Sign in to Open Chat</h2>
      
      <label htmlFor='username'>Username</label>
      <input 
        type='text'
        value={userName}
        minLength={6}
        name='username'
        id='username'
        className='username__input'
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      
      <label htmlFor='profilePhoto'>Profile Photo</label>
      <label htmlFor='profilePhoto' className='attach__btn'>
        {profilePhoto ? profilePhoto.name : 'Add Profile Photo'}
      </label>
      <input 
        type='file'
        name='profilePhoto'
        id='profilePhoto'
        accept='image/*'
        className='profilePhoto__input'
        onChange={handlePhotoChange}
        style={{ display: 'none' }} // Hide the default file input
      />
      
      <button type="submit" disabled={userName.length < 6}>
        SIGN IN
      </button>
    </form>
  );
};

export default Home;

