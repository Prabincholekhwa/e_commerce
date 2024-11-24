import crypto from 'crypto';
import { ValidationOptions } from '../api/middlewares/validateCustomer';
import fs from 'fs';
import csv from 'csv-parser';

export const generateRandomHex = (num: number = 8): string => {
  return crypto.randomBytes(num).toString('hex');
};

export function formatResponseData(
  result: boolean,
  data?: any,
  message?: string
) {
  return {
    success: result,
    data,
    message: message ?? 'Request fulfilled successfully',
  };
}

export function getSecretKey(val?: ValidationOptions['secretType']) {
  switch (val) {
    case 'access':
      return process.env.ACCESS_SECRET_KEY!;
    default:
      return process.env.ACCESS_SECRET_KEY!;
  }
}

export async function processCsvFile(filePath: string) {
  const results: any = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log('csv processing completed');
        resolve(results);
      })
      .on('error', (err) => {
        console.log('Error reading CSV file', err);
        reject(err);
      });
  });
}
