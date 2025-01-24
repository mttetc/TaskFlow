import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthRequest } from '../types/index.js';
import { doubleCsrf } from 'csrf-csrf';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Initialize CSRF protection with csrf-csrf
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'csrf-secret-key-development-only',
  cookieName: isDevelopment ? 'csrf-token' : '__Host-csrf-token', // Use Host prefix in production
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: !isDevelopment,
  },
  size: 64,
  getTokenFromRequest: (req) => {
    const token = req.headers['csrf-token'];
    return Array.isArray(token) ? token[0] : token;
  },
});

// CSRF protection middleware
const csrfProtection = doubleCsrfProtection;

const authMiddleware = (req: Request & AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Export both middleware functions and CSRF token generator
export { csrfProtection, generateToken };

export default authMiddleware;