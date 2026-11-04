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


// // 🔥 DNS fix for Windows SRV issue
// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');

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

// Middleware - Updated CORS to allow local IPs and localhost
const defaultOrigins = [
    'http://localhost:8082',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://172.25.48.1:8080',
    'http://169.254.83.107:8080'
];

const envOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or mobile apps)
        // or requests matching allowed origins or local IP network ranges (172.x, 192.x, 10.x)
        if (
            !origin || 
            allowedOrigins.includes(origin) || 
            origin.startsWith('http://172.') || 
            origin.startsWith('http://192.168.') || 
            origin.startsWith('http://10.')
        ) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use('/api/user', userRoutes);
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
        message: 'Internal Server Error'
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});