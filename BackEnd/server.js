
// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const ImageKit = require('imagekit');

// // Import database connection
// const connection = require('./db');

// // Import middleware
// const authMiddleware = require('./middleware/auth');
// const errorHandler = require('./middleware/error');
// const logger = require('./middleware/logger');

// // Import controllers
// const authController = require('./controllers/authController');
// const userController = require('./controllers/userController');
// const messageController = require('./controllers/messageController');

// // Import models for Socket.IO
// const User = require('./models/User');
// const Message = require('./models/Message');

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // Keep in-memory users array for quick Socket.IO access
// const users = [];

// const io = socketIO(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST"]
//   }
// });


// // IMAGEKIT CONFIGURATION

// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
// });


// app.use(cors({
//   origin: ["http://localhost:5173"],
//   methods: ["GET", "POST"],
//   credentials: true
// }));

// app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(logger); // Request logging


// // API ROUTES


// // Public routes (no authentication required)
// app.post('/api/auth/register', authController.register);
// app.post('/api/auth/login', authController.login);

// // ImageKit authentication endpoint (for direct client uploads)
// app.get('/api/imagekit-auth', (req, res) => {
//   try {
//     const authenticationParameters = imagekit.getAuthenticationParameters();
//     res.json({
//       success: true,
//       ...authenticationParameters
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate ImageKit auth parameters',
//       error: error.message
//     });
//   }
// });

// // Server-side upload route (using base64 or buffer from frontend)
// app.post('/api/upload', async (req, res) => {
//   try {
//     const { file, fileName } = req.body;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file data provided'
//       });
//     }

//     // Handle base64 file upload
//     let fileBuffer;
//     let originalFileName = fileName || `profile_${Date.now()}.jpg`;

//     if (typeof file === 'string') {
//       // If file is base64 string
//       if (file.startsWith('data:')) {
//         // Remove data:image/jpeg;base64, prefix
//         const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
//         fileBuffer = Buffer.from(base64Data, 'base64');
//       } else {
//         fileBuffer = Buffer.from(file, 'base64');
//       }
//     } else if (Buffer.isBuffer(file)) {
//       fileBuffer = file;
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid file format'
//       });
//     }

//     // Upload to ImageKit
//     const result = await imagekit.upload({
//       file: fileBuffer,
//       fileName: originalFileName,
//       folder: '/talksphere/profiles',
//       transformation: {
//         pre: 'w-200,h-200,c-maintain_ratio', // Resize to 200x200
//         post: [{
//           type: 'transformation',
//           value: 'q-80' // 80% quality
//         }]
//       },
//       useUniqueFileName: true,
//       tags: ['profile', 'talksphere']
//     });

//     res.json({
//       success: true,
//       message: 'File uploaded successfully',
//       photoUrl: result.url,
//       thumbnailUrl: result.thumbnailUrl,
//       fileId: result.fileId
//     });

//   } catch (error) {
//     console.error('ImageKit upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'File upload failed',
//       error: error.message
//     });
//   }
// });

// // Alternative: Direct URL upload (if user provides image URL)
// app.post('/api/upload-url', async (req, res) => {
//   try {
//     const { imageUrl, fileName } = req.body;

//     if (!imageUrl) {
//       return res.status(400).json({
//         success: false,
//         message: 'No image URL provided'
//       });
//     }

//     // Upload from URL to ImageKit
//     const result = await imagekit.upload({
//       file: imageUrl, // ImageKit accepts URLs directly
//       fileName: fileName || `profile_${Date.now()}.jpg`,
//       folder: '/talksphere/profiles',
//       useUniqueFileName: true,
//       tags: ['profile', 'talksphere']
//     });

//     res.json({
//       success: true,
//       message: 'File uploaded successfully',
//       photoUrl: result.url,
//       thumbnailUrl: result.thumbnailUrl,
//       fileId: result.fileId
//     });

//   } catch (error) {
//     console.error('ImageKit URL upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'File upload failed',
//       error: error.message
//     });
//   }
// });

// // Delete image endpoint
// app.delete('/api/delete-image/:fileId', authMiddleware, async (req, res) => {
//   try {
//     const { fileId } = req.params;

