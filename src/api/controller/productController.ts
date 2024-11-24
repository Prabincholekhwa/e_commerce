import { Request, Response, NextFunction } from 'express';
import { formatResponseData } from '../../utils/helpers';
import { fileDirectory } from '../middlewares/fileUploader';
import { processCsvFile } from '../../utils/helpers';
import path from 'path';

export const productController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('Products csv is require');
      console.log('fileName', req.file.filename);
      const filePath = path.join(fileDirectory, req.file.filename);
      const data = await processCsvFile(filePath);
      console.log('datas', data);

      res
        .status(200)
        .json(formatResponseData(true, 'Products Created  Successfully'));
    } catch (err) {
      next(err);
    }
  },
};
