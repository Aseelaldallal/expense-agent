import { injectable } from 'inversify';
import path from 'path';
import { FileUploadResult } from '../types';

@injectable()
export class UploadService {
  public saveFile(file: Express.Multer.File): FileUploadResult {
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
