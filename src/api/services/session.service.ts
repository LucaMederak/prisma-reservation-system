// import { get } from "lodash";
// import { FilterQuery, UpdateQuery } from "mongoose";
// import UserModel from "@models/user.model";
// import SessionModel from "@models/session.model";
// import { ISessionDocument } from "@interfaces/session.interfaces";
// import { verifyJwt, signJwt } from "@utils/jwt.utils";
// import { getUser } from "./user.service";
// import { omit } from "lodash";
// import { logger } from "@utils/logger";

import { IUserJWT } from "@/interfaces/user.interfaces";
import { signJwt, verifyJwt } from "@/utils/jwt.utils";
import { logger } from "@/utils/logger";
import { prismaClient } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { get, omit } from "lodash";
import { comparePassword, getUser } from "./user.service";

export async function createSession(userId: number, userAgent: string) {
  const metricsLabels = {
    operation: "createSession",
  };

  try {
    const session = await prismaClient.session.create({
      data: { userId, userAgent, valid: true },
    });
    logger.info({ ...metricsLabels, success: "true" });
    return session;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });
    return null;
  }
}

export async function getSessions(args: Prisma.SessionFindManyArgs) {
  const metricsLabels = {
    operation: "getSessions",
  };

  try {
    const sessions = await prismaClient.session.findMany(args);
    logger.info({ ...metricsLabels, success: "true" });

    return sessions;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function getSession(args: Prisma.SessionFindFirstArgs) {
  const metricsLabels = {
    operation: "getSession",
  };

  try {
    const session = await prismaClient.session.findFirst(args);
    logger.info({ ...metricsLabels, success: "true" });

    return session;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function deleteSession(args: Prisma.SessionDeleteArgs) {
  const metricsLabels = {
    operation: "deleteSession",
  };

  try {
    const session = await prismaClient.session.delete(args);
    logger.info({ ...metricsLabels, success: "true" });
    return session;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function updateSession(args: Prisma.SessionUpdateArgs) {
  return prismaClient.session.update(args);
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    return false;
  }

  const isValid = await comparePassword(user.id, password);

  if (!isValid) return false;

  return omit(user, "password");
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");

  if (!decoded || !get(decoded, "session")) return false;

  const session = await prismaClient.session.findUnique({
    where: { id: get(decoded, "session") },
  });

  if (!session || !session.valid) return false;

  const user = await getUser({ where: { id: session.userId } });

  if (!user) return false;

  const userToJwt: IUserJWT = {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    sessionId: session.id,
  };

  const accessToken = signJwt(
    userToJwt,
    "accessTokenPrivateKey",
    { expiresIn: "15m" } // 15 minutes
  );

  return accessToken;
}
