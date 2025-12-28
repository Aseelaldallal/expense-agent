import multer from 'multer';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

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
  storage,
  fileFilter: createFileFilter(
    ['.md', '.txt', '.pdf'],
    'Only .md, .txt, and .pdf files are allowed'
  ),
  limits: { fileSize: MAX_FILE_SIZE },
});

// Expense upload configuration
export const expenseUpload = multer({
  storage,
  fileFilter: createFileFilter(
    ['.csv', '.json'],
    'Only .csv and .json files are allowed'
  ),
  limits: { fileSize: MAX_FILE_SIZE },
});
