import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Import and use controllers directly instead of routes to avoid path-to-regexp issues
import CourseController from './Controllers/CourseController.js';
import GalleryController from './Controllers/GalleryController.js';
import ResultController from './Controllers/ResultController.js';

// Course endpoints
app.get('/admin/Course', CourseController.getAllCourses);
app.get('/admin/Course/:id', CourseController.getCourseById);

// Gallery endpoints
app.get('/api/gallery', GalleryController.getAllGalleryImages);
app.get('/api/gallery/random', GalleryController.getRandomGalleryImages);
app.get('/api/gallery/:id', GalleryController.getGalleryImageById);

// Results endpoints
app.get('/admin/Result', ResultController.getAllResults);
app.get('/admin/Result/:id', ResultController.getResultById);

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
