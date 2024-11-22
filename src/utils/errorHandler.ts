import { NextFunction, Request, Response } from 'express';

const errorHandler = () => {
  return async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.level === 'Critical') {
      console.log('Error', err.message);
      res.status(500).send({ success: false, error: 'Internal Server Error' });
    } else {
      res
        .status(400)
        .send({ success: false, error: err.message ? err.message : err });
    }
  };
};
export default errorHandler;
