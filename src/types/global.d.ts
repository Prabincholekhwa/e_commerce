import { AdminRoleEnum } from '../enums';
import { Env } from '../schemas/global.schema';

export type CustomerPayload = {
  id: string;
  email: string;
  userAgent: string;
};

export type AdminPayload = {
  id: string;
  email: string;
  userAgent: string;
  role: AdminRoleEnum;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
  namespace Express {
    interface Request {
      customer?: CustomerPayload;
      admin?: AdminPayload;
    }
  }
}
