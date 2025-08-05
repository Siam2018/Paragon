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

// Load environment variables
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const HTTPURLFrontend = process.env.HTTPURLFrontend;

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: HTTPURLFrontend,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global JSON middleware (conditional for file uploads)
app.use((req, res, next) => {
    const isFileUploadRoute = (
        (req.path.includes('/Result') || 
         req.path.includes('/Publication') || 
         req.path.includes('/Course') || 
         req.path.includes('/Notice') || 
         req.path.includes('/Student/photo') || 
         req.path.includes('/gallery')) && 
        (req.method === 'POST' || req.method === 'PUT')
    );
    
    if (!isFileUploadRoute) {
        express.json()(req, res, next);
    } else {
        next();
    }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (request, response) => {
    return response.status(200).send("Welcome to Paragon");
});

// Routes
app.use('/auth', authRoute);
app.use('/admin', emailRoute);
app.use('/admin', publicationRoute);
app.use('/admin', resultRoute);
app.use('/admin', CourseRoute);
app.use('/admin', noticeRoute);
app.use('/admin', studentRoute);
app.use('/api/gallery', galleryRoute);

// Connect to MongoDB and start server
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        // Only start server in non-production (Vercel handles this in production)
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log('App is listening to port: ' + PORT);
            });
        }
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });

// Export for Vercel
export default app;