import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*']
}));

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Paragon API Emergency Version",
        status: "working",
        cors: "enabled",
        timestamp: new Date().toISOString()
    });
});

// Emergency course endpoint
app.get('/admin/Course', (req, res) => {
    res.json([{
        _id: "test",
        Title: "Test Course",
        Description: "Emergency test data",
        Price: 0
    }]);
});

// Emergency gallery endpoint
app.get('/api/gallery/random', (req, res) => {
    res.json({
        success: true,
        count: 1,
        data: [{
            _id: "test",
            title: "Test Gallery",
            imageURL: "test.jpg",
            isActive: true
        }]
    });
});

// Emergency results endpoint
app.get('/admin/Result', (req, res) => {
    res.json([{
        _id: "test",
        title: "Test Result",
        description: "Emergency test data"
    }]);
});

export default app;
