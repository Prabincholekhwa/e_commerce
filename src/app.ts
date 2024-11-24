import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import buildExpressServer from './lib/express';
import { database } from './database/config/connection';
import { scheduleOrderReportExport } from './jobs/exportOrder';

async function main() {
  try {
    const app: Express = express();
    buildExpressServer(app);
    scheduleOrderReportExport();
    await database.connection();
    // await database.sequelize.sync({ alter: true, force: true });
  } catch (error: any) {
    console.log('err', error);
  }
}

main();
