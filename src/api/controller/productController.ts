import { Request, Response, NextFunction } from 'express';
import { formatResponseData } from '../../utils/helpers';
import { fileDirectory } from '../middlewares/fileUploader';
import { processCsvFile } from '../../utils/helpers';
import path from 'path';
import productService from '../../services/productService';

export const productController = {
  async parseCsvAddUpdateProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) throw new Error('Products csv is require');
      const filePath = path.join(fileDirectory, req.file.filename);
      const data = await processCsvFile(filePath);
      const response = await productService.addProduct(data);
      res
        .status(200)
        .json(
          formatResponseData(true, response, 'Products Created  Successfully')
        );
    } catch (err) {
      next(err);
    }
  },
};
