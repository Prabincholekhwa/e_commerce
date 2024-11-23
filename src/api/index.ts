import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import customerRoutes from './customerRoutes';
import adminRoutes from './adminRoutes';

export default function routes(app: Express) {
  const router = Router();
  customerRoutes(router);
  adminRoutes(router);

  app.use('/', bodyParser.json(), router);
}
