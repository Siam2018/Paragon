import express from "express"
import mongoose from 'mongoose'
import cors from 'cors';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.mongoDBURL;
const HTTPURLFrontend = process.env.HTTPURLFrontend || 'http://localhost:5173';
const app = express();

console.log('=== STARTING PARAGON API ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

// MongoDB connection
if (mongoDBURL) {
    mongoose
        .connect(mongoDBURL)
        .then(() => {
            console.log('MongoDB Connected Successfully');
        })
        .catch((error) => {
            console.log('MongoDB connection error:', error);
        });
} else {
    console.log('No MongoDB URL provided');
}

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('CORS configured');

// Basic routes
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.json({ 
        message: "Paragon API - Minimal Test Version",
        status: "working",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    console.log('Health check accessed');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

console.log('Routes configured');

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=== SERVER RUNNING ON PORT ${PORT} ===`);
});

console.log('Server setup complete');

// For Railway deployment
export default app;
