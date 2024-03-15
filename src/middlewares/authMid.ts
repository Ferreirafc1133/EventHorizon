import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

declare module 'express-serve-static-core' {
    interface Request {
        session: session.Session & Partial<session.SessionData> & { userId?: string };
    }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}
