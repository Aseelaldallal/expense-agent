import express, { Express } from 'express';
import cors from 'cors';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
