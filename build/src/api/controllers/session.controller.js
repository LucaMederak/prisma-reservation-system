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
exports.deleteUserSessionController = exports.getUserSessionsController = exports.createUserSessionController = void 0;
const session_service_1 = require("../services/session.service");
const session_service_2 = require("@/services/session.service");
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_utils_1 = require("@/utils/jwt.utils");
const cookieOptions_1 = require("@/utils/cookieOptions");
function createUserSessionController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate the user's password
            const user = yield (0, session_service_2.validatePassword)(req.body);
            if (!user) {
                const httpError = (0, http_errors_1.default)(401, {
                    message: "Invalid email or password",
                });
                return next(httpError);
            }
            // create a session
            const session = yield (0, session_service_1.createSession)(user.id, req.get("user-agent") || "");
            if (!session) {
                const httpError = (0, http_errors_1.default)(500, {
                    message: "Session not create",
                });
                return next(httpError);
            }
            const userToJwt = {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                sessionId: session.id,
            };
            // create an access token
            const accessToken = (0, jwt_utils_1.signJwt)(userToJwt, "accessTokenPrivateKey", { expiresIn: "15m" } // 15 minutes,
            );
            // create a refresh token
            const refreshToken = (0, jwt_utils_1.signJwt)(userToJwt, "refreshTokenPrivateKey", {
                expiresIn: "1y",
            });
            res.cookie("accessToken", accessToken, cookieOptions_1.accessTokenCookieOptions);
            res.cookie("refreshToken", refreshToken, cookieOptions_1.refreshTokenCookieOptions);
            return res.send({ accessToken, refreshToken });
        }
        catch (e) {
            return next(e);
        }
    });
}
exports.createUserSessionController = createUserSessionController;
function getUserSessionsController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a._id;
            const sessions = yield (0, session_service_1.getSessions)({
                where: { userId: userId, valid: true },
            });
            return res.send(sessions);
        }
        catch (e) {
            return next(e);
        }
    });
}
exports.getUserSessionsController = getUserSessionsController;
function deleteUserSessionController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.session;
            yield (0, session_service_1.updateSession)({ where: { id: sessionId }, data: { valid: false } });
            res.cookie("accessToken", "", Object.assign({ maxAge: -900000 }, cookieOptions_1.accessTokenCookieOptions));
            res.cookie("refreshToken", "", Object.assign({ maxAge: -3.154e10 }, cookieOptions_1.refreshTokenCookieOptions));
            return res.send({
                accessToken: null,
                refreshToken: null,
            });
        }
        catch (e) {
            return next(e);
        }
    });
}
exports.deleteUserSessionController = deleteUserSessionController;
