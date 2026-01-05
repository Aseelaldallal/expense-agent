import { injectable } from 'inversify';
import path from 'path';
import fs from 'fs/promises';
import type { FileCategory, FileUploadResult } from '../types/services/upload.types';
import { UPLOAD_DIRECTORIES } from '../config/paths';

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

  public async listFiles(category: FileCategory): Promise<FileUploadResult[]> {
    const dirPath = path.resolve(UPLOAD_DIRECTORIES[category]);

    const exists = await fs.access(dirPath).then(() => true).catch(() => false);
    if (!exists) return [];

    const files = await fs.readdir(dirPath);
    const results = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(dirPath, filename);
        const stats = await fs.stat(filePath);
        const id = path.basename(filename, path.extname(filename));

        return {
          id,
          filename,
          originalName: filename,
          path: filePath,
          uploadedAt: stats.mtime,
        };
      })
    );
    return results;
  }
}
