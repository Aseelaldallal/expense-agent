import { injectable } from 'inversify';
import path from 'path';

export interface PolicyUploadResult {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  uploadedAt: Date;
}

@injectable()
export class UploadService {
  public savePolicy(file: Express.Multer.File): PolicyUploadResult {
    const filename = file.filename;
    const id = path.basename(filename, path.extname(filename));

    return {
      id,
      filename,
      originalName: file.originalname,
      path: file.path,
      uploadedAt: new Date(),
    };
  }
}
