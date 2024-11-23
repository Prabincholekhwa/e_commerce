import JWT from '../../lib/jwt';
import { CustomerPayload } from '../../types/global';
import { NextFunction, Request, Response } from 'express';
import { getSecretKey } from '../../utils/helpers';

export type ValidationOptions = {
  checkUserAgent?: boolean;
  secretType?: 'access';
};

const validateCustomer =
  (opt?: {
    checkUserAgent?: boolean;
    secretKey: ValidationOptions['secretType'];
  }) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any> | void> => {
    opt = { checkUserAgent: true, secretKey: 'access', ...opt };
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token)
        return res.status(400).json({ error: 'Authorization Token Missing' });

      const decode = JWT.verify<CustomerPayload>(
        token,
        getSecretKey(opt.secretKey)
      );
      if (opt.checkUserAgent && decode.userAgent !== req.headers['user-agent'])
        throw new Error('Invalid Token');
      req.customer = decode;
      next();
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  };

export default validateCustomer;
