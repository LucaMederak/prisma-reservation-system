import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

export const validateSchema = (validationSchema: yup.AnyObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, query, params } = req;

      await validationSchema.validate(
        { body, query, params },
        { abortEarly: false }
      );
      next();
    } catch (error) {
      next(error);
    }
  };
};
