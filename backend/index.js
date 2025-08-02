
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

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const HTTPURLFrontend = process.env.HTTPURLFrontend;
const app = express();

// Connect to MongoDB (non-blocking for serverless)
if (mongoDBURL) {
    mongoose
        .connect(mongoDBURL)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.log('MongoDB connection error:', error);
        });
} else {
    console.warn('MongoDB URL not provided');
}


// Enable CORS for all routes
app.use(cors({
    origin: [HTTPURLFrontend, 'https://paragon-4urr.vercel.app'], // Add your frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Serve static files from backend uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (request, response) =>{
    console.log(request);
    return response.status(234).send("Welcome to Paragon");
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
app.use('/api/gallery', galleryRoute);

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log('App is listening to port: ' + PORT);
    });
}

// Export for Vercel
export default app;