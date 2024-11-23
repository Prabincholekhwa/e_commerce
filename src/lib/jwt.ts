import jwt from 'jsonwebtoken';
import { SERVICE_NAME } from '../constants';

type Token = {
  data: object;
  secretKey: string;
  exp?: string | number;
};

export default class JWT {
  static sign({ data, exp, secretKey }: Token): string {
    try {
      const expire = exp ? { expiresIn: exp } : undefined;
      const Token: string = jwt.sign(
        { ...data, iss: SERVICE_NAME },
        secretKey,
        expire
      );

      return Token;
    } catch (error) {
      throw error;
    }
  }
  static verify<T>(token: string, secretKey: string): T {
    try {
      const decode = jwt.verify(token, secretKey, { complete: true });
      if (decode.header?.alg === 'none')
        throw new Error('Insecure token algorithm');
      if (typeof decode.payload === 'string')
        throw new Error('Provided payload is invalid');
      if (decode.payload.iss !== SERVICE_NAME)
        throw new Error('Issuer is invalid');
      return decode.payload as unknown as T;
    } catch (error) {
      throw error;
    }
  }
}
