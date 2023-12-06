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
exports.getUserController = exports.createUserController = void 0;
const user_service_1 = require("@/services/user.service");
const http_errors_1 = __importDefault(require("http-errors"));
const hashPassword_1 = require("@/helpers/hashPassword");
function createUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = req.body;
            const existingUserEmail = yield (0, user_service_1.validateEmail)(userData.email);
            if (existingUserEmail) {
                const httpError = (0, http_errors_1.default)(409, {
                    message: "There is already a user with this email address",
                });
                return next(httpError);
            }
            const userHashedPassword = yield (0, hashPassword_1.hashPassword)(userData.password);
            const user = yield (0, user_service_1.createUser)(Object.assign(Object.assign({}, userData), { emailVerified: false, password: userHashedPassword }));
            if (!user) {
                const httpError = (0, http_errors_1.default)(500, {
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
        }
        catch (e) {
            const httpError = (0, http_errors_1.default)(409);
            return next(httpError);
        }
    });
}
exports.createUserController = createUserController;
function getUserController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a._id;
        try {
            const user = yield (0, user_service_1.getUser)({ where: { id: userId } });
            if (!user) {
                const httpError = (0, http_errors_1.default)(404);
                return next(httpError);
            }
            return res.send(user);
        }
        catch (e) {
            return next(e);
        }
    });
}
exports.getUserController = getUserController;
