import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import buildExpressServer from './lib/express';
import { database } from './database/config/connection';

async function main() {
  try {
    const app: Express = express();
    buildExpressServer(app);
    await database.connection();
  } catch (error: any) {
    console.log('err', error);
  }
}

main();
