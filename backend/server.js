const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const envSecret = require('./config/env');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postDetailsRoutes = require('./routes/postDetailsRoutes');
const updatePostRoutes = require('./routes/updatePostRoutes');
const aiRoutes = require('./routes/aiRoutes');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const userDetailsRoutes = require('./routes/userDetailsRoutes');
const path = require('path');



// Setup Express App
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",  // 👈 Your frontend port
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', userRoutes);
app.use('/api', postRoutes);
app.use('/api/update',updatePostRoutes);
app.use('/profile', profileRoutes);
app.use('/profile', postDetailsRoutes);
app.use('/api/ai', aiRoutes)
app.use('/api/update/profile', userDetailsRoutes)

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io globally available (for controllers to use)
app.set('io', io);

// Socket.io connection listener
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('hello');
});

// Start server
server.listen(envSecret.PORT, () => {
  console.log(`Server running on port ${envSecret.PORT}`);
});