//     await imagekit.deleteFile(fileId);

//     res.json({
//       success: true,
//       message: 'Image deleted successfully'
//     });

//   } catch (error) {
//     console.error('ImageKit delete error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete image',
//       error: error.message
//     });
//   }
// });

// // Protected routes (require JWT authentication)
// app.get('/api/auth/me', authMiddleware, authController.me);

// // User routes
// app.get('/api/users', authMiddleware, userController.getAllUser);
// app.put('/api/users/profile', authMiddleware, userController.updateProfile);
// app.put('/api/users/status', authMiddleware, userController.updateStatus);

// // Message routes
// app.post('/api/messages', authMiddleware, messageController.sendMessage);
// app.get('/api/messages', authMiddleware, messageController.getMessage);
// app.delete('/api/messages/:messageId', authMiddleware, messageController.deleteMessage);

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true,
//     message: 'Server is running!',
//     timestamp: new Date().toISOString(),
//     imagekit: 'configured'
//   });
// });


// // SOCKET.IO CONNECTION (Updated with MongoDB)

// io.on('connection', (socket) => {
//   console.log(`[Connected] User connected: ${socket.id}`);

//   // Handle new user joining
//   socket.on('newUser', async (userData) => {
//     try {
//       console.log('[Event] Received newUser:', userData);

//       // Find or update user in MongoDB
//       const user = await User.findOneAndUpdate(
//         { username: userData.username },
//         {
//           $set: {
//             socketID: socket.id,
//             status: 'online',
//             photoUrl: userData.photoUrl || null,
//             lastSeen: new Date()
//           }
//         },
//         { new: true, upsert: true }
//       );

//       // Update in-memory array for quick access
//       const existingUserIndex = users.findIndex(u => u.username === userData.username);
//       const userForEmit = {
//         socketID: socket.id,
//         username: user.username,
//         photoUrl: user.photoUrl,
//         status: user.status
//       };

//       if (existingUserIndex !== -1) {
//         users[existingUserIndex] = userForEmit;
//       } else {
//         users.push(userForEmit);
//       }

//       console.log('[Updated Users List]:', users);
//       io.emit('newUserResponse', users);

//     } catch (error) {
//       console.error('Error in newUser:', error);
//       socket.emit('error', { message: 'Failed to join chat' });
//     }
//   });

//   // Handle message sending
//   socket.on('message', async (data) => {
//     try {
//       console.log(`[Message] Received from ${data.sender}:`, data);

//       // Find sender in database
//       const sender = await User.findOne({ username: data.sender });
//       if (!sender) {
//         socket.emit('error', { message: 'Sender not found' });
//         return;
//       }

//       // Find receiver (if private message)
//       let receiver = null;
//       if (data.receiver && data.receiver !== 'Everyone') {
//         receiver = await User.findOne({ username: data.receiver });
//       }

//       // Save message to database
//       const message = await Message.create({
//         senderId: sender._id,
//         receiverId: receiver ? receiver._id : null,
//         content: data.text || data.content || '',
//         attachmentUrl: data.attachmentUrl || null,
//         deliveredAt: new Date()
//       });

//       // Prepare message for broadcast
//       const messageForBroadcast = {
//         id: message._id,
//         sender: data.sender,
//         receiver: data.receiver || null,
//         text: data.text || data.content || '',
//         attachmentUrl: data.attachmentUrl || null,
//         timestamp: message.createdAt,
//         senderPhoto: sender.photoUrl
//       };

//       // Broadcast message
//       if (receiver && receiver.socketID) {
//         // Private message - send to specific user
//         io.to(receiver.socketID).emit('message', messageForBroadcast);
//         socket.emit('message', messageForBroadcast); // Send back to sender
//       } else {
//         // Public message - broadcast to all
//         io.emit('message', messageForBroadcast);
//       }

//     } catch (error) {
//       console.error('Error saving message:', error);
//       socket.emit('error', { message: 'Failed to send message' });
//     }
//   });

