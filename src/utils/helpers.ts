import crypto from 'crypto';
import { ValidationOptions } from '../api/middlewares/validateCustomer';
import fs from 'fs';
import csv from 'csv-parser';
import { ProductInterface } from '../database/interfaces';
import { orderRepository } from '../database/repositories/orderRepository';
import { PaymentStatusEnum } from '../enums';
import path from 'path';
import { parse } from 'json2csv';

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

export async function exportOrders() {
  try {
    const exportFileDirectory = path.join(__dirname, '../../public/reports');

    const now = new Date();
    const from_date_time = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    ).toISOString();

    const to_date_time = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    ).toISOString();

    const data = await orderRepository.find({
      payment_status: PaymentStatusEnum.paid,
      from_date_time,
      to_date_time,
    });

    if (!data.rows || data.rows.length === 0) {
      console.log('No data to export.');
      return;
    }
    const fileName = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}${String(now.getDate()).padStart(2, '0')}-report.csv`;
    const filePath = path.join(exportFileDirectory, fileName);

    const csv = parse(data.rows, {
      fields: [
        'order_id',
        'customer_name',
        'total_price',
        'order_date',
        'payment_status',
        'quantity',
      ],
    });

    if (!fs.existsSync(exportFileDirectory)) {
      fs.mkdirSync(exportFileDirectory, { recursive: true });
    }
    fs.writeFileSync(filePath, csv);
    console.log(`Report exported successfully: ${filePath}`);
  } catch (err) {
    console.log('err', err);
    console.error('Error exporting report:', err);
    throw err;
  }
}
