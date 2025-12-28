import multer from 'multer';
import path from 'path';
import fs from 'fs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createStorage = (uploadDir: string, filenamePrefix: string): multer.StorageEngine => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `${filenamePrefix}-${timestamp}${ext}`);
    },
  });
};

const createFileFilter = (
  allowedExtensions: string[],
  errorMessage: string
): multer.Options['fileFilter'] => {
  return (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(errorMessage));
    }
  };
};

// Policy upload configuration
export const policyUpload = multer({
  storage: createStorage('uploads/policies', 'policy'),
  fileFilter: createFileFilter(
    ['.md', '.txt', '.pdf'],
    'Only .md, .txt, and .pdf files are allowed'
  ),
  limits: { fileSize: MAX_FILE_SIZE },
});

// Expense upload configuration
export const expenseUpload = multer({
  storage: createStorage('uploads/expenses', 'expense'),
  fileFilter: createFileFilter(
    ['.csv', '.json'],
    'Only .csv and .json files are allowed'
  ),
  limits: { fileSize: MAX_FILE_SIZE },
});
