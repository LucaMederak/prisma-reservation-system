"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        const httpError = (0, http_errors_1.default)(403, { message: 'Forbidden' });
        return next(httpError);
    }
    return next();
};
exports.default = requireUser;
