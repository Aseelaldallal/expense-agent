import express, { Express } from 'express';
import cors from 'cors';
import { createUploadRouter } from './routes/upload.routes';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // Routes
  app.use('/api/upload', createUploadRouter());

  return app;
}
