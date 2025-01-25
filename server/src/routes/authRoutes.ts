import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { csrfProtection, generateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Check if user is authenticated - no CSRF needed
router.get('/check', (req: Request, res: Response) => {
    const token = req.cookies.token;
    
    // Not logged in - return 200 with false
    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret-key-development-only');
        
        // Generate CSRF token if authenticated
        const csrfToken = generateToken(req, res);
        
        // Return 200 with true and CSRF token
        res.status(200).json({ 
            isAuthenticated: true,
            csrfToken 
        });
    } catch (error) {
        // Invalid token - return 200 with false
        res.status(200).json({ isAuthenticated: false });
    }
});

// Register endpoint - no CSRF needed since it's public
router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'jwt-secret-key-development-only',
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Generate CSRF token after successful registration
        const csrfToken = generateToken(req, res);
        res.json({ 
            message: 'Registered successfully',
            csrfToken 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint - no CSRF needed since it's public
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'jwt-secret-key-development-only',
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Generate CSRF token after successful login
        const csrfToken = generateToken(req, res);
        res.json({ 
            message: 'Logged in successfully',
            csrfToken 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint - needs CSRF protection since user is authenticated
router.post('/logout', csrfProtection, (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
});

export default router;