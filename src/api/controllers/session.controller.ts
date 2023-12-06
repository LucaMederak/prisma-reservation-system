import { Request, Response, NextFunction } from "express";
import {
  createSession,
  getSessions,
  updateSession,
} from "../services/session.service";

import { validatePassword } from "@/services/session.service";
import createHttpError from "http-errors";
import { signJwt } from "@/utils/jwt.utils";

import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@/utils/cookieOptions";
import { IUserJWT } from "@/interfaces/user.interfaces";

export async function createUserSessionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate the user's password
    const user = await validatePassword(req.body);

    if (!user) {
      const httpError = createHttpError(401, {
        message: "Invalid email or password",
      });
      return next(httpError);
    }

    // create a session
    const session = await createSession(user.id, req.get("user-agent") || "");

    if (!session) {
      const httpError = createHttpError(500, {
        message: "Session not create",
      });
      return next(httpError);
    }

    const userToJwt: IUserJWT = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      sessionId: session.id,
    };

    // create an access token
    const accessToken = signJwt(
      userToJwt,
      "accessTokenPrivateKey",
      { expiresIn: "15m" } // 15 minutes,
    );

    // create a refresh token
    const refreshToken = signJwt(userToJwt, "refreshTokenPrivateKey", {
      expiresIn: "1y",
    });

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.send({ accessToken, refreshToken });
  } catch (e) {
    return next(e);
  }
}

export async function getUserSessionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.user?._id;
    const sessions = await getSessions({
      where: { userId: userId, valid: true },
    });

    return res.send(sessions);
  } catch (e) {
    return next(e);
  }
}

export async function deleteUserSessionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionId = res.locals.user?.session;

    await updateSession({ where: { id: sessionId }, data: { valid: false } });

    res.cookie("accessToken", "", {
      maxAge: -900000, // 15 mins
      ...accessTokenCookieOptions,
    });

    res.cookie("refreshToken", "", {
      maxAge: -3.154e10, // 1 year
      ...refreshTokenCookieOptions,
    });

    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  } catch (e) {
    return next(e);
  }
}
