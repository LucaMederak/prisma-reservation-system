import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "@/schemas/user.schema";
import {
  createUser,
  updateUser,
  getUser,
  validateEmail,
} from "@/services/user.service";

import createHttpError from "http-errors";
import { hashPassword } from "@/helpers/hashPassword";

export async function createUserController(
  req: Request<object, object, CreateUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const userData = req.body;
    const existingUserEmail = await validateEmail(userData.email);

    if (existingUserEmail) {
      const httpError = createHttpError(409, {
        message: "There is already a user with this email address",
      });
      return next(httpError);
    }

    const userHashedPassword = await hashPassword(userData.password);

    const user = await createUser({
      ...userData,
      emailVerified: false,
      password: userHashedPassword,
    });

    if (!user) {
      const httpError = createHttpError(500, {
        message: "A server error occurred during registration",
      });
      return next(httpError);
    }

    return res.status(201).json({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (e) {
    const httpError = createHttpError(409);
    return next(httpError);
  }
}

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.user?._id;

  try {
    const user = await getUser({ where: { id: userId } });

    if (!user) {
      const httpError = createHttpError(404);
      return next(httpError);
    }

    return res.send(user);
  } catch (e) {
    return next(e);
  }
}
