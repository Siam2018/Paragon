
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

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

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Paragon API - Ultra Minimal Version",
        status: "working", 
        cors: "enabled",
        timestamp: new Date().toISOString(),
        version: "ultra-minimal-no-db"
    });
});

// Hardcoded endpoints to test basic functionality
app.get('/admin/Course', (req, res) => {
    res.status(200).json([
        {
            _id: "test1",
            Title: "খ ইউনিট (ব্যবসায় শিক্ষা)",
            Description: "ব্যবসায় শিক্ষা বিভাগের জন্য প্রস্তুতি",
            Price: 3000,
            ImageURL: "course1.jpg"
        },
        {
            _id: "test2", 
            Title: "গ ইউনিট (মানবিক বিভাগ)",
            Description: "মানবিক বিভাগের জন্য প্রস্তুতি",
            Price: 2500,
            ImageURL: "course2.jpg"
        }
    ]);
});

app.get('/admin/Result', (req, res) => {
    res.status(200).json([
        {
            _id: "result1",
            Title: "২০২৪ সালের ফলাফল",
            Description: "এই বছরের পরীক্ষার ফলাফল",
            ImageURL: "result1.jpg"
        }
    ]);
});

app.get('/api/gallery/random', (req, res) => {
    res.status(200).json({ 
        success: true, 
        count: 2, 
        data: [
            {
                _id: "gallery1",
                title: "ক্যাম্পাস ছবি ১",
                imageURL: "gallery1.jpg",
                isActive: true
            },
            {
                _id: "gallery2",
                title: "ক্যাম্পাস ছবি ২", 
                imageURL: "gallery2.jpg",
                isActive: true
            }
        ]
    });
});

app.get('/api/gallery', (req, res) => {
    res.status(200).json({ 
        success: true, 
        count: 3, 
        data: [
            {
                _id: "gallery1",
                title: "ক্যাম্পাস ছবি ১",
                imageURL: "gallery1.jpg",
                isActive: true
            },
            {
                _id: "gallery2",
                title: "ক্যাম্পাস ছবি ২",
                imageURL: "gallery2.jpg", 
                isActive: true
            },
            {
                _id: "gallery3",
                title: "ক্যাম্পাস ছবি ৩",
                imageURL: "gallery3.jpg",
                isActive: true
            }
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'API is working without database dependencies'
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