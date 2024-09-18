"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class BaseRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    // This method should be overridden by child classes
    initializeRoutes() {
        throw new Error('Method not implemented.');
    }
    // Common error handler middleware
    handleErrors(err, req, res, next) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
    // A utility method to send responses (optional)
    sendResponse(res, data, statusCode = 200) {
        res.status(statusCode).json(data);
    }
}
exports.default = BaseRouter;
