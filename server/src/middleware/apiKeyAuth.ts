import { Request, Response, NextFunction } from 'express';

// Very simple API key middleware for admin endpoints.
// Set ADMIN_API_KEY in the server environment and send it via X-API-Key header.
export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_API_KEY not set' });
  }

  const provided = req.header('x-api-key');
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}


