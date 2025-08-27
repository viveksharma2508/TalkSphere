
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper
} from '@mui/material';
import {
  Chat as ChatIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

import LockIcon from '@mui/icons-material/Lock';
import ComputerIcon from '@mui/icons-material/Computer';
import CodeIcon from '@mui/icons-material/Code';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: '#3A76F0' }} />,
      title: 'Real-time Chat',
      description: 'Instant messaging with friends and groups worldwide'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#3A76F0' }} />,
      title: 'Secure & Private',
      description: 'End-to-end encryption keeps your conversations safe'
    },
    {
      icon: <PublicIcon sx={{ fontSize: 40, color: '#3A76F0' }} />,
      title: 'No Ads, No trackers',
      description: 'There are no ads, no creepy tracking . So focus on sharing the moments that matter with the people who matter to you.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#3A76F0' }} />,
      title: 'Lightning Fast',
      description: 'Optimized for speed with cloud-powered infrastructure'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#3A76F0',
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Side - Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Welcome to
                <Box component="span" sx={{ color: '#FFFFFF', display: 'block' }}>
                  TalkSphere 💬
                </Box>
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Connect, Chat, and Share with Friends Around the World. 
                Experience the future of communication with real-time messaging, 
                file sharing, and global connectivity.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#3A76F0',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started Free
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      bgcolor: '#FFFFFF',
                      color: '#3A76F0',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Right Side - Features */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      color: '#3A76F0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: '#0F172A', color: '#E6E8F2', minHeight: '100vh' }}>
      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontWeight: 800, lineHeight: 1.1 }}
            >
            Secure, Authenticated chat with signed JWTs over TLS
            </Typography>
            <Typography
              variant="h6"
              sx={{ mt: 2, color: 'rgba(230,232,242,0.85)', maxWidth: 660 }}
            >
              Each API call and Socket.IO connection is verified with a short‑lived JWT, while HTTPS/WSS keeps data encrypted in transit; messages are processed on our servers.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  bgcolor: '#3B82F6',
                  '&:hover': { bgcolor: '#2563EB' },
                  fontWeight: 700,
                }}
                onClick={() => alert('Start flow')}
              >
                Get started free
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                sx={{
                  borderColor: 'rgba(230,232,242,0.4)',
                  color: '#E6E8F2',
                  '&:hover': { borderColor: '#E6E8F2', bgcolor: 'rgba(230,232,242,0.06)' },
                }}
                onClick={() => alert('See how it works')}
              >
                See how it works
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={8}
              sx={{
                p: 3,
                bgcolor: '#111827',
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,0.2)',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="overline" sx={{ color: '#93C5FD', letterSpacing: 1 }}>
                  Preview
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#0B1220',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(148,163,184,0.2)',
                    minHeight: 160,
                  }}
                >
                  <Typography sx={{ color: '#94A3B8' }}>
                    • Alice: Hey! Ready for the call?<br />
                    • Bob: Yup, joining now. 🔒
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Demo preview shows how messages appear—no tracking, no ads, just encrypted chat.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>



      {/* Privacy note */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: '#0B1220',
            borderRadius: 3,
            border: '1px solid rgba(148,163,184,0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color:'#9eb6e7ff', fontWeight: 800, mb: 1 }}>
            How privacy works
          </Typography>
          <Typography variant="body1" sx={{ color: '#AAB1C5', maxWidth: 900 }}>
            Sign in, receive a signed access token, and chat in real time; the server validates token signatures and claims on every request and connection.
          </Typography>
        </Paper>
      </Container>
    </Box>
      {/* Footer Section */}
<Box sx={{ bgcolor: '#3A76F0', py: 3, textAlign: 'center' }}>
<Typography variant="body2" sx={{ color: '#FFFFFF', opacity: 0.9 }}>
      This is a  project built for learning purposes. Not an official app.
</Typography>
</Box>
    </Box>
  );
};

export default LandingPage;