// ImagePostCard.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

// Custom styling for the Card and CardContent
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: '16px 0',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Adds a shadow effect
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)', // Scale effect on hover
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light background
  backdropFilter: 'blur(5px)',
  borderRadius: '0 0 12px 12px', // Rounded corners for the bottom
}));

const ImagePostCard = ({ title, date, image, description, userName }) => {
  // Check if date is a valid Date object or can be converted to a Date
  const postDate = new Date(date);
  const isValidDate = !isNaN(postDate);

  return (
    <StyledCard>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {userName.charAt(0)} {/* Display first letter of username */}
          </Avatar>
        }
        title={<Typography variant="h6">{title}</Typography>}
        subheader={
          <Typography variant="subtitle2" sx={{ color: 'gray' }}>
            {isValidDate ? postDate.toLocaleTimeString() : 'Invalid date'} {/* Correct date formatting */}
          </Typography>
        }
      />
      <CardMedia
        component="img"
        height="300"
        image={image}
        alt="Image post"
        sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} // Rounded corners for the image
      />
      <StyledCardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <IconButton aria-label="add to favorites" sx={{ color: red[500] }}>
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share" sx={{ color: 'primary.main' }}>
            <ShareIcon />
          </IconButton>
        </div>
      </StyledCardContent>
    </StyledCard>
  );
};

export default ImagePostCard;