import type { FileCategory } from '../types/services/upload.types';

export const UPLOAD_DIRECTORIES: Record<FileCategory, string> = {
  policy: 'uploads/policies',
  expense: 'uploads/expenses',
};
