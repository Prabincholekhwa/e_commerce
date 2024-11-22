import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from '../utils/errorHandler';
import path from 'path';

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

  app.use(errorHandler());

  const PORT: string | number = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`Server Starting: ${PORT}`));
};

export default buildExpressServer;
