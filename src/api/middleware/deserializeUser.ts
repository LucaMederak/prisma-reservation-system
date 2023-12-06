import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "@/utils/jwt.utils";
import { reIssueAccessToken } from "@/services/session.service";
import { accessTokenCookieOptions } from "@/utils/cookieOptions";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (accessToken) {
    const { decoded } = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }
  }

  if (refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (!newAccessToken) {
      return next();
    }

    res.setHeader("x-access-token", newAccessToken);

    res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

    const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
