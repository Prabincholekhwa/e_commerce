import { NextFunction, Response, Request } from 'express';
import { z, ZodTypeAny } from 'zod';

export default class ZOD {
  static parse = <T>(
    schema: z.ZodObject<any, 'strip', z.ZodTypeAny, object, object>,
    data: T
  ) => schema.parse(data);

  static requestAsyncParser =
    (...args: { schema: ZodTypeAny; type: 'Body' | 'Params' | 'Query' }[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        for (const item of args) {
          if (item.type === 'Body') {
            const response = await item.schema.safeParseAsync(req.body);

            if (response.success) {
              req.body = response.data;
              continue;
            }

            return res
              .status(400)
              .send({ success: false, data: response.error.issues });
          }
          if (item.type === 'Params') {
            const response = await item.schema.safeParseAsync(req.params);
            if (response.success) {
              req.params = response.data;
              continue;
            }

            return res
              .status(400)
              .send({ success: false, data: response.error.issues });
          }
          if (item.type === 'Query') {
            const response = await item.schema.safeParseAsync(req.query);
            if (response.success) {
              req.query = response.data;
              continue;
            }

            return res
              .status(400)
              .send({ success: false, data: response.error.issues });
          }
        }

        next();
      } catch (error) {
        throw error;
      }
    };
}