//   // Handle user disconnect
//   socket.on('disconnect', async () => {
//     try {
//       // Update user status in MongoDB
//       const user = await User.findOneAndUpdate(
//         { socketID: socket.id },
//         {
//           $set: {
//             status: 'offline',
//             lastSeen: new Date()
//           },
//           $unset: { socketID: 1 }
//         },
//         { new: true }
//       );

//       // Update in-memory array
//       const index = users.findIndex((user) => user.socketID === socket.id);
//       if (index !== -1) {
//         console.log('[Disconnected] User:', users[index]);
//         users.splice(index, 1);
//         console.log('[Updated Users List after Disconnection]:', users);
//         io.emit('newUserResponse', users);
//       }

//       if (user) {
//         console.log(`[Disconnected] ${user.username} went offline`);
//       }

//     } catch (error) {
//       console.error('Error on disconnect:', error);
//     }
//   });

//   // Handle typing indicators
//   socket.on('typing', (data) => {
//     socket.broadcast.emit('userTyping', {
//       username: data.username,
//       isTyping: data.isTyping
//     });
//   });
// });


// // ERROR HANDLING MIDDLEWARE (Must be last!)
// app.use(errorHandler);

// // Handle unhandled routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });


// // START SERVER

// const PORT = process.env.PORT || 3000;

// async function startServer() {
//   try {
//     // Connect to MongoDB first
//     await connection(process.env.MONGODB_URL);

//     // Start server after successful DB connection
//     server.listen(PORT, () => {
//       console.log(` Server is running on port ${PORT}`);
//       console.log(`Socket.IO server ready`);
//       console.log(`ImageKit configured`);
//       console.log(`API endpoints available at http://localhost:${PORT}/api`);
//     });

//   } catch (error) {
//     console.error('Failed to start server:', error.message);
//     process.exit(1);
//   }
// }

// // Handle graceful shutdown
// process.on('SIGTERM', async () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   server.close(() => {
//     console.log('Process terminated');
//   });
// });

// process.on('SIGINT', async () => {
//   console.log('SIGINT received, shutting down gracefully');
//   server.close(() => {
//     console.log('Process terminated');
//   });
// });

// // Start the server
// startServer();

// server.js (drop-in)
// -------------------------------------------------
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const ImageKit = require('imagekit');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


dotenv.config();

// DB connection
const connection = require('./db');

// Middlewares
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');

// Controllers
const authController = require('./controllers/authController');
const userController = require('./Controllers/userController')
const messageController = require('./controllers/messageController');

// Models
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);


// -------------------------------------------------
// Socket.IO
// -------------------------------------------------
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
  // smooth reconnection after short drops
  connectionStateRecovery: {}, // optional but helpful
});

// Authoritative presence: userId -> { _id, username, photoUrl, socketID, count }
const online = new Map();

// Helper: broadcast a deduped, authoritative list
function broadcastUsers() {
  const list = Array.from(online.values());
  io.emit('users:update', list);
  // backward-compat for existing clients
  io.emit('newUserResponse', list);
}

// Verify JWT from handshake and attach identity to socket

// io.use(async (socket, next) => {
//   try {
//     const token =
//       socket.handshake.auth?.token ||
//       (socket.handshake.headers?.authorization || '').replace(/^Bearer\s+/i, '') ||
//       null;

//     if (!token) return next(new Error('Missing auth token'));

//     const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
//     const { userId } = jwt.verify(token, secret);

//     if (!userId) return next(new Error('Invalid token payload'));

//     // Enrich from DB (username/photo)
//     const dbUser = await User.findById(userId).select('username photoUrl');
//     if (!dbUser) return next(new Error('User not found'));

//     socket.userId = String(userId);
//     socket.username = dbUser.username;
//     socket.photoUrl = dbUser.photoUrl || null;

//     return next();
//   } catch (e) {
//     return next(e);
//   }
// });

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;            // read credentials from auth [21]
    if (!token) return next(new Error('Unauthorized'));    // reject missing [21]
    const { userId } = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // verify JWT [24]
    const u = await User.findById(userId).select('username photoUrl');
    if (!u) return next(new Error('Unauthorized'));        // reject unknown [21]
    socket.userId = String(u._id);
    socket.username = u.username;
    socket.photoUrl = u.photoUrl || null;
    next();
  } catch (e) {
    next(new Error('Unauthorized'));                       // reject invalid [21][24]
  }
});

