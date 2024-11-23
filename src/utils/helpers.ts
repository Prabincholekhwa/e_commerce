import crypto from 'crypto';
import { ValidationOptions } from '../api/middlewares/validateCustomer';

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
