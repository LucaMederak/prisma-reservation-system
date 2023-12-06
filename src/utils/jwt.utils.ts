import jwt from "jsonwebtoken";
import { logger } from "./logger";

const getPrivateKey = (
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey"
) => {
  if (keyName === "accessTokenPrivateKey") {
    return process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
  }

  return process.env.REFRESH_PRIVATE_KEY as string;
};

const getPublicKey = (
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) => {
  if (keyName === "accessTokenPublicKey") {
    return process.env.ACCESS_TOKEN_PUBLIC_KEY as string;
  }

  return process.env.REFRESH_PUBLIC_KEY as string;
};

export function signJwt(
  object: object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions
) {
  const signingKey = Buffer.from(getPrivateKey(keyName), "base64").toString(
    "ascii"
  );

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
  const publicKey = Buffer.from(getPublicKey(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: unknown) {
    if (e instanceof jwt.JsonWebTokenError) {
      logger.error(e.message);
      return {
        valid: false,
        expired: e.message === "jwt expired",
        decoded: null,
      };
    }
    logger.error(e);
    return {
      valid: false,
      expired: false,
      decoded: null,
    };
  }
}