io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.userId, socket.username); // should appear after login [32]
  socket.on('disconnect', (reason) =>
    console.log('❌ Socket disconnected:', socket.userId, socket.username, reason)
  );                                                                   // lifecycle [32]
});

io.engine.on('connection_error', (err) =>
  console.log('engine_conn_error', err.code, err.message, err.context?.status)
);                                                                      // diagnose 400/403 [34]




// -------------------------------------------------
// Global Middleware
// -------------------------------------------------
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(logger);
// -------------------------------------------------
// ImageKit Configuration
// -------------------------------------------------
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// -------------------------------------------------
// Routes
// -------------------------------------------------

// Auth
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.me);

// ImageKit auth (optional)
app.get('/api/imagekit-auth', (req, res) => {
  try {
    const params = imagekit.getAuthenticationParameters();
    res.json({ success: true, ...params });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate ImageKit auth parameters',
      error: error.message,
    });
  }
});

// Upload (JSON + base64)
app.post('/api/upload', async (req, res) => {
  try {
    const { file, fileName } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const dataUrlRegex = /^data:(?<mime>image\/[a-zA-Z0-9.+-]+);base64,(?<b64>.+)$/;
    let base64 = file;
    let mime = 'image/jpeg';

    const match = file.match(dataUrlRegex);
    if (match?.groups?.b64) {
      base64 = match.groups.b64;
      mime = match.groups.mime;
    }

    const buffer = Buffer.from(base64, 'base64');

    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName || `profile_${Date.now()}.jpg`,
      folder: 'talksphere/profiles',
      useUniqueFileName: true,
      tags: ['profile', 'talksphere'],
    });

    const thumbnailUrl = imagekit.url({
      path: result.filePath,
      transformation: [
        { width: 200, height: 200, crop: 'maintain_ratio' },
        { quality: '80', format: 'auto' },
      ],
    });

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      photoUrl: result.url,
      thumbnailUrl,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return res
      .status(400)
      .json({ success: false, message: error?.message || 'File upload failed' });
  }
});

// Upload-by-URL
app.post('/api/upload-url', async (req, res) => {
  try {
    const { imageUrl, fileName } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'No image URL provided' });
    }

    const result = await imagekit.upload({
      file: imageUrl,
      fileName: fileName || `profile_${Date.now()}.jpg`,
      folder: 'talksphere/profiles',
      useUniqueFileName: true,
      tags: ['profile', 'talksphere'],
    });

    const thumbnailUrl = imagekit.url({
      path: result.filePath,
      transformation: [
        { width: 200, height: 200, crop: 'maintain_ratio' },
        { quality: '80', format: 'auto' },
      ],
    });

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      photoUrl: result.url,
      thumbnailUrl,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error('ImageKit URL upload error:', error);
    return res
      .status(400)
      .json({ success: false, message: error?.message || 'File upload failed' });
  }
});

// Delete image
app.delete('/api/delete-image/:fileId', authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;
    await imagekit.deleteFile(fileId);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete image', error: error.message });
  }
});

// Users
app.get('/api/users', authMiddleware, userController.getAllUser);
app.put('/api/users/profile', authMiddleware, userController.updateProfile);
app.put('/api/users/status', authMiddleware, userController.updateStatus);

// Messages
app.post('/api/messages', authMiddleware, messageController.sendMessage);
app.get('/api/messages', authMiddleware, messageController.getMessage);
app.delete('/api/messages/:messageId', authMiddleware, messageController.deleteMessage);

// Health
app.get('/api/health', (req, res) => {
  const c = mongoose.connection;
  const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    imagekit: 'configured',
    db: {
      state: stateNames[c.readyState] || String(c.readyState),
      name: c.db?.databaseName || c.name,
      host: c.host || null,
    },
  });
});

