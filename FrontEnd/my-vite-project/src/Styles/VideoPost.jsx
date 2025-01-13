// File: VideoPost.jsx
import React from 'react';

const VideoPost = ({ userName, profilePhoto, videoSrc, title }) => {
  return (
    <div className="video-post">
      <div className="video-post__header">
        <img src={profilePhoto} alt={`${userName}'s profile`} className="profile-photo" />
        <p className="video-post__user">{userName}</p>
      </div>
      <div className="video-post__content">
        <video src={videoSrc} controls className="video-player" />
        <p className="video-post__title">{title || 'Video Post'}</p>
      </div>
    </div>
  );
};

export default VideoPost;