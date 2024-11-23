import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import customerRoutes from './customerRoutes';

export default function routes(app: Express) {
  const router = Router();
  customerRoutes(router);

  app.use('/', bodyParser.json(), router);
}
