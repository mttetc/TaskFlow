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
    console.log('CSRF Headers:', {
      all: req.headers,
      csrfToken: req.headers['csrf-token'],
      cookies: req.cookies
    });
    const token = req.headers['csrf-token'];
    return Array.isArray(token) ? token[0] : token;
  },
});

// Custom CSRF protection middleware with logging
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  console.log('CSRF Protection Middleware:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    cookies: req.cookies
  });

  try {
    doubleCsrfProtection(req, res, (err: any) => {
      if (err) {
        console.error('CSRF Protection Error:', err);
        return res.status(403).json({ error: 'CSRF validation failed', details: err.message });
      }
      next();
    });
  } catch (error) {
    console.error('CSRF Protection Exception:', error);
    return res.status(403).json({ error: 'CSRF validation failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

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

// Export all middleware functions and CSRF token generator
export { csrfProtection, generateToken, authMiddleware };

export default authMiddleware;