import { Request, Response, NextFunction } from 'express';

export function handleMulterError(err: Error, _req: Request, res: Response, next: NextFunction) {
  if (err) {
    if (err.message === 'Only .md, .txt, and .pdf files are allowed') {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err.message.includes('File too large')) {
      res.status(400).json({ error: 'File too large. Maximum size is 5MB' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }
  next();
}
