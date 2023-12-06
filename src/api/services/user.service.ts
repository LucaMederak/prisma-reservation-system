import { logger } from "@/utils/logger";
import { prismaClient } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export async function createUser(input: Prisma.UserCreateInput) {
  const metricsLabels = {
    operation: "createUser",
  };

  try {
    const result = await prismaClient.user.create({ data: input });
    logger.info({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function getUser(query: Prisma.UserFindFirstArgs) {
  const metricsLabels = {
    operation: "getUser",
  };

  try {
    const user = await prismaClient.user.findFirst({ ...query });
    logger.info({ ...metricsLabels, success: "true" });

    return user;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function updateUser(args: Prisma.UserUpdateArgs) {
  const metricsLabels = {
    operation: "updateUser",
  };

  try {
    const result = prismaClient.user.update(args);

    logger.info({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function deleteUser(args: Prisma.UserDeleteArgs) {
  const metricsLabels = {
    operation: "deleteUser",
  };

  try {
    const result = prismaClient.user.delete(args);

    logger.info({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    logger.error({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function validateEmail(email: string) {
  const existingUser = await prismaClient.user.findFirst({ where: { email } });

  if (existingUser) {
    return true;
  }

  return false;
}

export async function comparePassword(
  userId: number,
  candidatePassword: string
) {
  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    return false;
  }

  return await bcrypt
    .compare(candidatePassword, user.password)
    .catch(() => false);
}
