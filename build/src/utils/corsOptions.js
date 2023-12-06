"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: [],
};
if (process.env.NODE_ENV === "dev") {
    exports.corsOptions.origin.push("http://localhost:3000");
}
