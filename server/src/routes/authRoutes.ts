import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { csrfProtection, generateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '24h' });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Generate CSRF token after successful registration
        const csrfToken = generateToken(req, res);
        res.json({ 
            success: true,
            csrfToken 
        });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '24h' });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Generate CSRF token after successful login
        const csrfToken = generateToken(req, res);
        res.json({ 
            success: true,
            csrfToken 
        });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

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

// Logout endpoint
router.post('/logout', csrfProtection, (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
});

export default router;