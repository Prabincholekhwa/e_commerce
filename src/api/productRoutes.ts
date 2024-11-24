import { Router } from 'express';
import { uploadFileMiddleware } from './middlewares/fileUploader';
import { productController } from './controller/productController';
import validateAdmin from './middlewares/validateAdmin';

export default function productRoutes(router: Router) {
  router
    .post(
      '/products',
      validateAdmin(),
      uploadFileMiddleware('csv'),
      productController.parseCsvAddUpdateProducts
    )
    .get('/products', productController.getAllProducts);
}
