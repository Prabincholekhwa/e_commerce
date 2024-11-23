import JWT from '../../lib/jwt';
import { AdminPayload } from '../../types/global';
import { NextFunction, Request, Response } from 'express';
import { getSecretKey } from '../../utils/helpers';
import { ValidationOptions } from './validateCustomer';
import { AdminRoleEnum } from '../../enums';

const validateAdmin =
  (opt?: {
    checkUserAgent?: boolean;
    secretKey?: ValidationOptions['secretType'];
    onlySuperAdmin?: Boolean;
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

      const decode = JWT.verify<AdminPayload>(
        token,
        getSecretKey(opt.secretKey)
      );
      if (opt.checkUserAgent && decode.userAgent !== req.headers['user-agent'])
        throw new Error('Invalid Token');
      if (opt.onlySuperAdmin) {
        if (decode.role !== AdminRoleEnum.superAdmin) {
          throw new Error('Unauthorized');
        }
      }
      req.admin = decode;
      next();
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  };

export default validateAdmin;
