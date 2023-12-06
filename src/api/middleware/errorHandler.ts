import { ErrorRequestHandler, NextFunction, Response, Request } from "express";
import { HttpError } from "http-errors";
import { ValidationError } from "yup";
import { logger } from "@/utils/logger";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    logger.error({
      name: err.name,
      status: err.statusCode,
      message: err.message,
    });
    return res.status(err.status).send({ message: err.message });
  } else if (err instanceof PrismaClientKnownRequestError) {
    logger.error({ name: err.name, message: err.message });
    return res.status(500).send({
      message: "Unexpected database error, we are working on a solution",
    });
  } else if (err instanceof ValidationError) {
    logger.error({ name: err.name, message: err.message });
    return res.status(400).send({
      message: "Invalid input data",
      errors: err.errors,
    });
  }

  logger.error({ name: err.name, message: err.message });
  return res.status(500).send({
    message: "Unexpected server error, we are working on a solution",
  });
};
