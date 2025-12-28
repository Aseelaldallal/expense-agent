import { injectable, inject } from 'inversify';
import type { Request, Response } from 'express';
import { TOKENS } from '../container';
import { UploadService } from '../services/upload.service';
import { ExpenseCsvService } from '../services/expense-csv.service';
import type { FileCategory } from '../types/services/upload.types';

@injectable()
export class UploadController {
  constructor(
    @inject(TOKENS.UploadService) private readonly uploadService: UploadService,
    @inject(TOKENS.ExpenseCsvService) private readonly expenseCsvService: ExpenseCsvService
  ) {}

  public async uploadPolicy(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;

      if (!file || !file.buffer) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const result = await this.uploadService.saveFile(file.buffer, file.originalname, 'policy');
      res.status(201).json(result);
    } catch (error) {
      console.error('Error uploading policy:', error);
      res.status(500).json({ error: 'Failed to upload policy' });
    }
  }

  public async uploadExpense(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;

      if (!file || !file.buffer) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      this.expenseCsvService.parse(file.buffer.toString());
      const result = await this.uploadService.saveFile(file.buffer, file.originalname, 'expense');
      res.status(201).json(result);
    } catch (error) {
      console.error('Error uploading expense:', error);
      const message = error instanceof Error ? error.message : 'Failed to upload expense';
      res.status(400).json({ error: message });
    }
  }

  public async deleteFile(
    _req: Request,
    res: Response,
    category: FileCategory
  ): Promise<void> {
    try {
      await this.uploadService.clearFiles(category);
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting ${category} files:`, error);
      res.status(500).json({ error: `Failed to delete ${category} files` });
    }
  }
}
