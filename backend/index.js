
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

// Environment variables
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const HTTPURLFrontend = process.env.HTTPURLFrontend;

// CORS configuration for Vercel
app.use(cors({
    origin: [
        HTTPURLFrontend,
        'https://paragon-frontend.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection with better error handling for Vercel
const connectDB = async () => {
    try {
        if (mongoDBURL) {
            const conn = await mongoose.connect(mongoDBURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } else {
            console.log('MongoDB URL not provided');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit process in serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
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
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes - Using your existing route structure
app.use('/auth', authRouter);
app.use('/admin', courseRoute);
app.use('/admin', resultRoute);
app.use('/admin', publicationRoute);
app.use('/admin', noticeRoute);
app.use('/admin', studentRoute);
app.use('/admin', emailRoute);
app.use('/api/gallery', galleryRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

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
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'POST /auth/Admin/Register',
            'POST /auth/Admin/Signin',
            'GET /admin/Course',
            'GET /admin/Result',
            'GET /admin/Publication',
            'GET /admin/Notice',
            'GET /api/gallery',
            'POST /api/Student/register',
            'POST /api/Student/login'
        ]
    });
});

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Frontend URL: ${HTTPURLFrontend}`);
        console.log(`MongoDB: ${mongoDBURL ? 'Connected' : 'Not configured'}`);
    });
}