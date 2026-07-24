const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const userRoutes = require('./routes/user/userRoutes');
const postRoutes = require('./routes/user/postRoutes');
const profileRoutes = require('./routes/user/profileRoutes');
const postDetailsRoutes = require('./routes/user/postDetailsRoutes');
const updatePostRoutes = require('./routes/user/updatePostRoutes');
const aiRoutes = require('./routes/user/aiRoutes');
const userDetailsRoutes = require('./routes/user/userDetailsRoutes');
const setPostRoutes = require('./routes/user/setPostRoutes');
const followerRoutes = require('./routes/user/followRoutes');
const adminAuthRoutes = require('./routes/admin/adminAuthRoute');
const systemReactionRoutes = require('./routes/user/systemReactionRoutes');

const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');
const requestLogger =
    require('./middleware/requestLogger');

const app = express();

const allowedOrigins = [
    "http://localhost:5000",
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(requestLogger);

app.use(
    cors({
        origin(origin, callback) {

            console.log("Incoming Origin:", origin);
            console.log("Allowed Origins:", allowedOrigins);

            if (!origin) {
                console.log("✅ No origin (Postman/server request)");
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                console.log("✅ Origin allowed");
                return callback(null, true);
            }

            console.log("❌ Origin blocked");
            return callback(new Error(`Origin '${origin}' not allowed`));
        },
        credentials: true
    })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
    })
);

// Routes
app.use('/api/auth', userRoutes);
app.use('/api', postRoutes);
app.use('/api/update', updatePostRoutes);
app.use('/profile', profileRoutes);
app.use('/profile', postDetailsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/update/profile', userDetailsRoutes);
app.use('/api/setpost', setPostRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/system/reaction', systemReactionRoutes);
app.use('/api/admin', adminAuthRoutes);

app.get('/', (req, res) => {
    res.send('hello');
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;