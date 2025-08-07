
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
import dynamicUpload from "./Middlewares/FileUpload.js"; // This will create directories on import
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const HTTPURLFrontend = process.env.HTTPURLFrontend || 'http://localhost:5173';
const app = express();

// MongoDB connection
mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('MongoDB Connected Successfully');
        console.log('App is listening on port: ' + PORT);
    })
    .catch((error)=>{
        console.log('MongoDB connection error:', error);
    });

// Enable CORS for all routes - Railway friendly
app.use(cors({
    origin: [HTTPURLFrontend, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Serve static files from backend uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (request, response) =>{
    return response.status(200).json({
        message: "Paragon API - Railway Deployment",
        status: "working",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Apply express.json() to auth routes that need JSON parsing
app.use('/auth', express.json(), authRoute);

// Apply express.json() to admin routes except those with file uploads
app.use('/admin', (req, res, next) => {
    // Skip express.json() for file upload routes
    if ((req.path.includes('/Result') || req.path.includes('/Publication') || req.path.includes('/Course') || req.path.includes('/Notice') || req.path.includes('/Student/photo') || req.path.includes('/gallery')) && (req.method === 'POST' || req.method === 'PUT')) {
        return next();
    }
    express.json()(req, res, next);
});

app.use('/admin', emailRoute);
app.use('/admin', publicationRoute);
app.use('/admin', resultRoute);
app.use('/admin', CourseRoute);
app.use('/admin', noticeRoute);
app.use('/admin', studentRoute);

// Gallery routes (public access for viewing, admin for management)
app.use('/gallery', galleryRoute);

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// For Railway deployment
export default app;