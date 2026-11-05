const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");

const userRoutes = require('./src/routes/userroutes');
const orderRoutes = require('./src/routes/orderroutes');
const categoryRoutes = require('./src/routes/categoryroutes');
const productRoutes = require('./src/routes/productroutes');
const connectDB = require('./src/config/db');
const uploadRoutes = require('./src/routes/uploadroutes');
const { signup } = require('./src/controllers/usercontroller');

// Database connection
connectDB();

// MongoDB Status Logs
mongoose.connection.on('connected', () => {
    console.log('🟢 MongoDB Connected Successfully!');
});

mongoose.connection.on('error', (err) => {
    console.log('🔴 MongoDB Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 MongoDB Disconnected');
});

// Middleware - Robust CORS allowing all web/mobile clients (Render, Vercel, Localhost, Postman)
app.use(cors({
    origin: (origin, callback) => {
        // Allow all incoming origins dynamically
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Explicit root-level POST signup route (guarantees POST /api/user/signup matches directly)
app.post('/api/user/signup', signup);
app.post('/api/user/register', signup);
app.post('/api/auth/register', signup);
app.post('/api/auth/signup', signup);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('🚀 LK Printers Backend Running');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled API error:', err);
    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
