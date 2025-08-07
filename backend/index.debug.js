import express from "express"
import mongoose from 'mongoose'
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
        message: "Paragon API - Railway Deployment (MINIMAL TEST)",
        status: "working",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test route to verify basic functionality
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working!' });
});

// Try loading routes one by one to identify the problematic one
try {
    console.log('Loading auth routes...');
    const authRoute = await import("./routes/AuthRouter.js");
    app.use('/auth', express.json(), authRoute.default);
    console.log('Auth routes loaded successfully');
} catch (error) {
    console.error('Error loading auth routes:', error);
}

try {
    console.log('Loading course routes...');
    const CourseRoute = await import("./routes/courseRoute.js");
    app.use('/admin', express.json(), CourseRoute.default);
    console.log('Course routes loaded successfully');
} catch (error) {
    console.error('Error loading course routes:', error);
}

try {
    console.log('Loading result routes...');
    const resultRoute = await import("./routes/resultRoute.js");
    app.use('/admin', express.json(), resultRoute.default);
    console.log('Result routes loaded successfully');
} catch (error) {
    console.error('Error loading result routes:', error);
}

try {
    console.log('Loading publication routes...');
    const publicationRoute = await import("./routes/publicationRoute.js");
    app.use('/admin', express.json(), publicationRoute.default);
    console.log('Publication routes loaded successfully');
} catch (error) {
    console.error('Error loading publication routes:', error);
}

try {
    console.log('Loading notice routes...');
    const noticeRoute = await import("./routes/noticeRoute.js");
    app.use('/admin', express.json(), noticeRoute.default);
    console.log('Notice routes loaded successfully');
} catch (error) {
    console.error('Error loading notice routes:', error);
}

try {
    console.log('Loading student routes...');
    const studentRoute = await import("./routes/studentRoute.js");
    app.use('/admin', express.json(), studentRoute.default);
    console.log('Student routes loaded successfully');
} catch (error) {
    console.error('Error loading student routes:', error);
}

try {
    console.log('Loading email routes...');
    const emailRoute = await import("./routes/emailRoute.js");
    app.use('/admin', express.json(), emailRoute.default);
    console.log('Email routes loaded successfully');
} catch (error) {
    console.error('Error loading email routes:', error);
}

try {
    console.log('Loading gallery routes...');
    const galleryRoute = await import("./routes/galleryRoute.js");
    app.use('/gallery', galleryRoute.default);
    console.log('Gallery routes loaded successfully');
} catch (error) {
    console.error('Error loading gallery routes:', error);
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// For Railway deployment
export default app;
