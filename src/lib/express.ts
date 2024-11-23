import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from '../utils/errorHandler';
import path from 'path';
import routes from '../api';

const buildExpressServer = (app: Express) => {
  app.use('/public', express.static(path.join(__dirname, '../../public')));
  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(cookieParser());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  //API's
  routes(app);

  //handle error
  app.use(errorHandler());

  const PORT: string | number = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`Server Starting: ${PORT}`));
};

export default buildExpressServer;
