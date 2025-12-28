import 'reflect-metadata';
import { Container } from 'inversify';
import { TOKENS } from './injection-tokens';
import { UploadService } from '../services/upload.service';
import { ExpenseCsvService } from '../services/expense-csv.service';
import { UploadController } from '../controllers/upload.controller';

let container: Container | null = null;

export async function initializeContainer(): Promise<Container> {
  container = new Container();

  // Services
  container.bind<UploadService>(TOKENS.UploadService).to(UploadService).inSingletonScope();
  container.bind<ExpenseCsvService>(TOKENS.ExpenseCsvService).to(ExpenseCsvService).inSingletonScope();

  // Controllers
  container.bind<UploadController>(TOKENS.UploadController).to(UploadController).inSingletonScope();

  return container;
}

export function getContainer(): Container {
  if (!container) {
    throw new Error('Container not initialized. Call initializeContainer() first.');
  }
  return container;
}
