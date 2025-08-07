import express from "express"
import mongoose from 'mongoose'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
// Import all routes
import authRoute from "./routes/AuthRouter.js";
import publicationRoute from "./routes/publicationRoute.js";
import resultRoute from "./routes/resultRoute.js";
import CourseRoute from "./routes/courseRoute.js";
import noticeRoute from "./routes/noticeRoute.js";
import studentRoute from "./routes/studentRoute.js";
import emailRoute from "./routes/emailRoute.js";
import galleryRoute from "./routes/galleryRoute.js";

config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const HTTPURLFrontend = process.env.HTTPURLFrontend || 'http://localhost:5173';
const app = express();

console.log('=== STARTING PARAGON API ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

// MongoDB connection
if (mongoDBURL) {
    mongoose
        .connect(mongoDBURL)
        .then(() => {
            console.log('MongoDB Connected Successfully');
        })
        .catch((error) => {
            console.log('MongoDB connection error:', error);
        });
} else {
    console.log('No MongoDB URL provided');
}

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('CORS and middleware configured');

// Basic routes
app.get('/', (req, res) => {
    res.json({ 
        message: "Paragon API - Production Ready",
        status: "working",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// Routes
app.use('/auth', authRoute);
app.use('/admin', publicationRoute);
app.use('/admin', resultRoute);
app.use('/admin', CourseRoute);
app.use('/admin', noticeRoute);
app.use('/admin', studentRoute);
app.use('/admin', emailRoute);
app.use('/gallery', galleryRoute);

console.log('Routes configured');

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=== SERVER RUNNING ON PORT ${PORT} ===`);
});

console.log('Server setup complete');

// For Railway deployment
export default app;
