"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = (payload, res, message) => {
    return res.status(200).json({
        message: message || "Success",
        payload
    });
};
exports.success = success;
const error = (message, res, status) => {
    return res.status(400 || status).json({
        message: message,
    });
};
exports.error = error;
