import { injectable } from 'inversify';
import path from 'path';
import fs from 'fs/promises';
import type { FileCategory, FileUploadResult } from '../types/services/upload.types';

const UPLOAD_DIRECTORIES: Record<FileCategory, string> = {
  policy: 'uploads/policies',
  expense: 'uploads/expenses',
};

@injectable()
export class UploadService {
  public async saveFile(
    buffer: Buffer,
    originalName: string,
    category: FileCategory
  ): Promise<FileUploadResult> {
    const directory = UPLOAD_DIRECTORIES[category];
    const dirPath = path.resolve(directory);

    await fs.mkdir(dirPath, { recursive: true });

    const ext = path.extname(originalName);
    const id = `${category}-${Date.now()}`;
    const filename = `${id}${ext}`;
    const filePath = path.join(dirPath, filename);

    await fs.writeFile(filePath, buffer);

    return {
      id,
      filename,
      originalName,
      path: filePath,
      uploadedAt: new Date(),
    };
  }

  public async clearFiles(category: FileCategory): Promise<void> {
    const dirPath = path.resolve(UPLOAD_DIRECTORIES[category]);
    const files = await fs.readdir(dirPath);
    await Promise.all(files.map((file) => fs.unlink(path.join(dirPath, file))));
  }
}
