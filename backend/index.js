
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
const HTTPURLFrontend = process.env.HTTPURLFrontend;

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
        message: "Paragon API - Production Version",
        status: "working",
        cors: "enabled",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        routes: [
            'GET /',
            'GET /admin/Course',
            'GET /admin/Result', 
            'GET /api/gallery/random'
        ]
    });
});

// Import controllers directly to avoid route file issues
const createCourseEndpoints = async () => {
    try {
        const { default: CourseController } = await import('./Controllers/CourseController.js');
        
        app.get('/admin/Course', async (req, res) => {
            try {
                await CourseController.getAllCourses(req, res);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        app.get('/admin/Course/:id', async (req, res) => {
            try {
                await CourseController.getCourseById(req, res);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        console.log('Course endpoints created');
    } catch (error) {
        console.error('Error creating course endpoints:', error);
    }
};

const createResultEndpoints = async () => {
    try {
        const { default: ResultController } = await import('./Controllers/ResultController.js');
        
        app.get('/admin/Result', async (req, res) => {
            try {
                await ResultController.getAllResults(req, res);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        console.log('Result endpoints created');
    } catch (error) {
        console.error('Error creating result endpoints:', error);
    }
};

const createGalleryEndpoints = async () => {
    try {
        const GalleryController = await import('./Controllers/GalleryController.js');
        
        app.get('/api/gallery/random', async (req, res) => {
            try {
                await GalleryController.getRandomGalleryImages(req, res);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        app.get('/api/gallery', async (req, res) => {
            try {
                await GalleryController.getAllGalleryImages(req, res);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        console.log('Gallery endpoints created');
    } catch (error) {
        console.error('Error creating gallery endpoints:', error);
    }
};

// Create endpoints
createCourseEndpoints();
createResultEndpoints();
createGalleryEndpoints();

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
    console.error('Error:', err);
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
        message: `Route ${req.originalUrl} not found`
    });
});

// For Vercel serverless functions
export default app;