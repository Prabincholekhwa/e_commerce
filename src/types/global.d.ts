import { Env } from '../schemas/global.schema';

export type CustomerPayload = {
  id: string;
  email: string;
  userAgent: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
  namespace Express {
    interface Request {
      customer?: CustomerPayload;
    }
  }
}
