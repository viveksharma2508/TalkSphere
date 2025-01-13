// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// app.use(cors());

// const users = [];

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Listen for new users joining
//   socket.on('newUser', (user) => {
//     // Check if user already exists based on socket ID
//     const existingUser = users.find((u) => u.socketID === socket.id);
//     if (!existingUser) {
//       users.push({ socketID: socket.id, ...user });
//       console.log('New user added:', user);
//       io.emit('newUserResponse', users); // Broadcast updated user list
//     }
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     const index = users.findIndex((user) => user.socketID === socket.id);
//     if (index !== -1) {
//       console.log('User disconnected:', users[index]);
//       users.splice(index, 1); // Remove user from the list
//       io.emit('newUserResponse', users); // Broadcast updated user list
//     }
//   });
// });

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });


// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// const users = [];

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // File upload setup using Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, './uploads'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
// const upload = multer({ storage: storage });

// // File upload route
// app.post('/upload', upload.single('profilePhoto'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }
//   const photoUrl = `http://localhost:3000/uploads/${req.file.filename}`;
//   res.json({ photoUrl });
// });

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log(`[Connected] User connected: ${socket.id}`);

//   socket.on('newUser', (user) => {
//     console.log('[Event] Received newUser:', user);
//     const existingUser = users.find((u) => u.socketID === socket.id);
//     if (!existingUser) {
//       users.push({ socketID: socket.id, ...user });
//       console.log('[Updated Users List]:', users);
//       io.emit('newUserResponse', users);
//     }
//   });

//   socket.on('message', (data) => {
//     console.log(`[Message] Received from ${data.sender}:`, data);
//     io.emit('message', data); // Broadcast the message to all clients
//   });

//   socket.on('disconnect', () => {
//     const index = users.findIndex((user) => user.socketID === socket.id);
//     if (index !== -1) {
//       console.log('[Disconnected] User:', users[index]);
//       users.splice(index, 1);
//       console.log('[Updated Users List after Disconnection]:', users);
//       io.emit('newUserResponse', users);
//     }
//   });
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const users = []; // Declare users array

const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:5173", "https://talksphere-2.onrender.com"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://talksphere-2.onrender.com"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload setup using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// File upload route
app.post('/upload', upload.single('profilePhoto'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const photoUrl = `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
  res.json({ photoUrl });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`[Connected] User connected: ${socket.id}`);

  socket.on('newUser', (user) => {
    console.log('[Event] Received newUser:', user);
    const existingUser = users.find((u) => u.socketID === socket.id);
    if (!existingUser) {
      users.push({ socketID: socket.id, ...user });
      console.log('[Updated Users List]:', users);
      io.emit('newUserResponse', users);
    }
  });

  socket.on('message', (data) => {
    console.log(`[Message] Received from ${data.sender}:`, data);
    io.emit('message', data); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((user) => user.socketID === socket.id);
    if (index !== -1) {
      console.log('[Disconnected] User:', users[index]);
      users.splice(index, 1);
      console.log('[Updated Users List after Disconnection]:', users);
      io.emit('newUserResponse', users);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
