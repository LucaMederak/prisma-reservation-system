"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.validateEmail = exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const logger_1 = require("@/utils/logger");
const prisma_1 = require("@/utils/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "createUser",
        };
        try {
            const result = yield prisma_1.prismaClient.user.create({ data: input });
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return result;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.createUser = createUser;
function getUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "getUser",
        };
        try {
            const user = yield prisma_1.prismaClient.user.findFirst(Object.assign({}, query));
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return user;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.getUser = getUser;
function updateUser(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "updateUser",
        };
        try {
            const result = prisma_1.prismaClient.user.update(args);
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return result;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const metricsLabels = {
            operation: "deleteUser",
        };
        try {
            const result = prisma_1.prismaClient.user.delete(args);
            logger_1.logger.info(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
            return result;
        }
        catch (e) {
            logger_1.logger.error(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
            throw e;
        }
    });
}
exports.deleteUser = deleteUser;
function validateEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield prisma_1.prismaClient.user.findFirst({ where: { email } });
        if (existingUser) {
            return true;
        }
        return false;
    });
}
exports.validateEmail = validateEmail;
function comparePassword(userId, candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) {
            return false;
        }
        return yield bcrypt_1.default
            .compare(candidatePassword, user.password)
            .catch(() => false);
    });
}
exports.comparePassword = comparePassword;