// -------------------------------------------------
// Socket.IO Events
// -------------------------------------------------
io.on('connection', async (socket) => {
  console.log(`[Connected] ${socket.username} (${socket.id})`);

  // Upsert DB presence and update Map
  try {
    await User.findByIdAndUpdate(
      socket.userId,
      { $set: { socketID: socket.id, status: 'online' } },
      { new: true }
    );
  } catch {}

  const entry = online.get(socket.userId) || {
    _id: socket.userId,
    username: socket.username,
    photoUrl: socket.photoUrl || null,
    socketID: socket.id,
    count: 0,
  };
  entry.count += 1;
  entry.socketID = socket.id; // keep latest
  online.set(socket.userId, entry);
  broadcastUsers();

  // Optional: align with legacy client "newUser" without trusting identity
  socket.on('newUser', async (userData = {}) => {
    try {
      // Use socket.* identity (JWT), only photoUrl is optionally updated if provided
      const photoUrl = userData.photoUrl || userData.profilePhotoUrl || socket.photoUrl || null;

      await User.findByIdAndUpdate(
        socket.userId,
        { $set: { socketID: socket.id, status: 'online', photoUrl } },
        { new: true, upsert: false }
      );

      const cur = online.get(socket.userId);
      if (cur) {
        cur.photoUrl = photoUrl || cur.photoUrl || null;
        cur.socketID = socket.id;
        online.set(socket.userId, cur);
      }
      broadcastUsers();
    } catch (e) {
      console.error('Error in newUser:', e);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  socket.on('users:list', () => {
    broadcastUsers();
  });

  // Message pipeline (no duplicate echo to sender)
socket.on('message', async (data = {}) => {
  try {
    const senderId = data.senderId || socket.userId;
    const sender =
      (await User.findById(senderId)) ||
      (data.sender ? await User.findOne({ username: data.sender }) : null);
    if (!sender) return socket.emit('error', { message: 'Sender not found' });

    let receiver = null;
    if (data.receiver && data.receiver !== 'Everyone') {
      receiver = await User.findOne({ username: data.receiver });
    }

    const message = await Message.create({
      senderId: sender._id,
      receiverId: receiver ? receiver._id : null,
      content: data.text || data.content || '',
      attachmentUrl: data.mediaUrl || data.attachmentUrl || null,
      deliveredAt: new Date(),
    });

    const broadcast = {
      id: message._id,
      sender: sender,
      receiver: data.receiver || null,
      text: data.text || data.content || '',
      attachmentUrl: data.mediaUrl || data.attachmentUrl || null,
      timestamp: message.createdAt,
      senderPhoto: sender.photoUrl || null,
      // optional: echo back a client tempId if you send one
      tempId: data.tempId || null,
    };

    if (receiver?.socketID) {
      // DM: only to receiver; do NOT echo to sender
      io.to(receiver.socketID).emit('message', broadcast);
      // if you need to confirm to sender with DB id, send via an ACK callback instead
      return;
    }

    // Group/broadcast: send to everyone EXCEPT the sender
    socket.broadcast.emit('message', broadcast);
  } catch (error) {
    console.error('Error saving message:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
});


  socket.on('disconnect', async (reason) => {
    try {
      const cur = online.get(socket.userId);
      if (cur) {
        cur.count -= 1;
        if (cur.count <= 0) {
          online.delete(socket.userId);
        } else if (cur.socketID === socket.id) {
          cur.socketID = null;
          online.set(socket.userId, cur);
        }
      }

      await User.findOneAndUpdate(
        { _id: socket.userId, socketID: socket.id },
        { $set: { status: 'offline', lastSeen: new Date() }, $unset: { socketID: 1 } }
      );

      broadcastUsers();
      console.log(`[Disconnected] ${socket.username} (${reason})`);
    } catch (error) {
      console.error('Error on disconnect:', error);
    }
  });
});

// -------------------------------------------------
// Error Handling & 404
// -------------------------------------------------
app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// -------------------------------------------------
// Start Server
// -------------------------------------------------
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connection(process.env.MONGODB_URL);

    server.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(`Socket.IO server ready`);
      console.log(`ImageKit configured`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => console.log('Process terminated'));
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => console.log('Process terminated'));
});

startServer();
