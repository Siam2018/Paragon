
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;

// CORS configuration for Vercel
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const connectDB = async () => {
    try {
        if (mongoDBURL) {
            await mongoose.connect(mongoDBURL);
            console.log('MongoDB Connected');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

// Connect to database
connectDB();

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Paragon API - Working Version",
        status: "working", 
        cors: "enabled",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        version: "minimal-safe"
    });
});

// Create course endpoints with direct model import
app.get('/admin/Course', async (req, res) => {
    try {
        // Import Course model directly
        const { Course } = await import('./models/coursemodel.js');
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Course error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch courses',
            message: error.message 
        });
    }
});

// Create result endpoints with direct model import
app.get('/admin/Result', async (req, res) => {
    try {
        // Import Result model directly
        const { Result } = await import('./models/resultmodel.js');
        const results = await Result.find();
        res.status(200).json(results);
    } catch (error) {
        console.error('Result error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch results',
            message: error.message 
        });
    }
});

// Create gallery endpoints with direct model import
app.get('/api/gallery/random', async (req, res) => {
    try {
        // Import Gallery model directly
        const { Gallery } = await import('./models/gallerymodel.js');
        const limit = parseInt(req.query.limit) || 6;
        const images = await Gallery.aggregate([
            { $match: { isActive: true } },
            { $sample: { size: limit } }
        ]);
        res.status(200).json({ 
            success: true, 
            count: images.length, 
            data: images 
        });
    } catch (error) {
        console.error('Gallery random error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch random gallery images',
            message: error.message 
        });
    }
});

app.get('/api/gallery', async (req, res) => {
    try {
        // Import Gallery model directly
        const { Gallery } = await import('./models/gallerymodel.js');
        const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            count: images.length, 
            data: images 
        });
    } catch (error) {
        console.error('Gallery error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch gallery images',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /admin/Course',
            'GET /admin/Result',
            'GET /api/gallery',
            'GET /api/gallery/random'
        ]
    });
});

// For Vercel serverless functions
export default app;