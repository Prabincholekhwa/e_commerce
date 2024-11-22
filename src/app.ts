import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import buildExpressServer from './lib/express';

async function main() {
  try {
    const app: Express = express();
    buildExpressServer(app);
  } catch (error: any) {
    console.log('err', error);
  }
}

main();
