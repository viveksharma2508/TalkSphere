// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Badge from '@mui/material/Badge';
// import Avatar from '@mui/material/Avatar';

// // Styled Badge with green dot and ripple animation
// const StyledBadge = styled(Badge)(({ theme }) => ({
//     '& .MuiBadge-badge': {
//         backgroundColor: '#44b700',
//         color: '#44b700',
//         boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//         '&::after': {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             borderRadius: '50%',
//             animation: 'ripple 1.2s infinite ease-in-out',
//             border: '1px solid currentColor',
//             content: '""',
//         },
//     },
//     '@keyframes ripple': {
//         '0%': {
//             transform: 'scale(.8)',
//             opacity: 1,
//         },
//         '100%': {
//             transform: 'scale(2.4)',
//             opacity: 0,
//         },
//     },
// }));

// // Avatar component with the StyledBadge
// const StyledAvatar = ({ profilePhotoUrl, userName }) => {
//     return (
//         <StyledBadge
//             overlap="circular"
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             variant="dot"
//         >
//             <Avatar
//                 alt={userName}
//                 src={profilePhotoUrl || '/default-profile.jpg'}
//                 sx={{ width: 100, height: 100 }} // Adjust size as needed
//             />
//         </StyledBadge>
//     );
// };
// src/Styles/StyledAvatar.jsx
// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Badge from '@mui/material/Badge';
// import Avatar from '@mui/material/Avatar';

// const IK_ENDPOINT = (import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '').replace(/\/+$/, '');

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: '#44b700',
//     color: '#44b700',
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     '&::after': {
//       position: 'absolute',
//       top: 0, left: 0, width: '100%', height: '100%',
//       borderRadius: '50%',
//       animation: 'ripple 1.2s infinite ease-in-out',
//       border: '1px solid currentColor',
//       content: '""',
//     },
//   },
//   '@keyframes ripple': { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.4)', opacity: 0 } },
// }));

// const isAbs = (u) => /^https?:\/\//i.test(u || '');
// const isDataOrBlob = (u) => /^data:|^blob:|^filesystem:/i.test(u || '');
// const isLocalFallback = (u) => u === '/avatar-default.jpg'; // only explicit public fallback is local

// const toIk = (path, size = 100) => {
//   if (!IK_ENDPOINT || !path) return '';
//   const p = path.startsWith('/') ? path : `/${path}`;
//   return `${IK_ENDPOINT}${p}?tr=w-${size},h-${size},fo-face`; // ImageKit URL transforms [2]
// };

// function getInitials(name = '') {
//   const parts = String(name).trim().split(/\s+/).filter(Boolean);
//   if (!parts.length) return '?';
//   if (parts.length === 1) return ((parts || '') + (parts[4] || '')).toUpperCase();
//   return ((parts || '') + (parts[parts.length - 1] || '')).toUpperCase();
// }

// export default function StyledAvatar({
//   profilePhotoUrl,
//   userName,
//   size = 100,
//   fallbackSrc = '/avatar-default.jpg', // must exist in /public
//   showStatus = true,
// }) {
//   const computedSrc = React.useMemo(() => {
//     if (!profilePhotoUrl) return '';                                    // let fallback handle empty [1]
//     if (isAbs(profilePhotoUrl) || isDataOrBlob(profilePhotoUrl)) return profilePhotoUrl; // use absolute as-is [1]
//     if (isLocalFallback(profilePhotoUrl)) return '';                    // force fallback for the known local asset [1]
//     return toIk(profilePhotoUrl, size);                                 // compose ImageKit URL for relative paths [2]
//   }, [profilePhotoUrl, size]);

//   const [src, setSrc] = React.useState(computedSrc || '');

//   React.useEffect(() => {
//     if (!computedSrc) { setSrc(''); return; }                           // no remote request → use fallback [1]
//     const img = new Image();
//     img.onload = () => setSrc(computedSrc);
//     img.onerror = () => { console.warn('[StyledAvatar] preload error:', computedSrc); setSrc(''); };
//     img.referrerPolicy = 'no-referrer';
//     img.crossOrigin = 'anonymous';
//     img.src = computedSrc;
//     return () => { img.onload = null; img.onerror = null; };
//   }, [computedSrc]);

//   const initials = React.useMemo(() => getInitials(userName), [userName]);

//   const Wrapper = showStatus ? StyledBadge : React.Fragment;
//   const wrapperProps = showStatus
//     ? { overlap: 'circular', anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, variant: 'dot' }
//     : {};

//   return (
//     <Wrapper {...wrapperProps}>
//       <Avatar
//         alt={userName}
//         src={src || fallbackSrc}
//         sx={{ width: size, height: size }}
//         imgProps={{
//           loading: 'lazy',
//           crossOrigin: 'anonymous',
//           referrerPolicy: 'no-referrer',
//           onError: (e) => { console.warn('[StyledAvatar] onError → fallback:', src); setSrc(''); e.currentTarget.src = fallbackSrc; },
//         }}
//       >
//         {initials}
//       </Avatar>
//     </Wrapper>
//   );
// }


import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

const IK_ENDPOINT = (import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '').replace(/\/+$/, '');

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.4)', opacity: 0 } },
}));

