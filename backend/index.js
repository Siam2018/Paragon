import express from "express"
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// Import routes
import authRoute from "./routes/AuthRouter.js"
import publicationRoute from "./routes/publicationRoute.js"
import resultRoute from "./routes/resultRoute.js"
import CourseRoute from "./routes/courseRoute.js"
import noticeRoute from "./routes/noticeRoute.js"
import studentRoute from "./routes/studentRoute.js"
import emailRoute from "./routes/emailRoute.js"
import galleryRoute from "./routes/galleryRoute.js"

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000
const mongoDBURL = process.env.mongoDBURL
const HTTPURLFrontend = process.env.HTTPURLFrontend

const app = express()

// Basic CORS setup
app.use(cors({
    origin: HTTPURLFrontend || "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Simple middleware setup
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Root route
app.get('/', (req, res) => {
    res.status(200).send("Welcome to Paragon Backend")
})

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' })
})

// Routes
try {
    app.use('/auth', authRoute)
    app.use('/admin', emailRoute)
    app.use('/admin', publicationRoute)
    app.use('/admin', resultRoute)
    app.use('/admin', CourseRoute)
    app.use('/admin', noticeRoute)
    app.use('/admin', studentRoute)
    app.use('/api/gallery', galleryRoute)
} catch (error) {
    console.error('Error setting up routes:', error)
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.originalUrl })
})

// MongoDB connection
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB')
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`)
            })
        }
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error)
    })

export default app