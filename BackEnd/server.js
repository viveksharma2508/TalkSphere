const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);


// CORS setup for Vite frontend
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique file names
    }
});
const upload = multer({ storage });

// File upload route
app.post('/upload', upload.single('profilePhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct URL for the uploaded photo
    const photoUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    // Send the photo URL back as JSON
    res.json({ photoUrl });
});

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io logic
let users = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle message event
    socket.on('message', (data) => {
        io.emit('message', data); // Broadcast the message to all clients
    });

    // Handle new user joining
    socket.on('newUser', (data) => {
        const newUser = {
            userName: data.userName,
            profilePhotoUrl: data.profilePhotoUrl || 'http://localhost:3000/uploads/defaultProfile.jpg', // Ensure photo is provided or set a default
            socketID: socket.id  // Use socket.id from server, not from client
        };

        users.push(newUser);
        io.emit('newUserResponse', users); // Emit updated users list to all clients
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketID !== socket.id); // Remove disconnected user
        console.log('User disconnected:', socket.id);
        io.emit('userLeft', users); // Broadcast updated users list
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});