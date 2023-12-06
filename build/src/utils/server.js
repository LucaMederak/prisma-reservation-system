"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("@/routes/."));
const express_1 = __importDefault(require("express"));
const deserializeUser_1 = __importDefault(require("@/middleware/deserializeUser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsOptions_1 = require("./corsOptions");
const createServer = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: corsOptions_1.corsOptions.origin,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(deserializeUser_1.default);
    (0, _1.default)(app);
    return app;
};
exports.default = createServer;
