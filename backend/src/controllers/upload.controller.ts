import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TOKENS } from '../container';
import { UploadService } from '../services/upload.service';

@injectable()
export class UploadController {
  constructor(@inject(TOKENS.UploadService) private readonly uploadService: UploadService) {}

  async uploadPolicy(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const result = this.uploadService.savePolicy(file);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error uploading policy:', error);
      res.status(500).json({ error: 'Failed to upload policy' });
    }
  }
}