const isAbs = (u) => /^https?:\/\//i.test(u || '');
const isDataOrBlob = (u) => /^data:|^blob:|^filesystem:/i.test(u || '');
const isLocalFallback = (u) => u === '/avatar-default.jpg';

const toIk = (path, size = 100) => {
  if (!IK_ENDPOINT || !path) return '';
  
  // Clean the path - remove leading slash if present, then add it back
  const cleanPath = path.replace(/^\/+/, '');
  const finalPath = `/${cleanPath}`;
  
  // Construct ImageKit URL
  const ikUrl = `${IK_ENDPOINT}${finalPath}?tr=w-${size},h-${size},fo-face,c-fill`;
  
  console.log('ImageKit URL constructed:', ikUrl); // Debug log
  return ikUrl;
};

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) {
    const firstPart = parts[0] || '';
    return (firstPart[0] || '').toUpperCase();
  }
  const firstInitial = (parts[0] || '')[0] || '';
  const lastInitial = (parts[parts.length - 1] || '')[0] || '';
  return (firstInitial + lastInitial).toUpperCase();
}

export default function StyledAvatar({
  profilePhotoUrl,
  userName,
  size = 100,
  fallbackSrc = '/avatar-default.jpg',
  showStatus = true,
}) {
  const computedSrc = React.useMemo(() => {
    console.log('Computing src for:', profilePhotoUrl); // Debug log
    
    if (!profilePhotoUrl) return '';
    if (isAbs(profilePhotoUrl) || isDataOrBlob(profilePhotoUrl)) return profilePhotoUrl;
    if (isLocalFallback(profilePhotoUrl)) return '';
    
    return toIk(profilePhotoUrl, size);
  }, [profilePhotoUrl, size]);

  const [src, setSrc] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!computedSrc) {
      setSrc('');
      setLoading(false);
      return;
    }

    setLoading(true);
    const img = new Image();
    
    img.onload = () => {
      console.log('Image loaded successfully:', computedSrc);
      setSrc(computedSrc);
      setLoading(false);
    };
    
    img.onerror = (error) => {
      console.warn('[StyledAvatar] Image load error:', computedSrc, error);
      setSrc('');
      setLoading(false);
    };
    
    img.referrerPolicy = 'no-referrer';
    img.crossOrigin = 'anonymous';
    img.src = computedSrc;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [computedSrc]);

  const initials = React.useMemo(() => getInitials(userName), [userName]);

  const handleImageError = (e) => {
    console.warn('[StyledAvatar] Avatar image error, falling back to default');
    setSrc('');
    if (e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  };

  const Wrapper = showStatus ? StyledBadge : React.Fragment;
  const wrapperProps = showStatus
    ? { overlap: 'circular', anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, variant: 'dot' }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <Avatar
        alt={userName}
        src={src || fallbackSrc}
        sx={{ 
          width: size, 
          height: size,
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s ease'
        }}
        imgProps={{
          loading: 'lazy',
          crossOrigin: 'anonymous',
          referrerPolicy: 'no-referrer',
          onError: handleImageError,
        }}
      >
        {initials}
      </Avatar>
    </Wrapper>
  );
}
