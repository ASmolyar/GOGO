import { Router, Request, Response, NextFunction } from 'express';
import { findUserByEmail, verifyPassword } from '../services/userService.js';

const router = Router();

// Extend Express Request to include session
declare module 'express-session' {
    interface SessionData {
        user?: {
            email: string;
            firstName?: string;
            lastName?: string;
            admin: boolean;
        };
    }
}

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Set session data
        req.session.user = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            admin: user.autopromote || false,
        };

        // Save session
        req.session.save((err) => {
            if (err) {
                return next(err);
            }

            res.json({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                admin: user.autopromote || false,
            });
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/auth/logout
 * Logout and destroy session
 */
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

/**
 * GET /api/auth/me
 * Get current user from session
 */
router.get('/me', (req: Request, res: Response) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

export default router;

