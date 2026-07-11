const http = require('http');
const socketIo = require('socket.io');
const dns = require('dns');
const logger = require('./config/logger');

const app = require('./app');

const envSecret = require('./config/env');
const connectDB = require('./config/db');

dns.setServers(["1.1.1.1", "0.0.0.0"]);

connectDB();

process.on(
  'uncaughtException',
  (err) => {
    logger.error({
      type: 'UNCAUGHT_EXCEPTION',
      message: err.message,
      stack: err.stack
    });

    process.exit(1);
  }
);

process.on(
  'unhandledRejection',
  (err) => {
    logger.error({
      type: 'UNHANDLED_REJECTION',
      message: err.message,
      stack: err.stack
    });

    server.close(() => {
      process.exit(1);
    });
  }
);

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
  logger.info({
    type: 'SOCKET',
    event: 'connect',
    socketId: socket.id
  });

  socket.on('disconnect', () => {
    logger.info({
      type: 'SOCKET',
      event: 'disconnect',
      socketId: socket.id
    });
  });
});

server.listen(envSecret.PORT, () => {
  logger.info({
    type: 'SERVER',
    message: `Server running on port ${envSecret.PORT}`
  });
});