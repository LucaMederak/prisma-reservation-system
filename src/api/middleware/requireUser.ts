import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    const httpError = createHttpError(403, { message: 'Forbidden' });
    return next(httpError);
  }

  return next();
};

export default requireUser;
