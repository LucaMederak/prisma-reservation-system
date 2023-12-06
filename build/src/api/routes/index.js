"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user.routes"));
const session_routes_1 = __importDefault(require("./session.routes"));
const errorHandler_1 = require("@/middleware/errorHandler");
const routes = (app) => {
    app.get("/api/healthCheck", (req, res) => {
        res.sendStatus(200);
    });
    app.use("/api/user", user_routes_1.default);
    app.use("/api/sessions", session_routes_1.default);
    app.use(errorHandler_1.errorHandler);
};
exports.default = routes;
