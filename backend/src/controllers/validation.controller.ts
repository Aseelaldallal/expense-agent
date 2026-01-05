import { injectable, inject } from 'inversify';
import type { Request, Response } from 'express';
import fs from 'fs/promises';
import { TOKENS } from '../container';
import { UploadService } from '../services/upload.service';
import { ValidationPipelineService } from '../services/validation-pipeline.service';

@injectable()
export class ValidationController {
  constructor(
    @inject(TOKENS.UploadService) private readonly uploadService: UploadService,
    @inject(TOKENS.ValidationPipelineService)
    private readonly pipelineService: ValidationPipelineService
  ) {}

  public async validate(_req: Request, res: Response): Promise<void> {
    try {
      const [policyFiles, expenseFiles] = await Promise.all([
        this.uploadService.listFiles('policy'),
        this.uploadService.listFiles('expense'),
      ]);

      if (policyFiles.length === 0) {
        res.status(400).json({ error: 'No policy file uploaded' });
        return;
      }

      if (expenseFiles.length === 0) {
        res.status(400).json({ error: 'No expense file uploaded' });
        return;
      }

      const [policyContent, expenseContent] = await Promise.all([
        fs.readFile(policyFiles[0].path, 'utf-8'),
        fs.readFile(expenseFiles[0].path, 'utf-8'),
      ]);

      const result = await this.pipelineService.run(policyContent, expenseContent);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error running validation:', error);
      const message = error instanceof Error ? error.message : 'Validation failed';
      res.status(500).json({ error: message });
    }
  }
}
