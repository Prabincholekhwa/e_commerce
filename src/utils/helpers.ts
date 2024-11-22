import crypto from 'crypto';

export const generateRandomHex = (num: number = 8): string => {
  return crypto.randomBytes(num).toString('hex');
};
