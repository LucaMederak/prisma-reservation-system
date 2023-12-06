"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_errors_1 = require("http-errors");
const yup_1 = require("yup");
const logger_1 = require("@/utils/logger");
const library_1 = require("@prisma/client/runtime/library");
const errorHandler = (err, req, res, next) => {
    if (err instanceof http_errors_1.HttpError) {
        logger_1.logger.error({
            name: err.name,
            status: err.statusCode,
            message: err.message,
        });
        return res.status(err.status).send({ message: err.message });
    }
    else if (err instanceof library_1.PrismaClientKnownRequestError) {
        logger_1.logger.error({ name: err.name, message: err.message });
        return res.status(500).send({
            message: "Unexpected database error, we are working on a solution",
        });
    }
    else if (err instanceof yup_1.ValidationError) {
        logger_1.logger.error({ name: err.name, message: err.message });
        return res.status(400).send({
            message: "Invalid input data",
            errors: err.errors,
        });
    }
    logger_1.logger.error({ name: err.name, message: err.message });
    return res.status(500).send({
        message: "Unexpected server error, we are working on a solution",
    });
};
exports.errorHandler = errorHandler;
