import { Router, Request, Response } from 'express';
import { getContainer, TOKENS } from '../container';
import { UploadController } from '../controllers/upload.controller';
import { policyUpload, expenseUpload } from '../middleware/upload';
import { handleMulterError } from '../middleware/error-handler';

export function createUploadRouter(): Router {
  const router = Router();
  const uploadController = getContainer().get<UploadController>(TOKENS.UploadController);

  router.post(
    '/policy',
    policyUpload.single('file'),
    handleMulterError,
    (req: Request, res: Response) => uploadController.uploadFile(req, res)
  );

  router.post(
    '/expense',
    expenseUpload.single('file'),
    handleMulterError,
    (req: Request, res: Response) => uploadController.uploadFile(req, res)
  );

  return router;
}
