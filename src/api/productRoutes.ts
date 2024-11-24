import { Router } from 'express';
import { uploadFileMiddleware } from './middlewares/fileUploader';
import { productController } from './controller/productController';

export default function productRoutes(router: Router) {
  router.post(
    '/products',
    uploadFileMiddleware('csv'),
    productController.create
  );
}
