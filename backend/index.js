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

// Enable CORS for all routes
app.use(cors({
    origin: HTTPURLFrontend,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global JSON parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from backend uploads directory
if (process.env.VERCEL) {
    // For Vercel deployment, serve from /tmp (note: files won't persist)
    app.use('/uploads', express.static('/tmp'));
} else {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

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
        app.listen(PORT, () => {
            console.log('App is listening to port: ' + PORT);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });

// Export for Vercel
export default app;