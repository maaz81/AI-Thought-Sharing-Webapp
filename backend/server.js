const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const envSecret = require('./config/env');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user/userRoutes');
const postRoutes = require('./routes/user/postRoutes');
const profileRoutes = require('./routes/user/profileRoutes');
const postDetailsRoutes = require('./routes/user/postDetailsRoutes');
const updatePostRoutes = require('./routes/user/updatePostRoutes');
const aiRoutes = require('./routes/user/aiRoutes');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const userDetailsRoutes = require('./routes/user/userDetailsRoutes');
const setPostRoutes = require('./routes/user/setPostRoutes');
const path = require('path');

const adminAuthRoutes = require('./routes/admin/adminAuthRoute');
const  dashboard  = require('./routes/admin/adminDashboardRoutes');
const  adminPostRoutes  = require('./routes/admin/adminPostRoutes');


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
app.use('/api/setpost', setPostRoutes);


// Admin Routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/dashboard', dashboard);
app.use('/api/admin/posts', adminPostRoutes);


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
