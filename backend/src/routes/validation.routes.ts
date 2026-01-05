import { Router, Request, Response } from 'express';
import { getContainer, TOKENS } from '../container';
import { ValidationController } from '../controllers/validation.controller';

export function createValidationRouter(): Router {
  const router = Router();
  const validationController = getContainer().get<ValidationController>(TOKENS.ValidationController);

  router.post('/', (req: Request, res: Response) => validationController.validate(req, res));

  return router;
}
