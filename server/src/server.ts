import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie-secret-development-only'));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : 'http://localhost:5173',
    credentials: true
}));

// Auth routes (unprotected)
app.use('/api/auth', authRoutes);

// Protected API Routes - CSRF is applied per-route in taskRoutes
app.use('/api/tasks', authMiddleware, taskRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});