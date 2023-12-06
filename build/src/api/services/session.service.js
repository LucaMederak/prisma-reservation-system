"use strict";
// import { get } from "lodash";
// import { FilterQuery, UpdateQuery } from "mongoose";
// import UserModel from "@models/user.model";
// import SessionModel from "@models/session.model";
// import { ISessionDocument } from "@interfaces/session.interfaces";
// import { verifyJwt, signJwt } from "@utils/jwt.utils";
// import { getUser } from "./user.service";
// import { omit } from "lodash";
// import { logger } from "@utils/logger";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reIssueAccessToken = exports.validatePassword = exports.updateSession = exports.deleteSession = exports.getSession = exports.getSessions = exports.createSession = void 0;
const jwt_utils_1 = require("@/utils/jwt.utils");
const logger_1 = require("@/utils/logger");
const prisma_1 = require("@/utils/prisma");
const lodash_1 = require("lodash");
const user_service_1 = require("./user.service");
function createSession(userId, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "createSession",
        };
        try {
            const session = yield prisma_1.prismaClient.session.create({
                data: { userId, userAgent, valid: true },
            });
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return session;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            return null;
        }
    });
}
exports.createSession = createSession;
function getSessions(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "getSessions",
        };
        try {
            const sessions = yield prisma_1.prismaClient.session.findMany(args);
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return sessions;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.getSessions = getSessions;
function getSession(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "getSession",
        };
        try {
            const session = yield prisma_1.prismaClient.session.findFirst(args);
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return session;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.getSession = getSession;
function deleteSession(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "deleteSession",
        };
        try {
            const session = yield prisma_1.prismaClient.session.delete(args);
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return session;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.deleteSession = deleteSession;
function updateSession(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prismaClient.session.update(args);
    });
}
exports.updateSession = updateSession;
function validatePassword({ email, password, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            return false;
        }
        const isValid = yield (0, user_service_1.comparePassword)(user.id, password);
        if (!isValid)
            return false;
        return (0, lodash_1.omit)(user, "password");
    });
}
exports.validatePassword = validatePassword;
function reIssueAccessToken({ refreshToken, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { decoded } = (0, jwt_utils_1.verifyJwt)(refreshToken, "refreshTokenPublicKey");
        if (!decoded || !(0, lodash_1.get)(decoded, "session"))
            return false;
        const session = yield prisma_1.prismaClient.session.findUnique({
            where: { id: (0, lodash_1.get)(decoded, "session") },
        });
        if (!session || !session.valid)
            return false;
        const user = yield (0, user_service_1.getUser)({ where: { id: session.userId } });
        if (!user)
            return false;
        const userToJwt = {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            sessionId: session.id,
        };
        const accessToken = (0, jwt_utils_1.signJwt)(userToJwt, "accessTokenPrivateKey", { expiresIn: "15m" } // 15 minutes
        );
        return accessToken;
    });
}
exports.reIssueAccessToken = reIssueAccessToken;
