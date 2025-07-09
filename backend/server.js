// const express = require('express');
// const app = express();
// const envSecret = require('./config/env');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const cookieParser = require('cookie-parser');
// const cors = require("cors");

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173", // 👈 your React frontend
//   credentials: true                // ✅ allow cookies
// }));

// connectDB();
// app.use('/api/users',userRoutes);
// app.use('/',postRoutes);


// app.get('/',(req,res)=>{
//     res.send('hello');
// })

// app.listen(envSecret.PORT, ()=>{
//     console.log(`Server is running on port ${envSecret.PORT}`);
// });


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const envSecret = require('./config/env');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postDetailsRoutes = require('./routes/postDetailsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const cookieParser = require('cookie-parser');
const cors = require("cors");

// Setup Express App
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",  // 👈 Your frontend port
  credentials: true
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/', postRoutes);
app.use('/profile', profileRoutes);
app.use('/profile', postDetailsRoutes);
app.use('/api/ai', aiRoutes)

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
