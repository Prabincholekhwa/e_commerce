import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { generateRandomHex } from '../../utils/helpers';

export const fileDirectory = path.join(__dirname, '../../../public/file');

const ensureImageDirectoryExists = () => {
  if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(fileDirectory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureImageDirectoryExists();
    cb(null, fileDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateRandomHex(16);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueName}${extension}`);
  },
});

const createUpload = (fieldName: string) =>
  multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }).single(fieldName);

export const uploadFileMiddleware =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    const upload = createUpload(fieldName);
    upload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        console.log('errrsss', err);
        if (err.message == 'Unexpected field')
          return res.status(400).send({
            success: false,
            message: `Expected file key name to be ${fieldName} ,But Received ${err.field} as key name!`,
          });
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
      return;
    });
  };

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`File deleted successfully: ${filePath}`);
    }
  });
};
