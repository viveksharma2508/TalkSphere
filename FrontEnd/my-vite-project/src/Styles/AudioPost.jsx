import React, { useEffect, useState } from 'react';
import { Card, CardMedia, Typography, IconButton, Stack } from '@mui/material';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';

const Audiopost = ({ audioSrc, profilePhoto, title, userName }) => {
  const [paused, setPaused] = useState(true);
  const [imgSrc, setImgSrc] = useState(profilePhoto);
  const [audio] = useState(new Audio(audioSrc));

  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;

    img.onload = () => {
      console.log('Profile Photo Loaded:', imgSrc);
    };

    img.onerror = () => {
      console.error('Failed to load image, using default image.', imgSrc);
      setImgSrc('/images/default-profile.jpg'); // Ensure this path is correct
    };
  }, [imgSrc]);

  useEffect(() => {
    console.log('Audio Source:', audioSrc);
    if (!audioSrc) {
      console.error('Audio source is undefined or empty.');
    } else {
      audio.src = audioSrc;
      console.log('Audio source set to:', audio.src);
    }
  }, [audioSrc, audio]);

  const handlePlayPause = () => {
    if (paused) {
      audio.play()
        .then(() => console.log('Audio is playing...'))
        .catch(err => console.error('Failed to play audio:', err));
    } else {
      audio.pause();
      console.log('Audio is paused.');
    }
    setPaused(!paused);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        width: { xs: '100%', sm: 'auto' },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 2,
      }}
    >
      <CardMedia
        component="img"
        width="100"
        height="100"
        alt={`${userName}'s profile`}
        src={imgSrc || '/images/default-profile.jpg'}
        sx={{ width: { xs: '100%', sm: 100 } }}
      />
      <Stack direction="column" alignItems="center" spacing={1} useFlexGap>
        <div>
          <Typography color="text.primary" fontWeight="semiBold">
            {title || 'Unknown Title'}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="medium"
            textAlign="center"
            sx={{ width: '100%' }}
          >
            {userName || 'Unknown Artist'}
          </Typography>
        </div>
        <Stack direction="row" alignItems="center" spacing={1} useFlexGap>
          <IconButton aria-label="Shuffle" disabled size="small">
            <ShuffleRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Fast rewind" disabled size="small">
            <FastRewindRounded fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={paused ? 'Play music' : 'Pause music'}
            onClick={handlePlayPause}
            sx={{ mx: 1 }}
          >
            {paused ? <PlayArrowRounded /> : <PauseRounded />}
          </IconButton>
          <IconButton aria-label="Fast forward" disabled size="small">
            <FastForwardRounded fontSize="small" />
          </IconButton>
          <IconButton aria-label="Loop music" disabled size="small">
            <LoopRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
};

export default Audiopost;