const http = require('http');
const socketIo = require('socket.io');
const dns = require('dns');

const app = require('./app');

const envSecret = require('./config/env');
const connectDB = require('./config/db');

dns.setServers(["1.1.1.1", "0.0.0.0"]);

connectDB();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(envSecret.PORT, () => {
  console.log(`Server running on port ${envSecret.PORT}`);
});