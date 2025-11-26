import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    email: string;
  }
}

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Nicht authentifiziert' });
  }

  req.userId = req.session.userId;
  req.userEmail = req.session.email;
  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userEmail = req.session.email;
  }
  next();
}
