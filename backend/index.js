import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your existing routes
import authRouter from './routes/AuthRouter.js';
import courseRoute from './routes/courseRoute.js';
import emailRoute from './routes/emailRoute.js';
import galleryRoute from './routes/galleryRoute.js';
import noticeRoute from './routes/noticeRoute.js';
import publicationRoute from './routes/publicationRoute.js';
import resultRoute from './routes/resultRoute.js';
import studentRoute from './routes/studentRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const connectDB = async () => {
    try {
        if (process.env.MongoURL) {
            const conn = await mongoose.connect(process.env.MongoURL);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectDB();

// Test endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Paragon API - Full Version",
        status: "working",
        cors: "enabled",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Use your existing route files
app.use('/auth', authRouter);
app.use('/admin', courseRoute);
app.use('/admin', resultRoute);
app.use('/admin', publicationRoute);
app.use('/admin', noticeRoute);
app.use('/api/gallery', galleryRoute);
app.use('/api/email', emailRoute);
app.use('/api', studentRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
