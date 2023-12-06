"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenCookieOptions = exports.accessTokenCookieOptions = void 0;
exports.accessTokenCookieOptions = {
    maxAge: 900000,
    httpOnly: true,
    domain: process.env.NODE_ENV === "dev"
        ? "localhost"
        : process.env.APPLICATION_DOMAIN,
    path: "/",
    sameSite: "none",
    secure: true,
};
exports.refreshTokenCookieOptions = Object.assign(Object.assign({}, exports.accessTokenCookieOptions), { maxAge: 3.154e10 });
