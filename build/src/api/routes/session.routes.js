"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//controllers
const session_controller_1 = require("@/controllers/session.controller");
//schema
const session_schema_1 = require("@/schemas/session.schema");
//middleware
const requireUser_1 = __importDefault(require("@/middleware/requireUser"));
const validateSchema_1 = require("@/middleware/validateSchema");
const router = express_1.default.Router();
router.post("/", (0, validateSchema_1.validateSchema)(session_schema_1.createSessionSchema), session_controller_1.createUserSessionController);
router.get("/", requireUser_1.default, session_controller_1.getUserSessionsController);
router.delete("/", requireUser_1.default, session_controller_1.deleteUserSessionController);
exports.default = router;
