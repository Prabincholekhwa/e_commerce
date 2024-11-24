import crypto from 'crypto';
import { ValidationOptions } from '../api/middlewares/validateCustomer';
import fs from 'fs';
import csv from 'csv-parser';
import { ProductInterface } from '../database/interfaces';

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

export async function processCsvFile(
  filePath: string
): Promise<ProductInterface[]> {
  let results: ProductInterface[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Convert stock and price to numbers
        const convertedData = {
          ...data,
          stock: Number(data.stock), // Convert stock to a number
          price: Number(data.price), // Convert price to a number
        };
        results.push(convertedData);
      })
      .on('end', () => {
        console.log('CSV processing completed');
        resolve(results);
      })
      .on('error', (err) => {
        console.log('Error reading CSV file', err);
        reject(err);
      });
  });
}
