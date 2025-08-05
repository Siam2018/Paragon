import express from "express"
import mongoose from 'mongoose'
import authRoute from "./routes/AuthRouter.js";
import publicationRoute from "./routes/publicationRoute.js";
import resultRoute from "./routes/resultRoute.js";
import CourseRoute from "./routes/courseRoute.js";
import noticeRoute from "./routes/noticeRoute.js";
import studentRoute from "./routes/studentRoute.js";
import emailRoute from "./routes/emailRoute.js";
import galleryRoute from "./routes/galleryRoute.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Allow all origins for now
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*']
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Paragon API v3.0", 
        timestamp: new Date().toISOString(),
        cors: "enabled" 
    });
});

// Connect to MongoDB only if not already connected
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    try {
        const mongoDBURL = process.env.mongoDBURL;
        if (!mongoDBURL) {
            throw new Error('MongoDB URL not found');
        }
        
        await mongoose.connect(mongoDBURL);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Routes - only mount after DB connection
app.use('/auth', authRoute);
app.use('/admin', emailRoute);
app.use('/admin', publicationRoute);
app.use('/admin', resultRoute);
app.use('/admin', CourseRoute);
app.use('/admin', noticeRoute);
app.use('/admin', studentRoute);
app.use('/api/gallery', galleryRoute);

// For Vercel
if (process.env.VERCEL) {
    // Connect to DB on each request in serverless
    app.use(async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch (error) {
            res.status(500).json({ error: 'Database connection failed' });
        }
    });
}

// For local development
if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(console.error);
}

export default app;