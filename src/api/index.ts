import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import customerRoutes from './customerRoutes';
import adminRoutes from './adminRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';

export default function routes(app: Express) {
  const router = Router();
  customerRoutes(router);
  adminRoutes(router);
  productRoutes(router);
  orderRoutes(router);
  app.use('/', bodyParser.json(), router);
}
